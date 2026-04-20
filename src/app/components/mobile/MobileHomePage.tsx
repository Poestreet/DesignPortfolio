import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../AnimatedBackground";
import { imgBackground as imgTagline, imgBackground2 as imgDesign } from "../../../imports/HomePageMobile/svg-v4b9j";

// DESIGN text mask (370×72) positioned near bottom of viewport
// Tagline mask (370×16) just below
// Mobile design is 402×874 → container 1686px wide centered → left edge = 50vw - 843px
// DESIGN in container at x=658 → viewport x = 50vw - 843 + 658 = 50vw - 185px
// DESIGN y=762 → 112px from bottom ; tagline y=842 → 32px from bottom

const D_X      = "calc(50vw - 185px)";
const D_Y_END  = "calc(100vh - 112px)";
const D_Y_START = "calc(100vh + 200px)";

const T_X = "calc(50vw - 185px)";
const T_Y = "calc(100vh - 32px)";

export function MobileHomePage() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const designPos  = `${D_X} ${entered ? D_Y_END : D_Y_START}`;
  const taglinePos = `${T_X} ${T_Y}`;

  const maskSize = entered
    ? "370px 72px, 370px 16px"
    : "370px 72px, 370px 0px";

  const maskTransition = [
    "mask-position 0.95s cubic-bezier(0.4,0,0.05,1) 0.2s",
    "-webkit-mask-position 0.95s cubic-bezier(0.4,0,0.05,1) 0.2s",
    "mask-size 0.65s ease 0.75s",
    "-webkit-mask-size 0.65s ease 0.75s",
  ].join(", ");

  return (
    <div className="bg-[#fafafa] relative w-full h-full overflow-hidden">

      {/* Masked animated background */}
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
        <AnimatedBackground />
      </div>

      {/* Navigation */}
      <nav
        className="absolute flex flex-col items-end"
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
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
          >
            <span
              className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
              style={{ background: "#070071" }}
            />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
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
      </nav>
    </div>
  );
}
