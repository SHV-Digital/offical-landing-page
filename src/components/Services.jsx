import { useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Code2, Layers3, Cpu, Sparkles } from 'lucide-react';
import useProcessorEntrance from '../hooks/useProcessorEntrance';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';
import useServiceMotion from '../hooks/useServiceMotion';

const icons = [Code2, Layers3, Cpu, Sparkles];
// Separate ports keep powered and inactive branches from sharing a trunk.
const paths = ['M 250 215 H 230 Q 210 215 210 195 V 125 H 135', 'M 350 215 H 370 Q 390 215 390 195 V 125 H 465', 'M 250 265 H 230 Q 210 265 210 285 V 355 H 135', 'M 350 265 H 370 Q 390 265 390 285 V 355 H 465'];
const backplane = 'M 300 40 H 540 Q 565 40 565 65 V 415 Q 565 440 540 440 H 60 Q 35 440 35 415 V 65 Q 35 40 60 40 H 300';
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function Services({ content }) {
  const systemRef = useRef(null);
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [pulse, setPulse] = useState(0);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const idle = selected === -1;
  useProcessorEntrance(systemRef);
  useTextSpotlight(sectionRef);
  useServiceMotion(sectionRef, selected, paused);
  const activate = (index) => {
    setSelected(index);
    setPulse((value) => value + 1);
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

        <div ref={systemRef} className="services-system" data-enhanced={enhanced} data-idle={idle} data-all={selected === null}>
          <div className="service-processor">
            <div className="processor-board">
              <div className="processor-surface" aria-hidden="true" />
              <svg className="processor-circuits" viewBox="0 0 600 480" fill="none" aria-hidden="true">
                <g className="processor-backplane">
                  <path d={backplane} className="processor-backplane-track" />
                  <path d={backplane} pathLength="1" className="processor-backplane-trace" />
                </g>
                {paths.map((path, index) => (
                  <g key={`${pulse}-${index}`} data-powered={selected === null || selected === index}>
                    <path className="circuit-track" d={path} />
                    <path className="circuit-power" d={path} pathLength="1" />
                    {enhanced && <path className="circuit-packet" d={path} pathLength="1" />}
                    <circle cx={index % 2 === 0 ? 135 : 465} cy={index < 2 ? 125 : 355} r="5" className="circuit-terminal" />
                  </g>
                ))}
              </svg>
              <button type="button" disabled={!enhanced} className="processor-core" aria-label={content.activateAll} aria-pressed={selected === null} aria-controls="service-details" onClick={() => activate(null)}>
                {selected === null && <span key={pulse} className="processor-core-burst" aria-hidden="true" />}
                <span className="processor-core-pins" aria-hidden="true" />
                <span className="processor-core-face">
                  <img src="/logo_square.png" alt="" width="80" height="80" draggable="false" />
                </span>
              </button>
              {content.cards.map((service, index) => {
                const Icon = icons[index];
                return (
                  <button key={service.title} type="button" disabled={!enhanced} className={`service-chip service-chip-${index}`} data-powered={selected === null || selected === index} aria-pressed={selected === null || selected === index} aria-controls="service-details" onClick={() => activate(index)}>
                    <span className="service-chip-top"><Icon size={22} aria-hidden="true" /><span className="service-chip-number">0{index + 1}</span></span>
                    <span className="service-chip-title">{service.title}</span>
                    <ArrowUpRight className="service-chip-arrow" size={16} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
          <div data-reveal id="service-details" className="service-details" data-all={selected === null} aria-live="polite" aria-atomic="true">
            <p className="service-details-label"><span aria-hidden="true" />{!enhanced ? content.title : idle ? content.idleLabel : selected === null ? content.allActive : content.selectedService}</p>
            <div className="service-details-stage">
              <div className="service-panel service-single-panel" hidden={enhanced && selected === null} inert={enhanced && selected === null}>
                <div className="service-guide service-detail" hidden={!enhanced || !idle}>
                  <span className="service-detail-icon service-guide-icon" aria-hidden="true"><Cpu size={28} /></span>
                  <span className="service-detail-number">00 / 04</span>
                  <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.idleTitle}</span></h3>
                  <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{content.idleDescription}</span></p>
                </div>
                {content.cards.map((service, index) => {
                  const Icon = icons[index];
                  return (
                    <article key={service.title} className="service-detail" hidden={enhanced && selected !== null && selected !== index} data-expanded={selected === index}>
                      <span className="service-detail-icon" aria-hidden="true"><span className="service-icon-glyph"><Icon size={28} /></span></span>
                      <span className="service-detail-number" aria-hidden="true">0{index + 1} / 04</span>
                      <h3 data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.title}</span></h3>
                      <p data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{service.description}</span></p>
                    </article>
                  );
                })}
              </div>
              <div className="service-panel service-all-panel" hidden={!enhanced || selected !== null} inert={!enhanced || selected !== null}>
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
        <button type="button" hidden={!enhanced} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="services-motion-control sr-only focus:not-sr-only focus:mt-6 focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-brand-purple">
          {paused ? content.resumeAnimation : content.pauseAnimation}
        </button>
      </div>
    </section>
  );
}
