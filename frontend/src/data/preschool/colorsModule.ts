import { PreschoolModule } from './types';

// "أَلْوَانِي وَفُنُونِي" — Colors, Drawing & Graphism (Psychomotricity).
// Teaches 6 individual colors (أحمر، برتقالي، أصفر، أخضر، أزرق، بنفسجي) via tap_choice, each
// anchored to a familiar object, plus a Sahara color-trail for the fennec, a 3-color sort, magic-bubble
// painting, and a 3-pair color memory game — same depth pattern as the numbers/letters modules.
export const COLORS_MODULE: PreschoolModule = {
  id: 'preschool-colors',
  domain: 'colors',
  icon: '🎨',
  totalSteps: 10,
  titleI18n: {
    ar: 'أَلْوَانِي',
    fr: 'Mes couleurs',
    en: 'My colors',
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
          promptAudio: 'اِسْحَبِ الفَنَكَ عَلَى الأَلْوَانِ! أَحْمَر، بُرْتُقَالِي، أَصْفَر، أَخْضَر، ثُمَّ البَيْت!',
          promptText: 'اسحب الفنك من وسادة لونية إلى أخرى حتى يصل إلى بيته.',
          successAudio: 'وَصَلَ الفَنَكُ إِلَى بَيْتِهِ بِأَمَان! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Chemin du Fennec',
          promptAudio: 'Glisse le petit fennec de couleur en couleur : rouge, orange, jaune, vert, jusqu\'à sa maison !',
          promptText: 'Aidez l\'enfant à suivre les coussins de couleur jusqu\'à la maison.',
          successAudio: 'Le petit fennec est rentré bien au chaud ! Bravo !',
        },
        en: {
          title: 'The Fennec\'s Path',
          promptAudio: 'Drag the little fennec from color to color: red, orange, yellow, green, all the way home!',
          promptText: 'Help the child follow the colored pads to the house.',
          successAudio: 'The fennec made it home! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathToken: {
          startAsset: '🍓',
          endAsset: '🏡',
          travelerAsset: '🦊',
        },
        pathTheme: 'desert',
        pathStops: [
          { x: 16, y: 30, asset: '🍓', color: '#fecaca' },
          { x: 42, y: 20, asset: '🍊', color: '#fed7aa' },
          { x: 74, y: 34, asset: '🍋', color: '#fef08a' },
          { x: 82, y: 66, asset: '🌴', color: '#bbf7d0' },
          { x: 24, y: 78, asset: '🏡', color: '#fde68a' },
        ],
      },
    },
    {
      id: 'colors-red-strawberry',
      domain: 'colors',
      targetValue: 'red',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ الأَحْمَرُ',
          promptAudio: 'المِسِ اللَّوْنَ الأَحْمَرَ! مِثْلُ الفَرَاوْلَة!',
          promptText: 'ساعدي طفلك على لمس اللون الأحمر.',
          successAudio: 'أَحْسَنْت! هَذَا هُوَ اللَّوْنُ الأَحْمَرُ!',
        },
        fr: {
          title: 'La Couleur Rouge',
          promptAudio: 'Touche la couleur rouge ! Comme la fraise !',
          promptText: 'Aidez votre enfant à toucher le rouge.',
          successAudio: 'Bravo ! Voici la couleur rouge !',
        },
        en: {
          title: 'The Color Red',
          promptAudio: 'Touch the color red! Like the strawberry!',
          promptText: 'Help your child tap the color red.',
          successAudio: 'Well done! That is the color red!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍓',
        choices: [
          { id: 'red', asset: '🔴', isCorrect: true },
          { id: 'blue', asset: '🔵', isCorrect: false },
          { id: 'green', asset: '🟢', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-orange-fruit',
      domain: 'colors',
      targetValue: 'orange',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ البُرْتُقَالِيُّ',
          promptAudio: 'المِسِ اللَّوْنَ البُرْتُقَالِيَّ! مِثْلُ البُرْتُقَالَة!',
          promptText: 'ساعدي طفلك على لمس اللون البرتقالي.',
          successAudio: 'رَائِع! هَذَا هُوَ اللَّوْنُ البُرْتُقَالِيّ!',
        },
        fr: {
          title: 'La Couleur Orange',
          promptAudio: 'Touche la couleur orange ! Comme l\'orange !',
          promptText: 'Aidez votre enfant à toucher l\'orange.',
          successAudio: 'Super ! Voici la couleur orange !',
        },
        en: {
          title: 'The Color Orange',
          promptAudio: 'Touch the color orange! Like the orange fruit!',
          promptText: 'Help your child tap the color orange.',
          successAudio: 'Great! That is the color orange!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍊',
        choices: [
          { id: 'orange', asset: '🟠', isCorrect: true },
          { id: 'purple', asset: '🟣', isCorrect: false },
          { id: 'yellow', asset: '🟡', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-yellow-sun',
      domain: 'colors',
      targetValue: 'yellow',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ الأَصْفَرُ',
          promptAudio: 'المِسِ اللَّوْنَ الأَصْفَرَ! مِثْلُ الشَّمْسِ المُشْرِقَة!',
          promptText: 'ساعدي طفلك على لمس اللون الأصفر.',
          successAudio: 'مُمْتَاز! هَذَا هُوَ اللَّوْنُ الأَصْفَرُ!',
        },
        fr: {
          title: 'La Couleur Jaune',
          promptAudio: 'Touche la couleur jaune ! Comme le soleil brillant !',
          promptText: 'Aidez votre enfant à toucher le jaune.',
          successAudio: 'Parfait ! Voici la couleur jaune !',
        },
        en: {
          title: 'The Color Yellow',
          promptAudio: 'Touch the color yellow! Like the bright sun!',
          promptText: 'Help your child tap the color yellow.',
          successAudio: 'Perfect! That is the color yellow!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☀️',
        choices: [
          { id: 'yellow', asset: '🟡', isCorrect: true },
          { id: 'brown', asset: '🟤', isCorrect: false },
          { id: 'red', asset: '🔴', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-green-frog',
      domain: 'colors',
      targetValue: 'green',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ الأَخْضَرُ',
          promptAudio: 'المِسِ اللَّوْنَ الأَخْضَرَ! مِثْلُ الضِّفْدَعِ الصَّغِير!',
          promptText: 'ساعدي طفلك على لمس اللون الأخضر.',
          successAudio: 'أَحْسَنْت! هَذَا هُوَ اللَّوْنُ الأَخْضَرُ!',
        },
        fr: {
          title: 'La Couleur Verte',
          promptAudio: 'Touche la couleur verte ! Comme la petite grenouille !',
          promptText: 'Aidez votre enfant à toucher le vert.',
          successAudio: 'Bravo ! Voici la couleur verte !',
        },
        en: {
          title: 'The Color Green',
          promptAudio: 'Touch the color green! Like the little frog!',
          promptText: 'Help your child tap the color green.',
          successAudio: 'Well done! That is the color green!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐸',
        choices: [
          { id: 'green', asset: '🟢', isCorrect: true },
          { id: 'blue', asset: '🔵', isCorrect: false },
          { id: 'black', asset: '⚫', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-blue-sea',
      domain: 'colors',
      targetValue: 'blue',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ الأَزْرَقُ',
          promptAudio: 'المِسِ اللَّوْنَ الأَزْرَقَ! مِثْلُ البَحْرِ الوَاسِع!',
          promptText: 'ساعدي طفلك على لمس اللون الأزرق.',
          successAudio: 'رَائِع! هَذَا هُوَ اللَّوْنُ الأَزْرَقُ!',
        },
        fr: {
          title: 'La Couleur Bleue',
          promptAudio: 'Touche la couleur bleue ! Comme la grande mer !',
          promptText: 'Aidez votre enfant à toucher le bleu.',
          successAudio: 'Super ! Voici la couleur bleue !',
        },
        en: {
          title: 'The Color Blue',
          promptAudio: 'Touch the color blue! Like the big sea!',
          promptText: 'Help your child tap the color blue.',
          successAudio: 'Great! That is the color blue!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌊',
        choices: [
          { id: 'blue', asset: '🔵', isCorrect: true },
          { id: 'green', asset: '🟢', isCorrect: false },
          { id: 'purple', asset: '🟣', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-purple-grapes',
      domain: 'colors',
      targetValue: 'purple',
      stepNumber: 7,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اللَّوْنُ البَنَفْسَجِيُّ',
          promptAudio: 'المِسِ اللَّوْنَ البَنَفْسَجِيَّ! مِثْلُ عُنْقُودِ العِنَبِ!',
          promptText: 'ساعدي طفلك على لمس اللون البنفسجي.',
          successAudio: 'مُمْتَاز! هَذَا هُوَ اللَّوْنُ البَنَفْسَجِيّ!',
        },
        fr: {
          title: 'La Couleur Violette',
          promptAudio: 'Touche la couleur violette ! Comme la grappe de raisin !',
          promptText: 'Aidez votre enfant à toucher le violet.',
          successAudio: 'Parfait ! Voici la couleur violette !',
        },
        en: {
          title: 'The Color Purple',
          promptAudio: 'Touch the color purple! Like the grapes!',
          promptText: 'Help your child tap the color purple.',
          successAudio: 'Perfect! That is the color purple!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍇',
        choices: [
          { id: 'purple', asset: '🟣', isCorrect: true },
          { id: 'orange', asset: '🟠', isCorrect: false },
          { id: 'red', asset: '🔴', isCorrect: false },
        ],
      },
    },
    {
      id: 'colors-sort-red-green-blue',
      domain: 'colors',
      targetValue: 'sort_colors',
      stepNumber: 8,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَرْزُ الأَلْوَانِ الزَّاهِيَةِ',
          promptAudio: 'ضَعِ الأَشْيَاءَ الحَمْرَاءَ فِي الصُّنْدُوقِ الأَحْمَر، وَالخَضْرَاءَ فِي الأَخْضَر، وَالزَّرْقَاءَ فِي الأَزْرَق!',
          promptText: 'شجعي طفلك على تصنيف الألوان في الصناديق.',
          successAudio: 'يَا سَلَام! رَتَّبْتَ كُلَّ الأَلْوَانِ بِدِقَّة!',
        },
        fr: {
          title: 'Le Tri des Couleurs',
          promptAudio: 'Mets les objets rouges dans la boîte rouge, les verts dans la verte, et les bleus dans la bleue !',
          promptText: 'Encouragez l\'enfant à classer par couleur.',
          successAudio: 'Magnifique ! Toutes les couleurs sont bien rangées !',
        },
        en: {
          title: 'Color Sorting',
          promptAudio: 'Put red items in the red box, green in the green box, and blue in the blue box!',
          promptText: 'Encourage your child to sort items by color.',
          successAudio: 'Wonderful! All colors are sorted nicely!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎨',
        sortBins: [
          { id: 'red_bin', labelAsset: '🔴' },
          { id: 'green_bin', labelAsset: '🟢' },
          { id: 'blue_bin', labelAsset: '🔵' },
        ],
        sortItems: [
          { id: 'apple', asset: '🍎', correctBinId: 'red_bin' },
          { id: 'strawberry', asset: '🍓', correctBinId: 'red_bin' },
          { id: 'leaf', asset: '🍃', correctBinId: 'green_bin' },
          { id: 'frog', asset: '🐸', correctBinId: 'green_bin' },
          { id: 'wave', asset: '🌊', correctBinId: 'blue_bin' },
          { id: 'whale', asset: '🐳', correctBinId: 'blue_bin' },
        ],
      },
    },
    {
      id: 'colors-pottery-bubble',
      domain: 'colors',
      targetValue: 5,
      stepNumber: 9,
      interactionType: 'creative_extra',
      i18n: {
        ar: {
          title: 'فَقَاعَاتُ الأَلْوَانِ السِّحْرِيَّةِ',
          promptAudio: 'فَرْقِعْ فَقَاعَاتِ الأَلْوَانِ السِّحْرِيَّةِ لِتُلَوِّنَ الفَخَّار!',
          promptText: 'المسي الفقاعات لتفرقعها.',
          successAudio: 'أَلْوَانٌ مُبْهِجَة! فَرَّقْتَ كُلَّ الفَقَاعَات!',
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
      stepNumber: 10,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'ذَاكِرَةُ الأَلْوَانِ وَالأَشْكَالِ',
          promptAudio: 'اِفْتَحِ البِطَاقَاتِ وَابْحَثْ عَنِ اللَّوْنَيْنِ المُتَشَابِهَيْن!',
          promptText: 'شجعي طفلك على مطابقة البطاقات.',
          successAudio: 'ذَاكِرَةٌ ذَهَبِيَّة! أَحْسَنْتَ يَا بَطَل!',
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
          { id: 'gem-yellow', asset: '🟡' },
        ],
      },
    },
  ],
};
