# Soul AI — Product Vision

## North Star

> Soul AI should make Doroni feel like a living intelligent mobility ecosystem, not just an aircraft with a voice assistant.

Mobile gives Soul continuity.
Cockpit gives Soul presence.
Simulator gives Soul intelligence.
Telemetry gives Soul memory.
Safety boundaries give Soul credibility.

---

## Product Definition

> **Soul AI is Doroni's cross-platform intelligent mobility companion — planning the user's day on mobile, preparing the aircraft before arrival, assisting inside the cockpit, and learning from every flight.**

Soul AI is the intelligent personality layer of the Doroni ecosystem. It is not a generic conversational assistant. It is Doroni-specific, aviation-aware, context-driven, and safety-conscious.

The closest cultural reference is Jarvis — but grounded in aviation, cockpit awareness, mobility planning, and the Doroni ecosystem.

---

## What Soul AI Understands

- **The user** — preferences, calendar, saved locations, mobility habits, pilot history
- **The aircraft** — battery, range, cabin state, lock state, readiness
- **The mission** — destinations, route legs, departure timing, fly-vs-drive decision
- **The route** — airspace, weather, hazards, ETA
- **The environment** — current weather, forecast, NOTAMs
- **The cockpit state** — current flight phase, active mode, recent commands
- **The pilot profile** — skill level, tendencies, recent improvements, training gaps

---

## Three Product Pillars

### Pillar 1 — Personal Flight Concierge

The mobile-first, planning-first side of Soul AI.

Soul AI acts as a proactive day planner that understands the user's calendar, knows the aircraft, and generates intelligent fly plans before the user even asks.

Example interactions:
- "What does my day look like?"
- "Can I fly to all my meetings today?"
- "What time should I leave?"
- "Should I fly or drive?"
- "Prepare the aircraft."
- "Find a coffee stop on the way."

Core capabilities:
- Calendar-aware daily planning
- Fly Plan generation
- Multi-stop mobility planning
- Fly-vs-drive comparison
- Route feasibility
- Weather and airspace awareness
- Aircraft readiness summary
- Proactive mobile notifications

---

### Pillar 2 — Cockpit Command Companion

The in-cockpit NavApp and HMI side of Soul AI.

Soul AI adapts its behaviour to the flight phase. It is concise during critical phases and more conversational when parked or cruising.

Example commands:
- "Take me home."
- "Set cabin temperature to 21."
- "Make it cooler."
- "Switch to satellite mode."
- "Zoom in."
- "Set ambient lighting to blue."
- "Unlock the door."
- "What's my ETA?"
- "Give me a flight briefing."
- "Any hazards on the route?"

Feature areas:
- Climate control (temperature, fan speed)
- Lighting control (ambient, duct, knob lights, RGB, brightness)
- Navigation (destination, route, zoom, map mode)
- Door lock/unlock synchronization
- Mission briefing
- Real-time transcript and animation overlay
- ETA and status queries

---

### Pillar 3 — Flight Intelligence & Coaching

The telemetry, simulator, and pilot profiling side of Soul AI.

Soul AI ingests flight data — from simulators and eventually real aircraft — and builds a persistent pilot profile. It identifies skill gaps and generates coaching feedback.

Target simulator integrations:
- Microsoft Flight Simulator
- X-Plane
- Embention Autopilot

Telemetry data:
- Latitude, longitude, altitude
- Ground speed, pitch, roll, yaw, heading
- Joystick inputs, control smoothness
- Battery/energy state
- Warning and event data
- Flight phase, route deviation

Example coaching outputs:
- "Your roll inputs were smoother today."
- "You tend to overcorrect during descent."
- "Your approach was steeper than your previous average."
- "You maintained stable altitude for 83% of cruise."
- "Recommended next simulator exercise: approach stabilization in crosswind."

---

## What Soul AI is Not

- Soul AI is not a generic chatbot.
- Soul AI is not a certified avionics system.
- Soul AI does not have flight-control authority.
- Soul AI does not override pilot input.
- Soul AI does not operate as a standalone product — it is the intelligence layer of the Doroni ecosystem.

---

## Cross-Platform Principle

Soul AI should have one shared brain, not separate implementations per surface.

Mobile, cockpit, simulator, and web clients connect to a shared Soul orchestration layer. Intelligence is not duplicated. Context is shared. The pilot's experience is continuous across surfaces.

The mobile-to-cockpit handoff — where a prepared fly plan seamlessly loads into the NavApp when the pilot arrives — is a defining product moment.

---

## Tone and Personality

Soul AI should feel:
- **Intelligent** — not just voice-controlled buttons
- **Calm** — especially during flight, never adding anxiety
- **Personal** — knows the user's preferences and history
- **Concise** — short in cockpit, more conversational on mobile
- **Credible** — transparent about uncertainty, never overstates confidence
- **Trustworthy** — always defers to the pilot on safety-relevant decisions

Soul AI should not feel:
- Generic or chatbot-like
- Verbose during critical flight phases
- Overconfident about AI-generated recommendations
- Like a product from another ecosystem

---

## Related Documents

- [`PRD.md`](PRD.md) — product requirements and user journeys
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — technical architecture
- [`SAFETY_BOUNDARIES.md`](SAFETY_BOUNDARIES.md) — safety constraints
- [`SOUL_MODES.md`](SOUL_MODES.md) — operational mode behaviour
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — product story walkthrough
