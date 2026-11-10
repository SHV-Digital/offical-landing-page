import { useEffect } from 'react';

export const INTRO_DURATION_MS = 3200;

export default function usePageAnimations(mainRef) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;

    const animations = new Set();
    const revealed = new WeakSet();
    const track = (animation) => {
      animations.add(animation);
      animation.addEventListener('finish', () => animations.delete(animation), { once: true });
    };
    const play = (element, delay = 0, distance = 28, duration = 800) => {
      if (preference.matches || revealed.has(element)) return;
      revealed.add(element);
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${distance}px)`, filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
      ], { duration, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      track(animation);
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
        if (entry.target.hasAttribute('data-reveal-group')) {
          if (revealed.has(entry.target)) return;
          const requiredVisibility = entry.boundingClientRect.height > window.innerHeight * 1.5 ? 0.12 : 0.3;
          if (entry.intersectionRatio < requiredVisibility) return;
          revealed.add(entry.target);
          entry.target.querySelectorAll('[data-reveal]').forEach((element, index) => play(element, index * 150, 28, 950));
          const heading = entry.target.querySelector('.hero-headline-source');
          if (heading && !preference.matches) track(heading.animate([
            { offset: 0, textShadow: '0 0 0 transparent' },
            { offset: 0.4, textShadow: '0 0 28px rgb(168 85 247 / 0.5)' },
            { offset: 1, textShadow: '0 0 0 transparent' },
          ], { id: 'about-heading-arrival-glow', duration: 1500, delay: 150, easing: 'ease-in-out' }));
        } else {
          play(entry.target);
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: [0.12, 0.3] });
    mainRef.current.querySelectorAll('[data-reveal-group]').forEach((group) => observer.observe(group));
    mainRef.current.querySelectorAll('section:not(:first-child) [data-reveal]').forEach((element) => {
      if (!element.closest('[data-reveal-group]')) observer.observe(element);
    });

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
