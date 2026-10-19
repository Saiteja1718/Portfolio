import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotion } from './useMotion';
import { CASES, readRoute } from './portfolio/content';
import Header from './portfolio/Header';
import Studio from './portfolio/Studio';
import Gallery from './portfolio/Gallery';
import { AboutDetail, CaseDetail, SectionDetail } from './portfolio/Details';

function usePortfolioRoute(motion) {
  const [route, setRoute] = useState(() => readRoute(window.location.hash));
  const [wipe, setWipe] = useState('idle');
  const current = useRef(route), pending = useRef(route.key), timers = useRef([]);
  const apply = useCallback(next => {
    if (next.key === pending.current) return;
    pending.current = next.key;
    timers.current.forEach(clearTimeout);
    const change = () => {
      current.current = next; setRoute(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (!motion || current.current.page === 'work' && next.page === 'work') { setWipe('idle'); change(); return; }
    setWipe('cover');
    timers.current = [setTimeout(() => { change(); setWipe('reveal'); }, 340), setTimeout(() => setWipe('idle'), 760)];
  }, [motion]);
  useEffect(() => {
    const update = () => apply(readRoute(window.location.hash));
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => { window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update); };
  }, [apply]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const go = useCallback((path, options = {}) => {
    const hash = `#${path}`;
    if (options.replace) { history.replaceState(null, '', hash); apply(readRoute(hash)); }
    else if (window.location.hash !== hash) window.location.hash = path;
  }, [apply]);
  return { route, go, wipe };
}

export default function App() {
  const motion = useMotion();
  const { route, go, wipe } = usePortfolioRoute(motion.enabled);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    document.body.dataset.page = route.page;
    document.title = route.page === 'case' ? `${CASES[route.index].name} | Sai Teja Dusari` : route.page === 'about' ? 'About | Sai Teja Dusari' : route.page === 'section' ? `${route.section[0].toUpperCase() + route.section.slice(1)} | Sai Teja Dusari` : route.page === 'work' ? 'Explore | Sai Teja Dusari' : 'Sai Teja Dusari | Data Science & AI';
    if (route.page !== 'home') requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
  }, [route.key]);
  return <>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    <Header page={route.page} open={menuOpen} setOpen={setMenuOpen} go={go} routeKey={route.key} motion={motion} />
    <div className="route-content" inert={menuOpen ? '' : undefined}>
      {route.page === 'home' && <Studio motion={motion.enabled} go={go} visited={visited} onVisited={() => setVisited(true)} />}
      {route.page === 'work' && <Gallery index={route.slide} go={go} motion={motion.enabled} menuOpen={menuOpen} />}
      {route.page === 'case' && <CaseDetail index={route.index} go={go} motion={motion} />}
      {route.page === 'about' && <AboutDetail go={go} motion={motion} />}
      {route.page === 'section' && <SectionDetail type={route.section} go={go} motion={motion} />}
      {route.page === 'missing' && <main id="main" tabIndex={-1} className="missing-page"><span className="eyebrow">A LITTLE DETOUR</span><h1>Nothing here.<br />Plenty to explore.</h1><a href="#/work/about" onClick={event => { event.preventDefault(); go('/work/about'); }}>Back to the portfolio ↗</a></main>}
    </div>
    <div className={`page-wipe wipe-${wipe}`} aria-hidden="true"><span>✳</span></div>
  </>;
}
