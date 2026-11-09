import { useEffect, useRef } from 'react';
import Logo from '../assets/logo.svg';
import { INTRO_DURATION_MS } from '../hooks/usePageAnimations';

export default function Intro() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || window.location.hash || window.scrollY > 0) return;

    overlay.hidden = false;
    const dismiss = () => { overlay.hidden = true; };
    const timeout = window.setTimeout(dismiss, INTRO_DURATION_MS + 100);
    overlay.addEventListener('animationend', dismiss);
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });
    preference.addEventListener('change', dismiss);
    return () => {
      window.clearTimeout(timeout);
      overlay.hidden = true;
      overlay.removeEventListener('animationend', dismiss);
      window.removeEventListener('scroll', dismiss);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
      preference.removeEventListener('change', dismiss);
    };
  }, []);

  return (
    <div ref={overlayRef} hidden aria-hidden="true" inert className="intro-overlay pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-neutral-950" style={{ '--intro-duration': `${INTRO_DURATION_MS}ms` }}>
      <div className="intro-glow absolute h-64 w-64 rounded-full bg-gradient-to-r from-brand-blue/30 via-brand-cyan/20 to-brand-purple/30 blur-[100px] md:h-96 md:w-96" />
      <img src={Logo} alt="" className="intro-logo relative w-[min(80vw,360px)] md:w-[560px]" />
    </div>
  );
}
