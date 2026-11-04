# V2 — Catalogue de jeux éducatifs (préscolaire → 5AP)

> Rédigé le 4 novembre 2026.
>
> **Décisions de Karim, prises le 4 novembre 2026 :**
> - Le premier pack de chaque niveau est gratuit, les autres sont Premium. Le verrou est appliqué dans l'app uniquement (clé `learningGames`).
> - Le lot 1 contient les moteurs Memory, Classer, Ordonner et Labyrinthe, en commençant par la 5AP.
> - Les jeux doivent être le plus immersifs et interactifs possible.
>
> **Lot 1 — préscolaire, codé le 4 novembre 2026 (`data/games/packsPre.ts`, 4 packs × 10 niveaux, niveau `PRE`) :**
> - `game-pre-memory-farm` (gratuit) : ذاكرة مزرعة جدي. On commence par retrouver la même image, puis on relie deux choses qui vont ensemble : l'animal et ce qu'il mange, la couleur et un objet, le chiffre et la quantité, le sens et ce qu'il perçoit, la météo et ce dont on a besoin. Le niveau final a 16 cartes.
> - `game-pre-sort-baskets` : سلال روضة ديدو. Niveaux : grand ou petit, rouge ou jaune, jour ou nuit, formes, été ou hiver, ferme ou mer, sain ou sucré, sens, ciel / mer / terre, et les 4 saisons.
> - `game-pre-order-train` : قطار ديدو الصغير. Niveaux : compter de 1 à 5, se laver les mains, la pousse d'une plante, la journée, les chiffres de 6 à 10, du plus grand au plus petit, puis un train de 8 wagons.
> - `game-pre-maze-road` : طريق ديدو إلى الروضة. On suit les pommes, les étoiles, le rouge, les animaux, les objets ronds, le 3, les animaux marins, l'hiver, les groupes de 3 objets, puis le jaune dans le brouillard.
> - Aucun texte à lire : Didou dit chaque règle et lit chaque image touchée. Sa voix retire les emoji (`say`), pour que le moteur de synthèse vocale ne les épelle pas. Les cibles font 72 px (`lg-pre`).
> - Chaque niveau est relié à un module du préscolaire (`PRESCHOOL_MODULES`). Les aventures apparaissent dans l'espace jeux du préscolaire quand la langue choisie est l'arabe.
>
> **10 niveaux par jeu (demande de Karim du 4 novembre 2026 : plus de 8 niveaux, en 3D, immersifs et interactifs) :**
> - Les 8 aventures (1AP et 5AP) ont maintenant 10 niveaux, répartis sur 5 paliers de 2 niveaux : سهل، متوسط، صعب، خبير، بطل. Le niveau 10 est le niveau final : plateforme dorée avec une couronne 👑.
> - Nouveaux contenus de 5AP :
>   - Memory : dixièmes, centièmes et millièmes, pourcentages simplifiés, pourcentages au-delà de 100 %, fractions équivalentes, puis un niveau final de 20 cartes.
>   - Classer : الأسماء الخمسة، الأفعال الخمسة، الألف اللينة، الهمزة المتوسطة، puis الهمزة المتطرفة sur 4 étagères.
>   - Frise : le relief du nord au sud, l'époque ottomane (1516, 1827), le mouvement national (1919, 1926, 1931), de 1926 à 1962, puis 13 siècles en 10 tableaux.
>   - Labyrinthe : < 0,6 ; = 2/5 ; entre 1 et 2 ; = 1,5 ; entre 3/4 et 1, dans le brouillard.
> - Nouveaux contenus de 1AP : les lettres ج ح خ ز, les lettres « lourdes » (ص ض ط ظ), les مدود, les formes de milieu de mot, le corps, vivant ou non vivant, les besoins d'une plante, bouger ou se reposer, l'ordre décroissant, et des labyrinthes sur ت ذ غ, les formes de ج et la lettre م dans le brouillard.
> - **Nouvelle mécanique : le brouillard** (`fog`, dernier labyrinthe de chaque pack). Les pierres restent cachées dans des nuages jusqu'à ce que Didou s'en approche. Seul le trésor reste visible.
> - Dans les labyrinthes de maths, l'explication de chaque pierre fausse est calculée à partir de sa valeur (`ruleMaze`), ce qui évite toute erreur de saisie.
>
> **Lot 1 — 1AP, codé le 4 novembre 2026 (`data/games/packs1ap.ts`, 4 packs × 5 niveaux) :**
> - `game-1ap-memory-letters` (gratuit) : ذاكرة حديقة الحامة. Une lettre et l'image d'un mot qui commence par elle, en suivant l'ordre des leçons (أ ب ت ث → م ن ل ر → د ذ س ش → ع ق ك ه و ي).
> - `game-1ap-sort-explorer` : حقيبة مستكشف الشريعة. Les niveaux portent sur l'alimentation, les sens, le déplacement des animaux, les 4 saisons et l'hygiène.
> - `game-1ap-order-numbers` : قطار الأعداد في محطة آغا. Les nombres vont de 1-5 jusqu'à 50-99, avec le piège 56 / 65.
> - `game-1ap-maze-casbah` : متاهة حروف القصبة. Les niveaux portent sur ب, ج, س, les formes de ب (début, milieu, fin) et les mots qui commencent par ش. Didou explique chaque erreur par les points de la lettre.
> - Mode « jeunes lecteurs » (`young`) : chaque carte est lue à voix haute quand on la touche, les cartes « emoji + mot » montrent l'image au-dessus du mot, et les cibles sont plus grandes. La bannière de jeu s'affiche aussi dans les leçons de 1AP.
>
> **Refonte du 4 novembre 2026 (demande de Karim : plus de 3D, plusieurs niveaux, pouvoir sauter un défi) :**
> - **5 niveaux par jeu**, du plus facile au plus difficile. Le niveau 1 est un échauffement (`easy`) : aperçu de 3 s au Memory, dates visibles sur la frise. Un test vérifie que les plateaux ne rétrécissent jamais (paires, cartes, pierres).
> - **Carte des niveaux** en 3D : tous les niveaux sont ouverts. Le bouton « تخطَّ » passe au niveau suivant même si le niveau en cours n'est pas fini, et un niveau sauté n'envoie rien au carnet du parent.
> - **Étoiles par niveau**, 15 au total par jeu : 3 étoiles jusqu'à 1 erreur, 2 jusqu'à 3 erreurs, sinon 1. Les XP du jeu sont donnés une seule fois, quand tous les niveaux sont réussis. La progression du lot 1 est conservée, et ses XP ne sont jamais redonnés.
> - **3D et mouvement** : scène en perspective (sol, nuages, décor sur trois profondeurs), carte qui s'incline vers la souris, cartes épaisses, pièces qui volent jusqu'à leur place, Didou qui saute sur le labyrinthe incliné, confettis, vibration sur Android. Tout s'arrête si l'appareil demande moins d'animations (`prefers-reduced-motion`).
> - **Depuis une leçon**, le jeu s'ouvre directement au niveau de cette leçon.
>
> **Lot 1, codé le 4 novembre 2026, poussé sur v2 (45238c5) :**
> - **Packs 5AP**, dans `data/games/packs5ap.ts` :
>   - `game-5ap-memory-fractions` (gratuit) : ذاكرة سوق بلكور ;
>   - `game-5ap-sort-plurals` : رفوف مكتبة قسنطينة ;
>   - `game-5ap-order-history` : خط الزمن في متحف المجاهد ;
>   - `game-5ap-maze-timgad` : كنز تيمقاد.
> - **Lecteur** : `components/games/learning/`.
> - **Points d'entrée** : une bannière sous la mission dans les leçons concernées, et l'étagère « ألعاب ديدو التعليمية » de l'espace Défis.
> - **Écart avec le §2** : les composants du préscolaire ne sont pas modifiés. Ils sont trop liés à `PreschoolActivity` et à leurs plafonds d'âge, par exemple 3 paires au maximum. Les moteurs du primaire reprennent leurs techniques d'interaction, et les stations-jeux de la carte de Didou viendront avec les packs 1AP.
> Source d'inspiration : le catalogue de jeux.ieducatif.fr, relevé le 4 novembre 2026 (environ 120 titres, du niveau Maternelle au CM2, plus des jeux en anglais).
> Nous reprenons uniquement des **mécaniques génériques** : memory, tri, labyrinthe, points à relier, etc. Aucun texte, aucune image, aucun nom de jeu ni aucun habillage n'est copié. Les contenus sont réécrits pour le programme algérien (الجيل الثاني) et le contexte de l'enfant algérien.

