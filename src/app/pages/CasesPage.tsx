import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { AnimatedBackground } from "../components/AnimatedBackground";

const FADE_OUT_DURATION = 700; // ms — image fades out before slide begins

export function CasesPage() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => navigate("/"), FADE_OUT_DURATION);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image — fades in on enter, fades out before slide-exit */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={
          isExiting
            ? { duration: FADE_OUT_DURATION / 1000, ease: "easeInOut" }
            : { duration: 1.2, delay: 0.7, ease: "easeInOut" }
        }
      >
        <AnimatedBackground />
      </motion.div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute z-10 flex items-center gap-2 group"
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
          Back / Cases
        </span>
      </button>
    </div>
  );
}