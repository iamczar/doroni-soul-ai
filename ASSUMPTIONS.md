# Assumptions

This file records explicit assumptions made during Phase 0. Any agent working on this project should review this file before starting work and update it when new assumptions are made or existing ones are resolved.

---

## Product Assumptions

### A01 — H1-X as primary aircraft
**Assumption:** The primary target aircraft for Soul AI Phase 0–2 is the Doroni H1-X eVTOL.  
**Rationale:** The bootup prompt references the H1-X throughout. Other Doroni aircraft variants are assumed to follow later.  
**Status:** Open — no other aircraft types referenced in Phase 0 scope.

---

### A02 — Single-pilot operation
**Assumption:** Soul AI is designed for single-pilot (or owner-operated) use. Fleet management and multi-pilot scenarios are not in scope for Phase 0–2.  
**Rationale:** The PRD persona is the "Doroni H1-X pilot" and all user journeys are single-user.  
**Status:** Open.

---

### A03 — English language only
**Assumption:** Soul AI processes English language input only in Phase 0–2.  
**Rationale:** Not stated in the bootup prompt. Multi-language support is a typical later-phase concern.  
**Status:** Open. Raise if internationalisation is needed earlier.

---

### A04 — Temperature range
**Assumption:** The allowed cabin temperature range is 16–30°C. Commands outside this range are rejected.  
**Rationale:** This is a reasonable comfort range for aircraft cabins. The actual allowable range for the H1-X HVAC system is unknown at this stage.  
**Status:** Open. Must be confirmed with the hardware/avionics team before Phase 1 integration.

---

### A05 — Fly-vs-drive threshold
**Assumption:** By default, Soul AI recommends flying when the time saving exceeds 10 minutes. This default is user-configurable.  
**Rationale:** Not specified in the bootup prompt. 10 minutes was chosen as a conservative starting point.  
**Status:** Open. Should be validated with product/UX.

---

## Architecture Assumptions

### A06 — Soul Orchestrator as single service
**Assumption:** The Soul Orchestrator is implemented as a single service in Phase 1. It is not split into microservices.  
**Rationale:** Prototyping phase — minimal complexity.  
**Status:** Open. May be split in Phase 5+ for production readiness.

---

### A07 — No real MQTT broker in Phase 1
**Assumption:** The Phase 1 prototype does not connect to a real MQTT broker. The MQTT Gateway generates and logs/returns structured command objects without publishing.  
**Rationale:** Keeps Phase 1 self-contained and testable without infrastructure.  
**Status:** Open. Mosquitto integration planned for Phase 2–3.

---

### A08 — In-memory context in Phase 1
**Assumption:** The Context Engine uses in-memory storage in Phase 1. No database is required.  
**Rationale:** Prototyping phase. State is not persisted between restarts.  
**Status:** Open. SQLite or equivalent planned for Phase 2.

---

### A09 — Claude API for intent classification
**Assumption:** The Intent Engine uses the Anthropic Claude API (`claude-sonnet-4-6`) for natural language intent classification and response generation.  
**Rationale:** Specified in the architecture doc as the starting-point LLM for prototypes.  
**Status:** Open. Model version and prompt design subject to iteration.

---

### A10 — NavApp mock is web-based
**Assumption:** The NavApp mock is a simple HTML/JS single-page app served locally. It is not a native application.  
**Rationale:** Fastest approach for Phase 1 prototype validation.  
**Status:** Open. Native implementation is not in scope for any prototype phase.

---

## Safety Assumptions

### A11 — Risk level 5 is permanently blocked
**Assumption:** Risk level 5 (flight-critical) commands are permanently blocked in all phases of this prototype. No override mechanism exists.  
**Rationale:** Core safety principle from the bootup prompt.  
**Status:** Closed — this is a hard constraint, not subject to change in Phase 0–5.

---

### A12 — AI output is always labelled as advisory
**Assumption:** All AI-generated recommendations are presented as suggestions, not guarantees. Soul AI uses language like "I recommend" rather than "you must."  
**Rationale:** Core safety principle — AI output must be distinguishable from deterministic system state.  
**Status:** Closed — enforced in all response generation.

---

## Telemetry Assumptions

### A13 — Simulator telemetry at 10Hz
**Assumption:** The Phase 4 prototype ingests telemetry at 10Hz (one frame per 100ms). Real-world and production rates may differ.  
**Rationale:** 10Hz is sufficient to capture meaningful flight data for the prototype metrics.  
**Status:** Open. Must be validated against actual simulator output rates.

---

### A14 — Smoothness score algorithm
**Assumption:** The smoothness score is calculated as 1 minus the normalized rate of joystick input change over the session. This is a placeholder algorithm.  
**Rationale:** A more sophisticated algorithm will require domain input from flight instructors or Doroni engineers.  
**Status:** Open. Algorithm should be reviewed with aviation SME before Phase 5.

---

## Integration Assumptions

### A15 — Calendar as JSON fixture
**Assumption:** Calendar data in Phase 2 is provided as a JSON fixture file. No real calendar API (Google, Outlook, Apple) is integrated.  
**Rationale:** Production calendar integration is listed as a non-goal for Phase 0–2.  
**Status:** Open. Real calendar integration planned for post-Phase 5.

---

### A16 — Weather as mock data
**Assumption:** Weather data in Phase 2–3 is mocked. No real weather API is called.  
**Rationale:** Production weather integration is a non-goal for Phase 0–2.  
**Status:** Open. Real weather API integration planned for post-Phase 5.

---

## Resolved Assumptions

*(None yet — this section is for assumptions that have been confirmed or invalidated.)*

---

## How to Update This File

When you make a new assumption:
1. Add a new entry with the next available code (A17, A18, etc.)
2. State the assumption clearly
3. Give your rationale
4. Set status to **Open** or **Closed**

When an assumption is resolved or confirmed:
1. Move it to the Resolved Assumptions section
2. Note how it was resolved and by whom

When an assumption turns out to be wrong:
1. Move it to Resolved Assumptions
2. Note what the correct information is
3. Update any code or docs that depended on the wrong assumption
