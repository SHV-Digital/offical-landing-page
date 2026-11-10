import { useEffect, useRef, useState } from 'react';

const LINE_DURATION_MS = 1500;

export default function WaveHeadline({ text, paused, as: tag = 'h1', id, className = 'hero-headline text-spotlight relative text-4xl font-semibold leading-[1.16] tracking-tight sm:text-5xl xl:text-[3.5rem]' }) {
  const Heading = tag;
  const sourceRef = useRef(null);
  const layerRef = useRef(null);
  const animationsRef = useRef([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const source = sourceRef.current;
    let frame;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const node = source.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      const bounds = source.getBoundingClientRect();
      const range = document.createRange();
      const measured = [];
      for (const match of text.matchAll(/\S+/g)) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        const last = measured[measured.length - 1];
        if (!last || Math.abs(last.y - rect.top) > 1) {
          measured.push({ start: match.index, end: match.index + match[0].length, x: rect.left, y: rect.top });
        } else {
          last.end = match.index + match[0].length;
        }
      }
      const next = measured.map((line) => ({
        text: text.slice(line.start, line.end),
        left: line.x - bounds.left,
        top: line.y - measured[0].y,
      }));
      setLines((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    observer?.observe(source);
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [text]);

  useEffect(() => {
    if (!lines.length || typeof Element.prototype.animate !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heading = sourceRef.current.parentElement;
    const fraction = 1 / lines.length;
    const animations = [...layerRef.current.children].map((element, index) => element.animate([
      { offset: 0, backgroundPosition: '100% 0', opacity: 0 },
      { offset: fraction * 0.02, backgroundPosition: '98% 0', opacity: 1 },
      { offset: fraction * 0.98, backgroundPosition: '2% 0', opacity: 1 },
      { offset: fraction, backgroundPosition: '0% 0', opacity: 0 },
      ...(lines.length > 1 ? [{ offset: 1, backgroundPosition: '0% 0', opacity: 0 }] : []),
    ], { duration: lines.length * LINE_DURATION_MS, delay: index * LINE_DURATION_MS, iterations: Infinity, easing: 'linear' }));
    animationsRef.current = animations;
    const syncPlayback = () => {
      const isPaused = layerRef.current.closest('[data-motion-scope]')?.dataset.paused === 'true';
      const spotlight = heading.matches('[data-spotlight], [data-spotlight-fading]');
      animations.forEach((animation) => preference.matches || isPaused || spotlight ? animation.pause() : animation.play());
    };
    syncPlayback();
    preference.addEventListener('change', syncPlayback);
    const observer = new MutationObserver(syncPlayback);
    observer.observe(heading, { attributes: true, attributeFilter: ['data-spotlight', 'data-spotlight-fading'] });
    return () => {
      animations.forEach((animation) => animation.cancel());
      animationsRef.current = [];
      preference.removeEventListener('change', syncPlayback);
      observer.disconnect();
    };
  }, [lines]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spotlight = sourceRef.current.parentElement.matches('[data-spotlight], [data-spotlight-fading]');
    animationsRef.current.forEach((animation) => paused || reduced || spotlight ? animation.pause() : animation.play());
  }, [paused, lines]);

  return (
    <Heading id={id} data-reveal data-text-spotlight className={className}>
      <span ref={sourceRef} className="hero-headline-source spotlight-ink block">{text}</span>
      <span ref={layerRef} aria-hidden="true" className="headline-wave-layer pointer-events-none absolute inset-0 select-none">
        {lines.map((line, index) => (
          <span key={`${index}-${line.text}`} className="headline-wave-line" style={{ left: line.left, top: line.top }}>{line.text}</span>
        ))}
      </span>
    </Heading>
  );
}
