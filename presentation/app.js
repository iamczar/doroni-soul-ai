/* ═══════════════════════════════════════════════════════════
   Doroni Soul AI — Presentation Engine
   Keyboard-navigated, canvas-animated, Web Audio powered.
═══════════════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────────────
let currentScene  = 0;
const TOTAL       = 7;
let soundOn       = false;
let voiceOn       = true;        // voice narration on by default
let speechUnlocked = false;      // Chrome gesture-unlock flag
let audioCtx      = null;
let ambientOsc    = null;
let ambientGain   = null;
let rafIds        = {};          // requestAnimationFrame handles per scene
let sceneTimers   = [];          // setTimeout handles cleared on scene exit
let mapSetup      = false;       // relationship map one-time setup flag

// ── Speaker Notes ─────────────────────────────────────────
const NOTES = [
  'Soul AI is not a chatbot. It\'s the intelligent personality layer of the Doroni ecosystem — it knows the user, the aircraft, the mission, and the environment. Think Jarvis, but built for aviation.',
  'One shared brain across all surfaces. Mobile, cockpit, and simulator are thin clients. Intelligence lives in the Soul Orchestrator. Context is shared — what Soul knows on mobile, it still knows in the cockpit.',
  'Three pillars — each on a different surface. Mobile is planning-first. Cockpit is execution. Simulator is learning. Navigate forward to see the story behind each one.',
  'Pillar 1: Soul AI starts planning Alex\'s day before he consciously opens the app. Calendar, aircraft state, weather — already checked. No configuration. No manual planning. Just a briefing ready when you need it.',
  'Pillar 2: Every voice command flows through intent classification and safety validation before any system state changes. The LLM proposes. Deterministic systems validate. The pilot remains authority.',
  'Pillar 3: Every session builds the pilot profile. Soul AI identifies patterns, finds gaps, and coaches on the specific things that will move the needle. This is the long-term data moat.',
  'Phase 0 is complete. Phase 1 is next: the prototype that converts text input into a validated MQTT command object. That is the core intelligence loop.',
];

// ═══════════════════════════════════════════════════════════
// SPEECH SYNTHESIS
// Soul AI = female voice   Alex = male voice
// Toggle with V key or 🎙 button — on by default
// ═══════════════════════════════════════════════════════════

let soulVoice = null;   // female
let alexVoice = null;   // male

function initVoices() {
  const pick = () => {
    const all = window.speechSynthesis.getVoices();
    if (!all.length) return;

    // ── Female voices for Soul AI ──────────────────────────
    soulVoice =
      all.find(v => v.name === 'Google UK English Female')         ||
      all.find(v => v.name === 'Google US English Female')         ||
      all.find(v => /samantha|karen|moira|victoria|fiona/i.test(v.name) && v.lang.startsWith('en')) ||
      all.find(v => v.lang === 'en-US' && /zira|female/i.test(v.name)) ||
      all.find(v => v.lang === 'en-GB')                            ||
      all.find(v => v.lang === 'en-US')                            ||
      all[0];

    // ── Male voices for Alex ───────────────────────────────
    alexVoice =
      all.find(v => v.name === 'Google UK English Male')           ||
      all.find(v => v.name === 'Google US English Male')           ||
      all.find(v => /^(daniel|alex|david|mark|thomas)$/i.test(v.name) && v.lang.startsWith('en')) ||
      all.find(v => v.lang === 'en-US' && /male|david/i.test(v.name)) ||
      all.find(v => v.lang === 'en-US' && v !== soulVoice)         ||
      all.find(v => v.lang.startsWith('en') && v !== soulVoice)    ||
      soulVoice;

    updateVoiceBtn();
  };

  pick();
  // Chrome loads voices asynchronously
  window.speechSynthesis.onvoiceschanged = pick;
}

// Called inside every user-gesture handler to unlock Chrome's speech gate.
// Chrome 71+ blocks speechSynthesis.speak() from setTimeout unless the engine
// has been touched at least once inside a synchronous gesture handler.
function unlockSpeech() {
  if (speechUnlocked || !window.speechSynthesis) return;
  speechUnlocked = true;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  u.rate   = 10;  // completes in milliseconds
  window.speechSynthesis.speak(u);
}

// Speak a line, then call onDone when speech ends.
// If voice is off/unavailable, onDone fires after a time estimate instead.
// gender: 'female' (Soul AI) | 'male' (Alex)
function speakSeq(text, gender = 'female', onDone) {
  const fallback = () => {
    if (onDone) later(onDone, Math.max(1200, text.length * 60));
  };

  if (!voiceOn || !window.speechSynthesis || !speechUnlocked) {
    fallback();
    return;
  }

  window.speechSynthesis.cancel();
  const utt   = new SpeechSynthesisUtterance(text);
  const voice = gender === 'male' ? alexVoice : soulVoice;
  if (voice) utt.voice = voice;
  utt.rate   = gender === 'male' ? 0.88 : 0.90;   // Alex: slightly slower = more conversational
  utt.pitch  = gender === 'male' ? 1.00 : 1.12;  // Alex: neutral pitch, not robotic-deep
  utt.volume = 0.92;
  if (onDone) {
    utt.onend  = onDone;
    utt.onerror = onDone;   // still advance if speech errors
  }
  window.speechSynthesis.speak(utt);
}

// Legacy one-shot speak (no callback) — kept for non-pillar use
function speak(text, gender = 'female') {
  speakSeq(text, gender, null);
}

function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function toggleVoice() {
  voiceOn = !voiceOn;
  stopSpeech();
  updateVoiceBtn();
}

function updateVoiceBtn() {
  const btn = document.getElementById('voice-btn');
  if (!btn) return;
  btn.textContent = voiceOn ? '🎙' : '🔕';
  btn.title       = voiceOn ? 'Voice on — press V to mute' : 'Voice muted — press V to unmute';
}

// ═══════════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════════

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Low ambient drone
  ambientOsc  = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = 55;
  ambientGain.gain.value = 0;
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();
}

function setAmbient(on) {
  if (!audioCtx) return;
  ambientGain.gain.setTargetAtTime(on ? 0.022 : 0, audioCtx.currentTime, 0.6);
}

function playTone(freq, dur = 0.18, vol = 0.1, type = 'sine', at = 0) {
  if (!audioCtx || !soundOn) return;
  const osc = audioCtx.createOscillator();
  const g   = audioCtx.createGain();
  const t   = audioCtx.currentTime + at;
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function sndTransition() {
  playTone(220, 0.28, 0.055, 'sine', 0);
  playTone(330, 0.18, 0.03,  'sine', 0.08);
  playTone(440, 0.12, 0.02,  'sine', 0.16);
}

function sndChime() {
  playTone(880,  0.32, 0.07, 'sine', 0);
  playTone(1108, 0.22, 0.04, 'sine', 0.06);
}

function sndConfirm() {
  playTone(1200, 0.09, 0.055, 'sine', 0);
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════

function go(idx) {
  if (idx < 0 || idx >= TOTAL || idx === currentScene) return;
  initAudio();
  sndTransition();

  // Stop any ongoing Soul AI speech
  stopSpeech();
  // Cancel timers from current scene
  sceneTimers.forEach(clearTimeout);
  sceneTimers = [];
  // Cancel scene-4 RAF canvases
  if (rafIds['4orb']) { cancelAnimationFrame(rafIds['4orb']); delete rafIds['4orb']; }
  // Cancel RAF from current scene
  if (rafIds[currentScene]) {
    cancelAnimationFrame(rafIds[currentScene]);
    delete rafIds[currentScene];
  }

  const from = document.getElementById(`scene-${currentScene}`);
  const to   = document.getElementById(`scene-${idx}`);

  from.classList.add('exiting');
  from.classList.remove('active');

  setTimeout(() => {
    from.classList.remove('exiting');
    currentScene = idx;
    to.classList.add('active');
    updateHUD();
    enterScene(idx);
  }, 380);
}

function updateHUD() {
  document.getElementById('scene-counter').textContent = `${currentScene + 1} / ${TOTAL}`;
  const hint = document.getElementById('nav-hint');
  if (currentScene === 0)         hint.innerHTML = 'Press <kbd>→</kbd> to continue';
  else if (currentScene === TOTAL - 1) hint.innerHTML = 'Press <kbd>←</kbd> to go back';
  else                             hint.innerHTML = '<kbd>←</kbd> <kbd>→</kbd> to navigate';
}

function toggleSound() {
  initAudio();
  soundOn = !soundOn;
  document.getElementById('sound-btn').textContent = soundOn ? '🔊' : '🔇';
  setAmbient(soundOn);
  if (soundOn) sndChime();
}

function toggleNotes() {
  const overlay = document.getElementById('notes-overlay');
  const body    = document.getElementById('notes-body');
  const open    = overlay.classList.toggle('open');
  if (open) body.textContent = NOTES[currentScene];
}

// ── Keyboard ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  unlockSpeech();  // unlock Chrome's gesture gate on first keypress

  const notesOpen = document.getElementById('notes-overlay').classList.contains('open');

  if (e.key === 'n' || e.key === 'N') { toggleNotes(); return; }
  if (e.key === 's' || e.key === 'S') { toggleSound();  return; }
  if (e.key === 'v' || e.key === 'V') { toggleVoice();  return; }

  if (notesOpen) {
    document.getElementById('notes-overlay').classList.remove('open');
    return;
  }

  if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) { e.preventDefault(); go(currentScene + 1); }
  if (['ArrowLeft',  'ArrowUp'].includes(e.key))        { e.preventDefault(); go(currentScene - 1); }
});

document.getElementById('sound-btn').addEventListener('click', () => { unlockSpeech(); toggleSound(); });
document.getElementById('voice-btn').addEventListener('click', () => { unlockSpeech(); toggleVoice(); });

// ── Touch / swipe navigation ──────────────────────────────
let _touchStartX = 0;
let _touchStartY = 0;

document.addEventListener('touchstart', e => {
  _touchStartX = e.changedTouches[0].clientX;
  _touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _touchStartX;
  const dy = e.changedTouches[0].clientY - _touchStartY;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  unlockSpeech();
  go(dx < 0 ? currentScene + 1 : currentScene - 1);
}, { passive: true });

// ── Helpers ───────────────────────────────────────────────
function later(fn, ms) {
  const t = setTimeout(fn, ms);
  sceneTimers.push(t);
  return t;
}

function typewrite(el, text, speed = 34, done) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i >= text.length) { if (done) done(); return; }
    el.textContent += text[i++];
    const t = setTimeout(tick, speed);
    sceneTimers.push(t);
  };
  tick();
}

// ═══════════════════════════════════════════════════════════
// SCENE ENTRY DISPATCHER
// ═══════════════════════════════════════════════════════════

function enterScene(idx) {
  const fns = [s0Orb, s1Map, s2Pillars, s3Mobile, s4Hmi, s5Telemetry, s6Roadmap];

  // Hide soul overlay when leaving scene 4
  if (currentScene !== 4) {
    const ov = document.getElementById('soul-hmi-overlay');
    if (ov) ov.classList.remove('vis');
  }
  if (fns[idx]) fns[idx]();
}

// ═══════════════════════════════════════════════════════════
// SCENE 0 — Soul Orb
// ═══════════════════════════════════════════════════════════

function s0Orb() {
  const canvas = document.getElementById('orb-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 70 }, () => ({
    angle:   Math.random() * Math.PI * 2,
    radius:  100 + Math.random() * 180,
    speed:   (0.18 + Math.random() * 0.55) * (Math.random() > 0.5 ? 1 : -1),
    size:    0.8 + Math.random() * 2.4,
    opacity: 0.25 + Math.random() * 0.75,
    hue:     Math.random() > 0.45 ? '#00d4ff' : '#7c3aed',
  }));

  let frame = 0;

  function draw() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Background radial glow
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 420);
    bg.addColorStop(0,   'rgba(124,58,237,0.11)');
    bg.addColorStop(0.5, 'rgba(0,212,255,0.04)');
    bg.addColorStop(1,   'transparent');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Outer rings
    for (let r = 0; r < 3; r++) {
      const rr = 88 + r * 28 + Math.sin(frame * 0.018 + r * 1.4) * 7;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,212,255,${0.07 - r * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Core orb
    const orbR = 66 + Math.sin(frame * 0.022) * 4;
    const g = ctx.createRadialGradient(cx - 14, cy - 14, 0, cx, cy, orbR);
    g.addColorStop(0,   'rgba(210,190,255,0.92)');
    g.addColorStop(0.35,'rgba(124,58,237,0.78)');
    g.addColorStop(0.72,'rgba(0,212,255,0.38)');
    g.addColorStop(1,   'rgba(0,212,255,0)');
    ctx.shadowBlur  = 44;
    ctx.shadowColor = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Particles
    particles.forEach(p => {
      p.angle += p.speed * 0.009;
      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * p.radius;
      const alpha = Math.floor(p.opacity * 200).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.hue + alpha;
      ctx.fill();
    });

    frame++;
    rafIds[0] = requestAnimationFrame(draw);
  }

  if (rafIds[0]) cancelAnimationFrame(rafIds[0]);
  draw();
}

// ═══════════════════════════════════════════════════════════
// SCENE 1 — Relationship Map
// ═══════════════════════════════════════════════════════════

function s1Map() {
  const canvas  = document.getElementById('map-canvas');
  const ctx     = canvas.getContext('2d');
  const tooltip = document.getElementById('map-tooltip');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const W = canvas.width, H = canvas.height;
  const cx = W / 2 + 40, cy = H / 2 + 20;
  const R  = Math.min(W, H) * 0.265;

  const SATS = [
    { label: 'Mobile App',          sub: 'Briefing · Fly Plan · Notifications',  angle: -90,  icon: '📱' },
    { label: 'H1-X Aircraft',       sub: 'Cabin · Battery · Lock · Climate',      angle: -22,  icon: '✦'  },
    { label: 'Cockpit / NavApp',    sub: 'Voice · HUD · Transcript · MQTT',       angle:  46,  icon: '⬡'  },
    { label: 'Simulator Bridge',    sub: 'Telemetry · Pilot profile · Debrief',   angle: 114,  icon: '◎'  },
    { label: 'Cloud Orchestrator',  sub: 'Context · Calendar · Weather · Maps',   angle: 182,  icon: '◈'  },
  ].map(n => ({
    ...n,
    x: cx + Math.cos(n.angle * Math.PI / 180) * R,
    y: cy + Math.sin(n.angle * Math.PI / 180) * R,
  }));

  const SOUL = { x: cx, y: cy, label: 'Soul AI', sub: 'Shared intelligence layer' };

  // Animated packets per connection
  const packets = [];
  SATS.forEach((s, i) => {
    packets.push({ si: i, t: i / SATS.length,        spd: 0.0028 + Math.random() * 0.003, out: true  });
    packets.push({ si: i, t: (i / SATS.length + 0.5) % 1, spd: 0.002  + Math.random() * 0.003, out: false });
  });

  let startMs   = Date.now();
  let hovered   = null;

  if (!mapSetup) {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      hovered = null;

      if (Math.hypot(mx - SOUL.x, my - SOUL.y) < 42) hovered = SOUL;
      SATS.forEach(s => { if (Math.hypot(mx - s.x, my - s.y) < 34) hovered = s; });

      if (hovered) {
        tooltip.style.opacity = '1';
        tooltip.style.left = (e.clientX + 18) + 'px';
        tooltip.style.top  = (e.clientY - 8)  + 'px';
        tooltip.innerHTML = `<strong>${hovered.label}</strong><br>${hovered.sub}`;
      } else {
        tooltip.style.opacity = '0';
      }
    });
    canvas.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
    mapSetup = true;
  }

  function drawNode(x, y, icon, label, isCenter, isHovered) {
    const r = isCenter ? 40 : 27;
    ctx.shadowBlur  = isHovered ? 28 : 16;
    ctx.shadowColor = isCenter ? '#7c3aed' : '#00d4ff';

    const grd = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    if (isCenter) {
      grd.addColorStop(0, 'rgba(200,170,255,0.9)');
      grd.addColorStop(1, 'rgba(124,58,237,0.45)');
    } else {
      grd.addColorStop(0, 'rgba(0,220,255,0.5)');
      grd.addColorStop(1, 'rgba(0,140,200,0.18)');
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.strokeStyle = isCenter ? 'rgba(190,130,255,0.8)' : 'rgba(0,212,255,0.6)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // Icon
    ctx.font          = `${isCenter ? 18 : 14}px sans-serif`;
    ctx.textAlign     = 'center';
    ctx.textBaseline  = 'middle';
    ctx.fillStyle     = '#ffffff';
    ctx.fillText(icon || '◈', x, y);

    // Label
    ctx.font          = `${isCenter ? '600 12px' : '500 11px'} Inter, sans-serif`;
    ctx.textBaseline  = 'top';
    ctx.fillStyle     = isHovered ? '#00d4ff' : '#8888aa';
    ctx.fillText(label, x, y + r + 7);
  }

  function frame() {
    const elapsed  = (Date.now() - startMs) / 1000;
    const progress = Math.min(elapsed / 1.6, 1); // 1.6s draw-in

    ctx.clearRect(0, 0, W, H);

    // Soft center glow
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.3);
    bg.addColorStop(0, 'rgba(124,58,237,0.055)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw connection lines
    SATS.forEach((s, i) => {
      const lp = Math.max(0, Math.min(1, (progress - i * 0.1) / 0.55));
      if (lp <= 0) return;
      const ex = cx + (s.x - cx) * lp;
      const ey = cy + (s.y - cy) * lp;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    // Draw data packets
    if (progress > 0.7) {
      packets.forEach(p => {
        p.t = (p.t + p.spd) % 1;
        const s  = SATS[p.si];
        const pt = p.out ? p.t : 1 - p.t;
        const px = cx + (s.x - cx) * pt;
        const py = cy + (s.y - cy) * pt;
        const a  = Math.sin(p.t * Math.PI) * 0.78;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${a})`;
        ctx.fill();
      });
    }

    // Draw satellite nodes
    SATS.forEach((s, i) => {
      const np = Math.max(0, Math.min(1, (progress - i * 0.1 - 0.32) / 0.35));
      if (np <= 0) return;
      const nx = cx + (s.x - cx) * np;
      const ny = cy + (s.y - cy) * np;
      ctx.globalAlpha = np;
      drawNode(nx, ny, s.icon, s.label, false, hovered === s);
      ctx.globalAlpha = 1;
    });

    // Soul center
    const sc = Math.min(1, progress * 3.5);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sc, sc);
    ctx.translate(-cx, -cy);
    drawNode(cx, cy, '◈', 'Soul AI', true, hovered === SOUL);
    ctx.restore();

    rafIds[1] = requestAnimationFrame(frame);
  }

  if (rafIds[1]) cancelAnimationFrame(rafIds[1]);
  startMs = Date.now();
  frame();
}

// ═══════════════════════════════════════════════════════════
// SCENE 2 — Three Pillars
// ═══════════════════════════════════════════════════════════

function s2Pillars() {
  document.querySelectorAll('.pillar-card').forEach((card, i) => {
    card.classList.remove('visible');
    later(() => card.classList.add('visible'), 180 + i * 170);
  });
}

// ═══════════════════════════════════════════════════════════
// SCENE 3 — Mobile Morning Briefing
// ═══════════════════════════════════════════════════════════

const MOBILE_CONVO = [
  { kind: 'soul',   from: 'Soul AI', text: 'Good morning, Alex.' },
  { kind: 'soul',   from: 'Soul AI', text: 'You have a meeting at Doroni HQ at 10:00. Flying saves 26 minutes.' },
  { kind: 'soul',   from: 'Soul AI', text: 'Weather: clear skies, 8kt southerly. I recommend leaving at 9:28.' },
  { kind: 'user',   from: 'Alex',    text: 'Ok, can you prepare the flight plan please.' },
  { kind: 'system', from: 'System',  text: '✓ Fly Plan created — 18nm direct, ETA 9:41' },
  { kind: 'system', from: 'System',  text: '✓ Cabin cooling to 21°C' },
  { kind: 'system', from: 'System',  text: '✓ Fly Plan sent to cockpit' },
  { kind: 'soul',   from: 'Soul AI', text: 'Your H1-X is ready. Reminder set for 9:20.' },
];

function s3Mobile() {
  const thread = document.getElementById('mobile-thread');
  thread.innerHTML = '';
  sndChime();
  later(() => runMobileSeq(0), 600);
}

// Sequential: each line waits for speech to finish, then 2s pause, then next.
function runMobileSeq(idx) {
  if (idx >= MOBILE_CONVO.length) return;
  const msg    = MOBILE_CONVO[idx];
  const thread = document.getElementById('mobile-thread');
  if (!thread) return;

  const bubble = renderChatMsg(thread, msg);

  const advance = () => later(() => runMobileSeq(idx + 1), 1000);

  if (msg.kind === 'soul') {
    typewrite(bubble, msg.text, 55);         // slower typewriter — 55ms/char
    speakSeq(msg.text, 'female', advance);
  } else if (msg.kind === 'user') {
    bubble.textContent = msg.text;
    speakSeq(msg.text, 'male', advance);
  } else {
    // System event — no speech, short fixed pause
    bubble.textContent = msg.text;
    sndConfirm();
    later(advance, 800);
  }
}

// Returns the bubble element so callers can typewrite into it.
// Does NOT call speak() — sequence functions handle that.
function renderChatMsg(container, msg) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg msg-${msg.kind}`;

  const from = document.createElement('div');
  from.className = 'chat-from';
  from.textContent = msg.from;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';

  wrap.appendChild(from);
  wrap.appendChild(bubble);
  container.appendChild(wrap);

  requestAnimationFrame(() => wrap.classList.add('vis'));
  return bubble;
}

// ═══════════════════════════════════════════════════════════
// SCENE 4 — Cockpit Command Pipeline
// ═══════════════════════════════════════════════════════════
// SCENE 4 — NavApp HMI Recreation + Soul AI Animation
// ═══════════════════════════════════════════════════════════

const SOUL_HMI_LINES = [
  'All systems nominal.',
  'Pre-flight checks complete.',
  'Fly Plan loaded — Doroni HQ, 13 min.',
  'Ready for departure. Confirm when ready.',
];

function s4Hmi() {
  // Draw aircraft canvas
  drawAircraft();

  // Pulse PASS badges in sequence
  const passes = document.querySelectorAll('.nv-pass');
  passes.forEach((el, i) => {
    el.classList.remove('pulse');
    later(() => {
      el.classList.add('pulse');
      later(() => el.classList.remove('pulse'), 600);
    }, 300 + i * 120);
  });

  // Soul AI orb + transcript
  later(() => {
    startSoulMiniOrb();
    const overlay = document.getElementById('soul-hmi-overlay');
    if (overlay) overlay.classList.add('vis');
    sndChime();
    playSoulLines(0);
  }, passes.length * 120 + 600);
}

function playSoulLines(idx) {
  if (idx >= SOUL_HMI_LINES.length) return;
  const el = document.getElementById('soul-hmi-text');
  if (!el) return;
  el.textContent = '';
  if (idx > 0) sndChime();
  typewrite(el, SOUL_HMI_LINES[idx], 55);   // 55ms/char — matches speech pace
  speakSeq(SOUL_HMI_LINES[idx], 'female', () => {
    if (idx < SOUL_HMI_LINES.length - 1) {
      later(() => playSoulLines(idx + 1), 1000);
    }
  });
}

// ── H1-X Aircraft Canvas ─────────────────────────────────

function drawAircraft() {
  const canvas = document.getElementById('nv-aircraft');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  canvas.width  = wrap.clientWidth  || 500;
  canvas.height = wrap.clientHeight || 340;

  const ctx = canvas.getContext('2d');
  const cx  = canvas.width  / 2;
  const cy  = canvas.height / 2 + 10;

  // Rotor positions (diagonal, matching H1-X layout)
  const rotorR = Math.min(canvas.width, canvas.height) * 0.2;
  const armLen = Math.min(canvas.width, canvas.height) * 0.34;
  const rotors = [
    { angle: -135, label: 'FL' },
    { angle:  -45, label: 'FR' },
    { angle:   45, label: 'BR' },
    { angle:  135, label: 'BL' },
  ].map(r => ({
    ...r,
    x: cx + Math.cos(r.angle * Math.PI / 180) * armLen,
    y: cy + Math.sin(r.angle * Math.PI / 180) * armLen,
  }));

  let bladeAngle = 0;

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow filter
    ctx.shadowBlur  = 18;
    ctx.shadowColor = '#00e8ff';

    // Arms
    ctx.strokeStyle = 'rgba(0 220 255 / 0.55)';
    ctx.lineWidth   = 3;
    rotors.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
    });

    // Rotor discs
    rotors.forEach(r => {
      // Outer ring
      ctx.beginPath();
      ctx.arc(r.x, r.y, rotorR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0 220 255 / 0.7)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Inner hub
      ctx.beginPath();
      ctx.arc(r.x, r.y, rotorR * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0 180 220 / 0.6)';
      ctx.fill();

      // Spinning blades (3 blades)
      for (let b = 0; b < 3; b++) {
        const ba = bladeAngle + (b * Math.PI * 2) / 3;
        const bx1 = r.x + Math.cos(ba) * rotorR * 0.22;
        const by1 = r.y + Math.sin(ba) * rotorR * 0.22;
        const bx2 = r.x + Math.cos(ba) * rotorR * 0.88;
        const by2 = r.y + Math.sin(ba) * rotorR * 0.88;

        ctx.beginPath();
        ctx.moveTo(bx1, by1);
        ctx.lineTo(bx2, by2);
        ctx.strokeStyle = `rgba(0 230 255 / 0.5)`;
        ctx.lineWidth   = 2.5;
        ctx.stroke();
      }
    });

    // Fuselage body — elongated hexagon
    const fw = 38, fh = 78;
    ctx.shadowBlur  = 24;
    ctx.shadowColor = '#00e8ff';
    ctx.beginPath();
    ctx.moveTo(cx,        cy - fh);        // nose
    ctx.lineTo(cx + fw,   cy - fh * 0.3);
    ctx.lineTo(cx + fw,   cy + fh * 0.5);
    ctx.lineTo(cx,        cy + fh);        // tail
    ctx.lineTo(cx - fw,   cy + fh * 0.5);
    ctx.lineTo(cx - fw,   cy - fh * 0.3);
    ctx.closePath();

    const bodyGrad = ctx.createLinearGradient(cx - fw, cy - fh, cx + fw, cy + fh);
    bodyGrad.addColorStop(0,   'rgba(0 220 255 / 0.5)');
    bodyGrad.addColorStop(0.5, 'rgba(0 160 210 / 0.3)');
    bodyGrad.addColorStop(1,   'rgba(0 100 180 / 0.2)');
    ctx.fillStyle   = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0 230 255 / 0.8)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Centre glow dot
    ctx.shadowBlur  = 30;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0 230 255 / 0.9)';
    ctx.fill();
    ctx.shadowBlur = 0;

    bladeAngle += 0.07;
    rafIds[4] = requestAnimationFrame(frame);
  }

  if (rafIds[4]) cancelAnimationFrame(rafIds[4]);
  frame();
}

// ── Soul mini-orb canvas ──────────────────────────────────

function startSoulMiniOrb() {
  const canvas = document.getElementById('soul-mini-orb');
  if (!canvas) return;
  canvas.width  = 44;
  canvas.height = 44;
  const ctx = canvas.getContext('2d');
  const cx  = 22, cy = 22;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, 44, 44);
    const r = 14 + Math.sin(t * 0.06) * 2;

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0 212 255 / ${0.15 + Math.sin(t * 0.08) * 0.08})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Core
    const g = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, r);
    g.addColorStop(0,   'rgba(200 170 255 / 0.95)');
    g.addColorStop(0.5, 'rgba(124 58 237 / 0.75)');
    g.addColorStop(1,   'rgba(0 212 255 / 0.2)');
    ctx.shadowBlur  = 12;
    ctx.shadowColor = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowBlur = 0;

    t++;
    rafIds['4orb'] = requestAnimationFrame(draw);
  }

  if (rafIds['4orb']) cancelAnimationFrame(rafIds['4orb']);
  draw();
}

// ═══════════════════════════════════════════════════════════
// SCENE 5 — Pillar 3: Telemetry & Coaching
// ═══════════════════════════════════════════════════════════

const SOUL_COACHING = [
  'Your roll inputs were noticeably smoother — 12% fewer overcorrections than last session.',
  'Approach was 4° steeper than your average. Something to work on.',
  'Recommended: stabilised approaches in crosswind conditions.',
];

function s5Telemetry() {
  const rows = document.querySelectorAll('.dm-row');
  rows.forEach((row, i) => {
    row.classList.remove('vis');
    const fill = row.querySelector('.dm-bar-fill');
    if (fill) fill.style.width = '0';
    const rec = document.getElementById('debrief-rec');
    if (rec) rec.classList.remove('vis');

    later(() => {
      row.classList.add('vis');
      later(() => {
        if (fill) fill.style.width = (row.dataset.pct || 0) + '%';
        sndConfirm();
      }, 120);
    }, 280 + i * 270);
  });

  const textDelay = 280 + rows.length * 270 + 600;
  later(() => { sndChime(); playCoachingLines(0); }, textDelay);
}

function playCoachingLines(idx) {
  if (idx >= SOUL_COACHING.length) {
    later(() => {
      const rec = document.getElementById('debrief-rec');
      if (rec) rec.classList.add('vis');
    }, 400);
    return;
  }
  const el = document.getElementById('debrief-soul-text');
  if (!el) return;
  el.textContent = '';
  if (idx > 0) sndChime();
  typewrite(el, SOUL_COACHING[idx], 55);   // 55ms/char
  speakSeq(SOUL_COACHING[idx], 'female', () => {
    later(() => { el.textContent = ''; playCoachingLines(idx + 1); }, 1000);
  });
}

// ═══════════════════════════════════════════════════════════
// SCENE 6 — Roadmap
// ═══════════════════════════════════════════════════════════

function s6Roadmap() {
  document.querySelectorAll('.phase-node').forEach((node, i) => {
    node.classList.remove('vis');
    later(() => node.classList.add('vis'), 180 + i * 110);
  });

  const quote = document.getElementById('closing-quote');
  quote.classList.remove('vis');
  later(() => quote.classList.add('vis'), 1100);
}

// ═══════════════════════════════════════════════════════════
// CANVAS RESIZE
// ═══════════════════════════════════════════════════════════

let resizeTimer = null;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ['orb-canvas', 'map-canvas'].forEach(id => {
      const c = document.getElementById(id);
      if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
    });
    // Re-run current canvas scene if applicable
    if (currentScene === 0) s0Orb();
    if (currentScene === 1) { mapSetup = false; s1Map(); }
  }, 200);
});

// ═══════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  initVoices();   // load TTS voice list
  updateHUD();
  enterScene(0);

  // Chrome pauses speechSynthesis after ~15s if the tab loses focus.
  // Resume every 10s to keep it alive during a live presentation.
  setInterval(() => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 10000);
});
