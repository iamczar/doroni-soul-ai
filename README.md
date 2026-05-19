# Doroni Soul AI

**Soul AI is Doroni's cross-platform intelligent mobility companion — planning the user's day on mobile, preparing the aircraft before arrival, assisting inside the cockpit, and learning from every flight.**

---

## What is Soul AI?

Soul AI is not a generic chatbot. It is the intelligent personality layer of the Doroni eVTOL ecosystem. It understands the user, the aircraft, the mission, the route, the environment, and the cockpit state — and it adapts its behaviour to the operational context.

Soul AI makes Doroni feel like a living intelligent mobility ecosystem, not just an aircraft with a voice assistant.

---

## Product Pillars

### Pillar 1 — Personal Flight Concierge (Mobile)
Calendar-aware daily planning, fly plan generation, fly-vs-drive decisions, weather awareness, departure recommendations, proactive notifications.

### Pillar 2 — Cockpit Command Companion (NavApp)
Voice command processing, climate control, lighting, map navigation, destination setting, real-time briefings, adaptive chatter based on flight phase.

### Pillar 3 — Flight Intelligence & Coaching (Simulator + Telemetry)
Telemetry ingestion from Microsoft Flight Simulator, X-Plane, and Embention Autopilot. Pilot profile generation, skill-gap detection, post-flight debriefs, training recommendations.

---

## Architecture Overview

```
Mobile App  |  Cockpit / NavApp  |  Simulator Bridge  |  Web / Admin Portal
                              |
                     Soul API / Soul Orchestrator
                              |
         Context Engine · Intent Engine · Safety/Validation Layer
         Mission Planning Engine · Pilot Profile Engine · Telemetry Engine
                              |
     MQTT · Vehicle Systems · NavApp · Calendar · Weather · Maps · Simulator
```

Soul AI has one shared intelligence layer. Mobile, cockpit, and simulator are clients — not separate brains.

---

## Safety Principle

> **Soul AI proposes. Deterministic systems validate. The pilot remains authority.**

Soul AI is advisory and supervisory, not flight-authoritative. Every command passes through a validation and risk-level check before execution. See [`docs/SAFETY_BOUNDARIES.md`](docs/SAFETY_BOUNDARIES.md).

---

## Repository Structure

```
README.md
ASSUMPTIONS.md
TODO.md
docs/
  PRODUCT_VISION.md
  PRD.md
  ARCHITECTURE.md
  SAFETY_BOUNDARIES.md
  SOUL_MODES.md
  MQTT_MESSAGE_SPEC.md
  INTENT_SCHEMA.md
  DEMO_SCRIPT.md
  AGENT_WORKFLOW.md
schemas/
  mqtt/          — JSON schemas for MQTT message payloads
  intents/       — JSON schema for Soul AI intent objects
  domain/        — JSON schemas for core domain models
examples/
  conversations/ — example dialogue transcripts
  mqtt_messages/ — example MQTT message JSON files
prototypes/
  soul_orchestrator/
  mqtt_gateway/
  simulator_bridge/
  mobile_mock/
  navapp_mock/
```

---

## Key Documents

| Document | Purpose |
|---|---|
| [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md) | Product north star and three pillars |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements and user journeys |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Service map and data flow |
| [`docs/SAFETY_BOUNDARIES.md`](docs/SAFETY_BOUNDARIES.md) | What Soul AI may and must never do |
| [`docs/SOUL_MODES.md`](docs/SOUL_MODES.md) | Operational mode behaviour |
| [`docs/MQTT_MESSAGE_SPEC.md`](docs/MQTT_MESSAGE_SPEC.md) | Message envelope and all message categories |
| [`docs/INTENT_SCHEMA.md`](docs/INTENT_SCHEMA.md) | Intent model and risk-level handling |
| [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md) | Five user journeys as scripted walkthrough |
| [`docs/AGENT_WORKFLOW.md`](docs/AGENT_WORKFLOW.md) | Agent roles, rules, and phase roadmap |

---

## Implementation Phases

| Phase | Goal | Status |
|---|---|---|
| Phase 0 | Repo foundation: docs, schemas, examples | In progress |
| Phase 1 | NavApp Voice Brain Prototype | Planned |
| Phase 2 | Mobile Soul Prototype | Planned |
| Phase 3 | Mission / Fly Plan Prototype | Planned |
| Phase 4 | Simulator Telemetry Prototype | Planned |
| Phase 5 | Integrated Demo | Planned |

---

## Current Status

This repository is in **Phase 0 — ideation and prototyping**. The goal is a well-structured repository with product artifacts, system architecture, message schemas, and prototype implementation paths. This is not production-certified flight software.

See [`TODO.md`](TODO.md) for the next implementation steps.
