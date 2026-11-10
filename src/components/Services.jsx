import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Code2, Layers3, Cpu, Sparkles } from 'lucide-react';
import useProcessorEntrance from '../hooks/useProcessorEntrance';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';
import useServiceMotion from '../hooks/useServiceMotion';
import useBoardPointer from '../hooks/useBoardPointer';
import useCircuitRunners from '../hooks/useCircuitRunners';
import { CIRCUITS, CLOCKWISE_ORDER, arrivalDelay, percentPoint } from '../utils/serviceCircuit';

const icons = [Code2, Layers3, Cpu, Sparkles];
const LAYOUTS = ['wide', 'tall'];
const LEAVE_MS = 150;
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Board positions come from the same geometry that draws the traces.
const slotStyle = (index) => ({
  '--wide-x': CIRCUITS.wide.chips[index].left,
  '--wide-y': CIRCUITS.wide.chips[index].top,
  '--tall-x': CIRCUITS.tall.chips[index].left,
  '--tall-y': CIRCUITS.tall.chips[index].top,
  '--order': CLOCKWISE_ORDER.indexOf(index),
});
const boardStyle = {
  '--wide-chip-w': CIRCUITS.wide.chipSize.width,
  '--wide-chip-h': CIRCUITS.wide.chipSize.height,
  '--wide-core': CIRCUITS.wide.coreSize,
  '--tall-chip-w': CIRCUITS.tall.chipSize.width,
  '--tall-chip-h': CIRCUITS.tall.chipSize.height,
  '--tall-core': CIRCUITS.tall.coreSize,
};

