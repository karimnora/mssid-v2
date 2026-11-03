# V2 — Design « monde de jeu » des écrans enfant

## Décision de Karim (3 novembre 2026)

- Les écrans enfant passent au style « monde de jeu » : ciel de nuit, boutons brillants façon bonbon, titres en Lalezar, et Didou qui parle sur un ruban violet.
- Les écrans parents (carnet, abonnement, réglages, admin) gardent la charte crème `#FFFBF0` / `#0f172a`.
- Maquette validée avant l'application : https://claude.ai/artifact/AtzpPFF6br7ytASvpmoP3i. Elle contient l'accueil, une leçon, un quiz et le nouveau Didou.
- Didou est plus réaliste : fourrure en dégradé, yeux ambrés avec reflets, foulard vert à étoile rouge (`components/world/DidouPortrait.tsx`).
- La darija est reportée à plus tard. Didou parle en arabe littéral ou en français, selon la langue de l'app.

## Fonctionnement

- Flag `worldDesign`, activé par défaut sur `v2` et réglable dans l'onglet admin.
- `App.tsx` pose `<html data-world>` uniquement sur les écrans enfant : aujourd'hui l'accueil, les matières, les leçons, les examens, les défis et les labos, hors préscolaire et hors carte. Les fenêtres parents, les surfaces d'exercice, les laboratoires et le pied de leçon gardent les couleurs crème : c'est la règle « Parent and exercise surfaces » de `world.css`.
- `styles/world.css` redéfinit les couleurs de l'app (`--app-*`, `--kids-*`) et ajoute le ciel, les tuiles brillantes, les titres et le ruban. Les composants ne changent pas : avec le flag coupé, l'app retrouve exactement l'ancien rendu.
- La police Lalezar est hébergée par l'app (`@fontsource/lalezar`), car la politique de sécurité n'autorise que les polices locales.
- `components/world/DidouRibbon.tsx` affiche Didou, sa phrase et un bouton d'écoute qui passe par `speakText`. Les clips ElevenLabs sont utilisés quand ils existent.

## Étapes

- [x] Accueil (3 novembre 2026). Vérifié dans Edge en 390 × 844 et 1280 × 800, sans erreur JavaScript.
- [x] Choix des matières et lecteur de leçon (3 novembre 2026) : ciel de nuit autour des cartes blanches, comme sur la maquette. Les étiquettes d'étape et le titre « كلمات جديدة » sont rendus lisibles. Vérifié dans Edge en 390 × 844, sans erreur JavaScript.
- [x] Lecteur de leçon (3 novembre 2026) : gros bouton « التالي » bonbon vert. À partir de la 3AP, les étapes forment une rangée de stations : vertes si faites, dorées pour l'étape en cours, reliées par une ligne dorée (déjà parcourue) ou pointillée (à venir). La rangée défile pour garder l'étape en cours visible. En 1AP et 2AP, les étapes restent masquées comme avant. Vérifié dans Edge.
- [x] Quiz (3 novembre 2026) : réponses en boutons bonbons. Une bonne réponse devient verte avec un anneau doré ; une erreur devient lavande douce, jamais rouge. Didou apparaît dans la correction. Vérifié dans Edge.
- [x] Étoiles animées à la fin du quiz (3 novembre 2026) : 3 étoiles si tout est juste du premier coup, 2 à partir de 60 %, 1 sinon, jamais 0 (`lessonViewer/quizStars.ts`). Vérifié dans Edge : une erreur donne 2 étoiles.
- [x] Badge « إجابة صحيحة » plein et lisible (vert ou lavande, texte blanc).
- [x] « مساعدي » (3 novembre 2026) : panneau violet de nuit avec un bord doré et Didou dans l'en-tête. Les onglets et les années sont des bonbons, doré pour le choix actif. Les questions sont des tuiles brillantes. La correction et la méthode guidée restent sur une feuille crème pour la lecture, et « التصحيح المفصّل » est un bonbon vert. Le bouton fermer est désormais le bouton rond commun. Vérifié dans Edge avec un compte gratuit : liste, correction (le compteur passe de 3 à 2), méthode guidée, fermeture.
- [x] Examens et défis (3 novembre 2026) : le ciel de nuit s'étend à l'onglet « اختبر ». Le sélecteur « امتحانات / تحديات » devient une piste de nuit, avec un bonbon bleu pour les examens et doré pour les défis. La feuille d'examen garde le papier crème, ce qui permet aussi de l'imprimer, et le bandeau « حلول مجانية » est lisible. Vérifié dans Edge : liste des examens 5AP, examen ouvert, liste des défis, défi en cours.
- [x] Nouveaux labos immersifs (3 novembre 2026) : ablutions, prière, adab de la mosquée, code de la route, souk, drapeaux, préparation BEM, cahiers. Tous passent par `immersive/ImmersiveLabShell.tsx` :
  - une scène de nuit étoilée avec un bord doré ; Didou présente le labo sur son ruban violet, avec un bouton d'écoute ;
  - un compteur d'étoiles doré ; à chaque nouvelle étoile, Didou apparaît au-dessus de la barre du bas avec « نجمة جديدة! » et des confettis ;
  - les onglets sont des stations-bonbons reliées, dorée pour l'onglet ouvert ;
  - les réponses des quiz (prière, drapeaux, ablutions, mosquée) sont des bonbons, avec Didou dans la correction ;
  - les scènes et cartes de contenu restent claires pour la lecture.
  Vérifié dans Edge : mosquée (bonne réponse, puis étoile et fête de Didou), prière, souk. Tests : `ImmersiveLabShell.test.tsx`.
