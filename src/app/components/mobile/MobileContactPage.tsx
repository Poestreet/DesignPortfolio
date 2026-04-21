import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
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
  borderBottom: "1px solid rgba(250,250,250,0.6)",
  width: "100%",
  padding: "8px",
  lineHeight: "normal",
  caretColor: "#fafafa",
  /* outline: none retiré — géré par input:focus-visible dans index.css (WCAG 2.4.11) */
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

            <p aria-hidden="true" style={{ ...eyeBrowStyle, margin: 0 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>01 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Contact</span>
            </p>

            <h1 style={{
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
            </h1>

            {/* Form status — announced to screen readers (WCAG 4.1.3) */}
            <div role="status" aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
              {status === "sent"  && "Message sent successfully. I'll reach you soon!"}
              {status === "error" && "There was an error sending your message. Please try again."}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

              {/* Who's writing — IDs prefixed m- to avoid R236 duplicate with desktop form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="m-contact-name" style={labelStyle}>Who's writing?</label>
                <input
                  id="m-contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                  placeholder="your name"
                  required
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={fieldErrors.name || undefined}
                  aria-describedby={fieldErrors.name ? "m-contact-name-error" : undefined}
                  style={{
                    ...fieldStyle,
                    borderBottomColor: fieldErrors.name ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
                {fieldErrors.name && (
                  <span id="m-contact-name-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                    Name is required.
                  </span>
                )}
              </div>

              {/* How do i reach you */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="m-contact-email" style={labelStyle}>How do i reach you?</label>
                <input
                  id="m-contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  placeholder="your email"
                  required
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={(fieldErrors.email || status === "invalid-email") || undefined}
                  aria-describedby={(fieldErrors.email || status === "invalid-email") ? "m-contact-email-error" : undefined}
                  style={{
                    ...fieldStyle,
                    borderBottomColor: (fieldErrors.email || status === "invalid-email") ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
                {(fieldErrors.email || status === "invalid-email") && (
                  <span id="m-contact-email-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                    {status === "invalid-email" ? "Please enter a valid email address." : "Email is required."}
                  </span>
                )}
              </div>

              {/* Tell me more */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="m-contact-message" style={labelStyle}>Tell me more?</label>
                <textarea
                  id="m-contact-message"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); clearFieldError("message"); }}
                  placeholder="whatever you want to talk about, anything..."
                  required
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={fieldErrors.message || undefined}
                  aria-describedby={fieldErrors.message ? "m-contact-message-error" : undefined}
                  style={{
                    ...fieldStyle,
                    resize: "none",
                    paddingBottom: "96px",
                    fontFamily: "'Outfit', sans-serif",
                    borderBottomColor: fieldErrors.message ? "#ff4d4d" : "#fafafa",
                    transition: "border-color 0.2s ease",
                  }}
                />
                {fieldErrors.message && (
                  <span id="m-contact-message-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                    Message is required.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="group flex items-center gap-2"
                style={{ background: "transparent", border: "none", padding: 0, cursor: status === "sent" ? "default" : "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity 0.2s ease" }}
              >
                <span
                  className="block h-px transition-all duration-300 w-8 group-hover:w-12 shrink-0"
                  style={{ background: "#fafafa" }}
                  aria-hidden="true"
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

            <h2 style={{ ...eyeBrowStyle, margin: 0, fontWeight: "normal" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Links</span>
            </h2>

            {[
              { label: "linkedin", href: "https://linkedin.com/in/julienbourcet", ariaLabel: "LinkedIn (opens in new tab)" },
              { label: "medium",   href: "https://medium.com/@julienbourcet",     ariaLabel: "Medium (opens in new tab)" },
            ].map(({ label, href, ariaLabel }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                initial="rest"
                whileHover="hover"
                className="inline-flex items-center gap-2"
                style={{ textDecoration: "none", alignSelf: "flex-start" }}
              >
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
                <motion.span
                  variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  aria-hidden="true"
                  style={{ display: "inline-flex" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6"/>
                    <path d="M10 14 21 3"/>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  </svg>
                </motion.span>
              </motion.a>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
