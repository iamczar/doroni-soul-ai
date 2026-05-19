# MQTT Gateway — Prototype

**Phase:** 1 (NavApp Voice Brain Prototype)  
**Status:** Not yet implemented

---

## Purpose

The MQTT Gateway translates validated intent objects from the Soul Orchestrator into MQTT messages and publishes them to the appropriate topics. In the prototype phase, it does not connect to a real MQTT broker — it emits structured command objects that could be published.

---

## Planned Responsibilities

- Receive approved intent objects from the Safety/Validation Layer
- Map intent type to MQTT `message_id`
- Construct the standard message envelope (source, target, risk_level, timestamp, payload)
- Validate the outgoing message against the relevant schema
- Publish to the appropriate MQTT topic (or log/return for prototype)
- Subscribe to system state topics and normalize responses into Context Engine format

---

## Planned Topic Structure

```
doroni/soul/{target}/{category}/{message_id}
```

Examples:
```
doroni/soul/navapp/climate/climate_set_temperature
doroni/soul/navapp/navigation/nav_set_destination
doroni/soul/navapp/lighting/lighting_set_ambient_rgb
doroni/soul/navapp/ui/ui_soul_transcript_update
doroni/soul/cloud/mission/mission_send_to_cockpit
doroni/soul/cloud/telemetry/telemetry_frame
```

---

## Planned Technology

- Language: Python or Node.js
- MQTT library: Paho (Python) or MQTT.js (Node.js)
- Broker: Mosquitto (local, for prototype only)
- Schema validation: jsonschema (Python) or ajv (Node.js)

---

## Planned Modules

```
mqtt_gateway/
  main.py                 — Gateway entry point / service
  publisher.py            — Intent → MQTT message + publish
  subscriber.py           — Subscribe to state topics
  schema_validator.py     — Validate outgoing messages
  topic_router.py         — Map message_id to topic path
  tests/
```

---

## References

- [`docs/MQTT_MESSAGE_SPEC.md`](../../docs/MQTT_MESSAGE_SPEC.md)
- [`schemas/mqtt/`](../../schemas/mqtt/)
- [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md)
