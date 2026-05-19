# NavApp Mock — Prototype

**Phase:** 1 (NavApp Voice Brain Prototype)  
**Status:** Not yet implemented

---

## Purpose

The NavApp Mock simulates the Doroni cockpit NavApp's interaction with the Soul Orchestrator and MQTT Gateway. It provides a lightweight interface to test in-cockpit voice command flows — sending text input to the Soul Orchestrator and displaying the resulting MQTT commands and Soul responses.

This mock does not replace the real NavApp. It demonstrates the command flow and validates that intent classification, safety validation, and MQTT message generation work correctly.

---

## Planned Responsibilities

- Accept simulated voice transcript input (text field)
- Display current Soul mode selector
- Forward input to Soul Orchestrator via REST
- Display the returned Soul response string
- Display the returned intent object
- Display the validated MQTT command object
- Display validation result (approved / rejected / confirmation_required)
- Simulate Soul animation states (text indicator)
- Simulate transcript overlay (text display)

---

## Planned UI (Minimal HTML/JS)

```
┌─────────────────────────────────────────────────┐
│  DORONI SOUL AI — NavApp Mock                   │
│                                                  │
│  Mode: [cruise ▼]                               │
│                                                  │
│  Input: _________________________ [Send]         │
│                                                  │
│  Soul response:                                  │
│  > Adjusting temperature to 19°C.               │
│                                                  │
│  Intent:                                         │
│  { "intent": "climate_adjust_temperature", ... } │
│                                                  │
│  MQTT command:                                   │
│  { "message_id": "climate_adjust_temperature", } │
│                                                  │
│  Validation: ✓ approved                          │
└─────────────────────────────────────────────────┘
```

---

## Planned Technology

- Simple HTML + JavaScript (fetch API to Soul Orchestrator)
- No framework required for Phase 1
- Served via Python http.server or equivalent

---

## Planned Modules

```
navapp_mock/
  index.html              — Single-page mock NavApp UI
  app.js                  — Soul Orchestrator API calls + display logic
  style.css               — Minimal styling
  tests/
    test_commands.json    — Batch test input scenarios
```

---

## Test Scenarios

The mock should support a batch test mode that replays a set of test commands and validates the output:

```json
[
  { "text": "Make it cooler.", "soul_mode": "cruise", "expected_intent": "climate_adjust_temperature" },
  { "text": "Switch to satellite mode.", "soul_mode": "cruise", "expected_intent": "nav_set_map_mode" },
  { "text": "What's my ETA?", "soul_mode": "cruise", "expected_intent": "nav_get_eta" },
  { "text": "Set temperature to 38 degrees.", "soul_mode": "cruise", "expected_validation": "rejected" }
]
```

---

## References

- [`docs/PRD.md`](../../docs/PRD.md) — Journey 3 and Journey 4
- [`examples/conversations/cockpit_commands.md`](../../examples/conversations/cockpit_commands.md)
- [`docs/INTENT_SCHEMA.md`](../../docs/INTENT_SCHEMA.md)
- [`docs/MQTT_MESSAGE_SPEC.md`](../../docs/MQTT_MESSAGE_SPEC.md)
- [`docs/SOUL_MODES.md`](../../docs/SOUL_MODES.md) — cockpit modes
