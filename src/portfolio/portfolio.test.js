import test from 'node:test';
import { CHARACTER_PHASES, CHARACTER_STILL, ORIGINAL_FRAME, characterFrame, characterStage } from './characterSequence.js';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { workingPose, monitorActivity } from './studioActivity.js';
import { readRoute, CASES, PROJECTS, SLIDES, slideAfter } from './content.js';
import { portraitPose, portraitVertex, INTRO_DURATION, wheelStep, flushWheel, normalizeWheelDelta, initialWheelState, WHEEL_COOLDOWN } from './animation.js';

test('every named section, project, refresh URL and legacy URL resolves', () => {
  assert.equal(readRoute('').page, 'home');
  assert.equal(readRoute('#/about/').page, 'about');
  assert.equal(readRoute('#/work').slide, 0);
  assert.deepEqual(SLIDES.map(item => item.label), ['About','Skills','Projects','Experience','Contact']);
  SLIDES.forEach((item, index) => assert.equal(readRoute(`#/work/${item.id}`).slide, index));
  ['skills','projects','experience'].forEach(section => assert.equal(readRoute(`#/${section}`).section, section));
  CASES.forEach((item, index) => {
    assert.equal(readRoute(`#/project/${item.id}`).index, index);
    assert.equal(readRoute(`#/case/${item.id}`).index, index);
  });
  assert.equal(readRoute('#/project/missing').page, 'missing');
  assert.equal(readRoute('#/%broken').page, 'missing');
  assert.equal(PROJECTS.length, 4);
});

test('section carousel respects bounds', () => {
  assert.equal(slideAfter(0, -1), 0);
  assert.equal(slideAfter(SLIDES.length - 1, 1), SLIDES.length - 1);
  assert.equal(slideAfter(2, -1), 1);
});

test('trackpad momentum advances one section per gesture', () => {
  let state = initialWheelState(); const actions = [];
  for (let time = 0; time <= 1200; time += 40) {
    const result = wheelStep(state, time < 200 ? 12 : 4, time);
    state = result.state; if (result.direction) actions.push(result.direction);
  }
  assert.deepEqual(actions, [1]);
  assert.equal(wheelStep(state, -55, 1700).direction, -1);
});

test('small movements and rapid repeat gestures do not skip sections', () => {
  let result = wheelStep(initialWheelState(), 4, 0); assert.equal(result.direction, 0);
  result = wheelStep(result.state, 45, 50); assert.equal(result.direction, 1);
  result = wheelStep(result.state, 50, 400); assert.equal(result.direction, 0);
  result = wheelStep(result.state, 50, 1000); assert.equal(result.direction, 1);
});

test('a short swipe during the transition is delivered without another wheel event', () => {
  let result = wheelStep(initialWheelState(), 35, 0);
  assert.equal(result.direction, 1);
  result = wheelStep(result.state, 30, 160);
  assert.equal(result.direction, 0);
  assert.equal(result.state.pending, 1);
  assert.equal(flushWheel(result.state, WHEEL_COOLDOWN - 1).direction, 0);
  const flushed = flushWheel(result.state, WHEEL_COOLDOWN);
  assert.equal(flushed.direction, 1);
  assert.equal(flushWheel(flushed.state, 900).direction, 0);
});

test('another swipe is recognized without waiting for trackpad momentum to go quiet', () => {
  let state = initialWheelState(); const directions = [];
  const trace = [[0,40],[16,30],[48,14],[64,6],[80,2],[96,.5],
    [160,2],[176,6],[192,12],[208,16]];
  for (const [time, delta] of trace) {
    const result = wheelStep(state, delta, time); state = result.state;
    if (result.direction) directions.push(result.direction);
  }
  const queued = flushWheel(state, 400);
  assert.equal(queued.direction, 1);
  directions.push(queued.direction);
  assert.deepEqual(directions, [1,1]);
});

test('quick direction reversal clears old momentum and queues the opposite section', () => {
  let result = wheelStep(initialWheelState(), 60, 0);
  result = wheelStep(result.state, 12, 32);
  result = wheelStep(result.state, -10, 96);
  result = wheelStep(result.state, -18, 112);
  assert.equal(result.state.pending, -1);
  const flushed = flushWheel(result.state, 400);
  assert.equal(flushed.direction, -1);
  result = wheelStep(flushed.state, -4, 416);
  assert.equal(result.direction, 0);
});

