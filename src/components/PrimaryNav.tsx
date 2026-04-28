/**
 * PrimaryNav — navigation primaire partagée entre toutes les pages desktop.
 *
 * Utilisé par : AboutIsland, ContactIsland, CasesIsland.
 * L'HomepageIsland a une entrée différente (dark blue, motion.nav animé en bloc)
 * et conserve son implémentation inline.
 *
 * Props :
 *   links   — tableau { label, path } dans l'ordre d'affichage (haut → bas)
 *   visible — booléen qui déclenche l'entrée / sortie des boutons
 *   color   — couleur du trait et du texte (défaut : #fafafa pour fonds sombres)
 *   zIndex  — z-index du <nav> (défaut : 20)
 */

import { useNavigate } from "../lib/navigate";
import { motion }      from "motion/react";
import { EASE_TUPLE }  from "../lib/animations";

export interface PrimaryNavLink {
  label: string;
  path:  string;
}

interface PrimaryNavProps {
  links:   PrimaryNavLink[];
  visible: boolean;
  color?:  string;
  zIndex?: number;
}

export function PrimaryNav({
  links,
  visible,
  color  = "#fafafa",
  zIndex = 20,
}: PrimaryNavProps) {
  const navigate = useNavigate();

  return (
    <nav
      className="absolute flex flex-col items-end"
      style={{ top: "16px", right: "16px", gap: "16px", zIndex }}
    >
      {links.map(({ label, path }, i, arr) => (
        <motion.button
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
          exit={{
            opacity: 0,
            y: 8,
            transition: { duration: 0.35, delay: i * 0.08, ease: EASE_TUPLE },
          }}
          transition={{
            duration: 0.6,
            delay: (arr.length - 1 - i) * 0.12,
            ease: EASE_TUPLE,
          }}
          onClick={() => navigate(path)}
          className="group flex items-center gap-2"
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
        >
          <span
            className="block transition-all duration-300 w-8 group-hover:w-12 shrink-0"
            style={{ height: 0, borderTop: `1px solid ${color}` }}
          />
          <span
            style={{
              fontFamily:      "'Outfit', sans-serif",
              fontWeight:      400,
              fontSize:        "11px",
              lineHeight:      "16.5px",
              letterSpacing:   "0.2em",
              textTransform:   "uppercase",
              color,
            }}
          >
            {label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}
