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
const CHARS_PER_TICK      = 64;
const TICK_MS             = 16;
const TYPING_START_DELAY  = 1900;
const PHOTO_FADE_DURATION = 800;
const TEXT_REVEAL_DELAY   = 600;

type Phase = "idle" | "typing" | "revealing" | "done";

export function AboutPage() {
  const navigate = useNavigate();

  const [phase,     setPhase]     = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState(0);
  const [showText,  setShowText]  = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    };
  }, []);

  // ── Navigation — Root.tsx slide handles all transitions ───────────────────────
  const handleNavigate = (to: string) => {
    navigate(to);
  };

  // ── Derived opacity states (entrance only) ────────────────────────────────────
  const binaryOpacity = phase === "revealing" || phase === "done" ? 0 : 1;
  const photoOpacity  = phase === "revealing" || phase === "done" ? 1 : 0;

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Animated background ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
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
          transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
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
          transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
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
        <motion.p
          className="text-white italic mb-10"
          style={{ fontSize: "22px", lineHeight: "1.4", fontFamily: "'Fraunces', serif" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: showText ? 0.9 : 0, y: showText ? 0 : 18 }}
          transition={{ duration: 0.7, delay: 0, ease: [0.4, 0, 0.05, 1] }}
        >
          « Simplicity is inexhaustible »
        </motion.p>

        <div
          className="text-white space-y-5"
          style={{ fontSize: "14px", lineHeight: "1.75", fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: showText ? 0.75 : 0, y: showText ? 0 : 18 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.05, 1] }}
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

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: showText ? 0.75 : 0, y: showText ? 0 : 18 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.05, 1] }}
          >
            Sports and the free press, European association, tourism, airlines,
            mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the
            opportunity to deal with a wide variety of issues (national and
            international), and i'm keen to bring my experience to other fields,
            helping to solve clients' problems while satisfying my curiosity.
          </motion.p>
        </div>
      </div>

      {/* ── Nav — top right ── */}
      <nav
        className="absolute flex flex-col items-end z-20"
        style={{ top: "16px", right: "16px", gap: "16px" }}
      >
        <button
          onClick={() => handleNavigate("/cases")}
          className="flex items-center gap-2 group"
          style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
        >
          <span className="block w-8 h-px transition-all duration-300 group-hover:w-12" style={{ background: "white" }} />
          <span className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "white", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
            Cases
          </span>
        </button>

        <a
          href="mailto:hello@julienbourcet.fr"
          className="flex items-center gap-2 group"
          style={{ textDecoration: "none" }}
        >
          <span className="block w-8 h-px transition-all duration-300 group-hover:w-12" style={{ background: "white" }} />
          <span className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "white", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
            Contact
          </span>
        </a>

        <button
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2 group"
          style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
        >
          <span className="block w-8 h-px transition-all duration-300 group-hover:w-12" style={{ background: "white" }} />
          <span className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "white", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
            Homepage
          </span>
        </button>
      </nav>
    </div>
  );
}
