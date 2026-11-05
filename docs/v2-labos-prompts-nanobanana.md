# V2 — Labos « design de pointe » : prompts d'images Nano Banana

Labos du premier lot, choisis par Karim le 5 novembre 2026 : **vitesse**, **ablutions**, **prière**, **électricité**, **code de la route**, **souk**. Les autres viendront ensuite (voir la fin).

## Principe : des décors + des éléments séparés, pour le mouvement

Pour qu'un labo soit vivant, chaque image demandée est de l'un de ces deux types :
- un **décor** (16:9 et 9:16), calme au centre, où se joue l'activité ;
- une **planche d'éléments détourés** sur fond vert : véhicules, personnages, objets, et leurs **différents états** (ampoule éteinte puis allumée, feu rouge puis vert…). Je les découpe et je les anime dans le code : déplacement, rebond, lueur, filet d'eau, parallaxe. Le mouvement se règle alors exactement sur l'activité (vitesse réelle d'un véhicule, circuit fermé ou ouvert…), ce qu'une vidéo ne permettrait pas.

## Règles de production

Ce sont les mêmes que pour les mondes ([v2-pilote-prompts-nanobanana.md](v2-pilote-prompts-nanobanana.md)) :
1. **Bloc STYLE** en tête de chaque prompt. Pour les décors, joindre `10-constantine-decor-paysage.png` comme référence de style.
2. **Aucun texte, aucune lettre, aucun chiffre, aucun logo, aucun drapeau** dans les images. Les panneaux, prix, billets et noms sont ajoutés par l'app.
3. **Fond vert pur `#00FF00`** pour les éléments détourés. Pas d'ombre sur le fond.
4. Sur une planche, **éléments bien séparés**, sur une grille régulière, dans l'ordre demandé.
5. **Déposer les fichiers dans `C:\Users\Karim\Downloads\didou-labos\`** avec les noms indiqués. Des variantes, c'est possible : je trierai.

Bloc STYLE (le même que pour les mondes) :

```
STYLE: premium 3D animated children's game key art, high-end animated feature film rendering, soft global illumination, warm rim light, glossy saturated colors, chunky rounded friendly shapes, subtle subsurface scattering on fur and skin, clean readable silhouettes, gentle depth of field, joyful and magical mood, suitable for children aged 6 to 11. No text, no letters, no numbers, no logos, no watermark, no flags.
```

---

## 1. Labo de la vitesse (`speed_lab`)

L'enfant compare des distances et des durées. Les véhicules roulent réellement à l'écran, à leur vitesse.

### L01 — `L01-vitesse-decor-paysage.png` · 16:9

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide side-view background for a children's speed experiment: a long straight Algerian highway crossing the screen from left to right in the lower third, with a parallel railway track just above it, both running perfectly horizontally across the full width; green hills, olive trees and a few white houses with red roofs in the middle distance, mountains of the Atlas far behind, a bright clear morning sky with soft clouds. The road and the railway are empty, calm and fully visible across the whole width. Side view, flat horizon. No vehicles, no people, no road signs with text, no text.
```

### L02 — `L02-vitesse-decor-portrait.png` · 9:16

Joindre L01.

```
[STYLE]
Same artwork as the attached image (Algerian highway and railway in side view, hills, Atlas mountains, bright morning), recomposed for a vertical phone screen: sky and mountains in the upper half, the empty horizontal railway and highway across the full width in the lower third. Same colors and lighting. No vehicles, no people, no text.
```

### L03 — `L03-vitesse-vehicules.png` · 16:9 · fond vert

Tous les véhicules sont **vus de profil, tournés vers la droite**, à la même échelle de rendu, sur 3 rangées de 3. Je fais le miroir pour l'arabe.

