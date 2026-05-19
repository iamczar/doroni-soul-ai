# Doroni Soul AI — Project Bootup Prompt

Use this file as the starting prompt for any AI coding agent working on the **Doroni Soul AI** project.

This project is currently in ideation/prototyping mode. The immediate goal is not to build production-certified flight software. The goal is to create a well-structured repository, product artifacts, system architecture, message schemas, and prototype implementation paths for Soul AI as a cross-platform intelligent assistant in the Doroni ecosystem.

---

## 1. Project Identity

**Project name:** Doroni Soul AI  
**Product domain:** Personal aviation, eVTOL cockpit experience, mobility assistant, simulator intelligence, pilot profiling, AI-assisted HMI  
**Primary surfaces:**

1. Doroni H1-X cockpit / NavApp
2. Doroni companion mobile app
3. Simulator integrations
4. Cloud/backend orchestration services
5. Future web/admin portal

Soul AI is not a generic chatbot. It is the intelligent personality layer of the Doroni ecosystem.

It should understand:

- the user
- the aircraft
- the mission
- the route
- the environment
- the cockpit state
- the user’s calendar and mobility needs
- the user’s flight history and pilot profile
- the wider Doroni ecosystem

---

## 2. Product Vision

Soul AI should feel like a Doroni-specific version of a premium flight companion: something in the spirit of Jarvis, but grounded in aviation, cockpit awareness, mobility planning, and Doroni’s ecosystem.

Recommended product definition:

> **Soul AI is Doroni’s cross-platform intelligent mobility companion — planning the user’s day on mobile, preparing the aircraft before arrival, assisting inside the cockpit, and learning from every flight.**

Soul AI should help users move through their day using Doroni safely, intelligently, and personally.

It should eventually support:

- daily mobility planning
- flight and drive route planning
- cockpit voice control
- NavApp interaction
- cabin comfort control
- aircraft preparation
- pre-flight briefing
- real-time mission awareness
- simulator telemetry ingestion
- pilot profile generation
- post-flight debriefing
- personalized training recommendations

---

## 3. Core Product Pillars

Soul AI should be shaped around three product pillars.

### Pillar 1 — Personal Flight Concierge

This is the mobile-first and planning-first side of Soul AI.

Example user questions:

- “What does my day look like?”
- “Can I fly to all my meetings today?”
- “What time should I leave?”
- “Should I fly or drive?”
- “Prepare the aircraft.”
- “Find a coffee stop on the way.”
- “Can I stop for groceries without a big detour?”

Core functions:

- calendar-aware daily planning
- Fly Plan generation
- multi-stop mobility planning
- fly-vs-drive comparison
- route feasibility
- weather and airspace awareness
- aircraft readiness summary
- departure recommendations
- proactive mobile notifications

---

### Pillar 2 — Cockpit Command Companion

This is the in-cockpit NavApp and HMI side of Soul AI.

Current / near-term feature areas:

- AC management
- fan speed control
- temperature control
- remote/manual door lock-unlock synchronization
- destination selection
- voice “Go-To” commands
- standard map / satellite map toggle
- zoom in / zoom out
- Soul AI animation overlay
- real-time text transcription overlay
- knob lights
- interior ambient lighting
- duct lights
- RGB and brightness control

Example user commands:

- “Take me home.”
- “Set cabin temperature to 21.”
- “Make it cooler.”
- “Switch to satellite mode.”
- “Zoom in.”
- “Set ambient lighting to blue.”
- “Unlock the door.”
- “What’s my ETA?”
- “Give me a flight briefing.”
- “Any hazards on the route?”

---

### Pillar 3 — Flight Intelligence & Coaching

This is the telemetry, simulator, and pilot profiling side of Soul AI.

Target integrations:

- Microsoft Flight Simulator
- X-Plane
- Embention Autopilot
- future Doroni telemetry interfaces

Telemetry data may include:

- latitude
- longitude
- altitude
- ground speed
- pitch
- roll
- yaw
- heading
- joystick inputs
- control smoothness
- battery / energy state where available
- warning/event data
- flight phase
- route deviation
- simulator session data

Soul AI should eventually use telemetry to build a pilot profile, identify skill gaps, and generate post-flight or post-simulator debriefs.

