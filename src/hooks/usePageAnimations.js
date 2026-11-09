import { useEffect } from 'react';

export const INTRO_DURATION_MS = 3200;

export default function usePageAnimations(mainRef) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;

    const animations = new Set();
    const play = (element, delay = 0) => {
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(28px)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
      ], { duration: 800, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      animations.add(animation);
      animation.addEventListener('finish', () => animations.delete(animation), { once: true });
    };

    // Only animate after hydration. Static HTML always stays visible without JS.
    const intro = document.querySelector('.intro-overlay');
    const delay = intro && !intro.hidden ? INTRO_DURATION_MS * 0.58 : 0;
    const hero = mainRef.current.querySelector('section');
    if (!window.location.hash && window.scrollY === 0) {
      hero.querySelectorAll('[data-reveal]').forEach((element, index) => play(element, delay + index * 90));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        play(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    mainRef.current.querySelectorAll('section:not(:first-child) [data-reveal]').forEach((element) => observer.observe(element));

    const cancelAnimations = () => animations.forEach((animation) => animation.cancel());
    // Do not make someone wait through delayed hero animations after scrolling.
    window.addEventListener('scroll', cancelAnimations, { once: true, passive: true });
    window.addEventListener('pointerdown', cancelAnimations, { once: true });
    window.addEventListener('keydown', cancelAnimations, { once: true });
    preference.addEventListener('change', cancelAnimations);
    return () => {
      observer.disconnect();
      cancelAnimations();
      window.removeEventListener('scroll', cancelAnimations);
      window.removeEventListener('pointerdown', cancelAnimations);
      window.removeEventListener('keydown', cancelAnimations);
      preference.removeEventListener('change', cancelAnimations);
    };
  }, [mainRef]);
}
