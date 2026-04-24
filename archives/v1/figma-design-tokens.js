/**
 * ─────────────────────────────────────────────────────────────────────────────
 * julienbourcet.fr — Design System
 * Script console Figma (Plugins › Development › Open Console)
 *
 * Crée :
 *   • Paint Styles locaux  (couleurs)
 *   • Text Styles locaux   (typographies)
 *   • Composants Figma (◇) avec variants (combineAsVariants)
 *
 * Chaque nœud de chaque composant est lié aux styles via :
 *   node.fillStyleId   — couleur de fond ou de texte
 *   node.strokeStyleId — couleur de bordure
 *   node.textStyleId   — typographie complète
 *
 * Polices requises installées dans Figma :
 *   Outfit   — Regular · Medium · SemiBold · ExtraBold
 *   Fraunces — Bold Italic
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async () => {

// ═══════════════════════════════════════════════════════════════════════════════
// 0 ─ UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════

function hex(h) {
  return {
    r: parseInt(h.slice(1, 3), 16) / 255,
    g: parseInt(h.slice(3, 5), 16) / 255,
    b: parseInt(h.slice(5, 7), 16) / 255,
  };
}
function solid(color, opacity = 1) {
  return [{ type: "SOLID", color, opacity }];
}

const PAGE = figma.currentPage;

// Lookup maps remplis après création des styles — clé = nom du style
const paintStyles = {};   // "Portfolio/Primary Blue" → styleId
const textStyles  = {};   // "Portfolio/Nav — CTA Label" → styleId

// ═══════════════════════════════════════════════════════════════════════════════
// 1 ─ CHARGEMENT DES POLICES
// ═══════════════════════════════════════════════════════════════════════════════

const FONTS = [
  { family: "Outfit",   style: "Regular"     },
  { family: "Outfit",   style: "Medium"      },
  { family: "Outfit",   style: "SemiBold"    },
  { family: "Outfit",   style: "ExtraBold"   },
  { family: "Fraunces", style: "Bold Italic" },
];

const missing = [];
for (const f of FONTS) {
  try   { await figma.loadFontAsync(f); }
  catch { missing.push(`${f.family} ${f.style}`); }
}
if (missing.length) {
  figma.notify(`⚠️ Police(s) manquante(s) : ${missing.join(", ")}`, { error: true, timeout: 8000 });
  console.warn("Polices manquantes :", missing);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2 ─ PAINT STYLES
// Chaque entrée : [nom, hex, opacity]
// L'id retourné est stocké dans paintStyles pour être utilisé par les composants.
// ═══════════════════════════════════════════════════════════════════════════════

const COLOR_DEFS = [
  ["Portfolio/Primary Blue",        "#070071", 1.00],
  ["Portfolio/Almost White",        "#fafafa", 1.00],
  ["Portfolio/Text — Placeholder",  "#fafafa", 0.70],
  ["Portfolio/Border — Subtle",     "#fafafa", 0.60],
  ["Portfolio/Binary — Deco",       "#fafafa", 0.55],
  ["Portfolio/Tag — Background",    "#fafafa", 0.20],
  ["Portfolio/Error",               "#ff4d4d", 1.00],
  ["Portfolio/Vignette — Hero",     "#000000", 0.45],
  ["Portfolio/Vignette — Photo",    "#000000", 0.30],
];

for (const [name, h, opacity] of COLOR_DEFS) {
  const s  = figma.createPaintStyle();
  s.name   = name;
  s.paints = [{ type: "SOLID", color: hex(h), opacity }];
  paintStyles[name] = s.id;   // ← liaison possible dès maintenant
}
console.log(`✅ ${COLOR_DEFS.length} Paint Styles créés`);

// ═══════════════════════════════════════════════════════════════════════════════
// 3 ─ TEXT STYLES
// [ nom, family, style, size, lineHeight (px | "AUTO"), letterSpacing (px), textCase ]
// L'id retourné est stocké dans textStyles.
// ═══════════════════════════════════════════════════════════════════════════════

const TEXT_DEFS = [
  ["Portfolio/Nav — CTA Label",      "Outfit",   "ExtraBold",   11, "AUTO", 3,    "UPPER"    ],
  ["Portfolio/Eyebrow — Number",     "Fraunces", "Bold Italic", 12, "AUTO", 0,    "ORIGINAL" ],
  ["Portfolio/Eyebrow — Label",      "Outfit",   "ExtraBold",   12, "AUTO", 0,    "ORIGINAL" ],
  ["Portfolio/Tag — Label",          "Outfit",   "Medium",      12, "AUTO", 0,    "ORIGINAL" ],
  ["Portfolio/SubNav — Default",     "Outfit",   "Regular",     10, "AUTO", 1.65, "UPPER"    ],
  ["Portfolio/SubNav — Active",      "Outfit",   "Medium",      10, "AUTO", 1.65, "UPPER"    ],
  ["Portfolio/CaseNav — Default",    "Outfit",   "Regular",     11, "AUTO", 2.2,  "UPPER"    ],
  ["Portfolio/CaseNav — Active",     "Outfit",   "SemiBold",    14, "AUTO", 2.8,  "UPPER"    ],
  ["Portfolio/Form — Label",         "Fraunces", "Bold Italic", 16, 20,     0,    "ORIGINAL" ],
  ["Portfolio/Form — Placeholder",   "Outfit",   "Regular",     14, "AUTO", 0,    "ORIGINAL" ],
  ["Portfolio/Body",                 "Outfit",   "Medium",      14, 24.5,   0,    "ORIGINAL" ],
  ["Portfolio/Heading — Section",    "Fraunces", "Bold Italic", 22, 30.8,   0,    "ORIGINAL" ],
  ["Portfolio/Experience — Date",    "Fraunces", "Bold Italic", 18, "AUTO", 0,    "ORIGINAL" ],
  ["Portfolio/Experience — Role",    "Outfit",   "Medium",      18, "AUTO", 0,    "ORIGINAL" ],
];

// Map famille+style → nom de style texte (pour initialiser fontName avant characters)
const FONT_FOR_TS = {};
for (const [name, family, style] of TEXT_DEFS) {
  FONT_FOR_TS[name] = { family, style };
}

let tsCreated = 0;
for (const [name, family, style, size, lh, ls, textCase] of TEXT_DEFS) {
  try {
    const s      = figma.createTextStyle();
    s.name       = name;
    s.fontName   = { family, style };
    s.fontSize   = size;
    s.lineHeight = lh === "AUTO" ? { unit: "AUTO" } : { unit: "PIXELS", value: lh };
    if (ls > 0) s.letterSpacing = { unit: "PIXELS", value: ls };
    s.textCase   = textCase;
    textStyles[name] = s.id;   // ← liaison possible dès maintenant
    tsCreated++;
  } catch (e) {
    console.warn(`Style texte ignoré (${name}) :`, e.message);
  }
}
console.log(`✅ ${tsCreated} Text Styles créés`);

// ═══════════════════════════════════════════════════════════════════════════════
// 4 ─ HELPERS NŒUDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Crée un TextNode lié à un Text Style et un Paint Style.
 *
 * @param {string} chars         — contenu textuel
 * @param {string} textStyleKey  — clé dans textStyles  (ex: "Portfolio/Nav — CTA Label")
 * @param {string} fillStyleKey  — clé dans paintStyles (ex: "Portfolio/Almost White")
 * @param {object} [opts]
 *   opts.w  — largeur fixe (height devient auto)
 */
