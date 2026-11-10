import { useEffect } from 'react';
import { holdEntrance, observeSettledEntrance } from '../utils/settledEntrance';

export default function useProcessorEntrance(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    const board = root.querySelector('.processor-board');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;

    const animations = [];
    let started = false;
    let disposed = false;
    const settle = () => {
      started = true;
      stopWaiting();
      animations.forEach((animation) => animation.cancel());
      root.dataset.startup = 'done';
    };
    root.dataset.startup = 'waiting';
    // Animate only the board's pose: no opacity/filter on its 3D parent,
    // which would flatten the raised chips. CSS owns the final resting angle.
    animations.push(board.animate([
      { transform: 'translateY(42px) rotateX(26deg) rotateY(-10deg) rotateZ(-4deg) scale(0.94)' },
      { transform: getComputedStyle(board).transform },
    ], { id: 'services-board-startup', duration: 2200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }));

    animations.forEach(holdEntrance);
    const stopWaiting = observeSettledEntrance(board, () => {
      if (started || preference.matches) return;
      started = true;
      root.dataset.startup = 'playing';
      animations.forEach((animation) => animation.play());
      Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (!disposed) root.dataset.startup = 'done';
      });
    });

    const onResize = settle;
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    const onVisibilityChange = () => { if (started && document.hidden) settle(); };
    root.addEventListener('pointerdown', settle, { capture: true });
    root.addEventListener('focusin', settle);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      stopWaiting();
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener('pointerdown', settle, { capture: true });
      root.removeEventListener('focusin', settle);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', onPreferenceChange);
      delete root.dataset.startup;
    };
  }, [rootRef]);
}
