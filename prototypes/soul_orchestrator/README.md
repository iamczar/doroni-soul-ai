# Soul Orchestrator — Prototype

**Phase:** 1 (NavApp Voice Brain Prototype)  
**Status:** Not yet implemented

---

## Purpose

The Soul Orchestrator is the central intelligence service for Soul AI. All client surfaces (mobile, cockpit, simulator) communicate with this service.

In the Phase 1 prototype, it accepts text input and current Soul mode, classifies the user's intent using the Claude API, validates the intent against the Safety/Validation Layer, and returns a response string and a validated MQTT-format command object.

---

## Planned Inputs

```
POST /soul/input
{
  "text": "Make it cooler.",
  "soul_mode": "cruise",
  "session_id": "session-uuid",
  "user_id": "user-uuid"
}
```

---

## Planned Outputs

```json
{
  "response": "Adjusting temperature to 19°C.",
  "intent": {
    "intent": "climate_adjust_temperature",
    "parameters": { "delta_celsius": -2 },
    "confidence": 0.92,
    "risk_level": 1,
    "requires_confirmation": false
  },
  "mqtt_command": {
    "source": "soul_ai",
    "target": "navapp",
    "message_id": "climate_adjust_temperature",
    "correlation_id": "generated-uuid",
    "timestamp": "2026-05-19T09:30:00Z",
    "risk_level": 1,
    "payload": { "delta_celsius": -2 }
  },
  "validation_result": "approved"
}
```

---

## Planned Technology

- Language: Python (FastAPI) or Node.js (Express)
- LLM: Anthropic Claude API (`claude-sonnet-4-6`) for intent classification and response generation
- Storage: In-memory context (SQLite for persistence if needed)

---

## Planned Modules

```
soul_orchestrator/
  main.py (or index.js)        — FastAPI/Express entry point
  intent_engine.py             — LLM-based intent classification
  safety_validator.py          — Risk level and parameter validation
  context_engine.py            — User, aircraft, mission context store
  response_generator.py        — Natural language response generation
  mqtt_formatter.py            — Intent → MQTT message translation
  schemas/                     — Local schema references
  tests/                       — Unit and integration tests
```

---

## Phase 1 Scope

Supported intents in Phase 1:
- Climate: `climate_set_temperature`, `climate_adjust_temperature`, `climate_set_fan_speed`
- Lighting: `lighting_set_ambient_rgb`, `lighting_set_ambient_brightness`, `lighting_set_knob_light_state`
- Navigation: `nav_set_destination`, `nav_get_eta`, `nav_zoom_control`, `nav_set_map_mode`
- UI: `ui_soul_transcript_update`, `ui_soul_animation_state`

---

## References

- [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
- [`docs/INTENT_SCHEMA.md`](../../docs/INTENT_SCHEMA.md)
- [`docs/SAFETY_BOUNDARIES.md`](../../docs/SAFETY_BOUNDARIES.md)
- [`schemas/intents/soul_intent.schema.json`](../../schemas/intents/soul_intent.schema.json)
- [`schemas/mqtt/`](../../schemas/mqtt/)
