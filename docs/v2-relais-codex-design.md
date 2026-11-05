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