```
[STYLE]
A clean sheet of nine separate isolated 3D vehicles and movers, all in exact side view facing right, evenly spaced on a 3 x 3 grid with generous space between them, plain flat pure green #00FF00 background, no shadows on the background, no text, no logos, no license plates:
Row 1: 1. a cheerful Algerian schoolboy walking with a backpack. 2. a child riding a blue bicycle. 3. a child on a small kick scooter.
Row 2: 4. a red motorbike with a rider wearing a helmet. 5. a yellow city taxi car. 6. a yellow school bus.
Row 3: 7. a sleek red sports car. 8. a modern white regional passenger train with green and blue stripes (two coaches). 9. a white passenger airliner with a red tail, without any logo or writing.
```

### L04 — `L04-vitesse-objets.png` · 16:9 · fond vert

```
[STYLE]
A clean sheet of six separate isolated 3D game objects, evenly spaced on a 3 x 2 grid, plain flat pure green #00FF00 background, no shadows on the background, no text, no numbers:
1. a checkered finish-line arch with two posts. 2. a round chrome stopwatch with a blank face and no numbers. 3. a small orange distance marker post. 4. a traffic cone. 5. a golden trophy cup. 6. a small cloud of dust puffs (for a vehicle starting).
```

---

## 2. Labo des ablutions (`wudu_lab`) et 3. Labo de la prière (`salat_lab`)

Les gestes sont faits par **un enfant** (et une fillette, en option), pas par Didou, par respect pour les gestes religieux. Didou reste le guide qui parle.

**À faire relire par l'enseignant d'éducation islamique avant diffusion**, en suivant le manuel officiel : ordre des gestes, position des mains debout, posture du جلوس.

### L05 — `L05-enfant-fiche.png` · 16:9 · fond vert

C'est la fiche de référence. **La joindre à chaque prompt** des ablutions et de la prière.

```
[STYLE]
Character reference sheet of an original Algerian schoolboy, about 8 years old, warm friendly face, short dark hair, light brown skin, wearing a clean white qamis (long simple robe) and a white knitted kufi cap, barefoot. Three full-body views side by side on a plain flat pure green #00FF00 background: front view, side view facing left, back view, neutral calm standing pose, same scale, evenly lit. Consistent design across the three views, no props, no shadows on the background.
```

En option, `L05b-fillette-fiche.png` : même prompt avec « an original Algerian schoolgirl, about 8 years old, wearing a long simple light-coloured dress and a white khimar covering her hair », pour proposer les deux.

### L06 — `L06-ablutions-decor-paysage.png` · 16:9

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide background of a clean, bright traditional Algerian ablution area: a row of brass taps above a low white marble basin along a wall of green and white zellige tiles with geometric patterns, a small wooden stool, a folded towel, soft morning light through a carved arched window. The centre in front of the taps is calm and empty (a child will be placed there). No people, no text, no writing on the walls.
```

### L07 — `L07-ablutions-decor-portrait.png` · 9:16

Joindre L06.

```
[STYLE]
Same artwork as the attached image (Algerian ablution area, brass taps, white marble basin, green and white zellige), recomposed for a vertical phone screen: the arched window in the upper third, the taps and basin in the middle, calm empty floor in the lower third. Same colors and lighting. No people, no text.
```

### L08 — `L08-ablutions-gestes.png` · 16:9 · fond vert

Joindre L05. Les 7 étapes du labo, dans cet ordre, sur 2 rangées (4 + 3).

```
[STYLE]
Use the character from the attached reference image, exactly the same boy and clothes, sleeves rolled up to the elbows. A clean sheet of seven separate full-body poses of the boy performing wudu, all in three-quarter view, same scale, evenly spaced (row 1: four poses, row 2: three poses), plain flat pure green #00FF00 background, no shadows on the background, no water on the background:
1. standing calmly with both hands open in front of him, ready, gentle smile (intention). 2. washing his hands together up to the wrists under a small stream of water. 3. rinsing his mouth with water cupped in his right hand. 4. washing his face with both hands. 5. washing his right forearm up to the elbow with his left hand. 6. passing his wet hands over his head from front to back. 7. washing his right foot up to the ankle, sitting on a small stool.
Water only as small clear droplets near the hands, no puddles.
```

### L09 — `L09-eau-elements.png` · 1:1 · fond vert

Je m'en sers pour animer l'eau du robinet.

```
[STYLE]
A clean sheet of four separate isolated 3D elements on a 2 x 2 grid, plain flat pure green #00FF00 background, no shadows on the background: 1. a polished brass tap, closed. 2. the same tap with a thin clear stream of water flowing down. 3. a small splash of clear water droplets. 4. a few sparkling clean water drops.
```

### L10 — `L10-mosquee-decor-paysage.png` · 16:9

Sert à la prière et au labo des bonnes manières à la mosquée.

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide background of the calm interior of an Algerian mosque: a soft green carpet with straight prayer rows, white arches on slender columns, a mihrab decorated with green and white zellige and carved plaster, warm light through high windows, a few hanging lanterns. The carpet in the centre is calm and empty (a child will be placed there). No people, no text, no Arabic calligraphy, no writing.
```