function Circuit({ name, selected, pulse, enhanced }) {
  const circuit = CIRCUITS[name];
  const paint = `url(#services-trace-${name})`;
  return (
    <svg className="processor-circuits" data-layout={name} viewBox={`0 0 ${circuit.width} ${circuit.height}`} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`services-trace-${name}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={circuit.width} y2={circuit.height}>
          <stop offset="0" stopColor="#c084fc" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id={`services-pulse-${name}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={circuit.width} y2={circuit.height}>
          <stop offset="0" stopColor="#f3e8ff" />
          <stop offset="0.5" stopColor="#c7d2fe" />
          <stop offset="1" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <path className="circuit-aux" d={circuit.aux} />
      <g className="processor-backplane">
        <path className="circuit-aux-lit" d={circuit.aux} stroke={paint} />
      </g>
      <path className="circuit-pins" d={circuit.pins} />
      {circuit.points.map((point, index) => (
        <circle key={index} className="circuit-point" cx={point.x} cy={point.y} r="3" />
      ))}
      {circuit.mains.map((main, index) => {
        const powered = selected === null || selected === index;
        return (
          <g key={index} className="circuit-trace" data-service={index} data-powered={powered} style={{ '--order': CLOCKWISE_ORDER.indexOf(index) }}>
            <path className="circuit-track" d={main.d} pathLength="1" />
            <path className="circuit-hover" d={main.d} stroke={paint} />
            <path className="circuit-power" d={main.d} pathLength="1" stroke={paint} />
            {enhanced && powered && <path key={`halo-${pulse}`} className="circuit-packet circuit-packet-halo" d={main.d} pathLength="1" stroke="#a855f7" />}
            {enhanced && powered && <path key={pulse} className="circuit-packet" d={main.d} pathLength="1" stroke={`url(#services-pulse-${name})`} />}
            {main.corners.map(([x, y]) => <circle key={`${x}-${y}`} className="circuit-joint" cx={x} cy={y} r="2.5" />)}
            <circle className="circuit-terminal" cx={main.pad[0]} cy={main.pad[1]} r="5" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Services({ content }) {
  const systemRef = useRef(null);
  const sectionRef = useRef(null);
  const timersRef = useRef([]);
  const [paused, setPaused] = useState(false);
  // `selected` is the activation the board is running; `panel` follows it once
  // the pulse reaches the chip, so the reading panel swaps on arrival.
  const [selected, setSelected] = useState(-1);
  const [panel, setPanel] = useState(-1);
  const [leaving, setLeaving] = useState(false);
  const [pulse, setPulse] = useState(0);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const idle = selected === -1;
  useProcessorEntrance(systemRef);
  useTextSpotlight(sectionRef);
  useServiceMotion(sectionRef, panel, paused);
  useBoardPointer(systemRef, paused);
  useCircuitRunners(systemRef, enhanced);
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);
  const activate = (index) => {
    const timers = timersRef.current;
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.length = 0;
    setSelected(index);
    setPulse((value) => value + 1);
    const instant = paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = arrivalDelay(index === null ? 0 : index, index === null, instant);
    if (!delay) {
      setPanel(index);
      setLeaving(false);
      return;
    }
    timers.push(window.setTimeout(() => setLeaving(true), delay - LEAVE_MS));
    timers.push(window.setTimeout(() => {
      setPanel(index);
      setLeaving(false);
    }, delay));
  };

  return (
    <section ref={sectionRef} id="servicos" data-motion-scope data-animated={enhanced} data-paused={paused} aria-labelledby="services-title" className="services-section section-anchor relative isolate">
      <div aria-hidden="true" className="services-ambience pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="services-ambient-purple" />
        <div className="services-ambient-blue" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div data-reveal-group="copy" className="services-heading">
          <p data-reveal data-text-spotlight className="hero-slogan text-spotlight mb-6 w-fit text-sm font-medium tracking-wide">
            <span className="spotlight-ink block"><span aria-hidden="true">// </span>{content.title}</span>
          </p>
          <WaveHeadline as="h2" id="services-title" text={content.headline} paused={paused} className="hero-headline text-spotlight relative text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl" />
          <p data-reveal data-text-spotlight className="about-body about-supporting text-spotlight mt-8 max-w-2xl">
            <span className="spotlight-ink block">{content.description}</span>
          </p>
        </div>
      </div>

      <div className="about-stage-shell services-stage-shell">
        <div className="about-stage-frame">
          <div ref={systemRef} className="services-system" data-enhanced={enhanced} data-idle={idle} data-all={selected === null}>
            <div aria-hidden="true" className="services-stage-ambience">
              <span className="services-stage-glow" />
              <span className="services-stage-glow-blue" />
            </div>
            <div className="service-processor">
              <div className="processor-tilt">
                <div className="processor-board" style={boardStyle}>
                  <span className="processor-shadow" aria-hidden="true" />
                  <span className="processor-slab" aria-hidden="true" />
                  <div className="processor-surface" aria-hidden="true" />
                  <Circuit name="wide" selected={selected} pulse={pulse} enhanced={enhanced} />
                  <Circuit name="tall" selected={selected} pulse={pulse} enhanced={enhanced} />
                  {/* One flat plane for every small animated light, so they stay
                      out of the 3D sorting and animate on the compositor. */}
                  <span className="circuit-motion" aria-hidden="true">
                    {LAYOUTS.map((name) => CIRCUITS[name].points.filter((point) => point.blink).map((point, index) => (
                      <span key={`${name}-${index}`} className="circuit-twinkle" data-layout={name} style={{ ...percentPoint(point, CIRCUITS[name]), '--blink': point.order }} />
                    )))}
                    {enhanced && LAYOUTS.map((name) => CIRCUITS[name].mains.map((main, index) => (
                      <span key={`${name}-${index}`} className="circuit-runner" data-layout={name} data-service={index} data-powered={selected === null || selected === index}><span /></span>
                    )))}
                  </span>
                  <span className="processor-reveal" aria-hidden="true" />
                  <span className="processor-core-glow" aria-hidden="true" />
                  {content.cards.map((service, index) => {
                    const powered = selected === null || selected === index;
                    return (
                      <span key={service.title} aria-hidden="true" className="board-slot service-chip-ground" data-powered={powered} style={slotStyle(index)}>
                        <span className="service-chip-shadow" />
                        {enhanced && powered && <span key={pulse} className="processor-ripple" />}
                      </span>
                    );
                  })}
                  {content.cards.map((service, index) => {
                    const Icon = icons[index];
                    return (
                      <button key={service.title} type="button" disabled={!enhanced} className={`service-chip service-chip-${index} board-slot`} style={slotStyle(index)} data-powered={selected === null || selected === index} aria-pressed={selected === null || selected === index} aria-controls="service-details" onClick={() => activate(index)}>
                        <span className="service-chip-face">
                          <span className="service-chip-top"><Icon size={22} aria-hidden="true" /><span className="service-chip-number">0{index + 1}</span></span>
                          <span className="service-chip-title">{service.title}</span>
                          <ArrowUpRight className="service-chip-arrow" size={16} aria-hidden="true" />
                        </span>
                      </button>
                    );
                  })}
                  <button type="button" disabled={!enhanced} className="processor-core" aria-label={content.activateAll} aria-pressed={selected === null} aria-controls="service-details" onClick={() => activate(null)}>
                    <span className="processor-core-face">
                      <span className="processor-core-well">
                        <img src="/logo_square.png" alt="" width="80" height="80" draggable="false" />
                      </span>
                    </span>
                    {enhanced && !idle && <span key={pulse} className="processor-core-flash" aria-hidden="true" />}
                    {selected === null && <span key={`burst-${pulse}`} className="processor-core-burst" aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </div>
            <div data-reveal id="service-details" className="service-details" data-all={panel === null} data-active={enhanced && panel !== -1} data-leaving={leaving} aria-live="polite" aria-atomic="true">
              <p className="service-details-label"><span aria-hidden="true" />{!enhanced ? content.title : panel === -1 ? content.idleLabel : panel === null ? content.allActive : content.selectedService}</p>
              <div className="service-details-stage">
                <div className="service-panel service-single-panel" hidden={enhanced && panel === null} inert={enhanced && panel === null}>
                  <div className="service-guide service-detail" hidden={!enhanced || panel !== -1}>
                    <span className="service-detail-icon service-guide-icon" aria-hidden="true"><Cpu size={28} /></span>
                    <span className="service-detail-number">00 / 04</span>
                    <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.idleTitle}</span></h3>
                    <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.idleDescription}</span></p>
                  </div>
                  {content.cards.map((service, index) => {
                    const Icon = icons[index];
                    return (
                      <article key={service.title} className="service-detail" hidden={enhanced && panel !== null && panel !== index} data-expanded={panel === index}>
                        <span className="service-detail-icon" aria-hidden="true"><span className="service-icon-glyph"><Icon size={28} /></span></span>
                        <span className="service-detail-number" aria-hidden="true">0{index + 1} / 04</span>
                        <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.title}</span></h3>
                        <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.description}</span></p>
                      </article>
                    );
                  })}
                </div>
                <div className="service-panel service-all-panel" hidden={!enhanced || panel !== null} inert={!enhanced || panel !== null}>
                  <div className="service-all-intro">
                    <div className="service-all-symbols" aria-hidden="true">
                      {icons.map((Icon, index) => (
                        <span key={index} className="service-detail-icon service-all-symbol" style={{ '--service-order': index }}><Icon size={24} /></span>
                      ))}
                    </div>
                    <span className="service-all-count">04 / 04</span>
                    <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.allTitle}</span></h3>
                    <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.allDescription}</span></p>
                  </div>
                  {content.cards.map((service, index) => {
                    const Icon = icons[index];
                    return (
                      <div key={service.title} className="service-all-row">
                        <span className="service-detail-icon" aria-hidden="true"><Icon size={16} /></span>
                        <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.title}</span></h3>
                        <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.description}</span></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <button type="button" hidden={!enhanced} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="services-motion-control sr-only focus:not-sr-only focus:mt-6 focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-brand-purple">
          {paused ? content.resumeAnimation : content.pauseAnimation}
        </button>
      </div>
    </section>
  );
}
