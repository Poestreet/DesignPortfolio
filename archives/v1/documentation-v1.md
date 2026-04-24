# Documentation v1 — julienbourcet.fr

> Rétrospective complète de la première version du portfolio.
> Choix techniques, process de travail, limitations identifiées, décision de migration.
> Rédigée en vue de la conception de la v2.

---

## 1. Contexte et objectif

### Pourquoi refaire le portfolio

L'objectif était de disposer d'un portfolio en ligne reflétant le niveau de séniorité actuel — à la fois sur le plan du design (UI, animation, système) et sur le plan de la capacité à livrer un produit complet de façon autonome.

Contraintes fixées dès le départ :
- Pas de template acheté
- Pas d'agence, pas de sous-traitance
- Délai : 2 jours (1 design, 1 développement)
- Outil IA : Claude (Anthropic) pour la partie développement

### Profil technique de départ

Connaissances en développement au démarrage : HTML5, CSS3, jQuery. Pas de React, pas de TypeScript, pas de Vite. Ce contexte est intentionnellement conservé dans cette documentation — il conditionne tous les choix qui suivent.

---

## 2. Choix de stack — décisions et justifications

### Stack retenue

| Outil | Rôle | Justification |
|---|---|---|
| React 18 | UI framework | Composants réutilisables, gestion du state pour les animations |
| TypeScript | Typage | Détection d'erreurs à l'écriture, pas à l'exécution |
| Vite | Build tool | Dev server rapide, HMR, build optimisé |
| Framer Motion | Animations | Animations déclaratives dans les composants React, springs et transitions de page |
| Tailwind CSS | Style | Classes utilitaires dans le JSX, purge au build |
| React Router | Navigation | Routing côté client entre les 4 pages |

### Pourquoi React plutôt qu'une solution plus légère

Les animations sont le différenciateur principal du portfolio. Framer Motion nécessite React. Ce choix a été fait consciemment, en acceptant la complexité que ça implique pour un site à contenu statique.

### Pourquoi Vite

Recommandé par Claude lors de l'initialisation du projet pour sa simplicité de configuration et sa vélocité en développement. Compatible avec React et TypeScript out-of-the-box.

### Pourquoi Tailwind

Réduction de la surface de décision sur le style. Les classes utilitaires permettent d'écrire le style directement dans le JSX sans gérer de fichiers CSS séparés. Compatible avec l'approche composant-first.

---

## 3. Design system — décisions et structure

### Fichier Figma

Deux collections de variables Figma ont été produites avant toute ligne de code :

- **Core** (`figma-variables-core.json`) — valeurs brutes : couleurs, espacements, tailles. Pas d'alias.
- **Semantic** (`figma-variables-semantic.json`) — alias vers Core, nommés par usage (`Color/Background/primary`, `Dimension/Spacing/lg`…).

Cette architecture three-tier (Core → Semantic → Usage) est standard dans un Design System mature. Elle permet de changer une valeur Core sans toucher aux usages.

### Typographie

Deux familles :
- **Fraunces** (serif, variable) — titres, accroches. Axes utilisés : `SOFT 0`, `WONK 1`, styles italic Bold.
- **Outfit** (sans-serif) — corps de texte, navigation, labels. Poids utilisés : 400, 500, 600, 800.

### Palette

| Token | Valeur | Usage |
|---|---|---|
| `primary-blue` | `#070071` | Fond principal, textes sur blanc |
| `almost-white` | `#fafafa` | Textes, tirets, icônes sur fond bleu |
| `error` | `#ff4d4d` | États d'erreur formulaire |
| `vignette-hero` | `rgba(0,0,0,0.45)` | Overlay images hero |

### UI Kit Figma

Composants produits avant le développement :
- `NavButton` (variante bureau + mobile)
- `SubNavItem` (états : default, active, hover)
- `CaseNavItem` (états : default, active)
- `FormField` (états : Default, Focus, Filled, Error)
- `CTAButton`
- `Tag / Pill`

Chaque composant inclut tous ses états (hover, focus, error, success) — règle non négociable pour éviter que le développeur invente les états manquants.

---

