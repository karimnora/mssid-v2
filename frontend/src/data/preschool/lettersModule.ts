import { PreschoolModule } from './types';

// "سَفِينَةُ الحُرُوفِ" — Letters and Vocabulary (Arabophone & Multi-language éveil).
// 1. "سفينة الحروف": Reconnaissance et écoute des lettres de base (أ / ب / ت / ج)
// 2. "سلة الفواكه": Tri du couffin traditionnel et découverte du vocabulaire
// 3. "تتبع الحرف": Tracé au doigt de la lettre (ألف / باء)
// 4. "توائم الحروف": Association lettre et son / mot correspondant
export const LETTERS_MODULE: PreschoolModule = {
  id: 'preschool-letters',
  domain: 'letters',
  icon: '🔤',
  totalSteps: 4,
  titleI18n: {
    ar: 'سَفِينَةُ الحُرُوفِ وَالكَلِمَاتِ',
    fr: 'Le Bateau des Lettres & Mots',
    en: 'Letters & Words Boat',
  },
  activities: [
    {
      id: 'letters-boat-alif-baa',
      domain: 'letters',
      targetValue: 'ب',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَيْدُ حَرْفِ البَاءِ (ب)',
          promptAudio: 'اِلْمِسْ حَرْفَ البَاءِ! بَـ.. بَطَّة!',
          promptText: 'ساعد طفلك على لمس حرف الباء (ب).',
          successAudio: 'مُمْتَاز! بَـ.. بَطَّة جَمِيلَة!',
        },
        fr: {
          title: 'La Pêche à la Lettre B',
          promptAudio: 'Touche la lettre B ! B comme Bateau !',
          promptText: 'Aidez votre enfant à toucher la lettre B.',
          successAudio: 'Bravo ! Tu as trouvé la lettre B !',
        },
        en: {
          title: 'Catch the Letter B',
          promptAudio: 'Touch the letter B! B for Boat!',
          promptText: 'Help your child tap the letter B.',
          successAudio: 'Well done! That is the letter B!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⛵',
        choices: [
          { id: 'b', asset: 'ب', isCorrect: true },
          { id: 'a', asset: 'أ', isCorrect: false },
          { id: 't', asset: 'ت', isCorrect: false },
        ],
      },
    },
    {
      id: 'letters-fruit-basket',
      domain: 'letters',
      targetValue: 'basket',
      stepNumber: 2,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'سَلَّةُ الفَوَاكِهِ اللَّذِيذَةِ',
          promptAudio: 'ضَعِ التَّمْرَ وَالبُرْتُقَالَ فِي سَلَّةِ الفَوَاكِه، وَالحَلْوَى فِي صَحْنِ الحَلْوَى!',
          promptText: 'اطلب من طفلك فرز الفواكه الصحية في السلة.',
          successAudio: 'يَا لَكَ مِنْ بَطَل! سَلَّةٌ صِحِّيَّةٌ وَلَذِيذَة!',
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
      id: 'letters-trace-alif',
      domain: 'letters',
      targetValue: 'أ',
      stepNumber: 3,
      interactionType: 'trace',
      i18n: {
        ar: {
          title: 'تَتَبَّعْ حَرْفَ الأَلِفِ (أ)',
          promptAudio: 'اِرْسُمْ حَرْفَ الأَلِفِ بِإِصْبَعِكَ الجَمِيل! مِنْ أَعْلَى إِلَى أَسْفَل!',
          promptText: 'شجع طفلك على تمرير إصبعه فوق حرف الألف.',
          successAudio: 'خَطٌّ رَائِع! كَتَبْتَ حَرْفَ الأَلِف!',
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
      id: 'letters-match-words',
      domain: 'letters',
      targetValue: 'connect',
      stepNumber: 4,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'وَصِّلِ الحَرْفَ بِالصُّورَةِ',
          promptAudio: 'اِلْمِسِ الحَرْفَ ثُمَّ الْمِسِ الصُّورَةَ المُنَاسِبَةَ لَه!',
          promptText: 'ساعد طفلك على ربط الحرف بصورته المناسبة.',
          successAudio: 'عَبْقَرِيٌّ صَغِير! رَبَطْتَ كُلَّ الحُرُوف!',
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
          { id: 'alif-asad', leftAsset: '🦁', rightAsset: 'أ' },
          { id: 'baa-batta', leftAsset: '🦆', rightAsset: 'ب' },
          { id: 'jamal-jeem', leftAsset: '🐪', rightAsset: 'ج' },
        ],
      },
    },
  ],
};
