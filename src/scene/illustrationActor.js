import * as THREE from 'three';
import motionData from '../portfolio/characterMotion.json';
import { characterFrame, characterStage, CHARACTER_ATLAS, CHARACTER_STILL, ORIGINAL_FRAME } from '../portfolio/characterSequence.js';
import { workingPose } from '../portfolio/studioActivity.js';

// The supplied artwork remains unchanged. A precomputed displacement field
// carries its contours between poses instead of abruptly swapping drawings.
export async function createIllustrationActor() {
  const loader = new THREE.TextureLoader();
  const [atlas, still, vectorBuffer] = await Promise.all([
    loader.loadAsync(`${import.meta.env.BASE_URL}${CHARACTER_ATLAS}`),
    loader.loadAsync(`${import.meta.env.BASE_URL}${CHARACTER_STILL}`),
    fetch(`${import.meta.env.BASE_URL}images/sai-motion-flow.bin`).then(response => {
      if (!response.ok) throw new Error('Character motion data could not be loaded.');
      return response.arrayBuffer();
    }),
  ]);
  [atlas, still].forEach(texture => { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; });
  const pixels = texture => {
    const canvas = document.createElement('canvas'); canvas.width = texture.image.width; canvas.height = texture.image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(texture.image, 0, 0);
    return { width: canvas.width, height: canvas.height, data: context.getImageData(0, 0, canvas.width, canvas.height).data };
  };
  const atlasPixels = pixels(atlas), stillPixels = pixels(still);
  const { frames, original, standingHeight, pixelsPerUnit, headHeight } = motionData;
  const width = motionData.planeWidth, height = motionData.planeHeight;
  const originalScale = original.scale, originalCenter = original.center;
  if (vectorBuffer.byteLength !== motionData.width * motionData.height * 8) throw new Error('Incomplete character motion data.');
  const flowTexture = new THREE.DataTexture(new Uint16Array(vectorBuffer), motionData.width, motionData.height, THREE.RGBAFormat, THREE.HalfFloatType);
  flowTexture.minFilter = THREE.LinearFilter; flowTexture.magFilter = THREE.LinearFilter;
  flowTexture.generateMipmaps = false; flowTexture.needsUpdate = true;
  const pairLookup = new Map();
  motionData.pairs.forEach(pair => {
    pairLookup.set(`${pair.start}:${pair.end}`, { index: pair.index, reverse: 0 });
    pairLookup.set(`${pair.end}:${pair.start}`, { index: pair.index, reverse: 1 });
  });
  // Compute correspondence on a fine vertex grid, rather than iterating dense
  // flow ten times per screen pixel on every frame.
  const geometry = new THREE.PlaneGeometry(width, height, 96, 160);
  const uniforms = {
    atlas: { value: atlas }, still: { value: still }, flow: { value: flowTexture },
    atlasSize: { value: new THREE.Vector2(atlasPixels.width, atlasPixels.height) },
    stillSize: { value: new THREE.Vector2(stillPixels.width, stillPixels.height) },
    dimensions: { value: new THREE.Vector2(width, height) },
    originalInfo: { value: new THREE.Vector3(originalCenter, original.bottom, originalScale) },
    pixelsPerUnit: { value: pixelsPerUnit }, headHeight: { value: headHeight }, referenceHeight: { value: standingHeight },
    from: { value: new THREE.Vector4() }, to: { value: new THREE.Vector4() },
    isOriginalFrom: { value: 0 }, isOriginalTo: { value: 0 }, blend: { value: 0 },
    frameHeights: { value: new THREE.Vector2(standingHeight, standingHeight) },
    flowRegion: { value: new THREE.Vector4() }, flowEnabled: { value: 0 }, flowReverse: { value: 0 },
    deskWeight: { value: 0 }, movementWeight: { value: 0 }, workingTime: { value: 0 },
    backSeatedWeight: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: true, depthTest: true, side: THREE.DoubleSide, toneMapped: false,
    vertexShader: `
      uniform sampler2D flow;
      uniform vec2 dimensions; uniform vec2 frameHeights;
      uniform float headHeight; uniform float referenceHeight; uniform float blend;
      uniform vec4 flowRegion; uniform float flowEnabled; uniform float flowReverse;
      uniform float deskWeight; uniform float movementWeight; uniform float workingTime;
      uniform float backSeatedWeight;
      varying vec2 sourceUvA; varying vec2 sourceUvB;
      vec4 motionAt(vec2 point){
        vec4 result=texture2D(flow,flowRegion.xy+clamp(point,vec2(0.0),vec2(1.0))*flowRegion.zw);
        return flowReverse>.5 ? result.zwxy : result;
      }
      void main(){
        float targetHeight=mix(frameHeights.x,frameHeights.y,blend);
        float physicalY=uv.y*dimensions.y;
        float canonicalY=physicalY>targetHeight-headHeight ? physicalY+referenceHeight-targetHeight
          : physicalY*(referenceHeight-headHeight)/max(.1,targetHeight-headHeight);
        vec2 point=vec2(uv.x,canonicalY/dimensions.y);
        sourceUvA=point; sourceUvB=point;
        if(flowEnabled>.5 && blend>.0001 && blend<.9999){
          for(int iteration=0;iteration<5;iteration++){
            sourceUvA=mix(sourceUvA,point-blend*motionAt(sourceUvA).xy,.65);
            sourceUvB=mix(sourceUvB,point-(1.0-blend)*motionAt(sourceUvB).zw,.65);
          }
        }
        vec3 posed=position;
        float localY=position.y+dimensions.y*.5;
        float armBand=smoothstep(.85,1.25,localY)*(1.0-smoothstep(1.65,2.08,localY));
        float arm=smoothstep(.38,.7,abs(position.x))*armBand;
        float upper=smoothstep(.95,2.5,localY);
        // The atlas now contains the forward-reaching forearms and rounded
        // elbows. Preserve that anatomy; apply only the subtle typing motion.
        posed.y+=arm*sin(workingTime*8.0+(position.x>0.0?2.0:0.0))*.009*movementWeight;
        posed.y+=sin(workingTime*1.65)*.018*upper*movementWeight;
        posed.x+=(sin(workingTime*.72)*.04+sin(workingTime*.23)*.018)*upper*movementWeight;
        posed.x+=sin(workingTime*.85)*.018*smoothstep(2.2,2.9,localY)*movementWeight;
        // In the rear seated view, knees and shoes extend toward the desk,
        // inside the chair frame. Ease back to the normal front-facing legs
        // during the turn; the standing original remains untouched.
        float tucked=(1.0-smoothstep(.95,1.35,localY))*backSeatedWeight;
        // Translate each leg inward without scaling down the calves or shoes.
        posed.x-=sign(position.x)*.18*tucked;
        posed.z-=.95*tucked;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(posed,1.0);
      }`,
    fragmentShader: `
      uniform sampler2D atlas; uniform sampler2D still; uniform sampler2D flow;
      uniform vec2 atlasSize; uniform vec2 stillSize; uniform vec2 dimensions;
      uniform vec3 originalInfo; uniform float pixelsPerUnit; uniform vec2 frameHeights;
      uniform float headHeight; uniform float referenceHeight;
      uniform vec4 from; uniform vec4 to; uniform float isOriginalFrom; uniform float isOriginalTo; uniform float blend;
      uniform vec4 flowRegion; uniform float flowEnabled; uniform float flowReverse;
      varying vec2 sourceUvA; varying vec2 sourceUvB;
      vec4 posePixel(vec4 region,float original,float sourceHeight,vec2 canonical){
        vec2 world=vec2((canonical.x-.5)*dimensions.x,canonical.y*dimensions.y);
        world.y=world.y>referenceHeight-headHeight ? world.y+sourceHeight-referenceHeight
          : world.y*(sourceHeight-headHeight)/(referenceHeight-headHeight);
        if(original>.5){
          vec2 pixel=vec2(originalInfo.x+world.x*originalInfo.z,originalInfo.y-world.y*originalInfo.z);
          if(pixel.y<0.0||pixel.y>=stillSize.y||pixel.x<0.0||pixel.x>=stillSize.x)return vec4(0.0);
          return texture2D(still,vec2(pixel.x/stillSize.x,1.0-pixel.y/stillSize.y));
        }
        vec2 pixel=vec2(region.x+world.x*pixelsPerUnit,region.y-world.y*pixelsPerUnit);
        if(pixel.y<region.z||pixel.y>=region.w||pixel.x<region.x-atlasSize.x/8.0||pixel.x>region.x+atlasSize.x/8.0)return vec4(0.0);
        return texture2D(atlas,vec2(pixel.x/atlasSize.x,1.0-pixel.y/atlasSize.y));
      }
      void main(){
        vec4 a=posePixel(from,isOriginalFrom,frameHeights.x,sourceUvA);
        vec4 b=posePixel(to,isOriginalTo,frameHeights.y,sourceUvB);
        a.rgb*=a.a;b.rgb*=b.a;
        vec4 color=mix(a,b,blend);
        if(color.a<.42)discard;
        gl_FragColor=vec4(color.rgb/max(color.a,.001),smoothstep(.42,.8,color.a));
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(geometry, material); mesh.position.set(0, height / 2 + .018, 1.35);
  mesh.renderOrder = 10;
  let current = { from: 0, to: 0, blend: 0 };
  function setRegion(uniform, index) {
    const frame = frames[Math.max(0, index)]; uniform.value.set(frame.center, frame.foot, frame.top, frame.bottom);
  }
  function alphaAt(index, uv) {
    const frame = frames[Math.max(0, index)];
    const originalFrame = index === ORIGINAL_FRAME, input = originalFrame ? stillPixels : atlasPixels;
    const scale = originalFrame ? originalScale : pixelsPerUnit;
    const x = Math.floor((originalFrame ? originalCenter : frame.center) + (uv.x - .5) * width * scale);
    const y = Math.floor((originalFrame ? original.bottom : frame.foot) - uv.y * height * scale);
    if (x < 0 || x >= input.width || y < 0 || y >= input.height || (!originalFrame && (y < frame.top || y >= frame.bottom))) return 0;
    return input.data[(y * input.width + x) * 4 + 3] / 255;
  }
  return {
    mesh,
    update(phase, elapsed, motion, time = 0) {
      current = characterFrame(phase, elapsed, motion, time);
      setRegion(uniforms.from, current.from); setRegion(uniforms.to, current.to);
      uniforms.isOriginalFrom.value = current.from === ORIGINAL_FRAME ? 1 : 0;
      uniforms.isOriginalTo.value = current.to === ORIGINAL_FRAME ? 1 : 0;
      uniforms.blend.value = current.blend;
      uniforms.frameHeights.value.set(current.from === ORIGINAL_FRAME ? standingHeight : frames[current.from].height / pixelsPerUnit, current.to === ORIGINAL_FRAME ? standingHeight : frames[current.to].height / pixelsPerUnit);
      const pair = pairLookup.get(`${current.from}:${current.to}`);
      uniforms.flowEnabled.value = pair ? 1 : 0;
      if (pair) {
        const column = pair.index % motionData.columns, row = Math.floor(pair.index / motionData.columns);
        uniforms.flowReverse.value = pair.reverse;
        uniforms.flowRegion.value.set(
          (column * motionData.tileWidth + motionData.padding + .5) / motionData.width,
          (row * motionData.tileHeight + motionData.padding + .5) / motionData.height,
          (motionData.frameWidth - 1) / motionData.width,
          (motionData.frameHeight - 1) / motionData.height,
        );
      }
      const work = workingPose(phase, elapsed, motion);
      uniforms.deskWeight.value = work.deskWeight;
      uniforms.movementWeight.value = work.movementWeight;
      uniforms.workingTime.value = time;
      uniforms.backSeatedWeight.value = 1 - characterStage(phase, elapsed, motion).turn;
    },
    contains(uv) { return uv && alphaAt(current.from, uv) * (1 - current.blend) + alphaAt(current.to, uv) * current.blend > .55; },
    dispose() { geometry.dispose(); material.dispose(); atlas.dispose(); still.dispose(); flowTexture.dispose(); },
  };
}
