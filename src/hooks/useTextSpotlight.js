import { useEffect } from 'react';

export default function useTextSpotlight(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    let active = null;

    const clear = () => {
      if (!active) return;
      active.removeAttribute('data-spotlight');
      active = null;
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
        active = target;
      }
      const bounds = target.getBoundingClientRect();
      target.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
      target.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
      if (!target.hasAttribute('data-spotlight')) target.setAttribute('data-spotlight', 'true');
    };

    const endTouch = (event) => { if (event.pointerType === 'touch') clear(); };
    const onVisibilityChange = () => { if (document.hidden) clear(); };
    container.addEventListener('pointermove', followPointer);
    container.addEventListener('pointerdown', followPointer);
    container.addEventListener('pointerleave', clear);
    container.addEventListener('pointercancel', clear);
    window.addEventListener('pointerup', endTouch);
    window.addEventListener('blur', clear);
    window.addEventListener('scroll', clear, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      clear();
      container.removeEventListener('pointermove', followPointer);
      container.removeEventListener('pointerdown', followPointer);
      container.removeEventListener('pointerleave', clear);
      container.removeEventListener('pointercancel', clear);
      window.removeEventListener('pointerup', endTouch);
      window.removeEventListener('blur', clear);
      window.removeEventListener('scroll', clear);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [containerRef]);
}
