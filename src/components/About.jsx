import { motion } from 'framer-motion';
import { Code2, Compass, Layers3 } from 'lucide-react';

const icons = [Code2, Layers3, Compass];

export default function About({ content }) {
  return (
    <section id="sobre" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-200px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-brand-purple/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div aria-hidden="true" className="mb-16 h-px bg-gradient-to-r from-brand-purple/40 via-white/10 to-transparent" />
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div data-reveal className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-purple-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-purple shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              {content.title}
            </div>
            <h2 data-reveal id="about-title" className="max-w-lg text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
              {content.headline}
            </h2>
            <div className="mt-8 space-y-6">
              {content.paragraphs.map((paragraph, index) => (
                <p data-reveal key={paragraph} className={`leading-relaxed ${index === 0 ? 'text-lg text-neutral-300' : 'text-base text-neutral-400'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:pt-3">
            {content.cards.map((card, index) => {
              const Icon = icons[index];
              return (
                <motion.article
                  data-reveal
                  key={card.title}
                  whileHover={{ y: -4 }}
                  className="about-card group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 transition-colors duration-300 hover:border-brand-purple/35 md:p-7"
                >
                  <div aria-hidden="true" className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-brand-purple/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-purple/15 bg-brand-purple/[0.08] text-purple-300">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="pr-7 text-lg font-medium tracking-tight">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{card.description}</p>
                    </div>
                    <span aria-hidden="true" className="absolute right-6 top-7 font-mono text-[10px] tracking-wider text-neutral-600">0{index + 1}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
