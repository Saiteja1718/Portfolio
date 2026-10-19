export const TURN_DURATION = 1200;
export const STAND_DURATION = 1100;
export const INTRO_DURATION = TURN_DURATION + STAND_DURATION;

export function portraitPose(phase, elapsed, motion = true, time = 0, pointerX = 0) {
  const t = Math.max(0, Math.min(1, elapsed / INTRO_DURATION));
  const reveal = phase === 'idle' ? 0 : phase === 'turning' && motion ? t * t * (3 - 2 * t) : 1;
  return {
    reveal,
    headTilt: motion ? Math.sin(time * .8) * .012 + pointerX * .045 + (phase === 'turning' ? Math.sin(t * Math.PI) * .065 : 0) : 0,
    sway: motion ? Math.sin(time * .65) * .006 : 0,
    breath: motion ? Math.sin(time * 1.65) * .008 : 0,
  };
}

// Deform the supplied illustration gently around the shoulders and neck.
// The feet remain planted; the file itself and the character's appearance stay intact.
export function portraitVertex(x, y, height, pose, out = {}) {
  const fraction = (y + height / 2) / height;
  const head = Math.max(0, Math.min(1, (fraction - .72) / .13));
  const angle = pose.headTilt * head * head * (3 - 2 * head);
  const pivot = height * .24, cosine = Math.cos(angle), sine = Math.sin(angle);
  const body = Math.sin(Math.max(0, Math.min(1, fraction)) * Math.PI);
  out.x = x * cosine - (y - pivot) * sine + pose.sway * height * fraction * fraction + x * pose.breath * body;
  out.y = pivot + x * sine + (y - pivot) * cosine + pose.breath * height * body * .12;
  return out;
}
export function studioPose(phase, elapsed, motion = true, idleTime = 0) {
  const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const turn = phase === 'idle' ? 0 : phase === 'turning' && motion ? smooth(elapsed / TURN_DURATION) : 1;
  const stand = phase === 'greeting' ? 1 : phase === 'rising' ? motion ? smooth(elapsed / STAND_DURATION) : 1 : 0;
  const reveal = phase === 'greeting' ? 1 : phase === 'rising' && motion ? smooth((elapsed - 650) / 450) : 0;
  const beat = idleTime % 14;
  const gesture = phase === 'idle' && motion && beat > 10 && beat < 12 ? Math.sin((beat - 10) * Math.PI / 2) : 0;
  return { turn, stand, reveal, typing: phase === 'idle' ? 1 : phase === 'turning' ? 1 - turn : 0, gesture };
}

export const SLIDE_DURATION = 460;
export const WHEEL_COOLDOWN = 400;
const WHEEL_THRESHOLD = 24;
const GESTURE_PAUSE = 100;

export function normalizeWheelDelta(delta, mode = 0, pageHeight = 800) {
  if (!Number.isFinite(delta)) return 0;
  return delta * (mode === 1 ? 16 : mode === 2 ? pageHeight : 1);
}

export function initialWheelState() {
  return { total: 0, sign: 0, used: false, peak: 0, tail: Infinity, decayed: false,
    lastEvent: -Infinity, lastAction: -Infinity, pending: 0 };
}

// A fresh finger swipe can begin before the previous swipe's momentum ends.
// Recognize its acceleration or direction change instead of requiring silence.
export function wheelStep(previous, delta, now) {
  const amount = Math.abs(delta), sign = Math.sign(delta);
  if (!Number.isFinite(delta) || amount < .1) return { direction: 0, state: previous };
  const reversed = previous.sign !== 0 && sign !== previous.sign;
  if (reversed && amount < 1) return { direction: 0, state: previous };
  const accelerated = previous.used && previous.decayed && now - previous.lastAction >= 100
    && amount >= Math.max(2, previous.tail * 2.8);
  const fresh = now - previous.lastEvent >= GESTURE_PAUSE || reversed || accelerated;
  const state = { ...previous, sign, lastEvent: now,
    total: fresh ? amount : previous.total + amount,
    used: fresh ? false : previous.used,
    peak: fresh ? amount : Math.max(previous.peak, amount),
    tail: fresh ? amount : previous.tail,
    decayed: fresh ? false : previous.decayed,
    pending: reversed ? 0 : previous.pending };
  if (state.used && amount <= state.peak * .5) {
    state.decayed = true;
    state.tail = Math.min(state.tail, amount);
  } else if (!state.decayed) state.tail = state.peak;
  let direction = 0;
  if (!state.used && state.total >= WHEEL_THRESHOLD) {
    state.used = true;
    if (now - state.lastAction >= WHEEL_COOLDOWN) {
      direction = sign; state.lastAction = now; state.pending = 0;
    } else state.pending = sign;
  }
  return { direction, state };
}

// Deliver a deliberate swipe received during a transition even if no more wheel
// events arrive. The old handler silently dropped these short gestures.
export function flushWheel(previous, now) {
  if (!previous.pending || now - previous.lastAction < WHEEL_COOLDOWN) return { direction: 0, state: previous };
  return { direction: previous.pending, state: { ...previous, pending: 0, used: true, lastAction: now } };
}
