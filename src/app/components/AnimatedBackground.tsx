import exampleImage from "figma:asset/05ecf1ce226d7b081d77b91c5a9eada68ab72e0a.png";

export function AnimatedBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <style>{`
        @keyframes driftX {
          0%   { transform: translateX(0px);    }
          100% { transform: translateX(-120px); }
        }
        @keyframes driftY {
          0%   { transform: translateY(0px);   }
          100% { transform: translateY(-80px); }
        }
        @keyframes drift2d {
          0%   { transform: translate(  0px,   0px); }
          25%  { transform: translate(-100px, -60px); }
          50%  { transform: translate(-160px,  20px); }
          75%  { transform: translate( -60px,  80px); }
          100% { transform: translate(  0px,   0px); }
        }

        .animated-bg-wrap {
          position: absolute;
          /* overscan: 15% on each side so movement never reveals edges */
          top: -15%;
          left: -15%;
          width: 130%;
          height: 130%;
          animation: drift2d 10s ease-in-out infinite;
          will-change: transform;
        }

        .animated-bg-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }
      `}</style>
      <div className="animated-bg-wrap">
        <img
          src={exampleImage}
          className="animated-bg-img"
          alt=""
          draggable={false}
        />
      </div>
    </div>
  );
}
