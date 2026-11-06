# V2 — Relais pour Codex : refonte visuelle (« qualité jeu »)

État au 5 novembre 2026, branche `v2` (worktree `C:/Users/Karim/.codex/worktrees/v2-testing/mssid-V1`). `main` est la prod : n'y touche jamais.

## Déjà fait (ne pas refaire)

- **Didou rendu en 3D** dans toute l'app. `components/world/DidouPortrait.tsx` gère les poses `talk`, `cheer`, `think` et `point`.
- **Accueil planète** des 8 mondes, avec un dock de boutons bonbons (`journey/PlanetHub.tsx`).
- **8 mondes peints** sur la carte et derrière les leçons (`components/world/worldArt.ts`, `WORLD_DECOR`), animés par `WorldAmbience.tsx` (nuages, oiseaux, reflets, étoiles, sable).
- **Leçon du voyage** dans son décor, avec l'accueil de Didou (`journey/JourneyLessonStage.tsx`).
- **Choix monde de jeu ou classique** mémorisé sur l'appareil (`utils/designMode.ts`, `components/world/DesignModeSwitch.tsx`).
- **Labo de la vitesse** : 9 véhicules rendus, autoroute peinte, météo (`SpeedVelocityLab.tsx`, `Vehicle3DModel.tsx`, `speedLab.css`, `assets/labs/speed/`).
- **Labyrinthes** : pierres rendues pour tous les labyrinthes (`learningGames.css`, `assets/games/stone-*.webp`). Les 3 jeux du préscolaire « jardin d'enfants », « petit train » et « chemin de l'école » ont un décor peint (`theme.backdrop` dans `data/games/packsPre.ts`).

Les prompts d'images sont dans `docs/v2-pilote-prompts-nanobanana.md` (mondes) et `docs/v2-labos-prompts-nanobanana.md` (labos et labyrinthes). Chaque doc contient une section « Résultat » par lot.

## Méthode d'intégration des images (à suivre)

1. Karim génère les images avec Nano Banana et les dépose dans `C:\Users\Karim\Downloads\didou-labos\`. Les noms de Gemini ne correspondent pas aux numéros de la doc : fais une planche-contact numérotée et identifie chaque image à l'œil.
2. **Refuse** :
   - les **planches de synthèse** avec étiquettes violettes (« L15 - Marché… ») : elles sont trop petites, chaque élément fait 70 à 400 px, et leurs étiquettes sont dans l'image ;
   - toute image où **Didou n'est pas le modèle de référence**, par exemple un Didou à lunettes d'aviateur, en gilet, sans foulard vert ;
   - le texte dans l'image ;
   - les drapeaux ;
   - les lieux non algériens (Golden Gate, Santorin…).
3. Pour les éléments sur fond vert :
   - détoure seulement le **vert pur**, car le foulard de Didou et l'herbe sont verts ;
   - découpe une planche selon les **vides entre objets**, et non sur une grille fixe : un train déborde de sa case ;
   - exporte en **WebP** (320 à 480 px pour un élément, 1280 à 1600 px et ≤ 250 Ko pour un décor) ;
   - range les fichiers dans `frontend/src/assets/...`, importés depuis le code : Vite leur donne un nom haché et la PWA les met en cache.
4. Un même élément en deux états (ampoule éteinte puis allumée, feu rouge puis vert) doit être superposable : fais un fondu d'opacité de l'un à l'autre.
5. Les sprites sont dessinés **tournés vers la droite**. Retourne-les en arabe (`[dir='rtl'] … { transform: scaleX(-1) }`).
6. Animations : seulement `transform` et `opacity`, légères sur Android. Tout s'arrête avec `prefers-reduced-motion`.
7. Ne change ni la mécanique ni le contenu pédagogique d'un labo : uniquement son rendu.

## Prochaines étapes, par priorité

1. **Labos ablutions et prière** (`immersive/WuduLab.tsx`, `immersive/SalatLab.tsx`, données dans `data/immersive/wudu.ts` et `salat.ts`). Images L05 à L12 : décor de la salle d'ablutions, mosquée, gestes et positions de l'enfant de référence.
   - **Ne valide que des images exactes** :
     - les ablutions ont 7 gestes, dans l'ordre de `wudu.ts`, avec le passage des mains mouillées sur la tête (مسح الرأس) ;
     - la prière a 7 positions, de **profil**, tournées vers la qibla ;
     - l'assise entre les deux prosternations est **sur le pied gauche, pied droit dressé**, jamais en tailleur.
   - À faire relire par un enseignant d'éducation islamique avant diffusion.
2. **Labo de l'électricité** (`ElectricityLabInteractive.tsx`). Images L13 à L16, avec les états doubles : ampoule, interrupteur, LED. Animations :
   - l'ampoule s'allume en fondu quand le circuit est fermé ;
   - le moteur tourne ;
   - le buzzer vibre.
3. **Code de la route** (`immersive/RoadCodeLab.tsx`, `data/immersive/roadCode.ts`). Images L17 à L19. En Algérie, on roule à droite : on regarde à gauche d'abord.
4. **Souk** (`immersive/SoukLab.tsx`, `SoukArt.tsx`). Images L20 à L24. Les prix et les dinars restent posés par l'app.
5. **Labyrinthe de la ferme du préscolaire** (`game-pre-memory-farm` : c'est un jeu de mémoire, il reçoit seulement un décor). Le décor reçu montre un Didou non conforme : à régénérer sans Didou.
6. **Autres labos** : sciences, maths, Algérie, langues, Coran. Écris leurs prompts sur le modèle de `v2-labos-prompts-nanobanana.md`.
7. **Reste du lot 3 des mondes** :
   - îlot de l'Espace, sans drapeau ;
   - retouche des médailles 4 (Golden Gate à remplacer par le pont de Sidi M'Cid) et 7 ;
   - décor de la Casbah plus fidèle.

## Règles du dépôt

- Lis `CLAUDE.md` : programme officiel, RTL, cibles tactiles ≥ 60 px, pas de texte rouge agressif.
- **Ne lance ni `tsc`, ni `vitest`, ni les e2e, et ne commite pas sans le feu vert de Karim.** Avec le feu vert :
  - lance `tsc` via PowerShell avec `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`. La machine a 8 Go de RAM : en cas de « out of memory », relance seul, ou vérifie seulement les fichiers modifiés ;
  - lance `npx vitest run <dossiers touchés>`, puis toute la suite (2 519 tests) avant de pousser.
- Vérifie à l'écran avec Playwright (Chromium) sur `http://localhost:3000` (`npm run dev` dans `frontend`) :
  - simule `**/api/**`, avec `/v1/users/me` qui renvoie `ROLE_PREMIUM` et la classe ;
  - pose `mssid_active_child_id=account` dans le localStorage ;
  - vérifie en arabe, en 390 × 844 et 1280 × 800.
