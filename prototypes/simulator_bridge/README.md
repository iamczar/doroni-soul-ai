# Simulator Bridge — Prototype

**Phase:** 4 (Simulator Telemetry Prototype)  
**Status:** Not yet implemented

---

## Purpose

The Simulator Bridge ingests telemetry data from simulator environments and forwards it to the Soul AI Telemetry Ingestion Service. In the Phase 4 prototype, it replays a mocked telemetry stream from a JSON fixture file to simulate a real simulator session.

---

## Planned Simulator Integrations

| Simulator | Interface | Status |
|---|---|---|
| Microsoft Flight Simulator (MSFS) | SimConnect SDK | Planned |
| X-Plane | X-Plane Data Refs (UDP) | Planned |
| Embention Autopilot | Serial / UDP | Planned |
| Mock replay | JSON fixture file | Phase 4 prototype |

---

## Planned Responsibilities

- Connect to simulator data source (or replay fixture file)
- Parse raw simulator data into `telemetry_frame` schema format
- Emit `telemetry_session_start` when session begins
- Emit high-frequency `telemetry_frame` messages (target: 10Hz for prototype)
- Emit `telemetry_event` for detected events (deviation, phase change, etc.)
- Emit `telemetry_session_stop` when session ends
- Forward all events to the Telemetry Ingestion Service

---

## Telemetry Frame Rate

- Target for prototype: 10Hz (1 frame per 100ms)
- Target for Phase 5+: Up to 50Hz depending on simulator output

---

## Planned Technology

- Language: Python
- MSFS interface: SimConnect (via Python library)
- X-Plane interface: UDP socket (XPlane standard data output)
- Prototype replay: Python script reading JSON fixture file
- Output: Forward to Soul Orchestrator via REST or publish to MQTT

---

## Planned Modules

```
simulator_bridge/
  main.py                 — Bridge entry point
  msfs_connector.py       — MSFS SimConnect interface (Phase 4+)
  xplane_connector.py     — X-Plane UDP interface (Phase 4+)
  mock_replay.py          — Replay telemetry from JSON fixture
  frame_normalizer.py     — Normalize raw data to telemetry_frame schema
  event_detector.py       — Detect events (deviation, overcorrection, phase change)
  session_manager.py      — Session start/stop lifecycle
  tests/
  fixtures/
    mock_session.json     — Sample telemetry session for testing
```

---

## References

- [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md) — Telemetry Ingestion Service
- [`schemas/domain/telemetry_frame.schema.json`](../../schemas/domain/telemetry_frame.schema.json)
- [`schemas/mqtt/telemetry.schema.json`](../../schemas/mqtt/telemetry.schema.json)
- [`examples/mqtt_messages/telemetry_frame.json`](../../examples/mqtt_messages/telemetry_frame.json)
- [`examples/conversations/post_flight_debrief.md`](../../examples/conversations/post_flight_debrief.md)
