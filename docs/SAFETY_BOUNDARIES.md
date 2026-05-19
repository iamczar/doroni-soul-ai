# Soul AI — Safety Boundaries

**Version:** 0.1 (Phase 0 — Ideation)

---

## Core Safety Principle

> **Soul AI proposes. Deterministic systems validate. The pilot remains authority.**

Soul AI is **advisory and supervisory, not flight-authoritative.**

This boundary must be preserved across all phases of development. No feature, no prototype, no demo should cross this line. If a future requirement would give Soul AI autonomous control of flight-critical systems, it must be blocked and escalated.

---

## What Soul AI May Do

These actions are within scope at all phases:

- Recommend routes, departure times, or flight plans
- Explain weather conditions, airspace status, or route hazards
- Brief the pilot on mission context before flight
- Warn the pilot of potential hazards (advisory only)
- Summarize aircraft state and readiness
- Generate structured fly plans for pilot review and approval
- Control non-critical comfort systems (climate, lighting, cabin)
- Trigger approved NavApp UI commands (map mode, zoom, transcript display)
- Log and store telemetry data
- Generate pilot debriefs and training recommendations
- Provide route and ETA information
- Request confirmation from the pilot before executing ambiguous commands

---

## What Soul AI Must Never Do

These actions are permanently outside scope:

- Control flight surfaces (ailerons, elevators, rudder, rotors)
- Override or suppress pilot input
- Execute flight-critical commands without deterministic validation
- Make autonomous flight decisions without pilot authorization
- Bypass certified avionics, autopilot, or safety systems
- Present uncertain AI-generated advice as guaranteed truth
- Take actions during critical flight phases (approach, landing) without pilot confirmation
- Suppress safety warnings from certified systems

---

## Command Risk Levels

Every Soul AI command must be assigned a risk level. This risk level determines how the command is handled by the Safety/Validation Layer.

| Risk Level | Label | Examples | Behaviour |
|---|---|---|---|
| 0 | Safe/cosmetic | Change lighting colour | Execute directly, no confirmation |
| 1 | Low-risk system | Set AC temperature (within range), fan speed | Execute directly if within allowed parameter range |
| 2 | Navigation/routing | Set destination, change route | Confirm if ambiguous or significant change |
| 3 | Advisory routing | Route deviation recommendation, weather avoidance | Recommend and request pilot confirmation |
| 4 | Safety advisory | Airspace warning, hazard alert | Advisory only — do not execute, display to pilot |
| 5 | Flight-critical | Control surface input, autopilot override | Block permanently — hand off to certified system only |

---

## Risk Level Handling Rules

### Level 0
- Execute immediately
- Confirm via Soul response string
- No blocking or delay required

### Level 1
- Validate parameters are within safe ranges before executing
- Example: temperature must be within 16–30°C; fan speed must be 0–100%
- If out of range, reject and explain why
- Execute within range, confirm via Soul response

### Level 2
- Execute if intent is unambiguous and the action is non-safety-critical
- If destination is ambiguous (multiple matches), ask for confirmation
- If route change is significant, confirm before sending to NavApp

### Level 3
- Do not execute automatically
- Generate a recommendation with reasoning
- Ask the pilot to confirm before any route change is submitted
- Example: "I recommend a 12° bearing change to avoid the cloud ahead. Confirm?"

### Level 4
- Advisory only — never execute
- Display hazard or warning information to the pilot
- Do not simulate or imply that Soul AI has acted on the advisory
- Example: "Restricted airspace detected 3nm ahead on current heading. Recommend altitude change — pilot action required."

### Level 5
- Immediately block the intent
- Log the blocked command
- Do not generate a response that implies the command was processed
- Return a clear refusal: "That action requires pilot input and certified system control. I cannot execute it."

---

## Mode-Based Restrictions

Soul AI mode affects which commands are permitted. See [`SOUL_MODES.md`](SOUL_MODES.md) for the full mode table.

| Mode | Permitted risk levels | Restrictions |
|---|---|---|
| Away from aircraft | 0, 1 (remote only), 2, 3 | No cockpit commands |
| Near aircraft | 0, 1, 2 | Preparation commands only |
| Parked cockpit | 0, 1, 2 | Full comfort and UI controls |
| Pre-flight | 0, 1, 2, 3 (with confirmation) | No mid-flight commands |
| Launch/departure | 0 (cosmetic only) | Minimal output, no chatter |
| Cruise | 0, 1, 2, 3 (with confirmation), 4 | Standard operations |
| Approach/landing | 4 only (advisories) | No comfort commands, no route commands |
| Post-flight | 0, 1, 2 | Comfort and debrief only |
| Simulator | 0, 1, 2, 3 | No real-world flight commands |

---

## AI Output Transparency

Soul AI must clearly distinguish between:

- **Deterministic facts** — aircraft state, GPS position, sensor readings
- **AI-generated recommendations** — route suggestions, debrief insights, training tips
- **External data** — weather API output, calendar events, airspace data

Example labelling:

- "Battery is at 88%." ← deterministic fact from aircraft state
- "I recommend leaving at 9:28." ← AI-generated recommendation
- "Weather forecast shows 15 knot headwinds at 1000 ft." ← external data

AI recommendations must never be presented as guaranteed or authoritative. When confidence is low, Soul AI should say so.

---

## Validation Layer Architecture

Every intent object emitted by the Intent Engine must pass through the Safety/Validation Layer before any system action is taken.

```
Intent object (intent, parameters, risk_level, confidence)
        ↓
Safety/Validation Layer:
  - Check risk_level against current mode
  - Validate parameters against allowed ranges
  - Check requires_confirmation flag
  - Block Level 5 intents permanently
        ↓
  Approved → MQTT Gateway → system command
  Confirmation required → Soul asks pilot
  Blocked → refusal response + log entry
```

The LLM never touches system state directly. It generates intents. The validation layer acts.

---

## Related Documents

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Safety/Validation Layer in the system
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md) — intent object structure including risk_level
- [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md) — message structure including risk_level field
- [`SOUL_MODES.md`](SOUL_MODES.md) — mode-based restrictions
