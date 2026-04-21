import { useNavigate } from "react-router";
import { AnimatedBackground } from "../AnimatedBackground";
import photo from "figma:asset/4b4a98ebdf8ee3d638fcd41fb40af9b5b6aa4999.png";

function Tag({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "rgba(250,250,250,0.2)",
        border: "1px solid #fafafa",
        borderRadius: "999px",
        padding: "6px 12px",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
          fontSize: "12px",
          color: "#fafafa",
          whiteSpace: "nowrap",
          lineHeight: "normal",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const eyeBrowStyle: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  alignItems: "center",
  fontSize: "12px",
  color: "#fafafa",
  lineHeight: "normal",
  whiteSpace: "nowrap",
};

const expRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "4px",
  alignItems: "flex-start",
  color: "#fafafa",
  fontSize: "18px",
  lineHeight: "normal",
  width: "100%",
};

export function MobileAboutPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-y-auto bg-[#fafafa]">

      {/* ── Background image (full bleed behind everything) ── */}
      <div className="sticky top-0 left-0 w-full" style={{ height: 0, zIndex: 0 }}>
        <div className="absolute inset-0" style={{ height: "100vh" }}>
          <AnimatedBackground />
        </div>
      </div>

      {/* ── Photo section (first screen height) ── */}
      <div className="relative w-full shrink-0" style={{ height: "85vh", zIndex: 1 }}>
        <img
          src={photo}
          alt="Julien Bourcet"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center", opacity: 0.8 }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: 120, background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))" }}
        />
      </div>

      {/* ── Content section ── */}
      <div className="relative w-full" style={{ zIndex: 1 }}>
        {/* Content background */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <AnimatedBackground />
        </div>

        <div className="relative px-4 py-8 flex flex-col gap-6" style={{ zIndex: 1 }}>

          {/* ── 01 . About ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div style={eyeBrowStyle}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>01 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>About</span>
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
              « Simplicity is inexhaustible »
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "24.5px", color: "#fafafa", margin: 0 }}>
                Self-taught, I discovered « the graphic arts » – as they were called at the time – in 1998. My career path then consisted of training and working first as a computer graphics artist, as a webdesigner, then as a UX/UI designer and now as a product designer. I worked in both print and web, on a freelance and salaried basis, and both on his own and in teams of various sizes. And since the profession is constantly evolving, as I have written here, I am continuously training myself in data, accessibility, front-end, methodology, artificial intelligence, and design systems.
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "24.5px", color: "#fafafa", margin: 0 }}>
                Sports and the free press, European association, tourism, airlines, mobility, retail, e-commerce, B2B, B2C, B2G, design OPS, I had the opportunity to deal with a wide variety of issues (national and international), and i'm keen to bring my experience to other fields, helping to solve clients' problems while satisfying my curiosity.
              </p>
            </div>
          </div>

          {/* ── 02 . Experiences ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div style={eyeBrowStyle}>
              <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700 }}>02 .</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Experiences</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={expRowStyle}>
                <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>2023 - 2025 .</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>Frontguys / Senior Product Designer</span>
              </div>

              <div style={expRowStyle}>
                <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>2021 - 2023 .</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>SNCF Connect / Senior Product Designer</span>
              </div>

              <div style={expRowStyle}>
                <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>2016 - 2021 .</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>Rail Europe / UXI Designer</span>
              </div>

              <div style={expRowStyle}>
                <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 700, whiteSpace: "nowrap", fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}>From 2006 .</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, flex: "1 0 0", minWidth: 0 }}>
                  Hebdoprint, Edreams/GoVoyages/Opodo, Pixalione, ENSP, WordAppeal x Lafarge, L'Équipe, Radio France, ...
                </span>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "12px" }}>
                {["accessibility", "data", "design system", "design thinking", "artificial intelligence"].map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Navigation — fixed top-right ── */}
      <nav
        className="fixed flex flex-col items-end"
        style={{ top: "16px", right: "16px", gap: "32px", zIndex: 100 }}
      >
        {[
          { label: "Cases",    action: () => navigate("/cases") },
          { label: "Contact",  action: () => navigate("/contact") },
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

    </div>
  );
}