### L11 — `L11-mosquee-decor-portrait.png` · 9:16

Joindre L10.

```
[STYLE]
Same artwork as the attached image (Algerian mosque interior, green carpet with prayer rows, white arches, zellige mihrab), recomposed for a vertical phone screen: the arches and lanterns in the upper third, the mihrab in the middle, calm empty green carpet in the lower third. Same colors and lighting. No people, no text, no calligraphy.
```

### L12 — `L12-priere-positions.png` · 16:9 · fond vert

Joindre L05. Les 7 positions du labo, **toutes de profil, tournées vers la gauche** (la qibla), à la même échelle et au même niveau de sol.

```
[STYLE]
Use the character from the attached reference image, exactly the same boy and clothes. A clean sheet of seven separate full-body prayer positions, all in exact side view facing left, same scale, feet on the same ground line, evenly spaced (row 1: four positions, row 2: three positions), plain flat pure green #00FF00 background, no prayer mat, no shadows on the background:
1. standing upright, both open hands raised to the level of the ears, palms facing forward (takbir). 2. standing upright, calm, arms relaxed straight along the sides, eyes looking down (qiyam). 3. bowing with the back straight and horizontal, hands resting on the knees (ruku). 4. standing upright again, arms along the sides (rising from ruku). 5. prostrating with forehead, nose, both palms, knees and toes on the ground, elbows lifted off the ground (sujud). 6. sitting upright on the left foot with the right foot upright and toes on the ground, hands resting on the thighs (sitting between the two prostrations). 7. prostrating again exactly like position 5.
Calm, respectful, serene expression.
```

La position 2 montre les bras le long du corps (السدل, pratique malékite courante en Algérie). **À confirmer avec le manuel** ; sinon, demander « right hand placed over the left on the chest ».

---

## 4. Labo de l'électricité (`electricity`)

L'enfant ferme un circuit et voit l'ampoule s'allumer, le moteur tourner, le buzzer vibrer. Il teste aussi quels objets laissent passer le courant.

