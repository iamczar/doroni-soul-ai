# Soul AI — Agent Workflow

**Version:** 0.1 (Phase 0 — Ideation)

---

## Overview

This document describes how coding agents should work on the Doroni Soul AI project. It defines agent roles, working rules, the phase roadmap, and handoff expectations.

Any agent beginning work on this project must read this file and [`../DORONI_SOUL_AI_BOOTUP_PROMPT.md`](../DORONI_SOUL_AI_BOOTUP_PROMPT.md) before starting.

---

## Agent Roles

### Product/Requirements Agent

**Focus:** Define what Soul AI should do and why.

Responsibilities:
- Refine and update [`docs/PRODUCT_VISION.md`](PRODUCT_VISION.md) and [`docs/PRD.md`](PRD.md)
- Define user journeys and acceptance criteria
- Identify MVP boundaries for each phase
- Reject scope creep — flag when implementation agents are building beyond current phase scope
- Ensure every feature maps to a user journey

---

### Architecture Agent

**Focus:** Define how Soul AI should be structured.

Responsibilities:
- Maintain [`docs/ARCHITECTURE.md`](ARCHITECTURE.md)
- Define service boundaries and message flows
- Define data models
- Identify safety-critical boundaries and escalate violations
- Keep the architecture compatible with future phases without over-engineering for them

---

### Schema/API Agent

**Focus:** Create and validate schemas and message contracts.

Responsibilities:
- Create and maintain JSON schemas in [`schemas/`](../schemas/)
- Create MQTT message examples in [`examples/mqtt_messages/`](../examples/mqtt_messages/)
- Create intent examples in [`examples/conversations/`](../examples/conversations/)
- Validate examples against schemas
- Ensure risk levels are assigned to all commands

---

### Prototype Implementation Agent

**Focus:** Build lightweight prototype services.

Responsibilities:
- Build services in [`prototypes/`](../prototypes/)
- Implement mocked orchestration flows
- Write clean, minimal, testable code
- Never build production complexity during prototyping phases
- Reference schemas for all input/output formats
- Flag assumptions in [`ASSUMPTIONS.md`](../ASSUMPTIONS.md)

---

### Test/Review Agent

**Focus:** Validate correctness and safety boundary compliance.

Responsibilities:
- Write tests for prototype services
- Review schemas for consistency and completeness
- Validate that every command has a risk level
- Check safety boundary compliance across all code and docs
- Flag ambiguous system behaviour in [`ASSUMPTIONS.md`](../ASSUMPTIONS.md)

---

### Demo Agent

**Focus:** Create the product story.

Responsibilities:
- Create and maintain [`docs/DEMO_SCRIPT.md`](DEMO_SCRIPT.md)
- Create sample conversation transcripts in [`examples/conversations/`](../examples/conversations/)
- Ensure the demo is coherent for investors and internal review
- Align demo data with actual schemas and examples

---

## Agent Working Rules

All agents must follow these rules:

