# Soul AI — MQTT Message Specification

**Version:** 0.1 (Phase 0 — Ideation)

---

## Overview

Soul AI communicates with the NavApp and vehicle-adjacent systems using structured MQTT messages. The LLM does not directly manipulate UI or system state. Instead:

1. The LLM generates a structured **intent object**
2. The Safety/Validation Layer approves or rejects it
3. The MQTT Gateway translates the approved intent into a **system message**
4. The system message is published to the appropriate MQTT topic

This separation ensures that AI uncertainty never directly causes system state changes without deterministic validation.

---

## Message Envelope

Every message uses a standard envelope:

```json
{
  "source": "soul_ai",
  "target": "navapp",
  "message_id": "<message_type>",
  "correlation_id": "<uuid-or-session-id>",
  "timestamp": "<ISO8601>",
  "risk_level": 0,
  "payload": {}
}
```

| Field | Type | Description |
|---|---|---|
| `source` | string | Always `"soul_ai"` for Soul-originated messages |
| `target` | string | Target system: `"navapp"`, `"vehicle"`, `"cloud"` |
| `message_id` | string | Message type identifier (see categories below) |
| `correlation_id` | string | UUID linking this message to a user interaction or session |
| `timestamp` | string | ISO 8601 UTC timestamp |
| `risk_level` | integer | Risk level 0–5 (see [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md)) |
| `payload` | object | Message-specific fields |

---

## Message Categories

### Climate

#### `climate_set_temperature`
Set absolute cabin temperature.

```json
{
  "source": "soul_ai",
  "target": "navapp",
  "message_id": "climate_set_temperature",
  "correlation_id": "abc-123",
  "timestamp": "2026-05-19T09:28:00Z",
  "risk_level": 1,
  "payload": {
    "temperature_celsius": 21
  }
}
```

#### `climate_adjust_temperature`
Adjust temperature by a relative delta.

```json
{
  "payload": {
    "delta_celsius": -2
  }
}
```

#### `climate_set_fan_speed`
Set fan speed as a percentage (0–100).

```json
{
  "payload": {
    "fan_speed_percent": 60
  }
}
```

#### `climate_get_status`
Request current climate state.

```json
{
  "payload": {}
}
```

---

### Access

#### `access_set_lock_state`
Set door lock state.

```json
{
  "payload": {
    "lock_state": "unlocked"
  }
}
```

`lock_state` values: `"locked"`, `"unlocked"`

#### `access_get_lock_state`
Request current lock state.

```json
{
  "payload": {}
}
```

---

### Navigation

#### `nav_set_destination`
Set a named or coordinate destination.

```json
{
  "payload": {
    "destination_name": "Doroni HQ",
    "coordinates": {
      "lat": 25.7617,
      "lon": -80.1918
    }
  }
}
```

Either `destination_name` or `coordinates` may be provided; both is preferred.

#### `nav_set_route`
Set the full planned route.

```json
{
  "payload": {
    "route_id": "mission-uuid",
    "waypoints": [
      { "lat": 25.7617, "lon": -80.1918, "name": "Origin" },
      { "lat": 25.7900, "lon": -80.1300, "name": "Doroni HQ" }
    ]
  }
}
```

#### `nav_get_eta`
Request current ETA for the active route.

```json
{
  "payload": {}
}
```

#### `nav_get_current_route`
Request the currently loaded route.

```json
{
  "payload": {}
}
```

#### `nav_zoom_control`
Change map zoom level.

```json
{
  "payload": {
    "action": "zoom_in"
  }
}
```

`action` values: `"zoom_in"`, `"zoom_out"`, `"zoom_to_level"` (with `level` integer)

#### `nav_set_map_mode`
Switch map display mode.

```json
{
  "payload": {
    "map_mode": "satellite"
  }
}
```

`map_mode` values: `"standard"`, `"satellite"`, `"terrain"`

---

### UI

#### `ui_soul_transcript_update`
Update the Soul AI transcript overlay on the NavApp.

```json
{
  "payload": {
    "transcript": "Cabin temperature set to 21°C.",
    "display_duration_ms": 4000
  }
}
```

