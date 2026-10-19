import { useEffect, useState } from 'react';

// Keep OS preferences live, including changes made while the page is open.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function useMotion() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem('portfolio-motion') === 'paused'; }
    catch { return false; }
  });
  const enabled = !reduced && !paused;

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    return () => delete document.documentElement.dataset.motion;
  }, [enabled]);

  useEffect(() => {
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'playing'); }
    catch { /* Motion controls also work when browser storage is unavailable. */ }
  }, [paused]);

  useEffect(() => {
    const sync = event => {
      if (event.key === 'portfolio-motion') setPaused(event.newValue === 'paused');
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return { enabled, paused, reduced, toggle: () => setPaused(value => !value) };
}