## 1. Constat sur le site source

- Le site propose environ 120 jeux, mais il n'utilise qu'une dizaine de mécaniques. La plupart des titres sont un quiz ou un memory appliqué à un autre thème : couleurs, animaux, tables de multiplication, homophones, etc.
- Pour nous, il faut donc construire **environ 12 moteurs de jeu réutilisables** et **des packs de contenu par niveau**, pas 120 jeux séparés. Chaque moteur couvre ainsi les 6 niveaux.
- Certains contenus du site ne correspondent pas à notre programme et sont écartés :
  - chiffres romains ;
  - passé simple ;
  - homophones de CM1/CM2 en 3AP (année 1 du français) ;
  - mois et jours selon le calendrier français.
- Dans notre version, la semaine commence le dimanche et le week-end tombe le vendredi et le samedi.

## 2. Jeux déjà présents dans V2 (à ne pas dupliquer)

| Clé | Jeu | Recouvre |
|---|---|---|
| `number_sort` | طابور الأعداد | moteur « Ordonner » (nombres seulement) → à **généraliser** plutôt que recréer |
| `spelling_champ` | بطل الإملاء | QCM d'orthographe → le moteur « Dictée de Didou » le complète, il ne le remplace pas |
| `math_stars`, SpeedMathDuel | calcul chronométré | tables, calcul mental |
| `dido_runner`, `tower_stack`, `galaxy_3d` | arcade pure | détente, sans contenu scolaire |
| MemoryMatrixGame | mémoire de position | mémoire visuelle, ce n'est pas un memory de paires |
| ClockTrainerLab, Marché de Didou, AlgerianCurrencyMarket, Atelier des ombres | labos | heure, monnaie, ombres physiques |
| DidouDressingRoom, `dress_dido` | habillage | vêtements, vocabulaire |
| Labo drapeaux, WilayasExplorer, TopographyMapLab | géographie | drapeaux, wilayas, relief |
| SorobanInteractive (Anzan), MultiplicationTableInteractive, AreaPerimeterGridLab, FractionsDecimalsLab, Shape3DViewer, CircuitBuilder | manipulations | calcul mental, tables, aires, fractions, solides, circuits |

