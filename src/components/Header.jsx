import { motion } from "framer-motion";
import LanguageSelector from "./LanguageSelector";

const anchors = ['#sobre', '#servicos', '#diferenciais'];

export default function Header({ content, locale }) {
  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 md:top-6 inset-x-0 z-50"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-6">
        <div className="flex w-full min-w-0 items-center justify-between gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 sm:px-6 py-3 backdrop-blur">
          <a href={`/${locale}/`} aria-label={content.homeLabel} className="shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan">
            <img src="/logo_square.png" alt="SHV Digital" width="32" height="32" className="h-8 w-8 object-contain" />
          </a>

          <nav aria-label={content.nav.join(', ')} className="hidden lg:flex items-center gap-6">
            {content.nav.map((label, index) => (
              <a key={anchors[index]} href={anchors[index]} className="text-sm text-neutral-400 transition hover:text-neutral-100">
                {label}
              </a>
            ))}
          </nav>

          <div className="relative flex shrink-0 items-center gap-2 sm:gap-4">
            <LanguageSelector locale={locale} label={content.languageLabel} />
            <motion.a
              href="#contato"
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-3 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white"
            >
              {content.contactLabel}
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