- [x] Souk du quartier, refait en scène guidée (4 novembre 2026) :
  - Didou lit à voix haute la liste des courses, chaque achat, le total, ce qui manque, puis la monnaie à rendre ; sa bulle suit l'étape en cours ;
  - on touche un étal (auvents rayés, articles dessinés) et l'article saute dans le panier ; un article hors liste n'est pas une faute : Didou explique ;
  - pièces et billets en dinars à poser sur le comptoir (on peut les reprendre), puis choix de la monnaie ; une erreur donne l'indice « احسب: 100 ناقص 50 » ;
  - sons « pop », pièce et caisse (`utils/immersiveFeedback.ts`), et une étoile par mission ;
  - fichiers : `immersive/SoukLab.tsx`, `SoukArt.tsx`, `souk.css`, `DidouGuide.tsx`.
- [x] Carte des pays et drapeaux (4 novembre 2026) :
  - Didou lit le nom, la capitale et une phrase sur chaque pays ; le drapeau choisi flotte sur son mât ;
  - le quiz devient « أين علم … ؟ » : 4 drapeaux, l'Algérie en premier ; une étoile seulement au premier essai ; une erreur montre le nom du pays touché et Didou aide ;
  - drapeaux corrigés : l'Algérie suit la construction officielle (croissant de rayons H/4 et H/5, étoile de rayon H/8) ; l'aigle de Saladin d'Égypte est redessiné ; l'épée saoudienne a sa pointe vers la hampe et la chahada est agrandie ;
  - les identifiants des masques sont nettoyés : avec React 19, certains navigateurs Android ne trouvaient plus le croissant ou les coins arrondis.
- [ ] Anciens labos : tableau crème posé sur le ciel, sans changement à l'intérieur. À reprendre un par un si l'on veut les rendre immersifs.
- [x] Barre du haut et barre du bas (3 novembre 2026) : bandeau de nuit avec un liseré doré. En haut, des boutons bonbons : retour bleu, réglages lavande, année dorée, profil vert. En bas, l'onglet actif est un bonbon bleu, et le bouton « مساعدة » est violet avec le nouveau Didou à la place de l'emoji 🦊. Vérifié dans Edge en 390 × 844 et 1280 × 800.
- [x] Nouveau Didou partout (3 novembre 2026) : la carte et la planète (Didou debout, dans le bateau et dans la fusée), leurs rubans, et la carte « صديقك ديدو ». Didou garde l'ancien dessin seulement quand l'enfant lui met une tenue de la garde-robe, en attendant que les tenues soient redessinées.
- [ ] Essai sur un vrai téléphone Android.

## Fenêtres : toujours un bouton fermer

- Chaque fenêtre affiche en haut le même bouton rond ✕ (`components/ui/ModalCloseButton.tsx`) : 48 px, libellé « أغلق » ou « Fermer » pour le lecteur d'écran.
- Ajouté le 3 novembre 2026 sur :
  - les rubans de Didou de la carte et de la planète, où la croix déclenche le premier choix (« لا » ou le bouton unique) pour que le voyage ne reste jamais bloqué ;
  - « خطوتان للبدء », qui revient à la session suivante ;
  - le choix de l'enfant, où la croix vaut « passer » ;
  - le menu « nourrir Didou » ;
  - le certificat des wilayas.
- Les fenêtres « Bravo » des jeux préscolaires se ferment seules au bout de 1,4 à 1,8 seconde.
- Tests : `components/ui/ModalCloseButton.test.tsx`.
