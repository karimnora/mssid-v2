import { PreschoolModule } from './types';

// "أَلْعَابِي الإِبْدَاعِيَّةُ" — Coloring, Mazes & Jigsaw Puzzles.
// Introduces the 3 new interactionTypes (coloring, maze, jigsaw) with 2 activities each, matching
// the toddler-game genres missing from the existing tap/sort/drag/trace/memory set (inspired by
// sites like jeuxpourtoutpetit.com: coloriage, labyrinthe, puzzle).
export const CREATIVE_GAMES_MODULE: PreschoolModule = {
  id: 'preschool-creative-games',
  domain: 'creative',
  icon: '🎨',
  totalSteps: 9,
  titleI18n: {
    ar: 'أَلْعَابِي الإِبْدَاعِيَّةُ',
    fr: 'Mes Jeux Créatifs',
    en: 'My Creative Games',
  },
  activities: [
    {
      id: 'creative-color-apple',
      domain: 'creative',
      targetValue: 'apple',
      stepNumber: 1,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ التُّفَّاحَةَ',
          promptAudio: 'اِخْتَرْ لَوْناً وَلَوِّنِ التُّفَّاحَةَ الجَمِيلَةَ!',
          promptText: 'دَعْ طِفْلَكَ يَخْتَارُ الأَلْوَانَ بِحُرِّيَّةٍ وَيَلْمَسُ كُلَّ جُزْءٍ مِنَ التُّفَّاحَةِ.',
          successAudio: 'تُفَّاحَةٌ مُلَوَّنَةٌ رَائِعَةٌ! أَنْتَ فَنَّانٌ صَغِيرٌ!',
        },
        fr: {
          title: 'Colorie la Pomme',
          promptAudio: 'Choisis une couleur et colorie la jolie pomme !',
          promptText: 'Laissez l\'enfant choisir librement ses couleurs.',
          successAudio: 'Quelle belle pomme colorée ! Tu es un petit artiste !',
        },
        en: {
          title: 'Color the Apple',
          promptAudio: 'Pick a color and color the pretty apple!',
          promptText: 'Let your child freely choose the colors.',
          successAudio: 'What a beautiful colored apple! You are a little artist!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        coloringRegions: [
          { id: 'body', shape: 'circle', x: 130, y: 150, size: 70 },
          { id: 'leaf', shape: 'ellipse', x: 158, y: 65, size: 20, size2: 12 },
          { id: 'stem', shape: 'rect', x: 122, y: 45, size: 14, size2: 35 },
        ],
      },
    },
    {
      id: 'creative-color-flower',
      domain: 'creative',
      targetValue: 'flower',
      stepNumber: 2,
      interactionType: 'coloring',
      i18n: {
        ar: {
          title: 'لَوِّنِ الزَّهْرَةَ',
          promptAudio: 'لَوِّنْ بَتَلَاتِ الزَّهْرَةِ بِأَلْوَانِكَ المُفَضَّلَةِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى اسْتِخْدَامِ أَلْوَانٍ مُخْتَلِفَةٍ لِكُلِّ بَتَلَةٍ.',
          successAudio: 'زَهْرَةٌ رَائِعَةُ الأَلْوَانِ! جَمِيلَةٌ جِدّاً!',
        },
        fr: {
          title: 'Colorie la Fleur',
          promptAudio: 'Colorie les pétales de la fleur avec tes couleurs préférées !',
          promptText: 'Encouragez l\'enfant à utiliser une couleur différente par pétale.',
          successAudio: 'Quelle fleur magnifique et colorée !',
        },
        en: {
          title: 'Color the Flower',
          promptAudio: 'Color the flower petals with your favorite colors!',
          promptText: 'Encourage your child to use a different color per petal.',
          successAudio: 'What a wonderfully colored flower!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌸',
        coloringRegions: [
          { id: 'core', shape: 'circle', x: 130, y: 140, size: 22 },
          { id: 'petal_top', shape: 'circle', x: 130, y: 95, size: 20 },
          { id: 'petal_right', shape: 'circle', x: 172, y: 140, size: 20 },
          { id: 'petal_bottom', shape: 'circle', x: 130, y: 185, size: 20 },
          { id: 'petal_left', shape: 'circle', x: 88, y: 140, size: 20 },
          { id: 'stem', shape: 'rect', x: 124, y: 195, size: 12, size2: 45 },
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
          title: 'سَاعِدِ النَّمْلَةَ',
          promptAudio: 'اِسْحَبِ النَّمْلَةَ عَلَى الطَّرِيقِ حَتَّى تَصِلَ إِلَى الوَرَقَةِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى سَحْبِ النَّمْلَةِ بِإِصْبَعِهِ مُتَابِعاً الخَطَّ المُنَقَّطَ.',
          successAudio: 'أَحْسَنْتَ! وَصَلَتِ النَّمْلَةُ إِلَى وَرَقَتِهَا!',
        },
        fr: {
          title: 'Aide la Fourmi',
          promptAudio: 'Fais glisser la fourmi sur le chemin jusqu\'à la feuille !',
          promptText: 'Encouragez l\'enfant à suivre la ligne pointillée du doigt.',
          successAudio: 'Bravo ! La fourmi est arrivée à sa feuille !',
        },
        en: {
          title: 'Help the Ant',
          promptAudio: 'Drag the ant along the path until it reaches the leaf!',
          promptText: 'Encourage your child to follow the dotted line with a finger.',
          successAudio: 'Well done! The ant reached its leaf!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐜',
        mazeTravelerAsset: '🐜',
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
          title: 'سَاعِدِ السَّمَكَةَ',
          promptAudio: 'اِسْحَبِ السَّمَكَةَ فِي البَحْرِ حَتَّى تَصِلَ إِلَى الصَّدَفَةِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى تَتَبُّعِ الطَّرِيقِ المُتَعَرِّجِ حَتَّى النِّهَايَةِ.',
          successAudio: 'رَائِعٌ! وَصَلَتِ السَّمَكَةُ إِلَى صَدَفَتِهَا!',
        },
        fr: {
          title: 'Aide le Poisson',
          promptAudio: 'Fais glisser le poisson dans la mer jusqu\'au coquillage !',
          promptText: 'Encouragez l\'enfant à suivre le chemin sinueux jusqu\'au bout.',
          successAudio: 'Bravo ! Le poisson a trouvé son coquillage !',
        },
        en: {
          title: 'Help the Fish',
          promptAudio: 'Drag the fish through the sea until it reaches the shell!',
          promptText: 'Encourage your child to follow the winding path to the end.',
          successAudio: 'Great! The fish found its shell!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐟',
        mazeTravelerAsset: '🐟',
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
          title: 'رَكِّبْ مَنْظَرَ المَزْرَعَةِ',
          promptAudio: 'ضَعْ كُلَّ قِطْعَةٍ فِي مَكَانِهَا الصَّحِيحِ لِتُكْمِلَ الصُّورَةَ!',
          promptText: 'سَاعِدْ طِفْلَكَ عَلَى مُطَابَقَةِ كُلِّ عُنْصُرٍ مَعَ ظِلِّهِ الشَّفَّافِ.',
          successAudio: 'أَحْسَنْتَ! أَكْمَلْتَ الصُّورَةَ بِالكَامِلِ!',
        },
        fr: {
          title: 'Reconstitue la Ferme',
          promptAudio: 'Place chaque pièce à sa juste place pour compléter l\'image !',
          promptText: 'Aidez l\'enfant à associer chaque pièce à son ombre transparente.',
          successAudio: 'Bravo ! Tu as complété toute l\'image !',
        },
        en: {
          title: 'Build the Farm Scene',
          promptAudio: 'Put each piece in its right place to complete the picture!',
          promptText: 'Help your child match each piece to its faint shadow.',
          successAudio: 'Well done! You completed the whole picture!',
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
      id: 'creative-jigsaw-zoo',
      domain: 'creative',
      targetValue: 'zoo',
      stepNumber: 6,
      interactionType: 'jigsaw',
      i18n: {
        ar: {
          title: 'رَكِّبْ حَدِيقَةَ الحَيَوَانِ',
          promptAudio: 'ضَعْ كُلَّ حَيَوَانٍ فِي مَكَانِهِ الصَّحِيحِ!',
          promptText: 'سَاعِدْ طِفْلَكَ عَلَى مُطَابَقَةِ كُلِّ حَيَوَانٍ مَعَ ظِلِّهِ.',
          successAudio: 'مُمْتَازٌ! كُلُّ الحَيَوَانَاتِ فِي أَمَاكِنِهَا!',
        },
        fr: {
          title: 'Construis le Zoo',
          promptAudio: 'Place chaque animal à sa juste place !',
          promptText: 'Aidez l\'enfant à associer chaque animal à son ombre.',
          successAudio: 'Excellent ! Tous les animaux sont à leur place !',
        },
        en: {
          title: 'Build the Zoo',
          promptAudio: 'Put each animal in its right place!',
          promptText: 'Help your child match each animal to its shadow.',
          successAudio: 'Excellent! All the animals are in place!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦁',
        jigsawSlots: [
          { id: 'lion_slot', x: 60, y: 60 },
          { id: 'elephant_slot', x: 220, y: 60 },
          { id: 'monkey_slot', x: 60, y: 170 },
          { id: 'giraffe_slot', x: 220, y: 170 },
        ],
        jigsawPieces: [
          { id: 'lion_piece', asset: '🦁', correctSlotId: 'lion_slot' },
          { id: 'elephant_piece', asset: '🐘', correctSlotId: 'elephant_slot' },
          { id: 'monkey_piece', asset: '🐒', correctSlotId: 'monkey_slot' },
          { id: 'giraffe_piece', asset: '🦒', correctSlotId: 'giraffe_slot' },
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
          title: 'قُدِ السَّيَّارَةَ إِلَى البَيْتِ',
          promptAudio: 'اِسْحَبِ السَّيَّارَةَ عَلَى الطَّرِيقِ حَتَّى تَصِلَ إِلَى البَيْتِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى قِيَادَةِ السَّيَّارَةِ بِإِصْبَعِهِ عَلَى طُولِ الطَّرِيقِ.',
          successAudio: 'وَصَلَتِ السَّيَّارَةُ بِأَمَانٍ إِلَى البَيْتِ! أَحْسَنْتَ القِيَادَةَ!',
        },
        fr: {
          title: 'Conduis la Voiture à la Maison',
          promptAudio: 'Fais glisser la voiture sur la route jusqu\'à la maison !',
          promptText: 'Encouragez l\'enfant à conduire la voiture du doigt le long de la route.',
          successAudio: 'La voiture est arrivée à la maison en toute sécurité ! Bravo pour la conduite !',
        },
        en: {
          title: 'Drive the Car Home',
          promptAudio: 'Drag the car along the road until it reaches the house!',
          promptText: 'Encourage your child to drive the car with a finger along the road.',
          successAudio: 'The car arrived home safely! Great driving!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🚗',
        mazeTravelerAsset: '🚗',
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
      id: 'creative-rain-drops',
      domain: 'creative',
      targetValue: 'rain',
      stepNumber: 8,
      interactionType: 'drag_drop',
      i18n: {
        ar: {
          title: 'اِجْمَعِ المَطَرَ',
          promptAudio: 'اِسْحَبْ كُلَّ قَطْرَةِ مَطَرٍ إِلَى المِظَلَّةِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى سَحْبِ كُلِّ قَطْرَةٍ نَحْوَ المِظَلَّةِ وَاحِدَةً تِلْوَ الأُخْرَى.',
          successAudio: 'جَمَعْتَ كُلَّ قَطَرَاتِ المَطَرِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Récolte la Pluie',
          promptAudio: 'Fais glisser chaque goutte de pluie vers le parapluie !',
          promptText: 'Encouragez l\'enfant à faire glisser chaque goutte l\'une après l\'autre.',
          successAudio: 'Tu as récolté toutes les gouttes de pluie ! Bravo !',
        },
        en: {
          title: 'Collect the Rain',
          promptAudio: 'Drag each raindrop to the umbrella!',
          promptText: 'Encourage your child to drag each drop one after another.',
          successAudio: 'You collected all the raindrops! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☔',
        dragItems: [
          { id: 'drop1', asset: '💧' },
          { id: 'drop2', asset: '💧' },
          { id: 'drop3', asset: '💧' },
          { id: 'drop4', asset: '💧' },
        ],
        dropZoneCount: 4,
      },
    },
    {
      id: 'creative-bees-flowers',
      domain: 'creative',
      targetValue: 'bees',
      stepNumber: 9,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أَعِدِ النَّحْلَ وَالفَرَاشَاتِ إِلَى بُيُوتِهَا',
          promptAudio: 'ضَعِ النَّحْلَ فِي الخَلِيَّةِ، وَالفَرَاشَاتِ عِنْدَ الزَّهْرَةِ!',
          promptText: 'شَجِّعْ طِفْلَكَ عَلَى التَّمْيِيزِ بَيْنَ النَّحْلَةِ وَالفَرَاشَةِ.',
          successAudio: 'كُلُّ نَحْلَةٍ وَفَرَاشَةٍ فِي مَكَانِهَا الصَّحِيحِ! أَحْسَنْتَ!',
        },
        fr: {
          title: 'Range les Abeilles et les Papillons',
          promptAudio: 'Mets les abeilles dans la ruche, et les papillons près de la fleur !',
          promptText: 'Encouragez l\'enfant à différencier l\'abeille du papillon.',
          successAudio: 'Chaque abeille et papillon est à sa place ! Bravo !',
        },
        en: {
          title: 'Sort the Bees and Butterflies',
          promptAudio: 'Put the bees in the hive, and the butterflies by the flower!',
          promptText: 'Encourage your child to tell the bee from the butterfly.',
          successAudio: 'Every bee and butterfly is in its place! Well done!',
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
          { id: 'butterfly1', asset: '🦋', correctBinId: 'flower_bin' },
          { id: 'butterfly2', asset: '🦋', correctBinId: 'flower_bin' },
        ],
      },
    },
  ],
};
