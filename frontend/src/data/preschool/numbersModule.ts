import { PreschoolActivity, PreschoolDragItem, PreschoolModule } from './types';

function tray(asset: string, count: number): PreschoolDragItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: `d${i + 1}`, asset }));
}

// "أرقامي الأولى" — My First Numbers (0 to 10). Pilot module for the Mode Éveil MVP.
// 0-2 → tap_choice (numeral recognition)
// 3-10 → drag_drop give-among (compose a collection, extras stay on the tray)
// 8-10 → trace the numeral AFTER counting it (shape, not a substitute for counting)
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
        ar: { title: 'الثَّلاَثَةُ', promptAudio: 'ضَعْ ثَلَاثَ تُفَّاحَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'خمس تفاحات. ضع ثلاثاً فقط ثم «أنا خلّصت».', successAudio: 'أَحْسَنْت! ثَلَاثُ تُفَّاحَات!' },
        fr: { title: 'Trois', promptAudio: 'Mets trois pommes dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Cinq pommes. Glisser seulement 3, puis « J’ai fini ».', successAudio: 'Bravo ! Trois pommes !' },
        en: { title: 'Three', promptAudio: 'Put three apples in the basket! Not all of them! Then tap: I’m done!', promptText: 'Five apples. Drop only 3, then tap I’m done.', successAudio: 'Well done! Three apples!' },
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
        ar: { title: 'الأَرْبَعَةُ', promptAudio: 'ضَعْ أَرْبَعَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'ست نجمات. ضع أربعاً فقط ثم «أنا خلّصت».', successAudio: 'رَائِع! أَرْبَعُ نَجْمَات!' },
        fr: { title: 'Quatre', promptAudio: 'Mets quatre étoiles dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Six étoiles. Glisser seulement 4, puis « J’ai fini ».', successAudio: 'Super ! Exactement quatre !' },
        en: { title: 'Four', promptAudio: 'Put four stars in the basket! Not all of them! Then tap: I’m done!', promptText: 'Six stars. Drop only 4, then tap I’m done.', successAudio: 'Great! Exactly four!' },
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
        ar: { title: 'الخَمْسَةُ', promptAudio: 'ضَعْ خَمْسَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'سبع نجمات. ضع خمساً فقط ثم «أنا خلّصت».', successAudio: 'بَرَافُو! خَمْسُ نَجْمَاتٍ فِي السَّلَة!' },
        fr: { title: 'Cinq', promptAudio: 'Mets cinq étoiles dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Sept étoiles. Glisser seulement 5, puis « J’ai fini ».', successAudio: 'Bravo ! Cinq étoiles dans le panier !' },
        en: { title: 'Five', promptAudio: 'Put five stars in the basket! Not all of them! Then tap: I’m done!', promptText: 'Seven stars. Drop only 5, then tap I’m done.', successAudio: 'Bravo! Five stars in the basket!' },
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
        ar: { title: 'السِّتَّةُ', promptAudio: 'ضَعْ سِتَّ تُفَّاحَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'ثماني تفاحات. ضع ستاً فقط ثم «أنا خلّصت».', successAudio: 'مُمْتَاز! سِتُّ تُفَّاحَات!' },
        fr: { title: 'Six', promptAudio: 'Mets six pommes dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Huit pommes. Glisser seulement 6, puis « J’ai fini ».', successAudio: 'Excellent ! Six pommes !' },
        en: { title: 'Six', promptAudio: 'Put six apples in the basket! Not all of them! Then tap: I’m done!', promptText: 'Eight apples. Drop only 6, then tap I’m done.', successAudio: 'Excellent! Six apples!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 6,
        dragItems: tray('🍎', 8),
      },
    },
    {
      id: 'num-7',
      domain: 'numbers',
      targetValue: 7,
      stepNumber: 8,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'السَّبْعَةُ', promptAudio: 'ضَعْ سَبْعَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'تسع نجمات. ضع سبعاً فقط ثم «أنا خلّصت».', successAudio: 'رَائِعٌ جِدّاً! سَبْعُ نَجْمَات!' },
        fr: { title: 'Sept', promptAudio: 'Mets sept étoiles dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Neuf étoiles. Glisser seulement 7, puis « J’ai fini ».', successAudio: 'Formidable ! Sept étoiles !' },
        en: { title: 'Seven', promptAudio: 'Put seven stars in the basket! Not all of them! Then tap: I’m done!', promptText: 'Nine stars. Drop only 7, then tap I’m done.', successAudio: 'Wonderful! Seven stars!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 7,
        dragItems: tray('⭐', 9),
      },
    },
    {
      id: 'num-8-count',
      domain: 'numbers',
      targetValue: 8,
      stepNumber: 9,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'ثَمَانِي تُفَّاحَات', promptAudio: 'ضَعْ ثَمَانِيَ تُفَّاحَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'عشر تفاحات. ضع ثمانياً فقط ثم «أنا خلّصت».', successAudio: 'أَحْسَنْت! ثَمَانِي تُفَّاحَات!' },
        fr: { title: 'Huit pommes', promptAudio: 'Mets huit pommes dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Dix pommes. Glisser seulement 8, puis « J’ai fini ».', successAudio: 'Bravo ! Huit pommes !' },
        en: { title: 'Eight apples', promptAudio: 'Put eight apples in the basket! Not all of them! Then tap: I’m done!', promptText: 'Ten apples. Drop only 8, then tap I’m done.', successAudio: 'Well done! Eight apples!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 8,
        dragItems: tray('🍎', 10),
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
      id: 'num-9-count',
      domain: 'numbers',
      targetValue: 9,
      stepNumber: 11,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'تِسْعُ نَجْمَات', promptAudio: 'ضَعْ تِسْعَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'إحدى عشرة نجمة. ضع تسعاً فقط ثم «أنا خلّصت».', successAudio: 'رَائِع! تِسْعُ نَجْمَات!' },
        fr: { title: 'Neuf étoiles', promptAudio: 'Mets neuf étoiles dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Onze étoiles. Glisser seulement 9, puis « J’ai fini ».', successAudio: 'Super ! Neuf étoiles !' },
        en: { title: 'Nine stars', promptAudio: 'Put nine stars in the basket! Not all of them! Then tap: I’m done!', promptText: 'Eleven stars. Drop only 9, then tap I’m done.', successAudio: 'Great! Nine stars!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 9,
        dragItems: tray('⭐', 11),
      },
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
      id: 'num-10-count',
      domain: 'numbers',
      targetValue: 10,
      stepNumber: 13,
      interactionType: 'drag_drop',
      i18n: {
        ar: { title: 'عَشْرُ نَجْمَات', promptAudio: 'ضَعْ عَشْرَ نَجْمَاتٍ فِي السَّلَة! لَيْسَتْ كُلَّهَا! ثُمَّ اضْغَطْ: أَنَا خَلَّصْت!', promptText: 'اثنتا عشرة نجمة. ضع عشراً فقط ثم «أنا خلّصت».', successAudio: 'مَبْرُوك! عَشْرُ نَجْمَات!' },
        fr: { title: 'Dix étoiles', promptAudio: 'Mets dix étoiles dans le panier ! Pas toutes ! Puis appuie sur : j’ai fini !', promptText: 'Douze étoiles. Glisser seulement 10, puis « J’ai fini ».', successAudio: 'Bravo ! Dix étoiles !' },
        en: { title: 'Ten stars', promptAudio: 'Put ten stars in the basket! Not all of them! Then tap: I’m done!', promptText: 'Twelve stars. Drop only 10, then tap I’m done.', successAudio: 'Well done! Ten stars!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧺',
        dropZoneCount: 10,
        dragItems: tray('⭐', 12),
      },
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
  totalSteps: 8,
  titleI18n: {
    ar: 'مِنْ سِتَّةٍ إِلَى عَشَرَة',
    fr: 'De 6 à 10',
    en: 'From 6 to 10',
  },
  activities: renumberSteps(NUMBERS_CATALOG.activities.slice(6)),
};

/** First path — tests still import this name for activity[0]. */
export const NUMBERS_MODULE_0_TO_10 = NUMBERS_MODULE_0_TO_5;
