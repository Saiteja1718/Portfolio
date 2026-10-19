import { useEffect, useRef } from 'react';

export default function Ambient({ enabled }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width, height, points, frame = 0, lastTime = 0;
    const pointer = { x: -1000, y: -1000 };
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: Math.min(52, Math.floor(width * height / 23000)) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      }));
      draw(0);
    };

    const draw = delta => {
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x = (point.x + point.vx * delta + width) % width;
        point.y = (point.y + point.vy * delta + height) % height;
        context.fillStyle = 'rgba(34, 211, 238, .42)';
        context.beginPath();
        context.arc(point.x, point.y, 1.3, 0, Math.PI * 2);
        context.fill();
        const connect = (other, distance, color) => {
          const gap = Math.hypot(point.x - other.x, point.y - other.y);
          if (gap >= distance) return;
          context.strokeStyle = `rgba(${color}, ${(1 - gap / distance) * 0.2})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        };
        for (let next = index + 1; next < points.length; next++) connect(points[next], 145, '139, 92, 246');
        if (enabled && finePointer) connect(pointer, 180, '34, 211, 238');
      });
    };

    // Cap ambient work at 30fps and stop scheduling while the tab is hidden.
    const animate = time => {
      if (time - lastTime >= 1000 / 30) {
        draw(Math.min((time - lastTime) / 16.67, 3));
        lastTime = time;
      }
      frame = requestAnimationFrame(animate);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (enabled && !document.hidden) {
        lastTime = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };
    const move = event => { pointer.x = event.clientX; pointer.y = event.clientY; };
    const leave = () => { pointer.x = pointer.y = -1000; };
    resize();
    visibility();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    if (enabled && finePointer) {
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerleave', leave);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  return <canvas id="bg" ref={ref} aria-hidden="true" />;
}