Example coaching outputs:

- “Your roll inputs were smoother today.”
- “You tend to overcorrect during descent.”
- “Your approach was steeper than your previous average.”
- “You maintained stable altitude for 83% of cruise.”
- “Recommended next simulator exercise: approach stabilization in crosswind.”

---

## 4. Cross-Platform Model

Soul AI should exist across multiple surfaces, but it should not have separate brains on each surface.

Recommended architecture principle:

> Mobile, cockpit, simulator, and web clients should all connect to a shared Soul orchestration layer.

Suggested conceptual architecture:

```text
Mobile App
Cockpit / NavApp
Simulator Bridge
Web / Admin Portal
        |
        v
Soul API / Soul Orchestrator
        |
        v
Context Engine
Intent Engine
Safety / Validation Layer
Mission Planning Engine
Pilot Profile Engine
Telemetry Engine
        |
        v
MQTT / Vehicle Systems / NavApp / Calendar / Weather / Maps / Simulator
```

The mobile app and cockpit should be clients of Soul, not separate implementations of Soul intelligence.

---

## 5. Soul AI Modes

Soul AI must behave differently depending on operational context.

Recommended modes:

| Mode | Primary Surface | Behaviour |
|---|---|---|
| Away from aircraft | Mobile | conversational, planning-focused, proactive |
| Near aircraft | Mobile + cockpit | preparation, readiness, handoff |
| Parked cockpit | Cockpit/NavApp | conversational but concise |
| Pre-flight | Cockpit/NavApp | briefing, checklist, route validation |
| Launch/departure | Cockpit/NavApp | minimal, safety-focused |
| Cruise | Cockpit/NavApp | advisory, navigation, comfort |
| Approach/landing | Cockpit/NavApp | very low chatter, only relevant advisories |
| Post-flight | Mobile | debrief, next steps, session summary |
| Simulator | Simulator + app | coaching, analytics, training |

The assistant should not behave like a normal conversational chatbot during critical flight phases.

---

## 6. Safety Boundary

This project must maintain a clear safety boundary.

For current ideation/prototype stages, define Soul AI as:

> **Advisory and supervisory, not flight-authoritative.**

Soul AI may:

- recommend
- explain
- brief
- warn
- summarize
- generate plans
- control non-critical comfort/UI systems
- trigger approved NavApp commands
- log telemetry
- generate pilot debriefs
- provide route and hazard advisories

Soul AI must not directly:

- control flight surfaces
- override pilot input
- execute flight-critical commands without deterministic validation
- make autonomous flight decisions
- bypass certified avionics, autopilot, or safety systems
- present uncertain AI-generated advice as guaranteed truth

Important design principle:

> **Soul AI proposes. Deterministic systems validate. The pilot remains authority.**

Every command should pass through a validation/safety layer before execution.

---

## 7. Command Risk Levels

Use command risk levels to determine how Soul AI handles different requests.

| Risk Level | Example | Behaviour |
|---|---|---|
| Level 0 | Change lighting | Execute directly |
| Level 1 | Change AC / fan speed | Execute directly if within allowed range |
| Level 2 | Change destination | Confirm if ambiguous |
| Level 3 | Route deviation recommendation | Recommend and ask confirmation |
| Level 4 | Safety-critical advisory | Advisory only, do not execute |
| Level 5 | Flight control authority | Block or hand off to certified system |

The agent should design schemas and validation rules around this hierarchy.

---

## 8. Mobile App Role

The companion mobile app is central to Soul AI.

The mobile app is where Soul AI should handle:

- daily briefing
- calendar review
- Fly Plan preparation
- remote aircraft readiness
- remote cabin preparation
- lock/unlock status
- route sending to cockpit
- user preference management
- push notifications
- flight history
- simulator history
- pilot profile
- post-flight debriefs

Example mobile flow:

1. Soul sends morning notification:
   - “You have a meeting at 10:00. Flying saves 26 minutes. Weather is suitable. I recommend leaving at 9:28.”
2. User taps “Prepare Fly Plan.”
3. Soul checks aircraft readiness and route.
4. Soul offers to precondition cabin.
5. User arrives at aircraft.
6. Cockpit/NavApp receives the prepared mission.
7. Soul switches to cockpit mode.
8. After flight, mobile app receives debrief.

