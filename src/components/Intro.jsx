import { useEffect, useRef } from 'react';
import BrandMark from './BrandMark';
import { INTRO_DURATION_MS } from '../hooks/usePageAnimations';

export default function Intro() {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const target = document.querySelector('.hero-brand-art');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || window.location.hash || window.scrollY > 0 || !target || typeof overlay.animate !== 'function') return;

    const animations = [];
    let timeout;
    let finished = false;
    const dismiss = () => {
      finished = true;
      overlay.hidden = true;
      delete target.dataset.arriving;
      animations.forEach((animation) => animation.cancel());
      window.clearTimeout(timeout);
    };

    overlay.hidden = false;
    target.dataset.arriving = 'true';
    const traveler = overlay.querySelector('.intro-traveler');
    const origin = traveler.getBoundingClientRect();
    const destination = target.getBoundingClientRect();
    const x = destination.left + destination.width / 2 - (origin.left + origin.width / 2);
    const y = destination.top + destination.height / 2 - (origin.top + origin.height / 2);
    const scale = destination.width / origin.width;
    const landing = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
    const options = { duration: INTRO_DURATION_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' };

    animations.push(traveler.animate([
      { offset: 0, opacity: 0, transform: 'translate(-50%, -50%) scale(0.65)', filter: 'blur(10px)' },
      { offset: 0.2, opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0)' },
      { offset: 0.5, opacity: 1, transform: 'translate(-50%, -50%) scale(1)', filter: 'blur(0)' },
      { offset: 1, opacity: 1, transform: landing, filter: 'blur(0)' },
    ], options));
    animations.push(overlay.querySelector('.intro-backdrop').animate([
      { offset: 0, opacity: 1 }, { offset: 0.4, opacity: 1 }, { offset: 0.88, opacity: 0 }, { offset: 1, opacity: 0 },
    ], { ...options, easing: 'linear' }));
    animations.push(traveler.querySelector('.brand-core').animate([
      { offset: 0, transform: 'rotateX(18deg) rotateY(-540deg) rotateZ(-12deg)' },
      { offset: 0.55, transform: 'rotateX(-8deg) rotateY(-20deg) rotateZ(2deg)' },
      { offset: 1, transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
    ], options));
    animations[0].addEventListener('finish', () => { if (!finished) dismiss(); }, { once: true });
    timeout = window.setTimeout(dismiss, INTRO_DURATION_MS + 150);

    const onPreferenceChange = () => { if (preference.matches) dismiss(); };
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });
    // Re-measurement is unnecessary if the viewport changes: settle immediately.
    window.addEventListener('resize', dismiss, { once: true });
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      dismiss();
      window.removeEventListener('scroll', dismiss);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('resize', dismiss);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  return (
    <div ref={overlayRef} hidden aria-hidden="true" inert className="intro-overlay pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div className="intro-backdrop absolute inset-0 bg-neutral-950">
        <div className="intro-glow absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/15 blur-[90px]" />
      </div>
      <div className="intro-traveler"><BrandMark /></div>
    </div>
  );
}
