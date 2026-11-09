import { useRef, useState, useSyncExternalStore } from 'react';
import OrbitCarousel from './OrbitCarousel';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function About({ content }) {
  const copyRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  useTextSpotlight(copyRef);

  return (
    <section id="sobre" data-motion-scope data-animated={hydrated} data-paused={paused} aria-labelledby="about-title" className="about-section relative isolate py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-15%] top-[5%] h-[650px] w-[650px] rounded-full bg-brand-purple/[0.07] blur-[150px]" />
        <div className="absolute bottom-0 left-[-15%] h-[500px] w-[500px] rounded-full bg-brand-blue/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div ref={copyRef} className="about-copy min-w-0">
          <p data-reveal data-text-spotlight className="hero-slogan text-spotlight mb-6 w-fit text-sm font-medium tracking-wide">
            <span className="spotlight-ink block"><span aria-hidden="true">// </span>{content.title}</span>
          </p>
          <WaveHeadline as="h2" id="about-title" text={content.headline} paused={paused} className="hero-headline text-spotlight relative text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl" />
          <div className="mt-8 space-y-6">
            {content.paragraphs.map((paragraph, index) => (
              <p data-reveal data-text-spotlight key={paragraph} style={{ animationDelay: `${index * 0.65}s` }} className={`hero-description text-spotlight leading-relaxed text-neutral-400 ${index === 0 ? 'text-lg' : 'text-base'}`}>
                <span className="spotlight-ink block">{paragraph}</span>
              </p>
            ))}
          </div>
        </div>

        <OrbitCarousel content={content} onPauseChange={setPaused} />
      </div>
    </section>
  );
}
