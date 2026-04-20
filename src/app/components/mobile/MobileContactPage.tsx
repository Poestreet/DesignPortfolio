import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../AnimatedBackground";

const labelStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontStyle: "italic",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "20px",
  color: "#fafafa",
  fontVariationSettings: "'SOFT' 0, 'WONK' 1",
};

const fieldStyle: React.CSSProperties = {
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
  caretColor: "#fafafa",
};

const eyeBrowStyle: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  alignItems: "center",
  fontSize: "12px",
  color: "#fafafa",
  lineHeight: "normal",
  whiteSpace: "nowrap",
};

export function MobileContactPage() {
  const navigate = useNavigate();
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      window.location.href = `mailto:hello@julienbourcet.fr?subject=Message from ${name}&body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto">

      {/* ── Background ── */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <AnimatedBackground />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />
      </div>

      {/* ── Content ── */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* Navigation */}
        <nav
          className="flex flex-col items-end"
          style={{ padding: "16px 16px 0 16px", gap: "32px" }}
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

        {/* Main content */}
        <div className="px-4 py-8 flex flex-col gap-6">

          {/* ── FormSection ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            <div style={eyeBrowStyle}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>01 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Contact</span>
            </div>

            <p style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "22px",
              lineHeight: "30.8px",
              color: "#fafafa",
              margin: 0,
              fontVariationSettings: "'SOFT' 0, 'WONK' 1",
            }}>
              Get in touch!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Who's writing?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  style={fieldStyle}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>How do i reach you?</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email"
                  style={fieldStyle}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Tell me more?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="whatever you want to talk about, anything..."
                  style={{ ...fieldStyle, resize: "none", paddingBottom: "96px" }}
                />
              </div>

              <button
                type="submit"
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
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#fafafa",
                  }}
                >
                  reach me
                </span>
              </button>

            </div>
          </form>

          {/* ── LinksSection ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            <div style={eyeBrowStyle}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Links</span>
            </div>

            <a
              href="https://linkedin.com/in/julienbourcet"
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
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#fafafa",
                }}
              >
                linkedin
              </span>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}
