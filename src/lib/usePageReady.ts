import { useState, useEffect } from "react";

/**
 * Retourne `true` une fois le contenu de la nouvelle page prêt à être affiché.
 *
 * ── Problème de timing ──────────────────────────────────────────────────────
 * Deux chemins d'entrée sur une page :
 *
 * 1. Chargement direct (URL) :
 *    `astro:page-load` peut se déclencher AVANT que le `useEffect` du composant
 *    React ait eu le temps de s'enregistrer. Solution : flag `_isReady` au niveau
 *    module, lu au moment du mount.
 *
 * 2. Navigation programmatique via `astroNavigate()` (boutons JS) :
 *    `astro:page-load` peut être manqué si le useEffect s'enregistre trop tard.
 *    Solution : écouter aussi `astro:after-swap` qui se déclenche dès que le
 *    nouveau DOM est en place, avant la fin de l'animation de transition.
 *
 * ── Séquence des événements Astro View Transitions ──────────────────────────
 * astro:before-preparation → astro:after-preparation →
 * astro:before-swap → astro:after-swap → astro:page-load
 *
 * ── Cas couverts ────────────────────────────────────────────────────────────
 * - Chargement direct  : page-load déjà passé → _isReady = true → ready immédiat
 * - Navigation JS      : after-swap ou page-load capturé par le listener
 */

let _isReady = false;

if (typeof document !== "undefined") {
  document.addEventListener("astro:before-preparation", () => {
    _isReady = false;
  });
  document.addEventListener("astro:page-load", () => {
    _isReady = true;
  });
}

export function usePageReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Chargement direct : événement déjà passé avant le mount
    if (_isReady) {
      setReady(true);
      return;
    }

    // Navigation : écouter les deux événements — le premier qui arrive gagne
    const trigger = () => setReady(true);
    document.addEventListener("astro:page-load", trigger);
    document.addEventListener("astro:after-swap", trigger);

    return () => {
      document.removeEventListener("astro:page-load", trigger);
      document.removeEventListener("astro:after-swap", trigger);
    };
  }, []);

  return ready;
}
