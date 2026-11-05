# V2 — Pilote « qualité jeu » : prompts d'images Nano Banana

Objectif : produire les ~13 images d'un parcours complet au niveau final, avant de généraliser.
Parcours du pilote : **planète d'accueil → monde de Constantine (Maths 5AP : division, fractions, durées) → leçon → quiz**.

Rappel : on s'inspire de l'esprit « jeu 3D brillant », on ne copie aucun personnage ni visuel d'une autre app. Didou et les lieux algériens sont notre identité.

---

## Règles de production (à lire avant de commencer)

1. **Commencer par l'image 01 (fiche de Didou).** Ensuite, **joindre cette image à chaque prompt** où Didou apparaît, et garder la phrase « Use the character from the attached reference image ». C'est ce qui garde le même Didou d'une image à l'autre.
2. **Aucun texte dans les images.** Tous les textes (arabe, français) sont posés par l'app, en RTL. Si une image contient des lettres, on la régénère.
3. **Pas de drapeau algérien dessiné par l'IA** : les proportions sont presque toujours fausses. Le drapeau, quand il faut, est ajouté par le code.
4. **Fond uni pour les éléments détourés** (Didou, planète, objets, îlot) : vert pur `#00FF00`. Je fais le détourage et la conversion en WebP transparent. Si Didou paraît vert sur les bords, régénérer avec le fond magenta `#FF00FF`.
5. **Format** : choisir le ratio indiqué dans l'outil (AI Studio / Gemini). Prendre la plus haute résolution disponible (2K ou 4K avec Nano Banana Pro).
6. **Générer 3 ou 4 variantes** par prompt et garder la meilleure. Les retouches se font en conversation (« same image, but… »).
7. **Déposer les fichiers** dans `C:\Users\Karim\Downloads\didou-pilote\` avec les noms indiqués (PNG). Je m'occupe ensuite de l'optimisation (poids, tailles, chargement progressif) et de l'intégration.

---

## Bloc de style commun

À coller **au début de chaque prompt** :

```
STYLE: premium 3D animated children's game key art, high-end animated feature film rendering, soft global illumination, warm rim light, glossy saturated colors, chunky rounded friendly shapes, subtle subsurface scattering on fur and skin, clean readable silhouettes, gentle depth of field, joyful and magical mood, suitable for children aged 6 to 11. No text, no letters, no numbers, no logos, no watermark, no flags.
```

---

## A. Didou (5 images)

### 01 — `01-didou-fiche.png` · ratio 16:9 · fond vert

```
[STYLE]
Character reference sheet of "Didou", an original cute fennec fox mascot for an Algerian educational app. Three full-body views side by side on a plain flat pure green #00FF00 background: front view, three-quarter view, side view, all standing in a neutral friendly pose, same scale, evenly lit.
Character design: young fennec fox, child proportions (big head, small body, about 3 heads tall), very large upright triangular ears with soft pink-peach inner ear and small dark brown tips, warm orange fur with gradient from light apricot on the top of the head to deeper burnt orange on the back, cream-white muzzle, chest and belly, big round amber-gold eyes with bright highlights and expressive eyebrows, small dark nose, friendly closed-mouth smile, fluffy tail with cream tip. Wears a soft green scarf (emerald green, #1FA35B) knotted at the neck with one end hanging, with a single small red five-pointed star embroidered on the hanging end. No other clothing.
Consistent design across the three views, no shadows on the background, no props.
```

### 02 — `02-didou-coach-parle.png` · ratio 1:1 · fond vert

Utilisée pour « Je vais m'adapter à toi » et les explications.

```
[STYLE]
Use the character from the attached reference image, exactly the same design, colors and green scarf with red star.
Didou the fennec fox, upper body framing from the waist up, facing the viewer, warm encouraging smile with mouth slightly open as if talking, one paw raised in a friendly open gesture as if explaining, eyebrows raised kindly, ears upright. Plain flat pure green #00FF00 background, no shadow on the background.
```

### 03 — `03-didou-bravo.png` · ratio 1:1 · fond vert

Bonne réponse, fin de quiz, étoile gagnée.

```
[STYLE]
Use the character from the attached reference image, exactly the same design, colors and green scarf with red star.
Didou the fennec fox, full body, jumping joyfully in the air with both arms raised, eyes closed in happiness, big open smile, tail swinging, scarf flying, a few small golden sparkles around him. Plain flat pure green #00FF00 background, no shadow on the background, sparkles must not touch the edges.
```

### 04 — `04-didou-reflechit.png` · ratio 1:1 · fond vert

Indice, réponse à revoir : toujours bienveillant, jamais déçu.

```
[STYLE]
Use the character from the attached reference image, exactly the same design, colors and green scarf with red star.
Didou the fennec fox, upper body from the waist up, three-quarter view, thoughtful and kind expression, one paw touching his chin, eyes looking up to the side, one ear slightly tilted, small confident smile as if he has a helpful idea. Calm and encouraging, never sad or disappointed. Plain flat pure green #00FF00 background, no shadow on the background.
```

### 05 — `05-didou-montre.png` · ratio 1:1 · fond vert

Présente une carte de leçon. Il montre vers **la gauche de l'image** : en arabe, la carte sera posée à gauche de Didou. Je ferai le miroir pour le français.

```
[STYLE]
Use the character from the attached reference image, exactly the same design, colors and green scarf with red star.
Didou the fennec fox, full body, standing in three-quarter view turned toward the left of the image, pointing with one arm extended toward the left side of the frame, other paw on his hip, enthusiastic smile, looking at the viewer. Leave empty space on the left side. Plain flat pure green #00FF00 background, no shadow on the background.
```

---

## B. Accueil : la planète (3 images)

### 06 — `06-planete-didou.png` · ratio 1:1 · fond vert

La planète d'accueil, avec les 8 mondes. Le centre reste dégagé pour le gros bouton « Play » posé par l'app.

```
[STYLE]
A small round magical planet floating in space, seen from the front, glowing soft blue atmosphere halo around it. The planet surface is a smooth glossy blue sphere, and around its rim sit eight small, detailed miniature dioramas of Algerian places, evenly spaced like a crown around the sphere, each one popping out of the surface:
1. Sahara: golden dunes, a palm oasis and an earthen ksar.
2. Algiers Casbah: white stacked houses with terraces on a hill and blue doors.
3. Mediterranean sea: a turquoise bay, a lighthouse and a small fishing boat.
4. Constantine: deep rocky gorge crossed by a long suspension bridge, old houses on the cliff edge.
5. Djurdjura mountains: snowy peaks, cedar trees and a small stone Kabyle village.
6. Timgad: Roman ruins with a triumphal arch and columns.
7. Tassili n'Ajjer: red sandstone rock arches and towers.
8. Space: a small rocket on a launch pad and an observatory dome.
The center of the planet's front face is left clear and smooth (an empty round area for a button). Plain flat pure green #00FF00 background around the planet, no stars, no shadow on the background.
```

### 07 — `07-espace-paysage.png` · ratio 16:9

```
[STYLE]
Wide background for a children's game home screen: deep space at night, rich gradient from deep navy #0B1A4A at the edges to bright royal blue glow in the center, soft purple and teal nebula clouds, hundreds of tiny twinkling stars of different sizes, a few faint constellation lines, two or three tiny distant planets near the edges. Calm center area with a soft radial light (a planet will be placed there). No characters, no objects in the center, no text.
```

### 08 — `08-espace-portrait.png` · ratio 9:16

```
[STYLE]
Same artwork as the attached image (deep space night background), recomposed for a vertical phone screen in portrait orientation: same colors, same nebula and star style, soft radial light in the center, calm empty center area. No characters, no text.
```
(Joindre l'image 07.)

---

## C. Monde de Constantine (3 images)

### 09 — `09-ilot-constantine.png` · ratio 1:1 · fond vert

L'îlot du monde sur la carte de voyage.

```
[STYLE]
A floating miniature diorama island of Constantine, Algeria, the "city of bridges", seen in three-quarter top view: a chunk of land floating in the air with rocky cliff edges underneath, a deep dramatic gorge in the middle with a little river at the bottom, a long elegant suspension bridge crossing the gorge from cliff to cliff, a second stone arch bridge lower down, old white and ochre houses with tiled roofs perched on the cliff edges, a few green trees. Small golden glowing path dots crossing the bridge. Plain flat pure green #00FF00 background, no shadow on the background.
```

### 10 — `10-constantine-decor-paysage.png` · ratio 16:9

Fond de la leçon et du quiz : lumineux, et assez calme pour poser du texte par-dessus (comme la forêt de la vidéo).

```
[STYLE]
Wide painted background for a children's game lesson screen, inspired by Constantine, Algeria: at golden hour, a deep rocky gorge with a long suspension bridge high across it in the middle distance, old white and ochre houses perched on the cliffs, soft misty mountains far behind, warm sky shifting from soft blue at the top to peach near the horizon, a few soft clouds, birds far away. Atmospheric perspective, the whole image slightly softened and calm so text cards can be placed on top, lower contrast in the central area. No characters, no text.
```

### 11 — `11-constantine-decor-portrait.png` · ratio 9:16

```
[STYLE]
Same artwork as the attached image (Constantine gorge and suspension bridge at golden hour), recomposed for a vertical phone screen: the bridge in the upper third, the gorge and cliffs going down the sides, calm softened central area for text cards. Same colors and lighting. No characters, no text.
```
(Joindre l'image 10.)

### 12 — `12-constantine-premier-plan.png` · ratio 16:9 · fond vert

Premier plan séparé, pour l'effet de profondeur (parallaxe) : rochers et végétation **sur les bords uniquement**.

```
[STYLE]
Foreground framing elements only, for a parallax layer: on the far left and far right edges, warm ochre rocky cliff edges with a few green bushes, wild flowers and an olive tree branch, slightly out of focus, large in scale as if very close to the camera. The whole middle of the image is completely empty plain flat pure green #00FF00. Plain flat pure green #00FF00 background everywhere else, no shadow on the background.
```

---

## D. Objets de jeu (1 planche)

### 13 — `13-objets.png` · ratio 16:9 · fond vert

Je découpe chaque objet séparément.

```
[STYLE]
A clean sheet of six separate isolated 3D game objects, evenly spaced in two rows with generous space between them, all on a plain flat pure green #00FF00 background, no shadows on the background:
1. A glossy golden five-pointed star with soft bevel and sparkle highlight.
2. A golden medal with a ribbon, the medal engraved with a small suspension bridge relief (no letters).
3. A small wooden treasure chest, slightly open, golden coins and light glowing inside.
4. A friendly padlock in soft purple and gold (for locked content), rounded and cute, not scary.
5. A round traditional Algerian copper tray with a round cake cut into 4 equal slices, one slice slightly pulled out (to illustrate fractions).
6. A cute round golden pocket watch, open, with a simple clock face without numbers (to illustrate durations).
```

---

## Résultat (5 novembre 2026)

Les 13 images ont été générées et intégrées. Elles sont détourées, en WebP, rangées dans `frontend/src/assets/world/` (~600 Ko au total) et listées dans `components/world/worldArt.ts`.

- **Didou** : `DidouPortrait` affiche les poses rendues. La pose « parle » est le réglage par défaut. Dans le quiz, une bonne réponse donne « bravo » et une réponse à revoir donne « réfléchit » (`LessonQuizPanel`, `ImmersiveLabShell`). Sur la carte, `DidouFull` montre Didou debout : c'est la vue de face de la fiche 01.
- **Accueil (choix de Karim, 5 novembre)** : la planète des 8 mondes tourne d'un monde à chaque flèche, et Didou nomme le monde. Le bouton Play ouvre la carte. Cours, ateliers, médailles, parents et « كل الأنشطة » passent dans une rangée de boutons bonbons sous la planète. Le fond d'espace peint change entre paysage et portrait.
- **Constantine** :
  - Sur la carte, le décor peint remplace le décor vectoriel. Le pont est calé sous les deux stations du tablier (y = 492).
  - Une leçon de Constantine s'ouvre dans son décor, avec un premier plan en parallaxe en paysage. Didou accueille l'enfant avec une phrase lue à voix haute, puis le bouton « هيّا! » lance la leçon. La feuille de leçon reste crème (`JourneyLessonStage`).
- **Étoile** : l'étoile rendue remplace l'étoile vectorielle partout sur la carte et l'accueil.

À régénérer :
- [ ] **06 planète** : Timgad apparaît deux fois (9 dioramas au lieu de 8). Retouche demandée au lot 2 (image 14).
- [ ] **13 objets, gâteau** : 6 parts inégales au lieu de 4 égales. Il est écarté, faux pour une leçon de fractions. À refaire seul au lot 2 (image 15).
- [x] Coffre et cadenas placés sur la carte (5 novembre) : le coffre marque les trésors, grisé tant que le monde n'est pas ouvert ; le cadenas marque les stations fermées et Premium.
- [ ] La médaille attend les 7 autres mondes, pour que les 8 forment une série. La montre attend une leçon de durées où la placer.

## Lot 2 : corrections, puis Sahara et Casbah (5 novembre 2026)

Le Sahara et la Casbah sont les deux mondes gratuits. Ce sont eux que tous les enfants voient en premier.

Déposer les fichiers dans `C:\Users\Karim\Downloads\didou-lot2\`, avec les mêmes règles que plus haut : bloc STYLE en tête de chaque prompt, fiche de Didou jointe s'il apparaît, fond vert pur pour les éléments détourés, aucun texte, aucun drapeau.

### Règle des décors de monde (lire avant 16 à 21)

Sur la carte, le décor fait 1600 × 900 et les stations sont posées sur le **tiers bas** (y entre 560 et 720), réparties sur toute la largeur. Le décor doit donc avoir :
- un **sol praticable et assez calme sur toute la largeur du tiers bas** : sable, pavés, terrasse. Pas de ravin, d'eau ou d'objet important à cet endroit ;
- les éléments marquants (ksar, palmiers, maisons, mosquée) **dans le tiers du milieu et le ciel** ;
- **les bords gauche et droit au même niveau de sol**, car le décor se raccorde aux mondes voisins.

### 14 — `14-planete-corrigee.png` · ratio 1:1 · fond vert

C'est une **retouche** : joindre `06-planete-didou.png`, ne pas régénérer depuis zéro.

```
Edit the attached image. Remove the Roman temple diorama with columns and a triangular pediment at the lower left of the planet (keep the Roman triumphal arch on the left side). Then space the remaining eight dioramas evenly around the planet, one every 45 degrees, in this clockwise order starting at the top: Sahara (top), Casbah, Mediterranean sea with lighthouse, Constantine bridge, Djurdjura snowy mountains (bottom), Timgad triumphal arch, Tassili red rock arches, rocket and observatory. Keep everything else identical: same planet, same style, same lighting, same plain flat pure green #00FF00 background. Exactly eight dioramas, each place only once.
```

L'ordre compte : il correspond à l'ordre des mondes dans l'app, donc les flèches de l'accueil tomberont juste.

### 15 — `15-gateau-quarts.png` · ratio 1:1 · fond vert

Sert d'illustration aux fractions (5AP) : le dessin doit être exact.

```
[STYLE]
A single isolated 3D object, seen from a three-quarter top view: a round traditional Algerian copper tray holding a round golden cake cut into exactly 4 equal quarter slices by two perpendicular straight cuts through the exact centre. One quarter slice is pulled slightly outward from the others so the four equal parts are clearly visible. No other slices, no crumbs, no decoration on the cake. Plain flat pure green #00FF00 background, no shadow on the background.
```

Vérifier avant de m'envoyer l'image : **4 parts, toutes de même taille**.

### 16 — `16-ilot-sahara.png` · ratio 1:1 · fond vert

```
[STYLE]
A floating miniature diorama island of the Algerian Sahara, seen in three-quarter top view: a chunk of golden sand floating in the air with ochre rock underneath, soft sculpted dunes, a small green palm oasis with a round blue pool, and a red-ochre earthen ksar (old fortified village with crenellated walls and small square windows, inspired by Timimoun and Taghit). A tiny camel resting near the palms. Small golden glowing path dots crossing the sand. Plain flat pure green #00FF00 background, no shadow on the background.
```

### 17 — `17-sahara-decor-paysage.png` · ratio 16:9

```
[STYLE]
Wide painted background for a children's game world, the Algerian Sahara at late afternoon: in the middle distance, a red-ochre earthen ksar with crenellated walls on a low rocky hill, a palm oasis with a small blue pool, tall golden dunes rolling behind under a warm sky shifting from soft blue at the top to apricot near the horizon, a few soft clouds. The whole lower third of the image is a wide, gently undulating, calm sandy ground running across the full width, at the same height on the left and right edges, with no objects on it. Atmospheric perspective, slightly softened, calm. No characters, no text.
```

### 18 — `18-sahara-decor-portrait.png` · ratio 9:16

Joindre l'image 17.

```
[STYLE]
Same artwork as the attached image (Algerian Sahara, red-ochre ksar, palm oasis, golden dunes at late afternoon), recomposed for a vertical phone screen: the ksar and palms in the middle third, the sky in the upper third, a calm empty sandy ground in the lower third. Same colors and lighting. No characters, no text.
```

### 19 — `19-ilot-casbah.png` · ratio 1:1 · fond vert

```
[STYLE]
A floating miniature diorama island of the Casbah of Algiers, seen in three-quarter top view: a chunk of land floating in the air with rocky edges underneath, white cubic houses stacked on a hillside with flat roof terraces, small blue wooden doors and shutters, narrow stepped alleys between them, a small white Ottoman-style mosque with a square minaret, a few green plants in pots, and a glimpse of turquoise Mediterranean sea on one side. Small golden glowing path dots climbing the alley steps. Plain flat pure green #00FF00 background, no shadow on the background.
```

### 20 — `20-casbah-decor-paysage.png` · ratio 16:9

```
[STYLE]
Wide painted background for a children's game world, the Casbah of Algiers on a sunny morning: in the middle distance, white cubic houses stacked up the hill with flat roof terraces, blue doors and shutters, a white Ottoman-style mosque with a square minaret, laundry lines and potted plants on the terraces, the turquoise Mediterranean bay far behind under a clear soft blue sky with a few soft clouds. The whole lower third of the image is a wide, calm, light stone-paved square running across the full width, at the same height on the left and right edges, with no objects on it. Atmospheric perspective, slightly softened, calm. No characters, no text, no flags.
```

### 21 — `21-casbah-decor-portrait.png` · ratio 9:16

Joindre l'image 20.

```
[STYLE]
Same artwork as the attached image (Casbah of Algiers, white stacked houses, square minaret, sea behind, sunny morning), recomposed for a vertical phone screen: the houses and minaret in the middle third, sky and sea in the upper third, a calm empty stone-paved square in the lower third. Same colors and lighting. No characters, no text, no flags.
```

### 22 — `22-premiers-plans.png` · ratio 16:9 · fond vert

Une planche avec les deux premiers plans pour la parallaxe des leçons. Je la découpe.

```
[STYLE]
Foreground framing elements only, for parallax layers, two separate sets side by side with a wide empty gap between them. Left set (Sahara): on the far left and far right of its half, a sand dune crest with a few dry desert grasses and a palm frond, slightly out of focus, very close to the camera. Right set (Casbah): on the far left and far right of its half, the edge of a white wall with a blue wooden shutter, a terracotta pot with a green plant and a jasmine branch, slightly out of focus, very close to the camera. The middle of each half is completely empty. Plain flat pure green #00FF00 background everywhere else, no shadow on the background.
```

Si la planche mélange les deux mondes, faire deux images séparées (`22a-premier-plan-sahara.png`, `22b-premier-plan-casbah.png`), sur le modèle du prompt 12.

### Résultat du lot 2 (5 novembre 2026)

- **Planète (14)** : la retouche a réussi. Elle montre 8 mondes, chacun une seule fois, dans l'ordre de l'app, et elle remplace l'ancienne planète. Pour la détourer, le masque ne retire que le halo vert et turquoise : la mer et la neige du Djurdjura restent intactes.
- **Gâteau (15)** : 4 quarts égaux, c'est juste. Il est détouré et prêt, mais pas encore placé. Il reste hors de `worldArt.ts` tant qu'aucun écran ne l'utilise.
- **Sahara et Casbah (16 à 21)** : ils sont intégrés comme Constantine. Le décor peint apparaît sur la carte et derrière leurs leçons, et l'îlot dans l'accueil de Didou. Un seul composant (`PaintedBackdrop`) dessine maintenant tous les mondes peints.
  - Les stations sont descendues sur le sol calme : sable du Sahara `ys` [700, 680, 720, 640], place de la Casbah [750, 730, 770, 740]. Ces hauteurs valent pour tous les niveaux.
  - L'école de la 2AP est déplacée au-dessus de la mer, pour ne plus cacher le minaret.
  - Les bords des décors peints s'effacent en fondu, et la brume des raccords cache le sol. Il reste une légère démarcation dans le ciel entre deux mondes. Le raccord avec la Mer reste net tant que la Mer garde son décor vectoriel.
- **Premiers plans (22)** : refusés. La moitié Casbah remplit tout l'écran au lieu d'encadrer seulement les bords. Les leçons du Sahara et de la Casbah s'affichent sans premier plan. À refaire si besoin en deux images séparées (`22a`, `22b`) sur le modèle du prompt 12.
- **Style de la Casbah** : volets bleus et dômes blancs, elle évoque plus Sidi Bou Saïd ou Santorin que la Casbah d'Alger. Pour une version plus fidèle, ajouter aux prompts 19 à 21 : « narrow covered alleys, houses with small windows and carved wooden doors, ochre and white walls, no blue domes, Ketchaoua-style mosque ».

## Ce que je fais une fois les images reçues

- Détourage, conversion en WebP et déclinaisons en plusieurs tailles (téléphone, tablette).
- Intégration sur `v2` : accueil avec la planète qui tourne doucement et Didou qui flotte, zoom de la planète vers Constantine, décor de leçon et de quiz avec parallaxe, poses de Didou selon la situation (parle / bravo / réfléchit / montre), objets dans l'interface.
- Chargement progressif pour garder l'app légère sur les téléphones Android modestes, et animations coupées avec `prefers-reduced-motion`.
- Les pages parents gardent la charte crème.
