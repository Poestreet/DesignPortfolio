# julienbourcet.fr

Portfolio de Julien Bourcet — Senior Product Designer.
Construit avec Astro (SSG) + React islands + Framer Motion + Tailwind 4.

## Stack

| Outil | Rôle |
|---|---|
| Astro 4 | SSG — routing fichier-système, View Transitions |
| React 18 + `@astrojs/react` | Islands interactifs (`client:load`) |
| Framer Motion (`motion`) | Animations, transitions de pages |
| Tailwind CSS 4 | Utilitaires CSS |
| Netlify | Hébergement, CI/CD (build auto sur push `main`) |

## Installation

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Build

```bash
npm run build
# → génère /dist avec les pages HTML statiques
```

## Structure

```
src/
├── pages/                        # Routing fichier-système Astro
│   ├── index.astro               # /
│   ├── cases.astro               # /cases
│   ├── about.astro               # /about
│   └── contact.astro             # /contact
├── components/
│   ├── ExternalLinkIcon.tsx      # Icône lien externe — source unique
│   ├── StaticBackground.astro   # Fond statique SSR (SEO-safe)
│   ├── islands/                  # Composants React hydratés client
│   │   ├── HomepageIsland.tsx
│   │   ├── AboutIsland.tsx
│   │   ├── CasesIsland.tsx
│   │   ├── ContactIsland.tsx
│   │   ├── AnimatedBackground.tsx
│   │   └── Reveal.tsx
│   └── mobile/                   # Vues mobile (incluses dans les islands)
│       ├── MobileAboutPage.tsx
│       ├── MobileCasesPage.tsx
│       └── MobileContactPage.tsx
├── lib/
│   ├── animations.ts             # Constantes Framer Motion partagées
│   ├── navigate.ts               # Shim useNavigate → astro:transitions
│   ├── usePageReady.ts           # Hook — attend la fin des View Transitions
│   └── masks/                    # SVG data URIs (masques Homepage)
└── styles/
    └── global.css                # Tailwind 4 + tokens + skip link + View Transitions
public/
├── assets/                       # Images servies statiquement
├── og/                           # OG images 1200×630px
├── llms.txt
├── robots.txt
└── sitemap.xml
archives/
└── v1/                           # Ancienne version React SPA (référence uniquement)
```

## Déploiement Netlify

- **Base directory** : *(vide — racine du repo)*
- **Build command** : `npm run build`
- **Publish directory** : `dist`

Push sur `main` → build automatique.

## Checklist avant mise en ligne

### OG Images
- [ ] Exporter `og/OGimage.png` depuis Figma (1200×630px)

### Accessibilité
- [ ] WAVE sur les 4 pages (0 erreur)
- [ ] W3C Validator sur les 4 pages (0 erreur)
- [ ] Navigation clavier complète (Tab, Shift+Tab, Enter)
- [ ] Test VoiceOver macOS — Homepage et Cases
- [ ] Hiérarchie de titres h1 → h2 → h3 vérifiée ✅
- [ ] `lang="en"` sur toutes les pages ✅

### SEO
- [ ] Lighthouse SEO = 100 sur les 4 pages
- [ ] `sitemap.xml` accessible
- [ ] `robots.txt` accessible ✅
- [ ] `llms.txt` accessible ✅
- [ ] OG tags — test via https://opengraph.xyz

### Performance
- [ ] Lighthouse Performance ≥ 90
- [ ] Core Web Vitals dans le vert (LCP, CLS, INP)

## Notes techniques

### Islands architecture
Chaque page Astro contient un island React (`client:load`) qui gère toute l'interactivité.
Le contenu statique (h1, liens, nav) est rendu en SSR dans un `<main>` caché — pour les lecteurs d'écran et le SEO.

### View Transitions
Gérées par l'API View Transitions du navigateur.
Slide depuis la droite sur desktop, depuis le bas sur mobile.
`prefers-reduced-motion` : transitions désactivées automatiquement.

### usePageReady
Hook qui retourne `true` une fois la View Transition terminée (`astro:page-load`).
Initialisation SSR toujours à `false` pour éviter les hydration mismatches React (#418/#423).

### ExternalLinkIcon
Composant centralisé `src/components/ExternalLinkIcon.tsx`.
Modifier le `strokeWidth` ou la couleur ici applique le changement sur toutes les occurrences (About, Contact).
