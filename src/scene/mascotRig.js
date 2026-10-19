import { AnimationClip, AnimationMixer, LoopOnce } from 'three';

// The source model supplies the sitting pose and authored hand/face greeting.
// Filtering the wave keeps the seated hips and legs in place throughout it.
export function createMascotRig(model, clips) {
  const mixer = new AnimationMixer(model);
  const sitting = clips.find(clip => clip.name === 'Sitting');
  const sourceWave = clips.find(clip => clip.name === 'Wave');
  if (!sitting || !sourceWave) throw new Error('The mascot needs its Sitting and Wave clips.');
  const sit = mixer.clipAction(sitting);
  sit.setLoop(LoopOnce, 1); sit.clampWhenFinished = true; sit.play(); mixer.update(sitting.duration); sit.paused = true;
  const bones = model.getObjectsByProperty('isBone', true);
  const seated = bones.map(bone => ({ bone, q: bone.quaternion.clone(), p: bone.position.clone() }));
  sit.stop();
  const clip = new AnimationClip('Seated greeting', sourceWave.duration,
    sourceWave.tracks.filter(track => !/^(Body\.|UpperLeg|LowerLeg)/.test(track.name)).map(track => track.clone()));
  const targets = new Set(clip.tracks.map(track => track.name.split('.')[0]));
  const action = mixer.clipAction(clip); action.setLoop(LoopOnce, 1); action.clampWhenFinished = true;
  let waving = false;
  function restore(force = false) {
    seated.forEach(({ bone, q, p }) => {
      if (force || !waving || !targets.has(bone.name)) { bone.quaternion.copy(q); bone.position.copy(p); }
    });
  }
  function stop() { waving = false; action.stop(); restore(true); }
  const finished = () => stop();
  mixer.addEventListener('finished', finished);
  restore(true);
  return {
    bones,
    get waving() { return waving; },
    restore,
    greet() { stop(); action.reset().setEffectiveWeight(1).setEffectiveTimeScale(.85).fadeIn(.2).play(); waving = true; },
    update(delta) { if (waving) mixer.update(delta); },
    stop,
    dispose() { mixer.removeEventListener('finished', finished); mixer.stopAllAction(); mixer.uncacheRoot(model); },
  };
}
