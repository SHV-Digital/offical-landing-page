import { useEffect } from 'react';
import { pillarConnection } from '../utils/pillarAssembly';

// Measure real SVG anchors and icon tiles, not guessed positions in a fixed
// viewBox. Callout wrapping, font loading, and responsive layouts stay aligned.
export default function usePillarConnections(sceneRef) {
  useEffect(() => {
    const scene = sceneRef.current;
    const svg = scene.querySelector('.pillar-connectors');
    const anchors = [...scene.querySelectorAll('.pillar-anchor')];
    const icons = [...scene.querySelectorAll('.pillar-icon')];
    const links = [...svg.querySelectorAll('g')];
    let frame;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const bounds = scene.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const connections = anchors.map((anchor, index) => {
        const mark = anchor.getBoundingClientRect();
        const icon = icons[index].getBoundingClientRect();
        return {
          start: { x: mark.left + mark.width / 2 - bounds.left, y: mark.top + mark.height / 2 - bounds.top },
          end: { x: (index % 2 === 0 ? icon.left - 10 : icon.right + 10) - bounds.left, y: icon.top + icon.height / 2 - bounds.top },
        };
      });
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
      connections.forEach(({ start, end }, index) => {
        links[index].querySelectorAll('path').forEach((path) => path.setAttribute('d', pillarConnection(start, end)));
        const dot = links[index].querySelector('circle');
        dot.setAttribute('cx', end.x);
        dot.setAttribute('cy', end.y);
      });
      scene.dataset.connectionsReady = 'true';
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
    [scene, scene.querySelector('.pillar-figure'), ...scene.querySelectorAll('.pillar-callout')].forEach((element) => resizeObserver?.observe(element));
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(scene, { attributes: true, attributeFilter: ['data-assembly'] });
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', schedule);
      delete scene.dataset.connectionsReady;
    };
  }, [sceneRef]);
}
