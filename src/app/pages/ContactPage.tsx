import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { AnimatedBackground } from "../components/AnimatedBackground";
import svgPaths from "../../imports/CasesContactAbout/svg-3cgfxg41fg";

// ── Binary fill (same as AboutPage) ──────────────────────────────────────────
const BINARY =
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const BINARY_FILL = Array.from(
  { length: Math.ceil(10000 / BINARY.length) },
  () => BINARY
).join("").slice(0, 10000);

const CHARS_PER_TICK      = 64;
const TICK_MS             = 16;
const TYPING_START_DELAY  = 600;
const PHOTO_FADE_DURATION = 800;
const TEXT_REVEAL_DELAY   = 600;

type Phase = "idle" | "typing" | "revealing" | "done";

// ── Reveal wrapper (same timing as AboutPage) ─────────────────────────────────
function Reveal({
  children,
  delay = 0,
  show,
}: {
  children: React.ReactNode;
  delay?: number;
  show: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 18 }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.05, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ContactPage() {
  const navigate = useNavigate();

  const [phase,     setPhase]     = useState<Phase>("idle");
  const [displayed, setDisplayed] = useState(0);
  const [showText,  setShowText]  = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const binaryOpacity = phase === "revealing" || phase === "done" ? 0 : 1;
  const svgOpacity    = phase === "done" ? 1 : 0;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#0a0a0a" }}>

      {/* ── Animated background (full bleed, same as About) ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
      >
        <AnimatedBackground />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
      </motion.div>

      {/* ── Layout: flex row, same as AboutPageDesktop ── */}
      <div className="absolute inset-0 flex">

        {/* ── Left column — binary typewriter then +CASES+CONTACT+ABOUT SVG ── */}
        <div className="relative flex-1 min-w-0">

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

          {/* +CASES+CONTACT+ABOUT SVG — revealed after binary */}
          <motion.div
            className="absolute inset-0 flex items-end justify-start"
            style={{ padding: "64px" }}
            animate={{ opacity: svgOpacity }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* SVG viewBox: 1120×60 — scale to fill left column width */}
            <div style={{ width: "100%", maxWidth: "560px" }}>
              <svg
                fill="none"
                preserveAspectRatio="xMinYMid meet"
                viewBox="0 0 1120 60"
                style={{ width: "100%", height: "auto", opacity: 0.12 }}
              >
                <g>
                  <path d={svgPaths.p321fa880} fill="white" />
                  <path d={svgPaths.p1999b400} fill="white" />
                  <path d={svgPaths.p3dae1c00} fill="white" />
                  <path d={svgPaths.p1a1e5f00} fill="white" />
                  <path d={svgPaths.p3c186700} fill="white" />
                  <path d={svgPaths.p203ef900} fill="white" />
                  <path d={svgPaths.p11681840} fill="white" />
                  <path d={svgPaths.p12197480} fill="white" />
                  <path d={svgPaths.p91ac070} fill="white" />
                  <path d={svgPaths.p53f8100} fill="white" />
                  <path d={svgPaths.p9028200} fill="white" />
                  <path d={svgPaths.p48859f0} fill="white" />
                  <path d={svgPaths.pf0483c0} fill="white" />
                  <path d={svgPaths.p25110a00} fill="white" />
                  <path d={svgPaths.p2a84a000} fill="white" />
                  <path d={svgPaths.p1fd25200} fill="white" />
                  <path d={svgPaths.p275d2000} fill="white" />
                  <path d={svgPaths.p1bf1fa00} fill="white" />
                  <path d={svgPaths.p8986300} fill="white" />
                  <path d={svgPaths.p339f5200} fill="white" />
                </g>
              </svg>
            </div>
          </motion.div>

          {/* Right-edge gradient separator */}
          <div
            className="absolute inset-y-0 right-0 w-24 pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* ── Right column — contact content, same grid as AboutPage ── */}
        <div
          className="relative flex-1 min-w-0 flex flex-col items-center justify-center"
          style={{ paddingBottom: "0px" }}
        >
          {/* Content block — same width constraint as About: ~607.5px */}
          <div style={{ width: "607.5px", maxWidth: "calc(100% - 96px)" }}>

            {/* Quote */}
            <Reveal show={showText} delay={0}>
              <p
                className="text-white italic"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.4",
                  fontFamily: "'Fraunces', serif",
                  marginBottom: "40px",
                }}
              >
                « Let's work together »
              </p>
            </Reveal>

            {/* Body content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Email */}
              <Reveal show={showText} delay={0.18}>
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 400,
                      marginBottom: "10px",
                    }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:hello@julienbourcet.fr"
                    className="group inline-flex items-center gap-3"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                      style={{ background: "white" }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 400,
                        color: "white",
                        letterSpacing: "0.02em",
                      }}
                    >
                      hello@julienbourcet.fr
                    </span>
                  </a>
                </div>
              </Reveal>

              {/* Location */}
              <Reveal show={showText} delay={0.36}>
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 400,
                      marginBottom: "10px",
                    }}
                  >
                    Location
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: "1.75",
                    }}
                  >
                    Paris, France — available remotely worldwide
                  </p>
                </div>
              </Reveal>

              {/* Social links */}
              <Reveal show={showText} delay={0.54}>
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 400,
                      marginBottom: "14px",
                    }}
                  >
                    Links
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "LinkedIn", href: "https://linkedin.com/in/julienbourcet" },
                      { label: "Dribbble", href: "https://dribbble.com/julienbourcet" },
                      { label: "Read.cv",  href: "https://read.cv/julienbourcet" },
                    ].map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3"
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                          style={{ background: "white" }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "white",
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 800,
                          }}
                        >
                          {label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </div>

      </div>

      {/* ── Nav — absolute top right, same as AboutPage ── */}
      <nav
        className="absolute flex flex-col items-end z-20"
        style={{ top: "16px", right: "16px", gap: "16px" }}
      >
        {[
          { label: "Cases",    action: () => navigate("/cases") },
          { label: "About",    action: () => navigate("/about") },
          { label: "Homepage", action: () => navigate("/") },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex items-center gap-2 group"
            style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
          >
            <span
              className="block w-8 h-px transition-all duration-300 group-hover:w-12"
              style={{ background: "white" }}
            />
            <span
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "white",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>

    </div>
  );
}
