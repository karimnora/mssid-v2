# Todo V1 — labos

Établi le 28 septembre 2026 d’après le code (`ActiveWorkspace.tsx`, 29 outils) et les bugs vus sur téléphone. **À faire sur `main` (branche `fix/…`), pas sur `v2`.** Pas de nouveau labo, pas de souk immersif, pas de code de la route.

Règle V1 : un enfant peut **ouvrir, lire, taper, finir**. Pas « plus beau ».

Cause commune à plusieurs bugs : `.lab-interior` force les fonds sombres en blanc **sauf** si un descendant a `data-lab-instrument`. Si cet attribut n’est posé que sur un panneau **démonté** (onglet), le texte blanc reste et devient illisible.

---

## Lot A — cassé sur téléphone (faire en premier)

- [ ] **Électricité / constructeur de circuit** (`CircuitBuilder.tsx`)
  - Canvas fixe 640 × 400 + `touch-action: none` sur tout le SVG.
  - Sur un écran ~360 px : moitié du circuit hors écran, scroll doigt bloqué, départ RTL au bord droit, nouveaux éléments hors vue, palette icônes seules.
  - Piste : largeur = viewport, `touch-action: none` seulement sur les pièces/bornes, spawn dans la zone visible, libellés sous les icônes, points ≥ 48 px.
- [ ] **Calculatrice** (`EducationalCalculator.tsx` + `TextToSpeechButton.tsx`)
  - Titre écrasé (~60 px de large), barre TTS ~330 px sur la même ligne, « السرعة » coupé.
  - Boutons TTS ~32 px, « 1x » en double, menu `right-0` au lieu de `end-0`.
  - Piste : barre **sous** le titre sur mobile ; hits 48 px ; un seul indicateur de vitesse.
- [ ] **Soroban, onglet Anzan** (`SorobanInteractive.tsx`)
  - `data-lab-instrument` seulement sur le canvas du boulier. Onglet Anzan : canvas absent → fond forcé blanc, `text-white` / `text-emerald-200` inchangés.
  - Champ « المجموع المتوقع » blanc sur blanc ; message de réussite / d’erreur illisible.
  - Piste : thème clair sur Anzan (`text-slate-900`, fond crème) **ou** `data-lab-instrument` sur le bloc Anzan entier. Vérifier aussi l’onglet « قواعد المكملات ».

**Validation :** les trois ouverts à 360 px, RTL, doigt uniquement, champ Anzan lisible, circuit entier atteignable.

---

## Lot B — même famille, à coller au Lot A

- [ ] **Règle `data-lab-instrument`** : l’attribut doit vivre sur un nœud **toujours monté** (racine du labo), ou chaque onglet sombre doit l’avoir. Ne plus le poser uniquement sur un enfant démonté.
- [ ] **Billets 500 / 2000 DA** (`AlgerianCurrencyMarket.tsx`) : déjà contournés en `swatchStyle` inline (les classes `from-indigo` / `from-purple` étaient blanchies). Ne pas réintroduire ces classes sur les swatches.
- [ ] **Aiguille des heures** (`ClockTrainerLab.tsx`) : déjà en `backgroundColor` inline. Ne pas remettre `bg-slate-900` sur l’aiguille.

---

## Lot C — composant partagé (un fix, plusieurs labos)

- [ ] **`TextToSpeechButton`** : colonne sur mobile, `flex-wrap`, cibles 48 px, `end-0`, un seul « 1x ». Touche calculatrice + tout labo qui pose la barre à côté d’un titre.
- [ ] **Bouton retour labo** : beaucoup de bannières ont `w-11 h-11` (44 px). Passer à `--hit` (48 px) / `min-h-[var(--hit)]` sur les labos du hub qui ont un `onBack` (marché, wilayas, sciences, anatomie, cycles, fractions, grille, horloge, syllabes, lecture, topo, vitesse, projets FR, dialogues EN, écriture, éveil, …).

---

## Lot D — chemin d’or 1AP / 2AP (première démo)

Ces labos sont jouables. On ne les refait pas. On vérifie 360 px et on corrige seulement ce qui casse la séance.

- [ ] **Bande numérique** (`primary_math_ops`) — labo sûr 1AP/2AP (C-05).
- [ ] **Horloge** (`clock_trainer`) — 2AP : heure et demie seulement (`clockTrainerForGrade`). Vérifier que les deux aiguilles se voient.
- [ ] **Marché dinars** (`algerian_market`) — panier + rendu de monnaie + défi. Pas de photos, pas de rue 3D.
- [ ] **Éveil** (`primary_discovery`) — 1AP/2AP.
- [ ] **Syllabes** (`syllable_studio`) — français masqué en 1AP/2AP (`canShowFrenchInLab`).
- [ ] **Wilayas** — boutons zoom actuellement 44 px ; passer à 48 px.

**Validation :** invité 2AP, un labo maths + un labo identité, sans scroll horizontal bloqué.