The handoff between mobile and cockpit is a key product experience.

---

## 9. Cockpit / NavApp Role

The cockpit/NavApp version of Soul AI is operationally aware and concise.

It should:

- receive prepared mission context from mobile/cloud
- display Soul animation and transcription
- accept voice commands
- route commands through validated MQTT messages
- show status updates
- support cockpit comfort controls
- support navigation and map UI controls
- provide route/ETA/hazard briefings
- reduce chatter during critical flight phases

The cockpit should not contain the entire Soul intelligence. It should communicate with the Soul orchestration layer and local deterministic services.

---

## 10. Simulator Role

The simulator integration is a strategic differentiator.

The simulator bridge should ingest high-frequency telemetry from:

- Microsoft Flight Simulator
- X-Plane
- Embention Autopilot
- future Doroni simulation environments

The telemetry system should support:

- real-time stream ingestion
- flight session recording
- pilot profile updates
- post-session analysis
- skill-gap detection
- debrief generation
- comparison between simulator sessions and real flight sessions where available

This creates a long-term data moat for Soul AI.

---

## 11. MQTT Message Model

Soul AI should communicate with NavApp and vehicle-adjacent systems using structured messages.

Do not let the LLM directly manipulate UI or system state. The LLM should generate structured intents, which are then validated and translated into system messages.

Recommended generic envelope:

```json
{
  "source": "soul_ai",
  "target": "navapp",
  "message_id": "climate_set_temperature",
  "correlation_id": "uuid-or-session-id",
  "timestamp": "2026-05-19T10:15:00Z",
  "risk_level": 1,
  "payload": {
    "temperature_celsius": 21
  }
}
```

Recommended message categories:

### Climate

- `climate_set_temperature`
- `climate_adjust_temperature`
- `climate_set_fan_speed`
- `climate_get_status`

### Access

- `access_set_lock_state`
- `access_get_lock_state`

### Navigation

- `nav_set_destination`
- `nav_set_route`
- `nav_get_eta`
- `nav_get_current_route`
- `nav_zoom_control`
- `nav_set_map_mode`

### UI

- `ui_soul_transcript_update`
- `ui_soul_animation_state`
- `ui_show_briefing_card`
- `ui_show_warning_card`
- `ui_show_debrief_card`

### Lighting

- `lighting_set_ambient_rgb`
- `lighting_set_ambient_brightness`
- `lighting_set_duct_rgb`
- `lighting_set_duct_brightness`
- `lighting_set_knob_light_state`
- `lighting_get_status`

### Mission

- `mission_create_fly_plan`
- `mission_update_fly_plan`
- `mission_send_to_cockpit`
- `mission_get_briefing`
- `mission_get_status`

### Telemetry

- `telemetry_session_start`
- `telemetry_session_stop`
- `telemetry_frame`
- `telemetry_event`
- `telemetry_get_summary`

### Pilot Profile

- `pilot_profile_get`
- `pilot_profile_update`
- `pilot_profile_get_debrief`
- `pilot_profile_get_training_recommendations`

### System

- `system_status_request`
- `system_status_response`
- `system_error`
- `system_command_rejected`

---

## 12. Intent Model

The assistant should distinguish between natural language input and executable system intents.

Example user input:

> “Make it cooler in here.”

Possible intent:

```json
{
  "intent": "climate_adjust_temperature",
  "parameters": {
    "delta_celsius": -2
  },
  "confidence": 0.92,
  "requires_confirmation": false,
  "risk_level": 1
}
```

Example user input:

> “Take me to Doroni HQ.”

Possible intent:

```json
{
  "intent": "nav_set_destination",
  "parameters": {
    "destination_name": "Doroni HQ"
  },
  "confidence": 0.88,
  "requires_confirmation": true,
  "risk_level": 2
}
```

Example user input:

> “Avoid that weather ahead.”

Possible intent:

```json
{
  "intent": "mission_request_route_adjustment",
  "parameters": {
    "reason": "weather_avoidance"
  },
  "confidence": 0.81,
  "requires_confirmation": true,
  "risk_level": 3
}
```

Risk levels and validation should determine whether the action is executed, confirmed, rejected, or converted into an advisory.

