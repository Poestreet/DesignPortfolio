import { useNavigate } from "react-router";
import { AnimatedBackground } from "../../app/components/AnimatedBackground";
import designPaths from "../Design/svg-5rty58y69t";
import taglinePaths from "../TheBridgeBetweenStrategyAndHighFidelity/svg-q0ue6zeszd";

// DESIGN: viewBox 0 0 1120 218
const designSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 218">
  <path d="${designPaths.p13107300}" fill="white"/>
  <path d="${designPaths.p16833b80}" fill="white"/>
  <path d="${designPaths.p2b743280}" fill="white"/>
  <path d="${designPaths.p3ccc0140}" fill="white"/>
  <path d="${designPaths.p9cbfd80}" fill="white"/>
  <path d="${designPaths.p21571a00}" fill="white"/>
</svg>`;

// Tagline: viewBox 0 0 560 24
const taglineSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 24">
  <path d="${taglinePaths.p2bf64a70}" fill="white"/>
  <path d="${taglinePaths.p2d6f3400}" fill="white"/>
  <path d="${taglinePaths.p37312180}" fill="white"/>
  <path d="${taglinePaths.p36f33700}" fill="white"/>
  <path d="${taglinePaths.p19774800}" fill="white"/>
  <path d="${taglinePaths.p2480ed00}" fill="white"/>
  <path d="${taglinePaths.p1b8a6cf0}" fill="white"/>
  <path d="${taglinePaths.p29332800}" fill="white"/>
  <path d="${taglinePaths.p350e32f0}" fill="white"/>
  <path d="${taglinePaths.p45eed00}" fill="white"/>
  <path d="${taglinePaths.pfa27d00}" fill="white"/>
  <path d="${taglinePaths.p110c2680}" fill="white"/>
  <path d="${taglinePaths.p3145a400}" fill="white"/>
  <path d="${taglinePaths.p1dbb5400}" fill="white"/>
  <path d="${taglinePaths.p3cf0a300}" fill="white"/>
  <path d="${taglinePaths.p3f07be00}" fill="white"/>
  <path d="${taglinePaths.p2c672300}" fill="white"/>
  <path d="${taglinePaths.p16f3a740}" fill="white"/>
  <path d="${taglinePaths.p440e280}" fill="white"/>
  <path d="${taglinePaths.p12ea9300}" fill="white"/>
  <path d="${taglinePaths.p1b94b00}" fill="white"/>
  <path d="${taglinePaths.pd956c00}" fill="white"/>
  <path d="${taglinePaths.p1bd4f100}" fill="white"/>
  <path d="${taglinePaths.p203a7200}" fill="white"/>
  <path d="${taglinePaths.p18e0c000}" fill="white"/>
  <path d="${taglinePaths.p286b4f80}" fill="white"/>
  <path d="${taglinePaths.pe0b7000}" fill="white"/>
  <path d="${taglinePaths.p21f3a00}" fill="white"/>
  <path d="${taglinePaths.p1506e900}" fill="white"/>
  <path d="${taglinePaths.p21420c40}" fill="white"/>
  <path d="${taglinePaths.p159eb400}" fill="white"/>
  <path d="${taglinePaths.p24777900}" fill="white"/>
  <path d="${taglinePaths.p2a082300}" fill="white"/>
  <path d="${taglinePaths.p25bfa600}" fill="white"/>
  <path d="${taglinePaths.pdd54980}" fill="white"/>
  <path d="${taglinePaths.p4384a00}" fill="white"/>
  <path d="${taglinePaths.p2219a280}" fill="white"/>
  <path d="${taglinePaths.p104e9460}" fill="white"/>
  <path d="${taglinePaths.p37c65680}" fill="white"/>
  <path d="${taglinePaths.p167761c0}" fill="white"/>
</svg>`;

const designUrl  = `url("data:image/svg+xml,${encodeURIComponent(designSvg)}")`;
const taglineUrl = `url("data:image/svg+xml,${encodeURIComponent(taglineSvg)}")`;

// Mask sizes & positions:
//   Tagline   560 × 24 px  — 64px from left, bottom edge 340px from container bottom
//   DESIGN   1120 × 218px  — 64px from left, bottom edge 106px from container bottom
//
// ABOUT link: plain HTML text, positioned right of DESIGN (64+1120+32=1216px),
//             bottom-aligned with DESIGN bottom (106px from viewport bottom).

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] relative size-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          maskImage:          `${taglineUrl}, ${designUrl}`,
          WebkitMaskImage:    `${taglineUrl}, ${designUrl}`,
          maskRepeat:         "no-repeat, no-repeat",
          WebkitMaskRepeat:   "no-repeat, no-repeat",
          maskSize:           "560px 24px, 1120px 218px",
          WebkitMaskSize:     "560px 24px, 1120px 218px",
          maskPosition:       `64px calc(100% - 340px), 64px calc(100% - 106px)`,
          WebkitMaskPosition: `64px calc(100% - 340px), 64px calc(100% - 106px)`,
        }}
      >
        <AnimatedBackground />
      </div>

      {/* ABOUT link — plain text, right of DESIGN + 32px gap, aligned to DESIGN bottom */}
      <button
        onClick={() => navigate("/about")}
        className="absolute flex items-center gap-2 group"
        style={{
          left:       "1216px",
          bottom:     "106px",
          cursor:     "pointer",
          background: "transparent",
          border:     "none",
          padding:    0,
          zIndex:     10,
        }}
      >
        <span
          className="block w-8 h-px transition-all duration-300 group-hover:w-12"
          style={{ background: "#111" }}
        />
        <span
          className="uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#111", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}
        >
          About
        </span>
      </button>
    </div>
  );
}