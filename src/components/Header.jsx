import { motion } from "framer-motion";
import TextLogo from "../assets/logo_text.png";
import LogoSquare from "../assets/logo_square.png"

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid w-full grid-cols-3 items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-6 py-3 backdrop-blur">
          {/* Logo / Nome */}
          <div className="justify-self-start">
            <img src={LogoSquare} alt="SHV Digital" className="h-8 w-auto"/>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center justify-self-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-neutral-400 transition hover:text-neutral-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="justify-self-end">
            <motion.a
              href="mailto:contato@shvdigital.com.br"
              whileHover={{
                y: -1,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 22,
              }}
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan px-6 py-2 text-sm font-semibold tracking-tight text-white"
            >
              Contato
              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/20 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}