import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import Homepage from "../../imports/Homepage/Homepage";
import { CasesPage } from "../pages/CasesPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { AnimatedBackground } from "./AnimatedBackground";

const SLIDE = {
  duration: 1,
  ease: [0.4, 0, 0.05, 1] as [number, number, number, number],
};

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

type OverlayPage = "cases" | "about" | "contact" | null;

export function Root() {
  const location = useLocation();
  const isCases   = location.pathname === "/cases";
  const isAbout   = location.pathname === "/about";
  const isContact = location.pathname === "/contact";

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
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={SLIDE}
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
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={SLIDE}
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
