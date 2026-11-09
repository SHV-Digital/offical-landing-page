import { motion } from "framer-motion";
import { Code, Layers, Cpu, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const icons = [Code, Layers, Cpu, Sparkles];

export default function Services({ content }) {
  return (
    <section id="servicos" className="relative py-40">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/10 blur-[160px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mb-20 mx-auto max-w-3xl text-center"
        >
          <motion.h2
            variants={cardVariants}
            className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
          >
            {content.title}
          </motion.h2>

          <motion.p
            variants={cardVariants}
            className="mt-6 text-lg leading-relaxed text-neutral-400"
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.cards.map((service, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20">
                  <Icon className="h-5 w-5 text-brand-cyan" />
                </div>

                <h3 className="text-lg font-semibold tracking-tight leading-snug">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {service.description}
                </p>

                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-brand-cyan/20 transition group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