## 4. Process de travail — Jour 1 (design)

### Maquettes haute fidélité

4 pages maquettées dans Figma avant tout développement : Homepage, Cases, About, Contact.

Chaque maquette spécifie :
- Typographie exacte (famille, poids, taille, interligne, espacement)
- Couleurs via variables Figma
- Espacements via tokens
- Tous les états de composants interactifs

### Animations — Figma Make

Les animations (transitions entre pages, springs sur les boutons, micro-interactions) ont été prototypées dans Figma Make avant d'être codées. Le prototype validé a été poussé sur GitHub — versionné, partageable.

Ce flux design → prototype → code est souvent escamoté. C'est là que se joue la cohérence entre l'imaginé et le rendu navigateur.

---

## 5. Process de travail — Jour 2 (développement)

### Connexion Claude ↔ Figma via MCP

Avant la première ligne de code, connexion du protocole MCP entre Claude et le fichier Figma :

1. Figma → Settings → Security → Personal Access Tokens
2. Générer un token avec droits en lecture
3. Renseigner le token dans la configuration MCP de Claude

Claude peut ensuite lire le fichier Figma directement — composant par composant, valeur par valeur. Il ne devine pas, il lit.

### Initialisation du projet

```bash
npm create vite@latest portfolio -- --template react-ts
npm install
```

Structure de dossiers définie avec Claude avant d'écrire la moindre ligne — les décisions d'architecture sont difficiles à changer une fois le projet avancé.

### Flux de travail spec-to-code

> "Ce composant dans Figma — hero de la homepage, fond animé avec l'image en blend mode luminosity, texte révélé en stagger."

Claude récupère les specs dans le fichier Figma, génère le composant TypeScript. Chaque composant est lu, compris, validé (ou corrigé) avant intégration.

### Bugs rencontrés et solutions

| Bug | Cause | Fix |
|---|---|---|
| `mix-blend-mode: luminosity` inopérant | `z-index` parent créant un stacking context isolé | Suppression du `z-index` inutile, wrapper dédié |
| Navigation mobile fixe au lieu de scroller | `position: fixed` au lieu de `position: absolute` | Une ligne de CSS |
| Hiérarchie sémantique `<h1>` / `<h2>` / `<h3>` | Génération automatique non contrôlée | Audit des 6 fichiers concernés, remplacement systématique |
| SubNavItem — animation tiret bloquée | `style={}` inline override Tailwind group-hover | Migration vers classes Tailwind conditionnelles |
| Focus clippé sur dernier SubNavItem | `overflow: hidden` sur le parent | `paddingBottom: 4` sur le conteneur interne |

### L'incident git

À un moment dans la journée, Claude a cessé d'envoyer les batchs git. Du code non versionné, impossible de pusher.

**Cause identifiée** : sur les sessions longues, le contexte LLM se dégrade. Les instructions données en début de session disparaissent progressivement de la fenêtre de contexte. Les comportements changent, les automatismes disparaissent.

**Ce qu'on en retient** :
- Travailler en sessions courtes, centrées sur un objectif précis
- Commiter fréquemment — un commit par fonctionnalité ou correction
- Ne jamais supposer que l'IA se souvient de tout ce qui a été dit

### Déploiement

```bash
npm run build
# → génère /dist avec les fichiers statiques optimisés
# → upload FTP vers public_html
```

Étape souvent escamotée dans les tutoriels : récupérer les credentials FTP (hôte, login, mot de passe, port), vérifier le dossier cible, tester manuellement avec un client FTP avant d'automatiser.

---

## 6. Résultats de l'audit v1

### W3C Validator

23 messages de type **Info** uniquement — tous identiques : trailing slash sur les éléments void (`<meta />`, `<link />`). Syntaxe JSX transcrite par Vite dans le HTML final, sans impact fonctionnel.

**Aucune erreur ni warning HTML.**

Nuance importante : le validateur n'a audité que le `<head>` et `<div id="root"></div>`. Tout le contenu de la page est injecté par JavaScript — il n'existait pas dans le HTML au moment de l'analyse.

### WAVE (accessibilité)

