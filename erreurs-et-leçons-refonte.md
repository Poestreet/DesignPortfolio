# Erreurs & leçons — Refonte julienbourcet.fr (v1 → v2)

> Document de capitalisation. Chaque problème rencontré pendant la refonte est consigné avec son contexte pédagogique, sa cause, son correctif et la règle à retenir pour les projets futurs.

---

## 00. Architecture initiale inadaptée — SPA React pour un site vitrine statique

**Contexte**
Sur le web, il existe plusieurs façons de « construire » et de « servir » un site.

La première, appelée **SPA (Single Page Application)**, consiste à envoyer au navigateur une page HTML quasi-vide, puis à laisser JavaScript construire tout le contenu à la volée. C'est l'approche choisie pour la v1, avec React et React Router. C'est une architecture pensée pour des applications complexes — tableaux de bord, outils en ligne, interfaces métier — où le contenu change en permanence selon les interactions de l'utilisateur.

La seconde, appelée **SSG (Static Site Generation)**, consiste à construire toutes les pages HTML au moment du déploiement, avant même que quiconque visite le site. Le serveur sert directement des fichiers HTML complets. C'est l'approche retenue pour la v2, avec Astro.

Pour un portfolio avec 4 pages dont le contenu ne change pas selon l'utilisateur, la SPA était un choix surdimensionné. Conséquences concrètes : quand quelqu'un tapait directement `julienbourcet.fr/about` dans son navigateur, le serveur cherchait un fichier `about.html` qui n'existait pas (404). Le contenu était aussi invisible pour les moteurs de recherche, car Google ne « voit » que le HTML initial — pas ce que JavaScript construit après coup. Et le bundle JavaScript envoyé au navigateur était bien plus lourd que nécessaire pour de simples animations de portfolio.

**Cause**
Choix technique initial calqué sur une architecture produit (SPA), alors que le besoin réel était un site vitrine avec 4 pages statiques, des animations d'entrée et un formulaire de contact.

**Correctif**
Migration complète vers Astro (SSG) : routing fichier-système, pages HTML statiques générées au build, islands React limités aux composants animés, déploiement continu via Netlify.

**Règle**
> Avant de choisir un framework, poser la question du rendu : SSG, SSR ou SPA ? Un site vitrine statique n'a pas besoin de React Router. Astro, Eleventy ou Next.js en mode export sont des choix plus sobres et plus maintenables.

---

## 01. `export default` manquant sur les islands React

**Contexte**
En JavaScript/TypeScript, il existe deux façons d'exporter un élément depuis un fichier. Le **named export** (`export function MonComposant`) permet d'exporter plusieurs choses depuis le même fichier et oblige l'importeur à utiliser le même nom. Le **default export** (`export default function MonComposant`) désigne l'export principal du fichier — il peut être importé sous n'importe quel nom.

Astro impose le default export pour les composants qu'il doit hydrater côté client. C'est une convention technique qui lui permet de localiser le composant principal sans ambiguïté, quel que soit le nom utilisé à l'import. Dans une SPA React classique, les named exports fonctionnent partout — ce qui explique pourquoi l'habitude de les utiliser a persisté lors du portage vers Astro.

**Cause**
3 islands (`AboutIsland`, `CasesIsland`, `ContactIsland`) étaient exportés avec `export function` au lieu de `export default function`. Astro ne peut pas importer et hydrater un composant sans default export.

**Correctif**
Ajout de `default` sur les 3 composants.

**Règle**
> Dans Astro, tout composant passé en directive d'hydratation (`client:load`, `client:only`, etc.) doit être en `export default`. Vérifier au moment de la création du fichier, pas au moment du build.

---

## 02. Plugin Vite `figma:asset/` — `src="[object Object]"` en production

**Contexte**
La v1 utilisait un système d'import d'images personnalisé, basé sur un protocole fictif `figma:asset/`. Concrètement, au lieu d'écrire `import img from "./mon-image.webp"`, le code écrivait `import img from "figma:asset/HASH.webp"`. Un plugin Vite (l'outil de build) interceptait ces imports et les transformait en vrai chemin de fichier.

Ce mécanisme fonctionnait en v1. En v2, le contexte technique a changé (Astro + Vite), et le plugin ne produisait plus une URL valide — il retournait un objet JavaScript complexe. Quand React essayait d'utiliser cet objet comme valeur de l'attribut `src` d'une image HTML, le navigateur recevait littéralement le texte `[object Object]` comme URL. Résultat : toutes les images de cas étaient cassées en production. Ce qui rendait le bug particulièrement sournois, c'est que le build réussissait sans aucune erreur — il n'y avait rien à voir dans les logs.

**Cause**
Le hook Vite `resolveId` seul retourne un objet module, pas une URL string. Dans le contexte Astro + Vite, ce comportement passe inaperçu au build mais échoue au rendu React.

**Correctif**
Images déplacées dans `public/assets/`, imports remplacés par des constantes string : `const img = "/assets/HASH.ext"`.

**Règle**
> Ne pas porter un plugin Vite custom d'un projet à l'autre sans valider son comportement dans le nouveau contexte. Toujours tester les images en production (pas seulement en dev) avant de considérer la migration terminée.