function mkTxt(chars, textStyleKey, fillStyleKey, opts = {}) {
  const t = figma.createText();

  // fontName doit être défini AVANT characters (contrainte API Figma)
  t.fontName = FONT_FOR_TS[textStyleKey] ?? { family: "Outfit", style: "Regular" };
  t.characters = chars;

  // Liaison Text Style — applique font, taille, lineHeight, letterSpacing, textCase
  if (textStyleKey && textStyles[textStyleKey]) {
    try { t.textStyleId = textStyles[textStyleKey]; }
    catch (e) { console.warn(`textStyleId(${textStyleKey}) :`, e.message); }
  }

  // Liaison Paint Style — couleur du texte
  if (fillStyleKey && paintStyles[fillStyleKey]) {
    try { t.fillStyleId = paintStyles[fillStyleKey]; }
    catch (e) { console.warn(`fillStyleId text (${fillStyleKey}) :`, e.message); }
  }

  // Largeur contrainte (hauteur s'adapte)
  if (opts.w) {
    t.textAutoResize = "HEIGHT";
    t.resize(opts.w, t.height);
  }

  return t;
}

/**
 * Crée un Component (◇) avec auto-layout et fill lié au Paint Style.
 *
 * @param {string}      name
 * @param {"HORIZONTAL"|"VERTICAL"} dir
 * @param {number}      padH         — padding horizontal
 * @param {number}      padV         — padding vertical
 * @param {number}      gap          — item spacing
 * @param {string|null} fillStyleKey — clé dans paintStyles, ou null pour fond transparent
 */
