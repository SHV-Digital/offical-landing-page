import { useEffect, useState } from 'react';
import { getActiveSection } from '../utils/activeSection';

export default function useActiveSection(headerRef) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = [...document.querySelectorAll('main section[id]:not(#inicio)')];
    const header = headerRef.current;
    let frame;
    let navigationTimer;
    let pendingNavigation = null;
    let disposed = false;
    let initialNavigationInterrupted = false;
    let initialAnchorFrame;
    const initialHash = window.location.hash;
    const update = () => {
      if (disposed) return;
      // Keep the clicked destination highlighted while the browser passes
      // intermediate sections during native smooth scrolling.
      if (pendingNavigation) {
        if (Math.abs(window.scrollY - pendingNavigation.scrollY) > 2) {
          setActive(pendingNavigation.active);
          return;
        }
        pendingNavigation = null;
        window.clearTimeout(navigationTimer);
      }
      const activationLine = headerRef.current.getBoundingClientRect().bottom + 48;
      const positions = sections.map((section) => ({
        id: section.id,
        top: section.getBoundingClientRect().top + (parseFloat(getComputedStyle(section).paddingTop) || 0),
      }));
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      setActive(getActiveSection(positions, activationLine, atBottom));
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const interruptNavigation = () => {
      initialNavigationInterrupted = true;
      pendingNavigation = null;
      window.clearTimeout(navigationTimer);
      schedule();
    };
    const onNavigationClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!link || !header.contains(link)) return;
      initialNavigationInterrupted = true;
      const id = link.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const destination = Math.max(0, Math.min(maxScroll, window.scrollY + target.getBoundingClientRect().top - padding - margin));
      pendingNavigation = { id, active: id === 'inicio' ? '' : id, scrollY: destination };
      setActive(pendingNavigation.active);
      window.clearTimeout(navigationTimer);
      // Fallback for a canceled/unsupported native smooth scroll or late layout change.
      navigationTimer = window.setTimeout(interruptNavigation, 2500);
      schedule();
    };
    const onScrollKey = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interruptNavigation();
    };
    const onPopState = () => {
      if (pendingNavigation?.id === window.location.hash.slice(1)) schedule();
      else interruptNavigation();
    };
    const onPointerDown = (event) => {
      if (!header.contains(event.target)) interruptNavigation();
    };
    header.addEventListener('click', onNavigationClick);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('scrollend', schedule);
    window.addEventListener('resize', interruptNavigation);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('wheel', interruptNavigation, { passive: true });
    window.addEventListener('touchstart', interruptNavigation, { passive: true });
    window.addEventListener('keydown', onScrollKey);
    window.addEventListener('pointerdown', onPointerDown);
    // The prerendered card list becomes an orbit during hydration, changing
    // section positions. Settle a direct fragment after fonts/layout are ready,
    // but never pull the user back after they have started navigating.
    Promise.resolve(document.fonts?.ready).then(() => {
      if (disposed) return;
      initialAnchorFrame = requestAnimationFrame(() => {
        if (disposed || initialNavigationInterrupted || !initialHash || window.location.hash !== initialHash) return;
        document.getElementById(initialHash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' });
        schedule();
      });
      schedule();
    });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    observer?.observe(headerRef.current);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialAnchorFrame);
      window.clearTimeout(navigationTimer);
      observer?.disconnect();
      header.removeEventListener('click', onNavigationClick);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('scrollend', schedule);
      window.removeEventListener('resize', interruptNavigation);
      window.removeEventListener('hashchange', schedule);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('wheel', interruptNavigation);
      window.removeEventListener('touchstart', interruptNavigation);
      window.removeEventListener('keydown', onScrollKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [headerRef]);

  return active;
}