Une seule erreur : **Broken skip link**. Le skip link existe dans le CSS mais sa cible n'est pas dans le DOM statique — elle serait injectée plus tard par React.

Même nuance : l'audit a évalué une page vide. Les problèmes sémantiques réels (hiérarchie de titres, rôles ARIA, labels de formulaires) ne sont pas détectables sans contenu dans le HTML.

### Conclusion d'audit

Un résultat "propre" sur une SPA sans contenu statique n'est pas une bonne nouvelle. C'est la confirmation du problème structurel.

---

## 7. Limitations identifiées de la v1

### Architecture SPA pour contenu statique

Le site est une Single Page Application React avec React Router côté client. Pour 4 pages à contenu statique, c'est une sur-ingénierie qui crée plusieurs problèmes :

**Routing** : en accès direct sur `/about` ou `/cases`, le serveur FTP retourne une 404. Il faudrait une règle `.htaccess` de réécriture vers `index.html`. Non configuré en v1.

**Contenu invisible sans JavaScript** : tout le contenu (textes, titres, images) est injecté par React au runtime. Un robot Google, un lecteur d'écran, ou un utilisateur sans JS voit une page vide.

**Navigation non annoncée** : les changements de page via React Router ne déclenchent pas les comportements natifs du navigateur (annonce aux lecteurs d'écran, déplacement du focus, scroll en haut de page).

### Sémantique non auditée en conditions réelles

La hiérarchie des titres et les rôles ARIA ont été définis dans les composants React, mais jamais vérifiés dans le HTML rendu final avec le contenu chargé.

### Performance

Pas d'audit Core Web Vitals post-déploiement. Lazy loading non implémenté sur les images. Assets non optimisés au-delà du build Vite standard.

---

## 8. Décision de migration — v2 en Astro

### Pourquoi Astro

Astro génère du HTML statique natif — une vraie page HTML par URL, avec le contenu directement dans le fichier servi. Pas de JavaScript nécessaire pour afficher le contenu.

Bénéfices directs :

| Problème v1 | Solution Astro |
|---|---|
| HTML vide sans JS | HTML statique complet, indexable |
| Routes 404 en accès direct | Vraies pages `/about.html`, `/cases.html` |
| Sémantique générée par React | Balisage écrit à la main dans les templates |
| Navigation non annoncée | Navigation native du navigateur |
| SEO limité | `<head>` par page, og:image par page, sitemap natif |

### Ce qui est préservé

Les animations Framer Motion restent via les **Astro Islands** — des composants React hydratés uniquement côté client, uniquement quand visible. Le HTML est statique, les animations s'activent au-dessus.

Le design system, la typographie, les couleurs, les variables Figma — rien ne change visuellement.

### Périmètre de la migration

- Structure HTML des pages → templates Astro
- Composants animés → React islands (`client:visible`)
- Styles → Tailwind CSS (compatible Astro)
- Routing → fichiers Astro natifs (`src/pages/index.astro`, `src/pages/cases.astro`…)
- SEO → frontmatter Astro par page
- A11y → audit WAVE + W3C sur HTML réel, correctifs intégrés dès la conception

### Effort estimé

| Tâche | Durée estimée |
|---|---|
| Structure HTML + pages Astro | 2 jours |
| Isolation des composants animés en islands | 1 jour |
| Audit a11y + correctifs sémantiques | 1 jour |
| SEO (meta, og, sitemap, robots, llms.txt) | ½ journée |
| **Total** | **4 à 5 jours** |

---

## 9. Ce que la v1 a validé

Indépendamment des limitations techniques :

- Le flux **Figma MCP → spec → code** est viable et rapide pour un designer sans background développement avancé
- Les animations Framer Motion sont reproductibles depuis des specs Figma Make
- Travailler avec une IA en sessions courtes et commits fréquents est la bonne discipline
- La spec design en amont (UI Kit complet, états, tokens) est non négociable — elle conditionne la qualité du code généré

La v1 est une preuve de concept. La v2 est la version qui tient ses promesses techniques.

---

*Document produit dans le cadre de la refonte de julienbourcet.fr — avril 2026*
*Julien Bourcet — Senior Product Designer*
