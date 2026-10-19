import { useEffect, useRef, useState } from 'react';
import PHOTO from '../assets/photo.jpg';
import './Welcome.css';

const SECTIONS = [['about', 'About me'], ['experience', 'Experience'], ['research', 'Research'], ['projects', 'Projects'], ['skills', 'Toolkit'], ['education', 'Education'], ['contact', 'Contact']];

function Arrow({ diagonal = true }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} /></svg>;
}

function Studio({ greeted, motion, onReady, onError }) {
  const host = useRef(null);
  const scene = useRef(null);
  const state = useRef({ greeted, motion });
  state.current = { greeted, motion };
  useEffect(() => {
    let cancelled = false;
    import('../scene/createStudio').then(({ createStudio }) => {
      if (cancelled) return;
      try { scene.current = createStudio(host.current, { ...state.current, onError, onReady }); }
      catch { onError(); }
    }).catch(onError);
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, []);
  useEffect(() => { scene.current?.setState(greeted, motion); }, [greeted, motion]);
  return <div className="studio-canvas" ref={host} />;
}

export default function Welcome({ motion }) {
  const [greeted, setGreeted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuButton = useRef(null);
  const panel = useRef(null);
  const section = useRef(null);
  const [repeat, setRepeat] = useState(0);

  useEffect(() => {
    if (!menu) return;
    const close = event => {
      if (event.key === 'Escape') { setMenu(false); menuButton.current?.focus(); }
    };
    const outside = event => {
      if (!event.target.closest('.welcome-menu') && !event.target.closest('.welcome-menu-button')) setMenu(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [menu]);

  const greet = () => {
    setGreeted(true);
    // Focus the revealed panel so keyboard visitors can continue to the next action.
    requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
  };
  const replay = () => { setGreeted(false); setRepeat(value => value + 1); };
  const leave = event => {
    setMenu(false);
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (target) {
      event.preventDefault();
      history.pushState(null, '', event.currentTarget.hash);
      target.scrollIntoView({ behavior: motion ? 'smooth' : 'instant', block: 'start' });
      target.focus({ preventScroll: true });
    }
  };

  return <section ref={section} id="welcome" className={`welcome${greeted ? ' has-greeted' : ''}${ready ? ' is-ready' : ''}${failed ? ' scene-failed' : ''}`} aria-label="Welcome to Sai Teja’s studio">
    <div className="studio-view" aria-hidden="true">
      {!failed && <Studio greeted={greeted} motion={motion} onReady={() => setReady(true)} onError={() => { setFailed(true); setReady(true); }} />}
      {failed && <div className="studio-fallback"><div className="fallback-desk" /><img src={PHOTO} alt="" /></div>}
      <div className="studio-vignette" />
    </div>
    <a className="studio-brand" href="#welcome" aria-label="Sai Teja Dusari, home" onClick={replay}>sai teja<span>dusari</span><i aria-hidden="true">✳</i></a>
    <p className="studio-disciplines">Data science<br />Machine learning<br />Generative AI<br />A little curiosity.</p>
    <button ref={menuButton} type="button" className={`welcome-menu-button${menu ? ' is-open' : ''}`} aria-label={menu ? 'Close portfolio menu' : 'Open portfolio menu'} aria-expanded={menu} aria-controls="welcome-menu" onClick={() => setMenu(!menu)}><span /><span /><span /></button>
    <nav id="welcome-menu" className={`welcome-menu${menu ? ' is-open' : ''}`} aria-label="Portfolio sections" hidden={!menu}>
      <span className="menu-caption mono">MAKE YOURSELF AT HOME</span>
      {SECTIONS.map(([id, label], i) => <a key={id} href={`#${id}`} onClick={leave}><span className="mono">0{i + 1}</span>{label}<Arrow /></a>)}
      <a className="menu-resume" href={`${import.meta.env.BASE_URL}SaiTeja_Dusari_Resume.pdf`} download>Download resume <Arrow /></a>
    </nav>
    <div className="welcome-loading" role="status" aria-live="polite" hidden={ready}><span className="loading-flower" aria-hidden="true">✳</span><span>Putting the coffee on…</span></div>
    <div className="say-hello" hidden={greeted}>
      <span className="hello-note">Psst…<br />say hello.</span>
      <svg className="hello-swoop" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M12 7c-20 61 57 61 62 21M61 41l15-16 10 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      <button type="button" className="hey-button" onClick={greet} aria-controls="greeting-panel" aria-expanded={greeted}><span>Hey!</span><span className="hey-arrow" aria-hidden="true">↗</span></button>
    </div>
    <div className="greeting-panel" ref={panel} id="greeting-panel" role="region" aria-labelledby="greeting-title" tabIndex={-1} inert={!greeted ? '' : undefined} aria-hidden={!greeted}>
      <span className="intro-eyebrow mono">A HUMAN BEHIND THE MODELS</span>
      <h1 id="greeting-title">Hey! <span className="greeting-wave" key={repeat} aria-hidden="true">👋</span><br />I’m Sai Teja.</h1>
      <h2>A curious mind.<br />A builder at heart.</h2>
      <p>I’m a data scientist and AI builder studying at Columbia University. I turn messy data and ambitious ideas into systems that make a difference.</p>
      <p className="greeting-note">From healthcare research to real-world AI.<br />Welcome to my little corner of the internet.</p>
      <a className="get-to-know" href="#about" onClick={leave}>Get to know me <Arrow /></a>
      <button className="replay-greeting" onClick={replay}>↶ Say hello again</button>
    </div>
    <div className="studio-footer"><span className="studio-location mono"><span />NEW YORK, NY · COLUMBIA UNIVERSITY</span><a href="#about" className="skip-intro" onClick={leave}>Explore portfolio <Arrow /></a></div>
    <div className="scene-announcement sr-only" role="status" aria-live="polite">{greeted ? 'Hey! I’m Sai Teja. Nice to meet you. Explore the introduction or select Get to know me to continue.' : ''}</div>
  </section>;
}
