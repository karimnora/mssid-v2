import { PreschoolActivity, PreschoolModule } from './types';

// "أرقامي الأولى" — My First Numbers (0 to 10). Pilot module for the Mode Éveil MVP.
// Interaction types are deliberately spread across the path so the MVP exercises all three:
// 0-4 → tap_choice (numeral recognition + simple counting)
// 5-7 → drag_drop (counting objects into a basket)
// 8-10 → trace (finger tracing of the numeral, wide tolerance)
const NUMBERS_CATALOG: PreschoolModule = {
  id: 'preschool-numbers-0-10',
  domain: 'numbers',
  icon: '🔢',
  totalSteps: 11,
  titleI18n: {
    ar: 'أَرْقَامِي الأُولَى',
    fr: 'Mes Premiers Nombres',
    en: 'My First Numbers',
  },
  activities: [
    {
      id: 'num-0',
      domain: 'numbers',
      targetValue: 0,
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الصِّفْرُ', promptAudio: 'اِلْمَسِ الصِّفْر! الصَّحْنُ فَارِغ، لَيْسَ فِيهِ شَيْء!', promptText: 'اطلبي من طفلك لمس الرقم صفر.', successAudio: 'أَحْسَنْت! هَذَا هُوَ الصِّفْر!' },
        fr: { title: 'Zéro', promptAudio: 'Touche le zéro ! L\'assiette est vide, il n\'y a rien !', promptText: 'Demandez à votre enfant de toucher le chiffre zéro.', successAudio: 'Bravo ! Voici le zéro !' },
        en: { title: 'Zero', promptAudio: 'Touch zero! The plate is empty — there is nothing on it!', promptText: 'Ask your child to tap the number zero.', successAudio: 'Well done! That is zero!' },
      },
      visualAssets: {
        mainSvgOrImage: '🍽️',
        choices: [
          { id: 'c0', asset: '0', isCorrect: true },
          { id: 'c1', asset: '1', isCorrect: false },
          { id: 'c2', asset: '2', isCorrect: false },
        ],
      },
    },
    {
      id: 'num-1',
      domain: 'numbers',
      targetValue: 1,
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الوَاحِدُ', promptAudio: 'اِلْمَسِ الرَّقْمَ وَاحِد!', promptText: 'اطلبي من طفلك لمس الرقم 1.', successAudio: 'رَائِع! هَذَا هُوَ الوَاحِد!' },
        fr: { title: 'Un', promptAudio: 'Touche le chiffre un !', promptText: 'Demandez à votre enfant de toucher le chiffre 1.', successAudio: 'Super ! Voici le un !' },
        en: { title: 'One', promptAudio: 'Touch the number one!', promptText: 'Ask your child to tap the number 1.', successAudio: 'Great! That is one!' },
      },
      visualAssets: {
        mainSvgOrImage: '⭐',
        choices: [
          { id: 'c1', asset: '1', isCorrect: true },
          { id: 'c7', asset: '7', isCorrect: false },
          { id: 'c4', asset: '4', isCorrect: false },
        ],
      },
    },
    {
      id: 'num-2',
      domain: 'numbers',
      targetValue: 2,
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الاِثْنَانِ', promptAudio: 'كَمْ تُفَّاحَةً تَرَى؟ عُدَّ مَعِي!', promptText: 'اطلبي من طفلك عدّ التفاحتين ولمس الرقم الصحيح.', successAudio: 'مُمْتَاز! اثْنَتَانِ بِالضَّبْط!' },
        fr: { title: 'Deux', promptAudio: 'Combien vois-tu de pommes ? Compte avec moi !', promptText: 'Demandez à votre enfant de compter les 2 pommes.', successAudio: 'Parfait ! Exactement deux !' },
        en: { title: 'Two', promptAudio: 'How many apples do you see? Count with me!', promptText: 'Ask your child to count the 2 apples.', successAudio: 'Perfect! Exactly two!' },
      },
      visualAssets: {
        mainSvgOrImage: '🍎🍎',
        choices: [
          { id: 'c1', asset: '1', isCorrect: false },
          { id: 'c2', asset: '2', isCorrect: true },
          { id: 'c3', asset: '3', isCorrect: false },
        ],
      },
    },
    {
      id: 'num-3',
      domain: 'numbers',
      targetValue: 3,
      stepNumber: 4,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'الثَّلاَثَةُ', promptAudio: 'ضَعْ ثَلَاثَ تُفَّاحَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا!', promptText: 'خمس تفاحات في الصينية. ضع ثلاثاً فقط في السلة واترك الباقي.', successAudio: 'أَحْسَنْت! ثَلَاثُ تُفَّاحَات!' },
        fr: { title: 'Trois', promptAudio: 'Mets trois pommes dans le panier ! Pas toutes !', promptText: 'Cinq pommes dans le plateau. Glisser seulement 3 dans le panier.', successAudio: 'Bravo ! Trois pommes !' },
        en: { title: 'Three', promptAudio: 'Put three apples in the basket! Not all of them!', promptText: 'Five apples on the tray. Drop only 3 in the basket.', successAudio: 'Well done! Three apples!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 3,
        dragItems: [
          { id: 'd1', asset: '🍎' }, { id: 'd2', asset: '🍎' }, { id: 'd3', asset: '🍎' },
          { id: 'd4', asset: '🍎' }, { id: 'd5', asset: '🍎' },
        ],
      },
    },
    {
      id: 'num-4',
      domain: 'numbers',
      targetValue: 4,
      stepNumber: 5,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'الأَرْبَعَةُ', promptAudio: 'ضَعْ أَرْبَعَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا!', promptText: 'ست نجمات في الصينية. ضع أربعاً فقط في السلة.', successAudio: 'رَائِع! أَرْبَعُ نَجْمَات!' },
        fr: { title: 'Quatre', promptAudio: 'Mets quatre étoiles dans le panier ! Pas toutes !', promptText: 'Six étoiles dans le plateau. Glisser seulement 4 dans le panier.', successAudio: 'Super ! Exactement quatre !' },
        en: { title: 'Four', promptAudio: 'Put four stars in the basket! Not all of them!', promptText: 'Six stars on the tray. Drop only 4 in the basket.', successAudio: 'Great! Exactly four!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 4,
        dragItems: [
          { id: 'd1', asset: '⭐' }, { id: 'd2', asset: '⭐' }, { id: 'd3', asset: '⭐' },
          { id: 'd4', asset: '⭐' }, { id: 'd5', asset: '⭐' }, { id: 'd6', asset: '⭐' },
        ],
      },
    },
    {
      id: 'num-5',
      domain: 'numbers',
      targetValue: 5,
      stepNumber: 6,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'الخَمْسَةُ', promptAudio: 'ضَعْ خَمْسَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا!', promptText: 'سبع نجمات في الصينية. ضع خمساً فقط في السلة.', successAudio: 'بَرَافُو! خَمْسُ نَجْمَاتٍ فِي السَّلَة!' },
        fr: { title: 'Cinq', promptAudio: 'Mets cinq étoiles dans le panier ! Pas toutes !', promptText: 'Sept étoiles dans le plateau. Glisser seulement 5 dans le panier.', successAudio: 'Bravo ! Cinq étoiles dans le panier !' },
        en: { title: 'Five', promptAudio: 'Put five stars in the basket! Not all of them!', promptText: 'Seven stars on the tray. Drop only 5 in the basket.', successAudio: 'Bravo! Five stars in the basket!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 5,
        dragItems: [
          { id: 'd1', asset: '⭐' }, { id: 'd2', asset: '⭐' }, { id: 'd3', asset: '⭐' },
          { id: 'd4', asset: '⭐' }, { id: 'd5', asset: '⭐' }, { id: 'd6', asset: '⭐' }, { id: 'd7', asset: '⭐' },
        ],
      },
    },
    {
      id: 'num-6',
      domain: 'numbers',
      targetValue: 6,
      stepNumber: 7,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'السِّتَّةُ', promptAudio: 'ضَعْ سِتَّ تُفَّاحَاتٍ فِي السَّلَة!', promptText: 'ساعدي طفلك على سحب التفاحات الست إلى السلة.', successAudio: 'مُمْتَاز! سِتُّ تُفَّاحَات!' },
        fr: { title: 'Six', promptAudio: 'Mets six pommes dans le panier !', promptText: 'Aidez votre enfant à glisser les 6 pommes dans le panier.', successAudio: 'Excellent ! Six pommes !' },
        en: { title: 'Six', promptAudio: 'Put six apples in the basket!', promptText: 'Help your child drag the 6 apples into the basket.', successAudio: 'Excellent! Six apples!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 6,
        dragItems: [
          { id: 'd1', asset: '🍎' }, { id: 'd2', asset: '🍎' }, { id: 'd3', asset: '🍎' },
          { id: 'd4', asset: '🍎' }, { id: 'd5', asset: '🍎' }, { id: 'd6', asset: '🍎' },
        ],
      },
    },
    {
      id: 'num-7',
      domain: 'numbers',
      targetValue: 7,
      stepNumber: 8,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'السَّبْعَةُ', promptAudio: 'ضَعْ سَبْعَ نَجْمَاتٍ فِي السَّلَة!', promptText: 'ساعدي طفلك على سحب النجمات السبع إلى السلة.', successAudio: 'رَائِعٌ جِدّاً! سَبْعُ نَجْمَات!' },
        fr: { title: 'Sept', promptAudio: 'Mets sept étoiles dans le panier !', promptText: 'Aidez votre enfant à glisser les 7 étoiles dans le panier.', successAudio: 'Formidable ! Sept étoiles !' },
        en: { title: 'Seven', promptAudio: 'Put seven stars in the basket!', promptText: 'Help your child drag the 7 stars into the basket.', successAudio: 'Wonderful! Seven stars!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 7,
        dragItems: [
          { id: 'd1', asset: '⭐' }, { id: 'd2', asset: '⭐' }, { id: 'd3', asset: '⭐' }, { id: 'd4', asset: '⭐' },
          { id: 'd5', asset: '⭐' }, { id: 'd6', asset: '⭐' }, { id: 'd7', asset: '⭐' },
        ],
      },
    },
    {
      id: 'num-8',
      domain: 'numbers',
      targetValue: 8,
      stepNumber: 9,
      interactionType: 'trace',
      i18n: {
        ar: { title: 'الثَّمَانِيَةُ', promptAudio: 'تَتَبَّعِ الرَّقْمَ ثَمَانِيَة بِإِصْبَعِكَ!', promptText: 'ساعدي طفلك على تتبع شكل الرقم 8 بإصبعه على الشاشة.', successAudio: 'أَحْسَنْت! كَتَبْتَ الرَّقْمَ ثَمَانِيَة!' },
        fr: { title: 'Huit', promptAudio: 'Trace le chiffre huit avec ton doigt !', promptText: 'Aidez votre enfant à suivre la forme du 8 du doigt.', successAudio: 'Bravo ! Tu as écrit le huit !' },
        en: { title: 'Eight', promptAudio: 'Trace the number eight with your finger!', promptText: 'Help your child follow the shape of 8 with their finger.', successAudio: 'Well done! You wrote eight!' },
      },
      visualAssets: { mainSvgOrImage: '8' },
    },
    {
      id: 'num-9',
      domain: 'numbers',
      targetValue: 9,
      stepNumber: 10,
      interactionType: 'trace',
      i18n: {
        ar: { title: 'التِّسْعَةُ', promptAudio: 'تَتَبَّعِ الرَّقْمَ تِسْعَة بِإِصْبَعِكَ!', promptText: 'ساعدي طفلك على تتبع شكل الرقم 9 بإصبعه على الشاشة.', successAudio: 'رَائِع! كَتَبْتَ الرَّقْمَ تِسْعَة!' },
        fr: { title: 'Neuf', promptAudio: 'Trace le chiffre neuf avec ton doigt !', promptText: 'Aidez votre enfant à suivre la forme du 9 du doigt.', successAudio: 'Super ! Tu as écrit le neuf !' },
        en: { title: 'Nine', promptAudio: 'Trace the number nine with your finger!', promptText: 'Help your child follow the shape of 9 with their finger.', successAudio: 'Great! You wrote nine!' },
      },
      visualAssets: { mainSvgOrImage: '9' },
    },
    {
      id: 'num-10',
      domain: 'numbers',
      targetValue: 10,
      stepNumber: 11,
      interactionType: 'trace',
      i18n: {
        ar: { title: 'العَشَرَةُ', promptAudio: 'تَتَبَّعِ الرَّقْمَ عَشَرَة بِإِصْبَعِكَ! أَنْتَ بَطَلُ الأَرْقَام!', promptText: 'ساعدي طفلك على تتبع شكل الرقم 10 بإصبعه على الشاشة.', successAudio: 'مَبْرُوك! أَنْهَيْتَ رِحْلَةَ الأَرْقَامِ كُلَّهَا!' },
        fr: { title: 'Dix', promptAudio: 'Trace le nombre dix avec ton doigt ! Tu es un champion des nombres !', promptText: 'Aidez votre enfant à suivre la forme du 10 du doigt.', successAudio: 'Félicitations ! Tu as fini tout le parcours des nombres !' },
        en: { title: 'Ten', promptAudio: 'Trace the number ten with your finger! You are a numbers champion!', promptText: 'Help your child follow the shape of 10 with their finger.', successAudio: 'Congratulations! You finished the whole numbers path!' },
      },
      visualAssets: { mainSvgOrImage: '10' },
    },
  ],
};

