import { useState, useEffect, useRef } from "react";
import { useNavigate } from "../../lib/navigate";
import { motion } from "motion/react";
import { AnimatedBackground } from "../islands/AnimatedBackground";
import { imgBackground as imgTagline, imgBackground2 as imgDesign } from "../../lib/masks/svg-homepage-mobile";

// ── One-shot flag ──────────────────────────────────────────────────────────────
let homepageMobilePlayed = false;

// ── Binary animation constants ─────────────────────────────────────────────────
const BINARY_SEED =
  "10110100111010001101001110100011010011101000110100111010001101001110100011010011101000110100111010001101001110100011010011101000";
const BINARY_FILL = Array.from(
  { length: Math.ceil(600 / BINARY_SEED.length) },
  () => BINARY_SEED
).join("").slice(0, 600);

// On a 390px mobile: DESIGN area ≈ 358×70px → ~315 chars; 400 covers it safely
const MOBILE_DESIGN_CHARS = 400;

const CHARS_PER_TICK     = 4;  // page-specific — slow for mobile letter shapes
const TYPING_START_DELAY = 50; // starts fast, same as desktop homepage

import { Phase, EASE_TUPLE, TICK_MS, BG_FADE_DURATION } from "../../lib/animations";

// ── Mask geometry (fluid, from original MobileHomePage) ───────────────────────
const D_X     = "16px";
const D_Y_END = "calc(100dvh - 32px - (100vw - 32px) * 88 / 370)";
const D_Y_START = "calc(100dvh + 200px)";
const T_X     = "16px";
const T_Y     = "calc(100dvh - 16px - (100vw - 32px) * 16 / 370)";

export function MobileHomePage() {
  const navigate = useNavigate();

  const [entered,   setEntered]   = useState<boolean>(() => !homepageMobilePlayed);
  const [phase,     setPhase]     = useState<Phase>(() => homepageMobilePlayed ? "done" : "idle");
  const [displayed, setDisplayed] = useState<number>(() => homepageMobilePlayed ? BINARY_FILL.length : 0);
  const [showNav,   setShowNav]   = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Repeat-visit: CSS slide + nav ────────────────────────────────────────────
  useEffect(() => {
    if (!homepageMobilePlayed) return;
    const t1 = setTimeout(() => setEntered(true), 80);
    const t2 = setTimeout(() => setShowNav(true), 1350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── First-visit: binary typing sequence ──────────────────────────────────────
  useEffect(() => {
    if (homepageMobilePlayed) return;

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
              homepageMobilePlayed = true;
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

  // ── Fluid mask dimensions ─────────────────────────────────────────────────────
  const maskW    = "calc(100vw - 32px)";
  const designH  = "calc((100vw - 32px) * 72 / 370)";
  const taglineH = "calc((100vw - 32px) * 16 / 370)";

  const designPos  = `${D_X} ${entered ? D_Y_END : D_Y_START}`;
  const taglinePos = `${T_X} ${T_Y}`;

  const maskSize = entered
    ? `${maskW} ${designH}, ${maskW} ${taglineH}`
    : `${maskW} ${designH}, ${maskW} 0px`;

  const maskTransition = homepageMobilePlayed
    ? [
        "mask-position 0.95s cubic-bezier(0.4,0,0.05,1) 0.2s",
        "-webkit-mask-position 0.95s cubic-bezier(0.4,0,0.05,1) 0.2s",
        "mask-size 0.65s ease 0.75s",
        "-webkit-mask-size 0.65s ease 0.75s",
      ].join(", ")
    : "none";

  const bgOpacity     = (phase === "revealing" || phase === "done") ? 1 : 0;
  const binaryOpacity = (phase === "idle"      || phase === "typing") ? 1 : 0;

  return (
    <div className="bg-[#fafafa] relative w-full h-full overflow-hidden">

      {/* ── Navigation — DOM-first for correct keyboard tab order (WCAG 2.4.3) ── */}
      <motion.nav
        className="absolute flex flex-col items-end"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -10 }}
        transition={{ duration: 0.7, ease: EASE_TUPLE }}
        style={{ top: "16px", right: "16px", gap: "32px", zIndex: 10 }}
      >
        {[
          { label: "About",   action: () => navigate("/about") },
          { label: "Cases",   action: () => navigate("/cases") },
          { label: "Contact", action: () => navigate("/contact") },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="group flex items-center gap-2"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", color: "#070071" }}
          >
            <span
              className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
              style={{ background: "#070071" }}
            />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#070071",
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </motion.nav>

      {/* ── Binary mask — own mask, always at final position ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: binaryOpacity }}
        animate={{ opacity: binaryOpacity }}
        transition={{ duration: BG_FADE_DURATION / 1000, ease: "easeInOut" }}
        style={{
          maskImage:          `url("${imgDesign}"), url("${imgTagline}")`,
          WebkitMaskImage:    `url("${imgDesign}"), url("${imgTagline}")`,
          maskRepeat:         "no-repeat, no-repeat",
          WebkitMaskRepeat:   "no-repeat, no-repeat",
          maskSize:           `${maskW} ${designH}, ${maskW} ${taglineH}`,
          WebkitMaskSize:     `${maskW} ${designH}, ${maskW} ${taglineH}`,
          maskPosition:       `${D_X} ${D_Y_END}, ${T_X} ${T_Y}`,
          WebkitMaskPosition: `${D_X} ${D_Y_END}, ${T_X} ${T_Y}`,
          pointerEvents:      "none",
        }}
      >
        {/* DESIGN area */}
        <div
          style={{
            position: "absolute",
            left: D_X,
            top: D_Y_END,
            width: maskW,
            height: designH,
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
            {BINARY_FILL.slice(0, Math.min(displayed, MOBILE_DESIGN_CHARS))}
            {(phase === "idle" || (phase === "typing" && displayed < MOBILE_DESIGN_CHARS)) && (
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
            left: T_X,
            top: T_Y,
            width: maskW,
            height: taglineH,
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
            {BINARY_FILL.slice(0, Math.max(0, displayed - MOBILE_DESIGN_CHARS))}
            {phase === "typing" && displayed >= MOBILE_DESIGN_CHARS && (
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
          maskImage:          `url("${imgDesign}"), url("${imgTagline}")`,
          WebkitMaskImage:    `url("${imgDesign}"), url("${imgTagline}")`,
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

    </div>
  );
}
