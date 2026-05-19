# Example Conversation — Mobile Daily Briefing

**Context:** Alex opens the Doroni companion app on a Tuesday morning. Soul AI has already checked the calendar, current aircraft state, and weather forecast.

**Soul mode:** `away_from_aircraft`  
**Surface:** Mobile app  
**Date:** 2026-05-19 — 08:47 local time

---

## Transcript

**[Soul AI — proactive morning card]**

> "Good morning, Alex. You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes compared with driving. Current weather is suitable — clear skies, light southerly wind at 8 knots. I recommend leaving at 9:28."

---

**[System: daily agenda summary displayed]**

```
YOUR DAY
────────────────────────────────
08:47   Now
09:28   Recommended departure
09:41   Arrive Doroni HQ (fly)
10:00   Meeting — Doroni HQ
        [Fly: 13 min vs Drive: 39 min — save 26 min]
────────────────────────────────
Aircraft: H1-X N001DH — 88% battery
Weather:  Clear — CAVOK — Wind 8kt / 180°
```

---

**[Alex taps: "Prepare Fly Plan"]**

> Soul AI: "Generating your Fly Plan."

---

**[System: fly plan generated]**

```
FLY PLAN
────────────────────────────────
From:       Opa-locka Executive Airport
To:         Doroni HQ
Departure:  09:28
Arrival:    ~09:41 (13 min)
Distance:   18nm
Route:      Direct
Weather:    CAVOK — Wind 8kt from 180°
Airspace:   Class G throughout
NOTAMs:     Temporary drone restriction (south, <200ft AGL) — not on route
Battery:    88% — full range available
Risk flags: None
────────────────────────────────
```

**Soul AI:**

> "Fly Plan ready. Departing at 9:28, arriving at approximately 9:41. Would you like me to prepare the aircraft?"

---

**[Alex says: "Yes, prepare the cabin."]**

**Intent classified:**
```json
{
  "intent": "mission_create_fly_plan",
  "parameters": {
    "user_id": "alex-uuid",
    "aircraft_id": "h1x-001",
    "destinations": ["Doroni HQ"],
    "requested_departure_time": "2026-05-19T09:28:00Z"
  },
  "confidence": 0.97,
  "requires_confirmation": false,
  "risk_level": 0
}
```

**Commands sent:**
1. `climate_set_temperature` → `{ "temperature_celsius": 21 }`
2. `lighting_set_ambient_rgb` → `{ "rgb": "#FFD580", "brightness_percent": 40 }`

**Soul AI:**

> "Cooling cabin to your preferred 21°C. Setting morning lighting. I'll send the Fly Plan to the cockpit when you're on your way. Reminder set for 9:20."

---

**[09:20 — Push notification]**

> "Time to head out. Your H1-X is ready at Opa-locka. Cabin is at 21°C. Fly Plan loaded."

---

**[Alex taps: "Send to cockpit"]**

**Command sent:**
- `mission_send_to_cockpit` → `{ "mission_id": "mission-uuid-001" }`

**Soul AI:**

> "Fly Plan sent to your H1-X. The cockpit will be ready when you arrive."

---

## Intent Chain Summary

| Step | User Action | Intent | Risk Level |
|---|---|---|---|
| 1 | Opens app | *(proactive briefing — no intent)* | — |
| 2 | "Prepare Fly Plan" | `mission_create_fly_plan` | 0 |
| 3 | "Yes, prepare the cabin" | `climate_set_temperature` + `lighting_set_ambient_rgb` | 1, 0 |
| 4 | "Send to cockpit" | `mission_send_to_cockpit` | 2 |

---

## Related

- [`docs/DEMO_SCRIPT.md`](../../docs/DEMO_SCRIPT.md) — full demo narrative
- [`examples/mqtt_messages/climate_set_temperature.json`](../mqtt_messages/climate_set_temperature.json)
- [`examples/mqtt_messages/mission_send_to_cockpit.json`](../mqtt_messages/mission_send_to_cockpit.json)
- [`docs/PRD.md`](../../docs/PRD.md) — Journey 1 and Journey 2