---

## 03. `@astrojs/sitemap` incompatible avec Astro 4.x

**Contexte**
Un sitemap est un fichier XML qui liste toutes les URLs d'un site. Google et les autres moteurs de recherche l'utilisent pour explorer le site plus efficacement. Il existe un plugin officiel Astro (`@astrojs/sitemap`) censé générer ce fichier automatiquement à chaque build.

Le problème : les logiciels évoluent, et les plugins ne suivent pas toujours à la même vitesse. Le plugin `@astrojs/sitemap` v3.2.0 contenait un bug interne (une tentative d'opération `.reduce()` sur une valeur `undefined`) qui faisait planter le build entier au moment où Astro finissait de construire les pages. Ce genre de bug de compatibilité est fréquent dans l'écosystème JavaScript, où les versions majeures introduisent des changements qui cassent les dépendances.

**Cause**
Bug du plugin `@astrojs/sitemap` v3.2.0 avec Astro 4.x — incompatibilité non documentée.

**Correctif**
Suppression du plugin, remplacement par un `public/sitemap.xml` statique mis à jour manuellement.

**Règle**
> Vérifier la compatibilité des plugins Astro avec la version cible avant installation. Préférer une solution statique simple à une dépendance tierce pour des besoins non dynamiques (sitemap fixe à 4 URLs).

---

## 04. OG image — chemin incorrect non détecté au build

**Contexte**
Les balises Open Graph (`og:image`) sont des métadonnées HTML qui indiquent à Facebook, LinkedIn, Twitter/X et iMessage quelle image afficher quand on partage un lien. Elles sont invisibles à l'écran — elles vivent dans le `<head>` du document HTML.

Le problème avec les métadonnées, c'est qu'elles ne produisent aucune erreur visible. Si le chemin de l'image est incorrect, la page s'affiche normalement, le build réussit, et il n'y a aucun warning dans la console. Le bug ne se manifeste que quand on partage le lien sur un réseau social ou qu'on le teste avec un outil dédié — à ce moment-là, l'aperçu affiche une image manquante ou un carré vide.

**Cause**
Les pages pointaient vers `/og/og.jpg`. Le fichier réel était `/og/OGimage.png` — mauvaise casse et mauvaise extension. Renseigné manuellement dans 4 templates sans vérification.

**Correctif**
Mise à jour du chemin dans les 4 templates `.astro`.

**Règle**
> Toujours tester les OG tags en production via [opengraph.xyz](https://opengraph.xyz) ou [metatags.io](https://metatags.io). Automatiser le chemin OG via une variable partagée pour éviter les divergences entre pages.

---

## 05. Netlify Forms — POST 404

**Contexte**
Netlify propose un service intégré pour gérer les formulaires de contact sans serveur backend. Le principe : on ajoute un attribut `netlify` sur la balise `<form>` dans le HTML, et Netlify détecte automatiquement ce formulaire au moment du build pour le brancher à son système de réception.

Pour que ça fonctionne, Netlify doit « voir » ce formulaire dans le HTML statique de la page vers laquelle le formulaire envoie ses données. Le formulaire de contact vivait dans un composant React — donc rendu côté client, invisible pour Netlify au moment du build. La solution : inclure une version HTML statique du formulaire (cachée visuellement) dans la page Astro, pour que Netlify la détecte au build. Et la requête HTTP doit pointer vers cette même page (`/contact/`), pas vers la racine (`/`).

**Cause**
`fetch("/", ...)` ciblait la racine. Netlify Forms cherche le `<form netlify>` dans le HTML de la page destinataire du POST — pas dans toutes les pages.

**Correctif**
POST redirigé vers `/contact/`.

**Règle**
> Avec Netlify Forms, le POST doit cibler la page qui contient le `<form netlify>` dans son HTML statique. Tester l'envoi en staging Netlify, pas uniquement en dev local (où Netlify Forms ne fonctionne pas).

---

## 06. Autofill navigateur — fond de couleur système sur les inputs

**Contexte**
Quand un navigateur remplit automatiquement un champ de formulaire (email, nom…), il applique sa propre mise en forme visuelle pour signaler à l'utilisateur que c'est lui qui a rempli la valeur — et non l'utilisateur lui-même. Sur Chrome et Safari, cette mise en forme prend la forme d'un fond jaune ou bleu clair.

Le problème : cette mise en forme est appliquée par le navigateur à un niveau de priorité très élevé, que CSS appelle le « user agent stylesheet ». Elle écrase les styles définis dans le code, y compris `background: transparent` et même `background-color: #070071`. La seule façon de la surcharger est d'utiliser une technique CSS détournée : appliquer une `box-shadow` interne (inset) de la couleur souhaitée, qui recouvre visuellement le fond d'autofill sans le supprimer.

**Cause**
Les navigateurs appliquent un style interne `-webkit-autofill` non surchargeable par les propriétés `background` habituelles.

**Correctif**
```css
input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #070071 inset;
  -webkit-text-fill-color: #fafafa;
}
```

**Règle**
> Pour tout formulaire sur fond sombre, prévoir la règle `-webkit-autofill` dès la conception. Elle ne peut pas être outrepassée autrement.

---

## 07. Reset formulaire post-envoi incomplet

**Contexte**
Dans React, l'état d'un composant (ce qu'il affiche) est géré par des variables appelées « states ». Quand on veut vider un champ de formulaire après envoi, on remet le state à une chaîne vide (`setState("")`). En théorie, ça devrait suffire.

En pratique, le navigateur maintient son propre état visuel pour les champs qu'il a remplis par autofill — indépendamment de React. Même si React dit « la valeur est vide », le navigateur peut conserver sa couleur de fond d'autofill parce que, pour lui, c'est toujours le même élément HTML dans le DOM. La solution est de forcer React à détruire et recréer l'élément HTML depuis zéro — ce qu'on fait en changeant sa prop `key`. Quand la `key` change, React considère que c'est un nouvel élément et repart d'une page blanche.

**Cause**
`setState("")` change la valeur React mais ne force pas le re-mount du composant. Le navigateur conserve son état autofill visuel.

**Correctif**
State `formKey` incrémenté à chaque envoi réussi, passé en prop `key={formKey}` sur chaque input pour forcer le re-mount React complet.

**Règle**
> Pour réinitialiser l'état visuel d'un input (autofill inclus), `setState("")` ne suffit pas. Utiliser un `key` dynamique pour forcer le re-mount.

---

## 08. Textarea — fond navigateur résistant aux inline styles

**Contexte**
Les éléments de formulaire HTML (`input`, `textarea`, `select`) ont un statut particulier dans les navigateurs : ils sont considérés comme des contrôles natifs du système d'exploitation, et le navigateur leur applique des styles par défaut très défensifs. Ces styles peuvent résister à des déclarations CSS normales, y compris les inline styles (styles écrits directement dans le HTML via l'attribut `style="..."`).

Pour les `<textarea>`, certains navigateurs appliquent un `background-color` système qui ne cède pas face à `background: transparent`. La raison est une question de spécificité CSS et de cascade : le navigateur « protège » ses styles natifs. La solution est d'écrire une règle CSS dans une feuille de style globale, suffisamment précise pour couvrir tous les états de l'élément (normal, focus, active, focus-visible).

**Cause**
Spécificité CSS du navigateur sur les éléments de formulaire natifs — plus haute que les inline styles dans certains cas.

**Correctif**
```css
textarea, textarea:focus, textarea:active, textarea:focus-visible {
  background-color: transparent;
}
```

**Règle**
> Les éléments de formulaire natifs ont des styles navigateur difficiles à surcharger. Prévoir les règles CSS globales nécessaires dès le Design System, pas au cas par cas.

---

## 09. Focus visible — couleur dégradée sur fond sombre

**Contexte**
Le « focus visible » est l'indicateur visuel qui montre quel élément interactif est actuellement sélectionné lors d'une navigation au clavier (touche Tab). C'est une exigence d'accessibilité fondamentale (WCAG 2.4.11) — sans elle, les personnes qui ne peuvent pas utiliser une souris sont perdues.

La couleur de cet indicateur doit contraster suffisamment avec son arrière-plan. Sur le fond `#070071` (bleu très sombre, presque noir), un blanc semi-transparent `rgba(250,250,250,0.5)` semblait logique — mais en pratique, la couche de transparence interagissait avec la teinte saturée du fond et produisait un violet/rose peu visible. Le problème n'était visible qu'en testant avec le clavier dans le navigateur. Le ratio de contraste ne respectait pas les 3:1 requis par WCAG pour les composants d'interface.

**Cause**
Le canal alpha du `rgba` interagit avec la couleur de fond saturée et produit un résultat inattendu. Le ratio de contraste de l'outline était insuffisant.

**Correctif**
Remplacement par `#fafafa` opaque dans `global.css`.

**Règle**
> Sur fonds sombres saturés, ne pas utiliser de couleurs RGBA pour les états de focus. Toujours vérifier le rendu réel et le ratio de contraste (minimum 3:1 pour les composants UI selon WCAG 2.4.11).

---

## 10. Lignes de navigation — bug d'affichage Firefox

**Contexte**
Pour créer un séparateur visuel fin d'1 pixel, il existe deux approches courantes en CSS. La première : un élément `<span>` ou `<div>` avec `height: 1px` et une couleur de fond (`background-color`). La seconde : utiliser directement la propriété `border-top: 1px solid`.

Ces deux approches produisent le même résultat dans la plupart des situations. Mais dans un contexte flexbox (disposition en rangées ou colonnes avec `display: flex`), Firefox calcule différemment la hauteur des éléments enfants, et peut « écraser » à zéro un élément de `height: 1px` selon les règles d'alignement. `border-top`, en revanche, ne fait pas partie du modèle de boîte calculé par flexbox — il est toujours rendu, indépendamment du contexte. Chrome est moins strict sur ce point, ce qui explique pourquoi le bug n'apparaissait que sur Firefox.

**Cause**
Firefox collapse les éléments `height: 1px` + `background` dans certains contextes flex. Comportement lié au modèle de boîte et à la sous-pixellisation.

**Correctif**
Remplacement par `height: 0` + `borderTop: "1px solid #fafafa"` sur tous les composants de navigation.

**Règle**
> Toujours tester les séparateurs visuels sur Firefox. Préférer `border` à `height + background` pour les lignes de 1px dans les contextes flex.

---

## 11. Flash blanc pendant les View Transitions

**Contexte**
Les View Transitions sont une API du navigateur qui permet d'animer le passage d'une page à une autre — comme un glissement ou un fondu — au lieu d'un rechargement brutal. Astro intègre cette API nativement.

Le problème : lors d'une transition, le navigateur capture une « photo » de la page actuelle, commence à charger la nouvelle page, puis anime le passage entre les deux. Pendant ce laps de temps, tous les composants React (les islands) sont détruits puis reconstruits. Le fond animé, qui était un island React, disparaissait donc entre les deux pages, révélant le blanc par défaut du navigateur. La solution est de sortir le fond du cycle de vie React et de l'écrire en CSS pur dans le HTML statique — il n'est alors jamais démonté, et reste présent de manière continue pendant toute la transition.

**Cause**
Le composant `AnimatedBackground` (island React) était démonté pendant la View Transition avant que le nouvel island soit hydraté — créant un gap visuel.

**Correctif**
Création de `StaticBackground.astro` : fond animé en CSS-only injecté dans le HTML statique, présent dès le premier octet, jamais démonté.

**Règle**
> Les éléments visuels persistants (fond, nav globale) ne doivent pas être portés par des islands React si des View Transitions sont actives. Préférer des composants Astro statiques ou CSS-only pour les éléments présents sur toutes les pages.

---

## 12. `usePageReady` non fiable sur navigation programmatique

**Contexte**
Dans le portfolio, le contenu de chaque page (texte, navigation) n'apparaît qu'une fois la View Transition terminée — pour éviter que le texte surgisse pendant que la page est encore en train de glisser. Un hook React (`usePageReady`) était chargé de détecter ce moment et de donner le signal.

La première implémentation écoutait deux événements Astro : `astro:page-load` (la page est chargée) et `astro:after-swap` (le contenu a été échangé). Ces événements fonctionnaient bien quand l'utilisateur cliquait sur un lien. Mais quand la navigation était déclenchée par du code JavaScript (`astroNavigate("/about")`), la chronologie changeait : l'événement se déclenchait avant que React ait eu le temps de s'enregistrer pour l'écouter. C'est une race condition — deux choses qui arrivent dans un ordre imprévisible. Le hook ratait l'événement, et le contenu n'apparaissait jamais.

`requestAnimationFrame` est une fonction du navigateur qui demande : « exécute ce code juste avant le prochain dessin à l'écran ». Elle est garantie de se déclencher côté client, après que React a eu le temps de s'initialiser, quelle que soit la façon dont on est arrivé sur la page.

**Cause**
Lors d'une navigation via `astroNavigate()`, les événements Astro se déclenchaient avant que le `useEffect` React ait eu le temps de s'enregistrer. Race condition — le hook ratait l'événement.

**Correctif**
Remplacement par `requestAnimationFrame` — se déclenche après le premier paint côté client, quelle que soit la nature de la navigation.

**Règle**
> Ne pas synchroniser l'état React sur des événements Astro. Leur timing est imprévisible selon le chemin de navigation. Préférer `requestAnimationFrame` ou `useEffect` pur.

---

## 13. Hydration mismatches React #418 / #423

**Contexte**
Quand Astro génère une page HTML (au build ou au moment de la requête), il inclut dans ce HTML une version statique des islands React — du HTML sans JavaScript. Quand le navigateur charge la page, React prend ensuite le relais et « hydrate » ce HTML : il y attache ses événements et son état. Pour que ça fonctionne, le HTML produit par React doit être **identique** au HTML déjà présent dans la page. Si ce n'est pas le cas, React détecte un écart et affiche un warning.

Framer Motion est une bibliothèque d'animation qui fonctionne en appliquant des styles CSS directement sur les éléments HTML (`opacity: 0`, `transform: translateY(18px)`). Ces styles sont calculés côté client, au moment où React s'exécute dans le navigateur. Mais quand Astro génère le HTML statique côté serveur, Framer Motion ne tourne pas — le HTML ne contient donc pas ces styles. Résultat : React compare un HTML sans styles d'animation (ce qu'Astro a produit) avec un HTML avec styles d'animation (ce que React veut produire), détecte l'écart, et affiche les warnings #418/#423.

La solution `client:only="react"` demande à Astro de ne pas rendre l'island côté serveur du tout — il n'y a donc aucun HTML statique à comparer, et le problème disparaît structurellement.

**Cause**
Framer Motion applique des styles inline via ses props `initial`. Avec `client:load`, Astro rend l'island côté serveur sans ces styles. Quand React hydrate, il détecte un écart entre le HTML reçu et le rendu attendu.

**Correctif**
Remplacement de `client:load` par `client:only="react"` sur les 4 pages.

**Règle**
> Avec Framer Motion dans un contexte SSR/SSG, utiliser `client:only="react"`. `client:load` génère des hydration mismatches structurels impossibles à résoudre autrement. Le contenu statique (SEO) doit être séparé dans un `<main>` visually-hidden.

---

## 14. Icône de lien externe — source dupliquée, `strokeWidth` incohérent

**Contexte**
Une icône SVG est définie par un ensemble de propriétés : couleur du contour (`stroke`), épaisseur du contour (`strokeWidth`), forme des extrémités, etc. Quand on copie-colle un SVG inline dans plusieurs fichiers, on crée autant de « vérités » indépendantes. Si on décide ensuite de changer l'épaisseur du trait, il faut retrouver et modifier chaque occurrence manuellement — et il suffit d'en oublier une pour que le résultat soit incohérent visuellement.

C'est exactement ce qui s'est passé : l'icône de lien externe était copiée dans 4 fichiers, avec des valeurs de `strokeWidth` différentes selon les endroits. La bonne pratique est de créer un composant dédié qui encapsule l'icône — un seul endroit à modifier, un résultat cohérent partout.

**Cause**
Absence de composant centralisé. Chaque occurrence copiée manuellement sans référence commune.

**Correctif**
Création du composant `ExternalLinkIcon.tsx` avec `strokeWidth="2"` comme valeur unique et une prop `size` pour les variantes.

**Règle**
> Toute icône utilisée dans plus d'un fichier doit être un composant. Jamais de SVG inline dupliqué. Centraliser dès la première duplication.

---

## 15. Netlify Base directory — non mis à jour après restructuration du repo

**Contexte**
Netlify a besoin de savoir où, dans le dépôt git, se trouve le projet à construire. Cette information s'appelle le « Base directory ». Par défaut, il pointe vers la racine du dépôt. Si le code source se trouve dans un sous-dossier (comme `v2/`), on le renseigne dans les paramètres Netlify.

Quand le dépôt a été restructuré et que tout le code a été déplacé de `v2/` vers la racine, Netlify ne l'a pas détecté automatiquement. Il continuait à chercher `v2/package.json` (le fichier qui décrit les dépendances du projet) à l'ancien emplacement, ne le trouvait pas, et faisait échouer le build. Ce type de configuration est « set and forget » : on la renseigne une fois et on l'oublie — ce qui en fait un point de friction invisible lors des restructurations.

**Cause**
Le Base directory dans les paramètres Netlify était toujours `v2`. Netlify ne détecte pas automatiquement les changements de structure du repo.

**Correctif**
Mise à jour du Base directory vers *(vide)* dans le dashboard Netlify → Settings → Build & Deploy.

**Règle**
> Toute restructuration du repo doit s'accompagner d'une mise à jour explicite de la configuration CI/CD. Documenter le Base directory dans le README pour ne pas le perdre.

---

## 16. `git mv` + `git add -A` — fichier sensible sorti du scope `.gitignore`

**Contexte**
`.gitignore` est un fichier qui dit à git : « n'enregistre jamais ces fichiers dans l'historique ». C'est essentiel pour les fichiers contenant des mots de passe ou des clés d'API. La subtilité : les règles dans `.gitignore` s'appliquent à des chemins précis, relatifs à la racine du dépôt.

La règle `public/.smtp-config.php` signifie littéralement : « ignore le fichier `.smtp-config.php` qui se trouve directement dans le dossier `public/` à la racine du dépôt ». Rien d'autre. Quand le dossier `public/` a été déplacé dans `archives/v1/public/` via `git mv`, le fichier est devenu `archives/v1/public/.smtp-config.php`. Ce nouveau chemin ne correspond plus à la règle — git a donc commencé à le « voir ».

Ensuite, `git add -A` (le `-A` signifie « tout ») a indexé automatiquement tous les fichiers nouvellement détectés, y compris ce fichier de mots de passe. Au commit suivant, les credentials SMTP se sont retrouvés dans l'historique git — et donc sur GitHub, accessible publiquement.

GitGuardian est un service qui scanne les dépôts GitHub en temps réel à la recherche de credentials exposés. Il a détecté et signalé l'incident dans les minutes qui ont suivi le push.

**Cause**
Règle `.gitignore` à portée trop étroite (chemin absolu) + `git add -A` après `git mv` — le fichier est sorti du scope de la règle sans que quiconque s'en aperçoive.

**Correctif**
1. Changement immédiat du mot de passe SMTP
2. `git rm --cached` du fichier
3. `.gitignore` mis à jour avec pattern glob : `**/.smtp-config.php`
4. Purge de l'historique via `git filter-repo`
5. Force-push sur `main`

**Règle**
> Utiliser des patterns glob dans `.gitignore` pour les fichiers sensibles : `**/.env`, `**/.smtp-config.php`. Ne jamais utiliser `git add -A` après un `git mv` sans inspecter `git status` au préalable. Préférer `git add` avec chemins explicites lors de toute restructuration.

---

## 17. `git filter-repo` supprime le remote origin

**Contexte**
`git filter-repo` est un outil qui réécrit l'historique d'un dépôt git — il supprime ou modifie des commits passés. C'est l'outil recommandé pour purger des fichiers sensibles d'un historique git. Il est puissant, mais il opère en recréant entièrement le dépôt local depuis zéro.

Pour limiter les risques d'erreur (comme écraser accidentellement un dépôt distant), `git filter-repo` supprime délibérément la configuration du remote `origin` après son exécution. C'est un filet de sécurité : il force l'utilisateur à reconfigurer explicitement où envoyer l'historique réécrit, plutôt que de risquer un push automatique vers le mauvais endroit. Ce comportement est documenté, mais surprenant si on ne le connaît pas.

**Cause**
`git filter-repo --force` réinitialise la configuration du repo, supprimant le remote origin. Comportement intentionnel et documenté, mais non anticipé.

**Correctif**
Re-ajout du remote : `git remote add origin https://github.com/Poestreet/DesignPortfolio.git` puis `git push --set-upstream origin main`.

**Règle**
> Après un `git filter-repo`, toujours re-configurer le remote origin et l'upstream de la branche. Le noter dans la checklist avant de lancer la commande.

---

## 18. Workflow GitHub Actions SFTP — redondant et coûteux

**Contexte**
GitHub Actions est un système d'automatisation intégré à GitHub : à chaque push sur le dépôt, il peut exécuter des scripts — tests, build, déploiement, etc. La v1 utilisait un workflow GitHub Actions pour déployer le site via SFTP (protocole de transfert de fichiers sécurisé) vers l'hébergeur Infomaniak.

Quand la v2 a été configurée sur Netlify, ce déploiement automatique est devenu la nouvelle référence. Mais l'ancien workflow GitHub Actions n'a pas été supprimé. À chaque push, il continuait à tourner en parallèle : 49 minutes de transfert SFTP de fichiers vers Infomaniak (qui n'hébergeait plus le site), consommant des « minutes GitHub Actions » (une ressource limitée et facturée sur les plans payants) pour un résultat nul.

**Cause**
L'ancien workflow `.github/workflows/deploy.yml` n'avait pas été supprimé lors du passage à Netlify.

**Correctif**
Suppression du fichier workflow.

**Règle**
> Lors d'un changement de pipeline CI/CD, supprimer explicitement les anciens workflows. Un workflow orphelin consomme des ressources et peut créer des conflits de déploiement.

---

## 19. `git mv` — destination existante au build

**Contexte**
`git mv` est la commande git pour déplacer ou renommer un fichier tout en préservant son historique. Elle est stricte : si un fichier existe déjà à la destination indiquée, elle refuse d'écraser et retourne une erreur `fatal: destination exists`.

Lors de la restructuration du repo, il y avait deux fichiers `README.md` : un à la racine (documentation générale du repo) et un dans `v2/` (documentation technique de la v2). L'objectif était de déplacer `v2/README.md` vers la racine pour en faire le README principal. Mais la racine en avait déjà un. Il a fallu d'abord archiver le README racine existant, libérant ainsi la destination, avant de pouvoir déplacer celui de `v2/`.

**Cause**
Un fichier `README.md` existait déjà à la racine. `git mv` ne peut pas écraser un fichier existant.

**Correctif**
Renommage préalable du README existant (`git mv README.md archives/v1/README-v1.md`) avant de déplacer celui de `v2/`.

**Règle**
> Avant tout `git mv`, vérifier l'existence du fichier de destination. Planifier l'ordre des opérations lors d'une restructuration : déplacer ou renommer les cibles avant de déplacer les sources.

---

## 20. Favicon 404

**Contexte**
Le favicon est la petite icône qui apparaît dans l'onglet du navigateur, dans la barre d'adresse et dans les favoris. Il est demandé automatiquement par le navigateur à chaque visite, à l'URL `/favicon.ico`. Si le fichier est absent, le navigateur génère une erreur 404 silencieuse — invisible pour l'utilisateur mais présente en console et détectée par les outils d'audit comme Lighthouse ou WAVE.

C'est l'un de ces petits détails qui n'empêche rien de fonctionner, mais qui trahit une checklist de lancement incomplète. Pour les recruteurs et les clients qui inspectent la console d'un portfolio, c'est un signal d'attention aux détails.

**Cause**
Aucun fichier `favicon.ico` (ni `favicon.svg`) n'a été ajouté dans `public/`.

**Correctif**
À faire : ajouter un `favicon.ico` ou `favicon.svg` dans `public/` et le référencer via `<link rel="icon">` dans les templates.

**Règle**
> Le favicon fait partie du squelette de base de tout site. L'ajouter dans la checklist de lancement, au même titre que le `robots.txt` et le `sitemap.xml`.

---

## 21. Import non exporté — warning silencieux

**Contexte**
En JavaScript/TypeScript, quand un fichier tente d'importer quelque chose qui n'existe pas (ou qui n'est pas exporté) dans le fichier source, le résultat est une valeur `undefined`. Dans certains cas, cela génère un warning dans la console ou un message d'erreur au build. Dans d'autres, le code continue de fonctionner — le warning est non bloquant.

`Phase` était un type TypeScript utilisé pour gérer les états de l'animation « binary typing » (supprimée en session 2). Quand l'animation a été retirée, `Phase` a été supprimé des exports de `animations.ts`, mais ses imports dans `HomepageIsland.tsx` et `MobileHomePage.tsx` n'ont pas été nettoyés. TypeScript le signale, mais le build passe quand même. Ce genre de résidu s'accumule silencieusement et finit par obscurcir les vraies erreurs en console.

**Cause**
Résidu de la suppression de l'animation « binary typing ». `Phase` a été retiré des exports mais pas des imports dans tous les fichiers concernés.

**Correctif**
À faire : supprimer les imports `Phase` dans les deux fichiers.

**Règle**
> Après toute suppression de feature, faire un grep du symbole supprimé dans l'ensemble du projet avant de committer. Les warnings non bloquants s'accumulent et obscurcissent les vraies erreurs en console.

---

## 22. Contraste insuffisant sur le contenu masqué visuellement

**Contexte**
Sur ce portfolio, le contenu textuel principal (H1, paragraphes, navigation) est dupliqué dans un `<main>` rendu invisible via CSS (`position:absolute; width:1px; height:1px; clip:rect(0,0,0,0)`). Cette technique s'appelle le **visually-hidden pattern** : le contenu est là pour les moteurs de recherche et les lecteurs d'écran, mais les utilisateurs voyants ne le voient pas.

L'outil WAVE analyse le contraste de *tout* le contenu HTML, y compris le contenu masqué visuellement. Il a détecté 5 erreurs de contraste : le texte héritait la couleur noire par défaut du navigateur (`#000000`), et WAVE calculait le ratio par rapport au fond réel de la page (`#070071`, le bleu marine du design). Résultat : ratio de 1.24:1 — très loin du minimum WCAG AA de 4.5:1.

Ce problème est contre-intuitif : on pourrait penser que du contenu invisible n'a pas besoin de contraste. Mais WCAG et les outils d'audit ne font pas cette distinction. Tout texte présent dans le DOM doit respecter les ratios, qu'il soit visible ou non.

**Cause**
Absence de couleur explicite sur le `<main>` masqué. La couleur noire par défaut du navigateur contraste très mal avec le fond sombre `#070071` de la page.

**Correctif**
Ajout de `color:#fafafa` dans l'attribut `style` inline du `<main>` masqué sur les 4 pages. `#fafafa` sur `#070071` donne un ratio d'environ 15:1 — largement conforme WCAG AAA.

**Règle**
> Toujours définir une couleur de texte explicite sur les éléments visually-hidden. Ne pas supposer que le contenu invisible est exempt des règles de contraste. Lors d'un audit WAVE, vérifier l'onglet Contrast même si le site paraît visuellement correct.

---

## 23. Formulaire technique Netlify sans attribut `aria-hidden`

**Contexte**
Netlify Forms fonctionne par détection statique : lors du build, Netlify scanne le HTML généré à la recherche d'un `<form>` avec l'attribut `data-netlify="true"`. Il enregistre automatiquement le formulaire pour collecter les soumissions.

Pour que cette détection fonctionne sur un site Astro (où le vrai formulaire est rendu par un island React côté client, donc invisible au build), la solution est d'ajouter un formulaire HTML statique identique dans le `.astro`, avec l'attribut `hidden` pour le masquer visuellement.

Le problème : `hidden` masque l'élément visuellement et le sort du flux de rendu, mais il reste présent dans le DOM. WAVE l'a détecté et a signalé ses `<input>` sans `<label>` comme des erreurs d'accessibilité — ce qui est techniquement correct, même si le formulaire n'est jamais présenté à un utilisateur réel.

**Cause**
Le formulaire Netlify statique est un artefact technique, pas une interface utilisateur. Ses champs n'ont pas de labels car ils ne sont jamais exposés. WAVE ne fait pas cette distinction.

**Correctif**
Ajout de `aria-hidden="true"` sur le `<form>` statique. ARIA (`Accessible Rich Internet Applications`) est un ensemble d'attributs qui permettent d'informer les technologies d'assistance du rôle et de l'état des éléments. `aria-hidden="true"` indique explicitement aux lecteurs d'écran d'ignorer l'élément et tous ses enfants. Netlify ignore les attributs ARIA — la détection au build n'est pas affectée.

**Règle**
> Tout élément HTML présent dans le DOM pour des raisons purement techniques (détection build, scripts tiers, analytics) doit être marqué `aria-hidden="true"` s'il contient des éléments interactifs ou du texte. `hidden` seul ne suffit pas pour les outils d'audit d'accessibilité.

---

## 24. Attributs `alt` incohérents entre desktop et mobile

**Contexte**
Les images du portfolio sont déclinées en deux versions : les composants desktop (`CasesIsland.tsx`) et les composants mobile (`MobileCasesPage.tsx`). Ces fichiers ont été développés séparément, sans revue croisée systématique des attributs `alt`.

L'audit a révélé une incohérence : les images hero (purement décoratives, fond atmosphérique avec texte superposé) avaient `alt=""` sur desktop — correct — mais `alt="SNCF Cart"` et `alt="Manutan Search"` sur mobile — incorrect. Les images décoratives doivent avoir un alt vide pour que les lecteurs d'écran les ignorent. Un alt non vide sur une image décorative crée du bruit inutile.

À l'inverse, la photo de portrait sur la page About avait `alt="Julien Bourcet"` dans les deux versions — fonctionnel, mais incomplet. Une photo de portrait sur une page About identifie une personne : `alt="Portrait of Julien Bourcet"` est plus contextuel et conforme à la logique WCAG (décrire le contenu, pas juste le nommer).

**Cause**
Absence de revue croisée desktop/mobile lors du développement des composants. Chaque fichier a été rédigé indépendamment.

**Correctif**
— Images hero (décoratives) : `alt=""` aligné sur desktop et mobile.
— Photo de portrait : `alt="Portrait of Julien Bourcet"` sur desktop (`AboutIsland.tsx`) et mobile (`MobileAboutPage.tsx`).

**Règle**
> Après tout développement de composant dupliqué (desktop + mobile), faire une revue croisée des attributs `alt`. La règle : images décoratives → `alt=""` ; images informatives → alt descriptif qui dit *ce que montre l'image*, pas juste *ce qu'elle est*.

---

## 25. Erreur W3C générée par Astro — faux positif connu

**Contexte**
Le validateur W3C (Nu Html Checker) signale une erreur sur toutes les pages du site : `Element style not allowed as child of element div`. Le snippet concerné contient le préfixe `astro-`, ce qui indique que cette balise n'est pas écrite dans notre code source — elle est injectée par Astro lors du build.

Astro utilise des balises `<style>` injectées à l'intérieur de `<div>` pour gérer l'hydratation des islands et les View Transitions. C'est un comportement interne du framework, pas une erreur dans notre code. Le navigateur interprète correctement la page malgré cette non-conformité technique.

**Cause**
Comportement interne d'Astro : injection de `<style>` scoped à l'intérieur de `<div>` pour les mécanismes d'hydratation. Présent sur tous les sites Astro avec View Transitions activées.

**Correctif**
Aucun — non corrigeable de notre côté. C'est une limitation du framework, documentée et connue dans la communauté Astro. À surveiller lors des mises à jour d'Astro.

**Règle**
> Lors d'un audit W3C, distinguer les erreurs issues du code source (corrigeables) des erreurs générées par le framework (faux positifs). Un préfixe `astro-`, `next-`, `nuxt-` ou similaire dans le snippet d'erreur indique une erreur framework. La documenter, ne pas s'y perdre.

---

## 26. Absence d'en-têtes de sécurité HTTP — `netlify.toml` non configuré

**Contexte**
Un navigateur et un serveur web communiquent via des **en-têtes HTTP** — des métadonnées invisibles échangées à chaque requête. Certains de ces en-têtes sont des instructions de sécurité que le serveur envoie au navigateur : "ne jamais afficher ce site dans une iframe", "toujours utiliser HTTPS", "n'exécute que les scripts venant de ces domaines"…

Par défaut, Netlify ne configure aucun en-tête de sécurité. Résultat : un audit Mozilla Observatory notait le site D ou F, non pas parce que le code était vulnérable, mais parce que ces protections n'étaient pas déclarées.

Ces en-têtes se configurent dans un fichier `netlify.toml` à la racine du projet. Sans ce fichier, le déploiement fonctionne — mais le site est exposé à des attaques comme le clickjacking (intégration dans une iframe malveillante), le MIME sniffing (exécution d'un fichier texte comme script), ou l'injection de ressources depuis des domaines tiers.

**Les en-têtes configurés et leur rôle :**
- `Strict-Transport-Security` — force HTTPS pendant 1 an, même si l'utilisateur tape `http://`
- `X-Frame-Options: DENY` — interdit l'intégration du site dans une iframe (anti-clickjacking)
- `X-Content-Type-Options: nosniff` — empêche le navigateur de deviner le type d'un fichier
- `Referrer-Policy` — contrôle ce qui est envoyé dans l'en-tête `Referer` vers les sites externes
- `Permissions-Policy` — désactive les APIs navigateur non utilisées (caméra, micro, géolocalisation…)
- `Content-Security-Policy` — définit précisément quelles ressources le site est autorisé à charger

**Cause**
Absence de `netlify.toml` dans le projet. La configuration de déploiement et les en-têtes de sécurité n'étaient pas versionnés.

**Correctif**
Création de `netlify.toml` avec l'ensemble des en-têtes de sécurité. Score Mozilla Observatory passé de F à B+.

**Le compromis honnête sur la CSP :**
La Content Security Policy contient `'unsafe-inline'` dans `script-src` et `style-src`. C'est inévitable sur ce projet : Astro injecte des scripts inline pour l'hydratation des islands et les View Transitions, et Framer Motion applique des styles inline via ses props d'animation. Sans serveur (site statique pur), il est impossible d'utiliser des `nonce` pour sécuriser ces scripts. Si le projet passe en SSR un jour, la CSP pourra être renforcée.

**Règle**
> Tout projet Netlify doit inclure un `netlify.toml` avec des en-têtes de sécurité dès le lancement. Ce fichier fait partie du squelette de base au même titre que `robots.txt` et `sitemap.xml`. Vérifier le score avec Mozilla Observatory avant de considérer un déploiement terminé.

---

*Document produit dans le cadre de la refonte de julienbourcet.fr — avril 2026*
*Julien Bourcet — Senior Product Designer*
