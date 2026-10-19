import { useEffect, useRef } from 'react';
import { SLIDES } from './content';
import { Arrow } from './Art';

export default function Header({ page, open, setOpen, go, routeKey, motion }) {
  const toggle = useRef(null);
  const panel = useRef(null);
  useEffect(() => { setOpen(false); }, [routeKey]);
  useEffect(() => {
    if (!open) return;
    const key = event => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...panel.current.querySelectorAll('a, button:not([disabled])')];
        const index = items.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); toggle.current.focus(); }
      }
    };
    const outside = event => { if (!event.target.closest('.menu-shell')) setOpen(false); };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  const visit = (event, path) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setOpen(false); go(path); };
  return <header className={`site-header ${page === 'home' ? 'on-home' : ''}`}>
    <a className="wordmark" href="#/" onClick={event => visit(event, '/')} aria-label="Sai Teja Dusari, home">Sai Teja Dusari<span aria-hidden="true">✳</span></a>
    <p className="disciplines">Data science<br />Machine learning<br />Generative AI<br />Research & curiosity</p>
    <div className={`menu-shell ${open ? 'is-open' : ''}`}>
      <button ref={toggle} type="button" className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="site-menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
      <nav ref={panel} id="site-menu" className="global-menu" aria-label="Main navigation" inert={!open ? '' : undefined} aria-hidden={!open}>
        <span className="menu-caption">MAKE YOURSELF AT HOME</span>
        <a href="#/" onClick={event => visit(event, '/')}><span>⌂</span>Home</a>
        {SLIDES.map((item, index) => <a key={item.id} href={`#${item.path || '/work/contact'}`} onClick={event => visit(event, item.path || '/work/contact')}><span>{['✳','⌘','⌨','↗','✉'][index]}</span>{item.label}</a>)}
        <a className="menu-resume" href={`${import.meta.env.BASE_URL}SaiTeja_Dusari_Resume.pdf`} download>Download resume<Arrow /></a>
        <button className="text-button menu-motion" onClick={motion.toggle} disabled={motion.reduced} aria-pressed={!motion.enabled}>{motion.reduced ? 'Reduced motion enabled' : motion.enabled ? 'Pause animations Ⅱ' : 'Resume animations ▷'}</button>
      </nav>
    </div>
  </header>;
}
