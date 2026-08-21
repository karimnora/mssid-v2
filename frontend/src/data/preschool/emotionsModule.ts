/**
 * emotionsModule.ts
 * Module "Nos Émotions" — développement socio-émotionnel pour 3-5 ans.
 * 8 activités pour reconnaître, nommer et comprendre les émotions fondamentales.
 */
import { PreschoolModule } from './types';

export const EMOTIONS_MODULE: PreschoolModule = {
  id: 'preschool-emotions',
  domain: 'values',
  icon: '😊',
  totalSteps: 8,
  titleI18n: {
    ar: 'مَشَاعِرُنَا وَأَحَاسِيسُنَا',
    fr: 'Nos Émotions',
    en: 'Our Feelings',
  },
  activities: [
    // ── 1. Trouver le visage heureux ─────────────────────────────────────────
    {
      id: 'emotion-happy',
      domain: 'values',
      targetValue: '😊',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'ابْحَثْ عَنِ الفَرِح',
          promptAudio: 'أَيُّ وَجْهٍ يَبْدُو سَعِيداً وَفَرِحاً؟ اِلْمَسِ الوَجْهَ المَبْسُوط!',
          successAudio: 'أَحْسَنْتَ! هَذَا هُوَ الوَجْهُ الفَرِح! الفَرَحُ جَمِيل!',
        },
        fr: {
          title: 'Trouve le visage heureux',
          promptAudio: 'Quel visage est heureux ? Touche le visage content !',
          successAudio: 'Bravo ! C\'est le visage heureux ! Le bonheur c\'est beau !',
        },
        en: {
          title: 'Find the happy face',
          promptAudio: 'Which face is happy? Tap the happy face!',
          successAudio: 'Well done! That\'s the happy face! Happiness is beautiful!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😊',
        choices: [
          { id: 'happy',  asset: '😊', isCorrect: true  },
          { id: 'sad',    asset: '😢', isCorrect: false },
          { id: 'angry',  asset: '😠', isCorrect: false },
        ],
      },
    },
    // ── 2. Trouver le visage triste ──────────────────────────────────────────
    {
      id: 'emotion-sad',
      domain: 'values',
      targetValue: '😢',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'ابْحَثْ عَنِ الحَزِين',
          promptAudio: 'أَيُّ وَجْهٍ يَبْدُو حَزِيناً؟ اِلْمَسِ الوَجْهَ الحَزِين!',
          successAudio: 'صَحِيح! هَذَا الوَجْهُ الحَزِين. حِينَ تَحْزَنُ نُعَانِقُكَ!',
        },
        fr: {
          title: 'Trouve le visage triste',
          promptAudio: 'Quel visage est triste ? Touche le visage qui pleure !',
          successAudio: 'Correct ! C\'est le visage triste. Quand tu es triste, on te fait un câlin !',
        },
        en: {
          title: 'Find the sad face',
          promptAudio: 'Which face is sad? Tap the sad crying face!',
          successAudio: 'Correct! That\'s the sad face. When you\'re sad, we give you a hug!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😢',
        choices: [
          { id: 'sad',      asset: '😢', isCorrect: true  },
          { id: 'happy',    asset: '😊', isCorrect: false },
          { id: 'surprised',asset: '😮', isCorrect: false },
        ],
      },
    },
    // ── 3. Trouver le visage en colère ───────────────────────────────────────
    {
      id: 'emotion-angry',
      domain: 'values',
      targetValue: '😠',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'ابْحَثْ عَنِ الغَاضِب',
          promptAudio: 'أَيُّ وَجْهٍ يَبْدُو غَاضِباً؟ اِلْمَسِ الوَجْهَ الغَاضِب!',
          successAudio: 'مُمْتَاز! هَذَا الوَجْهُ الغَاضِب. الغَضَبُ يَمُرُّ وَنَعُودُ لِلضَّحِك!',
        },
        fr: {
          title: 'Trouve le visage en colère',
          promptAudio: 'Quel visage est en colère ? Touche le visage fâché !',
          successAudio: 'Super ! C\'est le visage en colère. La colère passe et on rit bientôt !',
        },
        en: {
          title: 'Find the angry face',
          promptAudio: 'Which face is angry? Tap the angry face!',
          successAudio: 'Super! That\'s the angry face. Anger passes and we smile again!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😠',
        choices: [
          { id: 'angry',    asset: '😠', isCorrect: true  },
          { id: 'happy',    asset: '😊', isCorrect: false },
          { id: 'scared',   asset: '😨', isCorrect: false },
        ],
      },
    },
    // ── 4. Trouver le visage surpris ─────────────────────────────────────────
    {
      id: 'emotion-surprised',
      domain: 'values',
      targetValue: '😲',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'ابْحَثْ عَنِ المُتَفَاجِئ',
          promptAudio: 'أَيُّ وَجْهٍ يَبْدُو مُتَفَاجِئاً مَذْهُولاً؟ اِلْمَسِ الوَجْهَ المُتَفَاجِئ!',
          successAudio: 'رَائِعٌ! هَذَا الوَجْهُ المُتَفَاجِئ! مَذْهُول!',
        },
        fr: {
          title: 'Trouve le visage surpris',
          promptAudio: 'Quel visage est surpris ? Touche le visage étonné !',
          successAudio: 'Magnifique ! C\'est le visage surpris ! Quelle surprise !',
        },
        en: {
          title: 'Find the surprised face',
          promptAudio: 'Which face is surprised? Tap the surprised face!',
          successAudio: 'Amazing! That\'s the surprised face! What a surprise!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😲',
        choices: [
          { id: 'surprised', asset: '😲', isCorrect: true  },
          { id: 'happy',     asset: '😊', isCorrect: false },
          { id: 'sad',       asset: '😢', isCorrect: false },
        ],
      },
    },
    // ── 5. Tri : bonnes vs mauvaises situations ──────────────────────────────
    {
      id: 'emotion-sort-context',
      domain: 'values',
      targetValue: 'emotions-sort',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَرِّقْ بَيْنَ الفَرَح وَالحُزْن',
          promptAudio: 'اِفْرِزِ الصُّوَرَ! الأَشْيَاءُ السَّعِيدَةُ لِلوَجْهِ الفَرِح، وَالحَزِينَةُ لِلوَجْهِ الحَزِين!',
          successAudio: 'أَحْسَنْتَ! عَرَفْتَ الفَرَحَ وَالحُزْن!',
        },
        fr: {
          title: 'Trie joie et tristesse',
          promptAudio: 'Trie les images ! Les choses joyeuses vont avec le visage heureux, les tristes avec le visage triste !',
          successAudio: 'Excellent ! Tu sais distinguer la joie et la tristesse !',
        },
        en: {
          title: 'Sort joy and sadness',
          promptAudio: 'Sort the pictures! Happy things go with the happy face, sad ones with the sad face!',
          successAudio: 'Excellent! You can tell joy from sadness!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎭',
        sortBins: [
          { id: 'happy_bin', labelAsset: '😊' },
          { id: 'sad_bin',   labelAsset: '😢' },
        ],
        sortItems: [
          { id: 'cake',    asset: '🎂', correctBinId: 'happy_bin' },
          { id: 'balloon', asset: '🎈', correctBinId: 'happy_bin' },
          { id: 'gift',    asset: '🎁', correctBinId: 'happy_bin' },
          { id: 'rain',    asset: '🌧️', correctBinId: 'sad_bin'   },
          { id: 'broken',  asset: '💔', correctBinId: 'sad_bin'   },
          { id: 'angry_f', asset: '😠', correctBinId: 'sad_bin'   },
        ],
      },
    },
    // ── 6. Memory des émotions ───────────────────────────────────────────────
    {
      id: 'emotion-memory',
      domain: 'values',
      targetValue: 'emotion-pairs',
      stepNumber: 6,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'ذَاكِرَةُ المَشَاعِر',
          promptAudio: 'اِبْحَثْ عَنِ الأَزْوَاجِ المُتَشَابِهَة! اقْلِبِ البِطَاقَتَيْنِ المُتَطَابِقَتَيْن!',
          successAudio: 'مُمْتَاز! وَجَدْتَ كُلَّ الأَزْوَاج! ذَاكِرَتُكَ قَوِيَّة!',
        },
        fr: {
          title: 'Mémoire des Émotions',
          promptAudio: 'Trouve les paires ! Retourne les deux cartes identiques !',
          successAudio: 'Parfait ! Tu as trouvé toutes les paires ! Tu as une super mémoire !',
        },
        en: {
          title: 'Emotions Memory',
          promptAudio: 'Find the pairs! Flip the two matching cards!',
          successAudio: 'Perfect! You found all the pairs! Your memory is super!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎭',
        memoryPairs: [
          { id: 'mem-happy',     asset: '😊' },
          { id: 'mem-sad',       asset: '😢' },
          { id: 'mem-angry',     asset: '😠' },
          { id: 'mem-surprised', asset: '😲' },
          { id: 'mem-scared',    asset: '😨' },
          { id: 'mem-love',      asset: '🥰' },
        ],
      },
    },
    // ── 7. Séquence d'émotions ───────────────────────────────────────────────
    {
      id: 'emotion-sequence',
      domain: 'values',
      targetValue: 'happy-sad-happy-sad',
      stepNumber: 7,
      interactionType: 'sequence',
      i18n: {
        ar: {
          title: 'مَا الشُّعُورُ التَّالِي؟',
          promptAudio: 'فَرِح، حَزِين، فَرِح، حَزِين... مَا الَّذِي يَأْتِي بَعْدَ ذَلِك؟',
          successAudio: 'أَحْسَنْتَ! الفَرَحُ يَأْتِي بَعْدَ الحُزْن! اَلْأُمُورُ تَتَحَسَّن دَائِماً!',
        },
        fr: {
          title: 'Quel sentiment vient ensuite ?',
          promptAudio: 'Heureux, triste, heureux, triste... Quel sentiment vient ensuite ?',
          successAudio: 'Bravo ! Le bonheur vient après la tristesse ! Ça va toujours mieux !',
        },
        en: {
          title: 'What feeling comes next?',
          promptAudio: 'Happy, sad, happy, sad... What feeling comes next?',
          successAudio: 'Well done! Happiness comes after sadness! Things always get better!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎭',
        sequencePattern: ['😊', '😢', '😊', '😢'],
        choices: [
          { id: 'happy',  asset: '😊', isCorrect: true  },
          { id: 'angry',  asset: '😠', isCorrect: false },
          { id: 'scared', asset: '😨', isCorrect: false },
        ],
      },
    },
    // ── 8. Comment te sens-tu ? (contextuel) ────────────────────────────────
    {
      id: 'emotion-context-icecream',
      domain: 'values',
      targetValue: 'ice-cream-happy',
      stepNumber: 8,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'كَيْفَ يَشْعُرُ دِيدُو؟',
          promptAudio: 'أَعْطَتِ الأُمُّ دِيدُو آيْس كْرِيم! كَيْفَ يَشْعُرُ دِيدُو الآن؟',
          successAudio: 'بِالطَّبْع! دِيدُو فَرِحٌ جِدَّاً بِالآيْس كْرِيم! أَنَا أَيْضاً!',
        },
        fr: {
          title: 'Comment se sent Dido ?',
          promptAudio: 'Maman donne une glace à Dido ! Comment se sent Dido maintenant ?',
          successAudio: 'Bien sûr ! Dido est très heureux avec sa glace ! Moi aussi j\'adore la glace !',
        },
        en: {
          title: 'How does Dido feel?',
          promptAudio: 'Mom gives Dido an ice cream! How does Dido feel now?',
          successAudio: 'Of course! Dido is very happy with his ice cream! I love ice cream too!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍦',
        choices: [
          { id: 'happy',  asset: '😊', isCorrect: true  },
          { id: 'sad',    asset: '😢', isCorrect: false },
          { id: 'angry',  asset: '😠', isCorrect: false },
        ],
      },
    },
  ],
};
