import { useId, useRef } from 'react';
import { ChevronLeft, ChevronRight, Code2, Compass, Layers3 } from 'lucide-react';
import useOrbitCarousel from '../hooks/useOrbitCarousel';
import useOrbitEntrance from '../hooks/useOrbitEntrance';

const icons = [Code2, Layers3, Compass];

export default function OrbitCarousel({ content, onPauseChange }) {
  const rootRef = useRef(null);
  const hintId = useId();
  const { active, paused, apiRef } = useOrbitCarousel(rootRef, content.cards.length, onPauseChange);
  useOrbitEntrance(rootRef);

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      apiRef.current?.step(event.key === 'ArrowLeft' ? -1 : 1, true);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      apiRef.current?.select(event.key === 'Home' ? 0 : content.cards.length - 1, true);
    }
  };

  return (
    <div ref={rootRef} data-orbit-entrance="assemble" role="region" aria-roledescription={content.carouselRole} aria-label={content.carouselLabel} aria-describedby={hintId} className="about-orbit min-w-0" onKeyDown={onKeyDown}>
      <p id={hintId} className="sr-only">{content.carouselHint}</p>
      <div className="about-orbit-stage">
        <div aria-hidden="true" className="about-orbit-scenery pointer-events-none absolute inset-0 overflow-hidden">
          <div className="about-orbit-halo" />
        </div>
        {content.cards.map((card, index) => {
          const Icon = icons[index];
          return (
            <article key={card.title} className="about-orbit-card" data-front={index === active} style={{ '--orbit-ring-delay': `${index * -2}s` }}>
              <div aria-hidden="true" className="about-orbit-card-light" />
              <span aria-hidden="true" className="about-orbit-number">0{index + 1}</span>
              <div className="about-orbit-icon"><Icon aria-hidden="true" className="h-5 w-5" /></div>
              <h3 className="mt-5 break-words text-base font-semibold leading-tight tracking-tight md:text-lg">{card.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400 md:text-[13px]">{card.description}</p>
              <button
                type="button"
                data-orbit-select={index}
                aria-label={`${content.selectCard}: ${card.title}`}
                className="about-orbit-select absolute inset-0 rounded-[inherit]"
                onClick={() => apiRef.current?.select(index)}
                onFocus={() => apiRef.current?.select(index)}
              />
            </article>
          );
        })}
      </div>
      <div className="about-orbit-controls mt-3 items-center justify-center gap-5">
        <button type="button" className="about-orbit-arrow" data-direction="previous" aria-label={content.previousCard} onClick={() => apiRef.current?.step(-1)}><ChevronLeft aria-hidden="true" className="h-4 w-4" /></button>
        <div className="flex items-center gap-2">
          {content.cards.map((card, index) => (
            <button key={card.title} type="button" aria-label={`${content.selectCard}: ${card.title}`} aria-pressed={active === index} className="about-orbit-dot" onClick={() => apiRef.current?.select(index)}><span /></button>
          ))}
        </div>
        <button type="button" className="about-orbit-arrow" data-direction="next" aria-label={content.nextCard} onClick={() => apiRef.current?.step(1)}><ChevronRight aria-hidden="true" className="h-4 w-4" /></button>
        <button type="button" className="about-orbit-pause sr-only focus:not-sr-only" aria-pressed={paused} onClick={() => apiRef.current?.togglePause()}>{paused ? content.resumeRotation : content.pauseRotation}</button>
      </div>
    </div>
  );
}