---

## Lot E — seulement si tu montres 4AP / 5AP

- [ ] **Grille aire / périmètre** : cellules `w-8 h-8` (32 px). Monter à 48 px ou zone tap plus large que le carré dessiné.
- [ ] **Labo sciences** : 7 onglets en `grid-cols-2` — lisibles mais denses ; pas de refonte, juste ne pas couper les libellés.
- [ ] **Anatomie** : onglets avec `overflow-x-auto` — OK si les onglets restent tappable à 48 px.
- [ ] **Vitesse** (`speed_lab`) : HUD sombre cohérent (`data-lab-instrument` sur la racine). Dense, pas cassé. **Ne pas réécrire en V1.**

---

## Hors V1 (V2 ou plus tard)

- Souk immersif, photos de marché, code de la route enfant.
- Unifier les 29 labos sur un même thème visuel.
- Réécrire le labo vitesse, le musée, la géométrie, les 7 expériences sciences.
- Tamazight : le cahier dit flag éteint au lancement ; `featureFlags.ts` le met à `true`. Décision produit, pas un fix labo.
- Table de multiplication 2AP (programme : 2, 3, 4, 5, 10 seulement) alors que le labo est `minGrade: 3AP` et propose 1–10. Changement pédagogique, pas un crash.

---

## État par labo (29 outils)

| Labo | Fichier | V1 |
|---|---|---|
| Marché dinars | `AlgerianCurrencyMarket.tsx` | Jouable. Lot D vérif. Pas d’immersif. |
| 58 wilayas | `WilayasExplorer.tsx` | Jouable. Zoom 44 px → Lot C/D. |
| Musée histoire | `AlgerianHistoryMuseum.tsx` | Jouable. Pas de refonte. |
| Tamazight lab + curriculum | `TamazightLabInteractive` / `TamazightCurriculumViewer` | Flag. Hors V1 sauf décision de les cacher. |
| Studio écriture | `TouchWritingStudio.tsx` | Flag `writingLab` ON. Vérif doigt si tu démos 1AP. |
| Grand labo sciences | `ScienceExperimentLab.tsx` | Flag `advancedLabs`. Lot E densité onglets. |
| Conjugueur arabe | `ArabicConjugator.tsx` | 3AP+. Thème sombre + `data-lab-instrument`. Pas de `onBack` local (chrome app). |
| Conjugueur FR | `FrenchLanguageLab.tsx` | Idem. Temps filtrés par `labGradePolicy`. |
| Conjugueur EN | `EnglishLanguageLab.tsx` | Idem. |
| Soroban | `SorobanInteractive.tsx` | **Lot A.** Anzan illisible. |
| Électricité | `ElectricityLabInteractive` + `CircuitBuilder` | **Lot A.** Canvas mobile. |
| Géométrie | `GeometryVisualizer.tsx` | Flag. Thème + instrument. Pas de refonte. |
| Convertisseur | `UnitConverter.tsx` | Jouable. |
| Calculatrice | `EducationalCalculator.tsx` | **Lot A.** En-tête TTS. |
| Tables de multiplication | `MultiplicationTableInteractive.tsx` | Jouable (HUD sombre). 3AP+. |
| Bande numérique | `PrimaryMathLabInteractive.tsx` | **Lot D.** |
| Éveil | `PrimaryDiscoveryLabInteractive.tsx` | **Lot D.** |
| Projets français | `FrenchProjectsLabInteractive.tsx` | 3AP+. |
| Dialogues anglais | `EnglishAudioDialoguesLab.tsx` | 3AP+. |
| Anatomie | `HumanAnatomyLab.tsx` | Flag. Digestion 4AP, respiration 5AP. Lot E. |
| Jour / nuit | `EarthCyclesLab.tsx` | Flag. Instrument déjà sur la racine (bannière indigo). |
| Fractions | `FractionsDecimalsLab.tsx` | Décimaux 5AP seulement. |
| Grille aire | `AreaPerimeterGridLab.tsx` | Lot E cellules 32 px. |
| Horloge | `ClockTrainerLab.tsx` | **Lot D.** |
| Syllabes | `SyllableStudioLab.tsx` | **Lot D.** |
| Lecture rapide | `SpeedReadingLab.tsx` | 2AP+. Pas prioritaire. |
| Topographie | `TopographyMapLab.tsx` | 4AP+. |
| Vitesse / ville | `SpeedVelocityLab.tsx` | Jouable, dense. Hors réécriture V1. |

Exams et défis ne sont pas des labos.

---

## Ordre de travail suggéré

1. Lot A (3 bugs téléphone) sur une branche `fix/labs-mobile`.
2. Lot C TTS (même branche si le composant est touché par A).
3. Vérifier Lot D sur un Android réel, 360 px.
4. Lot B + boutons retour 48 px si encore du temps.
5. Stop. Pas de Lot E tant qu’aucune famille n’a ouvert 4AP.