#### `ui_soul_animation_state`
Control the Soul AI animation overlay state.

```json
{
  "payload": {
    "animation_state": "listening"
  }
}
```

`animation_state` values: `"idle"`, `"listening"`, `"processing"`, `"speaking"`, `"briefing"`, `"warning"`

#### `ui_show_briefing_card`
Display a structured briefing card on the NavApp.

```json
{
  "payload": {
    "card_id": "preflight-briefing-001",
    "title": "Pre-Flight Briefing",
    "sections": [
      { "label": "Destination", "value": "Doroni HQ" },
      { "label": "ETA", "value": "13 minutes" },
      { "label": "Weather", "value": "Clear, 8kt southerly" },
      { "label": "Airspace", "value": "Class G, no restrictions on route" }
    ]
  }
}
```

#### `ui_show_warning_card`
Display a warning card on the NavApp.

```json
{
  "payload": {
    "card_id": "warning-001",
    "severity": "advisory",
    "title": "Airspace Advisory",
    "message": "Restricted zone 3nm ahead. Recommend bearing change.",
    "requires_acknowledgement": true
  }
}
```

`severity` values: `"advisory"`, `"caution"`, `"warning"`

#### `ui_show_debrief_card`
Display a post-flight debrief card.

```json
{
  "payload": {
    "card_id": "debrief-session-001",
    "session_id": "sim-session-uuid",
    "title": "Session Debrief",
    "summary": "Stable cruise. Approach slightly steep.",
    "metrics": [
      { "label": "Altitude stability", "value": "83%" },
      { "label": "Approach deviation", "value": "+4° from average" }
    ],
    "recommendation": "Practice stabilized approaches in crosswind."
  }
}
```

---

### Lighting

#### `lighting_set_ambient_rgb`
Set ambient cabin lighting colour.

```json
{
  "payload": {
    "rgb": "#0000FF",
    "brightness_percent": 70
  }
}
```

#### `lighting_set_ambient_brightness`
Set ambient brightness without changing colour.

```json
{
  "payload": {
    "brightness_percent": 50
  }
}
```

#### `lighting_set_duct_rgb`
Set duct lighting colour.

```json
{
  "payload": {
    "rgb": "#FFFFFF",
    "brightness_percent": 80
  }
}
```

#### `lighting_set_duct_brightness`
Set duct brightness without changing colour.

```json
{
  "payload": {
    "brightness_percent": 60
  }
}
```

#### `lighting_set_knob_light_state`
Enable or disable knob lights.

```json
{
  "payload": {
    "enabled": true
  }
}
```

#### `lighting_get_status`
Request current lighting state.

```json
{
  "payload": {}
}
```

---

### Mission

#### `mission_create_fly_plan`
Create a new fly plan from a set of parameters.

```json
{
  "payload": {
    "user_id": "user-uuid",
    "aircraft_id": "h1x-001",
    "calendar_event_ids": ["event-uuid-1"],
    "destinations": ["Doroni HQ"],
    "requested_departure_time": "2026-05-19T09:28:00Z"
  }
}
```

#### `mission_update_fly_plan`
Update an existing fly plan.

```json
{
  "payload": {
    "mission_id": "mission-uuid",
    "updates": {
      "departure_time": "2026-05-19T09:35:00Z"
    }
  }
}
```

#### `mission_send_to_cockpit`
Hand off the fly plan to the cockpit NavApp.

```json
{
  "payload": {
    "mission_id": "mission-uuid"
  }
}
```

#### `mission_get_briefing`
Request a briefing for the current mission.

```json
{
  "payload": {
    "mission_id": "mission-uuid"
  }
}
```

#### `mission_get_status`
Request current mission status.

```json
{
  "payload": {}
}
```

---

### Telemetry

#### `telemetry_session_start`
Signal start of a telemetry session.

```json
{
  "payload": {
    "session_id": "session-uuid",
    "source": "msfs",
    "user_id": "user-uuid",
    "aircraft_id": "h1x-sim-001",
    "simulator_or_real": "simulator"
  }
}
```

`source` values: `"msfs"`, `"xplane"`, `"embention"`, `"real"`

#### `telemetry_session_stop`
Signal end of a telemetry session.

