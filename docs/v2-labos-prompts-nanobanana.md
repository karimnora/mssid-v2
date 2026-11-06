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

### Résultat (5 novembre 2026)

Reçus et intégrés : L01 à L04. Écartée : une variante du décor où des véhicules étaient déjà dessinés.
- `Vehicle3DModel` n'affiche plus de véhicules dessinés en SVG, mais les 9 véhicules rendus (`assets/labs/speed/`). En arabe, ils sont retournés pour rouler de droite à gauche. Animations :
  - léger rebond pendant la course, plus doux pour l'avion ;
  - poussière au départ et traînées de vitesse à la couleur du couloir ;
  - lueur orange en turbo.
- L'arène de course passe sur le décor peint de l'autoroute (le portrait dans une arène étroite). Les deux couloirs deviennent des bandes d'asphalte avec l'arche d'arrivée au bout. La pluie tombe et la nuit est étoilée sur le décor. Le chronomètre et la distance sont dans une pastille sombre, lisible sur le ciel.
- Les vignettes de véhicules remplacent les emojis : choix des véhicules, résultats, comparateur, classement, trajets en Algérie.
- La fenêtre d'arrivée montre la coupe 3D et le véhicule gagnant. Elle défile si elle dépasse l'arène.
- Inchangé : la mécanique (vitesses, turbo, météo, radar) et le contenu des onglets. Les onglets autres que la course gardent leur fond sombre, avec les nouvelles vignettes. Le taxi porte l'inscription « TAXI », comme les vrais taxis : c'est accepté.

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

## Résultat de préparation des images (5 novembre 2026)

L05 à L24 ont été générées avec image_gen (20 sources et deux variantes correctives), sans intégration dans les labos. Planche-contact numérotée, inventaire, contrôle sur damier et 81 exports WebP candidats : voir [le rapport de préparation](design/labos-preparation-2026-11-05/README.md). Tous les décors exportés sont sous 250 Ko. Les exports sont conservés dans docs/design, séparés des assets de production : des liserés verts, transparences contaminées, états à aligner et écarts pédagogiques restent à corriger. L08 initial et L12 initial refusés ; L12 corrigé reste en relecture. Aucun tsc, Vitest, e2e ni commit lancé.

## Résultat — premier lot intégré (5 novembre 2026)

WuduLab : dix WebP importés depuis assets/labs/wudu ; décor responsive, enfant 3D sur les mêmes cibles interactives, sept vignettes pour le classement, cibles portées à 60 px, miroir RTL, animation d’opacité et pression désactivées avec prefers-reduced-motion. Les handlers, textes, étapes, quiz et récompenses sont conservés. Le décor paysage ne contient plus de filet d’eau fixe. Pas encore d’animation d’eau synchronisée : à réaliser après vérification visuelle. Les gestes sont des illustrations complémentaires ; la description audio et écrite reste nécessaire pour le rinçage du nez.

Préscolaire : nouveau décor de la ferme de Mitidja, sans Didou ni texte, branché uniquement sur game-pre-memory-farm via theme.backdrop. Aucune modification des cartes ni des règles.

Corrections des images : nouvelles sources alpha pour L05, L08, L09, L15, L16, L19, L22, L23, L24 ; contours et transparences contrôlés sur damier. L19 montre maintenant le second enfant regardant à gauche de l’image. Exports corrigés et contrôle dans docs/design/labos-preparation-2026-11-05/corrections-02. Les états électriques et feux restent à aligner avant fondu. L09 présente un fragment d’eau à reprendre lors de la découpe, ne pas utiliser drops en l’état. Salat reste en attente de correction et relecture des postures. Aucun tsc, Vitest, e2e, build, commit ni push. Rendu navigateur non vérifié.

## Résultat — contrôle visuel du premier lot (5 novembre 2026)

Contrôle Chromium/Playwright en arabe, 390×844 et 1280×800, aperçu v2 sur 3002 et compte simulé. En-tête WuduLab compacté ; chevauchement bouche/mains corrigé. Au second passage : aucune erreur pageerror, aucun débordement horizontal ni chevauchement des sept cibles ; mauvais choix sans progression et sept étapes correctes jusqu’à la fin. Onglet d’ordre affiché. Ferme ouverte depuis le préscolaire, carte puis premier niveau de mémoire vérifiés aux deux formats. Captures et détails : [rapport visuel](design/labos-preparation-2026-11-05/verification-visuelle/README.md). Reste : eau synchronisée, repères anatomiques, panneau de bienvenue qui recouvre le haut de certaines captures, images des cartes encore en emoji. Pas de tsc, Vitest, suite e2e, commit ni push.