---

## 13. Data Model Concepts

The repository should define conceptual data models for:

### User Profile

- user_id
- name
- preferred_temperature_celsius
- preferred_lighting_mode
- saved_locations
- notification_preferences
- calendar_connections
- privacy_preferences
- assistant_voice_style
- mobility_preferences

### Aircraft State

- aircraft_id
- battery_percent
- range_estimate
- cabin_temperature
- lock_state
- lighting_state
- readiness_state
- active_warnings
- maintenance_state
- current_location

### Mission / Fly Plan

- mission_id
- user_id
- aircraft_id
- calendar_events
- destinations
- route_legs
- fly_vs_drive_decision
- departure_time
- arrival_time
- weather_summary
- airspace_summary
- risk_flags
- recommendation
- cockpit_handoff_state

### Telemetry Session

- session_id
- source
- simulator_or_real
- start_time
- end_time
- aircraft_id
- user_id
- telemetry_frames
- events
- summary_metrics
- debrief_id

### Pilot Profile

- user_id
- total_sessions
- total_flight_time
- simulator_time
- smoothness_score
- approach_consistency_score
- altitude_stability_score
- route_tracking_score
- overcorrection_tendency
- recent_improvements
- recommended_training

---

## 14. Required Repository Artifacts

The first agent should create a repository structure with product and engineering artifacts before writing implementation code.

Recommended initial files:

```text
README.md
docs/
  PRODUCT_VISION.md
  PRD.md
  ROADMAP.md
  ARCHITECTURE.md
  SAFETY_BOUNDARIES.md
  SOUL_MODES.md
  MOBILE_APP_EXPERIENCE.md
  COCKPIT_NAVAPP_EXPERIENCE.md
  SIMULATOR_TELEMETRY.md
  MQTT_MESSAGE_SPEC.md
  INTENT_SCHEMA.md
  PILOT_PROFILE_MODEL.md
  DEMO_SCRIPT.md
  AGENT_WORKFLOW.md
schemas/
  mqtt/
    climate.schema.json
    access.schema.json
    navigation.schema.json
    lighting.schema.json
    mission.schema.json
    telemetry.schema.json
    pilot_profile.schema.json
  intents/
    soul_intent.schema.json
  domain/
    user_profile.schema.json
    aircraft_state.schema.json
    mission.schema.json
    telemetry_frame.schema.json
    pilot_profile.schema.json
examples/
  conversations/
    cockpit_commands.md
    mobile_daily_briefing.md
    post_flight_debrief.md
  mqtt_messages/
    climate_set_temperature.json
    nav_set_destination.json
    lighting_set_ambient_rgb.json
    mission_send_to_cockpit.json
    telemetry_frame.json
prototypes/
  soul_orchestrator/
  mqtt_gateway/
  simulator_bridge/
  mobile_mock/
  navapp_mock/
```

The initial repo does not need to contain all implementations. It should provide clear documentation, schemas, and a prototype path.

---

## 15. Suggested Initial Technical Architecture

The first technical prototype can be simple.

Recommended services:

### Soul Orchestrator

Responsibilities:

- receive user text/voice transcript
- classify intent
- load context
- validate command
- generate response
- emit structured system command

### Context Service

Responsibilities:

- store/retrieve user preferences
- store/retrieve aircraft state
- store/retrieve active mission
- store/retrieve recent telemetry summary

### MQTT Gateway

Responsibilities:

- publish validated commands to NavApp/vehicle topics
- subscribe to system state topics
- normalize incoming state updates

### Mission Planner

Responsibilities:

- create Fly Plan from calendar/destinations
- produce fly-vs-drive recommendation
- generate pre-flight briefing

### Telemetry Ingestion Service

Responsibilities:

- ingest telemetry frames
- store sessions
- produce summary metrics
- feed pilot profile engine

### Pilot Profile Engine

Responsibilities:

- update pilot profile
- calculate smoothness/stability metrics
- generate debrief inputs
- recommend training focus

---

## 16. Implementation Approach

Agents should work in phases.

### Phase 0 — Repo Foundation

Create documentation, schemas, and examples.

Deliverables:

