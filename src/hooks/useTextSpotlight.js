import { useEffect } from 'react';

export default function useTextSpotlight(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...container.querySelectorAll('[data-text-spotlight]')];
    const fadeTimers = new Map();
    let active = null;

    targets.forEach((target) => target.setAttribute('data-spotlight-ready', 'true'));

    const finishFade = (target) => {
      window.clearTimeout(fadeTimers.get(target));
      fadeTimers.delete(target);
      target.removeAttribute('data-spotlight-fading');
      if (target !== active) {
        target.style.removeProperty('--spotlight-x');
        target.style.removeProperty('--spotlight-y');
      }
    };
    const clear = () => {
      if (!active) return;
      const target = active;
      active = null;
      // Hold the idle animation's phase until the visual layer has faded away.
      if (!preference.matches && !document.hidden) {
        target.setAttribute('data-spotlight-fading', 'true');
        fadeTimers.set(target, window.setTimeout(() => finishFade(target), 300));
      }
      target.removeAttribute('data-spotlight');
    };

    const followPointer = (event) => {
      // Touch gets a temporary spotlight while pressed, never a sticky hover.
      if (event.pointerType === 'touch' && event.type === 'pointermove' && !event.buttons) return;
      const target = event.target instanceof Element ? event.target.closest('[data-text-spotlight]') : null;
      if (!target || !container.contains(target)) {
        clear();
        return;
      }
      if (active !== target) {
        clear();
        finishFade(target);
        active = target;
      }
      const bounds = target.getBoundingClientRect();
      target.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      target.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
      if (!target.hasAttribute('data-spotlight')) target.setAttribute('data-spotlight', 'true');
    };

    const endTouch = (event) => { if (event.pointerType === 'touch') clear(); };
    const onVisibilityChange = () => {
      if (document.hidden) {
        clear();
        [...fadeTimers.keys()].forEach(finishFade);
      }
    };
    const onTransitionEnd = (event) => {
      if (event.propertyName === '--spotlight-strength' && event.target instanceof Element && event.target.hasAttribute('data-spotlight-fading') && !event.target.hasAttribute('data-spotlight')) finishFade(event.target);
    };
    const onPreferenceChange = () => {
      if (preference.matches) [...fadeTimers.keys()].forEach(finishFade);
    };
    const onResize = () => {
      clear();
      targets.forEach((target) => {
        target.style.removeProperty('--spotlight-x');
        target.style.removeProperty('--spotlight-y');
      });
    };
    container.addEventListener('pointermove', followPointer);
    container.addEventListener('pointerdown', followPointer);
    container.addEventListener('pointerleave', clear);
    container.addEventListener('pointercancel', clear);
    container.addEventListener('transitionend', onTransitionEnd);
    window.addEventListener('pointerup', endTouch);
    window.addEventListener('blur', clear);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      active = null;
      [...fadeTimers.keys()].forEach(finishFade);
      targets.forEach((target) => {
        target.removeAttribute('data-spotlight');
        target.removeAttribute('data-spotlight-fading');
        target.removeAttribute('data-spotlight-ready');
        target.style.removeProperty('--spotlight-x');
        target.style.removeProperty('--spotlight-y');
      });
      container.removeEventListener('pointermove', followPointer);
      container.removeEventListener('pointerdown', followPointer);
      container.removeEventListener('pointerleave', clear);
      container.removeEventListener('pointercancel', clear);
      container.removeEventListener('transitionend', onTransitionEnd);
      window.removeEventListener('pointerup', endTouch);
      window.removeEventListener('blur', clear);
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [containerRef]);
}