## Résultat — lot prêt à commiter (5 novembre 2026)

Effet d’eau ajouté après un lavage réussi, uniquement transform/opacity, absent pour l’intention et le passage des mains sur la tête, désactivé avec prefers-reduced-motion. Progression et contenu inchangés. TypeScript réussi ; Vitest ciblé 14/14 ; suite complète 2 519/2 519 sur 247 fichiers. Captures finales arabes 390×844 et 1280×800 conservées ; effet d’eau et réduction du mouvement contrôlés. Aucun débordement horizontal ni chevauchement des cibles, aucun événement pageerror détecté sur les parcours ciblés. Prière et autres labos restent à intégrer, puis refonte globale des cours, préscolaire, examens et jeux. Commit et push autorisés sur v2 ; main reste hors intervention.

## Résultat — ensemble du catalogue et guide Didou (5 novembre 2026)

- **Prière** : sept sprites corrigés, échelle/sol communs, orientation arabe, mosquée cohérente, Didou suit la description courante. Postures à faire relire avant diffusion publique.
- **Électricité** : composants et matériaux rendus, lampes/LED en couches superposables, corps du moteur et hélice séparés, vibration du buzzer ; schémas et règles conservés.
- **Route** : rue peinte, feux, enfant, bus et accompagnateur séparés ; regard à gauche préservé indépendamment du RTL ; guide suit la question ou l’étape de traversée.
- **Souk** : étals, produits et couffin rendus, guide dynamique sans doublon ; prix et monnaie toujours exacts et affichés par l’app.
- **Mosquée** : décor peint partagé avec la prière, guide sur la situation courante.
- **Autres labos** : six décors thématiques nouveaux et guide Didou commun, sans modifier les schémas précis, les cartes, les règles ou le contenu pédagogique. Inventaire exact : 38 labos, tous raccordés au décor et au guide.

Détails et limites dans [le rapport du lot global](design/labos-lot-global/README.md). Les vérifications sont regroupées à la fin des intégrations, à la demande de Karim. Aucun nouveau test lancé pendant ce lot d’intégration.

### Audio OpenAI — 5 novembre 2026
- Générateur hors navigateur ajouté : `frontend/scripts/openai-tts-generate.ts` ; mode inventaire par défaut, génération explicite, reprise après interruption et contrôle WAV/SHA-256.
- Clé lue depuis un fichier local ignoré par Git ; aucune clé ajoutée au code ni aux fichiers audio.
- Inventaire du périmètre labos : 88 phrases sans enregistrement (guides, ablutions, prière, questions et explications).
- Premier appel de génération refusé par OpenAI : HTTP 429, `credit_balance_exhausted`. Aucun nouveau fichier audio produit ni indexé.
- Reste : activer/alimenter les crédits API, générer puis écouter et contrôler la prononciation avant intégration. Les enregistrements existants restent en place ; leur naturel ne peut pas être jugé par le seul inventaire.

### Résultat — finition des quiz et voix OpenAI, 5 novembre 2026

