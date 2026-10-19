import { useEffect, useRef } from 'react';
import CharacterArt from './CharacterArt';

export function ObjectArt({ kind, className = '' }) {
  const host = useRef(null);
  useEffect(() => {
    if (kind === 'about') return;
    let alive = true, scene;
    const enabled = () => document.documentElement.dataset.motion !== 'off';
    const observer = new MutationObserver(() => scene?.setMotion(enabled()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    import('../scene/createEmblem.js').then(({ createEmblem }) => {
      if (!alive) return;
      try { scene = createEmblem(host.current, kind, enabled()); }
      catch { host.current.dataset.failed = 'true'; }
    }).catch(() => { if (alive) host.current.dataset.failed = 'true'; });
    return () => { alive = false; observer.disconnect(); scene?.dispose(); };
  }, [kind]);
  if (kind === 'about') return <CharacterArt className={`object-art ${className}`} />;
  const symbol = {about:'✳',skills:'⌘',projects:'⌨',experience:'↗',contact:'✉',claims:'↗',heart:'♡',brain:'✳',resume:'⌨',diet:'✳'}[kind] || '✳';
  return <div ref={host} className={`object-art live-emblem emblem-${kind} ${className}`} aria-hidden="true"><span className="emblem-fallback">{symbol}</span></div>;
}

export function Arrow({ direction = 'diagonal', ...props }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={direction === 'right' ? 'M4 12h16m-6-6 6 6-6 6' : direction === 'left' ? 'M20 12H4m6-6-6 6 6 6' : direction === 'down' ? 'M12 4v16m-6-6 6 6 6-6' : 'M5 19 19 5M5 5h14v14'} /></svg>;
}
