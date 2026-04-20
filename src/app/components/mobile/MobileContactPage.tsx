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
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error" | "invalid-email">("idle");
  const [fieldErrors, setFieldErrors] = useState({ name: false, email: false, message: false });

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: false }));
    if (status === "invalid-email") setStatus("idle");
  };

  const buttonLabel = () => {
    if (status === "sending") return "sending...";
    if (status === "sent")    return "i'll reach you soon!";
    if (status === "error")   return "try again";
    if (fieldErrors.name)     return "name is required";
    if (fieldErrors.email || status === "invalid-email") return "email is required";
    if (fieldErrors.message)  return "message is required";
    return "reach me";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      name:    !name.trim(),
      email:   !email.trim() || !isValidEmail(email),
      message: !message.trim(),
    };
    if (errors.name || errors.email || errors.message) {
      setFieldErrors(errors);
      if (!email.trim() || !isValidEmail(email)) setStatus("invalid-email");
      return;
    }
    setFieldErrors({ name: false, email: false, message: false });
    setStatus("sending");
    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const text = await res.text();
      let data: { success: boolean };
      try { data = JSON.parse(text); }
      catch { setStatus("error"); return; }
      if (data.success) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto">

      {/* ── Background ── */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <AnimatedBackground />
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
                  onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                  placeholder="your name"
                  style={{
                    ...fieldStyle,
                    borderBottomColor: fieldErrors.name ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>How do i reach you?</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  placeholder="your email"
                  style={{
                    ...fieldStyle,
                    borderBottomColor: (fieldErrors.email || status === "invalid-email") ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={labelStyle}>Tell me more?</label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); clearFieldError("message"); }}
                  placeholder="whatever you want to talk about, anything..."
                  style={{
                    ...fieldStyle,
                    resize: "none",
                    paddingBottom: "96px",
                    borderBottomColor: fieldErrors.message ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

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
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#fafafa",
                  }}
                >
                  {buttonLabel()}
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

            {[
              { label: "linkedin", href: "https://linkedin.com/in/julienbourcet" },
              { label: "medium",   href: "https://medium.com/@julienbourcet" },
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
      </div>
    </div>
  );
}