- clear README
- PRD
- architecture doc
- safety boundaries
- MQTT message spec
- intent schema
- demo script
- initial roadmap

### Phase 1 — NavApp Voice Brain Prototype

Goal:

- turn text commands into validated MQTT-style messages

Scope:

- climate commands
- lighting commands
- map mode
- zoom
- set destination
- ETA/status request
- transcript update
- animation state update

Do not implement real flight-critical behaviour.

### Phase 2 — Mobile Soul Prototype

Goal:

- model mobile daily briefing and aircraft preparation flow

Scope:

- mock calendar
- mock saved destinations
- mock aircraft status
- prepare cabin command
- send mission to cockpit command
- basic notification examples

### Phase 3 — Mission / Fly Plan Prototype

Goal:

- generate structured fly plan from mocked daily schedule

Scope:

- calendar events
- destinations
- travel legs
- fly-vs-drive recommendation
- departure time
- risk flags
- cockpit handoff state

### Phase 4 — Simulator Telemetry Prototype

Goal:

- ingest mocked telemetry stream and produce a basic debrief

Scope:

- telemetry frame schema
- session recorder
- basic metrics
- pilot profile update
- debrief generation

### Phase 5 — Integrated Demo

Goal:

- show mobile → cockpit → telemetry → debrief journey

Scope:

- scripted demo data
- mock UI clients
- simulated MQTT messages
- end-to-end flow documentation

---

## 17. Agentic Workflow

Use multiple coding agents with clear roles.

### Product/Requirements Agent

Responsibilities:

- refine product vision
- maintain PRD
- define user journeys
- identify MVP boundaries
- reject scope creep

### Architecture Agent

Responsibilities:

- define service boundaries
- define message flow
- define data models
- maintain architecture docs
- identify safety-critical boundaries

### Schema/API Agent

Responsibilities:

- create JSON schemas
- create MQTT message examples
- create intent schemas
- validate examples against schemas

### Prototype Implementation Agent

Responsibilities:

- build lightweight prototype services
- implement mocked orchestration flows
- write clean, testable code
- avoid premature production complexity

### Test/Review Agent

Responsibilities:

- write tests
- review schemas
- validate command risk levels
- check safety boundary compliance
- flag ambiguous system behaviour

### Demo Agent

Responsibilities:

- create demo scripts
- create sample conversations
- create investor/internal walkthrough
- ensure the product story is coherent

---

## 18. Agent Working Rules

All agents must follow these rules:

1. Read this file first.
2. Do not assume Soul AI is a generic chatbot.
3. Preserve the product principle: Soul AI is Doroni’s intelligent ecosystem layer.
4. Do not implement flight-control authority.
5. Treat safety boundaries as first-class architecture.
6. Use structured intents before actions.
7. Use validated MQTT-style messages before system commands.
8. Keep mobile, cockpit, simulator, and backend as separate surfaces.
9. Keep the Soul Orchestrator as the shared intelligence layer.
10. Prefer documentation and schemas before code.
11. Keep prototypes simple and explicit.
12. Do not hide assumptions. Write them down.
13. When uncertain, create an `ASSUMPTIONS.md` section or issue.
14. Every feature should map to a user journey.
15. Every command should map to a risk level.
16. Every executable command should map to a schema.
17. Every AI-generated recommendation should be distinguishable from deterministic system state.
18. Avoid overbuilding production infrastructure during ideation.
19. Make it easy for future agents to continue the work.
20. Maintain a clear roadmap.

---

## 19. Initial User Journeys to Document

Agents should create documentation for these journeys.

### Journey 1 — Morning Mobile Briefing

User opens mobile app.

Soul says:

> “Good morning. You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes compared with driving. Weather is suitable. I recommend leaving at 9:28.”

User taps:

> “Prepare Fly Plan.”

Expected system outputs:

- daily agenda summary
- route recommendation
- departure time
- fly-vs-drive comparison
- mission object created

---

### Journey 2 — Remote Aircraft Preparation

Soul says:

> “Your H1-X has 88% battery. Cabin is currently 27 degrees. Would you like me to cool it to your preferred 21 degrees?”

User says:

> “Yes, prepare the cabin.”

Expected system outputs:

- climate command
- lighting preference command
- route handoff to cockpit
- aircraft readiness state update

