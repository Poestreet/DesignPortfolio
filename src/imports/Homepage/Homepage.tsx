import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../../app/components/AnimatedBackground";
import { MobileHomePage } from "../../app/components/mobile/MobileHomePage";
import { imgBackground, imgBackground2 } from "../HomePageDesktop/svg-pta88";

// ── Mask geometry (from Figma) ─────────────────────────────────────────────────
//
// Figma uses a 1527×1024 container, centered on viewport:
//   left: calc(50% - 0.5px) + translateX(-50%)  →  left edge = 50vw - 764px
//   top:  50%               + translateY(-50%)  →  top edge  = 50vh - 512px
//
// DESIGN  mask (1120×218) at container position x=76, y=734:
//   viewport x = (50vw - 764) + 76  = 50vw - 688px
//   viewport y = (50vh - 512) + 734 = 50vh + 222px
//
// Tagline mask (560×24)  at container position x=77, y=969
//   (tagline container: left=calc(50%-1.5px), top=calc(50%-1px)):
//   left edge = 50vw - 765px, top edge = 50vh - 513px
//   viewport x = (50vw - 765) + 77  = 50vw - 688px
//   viewport y = (50vh - 513) + 969 = 50vh + 456px
//
// NB: mask-position % ≠ element %. Using vw/vh gives true absolute offsets.
// ─────────────────────────────────────────────────────────────────────────────

const DESIGN_X   = "calc(50vw - 688px)";
const DESIGN_Y   = "calc(50vh + 222px)";
const DESIGN_Y0  = "calc(50vh + 800px)"; // below viewport (start of animation)

const TAGLINE_X  = "calc(50vw - 688px)";
const TAGLINE_Y  = "calc(50vh + 456px)";

export default function Homepage() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  // DESIGN:  slides up from below (mask-position-y animates)
  // Tagline: reveals via height growth (mask-size-height animates)
  const designPos  = `${DESIGN_X} ${entered ? DESIGN_Y : DESIGN_Y0}`;
  const taglinePos = `${TAGLINE_X} ${TAGLINE_Y}`;

  const maskSize = entered
    ? "1120px 218px, 560px 24px"
    : "1120px 218px, 560px 0px";

  // DESIGN position transitions first (delay 0.2s), tagline size second (delay 0.75s)
  const maskTransition = [
    "mask-position 0.95s cubic-bezier(0.4, 0, 0.05, 1) 0.2s",
    "-webkit-mask-position 0.95s cubic-bezier(0.4, 0, 0.05, 1) 0.2s",
    "mask-size 0.65s ease 0.75s",
    "-webkit-mask-size 0.65s ease 0.75s",
  ].join(", ");

  return (
    <>
      {/* ── Desktop (md and above) ── */}
      <div className="hidden md:block w-full h-full">
        <div className="bg-[#fafafa] relative size-full overflow-hidden">
          {/* Masked animated background */}
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
            <AnimatedBackground />
          </div>

          {/* Navigation */}
          <motion.nav
            className="absolute flex flex-col items-end"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.35, ease: [0.4, 0, 0.05, 1] }}
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
                  style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#070071", fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
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