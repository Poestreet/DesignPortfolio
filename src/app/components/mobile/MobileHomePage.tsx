import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../AnimatedBackground";
import { imgBackground as imgTagline, imgBackground2 as imgDesign } from "../../../imports/HomePageMobile/svg-v4b9j";

// Masks are fluid: width = 100vw - 32px (16px margin each side)
// Heights scale proportionally from original dimensions (370×72 and 370×16)
// designH  = (100vw - 32px) * 72  / 370
// taglineH = (100vw - 32px) * 16 / 370
//
// D_Y_END = 100dvh - bottom(16) - taglineH - gap(16) - designH
//         = calc(100dvh - 32px - (100vw - 32px) * 88 / 370)
//           where 88 = 72 (design) + 16 (tagline)
// T_Y     = 100dvh - bottom(16) - taglineH
//         = calc(100dvh - 16px - (100vw - 32px) * 16 / 370)

const D_X       = "16px";
const D_Y_END   = "calc(100dvh - 32px - (100vw - 32px) * 88 / 370)";
const D_Y_START = "calc(100dvh + 200px)";

const T_X = "16px";
const T_Y = "calc(100dvh - 16px - (100vw - 32px) * 16 / 370)";

export function MobileHomePage() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const designPos  = `${D_X} ${entered ? D_Y_END : D_Y_START}`;
  const taglinePos = `${T_X} ${T_Y}`;

  const maskW = "calc(100vw - 32px)";
  const designH  = "calc((100vw - 32px) * 72 / 370)";
  const taglineH = "calc((100vw - 32px) * 16 / 370)";
  const maskSize = entered
    ? `${maskW} ${designH}, ${maskW} ${taglineH}`
    : `${maskW} ${designH}, ${maskW} 0px`;

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
