# Instructions pour Claude — Portfolio Julien Bourcet

## Identité du projet

Portfolio personnel de Julien Bourcet, product designer. Ce projet n'a **aucun rapport avec Frontguys** ni aucune autre activité professionnelle. C'est un site vitrine personnel pour exposer des études de cas.

URL cible : julienbourcet.fr
Repo GitHub : github.com/Poestreet/DesignPortfolio

---

## Stack technique

- **Framework** : React 18.3.1 + Vite 6.3.5
- **Styles** : Tailwind CSS 4.1.12 + CSS custom properties (voir tokens ci-dessous)
- **Animations** : Motion 12.23.24 (Framer Motion)
- **Routing** : React Router 7.13.0
- **Composants UI** : shadcn/ui (Radix primitives)
- **Typographies** : Fraunces (serif italic, citations) + Outfit (sans-serif, corps et nav)
- **Hébergement** : Infomaniak mutualisé (Apache) → build statique `dist/`
- **Déploiement** : GitHub Actions + SFTP automatique

---

## Architecture existante

### Routing & transitions (Root.tsx)

Le site fonctionne en SPA. La **Homepage est toujours montée** en fond. Les pages secondaires glissent par-dessus depuis la droite :

```tsx
// Root.tsx — pattern de transition
<AnimatePresence>
  {isAbout && (
    <motion.div
      key="about-overlay"
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.05, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 50 }}
    >
      <AboutPage />
    </motion.div>
  )}
</AnimatePresence>
```

Courbe d'animation : `[0.4, 0, 0.05, 1]` — c'est la courbe standard du projet, à réutiliser partout.

### Pages existantes

**Homepage** (`src/imports/Homepage/Homepage.tsx`)
- Fond blanc `#fafafa`
- Mot "DESIGN" en grande typo (SVG masqué sur le fond animé via CSS `mask-image`)
- Tagline "The Bridge between Strategy and High-Fidelity"
- Navigation en haut à droite : ABOUT · CASES · CONTACT
- Le bouton ABOUT est positionné à `left: 1216px, bottom: 106px` (⚠️ pas responsive)

**About** (`src/app/pages/AboutPage.tsx`)
- Fond sombre : AnimatedBackground + overlay `rgba(0,0,0,0.45)`
- Split 50/50 : photo à gauche / texte à droite
- Animation d'entrée : binary typewriter → reveal photo → reveal texte (staggered)
- Animation de sortie : miroir exact de l'entrée (texte → photo → binary → fond)
- Citation : « Simplicity is inexhaustible » en Fraunces italic
- Bio en Outfit 300, 14px, line-height 1.75
- CTA mailto : hello@julienbourcet.fr

**Cases** (`src/app/pages/CasesPage.tsx`)
- **Page vide à construire** — ne contient que le fond animé + bouton back

### Composant AnimatedBackground

Image de fond avec 3 animations CSS imbriquées (driftX, driftY, driftScale) qui créent un mouvement organique lent. L'image est un dégradé bleu/violet/rose.

### Navigation

Pattern commun sur toutes les pages — en haut à droite, empilée verticalement :
```
—— HOMEPAGE    (ou ABOUT selon la page)
—— CASES
—— CONTACT
```
Style : uppercase, Outfit 400, 11px, letter-spacing 0.2em, ligne horizontale blanche avant chaque label.

### Tokens de design

```css
--primary: #030213;
--background: #ffffff;
--border: rgba(0, 0, 0, 0.1);
--muted: #ececf0;
--muted-foreground: #717182;
```

Fond sombre (About, Cases) : AnimatedBackground + overlay noir 45%.
Fond clair (Homepage) : `#fafafa`.

---

## Ce que je veux construire

### Page Cases — liste des études de cas

**Référence visuelle** : https://www.uzik.com/work/jean-paul-gaultier/xmas-2024
(Regarde cette page pour comprendre le style et le layout que j'aime.)

J'ai besoin :
1. D'un **layout pour la page liste** `/cases` — comment présenter les case studies
2. D'un **layout pour la page détail** `/cases/:slug` — comment raconter chaque étude de cas
3. Des **composants réutilisables** : carte de case study, grille, header de détail, etc.
4. Du **code React** correspondant, compatible avec le projet existant

### Contraintes de conception

- Cohérence avec l'univers visuel existant (sombre, minimaliste, haut de gamme)
- Animations d'entrée/sortie cohérentes avec le pattern Motion existant (ease `[0.4, 0, 0.05, 1]`)
- Les nouvelles pages doivent s'intégrer dans le `Root.tsx` avec le même pattern de slide
- Typographies : Fraunces pour les accroches, Outfit pour le reste
- Pas de librairie supplémentaire — utiliser Motion, Tailwind et shadcn/ui
- Le code doit être prêt à être copié dans le repo existant

### Contraintes techniques

- Les imports d'images utilisent `figma:asset/hash.png` — un plugin Vite les résout vers `src/assets/`
- Les SVG textuels (DESIGN, tagline, navigation) sont stockés en paths dans des fichiers séparés
- Pas de `localStorage` ni `sessionStorage`
- Build cible : fichiers statiques pour Apache (`.htaccess` déjà configuré pour le SPA fallback)

---

## Style de collaboration

- Propose-moi le design (structure, composants, layout) **avant** de coder
- Montre-moi des alternatives quand il y a un choix à faire
- Produis du code TypeScript/TSX propre, commenté, compatible avec le projet
- Signale les problèmes de responsive ou d'accessibilité au fur et à mesure
- Ne valide rien toi-même — attends ma confirmation avant de passer à la suite
