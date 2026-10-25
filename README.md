<div align="center">

# ⚡ ARGON FIGHTER — WAREHOUSE CHAMPIONSHIP ⚡
### *A 3D Voxel Crowd-Brawler Built on Gemini 4 Argon*

[![AI Studio App](https://img.shields.io/badge/AI%20Studio-Live%20App-00e5ff?style=for-the-badge&logo=google)](https://ai.studio/apps/d4f392d8-5a30-461a-8254-7d5e25dede78)
[![Gemini 4 Argon](https://img.shields.io/badge/Gemini%204%20Argon-SOTA%20Video%20%26%203D-46ff8a?style=for-the-badge&logo=googlegemini)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/#workingharder)
[![Three.js](https://img.shields.io/badge/Three.js-r186-ff3ea8?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-bd34fe?style=for-the-badge&logo=vite)](https://vitejs.dev/)

<p align="center">
  <b>1,000 Hackers · 4 Legendary Fighters · 1 Mainframe Core · 60 Hz Voxel Combat</b><br>
  <i>Featuring real-time multi-agent crowd physics, Overclock Musou finishers, procedural Web Audio SFX, and an autonomous multi-heuristic AI Combat Bot.</i>
</p>

---

</div>

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Addressing Problem Statement Two: More Dimensions](#-addressing-problem-statement-two-more-dimensions)
   - [The Challenge: Beyond the First Draft](#the-challenge-beyond-the-first-draft)
   - [The Closed Feedback Loop: Render → Watch → Critique → Fix](#the-closed-feedback-loop-render--watch--critique--fix)
   - [Multimodal Video Critic & Autonomous Iteration](#multimodal-video-critic--autonomous-iteration)
3. [AI & ML Systems in Argon Fighter](#-ai--ml-systems-in-argon-fighter)
   - [Autonomous AI Combat Bot](#autonomous-ai-combat-bot)
   - [Tactical Combat Profiles](#tactical-combat-profiles)
   - [Live Telemetry & Hot-Swappable Control](#live-telemetry--hot-swappable-control)
   - [Server-Side Gemini API Integration](#server-side-gemini-api-integration)
4. [Playable Fighters](#-playable-fighters)
5. [Combat Mechanics & Game Feel](#-combat-mechanics--game-feel)
6. [Core Technical Architecture](#-core-technical-architecture)
   - [Deterministic 60 Hz Simulation Loop](#deterministic-60-hz-simulation-loop)
   - [High-Density Voxel Crowd Engine](#high-density-voxel-crowd-engine)
   - [Camera Occlusion & Spring Rig](#camera-occlusion--spring-rig)
   - [Procedural Audio Synthesis](#procedural-audio-synthesis)
7. [Controls & Hotkeys](#-controls--hotkeys)
8. [Getting Started & Local Development](#-getting-started--local-development)
9. [Project Structure](#-project-structure)

---

## 🎮 Overview

**Argon Fighter — Warehouse Championship** is a high-octane 3D voxel crowd-brawler (Musou-style action game) set in an underground cyberpunk warehouse tournament. Players clash against hordes of hundreds of rival hackers and towering officer bosses inside the Mainframe Core, chaining normal attacks into dynamic charge finishers, executing aerial launches and juggles, and triggering screen-shattering **Overclock Musou** cinematic ultimates.

The game is engineered from the ground up to showcase the frontier capabilities of **Gemini 4 Argon** in code generation, 3D procedural simulation, real-time tactical AI decision-making, and closed-loop multimodal self-critique.

---

## 🌌 Addressing Problem Statement Two: More Dimensions

> **Problem Statement Two:**
> *"Gemini 4 Argon is also SOTA on [long video understanding](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/#workingharder), and its output window lets it generate high-fidelity [3D games and procedural worlds](https://aistudio.google.com/learn/building-3d-games-and-worlds-with-gemini-4-argon) in a single pass. A single pass is only the first draft. Build a system that renders what it made, watches the result, critiques it against the goal, and fixes it in a loop."*

### The Challenge: Beyond the First Draft

While Gemini 4 Argon's massive output context window allows complete, complex 3D environments, character rigs, and animation systems to be synthesized in a single generative pass, **a single pass is only the first draft**. 

Real-time 3D action games with dense crowd simulations introduce complex emergent phenomena that cannot be verified purely through static code analysis:
- **Kinematic & Visual Glitches:** Mesh clipping during rapid combo transitions, camera clipping through environment obstacles, or foot slippage during animations.
- **Combat Balance & Pacing:** Infinite juggle loops, unescapable boss stun locks, uneven crowd density distribution, or excessive hitstop duration that dampens combat fluidity.
- **Game Feel & Readability:** Disorienting camera pans during multi-target combat, lack of visual contrast in particle effects, or poor telegraphing of enemy attacks.

### The Closed Feedback Loop: Render → Watch → Critique → Fix

To address **Problem Statement Two**, Argon Fighter implements an architecture designed around a closed-loop iterative pipeline where the AI generates, renders, watches, critiques, and refines the interactive simulation:

```
                  ┌──────────────────────────────────────────────┐
                  │              GEMINI 4 ARGON                  │
                  │   Single-Pass 3D World & System Generator    │
                  └──────────────────────┬───────────────────────┘
                                         │ Initial Code / Asset Draft
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                 1. RENDER                    │
                  │    • 60 Hz Three.js Deterministic Engine     │
                  │    • Voxel Meshes, Kinematics & Shaders      │
                  │    • Dynamic 300-2000 Agent Crowd Sim        │
                  │    • Autonomous AI Combat Bot Playtesting    │
                  └──────────────────────┬───────────────────────┘
                                         │ Gameplay Stream / Canvas Video
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                 2. WATCH                     │
                  │  • Gemini 4 Argon Long Video Understanding   │
                  │  • Ingests continuous canvas video feeds     │
                  │  • Correlates frames with real-time logs     │
                  └──────────────────────┬───────────────────────┘
                                         │ Multi-Second Temporal Context
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                3. CRITIQUE                   │
                  │  • Evaluates game feel against design goals  │
                  │  • Assesses camera readability & clipping    │
                  │  • Identifies infinite loops & pacing drops  │
                  │  • Benchmarks hitstop, recoil, & boss aggro  │
                  └──────────────────────┬───────────────────────┘
                                         │ Targeted Parameter & Code Diffs
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │                  4. FIX                      │
                  │  • Surgical adjustments to moves.js / rig.js │
                  │  • Camera spring & occlusion re-tuning       │
                  │  • AI Combat Bot tactical parameter updates  │
                  │  • Hot-reloads in Vite without game reset    │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         └───────► (Repeats Loop)
```

### Multimodal Video Critic & Autonomous Iteration

1. **Render (Simulation & Execution):**
   The browser executes the Three.js WebGL simulation at a fixed 60 Hz timestep. An internal **Autonomous AI Combat Bot** playtests the game across diverse fighters, difficulty tiers, and combat encounters without human intervention.
2. **Watch (Long Video Understanding):**
   Leveraging Gemini 4 Argon's state-of-the-art capability in [long video understanding](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/#workingharder), continuous gameplay video streams captured directly from the canvas (along with synchronized combat telemetry, frame-rate graphs, and state events) are passed to the model. Gemini 4 Argon analyzes multi-minute sequences with zero temporal loss.
3. **Critique (Evaluating Against the Goal):**
   The model evaluates the visual footage against core game design heuristics:
   - *Impact Feel:* Are hits landing with satisfying visual weight, screen micro-kicks, and appropriately scaled hitstop (1–4 frames)?
   - *Spatial Readability:* Does the dynamic camera maintain proper framing over dense 300+ enemy clusters without losing sight of the player?
   - *Combat Balance:* Are charge finishers incentivized over basic light-attack button mashing? Are boss officers presenting telegraphed, dodgeable threat windows?
4. **Fix (Code & Physics Mutation):**
   The critique translates directly into surgical code and parameter adjustments in `src/combat/combat.js`, `src/camera/camera.js`, `src/hero/moves.js`, and `src/core/bot.js`. Vite's fast reload immediately applies the modifications, completing the self-correcting development loop.

---

## 🤖 AI & ML Systems in Argon Fighter

### Autonomous AI Combat Bot
Built into the core simulation (`src/core/bot.js`), the **AI Combat Bot** provides complete autonomous auto-play capabilities. It transforms the game into a self-running benchmark and demonstration environment, capable of completing entire championships autonomously or acting as an adaptive co-pilot.

The bot employs a multi-tiered spatial perception and tactical planning pipeline:
- **Threat Perimeter Scanning:** Computes Euclidean distances to every active enemy across the 300–2,000 unit crowd in real-time.
- **Telegraph Detection:** Identifies enemy wind-up animations (`wind > 0` or `ST.ATTACK`) and triggers evasive dodge rolls with directional roll-cancels.
- **Dynamic Branch Planning:** Selects combo strings (`N1` through `N6`, branching into `C1`–`C6` finishers) based on nearby enemy cluster density and officer presence.
- **Overclock Optimization:** Intelligently triggers Musou finishers when enemy density exceeds threshold clusters or when boss officers enter vulnerability phases.

### Tactical Combat Profiles

Players and observers can cycle through **4 AI Combat Bot Styles** on the fly:

| Bot Style | Tactical Behavior | Best Used For |
| :--- | :--- | :--- |
| **Aggressive Brawler** | Relentless forward offense, high-tier charge sweep finishers, and immediate Musou Overclock activation upon filling gauge segments. | High-speed crowd clearing and speedrunning. |
| **Tactical Specialist** | Aggro prioritization on high-threat officers and bosses, frame-perfect reactive dodging, and launcher/stun juggling. | Boss encounters and high-difficulty survival. |
| **Hit & Run Hunter** | Spacing maintenance, frequent roll-cancels, wide-cleave kiting, and defensive Musou conservation. | Safe, low-damage attrition playstyles. |
| **Championship Pro** | Adaptive switching between crowd sweeping and officer duel focus, dynamically adjusting to live health and morale metrics. | Optimal tournament-grade competitive play. |

### Live Telemetry & Hot-Swappable Control
- **Instant Hot-Swapping:** Switch between **Manual (Human)** and **Auto-Play (AI)** seamlessly at any microsecond during combat by tapping <kbd>B</kbd> or through the pause menu (<kbd>Esc</kbd>).
- **HUD Telemetry Overlay:** When the AI Combat Bot is engaged, a real-time HUD telemetry ribbon projects the current tactic (e.g., `Officer Duel (Brian)`, `Crowd Sweep (8 nearby)`, `Evasive Roll`), target distance, and active combat style.

### Server-Side Gemini API Integration
Configured with `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` in `metadata.json` and backed by the `@google/genai` SDK, Argon Fighter is architected for server-side dialogue generation, dynamic combat narration, and runtime parameter refinement via Gemini endpoints.

---

## 🥋 Playable Fighters

Argon Fighter features four distinct playable characters, each with bespoke voxel geometry, custom rigs, unique movesets, and high-impact Overclock Musou finishers:

### 1. Adam — "The Broadcaster"
* *Tagline:* "Loud, fast, and always on air."
* *Weapon:* Microphone Stand & Combat Drone
* *Playstyle:* Mid-to-long range crowd sweeper. Swings his microphone stand to stagger wide enemy ranks, unleashes sonic screams that stun targets from 5 meters out, and calls down automated drone strafing runs.
* *Overclock Musou — Sonic Boom:* Three concussive sonic screams, an automated drone carpet-strafe, followed by a seismic mic drop that flattens the battlefield.
* *Stats:* Attack: ★★★★☆ | Defense: ★★★☆☆ | Speed: ★★★☆☆ | Range: ★★★★★

### 2. Ana — "The Influencer"
* *Tagline:* "Every hit goes viral."
* *Weapon:* Dual-Wield Smartphone & Laptop
* *Playstyle:* Ultra-fast melee rushdown. Executes rapid-fire strikes every third of a second, dashing through enemy formations with blinding speed and high-mobility flip kicks.
* *Overclock Musou — Viral Storm:* Six rapid cross-cuts, an escalating cyclone that pulls in surrounding enemies, and a viral data burst finish.
* *Stats:* Attack: ★★★☆☆ | Defense: ★★☆☆☆ | Speed: ★★★★★ | Range: ★★★☆☆

### 3. Brian — "The Roadie"
* *Tagline:* "Heavy load, heavy hits."
* *Weapon:* Heavy Server Cart & Strobe Camera
* *Playstyle:* Heavy tank and crowd plow. Hauls a massive server rack cart that knocks aside dense crowd clusters, using blinding camera flash strobes to stagger entire lanes simultaneously.
* *Overclock Musou — Rush Hour:* Three blinding strobe bursts that freeze the crowd, an unstoppable cart ride through the enemy formation, followed by a devastating server slam.
* *Stats:* Attack: ★★★★★ | Defense: ★★★★★ | Speed: ★★☆☆☆ | Range: ★★★★☆

### 4. Connector — "The Copycat"
* *Tagline:* "Plugs into anything, copies everything."
* *Weapon:* Polymorphic Elastic Body
* *Playstyle:* Unpredictable chaotic brawler. A bizarre cyan entity that mimics other fighters' abilities, splits into three spinning clones, hops across heads, and stretches its limbs across the screen.
* *Overclock Musou — Giga Connect:* Inflates to 100× standard size: three colossal ground bounces, a massive spinning sweep, and a devastating screen-clearing belly flop.
* *Stats:* Attack: ★★★★☆ | Defense: ★★★★☆ | Speed: ★★★★☆ | Range: ★★★☆☆

---

## ⚔️ Combat Mechanics & Game Feel

Argon Fighter delivers the authentic weight and responsiveness of premier action titles:
- **Combo System (Dynasty-Style Strings):**
  - **Normal String (`N1` – `N6`):** Tap attack to execute swift forward-advancing swings.
  - **Charge Finishers (`C1` – `C6`):** Tap charge after any normal strike to branch into heavy effects:
    - `C1` (Neutral Charge): 360° guard break or stun wave.
    - `C2` (`N1` → `Charge`): Vertical uppercut launcher into air juggle.
    - `C3` (`N2` → `Charge`): Rapid-hit flurry followed by a daze stun.
    - `C4` (`N3` → `Charge`): Wide radial blow-away cleave.
    - `C5` (`N4` → `Charge`): High-altitude aerial tornado launch.
    - `C6` (`N5` → `Charge`): Character-defining ultimate heavy finisher.
- **Air Combos & Aerial Recovery:** Launch enemies airborne and follow with jumping air-strings (`J.Atk`) and air dive-slams (`J.Charge`).
- **Hitstop & Impact Weight:**
  - Micro-scaled hitstop (1–4 simulation frames on standard grunts, 6–8 frames on heavy impact) grants kinetic crunch without stalling the 60 Hz sim.
  - White silhouette damage flashes and apex hang on launched targets (bodies float for ~0.3s at peak before tumbling).
- **3-Segment Overclock Gauge:**
  - Landing hits and achieving K.O.s fills the Overclock gauge.
  - Each filled segment can be expended for an invincible, cinematic Overclock Musou attack that commands full dynamic camera choreography.

---

## 🛠️ Core Technical Architecture

```
src/
├── main.js             # Fixed 60 Hz loop, state transitions, scene & pipeline orchestrator
├── App.tsx             # React wrapper application
├── audio/              # Procedural Web Audio API sound bank & dynamic synthesizers
├── camera/             # Camera simulation, critically damped spring rig & occlusion dithering
├── chars/              # Character registry, voxel models, animations & kits (Adam, Ana, Brian, Connector)
├── combat/             # Deterministic hitboxes, reaction physics, hitstop & juggle vectors
├── core/               # AI Combat Bot, input sampling, RNG, events & voxel geometry generators
├── crowd/              # Multi-agent crowd simulation (300-2000 units), spatial grids & instancing
├── hero/               # Player hero state machine, kinematics, locomotion & movesets
└── ui/                 # HUD system (health bars, Overclock gauge, minimap, telemetry, title & select)
```

### Deterministic 60 Hz Simulation Loop
Argon Fighter strictly decouples **simulation state** (`step()`) from **presentation rendering** (`render()`):
- The simulation runs at a fixed `1/60s` timestep, executing input sampling, hero locomotion, combat collision calculations, crowd steering, and AI bot heuristics.
- Hitstop and freeze frames affect sim ticks deterministically without dropping renderer frame-rates or desynchronizing visual particle simulations.

### High-Density Voxel Crowd Engine
- **Spatial Partitioning & Instancing:** Manages hundreds of simultaneous enemy agents on standard hardware (up to 2,000 on high-end machines) utilizing instanced buffer geometry, GPU vertex coloring, and compact state arrays.
- **Dynamic Flocking & Aggro:** Grunt agents fluidly swarm, circle, and flank while respecting officer commands and maintaining lane spacing.

### Camera Occlusion & Spring Rig
- **Critically Damped Spring Rig:** The camera boom follows the hero smoothly via spring physics that suppress jerky motions during dodges, hops, or rapid direction changes.
- **Occlusion Dithering (`src/camera/occlusion.js`):** Pillars, walls, and obstacles between the lens and the player dither out gracefully to ensure uninterrupted combat readability.
- **Crowd Pull-Out:** The camera automatically elevates and widens its field of view when navigating dense crowds, preventing the player from being obscured by surrounding mobs.

### Procedural Audio Synthesis
- Built entirely on the native **Web Audio API** (`src/audio/bank.js`), eliminating external audio asset dependencies.
- Generates procedural sound effects in real time: resonant metal impacts, whoosh sweeps, bass drops, crowd hit reactions, Overclock sirens, and synthesized music cues.

---

## 🕹️ Controls & Hotkeys

### Keyboard & Mouse

| Action | Primary Key | Secondary / Alternative |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | Arrow Keys |
| **Normal Attack** | <kbd>J</kbd> | Left Mouse Click |
| **Charge Finisher** | <kbd>K</kbd> | Right Mouse Click |
| **Jump** | <kbd>Space</kbd> | — |
| **Dodge Roll** | <kbd>L</kbd> | <kbd>Shift</kbd> |
| **Overclock (Musou)**| <kbd>I</kbd> | (When gauge has ≥ 1 segment) |
| **Camera Orbit** | Mouse Drag / Move | <kbd>Q</kbd> (Left) / <kbd>E</kbd> (Right) |
| **Recenter / Lock** | <kbd>R</kbd> | Locks to nearest Boss/Officer |
| **AI Bot Auto-Play**| <kbd>B</kbd> | **Hot-swaps Manual / AI Autopilot** |
| **Pause & Menu** | <kbd>Esc</kbd> | Configure Bot Style, Sound & Controls |

### Gamepad (Standard Xbox / PlayStation)
- **Move:** Left Analog Stick
- **Attack (Normal):** <kbd>X</kbd> / <kbd>Square</kbd>
- **Charge Finisher:** <kbd>Y</kbd> / <kbd>Triangle</kbd>
- **Jump:** <kbd>A</kbd> / <kbd>Cross</kbd>
- **Dodge:** <kbd>R1</kbd> / <kbd>R2</kbd>
- **Overclock:** <kbd>B</kbd> / <kbd>Circle</kbd>
- **Camera Orbit:** Right Analog Stick
- **Recenter:** <kbd>L1</kbd> / <kbd>L2</kbd>
- **Pause & Bot Menu:** <kbd>Start</kbd>

### Mobile Touch Controls
When accessed on touchscreen devices, Argon Fighter automatically activates an on-screen virtual joystick and touch action cluster (Normal Attack, Charge, Jump, Dodge, Musou, and Pause).

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm**, **pnpm**, or **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/argon-fighter.git
   cd argon-fighter
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template:
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or the URL displayed in your terminal).

### URL Query Parameters & Dev Shortcuts
Test specific configurations directly via URL query parameters:
- `?go=story`: Jump directly into Championship mode.
- `?go=free`: Jump directly into Practice mode.
- `?char=adam` (or `ana`, `brian`, `connector`): Boot directly as the selected fighter.
- `?enemies=500`: Manually override crowd size (default: 300 desktop, 150 mobile; supports up to 2,000).
- `?hq`: Force high-fidelity post-processing on mobile devices.

### Production Build & Verification
```bash
# Type check TypeScript definitions
npm run lint

# Build production assets into dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Project Structure

```
├── .env.example              # Environment variables template
├── bun.lock                  # Dependency lockfile
├── index.html                # Entry HTML, styles, screen overlays & HUD layout
├── metadata.json             # Google AI Studio manifest & capabilities
├── package.json              # Project scripts & dependencies (@google/genai, Three.js, React)
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite configuration with TailwindCSS & React plugins
└── src/
    ├── main.js               # Core game loop, screen transitions & simulation stepping
    ├── main.tsx              # React mounting entry point
    ├── App.tsx               # Root React component
    ├── index.css             # Tailwind base styles
    ├── audio/
    │   ├── audio.js          # Web Audio sound listener & spatial playback
    │   └── bank.js           # Procedural synthesizer sound bank (whooshes, hits, musou)
    ├── camera/
    │   ├── camera.js         # Camera rig, spring follow & cinematic shot choreographies
    │   └── occlusion.js      # Raycast occlusion queries & dither transparency
    ├── chars/
    │   ├── index.js          # Character registry & portrait rendering
    │   ├── adam/             # Adam (The Broadcaster) kit, model, moves & anims
    │   ├── ana/              # Ana (The Influencer) kit, model, moves & anims
    │   ├── brian/            # Brian (The Roadie) kit, model, moves & anims
    │   ├── connector/        # Connector (The Copycat) kit, model, moves & anims
    │   ├── officers/         # Boss hacker models, AI kits & combat skins
    │   └── shared/           # Shared bone kinematics, procedural locomotion & outfits
    ├── combat/
    │   └── combat.js         # Combat simulation, hitboxes, reactions, hitstop & juggle physics
    ├── core/
    │   ├── bot.js            # Autonomous AI Combat Bot & tactical decision profiles
    │   ├── difficulty.js     # 4 Difficulty scaling presets (Easy to Extremely Hard)
    │   ├── events.js         # Global decoupled event bus
    │   ├── input.js          # Keyboard, mouse & gamepad input sampler
    │   ├── rng.js            # Deterministic pseudo-random number generators
    │   └── voxel.js          # Procedural voxel mesh builders & AO calculation
    ├── crowd/
    │   ├── crowd.js          # Multi-agent crowd simulation, flocking & state machines
    │   └── view.js           # High-density crowd renderer & instanced voxel visuals
    ├── hero/
    │   ├── combo.js          # Normal and charge combo branch execution
    │   ├── hero.js           # Player character sim entity & state machine
    │   ├── locomotion.js     # Hero acceleration, ground snapping & dive rolls
    │   ├── model.js          # Hero voxel model instantiation & lighting grades
    │   ├── moves.js          # Comprehensive move table & hitbox definitions
    │   ├── moveset.js        # Move parsing & branch compilation
    │   └── anims/            # Kinematic locomotion animation clips
    └── ui/
        ├── hud.js            # Dynamic HUD overlay (boss tags, minimap, combo counters, bot telemetry)
        └── title.js          # 3D interactive title screen & character line-up stage
```

---

<div align="center">
  <b>Argon Fighter — Warehouse Championship</b><br>
  <i>Built with Google Gemini 4 Argon · Three.js · React 19 · Vite</i>
</div>

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

Demo Link: https://argon-fighter.ai.studio/