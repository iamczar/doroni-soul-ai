# Example Conversation — Post-Flight Debrief (Simulator Session)

**Context:** Alex has completed a 42-minute simulator session in Microsoft Flight Simulator using the Doroni H1-X profile. The Soul AI simulator bridge was ingesting telemetry throughout the session. The session has now ended.

**Soul mode:** `simulator` → `post_flight`  
**Surface:** Mobile app  
**Session source:** Microsoft Flight Simulator (MSFS)  
**Date:** 2026-05-19 — 20:15 local time

---

## Session Data (Internal — Telemetry Summary)

```
Session ID:     sim-session-a1b2c3
Duration:       42 minutes 07 seconds
Source:         msfs
Aircraft:       Doroni H1-X (sim profile)
Frames ingested: 25,247

COMPUTED METRICS
────────────────────────────────
Altitude stability:     83%   (time within ±50ft of target)
Smoothness score:       0.72  (vs. previous: 0.64 — +12%)
Approach deviation:     +4.1° (steeper than session average of 3.2°)
Route tracking:         0.89  (good)
Overcorrection events:  11    (vs. previous: 14 — improved)
────────────────────────────────
```

---

## Transcript

**[Simulator session ends — `telemetry_session_stop` received]**

**[Pilot Profile Engine processes session — pilot profile updated]**

---

**Soul AI (mobile notification):**

> "Session complete. I've finished reviewing your flight. Ready for your debrief?"

---

**[Alex taps: "Show debrief"]**

**Soul AI:**

> "Session complete. 42 minutes. Some good progress today — your roll inputs were noticeably smoother than last time, about 12% fewer overcorrections. Altitude was stable for 83% of cruise, which is solid."
>
> "One thing to watch: your approach was a little steep — about 4 degrees steeper than your average. That's been a pattern across the last few sessions."
>
> "I've updated your pilot profile. Want to see the full breakdown?"

---

**[Alex taps: "Yes"]**

**[Soul displays debrief card]**

```
SESSION DEBRIEF — 2026-05-19
────────────────────────────────
Source:              Microsoft Flight Simulator
Duration:            42:07
────────────────────────────────
PERFORMANCE
  Altitude stability:   83%       ✓ Good
  Roll smoothness:      +12%      ▲ Improved vs. last session
  Approach deviation:   +4.1°     ↓ Steeper than average
  Route tracking:       89%       ✓ Good
  Overcorrections:      11        ▲ Down from 14 (improved)
────────────────────────────────
PILOT PROFILE UPDATED
  Smoothness score:     0.72 (was 0.64)
  Approach consistency: 0.61 (was 0.65) — slight drop
────────────────────────────────
RECOMMENDATION
  Practice stabilized approaches.
  Suggested: ILS approach in crosswind (15kt) — 3 sessions.
────────────────────────────────
```

---

**Alex:** "Why is my approach score lower?"

**Soul AI:**

> "Your approach deviation was 4.1 degrees steeper than your historical average of 3.2 degrees. That's a meaningful gap — it means you're intercepting the glide path from below and overshooting the target angle. It can make arrivals feel rushed. The recommended crosswind approach exercises specifically target glide path discipline."

---

**Alex:** "OK, what should I practice next?"

**Soul AI:**

> "Based on your profile, I'd focus on two things. First, stabilized approaches — start with calm conditions, then add crosswind. Second, keep doing what you're doing with roll inputs: they're trending in the right direction. I'd suggest three or four sessions on approaches before moving to anything else."

**[Training recommendation stored in pilot profile]**

```json
{
  "recommended_training": [
    {
      "focus_area": "Stabilized approaches",
      "description": "Practice ILS approach in crosswind 15kt — focus on glide path interception from above",
      "priority": "high"
    },
    {
      "focus_area": "Roll input smoothness",
      "description": "Continue current pattern — positive trend, no specific exercise needed",
      "priority": "low"
    }
  ]
}
```

---

## System Events During Debrief

| Event | Message |
|---|---|
| Session stop received | `telemetry_session_stop` |
| Summary computed | Pilot Profile Engine calculates metrics |
| Profile updated | `pilot_profile_update` |
| Debrief stored | `pilot_profile_get_debrief` → stored |
| Debrief card displayed | `ui_show_debrief_card` |

---

## Related

- [`docs/DEMO_SCRIPT.md`](../../docs/DEMO_SCRIPT.md) — Journey 5
- [`schemas/domain/pilot_profile.schema.json`](../../schemas/domain/pilot_profile.schema.json)
- [`schemas/domain/telemetry_frame.schema.json`](../../schemas/domain/telemetry_frame.schema.json)
- [`examples/mqtt_messages/telemetry_frame.json`](../mqtt_messages/telemetry_frame.json)
- [`docs/PRD.md`](../../docs/PRD.md) — Journey 5
