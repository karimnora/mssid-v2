import { PreschoolModule } from './types';

// "أَلْعَابُ الحَرَكَةِ وَالتَّرْكِيزِ" — a bigger batch across the 4 movement/focus game families
// (click-the-target, drag-and-drop counting, mazes, sort-and-move), all built on interactionTypes
// that already exist (tap_choice, drag_drop, maze, sorting) — original themes/content/graphics
// (emoji + Tailwind, matching the rest of Mode Éveil), not copied from any outside source.
export const ARCADE_GAMES_MODULE: PreschoolModule = {
  id: 'preschool-arcade-games',
  domain: 'creative',
  icon: '🎮',
  totalSteps: 16,
  titleI18n: {
    ar: 'أَلْعَابُ الحَرَكَةِ وَالتَّرْكِيزِ',
    fr: 'Jeux de Mouvement et Concentration',
    en: 'Movement & Focus Games',
  },
  activities: [
    // --- Mazes (labyrinthes) ---
    {
      id: 'arcade-maze-rabbit',
      domain: 'creative',
      targetValue: 'rabbit',
      stepNumber: 1,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'سَاعِدِ الأَرْنَبَ لِيَصِلَ إِلَى الجَزَرَةِ',
          promptAudio: 'اِسْحَبِ الأَرْنَبَ عَلَى الطَّرِيقِ حَتَّى يَصِلَ إِلَى الجَزَرَةِ!',
          successAudio: 'وَصَلَ الأَرْنَبُ إِلَى الجَزَرَةِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Aide le Lapin à Trouver la Carotte',
          promptAudio: 'Fais glisser le lapin sur le chemin jusqu\'à la carotte !',
          successAudio: 'Le lapin a trouvé sa carotte ! Bravo !',
        },
        en: {
          title: 'Help the Rabbit Find the Carrot',
          promptAudio: 'Drag the rabbit along the path until it reaches the carrot!',
          successAudio: 'The rabbit found its carrot! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐰',
        mazeTravelerAsset: '🐰',
        mazeWaypoints: [
          { x: 20, y: 20 },
          { x: 70, y: 70 },
          { x: 50, y: 140 },
          { x: 120, y: 180 },
          { x: 190, y: 150 },
          { x: 235, y: 230 },
        ],
      },
    },
    {
      id: 'arcade-maze-boat',
      domain: 'creative',
      targetValue: 'boat',
      stepNumber: 2,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'قُدِ القَارِبَ إِلَى الجَزِيرَةِ',
          promptAudio: 'اِسْحَبِ القَارِبَ فَوْقَ المَوْجِ حَتَّى يَصِلَ إِلَى الجَزِيرَةِ!',
          successAudio: 'وَصَلَ القَارِبُ إِلَى الجَزِيرَةِ بِأَمَانٍ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Conduis le Bateau vers l\'Île',
          promptAudio: 'Fais glisser le bateau sur les vagues jusqu\'à l\'île !',
          successAudio: 'Le bateau est arrivé à l\'île en toute sécurité ! Bravo !',
        },
        en: {
          title: 'Sail the Boat to the Island',
          promptAudio: 'Drag the boat over the waves until it reaches the island!',
          successAudio: 'The boat arrived safely at the island! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛵',
        mazeTravelerAsset: '⛵',
        mazeWaypoints: [
          { x: 15, y: 130 },
          { x: 70, y: 90 },
          { x: 130, y: 150 },
          { x: 180, y: 100 },
          { x: 220, y: 160 },
          { x: 240, y: 60 },
        ],
      },
    },
    {
      id: 'arcade-maze-bird',
      domain: 'creative',
      targetValue: 'bird',
      stepNumber: 3,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'سَاعِدِ العُصْفُورَ لِيَصِلَ إِلَى عُشِّهِ',
          promptAudio: 'اِسْحَبِ العُصْفُورَ فِي السَّمَاءِ حَتَّى يَصِلَ إِلَى عُشِّهِ!',
          successAudio: 'وَصَلَ العُصْفُورُ إِلَى عُشِّهِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Aide l\'Oiseau à Rejoindre son Nid',
          promptAudio: 'Fais glisser l\'oiseau dans le ciel jusqu\'à son nid !',
          successAudio: 'L\'oiseau est arrivé à son nid ! Bravo !',
        },
        en: {
          title: 'Help the Bird Reach its Nest',
          promptAudio: 'Drag the bird through the sky until it reaches its nest!',
          successAudio: 'The bird reached its nest! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐦',
        mazeTravelerAsset: '🐦',
        mazeWaypoints: [
          { x: 230, y: 20 },
          { x: 170, y: 60 },
          { x: 190, y: 130 },
          { x: 110, y: 150 },
          { x: 70, y: 110 },
          { x: 20, y: 220 },
        ],
      },
    },
    {
      id: 'arcade-maze-turtle',
      domain: 'creative',
      targetValue: 'turtle',
      stepNumber: 4,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'سَاعِدِ السُّلَحْفَاةَ لِتَصِلَ إِلَى البِرْكَةِ',
          promptAudio: 'اِسْحَبِ السُّلَحْفَاةَ بِبُطْءٍ حَتَّى تَصِلَ إِلَى البِرْكَةِ!',
          successAudio: 'وَصَلَتِ السُّلَحْفَاةُ إِلَى بِرْكَتِهَا! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Aide la Tortue à Rejoindre son Étang',
          promptAudio: 'Fais glisser doucement la tortue jusqu\'à son étang !',
          successAudio: 'La tortue est arrivée à son étang ! Bravo !',
        },
        en: {
          title: 'Help the Turtle Reach its Pond',
          promptAudio: 'Slowly drag the turtle until it reaches its pond!',
          successAudio: 'The turtle reached its pond! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐢',
        mazeTravelerAsset: '🐢',
        mazeWaypoints: [
          { x: 20, y: 230 },
          { x: 80, y: 200 },
          { x: 60, y: 130 },
          { x: 140, y: 110 },
          { x: 120, y: 50 },
          { x: 230, y: 30 },
        ],
      },
    },
    // --- Drag & drop counting (glisser-déposer) ---
    {
      id: 'arcade-drag-apples',
      domain: 'creative',
      targetValue: 'apples',
      stepNumber: 5,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'اِجْمَعِ التُّفَّاحَ فِي السَّلَّةِ',
          promptAudio: 'اِسْحَبْ كُلَّ تُفَّاحَةٍ إِلَى السَّلَّةِ!',
          successAudio: 'جَمَعْتَ كُلَّ التُّفَّاحِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Ramasse les Pommes dans le Panier',
          promptAudio: 'Fais glisser chaque pomme jusqu\'au panier !',
          successAudio: 'Tu as ramassé toutes les pommes ! Bravo !',
        },
        en: {
          title: 'Collect the Apples in the Basket',
          promptAudio: 'Drag each apple to the basket!',
          successAudio: 'You collected all the apples! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dragItems: [
          { id: 'apple1', asset: '🍎' },
          { id: 'apple2', asset: '🍎' },
          { id: 'apple3', asset: '🍎' },
          { id: 'apple4', asset: '🍎' },
        ],
        dropZoneCount: 4,
      },
    },
    {
      id: 'arcade-drag-stars',
      domain: 'creative',
      targetValue: 'stars',
      stepNumber: 6,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'اِجْمَعِ النُّجُومَ فِي الجَرَّةِ',
          promptAudio: 'اِسْحَبْ كُلَّ نَجْمَةٍ إِلَى الجَرَّةِ!',
          successAudio: 'جَمَعْتَ كُلَّ النُّجُومِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Ramasse les Étoiles dans le Bocal',
          promptAudio: 'Fais glisser chaque étoile jusqu\'au bocal !',
          successAudio: 'Tu as ramassé toutes les étoiles ! Bravo !',
        },
        en: {
          title: 'Collect the Stars in the Jar',
          promptAudio: 'Drag each star to the jar!',
          successAudio: 'You collected all the stars! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🫙',
        dragItems: [
          { id: 'star1', asset: '⭐' },
          { id: 'star2', asset: '⭐' },
          { id: 'star3', asset: '⭐' },
          { id: 'star4', asset: '⭐' },
          { id: 'star5', asset: '⭐' },
        ],
        dropZoneCount: 5,
      },
    },
    {
      id: 'arcade-drag-fish',
      domain: 'creative',
      targetValue: 'fish',
      stepNumber: 7,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'اِجْمَعِ الأَسْمَاكَ فِي الوِعَاءِ',
          promptAudio: 'اِسْحَبْ كُلَّ سَمَكَةٍ إِلَى الوِعَاءِ!',
          successAudio: 'جَمَعْتَ كُلَّ الأَسْمَاكِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Ramasse les Poissons dans le Bocal',
          promptAudio: 'Fais glisser chaque poisson jusqu\'au bocal !',
          successAudio: 'Tu as ramassé tous les poissons ! Bravo !',
        },
        en: {
          title: 'Collect the Fish in the Bowl',
          promptAudio: 'Drag each fish to the bowl!',
          successAudio: 'You collected all the fish! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🥣',
        dragItems: [
          { id: 'fish1', asset: '🐟' },
          { id: 'fish2', asset: '🐟' },
          { id: 'fish3', asset: '🐟' },
        ],
        dropZoneCount: 3,
      },
    },
    {
      id: 'arcade-drag-leaves',
      domain: 'creative',
      targetValue: 'leaves',
      stepNumber: 8,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'اِجْمَعِ الأَوْرَاقَ فِي الكَوْمَةِ',
          promptAudio: 'اِسْحَبْ كُلَّ وَرَقَةٍ إِلَى الكَوْمَةِ!',
          successAudio: 'جَمَعْتَ كُلَّ الأَوْرَاقِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Ramasse les Feuilles en Tas',
          promptAudio: 'Fais glisser chaque feuille jusqu\'au tas !',
          successAudio: 'Tu as ramassé toutes les feuilles ! Bravo !',
        },
        en: {
          title: 'Rake the Leaves into a Pile',
          promptAudio: 'Drag each leaf to the pile!',
          successAudio: 'You raked all the leaves! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍂',
        dragItems: [
          { id: 'leaf1', asset: '🍁' },
          { id: 'leaf2', asset: '🍁' },
          { id: 'leaf3', asset: '🍁' },
          { id: 'leaf4', asset: '🍁' },
        ],
        dropZoneCount: 4,
      },
    },
    // --- Sort & move (déplacer) ---
    {
      id: 'arcade-sort-sky-land',
      domain: 'creative',
      targetValue: 'sky_land',
      stepNumber: 9,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَنْ يَطِيرُ وَمَنْ يَمْشِي؟',
          promptAudio: 'ضَعِ الحَيَوَانَاتِ الَّتِي تَطِيرُ فِي السَّمَاءِ، وَالَّتِي تَمْشِي عَلَى الأَرْضِ!',
          successAudio: 'مَيَّزْتَ مَنْ يَطِيرُ وَمَنْ يَمْشِي! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Qui Vole et Qui Marche ?',
          promptAudio: 'Mets les animaux qui volent dans le ciel, et ceux qui marchent sur la terre !',
          successAudio: 'Tu as bien trié qui vole et qui marche ! Bravo !',
        },
        en: {
          title: 'Who Flies and Who Walks?',
          promptAudio: 'Put the animals that fly in the sky, and the ones that walk on the ground!',
          successAudio: 'You sorted flyers from walkers! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌤️',
        sortBins: [
          { id: 'sky_bin', labelAsset: '☁️' },
          { id: 'land_bin', labelAsset: '🌳' },
        ],
        sortItems: [
          { id: 'bird1', asset: '🐦', correctBinId: 'sky_bin' },
          { id: 'bee1', asset: '🐝', correctBinId: 'sky_bin' },
          { id: 'dog1', asset: '🐶', correctBinId: 'land_bin' },
          { id: 'cat1', asset: '🐱', correctBinId: 'land_bin' },
        ],
      },
    },
    {
      id: 'arcade-sort-fruit-veg',
      domain: 'creative',
      targetValue: 'fruit_veg',
      stepNumber: 10,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَاكِهَةٌ أَمْ خُضَارٌ؟',
          promptAudio: 'ضَعِ الفَاكِهَةَ مَعَ التُّفَّاحَةِ، وَالخُضَارَ مَعَ الجَزَرَةِ!',
          successAudio: 'مَيَّزْتَ الفَاكِهَةَ مِنَ الخُضَارِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Fruit ou Légume ?',
          promptAudio: 'Mets les fruits avec la pomme, et les légumes avec la carotte !',
          successAudio: 'Tu as bien trié les fruits et les légumes ! Bravo !',
        },
        en: {
          title: 'Fruit or Vegetable?',
          promptAudio: 'Put the fruits with the apple, and the vegetables with the carrot!',
          successAudio: 'You sorted fruits from vegetables! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🥗',
        sortBins: [
          { id: 'fruit_bin', labelAsset: '🍎' },
          { id: 'veg_bin', labelAsset: '🥕' },
        ],
        sortItems: [
          { id: 'banana1', asset: '🍌', correctBinId: 'fruit_bin' },
          { id: 'grapes1', asset: '🍇', correctBinId: 'fruit_bin' },
          { id: 'tomato1', asset: '🍅', correctBinId: 'veg_bin' },
          { id: 'broccoli1', asset: '🥦', correctBinId: 'veg_bin' },
        ],
      },
    },
    {
      id: 'arcade-sort-seasons-clothes',
      domain: 'creative',
      targetValue: 'seasons_clothes',
      stepNumber: 11,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَلَابِسُ الصَّيْفِ وَمَلَابِسُ الشِّتَاءِ',
          promptAudio: 'ضَعْ مَلَابِسَ الصَّيْفِ مَعَ الشَّمْسِ، وَمَلَابِسَ الشِّتَاءِ مَعَ الثَّلْجِ!',
          successAudio: 'مَيَّزْتَ مَلَابِسَ الصَّيْفِ مِنَ الشِّتَاءِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Vêtements d\'Été et d\'Hiver',
          promptAudio: 'Mets les vêtements d\'été avec le soleil, et ceux d\'hiver avec la neige !',
          successAudio: 'Tu as bien trié les vêtements d\'été et d\'hiver ! Bravo !',
        },
        en: {
          title: 'Summer and Winter Clothes',
          promptAudio: 'Put the summer clothes with the sun, and the winter ones with the snow!',
          successAudio: 'You sorted summer from winter clothes! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧥',
        sortBins: [
          { id: 'summer_bin', labelAsset: '☀️' },
          { id: 'winter_bin', labelAsset: '❄️' },
        ],
        sortItems: [
          { id: 'sunglasses1', asset: '🕶️', correctBinId: 'summer_bin' },
          { id: 'shorts1', asset: '🩳', correctBinId: 'summer_bin' },
          { id: 'scarf1', asset: '🧣', correctBinId: 'winter_bin' },
          { id: 'gloves1', asset: '🧤', correctBinId: 'winter_bin' },
        ],
      },
    },
    {
      id: 'arcade-sort-vehicles',
      domain: 'creative',
      targetValue: 'vehicles',
      stepNumber: 12,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَرْكَبَاتُ السَّمَاءِ وَمَرْكَبَاتُ الطَّرِيقِ',
          promptAudio: 'ضَعِ المَرْكَبَاتِ الَّتِي تَطِيرُ فِي السَّمَاءِ، وَالَّتِي تَسِيرُ عَلَى الطَّرِيقِ!',
          successAudio: 'مَيَّزْتَ مَرْكَبَاتِ السَّمَاءِ مِنَ الطَّرِيقِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Véhicules du Ciel et de la Route',
          promptAudio: 'Mets les véhicules qui volent dans le ciel, et ceux qui roulent sur la route !',
          successAudio: 'Tu as bien trié les véhicules du ciel et de la route ! Bravo !',
        },
        en: {
          title: 'Sky Vehicles and Road Vehicles',
          promptAudio: 'Put the vehicles that fly in the sky, and the ones that drive on the road!',
          successAudio: 'You sorted sky vehicles from road vehicles! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚦',
        sortBins: [
          { id: 'sky_vehicle_bin', labelAsset: '☁️' },
          { id: 'road_vehicle_bin', labelAsset: '🛣️' },
        ],
        sortItems: [
          { id: 'plane1', asset: '✈️', correctBinId: 'sky_vehicle_bin' },
          { id: 'helicopter1', asset: '🚁', correctBinId: 'sky_vehicle_bin' },
          { id: 'car1', asset: '🚗', correctBinId: 'road_vehicle_bin' },
          { id: 'bus1', asset: '🚌', correctBinId: 'road_vehicle_bin' },
        ],
      },
    },
    // --- Click the target (cliquer) ---
    {
      id: 'arcade-click-balloon',
      domain: 'creative',
      targetValue: 'balloon',
      stepNumber: 13,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَيْنَ البَالُونُ؟',
          promptAudio: 'اِبْحَثْ عَنِ البَالُونِ وَالْمِسْهُ!',
          successAudio: 'وَجَدْتَ البَالُونَ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Où est le Ballon ?',
          promptAudio: 'Trouve le ballon et touche-le !',
          successAudio: 'Tu as trouvé le ballon ! Bravo !',
        },
        en: {
          title: 'Where is the Balloon?',
          promptAudio: 'Find the balloon and tap it!',
          successAudio: 'You found the balloon! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎈',
        choices: [
          { id: 'balloon', asset: '🎈', isCorrect: true },
          { id: 'cloud1', asset: '☁️', isCorrect: false },
          { id: 'cloud2', asset: '☁️', isCorrect: false },
        ],
      },
    },
    {
      id: 'arcade-click-star',
      domain: 'creative',
      targetValue: 'star',
      stepNumber: 14,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَيْنَ النَّجْمَةُ؟',
          promptAudio: 'اِبْحَثْ عَنِ النَّجْمَةِ وَالْمِسْهَا!',
          successAudio: 'وَجَدْتَ النَّجْمَةَ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Où est l\'Étoile ?',
          promptAudio: 'Trouve l\'étoile et touche-la !',
          successAudio: 'Tu as trouvé l\'étoile ! Bravo !',
        },
        en: {
          title: 'Where is the Star?',
          promptAudio: 'Find the star and tap it!',
          successAudio: 'You found the star! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⭐',
        choices: [
          { id: 'star', asset: '⭐', isCorrect: true },
          { id: 'moon1', asset: '🌙', isCorrect: false },
          { id: 'moon2', asset: '🌙', isCorrect: false },
        ],
      },
    },
    {
      id: 'arcade-click-boat',
      domain: 'creative',
      targetValue: 'boat',
      stepNumber: 15,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَيْنَ القَارِبُ؟',
          promptAudio: 'اِبْحَثْ عَنِ القَارِبِ وَالْمِسْهُ!',
          successAudio: 'وَجَدْتَ القَارِبَ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Où est le Bateau ?',
          promptAudio: 'Trouve le bateau et touche-le !',
          successAudio: 'Tu as trouvé le bateau ! Bravo !',
        },
        en: {
          title: 'Where is the Boat?',
          promptAudio: 'Find the boat and tap it!',
          successAudio: 'You found the boat! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛵',
        choices: [
          { id: 'boat', asset: '⛵', isCorrect: true },
          { id: 'wave1', asset: '🌊', isCorrect: false },
          { id: 'wave2', asset: '🌊', isCorrect: false },
        ],
      },
    },
    {
      id: 'arcade-click-sun',
      domain: 'creative',
      targetValue: 'sun',
      stepNumber: 16,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَيْنَ الشَّمْسُ؟',
          promptAudio: 'اِبْحَثْ عَنِ الشَّمْسِ وَالْمِسْهَا!',
          successAudio: 'وَجَدْتَ الشَّمْسَ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Où est le Soleil ?',
          promptAudio: 'Trouve le soleil et touche-le !',
          successAudio: 'Tu as trouvé le soleil ! Bravo !',
        },
        en: {
          title: 'Where is the Sun?',
          promptAudio: 'Find the sun and tap it!',
          successAudio: 'You found the sun! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☀️',
        choices: [
          { id: 'sun', asset: '☀️', isCorrect: true },
          { id: 'circle1', asset: '🟡', isCorrect: false },
          { id: 'circle2', asset: '🟠', isCorrect: false },
        ],
      },
    },
  ],
};
