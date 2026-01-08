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

const aboutCards = [
  {
    icon: Code2,
    title: "Engenharia responsável",
    description:
      "Decisões técnicas bem fundamentadas, código limpo e foco em manutenibilidade.",
  },
  {
    icon: Layers3,
    title: "Soluções bem estruturadas",
    description:
      "Arquitetura clara, modular e preparada para evolução contínua.",
  },
  {
    icon: Compass,
    title: "Direção técnica",
    description:
      "Ajudamos a tomar decisões certas no momento certo, reduzindo riscos.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="relative py-40">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-16 md:grid-cols-2 items-center"
        >
          {/* LEFT – Cards */}
          <div className="grid gap-6">
            {aboutCards.map((card, index) => {
              const Icon = card.icon;
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
              Sobre
            </motion.h2>

            <motion.div variants={itemVariants} className="mt-10 space-y-6">
              <p className="text-lg leading-relaxed text-neutral-300">
                A SHV Digital nasceu com um propósito claro: construir software com
                profundidade técnica, clareza de decisões e foco real em impacto de
                longo prazo.
              </p>

              <p className="text-lg leading-relaxed text-neutral-400">
                Atuamos ao lado de empresas que levam tecnologia a sério — desde a
                definição da arquitetura até o acabamento final do produto. Nosso
                trabalho vai além da entrega de código: envolve entendimento de
                contexto, visão estratégica e responsabilidade técnica.
              </p>

              <p className="text-lg leading-relaxed text-neutral-400">
                Cada decisão é pensada para sustentar crescimento, reduzir
                complexidade desnecessária e criar bases sólidas para produtos que
                precisam evoluir com segurança.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
