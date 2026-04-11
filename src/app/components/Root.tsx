import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import Homepage from "../../imports/Homepage/Homepage";
import { CasesPage } from "../pages/CasesPage";
import { AboutPage } from "../pages/AboutPage";
import { AnimatedBackground } from "./AnimatedBackground";

const SLIDE = {
  duration: 1,
  ease: [0.4, 0, 0.05, 1] as [number, number, number, number],
};

export function Root() {
  const location = useLocation();
  const isCases = location.pathname === "/cases";
  const isAbout = location.pathname === "/about";

  // Track which overlay page is currently on top (most recently navigated to).
  // useLayoutEffect updates it synchronously before paint — no visual flicker.
  const [topPage, setTopPage] = useState<"cases" | "about" | null>(() =>
    isCases ? "cases" : isAbout ? "about" : null
  );

  useLayoutEffect(() => {
    if (isCases) setTopPage("cases");
    else if (isAbout) setTopPage("about");
    // When returning to "/", keep the last value so the exiting page keeps its z-index.
  }, [isCases, isAbout]);

  // The cover layer sits above the homepage (z=48) but below the pages (z=50/51).
  // It is shown as long as ANY overlay is active and prevents the homepage from
  // showing through the gap between two pages during a page-to-page slide.
  // When returning to homepage it disappears instantly, letting the page reveal
  // the homepage naturally as it slides away — which is the intended behaviour.
  const showCover = isCases || isAbout;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* Homepage — always underneath */}
      <Homepage />

      {/* Cover layer — same AnimatedBackground as overlay pages, fills any
          visual gap during Cases ↔ About transitions */}
      {showCover && (
        <div style={{ position: "fixed", inset: 0, zIndex: 48 }}>
          <AnimatedBackground />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
        </div>
      )}

      {/* Cases page */}
      <AnimatePresence>
        {isCases && (
          <motion.div
            key="cases"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={SLIDE}
            style={{
              position: "fixed",
              inset: 0,
              // Entering page is always on top; exiting page slides out behind it.
              zIndex: topPage === "cases" ? 51 : 50,
            }}
          >
            <CasesPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About page */}
      <AnimatePresence>
        {isAbout && (
          <motion.div
            key="about"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={SLIDE}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: topPage === "about" ? 51 : 50,
            }}
          >
            <AboutPage />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
