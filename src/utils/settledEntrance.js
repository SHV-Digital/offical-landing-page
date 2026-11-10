export const ENTRANCE_IDLE_MS = 240;

// Hold the first frame before scrolling brings it into view. Playback resumes
// from that same frame instead of resetting already-visible finished content.
export function holdEntrance(animation) {
  animation.pause();
  animation.currentTime = 0;
  return animation;
}

// Use the available viewport, not a fixed percentage of a possibly tall section.
export function isEntranceVisible(rect, viewport, headerBottom = 0) {
  const top = Math.max(0, headerBottom);
  const availableHeight = Math.max(0, viewport.height - top);
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, top));
  const visibleWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0));
  return rect.height > 0 && rect.width > 0 && availableHeight > 0
    && visibleHeight >= Math.min(rect.height, availableHeight) * 0.5
    && visibleWidth >= Math.min(rect.width, viewport.width) * 0.5;
}

// Only observes; never scrolls, changes focus, or hides waiting content.
export function observeSettledEntrance(element, play) {
  let timer;
  let disposed = false;
  const clear = () => window.clearTimeout(timer);
  const stop = () => {
    disposed = true;
    clear();
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('scrollend', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', schedule);
  };
  const check = () => {
    if (disposed || document.hidden) return;
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
    if (!isEntranceVisible(element.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight }, headerBottom)) return;
    stop();
    play();
  };
  const schedule = () => {
    if (disposed) return;
    clear();
    if (!document.hidden) timer = window.setTimeout(check, ENTRANCE_IDLE_MS);
  };
  const observer = new IntersectionObserver(schedule, { threshold: [0, 0.25, 0.5, 0.75] });
  observer.observe(element);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('scrollend', schedule);
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  Promise.resolve(document.fonts?.ready).then(schedule);
  schedule();
  return stop;
}
