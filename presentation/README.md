# Soul AI — Interactive Presentation

## How to present

1. Open `index.html` in **Chrome** or **Edge** (recommended for Web Audio + canvas performance)
2. Press **F11** for fullscreen
3. Navigate with **arrow keys** or **spacebar**

## Keyboard controls

| Key | Action |
|---|---|
| `→` / `Space` / `↓` | Next scene |
| `←` / `↑` | Previous scene |
| `S` | Toggle sound on / off |
| `N` | Toggle speaker notes |

## Scene overview

| Scene | Title | Content |
|---|---|---|
| 1 | Soul AI Identity | Animated Soul orb, brand statement |
| 2 | Relationship Map | Animated node diagram — user ↔ Soul ↔ surfaces |
| 3 | Three Pillars | Flight Concierge / Cockpit Companion / Flight Intelligence |
| 4 | Morning Briefing | Animated mobile conversation — typewriter effect |
| 5 | Cockpit Commands | Voice → intent → validate → MQTT pipeline |
| 6 | Roadmap | Phase timeline, closing quote |

## Sound

Sound is **off by default**. Press `S` or click the 🔇 icon to enable.  
Requires Chrome — ambient drone + UI tones are generated via Web Audio API (no audio files needed).

## Speaker notes

Press `N` at any scene to see talking points. Press `N` again or any key to dismiss.

## Logo

The Doroni logo is loaded from `doroni.io`. If presenting offline or if the logo doesn't appear,  
edit `index.html` line 19 and replace the `src` with the correct local path or asset URL.

## No server required

All files are static. Open `index.html` directly — no build step, no dependencies.
