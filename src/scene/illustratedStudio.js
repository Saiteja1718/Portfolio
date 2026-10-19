import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createIllustrationActor } from './illustrationActor.js';
import { characterStage } from '../portfolio/characterSequence.js';
import { createStudioMonitor } from './studioMonitor.js';

// A live geometric studio featuring the user-supplied illustrated character.
export async function createIllustratedStudio(host, { onError, phase = 'idle', motion = true }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#8bb9b2');
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 3.05, 7.8);
  camera.lookAt(0, 2.1, -0.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const materials = new Map();
  const mat = (color, roughness = 0.7, metalness = 0) => {
    const key = `${color}-${roughness}-${metalness}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return materials.get(key);
  };
  const colors = { wall: '#80b2b1', wood: '#b77f51', lightWood: '#ddbb8a', cream: '#efe9d9', skin: '#c99069', hair: '#202326', navy: '#253a49', dark: '#263b3c', leaf: '#3d7460' };
  const mesh = (geometry, material, position, parent = scene) => {
    const object = new THREE.Mesh(geometry, typeof material === 'string' ? mat(material) : material);
    object.position.set(...position);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  };
  const box = (size, color, position, parent, radius = 0.035) => mesh(new RoundedBoxGeometry(...size, 2, Math.min(radius, ...size.map(n => n / 2))), color, position, parent);
  const ball = (size, color, position, parent) => {
    const object = mesh(new THREE.SphereGeometry(1, 32, 24), color, position, parent);
    object.scale.set(...size);
    return object;
  };
  const cylinder = (top, bottom, height, color, position, parent) => mesh(new THREE.CylinderGeometry(top, bottom, height, 24), color, position, parent);
  const rod = (start, end, radius, color, parent = scene) => {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
    const object = cylinder(radius, radius, a.distanceTo(b), color, a.clone().add(b).multiplyScalar(.5).toArray(), parent);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    return object;
  };
  const texture = (draw, width = 512, height = 512) => {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  };

  scene.add(new THREE.HemisphereLight('#effaff', '#b4a58b', 2));
  const sun = new THREE.DirectionalLight('#fff0d7', 3.4);
  sun.position.set(5, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .1, far: 25 });
  sun.shadow.normalBias = .035;
  sun.shadow.bias = -.0003;
  sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#a6e8ed', 1.3);
  fill.position.set(-5, 4, 3); scene.add(fill);

  // The studio: teal walls, parquet floor, shelving, and a sunlit window.
  box([19, 9, .16], colors.wall, [0, 4.3, -3.1]);
  box([.16, 9, 16], '#94c0bf', [-7.8, 4.3, 1]);
  box([19, .15, 18], '#c89c70', [0, -.12, 1]);
  for (let i = -11; i < 12; i++) box([.012, .004, 16], '#af815a', [i * .7, -.038, 1], scene, .001);
  for (let i = -3; i < 5; i++) box([16, .004, .008], '#b98e65', [0, -.035, i * 2], scene, .001);
  box([18, .13, .08], '#c6d8ca', [0, .05, -2.95]);
  const rug = cylinder(2.6, 2.6, .018, '#8dada4', [0, -.01, 1.25]);
  rug.scale.z = .57;

  const glass = mat('#d5eddf', .25);
  glass.emissive = new THREE.Color('#b8daca'); glass.emissiveIntensity = .3;
  box([2.3, 5.8, .06], glass, [4.5, 3.5, -2.98]);
  for (const x of [3.31, 4.5, 5.69]) box([.085, 6, .13], '#f0f0dc', [x, 3.5, -2.87]);
  for (const y of [.5, 3.5, 6.5]) box([2.48, .09, .14], '#f0f0dc', [4.5, y, -2.85]);
  box([2.8, .12, .45], '#efe7cf', [4.5, .5, -2.67]);
  for (let i = 0; i < 7; i++) {
    const curtain = cylinder(.065, .065, 6.3, '#dae5d7', [5.85 + i * .085, 3.45, -2.64]);
    curtain.scale.z = 1.8;
  }

  box([6.2, .13, .56], '#e4e6d8', [-.5, 4.45, -2.64]);
  box([.1, .35, .25], '#dde4d8', [-2.9, 4.24, -2.85]);
  box([.1, .35, .25], '#dde4d8', [1.8, 4.24, -2.85]);
  const bookColors = ['#324a56', '#e6c88e', '#687e69', '#f0e3bd', '#b66f4b', '#f4ead0', '#475b61'];
  for (let i = 0; i < 12; i++) {
    const h = .55 + Math.sin(i * 5.3) * .12;
    const book = box([.09 + (i % 3) * .025, h, .32], bookColors[i % bookColors.length], [-2.85 + i * .14, 4.53 + h / 2, -2.61]);
    if (i > 9) book.rotation.z = -.14;
    box([.008, .025, .324], '#e6dcc1', [-2.85 + i * .14, 4.68, -2.61]);
  }

  function plant(x, y, z, scale = 1, potColor = '#e5e1ce') {
    const group = new THREE.Group(); group.position.set(x, y, z); group.scale.setScalar(scale); scene.add(group);
    cylinder(.23, .16, .38, potColor, [0, .19, 0], group);
    cylinder(.2, .2, .025, '#443f2c', [0, .39, 0], group);
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      const height = .75 + (i % 3) * .15;
      const end = [Math.sin(angle) * .27, height, Math.cos(angle) * .27];
      rod([0, .35, 0], end, .018, '#456f4b', group);
      const leaf = ball([.17, .31, .035], i % 2 ? '#4d8b62' : '#2e6a51', [end[0], end[1] + .1, end[2]], group);
      leaf.rotation.set(.25, -angle, Math.sin(angle) * -.65);
    }
    return group;
  }
  plant(-.65, 4.52, -2.62, .64);
  plant(1.75, 4.52, -2.62, .65, '#d4ad73');
  plant(2.3, 4.52, -2.6, .5);
  plant(-3.4, 0, -1.1, 1.8, '#d9dfcb');
  plant(3, 1.53, -1.5, .65, '#d4ac75');

  function art(x, y, width, height, type) {
    box([width + .12, height + .12, .07], '#eae6d5', [x, y, -2.93]);
    const paper = texture((ctx, w, h) => {
      ctx.fillStyle = '#ede7d7'; ctx.fillRect(0, 0, w, h);
      if (type === 'sun') {
        ctx.fillStyle = '#d6a55c'; ctx.beginPath(); ctx.arc(w * .5, h * .42, w * .29, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#376d6e'; ctx.fillRect(w * .22, h * .43, w * .56, h * .38);
        ctx.fillStyle = '#a8bcb0'; ctx.fillRect(w * .22, h * .6, w * .56, h * .21);
      } else {
        ctx.strokeStyle = '#628d81'; ctx.lineWidth = 8;
        for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(w * .5, h * .8, 30 + i * 30, Math.PI, 0); ctx.stroke(); }
      }
    });
    mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: paper, roughness: 1 }), [x, y, -2.88]);
  }
  art(-2.5, 2.9, .9, 1.2, 'sun');
  art(1.95, 2.95, 1.1, 1.25, 'lines');

  // Desk and working details.
  box([6.15, .16, 1.45], colors.wood, [0, 1.47, -1.45], scene, .06);
  box([5.9, .055, 1.4], colors.lightWood, [0, 1.575, -1.45]);
  for (const x of [-2.35, 2.35]) {
    box([.95, 1.28, 1.23], '#d5dcd0', [x, .66, -1.46], scene, .07);
    for (const y of [.41, .83, 1.24]) {
      box([.86, .012, .02], '#acb9aa', [x, y, -.831], scene, .002);
      box([.24, .04, .035], '#9d8663', [x, y - .15, -.8]);
    }
    for (const z of [-1.88, -1.02]) ball([.07, .07, .07], '#3b4843', [x, .06, z]);
  }
  box([.68, .045, .37], '#546263', [0, 1.64, -1.67]);
  box([.095, .4, .09], '#728183', [0, 1.85, -1.76]);
  box([2, 1.14, .105], '#283e45', [0, 2.4, -1.79], scene, .045);
  const monitor = createStudioMonitor();
  mesh(new THREE.PlaneGeometry(1.89, 1.03), new THREE.MeshBasicMaterial({ map: monitor.texture }), [0, 2.4, -1.73]);
  const keyboard = box([.95, .035, .32], '#d4dfd5', [0, 1.635, -1.03]);
  for (let i = 0; i < 4; i++) box([.83, .012, .015], '#9fb4ae', [0, 1.658, -1.14 + i * .07]);
  ball([.1, .045, .15], '#dde4d5', [.72, 1.65, -1.05]);
  for (const x of [-1.55, 1.55]) {
    box([.4, .67, .38], '#33464a', [x, 1.92, -1.65], scene, .045);
    const speaker = cylinder(.135, .135, .024, '#1c2c32', [x, 1.92, -1.45]); speaker.rotation.x = Math.PI / 2;
    const center = cylinder(.065, .065, .028, '#657c78', [x, 1.92, -1.43]); center.rotation.x = Math.PI / 2;
    ball([.03, .03, .018], '#c6d7b8', [x, 2.14, -1.43]);
  }
  cylinder(.12, .1, .22, '#d9a45f', [-1.02, 1.72, -1.05]);
  const mugHandle = mesh(new THREE.TorusGeometry(.09, .027, 10, 24), '#d9a45f', [-.9, 1.72, -1.05]);
  mugHandle.rotation.y = Math.PI / 2;
  cylinder(.105, .105, .007, '#554838', [-1.02, 1.835, -1.05]);
  // Desk lamp.
  cylinder(.23, .23, .045, '#d3b071', [2.02, 1.64, -1.54]);
  rod([2.02, 1.65, -1.54], [2.02, 2.45, -1.54], .035, '#c6a064');
  rod([2.02, 2.45, -1.54], [1.75, 2.68, -1.54], .035, '#c6a064');
  const lamp = mesh(new THREE.ConeGeometry(.26, .28, 32, 1, true), '#dfbc78', [1.7, 2.62, -1.54]);
  lamp.rotation.z = .4;

  const swivel = new THREE.Group(); swivel.position.set(0, 0, .25); scene.add(swivel);
  const chair = new THREE.Group(); swivel.add(chair);
  // The upholstered upper chair swivels on a gas lift. Its five-caster base
  // keeps its orientation on the floor and rolls with the chair's translation.
  cylinder(.075, .095, .46, '#526561', [0, .49, 0], swivel);
  cylinder(.12, .16, .17, '#303b3b', [0, .24, 0], swivel);
  const casterRolls = [];
  for (let index = 0; index < 5; index++) {
    const angle = index * Math.PI * 2 / 5;
    const x = Math.sin(angle) * .64, z = Math.cos(angle) * .64;
    rod([0, .25, 0], [x, .14, z], .045, '#526561', swivel);
    const caster = new THREE.Group(); caster.position.set(x, .09, z); swivel.add(caster);
    box([.13, .08, .12], '#303b3b', [0, .06, 0], caster, .025);
    const roll = new THREE.Group(); caster.add(roll);
    for (const side of [-1, 1]) {
      const wheel = cylinder(.09, .09, .045, '#27322f', [side * .055, 0, 0], roll);
      wheel.rotation.z = Math.PI / 2;
    }
    casterRolls.push({ caster, roll });
  }
  box([1.26, .17, 1.04], '#d5b68e', [0, .8, -.05], chair, .08);
  const back = box([1.18, .7, .18], '#e1c59e', [0, 1.32, -.55], chair, .085); back.rotation.x = -.08;
  // The back overlays the rear-view torso. Below the seat, normal depth testing
  // lets the chair frame sit in front of feet tucked toward the desk.
  const foregroundBack = new THREE.Mesh(back.geometry, back.material.clone());
  foregroundBack.material.transparent = true; foregroundBack.material.depthTest = false; foregroundBack.material.depthWrite = false;
  foregroundBack.position.copy(back.position); foregroundBack.rotation.copy(back.rotation);
  foregroundBack.renderOrder = 11; foregroundBack.receiveShadow = true; chair.add(foregroundBack);
  rod([-.44, .52, -.42], [-.44, 1.5, -.59], .027, '#303b3b', chair);
  rod([.44, .52, -.42], [.44, 1.5, -.59], .027, '#303b3b', chair);

  let character;
  try {
    character = await createIllustrationActor();
    scene.add(character.mesh);
    const contactShadow = new THREE.Mesh(new THREE.CircleGeometry(.6, 48), new THREE.MeshBasicMaterial({color:'#253e3a',transparent:true,opacity:.14,depthWrite:false}));
    contactShadow.rotation.x = -Math.PI / 2; contactShadow.scale.y = .4; contactShadow.position.set(0,.024,.45); scene.add(contactShadow);
    let disposed = false, frame = 0, visible = true, enabled = motion;
    let currentPhase = phase, phaseStart = performance.now(), lastTime = performance.now(), elapsed = 0;
    let width = 1, height = 1, lastTurn = -1, lastRetreat = -1;
    const raycaster = new THREE.Raycaster(), rayPoint = new THREE.Vector2();
    const render = (now = performance.now()) => {
      frame = 0;
      const delta = Math.min(Math.max(0, now - lastTime) / 1000, .04); lastTime = now;
      if (enabled) elapsed += delta;
      const phaseElapsed = now - phaseStart;
      const pose = characterStage(currentPhase, phaseElapsed, enabled);
      chair.rotation.y = Math.PI * (1 - pose.turn);
      // Move the complete chair toward the open floor, in world space. Moving
      // it backwards inside the rotating swivel drove its back into the desk.
      const travelX = pose.chairX - swivel.position.x;
      const travelZ = pose.chairZ - swivel.position.z;
      if (Math.hypot(travelX, travelZ) > .00001) {
        casterRolls.forEach(({ caster, roll }) => {
          caster.rotation.y = Math.atan2(travelX, travelZ);
          roll.rotation.x += Math.hypot(travelX, travelZ) / .09;
        });
      }
      swivel.position.z = pose.chairZ;
      swivel.position.x = pose.chairX;
      foregroundBack.material.opacity = pose.backOcclusion;
      foregroundBack.visible = pose.backOcclusion > .001;
      if (pose.turn !== lastTurn || pose.chairZ !== lastRetreat) {
        renderer.shadowMap.needsUpdate = true; lastTurn = pose.turn; lastRetreat = pose.chairZ;
      }
      character.mesh.position.z = pose.actorZ;
      contactShadow.position.z = pose.actorZ - .95 * (1 - pose.turn);
      character.update(currentPhase, phaseElapsed, enabled, elapsed);
      monitor.update(elapsed, enabled && currentPhase === 'idle');
      const narrow = width < 650;
      const panX = narrow ? 0 : pose.reveal * (width / height > 1.6 ? 2.15 : 1.5);
      const panY = narrow ? -pose.reveal * .82 : 0;
      camera.position.set(panX, 3.05 + panY, narrow ? 8.6 : 7.8);
      camera.lookAt(panX, 1.85 + panY, -.15);
      renderer.render(scene, camera);
      if (!disposed && visible && !document.hidden && enabled) frame = requestAnimationFrame(render);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const wake = () => {
      if (!disposed && visible && !document.hidden && enabled && !frame) { lastTime = performance.now(); frame = requestAnimationFrame(render); }
    };
    const resize = () => {
      const bounds = host.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      if (!width || !height) return;
      camera.aspect = width / height; camera.fov = width < 650 ? 47 : 40; camera.updateProjectionMatrix();
      renderer.setSize(width, height); renderer.shadowMap.needsUpdate = true; stop(); render();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else stop(); }); observer.observe(host);
    const visibility = () => { if (document.hidden) stop(); else { stop(); render(); } };
    const lost = event => { event.preventDefault(); stop(); onError?.(); };
    document.addEventListener('visibilitychange', visibility);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    resize();
    return {
      hitTest(x, y) {
        const bounds = host.getBoundingClientRect();
        rayPoint.set((x - bounds.left) / bounds.width * 2 - 1, -(y - bounds.top) / bounds.height * 2 + 1);
        scene.updateMatrixWorld(true); raycaster.setFromCamera(rayPoint, camera);
        return raycaster.intersectObject(character.mesh).some(hit => character.contains(hit.uv));
      },
      setState(nextPhase, nextMotion) {
        if (nextPhase !== currentPhase) {
          currentPhase = nextPhase; phaseStart = performance.now();
        }
        enabled = nextMotion; stop(); render();
      },
      dispose() {
        disposed = true; stop(); resizeObserver.disconnect(); observer.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        scene.remove(character.mesh); character.dispose(); disposeSet();
      },
    };
  } catch (error) { character?.dispose(); disposeSet(); throw error; }
  function disposeSet() {
    const geometries = new Set(), allMaterials = new Set(), textures = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []) {
        allMaterials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    geometries.forEach(item => item.dispose()); allMaterials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
    renderer.dispose(); renderer.domElement.remove();
  }
}
