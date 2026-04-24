import { useState, useEffect } from "react";

/**
 * Retourne `true` une fois la View Transition Astro terminée.
 *
 * ── Problème de timing ──────────────────────────────────────────────────────
 * Sur le premier chargement, `astro:page-load` peut se déclencher AVANT que
 * le `useEffect` du composant React ait eu le temps de s'enregistrer (les
 * islands `client:load` hydratent de façon asynchrone après DOMContentLoaded).
 * Un simple addEventListener dans useEffect rate l'événement → ready = false
 * pour toujours → contenu invisible.
 *
 * ── Solution ────────────────────────────────────────────────────────────────
 * Listener enregistré au niveau du module (avant tout mount React) :
 * - `astro:before-preparation` remet _isReady à false avant chaque navigation
 * - `astro:page-load` le repasse à true (premier chargement ET fin de slide)
 * - `useState(() => _isReady)` lit l'état courant au moment de l'hydratation
 *
 * Cas couverts :
 * - Premier chargement : l'événement est déjà passé → ready = true immédiat
 * - Navigation inter-pages : _isReady est false au mount → useEffect attend
 *   la fin de l'animation (700ms) → ready = true → contenu entre proprement
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
  // Toujours false au SSR — garantit que l'hydratation React correspond au HTML serveur.
  // useEffect (client-only) corrige immédiatement si l'événement est déjà passé.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Déjà prêt (premier chargement, événement reçu avant le mount)
    if (_isReady) {
      setReady(true);
      return;
    }
    // Navigation : attendre la fin de la View Transition
    const handle = () => setReady(true);
    document.addEventListener("astro:page-load", handle);
    return () => document.removeEventListener("astro:page-load", handle);
  }, []);

  return ready;
}
