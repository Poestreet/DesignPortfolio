import { useNavigate } from "react-router";
import { AnimatedBackground } from "../AnimatedBackground";
import imgSncfHero from "figma:asset/f1725bc3c57cf3dd7645db13a41f98c510522e43.png";
import imgSncfUI from "figma:asset/7725d6f86a5b9645928d53b0663fcffa1a5bba31.png";
import imgSncfScreens from "figma:asset/91d3823d08cc55b2dfeef9f9cf95ea29b755b2df.png";
import imgManutanHero from "figma:asset/fee28166fa517fd8c22922535651ddcc807c8fee.png";
import imgManutanUI from "figma:asset/07bbb20152618083166542a433ca2836c88af76c.png";
import imgManutanScreens from "figma:asset/92e0ff13a74b454f6b79d4e6bc4b979656a5b149.png";

// ── Shared text styles ─────────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontStyle: "italic",
  fontWeight: 700,
  fontSize: "22px",
  lineHeight: "30.8px",
  color: "#fafafa",
  margin: 0,
  fontVariationSettings: "'SOFT' 0, 'WONK' 1",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24.5px",
  color: "#fafafa",
  margin: 0,
};

const listStyle: React.CSSProperties = {
  ...{
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "24.5px",
    color: "#fafafa",
  },
  paddingLeft: 0,
  margin: 0,
  listStylePosition: "inside",
};

// ── Divider between cases ──────────────────────────────────────────────────────
function CaseDivider() {
  return (
    <div
      style={{
        height: "1px",
        background: "rgba(250,250,250,0.2)",
        margin: "0 32px",
      }}
    />
  );
}

