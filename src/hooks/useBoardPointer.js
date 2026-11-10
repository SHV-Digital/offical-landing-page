import { useEffect } from 'react';
import { boardPointerTarget, boardSpotPosition } from '../utils/boardPointer';

// Desktop pointer depth for the Services board: it leans up to 5° towards the
// cursor and a light follows the cursor across its surface. Only custom
// properties are written; CSS turns them into transforms.
export default function useBoardPointer(rootRef, paused) {
  useEffect(() => {
    const root = rootRef.current;
    const section = root.closest('section');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const desktop = window.matchMedia('(min-width: 960px)');
    // Write transforms straight onto the two moving elements: inherited custom
    // properties on the stage would restyle every trace and chip each frame.
    const tilt = root.querySelector('.processor-tilt');
    const light = root.querySelector('.processor-reveal');
    let frame = null;
    let last = null;
    let rect = null;
    const target = { x: 0, y: 0, spotX: 0, spotY: 0 };
    const current = { x: 0, y: 0, spotX: 0, spotY: 0 };
    let placed = false;

    const write = () => {
      tilt.style.transform = current.x || current.y ? `rotateX(${(current.y * -5).toFixed(3)}deg) rotateY(${(current.x * 5).toFixed(3)}deg)` : '';
      light.style.transform = `translate3d(${current.spotX.toFixed(1)}px, ${current.spotY.toFixed(1)}px, 3px)`;
    };
    const tick = (time) => {
      frame = null;
      const elapsed = last === null ? 16.7 : Math.min(64, time - last);
      last = time;
      const blend = 1 - Math.pow(1 - 0.12, elapsed / 16.7);
      let settled = true;
      for (const key of Object.keys(current)) {
        current[key] += (target[key] - current[key]) * blend;
        const tolerance = key.startsWith('spot') ? 0.3 : 0.0005;
        if (Math.abs(target[key] - current[key]) < tolerance) current[key] = target[key];
        else settled = false;
      }
      write();
      if (settled) last = null;
      else frame = requestAnimationFrame(tick);
    };
    const start = () => { if (frame === null) frame = requestAnimationFrame(tick); };
    const enabled = () => !paused && desktop.matches && finePointer.matches && !preference.matches
      && section?.dataset.boardVisible !== 'false' && !['waiting', 'playing'].includes(root.dataset.startup);
    const hideSpot = () => { delete root.dataset.spot; };
    const reset = () => {
      rect = null;
      target.x = 0;
      target.y = 0;
      hideSpot();
      start();
    };
    const onMove = (event) => {
      if (event.pointerType === 'touch' || !enabled()) return;
      rect ??= root.getBoundingClientRect();
      const pose = boardPointerTarget(event.clientX, event.clientY, rect);
      target.x = pose.x;
      target.y = pose.y;
      const spot = boardSpotPosition(event);
      if (spot) {
        target.spotX = spot.x;
        target.spotY = spot.y;
        // The first reading places the light at once instead of sliding in
        // from the board's corner.
        if (!placed) { current.spotX = spot.x; current.spotY = spot.y; placed = true; }
        root.dataset.spot = 'true';
      } else hideSpot();
      start();
    };
    const forgetRect = () => { rect = null; };
    const onChange = () => { if (!enabled()) reset(); };
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', forgetRect, { passive: true });
    window.addEventListener('resize', forgetRect);
    preference.addEventListener('change', onChange);
    finePointer.addEventListener('change', onChange);
    desktop.addEventListener('change', onChange);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', forgetRect);
      window.removeEventListener('resize', forgetRect);
      preference.removeEventListener('change', onChange);
      finePointer.removeEventListener('change', onChange);
      desktop.removeEventListener('change', onChange);
      tilt.style.removeProperty('transform');
      light.style.removeProperty('transform');
      delete root.dataset.spot;
    };
  }, [rootRef, paused]);
}
