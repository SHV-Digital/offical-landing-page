import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero({ content }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-1/4 h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial={false}
        animate="visible"
        className="relative z-10 max-w-5xl text-center"
      >
        <motion.p
          data-reveal
          variants={itemVariants}
          className="mb-6 inline-block rounded-full border border-neutral-800 bg-neutral-900/60 px-5 py-2 text-sm text-neutral-300 backdrop-blur"
        >
          {content.badge}
        </motion.p>

        <motion.h1
          data-reveal
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight"
        >
          {content.title}
          <span className="block mt-4 text-neutral-400">
            {content.line1}
            <br className="hidden md:block" /> {content.line2}
          </span>
        </motion.h1>

        <motion.p
          data-reveal
          variants={itemVariants}
          className="mt-10 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto"
        >
          {content.description}
        </motion.p>

        <motion.div
          data-reveal
          variants={itemVariants}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="mailto:contato@shvdigital.com.br"
            className="group relative inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-medium text-neutral-950 transition hover:scale-[1.02]"
          >
            {content.cta}
            <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur transition group-hover:opacity-100" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
