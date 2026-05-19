# Soul AI — Demo Script

**Version:** 0.1 (Phase 0 — Ideation)
**Audience:** Internal team, investors, design review

---

## Overview

This script walks through the five core Soul AI user journeys. It can be used as a narrated demo, a design review walkthrough, or a reference for prototype scope.

The journeys cover:
1. Morning mobile briefing
2. Remote aircraft preparation
3. Cockpit handoff
4. In-cockpit voice control
5. Simulator debrief

All data in this script is fictional and for demonstration purposes.

---

## Setup (Before Demo)

- User: **Alex** — Doroni H1-X pilot, based in Miami
- Aircraft: **H1-X tail N001DH** — currently at Opa-locka Executive Airport
- Destination: **Doroni HQ** — 18nm northeast
- Simulated date: **2026-05-19** (Tuesday)
- Alex has a meeting at Doroni HQ at **10:00**

---

## Journey 1 — Morning Mobile Briefing

**Narrative:** It's 8:45am. Alex opens the Doroni companion app. Soul AI has already been working in the background — checking the calendar, weather, and aircraft state.

---

**Screen: Mobile Home — Soul AI Morning Card**

Soul AI says:

> "Good morning, Alex. You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes compared with driving. Current weather is suitable: clear skies, light southerly wind. I recommend leaving at 9:28."

---

**Soul displays:**

| | |
|---|---|
| Meeting | Doroni HQ — 10:00 |
| Flight time | ~13 minutes |
| Drive time | ~39 minutes |
| Time saving | 26 minutes |
| Weather | Clear — CAVOK |
| Recommended departure | 9:28 |

---

**Alex taps:** "Prepare Fly Plan"

Soul AI generates the fly plan:

```
Fly Plan — Opa-locka Executive → Doroni HQ
Date:       2026-05-19
Departure:  09:28
Arrival:    ~09:41
Distance:   18nm
Route:      Direct
Weather:    CAVOK, wind 8kt from 180°
Airspace:   Class G throughout. No NOTAMs on route.
Risk flags: None
```

Soul confirms:
> "Fly Plan ready. Departing at 9:28, arriving at approximately 9:41. Would you like me to prepare the aircraft?"

---

**Key system outputs:**
- Mission object created (see [`schemas/domain/mission.schema.json`](../schemas/domain/mission.schema.json))
- Fly plan stored in Context Engine
- Push notification scheduled for 9:20 reminder

---

## Journey 2 — Remote Aircraft Preparation

**Narrative:** Alex confirms cabin preparation. Soul AI sends remote commands to the H1-X.

---

**Alex says:** "Yes, prepare the cabin."

Soul AI says:
> "Your H1-X has 88% battery — sufficient range. Cabin is currently 27°C. Cooling to your preferred 21°C now. Ambient lighting set to your morning preference."

---

**MQTT messages sent:**

1. `climate_set_temperature` → `{ "temperature_celsius": 21 }`
2. `lighting_set_ambient_rgb` → `{ "rgb": "#FFD580", "brightness_percent": 40 }`

---

Soul AI says:
> "Aircraft is preparing. I'll send the Fly Plan to the cockpit when you're on your way. Reminder set for 9:20."

---

**Key system outputs:**
- `climate_set_temperature` published to NavApp MQTT topic
- `lighting_set_ambient_rgb` published to NavApp MQTT topic
- Aircraft readiness state updated in Context Engine
- Fly plan queued for cockpit handoff

---

## Journey 3 — Cockpit Handoff

**Narrative:** Alex arrives at the aircraft at 9:25. Steps into the cockpit. NavApp activates.

---

**NavApp boot:**

Soul animation appears. Transcript overlay activates.

Soul AI says:
> "Welcome back, Alex. Your Fly Plan is loaded. Destination: Doroni HQ. Estimated flight time: 13 minutes. Cabin is at 21°C. Ready for briefing?"

---

**Alex says:** "Start briefing."

Soul AI says:
> "Pre-flight briefing for Doroni HQ. Distance: 18nm. Route: direct. Wind: 8 knots from the south — expect minor drift. No airspace restrictions on route. One NOTAM in the area: temporary drone restriction south of the airport, below 200ft AGL. Our route is not affected. Aircraft: battery at 88%, full range available. Recommend departure: now."

---

**NavApp displays briefing card:**

```
PRE-FLIGHT BRIEFING
───────────────────────
Destination:  Doroni HQ
Distance:     18nm
Est. time:    13 min
Wind:         8kt / 180°
Airspace:     Class G, clear
NOTAM:        Drone restriction (south, <200ft) — not on route
Battery:      88%
Status:       READY
```

---

**Key system outputs:**
- `mission_send_to_cockpit` MQTT message (see [`examples/mqtt_messages/mission_send_to_cockpit.json`](../examples/mqtt_messages/mission_send_to_cockpit.json))
- `ui_show_briefing_card` MQTT message
- `ui_soul_animation_state` → `"briefing"`
- `ui_soul_transcript_update` with briefing text

