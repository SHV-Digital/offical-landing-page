import { useEffect } from 'react';
import { holdEntrance, observeSettledEntrance } from '../utils/settledEntrance';

export const INTRO_DURATION_MS = 3200;

export default function usePageAnimations(mainRef) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;

    const animations = new Set();
    const heroAnimations = new Set();
    const stopWaiting = [];
    const revealed = new WeakSet();
    const track = (animation) => {
      animations.add(animation);
      animation.addEventListener('finish', () => animations.delete(animation), { once: true });
    };
    const play = (element, delay = 0, distance = 28, duration = 800, held = false) => {
      if (preference.matches || revealed.has(element)) return;
      revealed.add(element);
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${distance}px)`, filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
      ], { duration, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      track(animation);
      if (held) holdEntrance(animation);
      return animation;
    };

    // Only animate after hydration. Static HTML always stays visible without JS.
    const intro = document.querySelector('.intro-overlay');
    const delay = intro && !intro.hidden ? INTRO_DURATION_MS * 0.58 : 0;
    const hero = mainRef.current.querySelector('section');
    if (!window.location.hash && window.scrollY === 0) {
      hero.querySelectorAll('[data-reveal]').forEach((element, index) => heroAnimations.add(play(element, delay + index * 90)));
    }

    mainRef.current.querySelectorAll('[data-reveal-group]').forEach((group) => {
      const arrivals = [...group.querySelectorAll('[data-reveal]')].map((element, index) => play(element, index * 200, 28, 1400, true));
      const heading = group.querySelector('.hero-headline-source');
      if (heading) {
        const glow = holdEntrance(heading.animate([
          { offset: 0, textShadow: '0 0 0 transparent' },
          { offset: 0.4, textShadow: '0 0 28px rgb(168 85 247 / 0.5)' },
          { offset: 1, textShadow: '0 0 0 transparent' },
        ], { id: group.closest('#diferenciais') ? 'differentials-heading-arrival-glow' : group.closest('#servicos') ? 'services-heading-arrival-glow' : 'about-heading-arrival-glow', duration: 2200, delay: 200, easing: 'ease-in-out' }));
        track(glow);
        arrivals.push(glow);
      }
      stopWaiting.push(observeSettledEntrance(group, () => {
        if (preference.matches || revealed.has(group)) return;
        revealed.add(group);
        arrivals.forEach((animation) => animation?.play());
      }));
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        play(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: [0.12, 0.3] });
    mainRef.current.querySelectorAll('section:not(:first-child) [data-reveal]').forEach((element) => {
      if (element.closest('[data-reveal-group]')) return;
      if (element.closest('#servicos')) {
        const arrival = play(element, 0, 28, 1400, true);
        stopWaiting.push(observeSettledEntrance(element, () => {
          if (!preference.matches) arrival?.play();
        }));
      } else observer.observe(element);
    });

    const cancelAnimations = () => animations.forEach((animation) => animation.cancel());
    const cancelHero = () => heroAnimations.forEach((animation) => animation?.cancel());
    const onPreferenceChange = () => {
      if (preference.matches) {
        stopWaiting.forEach((stop) => stop());
        cancelAnimations();
      }
    };
    // Do not make someone wait through delayed hero animations after scrolling.
    window.addEventListener('scroll', cancelHero, { once: true, passive: true });
    window.addEventListener('pointerdown', cancelHero, { once: true });
    window.addEventListener('keydown', cancelHero, { once: true });
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      observer.disconnect();
      stopWaiting.forEach((stop) => stop());
      cancelAnimations();
      window.removeEventListener('scroll', cancelHero);
      window.removeEventListener('pointerdown', cancelHero);
      window.removeEventListener('keydown', cancelHero);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [mainRef]);
}
