import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { advanceGreeting } from './greetingMotion';

// An original, locally built set and articulated character. No external models.
export function createStudio(host, { onError, onReady, greeted = false, motion = true }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#86b6b7');
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(0, 3.2, 9.6);
  camera.lookAt(0, 2.1, -0.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
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

  scene.add(new THREE.HemisphereLight('#effaff', '#b4a58b', 2.5));
  const sun = new THREE.DirectionalLight('#fff0d7', 4.5);
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
  const screen = texture((ctx, w, h) => {
    ctx.fillStyle = '#101f2c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#293b49'; ctx.fillRect(0, 0, w, 28);
    ['#d8a873', '#8fb9ac', '#72a4b6'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(16 + i * 16, 14, 4, 0, 7); ctx.fill(); });
    ctx.fillStyle = '#80c5bb'; ctx.font = 'bold 24px monospace'; ctx.fillText('hello, world_', 36, 94);
    const lines = ['import curiosity as fuel', '', 'def build_something_useful(data):', '    model = learn(data)', '    return make_an_impact(model)', '', '> training the next idea...'];
    ctx.font = '14px monospace';
    lines.forEach((line, i) => { ctx.fillStyle = i % 3 === 0 ? '#cbb4dd' : '#91b7ba'; ctx.fillText(line, 36, 140 + i * 27); });
  }, 768, 432);
  mesh(new THREE.PlaneGeometry(1.89, 1.03), new THREE.MeshBasicMaterial({ map: screen }), [0, 2.4, -1.73]);
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

  // Articulated toy avatar and swivel chair, facing the desk at first.
  const swivel = new THREE.Group(); swivel.position.set(0, 0, .45); scene.add(swivel);
  const chair = new THREE.Group(); swivel.add(chair);
  cylinder(.06, .08, .82, '#5b6865', [0, .48, 0], chair);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;
    rod([0, .18, 0], [Math.sin(angle) * .62, .1, Math.cos(angle) * .62], .035, '#4a5d59', chair);
    ball([.08, .08, .08], '#3e4c48', [Math.sin(angle) * .62, .08, Math.cos(angle) * .62], chair);
  }
  box([1.13, .18, 1.03], '#d6bd91', [0, .98, -.03], chair, .085);
  const back = box([1.1, .92, .16], '#d6bd91', [0, 1.44, -.47], chair, .075);
  back.rotation.x = -.1;
  rod([-.36, .7, -.35], [-.36, 1.65, -.52], .035, '#52645c', chair);
  rod([.36, .7, -.35], [.36, 1.65, -.52], .035, '#52645c', chair);

  const body = new THREE.Group(); body.position.y = .08; swivel.add(body);
  ball([.56, .63, .35], colors.navy, [0, 1.67, 0], body);
  box([.28, .78, .035], '#e4e4d9', [0, 1.69, .367], body, .012);
  // Overshirt lapels and stitched hem.
  for (const side of [-1, 1]) {
    const lapel = box([.16, .59, .06], '#2d4658', [side * .2, 1.81, .371], body);
    lapel.rotation.z = side * -.11;
    for (let i = 0; i < 3; i++) ball([.016, .016, .014], '#b3b5a5', [side * .27, 1.5 + i * .18, .412], body);
  }
  cylinder(.16, .18, .24, colors.skin, [0, 2.22, .015], body);
  for (const side of [-1, 1]) {
    ball([.24, .23, .48], '#253341', [side * .27, 1.01, .29], body);
    const shin = box([.34, .6, .35], '#253341', [side * .32, .63, .65], body, .15);
    shin.rotation.x = -.05;
    box([.38, .21, .64], '#e1e5db', [side * .32, .28, .78], body, .09);
    box([.4, .07, .66], '#b9c9c4', [side * .32, .19, .8], body, .03);
    for (let i = 0; i < 3; i++) box([.24, .012, .02], '#a8b9b2', [side * .32, .395, .79 + i * .065], body, .003);
  }

  const head = new THREE.Group(); head.position.set(0, 2.9, .015); body.add(head);
  ball([.76, .82, .68], colors.skin, [0, 0, 0], head);
  for (const side of [-1, 1]) {
    ball([.17, .23, .17], colors.skin, [side * .73, -.04, 0], head);
    ball([.065, .11, .055], '#b77f5c', [side * .79, -.04, .105], head);
  }
  // A hair cap covers the back; overlapping locks form a swept crown.
  const hair = mesh(new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI * .43), colors.hair, [0, .09, -.035], head);
  hair.scale.set(.79, .8, .71);
  ball([.74, .65, .43], colors.hair, [0, .14, -.32], head);
  for (let i = 0; i < 9; i++) {
    const lock = ball([.19, .31 + Math.sin(i) * .03, .41], i % 2 ? '#272b2c' : '#202627', [-.58 + i * .14, .59 + Math.sin(i / 8 * Math.PI) * .12, .18], head);
    lock.rotation.set(.1, -.15, -.45);
  }
  for (const side of [-1, 1]) {
    ball([.12, .32, .34], colors.hair, [side * .67, .16, -.1], head);
    // Eyebrows and expressive inset eyes.
    const brow = ball([.19, .036, .035], '#282b29', [side * .3, .18, .598], head);
    brow.rotation.z = side * -.1;
    ball([.175, .21, .07], '#faf1df', [side * .3, -.025, .617], head);
    ball([.105, .135, .045], '#3c493c', [side * .3, -.025, .677], head);
    ball([.064, .092, .027], '#1e2728', [side * .3, -.025, .71], head);
    ball([.028, .035, .012], '#ffffff', [side * .3 + .027, .025, .735], head);
    ball([.14, .055, .018], '#cb8c70', [side * .42, -.26, .57], head);
  }
  ball([.105, .125, .16], '#ce956e', [0, -.18, .651], head);
  // Small moustache and smile, modeled as curves rather than painted on.
  for (const side of [-1, 1]) {
    const moustache = ball([.12, .037, .025], '#3c342d', [side * .095, -.34, .621], head);
    moustache.rotation.z = side * -.12;
  }
  const smileCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.16, -.405, .59), new THREE.Vector3(0, -.49, .64), new THREE.Vector3(.16, -.405, .59));
  mesh(new THREE.TubeGeometry(smileCurve, 24, .012, 8, false), '#8d5340', [0, 0, 0], head);

  function arm(side) {
    const shoulder = new THREE.Group(); shoulder.position.set(side * .48, 2.02, .01); body.add(shoulder);
    const sleeve = mesh(new THREE.CapsuleGeometry(.18, .44, 6, 16), colors.navy, [side * .06, -.28, 0], shoulder);
    sleeve.rotation.z = side * .12;
    const forearm = new THREE.Group(); forearm.position.set(side * .1, -.58, .02); shoulder.add(forearm);
    mesh(new THREE.CapsuleGeometry(.14, .24, 6, 16), colors.navy, [0, -.12, .03], forearm);
    const hand = ball([.16, .2, .12], colors.skin, [0, -.37, .04], forearm);
    ball([.08, .11, .09], colors.skin, [-side * .13, -.32, .065], forearm);
    return { shoulder, forearm, hand };
  }
  const leftArm = arm(-1), rightArm = arm(1);
  leftArm.shoulder.rotation.x = -.4;
  rightArm.shoulder.rotation.x = -.4;

  let disposed = false, visible = true, pageVisible = !document.hidden, frame = 0;
  let target = greeted ? 1 : 0, enabled = motion;
  let pose = { progress: target, target, waveStarted: null };
  let lastTime = performance.now(), elapsed = 0;
  const pointer = { x: 0, y: 0 };
  const contextLost = event => { event.preventDefault(); onError(); stop(); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);

  const render = (now = performance.now()) => {
    frame = 0;
    const delta = Math.min((now - lastTime) / 1000, .05); lastTime = now;
    elapsed += delta;
    pose = advanceGreeting(pose, { greeted: Boolean(target), motion: enabled, delta, elapsed });
    const eased = pose.progress * pose.progress * (3 - 2 * pose.progress);
    swivel.rotation.y = pose.angle;
    body.position.y = .08 + (enabled ? Math.sin(elapsed * 1.7) * .012 : 0);
    head.rotation.y = enabled ? pointer.x * .1 * eased : 0;
    head.rotation.z = enabled ? Math.sin(elapsed * .8) * .018 * eased : 0;
    const { wave, waveTime } = pose;
    rightArm.shoulder.rotation.z = .12 + wave * 2.35;
    rightArm.shoulder.rotation.x = -.4 + wave * .25;
    rightArm.forearm.rotation.z = wave * (.32 + Math.sin(waveTime * 11) * .2);
    leftArm.shoulder.rotation.x = -.4 + eased * .3;
    camera.position.x = enabled ? pointer.x * .08 : 0;
    camera.lookAt(0, 2.1 + (enabled ? pointer.y * .035 : 0), -.2);
    renderer.render(scene, camera);
    if (!disposed && visible && pageVisible && enabled) frame = requestAnimationFrame(render);
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  const wake = () => { if (disposed || !visible || !pageVisible) return; if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(render); } };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    // Keep the character in frame on narrow screens without stretching it.
    camera.fov = width < 650 ? 48 : 42;
    camera.updateProjectionMatrix(); renderer.setSize(width, height);
    if (!enabled) renderer.render(scene, camera);
    wake();
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else stop(); });
  intersection.observe(host);
  const pageChange = () => { pageVisible = !document.hidden; if (pageVisible) wake(); else stop(); };
  document.addEventListener('visibilitychange', pageChange);
  const move = event => { pointer.x = event.clientX / window.innerWidth - .5; pointer.y = event.clientY / window.innerHeight - .5; };
  host.addEventListener('pointermove', move, { passive: true });
  swivel.rotation.y = Math.PI * (1 - target);
  resize(); renderer.render(scene, camera); onReady();

  return {
    setState(nextGreeted, nextMotion) {
      const next = nextGreeted ? 1 : 0;
      target = next; enabled = nextMotion;
      if (!enabled) { stop(); render(); } else wake();
    },
    dispose() {
      disposed = true; stop(); resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', pageChange);
      host.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      const geometries = new Set(), allMaterials = new Set(), textures = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) { allMaterials.add(material); if (material.map) textures.add(material.map); }
      });
      geometries.forEach(geometry => geometry.dispose());
      allMaterials.forEach(material => material.dispose()); textures.forEach(image => image.dispose());
      renderer.dispose(); renderer.domElement.remove();
    },
  };
}
