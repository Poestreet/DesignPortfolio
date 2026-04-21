import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../../app/components/AnimatedBackground";
import { MobileHomePage } from "../../app/components/mobile/MobileHomePage";
import { imgBackground, imgBackground2 } from "../HomePageDesktop/svg-pta88";

// ── One-shot flag — persists across remounts within the same session ───────────
let homepagePlayed = false;

// ── Binary animation constants ─────────────────────────────────────────────────
const BINARY_SEED =
  "10110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000";
const BINARY_FILL = Array.from(
  { length: Math.ceil(3600 / BINARY_SEED.length) },
  () => BINARY_SEED
).join("").slice(0, 3600);

// ~3200 chars to fill the DESIGN area (1120×218px at 9px monospace)
// ~200 chars to fill the TAGLINE area (560×24px)
const DESIGN_CHARS        = 3200;

const CHARS_PER_TICK     = 12;  // page-specific typing speed
const TYPING_START_DELAY = 50;  // homepage starts faster than other pages

import { Phase, EASE_TUPLE, TICK_MS, BG_FADE_DURATION } from "../../app/lib/animations";

// ── Mask geometry (from Figma) ─────────────────────────────────────────────────
const DESIGN_X   = "16px";
const DESIGN_Y   = "calc(100vh - 274px)";
const DESIGN_Y0  = "calc(100vh + 400px)";
const TAGLINE_X  = "16px";
const TAGLINE_Y  = "calc(100vh - 40px)";

