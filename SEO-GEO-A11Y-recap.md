# Récapitulatif SEO · GEO · Accessibilité
## julienbourcet.fr — Portfolio refonte 2025–2026

---

## 1. SEO

### Métadonnées (index.html)

- `<title>` dynamique par route : `/` `About` `Cases` `Contact — Julien Bourcet, Designer`
- `<meta name="description">` : version française, 155 caractères, avec mots-clés : SNCF Connect, Rail Europe, L'Équipe, Design Systems, accessibilité
- `<meta name="author">` : Julien Bourcet
- `<link rel="canonical">` : https://www.julienbourcet.fr (domaine www, sans trailing slash)
- `<meta name="theme-color" content="#070071">` : couleur barre navigateur mobile

### Open Graph

- `og:type` = website
- `og:url`, `og:title`, `og:description`
- `og:image` = `/OGimage.png` · dimensions déclarées 1200×630
- `og:locale` = en_US
- `og:site_name` = Julien Bourcet

### Twitter Card

- `twitter:card` = summary_large_image
- `twitter:title`, `twitter:description`
- `twitter:image` = `/OGimage.png`

### Chargement des polices (performance)

- `<link rel="preconnect">` sur fonts.googleapis.com et fonts.gstatic.com
- `<link rel="stylesheet">` en `<head>` avec weights exacts : Outfit 400/500/800 · Fraunces italic 300/700
- `@import` CSS supprimé de fonts.css (était render-blocking)

### Code splitting Vite (vite.config.ts)

```
manualChunks: {
  'vendor-react':  ['react', 'react-dom', 'react-router'],
  'vendor-motion': ['motion'],
}
```
Réduction du bundle principal, meilleur cache navigateur.

### Métadonnées enrichies depuis le CV (avril 2026)

- `meta description` / `og:description` / `twitter:description` mis à jour : version longue avec certifications (Opquast 2024), 3 missions nommées, domaines cibles
- Titre : "Senior Product Designer" (was "Product Designer")

### Données structurées JSON-LD (index.html)

| Schema | Utilité | Dernière mise à jour |
|--------|---------|---------------------|
| `Person` | Identité, 23 `knowsAbout`, 7 `hasCredential` (Opquast, Contentsquare DXA, Gobelins…) | Avril 2026 |
| `WebSite` | Description générale du site | — |
| `ProfilePage` | Éligible aux rich results Google · `worksFor` timeline ajoutée | Avril 2026 |
| `ItemList` + `CreativeWork` | **4 cas** : SNCF Connect (avec résultat), Rail Europe B2B (résultats agents), Rail Europe B2C SPA, Frontguys A11Y DS (OKLCH) | Avril 2026 |

### sitemap.xml (public/sitemap.xml)

4 routes déclarées avec priorité et fréquence :
- `https://www.julienbourcet.fr/` (priority 1.0, weekly)
- `/about` (priority 0.8, monthly)
- `/cases` (priority 0.9, monthly)
- `/contact` (priority 0.6, monthly)

---

## 2. GEO — Generative Engine Optimization

L'objectif GEO est d'être bien représenté dans les réponses des moteurs IA (ChatGPT, Perplexity, Claude, Gemini) qui indexent le web.

### robots.txt — crawlers IA autorisés explicitement

```
User-agent: GPTBot       → Allow: /
User-agent: ClaudeBot    → Allow: /
User-agent: PerplexityBot → Allow: /
User-agent: Google-Extended → Allow: /
User-agent: anthropic-ai → Allow: /
User-agent: cohere-ai    → Allow: /
User-agent: *            → Allow: /
```

### llms.txt (public/llms.txt)

Standard émergent pour les LLMs (inspiré de robots.txt).
Fichier Markdown lisible par les modèles de langage, accessible à :
`https://www.julienbourcet.fr/llms.txt`

Contenu (réécriture complète avril 2026 depuis le CV PDF) :
- Identité et conviction de marque (citation Christian Bobin)
- **7 domaines d'expertise** détaillés (UX Research, proto HF, UX, ergonomie, UI/DS, a11y, front)
- **7 certifications** avec dates (Opquast 2024, Contentsquare DXA 2024, Gobelins 2018/2011…)
- Parcours professionnel complet avec contexte par mission
- **4 cas clients** avec contexte, rôle et résultats concrets
- Section recruteurs/décideurs
- Coordonnées LinkedIn + Medium

### Données structurées enrichies (JSON-LD)