### L13 — `L13-electricite-decor-paysage.png` · 16:9

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide background of a friendly school science workshop seen from the front: a large light wooden workbench filling the lower half of the image, its top surface flat, clean and empty, a pegboard wall with a few hanging tools, a window with soft daylight, a green plant, a small shelf with glass jars. The workbench top is completely empty and calm across the full width (components will be placed there). No people, no text, no posters with writing.
```

### L14 — `L14-electricite-decor-portrait.png` · 9:16

Joindre L13.

```
[STYLE]
Same artwork as the attached image (school science workshop, wooden workbench, pegboard, window), recomposed for a vertical phone screen: the window and pegboard in the upper half, the large empty workbench top in the lower half. Same colors and lighting. No people, no text.
```

### L15 — `L15-electricite-composants.png` · 16:9 · fond vert

Les états « éteint » et « allumé » doivent être **strictement identiques**, sauf la lumière : je les superpose et je fais un fondu de l'un à l'autre.

```
[STYLE]
A clean sheet of twelve separate isolated 3D electronic components for children, all seen from the same three-quarter top view, same scale, evenly spaced on a 4 x 3 grid, plain flat pure green #00FF00 background, no shadows on the background, no text, no numbers, no markings:
Row 1: 1. a flat 4.5 volt battery with two brass terminals. 2. a light bulb on a small base, switched off. 3. the very same light bulb switched on, glowing warm yellow. 4. a simple knife switch, open.
Row 2: 5. the very same knife switch, closed. 6. a small electric motor with a red fan blade. 7. a round black buzzer. 8. a small red LED switched off.
Row 3: 9. the very same red LED switched on, glowing. 10. a small resistor with coloured stripes. 11. a coil of red electric wire with crocodile clips. 12. a coil of black electric wire with crocodile clips.
```

### L16 — `L16-electricite-objets-test.png` · 16:9 · fond vert

Les 6 objets du test « conducteur ou isolant », dans l'ordre du labo.

```
[STYLE]
A clean sheet of six separate isolated 3D everyday objects, same three-quarter top view, same scale, evenly spaced on a 3 x 2 grid, plain flat pure green #00FF00 background, no shadows on the background, no text: 1. a short bare copper wire. 2. a piece of dry wood. 3. a pink rubber eraser. 4. a small clear glass of salty water with a few salt grains beside it. 5. a transparent plastic ruler without any graduations. 6. an iron nail.
```

---

## 5. Labo du code de la route (`road_code_lab`)

Les 5 situations du labo : feu rouge, feu vert, regarder avant de traverser, devant l'école, dans le bus ou le tram. En Algérie, on roule à droite : on regarde à gauche d'abord.

### L17 — `L17-rue-decor-paysage.png` · 16:9

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide background of a calm Algerian city street seen from the pavement: a two-lane road crossing the image horizontally with a clearly painted white zebra pedestrian crossing in the centre, wide pavements on both sides, white buildings with balconies and wrought-iron railings, palm and ficus trees, a primary school with a green gate on one side, a bus stop shelter without any sign, bright morning light. The road and the zebra crossing are empty. No vehicles, no people, no text, no readable signs, no flags.
```

### L18 — `L18-rue-decor-portrait.png` · 9:16

Joindre L17.

```
[STYLE]
Same artwork as the attached image (Algerian city street, zebra crossing, white buildings with balconies, school with a green gate), recomposed for a vertical phone screen: buildings and sky in the upper half, the empty road with the zebra crossing in the lower third. Same colors and lighting. No vehicles, no people, no text.
```

### L19 — `L19-route-elements.png` · 16:9 · fond vert

Les états du feu doivent être identiques, sauf la lumière allumée.

```
[STYLE]
A clean sheet of twelve separate isolated 3D elements, same scale, evenly spaced on a 4 x 3 grid, plain flat pure green #00FF00 background, no shadows on the background, no text, no numbers, no license plates, no logos:
Row 1: 1. a pedestrian traffic light showing the red standing figure lit. 2. the very same pedestrian light showing the green walking figure lit. 3. a car traffic light with the red light on. 4. the very same car traffic light with the green light on.
Row 2: 5. a small white car in side view facing right. 6. a yellow school bus in side view facing right. 7. a modern tramway in side view facing right (white with a light blue stripe). 8. a blue round sign with a white walking figure, on a pole (no text).
Row 3: 9. a friendly Algerian schoolboy with a backpack walking, side view facing right. 10. the same schoolboy standing still and looking to his left. 11. a friendly adult school crossing guard in a high-visibility yellow vest holding a round lollipop sign without any writing. 12. an elderly Algerian man with a white beard and a walking cane.
```

