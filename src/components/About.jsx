import { motion } from "framer-motion";
import { Code2, Compass, Layers3 } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const icons = [Code2, Layers3, Compass];

export default function About({ content }) {
  return (
    <section id="sobre" className="relative py-40">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-16 md:grid-cols-2 items-center"
        >
          {/* LEFT – Cards */}
          <div className="grid gap-6">
            {content.cards.map((card, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20">
                    <Icon className="h-5 w-5 text-brand-cyan" />
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT – Text */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
            >
              {content.title}
            </motion.h2>

            <motion.div variants={itemVariants} className="mt-10 space-y-6">
              {content.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={`text-lg leading-relaxed ${index === 0 ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  {paragraph}
                </p>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
