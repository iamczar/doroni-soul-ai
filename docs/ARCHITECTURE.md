# Soul AI — System Architecture

**Version:** 0.1 (Phase 0 — Ideation)

---

## Architectural Principle

> Mobile, cockpit, simulator, and web clients should all connect to a shared Soul orchestration layer.

Soul AI must not be re-implemented on each surface. Intelligence, context, and state live in the Soul Orchestrator and its supporting engines. Clients are thin: they send user input and render Soul output.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│                                                             │
│   Mobile App    Cockpit/NavApp   Simulator Bridge   Web     │
└─────────────────────────┬───────────────────────────────────┘
                          │  REST / WebSocket / MQTT
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Soul Orchestrator                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Intent Engine │  │Context Engine│  │Safety/Validation │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ Mission Planner│  │Pilot Profile Eng│  │Telemetry Eng│  │
│  └────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Integration Layer                         │
│                                                             │
│  MQTT Gateway   NavApp   Vehicle Systems   Calendar         │
│  Weather API    Maps API  Simulator APIs   Storage          │
└─────────────────────────────────────────────────────────────┘
```

---

## Services

### Soul Orchestrator

The central intelligence service. All client surfaces communicate with this service.

**Responsibilities:**
- Receive user text or voice transcript
- Classify intent using the Intent Engine
- Load context from the Context Engine
- Validate command against the Safety/Validation Layer
- Generate natural language response
- Emit structured system command to the appropriate downstream service

**Inputs:** user text, session metadata, mode
**Outputs:** Soul response string, structured intent object, MQTT command

**Implementation path:** [`prototypes/soul_orchestrator/`](../prototypes/soul_orchestrator/)

---

### Context Engine

Provides the Soul Orchestrator with the current world state.

**Responsibilities:**
- Store and retrieve user preferences and profile
- Store and retrieve aircraft state (battery, cabin, lock, readiness)
- Store and retrieve active mission
- Store and retrieve recent telemetry summary
- Maintain current Soul mode

**Data models:**
- [`schemas/domain/user_profile.schema.json`](../schemas/domain/user_profile.schema.json)
- [`schemas/domain/aircraft_state.schema.json`](../schemas/domain/aircraft_state.schema.json)
- [`schemas/domain/mission.schema.json`](../schemas/domain/mission.schema.json)

---

### Intent Engine

Translates natural language into structured intent objects.

**Responsibilities:**
- Classify user input into a typed intent
- Extract parameters (temperature delta, destination name, RGB values, etc.)
- Assign confidence score
- Flag whether confirmation is required
- Assign risk level

**Output schema:** [`schemas/intents/soul_intent.schema.json`](../schemas/intents/soul_intent.schema.json)

---

### Safety / Validation Layer

Every intent passes through this layer before execution.

**Responsibilities:**
- Check risk level against current Soul mode
- Validate parameters against allowed ranges
- Block flight-authoritative commands
- Require confirmation for Level 2+ commands
- Convert high-risk intents to advisory-only responses
- Log rejected commands

**Reference:** [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)

---

### MQTT Gateway

Translates validated intent objects into system messages for NavApp and vehicle-adjacent systems.

**Responsibilities:**
- Publish validated commands to NavApp/vehicle MQTT topics
- Subscribe to system state topics
- Normalize incoming state updates into Context Engine format
- Enforce message schema on outgoing messages

**Message spec:** [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md)
**Schemas:** [`schemas/mqtt/`](../schemas/mqtt/)
**Implementation path:** [`prototypes/mqtt_gateway/`](../prototypes/mqtt_gateway/)

---

### Mission Planner

Generates structured fly plans from calendar events and destinations.

**Responsibilities:**
- Create fly plan from calendar events and saved locations
- Produce fly-vs-drive recommendation
- Calculate departure time
- Generate pre-flight briefing
- Identify route risk flags

**Output schema:** [`schemas/domain/mission.schema.json`](../schemas/domain/mission.schema.json)
**Implementation path:** [`prototypes/soul_orchestrator/`](../prototypes/soul_orchestrator/)

---

### Telemetry Ingestion Service

Ingests telemetry frames from simulators and real aircraft.

**Responsibilities:**
- Receive high-frequency telemetry frames
- Store flight sessions
- Produce summary metrics (smoothness, altitude stability, approach consistency)
- Feed Pilot Profile Engine

**Frame schema:** [`schemas/domain/telemetry_frame.schema.json`](../schemas/domain/telemetry_frame.schema.json)
**Implementation path:** [`prototypes/simulator_bridge/`](../prototypes/simulator_bridge/)

---

### Pilot Profile Engine

Maintains the persistent pilot profile and generates debriefs.

**Responsibilities:**
- Update pilot profile after each session
- Calculate smoothness, stability, and consistency scores
- Detect skill gaps and trends
- Generate debrief narrative
- Recommend training focus

**Profile schema:** [`schemas/domain/pilot_profile.schema.json`](../schemas/domain/pilot_profile.schema.json)
**Implementation path:** [`prototypes/soul_orchestrator/`](../prototypes/soul_orchestrator/)

---

## Client Surfaces

### Mobile App

- Communicates with Soul Orchestrator via REST/WebSocket
- Renders Soul response text and notifications
- Sends user input (text and taps) to orchestrator
- Displays fly plan, briefing cards, debrief cards, pilot profile

**Mock:** [`prototypes/mobile_mock/`](../prototypes/mobile_mock/)

---

### Cockpit / NavApp

- Communicates with Soul Orchestrator via REST/WebSocket
- Subscribes to MQTT topics for system commands
- Renders Soul transcript overlay and animation
- Forwards voice transcript to orchestrator

**Mock:** [`prototypes/navapp_mock/`](../prototypes/navapp_mock/)

---

### Simulator Bridge

- Connects to Microsoft Flight Simulator, X-Plane, or Embention Autopilot
- Streams telemetry frames to Telemetry Ingestion Service
- Signals session start and stop

**Mock:** [`prototypes/simulator_bridge/`](../prototypes/simulator_bridge/)

---

## Data Flow — Cockpit Voice Command

```
User speaks → Voice recognition → text transcript
      ↓
