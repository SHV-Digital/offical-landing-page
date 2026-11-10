import { useEffect, useRef, useState } from 'react';
import { nearestOrbitAngle, orbitPosition, ORBIT_TIMING, wrapIndex } from '../utils/orbitCarousel';

export default function useOrbitCarousel(rootRef, count, onPauseChange) {
  const apiRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.about-orbit-stage');
    const cards = [...root.querySelectorAll('.about-orbit-card')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let angle = 0;
    let destination = null;
    let current = 0;
    let selected = 0;
    let restingMs = ORBIT_TIMING.dwell;
    let userPaused = false;
    let hovered = false;
    let focused = false;
    let inView = typeof IntersectionObserver !== 'function';
    let frame = null;
    let previousTime = null;
    let radiusX = 0;
    let radiusY = 0;
    let disposed = false;
    root.dataset.visible = String(inView && !document.hidden);
    root.dataset.paused = 'false';
    root.dataset.orbitPhase = 'resting';

    const paint = () => {
      const next = wrapIndex(Math.round(-angle / (Math.PI * 2 / count)), count);
      if (next !== current) {
        current = next;
        setActive(next);
      }
      cards.forEach((card, index) => {
        const position = orbitPosition(angle, index, count, radiusX, radiusY);
        const lift = destination === null ? 0 : Math.sin(Math.PI * destination.progress) * 18;
        card.style.transform = `translate(-50%, -50%) translate3d(${position.x}px, ${position.y - lift}px, 0) rotateY(${position.tilt}deg) rotateZ(${position.roll}deg) scale(${position.scale})`;
        card.style.opacity = position.opacity;
        card.style.zIndex = position.zIndex;
        card.style.setProperty('--orbit-shade', position.shade);
        card.style.setProperty('--orbit-front', position.front);
        card.style.setProperty('--orbit-blur', `${position.blur}px`);
        card.dataset.front = String(index === current);
      });
    };

    const canMove = () => !disposed && !preference.matches && inView && !document.hidden;
    const beginSelection = (index, source) => {
      selected = wrapIndex(index, count);
      const to = nearestOrbitAngle(angle, selected, count);
      if (Math.abs(to - angle) < 0.001) {
        angle = to;
        destination = null;
        restingMs = ORBIT_TIMING.dwell;
        delete root.dataset.transitioning;
        root.dataset.orbitPhase = 'resting';
        paint();
        return;
      }
      destination = { from: angle, to, elapsed: 0, duration: source === 'automatic' ? ORBIT_TIMING.automatic : ORBIT_TIMING.manual, progress: 0, source };
      root.dataset.transitioning = 'true';
      root.dataset.orbitPhase = 'moving';
    };
    const tick = (time) => {
      frame = null;
      if (!canMove()) { previousTime = null; return; }
      const elapsed = previousTime === null ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      const automaticAllowed = !userPaused && !hovered && !focused;
      const manualMove = destination?.source === 'manual';
      if (destination !== null && (manualMove || automaticAllowed)) {
        destination.elapsed += elapsed;
        destination.progress = Math.min(1, destination.elapsed / destination.duration);
        const t = destination.progress;
        const eased = t * t * t * (t * (t * 6 - 15) + 10);
        angle = destination.from + (destination.to - destination.from) * eased;
        if (t === 1) {
          angle = destination.to;
          destination = null;
          restingMs = ORBIT_TIMING.dwell;
          delete root.dataset.transitioning;
          root.dataset.orbitPhase = 'resting';
        }
        paint();
      } else if (destination === null && automaticAllowed) {
        restingMs = Math.max(0, restingMs - elapsed);
        if (restingMs === 0) beginSelection(current + 1, 'automatic');
      }
      if (destination?.source === 'manual' || automaticAllowed) frame = requestAnimationFrame(tick);
      else previousTime = null;
    };
    const start = () => {
      if (frame === null && canMove()) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      if (disposed || preference.matches) return;
      radiusX = Math.max(0, (stage.clientWidth - cards[0].offsetWidth) / 2 - 7);
      radiusY = stage.clientHeight * 0.17;
      paint();
    };
    const select = (index, focus = false) => {
      if (preference.matches) return;
      beginSelection(index, 'manual');
      if (focus) root.querySelector(`[data-orbit-select="${wrapIndex(index, count)}"]`).focus({ preventScroll: true });
      start();
    };
    apiRef.current = {
      select,
      step: (direction, focus = false) => select((destination?.source === 'manual' ? selected : current) + direction, focus),
      togglePause: () => {
        userPaused = !userPaused;
        root.dataset.paused = String(userPaused);
        setPaused(userPaused);
        onPauseChange?.(userPaused);
        start();
      },
    };

    const syncPreference = () => {
      if (preference.matches) {
        delete root.dataset.enhanced;
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        previousTime = null;
        cards.forEach((card) => {
          card.style.removeProperty('transform');
          card.style.removeProperty('opacity');
          card.style.removeProperty('z-index');
          card.style.removeProperty('--orbit-shade');
          card.style.removeProperty('--orbit-front');
          card.style.removeProperty('--orbit-blur');
        });
      } else {
        root.dataset.enhanced = 'true';
        measure();
        start();
      }
    };
    const onEnter = (event) => { if (event.pointerType !== 'touch') hovered = true; };
    const onLeave = () => { hovered = false; start(); };
    const onFocus = () => { focused = true; };
    const onBlur = (event) => {
      if (!root.contains(event.relatedTarget)) { focused = false; start(); }
    };
    const onVisibilityChange = () => {
      previousTime = null;
      root.dataset.visible = String(inView && !document.hidden);
      if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
      else start();
    };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      root.dataset.visible = String(inView && !document.hidden);
      if (!inView && frame !== null) { cancelAnimationFrame(frame); frame = null; previousTime = null; }
      start();
    }, { threshold: 0.1 }) : null;
    observer?.observe(root);
    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(stage);
    window.addEventListener('resize', measure);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', syncPreference);
    syncPreference();
    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('focusin', onFocus);
      root.removeEventListener('focusout', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', syncPreference);
      delete root.dataset.enhanced;
      delete root.dataset.visible;
      delete root.dataset.paused;
      delete root.dataset.transitioning;
      delete root.dataset.orbitPhase;
      apiRef.current = null;
    };
  }, [rootRef, count, onPauseChange]);

  return { active, paused, apiRef };
}
