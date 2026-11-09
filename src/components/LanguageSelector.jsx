import { useEffect, useRef } from 'react';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { locales } from '../i18n';

export default function LanguageSelector({ locale, label }) {
  const detailsRef = useRef(null);
  const activeLanguage = locales.find(({ code }) => code === locale) || locales[0];

  useEffect(() => {
    const details = detailsRef.current;

    function closeOnOutsideClick(event) {
      if (!details.contains(event.target)) details.open = false;
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape' && details.open) {
        details.open = false;
        details.querySelector('summary').focus();
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      className="language-selector group sm:relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
    >
      <summary
        aria-label={`${label}: ${activeLanguage.label}`}
        className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-neutral-300 transition duration-200 hover:border-brand-cyan/40 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan group-open:border-brand-cyan/40 group-open:bg-brand-cyan/5 group-open:text-white"
      >
        <img src={`/flags/${activeLanguage.flag}.svg`} width="20" height="14" alt="" aria-hidden="true" className="h-3.5 w-5 rounded-sm object-cover ring-1 ring-white/10" />
        <span className="text-xs font-semibold tracking-wider">{activeLanguage.short}</span>
        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 group-open:rotate-180 group-open:text-brand-cyan motion-reduce:transition-none" />
      </summary>

      <nav aria-label={label} className="language-panel absolute right-0 top-full z-10 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-1.5 shadow-[0_18px_60px_-12px_rgba(0,0,0,0.85)] ring-1 ring-brand-cyan/5">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/70 to-transparent" />
        <div className="flex items-center gap-2 border-b border-white/5 px-3 py-3 text-[11px] font-medium tracking-wide text-neutral-500">
          <Globe2 aria-hidden="true" className="h-3.5 w-3.5 text-brand-cyan/70" />
          {label}
        </div>
        <div className="space-y-1 pt-1.5">
          {locales.map((language) => {
            const selected = locale === language.code;
            return (
              <a
                key={language.code}
                href={`/${language.code}/`}
                hrefLang={language.code}
                lang={language.code}
                aria-current={selected ? 'page' : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan ${selected ? 'bg-brand-cyan/[0.08] text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              >
                <img src={`/flags/${language.flag}.svg`} width="24" height="17" alt="" aria-hidden="true" className="h-[17px] w-6 shrink-0 rounded-sm object-cover ring-1 ring-white/10" />
                <span className="flex-1 font-medium">{language.label}</span>
                {selected ? <Check aria-hidden="true" className="h-4 w-4 text-brand-cyan" /> : <span aria-hidden="true" className="text-[10px] tracking-wider text-neutral-600">{language.short}</span>}
              </a>
            );
          })}
        </div>
      </nav>
    </details>
  );
}