**Le préscolaire contient déjà la plupart des moteurs**, dans `components/preschool/` :

| Composant | Moteur |
|---|---|
| `PreschoolMemoryCards` | M1 |
| `PreschoolSorting` et `PreschoolDragDrop` | M2 |
| `PreschoolSequence` et `PreschoolStoryOrder` | M3 |
| `PreschoolMaze`, `PreschoolFindPath` et `car_maze` | M4 |
| `PreschoolConnectDots` | M5 |
| `PreschoolListenTap` | M8 |
| `PreschoolJigsaw` et `puzzle` | M13 (puzzle) |
| `PreschoolColoring` | M14 (coloriage magique) |
| `PreschoolXylophone` et `PreschoolSoundBox` | M20 (rythme) |

**Règle : on généralise ces composants pour la 1AP à la 5AP, on ne les réécrit pas.** Il faut les rendre paramétrables par un `GamePack` (§8) et garder leurs tests existants.

## 3. Règles communes à tous les moteurs

Ces règles reprennent celles de CLAUDE.md, sections 1 et 2.

- **Interface en RTL.** Chaque consigne a un bouton audio : Didou la lit en Fusha simple, ou en Darija bienveillante pour le préscolaire.
- **Zones tactiles d'au moins 60 px, 72 px avant 1AP.** L'enfant joue en tapant sur l'écran. Le glisser-déposer n'est permis qu'avec une large aimantation, sans double-tap ni appui long.
- **Aucun son d'erreur strident, aucun texte rouge.** L'erreur déclenche un indice de Didou, et l'enfant a une nouvelle tentative.
- **Pas de chrono avant 3AP.** Ensuite, le chrono est optionnel. Le site source utilise souvent un pendu : nous le remplaçons par une lanterne de Ramadan qui s'allume (aucune image de pendaison).
- **Chaque partie est reliée à une leçon existante** par son identifiant exact (`lessonId`). Le résultat de la partie alimente le suivi de compétences et le carnet d'erreurs (5AP).
- **L'accès est déclaré dans `entitlements.ts`**, la source unique des règles gratuit/payant (proposition en §6).

## 4. Les 12 moteurs et leurs déclinaisons par niveau

