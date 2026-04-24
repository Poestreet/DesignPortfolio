/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Stack technique — julienbourcet.fr v2
 * Script console Figma (Plugins › Development › Open Console)
 *
 * Crée un frame de documentation natif Figma décrivant le stack technique :
 * .astro + .tsx → Astro Build → /dist → Netlify → Navigateur
 *
 * Polices requises : Outfit Regular · Medium · SemiBold · ExtraBold
 * ─────────────────────────────────────────────────────────────────────────────
 */

(async () => {

// ── UTILS ─────────────────────────────────────────────────────────────────────

function hex(h) {
  return {
    r: parseInt(h.slice(1, 3), 16) / 255,
    g: parseInt(h.slice(3, 5), 16) / 255,
    b: parseInt(h.slice(5, 7), 16) / 255,
  };
}
function solid(color, a = 1) {
  return [{ type: "SOLID", color, opacity: a }];
}

// ── LOAD FONTS ────────────────────────────────────────────────────────────────

await Promise.all([
  figma.loadFontAsync({ family: "Outfit", style: "Regular" }),
  figma.loadFontAsync({ family: "Outfit", style: "Medium" }),
  figma.loadFontAsync({ family: "Outfit", style: "SemiBold" }),
  figma.loadFontAsync({ family: "Outfit", style: "ExtraBold" }),
]);

// ── COLORS ────────────────────────────────────────────────────────────────────

const C = {
  bg:         hex("#f5f5f7"),
  white:      hex("#fafafa"),
  brand:      hex("#070071"),
  brand2:     hex("#1a0a8c"),
  brand3:     hex("#2a1aa0"),
  green:      hex("#e8f5e9"),
  greenBorder:hex("#a5d6a7"),
  greenText:  hex("#1b5e20"),
  amber:      hex("#fff8e1"),
  amberBorder:hex("#ffe082"),
  amberText:  hex("#5d4037"),
  blue:       hex("#e3f2fd"),
  blueBorder: hex("#90caf9"),
  blueText:   hex("#0d47a1"),
  violet:     hex("#f3e8ff"),
  violetText: hex("#4a1d96"),
  text:       hex("#1a1a2e"),
  muted:      hex("#888888"),
  border:     hex("#e0e0f0"),
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

const PAGE = figma.currentPage;

function mkText(chars, opts = {}) {
  const t = figma.createText();
  t.fontName      = { family: "Outfit", style: opts.style || "Regular" };
  t.characters    = chars;
  t.fontSize      = opts.size  || 13;
  t.lineHeight    = opts.lh    ? { unit: "PIXELS", value: opts.lh } : { unit: "AUTO" };
  t.letterSpacing = opts.ls    ? { unit: "PERCENT", value: opts.ls } : { unit: "PERCENT", value: 0 };
  t.fills         = solid(opts.color || C.text);
  if (opts.opacity !== undefined) t.opacity = opts.opacity;
  if (opts.upper)   t.textCase = "UPPER";
  if (opts.w) {
    t.textAutoResize = "HEIGHT";
    t.resize(opts.w, t.height);
  }
  return t;
}

function mkFrame(opts = {}) {
  const f = figma.createFrame();
  f.name                  = opts.name  || "Frame";
  f.fills                 = opts.fills || [];
  f.cornerRadius          = opts.radius || 0;
  f.layoutMode            = opts.dir   || "VERTICAL";
  f.primaryAxisSizingMode = opts.pSize || "AUTO";
  f.counterAxisSizingMode = opts.cSize || "AUTO";
  f.paddingTop            = opts.pt    ?? opts.pad ?? 0;
  f.paddingBottom         = opts.pb    ?? opts.pad ?? 0;
  f.paddingLeft           = opts.pl    ?? opts.padH ?? 0;
  f.paddingRight          = opts.pr    ?? opts.padH ?? 0;
  f.itemSpacing           = opts.gap   || 0;
  f.primaryAxisAlignItems    = opts.pAlign || "MIN";
  f.counterAxisAlignItems    = opts.cAlign || "MIN";
  if (opts.stroke) {
    f.strokes      = solid(opts.stroke);
    f.strokeWeight = opts.sw || 1.5;
    f.strokeAlign  = "INSIDE";
  }
  if (opts.w !== undefined) { f.counterAxisSizingMode = "FIXED"; f.resize(opts.w, 100); }
  return f;
}

function tag(label, textColor, bgColor, borderColor) {
  const f = mkFrame({
    name: "tag",
    fills: solid(bgColor, 0.18),
    radius: 20,
    dir: "HORIZONTAL",
    pad: 3,
    padH: 10,
    gap: 4,
    pAlign: "CENTER",
    cAlign: "CENTER",
  });
  if (borderColor) {
    f.strokes      = solid(borderColor, 0.4);
    f.strokeWeight = 1;
    f.strokeAlign  = "INSIDE";
  }
  const t = mkText(label, { style: "SemiBold", size: 10, ls: 5, upper: true, color: textColor });
  f.appendChild(t);
  return f;
}

function tagRow(labels, textColor, bgColor, borderColor) {
  const row = mkFrame({ name: "tags", dir: "HORIZONTAL", gap: 6 });
  labels.forEach(l => row.appendChild(tag(l, textColor, bgColor, borderColor)));
  return row;
}

// ── LAYER CARD ────────────────────────────────────────────────────────────────

function layerCard({ num, section, title, desc, tags, fills, textColor, monoLines }) {
  const W = 640;
  const card = mkFrame({
    name: `${num} · ${section}`,
    fills,
    radius: 12,
    pad: 20,
    padH: 22,
    gap: 8,
    w: W,
  });

  const label = mkText(`${num} · ${section}`, {
    style: "ExtraBold", size: 10, ls: 12, upper: true,
    color: textColor, opacity: 0.5, w: W - 44,
  });
  card.appendChild(label);

  const titleNode = mkText(title, {
    style: "ExtraBold", size: 16,
    color: textColor, w: W - 44,
  });
  card.appendChild(titleNode);

  const descNode = mkText(desc, {
    style: "Regular", size: 12, lh: 19,
    color: textColor, opacity: 0.8, w: W - 44,
  });
  card.appendChild(descNode);

  if (monoLines) {
    const mono = mkFrame({
      name: "mono",
      fills: solid(textColor, 0.12),
      radius: 6,
      pad: 10,
      padH: 14,
      gap: 0,
    });
    monoLines.forEach(line => {
      const t = mkText(line, {
        style: line.startsWith(" ") ? "Regular" : "Medium",
        size: 11, lh: 19, color: textColor,
        opacity: line.includes("←") ? 0.5 : 1,
        w: W - 44 - 28,
      });
      mono.appendChild(t);
    });
    card.appendChild(mono);
  }

  if (tags) {
    card.appendChild(tagRow(tags, textColor, textColor, textColor));
  }

  return card;
}

// ── ARROW ─────────────────────────────────────────────────────────────────────

function arrow(label) {
  const col = mkFrame({ name: "arrow", dir: "VERTICAL", gap: 0, cAlign: "CENTER" });

  const line1 = figma.createRectangle();
  line1.resize(2, 16);
  line1.fills = solid(C.muted, 0.5);
  col.appendChild(line1);

  const lbl = mkText(label, {
    style: "Regular", size: 10, ls: 5, upper: true,
    color: C.muted,
  });
  col.appendChild(lbl);

  const line2 = figma.createRectangle();
  line2.resize(2, 16);
  line2.fills = solid(C.muted, 0.5);
  col.appendChild(line2);

  const tip = figma.createPolygon();
  tip.pointCount = 3;
  tip.resize(10, 7);
  tip.fills = solid(C.muted, 0.5);
  tip.rotation = 180;
  col.appendChild(tip);

  col.counterAxisAlignItems = "CENTER";

  return col;
}

// ── LIB CARD ─────────────────────────────────────────────────────────────────

function libCard(name, role) {
  const f = mkFrame({
    name,
    fills: solid(C.white),
    radius: 8,
    pad: 12,
    padH: 14,
    gap: 5,
    stroke: C.border,
    sw: 1.5,
    w: 185,
  });

  const n = mkText(name, { style: "ExtraBold", size: 12, color: C.brand, w: 185 - 28 });
  const r = mkText(role, { style: "Regular", size: 11, lh: 17, color: C.text, opacity: 0.7, w: 185 - 28 });

  f.appendChild(n);
  f.appendChild(r);
  return f;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — BUILD DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

const ROOT = mkFrame({
  name: "Stack technique — julienbourcet.fr v2",
  fills: solid(C.bg),
  radius: 16,
  pad: 40,
  padH: 48,
  gap: 0,
  w: 736,
});

// ── Header ────────────────────────────────────────────────────────────────────

const header = mkFrame({ name: "header", gap: 6, pad: 0, w: 640 });

header.appendChild(mkText("Stack technique — julienbourcet.fr v2", {
  style: "ExtraBold", size: 15, ls: 6, upper: true,
  color: C.brand, w: 640,
}));
header.appendChild(mkText("De la source .astro + .tsx au navigateur — architecture Islands avec Astro + Netlify", {
  style: "Regular", size: 12, color: C.muted, w: 640,
}));

ROOT.appendChild(header);

const sp0 = figma.createRectangle();
sp0.resize(1, 28);
sp0.fills = [];
ROOT.appendChild(sp0);

// ── Layer 01 — Source ─────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "01", section: "Source",
  title: "Pages .astro + React Islands .tsx",
  desc: "Le code source mélange deux syntaxes. Les pages .astro définissent la structure HTML statique. Les composants .tsx (React + TypeScript) sont des « islands » : des zones interactives hydratées sélectivement côté client via la directive client:load.",
  monoLines: [
    "src/",
    "  pages/                ← index · about · cases · contact (.astro)",
    "  components/",
    "    islands/            ← HomepageIsland · CasesIsland · ContactIsland (.tsx)",
    "    mobile/             ← MobileHomePage · MobileCasesPage · MobileContactPage (.tsx)",
    "    StaticBackground.astro  ← fond animé CSS-only, présent avant hydration",
    "    Reveal.tsx          ← composant d'animation d'entrée (motion/react)",
    "  lib/",
    "    usePageReady.ts     ← hook custom, synchronise React avec astro:page-load",
    "    navigate.ts         ← wrapper navigation View Transitions",
    "    animations.ts       ← constantes d'easing partagées",
    "  styles/global.css     ← Tailwind v4 + tokens + focus-visible WCAG 2.4.11",
  ],
  tags: ["Astro 4", "React 18", "TypeScript 5", "Islands Architecture"],
  fills: solid(C.brand),
  textColor: C.white,
}));

ROOT.appendChild(arrow("compile + bundle"));

// ── Layer 02 — Astro Build ────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "02", section: "Outil de build",
  title: "Astro Build — compilateur + bundler",
  desc: "Astro orchestre la compilation. Les pages .astro sont rendues en HTML pur au build (SSG). Les islands React sont compilées en chunks JS séparés via Vite (sous le capot) et ne s'hydratent que là où client:load est déclaré — zéro JS superflu envoyé au navigateur.",
  monoLines: [
    "1 · Compile les pages .astro → HTML statique",
    "2 · Compile les islands .tsx → chunks JS isolés (code splitting automatique)",
    "3 · Compile Tailwind v4 → CSS (purge les classes inutilisées)",
    "4 · Résout les imports figma:asset/ → src/assets/ (plugin Vite custom)",
    "5 · Génère public/sitemap.xml + robots.txt + llms.txt (statiques)",
    "6 · Minification + hash des assets",
  ],
  tags: ["astro build", "Vite (interne)", "@astrojs/react", "SSG", "Code splitting"],
  fills: solid(C.brand2),
  textColor: C.white,
}));

