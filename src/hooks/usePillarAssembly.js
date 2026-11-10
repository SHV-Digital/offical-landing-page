import { useEffect } from 'react';
import { holdEntrance, observeSettledEntrance } from '../utils/settledEntrance';
import { PILLAR_SLICES, PILLAR_TIMING } from '../utils/pillarAssembly';

export default function usePillarAssembly(sceneRef) {
  useEffect(() => {
    const scene = sceneRef.current;
    const figure = scene.querySelector('.pillar-figure');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;
    const animations = [];
    const stops = [];
    let started = false;
    let settled = false;
    let disposed = false;
    let visible = false;
    const syncVisibility = () => { scene.dataset.visible = String(visible && !document.hidden); };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncVisibility();
    });
    visibilityObserver.observe(scene);
    scene.dataset.assembly = 'waiting';
    const mark = scene.querySelector('.pillar-mark');
    const markArrival = holdEntrance(mark.animate([
      { transform: 'translateY(32px) perspective(1000px) rotateX(16deg) rotateY(-18deg) scale(0.92)' },
      { transform: getComputedStyle(mark).transform },
    ], { id: 'pillar-mark-arrival', duration: PILLAR_TIMING.duration + PILLAR_TIMING.stagger * 3, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }));
    animations.push(markArrival);
    const pieces = [...scene.querySelectorAll('.pillar-piece')].map((piece, index) => {
      const { x, y, rotate } = PILLAR_SLICES[index];
      const pose = holdEntrance(piece.animate([
        { offset: 0, transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` },
        { offset: 0.28, transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        { offset: 1, transform: 'translate(0px, 0px) rotate(0deg)' },
      ], { id: 'pillar-assembly-pose', duration: PILLAR_TIMING.duration, delay: index * PILLAR_TIMING.stagger, easing: 'linear', composite: 'add', fill: 'backwards' }));
      const opacity = holdEntrance(piece.animate([{ opacity: 0 }, { opacity: 1 }], {
        id: 'pillar-assembly-opacity', duration: 800, delay: index * PILLAR_TIMING.stagger, easing: 'ease-out', fill: 'backwards',
      }));
      animations.push(pose, opacity);
      return [pose, opacity];
    });
    const callouts = [...scene.querySelectorAll('.pillar-callout')].map((callout, index) => {
      const animation = holdEntrance(callout.animate([
        { opacity: 0, filter: 'blur(4px)' },
        { opacity: 1, filter: 'blur(0px)' },
      ], { id: 'pillar-callout-arrival', duration: 1100, delay: index * 110, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }));
      animations.push(animation);
      return { callout, animation };
    });
    stops.push(observeSettledEntrance(figure, () => {
      if (started || preference.matches) return;
      started = true;
      scene.dataset.assembly = 'playing';
      markArrival.play();
      pieces.flat().forEach((animation) => animation.play());
      Promise.allSettled([markArrival, ...pieces.flat()].map((animation) => animation.finished)).then(() => {
        if (disposed || settled || preference.matches) return;
        scene.dataset.assembly = 'done';
        // Observe captions only after the logo is complete. On mobile, lower
        // captions still wait until they are visible and scrolling settles.
        callouts.forEach(({ callout, animation }) => {
          stops.push(observeSettledEntrance(callout, () => {
            if (!settled && !preference.matches) animation.play();
          }));
        });
      });
    }));
    const settle = () => {
      started = true;
      settled = true;
      stops.forEach((stop) => stop());
      animations.forEach((animation) => animation.cancel());
      scene.dataset.assembly = 'done';
    };
    const onResize = () => { if (started) settle(); };
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    const onVisibilityChange = () => {
      syncVisibility();
      if (started && document.hidden) settle();
    };
    scene.addEventListener('pointerdown', settle, { capture: true });
    scene.addEventListener('focusin', settle);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      stops.forEach((stop) => stop());
      animations.forEach((animation) => animation.cancel());
      visibilityObserver.disconnect();
      scene.removeEventListener('pointerdown', settle, { capture: true });
      scene.removeEventListener('focusin', settle);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', onPreferenceChange);
      delete scene.dataset.assembly;
      delete scene.dataset.visible;
    };
  }, [sceneRef]);
}
