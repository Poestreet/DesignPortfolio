# julienbourcet.fr — v2 (Astro)

Portfolio de Julien Bourcet. Migration de la v1 React SPA vers Astro SSG.

## Installation

```bash
cd v2
npm install
npm run dev
```

Le dev server démarre sur http://localhost:4321

## Build

```bash
npm run build
# → génère /dist avec les pages HTML statiques
```

## Structure

```
src/
├── pages/                  # Routing fichier-système Astro
│   ├── index.astro         # /
│   ├── cases.astro         # /cases
│   ├── about.astro         # /about
│   └── contact.astro       # /contact
├── components/
│   ├── islands/            # Composants React (client:load)
│   │   ├── HomepageIsland.tsx
│   │   ├── AboutIsland.tsx
│   │   ├── ContactIsland.tsx
│   │   ├── CasesIsland.tsx
│   │   ├── AnimatedBackground.tsx
│   │   └── Reveal.tsx
│   └── mobile/             # Composants mobiles (inclus dans les islands)
├── lib/
│   ├── animations.ts       # Constantes partagées Framer Motion
│   ├── navigate.ts         # Shim useNavigate → astro:transitions/client
│   └── masks/              # SVG data URIs (masques Homepage)
├── assets/                 # Images (figma:asset/ résolu par astro.config.mjs)
└── styles/
    └── global.css          # Tailwind 4 + tokens + skip link + View Transitions
public/
├── robots.txt
├── llms.txt
└── og/                     # OG images 1200×630px (à créer depuis Figma)
    ├── og-home.jpg
    ├── og-cases.jpg
    ├── og-about.jpg
    └── og-contact.jpg
```

## Déploiement Netlify

1. Connecter le dépôt GitHub sur Netlify
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Ajouter le domaine `julienbourcet.fr` dans les settings
5. Mettre à jour les DNS (A/CNAME → Netlify)

## Checklist avant déploiement

### OG Images
- [ ] Exporter `og-home.jpg` depuis Figma (1200×630px)
- [ ] Exporter `og-cases.jpg`
- [ ] Exporter `og-about.jpg`
- [ ] Exporter `og-contact.jpg`

### A11y
- [ ] WAVE sur les 4 pages (0 erreur)
- [ ] W3C Validator sur les 4 pages (0 erreur)
- [ ] Navigation clavier complète (Tab, Shift+Tab, Enter)
- [ ] Test VoiceOver macOS — Homepage et Cases
- [ ] Vérifier `lang="fr"` sur toutes les pages ✅
- [ ] Vérifier hiérarchie de titres h1 → h2 → h3 ✅

### SEO
- [ ] Lighthouse SEO = 100 sur les 4 pages
- [ ] `sitemap.xml` accessible (généré automatiquement par @astrojs/sitemap)
- [ ] `robots.txt` accessible ✅
- [ ] `llms.txt` accessible ✅
- [ ] OG tags fonctionnels — test via https://opengraph.xyz

### Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Core Web Vitals dans le vert (LCP, CLS, INP)

## Notes techniques

### figma:asset/
Les imports `figma:asset/HASH.ext` sont résolus par un plugin Vite dans `astro.config.mjs`.
Les fichiers images sont dans `src/assets/` (copiés depuis la v1).

### useNavigate
Remplacé par un shim (`src/lib/navigate.ts`) qui utilise `navigate()` d'Astro View Transitions.
Les animations de slide entre pages sont préservées depuis JavaScript.

### Page transitions
Gérées par l'API View Transitions du navigateur (`::view-transition-new`).
Slide depuis la droite sur desktop, depuis le bas sur mobile.
`prefers-reduced-motion` : transitions désactivées automatiquement.
