import { useNavigate } from "../../lib/navigate";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedBackground } from "./AnimatedBackground";
import { MobileCasesPage } from "../mobile/MobileCasesPage";
import { Phase, EASE_TUPLE, TICK_MS, PHOTO_FADE_DURATION, TEXT_REVEAL_DELAY, TYPING_START_DELAY } from "../../lib/animations";

const imgSncfHero       = "/assets/f1725bc3c57cf3dd7645db13a41f98c510522e43.webp";
const imgSncfUI         = "/assets/7725d6f86a5b9645928d53b0663fcffa1a5bba31.webp";
const imgSncfScreens    = "/assets/91d3823d08cc55b2dfeef9f9cf95ea29b755b2df.png";
const imgManutanHero    = "/assets/fee28166fa517fd8c22922535651ddcc807c8fee.webp";
const imgManutanUI      = "/assets/07bbb20152618083166542a433ca2836c88af76c.png";
const imgManutanScreens = "/assets/92e0ff13a74b454f6b79d4e6bc4b979656a5b149.png";

// ── Binary animation constants ─────────────────────────────────────────────────
const BINARY =
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

const BINARY_FILL = Array.from(
  { length: Math.ceil(4000 / BINARY.length) },
  () => BINARY
).join("").slice(0, 4000);

const CHARS_PER_TICK   = 12; // matches homepage — visible left→right motion
const SNCF_START_DELAY = TYPING_START_DELAY; // alias for readability

// ── One-shot flags — persist across remounts within the same session ───────────
const playedHeroIds = new Set<string>();
let   casesNavShown = false;

// ── Types ─────────────────────────────────────────────────────────────────────
type CaseId    = "sncf" | "manutan";
type SubId     = "hero" | "challenge" | "role" | "results";
type AnimPhase = Phase; // alias — Phase imported from lib/animations

const ALL_SECTIONS: { caseId: CaseId; sub: SubId; id: string }[] = [
  { caseId: "sncf",    sub: "hero",      id: "sncf-hero" },
  { caseId: "sncf",    sub: "challenge", id: "sncf-challenge" },
  { caseId: "sncf",    sub: "role",      id: "sncf-role" },
  { caseId: "sncf",    sub: "results",   id: "sncf-results" },
  { caseId: "manutan", sub: "hero",      id: "manutan-hero" },
  { caseId: "manutan", sub: "challenge", id: "manutan-challenge" },
  { caseId: "manutan", sub: "role",      id: "manutan-role" },
  { caseId: "manutan", sub: "results",   id: "manutan-results" },
];

const CASES: { id: CaseId; label: string }[] = [
  { id: "sncf",    label: "SNCF CONNECT — CART" },
  { id: "manutan", label: "MANUTAN — SEARCH FUNNEL" },
];

const SUB_NAV_ITEMS: { sub: SubId; label: string }[] = [
  { sub: "challenge", label: "Challenge" },
  { sub: "role",      label: "Role" },
  { sub: "results",   label: "Results" },
];

// ── useInView — fires once when element enters viewport ────────────────────────
function useInView(threshold = 0.35) {
  const ref    = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ── Reveal — sequential fade-in block ─────────────────────────────────────────
function Reveal({
  children,
  inView,
  index,
  baseDelay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  inView: boolean;
  index: number;
  baseDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 18 }}
      transition={{ duration: 0.7, delay: baseDelay + index * 0.18, ease: EASE_TUPLE }}
    >
      {children}
    </motion.div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const listStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24.5px",
  color: "#fafafa",
  paddingLeft: 0,
  margin: 0,
  listStylePosition: "inside",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 700,
  fontStyle: "italic",
  fontSize: "22px",
  lineHeight: "1.4",
  color: "#fafafa",
  margin: 0,
  fontVariationSettings: "'SOFT' 0, 'WONK' 1",
};

function SectionH1({ children }: { children: React.ReactNode }) {
  return <h1 style={headingStyle}>{children}</h1>;
}

function SectionH2({ children }: { children: React.ReactNode }) {
  return <h2 style={headingStyle}>{children}</h2>;
}