export default function Homepage() {
  const navigate = useNavigate();

  // First visit  → entered=true  (masks at final pos, no CSS slide, binary plays)
  // Repeat visit → entered=false (CSS slide plays, AnimatedBackground visible immediately)
  const [entered,   setEntered]   = useState<boolean>(() => !homepagePlayed);
  const [phase,     setPhase]     = useState<Phase>(() => homepagePlayed ? "done" : "idle");
  const [displayed, setDisplayed] = useState<number>(() => homepagePlayed ? BINARY_FILL.length : 0);
  const [showNav,   setShowNav]   = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Repeat-visit: trigger CSS slide + nav at original timing ─────────────────
  useEffect(() => {
    if (!homepagePlayed) return;
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setShowNav(true), 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── First-visit: binary typing sequence ──────────────────────────────────────
  useEffect(() => {
    if (homepagePlayed) return;

    const startTimer = setTimeout(() => {
      setPhase("typing");
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) => {
          const next = Math.min(prev + CHARS_PER_TICK, BINARY_FILL.length);
          if (next >= BINARY_FILL.length) {
            clearInterval(intervalRef.current!);
            setTimeout(() => setPhase("revealing"), 200);
            setTimeout(() => {
              setPhase("done");
              homepagePlayed = true;
              setShowNav(true);
            }, 200 + BG_FADE_DURATION);
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

  // ── Mask position / size ──────────────────────────────────────────────────────
  const designPos  = `${DESIGN_X} ${entered ? DESIGN_Y : DESIGN_Y0}`;
  const taglinePos = `${TAGLINE_X} ${TAGLINE_Y}`;
  const maskSize   = entered
    ? "1120px 218px, 560px 24px"
    : "1120px 218px, 560px 0px";

  // CSS transition only on repeat visits (slide animation)
  const maskTransition = homepagePlayed
    ? [
        "mask-position 0.95s cubic-bezier(0.4, 0, 0.05, 1) 0.2s",
        "-webkit-mask-position 0.95s cubic-bezier(0.4, 0, 0.05, 1) 0.2s",
        "mask-size 0.65s ease 0.75s",
        "-webkit-mask-size 0.65s ease 0.75s",
      ].join(", ")
    : "none";

  const bgOpacity     = (phase === "revealing" || phase === "done") ? 1 : 0;
  const binaryOpacity = (phase === "idle"      || phase === "typing") ? 1 : 0;

  return (
    <>
      {/* ── Desktop (md and above) ── */}
      <div className="hidden md:block w-full h-full">
        <div className="bg-[#fafafa] relative size-full overflow-hidden">

          {/* ── Binary mask — own mask, always at final position ── */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: binaryOpacity }}
            animate={{ opacity: binaryOpacity }}
            transition={{ duration: BG_FADE_DURATION / 1000, ease: "easeInOut" }}
            style={{
              maskImage:          `url("${imgBackground}"), url("${imgBackground2}")`,
              WebkitMaskImage:    `url("${imgBackground}"), url("${imgBackground2}")`,
              maskRepeat:         "no-repeat, no-repeat",
              WebkitMaskRepeat:   "no-repeat, no-repeat",
              maskSize:           "1120px 218px, 560px 24px",
              WebkitMaskSize:     "1120px 218px, 560px 24px",
              maskPosition:       `${DESIGN_X} ${DESIGN_Y}, ${TAGLINE_X} ${TAGLINE_Y}`,
              WebkitMaskPosition: `${DESIGN_X} ${DESIGN_Y}, ${TAGLINE_X} ${TAGLINE_Y}`,
              pointerEvents:      "none",
            }}
          >
            {/* DESIGN area */}
            <div
              style={{
                position: "absolute",
                left: DESIGN_X,
                top: DESIGN_Y,
                width: "1120px",
                height: "218px",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  lineHeight: "1.5",
                  letterSpacing: "0.05em",
                  color: "#070071",
                  wordBreak: "break-all",
                  margin: 0,
                  padding: 0,
                }}
              >
                {BINARY_FILL.slice(0, Math.min(displayed, DESIGN_CHARS))}
                {(phase === "idle" || (phase === "typing" && displayed < DESIGN_CHARS)) && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ display: "inline-block", width: "1ch" }}
                  >
                    _
                  </motion.span>
                )}
              </p>
            </div>

            {/* TAGLINE area — starts after DESIGN is full */}
            <div
              style={{
                position: "absolute",
                left: TAGLINE_X,
                top: TAGLINE_Y,
                width: "560px",
                height: "24px",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  lineHeight: "1.5",
                  letterSpacing: "0.05em",
                  color: "#070071",
                  wordBreak: "break-all",
                  margin: 0,
                  padding: 0,
                }}
              >
                {BINARY_FILL.slice(0, Math.max(0, displayed - DESIGN_CHARS))}
                {phase === "typing" && displayed >= DESIGN_CHARS && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ display: "inline-block", width: "1ch" }}
                  >
                    _
                  </motion.span>
                )}
              </p>
            </div>
          </motion.div>

          {/* ── AnimatedBackground mask — CSS slide on repeat visits ── */}
          <div
            className="absolute inset-0"
            style={{
              maskImage:          `url("${imgBackground}"), url("${imgBackground2}")`,
              WebkitMaskImage:    `url("${imgBackground}"), url("${imgBackground2}")`,
              maskRepeat:         "no-repeat, no-repeat",
              WebkitMaskRepeat:   "no-repeat, no-repeat",
              maskSize,
              WebkitMaskSize:     maskSize,
              maskPosition:       `${designPos}, ${taglinePos}`,
              WebkitMaskPosition: `${designPos}, ${taglinePos}`,
              transition:         maskTransition,
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: bgOpacity }}
              animate={{ opacity: bgOpacity }}
              transition={{ duration: BG_FADE_DURATION / 1000, ease: "easeInOut" }}
            >
              <AnimatedBackground />
            </motion.div>
          </div>

          {/* Navigation — appears after AnimatedBackground on first visit, after slide on repeat */}
          <motion.nav
            className="absolute flex flex-col items-end"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -10 }}
            transition={{ duration: 0.7, ease: EASE_TUPLE }}
            style={{ top: "16px", right: "16px", gap: "16px", zIndex: 10 }}
          >
            {[
              { label: "About",   action: () => navigate("/about") },
              { label: "Cases",   action: () => navigate("/cases") },
              { label: "Contact", action: () => navigate("/contact") },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2 group"
                style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
              >
                <span
                  className="block w-8 h-px transition-all duration-300 group-hover:w-12"
                  style={{ background: "#070071" }}
                />
                <span
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "#070071",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </motion.nav>

        </div>
      </div>

      {/* ── Mobile (below md) ── */}
      <div className="md:hidden w-full h-full">
        <MobileHomePage />
      </div>
    </>
  );
}
