import { translations } from "./i18n";
import { useRef } from "react";
import { MotionConfig } from "framer-motion";
import Intro from "./components/Intro";
import usePageAnimations from "./hooks/usePageAnimations";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Differentials from "./components/Diferentials";
import Services from "./components/Services";
import Contact from "./components/Contact";

export default function App({ locale = 'pt-BR' }) {
  const content = translations[locale];
  const mainRef = useRef(null);
  usePageAnimations(mainRef);
  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <Header content={content} locale={locale} />
      <main ref={mainRef}>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Differentials content={content.differentials} />
        <Services content={content.services} />
        <Contact content={content.contact} locale={locale} />
      </main>
    </MotionConfig>
  );
}
