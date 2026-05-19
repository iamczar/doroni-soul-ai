# Example Conversation — In-Cockpit Voice Commands

**Context:** Alex has taken off and is in cruise. The fly plan to Doroni HQ is loaded and active. Alex issues a series of voice commands via the NavApp.

**Soul mode:** `cruise`  
**Surface:** Cockpit / NavApp  
**Flight phase:** cruise  
**Altitude:** ~1,000 ft AGL  
**Date:** 2026-05-19 — 09:33 local time

---

## Transcript

### Command 1 — Map Mode

**Alex:** "Switch to satellite mode."

**[Intent classified]**
```json
{
  "intent": "nav_set_map_mode",
  "parameters": { "map_mode": "satellite" },
  "confidence": 0.99,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "Switch to satellite mode.",
  "soul_mode": "cruise"
}
```

**[Validation: Approved — Level 0, no confirmation required]**

**[MQTT published:]** `nav_set_map_mode` → `{ "map_mode": "satellite" }`

**[NavApp: map switches to satellite view]**

**Soul AI:** "Switched to satellite mode."

---

### Command 2 — Temperature Adjustment

**Alex:** "Make it cooler."

**[Intent classified]**
```json
{
  "intent": "climate_adjust_temperature",
  "parameters": { "delta_celsius": -2 },
  "confidence": 0.92,
  "requires_confirmation": false,
  "risk_level": 1,
  "source_text": "Make it cooler.",
  "soul_mode": "cruise"
}
```

**[Validation: Approved — Level 1, 21°C - 2°C = 19°C within range 16–30°C]**

**[MQTT published:]** `climate_adjust_temperature` → `{ "delta_celsius": -2 }`

**Soul AI:** "Adjusting temperature to 19°C."

---

### Command 3 — ETA Query

**Alex:** "What's my ETA?"

**[Intent classified]**
```json
{
  "intent": "nav_get_eta",
  "parameters": {},
  "confidence": 0.99,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "What's my ETA?",
  "soul_mode": "cruise"
}
```

**[MQTT published:]** `nav_get_eta` → `{}`

**[NavApp responds: ETA 7 minutes]**

**Soul AI:** "7 minutes to Doroni HQ. On track."

---

### Command 4 — Lighting

**Alex:** "Set ambient lighting to blue."

**[Intent classified]**
```json
{
  "intent": "lighting_set_ambient_rgb",
  "parameters": { "rgb": "#0000FF", "brightness_percent": 70 },
  "confidence": 0.95,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "Set ambient lighting to blue.",
  "soul_mode": "cruise"
}
```

**[Validation: Approved — Level 0]**

**[MQTT published:]** `lighting_set_ambient_rgb` → `{ "rgb": "#0000FF", "brightness_percent": 70 }`

**Soul AI:** "Ambient lighting set to blue."

---

### Command 5 — Zoom

**Alex:** "Zoom in."

**[Intent classified]**
```json
{
  "intent": "nav_zoom_control",
  "parameters": { "action": "zoom_in" },
  "confidence": 0.99,
  "requires_confirmation": false,
  "risk_level": 0,
  "source_text": "Zoom in.",
  "soul_mode": "cruise"
}
```

**[MQTT published:]** `nav_zoom_control` → `{ "action": "zoom_in" }`

**Soul AI:** "Zoomed in."

---

### Command 6 — Route Advisory (Level 3 — Confirmation Required)

**Alex:** "Avoid that weather ahead."

**[Intent classified]**
```json
{
  "intent": "mission_request_route_adjustment",
  "parameters": { "reason": "weather_avoidance" },
  "confidence": 0.81,
  "requires_confirmation": true,
  "risk_level": 3,
  "source_text": "Avoid that weather ahead.",
  "soul_mode": "cruise"
}
```

**[Validation: Level 3 — requires pilot confirmation before submitting route change]**

**Soul AI:** "I can suggest a 15° bearing change to the right to avoid the cloud buildup ahead — estimated 2 minutes additional flight time. Confirm?"

**Alex:** "Confirm."

**[MQTT published:]** `nav_set_route` → updated route with bearing change

**Soul AI:** "Route updated. New heading 200°. ETA revised to 9 minutes."

---

### Command 7 — Out-of-Range Parameter (Blocked)

**Alex:** "Set temperature to 38 degrees."

**[Intent classified]**
```json
{
  "intent": "climate_set_temperature",
  "parameters": { "temperature_celsius": 38 },
  "confidence": 0.98,
  "requires_confirmation": false,
  "risk_level": 1,
  "source_text": "Set temperature to 38 degrees.",
  "soul_mode": "cruise"
}
```

**[Validation: Blocked — 38°C exceeds maximum allowed 30°C]**

**[MQTT published:]** `system_command_rejected` → reason: "38°C exceeds allowed maximum of 30°C"

**Soul AI:** "I can't set the temperature that high — the cabin maximum is 30°C. Would you like me to set it to 30°C instead?"

---

## Command Summary

| Command | Intent | Risk | Result |
|---|---|---|---|
| "Switch to satellite mode." | `nav_set_map_mode` | 0 | Executed |
| "Make it cooler." | `climate_adjust_temperature` | 1 | Executed |
| "What's my ETA?" | `nav_get_eta` | 0 | Executed |
| "Set ambient lighting to blue." | `lighting_set_ambient_rgb` | 0 | Executed |
| "Zoom in." | `nav_zoom_control` | 0 | Executed |
| "Avoid that weather ahead." | `mission_request_route_adjustment` | 3 | Confirmed then executed |
| "Set temperature to 38 degrees." | `climate_set_temperature` | 1 | Blocked (out of range) |

---

## Related

- [`docs/INTENT_SCHEMA.md`](../../docs/INTENT_SCHEMA.md)
- [`docs/SAFETY_BOUNDARIES.md`](../../docs/SAFETY_BOUNDARIES.md)
- [`docs/MQTT_MESSAGE_SPEC.md`](../../docs/MQTT_MESSAGE_SPEC.md)
- [`docs/DEMO_SCRIPT.md`](../../docs/DEMO_SCRIPT.md) — Journey 4