Abréviation : **Pré** = préscolaire.

### M1 — Memory des paires (لعبة الذاكرة)
Retourner deux cartes et trouver les paires. Le nombre de cartes augmente avec le niveau : 6 en Pré, 8 en 1AP, 12 en 2AP-3AP, 16 en 4AP-5AP.

| Niveau | Paires |
|---|---|
| Pré | animaux familiers (chèvre, mouton, dromadaire, âne, chat) ; fruits (datte, figue, grenade, orange) ; couleurs ; formes (cercle, carré, triangle) |
| 1AP | lettre ↔ image (ب ↔ بطة, ت ↔ تفاحة) ; chiffre ↔ quantité (< 10) ; parties du corps |
| 2AP | مفرد ↔ جمع ; مذكر ↔ مؤنث ; ×2 ×5 ×10 ↔ résultat |
| 3AP | anglais mot ↔ image (school objects, colors) ; français mot ↔ image (Mon école) ; ½ ¼ ↔ dessin |
| 4AP | tables 1-10 ↔ résultat ; personnage ↔ fait (ماسينيسا ↔ نوميديا) ; anglais rooms of the house |
| 5AP | fraction ↔ décimal ↔ pourcentage ; date ↔ événement (1830, 1er novembre 1954, 5 juillet 1962) ; jobs en anglais |

### M2 — Classer dans les paniers (صنّف)
Déposer chaque carte dans le bon panier (2 ou 3 paniers, aimantation large).

