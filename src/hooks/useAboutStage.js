import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { POWER_TIMING, STEP_GAP_MS, entrySide, powerSequenceDuration, shortestDelta, swipeStep, tileSlot, wrapIndex } from '../utils/aboutStage';

const POWER_RATIO = 0.35;
const SPRING = 'linear(0, 0.111, 0.341, 0.582, 0.782, 0.922, 1.005, 1.044, 1.054, 1.048, 1.036, 1.023, 1.012, 1.004, 1, 0.998, 0.997, 0.997, 0.998, 0.999, 1)';
const SPRING_FALLBACK = 'cubic-bezier(0.34, 1.36, 0.64, 1)';
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const springEasing = () => (typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)') ? SPRING : SPRING_FALLBACK);

// Share of the section inside the viewport, measured the same way the power-on
// observer does, so a stage that is already on screen is never darkened.
function visibleShare(element) {
  const rect = element.getBoundingClientRect();
  const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  return { ratio: rect.height ? visible / rect.height : 0, visible };
}
const powerReached = ({ ratio, visible }) => ratio >= POWER_RATIO || visible >= window.innerHeight * 0.6;

// `describe(index)` returns the localized live-region text for a card.
export default function useAboutStage(rootRef, count, describe) {
  const [view, setView] = useState({ active: 0, direction: 1 });
  const [announcement, setAnnouncement] = useState('');
  const [paused, setPaused] = useState(false);
  const viewRef = useRef(view);
  const targetRef = useRef(0);
  const timerRef = useRef(null);
  const previousRef = useRef(view);
  const pausedRef = useRef(false);
  const swapRef = useRef([]);
  const describeRef = useRef(describe);
  const parallaxResetRef = useRef(null);

  // Any interaction finishes the power-on sequence at once: it never blocks.
  const settlePower = useCallback(() => {
    const stage = rootRef.current?.querySelector('.about-stage');
    if (stage?.dataset.power && stage.dataset.power !== 'ready') stage.dataset.power = 'ready';
  }, [rootRef]);

  const goTo = useCallback((target) => {
    const destination = wrapIndex(target, count);
    window.clearTimeout(timerRef.current);
    settlePower();
    targetRef.current = destination;
    setAnnouncement(describeRef.current(destination));
    const advance = () => {
      const { active } = viewRef.current;
      const delta = shortestDelta(active, destination, count);
      if (!delta) return;
      // Reduced motion jumps straight to the card; otherwise every tile walks
      // through each arc position so none of them cuts across the stage.
      const direction = Math.sign(delta);
      const next = reducedMotion()
        ? { active: destination, direction }
        : { active: wrapIndex(active + direction, count), direction };
      viewRef.current = next;
      setView(next);
      if (next.active !== destination) timerRef.current = window.setTimeout(advance, STEP_GAP_MS);
    };
    advance();
  }, [count, settlePower]);

  const step = useCallback((direction) => goTo(targetRef.current + direction), [goTo]);
  const togglePause = useCallback(() => setPaused((value) => !value), []);

  useEffect(() => { describeRef.current = describe; }, [describe]);
  // Pausing stops the idle float (CSS) and eases the parallax back to rest.
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) parallaxResetRef.current?.();
  }, [paused]);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // Card swap, tile hand-off, and focus rescue run before paint so the incoming
  // card never flashes in its final state ahead of its entrance.
  useLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = view;
    if (previous.active === view.active) return;
    const root = rootRef.current;
    const reduce = reducedMotion();
    const tiles = [...root.querySelectorAll('.about-tile')];
    const cards = [...root.querySelectorAll('.about-card')];

    if (!reduce) {
      // A tile leaving the hidden slot first jumps (unseen, below the stage) to
      // the side the carousel moves towards, then springs into the arc.
      tiles.forEach((tile, index) => {
        if (tileSlot(index, previous.active, count) !== 'hidden' || tileSlot(index, view.active, count) === 'hidden') return;
        tile.dataset.from = entrySide(view.direction);
        void getComputedStyle(tile).transform;
        delete tile.dataset.from;
      });
    }

    const focused = document.activeElement;
    if (focused?.classList.contains('about-tile') && ['0', 'hidden'].includes(tileSlot(tiles.indexOf(focused), view.active, count))) {
      root.querySelector('.about-screen')?.focus({ preventScroll: true });
    }

    if (typeof Element.prototype.animate !== 'function') return;
    swapRef.current.forEach((animation) => animation.cancel());
    const outgoing = cards[previous.active];
    const incoming = cards[view.active];
    const shift = view.direction;
    const animations = [];
    if (reduce) {
      animations.push(outgoing.animate([{ opacity: 1, visibility: 'visible' }, { opacity: 0, visibility: 'visible' }], { duration: 180, easing: 'ease-out' }));
      animations.push(incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out', fill: 'backwards' }));
    } else {
      animations.push(outgoing.animate([
        { transform: 'translateX(0)', opacity: 1, filter: 'blur(0px)', visibility: 'visible' },
        { transform: `translateX(${-shift * 56}px)`, opacity: 0, filter: 'blur(6px)', visibility: 'visible' },
      ], { duration: 320, easing: 'cubic-bezier(0.55, 0, 0.75, 0.4)' }));
      // The tile shrinks behind the monitor first; the chip then "arrives" on screen.
      const enter = (selector, frames, delay, duration, easing = EASE_OUT) => {
        const element = incoming.querySelector(selector);
        if (element) animations.push(element.animate(frames, { duration, delay, easing, fill: 'backwards' }));
      };
      const slide = (distance) => [
        { opacity: 0, transform: `translateX(${shift * distance}px)`, filter: 'blur(6px)' },
        { opacity: 1, transform: 'translateX(0)', filter: 'blur(0px)' },
      ];
      enter('.about-card-chip', [
        { opacity: 0, transform: 'scale(0.55)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
      ], 210, 560, springEasing());
      enter('.about-card-number', slide(28), 150, 460);
      enter('.about-card-title', slide(40), 190, 480);
      enter('.about-card-text', slide(40), 250, 480);
      // Live screen light: the glow and screen flash briefly as content changes.
      const glow = root.querySelector('.about-glow');
      const flash = root.querySelector('.about-screen-flash');
      if (glow) animations.push(glow.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.55)', offset: 0.35 }, { filter: 'brightness(1)' }], { duration: 320, easing: 'ease-out' }));
      if (flash) animations.push(flash.animate([{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], { duration: 320, easing: 'ease-out' }));
    }
    swapRef.current = animations;
  }, [view, rootRef, count]);

  // Power-on: the monitor lights up once, when ~35% of the section is visible.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.about-stage');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof IntersectionObserver !== 'function' || powerReached(visibleShare(root))) return;

    let timer;
    stage.dataset.power = 'off';
    const words = root.querySelectorAll('.about-title-word').length;
    const observer = new IntersectionObserver(() => {
      if (!powerReached(visibleShare(root))) return;
      observer.disconnect();
      if (stage.dataset.power !== 'off') return;
      stage.dataset.power = 'on';
      timer = window.setTimeout(() => { stage.dataset.power = 'ready'; }, powerSequenceDuration(POWER_TIMING, words) + 120);
    }, { threshold: [0, 0.1, 0.2, POWER_RATIO, 0.5] });
    observer.observe(root);
    const onPreferenceChange = () => { if (preference.matches) delete stage.dataset.power; };
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      preference.removeEventListener('change', onPreferenceChange);
      delete stage.dataset.power;
    };
  }, [rootRef]);

  // Visibility gates idle float (via CSS) and the pointer parallax loop.
  // Pointer depth: the monitor tilts up to 4°, and tiles drift at their own depth.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.about-stage');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let inView = true;
    let frame = null;
    let last = null;
    let rect = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const write = () => {
      stage.style.setProperty('--about-px', current.x.toFixed(4));
      stage.style.setProperty('--about-py', current.y.toFixed(4));
    };
    const tick = (time) => {
      frame = null;
      if (!inView) { last = null; return; }
      const elapsed = last === null ? 16.7 : Math.min(64, time - last);
      last = time;
      const blend = 1 - Math.pow(1 - 0.1, elapsed / 16.7);
      current.x += (target.x - current.x) * blend;
      current.y += (target.y - current.y) * blend;
      const settled = Math.abs(target.x - current.x) < 0.0005 && Math.abs(target.y - current.y) < 0.0005;
      if (settled) { current.x = target.x; current.y = target.y; }
      write();
      if (settled) last = null;
      else frame = requestAnimationFrame(tick);
    };
    const start = () => { if (frame === null && inView) frame = requestAnimationFrame(tick); };
    const enabled = () => finePointer.matches && !preference.matches && !pausedRef.current;
    const onMove = (event) => {
      if (event.pointerType === 'touch' || !enabled()) return;
      rect ??= stage.getBoundingClientRect();
      const clamp = (value) => Math.max(-1, Math.min(1, value));
      target.x = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2));
      target.y = clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2));
      start();
    };
    const reset = () => { rect = null; target.x = 0; target.y = 0; start(); };
    const forgetRect = () => { rect = null; };
    parallaxResetRef.current = reset;
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      root.dataset.visible = String(inView);
      if (!inView) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        last = null;
        target.x = target.y = current.x = current.y = 0;
        write();
      }
    }) : null;
    observer?.observe(root);
    const onChange = () => { if (!enabled()) reset(); };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', forgetRect, { passive: true });
    window.addEventListener('resize', forgetRect);
    preference.addEventListener('change', onChange);
    finePointer.addEventListener('change', onChange);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect();
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', forgetRect);
      window.removeEventListener('resize', forgetRect);
      preference.removeEventListener('change', onChange);
      finePointer.removeEventListener('change', onChange);
      stage.style.removeProperty('--about-px');
      stage.style.removeProperty('--about-py');
      delete root.dataset.visible;
      parallaxResetRef.current = null;
    };
  }, [rootRef]);

  // Swipe / drag: horizontal movement past the threshold changes the card;
  // `touch-action: pan-y` on the stage keeps vertical page scrolling native.
  useEffect(() => {
    const stage = rootRef.current.querySelector('.about-stage');
    let start = null;
    let suppressClick = false;
    const onDown = (event) => {
      suppressClick = false;
      if (!event.isPrimary || event.button !== 0) return;
      start = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const onUp = (event) => {
      if (!start || event.pointerId !== start.id) return;
      const direction = swipeStep(event.clientX - start.x, event.clientY - start.y);
      start = null;
      if (!direction) return;
      suppressClick = true;
      if (event.pointerType === 'mouse') window.getSelection()?.removeAllRanges();
      step(direction);
    };
    const onCancel = () => { start = null; };
    const onClick = (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onCancel);
    stage.addEventListener('click', onClick, true);
    return () => {
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onCancel);
      stage.removeEventListener('click', onClick, true);
    };
  }, [rootRef, step]);

  const onKeyDown = useCallback((event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  }, [step]);

  return { active: view.active, direction: view.direction, announcement, paused, select: goTo, step, togglePause, onKeyDown };
}
