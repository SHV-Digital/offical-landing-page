import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import useActiveSection from '../hooks/useActiveSection';

const anchors = ['sobre', 'diferenciais', 'servicos'];

export default function Header({ content, locale }) {
  const headerRef = useRef(null);
  const active = useActiveSection(headerRef);
  const navigation = content.nav.map((label, index) => (
    <a
      key={anchors[index]}
      href={`#${anchors[index]}`}
      aria-current={active === anchors[index] ? 'location' : undefined}
      className="header-nav-link"
    >
      <span className="header-nav-label">{label}</span>
    </a>
  ));

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-4 z-50 md:top-6">
      <div className="mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-6">
        <div className="header-shell w-full min-w-0 rounded-[1.75rem] px-3 py-3 sm:px-6 lg:rounded-full">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <a href="#inicio" aria-label={content.homeLabel} className="header-logo inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <img src="/logo_square.png" alt="SHV Digital" width="32" height="32" className="h-8 w-8 object-contain" />
            </a>

            <nav aria-label={content.navigationLabel} className="header-nav-desktop hidden items-center gap-1 lg:flex">
              {navigation}
            </nav>

            <div className="relative flex shrink-0 items-center gap-2 sm:gap-4">
              <LanguageSelector locale={locale} label={content.languageLabel} />
              <a href="#contato" aria-current={active === 'contato' ? 'location' : undefined} className="header-contact inline-flex min-h-11 shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold text-white sm:px-5 sm:text-sm">
                <span className="relative z-10">{content.contactLabel}</span>
                <ArrowUpRight aria-hidden="true" className="relative z-10 hidden h-4 w-4 sm:block" />
              </a>
            </div>
          </div>

          <nav aria-label={content.navigationLabel} className="header-nav-mobile mt-2 grid grid-cols-3 gap-1 border-t border-white/[0.06] pt-2 lg:hidden">
            {navigation}
          </nav>
        </div>
      </div>
    </header>
  );
}
