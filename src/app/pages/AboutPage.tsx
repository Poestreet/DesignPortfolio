import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { AnimatedBackground } from "../components/AnimatedBackground";
import photo from "figma:asset/4b4a98ebdf8ee3d638fcd41fb40af9b5b6aa4999.png";

const BINARY =
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const BINARY_FILL = Array.from(
  { length: Math.ceil(10000 / BINARY.length) },
  () => BINARY
).join("").slice(0, 10000);

// ── Entrance timings ──────────────────────────────────────────────────────────
const CHARS_PER_TICK = 64;
const TICK_MS = 16;
const TYPING_START_DELAY = 1900;
const PHOTO_FADE_DURATION = 800;
const TEXT_REVEAL_DELAY = 600;

// ── Exit timings (exact mirror) ───────────────────────────────────────────────
// step 1 : text fades out in reverse stagger            ~700 ms
// step 2 : photo fades out / binary fades back in       500 ms
// step 3 : binary un-types at 300 chars/tick            ~534 ms → allow 650 ms
// step 4 : background fades out (same as entrance:      1 200 ms, easeInOut)
//          → navigate() at the end

const CHARS_PER_TICK_EXIT = 64;   // même vitesse qu'à l'entrée

const EXIT_TEXT_MS   = 700;   // step 1 → 2
const EXIT_PHOTO_MS  = 500;   // step 2 → 3
const EXIT_BINARY_MS = 2600;  // step 3 → 4  (10 000 / 64 * 16 ms ≈ 2 500 ms + marge)
// background fade duration equals the entrance fade duration
const EXIT_BG_DURATION_S = 1.2;
const EXIT_BG_MS = EXIT_BG_DURATION_S * 1000; // 1 200 ms

// Total before navigate: 700 + 500 + 650 + 1 200 = 3 050 ms
const NAVIGATE_DELAY = EXIT_TEXT_MS + EXIT_PHOTO_MS + EXIT_BINARY_MS + EXIT_BG_MS;

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase    = "idle" | "typing" | "revealing" | "done";
// 0=entrance/idle  1=text-out  2=photo-out/binary-in  3=binary-erase  4=bg-out
type ExitStep = 0 | 1 | 2 | 3 | 4;

