# Soul AI — Product Requirements Document

**Version:** 0.1 (Phase 0 — Ideation)
**Status:** Draft

---

## Overview

This PRD defines the product requirements for Doroni Soul AI. It covers user journeys, feature areas, MVP boundaries, and non-goals for the initial prototyping phase.

Soul AI is the intelligent personality layer of the Doroni eVTOL ecosystem. See [`PRODUCT_VISION.md`](PRODUCT_VISION.md) for the full product definition.

---

## Target Users

| User Type | Description |
|---|---|
| Doroni H1-X pilot | Primary user. Owns or operates the Doroni H1-X eVTOL. Uses Soul AI on mobile and in cockpit. |
| Trainee pilot | Uses Soul AI in simulator context. Builds pilot profile through training sessions. |
| Future: fleet operator | Manages multiple aircraft and pilots. Requires admin/web portal features. |

For Phase 0–2, the primary persona is the **Doroni H1-X pilot** using the mobile app and cockpit.

---

## User Journeys

### Journey 1 — Morning Mobile Briefing

**Trigger:** User opens mobile app in the morning.

**Soul interaction:**
> "Good morning. You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes compared with driving. Weather is suitable. I recommend leaving at 9:28."

**User action:** Taps "Prepare Fly Plan."

**System outputs:**
- Daily agenda summary
- Route recommendation
- Departure time
- Fly-vs-drive comparison
- Mission object created

**Mapping:** [`examples/conversations/mobile_daily_briefing.md`](../examples/conversations/mobile_daily_briefing.md)

---

### Journey 2 — Remote Aircraft Preparation

**Trigger:** User prepares to leave for the aircraft.

**Soul interaction:**
> "Your H1-X has 88% battery. Cabin is currently 27 degrees. Would you like me to cool it to your preferred 21 degrees?"

**User action:** Confirms cabin preparation.

**System outputs:**
- `climate_set_temperature` MQTT message
- Lighting preference applied
- Route handoff to cockpit initiated
- Aircraft readiness state updated

---

### Journey 3 — Cockpit Handoff

**Trigger:** User enters cockpit.

**Soul interaction:**
> "Welcome. Your Fly Plan is loaded. Destination: Doroni HQ. Estimated flight time: 13 minutes. Ready for briefing?"

**User action:** "Start briefing."

**System outputs:**
- NavApp displays mission briefing card
- Soul transcript overlay activated
- Soul animation enters briefing state

---

### Journey 4 — In-Cockpit Voice Control

**Trigger:** User issues voice commands during cockpit session.

**Example command sequence:**

| User input | Expected intent | MQTT message |
|---|---|---|
| "Switch to satellite mode." | `nav_set_map_mode` | `nav_set_map_mode` → satellite |
| "Make it cooler." | `climate_adjust_temperature` | `climate_adjust_temperature` → delta -2°C |
| "Zoom in." | `nav_zoom_control` | `nav_zoom_control` → zoom_in |
| "Set ambient lighting to blue." | `lighting_set_ambient_rgb` | `lighting_set_ambient_rgb` → #0000FF |
| "What's my ETA?" | `nav_get_eta` | `nav_get_eta` → response |

**Mapping:** [`examples/conversations/cockpit_commands.md`](../examples/conversations/cockpit_commands.md)

---

### Journey 5 — Simulator Debrief

**Trigger:** Simulator session ends.

**Soul interaction:**
> "Session complete. You maintained stable altitude for 83% of cruise. Your approach was slightly steeper than your previous average."

**System outputs:**
- Telemetry session summary
- Pilot profile updated
- Debrief card displayed on mobile
- Recommended training focus generated

**Mapping:** [`examples/conversations/post_flight_debrief.md`](../examples/conversations/post_flight_debrief.md)

---

## Feature Areas

### Mobile Features (Phase 2)

| Feature | Priority | Phase |
|---|---|---|
| Daily agenda summary | P0 | Phase 2 |
| Fly Plan generation | P0 | Phase 3 |
| Fly-vs-drive comparison | P0 | Phase 3 |
| Remote aircraft readiness | P1 | Phase 2 |
| Remote cabin preparation | P1 | Phase 2 |
| Mission send to cockpit | P0 | Phase 3 |
| Push notifications | P1 | Phase 2 |
| Post-flight debrief | P1 | Phase 4 |
| Pilot profile view | P2 | Phase 4 |
| Flight history | P2 | Phase 4 |

### Cockpit / NavApp Features (Phase 1)

| Feature | Priority | Phase |
|---|---|---|
| Voice-to-intent processing | P0 | Phase 1 |
| Climate control commands | P0 | Phase 1 |
| Lighting commands | P0 | Phase 1 |
| Navigation commands (destination, zoom, map mode) | P0 | Phase 1 |
| Door lock/unlock | P1 | Phase 1 |
| Mission briefing display | P0 | Phase 1 |
| Soul animation state | P1 | Phase 1 |
| Transcript overlay | P1 | Phase 1 |
| ETA queries | P0 | Phase 1 |

### Simulator & Telemetry Features (Phase 4)

| Feature | Priority | Phase |
|---|---|---|
| Telemetry frame ingestion | P0 | Phase 4 |
| Session recording | P0 | Phase 4 |
| Basic metrics calculation | P0 | Phase 4 |
| Pilot profile update | P1 | Phase 4 |
| Debrief generation | P1 | Phase 4 |
| Training recommendations | P2 | Phase 4 |

---

## MVP Boundary (Phase 1)

The Phase 1 MVP is the **NavApp Voice Brain Prototype**.

Scope:
- Accept text or transcript input
- Classify intent
- Validate against risk level
- Emit a structured MQTT-format command object
- Return a Soul response string

In scope: climate, lighting, navigation, map control, transcript/animation updates, ETA queries.
Out of scope: real aircraft connectivity, real MQTT broker, real voice recognition, authenticated users.

---

## Non-Goals (Phase 0–1)

- Certified avionics logic
- Autonomous flight control
- Real aircraft control
- Real user authentication
- Real payment or account systems
- Real calendar production API integration
- Real weather or airspace production API integration
- Full mobile app implementation
- Full NavApp rewrite
- Complex cloud deployment
- Heavy ML infrastructure
- Production telemetry storage at scale

---

## Success Criteria (Phase 0)

The Phase 0 milestone is complete when:

- [x] Soul AI product vision is clear
- [x] Docs explain mobile, cockpit, and simulator roles
- [x] Safety boundaries are explicit
- [x] MQTT messages are structured
- [x] Intent schema exists
- [x] Sample conversations exist
- [x] Risk levels are documented
- [x] Demo script exists
- [ ] At least one prototype flow can convert user text into a validated command object

---

## Related Documents

- [`PRODUCT_VISION.md`](PRODUCT_VISION.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)
- [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md)
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md)
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md)
