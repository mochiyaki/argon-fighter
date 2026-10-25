// Autonomous AI Combat Bot for Argon Fighter.
// Provides high-performance, real-time tactical decision making for autonomous play
// and seamless hot-swapping between Human and AI control during gameplay and pause.

import * as THREE from 'three';
import { ST, KIND, wrap } from '../crowd/crowd.js';
import { emit } from './events.js';

export const BOT_STYLES = [
  { id: 'aggressive', name: 'Aggressive Brawler', desc: 'Relentless offense, high-tier charge sweeps & instant Musou' },
  { id: 'tactical', name: 'Tactical Specialist', desc: 'Prioritizes officers/bosses, precision dodges & stun combos' },
  { id: 'evasive', name: 'Hit & Run Hunter', desc: 'Frequent evasive rolls, wide cleaves, defensive Musou triggers' },
  { id: 'balanced', name: 'Championship Pro', desc: 'Balanced adaptation to crowd density and boss threat levels' },
];

export const botState = {
  enabled: false,
  styleIndex: 0,
  get style() { return BOT_STYLES[this.styleIndex]; },
  tactic: 'Idle',
  targetName: 'None',
  targetDist: 0,
  enemiesNear: 0,
  comboCount: 0,
  lastToggleFrame: 0,
  toggle(force) {
    if (force !== undefined) this.enabled = force;
    else this.enabled = !this.enabled;
    emit('bot:modeChanged', { enabled: this.enabled, style: this.style });
    return this.enabled;
  },
  cycleStyle(dir = 1) {
    this.styleIndex = (this.styleIndex + dir + BOT_STYLES.length) % BOT_STYLES.length;
    emit('bot:styleChanged', { style: this.style });
    return this.style;
  }
};

// Internal bot memory & rhythm trackers
let comboPlan = 'n6'; // target combo branch
let attackCooldown = 0;
let dodgeCooldown = 0;
let lastTargetIdx = -1;

/**
 * Creates the combat bot controller.
 * @param {object} game The game simulation state
 */
