// ── Compatibility shim useNavigate ────────────────────────────────────────────
//
// Remplace `useNavigate` de React Router dans les islands v2.
// Utilise `navigate()` d'Astro View Transitions :
//   - Préserve les animations de slide (::view-transition) même depuis JS
//   - Pas de rechargement complet de la page
//   - Syntaxe identique à React Router → changement minimal dans les composants
//
// Usage dans les islands :
//   import { useNavigate } from "../../lib/navigate";
//   const navigate = useNavigate();
//   navigate("/about");

import { navigate as astroNavigate } from "astro:transitions/client";

export function useNavigate() {
  return (path: string) => astroNavigate(path);
}
