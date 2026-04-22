import { useNavigate } from "../../lib/navigate";
import { useState, useEffect, useRef } from "react";
;
import { motion } from "motion/react";
import { AnimatedBackground } from "./AnimatedBackground";
import { MobileAboutPage } from "../mobile/MobileAboutPage";
import { Reveal } from "./Reveal";
import {
  Phase,
  EASE_TUPLE,
  TICK_MS,
  PHOTO_FADE_DURATION,
  TEXT_REVEAL_DELAY,
  TYPING_START_DELAY,
} from "../../lib/animations";
import photo from "figma:asset/4b4a98ebdf8ee3d638fcd41fb40af9b5b6aa4999.png";

// ── Binary entrance ───────────────────────────────────────────────────────────
const BINARY =
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const BINARY_FILL = Array.from(
  { length: Math.ceil(1200 / BINARY.length) },
  () => BINARY
).join("").slice(0, 1200);

const CHARS_PER_TICK = 4; // wide column ~110 chars/line → 440ms/line = 28 frames, clearly left→right

// One-shot flag — persists across remounts within the same session
let aboutAnimPlayed = false;

// ── Tag pill (from Figma) ─────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "rgba(250,250,250,0.2)",
        border: "1px solid #fafafa",
        borderRadius: "999px",
        padding: "6px 12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
          fontSize: "12px",
          color: "#fafafa",
          whiteSpace: "nowrap",
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function AboutPage() {
  const navigate = useNavigate();

  const [phase,     setPhase]     = useState<Phase>(() => aboutAnimPlayed ? "done" : "idle");
  const [displayed, setDisplayed] = useState<number>(() => aboutAnimPlayed ? BINARY_FILL.length : 0);
  const [showText,  setShowText]  = useState<boolean>(() => aboutAnimPlayed);
  const [showNav,   setShowNav]   = useState<boolean>(() => aboutAnimPlayed);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Entrance sequence — plays once per session ────────────────────────────────
  useEffect(() => {
    if (aboutAnimPlayed) return;

    // Skip animation if user prefers reduced motion (WCAG 2.3.3 / prefers-reduced-motion)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aboutAnimPlayed = true;
      setPhase("done");
      setDisplayed(BINARY_FILL.length);
      setShowText(true);
      setShowNav(true);
      return;
    }

    const startTimer = setTimeout(() => {
      setPhase("typing");
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) => {
          const next = Math.min(prev + CHARS_PER_TICK, BINARY_FILL.length);
          if (next >= BINARY_FILL.length) {
            clearInterval(intervalRef.current!);
            setTimeout(() => setPhase("revealing"), 200);
            setTimeout(() => setPhase("done"),      200 + PHOTO_FADE_DURATION);
            setTimeout(() => {
              aboutAnimPlayed = true;
              setShowText(true);
              setShowNav(true);
            }, 200 + PHOTO_FADE_DURATION + TEXT_REVEAL_DELAY);
          }
          return next;
        });
      }, TICK_MS);
    }, TYPING_START_DELAY);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalRef.current!);
    };
  }, []);

  const binaryOpacity = phase === "revealing" || phase === "done" ? 0 : 1;
  const photoOpacity  = phase === "revealing" || phase === "done" ? 1 : 0;

  return (
    <>
      {/* ── Mobile (below md) ── */}
      <div className="md:hidden w-full h-full">
        <MobileAboutPage />
      </div>

      {/* ── Desktop (md and above) ── */}
      <div className="hidden md:block w-full h-full">
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Nav — DOM-first for correct keyboard tab order (WCAG 2.4.3) ── */}
      <nav
        className="absolute flex flex-col items-end z-20"
        style={{ top: "16px", right: "16px", gap: "16px" }}
      >
        {[
          { label: "Cases",    action: () => navigate("/cases") },
          { label: "Contact",  action: () => navigate("/contact") },
          { label: "Homepage", action: () => navigate("/") },
        ].map(({ label, action }, i, arr) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 8 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.35, delay: i * 0.08, ease: EASE_TUPLE } }}
            transition={{ duration: 0.6, delay: (arr.length - 1 - i) * 0.12, ease: EASE_TUPLE }}
            onClick={action}
            className="flex items-center gap-2 group"
            style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
          >
            <span
              className="block w-8 h-px transition-all duration-300 group-hover:w-12"
              style={{ background: "#fafafa" }}
            />
            <span
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "#fafafa",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
              }}
            >
              {label}
            </span>
          </motion.button>
        ))}
      </nav>

      {/* ── Animated background (full bleed) ── */}
      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>

      {/* ── Flex row layout ── */}
      <div className="absolute inset-0 flex">

        {/* ── Left column — photo / binary ── */}
        <div className="relative flex-1 min-w-0">

          {/* Binary typewriter — decorative, hidden from AT */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            aria-hidden="true"
            animate={{ opacity: binaryOpacity }}
            transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
            style={{ pointerEvents: "none" }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                lineHeight: "1.5",
                letterSpacing: "0.05em",
                color: "rgba(250,250,250,0.55)",
                wordBreak: "break-all",
                padding: "20px",
                margin: 0,
              }}
            >
              {BINARY_FILL.slice(0, displayed)}
              {phase === "typing" && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ display: "inline-block", width: "1ch" }}
                >
                  _
                </motion.span>
              )}
            </p>
          </motion.div>

          {/* Photo */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: photoOpacity }}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.2, ease: "easeIn" } }}
            transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
          >
            <img
              src={photo}
              alt="Julien Bourcet"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            {/* Right-edge fade into content */}
            <div
              className="absolute inset-y-0 right-0 w-32"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.3))" }}
            />
          </motion.div>
        </div>

        {/* ── Right column — scrollable content, top-anchored ── */}
        <div
          className="relative flex-1 min-w-0 flex flex-col items-center overflow-y-auto"
          style={{ paddingTop: "131px", paddingBottom: "48px" }}
        >
          {/* MainContent — w-[607.5px] as per Figma */}
          <div style={{ width: "607.5px", maxWidth: "calc(100% - 96px)" }}>

            {/* ── 01 . About section ── */}
            <Reveal show={showText} delay={0} exitDelay={0.12}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#fafafa", marginBottom: "24px" }}>

                {/* EyeBrow */}
                <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "12px", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>01 .</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>About</span>
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: "'Fraunces', serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "22px",
                  lineHeight: "30.8px",
                  color: "#fafafa",
                  margin: 0,
                }}>
                  « Simplicity is inexhaustible »
                </p>

                {/* Body paragraphs */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "24.5px",
                  color: "#fafafa",
                }}>
                  <p style={{ margin: 0 }}>
                    Self-taught, I discovered « the graphic arts » – as they were called at the time – in 1998. My career path then consisted of training and working first as a computer graphics artist, as a webdesigner, then as a UX/UI designer and now as a product designer. I worked in both print and web, on a freelance and salaried basis, and both on his own and in teams of various sizes. And since the profession is constantly evolving, as I have written here, I am continuously training myself in data, accessibility, front-end, methodology, artificial intelligence, and design systems.
                  </p>
                  <p style={{ margin: 0 }}>
                    Sports and the free press, European association, tourism, airlines, mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the opportunity to deal with a wide variety of issues (national and international), and i'm keen to bring my experience to other fields, helping to solve clients' problems while satisfying my curiosity.
                  </p>
                </div>

              </div>
            </Reveal>

            {/* ── 02 . Experiences section ── */}
            <Reveal show={showText} delay={0.2} exitDelay={0}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", color: "#fafafa" }}>

                {/* EyeBrow */}
                <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "12px", color: "#fafafa", whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Experiences</span>
                </div>

                {/* Experience list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Frontguys */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", color: "#fafafa", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, fontSize: "18px" }}>2023 - 2025 .</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "18px" }}>
                      Frontguys / Senior Product Designer
                    </span>
                  </div>

                  {/* SNCF Connect */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "center", color: "#fafafa", fontSize: "18px", lineHeight: "normal", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>2021 - 2023 .</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>SNCF Connect / Senior Product Designer</span>
                  </div>

                  {/* Rail Europe */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "flex-start", color: "#fafafa", fontSize: "18px", lineHeight: "normal" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap" }}>2016 - 2021 .</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>Rail Europe / UXI Designer</span>
                  </div>

                  {/* From 2006 */}
                  <div style={{ display: "flex", gap: "4px", alignItems: "flex-start", color: "#fafafa", fontSize: "18px", lineHeight: "normal" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap" }}>From 2006 .</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>
                      Hebdoprint, Edreams/GoVoyages/Opodo, Pixalione, ENSP, WordAppeal x Lafarge, L'Équipe, Radio France, ...
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "12px 0" }}>
                    {["accessibility", "data", "design system", "design thinking", "artificial intelligence"].map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>

                </div>
              </div>
            </Reveal>

          </div>
        </div>

      </div>

    </div>
      </div>
    </>
  );
}