---

## 6. Souk (`souk_lab`)

Le souk existe déjà en dessin vectoriel (`SoukArt.tsx`). On passe aux étals et produits rendus. Les prix et les dinars restent posés par l'app, pour qu'ils soient exacts.

### L20 — `L20-souk-decor-paysage.png` · 16:9

```
[STYLE]
In the same soft 3D rendering style as the attached reference image. Wide background of a lively traditional Algerian covered market street in the morning: striped awnings in red, green and cream, old ochre and white walls with arches, wooden crates, hanging baskets and copper pots in the background, warm light falling through the awnings. The ground in the lower third is a calm, empty, light stone pavement across the full width (stalls will be placed there). No people, no text, no price tags, no signs, no flags.
```

### L21 — `L21-souk-decor-portrait.png` · 9:16

Joindre L20.

```
[STYLE]
Same artwork as the attached image (Algerian covered market street, striped awnings, ochre and white arches, morning light), recomposed for a vertical phone screen: awnings and arches in the upper half, calm empty stone pavement in the lower third. Same colors and lighting. No people, no text.
```

### L22 — `L22-souk-etals.png` · 16:9 · fond vert

```
[STYLE]
A clean sheet of four separate isolated 3D market stalls, front view, same scale, evenly spaced on one row, plain flat pure green #00FF00 background, no shadows on the background, no text, no price tags, no people: 1. a fruit and vegetable stall with a red and white striped awning and empty wooden crates. 2. a bakery stall with a green awning and empty wicker baskets. 3. a dairy and grocery stall with a cream awning and an empty shelf. 4. a spice stall with a yellow awning and empty copper bowls.
```

### L23 — `L23-souk-produits.png` · 16:9 · fond vert

```
[STYLE]
A clean sheet of twelve separate isolated 3D food products from an Algerian market, same scale, evenly spaced on a 4 x 3 grid, plain flat pure green #00FF00 background, no shadows on the background, no text, no labels, no brands:
Row 1: 1. a small pile of red tomatoes. 2. a pile of potatoes. 3. a bunch of fresh carrots. 4. a few red onions.
Row 2: 5. a pile of oranges. 6. a bunch of Deglet Nour dates on the branch. 7. a few green apples. 8. a bunch of bananas.
Row 3: 9. a round loaf of traditional Algerian khobz eddar bread. 10. a French-style baguette. 11. a plain white milk bag with no writing. 12. a small bottle of olive oil without any label.
```

### L24 — `L24-souk-panier-caisse.png` · 1:1 · fond vert

```
[STYLE]
A clean sheet of four separate isolated 3D objects on a 2 x 2 grid, plain flat pure green #00FF00 background, no shadows on the background, no text: 1. an empty woven straw shopping basket (couffin). 2. the same basket full of fresh vegetables and bread. 3. a small wooden market counter seen from the front. 4. an old-fashioned brass cash box, slightly open, without any coins or notes.
```

---

## 7. Labyrinthes de Didou (jeux éducatifs, préscolaire d'abord)

Demande de Karim : reprendre les labyrinthes du préscolaire avec un meilleur design. Le jeu est un plateau de **pierres de gué**. Chaque pierre porte une réponse, posée par l'app. Didou saute de pierre en pierre jusqu'au trésor, et une pierre fausse se fend. Au niveau expert, du brouillard cache les pierres. Aujourd'hui, ce sont des pierres CSS sur un ciel en dégradé avec des emojis : on passe à des pierres rendues et à un vrai décor par jeu.

### M01 — `M01-pierres.png` · 16:9 · fond vert

Toutes les pierres sont **vues de dessus en légère perspective**, même taille et même forme. Le dessus reste lisse et clair, pour qu'on puisse y poser un mot.

