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
- [ ] **06 planète** : Timgad apparaît deux fois (9 dioramas au lieu de 8). Il faut ajouter au prompt « exactly eight dioramas, each place only once ».
- [ ] **13 objets, gâteau** : 6 parts inégales au lieu de 4 égales. Il est écarté, faux pour une leçon de fractions. À refaire seul, avec « exactly 4 equal quarter slices, cut by two perpendicular lines through the centre ».
- [ ] Médaille, coffre, cadenas et montre sont prêts dans `assets/world/objects/`, mais pas encore placés dans l'interface.

## Ce que je fais une fois les images reçues

- Détourage, conversion en WebP et déclinaisons en plusieurs tailles (téléphone, tablette).
- Intégration sur `v2` : accueil avec la planète qui tourne doucement et Didou qui flotte, zoom de la planète vers Constantine, décor de leçon et de quiz avec parallaxe, poses de Didou selon la situation (parle / bravo / réfléchit / montre), objets dans l'interface.
- Chargement progressif pour garder l'app légère sur les téléphones Android modestes, et animations coupées avec `prefers-reduced-motion`.
- Les pages parents gardent la charte crème.