Le schéma `ProfilePage` est spécifiquement reconnu par Google pour les profils personnels.
Les schémas `Person` et `CreativeWork` alimentent les LLMs qui extraient des entités du web.

---

## 3. Accessibilité — WCAG 2.2 AA + Opquast v5

### index.html

| Élément | Règle |
|---------|-------|
| Skip link `.skip-link` visible au focus, cible `#main-content` | WCAG 2.4.1 · Opquast R164 |
| `<html lang="en">` | WCAG 3.1.1 · Opquast R130 |
| `<meta charset="UTF-8">` | Opquast R232/R233 |
| `<link rel="icon">` favicon SVG | Opquast R104 |

### Root.tsx

| Élément | Règle |
|---------|-------|
| `aria-live="polite"` + `aria-atomic` → annonce de route au changement de page | WCAG 4.1.3 · Opquast R157 |
| `useReducedMotion()` → `SLIDE_REDUCED = { x:0, y:0 }` + `duration: 0` | WCAG 2.3.3 |
| `document.getElementById("main-content")?.focus()` à chaque navigation | WCAG 2.4.3 |
| `isFirstRender` ref → pas d'annonce au chargement initial | Bonne pratique |

### AboutPage.tsx

| Élément | Règle |
|---------|-------|
| `aria-hidden="true"` sur le div binary typewriter | WCAG 1.3.1 |
| `prefers-reduced-motion` → skip animation, état final immédiat | WCAG 2.3.3 |

### CasesPage.tsx

| Élément | Règle |
|---------|-------|
| `aria-hidden="true"` sur les divs binary typewriter (×2 heroes) | WCAG 1.3.1 |
| `prefers-reduced-motion` → skip animation dans `triggerAnimation()` | WCAG 2.3.3 |
| `aria-current="location"` sur `CaseNavItem` actif | WCAG 4.1.2 · Opquast R157 |
| `aria-current="step"` sur `SubNavItem` actif | WCAG 4.1.2 · Opquast R157 |
| `aria-label="Scroll to next section"` sur `ScrollDownButton` | WCAG 1.1.1 |
| `alt=""` sur les images hero (décoratives) | WCAG 1.1.1 |
| `alt` descriptif sur les images UI et screenshots | WCAG 1.1.1 · Opquast R118 |

### ContactPage.tsx (desktop)

| Élément | Règle |
|---------|-------|
| `htmlFor` + `id` associés sur les 3 champs | WCAG 1.3.1 · Opquast R69 |
| `type="email"` sur le champ email | Opquast R95 |
| `required` + `aria-required="true"` sur les 3 champs | WCAG 3.3.2 · Opquast R71 |
| `autoComplete="name"` / `"email"` / `"off"` | Opquast R97 |
| `aria-invalid` dynamique sur chaque champ | WCAG 3.3.1 |
| `aria-describedby` → lié au span d'erreur | WCAG 3.3.1 · Opquast R70 |
| `<span role="alert">` sr-only pour chaque erreur | WCAG 3.3.1 · Opquast R79/R80 |
| `<div role="status" aria-live="polite">` → statut envoi | WCAG 4.1.3 · Opquast R85 |
| `aria-label="LinkedIn (opens in new tab)"` et Medium | Opquast R137/R146 |
| Liens LinkedIn/Medium : icône SVG `external-link` à droite du label | WCAG 1.1.1 · Opquast R137 |
| Icône SVG externe `aria-hidden="true"` (nom accessible porté par `aria-label` du lien) | WCAG 1.1.1 |
| Zone de clic limitée au contenu (`alignItems: "flex-start"` sur le conteneur) | Opquast R142 |
| Animation icône : `x: 4` spring (gauche → droite) via variant `motion.a → motion.span` | UX |

### MobileContactPage.tsx

Réécriture complète — mêmes garanties que le desktop, plus :

| Élément | Règle |
|---------|-------|
| IDs préfixés `m-contact-*` (évite doublons dans le DOM) | Opquast R236 |
| `htmlFor` associé sur les 3 labels | Opquast R69 |
| `type="email"` corrigé (était `type="text"`) | Opquast R95 |
| `aria-required`, `aria-invalid`, `aria-describedby` | WCAG 3.3.1/3.3.2 |
| `autoComplete` sur les 3 champs | Opquast R97 |
| `<span role="alert">` sr-only par champ | Opquast R79/R80 |
| `<div role="status" aria-live="polite">` | Opquast R85 |
| `aria-label` + icône `external-link` sur liens LinkedIn/Medium | Opquast R137/R146 |
| `aria-hidden="true"` sur icône SVG externe | WCAG 1.1.1 |
| Zone de clic limitée au contenu (`alignSelf: "flex-start"` sur chaque `motion.a`) | Opquast R142 |
| Animation icône : `x: 4` spring (gauche → droite), identique au desktop | UX |