---

### Journey 3 — Cockpit Handoff

User enters cockpit.

Soul says:

> “Welcome. Your Fly Plan is loaded. Destination: Doroni HQ. Estimated flight time: 13 minutes. Ready for briefing?”

User says:

> “Start briefing.”

Expected system outputs:

- NavApp displays mission briefing
- Soul transcript appears
- Soul animation enters briefing state

---

### Journey 4 — In-Cockpit Voice Control

User says:

> “Switch to satellite mode.”

Expected output:

- validated intent
- MQTT message to NavApp
- map mode changes
- Soul confirms action

User says:

> “Make it cooler.”

Expected output:

- climate adjustment intent
- validated temperature command
- Soul confirms new target temperature

---

### Journey 5 — Simulator Debrief

Simulator sends telemetry frames.

After session, Soul says:

> “Session complete. You maintained stable altitude for 83% of cruise. Your approach was slightly steeper than your previous average.”

Expected outputs:

- telemetry session summary
- pilot profile update
- debrief card
- recommended training focus

---

## 20. Prototype Success Criteria

The first repository milestone is successful when:

- the Soul AI product vision is clear
- docs explain mobile, cockpit, and simulator roles
- safety boundaries are explicit
- MQTT messages are structured
- intent schema exists
- sample conversations exist
- risk levels are documented
- demo script exists
- at least one prototype flow can convert user text into a validated command object
- agents can continue work without needing oral explanation

---

## 21. First Task for Claude Code

Claude Code should begin by creating the repository artifacts, not by building the final product.

### Task

Create the initial Doroni Soul AI repository structure and documentation.

### Instructions

1. Create the file/folder structure listed in section 14.
2. Write the initial content for:
   - `README.md`
   - `docs/PRODUCT_VISION.md`
   - `docs/PRD.md`
   - `docs/ARCHITECTURE.md`
   - `docs/SAFETY_BOUNDARIES.md`
   - `docs/MQTT_MESSAGE_SPEC.md`
   - `docs/INTENT_SCHEMA.md`
   - `docs/DEMO_SCRIPT.md`
   - `docs/AGENT_WORKFLOW.md`
3. Create JSON schema placeholders for the key MQTT and domain schemas.
4. Create example MQTT message JSON files.
5. Create example conversation files for:
   - mobile daily briefing
   - cockpit commands
   - post-flight debrief
6. Keep the implementation minimal.
7. Do not build production services yet.
8. Add an `ASSUMPTIONS.md` file if needed.
9. Add a `TODO.md` file with next implementation steps.
10. Ensure all files are readable by future coding agents.

### Output expected from Claude Code

Claude Code should produce:

- a complete initial repo structure
- meaningful documentation
- valid JSON examples
- clear next steps
- no unnecessary production complexity

---

## 22. First Task for Codex / Review Agent

Codex or another review agent should review the repository after Claude Code creates it.

### Review checklist

Check whether:

- the product vision is preserved
- Soul AI is not treated as a generic chatbot
- mobile/cockpit/simulator surfaces are separated
- safety boundaries are explicit
- MQTT commands are structured
- risky commands require validation or confirmation
- no flight-authoritative behaviour is implemented
- examples align with the user journeys
- schemas are coherent
- the roadmap is realistic
- future agents can continue easily

The review agent should produce:

- a concise architecture review
- product-scope review
- safety-boundary review
- schema consistency review
- prioritized fix list

---

## 23. Important Non-Goals

Do not build these in the first pass:

- certified avionics logic
- autonomous flight-control logic
- real aircraft control
- real user authentication
- real payment/account systems
- real calendar production integration
- real weather/airspace production integration
- full mobile app
- full NavApp rewrite
- complex cloud deployment
- heavy machine learning infrastructure
- production telemetry storage at scale

The first pass is about shaping the product, architecture, schemas, and prototype path.

---

## 24. North Star

The north star for this project:

> Soul AI should make Doroni feel like a living intelligent mobility ecosystem, not just an aircraft with a voice assistant.

Mobile gives Soul continuity.  
Cockpit gives Soul presence.  
Simulator gives Soul intelligence.  
Telemetry gives Soul memory.  
Safety boundaries give Soul credibility.

Build toward that.
