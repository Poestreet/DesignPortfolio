/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Stack technique — julienbourcet.fr
 * Script console Figma (Plugins › Development › Open Console)
 *
 * Crée un frame de documentation natif Figma décrivant le stack technique :
 * TSX → Vite → /dist → FTP → Navigateur
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
  text:       hex("#1a1a2e"),
  muted:      hex("#888888"),
  border:     hex("#e0e0f0"),
  tagBg:      hex("#ffffff"),
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

  // Label
  const label = mkText(`${num} · ${section}`, {
    style: "ExtraBold", size: 10, ls: 12, upper: true,
    color: textColor, opacity: 0.5, w: W - 44,
  });
  card.appendChild(label);

  // Title
  const titleNode = mkText(title, {
    style: "ExtraBold", size: 16,
    color: textColor, w: W - 44,
  });
  card.appendChild(titleNode);

  // Description
  const descNode = mkText(desc, {
    style: "Regular", size: 12, lh: 19,
    color: textColor, opacity: 0.8, w: W - 44,
  });
  card.appendChild(descNode);

  // Mono block (optional)
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

  // Tags
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

  // Arrow tip (triangle via vector)
  const tip = figma.createPolygon();
  tip.pointCount = 3;
  tip.resize(10, 7);
  tip.fills = solid(C.muted, 0.5);
  tip.rotation = 180;
  col.appendChild(tip);

  // Center horizontally
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
  name: "Stack technique — julienbourcet.fr",
  fills: solid(C.bg),
  radius: 16,
  pad: 40,
  padH: 48,
  gap: 0,
  w: 736,
});

// ── Header ────────────────────────────────────────────────────────────────────

const header = mkFrame({ name: "header", gap: 6, pad: 0, w: 640 });

header.appendChild(mkText("Stack technique — julienbourcet.fr", {
  style: "ExtraBold", size: 15, ls: 6, upper: true,
  color: C.brand, w: 640,
}));
header.appendChild(mkText("De la source .tsx au navigateur — comment chaque outil s'imbrique", {
  style: "Regular", size: 12, color: C.muted, w: 640,
}));

ROOT.appendChild(header);

// Spacer
const sp0 = figma.createRectangle();
sp0.resize(1, 28);
sp0.fills = [];
ROOT.appendChild(sp0);

// ── Layer 01 — Source ─────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "01", section: "Source",
  title: "Fichiers .tsx — React + TypeScript",
  desc: "Le code que tu écris. Chaque composant est un fichier .tsx — du JSX (syntaxe HTML dans JS) typé avec TypeScript. TypeScript détecte les erreurs avant que le navigateur ne les voit.",
  monoLines: [
    "src/",
    "  main.tsx          ← point d'entrée, monte React dans le DOM",
    "  app/",
    "    App.tsx          ← racine, branche le Router",
    "    routes.tsx        ← définit /  /cases  /about  /contact",
    "    pages/            ← Homepage · CasesPage · AboutPage · ContactPage",
    "    components/       ← nav, boutons, composants réutilisables",
    "  styles/index.css    ← Tailwind + règles focus-visible",
  ],
  tags: ["React 18", "TypeScript", "JSX → TSX"],
  fills: solid(C.brand),
  textColor: C.white,
}));

ROOT.appendChild(arrow("transpile + bundle"));

// ── Layer 02 — Vite ───────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "02", section: "Outil de build",
  title: "Vite — le compilateur",
  desc: "Vite lit tous les fichiers .tsx, les transforme en JavaScript pur que le navigateur comprend, et regroupe tout en fichiers optimisés. Il gère aussi le serveur de dev local avec hot reload instantané.",
  monoLines: [
    "1 · Lit main.tsx (point d'entrée)",
    "2 · Compile TypeScript → JavaScript",
    "3 · Compile Tailwind → CSS (purge les classes inutilisées)",
    "4 · Tree-shaking (supprime le code mort)",
    "5 · Minification + hash des noms de fichiers",
  ],
  tags: ["vite build", "@vitejs/plugin-react", "@tailwindcss/vite", "ESM natif"],
  fills: solid(C.brand2),
  textColor: C.white,
}));

ROOT.appendChild(arrow("génère"));

// ── Layer 03 — /dist ──────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "03", section: "Build output",
  title: "/dist — fichiers statiques",
  desc: "Le résultat de « npm run build ». Des fichiers statiques : pas de serveur Node, pas de base de données. N'importe quel hébergeur peut les servir.",
  monoLines: [
    "dist/",
    "  index.html              ← unique HTML, point d'entrée",
    "  assets/index-[hash].js  ← tout le JS bundlé + minifié",
    "  assets/index-[hash].css ← tout le CSS (Tailwind purgé)",
  ],
  tags: ["Site statique", "Pas de Node en prod"],
  fills: solid(C.green),
  textColor: C.greenText,
}));

ROOT.appendChild(arrow("upload FTP"));

// ── Layer 04 — Serveur ────────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "04", section: "Hébergement",
  title: "Serveur — public_html/",
  desc: "Les fichiers /dist sont uploadés via FTP dans le dossier public_html de l'hébergeur. Le serveur ne fait que les servir statiquement — il n'exécute rien.",
  monoLines: [
    "1 · Récupérer les credentials FTP (hôte, login, mot de passe, port)",
    "2 · Vérifier que le dossier cible est public_html",
    "3 · Tester manuellement avec FileZilla avant d'automatiser",
    "4 · Upload du contenu de /dist",
  ],
  tags: ["FTP upload", "FileZilla", "Fichiers statiques"],
  fills: solid(C.amber),
  textColor: C.amberText,
}));

ROOT.appendChild(arrow("HTTP request"));

// ── Layer 05 — Navigateur ─────────────────────────────────────────────────────

ROOT.appendChild(layerCard({
  num: "05", section: "Navigateur — Runtime",
  title: "React s'exécute côté client",
  desc: "Le navigateur télécharge index.html → charge le JS → React monte l'application dans la <div id=\"root\">. Toute la navigation est ensuite gérée par JavaScript, sans rechargement de page.",
  monoLines: [
    "React Router  → écoute l'URL, affiche la bonne page sans rechargement",
    "Framer Motion → anime les composants (springs, stagger, transitions)",
    "Tailwind CSS  → classes utilitaires appliquées dans le HTML généré",
    "Virtual DOM   → React ne redessine que ce qui change, pas toute la page",
  ],
  tags: ["React Router", "Framer Motion", "Tailwind CSS", "Virtual DOM"],
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
  ["React",         "Construit l'interface en composants. Gère le state et le re-render automatique quand les données changent."],
  ["TypeScript",    "Ajoute les types au JavaScript. Détecte les erreurs à l'écriture, pas à l'exécution."],
  ["Vite",          "Compile et bundle le code source. Dev server ultra-rapide avec HMR (hot module replacement)."],
  ["React Router",  "Gère les URLs (/cases, /about…) côté client. La page ne se recharge pas lors de la navigation."],
  ["Framer Motion", "Animations déclaratives dans les composants React. Springs, stagger, transitions de page."],
  ["Tailwind CSS",  "Classes CSS utilitaires dans le JSX. Vite purge les classes inutilisées au build."],
].forEach(([name, role]) => libsGrid.appendChild(libCard(name, role)));

ROOT.appendChild(libsGrid);

// ── Place on canvas ───────────────────────────────────────────────────────────

PAGE.appendChild(ROOT);
ROOT.x = 0;
ROOT.y = 0;

figma.viewport.scrollAndZoomIntoView([ROOT]);
figma.notify("✅ Diagramme « Stack technique » créé sur la page courante");

})();
