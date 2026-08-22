import { PreschoolModule } from './types';

/**
 * "أَلْعَابِي الإِبْدَاعِيَّةُ" — Coloriage, labyrinthes, puzzles.
 * No second flower coloring (that's in Mon Art). Mazes show the real goal
 * (leaf, shell, house) instead of a generic flag.
 */
export const CREATIVE_GAMES_MODULE: PreschoolModule = {
  id: 'preschool-creative-games',
  domain: 'creative',
  icon: '🎨',
  totalSteps: 8,
  titleI18n: {
    ar: 'أَلْعَابِي الإِبْدَاعِيَّةُ',
    fr: 'Mes Jeux Créatifs',
    en: 'My Creative Games',
  },
  activities: [
    {
      id: 'creative-play-path',
      domain: 'creative',
      targetValue: 'play-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'دَفْتَرُ الأَلْعَاب',
          promptAudio: 'اِسْحَبْ: تُفَّاحَة، نَمْلَة، سَمَكَة، مَزْرَعَة، ثُمَّ نَحْلَة!',
          promptText: 'كل محطة لعبة مختلفة: تلوين، متاهة، بازل، فرز.',
          successAudio: 'هَيَّا نَلْعَب! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Cahier de Jeux',
          promptAudio: 'Glisse : pomme, fourmi, poisson, ferme, puis abeille !',
          promptText: 'Chaque station est un jeu : coloriage, labyrinthe, puzzle, tri.',
          successAudio: 'On joue ! Bravo !',
        },
        en: {
          title: 'The Play Book',
          promptAudio: 'Drag: apple, ant, fish, farm, then bee!',
          promptText: 'Each stop is a game: coloring, maze, puzzle, sort.',
          successAudio: 'Let\'s play! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎨',
        pathTheme: 'writing',
        pathToken: { startAsset: '🍎', endAsset: '🐝', travelerAsset: '🎨' },
        pathStops: [
          { x: 14, y: 32, asset: '🍎', color: '#fecaca' },
          { x: 42, y: 16, asset: '🐜', color: '#e2e8f0' },
          { x: 74, y: 28, asset: '🐟', color: '#bae6fd' },
          { x: 84, y: 58, asset: '🚜', color: '#bbf7d0' },
          { x: 48, y: 78, asset: '🐝', color: '#fde68a' },
        ],
      },
    },
    {
      id: 'creative-color-apple',
      domain: 'creative',
      targetValue: 'apple',
      stepNumber: 2,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ التُّفَّاحَة',
          promptAudio: 'اِخْتَرْ لَوْناً وَلَوِّنِ التُّفَّاحَة! الجِسْمُ وَالعُنُقُ وَالوَرَقَة!',
          promptText: 'ثلاث مناطق كبيرة.',
          successAudio: 'تُفَّاحَةٌ جَمِيلَة!',
        },
        fr: {
          title: 'Colorie la Pomme',
          promptAudio: 'Choisis une couleur et colorie la pomme ! Le fruit, la tige et la feuille !',
          promptText: 'Trois grandes zones.',
          successAudio: 'Une belle pomme !',
        },
        en: {
          title: 'Color the Apple',
          promptAudio: 'Pick a color and color the apple! The fruit, the stem and the leaf!',
          promptText: 'Three big zones.',
          successAudio: 'A beautiful apple!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        coloringRegions: [
          { id: 'body', shape: 'circle', x: 130, y: 148, size: 72 },
          { id: 'stem', shape: 'rect', x: 122, y: 48, size: 16, size2: 36 },
          { id: 'leaf', shape: 'ellipse', x: 160, y: 62, size: 24, size2: 14 },
        ],
      },
    },
    {
      id: 'creative-maze-ant',
      domain: 'creative',
      targetValue: 'ant',
      stepNumber: 3,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'النَّمْلَةُ إِلَى الوَرَقَة',
          promptAudio: 'اِسْحَبِ النَّمْلَةَ حَتَّى الوَرَقَةِ الخَضْرَاء!',
          promptText: 'اتبع الخط المنقط بإصبعك.',
          successAudio: 'وَصَلَتِ النَّمْلَة!',
        },
        fr: {
          title: 'La Fourmi vers la Feuille',
          promptAudio: 'Glisse la fourmi jusqu\'à la feuille verte !',
          promptText: 'Suivre le pointillé du doigt.',
          successAudio: 'La fourmi est arrivée !',
        },
        en: {
          title: 'Ant to the Leaf',
          promptAudio: 'Drag the ant all the way to the green leaf!',
          promptText: 'Follow the dotted line with a finger.',
          successAudio: 'The ant arrived!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐜',
        mazeTravelerAsset: '🐜',
        mazeGoalAsset: '🍃',
        mazeWaypoints: [
          { x: 30, y: 220 },
          { x: 90, y: 180 },
          { x: 70, y: 120 },
          { x: 140, y: 90 },
          { x: 200, y: 130 },
          { x: 230, y: 50 },
        ],
      },
    },
    {
      id: 'creative-maze-fish',
      domain: 'creative',
      targetValue: 'fish',
      stepNumber: 4,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'السَّمَكَةُ إِلَى الصَّدَفَة',
          promptAudio: 'اِسْحَبِ السَّمَكَةَ فِي البَحْرِ حَتَّى الصَّدَفَة!',
          promptText: 'الهدف صدفة، ليس علماً.',
          successAudio: 'وَجَدَتِ السَّمَكَةُ صَدَفَتَهَا!',
        },
        fr: {
          title: 'Le Poisson vers le Coquillage',
          promptAudio: 'Glisse le poisson dans la mer jusqu\'au coquillage !',
          promptText: 'L\'arrivée est un coquillage, pas un drapeau.',
          successAudio: 'Le poisson a trouvé son coquillage !',
        },
        en: {
          title: 'Fish to the Shell',
          promptAudio: 'Drag the fish through the sea to the shell!',
          promptText: 'The goal is a shell, not a flag.',
          successAudio: 'The fish found its shell!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐟',
        mazeTravelerAsset: '🐟',
        mazeGoalAsset: '🐚',
        mazeWaypoints: [
          { x: 20, y: 40 },
          { x: 80, y: 80 },
          { x: 60, y: 150 },
          { x: 130, y: 190 },
          { x: 190, y: 160 },
          { x: 235, y: 210 },
        ],
      },
    },
    {
      id: 'creative-jigsaw-farm',
      domain: 'creative',
      targetValue: 'farm',
      stepNumber: 5,
      interactionType: 'jigsaw',
      i18n: {
        ar: {
          title: 'رَكِّبِ المَزْرَعَة',
          promptAudio: 'ضَعِ الشَّمْسَ وَالشَّجَرَةَ وَالبَيْتَ فِي مَكَانِهَا!',
          promptText: 'كل قطعة على ظلها.',
          successAudio: 'المَزْرَعَةُ كَامِلَة!',
        },
        fr: {
          title: 'Reconstitue la Ferme',
          promptAudio: 'Mets le soleil, l\'arbre et la maison à leur place !',
          promptText: 'Chaque pièce sur son ombre.',
          successAudio: 'La ferme est complète !',
        },
        en: {
          title: 'Build the Farm',
          promptAudio: 'Put the sun, the tree and the house in their place!',
          promptText: 'Each piece on its shadow.',
          successAudio: 'The farm is complete!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚜',
        jigsawSlots: [
          { id: 'sun_slot', x: 50, y: 40 },
          { id: 'cloud_slot', x: 220, y: 40 },
          { id: 'tree_slot', x: 60, y: 150 },
          { id: 'house_slot', x: 220, y: 150 },
        ],
        jigsawPieces: [
          { id: 'sun_piece', asset: '☀️', correctSlotId: 'sun_slot' },
          { id: 'cloud_piece', asset: '☁️', correctSlotId: 'cloud_slot' },
          { id: 'tree_piece', asset: '🌳', correctSlotId: 'tree_slot' },
          { id: 'house_piece', asset: '🏠', correctSlotId: 'house_slot' },
        ],
      },
    },
    {
      id: 'creative-jigsaw-oasis',
      domain: 'creative',
      targetValue: 'oasis',
      stepNumber: 6,
      interactionType: 'jigsaw',
      i18n: {
        ar: {
          title: 'رَكِّبِ الوَاحَة',
          promptAudio: 'ضَعِ الشَّمْسَ وَالجَمَلَ وَالفَنَكَ وَالنَّخْلَةَ فِي مَكَانِهَا!',
          promptText: 'واحة جزائرية: شمس، جمل، فنك، نخلة.',
          successAudio: 'وَاحَةٌ جَمِيلَة!',
        },
        fr: {
          title: 'Reconstitue l\'Oasis',
          promptAudio: 'Mets le soleil, le dromadaire, le fennec et le palmier à leur place !',
          promptText: 'Oasis algérienne : soleil, dromadaire, fennec, palmier.',
          successAudio: 'Une belle oasis !',
        },
        en: {
          title: 'Build the Oasis',
          promptAudio: 'Put the sun, the camel, the fennec and the palm in their place!',
          promptText: 'Algerian oasis: sun, camel, fennec, palm.',
          successAudio: 'A beautiful oasis!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌴',
        jigsawSlots: [
          { id: 'sun_slot', x: 60, y: 50 },
          { id: 'camel_slot', x: 220, y: 50 },
          { id: 'fennec_slot', x: 60, y: 160 },
          { id: 'palm_slot', x: 220, y: 160 },
        ],
        jigsawPieces: [
          { id: 'sun_piece', asset: '☀️', correctSlotId: 'sun_slot' },
          { id: 'camel_piece', asset: '🐪', correctSlotId: 'camel_slot' },
          { id: 'fennec_piece', asset: '🦊', correctSlotId: 'fennec_slot' },
          { id: 'palm_piece', asset: '🌴', correctSlotId: 'palm_slot' },
        ],
      },
    },
    {
      id: 'creative-maze-car',
      domain: 'creative',
      targetValue: 'car',
      stepNumber: 7,
      interactionType: 'maze',
      i18n: {
        ar: {
          title: 'السَّيَّارَةُ إِلَى البَيْت',
          promptAudio: 'اِسْحَبِ السَّيَّارَةَ عَلَى الطَّرِيقِ حَتَّى البَيْت!',
          promptText: 'الهدف بيت، ليس علماً.',
          successAudio: 'وَصَلَتِ السَّيَّارَةُ إِلَى البَيْت!',
        },
        fr: {
          title: 'La Voiture vers la Maison',
          promptAudio: 'Glisse la voiture sur la route jusqu\'à la maison !',
          promptText: 'L\'arrivée est une maison.',
          successAudio: 'La voiture est arrivée à la maison !',
        },
        en: {
          title: 'Car to the House',
          promptAudio: 'Drag the car along the road all the way home!',
          promptText: 'The goal is a house.',
          successAudio: 'The car arrived home!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚗',
        mazeTravelerAsset: '🚗',
        mazeGoalAsset: '🏡',
        mazeWaypoints: [
          { x: 25, y: 230 },
          { x: 90, y: 190 },
          { x: 60, y: 120 },
          { x: 150, y: 100 },
          { x: 200, y: 150 },
          { x: 235, y: 40 },
        ],
      },
    },
    {
      id: 'creative-bees-flowers',
      domain: 'creative',
      targetValue: 'bees',
      stepNumber: 8,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'نَحْلٌ أَمْ فَرَاش؟',
          promptAudio: 'ضَعِ النَّحْلَ مَعَ العَسَل، وَالفَرَاشَاتِ مَعَ الزَّهْرَة!',
          promptText: 'النحل ↔ عسل، الفراشات ↔ زهرة.',
          successAudio: 'كُلُّ وَاحِدٍ فِي مَكَانِهِ!',
        },
        fr: {
          title: 'Abeille ou Papillon ?',
          promptAudio: 'Mets les abeilles avec le miel, et les papillons avec la fleur !',
          promptText: 'Abeilles ↔ miel, papillons ↔ fleur.',
          successAudio: 'Chacun à sa place !',
        },
        en: {
          title: 'Bee or Butterfly?',
          promptAudio: 'Put the bees with the honey, and the butterflies with the flower!',
          promptText: 'Bees ↔ honey, butterflies ↔ flower.',
          successAudio: 'Everyone in their place!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐝',
        sortBins: [
          { id: 'hive_bin', labelAsset: '🍯' },
          { id: 'flower_bin', labelAsset: '🌸' },
        ],
        sortItems: [
          { id: 'bee1', asset: '🐝', correctBinId: 'hive_bin' },
          { id: 'bee2', asset: '🐝', correctBinId: 'hive_bin' },
          { id: 'bee3', asset: '🐝', correctBinId: 'hive_bin' },
          { id: 'butterfly1', asset: '🦋', correctBinId: 'flower_bin' },
          { id: 'butterfly2', asset: '🦋', correctBinId: 'flower_bin' },
          { id: 'butterfly3', asset: '🦋', correctBinId: 'flower_bin' },
        ],
      },
    },
  ],
};
