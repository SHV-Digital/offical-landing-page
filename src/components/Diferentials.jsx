import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldCheck, Sparkles, Layers, Handshake } from "lucide-react";

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
    scale: 0.98,
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

const items = [
  {
    icon: ShieldCheck,
    title: "Engenharia de verdade",
    description:
      "Código sólido, decisões técnicas conscientes e foco em qualidade desde a primeira linha.",
  },
  {
    icon: Layers,
    title: "Arquitetura pensada para crescer",
    description:
      "Soluções desenhadas para evoluir com o negócio, evitando retrabalho e limitações futuras.",
  },
  {
    icon: Sparkles,
    title: "Experiência e acabamento",
    description:
      "Cuidado extremo com UI, UX, performance e detalhes que elevam a percepção do produto.",
  },
  {
    icon: Handshake,
    title: "Parceria real",
    description:
      "Atuamos como extensão do time, com transparência, proximidade e visão de longo prazo.",
  },
];

export default function Differentials() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="diferenciais" className="relative py-32">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan/10 blur-[160px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Diferenciais
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-400">
            Mais do que desenvolver software, entregamos clareza técnica,
            confiabilidade e produtos preparados para o futuro.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`group relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur transition-all
  ${
    activeIndex !== null && activeIndex !== index
      ? "opacity-60 scale-[0.98]"
      : "opacity-100"
  }`}
              >
                <motion.div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20"
                  whileHover={{ rotate: -6, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <Icon className="h-5 w-5 text-brand-cyan" />
                </motion.div>

                <h3 className="text-lg font-semibold tracking-tight leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {item.description}
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