```json
{
  "payload": {
    "session_id": "session-uuid"
  }
}
```

#### `telemetry_frame`
A single telemetry data point.

```json
{
  "payload": {
    "session_id": "session-uuid",
    "timestamp": "2026-05-19T09:30:00.123Z",
    "lat": 25.7617,
    "lon": -80.1918,
    "altitude_ft": 1000,
    "ground_speed_kts": 85,
    "pitch_deg": 2.1,
    "roll_deg": -0.8,
    "yaw_deg": 185.3,
    "heading_deg": 185.0,
    "flight_phase": "cruise"
  }
}
```

#### `telemetry_event`
A discrete event during a session.

```json
{
  "payload": {
    "session_id": "session-uuid",
    "timestamp": "2026-05-19T09:32:00Z",
    "event_type": "route_deviation",
    "details": {
      "deviation_nm": 1.2,
      "direction": "left"
    }
  }
}
```

#### `telemetry_get_summary`
Request a summary for a completed session.

```json
{
  "payload": {
    "session_id": "session-uuid"
  }
}
```

---

### Pilot Profile

#### `pilot_profile_get`
Request the current pilot profile.

```json
{
  "payload": {
    "user_id": "user-uuid"
  }
}
```

#### `pilot_profile_update`
Trigger an update to the pilot profile after a session.

```json
{
  "payload": {
    "user_id": "user-uuid",
    "session_id": "session-uuid"
  }
}
```

#### `pilot_profile_get_debrief`
Request a debrief for a specific session.

```json
{
  "payload": {
    "session_id": "session-uuid"
  }
}
```

#### `pilot_profile_get_training_recommendations`
Request current training recommendations.

```json
{
  "payload": {
    "user_id": "user-uuid"
  }
}
```

---

### System

#### `system_status_request`
Request system status from a target.

```json
{
  "payload": {
    "components": ["climate", "lighting", "navigation"]
  }
}
```

#### `system_status_response`
Response to a status request.

```json
{
  "payload": {
    "component": "climate",
    "state": {
      "temperature_celsius": 21,
      "fan_speed_percent": 60
    },
    "timestamp": "2026-05-19T09:28:00Z"
  }
}
```

#### `system_error`
Report an error from a target system.

```json
{
  "payload": {
    "error_code": "CLIMATE_SENSOR_FAULT",
    "message": "Temperature sensor reading unavailable.",
    "severity": "non_critical"
  }
}
```

#### `system_command_rejected`
Report that a command was rejected by the safety layer.

```json
{
  "payload": {
    "rejected_message_id": "climate_set_temperature",
    "correlation_id": "abc-123",
    "reason": "Parameter out of allowed range: 38°C exceeds maximum of 30°C."
  }
}
```

---

## MQTT Topic Structure (Prototype)

For the prototype, topics follow this structure:

```
doroni/soul/{target}/{message_category}/{message_id}
```

Examples:
- `doroni/soul/navapp/climate/climate_set_temperature`
- `doroni/soul/navapp/navigation/nav_set_destination`
- `doroni/soul/navapp/ui/ui_soul_transcript_update`
- `doroni/soul/cloud/mission/mission_send_to_cockpit`
- `doroni/soul/simulator/telemetry/telemetry_frame`

---

## Schema Files

JSON schemas for all message payloads are in [`schemas/mqtt/`](../schemas/mqtt/).

- [`climate.schema.json`](../schemas/mqtt/climate.schema.json)
- [`access.schema.json`](../schemas/mqtt/access.schema.json)
- [`navigation.schema.json`](../schemas/mqtt/navigation.schema.json)
- [`lighting.schema.json`](../schemas/mqtt/lighting.schema.json)
- [`mission.schema.json`](../schemas/mqtt/mission.schema.json)
- [`telemetry.schema.json`](../schemas/mqtt/telemetry.schema.json)
- [`pilot_profile.schema.json`](../schemas/mqtt/pilot_profile.schema.json)

---

## Related Documents

- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md) — risk level definitions
- [`INTENT_SCHEMA.md`](INTENT_SCHEMA.md) — how intents map to MQTT messages
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — MQTT Gateway in the system
