import { useState, useEffect } from "react";

/**
 * Retourne `true` une fois la View Transition Astro terminée.
 *
 * - Premier chargement  → `astro:page-load` se déclenche immédiatement
 *   après DOMContentLoaded : le contenu apparaît sans délai visible.
 * - Navigation inter-pages → `astro:page-load` se déclenche après la fin
 *   de l'animation CSS slide (700ms). Le contenu apparaît proprement
 *   APRÈS le slide, sans chevaucher la transition.
 *
 * Usage :
 *   const ready = usePageReady();
 *   // animate={{ opacity: ready ? 1 : 0 }}
 */
export function usePageReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = () => setReady(true);
    document.addEventListener("astro:page-load", handle);
    return () => document.removeEventListener("astro:page-load", handle);
  }, []);

  return ready;
}
