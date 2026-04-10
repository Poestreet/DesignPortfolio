import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import Homepage from "../../imports/Homepage/Homepage";
import { CasesPage } from "../pages/CasesPage";
import { AboutPage } from "../pages/AboutPage";

export function Root() {
  const location = useLocation();
  const isCases = location.pathname === "/cases";
  const isAbout = location.pathname === "/about";

  const overlayKey = isCases ? "cases-overlay" : isAbout ? "about-overlay" : null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Homepage — always underneath */}
      <Homepage />

      {/* Cases page — slides in from the right, layered on top */}
      <AnimatePresence>
        {isCases && (
          <motion.div
            key="cases-overlay"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.05, 1],
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "#fafafa",
            }}
          >
            <CasesPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About page — slides in from the right, layered on top */}
      <AnimatePresence>
        {isAbout && (
          <motion.div
            key="about-overlay"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.05, 1],
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "#fafafa",
            }}
          >
            <AboutPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}