### AboutPage.tsx — photo

| Élément | Règle |
|---------|-------|
| `alt="Julien Bourcet"` sur la photo | WCAG 1.1.1 · Opquast R118 |

### public/404.html

Page 404 personnalisée avec :
- Titre de page explicite
- Navigation vers les 4 routes principales
- `meta name="robots" content="noindex"`
- Focus visible sur les liens
- Structure sémantique (`<nav aria-label>`, `<h1>`)

| Règle | Couvert |
|-------|---------|
| Opquast R223 | ✅ page 404 personnalisée |
| Opquast R225 | ✅ navigation principale présente |

### src/styles/index.css — Focus visible global (WCAG 2.4.11)

Ajout d'une règle `@layer base` couvrant tous les éléments interactifs du portfolio :

| Règle CSS | Cible | Règle |
|-----------|-------|-------|
| `:focus-visible { outline: 2px solid #fafafa; outline-offset: 4px; border-radius: 2px }` | Tous les `<button>`, `<a>`, `<nav>` sans classe `outline-none` (nav, submit, liens externes) | WCAG 2.4.11 (AA) |
| `input:focus-visible, textarea:focus-visible { outline: none; box-shadow: 0 3px 0 0 rgba(250,250,250,0.35) }` | Champs formulaire (design à bordure inférieure seule) | WCAG 2.4.11 |
| `.skip-link:focus-visible { outline-color: #070071 }` | Skip link (fond #fafafa clair) | WCAG 2.4.11 |

**Pourquoi `@layer base` et non une règle nue ?** Les composants shadcn/ui utilisent la classe utilitaire `outline-none` (`@layer utilities`). Les utilities ayant priorité sur base, ils gardent leurs propres styles `:focus-visible` (ring via box-shadow). Les éléments du portfolio sans classe outline-none héritent de la règle base. Sans ce wrapping, la règle nue aurait écrasé les composants shadcn.

**Pourquoi `outline: none` était problématique ?** Le style inline `outline: "none"` dans `placeholderStyle` (ContactPage) et `fieldStyle` (MobileContactPage) avait une spécificité inline (1-0-0-0), écrasant tout. Supprimé dans les deux fichiers — la règle CSS `input:focus-visible` prend le relais.

**Contexte sombre :** `#fafafa` sur `#070071` → ratio de contraste ≈ 17.5:1 (dépasse le minimum 3:1 requis par WCAG 2.4.11 pour la couleur du focus).

---

## 4. Ce qui reste hors périmètre code React (côté serveur)

Ces règles Opquast nécessitent une configuration serveur (Infomaniak / Netlify) :

| Règle | Description | Action |
|-------|-------------|--------|
| R197 | HTTPS sur toutes les pages | Vérifier certificat Infomaniak |
| R199 | En-tête HSTS (Strict-Transport-Security) | Config serveur |
| R200 | Pas de ressources HTTP mixtes | Audit réseau |
| R206 | Désactiver détection auto MIME | Header X-Content-Type-Options |
| R210 | Protection XSS | Header X-XSS-Protection ou CSP |
| R211 | Contrôle intégration dans frames | Header X-Frame-Options |
| R218 | Fonctionne avec et sans www | Redirect 301 côté DNS/serveur |
| R226 | Compression gzip/brotli | Config serveur |
| R227 | En-têtes de cache | Config serveur |

---

## 5. Points éditoriaux à décider

- **R71** — Indicateur visuel des champs obligatoires : `aria-required` couvre les AT. Un `*` visuel nécessite une décision de design.
- **R15** — Politique de confidentialité : pas de page dédiée. À envisager si le formulaire de contact collecte des données personnelles.
- **R126** — AnimatedBackground ne peut pas être mis en pause. Acceptable car le mouvement est lent et non distrayant ; `prefers-reduced-motion` pourrait être appliqué.
- **Favicon** — Le `favicon.svg` actuel est un placeholder minimaliste (carré bleu, lettre J). Une vraie icône de marque est recommandée.

---

*Dernière mise à jour : 21 avril 2026 — Référentiels : WCAG 2.2 AA · Opquast v5 (245 règles) · GEO best practices 2025*
