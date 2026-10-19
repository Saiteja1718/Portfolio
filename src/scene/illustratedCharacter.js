import * as THREE from 'three';
import { portraitVertex } from '../portfolio/animation.js';

export const CHARACTER_URL = `${import.meta.env.BASE_URL}images/sai-illustration.png`;

export async function createIllustratedCharacter(height = 4.25) {
  const texture = await new THREE.TextureLoader().loadAsync(CHARACTER_URL);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const image = texture.image;
  const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  let left = image.width, right = 0, top = image.height, bottom = 0;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
    if (pixels[(y * image.width + x) * 4 + 3] < 128) continue;
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  left = Math.max(0, left - 3); right = Math.min(image.width, right + 4);
  top = Math.max(0, top - 3); bottom = Math.min(image.height, bottom + 4);
  const width = right - left, imageHeight = bottom - top;
  texture.offset.set(left / image.width, 1 - bottom / image.height);
  texture.repeat.set(width / image.width, imageHeight / image.height);
  const geometry = new THREE.PlaneGeometry(height * width / imageHeight, height, 20, 60);
  const rest = geometry.attributes.position.array.slice();
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .35, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = height / 2 + .015;
  mesh.castShadow = true;
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: texture, alphaTest: .35, side: THREE.DoubleSide });
  const vertex = {};
  return {
    mesh,
    update(pose) {
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        portraitVertex(rest[i * 3], rest[i * 3 + 1], height, pose, vertex);
        positions.setXY(i, vertex.x, vertex.y);
      }
      positions.needsUpdate = true;
      geometry.computeBoundingSphere();
    },
    contains(uv) {
      if (!uv) return false;
      const x = Math.min(image.width - 1, Math.max(0, Math.floor(left + uv.x * width)));
      const y = Math.min(image.height - 1, Math.max(0, Math.floor(top + (1 - uv.y) * imageHeight)));
      return pixels[(y * image.width + x) * 4 + 3] > 100;
    },
    dispose() { geometry.dispose(); material.dispose(); mesh.customDepthMaterial.dispose(); texture.dispose(); },
  };
}
