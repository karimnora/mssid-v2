import { PreschoolModule } from './types';

// "عَقْلِي الصَّغِيرُ يُفَكِّرُ" — Early logic & spatial awakening.
// Big/small already existed (animalsModule's big/small sort) — this module adds the genuinely
// missing pieces: long/short, heavy/light, above/below, inside/outside, and simple repeating
// visual patterns (algorithmes), all built on existing interactionTypes (tap_choice / sorting).
export const LOGIC_SPATIAL_MODULE: PreschoolModule = {
  id: 'preschool-logic-spatial',
  domain: 'shapes',
  icon: '🧠',
  totalSteps: 6,
  titleI18n: {
    ar: 'عَقْلِي الصَّغِيرُ يُفَكِّرُ',
    fr: 'Mon Petit Esprit Réfléchit',
    en: 'My Little Mind Thinks',
  },
  activities: [
    {
      id: 'logic-long-short',
      domain: 'shapes',
      targetValue: 'long',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'طَوِيلٌ أَمْ قَصِير؟',
          promptAudio: 'أَيْنَ الحَيَّةُ الطَّوِيلَةُ؟ اِلْمِسْهَا!',
          promptText: 'ساعد طفلك على تمييز الطويل من القصير.',
          successAudio: 'أَحْسَنْت! هَذِهِ حَيَّةٌ طَوِيلَةٌ جِدّاً!',
        },
        fr: {
          title: 'Long ou Court ?',
          promptAudio: 'Où est le long serpent ? Touche-le !',
          promptText: 'Aidez l\'enfant à distinguer long et court.',
          successAudio: 'Bravo ! Ce serpent est très long !',
        },
        en: {
          title: 'Long or Short?',
          promptAudio: 'Where is the long snake? Tap it!',
          promptText: 'Help your child tell long from short.',
          successAudio: 'Well done! That snake is very long!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '📏',
        choices: [
          { id: 'long-snake', asset: '🐍', isCorrect: true },
          { id: 'short-worm', asset: '🐛', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-heavy-light',
      domain: 'shapes',
      targetValue: 'weight',
      stepNumber: 2,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'ثَقِيلٌ أَمْ خَفِيف؟',
          promptAudio: 'ضَعِ الأَشْيَاءَ الثَّقِيلَةَ مَعَ الفِيل، وَالأَشْيَاءَ الخَفِيفَةَ مَعَ الرِّيشَة!',
          promptText: 'ساعد طفلك على فرز الأشياء الثقيلة والخفيفة.',
          successAudio: 'رَائِع! مَيَّزْتَ الثَّقِيلَ مِنَ الخَفِيف!',
        },
        fr: {
          title: 'Lourd ou Léger ?',
          promptAudio: 'Mets les objets lourds avec l\'éléphant, et les légers avec la plume !',
          promptText: 'Aidez l\'enfant à trier les objets lourds et légers.',
          successAudio: 'Super ! Tu as bien reconnu le lourd et le léger !',
        },
        en: {
          title: 'Heavy or Light?',
          promptAudio: 'Put the heavy things with the elephant, and the light ones with the feather!',
          promptText: 'Help your child sort heavy and light objects.',
          successAudio: 'Great! You told heavy from light!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⚖️',
        sortBins: [
          { id: 'heavy', labelAsset: '🐘' },
          { id: 'light', labelAsset: '🪶' },
        ],
        sortItems: [
          { id: 'rock', asset: '🪨', correctBinId: 'heavy' },
          { id: 'anchor', asset: '⚓', correctBinId: 'heavy' },
          { id: 'balloon', asset: '🎈', correctBinId: 'light' },
          { id: 'butterfly', asset: '🦋', correctBinId: 'light' },
        ],
      },
    },
    {
      id: 'logic-above-below',
      domain: 'shapes',
      targetValue: 'above',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'فَوْقَ أَمْ تَحْت؟',
          promptAudio: 'أَيْنَ الطَّائِرَةُ الَّتِي تَطِيرُ فَوْقَ الغُيُوم؟ اِلْمِسْهَا!',
          promptText: 'ساعد طفلك على تمييز فوق وتحت.',
          successAudio: 'مُمْتَاز! الطَّائِرَةُ فَوْقَ الغُيُوم!',
        },
        fr: {
          title: 'Dessus ou Dessous ?',
          promptAudio: 'Où est l\'avion qui vole au-dessus des nuages ? Touche-le !',
          promptText: 'Aidez l\'enfant à distinguer dessus et dessous.',
          successAudio: 'Bravo ! L\'avion est au-dessus des nuages !',
        },
        en: {
          title: 'Above or Below?',
          promptAudio: 'Where is the airplane flying above the clouds? Tap it!',
          promptText: 'Help your child tell above from below.',
          successAudio: 'Well done! The plane is above the clouds!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☁️',
        choices: [
          { id: 'above-plane', asset: '✈️', isCorrect: true },
          { id: 'below-fish', asset: '🐠', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-inside-outside',
      domain: 'shapes',
      targetValue: 'inside',
      stepNumber: 4,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'دَاخِلٌ أَمْ خَارِج؟',
          promptAudio: 'ضَعِ الأَشْيَاءَ الَّتِي تَعِيشُ دَاخِلَ البَيْت، وَالَّتِي تَعِيشُ خَارِجَه!',
          promptText: 'ساعد طفلك على فرز الأشياء الداخلية والخارجية.',
          successAudio: 'رَائِع! عَرَفْتَ الدَّاخِلَ مِنَ الخَارِج!',
        },
        fr: {
          title: 'Dedans ou Dehors ?',
          promptAudio: 'Mets les objets qui vivent dedans la maison, et ceux qui vivent dehors !',
          promptText: 'Aidez l\'enfant à trier les objets d\'intérieur et d\'extérieur.',
          successAudio: 'Super ! Tu as reconnu dedans et dehors !',
        },
        en: {
          title: 'Inside or Outside?',
          promptAudio: 'Put the things that live inside the house, and the ones that live outside!',
          promptText: 'Help your child sort indoor and outdoor things.',
          successAudio: 'Great! You know inside from outside!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏠',
        sortBins: [
          { id: 'inside', labelAsset: '🛋️' },
          { id: 'outside', labelAsset: '🌳' },
        ],
        sortItems: [
          { id: 'bed', asset: '🛏️', correctBinId: 'inside' },
          { id: 'tv', asset: '📺', correctBinId: 'inside' },
          { id: 'tree', asset: '🌲', correctBinId: 'outside' },
          { id: 'sun', asset: '☀️', correctBinId: 'outside' },
        ],
      },
    },
    {
      id: 'logic-pattern-colors',
      domain: 'shapes',
      targetValue: 'pattern',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'مَاذَا يَأْتِي بَعْدَ ذَلِكَ؟',
          promptAudio: 'أَحْمَر، أَزْرَق، أَحْمَر، أَزْرَق... مَاذَا يَأْتِي بَعْدَ ذَلِك؟ اِلْمِسِ اللَّوْنَ الصَّحِيح!',
          promptText: 'ساعد طفلك على إكمال التسلسل المنطقي البسيط.',
          successAudio: 'عَبْقَرِيّ! أَكْمَلْتَ التَّسَلْسُلَ بِشَكْلٍ صَحِيح!',
        },
        fr: {
          title: 'Qu\'est-ce qui Vient Ensuite ?',
          promptAudio: 'Rouge, bleu, rouge, bleu... qu\'est-ce qui vient ensuite ? Touche la bonne couleur !',
          promptText: 'Aidez l\'enfant à compléter la suite logique simple.',
          successAudio: 'Génial ! Tu as complété la suite correctement !',
        },
        en: {
          title: 'What Comes Next?',
          promptAudio: 'Red, blue, red, blue... what comes next? Tap the right color!',
          promptText: 'Help your child complete the simple pattern.',
          successAudio: 'Genius! You completed the pattern correctly!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔴🔵🔴🔵❓',
        choices: [
          { id: 'red', asset: '🔴', isCorrect: true },
          { id: 'blue', asset: '🔵', isCorrect: false },
          { id: 'yellow', asset: '🟡', isCorrect: false },
        ],
      },
    },
    {
      id: 'logic-pattern-shapes',
      domain: 'shapes',
      targetValue: 'pattern2',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَكْمِلِ التَّسَلْسُلَ الثَّانِيَ',
          promptAudio: 'مُثَلَّث، نَجْمَة، مُثَلَّث، نَجْمَة... مَاذَا يَأْتِي بَعْدَ ذَلِك؟ اِلْمِسِ الشَّكْلَ الصَّحِيح!',
          promptText: 'ساعد طفلك على إكمال تسلسل الأشكال.',
          successAudio: 'رَائِع! عَقْلُكَ الصَّغِيرُ يُفَكِّرُ جَيِّداً!',
        },
        fr: {
          title: 'Complète la Deuxième Suite',
          promptAudio: 'Triangle, étoile, triangle, étoile... qu\'est-ce qui vient ensuite ? Touche la bonne forme !',
          promptText: 'Aidez l\'enfant à compléter la suite de formes.',
          successAudio: 'Super ! Ton petit esprit réfléchit très bien !',
        },
        en: {
          title: 'Complete the Second Pattern',
          promptAudio: 'Triangle, star, triangle, star... what comes next? Tap the right shape!',
          promptText: 'Help your child complete the shape pattern.',
          successAudio: 'Great! Your little mind thinks so well!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔺⭐🔺⭐❓',
        choices: [
          { id: 'triangle', asset: '🔺', isCorrect: true },
          { id: 'star', asset: '⭐', isCorrect: false },
          { id: 'heart', asset: '💖', isCorrect: false },
        ],
      },
    },
  ],
};