```
[STYLE]
A clean sheet of six separate isolated 3D round stepping stones for a children's game, seen from above in a slight three-quarter perspective, same size and same rounded shape, smooth light flat top surface with no marks, evenly spaced on a 3 x 2 grid, plain flat pure green #00FF00 background, no shadows on the background, no text:
1. a plain light grey river stone. 2. the same stone glowing with a soft golden rim light (reachable). 3. the same stone with a dark crack across it (wrong answer). 4. the same stone with a small golden star sparkle on its edge (already visited). 5. a larger flat golden stone with a small open treasure chest on it (the goal). 6. a soft white fog cloud the size of one stone (hides a stone).
```

### M02 à M05 — décors des 4 labyrinthes du préscolaire · 16:9

Pour les quatre décors, joindre `10-constantine-decor-paysage.png` comme référence de style. Le plateau est posé au centre : **le centre doit rester calme**, avec une eau ou une prairie lisse, les éléments étant sur les bords.

- `M02-laby-ferme.png` :
  ```
  [STYLE] In the same soft 3D rendering style as the attached reference image. Wide background seen slightly from above: a calm small pond in the centre of a sunny Algerian farm, a red barn, golden wheat, a few cows and sheep, olive trees and a little tractor on the edges, bright morning. The pond in the centre is calm, smooth and empty. No people, no text.
  ```
- `M03-laby-jardin-enfants.png` :
  ```
  [STYLE] In the same soft 3D rendering style as the attached reference image. Wide background seen slightly from above: a bright, cosy kindergarten play garden with a soft blue paddling stream in the centre, colourful toys, balloons, a small slide and flowers on the edges. The stream in the centre is calm, smooth and empty. No people, no text.
  ```
- `M04-laby-petit-train.png` :
  ```
  [STYLE] In the same soft 3D rendering style as the attached reference image. Wide background seen slightly from above: green Algerian countryside with a calm river in the centre, a little toy train on a track along the top edge, small white houses with red roofs, trees and hills on the edges. The river in the centre is calm, smooth and empty. No people, no text.
  ```
- `M05-laby-chemin-ecole.png` :
  ```
  [STYLE] In the same soft 3D rendering style as the attached reference image. Wide background seen slightly from above: a calm park stream in the centre of an Algerian neighbourhood, a primary school with a green gate in the top corner, a small white house in the opposite corner, trees, benches and flowers on the edges. The stream in the centre is calm, smooth and empty. No people, no text, no signs.
  ```

Les labyrinthes de la 1AP à la 5AP pourront ensuite reprendre les décors des mondes de Didou (Beni Hammad, Tipaza, palais du Raïs…), avec les mêmes pierres.

## Ensuite (lot de labos suivant)

Les labos encore au design ancien, à refaire après celui-ci :
- **Sciences** : grand labo scientifique, anatomie, cycles de la Terre, relief.
- **Maths** : fractions, aires sur quadrillage, horloge, géométrie, convertisseur, tables, soroban.
- **Algérie** : marché et dinar (`algerian_market`), carte des 58 wilayas, musée de l'histoire et des héros.
- **Langues** : tamazight (tifinagh), conjugueurs arabe, français et anglais, studio d'écriture, syllabes.
- **Coran** et bonnes manières à la mosquée (ce dernier réutilisera L10 et L11).

## Ce que je fais à la réception

- Tri des variantes, détourage, WebP ; découpe des planches sur leur grille.
- Pour chaque labo, une scène plein écran dans `ImmersiveLabShell` :
  - le décor avec parallaxe et la couche de vie (`WorldAmbience`) ;
  - les éléments animés selon l'activité : les véhicules roulent à leur vraie vitesse relative, l'ampoule s'allume en fondu quand le circuit est fermé, l'eau coule du robinet à chaque étape, les feux changent d'état, les produits sautent dans le panier ;
  - Didou guide, avec ses poses (parle, bravo, réfléchit).
- Les mécanismes et le contenu pédagogique existants des labos sont conservés.
