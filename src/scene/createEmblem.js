import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createEmblem(host, kind, motion = true) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0, 0); renderer.domElement.setAttribute('aria-hidden', 'true'); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), group = new THREE.Group(); scene.add(group);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 30); camera.position.set(0, .15, 6.5); camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight('#fffdf0', '#7e9f92', 3));
  const key = new THREE.DirectionalLight('#fff4df', 4); key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight('#9cddd5', 2); rim.position.set(3, 2, -3); scene.add(rim);
  const materials = {}, colors = { cream:'#f3e6cb', orange:'#ffa82e', teal:'#4eaca2', ink:'#3d514a', pale:'#c6d7c2' };
  for (const [name, color] of Object.entries(colors)) materials[name] = new THREE.MeshStandardMaterial({ color, roughness:.35, metalness:.08 });
  const mesh = (geo, color, pos=[0,0,0], parent=group) => { const o=new THREE.Mesh(geo,materials[color]); o.position.set(...pos); parent.add(o); return o; };
  const box = (size,color,pos,parent=group,r=.07) => mesh(new RoundedBoxGeometry(...size,3,Math.min(r,...size.map(v=>v/2))),color,pos,parent);
  const ball = (r,color,pos,parent=group) => mesh(new THREE.SphereGeometry(r,20,16),color,pos,parent);
  const torus=(r,t,color,pos=[0,0,0],parent=group)=>mesh(new THREE.TorusGeometry(r,t,12,64),color,pos,parent);
  const rod=(a,b,r,color,parent=group)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);const o=mesh(new THREE.CylinderGeometry(r,r,start.distanceTo(end),10),color,start.clone().add(end).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return o;};
  const animated = [];
  group.rotation.set(-.12,-.28,-.05);
  if (kind === 'about') {
    const head = new THREE.Group(); group.add(head);
    box([1.5,1.12,.85],'cream',[0,.18,0],head,.2);
    box([1.23,.62,.1],'ink',[0,.17,.46],head,.16);
    for(const side of [-1,1]) {const eye=ball(.105,'teal',[side*.3,.22,.54],head);eye.scale.y=1.4;ball(.18,'orange',[side*.87,.2,0],head);}
    const smile=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.22,-.02,.54),new THREE.Vector3(0,-.15,.58),new THREE.Vector3(.22,-.02,.54));
    mesh(new THREE.TubeGeometry(smile,20,.024,8,false),'cream',[0,0,0],head);
    rod([0,.75,0],[0,1.04,0],.035,'ink',head);ball(.1,'orange',[0,1.1,0],head);
    const ring=torus(1.23,.055,'orange');ring.rotation.x=.35;ring.rotation.y=.25;
    animated.push((t)=>{head.rotation.z=Math.sin(t*.9)*.05;ring.rotation.z=t*.18;});
    box([.82,.55,.65],'teal',[0,-.75,0],group,.15);
  } else if (kind === 'skills' || kind === 'brain' || kind === 'heart') {
    const core=mesh(new THREE.IcosahedronGeometry(.48,2),'orange');
    for(let i=0;i<3;i++){const orbit=new THREE.Group();orbit.rotation.set(i*Math.PI/3,.4+i*.8,i*.5);group.add(orbit);torus(.95,.038,'teal',[0,0,0],orbit);const node=ball(.13,i%2?'orange':'cream',[.95,0,0],orbit);animated.push(t=>{orbit.rotation.z=t*(.16+i*.07)+i;node.scale.setScalar(1+Math.sin(t*2+i)*.08);});}
    animated.push(t=>{core.rotation.y=t*.25;core.rotation.x=t*.12;});
  } else if (kind === 'projects' || kind === 'resume') {
    for(let i=0;i<3;i++) {
      const panel=new THREE.Group();panel.position.set((i-1)*.12,(i-1)*.12,(i-1)*.25);group.add(panel);
      box([1.65,1.12,.12],i===2?'cream':'teal',[0,0,0],panel);
      box([1.54,.16,.025],i===2?'teal':'pale',[0,.43,.08],panel,.02);
      for(let n=0;n<3;n++)ball(.024,n===0?'orange':'cream',[-.65+n*.09,.43,.1],panel);
      if(i===2) {
        rod([-.46,.16,.11],[-.64,0,.11],.04,'orange',panel);rod([-.64,0,.11],[-.46,-.16,.11],.04,'orange',panel);
        rod([.46,.16,.11],[.64,0,.11],.04,'orange',panel);rod([.64,0,.11],[.46,-.16,.11],.04,'orange',panel);
        rod([.1,.22,.11],[-.08,-.24,.11],.036,'ink',panel);
      }
      animated.push(t=>{panel.position.y=(i-1)*.12+Math.sin(t*1.2+i*.7)*.045;});
    }
    const star=mesh(new THREE.OctahedronGeometry(.25,0),'orange',[.95,.85,.5]);animated.push(t=>{star.rotation.y=t*.6;star.rotation.z=t*.3;});
  } else if (kind === 'experience' || kind === 'claims') {
    box([1.7,1.2,.6],'teal',[0,-.1,0]);
    box([.72,.48,.24],'ink',[0,.64,-.04]);box([.46,.3,.25],'cream',[0,.65,.03]);
    box([1.74,.12,.65],'cream',[0,.1,.03]);box([.17,.26,.1],'orange',[0,.1,.4]);
    const graph=new THREE.Group();graph.position.set(.56,.64,.4);group.add(graph);
    for(let i=0;i<3;i++){const bar=box([.17,.3+i*.17,.19],i===2?'orange':'pale',[(i-1)*.24,i*.085,0],graph);animated.push(t=>{bar.scale.y=1+Math.sin(t*1.5-i)*.12;});}
    animated.push(t=>graph.rotation.y=Math.sin(t*.8)*.12);
  } else if (kind === 'diet') {
    const bowl=mesh(new THREE.SphereGeometry(.82,32,20,0,Math.PI*2,0,Math.PI/2),'cream',[0,.05,0]);bowl.rotation.x=Math.PI;
    torus(.81,.055,'orange',[0,.05,0]).rotation.x=Math.PI/2;
    for(let i=0;i<8;i++){const a=i*2.4;const leaf=ball(.23,i%3?'teal':'orange',[Math.cos(a)*.4,.13+Math.sin(i)*.1,Math.sin(a)*.4]);leaf.scale.set(1,.55,1.3);animated.push(t=>{leaf.position.y=.15+Math.sin(t*1.4+i)*.04;});}
  } else {
    box([1.75,1.12,.24],'cream',[0,-.1,0]);
    rod([-.81,-.56,.15],[0,.06,.15],.025,'orange');rod([.81,-.56,.15],[0,.06,.15],.025,'orange');
    const flap=new THREE.Group();flap.position.y=.45;group.add(flap);
    const shape=new THREE.Shape();shape.moveTo(-.87,0);shape.lineTo(0,-.6);shape.lineTo(.87,0);shape.closePath();
    mesh(new THREE.ExtrudeGeometry(shape,{depth:.04,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.02}),'orange',[0,0,.17],flap);
    const message=box([.92,.69,.05],'teal',[0,.47,0]);
    for(let i=0;i<3;i++) box([.58-i*.1,.035,.02],'cream',[0,.65-i*.16,.04],message);
    const dot=ball(.13,'orange',[.95,.85,.05]);
    animated.push(t=>{flap.rotation.x=-.55-Math.sin(t*.9)*.2;message.position.y=.49+Math.sin(t*1.1)*.08;dot.position.y=.85+Math.sin(t*1.5)*.08;});
  }
  let frame=0, disposed=false, active=true, enabled=motion, elapsed=0,last=performance.now();const pointer={x:0,y:0};
  const draw=(now=performance.now())=>{frame=0;const dt=Math.min((now-last)/1000,.04);last=now;if(enabled)elapsed+=dt;
    group.position.y=enabled?Math.sin(elapsed*1.15)*.055:0;group.rotation.y=-.28+(enabled?Math.sin(elapsed*.45)*.1+pointer.x*.22:0);group.rotation.x=-.12+(enabled?pointer.y*.14:0);
    animated.forEach(update=>update(elapsed));renderer.render(scene,camera);if(!disposed&&active&&!document.hidden&&enabled)frame=requestAnimationFrame(draw);
  };
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};const wake=()=>{if(!disposed&&active&&!document.hidden&&!frame&&enabled){last=performance.now();frame=requestAnimationFrame(draw);}};
  const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;stop();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw();};
  const ro=new ResizeObserver(resize);ro.observe(host);
  const io=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;if(active)wake();else stop();});io.observe(host);
  const visibility=()=>document.hidden?stop():wake();document.addEventListener('visibilitychange',visibility);
  const move=e=>{const r=host.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{pointer.x=0;pointer.y=0;};host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);
  const lost=e=>{e.preventDefault();stop();host.dataset.failed='true';};renderer.domElement.addEventListener('webglcontextlost',lost);
  resize();
  return {setMotion(value){enabled=value;stop();draw();},dispose(){disposed=true;stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>o.geometry?.dispose());Object.values(materials).forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}};
}
