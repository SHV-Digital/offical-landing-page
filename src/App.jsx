import { useState } from "react";
import Intro from "./components/Intro";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Differentials from "./components/Diferentials";
import Services from "./components/Services";
import Contact from "./components/Contact";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}

      {!showIntro && (
        <>
          <Header />
          <Hero />
          <About />
          <Differentials />
          <Services />
          <Contact />
        </>
      )}
    </>
  );
}