import { useState, useEffect } from "react";

/**
 * Retourne `true` dès que le composant est monté côté client.
 *
 * ── Approche ────────────────────────────────────────────────────────────────
 * On abandonne la synchronisation avec astro:page-load / astro:after-swap,
 * dont le timing est imprévisible selon le chemin de navigation (URL directe
 * vs astroNavigate() depuis un bouton JS).
 *
 * requestAnimationFrame garantit que le flag passe à true après le premier
 * paint — soit immédiatement sur chargement direct, soit dès que le DOM de
 * la nouvelle page est en place lors d'une View Transition.
 *
 * L'animation d'entrée (opacity 0 → 1, y 18 → 0) est portée par le composant
 * Reveal (Framer Motion, durée 0.7s) — elle se superpose naturellement à la
 * fin du slide de page.
 *
 * Garantit aussi que le SSR et le client démarrent toujours à false,
 * évitant les hydration mismatches React (#418 / #423).
 */
export function usePageReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return ready;
}
