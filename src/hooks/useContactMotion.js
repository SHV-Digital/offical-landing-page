import { useEffect } from 'react';
import { ENTRANCE_IDLE_MS, holdEntrance, isEntranceVisible, observeSettledEntrance } from '../utils/settledEntrance';
import { serviceIconPose } from '../utils/serviceIcon';

export default function useContactMotion(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const targets = [...section.querySelectorAll('.contact-step, .contact-form')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visible = new Set();
    let active;
    let frame;
    let pointer;
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = undefined;
      if (active) {
        delete active.dataset.pointer;
        ['--contact-rx', '--contact-ry', '--contact-x', '--contact-y'].forEach((property) => active.style.removeProperty(property));
      }
      active = null;
    };
    const syncVisibility = () => targets.forEach((target) => {
      target.dataset.motionVisible = String(visible.has(target) && !document.hidden);
    });
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else { visible.delete(entry.target); if (active === entry.target) clear(); }
      });
      syncVisibility();
    }) : null;
    targets.forEach((target) => { if (observer) observer.observe(target); else visible.add(target); });
    syncVisibility();
    const follow = (event) => {
      if (preference.matches || section.dataset.paused === 'true' || event.pointerType === 'touch') return;
      const target = event.target instanceof Element ? event.target.closest('.contact-step, .contact-form') : null;
      if (!target || !section.contains(target)) { clear(); return; }
      if (active !== target) { clear(); active = target; }
      pointer = { x: event.clientX, y: event.clientY };
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        if (!active) return;
        const bounds = active.getBoundingClientRect();
        const pose = serviceIconPose(pointer.x, pointer.y, bounds);
        active.style.setProperty('--contact-rx', `${pose.rotateX * 0.6}deg`);
        active.style.setProperty('--contact-ry', `${pose.rotateY * 0.6}deg`);
        active.style.setProperty('--contact-x', `${pointer.x - bounds.left}px`);
        active.style.setProperty('--contact-y', `${pointer.y - bounds.top}px`);
        active.dataset.pointer = 'true';
      });
    };
    const onVisibilityChange = () => { clear(); syncVisibility(); };
    const pauseObserver = new MutationObserver(() => { if (section.dataset.paused === 'true') clear(); });
    pauseObserver.observe(section, { attributes: true, attributeFilter: ['data-paused'] });
    section.addEventListener('pointermove', follow);
    section.addEventListener('pointerleave', clear);
    section.addEventListener('pointercancel', clear);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('resize', clear);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', clear);
    return () => {
      clear();
      observer?.disconnect();
      pauseObserver.disconnect();
      targets.forEach((target) => delete target.dataset.motionVisible);
      section.removeEventListener('pointermove', follow);
      section.removeEventListener('pointerleave', clear);
      section.removeEventListener('pointercancel', clear);
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', clear);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', clear);
    };
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;
    const animations = [];
    const stops = [];
    const started = new Set();
    let settled = false;
    let disposed = false;
    let lastScroll = -Infinity;
    const onScroll = () => { lastScroll = performance.now(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    section.dataset.contactEntrance = 'waiting';
    const syncPlayback = () => {
      const paused = section.dataset.paused === 'true' || document.hidden;
      started.forEach((animation) => {
        if (paused && animation.playState === 'running') animation.pause();
        else if (!paused && animation.playState === 'paused') animation.play();
      });
    };
    const prepare = (element, keyframes, options) => {
      const animation = holdEntrance(element.animate(keyframes, { fill: 'backwards', ...options }));
      animations.push(animation);
      return animation;
    };
    const observe = (element, arrivals, onStart, onFinish, chained = false) => {
      if (disposed || settled) return;
      const play = () => {
        if (settled || disposed) return;
        onStart?.();
        arrivals.forEach((animation) => { started.add(animation); animation.play(); });
        syncPlayback();
        Promise.all(arrivals.map((animation) => animation.finished)).then(() => {
          if (!settled && !disposed) onFinish?.();
        }, () => {});
      };
      const header = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
      if (chained && !document.hidden && performance.now() - lastScroll >= ENTRANCE_IDLE_MS && isEntranceVisible(element.getBoundingClientRect(), { width: innerWidth, height: innerHeight }, header)) play();
      else stops.push(observeSettledEntrance(element, play));
    };
    const arrival = (element, duration = 650) => prepare(element, [
        { opacity: 0, transform: 'translateY(24px)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
      ], { id: 'contact-arrival', duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    const copy = section.querySelector('.contact-copy');
    const form = section.querySelector('.contact-form');
    const formArrival = arrival(form);
    const titleArrivals = [arrival(copy.querySelector('.hero-slogan'), 350), arrival(copy.querySelector('#contact-title'), 420)];
    const description = copy.querySelector('.contact-intro-description');
    const descriptionArrival = arrival(description, 320);
    const journeyTitle = arrival(section.querySelector('.contact-journey-title'), 320);
    // Prepare every first frame immediately, but enable only the next step's
    // visibility observer after the previous step finishes. The form is last.
    const steps = [...section.querySelectorAll('.contact-step')].map((step) => {
      const entry = prepare(step.querySelector('.contact-step-entry'), [
        { opacity: 0, transform: 'translateY(14px)', filter: 'blur(3px)' },
        { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
      ], { id: 'contact-step-arrival', duration: 360, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      const ball = prepare(step.querySelector('.contact-step-icon'), [
        { transform: 'scale(0.65)', filter: 'brightness(1)' },
        { offset: 0.55, transform: 'scale(1.06)', filter: 'brightness(1.4)' },
        { transform: 'scale(1)', filter: 'brightness(1)' },
      ], { id: 'contact-ball-arrival', composite: 'add', duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      const rail = step.querySelector('.contact-step-rail');
      const passage = rail ? [
        prepare(rail, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { id: 'contact-rail-arrival', duration: 260, easing: 'ease-out' }),
        prepare(rail.querySelector('.contact-step-intro-light'), [
          { top: '-35%', opacity: 0 },
          { offset: 0.15, opacity: 1 },
          { offset: 0.8, opacity: 1 },
          { top: '100%', opacity: 0 },
        ], { id: 'contact-intro-passage', duration: 300, easing: 'linear' }),
      ] : [];
      return { step, arrivals: [entry, ball], passage };
    });
    const showStep = (index) => {
      const item = steps[index];
      if (!item) {
        observe(form, [formArrival], () => { section.dataset.contactEntrance = 'form'; }, () => { section.dataset.contactEntrance = 'done'; }, true);
        return;
      }
      observe(item.step, index === 0 ? [...item.arrivals, journeyTitle] : item.arrivals, () => { section.dataset.contactEntrance = 'steps'; }, () => {
        item.step.dataset.motionReady = 'true';
        if (item.passage.length) observe(item.step, item.passage, undefined, () => showStep(index + 1), true);
        else showStep(index + 1);
      }, true);
    };
    observe(copy, titleArrivals, () => { section.dataset.contactEntrance = 'title'; }, () => {
      observe(description, [descriptionArrival], () => { section.dataset.contactEntrance = 'subtitle'; }, () => showStep(0), true);
    });
    const settle = () => {
      settled = true;
      started.clear();
      stops.forEach((stop) => stop());
      animations.forEach((animation) => animation.cancel());
      section.querySelectorAll('.contact-step').forEach((step) => { step.dataset.motionReady = 'true'; });
      section.dataset.contactEntrance = 'done';
    };
    const onPreferenceChange = () => { if (preference.matches) settle(); };
    const observer = new MutationObserver(syncPlayback);
    observer.observe(section, { attributes: true, attributeFilter: ['data-paused'] });
    document.addEventListener('visibilitychange', syncPlayback);
    section.addEventListener('focusin', settle);
    section.addEventListener('pointerdown', settle);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      disposed = true;
      settle();
      section.querySelectorAll('.contact-step').forEach((step) => delete step.dataset.motionReady);
      delete section.dataset.contactEntrance;
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      section.removeEventListener('focusin', settle);
      section.removeEventListener('pointerdown', settle);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [sectionRef]);
}
