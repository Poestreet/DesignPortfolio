import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { EASE_TUPLE } from "../lib/animations";
import { useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Homepage from "../../imports/Homepage/Homepage";
import { CasesPage } from "../pages/CasesPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { AnimatedBackground } from "./AnimatedBackground";

const SLIDE = {
  duration: 1,
  ease: EASE_TUPLE,
};

// Slide direction: left→right on desktop, bottom→top on mobile
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const SLIDE_NORMAL  = isMobile ? { x: 0, y: "100%" } : { x: "100%", y: 0 };
const SLIDE_REDUCED = { x: 0, y: 0 }; // no movement when reduced motion is preferred

// White flash that fades out as the slide completes — reveals the AnimatedBackground
function PageEntranceFlash() {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background: "#ffffff",
        zIndex: 100,
        pointerEvents: "none",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
    />
  );
}

// ── Page titles — centralised here to avoid AnimatePresence cleanup conflicts ──
const PAGE_TITLES: Record<string, string> = {
  "/":        "Julien Bourcet, Designer",
  "/about":   "About - Julien Bourcet, Designer",
  "/cases":   "Cases - Julien Bourcet, Designer",
  "/contact": "Contact - Julien Bourcet, Designer",
};

type OverlayPage = "cases" | "about" | "contact" | null;

export function Root() {
  const location           = useLocation();
  const prefersReduced     = useReducedMotion();
  const isFirstRender      = useRef(true);
  const [announcement, setAnnouncement] = useState("");

  const isCases   = location.pathname === "/cases";
  const isAbout   = location.pathname === "/about";
  const isContact = location.pathname === "/contact";

  // Slide variants — instant when prefers-reduced-motion
  const slideInitial = prefersReduced ? SLIDE_REDUCED : SLIDE_NORMAL;
  const slideExit    = prefersReduced ? SLIDE_REDUCED : SLIDE_NORMAL;
  const slideDuration = prefersReduced ? 0 : 1;

  // Update title + announce route to screen readers on navigation
  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] ?? "Julien Bourcet, Designer";
    document.title = title;
    // Skip announcement on initial render — screen reader reads <title> on load
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setAnnouncement(title);
    // Move focus to main content landmark for keyboard / AT users
    document.getElementById("main-content")?.focus();
  }, [location.pathname]);

  const [topPage, setTopPage] = useState<OverlayPage>(() =>
    isCases ? "cases" : isAbout ? "about" : isContact ? "contact" : null
  );

  useLayoutEffect(() => {
    if (isCases)        setTopPage("cases");
    else if (isAbout)   setTopPage("about");
    else if (isContact) setTopPage("contact");
    // When returning to "/" keep the last value so the exiting page keeps its z-index.
  }, [isCases, isAbout, isContact]);

  // Cover layer sits above homepage (z=48) but below pages (z=50/51).
  const showCover = isCases || isAbout || isContact;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* Screen reader route announcer (aria-live) — WCAG 4.1.3 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}
      >
        {announcement}
      </div>

      {/* Skip link target — WCAG 2.4.1 */}
      <div id="main-content" tabIndex={-1} style={{ outline: "none" }} />

      {/* Homepage — always underneath */}
      <Homepage />

      {/* Cover layer — fills visual gap during page-to-page transitions */}
      {showCover && (
        <div style={{ position: "fixed", inset: 0, zIndex: 48 }}>
          <AnimatedBackground />
        </div>
      )}

      {/* Cases page */}
      <AnimatePresence>
        {isCases && (
          <motion.div
            key="cases"
            initial={slideInitial}
            animate={{ x: 0, y: 0 }}
            exit={slideExit}
            transition={{ duration: slideDuration, ease: EASE_TUPLE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: topPage === "cases" ? 51 : 50,
            }}
          >
            <PageEntranceFlash />
            <CasesPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About page */}
      <AnimatePresence>
        {isAbout && (
          <motion.div
            key="about"
            initial={slideInitial}
            animate={{ x: 0, y: 0 }}
            exit={slideExit}
            transition={{ duration: slideDuration, ease: EASE_TUPLE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: topPage === "about" ? 51 : 50,
            }}
          >
            <PageEntranceFlash />
            <AboutPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact page */}
      <AnimatePresence>
        {isContact && (
          <motion.div
            key="contact"
            initial={slideInitial}
            animate={{ x: 0, y: 0 }}
            exit={slideExit}
            transition={{ duration: slideDuration, ease: EASE_TUPLE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: topPage === "contact" ? 51 : 50,
            }}
          >
            <PageEntranceFlash />
            <ContactPage />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