ROOT.appendChild(arrow("génère"));

// ── Layer 03 — /dist ──────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "03", section: "Build output",
  title: "/dist — fichiers statiques",
  desc: "Le résultat de « npm run build ». Chaque page .astro devient un index.html. Les islands React sont des chunks JS séparés, chargés à la demande. Aucun serveur Node requis en production — n'importe quel CDN peut les servir.",
  monoLines: [
    "dist/",
    "  index.html              ← HTML complet généré par Astro",
    "  about/index.html",
    "  cases/index.html",
    "  contact/index.html",
    "  _astro/",
    "    HomepageIsland.[hash].js   ← island React hydratée côté client",
    "    CasesIsland.[hash].js",
    "    ContactIsland.[hash].js",
    "    index.[hash].css           ← Tailwind purgé + tokens",
    "  sitemap.xml · robots.txt · llms.txt",
  ],
  tags: ["Site statique", "HTML par page", "JS islands séparés", "Pas de Node en prod"],
  fills: solid(C.green),
  textColor: C.greenText,
}));

ROOT.appendChild(arrow("git push → auto-deploy"));

// ── Layer 04 — Netlify ────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "04", section: "Hébergement & CI/CD",
  title: "Netlify — deploy automatique + Forms",
  desc: "Un git push sur main déclenche automatiquement le build et le deploy sur Netlify — pas de FTP, pas d'upload manuel. Netlify gère aussi le formulaire de contact via Netlify Forms : les soumissions sont reçues et stockées sans backend, avec détection automatique du champ form-name.",
  monoLines: [
    "Git push origin main",
    "  → Netlify détecte le push",
    "  → Lance « npm run build » dans son environnement",
    "  → Deploy du contenu /dist sur le CDN global Netlify",
    "  → URL de preview générée pour chaque branche",
    "",
    "Netlify Forms (formulaire contact)",
    "  → POST /contact/ avec Content-Type: application/x-www-form-urlencoded",
    "  → form-name: contact  ← identifiant Netlify",
    "  → Soumissions accessibles dans le dashboard Netlify",
  ],
  tags: ["Netlify", "CI/CD auto", "Netlify Forms", "CDN global", "Deploy preview"],
  fills: solid(C.violet),
  textColor: C.violetText,
}));