function SectionH3({ children }: { children: React.ReactNode }) {
  return <h3 style={headingStyle}>{children}</h3>;
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "24.5px", color: "#fafafa", margin: 0 }}>
      {children}
    </p>
  );
}

// ── Scroll Down Button ────────────────────────────────────────────────────────
function ScrollDownButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Scroll to next section"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m16 10-4 4-4-4"/>
      </svg>
    </motion.button>
  );
}

// ── Animated Hero ─────────────────────────────────────────────────────────────
interface AnimatedHeroProps {
  id: string;
  image: string;
  heading: React.ReactNode;
  body: React.ReactNode;
  startDelay?: number;
  useIntersection?: boolean;
  onScrollNext?: () => void;
  onShowContent?: () => void;
}

function AnimatedHero({
  id,
  image,
  heading,
  body,
  startDelay = 0,
  useIntersection = false,
  onScrollNext,
  onShowContent,
}: AnimatedHeroProps) {
  const alreadyPlayed = playedHeroIds.has(id);

  const [phase,       setPhase]       = useState<AnimPhase>(() => alreadyPlayed ? "done" : "idle");
  const [displayed,   setDisplayed]   = useState<number>(() => alreadyPlayed ? BINARY_FILL.length : 0);
  const [showContent, setShowContent] = useState<boolean>(() => alreadyPlayed);

  const containerRef     = useRef<HTMLDivElement>(null);
  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef       = useRef(false);
  // Stable ref for callback — avoids re-triggering useEffect on every render
  const onShowContentRef = useRef(onShowContent);
  useEffect(() => { onShowContentRef.current = onShowContent; }, [onShowContent]);

  const triggerAnimation = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Skip animation if user prefers reduced motion (WCAG 2.3.3)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      playedHeroIds.add(id);
      setPhase("done");
      setDisplayed(BINARY_FILL.length);
      setShowContent(true);
      onShowContentRef.current?.();
      return;
    }

    const t = setTimeout(() => {
      setPhase("typing");
      intervalRef.current = setInterval(() => {
        setDisplayed((prev) => {
          const next = Math.min(prev + CHARS_PER_TICK, BINARY_FILL.length);
          if (next >= BINARY_FILL.length) {
            clearInterval(intervalRef.current!);
            setTimeout(() => setPhase("revealing"), 200);
            setTimeout(() => setPhase("done"),      200 + PHOTO_FADE_DURATION);
            setTimeout(() => {
              playedHeroIds.add(id);
              setShowContent(true);
              onShowContentRef.current?.();
            }, 200 + PHOTO_FADE_DURATION + TEXT_REVEAL_DELAY);
          }
          return next;
        });
      }, TICK_MS);
    }, startDelay);

    return t;
  }, [startDelay, id]); // onShowContent excluded — accessed via ref

  // First visit: run animation. Subsequent visits: fire callback immediately (nav already visible).
  useEffect(() => {
    if (alreadyPlayed) {
      onShowContentRef.current?.();
      return;
    }
    if (useIntersection) return;
    const t = triggerAnimation();
    return () => {
      if (t !== undefined) clearTimeout(t);
      clearInterval(intervalRef.current!);
    };
  }, [useIntersection, triggerAnimation, alreadyPlayed]);

  useEffect(() => {
    if (!useIntersection) return;
    if (alreadyPlayed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => {
      observer.disconnect();
      clearInterval(intervalRef.current!);
    };
  }, [useIntersection, triggerAnimation, alreadyPlayed]);

  const binaryOpacity = phase === "revealing" || phase === "done" ? 0 : 1;
  const imageVisible  = phase === "revealing" || phase === "done";

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ position: "relative", height: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}
    >
      {/* Binary typewriter — decorative, hidden from AT */}
      <motion.div
        className="absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: binaryOpacity }}
        transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <p style={{ fontFamily: "monospace", fontSize: "9px", lineHeight: "1.5", letterSpacing: "0.05em", color: "rgba(250,250,250,0.55)", wordBreak: "break-all", padding: "20px", margin: 0, height: "100%", overflow: "hidden" }}>
          {BINARY_FILL.slice(0, displayed)}
          {phase === "typing" && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ display: "inline-block", width: "1ch" }}
            >_</motion.span>
          )}
        </p>
      </motion.div>

      {/* Hero image — fades out after text on exit */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageVisible ? 1 : 0 }}
        exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.2, ease: "easeIn" } }}
        transition={{ duration: PHOTO_FADE_DURATION / 1000, ease: "easeInOut" }}
        style={{ zIndex: 2 }}
      >
        <img src={image} alt="" className="w-full h-full object-cover"
          style={{ opacity: 0.5, filter: "grayscale(1)" }} />
      </motion.div>

      {/* Gradient vignette */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)", zIndex: 3 }} />

      {/* Text content — entrance bottom-to-top / exit top-to-bottom (mirror) */}
      <div style={{ position: "relative", zIndex: 4, width: "100%", display: "flex", justifyContent: "center", padding: "0 64px 40px" }}>
        <div className="flex flex-col gap-6" style={{ maxWidth: 608, width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 18 }}
            exit={{ opacity: 0, y: 18, transition: { duration: 0.35, delay: 0, ease: EASE_TUPLE } }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE_TUPLE }}
          >
            <SectionH1>{heading}</SectionH1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 18 }}
            exit={{ opacity: 0, y: 18, transition: { duration: 0.35, delay: 0.08, ease: EASE_TUPLE } }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_TUPLE }}
          >
            <BodyText>{body}</BodyText>
          </motion.div>
          {onScrollNext && (
            <motion.div
              style={{ marginTop: 32, display: "flex", justifyContent: "center" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.16, ease: "easeIn" } }}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            >
              <ScrollDownButton onClick={onScrollNext} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Static sections (scroll-triggered sequential reveal) ───────────────────────

function SncfChallenge() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="sncf-challenge" style={{ height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="flex gap-12 px-16" style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal inView={inView} index={1} className="flex-1 min-w-0 relative" style={{ minHeight: 420 }}>
          <img src={imgSncfUI} alt="SNCF Cart UI" className="absolute pointer-events-none"
            style={{ top: 16, right: 0, left: "auto", width: 700, height: "auto", maxWidth: "none" }} />
        </Reveal>
        <div className="flex flex-col gap-12 flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={0}>
              <SectionH2>Challenge</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={1}>
              <BodyText>
                Reduce shopping basket abandonment rates and secure a critical stage in the conversion funnel.
                The challenge was to transform a page that was a source of friction into a seamless and incentivising
                validation point for users, directly linked to increased online revenue.
              </BodyText>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={2}>
              <SectionH2>Objectives</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={3}>
              <ol style={listStyle}>
                <li>Optimisation: incorporate arrival times, comments on paid services and descriptive ticket titles.</li>
                <li>Consistency and standardisation: make the most of the design system to ensure consistency in the user interface.</li>
                <li>Overall improvement: increase the visibility of cancellations, simplify multiple products and improve the validation of terms and conditions.</li>
                <li>Commercial and legal assessment: increase the conversion rate and ensure legal compliance.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function SncfRole() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="sncf-role" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
      <div className="flex flex-col gap-6" style={{ maxWidth: 608, width: "100%" }}>
        <Reveal inView={inView} index={0}>
          <SectionH3>As lead designer for this redesign:</SectionH3>
        </Reveal>
        <Reveal inView={inView} index={1}>
          <ul style={{ ...listStyle, listStyleType: "disc" }}>
            <li><strong style={{ fontWeight: 800 }}>Governance and strategy: </strong>defining the UX/UI direction for the shopping basket redesign, based on an audit of user pain points and conversion objectives.</li>
            <li><strong style={{ fontWeight: 800 }}>Prioritisation: </strong>redesign of the shopping basket structure to incorporate missing key information (arrival times, paid services, title) and improve the visibility of critical actions (deletion).</li>
            <li><strong style={{ fontWeight: 800 }}>Complex case design: </strong>design and implementation of a clear solution for multiple products (simplified/advanced logic) and early integration of terms and conditions validation (legal).</li>
            <li><strong style={{ fontWeight: 800 }}>Compliance and partnerships: </strong>collaboration with the legal team to ensure compliance of partner offers (insurance) and legal notices.</li>
            <li><strong style={{ fontWeight: 800 }}>Iterative validation: </strong>design, prototyping and targeted user testing to validate the impact of these optimisations.</li>
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

function SncfResults() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="sncf-results" style={{ height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="flex gap-12 px-16" style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal inView={inView} index={0} className="flex-1 min-w-0 relative" style={{ minHeight: 500 }}>
          <img src={imgSncfScreens} alt="SNCF screens" className="absolute pointer-events-none"
            style={{ top: "50%", left: -160, transform: "translateY(-50%)", width: 700, height: "auto", maxWidth: "none" }} />
        </Reveal>
        <div className="flex flex-col gap-12 flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={1}>
              <SectionH2>Environment</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={2}>
              <BodyText>
                A public sector organisation (operating in a highly regulated environment) working on a high-volume B2C product.
                A small product/technical team (1 Product Owner, technical team) and cross-functional collaboration with legal
                and partnerships teams, which required absolute rigour in managing legal constraints.
              </BodyText>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={3}>
              <SectionH2>Results</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={4}>
              <BodyText>
                Delivery on schedule and unanimous approval from the various stakeholders (Product, Tech, Legal). The redesign
                is fully compliant with legal requirements and enabled the integration of all key optimisations and the reduction
                of friction points. Two years after its launch, the page is still live — a testament to the quality and robustness
                of the design work.
              </BodyText>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManutanChallenge() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="manutan-challenge" style={{ height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="flex gap-12 px-16" style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal inView={inView} index={1} className="flex-1 min-w-0 relative" style={{ minHeight: 380 }}>
          <img src={imgManutanUI} alt="Manutan UI" className="absolute pointer-events-none"
            style={{ top: 61, right: 0, left: "auto", width: 700, height: "auto", maxWidth: "none", objectFit: "cover" }} />
        </Reveal>
        <div className="flex flex-col gap-12 flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={0}>
              <SectionH2>Challenge</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={1}>
              <BodyText>
                The search journey has been identified as a key driver of growth for 2025. The challenge was to radically
                transform this pain point into a competitive advantage by optimising marketing investments (SEA) and improving
                the conversion of qualified traffic in order to achieve the year's strategic growth targets.
              </BodyText>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={2}>
              <SectionH2>Objectives</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={3}>
              <ol style={listStyle}>
                <li>Reduce the bounce rate for SEA pages.</li>
                <li>Increase the search engine conversion rate on the homepage/landing page.</li>
                <li>Improve the clarity and speed of the search experience for users.</li>
                <li>Align the search interface with modern UX standards.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManutanRole() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="manutan-role" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
      <div className="flex flex-col gap-6" style={{ maxWidth: 608, width: "100%" }}>
        <Reveal inView={inView} index={0}>
          <SectionH3>Responsible for redesigning the user experience (UX) and user interface (UI)</SectionH3>
        </Reveal>
        <Reveal inView={inView} index={1}>
          <ul style={{ ...listStyle, listStyleType: "disc" }}>
            <li><strong style={{ fontWeight: 800 }}>Analysis and action plan: </strong>collection and analysis of quantitative and qualitative data to provide an accurate assessment of weaknesses and propose a structured action plan (quick wins and long-term projects).</li>
            <li><strong style={{ fontWeight: 800 }}>Iterative design: </strong>implementation and design of various actions (optimisation of forms, filters and result visualisation), incorporating both quick wins and longer-term solutions.</li>
            <li><strong style={{ fontWeight: 800 }}>Data validation: </strong>systematic validation of hypotheses through qualitative (interviews) and quantitative (A/B testing) tests to measure the actual impact of each change on user behaviour and key performance indicators.</li>
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

function ManutanResults() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} id="manutan-results" style={{ height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div className="flex gap-12 px-16" style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        <Reveal inView={inView} index={0} className="flex-1 min-w-0 relative" style={{ minHeight: 500 }}>
          <img src={imgManutanScreens} alt="Manutan screens" className="absolute pointer-events-none"
            style={{ top: "50%", left: -160, transform: "translateY(-50%)", width: 700, height: "auto", maxWidth: "none" }} />
        </Reveal>
        <div className="flex flex-col gap-12 flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={1}>
              <SectionH2>Environment</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={2}>
              <BodyText>
                A joint project with the lead project manager, carried out in close collaboration with the technical team and
                the CRO team. The context was characterised by a weak product culture and development times that were sometimes
                lengthy, which required a strong ability to justify decisions using data and to manage expectations.
              </BodyText>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal inView={inView} index={3}>
              <SectionH2>Results</SectionH2>
            </Reveal>
            <Reveal inView={inView} index={4}>
              <ul style={{ ...listStyle, listStyleType: "disc" }}>
                <li>Reduction in bounce rate following the implementation of the skeleton layout</li>
                <li>Increase in search bar usage, validated by A/B tests</li>
                <li>User tests giving a favourable rating (8/10) to the new product page design</li>
                <li>User tests giving a favourable rating (9/10) to the new autocomplete panel design, subsequently validated by A/B tests</li>
                <li>Increase of between +7% and +10% in clicks on the mobile search bar</li>
                <li>Increase of between +22% and +33% in clicks on products</li>
                <li>Increase of between +22% and +66% in items added to the basket after clicking on a product</li>
                <li>An increase of between +92% and +123% in clicks on categories</li>
                <li>Between +92% and +121% of items added to the basket after clicking on categories</li>
                <li>+6.8% in sessions with at least one search</li>
                <li>+2.9% in average basket value from search</li>
                <li>+2.8% in revenue share from search</li>
                <li>+2.9% in conversion rate linked to search</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Nav components ─────────────────────────────────────────────────────────────
function NavBtn({ label, onClick, href }: { label: string; onClick?: () => void; href?: string }) {
  const inner = (
    <span className="flex items-center gap-2 group">
      <span className="block w-8 h-px transition-all duration-300 group-hover:w-12" style={{ background: "#fafafa" }} />
      <span className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#fafafa", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
        {label}
      </span>
    </span>
  );
  if (href) return <a href={href} style={{ textDecoration: "none" }}>{inner}</a>;
  return (
    <button onClick={onClick} style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}>
      {inner}
    </button>
  );
}

function CaseNavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  if (active) {
    return (
      <button onClick={onClick} className="flex items-center gap-2"
        aria-current="location"
        style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}>
        <span className="rounded-full shrink-0" aria-hidden="true" style={{ width: 8, height: 8, background: "#fafafa" }} />
        <span className="uppercase" style={{ fontSize: "14px", letterSpacing: "0.2em", color: "#fafafa", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
          {label}
        </span>
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-2 group"
      style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}>
      <span className="relative flex items-center justify-center shrink-0 transition-all duration-300 w-2 h-2 group-hover:w-8">
        <span className="absolute rounded-full border border-white transition-opacity duration-300 group-hover:opacity-0" style={{ width: 8, height: 8 }} />
        <span className="absolute inset-x-0 h-px bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ top: "50%", transform: "translateY(-50%)" }} />
      </span>
      <span className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#fafafa", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
        {label}
      </span>
    </button>
  );
}

function SubNavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group"
      aria-current={active ? "step" : undefined}
      style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}>
      <span
        className={`block h-px shrink-0 transition-all duration-300 ${active ? "w-4" : "w-2 group-hover:w-6"}`}
        style={{ background: "#fafafa" }}
      />
      <span
        className="uppercase transition-all duration-300"
        style={{
          fontSize: "10px",
          letterSpacing: "0.15em",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: active ? 500 : 400,
          color: "#fafafa",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CasesPage() {
  const navigate = useNavigate();

  const [activeCase,       setActiveCase]       = useState<CaseId>("sncf");
  const [activeSubSection, setActiveSubSection] = useState<SubId>("hero");
  const [showNav,          setShowNav]          = useState(() => casesNavShown);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const vh  = window.innerHeight;
      const idx = Math.min(Math.round(container.scrollTop / vh), ALL_SECTIONS.length - 1);
      const s   = ALL_SECTIONS[idx];
      setActiveCase(s.caseId);
      setActiveSubSection(s.sub);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const container = scrollRef.current;
    const el        = container?.querySelector<HTMLElement>(`#${id}`);
    if (el && container) container.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Mobile (below md) ── */}
      <div className="md:hidden w-full h-full">
        <MobileCasesPage />
      </div>

      {/* ── Desktop (md and above) ── */}
      <div className="hidden md:block w-full h-full">
    <div style={{ position: "absolute", inset: 0 }}>

      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <AnimatedBackground />
      </div>

      {/* Navigation — DOM-before-content for correct keyboard tab order (WCAG 2.4.3) */}
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, right: 0, zIndex: 30,
          display: "flex", flexDirection: "column", alignItems: "flex-end",
          paddingRight: 16, paddingTop: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
          {(["About", "Contact", "Homepage"] as const).map((label, i, arr) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 8 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.35, delay: i * 0.08, ease: EASE_TUPLE } }}
              transition={{ duration: 0.6, delay: (arr.length - 1 - i) * 0.12, ease: EASE_TUPLE }}
            >
              <NavBtn
                label={label}
                onClick={() => navigate(label === "Homepage" ? "/" : `/${label.toLowerCase()}`)}
              />
            </motion.div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 20 }}>
          {CASES.map(({ id, label }, i, arr) => (
            <motion.div
              layout
              key={id}
              className="flex flex-col items-end"
              style={{ gap: 10 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 8 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.35, delay: i * 0.08 + 0.16, ease: EASE_TUPLE } }}
              transition={{ duration: 0.6, delay: (arr.length - 1 - i) * 0.12 + 0.24, ease: EASE_TUPLE }}
            >
              <CaseNavItem
                label={label}
                active={activeCase === id}
                onClick={() => scrollTo(`${id}-hero`)}
              />
              <AnimatePresence initial={false}>
                {activeCase === id && (
                  <motion.div
                    key="sub"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="flex flex-col items-end" style={{ gap: 8, paddingTop: 2, paddingBottom: 4 }}>
                      {SUB_NAV_ITEMS.map(({ sub, label: subLabel }) => (
                        <SubNavItem
                          key={sub}
                          label={subLabel}
                          active={activeSubSection === sub}
                          onClick={() => scrollTo(`${id}-${sub}`)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scrollable content — DOM-after-nav so nav is reached first by keyboard */}
      <div
        ref={scrollRef}
        style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}
      >
        <AnimatedHero
          id="sncf-hero"
          image={imgSncfHero}
          startDelay={SNCF_START_DELAY}
          useIntersection={false}
          heading="Optimisation and Redesign of the B2C Shopping Cart"
          body="Shopping cart suffered from structural complexity and a lack of clarity, which was a source of frustration. The challenge was to reorganise the information hierarchy to simplify it and make it more effective (multi-product, key actions), whilst managing the legal constraints imposed by the legal team regarding the display of partnership offers (insurance) and mandatory disclosures."
          onScrollNext={() => scrollTo("sncf-challenge")}
          onShowContent={() => { casesNavShown = true; setShowNav(true); }}
        />
        <SncfChallenge />
        <SncfRole />
        <SncfResults />

        <AnimatedHero
          id="manutan-hero"
          image={imgManutanHero}
          startDelay={0}
          useIntersection={true}
          heading="Strategic Overhaul of Research: Design and Performance"
          body="Search experience suffered from low search engine usage and a high bounce rate, particularly for paid traffic (SEA), which indicated a mismatch between the interface provided and users' expectations. The challenge was therefore to simplify the search experience, improve the relevance of results and make the tool more intuitive in order to encourage its use."
          onScrollNext={() => scrollTo("manutan-challenge")}
        />
        <ManutanChallenge />
        <ManutanRole />
        <ManutanResults />
      </div>
    </div>
      </div>
    </>
  );
}
