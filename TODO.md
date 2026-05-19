# TODO — Next Implementation Steps

**Current phase:** Phase 0 complete  
**Next phase:** Phase 1 — NavApp Voice Brain Prototype

---

## Phase 0 Checklist (Complete)

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
- [x] `schemas/mqtt/` — all 7 schemas
- [x] `schemas/intents/soul_intent.schema.json`
- [x] `schemas/domain/` — all 5 domain schemas
- [x] `examples/conversations/` — 3 conversation transcripts
- [x] `examples/mqtt_messages/` — 5 MQTT message examples
- [x] `prototypes/*/README.md` — 5 prototype stubs
- [x] `ASSUMPTIONS.md`
- [x] `TODO.md`

---

## Phase 1 — NavApp Voice Brain Prototype

**Goal:** Accept text input, classify intent, validate, return Soul response + MQTT command object.

### Step 1 — Soul Orchestrator: HTTP API skeleton
- [ ] Create `prototypes/soul_orchestrator/` service
- [ ] Implement `POST /soul/input` endpoint
- [ ] Accept: `text`, `soul_mode`, `session_id`, `user_id`
- [ ] Return: `response`, `intent`, `mqtt_command`, `validation_result`
- [ ] Add basic in-memory context (user, aircraft mock state, soul mode)

### Step 2 — Intent Engine: LLM classification
- [ ] Integrate Anthropic Claude API (claude-sonnet-4-6)
- [ ] Design system prompt for intent classification
- [ ] Parse LLM output into `soul_intent` schema format
- [ ] Handle low-confidence and unknown intents
- [ ] Validate output against `schemas/intents/soul_intent.schema.json`

### Step 3 — Safety/Validation Layer
- [ ] Implement risk level checker (block Level 5 always)
- [ ] Implement mode-based permission checker
- [ ] Implement parameter range validator (temperature: 16–30°C, fan: 0–100%, brightness: 0–100%)
- [ ] Return `approved`, `rejected`, or `confirmation_required` with reason

### Step 4 — MQTT Formatter
- [ ] Map intent type → MQTT `message_id`
- [ ] Construct standard message envelope
- [ ] Validate outgoing message against `schemas/mqtt/` schemas
- [ ] Return formatted MQTT command object

### Step 5 — Response Generator
- [ ] Generate natural language response for approved commands
- [ ] Generate clarification questions for `unknown` intents
- [ ] Generate refusal messages for blocked commands
- [ ] Generate confirmation prompts for `requires_confirmation: true` intents

### Step 6 — NavApp Mock UI
- [ ] Create `prototypes/navapp_mock/index.html`
- [ ] Text input + Soul mode selector
- [ ] Display Soul response, intent, MQTT command, validation result
- [ ] Implement batch test mode using fixture scenarios

### Step 7 — Tests
- [ ] Unit tests for Safety/Validation Layer (parameter ranges, risk levels)
- [ ] Unit tests for MQTT Formatter (schema validation)
- [ ] Integration tests for end-to-end intent → MQTT command flow
- [ ] Test all Phase 1 intent types (climate, lighting, navigation, UI)
- [ ] Test rejection scenarios (out-of-range, blocked modes, Level 5 attempt)

---

## Phase 2 — Mobile Soul Prototype

*(Detailed tasks to be added when Phase 1 is complete)*

- [ ] Create `prototypes/mobile_mock/` fixtures (calendar, aircraft, locations, user)
- [ ] Implement morning briefing generation
- [ ] Implement remote cabin preparation flow
- [ ] Implement cockpit handoff flow
- [ ] Create mobile mock UI (CLI or HTML)

---

## Phase 3 — Mission / Fly Plan Prototype

*(Detailed tasks to be added when Phase 2 is complete)*

- [ ] Implement Mission Planner service
- [ ] Calendar → destinations → route legs
- [ ] Fly-vs-drive comparison logic
- [ ] Departure time calculation
- [ ] Risk flag generation
- [ ] Validate output against `schemas/domain/mission.schema.json`

---

## Phase 4 — Simulator Telemetry Prototype

*(Detailed tasks to be added when Phase 3 is complete)*

- [ ] Create `prototypes/simulator_bridge/` mock replay
- [ ] Create JSON fixture for sample simulator session
- [ ] Implement telemetry frame ingestion
- [ ] Implement session recorder
- [ ] Compute smoothness, altitude stability, approach deviation metrics
- [ ] Implement Pilot Profile Engine (update + debrief generation)
- [ ] Validate against `schemas/domain/telemetry_frame.schema.json` and `pilot_profile.schema.json`

---

## Phase 5 — Integrated Demo

*(Detailed tasks to be added when Phase 4 is complete)*

- [ ] Script scripted end-to-end demo data
- [ ] Connect mobile mock → soul orchestrator → navapp mock
- [ ] Connect simulator bridge → telemetry ingestion → pilot profile
- [ ] Update `docs/DEMO_SCRIPT.md` with live demo instructions
- [ ] Investor/internal walkthrough session preparation

---

## Ongoing / Housekeeping

- [ ] Initialize git repository and commit Phase 0 as initial commit
- [ ] Review and resolve open assumptions in `ASSUMPTIONS.md` with relevant SMEs
- [ ] Confirm H1-X temperature range with avionics/hardware team (Assumption A04)
- [ ] Confirm fly-vs-drive default threshold with product/UX (Assumption A05)
- [ ] Confirm simulator telemetry rate requirements (Assumption A13)
- [ ] Review smoothness score algorithm with aviation SME (Assumption A14)

---

## Nice-to-Have (Not Committed)

- Schema versioning and migration strategy
- OpenAPI spec for Soul Orchestrator REST API
- Postman / Bruno collection for API testing
- Dockerfile for soul_orchestrator prototype
- CI pipeline for schema validation
