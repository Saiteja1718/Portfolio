import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceGreeting } from './greetingMotion.js';

const idle = () => ({ progress: 0, target: 0, waveStarted: null });
const step = (pose, elapsed, greeted = true, motion = true, delta = 1 / 60) =>
  advanceGreeting(pose, { greeted, motion, elapsed, delta });

test('the character faces the desk until greeted, then turns before waving', () => {
  let pose = step(idle(), 0, false);
  assert.equal(pose.angle, Math.PI);
  assert.equal(pose.wave, 0);
  pose = step(pose, 1 / 60);
  assert.ok(pose.angle > 0 && pose.angle < Math.PI, 'turn begins without a jump');
  assert.equal(pose.wave, 0, 'no wave while facing away');
  let sawWave = false;
  for (let frame = 2; frame <= 360; frame++) {
    pose = step(pose, frame / 60);
    if (pose.wave > 0) { sawWave = true; assert.ok(pose.angle < Math.PI / 4); }
  }
  assert.ok(sawWave, 'greets the visitor with a wave');
  assert.equal(pose.angle, 0, 'finishes facing the visitor');
  assert.equal(pose.wave, 0, 'rests after the greeting');
});

test('replay returns to the desk and permits another greeting', () => {
  let pose = step(idle(), 0, true, false);
  pose = step(pose, 1, false, false);
  assert.equal(pose.angle, Math.PI);
  assert.equal(pose.waveStarted, null);
  pose = step(pose, 2, true, false);
  assert.equal(pose.angle, 0);
  assert.equal(pose.waveStarted, 2);
});

test('reduced motion immediately shows the correct pose without waving', () => {
  const pose = step(idle(), 0, true, false);
  assert.equal(pose.angle, 0);
  assert.equal(pose.wave, 0);
  assert.equal(step(pose, 1, false, false).angle, Math.PI);
});

test('resuming after a suspended tab does not skip the whole turn', () => {
  const pose = step(idle(), 300, true, true, 300);
  assert.ok(pose.angle > Math.PI / 2);
  assert.equal(pose.wave, 0);
});