| Niveau | Catégories |
|---|---|
| Pré | grand / petit ; propre / sale (hygiène) ; jour / nuit ; saisons |
| 1AP | aliments sains / à limiter ; vivant / non vivant ; nos 5 sens (je vois / j'entends / je goûte…) |
| 2AP | اسم / فعل / حرف ; لام شمسية / قمرية ; solide / liquide ; مفرد / جمع |
| 3AP | جملة اسمية / فعلية ; تاء مفتوحة / مربوطة ; animaux herbivores / carnivores / omnivores (التغذية عند الحيوانات) ; pair / impair |
| 4AP | همزة على الألف / الواو / النبرة ; quadrilatères (carré, rectangle, losange, trapèze) ; relief : montagne / plaine / désert |
| 5AP | جمع مذكر سالم / مؤنث سالم / تكسير ; conducteur / isolant (dangers électriques) ; activités économiques par région |

### M3 — Ordonner (رتّب) — généralise `number_sort`
Poser les éléments dans le bon ordre, sur une file ou une frise.

| Niveau | Suites |
|---|---|
| Pré | du plus petit au plus grand (3 objets) ; étapes du lavage des mains |
| 1AP | nombres < 100 ; jours de la semaine (du dimanche au samedi) ; histoire en 3 images |
| 2AP | nombres < 1000 ; étapes du وضوء ; les 5 prières dans la journée |
| 3AP | nombres < 100 000 ; mots mélangés → phrase (arabe, puis français) ; germination d'une graine |
| 4AP | frise préhistoire → Numidie ; cycle de l'eau |
| 5AP | ranger des décimaux ; frise de 647 (الفتح) → 1830 → 1954 → 1962 |

### M4 — Labyrinthe de Didou (المتاهة)
Avant 2AP, l'enfant avance case par case en tapant sur des flèches, sans glisser.

| Niveau | Règle du chemin |
|---|---|
| Pré | Didou va à l'école ; suivre une couleur |
| 1AP | suivre les nombres de 1 à 20 ; suivre une lettre (ج) |
| 2AP | suivre les multiples de 2, de 5 ou de 10 ; suivre les mots qui portent une شدة |
| 3AP | consignes « droite / gauche » dans la Casbah ; suivre les verbes au ماضي |
| 4AP | carte de l'Algérie avec les points cardinaux (rejoindre une wilaya) |
| 5AP | itinéraire avec une échelle (distance réelle) ; directions en anglais (giving directions) |

### M5 — Points à relier (صِل النقاط)
Une fois les points reliés, l'image révèle un monument ou un symbole algérien : مقام الشهيد, dromadaire, arche de Timgad, pont de Constantine, drapeau.

| Niveau | Suite à relier |
|---|---|
| Pré | 1 → 5, puis 1 → 10 |
| 1AP | 1 → 50 ; ordre des lettres ا → ي |
| 2AP | compter de 2 en 2 ou de 10 en 10 jusqu'à 200 |
| 3AP | multiples de 3, 4 ou 6 ; alphabet latin a → z |
| 4AP | résultats de divisions euclidiennes |
| 5AP | décimaux dans l'ordre croissant |

### M6 — Trouve les différences (اكتشف الفروق)
Scènes illustrées algériennes : souk, plage, cour d'école, fête de l'Aïd, oasis, Casbah. Il y a 3 différences en Pré, puis jusqu'à 7 en 5AP. À partir de 3AP, l'enfant doit aussi **nommer** chaque différence trouvée (en arabe, en français ou en anglais selon la séance). Le jeu devient alors aussi un exercice de vocabulaire.

### M7 — Trouve l'ombre (أين ظِلّي) — Pré et 1AP
Associer un objet à sa silhouette. Au fil des niveaux : objets du quotidien, puis animaux, puis formes géométriques, puis lettres. Ce jeu de discrimination visuelle est différent de l'Atelier des ombres, qui est un labo de physique.

### M8 — Écoute et choisis (اسمع واختر)
Didou fait entendre un son et l'enfant tape sur l'image qui correspond.

| Niveau | Sons |
|---|---|
| Pré | cris d'animaux ; sons de la maison ; émotions (voix joyeuse / triste) |
| 1AP | son initial d'un mot (بـ ou تـ ?) ; حركات (فتحة / ضمة / كسرة) |
| 2AP | تنوين ; مد بالألف / بالواو / بالياء |
| 3AP | anglais : numbers 1-20, colors ; français : voyelles a e i o u y |
| 4AP-5AP | anglais : daily routines, jobs ; français : distinguer le singulier du pluriel à l'oral |

### M9 — Dictée de Didou (إملاء ديدو)
Didou dit un mot et l'enfant le compose avec des tuiles de lettres. Il n'y a jamais de clavier, et c'est ce qui distingue ce jeu de `spelling_champ`, qui est un QCM.

| Niveau | Mots |
|---|---|
| 1AP | syllabes, puis mots de 3 lettres (thème : المدرسة, العائلة) |
| 2AP | mots avec شدة, puis avec ال |
| 3AP | تاء مفتوحة / مربوطة ; همزة وصل / قطع ; premiers mots français (école, famille) |
| 4AP | الهمزة على الألف / الواو / النبرة ; anglais rooms, animals |
| 5AP | الألف اللينة ; الهمزة المتوسطة والمتطرفة ; mots du projet « catastrophes naturelles » |

### M10 — La lanterne de Didou (فانوس ديدو) — remplace le pendu
Trouver un mot caché lettre par lettre. Chaque bonne lettre allume une lampe de la lanterne. Il n'y a pas d'échec brutal : après 6 erreurs, Didou donne un indice. Le jeu commence en 2AP (vocabulaire des محاور). Il continue jusqu'en 5AP, avec en plus le français et l'anglais à partir de 3AP.

### M11 — Le nombre cible (الرقم الهدف)
Atteindre un nombre donné en combinant des nombres et des opérations. Aucun chrono avant 4AP.

| Niveau | Règle |
|---|---|
| 1AP | complément à 10 (balance de Didou) |
| 2AP | complément à 100 ; addition avec retenue |
| 3AP | 2 nombres et 2 opérations (+ − ×) |
| 4AP | 3 nombres et la division ; pourcentage simple |
| 5AP | 4 nombres, décimaux autorisés |

### M12 — Vrai ou faux express (صح أم خطأ)
Une affirmation apparaît et l'enfant tape sur ✔ ou ✘. Le chrono n'est proposé qu'à partir de 3AP.

| Niveau | Affirmations |
|---|---|
| 2AP | comparaisons (> < =) ; « ce mot est au pluriel » |
| 3AP | ماضٍ / مضارع / أمر ; « 1/2 = 2/4 » |
| 4AP | français : présent du 1er groupe, être et avoir ; « ce quadrilatère a 4 angles droits » |
| 5AP | français : passé composé, futur, imparfait ; العدد العشري ; règles de sécurité électrique |

## 5. Couverture du programme

| Niveau | Moteurs principaux | Nombre de packs |
|---|---|---|
| Pré | M1, M2, M3, M4, M5, M6, M7, M8 | 8 |
| 1AP | M1, M2, M3, M4, M5, M7, M8, M9, M11 | 9 |
| 2AP | M1, M2, M3, M4, M5, M8, M9, M10, M11, M12 | 10 |
| 3AP | tous sauf M7 | 11 |
| 4AP | tous sauf M7 | 11 |
| 5AP | tous sauf M7 | 11 |

Total : **60 packs de jeux** à partir de 12 moteurs. Un pack contient environ 3 parties de 8 à 10 items, soit 1 800 items environ. Ces items sont rédigés **par nous**, puis relus par l'enseignant (voir v2-relecture-enseignant.md).

## 6. Accès gratuit / Premium (proposition, à valider)

Cette proposition suit la règle déjà en place : « contenu gratuit, services payants ».

- **Gratuit** : chaque moteur, avec le **premier pack de chaque niveau**.
- **Premium Famille** : tous les packs. Les jeux sont rattachés à la carte de Didou (une station-jeu par monde). Les résultats de jeu sont aussi intégrés au carnet parent détaillé.
- Clés à ajouter dans `entitlements.ts` : `gamesFreePacks` et `gamesAllPacks`. Comme pour les ateliers, le verrou serait appliqué **dans l'app**. Ce n'est pas une vraie protection tant que le contenu n'est pas servi par le serveur (voir v2-gratuit-payant.md).

## 7. Ordre de livraison conseillé

1. **Lot 1, avec 4 moteurs qui couvrent tous les niveaux.** Les 4 moteurs sont M1 Memory, M2 Classer, M3 Ordonner (refonte de `number_sort`) et M4 Labyrinthe. Ce lot donne 24 packs.
2. **Lot 2, pour l'écoute et l'écriture.** Ce lot contient M8 Écoute, M9 Dictée et M10 Lanterne. Il a besoin des voix enregistrées de Didou (voir docs/audio-v2, script ElevenLabs).
3. **Lot 3, pour le calcul et l'observation.** Ce lot contient M11 Nombre cible et M12 Vrai/faux. Il contient aussi M5, M6 et M7, qui ont besoin d'illustrations de scènes algériennes.

En cohérence avec la priorité « 5AP d'abord », on peut commencer le lot 1 par les packs 5AP, puis enchaîner sur le préscolaire et la 1AP. C'est le public de la carte de Didou.

## 8. Format technique envisagé

```ts
// frontend/src/data/games/types.ts
type GameEngine = 'memory' | 'sort' | 'order' | 'maze' | 'dots' | 'differences'
  | 'shadow' | 'listen' | 'dictation' | 'lantern' | 'target' | 'truefalse';

interface GamePack {
  id: string;              // ex. 'game-5ap-sort-plurals'
  engine: GameEngine;
  grade: 'PRE' | '1AP' | '2AP' | '3AP' | '4AP' | '5AP';
  subject: 'math' | 'arabic' | 'french' | 'english' | 'science' | 'islamic' | 'histgeo' | 'civics';
  lessonIds: string[];     // leçons existantes du catalogue
  competenceIds?: string[];// référentiel de compétences (1AP, 2AP, 5AP)
  titleAr: string; titleFr: string;
  instructionAudio: string;// clé de voix Didou
  items: unknown[];        // spécifique au moteur
  access: 'gamesFreePacks' | 'gamesAllPacks';
}
```

## 9. Moteurs supplémentaires (sites relevés le 4 novembre 2026)

Sources d'inspiration : tidou.fr, tipirate.net, cokojeux.com et toytheater.com. Comme au §1, nous ne reprenons que des **mécaniques génériques**.

- **Ce que nous ne reprenons pas :**
  - aucun nom de jeu ;
  - aucun personnage ni habillage de marque (Pac-Man, UNO, Mario, Sokoban, Block Blast…) ;
  - aucun contenu propre à la France, à la Belgique ou au Canada (départements, villes, provinces).
- **Jeux écartés :**
  - Halloween et Noël, hors contexte ;
  - dactylographie, car l'app est utilisée sur mobile ;
  - match-3, bubble shooter, coiffure, parking, UNO : divertissement sans objectif scolaire ;
  - chiffres romains et probabilités, absents du programme du primaire algérien.

### Ce que chaque site apporte

| Site | Idées retenues |
|---|---|
| tidou.fr | puzzles de 4 à 42 pièces, trouve l'intrus, labyrinthes, histoires racontées, imagiers sonores, mémoire sonore, rébus / proverbe du jour, mot du jour, émotions, reconnaissance vocale |
| tipirate.net | chasse au trésor (cherche et trouve), coloriage de pixels, sudoku en images, « ça se mange ? », morpion, reproduire un dessin sur quadrillage |
| cokojeux.com | tri des déchets, balance à équilibrer, empreintes d'animaux, programmer un robot avec des flèches, dictée graphique, mots mêlés, mots croisés, nonogramme, pousser des caisses, dominos, course de géographie, chasse aux nombres dans un labyrinthe, bataille navale, cuisine, énergie solaire et éolienne, circuit à allumer, drapeaux des pays arabes |
| toytheater.com | manipulations virtuelles : droite numérique, tableau de numération, cadre de 10, blocs base 10, bandes de fractions, géoplan, tangram, blocs de motifs, pentominos, solides et patrons, diagrammes en barres, nombre manquant, machine à transformer, décomposition des nombres, bingo, roue des émotions, synonymes / antonymes, accord sujet-verbe |

### M13 à M24 : nouveaux moteurs adaptés

| Moteur | Mécanique | Déclinaison Pré → 5AP (programme algérien) |
|---|---|---|
| **M13 Puzzle** (بازل) — généraliser `PreschoolJigsaw` | reconstituer une image en pièces | 4 pièces en Pré → 9 en 1AP → 16 en 2AP-3AP → 24 à 42 en 4AP-5AP. Images : مقام الشهيد, Timgad, Tassili, carte de l'Algérie (4AP : wilayas et relief) |
| **M14 Coloriage magique** (لوّن بالرقم) — généraliser `PreschoolColoring` | chaque case porte un calcul ou un mot ; la bonne réponse donne la couleur | Pré : couleur ↔ forme ; 1AP : additions < 20 ; 2AP : ×2 ×5 ×10 ; 3AP : tables 1-10, catégories de mots ; 4AP : divisions ; 5AP : décimaux. L'image révélée : zellige, drapeau, fanous, tapis |
| **M15 L'intrus** (أين الدخيل) | trouver l'élément qui ne va pas avec les autres | Pré : formes, couleurs ; 1AP : un mot sans la lettre étudiée ; 2AP : un verbe parmi des noms ; 3AP : un nombre impair parmi des pairs, un animal carnivore ; 4AP : une figure non parallélogramme ; 5AP : un جمع تكسير parmi des جمع سالم |
| **M16 Cherche et trouve** (ابحث وجِد) | retrouver N objets dans une grande scène | scènes : souk, plage d'Oran, oasis de Ghardaïa, salle de classe. À partir de 3AP, consigne en français ou en anglais (« find 3 school objects »). Complète M6 (différences) |
| **M17 Programme Didou** (برمج ديدو) | aligner des flèches ou des blocs, puis lancer : Didou exécute le programme | 1AP : 3 flèches (avant / droite / gauche), lien avec les relations spatiales ; 2AP : répéter ×2 ; 3AP : boucle simple, consignes droite / gauche en français ; 4AP : points cardinaux sur la carte ; 5AP : boucles et conditions simples, ramasser des objets dans l'ordre. **Variante dictée graphique** : suivre des instructions pour tracer une figure sur quadrillage (4AP perpendiculaires et parallèles) |
| **M18 Balance de Didou** (الميزان) | équilibrer deux plateaux | Pré : plus lourd / plus léger ; 1AP : comparer des masses, égalité 3 + 4 = 7 ; 2AP : g / kg ; 3AP : nombre manquant (□ + 25 = 60) ; 4AP : □ × 6 = 42 ; 5AP : masses décimales (1,5 kg + □ = 4 kg). Réutilise le vocabulaire du marché |
| **M19 Tri des déchets** (فرز النفايات) | déposer chaque déchet dans la bonne poubelle | 1AP-2AP : propre / à jeter, civisme ; 3AP-4AP : plastique / papier / verre / organique ; 5AP : recyclage, lien avec le projet français « Inventions & Écologie ». Contexte : la plage, le quartier, l'école |
| **M20 Rythme et mélodie** (إيقاع) — généraliser `PreschoolXylophone` | reproduire une suite de sons ou de rythmes | Pré : répéter 2 à 4 sons (derbouka, bendir, karkabou) ; 1AP-2AP : rythme des syllabes d'un mot ; 3AP+ : rythme de قسماً (éducation musicale) |
| **M21 Manipulations de Didou** (أدوات ديدو) — boîte à outils, pas un jeu chronométré | outils virtuels à manipuler pendant une leçon ou en défi | Pré-1AP : cadre de 10, jetons, décomposition des nombres ; 2AP : blocs base 10 (آحاد / عشرات / مئات), droite numérique ; 3AP : tableau de numération jusqu'à 99 999, bandes ½ ¼, géoplan (perpendiculaires et parallèles) ; 4AP : tangram et quadrilatères, bandes de fractions ; 5AP : solides et **comptage de cubes unités** pour le volume (comme le demande le guide officiel, sans formule toute faite), diagramme en barres, bandes décimal / pourcentage. Vérifier d'abord ce que couvrent déjà AreaPerimeterGridLab, FractionsDecimalsLab et Shape3DViewer |
| **M22 Grilles de mots** (كلمات متقاطعة / شبكة الكلمات) | mots mêlés puis mots croisés | 2AP : mots mêlés de 4 lettres maximum, en RTL et à l'horizontale seulement ; 3AP : mots croisés simples (vocabulaire des محاور) ; 4AP-5AP : définitions courtes, version française et anglaise ; 5AP : nonogramme qui révèle une lettre ou un symbole |
| **M23 Logique en grille** (ألغاز منطقية) | sudoku d'images, déplacer des caisses, morpion à questions | Pré-1AP : sudoku 4×4 en images (fruits, formes) ; 2AP-3AP : sudoku 4×4 en chiffres ; 4AP-5AP : 6×6, plus « pousser les caisses » (planification). **Morpion à questions** : il faut répondre juste pour poser son pion, à jouer à deux sur le même appareil (lien avec l'idée « multi-joueurs » du backlog P2) |
| **M24 Bataille navale des coordonnées** (المعركة البحرية) | repérer une case par ses coordonnées | 4AP : quadrillage A-H × 1-8, lien avec la lecture de carte ; 5AP : repérage sur plan à l'échelle. Thème : la baie d'Alger, sans connotation guerrière (on cherche des trésors) |

