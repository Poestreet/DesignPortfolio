// Identique à la v1 — figma:asset/ résolu par le plugin Vite dans astro.config.mjs
const exampleImage = "/assets/05ecf1ce226d7b081d77b91c5a9eada68ab72e0a.webp";

export function AnimatedBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <style>{`
        @keyframes driftX {
          0%   { transform: translateX(  0px); }
          100% { transform: translateX(-140px); }
        }
        @keyframes driftY {
          0%   { transform: translateY(  0px); }
          100% { transform: translateY(-100px); }
        }
        @keyframes driftScale {
          0%   { transform: scale(1);    }
          100% { transform: scale(1.18); }
        }
        .animated-bg-outer {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          animation: driftX 3.3s ease-in-out infinite alternate;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .animated-bg-outer { width: 200%; height: 200%; }
        }
        .animated-bg-inner {
          width: 100%;
          height: 100%;
          animation: driftY 2.1s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animated-bg-scale {
          width: 100%;
          height: 100%;
          animation: driftScale 4.5s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animated-bg-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-bg-outer,
          .animated-bg-inner,
          .animated-bg-scale { animation: none; }
        }
      `}</style>
      <div className="animated-bg-outer">
        <div className="animated-bg-inner">
          <div className="animated-bg-scale">
            <img src={exampleImage} className="animated-bg-img" alt="" draggable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
