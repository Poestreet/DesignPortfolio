import { motion } from "motion/react";
import { EASE_TUPLE } from "../lib/animations";

// ── Reveal ────────────────────────────────────────────────────────────────────
//
// Staggered entrance / exit wrapper used by AboutPage and ContactPage.
// Animates opacity + y-translate driven by the `show` boolean.
// exitDelay staggers the disappearance when the page slides out.
//
// NB: the CasesPage uses a different Reveal variant (inView + index stagger,
// no exit animation) — that one stays local to CasesPage.tsx.

export function Reveal({
  children,
  delay = 0,
  exitDelay = 0,
  show,
}: {
  children: React.ReactNode;
  delay?: number;
  exitDelay?: number;
  show: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 18 }}
      exit={{
        opacity: 0,
        y: 18,
        transition: { duration: 0.35, delay: exitDelay, ease: EASE_TUPLE },
      }}
      transition={{ duration: 0.7, delay, ease: EASE_TUPLE }}
    >
      {children}
    </motion.div>
  );
}
