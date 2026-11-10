import { useEffect } from 'react';
import { serviceIconPose } from '../utils/serviceIcon';

export default function useServiceMotion(sectionRef, selected, paused) {
  useEffect(() => {
    const section = sectionRef.current;
    const board = section.querySelector('.service-processor');
    const details = section.querySelector('.service-details');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const headerBottom = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom || 0);
    let boardVisible = typeof IntersectionObserver !== 'function';
    let detailsVisible = boardVisible;
    let active = null;
    const syncVisibility = () => {
      section.dataset.boardVisible = String(boardVisible && !document.hidden);
      section.dataset.detailsVisible = String(detailsVisible && !document.hidden);
    };
    const clear = () => {
      if (!active) return;
      active.removeAttribute('data-pointer');
      ['--icon-rx', '--icon-ry', '--icon-x', '--icon-y'].forEach((property) => active.style.removeProperty(property));
      active = null;
    };
    const follow = (event) => {
      if (paused || preference.matches || event.pointerType === 'touch') return;
      const icon = event.target instanceof Element ? event.target.closest('.service-detail-icon') : null;
      if (!icon || !section.contains(icon)) { clear(); return; }
      if (active !== icon) { clear(); active = icon; }
      const pose = serviceIconPose(event.clientX, event.clientY, icon.getBoundingClientRect());
      icon.style.setProperty('--icon-rx', `${pose.rotateX}deg`);
      icon.style.setProperty('--icon-ry', `${pose.rotateY}deg`);
      icon.style.setProperty('--icon-x', `${pose.x}%`);
      icon.style.setProperty('--icon-y', `${pose.y}%`);
      icon.dataset.pointer = 'true';
    };
    const onVisibilityChange = () => { clear(); syncVisibility(); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === board) boardVisible = entry.isIntersecting;
        else detailsVisible = entry.isIntersecting;
      });
      if (!detailsVisible) clear();
      syncVisibility();
    }, { rootMargin: `-${headerBottom}px 0px 0px 0px` }) : null;
    observer?.observe(board);
    observer?.observe(details);
    syncVisibility();
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
      section.removeEventListener('pointermove', follow);
      section.removeEventListener('pointerleave', clear);
      section.removeEventListener('pointercancel', clear);
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', clear);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', clear);
      delete section.dataset.boardVisible;
      delete section.dataset.detailsVisible;
    };
  }, [sectionRef, selected, paused]);
}
