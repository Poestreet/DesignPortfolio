import { useEffect } from "react";

const BASE = "Julien Bourcet, Designer";

/**
 * Updates document.title for SEO and accessibility (screen readers announce
 * the new title on route change in a SPA).
 *
 * Usage:
 *   usePageTitle()            → "Julien Bourcet, Designer"
 *   usePageTitle("About")     → "About - Julien Bourcet, Designer"
 *   usePageTitle("Cases")     → "Cases - Julien Bourcet, Designer"
 *   usePageTitle("Contact")   → "Contact - Julien Bourcet, Designer"
 */
export function usePageTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} - ${BASE}` : BASE;
    // Restore default when leaving the route
    return () => {
      document.title = BASE;
    };
  }, [page]);
}
