import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import BrandMark from './BrandMark';
import useLogoRotation from '../hooks/useLogoRotation';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function Hero({ content }) {
  const [paused, setPaused] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const logoRef = useRef(null);
  const copyRef = useRef(null);
  const instructionsId = useId();
  useLogoRotation(logoRef);
  useTextSpotlight(copyRef);
  const headline = `${content.title} ${content.line1} ${content.line2}`;

  return (
    <section id="inicio" data-motion-scope data-animated={hydrated} data-paused={paused} className="hero-section relative isolate flex min-h-svh items-center overflow-hidden px-6 pb-20 pt-44 lg:pb-24 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[10%] h-[600px] w-[600px] rounded-full bg-brand-purple/[0.08] blur-[130px]" />
        <div className="absolute bottom-0 right-[-15%] h-[500px] w-[500px] rounded-full bg-brand-blue/[0.06] blur-[130px]" />
      </div>

      <div className="mx-auto grid w-full min-w-0 max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="hero-brand relative mx-auto flex w-full max-w-[280px] flex-col items-center lg:max-w-[420px]" data-animated={hydrated} data-paused={paused}>
          <div aria-hidden="true" className="hero-brand-halo" />
          <div
            ref={logoRef}
            role="group"
            aria-label={content.logoInteraction}
            aria-describedby={hydrated ? instructionsId : undefined}
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
            tabIndex={hydrated ? 0 : undefined}
            data-interactive={hydrated}
            className="hero-brand-art relative w-full rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand-purple/60"
          >
            <BrandMark />
          </div>
          <button
            type="button"
            hidden={!hydrated}
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? content.resumeAnimation : content.pauseAnimation}
            aria-pressed={paused}
            className="hero-motion-control sr-only focus:not-sr-only focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-brand-purple"
          >
            {paused ? content.resumeAnimation : content.pauseAnimation}
          </button>
          <p id={instructionsId} hidden={!hydrated} className="sr-only">
            {content.rotateHint}
          </p>
        </div>

        <div ref={copyRef} className="hero-copy min-w-0 text-center lg:text-left">
          <p data-reveal data-text-spotlight className="hero-slogan text-spotlight mx-auto mb-7 w-fit text-lg font-medium leading-relaxed tracking-tight sm:text-xl lg:mx-0 xl:text-2xl">
            <span className="hero-slogan-ink spotlight-ink block">{content.badge}</span>
          </p>
          <WaveHeadline text={headline} paused={paused} />
          <p data-reveal data-text-spotlight className="hero-description text-spotlight mx-auto mt-7 max-w-xl text-base leading-relaxed text-neutral-400 lg:mx-0 lg:text-lg">
            <span className="spotlight-ink block">{content.description}</span>
          </p>
          <div data-reveal className="mt-9">
            <a href="#contato" className="group inline-flex min-h-12 items-center justify-center gap-5 rounded-full border border-purple-300/20 bg-gradient-to-r from-brand-purple/20 to-brand-blue/10 px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_30px_-12px_rgba(168,85,247,0.4)] transition hover:border-purple-300/50 hover:bg-brand-purple/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple">
              {content.cta}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-purple-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
