import { useEffect } from 'react';
import { holdEntrance, observeSettledEntrance } from '../utils/settledEntrance';

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
      stopWaiting();
      animations.forEach((animation) => animation.cancel());
      root.dataset.entrance = 'done';
    };
    root.dataset.entrance = 'waiting';
    const cards = [...stage.querySelectorAll('.about-orbit-card')];
    // Reveal the distant cards first, then let the focused card land last.
    const ordered = [...cards.filter((card) => card.dataset.front !== 'true'), ...cards.filter((card) => card.dataset.front === 'true')];
    ordered.forEach((card, index) => {
      const front = card.dataset.front === 'true';
      const direction = front ? 0 : (index % 2 === 0 ? -1 : 1);
      const delay = index * 220;
      animations.push(card.animate([
        { transform: `translate3d(${direction * 22}px, ${front ? 42 : 28}px, 0) rotateZ(${direction * 4}deg) scale(0.86)`, filter: 'blur(5px)' },
        { transform: 'translate3d(0, 0, 0) rotateZ(0deg) scale(1)', filter: 'blur(0px)' },
      ], { id: 'about-card-arrival-pose', duration: 1700, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', composite: 'add', fill: 'backwards' }));
      animations.push(card.animate([{ opacity: 0 }, { opacity: 1 }], {
        id: 'about-card-arrival-opacity', duration: 1200, delay, easing: 'ease-out', fill: 'backwards',
      }));
    });
    const halo = stage.querySelector('.about-orbit-halo');
    if (halo) animations.push(halo.animate([
      { offset: 0, transform: 'scale(0.8)', filter: 'brightness(0.7)' },
      { offset: 0.6, transform: 'scale(1.14)', filter: 'brightness(1.8)' },
      { offset: 1, transform: 'scale(1)', filter: 'brightness(1)' },
    ], { id: 'about-orbit-arrival-glow', duration: 2200, easing: 'ease-out', composite: 'add' }));
    animations.forEach(holdEntrance);
    const stopWaiting = observeSettledEntrance(stage, () => {
      if (started || preference.matches) return;
      started = true;
      root.dataset.entrance = 'playing';
      animations.forEach((animation) => animation.play());
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (!disposed) root.dataset.entrance = 'done';
      });
    });
    const onResize = () => { if (started) settle(); };
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    root.addEventListener('pointerdown', settle, { capture: true });
    root.addEventListener('focusin', settle);
    window.addEventListener('resize', onResize);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      stopWaiting();
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener('pointerdown', settle, { capture: true });
      root.removeEventListener('focusin', settle);
      window.removeEventListener('resize', onResize);
      preference.removeEventListener('change', onPreferenceChange);
      delete root.dataset.entrance;
    };
  }, [rootRef]);
}