test('small opposite-direction noise does not cancel a queued intentional swipe', () => {
  let result = wheelStep(initialWheelState(), 35, 0);
  result = wheelStep(result.state, 30, 160);
  result = wheelStep(result.state, -.2, 176);
  assert.equal(flushWheel(result.state, 400).direction, 1);
});

test('light swipes and line/page wheel units behave consistently', () => {
  let result = wheelStep(initialWheelState(), 8, 0);
  result = wheelStep(result.state, 8, 16);
  result = wheelStep(result.state, 8, 32);
  assert.equal(result.direction, 1);
  assert.equal(normalizeWheelDelta(3, 1), 48);
  assert.equal(normalizeWheelDelta(-1, 2, 844), -844);
  assert.equal(normalizeWheelDelta(12, 0), 12);
  assert.equal(normalizeWheelDelta(NaN), 0);
});

test('the illustration moves gently while its feet stay planted', () => {
  const height = 4.25;
  const still = portraitPose('idle', 0, false);
  const moving = portraitPose('idle', 500, true, 1.5, .5);
  const foot = portraitVertex(0, -height / 2, height, moving);
  assert.equal(foot.x, 0);
  assert.equal(foot.y, -height / 2);
  const originalHead = portraitVertex(.1, height / 2, height, still);
  const animatedHead = portraitVertex(.1, height / 2, height, moving);
  assert.ok(Math.abs(animatedHead.x - originalHead.x) > .01);
  assert.equal(portraitPose('turning', INTRO_DURATION / 2).reveal, .5);
  assert.equal(portraitPose('greeting', 0, false).reveal, 1);
  assert.equal(still.headTilt, 0);
  assert.equal(still.sway, 0);
  assert.equal(still.breath, 0);
});

test('research and application links are kept exactly as in the resume', () => {
  assert.deepEqual(CASES.filter(item => item.url).map(item => item.url), [
    'https://github.com/Saiteja1718/Arrhythmia_Classification',
    'https://github.com/Saiteja1718/Brain_Tumor',
    'https://github.com/Saiteja1718/Resume_Fit-AI-Semantic-Matching-for-Jobs',
    'https://github.com/Saiteja1718/diet-recommendation-system',
  ]);
});


test('the illustrated sequence turns, stands, says hello and settles into the exact original', () => {
  const phases = ['turning', 'rising', 'greeting', 'settling'];
  assert.deepEqual(phases.map(phase => CHARACTER_PHASES[phase].next), ['rising', 'greeting', 'settling', 'posed']);
  assert.equal(characterStage('turning', CHARACTER_PHASES.turning.duration).stand, 0);
  assert.equal(characterStage('rising', CHARACTER_PHASES.rising.duration).stand, 1);
  assert.equal(characterStage('greeting', 0).stand, 1);
  assert.equal(characterStage('rising', 0).reveal, 0);
  assert.equal(characterStage('greeting', 0).reveal, 0);
  assert.equal(characterStage('greeting', 800).reveal, 1);
  for (const phase of phases) {
    for (let elapsed = 0; elapsed <= CHARACTER_PHASES[phase].duration; elapsed += 10) {
      const frame = characterFrame(phase, elapsed);
      assert.ok(frame.from >= 0 && frame.from < 16);
      assert.ok(frame.to >= 0 && frame.to < 16);
      assert.ok(frame.blend >= 0 && frame.blend <= 1 && Number.isFinite(frame.blend));
    }
  }
  assert.equal(characterFrame('settling', CHARACTER_PHASES.settling.duration).to, 15);
  const final = characterFrame('posed', 400);
  assert.equal(final.to, ORIGINAL_FRAME);
  assert.equal(final.blend, 1);
  assert.equal(CHARACTER_STILL, 'images/sai-illustration.png');
  assert.deepEqual(characterFrame('idle', 0, false), { from: 0, to: 0, blend: 0 });
  assert.equal(characterFrame('posed', 0, false).blend, 1);
  assert.equal(characterStage('posed', 0, false).stand, 1);
});