export function createCombatBot(game) {
  return {
    /**
     * Samples the bot inputs based on current game state.
     * @param {object} humanInp The human input object (used when bot is disabled)
     * @returns {object} The chosen input object
     */
    sample(humanInp) {
      if (!botState.enabled) {
        botState.tactic = 'Manual (Human)';
        return humanInp;
      }

      const h = game.hero;
      if (!h || h.dead) {
        botState.tactic = 'Hero Down';
        return humanInp;
      }

      const inp = {
        mx: 0,
        my: 0,
        orbit: 0,
        tilt: 0,
        pressed: { attack: false, charge: false, jump: false, dodge: false, musou: false, target: false },
        held: { attack: false, charge: false, jump: false, dodge: false, musou: false, target: false }
      };

      const c = game.crowd;
      if (!c) return inp;

      const style = botState.style.id;

      // 1. Perception: scan all active enemies
      let nearestDist = 9999;
      let nearestIdx = -1;
      let bossIdx = -1;
      let bossDist = 9999;
      let immediateThreat = false;
      let threatDist = 9999;
      let threatIdx = -1;
      let enemiesIn5m = 0;
      let clusterX = 0;
      let clusterZ = 0;
      let clusterWeight = 0;

      const N = c.N || c.grunts;
      for (let i = 0; i < N; i++) {
        const state = c.st[i];
        if (state === ST.OFF || state === ST.DEAD) continue;

        const ex = c.x[i];
        const ez = c.z[i];
        const d = Math.hypot(ex - h.x, ez - h.z);

        if (d < 5.5) enemiesIn5m++;

        // Track closest enemy
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }

        // Track officer or boss
        const isOff = (c.type && c.type[i] === 1) || (c.boss && c.boss[i] > 0);
        if (isOff && d < bossDist && d < 28) {
          bossDist = d;
          bossIdx = i;
        }

        // Detect telegraphed enemy strike winding up in danger zone
        const winding = (c.wind && c.wind[i] > 0) || state === ST.ATTACK;
        if (winding && d < 3.2 && d < threatDist) {
          immediateThreat = true;
          threatDist = d;
          threatIdx = i;
        }

        // Accumulate center of crowd cluster within 16m
        if (d < 16) {
          const w = 1 / Math.max(1, d);
          clusterX += ex * w;
          clusterZ += ez * w;
          clusterWeight += w;
        }
      }

      botState.enemiesNear = enemiesIn5m;
      botState.comboCount = h.combo || 0;

      // 2. Determine Primary Target
      let targetIdx = nearestIdx;
      let targetDist = nearestDist;
      let isBossTarget = false;

      // If style is tactical or balanced, prioritize nearby bosses/officers
      if (bossIdx !== -1 && (style === 'tactical' || style === 'balanced' || bossDist < 8)) {
        targetIdx = bossIdx;
        targetDist = bossDist;
        isBossTarget = true;
      }

      let tx = h.x;
      let tz = h.z;

      if (targetIdx !== -1) {
        tx = c.x[targetIdx];
        tz = c.z[targetIdx];
        const offName = (c.offName && targetIdx >= c.grunts) ? c.offName[targetIdx - c.grunts] : null;
        if (offName) {
          botState.targetName = `${offName.en || offName.zh || 'Officer'}`;
        } else if (c.kind && c.kind[targetIdx] === KIND.CAPTAIN) {
          botState.targetName = 'Wei Captain';
        } else if (c.kind && c.kind[targetIdx] === KIND.BEARER) {
          botState.targetName = 'Standard-Bearer';
        } else {
          botState.targetName = enemiesIn5m > 3 ? `Crowd (${enemiesIn5m} grunts)` : 'Wei Grunt';
        }
        botState.targetDist = Math.round(targetDist * 10) / 10;
      } else {
        botState.targetName = 'Searching Sector...';
        botState.targetDist = 0;
      }

      // 3. Evasive Reflexes vs Telegraphed Attacks
      if (dodgeCooldown > 0) dodgeCooldown--;
      if (attackCooldown > 0) attackCooldown--;

      const canDodge = dodgeCooldown === 0 && h.grounded && h.state !== 'dodge' && h.iframes <= 0;
      const dodgeChance = style === 'evasive' ? 0.95 : style === 'tactical' ? 0.85 : 0.65;

      if (immediateThreat && canDodge && Math.random() < dodgeChance) {
        // Dodge sideways or away from the attacker
        inp.pressed.dodge = true;
        inp.held.dodge = true;
        dodgeCooldown = 26; // frames
        botState.tactic = 'Evading Strike!';

        // Direct dodge away from threat
        if (threatIdx !== -1) {
          const awayAngle = Math.atan2(h.x - c.x[threatIdx], h.z - c.z[threatIdx]);
          const camYaw = game.cam.yaw;
          const worldDx = Math.sin(awayAngle);
          const worldDz = Math.cos(awayAngle);
          inp.my = worldDx * Math.sin(camYaw) + worldDz * Math.cos(camYaw);
          inp.mx = -worldDx * Math.cos(camYaw) + worldDz * Math.sin(camYaw);
        }
        return inp;
      }

      // 4. Overclock (Musou) Decider
      const musouReady = game.musou && game.musou.ready && game.musou.ready();
      if (musouReady && h.grounded && h.state !== 'hurt' && h.state !== 'musou') {
        const hpPercent = h.hp / h.hpMax;
        const crowdThreshold = style === 'aggressive' ? 3 : 5;
        const lowHealthPanic = hpPercent < 0.35;
        const bossFinisher = isBossTarget && targetDist < 6.5;
        const crowdSweep = enemiesIn5m >= crowdThreshold;

        if (lowHealthPanic || bossFinisher || crowdSweep) {
          inp.pressed.musou = true;
          inp.held.musou = true;
          botState.tactic = 'OVERCLOCK MUSOU UNLEASHED!';
          return inp;
        }
      }

      // 5. Target Navigation & Positioning
      let desireMove = false;
      let moveAngle = h.yaw;

      if (targetIdx !== -1) {
        const dx = tx - h.x;
        const dz = tz - h.z;
        const targetAngle = Math.atan2(dx, dz);

        // Smooth camera tracking
        const yawDiff = wrap(targetAngle - game.cam.yaw);
        inp.orbit = THREE.MathUtils.clamp(yawDiff * 0.1, -0.045, 0.045);

        // Range management
        const engageRange = (h.state === 'run' ? 3.8 : 2.4);

        if (targetDist > engageRange) {
          // Move towards target
          desireMove = true;
          moveAngle = targetAngle;
          botState.tactic = targetDist > 8 ? 'Closing Distance' : 'Engaging Target';
        } else if (targetDist < 1.0 && h.state !== 'attack') {
          // Space slightly if too clipped
          desireMove = true;
          moveAngle = targetAngle + Math.PI * 0.5; // Circle flank
          botState.tactic = 'Flanking Target';
        } else {
          // In combat range
          botState.tactic = isBossTarget ? 'Duelling Officer' : 'Clearing Crowd';
        }
      } else {
        // No immediate targets, seek forward or center
        botState.tactic = 'Patrolling Warehouse';
      }

      // Translate move angle to camera-relative mx, my
      if (desireMove) {
        const camYaw = game.cam.yaw;
        const worldDx = Math.sin(moveAngle);
        const worldDz = Math.cos(moveAngle);
        inp.my = worldDx * Math.sin(camYaw) + worldDz * Math.cos(camYaw);
        inp.mx = -worldDx * Math.cos(camYaw) + worldDz * Math.sin(camYaw);
      }

      // 6. Combat Strings & Finishers
      if (targetDist <= 4.2 || h.state === 'attack' || h.state === 'run') {
        const move = h.move;

        // If currently running at full speed and close enough, execute Dash Attack
        if (h.state === 'run' && h.runT >= 12 && targetDist <= 4.5) {
          inp.pressed.attack = true;
          inp.held.attack = true;
          botState.tactic = 'Dash Slash!';
          return inp;
        }

        // If airborne, perform air string
        if (h.state === 'jump') {
          inp.pressed.attack = true;
          inp.held.attack = true;
          botState.tactic = 'Aerial Dive Attack';
          return inp;
        }

        // Combo chain intelligence
        if (!move) {
          // Pick fresh combo strategy
          if (enemiesIn5m >= 4 || style === 'aggressive') {
            comboPlan = Math.random() < 0.6 ? 'c4' : 'c6'; // C4 is 360 cleave, C6 is finisher
          } else if (isBossTarget || style === 'tactical') {
            comboPlan = Math.random() < 0.5 ? 'c2' : 'c3'; // C2 launches, C3 stuns
          } else {
            comboPlan = 'c4';
          }

          inp.pressed.attack = true;
          inp.held.attack = true;
          botState.tactic = 'Starting Combo';
        } else {
          // Already in a move, check progression
          const m = h.kit && h.kit.moves && h.kit.moves[move];
          const isNormal = move.startsWith('n');
          const normalNum = isNormal ? parseInt(move[1], 10) : 0;

          // Branch into Charge finisher when planned
          let shouldCharge = false;
          if (comboPlan === 'c1' && normalNum === 0) shouldCharge = true;
          else if (comboPlan === 'c2' && normalNum === 1) shouldCharge = true;
          else if (comboPlan === 'c3' && normalNum === 2) shouldCharge = true;
          else if (comboPlan === 'c4' && normalNum === 3) shouldCharge = true;
          else if (comboPlan === 'c5' && normalNum === 4) shouldCharge = true;
          else if (comboPlan === 'c6' && normalNum === 5) shouldCharge = true;

          if (shouldCharge) {
            inp.pressed.charge = true;
            inp.held.charge = true;
            botState.tactic = `Executing ${comboPlan.toUpperCase()} Finisher`;
          } else if (isNormal && normalNum < 6) {
            inp.pressed.attack = true;
            inp.held.attack = true;
            botState.tactic = `Combo N${normalNum + 1}`;
          } else if (!isNormal && m && h.moveT >= m.cancel - 4) {
            // Finisher ending, immediately prepare next strike or roll
            if (enemiesIn5m > 5 && canDodge) {
              inp.pressed.dodge = true;
              inp.held.dodge = true;
              dodgeCooldown = 20;
            } else {
              inp.pressed.attack = true;
            }
          }
        }
      }

      return inp;
    }
  };
}
