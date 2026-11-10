import { useCallback, useId, useRef, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight, Compass, Flag, Lightbulb, Mountain, ShieldCheck, TrendingUp } from 'lucide-react';
import useAboutStage from '../hooks/useAboutStage';
import { accentBackground, formatCounter, formatPosition, hiddenSide, splitEmphasis, splitHeadline, tileSlot } from '../utils/aboutStage';

// Provisional icons, keyed by principle id. Swap an icon here; the localized
// copy for each principle lives in `about.principles` in src/i18n.js.
const PRINCIPLE_ICONS = {
  'think-first': Lightbulb,
  challenges: Mountain,
  quality: ShieldCheck,
  tomorrow: TrendingUp,
  independence: Compass,
  commitment: Flag,
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function About({ content }) {
  const rootRef = useRef(null);
  const hintId = useId();
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const principles = content.principles.map((principle) => ({ ...principle, icon: PRINCIPLE_ICONS[principle.id] }));
  const count = principles.length;
  const describe = useCallback((index) => `${formatPosition(content.positionLabel, index + 1, count)}: ${content.principles[index].title}`, [content, count]);
  const { active, direction, announcement, paused, select, step, togglePause, onKeyDown } = useAboutStage(rootRef, count, describe);
  const { lead, accent } = splitHeadline(content.headline);

  return (
    <section
      ref={rootRef}
      id="sobre"
      aria-labelledby="about-title"
      className="about-section section-anchor relative isolate"
      data-enhanced={enhanced ? 'true' : undefined}
      data-paused={paused}
      onKeyDown={onKeyDown}
    >
      <div className="about-stage-shell">
        <div className="about-stage-frame">
          <div className="about-stage" role="region" aria-roledescription={content.carouselRole} aria-label={content.carouselLabel} aria-describedby={hintId}>
            <div aria-hidden="true" className="about-ambience">
              <span className="about-glow"><span className="about-glow-light" /></span>
              <span className="about-glow-blue" />
            </div>

            <div className="about-stage-top">
              <p className="about-stage-label"><span aria-hidden="true">// </span>{content.title}</p>
              <p className="about-stage-tagline">{content.tagline}</p>
            </div>

            <div className="about-tiles">
              {principles.map(({ id, title, icon }, index) => {
                const Icon = icon;
                const slot = tileSlot(index, active, count);
                const offstage = slot === '0' || slot === 'hidden';
                return (
                  <button
                    key={id}
                    type="button"
                    className="about-tile"
                    data-slot={slot}
                    data-side={slot === 'hidden' ? hiddenSide(direction) : undefined}
                    aria-label={`${content.selectCard}: ${title}`}
                    aria-hidden={offstage ? 'true' : undefined}
                    tabIndex={offstage ? -1 : undefined}
                    onClick={() => select(index)}
                    style={{ '--float-duration': `${5 + (index % 5) * 0.5}s`, '--float-delay': `${index * -1.3}s` }}
                  >
                    <span className="about-tile-parallax">
                      <span className="about-tile-float">
                        <span className="about-tile-face">
                          <span className="about-tile-core"><Icon aria-hidden="true" strokeWidth={1.75} /></span>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="about-monitor-rig">
              <div className="about-monitor">
                <span aria-hidden="true" className="about-monitor-shadow" />
                <div className="about-monitor-frame">
                  <div className="about-screen" tabIndex={-1}>
                    <div className="about-screen-surface">
                      <div aria-hidden="true" className="about-screen-bar">
                        <span className="about-screen-dots"><span /><span /><span /></span>
                        <span className="about-screen-counter">{formatCounter(active + 1, count)}</span>
                      </div>
                      <div className="about-screen-cards">
                        {principles.map(({ id, title, emphasis, description, icon }, index) => {
                          const Icon = icon;
                          return (
                            <article
                              key={id}
                              className="about-card"
                              data-active={index === active}
                              role="group"
                              aria-roledescription={content.slideRole}
                              aria-label={formatPosition(content.positionLabel, index + 1, count)}
                              aria-hidden={enhanced && index !== active ? 'true' : undefined}
                            >
                              <div className="about-card-head">
                                <span className="about-card-chip"><Icon aria-hidden="true" strokeWidth={1.9} /></span>
                                <span aria-hidden="true" className="about-card-number">{String(index + 1).padStart(2, '0')}</span>
                              </div>
                              <h3 className="about-card-title">
                                {splitEmphasis(title, emphasis).map((part) => part.emphasis
                                  ? <span key="emphasis" className="about-card-emphasis">{part.text}</span>
                                  : part.text)}
                              </h3>
                              <p className="about-card-text">{description}</p>
                            </article>
                          );
                        })}
                      </div>
                      <span aria-hidden="true" className="about-screen-glare" />
                      <span aria-hidden="true" className="about-screen-flash" />
                      <span aria-hidden="true" className="about-screen-scanlines" />
                    </div>
                    <span aria-hidden="true" className="about-screen-power" />
                  </div>
                </div>
                <span aria-hidden="true" className="about-monitor-neck" />
                <span aria-hidden="true" className="about-monitor-base" />
              </div>
            </div>

            <div className="about-nav">
              <button type="button" className="about-nav-button" data-direction="previous" aria-label={content.previousCard} onClick={() => step(-1)}>
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <span aria-hidden="true" className="about-progress">
                <span className="about-progress-fill" style={{ '--progress': (active + 1) / count }} />
              </span>
              <button type="button" className="about-nav-button" data-direction="next" aria-label={content.nextCard} onClick={() => step(1)}>
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <h2 id="about-title" className="about-title">
              <span className="about-title-word" style={{ '--word': 0 }}><span>{lead}</span></span>
              {accent.map((word, index) => (
                <span key={`${index}-${word}`}>
                  {' '}
                  <span className="about-title-word" style={{ '--word': index + 1 }}>
                    <span className="about-title-accent" style={accentBackground(index, accent.length)}>{word}</span>
                  </span>
                </span>
              ))}
            </h2>

            <p id={hintId} className="sr-only">{content.carouselHint}</p>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
            <button type="button" className="about-motion-control sr-only focus:not-sr-only" aria-pressed={paused} onClick={togglePause}>
              {paused ? content.resumeAnimation : content.pauseAnimation}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
