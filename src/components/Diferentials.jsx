import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { ShieldCheck, Sparkles, Layers, Handshake } from 'lucide-react';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';
import usePillarAssembly from '../hooks/usePillarAssembly';
import usePillarConnections from '../hooks/usePillarConnections';
import { PILLAR_ANCHORS, PILLAR_CONNECTIONS, PILLAR_LOGO, PILLAR_SLICES } from '../utils/pillarAssembly';

const icons = [ShieldCheck, Layers, Sparkles, Handshake];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function Differentials({ content }) {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const id = useId().replace(/:/g, '');
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const active = hovered ?? selected;
  useTextSpotlight(sectionRef);
  usePillarAssembly(sceneRef);
  usePillarConnections(sceneRef);
  const preview = (index, event) => { if (event.pointerType !== 'touch') setHovered(index); };
  const select = (index) => setSelected((current) => current === index ? null : index);

  return (
    <section ref={sectionRef} id="diferenciais" data-motion-scope data-animated={enhanced} data-paused={paused} aria-labelledby="differentials-title" className="differentials-section section-anchor relative isolate">
      <div aria-hidden="true" className="pillar-ambience pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="services-ambient-purple" />
        <div className="services-ambient-blue" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div data-reveal-group="copy" className="differentials-heading">
          <p data-reveal data-text-spotlight className="hero-slogan text-spotlight mb-6 w-fit text-sm font-medium tracking-wide">
            <span className="spotlight-ink block"><span aria-hidden="true">// </span>{content.title}</span>
          </p>
          <WaveHeadline as="h2" id="differentials-title" text={content.headline} paused={paused} className="hero-headline text-spotlight relative text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl" />
          <p data-reveal data-text-spotlight className="about-body about-supporting text-spotlight mt-8 max-w-2xl"><span className="spotlight-ink block">{content.description}</span></p>
        </div>

        <div ref={sceneRef} className="pillar-scene" data-enhanced={enhanced} data-has-active={active !== null}>
          <svg className="pillar-connectors" viewBox="0 0 1100 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
            {PILLAR_CONNECTIONS.map((path, index) => (
              <g key={path} data-active={active === index} data-selected={selected === index}>
                <path d={path} pathLength="1" className="pillar-connector" />
                <path d={path} pathLength="1" className="pillar-connector-flow" />
                <circle cx={index % 2 === 0 ? 790 : 310} cy={[110, 190, 420, 450][index]} r="3" />
              </g>
            ))}
          </svg>
          <div className="pillar-figure">
            <div className="pillar-halo" aria-hidden="true" />
            <svg className="pillar-mark" viewBox="0 0 500 520" fill="none" aria-hidden="true">
              <defs>
                <image id={`${id}-mark`} href={PILLAR_LOGO} x="0" y="10" width="500" height="500" preserveAspectRatio="xMidYMid meet" />
                {PILLAR_SLICES.map(({ top, bottom }, index) => (
                  <clipPath key={index} id={`${id}-slice-${index}`}><rect x="0" y={top} width="500" height={bottom - top} /></clipPath>
                ))}
              </defs>
              {PILLAR_SLICES.map((_, index) => (
                <g key={index} className="pillar-piece" data-active={active === index} data-selected={selected === index} onPointerEnter={(event) => preview(index, event)} onPointerLeave={() => setHovered(null)} onClick={() => select(index)}>
                  {[6, 4, 2].map((depth) => (
                    <g key={depth} transform={`translate(0 ${depth})`}><g clipPath={`url(#${id}-slice-${index})`}><use href={`#${id}-mark`} className="pillar-depth" /></g></g>
                  ))}
                  <g clipPath={`url(#${id}-slice-${index})`}>
                    <use className="pillar-face" href={`#${id}-mark`} />
                  </g>
                </g>
              ))}
              {PILLAR_ANCHORS.map(({ x, y }, index) => <circle key={index} className="pillar-anchor" cx={x} cy={y} r="1" fill="transparent" pointerEvents="none" />)}
            </svg>
            <p className="sr-only">{content.assemblyDescription}</p>
          </div>
          {content.cards.map((item, index) => {
            const Icon = icons[index];
            return (
              <div key={item.title} className={`pillar-callout pillar-callout-${index}`} data-active={active === index} data-selected={selected === index} onPointerEnter={(event) => preview(index, event)} onPointerLeave={() => setHovered(null)}>
                <h3>
                  <button type="button" className="pillar-select" disabled={!enhanced} aria-pressed={selected === index} aria-describedby={`${id}-description-${index}`} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} onClick={() => select(index)}>
                    <span className="pillar-icon" aria-hidden="true"><Icon size={23} /></span>
                    <span className="pillar-title">{item.title}</span>
                    <span className="pillar-number" aria-hidden="true">0{index + 1}</span>
                  </button>
                </h3>
                <p id={`${id}-description-${index}`} data-text-spotlight className="pillar-description text-spotlight"><span className="spotlight-ink block">{item.description}</span></p>
              </div>
            );
          })}
        </div>
        <button type="button" hidden={!enhanced} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="pillar-motion-control sr-only focus:not-sr-only focus:mt-6 focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-brand-purple">
          {paused ? content.resumeAnimation : content.pauseAnimation}
        </button>
      </div>
    </section>
  );
}