test('chair clears before rising and camera waits until standing', () => {
  for (const phase of ['idle', ...Object.keys(CHARACTER_PHASES), 'posed']) {
    for (let elapsed = 0; elapsed <= 2200; elapsed += 20) {
      const stage = characterStage(phase, elapsed);
      assert.equal(stage.actorZ, 1.35);
      if (['idle', 'turning', 'rising'].includes(phase)) assert.equal(stage.reveal, 0);
      if (['rising', 'greeting', 'settling', 'posed'].includes(phase)) {
        assert.ok(stage.chairZ >= .65 && stage.chairZ <= .75);
        assert.equal(stage.backOcclusion, 0);
      }
    }
  }
  assert.deepEqual(characterStage('turning', CHARACTER_PHASES.turning.duration), characterStage('rising', 0));
  assert.deepEqual(characterStage('rising', CHARACTER_PHASES.rising.duration), characterStage('greeting', 0));
});

test('the rotating chair envelope stays in front of the desk', () => {
  // Back corners at x=±.7, z=-.74 are the widest chair envelope;
  // the desk front is z=-.725. Check the entire turn, not only endpoints.
  const radius = Math.hypot(.7, .74);
  for (let elapsed = 0; elapsed <= CHARACTER_PHASES.turning.duration; elapsed += 5) {
    const stage = characterStage('turning', elapsed);
    assert.ok(stage.chairZ - radius > -.725);
  }
  // Standing chair's front seat edge stays behind the illustrated actor.
  const standing = characterStage('posed', 0);
  assert.ok(standing.chairZ + .55 < standing.actorZ);
  assert.ok(standing.chairX - .7 > .6, 'parked chair clears the character’s legs and shoes');
});

test('every animated pose transition has a complete finite motion field', () => {
  const metadata = JSON.parse(readFileSync(new URL('./characterMotion.json', import.meta.url)));
  const bytes = readFileSync(new URL('../../public/images/sai-motion-flow.bin', import.meta.url));
  assert.equal(bytes.length, metadata.width * metadata.height * 4 * 2);
  for (let offset = 0; offset < bytes.length; offset += 2) {
    assert.notEqual(bytes.readUInt16LE(offset) & 0x7c00, 0x7c00, 'motion field must contain no NaN/infinity');
  }
  for (const phase of [...Object.keys(CHARACTER_PHASES), 'posed']) {
    for (let elapsed = 0; elapsed <= (CHARACTER_PHASES[phase]?.duration ?? 350); elapsed += 5) {
      const frame = characterFrame(phase, elapsed);
      assert.ok(metadata.pairs.some(pair =>
        pair.start === frame.from && pair.end === frame.to || pair.end === frame.from && pair.start === frame.to));
    }
  }
});

test('working hands stay on the desk while paused and release before standing', () => {
  assert.deepEqual(workingPose('idle', 0, false), { deskWeight: 1, movementWeight: 0 });
  assert.deepEqual(workingPose('idle', 0), workingPose('turning', 0));
  let previous = 1;
  for (let elapsed = 0; elapsed <= 600; elapsed += 10) {
    const pose = workingPose('turning', elapsed);
    assert.ok(pose.deskWeight <= previous && previous - pose.deskWeight < .03);
    previous = pose.deskWeight;
  }
  for (const phase of ['rising', 'greeting', 'settling', 'posed']) {
    assert.deepEqual(workingPose(phase), { deskWeight: 0, movementWeight: 0 });
  }
});

test('the monitor advances through typing, training and results, then repeats', () => {
  assert.deepEqual([0, 8, 16, 24].map(time => monitorActivity(time).mode), ['code', 'training', 'results', 'code']);
  assert.ok(monitorActivity(5).progress > monitorActivity(1).progress);
  assert.notEqual(monitorActivity(0).cursor, monitorActivity(.5).cursor);
  for (const time of [-1, NaN, Infinity, 1000]) {
    const { mode, progress } = monitorActivity(time);
    assert.ok(['code', 'training', 'results'].includes(mode));
    assert.ok(Number.isFinite(progress) && progress >= 0 && progress < 1);
  }
});
