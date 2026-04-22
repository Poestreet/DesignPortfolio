import { motion } from "motion/react";
import { EASE_TUPLE } from "../../lib/animations";

// ── Reveal ─────────────────────────────────────────────────────────────────────
// Staggered entrance wrapper — AboutIsland et ContactIsland.
// exitDelay décale la disparition lors de la transition entre pages.
// La version useInView/index de CasesIsland reste locale à ce composant.

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