export function AboutPage() {
  const navigate = useNavigate();

  const [phase,     setPhase]     = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState(0);
  const [showText,  setShowText]  = useState(false);
  const [exitStep,  setExitStep]  = useState<ExitStep>(0);

  const intervalRef    = useRef<ReturnType<typeof setInterval>  | null>(null);
  const exitTimersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Entrance ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPhase("typing");
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) => {
          const next = Math.min(prev + CHARS_PER_TICK, BINARY_FILL.length);
          if (next >= BINARY_FILL.length) {
            clearInterval(intervalRef.current!);
            setTimeout(() => setPhase("revealing"), 200);
            setTimeout(() => setPhase("done"),      200 + PHOTO_FADE_DURATION);
            setTimeout(() => setShowText(true),     200 + PHOTO_FADE_DURATION + TEXT_REVEAL_DELAY);
          }
          return next;
        });
      }, TICK_MS);
    }, TYPING_START_DELAY);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalRef.current!);
      exitTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // ── Exit: exact mirror of entrance ───────────────────────────────────────────
  const handleBack = () => {
    if (exitStep > 0) return;

    // Step 1 – text leaves (reverse stagger: CTA → bio p2 → bio p1 → quote)
    setExitStep(1);

    const t1 = setTimeout(() => {
      // Step 2 – photo fades out; binary fades back in at full
      setExitStep(2);
      setDisplayed(BINARY_FILL.length); // ensure full binary for re-reveal
    }, EXIT_TEXT_MS);

    const t2 = setTimeout(() => {
      // Step 3 – binary un-types character by character
      setExitStep(3);
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) => {
          const next = Math.max(prev - CHARS_PER_TICK_EXIT, 0);
          if (next <= 0) clearInterval(intervalRef.current!);
          return next;
        });
      }, TICK_MS);
    }, EXIT_TEXT_MS + EXIT_PHOTO_MS);

    const t3 = setTimeout(() => {
      // Step 4 – background fades out (same 1.2 s easeInOut as entrance)
      setExitStep(4);
    }, EXIT_TEXT_MS + EXIT_PHOTO_MS + EXIT_BINARY_MS);

    const t4 = setTimeout(() => {
      // Background fully faded → trigger Root.tsx slide
      navigate(-1);
    }, NAVIGATE_DELAY);

    exitTimersRef.current = [t1, t2, t3, t4];
  };

  // ── Derived opacity states ────────────────────────────────────────────────────
  // Background: mirror entrance exactly
  //   entrance → opacity 0 → 1, duration 1.2s, delay 0.7s, easeInOut
  //   exit     → opacity 1 → 0, duration 1.2s, no delay,   easeInOut  (step 4)
  const bgAnimate    = exitStep >= 4 ? { opacity: 0 } : { opacity: 1 };
  const bgTransition = exitStep >= 4
    ? { duration: EXIT_BG_DURATION_S, ease: "easeInOut" as const }
    : { duration: 1.2, delay: 0.7,   ease: "easeInOut" as const };

  // Binary: show while typing; hide under photo; re-appear at exit step 2+
  const binaryOpacity =
    exitStep === 0 ? (phase === "revealing" || phase === "done" ? 0 : 1)
    : exitStep === 1 ? 0    // photo still covering
    : 1;                    // step 2: fade in; step 3: un-typing; step 4: still visible

  // Photo: visible once typing done; fade out at exit step 2+
  const photoOpacity =
    exitStep === 0 ? (phase === "revealing" || phase === "done" ? 1 : 0)
    : exitStep === 1 ? 1    // still visible while text leaves
    : 0;                    // step 2+: fade out

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Animated background (mirrors entrance fade exactly on exit) ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={bgAnimate}
        transition={bgTransition}
      >
        <AnimatedBackground />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
      </motion.div>

      {/* ── Left column ── */}
      <div className="absolute inset-y-0 left-0 w-1/2">

        {/* Binary typewriter */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={{ opacity: binaryOpacity }}
          transition={{
            duration: exitStep === 2
              ? EXIT_PHOTO_MS / 1000        // fades in as photo leaves
              : PHOTO_FADE_DURATION / 1000, // normal entrance/exit fade
            ease: "easeInOut",
          }}
          style={{ pointerEvents: "none" }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              lineHeight: "1.5",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.55)",
              wordBreak: "break-all",
              padding: "20px",
              margin: 0,
            }}
          >
            {BINARY_FILL.slice(0, displayed)}
            {phase === "typing" && exitStep === 0 && (
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
          transition={{
            duration: exitStep >= 2
              ? EXIT_PHOTO_MS / 1000
              : PHOTO_FADE_DURATION / 1000,
            ease: "easeInOut",
          }}
        >
          <img
            src={photo}
            alt="Julien Bourcet"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-32"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.45))" }}
          />
        </motion.div>
      </div>

      {/* ── Right column — text ── */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center"
        style={{ paddingLeft: "72px", paddingRight: "96px", paddingBottom: "94px" }}
      >
        {/* Quote — enters first (delay 0), exits last (exit-delay 0.3) */}
        <motion.p
          className="text-white italic mb-10"
          style={{ fontSize: "22px", lineHeight: "1.4", fontFamily: "'Fraunces', serif" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: exitStep >= 1 ? 0 : showText ? 0.9 : 0,
            y:       exitStep >= 1 ? 18 : showText ? 0   : 18,
          }}
          transition={
            exitStep >= 1
              ? { duration: 0.35, delay: 0.3, ease: [0.4, 0, 0.05, 1] }
              : { duration: 0.7,  delay: 0,   ease: [0.4, 0, 0.05, 1] }
          }
        >
          « Simplicity is inexhaustible »
        </motion.p>

        {/* Bio */}
        <div
          className="text-white space-y-5"
          style={{ fontSize: "14px", lineHeight: "1.75", fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
        >
          {/* Bio p1 — enters 2nd (delay 0.2), exits 3rd (exit-delay 0.2) */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{
              opacity: exitStep >= 1 ? 0 : showText ? 0.75 : 0,
              y:       exitStep >= 1 ? 18 : showText ? 0    : 18,
            }}
            transition={
              exitStep >= 1
                ? { duration: 0.35, delay: 0.2, ease: [0.4, 0, 0.05, 1] }
                : { duration: 0.7,  delay: 0.2, ease: [0.4, 0, 0.05, 1] }
            }
          >
            Self-taught, I discovered « the graphic arts » – as they were called
            at the time – in 1998. My career path then consisted of training and
            working first as a computer graphics artist, as a webdesigner, then as
            a UX/UI designer and now as a product designer. I worked in both print
            and web, on a freelance and salaried basis, and both on his own and in
            teams of various sizes. And since the profession is constantly
            evolving, as I have written here, I am continuously training myself in
            data, accessibility, front-end, methodology, artificial intelligence,
            and design systems.
          </motion.p>

          {/* Bio p2 — enters 3rd (delay 0.4), exits 2nd (exit-delay 0.1) */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{
              opacity: exitStep >= 1 ? 0 : showText ? 0.75 : 0,
              y:       exitStep >= 1 ? 18 : showText ? 0    : 18,
            }}
            transition={
              exitStep >= 1
                ? { duration: 0.35, delay: 0.1, ease: [0.4, 0, 0.05, 1] }
                : { duration: 0.7,  delay: 0.4, ease: [0.4, 0, 0.05, 1] }
            }
          >
            Sports and the free press, European association, tourism, airlines,
            mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the
            opportunity to deal with a wide variety of issues (national and
            international), and i'm keen to bring my experience to other fields,
            helping to solve clients' problems while satisfying my curiosity.
          </motion.p>
        </div>

        {/* CTA — enters last (delay 0.55), exits first (exit-delay 0) */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: exitStep >= 1 ? 0 : showText ? 1 : 0,
            y:       exitStep >= 1 ? 18 : showText ? 0  : 18,
          }}
          transition={
            exitStep >= 1
              ? { duration: 0.35, delay: 0,    ease: [0.4, 0, 0.05, 1] }
              : { duration: 0.7,  delay: 0.55, ease: [0.4, 0, 0.05, 1] }
          }
        >
          <a
            href="mailto:hello@julienbourcet.fr"
            className="inline-flex items-center gap-3 text-white group"
            style={{ fontSize: "12px", letterSpacing: "0.18em" }}
          >
            <span className="uppercase tracking-widest opacity-75 group-hover:opacity-100 transition-opacity duration-300">
              Contact
            </span>
            <span
              className="block h-px transition-all duration-300 group-hover:w-10"
              style={{ width: "32px", background: "white", opacity: 0.6 }}
            />
          </a>
        </motion.div>
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute z-20 flex items-center gap-2 group"
        style={{ cursor: "pointer", left: "64px", bottom: "64px" }}
      >
        <span
          className="block w-8 h-px transition-all duration-300 group-hover:w-12"
          style={{ background: "white" }}
        />
        <span
          className="uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.2em", color: "white", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}
        >
          Back / About
        </span>
      </button>
    </div>
  );
}
