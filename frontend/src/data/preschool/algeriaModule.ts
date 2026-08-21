import { PreschoolModule } from './types';

/**
 * "وَطَنِي الجَزَائِر" — Mon Algérie (Éducation Civique 0AP).
 * Covers: Algerian flag, national symbols, map shape, traditional food & culture.
 * Interaction mix: find_path, tap_choice ×2, sorting, connect_dots, memory_cards.
 */
export const ALGERIA_MODULE: PreschoolModule = {
  id: 'preschool-algeria',
  domain: 'values',
  icon: '🇩🇿',
  totalSteps: 8,
  titleI18n: {
    ar: 'وَطَنِي الجَزَائِر',
    fr: 'Mon Algérie',
    en: 'My Algeria',
  },
  activities: [
    {
      id: 'algeria-fennec-flag',
      domain: 'values',
      targetValue: 'flag',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الفَنَكُ يَرْفَعُ العَلَم',
          promptAudio: 'اِسْحَبِ الفَنَكَ لِيَرْفَعَ عَلَمَ الجَزَائِرِ الجَمِيل! أَخْضَرُ وَأَبْيَضُ وَهِلَالٌ وَنَجْمَة!',
          promptText: 'تحدث عن ألوان العلم الجزائري ومعناها.',
          successAudio: 'عَاشَتِ الجَزَائِر! عَلَمُنَا رَمْزُ فِخْرِنَا وَكَرَامَتِنَا!',
        },
        fr: {
          title: 'Le Fennec Lève le Drapeau',
          promptAudio: 'Fais glisser le fennec pour lever le beau drapeau algérien ! Vert, blanc, croissant et étoile !',
          promptText: 'Parlez des couleurs du drapeau algérien et leur signification.',
          successAudio: 'Vive l\'Algérie ! Notre drapeau est le symbole de notre fierté et dignité !',
        },
        en: {
          title: 'The Fennec Raises the Flag',
          promptAudio: 'Drag the fennec to raise the beautiful Algerian flag! Green, white, crescent and star!',
          promptText: 'Talk about the colors of the Algerian flag and their meaning.',
          successAudio: 'Long live Algeria! Our flag is the symbol of our pride and dignity!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathToken: { startAsset: '🦊', endAsset: '🇩🇿', travelerAsset: '🦊' },
      },
    },
    {
      id: 'algeria-flag-color',
      domain: 'values',
      targetValue: 'flag-colors',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَلْوَانُ عَلَمِ الجَزَائِر',
          promptAudio: 'اِلْمَسِ العَلَمَ الجَزَائِرِيَّ! أَخْضَرُ يَرْمُزُ لِلأَمَلِ وَأَبْيَضُ يَرْمُزُ لِلسَّلَام!',
          promptText: 'عرّف طفلك على علم الجزائر.',
          successAudio: 'أَحْسَنْت! عَلَمُنَا فَخْرُنَا وَرَمْزُ وَطَنِنَا الحَبِيب!',
        },
        fr: {
          title: 'Les Couleurs du Drapeau Algérien',
          promptAudio: 'Touche le drapeau algérien ! Le vert symbolise l\'espoir et le blanc symbolise la paix !',
          promptText: 'Faites découvrir le drapeau algérien à votre enfant.',
          successAudio: 'Super ! Notre drapeau est notre fierté et le symbole de notre chère patrie !',
        },
        en: {
          title: 'Colors of the Algerian Flag',
          promptAudio: 'Touch the Algerian flag! Green symbolizes hope and white symbolizes peace!',
          promptText: 'Introduce your child to the Algerian flag.',
          successAudio: 'Well done! Our flag is our pride and the symbol of our dear homeland!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🇩🇿',
        choices: [
          { id: 'dz-flag',     asset: '🇩🇿', isCorrect: true },
          { id: 'other-flag1', asset: '🇫🇷', isCorrect: false },
          { id: 'other-flag2', asset: '🇹🇳', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-symbols',
      domain: 'values',
      targetValue: 'national-symbols',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'رُمُوزُ الجَزَائِر',
          promptAudio: 'اِلْمَسِ الهِلَالَ وَالنَّجْمَةَ! هُمَا رَمْزَانِ عَلَى عَلَمِ الجَزَائِرِ الحَبِيب!',
          promptText: 'تحدث عن رموز الجزائر الوطنية.',
          successAudio: 'مُمْتَاز! الهِلَالُ وَالنَّجْمَةُ رَمْزَانِ لِوَطَنِنَا الجَزَائِر!',
        },
        fr: {
          title: 'Les Symboles de l\'Algérie',
          promptAudio: 'Touche le croissant et l\'étoile ! Ils sont deux symboles sur le beau drapeau algérien !',
          promptText: 'Parlez des symboles nationaux de l\'Algérie.',
          successAudio: 'Excellent ! Le croissant et l\'étoile sont les symboles de notre Algérie bien-aimée !',
        },
        en: {
          title: 'Symbols of Algeria',
          promptAudio: 'Touch the crescent and the star! They are two symbols on the beautiful Algerian flag!',
          promptText: 'Talk about Algeria\'s national symbols.',
          successAudio: 'Excellent! The crescent and star are symbols of our beloved Algeria!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '☪️',
        choices: [
          { id: 'crescent-star', asset: '☪️', isCorrect: true },
          { id: 'cross',         asset: '✝️', isCorrect: false },
          { id: 'star-only',     asset: '⭐', isCorrect: false },
        ],
      },
    },
    {
      id: 'algeria-food-sorting',
      domain: 'values',
      targetValue: 'algerian-food',
      stepNumber: 4,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'الأَكْلَاتُ الجَزَائِرِيَّة',
          promptAudio: 'صَنِّفِ الأَطْعِمَةَ! الكُسْكُسُ وَالبِطِيخُ وَالتَّمْرُ مِنَ الجَزَائِرِ الحَبِيبَة!',
          promptText: 'تحدث عن الأكلات التقليدية الجزائرية.',
          successAudio: 'وَاوَ! أَنْتَ تَعْرِفُ أَكْلَاتِنَا الجَزَائِرِيَّةَ الشَّهِيَّة!',
        },
        fr: {
          title: 'Les Plats Algériens',
          promptAudio: 'Classe les aliments ! Le couscous, la pastèque et les dattes viennent de notre chère Algérie !',
          promptText: 'Parlez des plats traditionnels algériens.',
          successAudio: 'Wow ! Tu connais nos délicieux plats algériens !',
        },
        en: {
          title: 'Algerian Foods',
          promptAudio: 'Sort the foods! Couscous, watermelon and dates come from our beloved Algeria!',
          promptText: 'Talk about traditional Algerian dishes.',
          successAudio: 'Wow! You know our delicious Algerian dishes!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍲',
        sortBins: [
          { id: 'algerian',     labelAsset: '🇩🇿' },
          { id: 'non-algerian', labelAsset: '🌍'  },
        ],
        sortItems: [
          { id: 'couscous', asset: '🍲', correctBinId: 'algerian'     },
          { id: 'dates',    asset: '🌴', correctBinId: 'algerian'     },
          { id: 'watermel', asset: '🍉', correctBinId: 'algerian'     },
          { id: 'figs',     asset: '🌰', correctBinId: 'algerian'     },
          { id: 'sushi',    asset: '🍣', correctBinId: 'non-algerian' },
          { id: 'pizza',    asset: '🍕', correctBinId: 'non-algerian' },
        ],
      },
    },
    {
      id: 'algeria-connect',
      domain: 'values',
      targetValue: 'algeria-places',
      stepNumber: 5,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطْ بِلَادَنَا بِرَمْزِهَا',
          promptAudio: 'اِرْبِطِ الرَّمْزَ بِالمَنْطِقَة! الصَّحْرَاءُ مَعَ الجَمَلِ وَالجِبَالُ مَعَ الثَّلْج!',
          promptText: 'عرّف طفلك على تنوع المناطق الجزائرية.',
          successAudio: 'رَائِعٌ! الجَزَائِرُ بَلَدٌ جَمِيلٌ فِيهِ صَحَرَاءُ وَجِبَالٌ وَبَحْر!',
        },
        fr: {
          title: 'Relie les Régions à leurs Symboles',
          promptAudio: 'Relie le symbole à sa région ! Le désert avec le chameau et les montagnes avec la neige !',
          promptText: 'Faites découvrir la diversité des régions algériennes à votre enfant.',
          successAudio: 'Magnifique ! L\'Algérie est un beau pays avec désert, montagnes et mer !',
        },
        en: {
          title: 'Match Regions to Their Symbols',
          promptAudio: 'Match the symbol to its region! The desert with the camel and the mountains with snow!',
          promptText: 'Introduce your child to the diversity of Algerian regions.',
          successAudio: 'Wonderful! Algeria is a beautiful country with desert, mountains and sea!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🗺️',
        connectPairs: [
          { id: 'sahara-camel',   leftAsset: '🏜️', rightAsset: '🐪' },
          { id: 'mountain-snow',  leftAsset: '⛰️', rightAsset: '❄️' },
          { id: 'sea-fish',       leftAsset: '🌊', rightAsset: '🐟' },
          { id: 'algiers-city',   leftAsset: '🏛️', rightAsset: '🕌' },
        ],
      },
    },
    {
      id: 'algeria-memory',
      domain: 'values',
      targetValue: 'algeria-memory',
      stepNumber: 6,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'رُمُوزُ الجَزَائِر',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ وَاجِدِ الأَزْوَاجَ المُتَشَابِهَة! رُمُوزُ بِلَادِنَا الحَبِيبَة!',
          promptText: 'شجّع طفلك على التعرف على رموز بلاده.',
          successAudio: 'بَرَاوَ! أَنْتَ تَعْرِفُ رُمُوزَ وَطَنِكَ الجَمِيل!',
        },
        fr: {
          title: 'Mémo des Symboles d\'Algérie',
          promptAudio: 'Retourne les cartes et trouve les paires ! Les symboles de notre chère patrie !',
          promptText: 'Encouragez l\'enfant à reconnaître les symboles de son pays.',
          successAudio: 'Bravo ! Tu connais les symboles de ta belle patrie !',
        },
        en: {
          title: 'Algeria Symbols Memory Game',
          promptAudio: 'Flip the cards and find the matching pairs! The symbols of our dear homeland!',
          promptText: 'Encourage the child to recognize the symbols of their country.',
          successAudio: 'Bravo! You know the symbols of your beautiful homeland!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-flag',    asset: '🇩🇿' },
          { id: 'mem-camel',   asset: '🐪'  },
          { id: 'mem-crescent',asset: '☪️'  },
          { id: 'mem-palm',    asset: '🌴'  },
        ],
      },
    },
    // ── Activity 7 ─ Mémoire des monuments algériens ──────────────────────────
    {
      id: 'algeria-monuments-memory',
      domain: 'values',
      targetValue: 'algeria-monuments',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'مَعَالِمُ الجَزَائِر الشَّامِخَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ وَاجِدِ الأَزْوَاجَ! مَعَالِمُ بِلَادِنَا الجَمِيلَة!',
          promptText: 'عرّف طفلك على المعالم التاريخية والطبيعية الجزائرية.',
          successAudio: 'عَظِيمٌ! أَنْتَ تَعْرِفُ مَعَالِمَ الجَزَائِرِ الرَّائِعَة!',
        },
        fr: {
          title: 'Monuments d\'Algérie',
          promptAudio: 'Retourne les cartes et trouve les paires ! Les monuments de notre belle Algérie !',
          promptText: 'Faites découvrir les monuments historiques et naturels d\'Algérie à votre enfant.',
          successAudio: 'Formidable ! Tu connais les merveilleux monuments d\'Algérie !',
        },
        en: {
          title: 'Algeria\'s Landmarks',
          promptAudio: 'Flip the cards and find the matching pairs! The landmarks of our beautiful Algeria!',
          promptText: 'Introduce your child to Algeria\'s historical and natural landmarks.',
          successAudio: 'Wonderful! You know the amazing landmarks of Algeria!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏛️',
        memoryPairs: [
          { id: 'mem-mosque',  asset: '🕌' },
          { id: 'mem-sahara',  asset: '🏜️' },
          { id: 'mem-mtn',     asset: '⛰️' },
          { id: 'mem-sea',     asset: '🌊' },
          { id: 'mem-fennec',  asset: '🦊' },
          { id: 'mem-oasis',   asset: '🌴' },
        ],
      },
    },
    // ── Activity 8 ─ Tri des animaux par habitat ──────────────────────────────
    {
      id: 'algeria-habitat-sort',
      domain: 'values',
      targetValue: 'algeria-habitats',
      stepNumber: 8,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أَيْنَ تَعِيشُ هَذِهِ الحَيَوَانَات؟',
          promptAudio: 'صَنِّفِ الحَيَوَانَاتِ! مَنْ يَعِيشُ فِي الصَّحْرَاءِ وَمَنْ يَعِيشُ فِي البَحْر؟',
          promptText: 'ناقش مع طفلك بيئات الحيوانات الجزائرية.',
          successAudio: 'رَائِعٌ! أَنْتَ تَعْرِفُ أَيْنَ تَعِيشُ حَيَوَانَاتُ الجَزَائِر!',
        },
        fr: {
          title: 'Où vivent ces Animaux ?',
          promptAudio: 'Classe les animaux ! Qui vit dans le désert et qui vit dans la mer ?',
          promptText: 'Discutez avec votre enfant des habitats des animaux algériens.',
          successAudio: 'Magnifique ! Tu sais où vivent les animaux d\'Algérie !',
        },
        en: {
          title: 'Where Do These Animals Live?',
          promptAudio: 'Sort the animals! Who lives in the desert and who lives in the sea?',
          promptText: 'Discuss with your child the habitats of Algerian animals.',
          successAudio: 'Wonderful! You know where Algeria\'s animals live!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        sortBins: [
          { id: 'sahara_bin', labelAsset: '🏜️' },
          { id: 'sea_bin',    labelAsset: '🌊' },
        ],
        sortItems: [
          { id: 'fennec',    asset: '🦊', correctBinId: 'sahara_bin' },
          { id: 'camel',     asset: '🐪', correctBinId: 'sahara_bin' },
          { id: 'scorpion',  asset: '🦂', correctBinId: 'sahara_bin' },
          { id: 'fish',      asset: '🐟', correctBinId: 'sea_bin'    },
          { id: 'dolphin',   asset: '🐬', correctBinId: 'sea_bin'    },
          { id: 'crab',      asset: '🦀', correctBinId: 'sea_bin'    },
        ],
      },
    },
  ],
};
