import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logo.svg";

export default function Intro({ onFinish }) {
  return (
    <AnimatePresence>
      <motion.section
        className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={() => {
            setTimeout(onFinish, 1200);
          }}
          className="relative"
        >
          <motion.img
            src={Logo}
            alt="SHV Digital"
            className="w-[360px] md:w-[560px]"
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 0.6, -0.6, 0],
            }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue/30 via-brand-cyan/20 to-brand-purple/30 blur-[180px]"
            animate={{
              scale: [0.9, 1.05, 0.9],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}