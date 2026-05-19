# Mobile Mock — Prototype

**Phase:** 2 (Mobile Soul Prototype)  
**Status:** Not yet implemented

---

## Purpose

The Mobile Mock simulates the Doroni companion app's interaction with the Soul Orchestrator. It provides a lightweight frontend (or CLI interface) to test the mobile-side journeys — morning briefing, aircraft preparation, fly plan generation, and cockpit handoff — without building a full mobile app.

---

## Planned Responsibilities

- Render Soul AI responses in a simple UI or CLI
- Send user input (text or simulated taps) to the Soul Orchestrator
- Display morning briefing output
- Display fly plan cards
- Display aircraft readiness state
- Simulate notification receipt
- Trigger cabin preparation commands
- Trigger cockpit handoff

---

## Mock Data (Fixtures)

The mobile mock uses fixture files to simulate external data sources:

```
mobile_mock/
  fixtures/
    calendar.json           — Mock calendar events
    saved_locations.json    — User's saved destinations
    aircraft_state.json     — Current mock aircraft state
    user_profile.json       — Mock user preferences
```

---

## Example Fixture: calendar.json

```json
{
  "user_id": "alex-uuid",
  "events": [
    {
      "event_id": "event-001",
      "title": "Team meeting — Doroni HQ",
      "start_time": "2026-05-19T10:00:00",
      "end_time": "2026-05-19T11:00:00",
      "location": "Doroni HQ"
    }
  ]
}
```

---

## Planned Technology

- Option A: Simple HTML/JS single-page app (served locally)
- Option B: Python CLI (click or rich library)
- Option C: React Native stub (for later phases)

Phase 2 prototype preference: Python CLI or minimal HTML for speed.

---

## Planned Modules

```
mobile_mock/
  main.py (or index.html)     — Mock app entry point
  soul_client.py              — HTTP client to Soul Orchestrator
  briefing_view.py            — Display morning briefing
  flyplan_view.py             — Display fly plan
  aircraft_view.py            — Display aircraft readiness
  notification_simulator.py   — Simulate push notifications
  fixtures/
  tests/
```

---

## References

- [`docs/PRD.md`](../../docs/PRD.md) — Journey 1 and Journey 2
- [`examples/conversations/mobile_daily_briefing.md`](../../examples/conversations/mobile_daily_briefing.md)
- [`schemas/domain/mission.schema.json`](../../schemas/domain/mission.schema.json)
- [`docs/SOUL_MODES.md`](../../docs/SOUL_MODES.md) — `away_from_aircraft` mode
