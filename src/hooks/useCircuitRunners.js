import { useEffect } from 'react';
import { CIRCUITS, runnerFrames } from '../utils/serviceCircuit';

// Irregular, out-of-phase standby pulses: one every 1.9–2.9s per trace.
const CYCLES = [{ duration: 2300, delay: -400 }, { duration: 1900, delay: -1300 }, { duration: 2900, delay: -2100 }, { duration: 2600, delay: -900 }];

// Standby pulses as compositor-only transform/opacity animations. They play
// only while the board is visible, started, unpaused and motion is allowed.
export default function useCircuitRunners(rootRef, enhanced) {
  useEffect(() => {
    const root = rootRef.current;
    const section = root.closest('section');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Runners only exist after hydration enables the board.
    if (!enhanced || typeof Element.prototype.animate !== 'function') return;

    const animations = [...root.querySelectorAll('.circuit-runner')].map((runner) => {
      const circuit = CIRCUITS[runner.dataset.layout];
      const index = Number(runner.dataset.service);
      const { duration, delay } = CYCLES[index];
      const animation = runner.animate(runnerFrames(circuit.mains[index].points, circuit.width, circuit.height), { duration, iterations: Infinity, easing: 'linear' });
      animation.currentTime = duration + delay;
      animation.pause();
      return animation;
    });
    const sync = () => {
      const running = !preference.matches && !document.hidden
        && section?.dataset.boardVisible !== 'false' && section?.dataset.paused !== 'true'
        && !['waiting', 'playing'].includes(root.dataset.startup);
      animations.forEach((animation) => (running ? animation.play() : animation.pause()));
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-startup'] });
    if (section) observer.observe(section, { attributes: true, attributeFilter: ['data-board-visible', 'data-paused'] });
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
      animations.forEach((animation) => animation.cancel());
    };
  }, [rootRef, enhanced]);
}