// ── SNCF Case ─────────────────────────────────────────────────────────────────
function SncfCase() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      {/* Hero — image */}
      <div style={{ position: "relative", width: "100%", height: "260px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "luminosity" }}>
          <img
            src={imgSncfHero}
            alt="SNCF Cart"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* Hero text — starts at midpoint of image, overflows below */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: -160,
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={headingStyle}>
          Optimisation and Redesign of the B2C Shopping Cart
        </p>
        <p style={bodyStyle}>
          Shopping cart suffered from structural complexity and
          a lack of clarity, which was a source of frustration.
          The challenge was to reorganise the information
          hierarchy to simplify it and make it more effective
          (multi-product, key actions), whilst managing the
          legal constraints imposed by the legal team regarding
          the display of partnership offers (insurance) and
          mandatory disclosures.
        </p>
      </div>

      {/* Challenge & Objectives */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Challenge</p>
          <p style={bodyStyle}>
            Reduce shopping basket abandonment rates and secure
            a critical stage in the conversion funnel. The
            challenge was to transform a page that was a source
            of friction into a seamless and incentivising
            validation point for users, directly linked to
            increased online revenue.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Objectives</p>
          <ol style={listStyle}>
            <li>
              Optimisation: incorporate arrival times, comments
              on paid services and descriptive ticket titles.
            </li>
            <li>
              Consistency and standardisation: make the most of
              the design system to ensure consistency in the
              user interface.
            </li>
            <li>
              Overall improvement: increase the visibility of
              cancellations, simplify multiple products and
              improve the validation of terms and conditions.
            </li>
            <li>
              Commercial and legal assessment: increase the
              conversion rate and ensure legal compliance.
            </li>
          </ol>
        </div>
      </div>

      {/* UI Image */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={imgSncfUI}
          alt="SNCF Cart UI"
          style={{
            width: "100%",
            maxWidth: "369px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Role */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <p style={headingStyle}>
          As lead designer for this redesign:
        </p>
        <ul style={{ ...listStyle, listStyleType: "disc" }}>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Governance and strategy:{" "}
            </strong>
            defining the UX/UI direction for the shopping basket
            redesign, based on an audit of user pain points and
            conversion objectives.
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Prioritisation:{" "}
            </strong>
            redesign of the shopping basket structure to
            incorporate missing key information (arrival times,
            paid services, title) and improve the visibility of
            critical actions (deletion).
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Complex case design:{" "}
            </strong>
            design and implementation of a clear solution for
            multiple products (simplified/advanced logic) and
            early integration of terms and conditions validation
            (legal).
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Compliance and partnerships:{" "}
            </strong>
            collaboration with the legal team to ensure
            compliance of partner offers (insurance) and legal
            notices, without compromising the simplicity of the
            experience.
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Iterative validation:{" "}
            </strong>
            design, prototyping and targeted user testing to
            validate the impact of these optimisations on the
            clarity and effectiveness of the new shopping
            basket.
          </li>
        </ul>
      </div>

      {/* Screens image */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={imgSncfScreens}
          alt="SNCF Screens"
          style={{
            width: "100%",
            maxWidth: "369px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Environment & Results */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Environment</p>
          <p style={bodyStyle}>
            A public sector organisation (operating in a highly
            regulated environment) working on a high-volume B2C
            product. A small product/technical team (1 Product
            Owner, technical team) and cross-functional
            collaboration with legal and partnerships teams,
            which required absolute rigour in managing legal
            constraints.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Results</p>
          <p style={bodyStyle}>
            Delivery on schedule and unanimous approval from the
            various stakeholders (Product, Tech, Legal). The
            redesign of the shopping basket page, which is fully
            compliant with legal requirements, enabled the
            integration of all key optimisations and the
            reduction of friction points. Two years after its
            launch, the page is still live, which is a testament
            to the quality, relevance and robustness of the
            design work and the UX solutions implemented.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Manutan Case ───────────────────────────────────────────────────────────────
function ManutanCase() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      {/* Hero — image */}
      <div style={{ position: "relative", width: "100%", height: "260px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "luminosity" }}>
          <img
            src={imgManutanHero}
            alt="Manutan Search"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* Hero text — starts at midpoint of image, overflows below */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: -160,
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p style={headingStyle}>
          Strategic Overhaul of Research: Design and Performance
        </p>
        <p style={bodyStyle}>
          Search experience suffered from low search engine
          usage and a high bounce rate, particularly for paid
          traffic (SEA), which indicated a mismatch between the
          interface provided and users' expectations. The
          challenge was therefore to simplify the search
          experience, improve the relevance of results and make
          the tool more intuitive in order to encourage its use.
        </p>
      </div>

      {/* Challenge & Objectives */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Challenge</p>
          <p style={bodyStyle}>
            The search journey has been identified as a key
            driver of growth for 2025. The challenge, therefore,
            was to radically transform this pain point into a
            competitive advantage by optimising marketing
            investments (SEA) and improving the conversion of
            qualified traffic in order to achieve the year's
            strategic growth targets.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Objectives</p>
          <ol style={listStyle}>
            <li>Reduce the bounce rate for SEA pages.</li>
            <li>
              Increase the search engine conversion rate on the
              homepage/landing page.
            </li>
            <li>
              Improve the clarity and speed of the search
              experience for users.
            </li>
            <li>
              Align the search interface with modern UX
              standards.
            </li>
          </ol>
        </div>
      </div>

      {/* UI Image */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={imgManutanUI}
          alt="Manutan UI"
          style={{
            width: "100%",
            maxWidth: "369px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Role */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <p style={headingStyle}>
          Responsible for redesigning the user experience (UX)
          and user interface (UI)
        </p>
        <ul style={{ ...listStyle, listStyleType: "disc" }}>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Analysis and action plan:{" "}
            </strong>
            collection and analysis of quantitative and
            qualitative data to provide an accurate assessment
            of weaknesses and propose a structured action plan
            (quick wins and long-term projects).
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Iterative design (quick wins and projects):{" "}
            </strong>
            implementation and design of various actions
            (optimisation of forms, filters and result
            visualisation), incorporating both quick wins and
            longer-term solutions.
          </li>
          <li>
            <strong
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
              }}
            >
              Data validation:{" "}
            </strong>
            systematic validation of hypotheses through
            qualitative (interviews) and quantitative (A/B
            testing) tests to measure the actual impact of each
            change on user behaviour and key performance
            indicators.
          </li>
        </ul>
      </div>

      {/* Screens image */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <img
          src={imgManutanScreens}
          alt="Manutan Screens"
          style={{
            width: "100%",
            maxWidth: "369px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Environment & Results */}
      <div
        style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Environment</p>
          <p style={bodyStyle}>
            A joint project with the lead project manager,
            carried out in close collaboration with the
            technical team and the CRO team. The context was
            characterised by a weak product culture and
            development times that were sometimes lengthy, which
            required a strong ability to justify decisions using
            data and to manage expectations.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <p style={headingStyle}>Results</p>
          <ul style={{ ...listStyle, listStyleType: "disc" }}>
            <li>
              Reduction in bounce rate following the
              implementation of the skeleton layout
            </li>
            <li>
              Increase in search bar usage, validated by A/B
              tests
            </li>
            <li>
              User tests giving a favourable rating (8/10) to
              the new product page design
            </li>
            <li>
              User tests giving a favourable rating (9/10) to
              the new autocomplete panel, subsequently validated
              by A/B tests
            </li>
            <li>
              Increase of between +7% and +10% in clicks on the
              mobile search bar
            </li>
            <li>
              Increase of between +22% and +33% in clicks on
              products
            </li>
            <li>
              Increase of between +22% and +66% in items added
              to the basket after clicking on a product
            </li>
            <li>
              An increase of between +92% and +123% in clicks on
              categories
            </li>
            <li>
              Between +92% and +121% of items added to the
              basket after clicking on categories
            </li>
            <li>+6.8% in sessions with at least one search</li>
            <li>+2.9% in average basket value from search</li>
            <li>+2.8% in revenue share from search</li>
            <li>+2.9% in conversion rate linked to search</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main Mobile Cases Page ─────────────────────────────────────────────────────
export function MobileCasesPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {/* ── Background (fixed) ── */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <AnimatedBackground />
      </div>

      {/* ── Content ── */}
      <div className="relative pb-16">
        {/* Navigation */}
        <nav
          className="flex flex-col items-end"
          style={{ padding: "16px 16px 0 16px", gap: "32px" }}
        >
          {[
            {
              label: "About",
              action: () => navigate("/about"),
            },
            {
              label: "Contact",
              action: () => navigate("/contact"),
            },
            { label: "Homepage", action: () => navigate("/") },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className="group flex items-center gap-2"
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
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

        {/* SNCF Case */}
        <div className="mt-8">
          <SncfCase />
        </div>

        {/* Manutan Case */}
        <div style={{ marginTop: 64 }}>
          <ManutanCase />
        </div>
      </div>
    </div>
  );
}