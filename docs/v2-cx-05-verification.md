# CX-05 — Village accessible aux comptes gratuits

Date : 16 novembre 2026. Branche `v2`. Statut : critère vérifié, cadenas Premium harmonisés et relecture favorable de Claude le 17 novembre. La case de la roadmap reste ouverte.

## Constat et changement

L'ouverture de l'accueil immersif était déjà indépendante du rôle dans le code présent : `journeyAvailable && designMode === 'world'`. La description de CX-05 et le commentaire dans `App.tsx` mentionnaient encore une restriction Premium qui n'existait plus.

- Le nom local `premiumPlanetHome` devient `worldHome` et le commentaire indique le comportement réel. L'import inutilisé `isPremiumRole` est supprimé. Aucun droit d'accès n'est modifié.
- Le village arabe est disponible pour les comptes gratuits et invités ; l'accueil français conserve la planète existante. Le choix de l'interface classique et l'exclusion du préscolaire sont conservés.
- La carte utilise le cadenas 3D existant, teinté en doré uniquement pour les restrictions Premium. Les jeux Premium réutilisent ce même cadenas à la place de leur ancien pictogramme blanc sur fond violet. Les cadenas liés à l'avancement conservent leur couleur.
- Les mondes 1 et 2 et le premier jeu restent gratuits. Les mondes 3 à 8 et les autres jeux gardent leurs restrictions. Leurs messages restent neutres et sans prix.

## Vérification ciblée

```text
npx vitest run src/components/journey/JourneyScreen.access.test.tsx src/components/journey/JourneyScreen.test.tsx src/components/home/DidouVillageHome.test.tsx src/utils/journeyProgress.test.ts src/utils/designMode.test.tsx
npx vitest run src/components/journey/JourneyScreen.access.test.tsx
```

**41 tests distincts réussis dans cinq fichiers** : 34 tests voisins réussis au premier passage, puis les sept nouveaux tests d'accès réussis à la dernière relance. Le test de première leçon a été ajusté pour passer les deux étapes réelles : confirmation de la station puis accueil de Didou.

Les nouveaux tests rendent les vrais composants du village, de la carte et de la fiche de jeu verrouillé. Seuls le corps de la leçon, la session, l'audio et les méthodes de géométrie/scrolling absentes de JSDOM sont remplacés. Ils couvrent :

- Compte gratuit et invité : village connecté affiché, navigation vers les cours, les laboratoires et les jeux.
- Carte gratuite : seuls les mondes 3 à 8 ont l'état Premium, leurs cadenas et ceux des jeux utilisent la teinte dorée ; ouvrir une station Premium propose le message prévu sans ouvrir la leçon ni donner de points.
- Jeu Premium verrouillé : aucun niveau jouable ; le retour au jeu gratuit ouvre ses niveaux.
- Comptes Premium et administrateur : aucune restriction Premium sur les mondes ou jeux (l'avancement des leçons reste requis).
- Première leçon gratuite : ouverture depuis la carte après confirmation et accueil de Didou.
- Absence de prix et d'instructions de paiement sur ces parcours.

`git diff --check` : aucune erreur d'espacement.

## Relecture — 17 novembre 2026

Claude a donné son accord au commit de ce lot (`docs/v2-relecture-cx-04-cx-24.md`, section CX-05). Les deux lignes de consentement de `App.tsx` restent dans CX-04 ; seul le renommage de l'accueil et son commentaire sont dans CX-05. Le contrôle visuel du contraste des cadenas sur les tuiles orange/jaune attend une reconstruction autorisée de l'image web.

## Suite et limites

Relecture de Claude avant commit, selon la règle 3 de la roadmap. L'affichage doré est appliqué en CSS à l'image existante ; aucune nouvelle image ni nouvelle disposition d'écran n'a été créée. Aucun build, aucune suite complète, aucun test navigateur, aucun commit ni push. L'image Docker locale n'est pas reconstruite et ce lot n'y est pas encore visible.
