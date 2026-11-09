import { motion } from "framer-motion";
import { locales } from "../i18n";

const anchors = ['#sobre', '#servicos', '#diferenciais'];

export default function Header({ content, locale }) {
  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 md:top-6 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-full border border-neutral-800 bg-neutral-900/90 px-4 sm:px-6 py-3 backdrop-blur">
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

          <div className="flex items-center gap-2 sm:gap-4">
            <nav aria-label={content.languageLabel} className="flex items-center gap-1">
              {locales.map((language) => (
                <a
                  key={language.code}
                  href={`/${language.code}/`}
                  hrefLang={language.code}
                  lang={language.code}
                  aria-label={language.label}
                  title={language.label}
                  aria-current={locale === language.code ? 'page' : undefined}
                  className={`inline-flex min-h-11 min-w-11 flex-col sm:flex-row items-center justify-center gap-1 rounded-full px-2 text-[10px] sm:text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan ${locale === language.code ? 'bg-white/10 text-white ring-1 ring-brand-cyan/60' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <img src={`/flags/${language.flag}.svg`} width="20" height="14" alt="" aria-hidden="true" className="h-3.5 w-5 rounded-sm object-cover" />
                  <span>{language.short}</span>
                </a>
              ))}
            </nav>
            <motion.a
              href="#contato"
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-3 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white"
            >
              {content.contactLabel}
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
