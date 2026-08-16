import { PreschoolModule } from './types';

// "سَفِينَةُ الحُرُوفِ" — Letters and Vocabulary (Arabophone & Multi-language éveil).
// Teaches 8 letters (أ ب ت ث ج د س م) individually via tap_choice (recognition) and trace
// (finger-writing), each anchored to a concrete, familiar word/animal so a non-reading child has a
// picture hook rather than an abstract glyph. Closes with a fruit-basket sort, an expanded
// letter-to-picture matching game, and a letter memory game — same depth pattern as the numbers module.
export const LETTERS_MODULE: PreschoolModule = {
  id: 'preschool-letters',
  domain: 'letters',
  icon: '🔤',
  totalSteps: 14,
  titleI18n: {
    ar: 'سَفِينَةُ الحُرُوفِ وَالكَلِمَاتِ',
    fr: 'Le Bateau des Lettres & Mots',
    en: 'Letters & Words Boat',
  },
  activities: [
    {
      id: 'letters-alif-rabbit',
      domain: 'letters',
      targetValue: 'أ',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ الأَلِفِ (أ)',
          promptAudio: 'اِلْمِسْ حَرْفَ الأَلِفِ! أَـ.. أَرْنَب!',
          promptText: 'ساعد طفلك على لمس حرف الألف (أ).',
          successAudio: 'مُمْتَاز! أَـ.. أَرْنَبٌ لَطِيف!',
        },
        fr: {
          title: 'La Pêche à la Lettre A',
          promptAudio: 'Touche la lettre A ! A comme lApin !',
          promptText: 'Aidez votre enfant à toucher la lettre A.',
          successAudio: 'Bravo ! Tu as trouvé la lettre A !',
        },
        en: {
          title: 'Catch the Letter A',
          promptAudio: 'Touch the letter A! A for rAbbit!',
          promptText: 'Help your child tap the letter A.',
          successAudio: 'Well done! That is the letter A!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐰',
        choices: [
          { id: 'alif', asset: 'أ', isCorrect: true },
          { id: 'lam', asset: 'ل', isCorrect: false },
          { id: 'seen', asset: 'س', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-boat-alif-baa',
      domain: 'letters',
      targetValue: 'ب',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ البَاءِ (ب)',
          promptAudio: 'اِلْمِسْ حَرْفَ البَاءِ! بَـ.. بَطَّة!',
          promptText: 'ساعد طفلك على لمس حرف الباء (ب).',
          successAudio: 'مُمْتَاز! بَـ.. بَطَّة جَمِيلَة!',
        },
        fr: {
          title: 'La Pêche à la Lettre B',
          promptAudio: 'Touche la lettre B ! B comme cana*rd (Batta) !',
          promptText: 'Aidez votre enfant à toucher la lettre B.',
          successAudio: 'Bravo ! Tu as trouvé la lettre B !',
        },
        en: {
          title: 'Catch the Letter B',
          promptAudio: 'Touch the letter B! B for duck (Batta)!',
          promptText: 'Help your child tap the letter B.',
          successAudio: 'Well done! That is the letter B!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦆',
        choices: [
          { id: 'b', asset: 'ب', isCorrect: true },
          { id: 'a', asset: 'أ', isCorrect: false },
          { id: 't', asset: 'ت', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-trace-alif',
      domain: 'letters',
      targetValue: 'أ',
      stepNumber: 3,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'تَتَبَّعْ حَرْفَ الأَلِفِ (أ)',
          promptAudio: 'اِرْسُمْ حَرْفَ الأَلِفِ بِإِصْبَعِكَ الجَمِيل! مِنْ أَعْلَى إِلَى أَسْفَل!',
          promptText: 'شجع طفلك على تمرير إصبعه فوق حرف الألف.',
          successAudio: 'خَطٌّ رَائِع! كَتَبْتَ حَرْفَ الأَلِف!',
        },
        fr: {
          title: 'Trace la Lettre A',
          promptAudio: 'Trace la lettre A avec ton doigt ! Du haut vers le bas !',
          promptText: 'Encouragez l\'enfant à tracer la lettre.',
          successAudio: 'Très beau tracé ! Tu as réussi la lettre A !',
        },
        en: {
          title: 'Trace the Letter A',
          promptAudio: 'Trace the letter A with your finger! Top to bottom!',
          promptText: 'Encourage your child to trace the letter.',
          successAudio: 'Great trace! You wrote the letter A!',
        },
      },
      visualAssets: {
        mainSvgOrImage: 'أ',
      },
    },
    {
      id: 'letters-taa-apple',
      domain: 'letters',
      targetValue: 'ت',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ التَّاءِ (ت)',
          promptAudio: 'اِلْمِسْ حَرْفَ التَّاءِ! تُـ.. تُفَّاحَة!',
          promptText: 'ساعد طفلك على لمس حرف التاء (ت).',
          successAudio: 'رَائِع! تُـ.. تُفَّاحَةٌ حَمْرَاء!',
        },
        fr: {
          title: 'La Pêche à la Lettre T',
          promptAudio: 'Touche la lettre T ! T comme pomme (Touffah) !',
          promptText: 'Aidez votre enfant à toucher la lettre T.',
          successAudio: 'Bravo ! Tu as trouvé la lettre T !',
        },
        en: {
          title: 'Catch the Letter T',
          promptAudio: 'Touch the letter T! T for apple (Touffah)!',
          promptText: 'Help your child tap the letter T.',
          successAudio: 'Well done! That is the letter T!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        choices: [
          { id: 't', asset: 'ت', isCorrect: true },
          { id: 'th', asset: 'ث', isCorrect: false },
          { id: 'b', asset: 'ب', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-thaa-fox',
      domain: 'letters',
      targetValue: 'ث',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ الثَّاءِ (ث)',
          promptAudio: 'اِلْمِسْ حَرْفَ الثَّاءِ! ثَـ.. ثَعْلَب!',
          promptText: 'ساعد طفلك على لمس حرف الثاء (ث).',
          successAudio: 'مُمْتَاز! ثَـ.. ثَعْلَبٌ مَاكِر!',
        },
        fr: {
          title: 'La Pêche à la Lettre Th',
          promptAudio: 'Touche la lettre Th ! Th comme renard (Thaalab) !',
          promptText: 'Aidez votre enfant à toucher la lettre Th.',
          successAudio: 'Bravo ! Tu as trouvé la lettre Th !',
        },
        en: {
          title: 'Catch the Letter Th',
          promptAudio: 'Touch the letter Th! Th for fox (Thaalab)!',
          promptText: 'Help your child tap the letter Th.',
          successAudio: 'Well done! That is the letter Th!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        choices: [
          { id: 'th', asset: 'ث', isCorrect: true },
          { id: 't', asset: 'ت', isCorrect: false },
          { id: 'n', asset: 'ن', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-jeem-camel',
      domain: 'letters',
      targetValue: 'ج',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ الجِيمِ (ج)',
          promptAudio: 'اِلْمِسْ حَرْفَ الجِيمِ! جَـ.. جَمَل!',
          promptText: 'ساعد طفلك على لمس حرف الجيم (ج).',
          successAudio: 'رَائِع! جَـ.. جَمَلٌ قَوِيّ!',
        },
        fr: {
          title: 'La Pêche à la Lettre J',
          promptAudio: 'Touche la lettre J ! J comme chameau (Jamal) !',
          promptText: 'Aidez votre enfant à toucher la lettre J.',
          successAudio: 'Bravo ! Tu as trouvé la lettre J !',
        },
        en: {
          title: 'Catch the Letter J',
          promptAudio: 'Touch the letter J! J for camel (Jamal)!',
          promptText: 'Help your child tap the letter J.',
          successAudio: 'Well done! That is the letter J!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐪',
        choices: [
          { id: 'j', asset: 'ج', isCorrect: true },
          { id: 'h', asset: 'ح', isCorrect: false },
          { id: 'kh', asset: 'خ', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-trace-jeem',
      domain: 'letters',
      targetValue: 'ج',
      stepNumber: 7,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'تَتَبَّعْ حَرْفَ الجِيمِ (ج)',
          promptAudio: 'اِرْسُمْ حَرْفَ الجِيمِ بِإِصْبَعِكَ! اُنْزِلْ لِلْأَسْفَلِ ثُمَّ لُفَّ!',
          promptText: 'شجع طفلك على تمرير إصبعه فوق حرف الجيم.',
          successAudio: 'خَطٌّ رَائِع! كَتَبْتَ حَرْفَ الجِيم!',
        },
        fr: {
          title: 'Trace la Lettre J',
          promptAudio: 'Trace la lettre J avec ton doigt ! Descends puis courbe !',
          promptText: 'Encouragez l\'enfant à tracer la lettre.',
          successAudio: 'Très beau tracé ! Tu as réussi la lettre J !',
        },
        en: {
          title: 'Trace the Letter J',
          promptAudio: 'Trace the letter J with your finger! Down, then curve!',
          promptText: 'Encourage your child to trace the letter.',
          successAudio: 'Great trace! You wrote the letter J!',
        },
      },
      visualAssets: {
        mainSvgOrImage: 'ج',
      },
    },
    {
      id: 'letters-dal-bear',
      domain: 'letters',
      targetValue: 'د',
      stepNumber: 8,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ الدَّالِ (د)',
          promptAudio: 'اِلْمِسْ حَرْفَ الدَّالِ! دُبٌّ لَطِيف!',
          promptText: 'ساعد طفلك على لمس حرف الدال (د).',
          successAudio: 'مُمْتَاز! دُبٌّ صَغِيرٌ لَطِيف!',
        },
        fr: {
          title: 'La Pêche à la Lettre D',
          promptAudio: 'Touche la lettre D ! D comme oursoN (Doubb) !',
          promptText: 'Aidez votre enfant à toucher la lettre D.',
          successAudio: 'Bravo ! Tu as trouvé la lettre D !',
        },
        en: {
          title: 'Catch the Letter D',
          promptAudio: 'Touch the letter D! D for beaR (Doubb)!',
          promptText: 'Help your child tap the letter D.',
          successAudio: 'Well done! That is the letter D!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐻',
        choices: [
          { id: 'd', asset: 'د', isCorrect: true },
          { id: 'r', asset: 'ر', isCorrect: false },
          { id: 'w', asset: 'و', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-trace-baa',
      domain: 'letters',
      targetValue: 'ب',
      stepNumber: 9,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'تَتَبَّعْ حَرْفَ البَاءِ (ب)',
          promptAudio: 'اِرْسُمْ حَرْفَ البَاءِ بِإِصْبَعِكَ! خَطٌّ مُسْتَقِيمٌ وَنُقْطَة!',
          promptText: 'شجع طفلك على تمرير إصبعه فوق حرف الباء.',
          successAudio: 'خَطٌّ رَائِع! كَتَبْتَ حَرْفَ البَاء!',
        },
        fr: {
          title: 'Trace la Lettre B',
          promptAudio: 'Trace la lettre B avec ton doigt ! Une ligne et un point !',
          promptText: 'Encouragez l\'enfant à tracer la lettre.',
          successAudio: 'Très beau tracé ! Tu as réussi la lettre B !',
        },
        en: {
          title: 'Trace the Letter B',
          promptAudio: 'Trace the letter B with your finger! A line and a dot!',
          promptText: 'Encourage your child to trace the letter.',
          successAudio: 'Great trace! You wrote the letter B!',
        },
      },
      visualAssets: {
        mainSvgOrImage: 'ب',
      },
    },
    {
      id: 'letters-seen-fish',
      domain: 'letters',
      targetValue: 'س',
      stepNumber: 10,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ السِّينِ (س)',
          promptAudio: 'اِلْمِسْ حَرْفَ السِّينِ! سَـ.. سَمَكَة!',
          promptText: 'ساعد طفلك على لمس حرف السين (س).',
          successAudio: 'رَائِع! سَـ.. سَمَكَةٌ فِي المَاء!',
        },
        fr: {
          title: 'La Pêche à la Lettre S',
          promptAudio: 'Touche la lettre S ! S comme poisSon (Samaka) !',
          promptText: 'Aidez votre enfant à toucher la lettre S.',
          successAudio: 'Bravo ! Tu as trouvé la lettre S !',
        },
        en: {
          title: 'Catch the Letter S',
          promptAudio: 'Touch the letter S! S for fiSh (Samaka)!',
          promptText: 'Help your child tap the letter S.',
          successAudio: 'Well done! That is the letter S!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐟',
        choices: [
          { id: 's', asset: 'س', isCorrect: true },
          { id: 'sh', asset: 'ش', isCorrect: false },
          { id: 'sad', asset: 'ص', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-meem-banana',
      domain: 'letters',
      targetValue: 'م',
      stepNumber: 11,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ المِيمِ (م)',
          promptAudio: 'اِلْمِسْ حَرْفَ المِيمِ! مَـ.. مَوْزَة!',
          promptText: 'ساعد طفلك على لمس حرف الميم (م).',
          successAudio: 'مُمْتَاز! مَـ.. مَوْزَةٌ صَفْرَاء!',
        },
        fr: {
          title: 'La Pêche à la Lettre M',
          promptAudio: 'Touche la lettre M ! M comme banane (Mawza) !',
          promptText: 'Aidez votre enfant à toucher la lettre M.',
          successAudio: 'Bravo ! Tu as trouvé la lettre M !',
        },
        en: {
          title: 'Catch the Letter M',
          promptAudio: 'Touch the letter M! M for banana (Mawza)!',
          promptText: 'Help your child tap the letter M.',
          successAudio: 'Well done! That is the letter M!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍌',
        choices: [
          { id: 'm', asset: 'م', isCorrect: true },
          { id: 'n', asset: 'ن', isCorrect: false },
          { id: 'h', asset: 'هـ', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-trace-meem',
      domain: 'letters',
      targetValue: 'م',
      stepNumber: 12,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'تَتَبَّعْ حَرْفَ المِيمِ (م)',
          promptAudio: 'اِرْسُمْ حَرْفَ المِيمِ بِإِصْبَعِكَ! دَائِرَةٌ صَغِيرَةٌ وَذَيْل!',
          promptText: 'شجع طفلك على تمرير إصبعه فوق حرف الميم.',
          successAudio: 'خَطٌّ رَائِع! كَتَبْتَ حَرْفَ المِيم!',
        },
        fr: {
          title: 'Trace la Lettre M',
          promptAudio: 'Trace la lettre M avec ton doigt ! Un petit rond et une queue !',
          promptText: 'Encouragez l\'enfant à tracer la lettre.',
          successAudio: 'Très beau tracé ! Tu as réussi la lettre M !',
        },
        en: {
          title: 'Trace the Letter M',
          promptAudio: 'Trace the letter M with your finger! A small circle and a tail!',
          promptText: 'Encourage your child to trace the letter.',
          successAudio: 'Great trace! You wrote the letter M!',
        },
      },
      visualAssets: {
        mainSvgOrImage: 'م',
      },
    },
    {
      id: 'letters-fruit-basket',
      domain: 'letters',
      targetValue: 'basket',
      stepNumber: 13,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'سَلَّةُ الفَوَاكِهِ اللَّذِيذَةِ',
          promptAudio: 'ضَعِ التَّمْرَ وَالبُرْتُقَالَ فِي سَلَّةِ الفَوَاكِه، وَالحَلْوَى فِي صَحْنِ الحَلْوَى!',
          promptText: 'اطلب من طفلك فرز الفواكه الصحية في السلة.',
          successAudio: 'يَا لَكَ مِنْ بَطَل! سَلَّةٌ صِحِّيَّةٌ وَلَذِيذَة!',
        },
        fr: {
          title: 'Le Couffin des Fruits',
          promptAudio: 'Mets les fruits dans le couffin et les bonbons dans l\'assiette !',
          promptText: 'Invitez l\'enfant à trier les fruits dans le panier.',
          successAudio: 'Superbe ! Un délicieux panier de fruits !',
        },
        en: {
          title: 'The Fruit Basket',
          promptAudio: 'Put the fruits in the basket and candies on the plate!',
          promptText: 'Ask the child to sort fruits into the basket.',
          successAudio: 'Awesome! A wonderful fruit basket!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        sortBins: [
          { id: 'fruits', labelAsset: '🧺' },
          { id: 'sweets', labelAsset: '🍬' },
        ],
        sortItems: [
          { id: 'dates', asset: '🌴', correctBinId: 'fruits' },
          { id: 'orange', asset: '🍊', correctBinId: 'fruits' },
          { id: 'pomegranate', asset: '🍎', correctBinId: 'fruits' },
          { id: 'candy', asset: '🍭', correctBinId: 'sweets' },
        ],
      },
    },
    {
      id: 'letters-match-words',
      domain: 'letters',
      targetValue: 'connect',
      stepNumber: 14,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'وَصِّلِ الحَرْفَ بِالصُّورَةِ',
          promptAudio: 'اِلْمِسِ الحَرْفَ ثُمَّ الْمِسِ الصُّورَةَ المُنَاسِبَةَ لَه!',
          promptText: 'ساعد طفلك على ربط الحرف بصورته المناسبة.',
          successAudio: 'عَبْقَرِيٌّ صَغِير! رَبَطْتَ كُلَّ الحُرُوف!',
        },
        fr: {
          title: 'Associe la Lettre et l\'Image',
          promptAudio: 'Touche la lettre puis touche la bonne image !',
          promptText: 'Aidez l\'enfant à associer chaque lettre à son image.',
          successAudio: 'Bravo ! Tu as associé toutes les lettres !',
        },
        en: {
          title: 'Match Letter and Picture',
          promptAudio: 'Tap the letter, then tap the matching picture!',
          promptText: 'Help your child match each letter to its picture.',
          successAudio: 'Fantastic! All letters are matched!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔤',
        connectPairs: [
          { id: 'alif-rabbit', leftAsset: '🐰', rightAsset: 'أ' },
          { id: 'baa-batta', leftAsset: '🦆', rightAsset: 'ب' },
          { id: 'jamal-jeem', leftAsset: '🐪', rightAsset: 'ج' },
          { id: 'dal-bear', leftAsset: '🐻', rightAsset: 'د' },
          { id: 'seen-fish', leftAsset: '🐟', rightAsset: 'س' },
        ],
      },
    },
  ],
};
