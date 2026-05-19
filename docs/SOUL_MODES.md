# Soul AI — Operational Modes

**Version:** 0.1 (Phase 0 — Ideation)

---

## Overview

Soul AI must behave differently depending on operational context. The system maintains a current **Soul Mode** that is determined by:

- The user's location relative to the aircraft
- The aircraft's operational state (parked, pre-flight, airborne, landed)
- Whether a simulator session is active

The Soul Mode is stored in the Context Engine and affects:
- Which commands are permitted
- How much chatter Soul AI generates
- Which surfaces are active (mobile, cockpit, or both)
- The tone and length of Soul responses

---

## Mode Table

| Mode | Primary Surface | Trigger Condition | Soul Behaviour |
|---|---|---|---|
| `away_from_aircraft` | Mobile | User is not near the aircraft | Conversational, planning-focused, proactive |
| `near_aircraft` | Mobile + Cockpit | User is within proximity of the aircraft | Preparation, readiness checks, handoff |
| `parked_cockpit` | Cockpit / NavApp | Aircraft parked, engines off, user in cockpit | Conversational but concise |
| `pre_flight` | Cockpit / NavApp | Pre-flight checklist or briefing initiated | Briefing-focused, route validation |
| `launch_departure` | Cockpit / NavApp | Aircraft taking off or departing | Minimal output, safety-focused only |
| `cruise` | Cockpit / NavApp | Aircraft in cruise phase | Advisory, navigation, comfort commands |
| `approach_landing` | Cockpit / NavApp | Aircraft on approach or landing | Very low chatter, advisories only |
| `post_flight` | Mobile | Aircraft has landed, session ended | Debrief, next steps, session summary |
| `simulator` | Simulator + Mobile | Simulator session is active | Coaching, analytics, training context |

---

## Mode Behaviour Details

### `away_from_aircraft`

**Primary surface:** Mobile app

**Permitted actions:**
- Daily briefing generation
- Fly Plan preparation
- Remote aircraft readiness check
- Remote cabin preparation (Level 1 commands)
- Mission planning and route review
- Calendar integration
- Push notifications

**Soul tone:** Conversational, proactive. Soul may initiate contact (morning briefing, departure reminders).

**Example Soul output:**
> "Good morning. You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes. Weather is suitable. I recommend leaving at 9:28."

---

### `near_aircraft`

**Primary surface:** Mobile app transitioning to cockpit

**Permitted actions:**
- Aircraft readiness summary
- Final cabin preparation
- Mission handoff to cockpit
- Lock/unlock confirmation

**Soul tone:** Concise and task-focused. Transition from planning to preparation.

**Example Soul output:**
> "Your H1-X is ready. Fly Plan loaded. Cabin cooled to 21°C. Doors unlocked."

---

### `parked_cockpit`

**Primary surface:** Cockpit / NavApp

**Permitted actions:**
- All Level 0 and Level 1 commands (comfort, lighting, UI)
- Destination setting (Level 2)
- Mission briefing review

**Soul tone:** Conversational but concise. May answer questions about the mission or aircraft.

**Example Soul output:**
> "Cabin is at 21°C. Your fly plan shows a 13-minute flight. Ready for briefing when you are."

---

### `pre_flight`

**Primary surface:** Cockpit / NavApp

**Permitted actions:**
- Mission briefing
- Route validation
- Weather and airspace summary
- Checklist support (advisory only)
- Level 0–2 commands

**Soul tone:** Structured and informative. This is the last opportunity for detailed information before flight.

**Example Soul output:**
> "Flight briefing for Doroni HQ. Distance: 18nm. Estimated time: 13 minutes. Wind: 8 knots from the south. No significant weather. Airspace: Class G throughout. One NOTAM within 5nm — temporary drone restriction at 200ft AGL, south of route. Proceeding on planned route avoids it."

---

### `launch_departure`

**Primary surface:** Cockpit / NavApp

**Permitted actions:**
- Level 0 commands only (cosmetic)
- Advisories if absolutely necessary

**Soul tone:** Silent unless required. Do not initiate. Respond only if spoken to, with the shortest possible answer.

**Example Soul output:**
> "Understood." *(after user command)* or silent.

---

### `cruise`

**Primary surface:** Cockpit / NavApp

**Permitted actions:**
- All Level 0 and Level 1 commands
- Navigation queries (ETA, route, next waypoint)
- Level 2 commands with confirmation
- Level 3 advisories with confirmation
- Level 4 safety advisories (display only)

**Soul tone:** Advisory and helpful. Can be more conversational during cruise than during other flight phases.

**Example Soul output:**
> "ETA: 7 minutes. Cabin is at 21°C. You're tracking 2nm left of centre — wind correction applied."

---

### `approach_landing`

**Primary surface:** Cockpit / NavApp

**Permitted actions:**
- Level 4 advisories only
- No comfort commands
- No route commands
- No chatter

**Soul tone:** Silent except for safety advisories. This is the most restricted mode.

**Example Soul output:**
> "Terrain advisory: ground proximity. Pilot action required." *(only if critical)*

---

### `post_flight`

**Primary surface:** Mobile app

**Permitted actions:**
- Debrief generation
- Session summary
- Pilot profile update
- Next steps recommendations
- Comfort commands on aircraft (Level 0–1)

**Soul tone:** Reflective and personal. Transition from operational to conversational.

**Example Soul output:**
> "Flight complete. 12 minutes 40 seconds. Smooth cruise. Your approach was a little steep — I'll note that in your profile. Ready for the full debrief?"

---

### `simulator`

**Primary surface:** Simulator client + Mobile app

**Permitted actions:**
- Telemetry ingestion (passive)
- Real-time coaching commentary (if enabled)
- Post-session debrief
- Pilot profile update

**Soul tone:** Coaching and analytical. More technical than in real-flight modes. Honest about performance.

**Example Soul output:**
> "You overcorrected on the roll during that descent. Try shallower inputs. I'll flag this for your debrief."

---

## Mode Transitions

```
away_from_aircraft
    ↓ (user approaches aircraft)
near_aircraft
    ↓ (user enters cockpit)
parked_cockpit
    ↓ (user starts pre-flight)
pre_flight
    ↓ (departure initiated)
launch_departure
    ↓ (aircraft airborne, stable)
cruise
    ↓ (approaching destination)
approach_landing
    ↓ (aircraft landed)
post_flight
    ↓ (user exits aircraft, app resumes)
away_from_aircraft

Simulator session active → simulator mode (separate from real flight modes)
```

---

## Mode Detection (Prototype Approach)

For Phase 0–2, Soul mode is set manually via API or context payload. In later phases:

- Location data from mobile app determines `away_from_aircraft` vs `near_aircraft`
- Aircraft telemetry determines `parked_cockpit`, `pre_flight`, `cruise`, `approach_landing`
- Post-flight is triggered by aircraft landing event
- Simulator mode is triggered by simulator bridge session start

---

## Related Documents

- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md) — mode-based command restrictions
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Context Engine stores current mode
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md) — intent objects include current mode