function renumberSteps(acts: PreschoolActivity[]): PreschoolActivity[] {
  return acts.map((a, i) => ({ ...a, stepNumber: i + 1 }));
}

export const NUMBERS_MODULE_0_TO_5: PreschoolModule = {
  ...NUMBERS_CATALOG,
  id: 'preschool-numbers-0-5',
  icon: '✋',
  totalSteps: 6,
  titleI18n: {
    ar: 'مِنْ صِفْرٍ إِلَى خَمْسَة',
    fr: 'De 0 à 5',
    en: 'From 0 to 5',
  },
  activities: renumberSteps(NUMBERS_CATALOG.activities.slice(0, 6)),
};

export const NUMBERS_MODULE_6_TO_10: PreschoolModule = {
  ...NUMBERS_CATALOG,
  id: 'preschool-numbers-6-10',
  icon: '🔟',
  totalSteps: 5,
  titleI18n: {
    ar: 'مِنْ سِتَّةٍ إِلَى عَشَرَة',
    fr: 'De 6 à 10',
    en: 'From 6 to 10',
  },
  activities: renumberSteps(NUMBERS_CATALOG.activities.slice(6)),
};

/** First path — tests still import this name for activity[0]. */
export const NUMBERS_MODULE_0_TO_10 = NUMBERS_MODULE_0_TO_5;
