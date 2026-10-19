export const TURN_MS = 1200;
export const RISE_MS = 1100;
export const HELLO_MS = 2100;
export const POCKET_MS = 1000;
export const ORIGINAL_FRAME = -1;
export const CHARACTER_STILL = 'images/sai-illustration.png';
export const CHARACTER_ATLAS = 'images/sai-motion-atlas.png';
export const CHARACTER_PHASES = {
  turning: { next: 'rising', duration: TURN_MS },
  rising: { next: 'greeting', duration: RISE_MS },
  greeting: { next: 'settling', duration: HELLO_MS },
  settling: { next: 'posed', duration: POCKET_MS },
};
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
function sample(frames, progress) {
  const value = clamp(progress) * (frames.length - 1), index = Math.min(frames.length - 2, Math.floor(value));
  return { from: frames[index], to: frames[index + 1], blend: value - index };
}

// The full illustrated person changes pose together; the terminal frame is the
// user's original PNG, not a generated approximation or a separate face layer.
export function characterFrame(phase, elapsed = 0, motion = true, idleTime = 0) {
  if (phase === 'idle') {
    if (!motion) return { from: 0, to: 0, blend: 0 };
    return { from: 0, to: 0, blend: 0 };
  }
  if (phase === 'turning') return sample([0, 2, 3, 4, 5], motion ? smooth(elapsed / TURN_MS) : 1);
  if (phase === 'rising') return sample([5, 6, 7, 8], motion ? smooth(elapsed / RISE_MS) : 1);
  if (phase === 'greeting') return sample([8, 9, 10, 11, 10, 12], motion ? smooth(elapsed / HELLO_MS) : 1);
  if (phase === 'settling') return sample([12, 13, 14, 15], motion ? smooth(elapsed / POCKET_MS) : 1);
  return { from: 15, to: ORIGINAL_FRAME, blend: motion ? smooth(elapsed / 350) : 1 };
}

export function characterStage(phase, elapsed = 0, motion = true) {
  const turn = phase === 'idle' ? 0 : phase === 'turning' ? motion ? smooth(elapsed / TURN_MS) : 1 : 1;
  const stand = ['greeting', 'settling', 'posed'].includes(phase) ? 1 : phase === 'rising' ? motion ? smooth(elapsed / RISE_MS) : 1 : 0;
  const reveal = phase === 'greeting' ? motion ? smooth(elapsed / 800) : 1 : ['settling', 'posed'].includes(phase) ? 1 : 0;
  const chairAdvance = phase === 'idle' ? 0 : phase === 'turning'
    ? .25 * (motion ? smooth((elapsed / TURN_MS - .55) / .45) : 1) : .25 + stand * .1;
  const backOcclusion = phase === 'idle' ? 1 : phase === 'turning' && motion ? 1 - smooth(elapsed / 220) : 0;
  // One fixed depth and floor anchor for the entire performance. Camera motion
  // begins after he stands, and the chair clears the seat before the rise.
  return { turn, stand, reveal, actorZ: 1.35, chairX: 1.4 * smooth((stand - .2) / .8), chairZ: .4 + chairAdvance, backOcclusion };
}