### Formats quotidiens (rétention)

Ces formats suivent l'idée « mot du jour » et « rébus du jour » vue sur tidou.fr. Ils s'insèrent dans le `DailyChallengeBanner` du préscolaire et dans « مهمتي اليومية ».

- **مثل اليوم** : un proverbe algérien ou arabe en rébus, expliqué par Didou (3AP+).
- **كلمة اليوم**, **Mot du jour**, **Word of the day** : un mot avec image et son. L'arabe dès 1AP, le français et l'anglais dès 3AP.
- **Histoire du soir de Didou** : un récit audio de 2 à 3 minutes, suivi de 2 questions de compréhension. Il complète l'Aventure du lecteur.

### Ce qui reste hors périmètre pour l'instant

- **Reconnaissance vocale** (« dis le mot ») : elle demande le micro et une validation fiable en arabe. La règle actuelle de V2 est de ne rien annoncer avec le micro. Ce sera pour le P2.
- **Cuisine algérienne et proportionnalité** (couscous pour 4 personnes → pour 8) : l'idée est forte pour la 5AP. Elle sera à intégrer comme mission du Marché de Didou plutôt que comme moteur à part.
- **Course des wilayas** : à faire comme mode chronométré de WilayasExplorer, pas comme un nouveau jeu.

### Bilan mis à jour

**24 moteurs**, dont 9 existent déjà en préscolaire et sont à généraliser. Cela donne environ **110 packs** du préscolaire à la 5AP.

L'ordre conseillé au §7 est conservé. Le lot 1 se concentre sur les moteurs qui existent déjà en préscolaire (M1, M2, M3, M4), puis M13 Puzzle et M14 Coloriage magique, dont le coût est faible. M17 Programme Didou et M21 Manipulations sont des **arguments Premium forts** pour les parents (codage, outils officiels) : à prévoir au lot 2.

## 10. Tests de cohérence des packs

Un test vérifiera trois choses :

- chaque `lessonIds` existe dans le catalogue ;
- aucun pack n'introduit de français ni d'anglais avant 3AP ;
- les bornes numériques respectent le programme : < 100 en 1AP, < 1000 en 2AP, < 100 000 en 3AP-4AP.
