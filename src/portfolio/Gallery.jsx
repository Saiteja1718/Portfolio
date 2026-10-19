import { useEffect, useRef, useState } from 'react';
import { SLIDES, EMAIL, LINKS, slideAfter } from './content';
import { Arrow, ObjectArt } from './Art';
import { initialWheelState, wheelStep, flushWheel, normalizeWheelDelta, WHEEL_COOLDOWN, SLIDE_DURATION } from './animation';

export function Marquee({ text, className = '' }) {
  return <div className={`marquee ${className}`} aria-hidden="true"><div>{[0, 1, 2, 3].map(n => <span key={n}>{text}&nbsp; ✳ &nbsp;</span>)}</div></div>;
}

function Slide({ item, go, decorative = false }) {
  return <article className={`slide-content slide-${item.kind}`}>
    <p className="eyebrow">{item.kind === 'contact' ? 'THE START OF SOMETHING GOOD' : 'WELCOME TO MY WORLD'}</p>
    <h1>{item.label}<span className="orange">.</span></h1>
    {item.kind === 'contact' ? <>
      <a className="slide-object-link" href={`mailto:${EMAIL}`} tabIndex={decorative ? -1 : 0} aria-label={`Send an email to ${EMAIL}`}><ObjectArt kind="contact" /></a>
      <h2>{item.title}</h2><a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}<Arrow /></a><p className="contact-caption">An opportunity, a collaboration, or just a hello.</p>
      <div className="contact-socials">{LINKS.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}<Arrow /></a>)}</div>
    </> : <>
      <a className="slide-object-link" href={`#${item.path}`} tabIndex={decorative ? -1 : 0} onClick={event => { if (event.metaKey || event.ctrlKey) return; event.preventDefault(); go(item.path); }} aria-label={item.action}><ObjectArt kind={item.kind} /><span className="view-detail">Explore<Arrow /></span></a>
      <h2>{item.title}</h2><p className="slide-caption">{item.caption}</p><p className="slide-category">{item.category}</p>
      <a className="section-entry" href={`#${item.path}`} onClick={event => { event.preventDefault(); go(item.path); }}>{item.action}<Arrow /></a>
    </>}
  </article>;
}

export default function Gallery({ index, go, motion, menuOpen }) {
  const host = useRef(null), current = useRef(index), navigation = useRef(go);
  const wheel = useRef(initialWheelState()), touch = useRef(null), keyTime = useRef(-Infinity);
  const [previous, setPrevious] = useState(null);
  const directionRef = useRef('next');
  if (index !== current.current) directionRef.current = index > current.current ? 'next' : 'previous';
  const direction = directionRef.current;
  navigation.current = go;
  useEffect(() => {
    let timer;
    if (index !== current.current) {
      if (motion) { setPrevious(current.current); timer = setTimeout(() => setPrevious(null), SLIDE_DURATION); }
      current.current = index;
    }
    return () => clearTimeout(timer);
  }, [index, motion]);
  useEffect(() => {
    if (menuOpen) return;
    wheel.current = initialWheelState();
    let wheelTimer;
    const advance = direction => {
      const next = slideAfter(current.current, direction);
      if (next !== current.current) navigation.current(`/work/${SLIDES[next].id}`, { replace: true });
    };
    const onWheel = event => {
      if (event.ctrlKey || event.target.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
      if (Math.abs(event.deltaX) > Math.max(3, Math.abs(event.deltaY) * 1.5)) return;
      event.preventDefault();
      const now = performance.now();
      const delta = normalizeWheelDelta(event.deltaY, event.deltaMode, node.clientHeight);
      const { direction, state } = wheelStep(wheel.current, delta, now);
      wheel.current = state;
      if (direction) advance(direction);
      clearTimeout(wheelTimer);
      if (state.pending) wheelTimer = setTimeout(() => {
        const result = flushWheel(wheel.current, performance.now());
        wheel.current = result.state;
        if (result.direction) advance(result.direction);
      }, Math.max(0, state.lastAction + WHEEL_COOLDOWN - now) + 1);
    };
    const onKey = event => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, textarea, [contenteditable="true"]')) return;
      const map = { ArrowDown: 1, ArrowRight: 1, PageDown: 1, ArrowUp: -1, ArrowLeft: -1, PageUp: -1 };
      if (map[event.key]) {
        event.preventDefault();
        if (performance.now() - keyTime.current < 400) return;
        wheel.current.pending = 0;
        keyTime.current = performance.now(); advance(map[event.key]);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); wheel.current.pending = 0;
        navigation.current(`/work/${SLIDES[event.key === 'Home' ? 0 : SLIDES.length - 1].id}`, { replace: true });
      }
    };
    const onStart = event => { touch.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; };
    const onEnd = event => {
      if (!touch.current) return;
      const dx = touch.current.x - event.changedTouches[0].clientX, dy = touch.current.y - event.changedTouches[0].clientY;
      if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) { wheel.current.pending = 0; advance(Math.sign(dy)); }
      touch.current = null;
    };
    const node = host.current;
    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('touchstart', onStart, { passive: true });
    node.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(wheelTimer);
      node.removeEventListener('wheel', onWheel); node.removeEventListener('touchstart', onStart); node.removeEventListener('touchend', onEnd); window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const item = SLIDES[index];
  const visit = next => { wheel.current.pending = 0; go(`/work/${SLIDES[next].id}`, { replace: true }); };
  return <main id="main" ref={host} className="gallery-stage" tabIndex={-1} aria-label="Explore the portfolio" data-direction={direction}>
    <Marquee key={`marquee-${item.id}`} text={item.marquee} />
    {previous !== null && previous !== index && motion && <div className="slide-leaving" aria-hidden="true" inert=""><Slide item={SLIDES[previous]} go={() => {}} decorative /></div>}
    <div key={`slide-${item.id}`} className="slide-entering"><Slide item={item} go={go} /></div>
    <nav className="slide-nav" aria-label="Portfolio sections">{SLIDES.map((slide, n) => <button type="button" key={slide.id} onClick={() => visit(n)} aria-label={`Show ${slide.label}`} aria-current={n === index ? 'step' : undefined}><span className="nav-dot" /><span className="nav-label">{slide.label}</span></button>)}</nav>
    <div className="slide-controls"><button aria-label="Previous slide" onClick={() => visit(index - 1)} disabled={index === 0}><Arrow direction="left" /></button><span>{String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span><button aria-label="Next slide" onClick={() => visit(index + 1)} disabled={index === SLIDES.length - 1}><Arrow direction="right" /></button></div>
    <span className="scroll-instruction">Scroll to explore <Arrow direction="down" /></span>
    <span className="gallery-copyright">© {new Date().getFullYear()} Sai Teja Dusari</span>
    <p className="sr-only" role="status" aria-live="polite">{item.label}. Section {index + 1} of {SLIDES.length}. {item.title}</p>
  </main>;
}
