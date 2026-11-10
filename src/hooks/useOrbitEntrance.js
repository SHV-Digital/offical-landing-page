import { useEffect } from 'react';

// Entrance effects compose on top of the existing orbit transform. They never
// change the rotation controller's angle, timing, selection, or inline styles.
export default function useOrbitEntrance(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.about-orbit-stage');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;

    let started = false;
    let disposed = false;
    const animations = [];
    const settle = () => {
      started = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      root.dataset.entrance = 'done';
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started || preference.matches) return;
      started = true;
      observer.disconnect();
      root.dataset.entrance = 'playing';
      const cards = [...stage.querySelectorAll('.about-orbit-card')];
      // Reveal the distant cards first, then let the focused card land last.
      const ordered = [...cards.filter((card) => card.dataset.front !== 'true'), ...cards.filter((card) => card.dataset.front === 'true')];
      ordered.forEach((card, index) => {
        const front = card.dataset.front === 'true';
        const direction = front ? 0 : (index % 2 === 0 ? -1 : 1);
        const delay = index * 140;
        animations.push(card.animate([
          { transform: `translate3d(${direction * 22}px, ${front ? 42 : 28}px, 0) rotateZ(${direction * 4}deg) scale(0.86)`, filter: 'blur(5px)' },
          { transform: 'translate3d(0, 0, 0) rotateZ(0deg) scale(1)', filter: 'blur(0px)' },
        ], { id: 'about-card-arrival-pose', duration: 1000, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', composite: 'add', fill: 'backwards' }));
        animations.push(card.animate([{ opacity: 0 }, { opacity: 1 }], {
          id: 'about-card-arrival-opacity', duration: 760, delay, easing: 'ease-out', fill: 'backwards',
        }));
      });
      const halo = stage.querySelector('.about-orbit-halo');
      if (halo) animations.push(halo.animate([
        { offset: 0, transform: 'scale(0.8)', filter: 'brightness(0.7)' },
        { offset: 0.6, transform: 'scale(1.14)', filter: 'brightness(1.8)' },
        { offset: 1, transform: 'scale(1)', filter: 'brightness(1)' },
      ], { id: 'about-orbit-arrival-glow', duration: 1400, easing: 'ease-out', composite: 'add' }));
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (!disposed) root.dataset.entrance = 'done';
      });
    }, { threshold: 0.05 });
    observer.observe(stage);
    const onResize = () => { if (started) settle(); };
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    root.addEventListener('pointerdown', settle, { capture: true });
    root.addEventListener('focusin', settle);
    window.addEventListener('resize', onResize);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener('pointerdown', settle, { capture: true });
      root.removeEventListener('focusin', settle);
      window.removeEventListener('resize', onResize);
      preference.removeEventListener('change', onPreferenceChange);
      delete root.dataset.entrance;
    };
  }, [rootRef]);
}