ROOT.appendChild(arrow("HTTP request"));

// ── Layer 05 — Navigateur ─────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "05", section: "Navigateur — Runtime",
  title: "Astro View Transitions + React Islands",
  desc: "Le navigateur reçoit du HTML complet dès le premier octet (pas de \"coquille vide\" comme en SPA). Les islands React s'hydratent au chargement. La navigation entre pages est gérée par les View Transitions Astro (animation CSS native), synchronisée avec les composants React via le hook usePageReady.",
  monoLines: [
    "Astro View Transitions  → slide entre pages sans rechargement (::view-transition)",
    "usePageReady()          → listener module-level sur astro:page-load,",
    "                          gates l'animation d'entrée React",
    "StaticBackground.astro  → fond animé CSS-only visible avant hydration React",
    "motion/react (v12)      → animations springs dans les islands",
    "Tailwind CSS v4         → classes utilitaires, pas de runtime JS",
  ],
  tags: ["View Transitions", "usePageReady", "motion/react", "Tailwind v4", "Islands hydration"],
  fills: solid(C.blue),
  textColor: C.blueText,
}));

// ── Spacer + Libs title ───────────────────────────────────────────────────────

const sp1 = figma.createRectangle();
sp1.resize(1, 32);
sp1.fills = [];
ROOT.appendChild(sp1);