1. Read [`DORONI_SOUL_AI_BOOTUP_PROMPT.md`](../DORONI_SOUL_AI_BOOTUP_PROMPT.md) and this file before starting work.
2. Do not treat Soul AI as a generic chatbot. It is Doroni's aviation-specific intelligence layer.
3. Preserve the product principle: Soul AI proposes, deterministic systems validate, the pilot remains authority.
4. Never implement flight-control authority.
5. Treat safety boundaries as first-class architecture — not an afterthought.
6. Use structured intents before actions. Never let the LLM directly manipulate system state.
7. Use validated MQTT-style messages before system commands.
8. Keep mobile, cockpit, simulator, and backend as separate surfaces.
9. Keep the Soul Orchestrator as the shared intelligence layer across all surfaces.
10. Prefer documentation and schemas before code.
11. Keep prototypes simple and explicit. Avoid production complexity.
12. Do not hide assumptions. Write them in [`ASSUMPTIONS.md`](../ASSUMPTIONS.md).
13. When uncertain about scope, create an entry in `ASSUMPTIONS.md` or `TODO.md`.
14. Every feature must map to a user journey defined in [`docs/PRD.md`](PRD.md).
15. Every command must map to a risk level defined in [`docs/SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md).
16. Every executable command must map to a schema in [`schemas/`](../schemas/).
17. AI-generated recommendations must be distinguishable from deterministic system state in all output.
18. Do not build production infrastructure during ideation phases.
19. Make it easy for future agents to continue the work — write clear handoff notes.
20. Keep [`TODO.md`](../TODO.md) and [`ASSUMPTIONS.md`](../ASSUMPTIONS.md) up to date.

---

## Phase Roadmap

### Phase 0 — Repo Foundation (Current)

**Goal:** Create a well-structured repository with product artifacts, schemas, and examples.

**Deliverables:**
- [x] `README.md`
- [x] `docs/PRODUCT_VISION.md`
- [x] `docs/PRD.md`
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/SAFETY_BOUNDARIES.md`
- [x] `docs/SOUL_MODES.md`
- [x] `docs/MQTT_MESSAGE_SPEC.md`
- [x] `docs/INTENT_SCHEMA.md`
- [x] `docs/DEMO_SCRIPT.md`
- [x] `docs/AGENT_WORKFLOW.md`
- [x] `schemas/mqtt/*.schema.json`
- [x] `schemas/intents/soul_intent.schema.json`
- [x] `schemas/domain/*.schema.json`
- [x] `examples/conversations/`
- [x] `examples/mqtt_messages/`
- [x] `prototypes/*/README.md` (stubs)
- [x] `ASSUMPTIONS.md`
- [x] `TODO.md`

---

### Phase 1 — NavApp Voice Brain Prototype

**Goal:** Convert text commands into validated MQTT-format command objects.

**Primary agent:** Prototype Implementation Agent  
**Supporting agents:** Schema/API Agent, Test/Review Agent

**In scope:**
- Soul Orchestrator stub (Python FastAPI or Node.js Express)
- Intent Engine using Claude API for intent classification
- Safety/Validation Layer (parameter checking, risk level enforcement, mode check)
- MQTT Gateway stub (emit validated command objects, no real broker required)
- Support for: climate, lighting, navigation, map mode, zoom, ETA, transcript/animation

**Out of scope:**
- Real MQTT broker connectivity
- Real voice recognition
- Authenticated users
- Full NavApp integration

**Success criteria:**
- POST `/soul/input` accepts text and current mode
- Returns Soul response string + structured intent + validated MQTT command object
- Blocked or out-of-range commands return appropriate refusal

**Reference services:** [`prototypes/soul_orchestrator/`](../prototypes/soul_orchestrator/), [`prototypes/mqtt_gateway/`](../prototypes/mqtt_gateway/)

---

### Phase 2 — Mobile Soul Prototype

**Goal:** Model mobile daily briefing and aircraft preparation flow.

**In scope:**
- Mock calendar (JSON fixture)
- Mock saved destinations (JSON fixture)
- Mock aircraft status (JSON fixture)
- Prepare cabin command flow
- Send mission to cockpit command flow
- Basic notification examples

**Out of scope:**
- Real calendar API
- Real weather API
- Real aircraft connectivity
- Full mobile app

**Reference services:** [`prototypes/mobile_mock/`](../prototypes/mobile_mock/)

---

### Phase 3 — Mission / Fly Plan Prototype

**Goal:** Generate a structured fly plan from a mocked daily schedule.

**In scope:**
- Calendar events (mocked)
- Destinations and route legs
- Fly-vs-drive recommendation
- Departure time calculation
- Risk flag identification
- Cockpit handoff state

**Reference:** [`schemas/domain/mission.schema.json`](../schemas/domain/mission.schema.json)

---

### Phase 4 — Simulator Telemetry Prototype

**Goal:** Ingest a mocked telemetry stream and produce a basic debrief.

**In scope:**
- Telemetry frame ingestion (mocked stream via UDP or file replay)
- Session recording
- Basic metrics (altitude stability, smoothness, approach deviation)
- Pilot profile update
- Debrief generation

**Reference services:** [`prototypes/simulator_bridge/`](../prototypes/simulator_bridge/)
**Reference schemas:** [`schemas/domain/telemetry_frame.schema.json`](../schemas/domain/telemetry_frame.schema.json), [`schemas/domain/pilot_profile.schema.json`](../schemas/domain/pilot_profile.schema.json)

---

### Phase 5 — Integrated Demo

**Goal:** Show the mobile → cockpit → telemetry → debrief journey end to end.

**In scope:**
- Scripted demo data
- Mock UI clients
- Simulated MQTT messages
- End-to-end flow documentation
- Investor/internal walkthrough script

**Reference:** [`docs/DEMO_SCRIPT.md`](DEMO_SCRIPT.md)

---

## Handoff Protocol

When an agent completes a phase or a task:

1. Update the relevant checklist in this file or in [`TODO.md`](../TODO.md)
2. Add any new assumptions to [`ASSUMPTIONS.md`](../ASSUMPTIONS.md)
3. Add any new next steps to [`TODO.md`](../TODO.md)
4. Ensure schemas are updated if new message types were added
5. Ensure `DEMO_SCRIPT.md` is updated if new user journeys were added

Future agents should be able to resume work entirely from the repository — no oral context should be required.

---

## Related Documents

- [`../DORONI_SOUL_AI_BOOTUP_PROMPT.md`](../DORONI_SOUL_AI_BOOTUP_PROMPT.md) — original project definition
- [`PRODUCT_VISION.md`](PRODUCT_VISION.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)
- [`../ASSUMPTIONS.md`](../ASSUMPTIONS.md)
- [`../TODO.md`](../TODO.md)
