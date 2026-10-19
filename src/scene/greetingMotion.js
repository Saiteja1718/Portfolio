export function advanceGreeting(previous, { greeted, motion, delta, elapsed }) {
  const target = greeted ? 1 : 0;
  const progress = motion
    ? previous.progress + (target - previous.progress) * (1 - Math.exp(-3.2 * Math.min(delta, .05)))
    : target;
  const settled = Math.abs(progress - target) < .001 ? target : progress;
  let waveStarted = previous.target !== target ? null : previous.waveStarted;
  if (target && settled > .78 && waveStarted === null) waveStarted = elapsed;
  const waveTime = waveStarted === null ? 0 : elapsed - waveStarted;
  const wave = motion && target && waveStarted !== null && waveTime < 3.2
    ? Math.max(0, Math.min(waveTime * 3, 1) * Math.min((3.2 - waveTime) * 2, 1))
    : 0;
  return {
    progress: settled, target, waveStarted, waveTime, wave,
    angle: Math.PI * (1 - settled * settled * (3 - 2 * settled)),
  };
}
