import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../useMotion';
import { Arrow } from './Art';
import { CHARACTER_PHASES } from './characterSequence';
import { CHARACTER_IMAGE } from './CharacterArt';

export default function Studio({ motion, go, visited, onVisited }) {
  const [phase, setPhase] = useState('idle');
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [welcome, setWelcome] = useState(() => !visited);
  const firstVisit = useRef(!visited).current;
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const host = useRef(null), engine = useRef(null), pointer = useRef(null), panel = useRef(null), keyboard = useRef(null);
  const state = useRef({ phase, motion }); state.current = { phase, motion };
  const greeted = ['greeting', 'settling', 'posed'].includes(phase);
  useEffect(() => {
    let alive = true, timer;
    const start = performance.now();
    import('../scene/illustratedStudio.js').then(async ({ createIllustratedStudio }) => {
      if (!alive) return;
      const scene = await createIllustratedStudio(host.current, { ...state.current, onError: () => { if (alive) setFailed(true); } });
      if (!alive) { scene.dispose(); return; }
      engine.current = scene; scene.setState(state.current.phase, state.current.motion);
      timer = setTimeout(() => { if (alive) { setReady(true); onVisited(); } }, visited ? 0 : Math.max(0, 3500 - (performance.now() - start)));
    }).catch(() => { if (alive) { setFailed(true); setReady(true); onVisited(); } });
    return () => { alive = false; clearTimeout(timer); engine.current?.dispose(); engine.current = null; };
  }, []);
  useEffect(() => { engine.current?.setState(phase, motion); }, [phase, motion]);
  useEffect(() => {
    if (!ready || !welcome) return;
    const timer = setTimeout(() => setWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, [ready, welcome]);
  useEffect(() => {
    const transition = CHARACTER_PHASES[phase];
    if (transition) {
      const timer = setTimeout(() => setPhase(transition.next), motion ? transition.duration : 0);
      return () => clearTimeout(timer);
    }
    if (phase === 'posed') requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
  }, [phase, motion]);
  const move = event => {
    if (event.pointerType === 'touch' || phase !== 'idle' || !ready || failed) return;
    pointer.current?.style.setProperty('--pointer-x', `${event.clientX}px`);
    pointer.current?.style.setProperty('--pointer-y', `${event.clientY}px`);
    const overCharacter = Boolean(engine.current?.hitTest(event.clientX, event.clientY));
    if (overCharacter) setWelcome(false);
    setHovered(overCharacter);
  };
  const greet = () => { if (ready && phase === 'idle') { setWelcome(false); setHovered(false); setPhase('turning'); } };
  const clickScene = event => { if (engine.current?.hitTest(event.clientX, event.clientY)) greet(); };
  const replay = () => {
    setHovered(false); setPhase('idle');
    requestAnimationFrame(() => host.current?.parentElement?.focus({ preventScroll: true }));
  };
  return <main id="main" data-character-phase={phase} className={`home-stage live-studio illustrated-studio ${greeted ? 'is-greeted' : ''} ${ready ? 'is-loaded' : ''} ${hovered ? 'over-mascot' : ''}`} onPointerMove={move} onPointerLeave={() => setHovered(false)} tabIndex={-1} aria-label="Sai Teja’s interactive portfolio studio">
    <div className="studio-canvas" ref={host} onClick={clickScene} aria-hidden="true" />
    <button ref={keyboard} className="character-keyboard" onClick={greet} tabIndex={phase === 'idle' && ready && !failed ? 0 : -1} disabled={phase !== 'idle'} aria-label="Say hey to Sai Teja and open his introduction" aria-controls="hello-panel" aria-expanded={greeted} />
    <div ref={pointer} className={`hey-cursor ${hovered && ready && !welcome && phase === 'idle' ? 'is-visible' : ''}`} aria-hidden="true">Hey!<Arrow /></div>
    {firstVisit && <div className={`welcome-overlay ${welcome && ready && !failed && phase === 'idle' ? 'is-visible' : ''}`} aria-hidden={!welcome || !ready || failed || phase !== 'idle'} inert={!welcome || !ready || failed || phase !== 'idle' ? '' : undefined}>
      <button className="welcome-invitation" onClick={greet} tabIndex={welcome && ready && !failed && phase === 'idle' ? 0 : -1} aria-label="Say hey and meet Sai Teja">
        <svg viewBox="0 0 240 240" className="welcome-orbit" aria-hidden="true"><defs><path id="welcome-circle" d="M120 120m-103 0a103 103 0 1 1 206 0a103 103 0 1 1-206 0" /></defs><text><textPath href="#welcome-circle" textLength="647" lengthAdjust="spacingAndGlyphs">Welcome to my room. Click me! · Welcome to my room. Click me! · Welcome to my room. Click me! · </textPath></text></svg>
        <span className="welcome-message" aria-hidden="true"><span>Don’t be shy.<br />Feel free to say</span><strong>“Hey!”</strong></span>
      </button>
    </div>}
    {!finePointer && phase === 'idle' && ready && !failed && <button className="touch-greeting" onClick={greet}>Tap to say hey <Arrow /></button>}
    {failed && <div className="studio-fallback illustration-fallback"><img className="fallback-character" src={CHARACTER_IMAGE} alt="Illustrated Sai Teja" />{phase === 'idle' && <button onClick={greet}>Hey, I’m Sai Teja <Arrow /></button>}</div>}
    {phase === 'greeting' && <span className="character-hello" aria-hidden="true">Hello! <span>👋</span></span>}
    <section className={`hello-panel ${greeted ? 'is-open' : ''}`} ref={panel} tabIndex={-1} id="hello-panel" aria-labelledby="hello-title" aria-hidden={!greeted} inert={!greeted ? '' : undefined}>
      <p className="eyebrow">DATA, IDEAS & A LITTLE CURIOSITY</p>
      <h1 id="hello-title">Hello! <span className="wave-emoji" aria-hidden="true">👋</span><br />I’m Sai Teja.</h1>
      <h2>A curious mind.<br /> A builder at heart.</h2>
      <p>I’m a data scientist and AI builder at Columbia University. I turn messy data and ambitious ideas into useful systems.</p>
      <p className="hello-signature">Glad you stopped by.</p>
      <a className="know-me" href="#/work/about" onClick={event => { event.preventDefault(); go('/work/about'); }}>Get to know me <Arrow /></a>
      <button className="text-button replay" onClick={replay}>↶ Say hello again</button>
    </section>
    <div className="home-footer"><span className="location"><span />NEW YORK, NY · COLUMBIA UNIVERSITY</span><a href="#/work/projects" onClick={event => { event.preventDefault(); go('/work/projects'); }}>Explore my work <Arrow /></a></div>
    <div className="sr-only" role="status" aria-live="polite">{greeted ? 'Hello! I’m Sai Teja. My introduction is open. Choose Get to know me to explore.' : ''}</div>
    {!ready && <div className="opening-loader" role="status"><svg viewBox="0 0 200 200" className="loader-ring" aria-hidden="true"><defs><path id="loader-circle" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" /></defs><text><textPath href="#loader-circle">WELCOME TO MY LITTLE WORLD. COME ON IN. </textPath></text></svg><span className="loader-flower" aria-hidden="true">✳</span><p>Setting a little world in motion.</p><span className="sr-only">Loading the 3D studio</span></div>}
  </main>;
}
