import { useEffect } from 'react';
import { CONTACT_FLOW_DURATION, CONTACT_FLOW_NODES, CONTACT_FLOW_BRIDGE, CONTACT_FLOW_BUTTON, contactBridgePath, contactFlowWindow } from '../utils/contactFlow';

export default function useContactFlow(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const layout = section.querySelector('.contact-layout');
    const steps = [...section.querySelectorAll('.contact-step')];
    const bridge = section.querySelector('.contact-flow-bridge');
    const button = section.querySelector('.contact-submit');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = [];
    let visible = false;
    let ready = false;
    let measured = false;
    let disposed = false;
    let frame;
    const add = (node, frames, id) => {
      const animation = node.animate(frames, { id, duration: CONTACT_FLOW_DURATION, iterations: Infinity, easing: 'linear' });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    };
    if (typeof Element.prototype.animate !== 'function' || typeof IntersectionObserver !== 'function') return;
    steps.forEach((step, index) => {
      const start = CONTACT_FLOW_NODES[index];
      add(step.querySelector('.contact-step-signal'), contactFlowWindow(start, start + 0.14, { opacity: 0 }, { opacity: 0.8 }), `contact-flow-node-${index}`);
      const light = step.querySelector('.contact-step-light');
      if (light) add(light, [
        { offset: 0, top: '-35%', opacity: 0 },
        { offset: start + 0.04, top: '-35%', opacity: 0 },
        { offset: start + 0.07, opacity: 0.95 },
        { offset: start + 0.18, opacity: 0.95 },
        { offset: CONTACT_FLOW_NODES[index + 1], top: '100%', opacity: 0 },
        { offset: 1, top: '100%', opacity: 0 },
      ], `contact-flow-rail-${index}`);
    });
    const [bridgeStart, bridgeEnd] = CONTACT_FLOW_BRIDGE;
    add(bridge.querySelector('.contact-flow-track'), contactFlowWindow(bridgeStart, bridgeEnd + 0.05, { opacity: 0 }, { opacity: 0.28 }), 'contact-flow-track');
    add(bridge.querySelector('.contact-flow-packet'), [
      { offset: 0, strokeDashoffset: 0.1, opacity: 0 },
      { offset: bridgeStart, strokeDashoffset: 0.1, opacity: 0 },
      { offset: bridgeStart + 0.03, opacity: 0.9 },
      { offset: bridgeEnd - 0.02, opacity: 0.9 },
      { offset: bridgeEnd, strokeDashoffset: -1.1, opacity: 0 },
      { offset: 1, strokeDashoffset: -1.1, opacity: 0 },
    ], 'contact-flow-bridge');
    const [buttonStart, buttonEnd] = CONTACT_FLOW_BUTTON;
    add(button.querySelector('.contact-submit-charge'), contactFlowWindow(buttonStart, buttonEnd + 0.07, { opacity: 0 }, { opacity: 0.75 }), 'contact-flow-charge');
    add(button.querySelector('.contact-submit-sweep'), [
      { offset: 0, transform: 'translateX(-100%) skewX(-20deg)', opacity: 0 },
      { offset: buttonStart, transform: 'translateX(-100%) skewX(-20deg)', opacity: 0 },
      { offset: buttonStart + 0.02, opacity: 0.8 },
      { offset: buttonEnd - 0.02, opacity: 0.8 },
      { offset: buttonEnd, transform: 'translateX(500%) skewX(-20deg)', opacity: 0 },
      { offset: 1, transform: 'translateX(500%) skewX(-20deg)', opacity: 0 },
    ], 'contact-flow-sweep');
    const sync = () => {
      ready = section.dataset.contactEntrance === 'done' && steps.every((step) => step.dataset.motionReady === 'true');
      const running = ready && measured && visible && !document.hidden && !preference.matches && section.dataset.paused !== 'true';
      animations.forEach((animation) => {
        if (running && animation.playState === 'paused') animation.play();
        else if (!running && animation.playState === 'running') animation.pause();
      });
    };
    const measure = () => {
      if (disposed) return;
      const bounds = layout.getBoundingClientRect();
      const journey = section.querySelector('.contact-journey').getBoundingClientRect();
      const icon = steps.at(-1).querySelector('.contact-step-icon').getBoundingClientRect();
      const form = section.querySelector('.contact-form').getBoundingClientRect();
      const target = button.getBoundingClientRect();
      if (!bounds.width || !target.width) return;
      bridge.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      const path = contactBridgePath(icon, journey, form, target, bounds, form.top >= journey.bottom);
      bridge.querySelectorAll('path').forEach((node) => node.setAttribute('d', path));
      measured = true;
      sync();
    };
    const schedule = () => { if (!disposed) { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); } };
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    [layout, button, ...steps].forEach((node) => resize?.observe(node));
    const mutations = new MutationObserver(() => { sync(); schedule(); });
    mutations.observe(section, { subtree: true, attributes: true, attributeFilter: ['data-paused', 'data-motion-ready', 'data-contact-entrance'] });
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    visibility.observe(layout);
    // Entrance transforms must settle before their measured endpoints are used.
    Promise.allSettled([...section.getAnimations({ subtree: true })].filter((animation) => animation.id === 'contact-arrival' || animation.id === 'contact-step-arrival').map((animation) => animation.finished)).then(schedule);
    document.fonts?.ready.then(schedule);
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      resize?.disconnect();
      mutations.disconnect();
      visibility.disconnect();
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
    };
  }, [sectionRef]);
}