function mkComp(name, dir, padH, padV, gap, fillStyleKey) {
  const c = figma.createComponent();
  c.name                  = name;
  c.layoutMode            = dir;
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.paddingLeft  = c.paddingRight  = padH;
  c.paddingTop   = c.paddingBottom = padV;
  c.itemSpacing  = gap;
  c.clipsContent = false;

  if (fillStyleKey && paintStyles[fillStyleKey]) {
    try { c.fillStyleId = paintStyles[fillStyleKey]; }
    catch (e) { console.warn(`fillStyleId comp (${fillStyleKey}) :`, e.message); }
  } else {
    c.fills = [];
  }

  return c;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5 ─ KIT FRAME (conteneur, layout manuel)
// ═══════════════════════════════════════════════════════════════════════════════

const KIT = figma.createFrame();
KIT.name         = "🎨 julienbourcet.fr — Design System";
KIT.fills        = solid({ r: 0.94, g: 0.94, b: 0.95 });   // fond neutre kit, pas un token DS
KIT.clipsContent = false;
KIT.resize(2400, 200);
KIT.x = 0;
KIT.y = 0;
PAGE.appendChild(KIT);

let curY         = 80;
const LEFT       = 80;
const ROW_GAP    = 80;
const COMP_GAP   = 24;
const SECTION_LH = 34;

function addTitle(label) {
  const t = figma.createText();
  t.fontName      = { family: "Outfit", style: "ExtraBold" };
  t.fontSize      = 10;
  t.characters    = label.toUpperCase();
  t.fills         = solid({ r: 0, g: 0, b: 0 }, 0.4);  // label utilitaire kit, pas de token
  t.letterSpacing = { unit: "PIXELS", value: 1.5 };
  t.x = LEFT;
  t.y = curY;
  KIT.appendChild(t);
  curY += SECTION_LH;
}

function placeRow(items) {
  let xCursor = LEFT;
  let maxH    = 0;
  for (const item of items) {
    item.x = xCursor;
    item.y = curY;
    KIT.appendChild(item);
    xCursor += item.width + COMP_GAP;
    if (item.height > maxH) maxH = item.height;
  }
  curY += maxH + ROW_GAP;
}

/**
 * Assemble un ComponentSet.
 * Les variants doivent d'abord être enfants du même parent (PAGE)
 * pour satisfaire la contrainte de combineAsVariants.
 */
function makeVariantSet(setName, variants) {
  for (const v of variants) PAGE.appendChild(v);
  const set = figma.combineAsVariants(variants, PAGE);
  set.name  = setName;
  return set;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6 ─ COMPOSANTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── 6.1 NavButton  ────────────────────────────────────────────────────────────
// Variants : Theme = Light | Dark
// ─────────────────────────────────────────────────────────────────────────────

function buildNavBtn(variantName, isLight) {
  // Light → fond blanc + tiret/texte bleu   |   Dark → fond bleu + tiret/texte blanc
  const bgKey   = isLight ? "Portfolio/Almost White"  : "Portfolio/Primary Blue";
  const inkKey  = isLight ? "Portfolio/Primary Blue"  : "Portfolio/Almost White";

  const c = mkComp(variantName, "HORIZONTAL", 12, 8, 8, bgKey);
  c.counterAxisAlignItems = "CENTER";

  const tiret = figma.createRectangle();
  tiret.name  = "tiret";
  tiret.resize(32, 1);
  if (paintStyles[inkKey]) {
    try { tiret.fillStyleId = paintStyles[inkKey]; } catch (e) {}
  }
  c.appendChild(tiret);

  const t = mkTxt("Cases", "Portfolio/Nav — CTA Label", inkKey);
  t.name = "label";
  c.appendChild(t);
  return c;
}

addTitle("01 — NavButton (Theme=Light | Theme=Dark)");
placeRow([makeVariantSet("NavButton", [
  buildNavBtn("Theme=Light", true),
  buildNavBtn("Theme=Dark",  false),
])]);

// ── 6.2 EyeBrow  ──────────────────────────────────────────────────────────────
// Composant unique — numéro Fraunces + label Outfit ExtraBold

function buildEyebrow() {
  const c = mkComp("EyeBrow", "HORIZONTAL", 8, 6, 4, "Portfolio/Primary Blue");
  c.counterAxisAlignItems = "CENTER";

  const num = mkTxt("01 .", "Portfolio/Eyebrow — Number", "Portfolio/Almost White");
  const lbl = mkTxt("Contact",  "Portfolio/Eyebrow — Label",  "Portfolio/Almost White");
  num.name = "number";
  lbl.name = "label";
  c.appendChild(num);
  c.appendChild(lbl);
  return c;
}

addTitle("02 — EyeBrow");
placeRow([buildEyebrow()]);

// ── 6.3 Tag / Pill  ──────────────────────────────────────────────────────────
// Composant unique — fond Portfolio/Tag—Background + bordure Portfolio/Almost White

function buildTag(label) {
  const c = mkComp(label, "HORIZONTAL", 12, 6, 0, "Portfolio/Tag — Background");
  c.cornerRadius = 999;
  c.counterAxisAlignItems = "CENTER";

  // Stroke lié au style Almost White
  if (paintStyles["Portfolio/Almost White"]) {
    try { c.strokeStyleId = paintStyles["Portfolio/Almost White"]; } catch (e) {}
  }
  c.strokeWeight = 1;
  c.strokeAlign  = "INSIDE";

  const t = mkTxt(label, "Portfolio/Tag — Label", "Portfolio/Almost White");
  t.name = "label";
  c.appendChild(t);
  return c;
}

function tagRow(labels) {
  const bg = figma.createFrame();
  bg.name                   = "Tags — context (dark bg)";
  bg.layoutMode             = "HORIZONTAL";
  bg.primaryAxisSizingMode  = "AUTO";
  bg.counterAxisSizingMode  = "AUTO";
  bg.paddingLeft = bg.paddingRight = bg.paddingTop = bg.paddingBottom = 16;
  bg.itemSpacing            = 12;
  bg.counterAxisAlignItems  = "CENTER";
  if (paintStyles["Portfolio/Primary Blue"]) {
    try { bg.fillStyleId = paintStyles["Portfolio/Primary Blue"]; } catch (e) {}
  }
  for (const l of labels) bg.appendChild(buildTag(l));
  return bg;
}

addTitle("03 — Tag / Pill");
placeRow([tagRow(["accessibility", "design system", "artificial intelligence", "data"])]);

// ── 6.4 FormField  ────────────────────────────────────────────────────────────
// Variants : State = Default | Focus | Error

function buildFormField(variantName, state) {
  const isError  = state === "error";
  const isFocus  = state === "focus";
  const isFilled = state === "filled";

  const c = mkComp(variantName, "VERTICAL", 16, 16, 6, "Portfolio/Primary Blue");

  const lbl = mkTxt("Who's writing?", "Portfolio/Form — Label", "Portfolio/Almost White");
  lbl.name = "label";
  c.appendChild(lbl);

  // Input wrapper — bordure inférieure uniquement
  const inputWrap = figma.createFrame();
  inputWrap.name             = "input";
  inputWrap.resize(248, 36);
  inputWrap.fills            = [];
  inputWrap.strokeTopWeight    = 0;
  inputWrap.strokeLeftWeight   = 0;
  inputWrap.strokeRightWeight  = 0;
  inputWrap.strokeBottomWeight = 1;
  inputWrap.strokeWeight       = 1;

  // strokeStyleId déterminé par l'état
  const strokeKey = isError  ? "Portfolio/Error"
    : isFocus               ? "Portfolio/Almost White"
    :                         "Portfolio/Border — Subtle";
  if (paintStyles[strokeKey]) {
    try { inputWrap.strokeStyleId = paintStyles[strokeKey]; } catch (e) {}
  }

  // Texte dans le champ :
  //   Default  → placeholder grisé (Portfolio/Text — Placeholder, opacité 0.70)
  //   Focus    → placeholder grisé (idem Default, curseur actif implicite)
  //   Filled   → texte saisi plein blanc (Portfolio/Almost White, opacité 1.0)
  //   Error    → message d'erreur en rouge (Portfolio/Error)
  const inputText   = isFilled ? "Julien Bourcet"
    : isError                  ? "⚠  champ requis"
    :                            "your text here";
  const inputFill   = isFilled ? "Portfolio/Almost White"
    : isError                  ? "Portfolio/Error"
    :                            "Portfolio/Text — Placeholder";

  const ph = mkTxt(inputText, "Portfolio/Form — Placeholder", inputFill);
  ph.name = isFilled ? "value" : "placeholder";
  ph.x = 8;
  ph.y = 8;
  inputWrap.appendChild(ph);

  c.appendChild(inputWrap);
  return c;
}

addTitle("04 — FormField (State=Default | State=Focus | State=Filled | State=Error)");
placeRow([makeVariantSet("FormField", [
  buildFormField("State=Default", "default"),
  buildFormField("State=Focus",   "focus"),
  buildFormField("State=Filled",  "filled"),
  buildFormField("State=Error",   "error"),
])]);

// ── 6.5 CTAButton (submit)  ───────────────────────────────────────────────────
// Variants : State = Idle | Sending | Error

function buildCTA(variantName, labelStr) {
  const c = mkComp(variantName, "HORIZONTAL", 12, 8, 8, "Portfolio/Primary Blue");
  c.counterAxisAlignItems = "CENTER";

  const tiret = figma.createRectangle();
  tiret.name  = "tiret";
  tiret.resize(32, 1);
  if (paintStyles["Portfolio/Almost White"]) {
    try { tiret.fillStyleId = paintStyles["Portfolio/Almost White"]; } catch (e) {}
  }
  c.appendChild(tiret);

  const t = mkTxt(labelStr, "Portfolio/Nav — CTA Label", "Portfolio/Almost White");
  t.name = "label";
  c.appendChild(t);
  return c;
}

addTitle("05 — CTAButton / Submit (State=Idle | State=Sending | State=Error)");
placeRow([makeVariantSet("CTAButton", [
  buildCTA("State=Idle",    "Reach me"),
  buildCTA("State=Sending", "Sending..."),
  buildCTA("State=Error",   "Try again"),
])]);

// ── 6.6 ExternalLink  ────────────────────────────────────────────────────────
// Composant unique — label + icône ↗

function buildExternalLink(label) {
  const c = mkComp(`ExternalLink / ${label}`, "HORIZONTAL", 8, 6, 8, "Portfolio/Primary Blue");
  c.counterAxisAlignItems = "CENTER";

  const t = mkTxt(label, "Portfolio/Nav — CTA Label", "Portfolio/Almost White");
  t.name = "label";
  c.appendChild(t);

  // L'icône SVG inline ne supporte pas fillStyleId — couleur hardcodée en #fafafa
  const icon = figma.createNodeFromSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
         viewBox="0 0 24 24" fill="none" stroke="#fafafa"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>`);
  icon.name = "icon-external";
  c.appendChild(icon);
  return c;
}

addTitle("06 — ExternalLink");
placeRow([buildExternalLink("LinkedIn"), buildExternalLink("Medium")]);

// ── 6.7 ScrollDownButton  ────────────────────────────────────────────────────
// Composant unique — cercle + chevron SVG 32×32

function buildScrollDownBtn() {
  const c = figma.createComponent();
  c.name  = "ScrollDownButton";
  c.resize(32, 32);
  c.fills = [];

  // SVG inline — stroke #fafafa hardcodé (SVG ne supporte pas strokeStyleId)
  const icon = figma.createNodeFromSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
         viewBox="0 0 24 24" fill="none" stroke="#fafafa"
         stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m16 10-4 4-4-4"/>
    </svg>`);
  icon.name = "icon-chevron-circle";
  icon.x = 0;
  icon.y = 0;
  c.appendChild(icon);
  return c;
}

function scrollBtnWithContext() {
  const bg = figma.createFrame();
  bg.name         = "ScrollDownButton — context (dark bg)";
  bg.resize(80, 80);
  bg.cornerRadius = 8;
  if (paintStyles["Portfolio/Primary Blue"]) {
    try { bg.fillStyleId = paintStyles["Portfolio/Primary Blue"]; } catch (e) {}
  }
  const btn = buildScrollDownBtn();
  btn.x = 24;
  btn.y = 24;
  bg.appendChild(btn);
  return bg;
}

addTitle("07 — ScrollDownButton");
placeRow([scrollBtnWithContext()]);

// ── 6.8 CaseNavItem  ──────────────────────────────────────────────────────────
// Variants : State = Default | Active

function buildCaseNavItem(variantName, isActive) {
  const c = mkComp(variantName, "HORIZONTAL", 4, 4, 8, null);
  c.counterAxisAlignItems = "CENTER";

  const dot = figma.createEllipse();
  dot.name = "indicator";
  dot.resize(8, 8);

  if (isActive) {
    // Actif : fond plein blanc
    if (paintStyles["Portfolio/Almost White"]) {
      try { dot.fillStyleId = paintStyles["Portfolio/Almost White"]; } catch (e) {}
    }
    dot.strokes = [];
  } else {
    // Inactif : cercle vide avec contour blanc
    dot.fills = [];
    if (paintStyles["Portfolio/Almost White"]) {
      try { dot.strokeStyleId = paintStyles["Portfolio/Almost White"]; } catch (e) {}
    }
    dot.strokeWeight = 1;
  }
  c.appendChild(dot);

  const tsKey = isActive ? "Portfolio/CaseNav — Active" : "Portfolio/CaseNav — Default";
  const t = mkTxt("SNCF CONNECT", tsKey, "Portfolio/Almost White");
  t.name = "label";
  c.appendChild(t);
  return c;
}

addTitle("08 — CaseNavItem (State=Default | State=Active)");
placeRow([makeVariantSet("CaseNavItem", [
  buildCaseNavItem("State=Default", false),
  buildCaseNavItem("State=Active",  true),
])]);

// ── 6.9 SubNavItem  ──────────────────────────────────────────────────────────
// Variants : State = Default | Active

function buildSubNavItem(variantName, isActive) {
  const c = mkComp(variantName, "HORIZONTAL", 0, 0, 8, null);
  c.counterAxisAlignItems = "CENTER";

  const tiret = figma.createRectangle();
  tiret.name  = "tiret";
  tiret.resize(isActive ? 16 : 8, 1);
  if (paintStyles["Portfolio/Almost White"]) {
    try { tiret.fillStyleId = paintStyles["Portfolio/Almost White"]; } catch (e) {}
  }
  c.appendChild(tiret);

  const tsKey = isActive ? "Portfolio/SubNav — Active" : "Portfolio/SubNav — Default";
  const t = mkTxt("Role", tsKey, "Portfolio/Almost White");
  t.name = "label";
  c.appendChild(t);
  return c;
}

addTitle("09 — SubNavItem (State=Default | State=Active)");
placeRow([makeVariantSet("SubNavItem", [
  buildSubNavItem("State=Default", false),
  buildSubNavItem("State=Active",  true),
])]);

// ── 6.10 SectionHeading  ─────────────────────────────────────────────────────
// Composant unique — Fraunces Bold Italic 22 / 30.8

function buildSectionHeading() {
  const c = mkComp("SectionHeading", "VERTICAL", 16, 16, 0, "Portfolio/Primary Blue");

  const t = mkTxt(
    "« Simplicity is inexhaustible »",
    "Portfolio/Heading — Section",
    "Portfolio/Almost White",
    { w: 440 }
  );
  t.name = "heading";
  c.appendChild(t);
  return c;
}

addTitle("10 — SectionHeading (Fraunces Bold Italic 22 / 30.8)");
placeRow([buildSectionHeading()]);

// ── 6.11 BodyText  ────────────────────────────────────────────────────────────
// Composant unique — Outfit Medium 14 / 24.5

function buildBodyText() {
  const c = mkComp("BodyText", "VERTICAL", 16, 16, 0, "Portfolio/Primary Blue");

  const t = mkTxt(
    "Self-taught, I discovered the graphic arts in 1998. My career path consisted of training and working first as a computer graphics artist, as a webdesigner, then as a UX/UI designer and now as a product designer.",
    "Portfolio/Body",
    "Portfolio/Almost White",
    { w: 440 }
  );
  t.name = "body";
  c.appendChild(t);
  return c;
}

addTitle("11 — BodyText (Outfit Medium 14 / 24.5)");
placeRow([buildBodyText()]);

// ── 6.12 ExperienceEntry  ────────────────────────────────────────────────────
// Composant unique — date Fraunces + rôle Outfit, 18px

function buildExperienceEntry() {
  const c = mkComp("ExperienceEntry", "HORIZONTAL", 16, 12, 4, "Portfolio/Primary Blue");
  c.counterAxisAlignItems = "MIN";

  const date = mkTxt("2023 - 2025 .", "Portfolio/Experience — Date", "Portfolio/Almost White");
  const role = mkTxt("Frontguys / Senior Product Designer", "Portfolio/Experience — Role", "Portfolio/Almost White");
  date.name = "date";
  role.name = "role";
  c.appendChild(date);
  c.appendChild(role);
  return c;
}

addTitle("12 — ExperienceEntry (date Fraunces + rôle Outfit, 18px)");
placeRow([buildExperienceEntry()]);

// ═══════════════════════════════════════════════════════════════════════════════
// 7 ─ FINALISATION
// ═══════════════════════════════════════════════════════════════════════════════

KIT.resize(2400, curY + 64);
figma.viewport.scrollAndZoomIntoView([KIT]);

figma.notify(
  "✅ 9 couleurs · 14 styles texte · 12 composants (+ variants, FormField=4 états) — styles liés aux nœuds",
  { timeout: 6000 }
);
console.log("✅ Done — frame « 🎨 julienbourcet.fr — Design System » créé sur le canvas.");
console.log("   Paint Styles créés :", Object.keys(paintStyles));
console.log("   Text Styles créés :", Object.keys(textStyles));

})().catch(e => {
  console.error("❌", e);
  figma.notify("Erreur — voir la console pour les détails.", { error: true });
});
