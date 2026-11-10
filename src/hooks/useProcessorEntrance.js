import { useEffect } from 'react';
import { observeSettledEntrance } from '../utils/settledEntrance';

// Full length of the CSS startup choreography keyed on `data-startup`.
export const STARTUP_MS = 1900;

// One-time board startup. The poses and timings live in CSS:
//   waiting -> flat, dark board    playing -> rise, draw, seat chips, light core
// `data-startup` is only ever set here, so static HTML stays in its final state.
export default function useProcessorEntrance(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof IntersectionObserver !== 'function') return;

    let timer;
    let started = false;
    let width = window.innerWidth;
    const settle = () => {
      started = true;
      stopWaiting();
      window.clearTimeout(timer);
      root.dataset.startup = 'done';
    };
    root.dataset.startup = 'waiting';
    const stopWaiting = observeSettledEntrance(root.querySelector('.service-processor'), () => {
      if (started || preference.matches) return;
      started = true;
      root.dataset.startup = 'playing';
      timer = window.setTimeout(() => { root.dataset.startup = 'done'; }, STARTUP_MS);
    });

    // Mobile browsers resize on scroll as their toolbars collapse: only a
    // real width change invalidates the prepared pose.
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      settle();
    };
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    const onVisibilityChange = () => { if (started && document.hidden) settle(); };
    root.addEventListener('pointerdown', settle, { capture: true });
    root.addEventListener('focusin', settle);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      stopWaiting();
      window.clearTimeout(timer);
      root.removeEventListener('pointerdown', settle, { capture: true });
      root.removeEventListener('focusin', settle);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', onPreferenceChange);
      delete root.dataset.startup;
    };
  }, [rootRef]);
}
