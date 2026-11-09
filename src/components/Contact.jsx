import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

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
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Contact({ content, locale }) {
  return (
    <section id="contato" className="relative py-40">
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
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
          >
            {content.title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-relaxed text-neutral-400"
          >
            {content.description}
          </motion.p>

          <motion.form
            variants={itemVariants}
            action="https://formspree.io/f/xrebnwwa"
            method="POST"
            className="mt-16 mx-auto max-w-xl space-y-6"
          >
            <input type="hidden" name="language" value={locale} />
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                name="email"
                required
                placeholder={content.email}
                aria-label={content.email}
                autoComplete="email"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-3 pl-12 pr-4 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-brand-cyan"
              />
            </div>

            <textarea
              name="message"
              required
              rows={4}
              placeholder={content.message}
              aria-label={content.message}
              className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-brand-cyan"
            />

            <motion.button
              type="submit"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-8 py-3 text-sm font-semibold tracking-tight text-white"
            >
              <Send className="h-4 w-4" />
              {content.submit}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
