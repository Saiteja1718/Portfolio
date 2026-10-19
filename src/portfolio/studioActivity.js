const smooth = (start, end, value) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

// Resting hands stay on the desk even when animation is paused. The working
// pose eases out during the first half of the turn, before the rise begins.
export function workingPose(phase, elapsed = 0, motion = true) {
  const deskWeight = phase === 'idle' ? 1 : phase === 'turning' && motion ? 1 - smooth(0, 600, elapsed) : 0;
  return { deskWeight, movementWeight: motion ? deskWeight : 0 };
}

export function monitorActivity(seconds) {
  const time = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const step = Math.floor(time / 8);
  return { mode: ['code', 'training', 'results'][step % 3], progress: time % 8 / 8, cursor: Math.floor(time * 2) % 2 === 0 };
}
