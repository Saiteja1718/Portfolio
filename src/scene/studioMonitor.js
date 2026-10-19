import * as THREE from 'three';
import { monitorActivity } from '../portfolio/studioActivity.js';

export function createStudioMonitor() {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 432;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  let lastFrame = -1;
  function update(seconds = 0, active = true) {
    const frame = Math.floor(seconds * 12);
    if (lastFrame >= 0 && (!active || frame === lastFrame)) return;
    lastFrame = frame;
    const { mode, progress, cursor } = monitorActivity(seconds);
    ctx.fillStyle = '#101f2c'; ctx.fillRect(0, 0, 768, 432);
    ctx.fillStyle = '#293b49'; ctx.fillRect(0, 0, 768, 32);
    ['#ef967b', '#e6c172', '#80c5bb'].forEach((color, i) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(18 + i * 17, 16, 5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.font = '14px monospace'; ctx.fillStyle = '#b5cfcc'; ctx.fillText(`sai / ${mode === 'code' ? 'experiment.py' : mode === 'training' ? 'model training' : 'evaluation'}`, 110, 21);
    ctx.fillStyle = '#80c5bb'; ctx.font = 'bold 25px monospace';
    ctx.fillText(mode === 'code' ? 'Building the next idea' : mode === 'training' ? 'Learning in progress' : 'Making sense of data', 35, 82);
    if (mode === 'code') {
      const lines = ['import numpy as np', 'from sklearn import model_selection', '',
        'def learn_from(data):', '    features = prepare(data)', '    model.fit(features)', '    return evaluate(model)', '', '> running experiment...'];
      let available = Math.floor(progress * 210);
      ctx.font = '18px monospace';
      lines.forEach((line, index) => {
        const count = Math.max(0, Math.min(line.length, available)); available -= line.length + 3;
        ctx.fillStyle = '#52717c'; ctx.fillText(String(index + 1).padStart(2, '0'), 30, 125 + index * 29);
        ctx.fillStyle = index % 3 === 0 ? '#cbb4dd' : '#b2d5d0';
        ctx.fillText(line.slice(0, count) + (count < line.length && available > -line.length && cursor ? '▍' : ''), 75, 125 + index * 29);
      });
    } else if (mode === 'training') {
      ctx.strokeStyle = '#34505b'; ctx.lineWidth = 1;
      for (let row = 0; row < 5; row++) { const y = 140 + row * 48; ctx.beginPath(); ctx.moveTo(45, y); ctx.lineTo(725, y); ctx.stroke(); }
      [['#80c5bb', false], ['#d9b1e7', true]].forEach(([color, validation]) => {
        ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.beginPath();
        for (let i = 0; i <= Math.floor(progress * 100); i++) {
          const x = 45 + i * 6.8, y = 330 - (1 - Math.exp(-i / 29)) * 175 + (validation ? 18 + Math.sin(i * .22) * 7 : Math.sin(i * .31) * 3);
          if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.font = '18px monospace'; ctx.fillStyle = '#b2d5d0'; ctx.fillText(`epoch ${String(Math.floor(progress * 40) + 1).padStart(2, '0')} / 40`, 45, 393);
      ctx.fillStyle = '#80c5bb'; ctx.fillRect(310, 378, 415 * progress, 12);
    } else {
      const labels = ['precision', 'recall', 'F1 score'];
      labels.forEach((label, i) => {
        const y = 145 + i * 70, value = [0.94, 0.91, 0.93][i];
        ctx.font = '18px monospace'; ctx.fillStyle = '#b2d5d0'; ctx.fillText(label, 40, y);
        ctx.fillStyle = '#293e4b'; ctx.fillRect(200, y - 19, 460, 24);
        ctx.fillStyle = ['#80c5bb', '#cbb4dd', '#d8b375'][i]; ctx.fillRect(200, y - 19, 460 * value * Math.min(1, progress * 3), 24);
      });
      ctx.font = '17px monospace'; ctx.fillStyle = '#80c5bb'; ctx.fillText('✓ experiment complete · exploring what comes next', 40, 379);
    }
    // This is illustrative activity on a decorative monitor, not portfolio metrics.
    texture.needsUpdate = true;
  }
  update();
  return { texture, update };
}
