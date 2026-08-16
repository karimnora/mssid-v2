import { PreschoolModule } from './types';

// "أَلْوَانِي وَفُنُونِي" — Colors, Drawing & Graphism (Psychomotricity).
// 1. "طريق الفنك إلى بيته": Tracé de chemin fluide (labyrinthe au doigt)
// 2. "فرز الألوان": Tri des couleurs primaires (الأحمر، الأخضر، الأزرق)
// 3. "تلوين الأواني الفخارية": Découverte des couleurs et motifs
// 4. "ذاكرة الألوان": Paires de couleurs et formes festives
export const COLORS_MODULE: PreschoolModule = {
  id: 'preschool-colors',
  domain: 'colors',
  icon: '🎨',
  totalSteps: 4,
  titleI18n: {
    ar: 'أَلْوَانِي وَفُنُونِي البَدِيعَةُ',
    fr: 'Mes Couleurs & Beaux Arts',
    en: 'My Colors & Arts',
  },
  activities: [
    {
      id: 'colors-fennec-path',
      domain: 'colors',
      targetValue: 'path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'طَرِيقُ الفَنَكِ إِلَى بَيْتِهِ',
          promptAudio: 'اِسْحَبِ الفَنَكَ الصَّغِيرَ عَبْرَ الكُثْبَانِ الرَّمْلِيَّةِ إِلَى بَيْتِهِ الدَّافِئ!',
          promptText: 'اسحبي الفنك بإصبعك نحو بيته.',
          successAudio: 'وَصَلَ الفَنَكُ إِلَى بَيْتِهِ بِأَمَان! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Chemin du Fennec',
          promptAudio: 'Fais glisser le petit fennec sur les dunes jusqu\'à sa maison !',
          promptText: 'Aidez l\'enfant à glisser le fennec vers sa maison.',
          successAudio: 'Le petit fennec est rentré bien au chaud ! Bravo !',
        },
        en: {
          title: 'The Fennec\'s Path',
          promptAudio: 'Drag the little fennec across the dunes to his cozy home!',
          promptText: 'Help the child drag the fennec home.',
          successAudio: 'The fennec made it home! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathToken: {
          startAsset: '🦊',
          endAsset: '🏡',
          travelerAsset: '🦊',
        },
      },
    },
    {
      id: 'colors-sort-red-green-blue',
      domain: 'colors',
      targetValue: 'sort_colors',
      stepNumber: 2,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَرْزُ الأَلْوَانِ الزَّاهِيَةِ',
          promptAudio: 'ضَعِ الأَشْيَاءَ الحَمْرَاءَ فِي الصُّنْدُوقِ الأَحْمَر، وَالخَضْرَاءَ فِي الصُّنْدُوقِ الأَخْضَر!',
          promptText: 'شجعي طفلك على تصنيف الألوان في الصناديق.',
          successAudio: 'يَا سَلَام! رَتَّبْتَ كُلَّ الأَلْوَانِ بِدِقَّة!',
        },
        fr: {
          title: 'Le Tri des Couleurs',
          promptAudio: 'Mets les objets rouges dans la boîte rouge et les verts dans la boîte verte !',
          promptText: 'Encouragez l\'enfant à classer par couleur.',
          successAudio: 'Magnifique ! Toutes les couleurs sont bien rangées !',
        },
        en: {
          title: 'Color Sorting',
          promptAudio: 'Put red items in the red box and green items in the green box!',
          promptText: 'Encourage your child to sort items by color.',
          successAudio: 'Wonderful! All colors are sorted nicely!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎨',
        sortBins: [
          { id: 'red_bin', labelAsset: '🔴' },
          { id: 'green_bin', labelAsset: '🟢' },
        ],
        sortItems: [
          { id: 'apple', asset: '🍎', correctBinId: 'red_bin' },
          { id: 'strawberry', asset: '🍓', correctBinId: 'red_bin' },
          { id: 'leaf', asset: '🍃', correctBinId: 'green_bin' },
          { id: 'frog', asset: '🐸', correctBinId: 'green_bin' },
        ],
      },
    },
    {
      id: 'colors-pottery-bubble',
      domain: 'colors',
      targetValue: 5,
      stepNumber: 3,
      interactionType: 'creative_extra',
      i18n: {
        ar: {
          title: 'فَقَاعَاتُ الأَلْوَانِ السِّحْرِيَّةِ',
          promptAudio: 'فَرْقِعْ فَقَاعَاتِ الأَلْوَانِ السِّحْرِيَّةِ لِتُلَوِّنَ الفَخَّار!',
          promptText: 'المسي الفقاعات لتفرقعها.',
          successAudio: 'أَلْوَانٌ مُبْهِجَة! فَرَّقْتَ كُلَّ الفَقَاعَات!',
        },
        fr: {
          title: 'Bulles Magiques de Peinture',
          promptAudio: 'Éclate les bulles magiques pour peindre la poterie !',
          promptText: 'Touche les bulles pour les faire éclater.',
          successAudio: 'C\'est magique ! Tu as éclaté toutes les bulles !',
        },
        en: {
          title: 'Magic Color Bubbles',
          promptAudio: 'Pop the magic bubbles to paint the pottery!',
          promptText: 'Tap the bubbles to pop them.',
          successAudio: 'Magical! You popped all the color bubbles!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏺',
        bubbleCount: 5,
        bubbleAsset: '✨',
      },
    },
    {
      id: 'colors-memory-gems',
      domain: 'colors',
      targetValue: 'memory',
      stepNumber: 4,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'ذَاكِرَةُ الأَلْوَانِ وَالأَشْكَالِ',
          promptAudio: 'اِفْتَحِ البِطَاقَاتِ وَابْحَثْ عَنِ اللَّوْنَيْنِ المُتَشَابِهَيْن!',
          promptText: 'شجعي طفلك على مطابقة البطاقات.',
          successAudio: 'ذَاكِرَةٌ ذَهَبِيَّة! أَحْسَنْتَ يَا بَطَل!',
        },
        fr: {
          title: 'Mémoire des Couleurs',
          promptAudio: 'Retourne les cartes et trouve les paires de même couleur !',
          promptText: 'Aidez l\'enfant à mémoriser les cartes.',
          successAudio: 'Quelle mémoire formidable ! Félicitations !',
        },
        en: {
          title: 'Color Memory Game',
          promptAudio: 'Flip the cards and find the matching color pairs!',
          promptText: 'Encourage your child to find the pairs.',
          successAudio: 'Super memory! Great job!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '💎',
        memoryPairs: [
          { id: 'gem-red', asset: '🔴' },
          { id: 'gem-blue', asset: '🔵' },
        ],
      },
    },
  ],
};
