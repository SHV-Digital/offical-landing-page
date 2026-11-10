import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Code2, Mail, MessageSquare, Route, UserRound } from 'lucide-react';
import WaveHeadline from './WaveHeadline';
import useTextSpotlight from '../hooks/useTextSpotlight';
import useContactMotion from '../hooks/useContactMotion';
import useContactFlow from '../hooks/useContactFlow';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const stepIcons = [MessageSquare, Route, Code2];

export default function Contact({ content, locale }) {
  const sectionRef = useRef(null);
  const id = useId().replace(/:/g, '');
  const [selectedStep, setSelectedStep] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [focusedStep, setFocusedStep] = useState(null);
  const [formFocused, setFormFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  useTextSpotlight(sectionRef);
  useContactMotion(sectionRef);
  useContactFlow(sectionRef);
  const activeStep = formFocused ? 0 : focusedStep ?? hoveredStep ?? selectedStep;
  const validateEmail = (event) => event.target.setCustomValidity(event.target.validity.valueMissing ? content.requiredEmail : content.invalidEmail);

  return (
    <section ref={sectionRef} id="contato" data-motion-scope data-animated={enhanced} data-paused={paused} aria-labelledby="contact-title" className="contact-section section-anchor relative isolate">
      <div className="contact-ambience" aria-hidden="true"><span /><span /></div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="contact-layout">
          <svg className="contact-flow-bridge" aria-hidden="true" preserveAspectRatio="none"><path className="contact-flow-track" /><path className="contact-flow-packet" pathLength="1" /></svg>
          <div className="contact-intro min-w-0">
            <div className="contact-reveal contact-copy">
              <p data-text-spotlight className="hero-slogan text-spotlight mb-6 w-fit text-sm font-medium tracking-wide"><span className="spotlight-ink block"><span aria-hidden="true">// </span>{content.eyebrow}</span></p>
              <WaveHeadline as="h2" id="contact-title" text={content.headline} paused={paused} className="hero-headline text-spotlight relative text-4xl font-semibold leading-[1.12] tracking-tight md:text-5xl" />
              <p data-text-spotlight className="contact-intro-description about-body about-supporting text-spotlight mt-7"><span className="spotlight-ink block">{content.description}</span></p>
            </div>
            <div className="contact-journey">
              <h3 className="contact-journey-title">{content.processTitle}</h3>
              <ol className="contact-steps">
                {content.steps.map((step, index) => {
                  const Icon = stepIcons[index];
                  return (
                    <li key={step.title} className="contact-step" style={{ '--step-order': index }} data-active={activeStep === index} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredStep(index); }} onPointerLeave={() => setHoveredStep(null)}>
                      {index < content.steps.length - 1 && <span className="contact-step-rail" aria-hidden="true"><span className="contact-step-intro-light" /><span className="contact-step-light" /></span>}
                      <div className="contact-step-entry">
                        <h4><button type="button" className="contact-step-button" disabled={!enhanced} aria-pressed={selectedStep === index} aria-describedby={`${id}-step-${index}`} onFocus={() => setFocusedStep(index)} onBlur={() => setFocusedStep(null)} onClick={() => setSelectedStep((current) => current === index ? null : index)}><span className="contact-step-icon" aria-hidden="true"><span className="contact-step-signal" /><Icon size={19} /></span><span>{step.title}</span></button></h4>
                        <p id={`${id}-step-${index}`} data-text-spotlight className="text-spotlight"><span className="spotlight-ink block">{step.description}</span></p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <form className="contact-reveal contact-form" action="https://formspree.io/f/xrebnwwa" method="POST" aria-labelledby={`${id}-form-title`} onFocus={() => setFormFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFormFocused(false); }}>
            <input type="hidden" name="language" value={locale} />
            <h3 id={`${id}-form-title`}>{content.title}</h3>
            <p className="contact-form-description">{content.formDescription}</p>
            <div className="contact-field">
              <label htmlFor={`${id}-name`}>{content.name}</label>
              <div className="contact-input-wrap"><UserRound size={18} aria-hidden="true" /><input id={`${id}-name`} type="text" name="name" required placeholder={content.namePlaceholder} autoComplete="name" onInvalid={(event) => event.target.setCustomValidity(content.requiredName)} onInput={(event) => event.target.setCustomValidity('')} /></div>
            </div>
            <div className="contact-field">
              <label htmlFor={`${id}-email`}>{content.email}</label>
              <div className="contact-input-wrap"><Mail size={18} aria-hidden="true" /><input id={`${id}-email`} type="email" name="email" required placeholder={content.emailPlaceholder} autoComplete="email" onInvalid={validateEmail} onInput={(event) => event.target.setCustomValidity('')} /></div>
            </div>
            <div className="contact-field">
              <label htmlFor={`${id}-message`}>{content.message}</label>
              <textarea id={`${id}-message`} name="message" required rows={5} placeholder={content.messagePlaceholder} onInvalid={(event) => event.target.setCustomValidity(content.requiredMessage)} onInput={(event) => event.target.setCustomValidity('')} />
            </div>
            <button type="submit" className="contact-submit"><span className="contact-submit-charge" aria-hidden="true" /><span className="contact-submit-sweep" aria-hidden="true" /><span className="contact-submit-label">{content.submit}</span><ArrowUpRight size={19} aria-hidden="true" /></button>
            <p className="contact-form-note">{content.note}</p>
          </form>
        </div>
        <button type="button" hidden={!enhanced} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="contact-motion-control sr-only focus:not-sr-only focus:mt-6 focus:rounded-full focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-xs focus:text-white focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-brand-purple">{paused ? content.resumeAnimation : content.pauseAnimation}</button>
      </div>
    </section>
  );
}