- Ablutions et prière : 12 questions chacune, explication après réponse, progression visible, résultat final et reprise volontaire. Les autres quiz de labos concernés ont une fin de session ; leurs banques et règles restent propres à chaque activité.
- Ablutions, activité « أُرَتِّبُ » : une erreur conserve le préfixe correctement ordonné. Le passage piéton conserve aussi les étapes réussies.
- Voix : 399 nouveaux enregistrements uniques (206 ar, 112 fr, 81 en), en complément des enregistrements existants. Aucun ancien audio remplacé sans défaut identifié. Sources : guides de labos, ablutions/prière, quiz associés, route/mosquée et listes de voix V2 déjà recensées. Les récitations coraniques existantes sont conservées.
- Génération : phrases dédupliquées, reprise sur fichiers vérifiés, aucune synthèse payante à chaque écoute. Inventaire final : zéro manque dans les sources recensées ; cela ne signifie pas que toutes les phrases dynamiques de l'application sont couvertes.
- Compression locale : 107 352 756 octets WAV vers 22 710 516 octets MP3 (environ 79 % de moins). Originaux archivés hors du dépôt. Contrôle du signal, durée, décodage et intégrité ; naturel et prononciation restent à écouter humainement.
- Intégration : boutons d'écoute des questions et explications, arrêt au changement de question ou à la sortie du quiz, phrase commune pour les annonces de prière, langue du guide détectée à partir du texte.
- Vérifications : TypeScript réussi ; suite complète 248 fichiers / 2 522 tests réussis, puis contrôle ciblé après indexation et derniers raccordements (9 fichiers / 38 tests réussis). Captures et scan en arabe : 38 labos × 390×844 et 1280×800, aucun débordement, erreur JS, image cassée ou guide manquant. Les 12 questions des ablutions et la lecture des MP3 ont été vérifiées dans le navigateur aux deux tailles.
- Rapports : `docs/design/labos-lot-global/verification/`, `docs/audio-v2/openai-generation-audit.json`, `docs/audio-v2/OPENAI-V2.md`.
- Reste : écoute humaine des voix, validation pédagogique des postures religieuses, puis amélioration de l'adaptation de difficulté et du bilan parent. La refonte complète des cours/examens/jeux ne doit pas être confondue avec ce lot de labos et de voix.
### Résultat — correctif du build Vercel (5 novembre 2026)

Régression reproduite après l'indexation finale des nouvelles voix : le test `remainingAudio.test.ts` exigeait encore que 35 phrases françaises et 74 phrases anglaises n'aient pas d'enregistrement. Il valide maintenant leur raccordement aux activités, leur langue, leurs fichiers et les durées de réussite. Un cas séparé conserve le contrôle du secours vocal lorsqu'une phrase est réellement absente, sans emprunter un enregistrement arabe pour une activité française ni modifier le module source.

La limite de deux processus est désormais dans `vitest.config.ts`, donc appliquée aussi à la commande Vercel existante. `dist` est exclu de TypeScript : les fichiers générés ne sont pas des sources à revérifier. Le périmètre conserve 913 entrées, dont les 248 fichiers de tests et 20 scripts.

Validation après l'indexation : 14 tests ciblés réussis, puis suite complète de 248 fichiers / 2 523 tests réussis, contrôle TypeScript réussi et build Vite/PWA réussi (1 948 entrées précachées). Le contrôle complet précédent avait précédé l'indexation finale ; sa sélection audio ultérieure ne couvrait pas cet inventaire du préscolaire. Dorénavant, toute génération doit être suivie de l'indexation avant les vérifications finales et le build.

Correction limitée aux tests et à la configuration des vérifications. Résultat du nouveau déploiement distant à confirmer sur Vercel ; aucune modification de main.

### Résultat — labo de fractions lié au cours 5AP, 6 novembre 2026

Le cours `math-5ap-fractions` dispose maintenant d’un atelier de découverte (décomposition, encadrement et équivalence), puis d’un labo de transfert sur 7/3 et 2/3 = 4/6 avec choix d’explication. Didou guide et lit les consignes enregistrées. Les dessins sont des barres de parts égales générées par l’interface, sans nouvelle image à détourer. Les manipulations ne donnent pas de points de maîtrise ; les exercices et le quiz originaux restent la validation officielle. Un bilan parent de la séance distingue autonomie, aide et non évalué. Voir [le rapport](design/v2-pilote-fractions-renforce.md). Ce labo est intégré au cours et ne remplace pas les autres labos de la liste.

### Résultat — scène tactile du labo fractions, 6 novembre 2026

Le labo lié au cours 5AP est désormais la suite des trois découvertes, puis mène au défi d’explication. Les listes déroulantes ont été remplacées par des parties touchables qui se regroupent en unités, avec +/− accessibles. Les zones de geste restent stables ; les réponses et les indices sont conservés lors d’un retour. La scène jardin isole l’interface classique et Didou annonce chaque étape avec les fichiers Nova. Les données et les validations officielles du cours restent inchangées. Voir [le rapport](design/v2-fractions-scene-jardin.md).
