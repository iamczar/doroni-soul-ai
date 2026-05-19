# Soul AI — Intent Schema

**Version:** 0.1 (Phase 0 — Ideation)

---

## Overview

Soul AI separates natural language understanding from system execution.

When a user speaks or types a command, the Intent Engine translates it into a structured **intent object**. This intent object is then passed to the Safety/Validation Layer, which determines whether to execute, confirm, or block the action.

The LLM never directly writes to system state. It generates intent objects. Deterministic systems validate and execute them.

---

## Intent Object Structure

```json
{
  "intent": "climate_adjust_temperature",
  "parameters": {
    "delta_celsius": -2
  },
  "confidence": 0.92,
  "requires_confirmation": false,
  "risk_level": 1,
  "source_text": "Make it cooler.",
  "soul_mode": "cruise",
  "timestamp": "2026-05-19T09:30:00Z",
  "session_id": "session-uuid"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `intent` | string | Yes | Intent type identifier (see intent list below) |
| `parameters` | object | Yes | Intent-specific parameters |
| `confidence` | float | Yes | LLM confidence score 0.0–1.0 |
| `requires_confirmation` | boolean | Yes | Whether the safety layer should ask for pilot confirmation |
| `risk_level` | integer | Yes | 0–5 (see [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)) |
| `source_text` | string | No | Original user utterance |
| `soul_mode` | string | Yes | Current Soul mode at time of intent (see [`SOUL_MODES.md`](SOUL_MODES.md)) |
| `timestamp` | string | Yes | ISO 8601 UTC |
| `session_id` | string | Yes | Active session UUID |

---

## Intent List

### Climate Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `climate_set_temperature` | `temperature_celsius: number` | 1 | No |
| `climate_adjust_temperature` | `delta_celsius: number` | 1 | No |
| `climate_set_fan_speed` | `fan_speed_percent: number` | 1 | No |
| `climate_get_status` | *(none)* | 0 | No |

---

### Access Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `access_set_lock_state` | `lock_state: "locked" \| "unlocked"` | 2 | Yes (unlock) |
| `access_get_lock_state` | *(none)* | 0 | No |

---

### Navigation Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `nav_set_destination` | `destination_name: string`, `coordinates?: object` | 2 | If ambiguous |
| `nav_set_route` | `route_id: string`, `waypoints: array` | 2 | If significant change |
| `nav_get_eta` | *(none)* | 0 | No |
| `nav_get_current_route` | *(none)* | 0 | No |
| `nav_zoom_control` | `action: "zoom_in" \| "zoom_out"` | 0 | No |
| `nav_set_map_mode` | `map_mode: "standard" \| "satellite" \| "terrain"` | 0 | No |
| `mission_request_route_adjustment` | `reason: string` | 3 | Yes |

---

### Lighting Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `lighting_set_ambient_rgb` | `rgb: string`, `brightness_percent?: number` | 0 | No |
| `lighting_set_ambient_brightness` | `brightness_percent: number` | 0 | No |
| `lighting_set_duct_rgb` | `rgb: string`, `brightness_percent?: number` | 0 | No |
| `lighting_set_duct_brightness` | `brightness_percent: number` | 0 | No |
| `lighting_set_knob_light_state` | `enabled: boolean` | 0 | No |
| `lighting_get_status` | *(none)* | 0 | No |

---

### Mission Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `mission_create_fly_plan` | `destinations: array`, `calendar_event_ids?: array` | 0 | No |
| `mission_update_fly_plan` | `mission_id: string`, `updates: object` | 2 | If departure time changes |
| `mission_send_to_cockpit` | `mission_id: string` | 2 | No |
| `mission_get_briefing` | `mission_id?: string` | 0 | No |
| `mission_get_status` | *(none)* | 0 | No |

---

### UI Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `ui_soul_transcript_update` | `transcript: string`, `display_duration_ms?: number` | 0 | No |
| `ui_soul_animation_state` | `animation_state: string` | 0 | No |
| `ui_show_briefing_card` | `card_id: string`, `sections: array` | 0 | No |
| `ui_show_warning_card` | `card_id: string`, `severity: string`, `message: string` | 0 | No |

---

### Telemetry Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `telemetry_session_start` | `source: string`, `simulator_or_real: string` | 0 | No |
| `telemetry_session_stop` | `session_id: string` | 0 | No |

---

### Pilot Profile Intents

| Intent | Parameters | Risk Level | Confirm? |
|---|---|---|---|
| `pilot_profile_get` | `user_id: string` | 0 | No |
| `pilot_profile_get_debrief` | `session_id: string` | 0 | No |
| `pilot_profile_get_training_recommendations` | `user_id: string` | 0 | No |

---

## Intent Examples

### "Make it cooler."

```json
{
  "intent": "climate_adjust_temperature",
  "parameters": {
    "delta_celsius": -2
  },
  "confidence": 0.92,
  "requires_confirmation": false,
  "risk_level": 1,
  "source_text": "Make it cooler.",
  "soul_mode": "cruise",
  "timestamp": "2026-05-19T09:30:00Z",
  "session_id": "session-uuid"
}
```

---

### "Take me to Doroni HQ."

```json
{
  "intent": "nav_set_destination",
  "parameters": {
    "destination_name": "Doroni HQ"
  },
  "confidence": 0.88,
  "requires_confirmation": true,
  "risk_level": 2,
  "source_text": "Take me to Doroni HQ.",
  "soul_mode": "parked_cockpit",
  "timestamp": "2026-05-19T09:15:00Z",
  "session_id": "session-uuid"
}
```

Confirmation is required because changing the destination may affect the active mission. The Safety/Validation Layer will ask the pilot to confirm.

---

### "Avoid that weather ahead."

```json
{
  "intent": "mission_request_route_adjustment",
  "parameters": {
    "reason": "weather_avoidance"
  },
  "confidence": 0.81,
  "requires_confirmation": true,
  "risk_level": 3,
  "source_text": "Avoid that weather ahead.",
  "soul_mode": "cruise",
  "timestamp": "2026-05-19T09:33:00Z",
  "session_id": "session-uuid"
}
```

This generates a recommendation for a route adjustment and requests pilot confirmation before any route change is submitted to NavApp.

---

### "Switch to satellite mode."

```json
{
  "intent": "nav_set_map_mode",
  "parameters": {
    "map_mode": "satellite"
  },
  "confidence": 0.99,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "Switch to satellite mode.",
  "soul_mode": "cruise",
  "timestamp": "2026-05-19T09:31:00Z",
  "session_id": "session-uuid"
}
```

---

## Intent-to-MQTT Mapping

The MQTT Gateway translates an approved intent object into an MQTT message. The mapping is 1-to-1 for most intents:

| Intent | MQTT message_id |
|---|---|
| `climate_set_temperature` | `climate_set_temperature` |
| `climate_adjust_temperature` | `climate_adjust_temperature` |
| `nav_set_destination` | `nav_set_destination` |
| `nav_set_map_mode` | `nav_set_map_mode` |
| `lighting_set_ambient_rgb` | `lighting_set_ambient_rgb` |
| `mission_send_to_cockpit` | `mission_send_to_cockpit` |

Some intents do not map to a single MQTT message:
- `mission_request_route_adjustment` → advisory only; generates a `ui_show_warning_card` and waits for pilot confirmation before generating `nav_set_route`
- Intents with `requires_confirmation: true` are held pending a `ui_confirmation_response` from the NavApp

---

## Handling Ambiguous or Low-Confidence Intents

If confidence is below 0.7:
- Soul AI should ask for clarification rather than guessing
- Example: "I'm not sure what you mean. Did you want to change the temperature or the lighting?"

If an intent cannot be classified:
- Return `intent: "unknown"` with the source text
- Generate a clarifying question

```json
{
  "intent": "unknown",
  "parameters": {},
  "confidence": 0.0,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "Do the thing.",
  "soul_mode": "cruise",
  "timestamp": "2026-05-19T09:34:00Z",
  "session_id": "session-uuid"
}
```

---

## Schema File

Full JSON schema: [`schemas/intents/soul_intent.schema.json`](../schemas/intents/soul_intent.schema.json)

---

## Related Documents

- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md) — risk level definitions and handling rules
- [`MQTT_MESSAGE_SPEC.md`](MQTT_MESSAGE_SPEC.md) — downstream MQTT messages
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Intent Engine in the system
