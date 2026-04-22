import { useNavigate } from "../../lib/navigate";
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { MobileContactPage } from "../mobile/MobileContactPage";
import { usePageReady } from "../../lib/usePageReady";
import { Reveal } from "./Reveal";
import { EASE_TUPLE } from "../../lib/animations";

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
  color: "#fafafa",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(250,250,250,0.6)",
  width: "100%",
  padding: "8px",
  lineHeight: "normal",
  /* outline: none retiré — géré par input:focus-visible dans index.css (WCAG 2.4.11) */
};

export default function ContactPage() {
  const navigate = useNavigate();
  const ready    = usePageReady();
  const showText = ready;
  const showNav  = ready;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "invalid-email">("idle");
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
      const formData = new URLSearchParams();
      formData.append("form-name", "contact");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      const res = await fetch("/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
        setFormKey(k => k + 1);
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
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

      {/* ── Two-column layout ── */}
      <div className="absolute inset-0 flex items-start">

        {/* RightCol — empty left half */}
        <div className="flex-1 h-full min-w-0" />

        {/* LeftCol — content + navigation */}
        <div className="relative flex-1 h-full min-w-0 flex flex-col items-center justify-center">

          {/* ── Navigation — DOM-first for correct keyboard tab order (WCAG 2.4.3) ── */}
          <nav
            className="absolute flex flex-col items-end"
            style={{ top: "16px", right: "16px", gap: "16px" }}
          >
            {[
              { label: "Cases",    action: () => navigate("/cases") },
              { label: "About",    action: () => navigate("/about") },
              { label: "Homepage", action: () => navigate("/") },
            ].map(({ label, action }, i, arr) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 8 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.35, delay: i * 0.08, ease: EASE_TUPLE } }}
                transition={{ duration: 0.6, delay: (arr.length - 1 - i) * 0.12, ease: EASE_TUPLE }}
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
                    fontWeight: 400,
                    fontSize: "11px",
                    lineHeight: "16.5px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#fafafa",
                  }}
                >
                  {label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* ── MainContent (607.5px) ── */}
          <div style={{ width: "607.5px", maxWidth: "calc(100% - 64px)", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── FormSection ── */}
            <Reveal show={showText} delay={0.2} exitDelay={0}>
              <form
                name="contact"
                data-netlify="true"
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

                {/* Form status — announced to screen readers (WCAG 4.1.3) */}
                <div role="status" aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                  {status === "sent"  && "Message sent successfully. I'll reach you soon!"}
                  {status === "error" && "There was an error sending your message. Please try again."}
                </div>

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                  {/* Who's writing */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="contact-name" style={labelStyle}>Who's writing?</label>
                    <input
                      key={`name-${formKey}`}
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                      placeholder="your name"
                      required
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={fieldErrors.name || undefined}
                      aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                      style={{
                        ...placeholderStyle,
                        caretColor: "#fafafa",
                        borderBottomColor: fieldErrors.name ? "#ff4d4d" : "rgba(250,250,250,0.6)",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    {fieldErrors.name && (
                      <span id="contact-name-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                        Name is required.
                      </span>
                    )}
                  </div>

                  {/* How do i reach you */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="contact-email" style={labelStyle}>How do i reach you?</label>
                    <input
                      key={`email-${formKey}`}
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                      placeholder="your email"
                      required
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={(fieldErrors.email || status === "invalid-email") || undefined}
                      aria-describedby={(fieldErrors.email || status === "invalid-email") ? "contact-email-error" : undefined}
                      style={{
                        ...placeholderStyle,
                        caretColor: "#fafafa",
                        borderBottomColor: (fieldErrors.email || status === "invalid-email") ? "#ff4d4d" : "rgba(250,250,250,0.6)",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    {(fieldErrors.email || status === "invalid-email") && (
                      <span id="contact-email-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                        {status === "invalid-email" ? "Please enter a valid email address." : "Email is required."}
                      </span>
                    )}
                  </div>

                  {/* Tell me more */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="contact-message" style={labelStyle}>Tell me more?</label>
                    <textarea
                      key={`message-${formKey}`}
                      ref={textareaRef}
                      id="contact-message"
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); clearFieldError("message"); autoResize(e.target); }}
                      placeholder="whatever you want to talk about, anything..."
                      rows={1}
                      required
                      autoComplete="off"
                      aria-required="true"
                      aria-invalid={fieldErrors.message || undefined}
                      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                      style={{
                        ...placeholderStyle,
                        resize: "none",
                        overflow: "hidden",
                        fontFamily: "'Outfit', sans-serif",
                        caretColor: "#fafafa",
                        borderBottomColor: fieldErrors.message ? "#ff4d4d" : "rgba(250,250,250,0.6)",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    {fieldErrors.message && (
                      <span id="contact-message-error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                        Message is required.
                      </span>
                    )}
                  </div>

                  {/* Reach Me button */}
                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    className="group flex items-center gap-2"
                    style={{ background: "transparent", border: "none", padding: 0, alignSelf: "flex-start", cursor: status === "sent" ? "default" : "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity 0.2s ease" }}
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
                        lineHeight: "16.5px",
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
            </Reveal>

            {/* ── LinksSection ── */}
            <Reveal show={showText} delay={0} exitDelay={0.12}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* EyeBrow 02 . Links */}
                <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "12px", color: "#fafafa", lineHeight: "normal" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Links</span>
                </div>

                {/* Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                  {[
                    { label: "LinkedIn", href: "https://linkedin.com/in/julienbourcet", ariaLabel: "LinkedIn (opens in new tab)" },
                    { label: "Medium",   href: "https://medium.com/@julienbourcet",     ariaLabel: "Medium (opens in new tab)" },
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
                      style={{ textDecoration: "none" }}
                    >
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
            </Reveal>

          </div>

        </div>
      </div>

    </div>
      </div>
    </>
  );
}