ROOT.appendChild(mkText("Librairies clés", {
  style: "ExtraBold", size: 10, ls: 12, upper: true,
  color: C.muted, w: 640,
}));

const sp2 = figma.createRectangle();
sp2.resize(1, 12);
sp2.fills = [];
ROOT.appendChild(sp2);

// ── Libs grid ─────────────────────────────────────────────────────────────────

const libsGrid = mkFrame({
  name: "libs-grid",
  dir: "HORIZONTAL",
  gap: 10,
  w: 640,
  cSize: "AUTO",
});
libsGrid.layoutWrap = "WRAP";
libsGrid.itemSpacing = 10;
libsGrid.counterAxisSpacing = 10;

[
  ["Astro 4",           "Framework MPA/SSG. Génère du HTML statique au build. Les islands React sont hydratées sélectivement — zéro JS envoyé pour le contenu statique."],
  ["React 18",          "Utilisé uniquement dans les islands interactives. Gère le state local, les animations et les formulaires côté client."],
  ["motion/react v12",  "Animations déclaratives dans les islands React. Springs, variants, animations d'entrée synchronisées avec usePageReady."],
  ["Tailwind CSS v4",   "Classes utilitaires dans le JSX et les templates .astro. Nouvelle API CSS-first sans fichier de config JS. Purgé au build."],
  ["TypeScript 5",      "Typage statique pour les islands .tsx et les libs. Détecte les erreurs à l'écriture, pas à l'exécution."],
  ["Astro View Trans.", "API native du navigateur (pas de lib externe). Anime les transitions entre pages avec des keyframes CSS déclarés dans global.css."],
].forEach(([name, role]) => libsGrid.appendChild(libCard(name, role)));

ROOT.appendChild(libsGrid);

// ── Place on canvas ───────────────────────────────────────────────────────────

PAGE.appendChild(ROOT);
ROOT.x = 0;
ROOT.y = 0;

figma.viewport.scrollAndZoomIntoView([ROOT]);
figma.notify("✅ Diagramme « Stack technique v2 » créé sur la page courante");

})();