---

## Journey 4 — In-Cockpit Voice Control

**Narrative:** Alex is airborne and in cruise. Issues several voice commands.

---

### Command 1 — Map mode

**Alex says:** "Switch to satellite mode."

**Intent classified:**
```json
{
  "intent": "nav_set_map_mode",
  "parameters": { "map_mode": "satellite" },
  "confidence": 0.99,
  "risk_level": 0,
  "requires_confirmation": false
}
```

**Action:** `nav_set_map_mode` published → NavApp switches to satellite view.

**Soul says:** "Switched to satellite mode."

---

### Command 2 — Temperature

**Alex says:** "Make it cooler."

**Intent classified:**
```json
{
  "intent": "climate_adjust_temperature",
  "parameters": { "delta_celsius": -2 },
  "confidence": 0.92,
  "risk_level": 1,
  "requires_confirmation": false
}
```

**Validation:** 21°C - 2°C = 19°C — within allowed range (16–30°C). Approved.

**Action:** `climate_adjust_temperature` published → cabin temperature target set to 19°C.

**Soul says:** "Adjusting temperature to 19°C."

---

### Command 3 — ETA

**Alex says:** "What's my ETA?"

**Intent classified:**
```json
{
  "intent": "nav_get_eta",
  "parameters": {},
  "confidence": 0.99,
  "risk_level": 0,
  "requires_confirmation": false
}
```

**Action:** `nav_get_eta` request → NavApp returns ETA.

**Soul says:** "7 minutes to Doroni HQ. On track."

---

### Command 4 — Lighting

**Alex says:** "Set ambient lighting to blue."

**Intent classified:**
```json
{
  "intent": "lighting_set_ambient_rgb",
  "parameters": { "rgb": "#0000FF", "brightness_percent": 70 },
  "confidence": 0.95,
  "risk_level": 0,
  "requires_confirmation": false
}
```

**Action:** `lighting_set_ambient_rgb` published → ambient lighting changes to blue.

**Soul says:** "Ambient lighting set to blue."

---

**Example conversation file:** [`examples/conversations/cockpit_commands.md`](../examples/conversations/cockpit_commands.md)

---

## Journey 5 — Simulator Debrief

**Narrative:** Alex has completed a simulator session in Microsoft Flight Simulator using the Doroni H1-X profile. The simulator bridge has been ingesting telemetry for the full session.

---

**Session ends.**

Simulator bridge sends `telemetry_session_stop`.

Soul AI processes the session:

- Total session time: 42 minutes
- Altitude stability: 83% (time within ±50ft of target altitude)
- Approach deviation: +4° steeper than Alex's previous session average
- Roll smoothness: improved — 12% reduction in overcorrection events vs. last session
- Route tracking: good — no significant deviations

---

Soul AI says (on mobile):

> "Session complete. 42 minutes. Some good progress today — your roll inputs were noticeably smoother. Altitude was stable for 83% of cruise. Your approach was a little steep compared with your average, about 4 degrees. I've updated your pilot profile."

Soul displays debrief card:

```
SESSION DEBRIEF — 2026-05-19
───────────────────────────────
Duration:           42:07
Altitude stability: 83%
Roll smoothness:    +12% vs. last session
Approach deviation: +4° vs. average
Route tracking:     Good

RECOMMENDATION
Practice stabilized approaches in crosswind conditions.
Next suggested exercise: ILS approach stabilization — crosswind 15kt.
```

---

**Key system outputs:**
- Pilot profile updated (see [`schemas/domain/pilot_profile.schema.json`](../schemas/domain/pilot_profile.schema.json))
- `ui_show_debrief_card` sent to mobile
- `pilot_profile_update` MQTT message
- Training recommendation stored

**Example conversation file:** [`examples/conversations/post_flight_debrief.md`](../examples/conversations/post_flight_debrief.md)

---

## Demo Wrap-Up

**Narrative conclusion:**

> Soul AI made Alex's day seamless. The morning briefing removed the cognitive overhead of planning. Remote preparation made the aircraft ready before Alex arrived. The cockpit handoff felt like stepping into something that already knew the mission. Voice commands worked naturally in flight. And after the simulator, Alex had concrete, personalized feedback on how to improve.

> This is Doroni Soul AI: mobile gives it continuity, cockpit gives it presence, simulator gives it intelligence, telemetry gives it memory.

---

## Related Documents

- [`PRD.md`](PRD.md) — user journey requirements
- [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md) — all MQTT messages referenced
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md) — all intent objects referenced
- [`examples/conversations/`](../examples/conversations/) — full conversation transcripts
- [`examples/mqtt_messages/`](../examples/mqtt_messages/) — MQTT message examples