NavApp / Cockpit Client
      ↓ POST /soul/input
Soul Orchestrator
      ↓
Intent Engine → soul_intent object (intent, parameters, risk_level)
      ↓
Safety/Validation Layer → approved / rejected / confirmation required
      ↓
MQTT Gateway → MQTT message published to NavApp topic
      ↓
NavApp executes command (e.g. map mode changes)
      ↓
Soul Orchestrator → response string → NavApp transcript overlay
```

---

## Data Flow — Mobile Morning Briefing

```
User opens mobile app
      ↓
Soul Orchestrator loads context (calendar, aircraft, weather)
      ↓
Mission Planner generates fly plan
      ↓
Response: daily summary + fly plan + departure recommendation
      ↓
User confirms → Mission object created
      ↓
Aircraft preparation commands sent via MQTT Gateway
      ↓
Mission sent to cockpit → Cockpit Client loads fly plan
```

---

## Technology Notes (Phase 0 — Prototype Only)

These are starting-point suggestions, not final decisions.

| Component | Prototype approach | Notes |
|---|---|---|
| Soul Orchestrator | Python FastAPI or Node.js Express | Lightweight, mockable |
| LLM integration | Anthropic Claude API (claude-sonnet-4-6) | Intent classification + response generation |
| MQTT broker | Mosquitto (local) | For prototype only |
| Context storage | In-memory or SQLite | Not for production |
| Telemetry ingestion | UDP or WebSocket listener | Matches simulator output formats |
| Mobile mock | Simple HTML/JS or React Native stub | Not a full app |
| NavApp mock | Simple HTML/JS | Not the real NavApp |

Production infrastructure decisions are deferred to Phase 5+.

---

## Related Documents

- [`PRODUCT_VISION.md`](PRODUCT_VISION.md)
- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)
- [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md)
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md)
- [`AGENT_WORKFLOW.md`](AGENT_WORKFLOW.md)