- Commits en anglais, préfixe `feat(v2):` ou `fix(v2):`, sur `v2`.


## Accueil village connecté — 6 novembre 2026

Le village approuvé remplace le hub arabe du parcours Didou. Il réutilise le profil actif, la classe, les leçons publiées, la validation complète des quiz, la prochaine station et la mission pédagogique existante. Cours, carte, labos, jeux, examens et carnet parent restent accessibles avec leurs gardes habituelles. La mission est isolée par identifiant d'enfant ; le parcours se remonte au changement de profil/classe pour arrêter la voix précédente. Le mode classique reste accessible ; français et préscolaire conservent leur interface. Voir [le rapport d'intégration](design/home-v3-preview/README.md).


## Consolidation du jardin et fondations — 6 novembre 2026

Lots 1 et 2 du TODO de Karim : accueil définitif dans components/home/DidouVillageHome, contrôleur vocal et dialogues extraits, focus partagé avec PlanetShelf, CSS lisible et tokens de couleurs/formes/ombres/mouvement. Rendu approuvé conservé. Voir [les fondations et leur vérification](design/v2-fondations.md). Ce lot n'est pas la tranche 5AP maths ni l'ouverture du village aux comptes gratuits.

## Accueil et leçon pilote — TODO 3 et 4, 6 novembre 2026

Mission et progression réelle visibles à l’accueil, reprise directe, destinations arabe et maths explicites. Pilote arabe 5AP fractions en cinq phases avec manipulation non notée, Didou réactif, indices réels et 42 répliques Nova A réutilisables. Programme, exercices, quiz et règles de validation conservés. Voir [le rapport et les limites](design/v2-accueil-pilote-5ap.md).

## Pilote fractions renforcé — 6 novembre 2026

Les quatre corrections demandées après revue sont intégrées : trois manipulations et labo de transfert, présentation jardin extraite et configuration centrale, indices par callback partagé, banque vocale compacte et fragments d’accueil, bilan de séance protégé. Voir [le rapport de vérification et les limites](design/v2-pilote-fractions-renforce.md). Les résultats officiels restent ceux du moteur existant. Désormais : commit local sur v2, aucun push sans nouvel accord de Karim.

## Pilote fractions — scène jardin et parcours tactile, 6 novembre 2026

Les trois priorités visuelles sont intégrées : scène plein écran cohérente depuis le lien direct et le jardin, parts touchables avec regroupement en unités et secours +/−, puis parcours linéaire sans sous-onglets (trois découvertes, trois transferts au labo, explication). Retour et son restent disponibles, les réponses ne sont pas remises à zéro après une erreur. Voir [le rapport et les limites](design/v2-fractions-scene-jardin.md). Le moteur pédagogique, les points et les questions restent ceux du cours existant. Commit local sur v2, aucun push.


## Fractions : découverte et alertes préservées — 6 novembre 2026

La décomposition démarre avec des parts en vrac (17 puis 7) ; la réserve diminue pendant la manipulation et aucun entier prérempli ne donne la réponse. #root n’est plus masqué ni rendu inert : seules les surfaces V1 et le décor du parcours sont suspendus, avec restauration exacte à la sortie. La scène reste sous les fenêtres globales. Six parcours Chromium passent ; les vrais composants de badge et de connexion restent utilisables. Voir [le rapport et ses limites](design/v2-fractions-decouverte-et-alertes.md). Le bilan durable, l’aide unique et les finitions restantes ne font pas partie de cette correction. Commit local, aucun push.
