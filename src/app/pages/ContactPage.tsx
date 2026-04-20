import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { MobileContactPage } from "../components/mobile/MobileContactPage";

// ── Staggered reveal ──────────────────────────────────────────────────────────
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

// ── Shared field styles ───────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontStyle: "italic",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "20px",
  color: "#fafafa",
};

const placeholderStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  color: "rgba(250,250,250,0.7)",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #fafafa",
  outline: "none",
  width: "100%",
  padding: "8px",
  lineHeight: "normal",
};

export function ContactPage() {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 700);
    return () => clearTimeout(t);
  }, []);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("sending");
    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* ── Mobile (below md) ── */}
      <div className="md:hidden w-full h-full">
        <MobileContactPage />
      </div>

      {/* ── Desktop (md and above) ── */}
      <div className="hidden md:block w-full h-full">
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Animated background ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <AnimatedBackground />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="absolute inset-0 flex items-start">

        {/* RightCol — empty left half */}
        <div className="flex-1 h-full min-w-0" />

        {/* LeftCol — content + navigation */}
        <div className="relative flex-1 h-full min-w-0 flex flex-col items-center justify-center">

          {/* ── MainContent (607.5px) ── */}
          <div style={{ width: "607.5px", maxWidth: "calc(100% - 64px)", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── FormSection ── */}
            <Reveal show={showText} delay={0}>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              >

                {/* EyeBrow 01 . Contact */}
                <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "12px", color: "#fafafa", lineHeight: "normal" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>01 .</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Contact</span>
                </div>

                {/* Title */}
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, fontSize: "22px", lineHeight: "30.8px", color: "#fafafa", margin: 0 }}>
                  Get in touch!
                </p>

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                  {/* Who's writing */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>Who's writing?</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="your name"
                      style={{
                        ...placeholderStyle,
                        caretColor: "#fafafa",
                      }}
                    />
                  </div>

                  {/* How do i reach you */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>How do i reach you?</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your email"
                      style={{
                        ...placeholderStyle,
                        caretColor: "#fafafa",
                      }}
                    />
                  </div>

                  {/* Tell me more */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={labelStyle}>Tell me more?</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="whatever you want to talk about, anything..."
                      rows={1}
                      style={{
                        ...placeholderStyle,
                        resize: "none",
                        paddingBottom: "96px",
                        fontFamily: "'Outfit', sans-serif",
                        caretColor: "#fafafa",
                      }}
                    />
                  </div>

                  {/* Reach Me button */}
                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    className="group flex items-center gap-2"
                    style={{ background: "transparent", border: "none", padding: 0, cursor: status === "sent" ? "default" : "pointer", opacity: status === "sending" ? 0.6 : 1 }}
                  >
                    <span
                      className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                      style={{ background: "#fafafa" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: "11px",
                        lineHeight: "16.5px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: "#fafafa",
                      }}
                    >
                      {status === "sending" ? "sending..." : status === "sent" ? "message sent ✓" : status === "error" ? "try again" : "reach me"}
                    </span>
                  </button>

                </div>
              </form>
            </Reveal>

            {/* ── LinksSection ── */}
            <Reveal show={showText} delay={0.2}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* EyeBrow 02 . Links */}
                <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "12px", color: "#fafafa", lineHeight: "normal" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Links</span>
                </div>

                {/* Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "LinkedIn", href: "https://linkedin.com/in/julienbourcet" },
                    { label: "Medium",   href: "https://medium.com/@julienbourcet" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2"
                      style={{ textDecoration: "none" }}
                    >
                      <span
                        className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                        style={{ background: "#fafafa" }}
                      />
                      <span
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 800,
                          fontSize: "11px",
                          lineHeight: "16.5px",
                          letterSpacing: "3px",
                          textTransform: "uppercase",
                          color: "#fafafa",
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

          {/* ── Navigation — absolute top right of LeftCol ── */}
          <nav
            className="absolute flex flex-col items-end"
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
                className="group flex items-center gap-2"
                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
              >
                <span
                  className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                  style={{ background: "#fafafa" }}
                />
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#fafafa",
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>

        </div>
      </div>

    </div>
      </div>
    </>
  );
}