import { PreschoolModule } from './types';

// "أَشْكَالِي الصَّغِيرَةُ" — My Little Shapes. Teaches 6 individual shapes (circle, square,
// triangle, star, heart, diamond) via tap_choice, each anchored to a familiar object, plus a
// circle trace, a triangle-vs-circle sort (real-world objects), a shape-matching game, and memory.
export const SHAPES_MODULE: PreschoolModule = {
  id: 'preschool-shapes',
  domain: 'shapes',
  icon: '🔺',
  totalSteps: 10,
  titleI18n: {
    ar: 'أَشْكَالِي الصَّغِيرَةُ',
    fr: 'Mes Petites Formes',
    en: 'My Little Shapes',
  },
  activities: [
    {
      id: 'shape-circle-cookie',
      domain: 'shapes',
      targetValue: 'circle',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الشَّكْلُ الدَّائِرِيُّ', promptAudio: 'المِسِ الدَّائِرَةَ! مِثْلُ الكَعْكَةِ المُسْتَدِيرَة!', successAudio: 'أَحْسَنْت! هَذِهِ دَائِرَة!' },
        fr: { title: 'Le Cercle', promptAudio: 'Touche le cercle ! Comme le biscuit rond !', successAudio: 'Bravo ! Voici un cercle !' },
        en: { title: 'The Circle', promptAudio: 'Touch the circle! Like the round cookie!', successAudio: 'Well done! That is a circle!' },
      },
      visualAssets: {
        mainSvgOrImage: '🍪',
        choices: [
          { id: 'circle', asset: '⚪', isCorrect: true },
          { id: 'square', asset: '🟦', isCorrect: false },
          { id: 'triangle', asset: '🔺', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-square-gift',
      domain: 'shapes',
      targetValue: 'square',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الشَّكْلُ المُرَبَّعُ', promptAudio: 'المِسِ المُرَبَّعَ! مِثْلُ عُلْبَةِ الهَدِيَّة!', successAudio: 'رَائِع! هَذَا مُرَبَّع!' },
        fr: { title: 'Le Carré', promptAudio: 'Touche le carré ! Comme la boîte cadeau !', successAudio: 'Super ! Voici un carré !' },
        en: { title: 'The Square', promptAudio: 'Touch the square! Like the gift box!', successAudio: 'Great! That is a square!' },
      },
      visualAssets: {
        mainSvgOrImage: '🎁',
        choices: [
          { id: 'square', asset: '🟦', isCorrect: true },
          { id: 'circle', asset: '⚪', isCorrect: false },
          { id: 'star', asset: '⭐', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-triangle-pizza',
      domain: 'shapes',
      targetValue: 'triangle',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الشَّكْلُ المُثَلَّثُ', promptAudio: 'المِسِ المُثَلَّثَ! مِثْلُ قِطْعَةِ البِيتْزَا!', successAudio: 'مُمْتَاز! هَذَا مُثَلَّث!' },
        fr: { title: 'Le Triangle', promptAudio: 'Touche le triangle ! Comme la part de pizza !', successAudio: 'Bravo ! Voici un triangle !' },
        en: { title: 'The Triangle', promptAudio: 'Touch the triangle! Like the pizza slice!', successAudio: 'Well done! That is a triangle!' },
      },
      visualAssets: {
        mainSvgOrImage: '🍕',
        choices: [
          { id: 'triangle', asset: '🔺', isCorrect: true },
          { id: 'circle', asset: '⚪', isCorrect: false },
          { id: 'diamond', asset: '🔷', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-star-night',
      domain: 'shapes',
      targetValue: 'star',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الشَّكْلُ النَّجْمِيُّ', promptAudio: 'المِسِ النَّجْمَةَ! مِثْلُ نُجُومِ السَّمَاءِ!', successAudio: 'رَائِع! هَذِهِ نَجْمَة!' },
        fr: { title: 'L\'Étoile', promptAudio: 'Touche l\'étoile ! Comme les étoiles du ciel !', successAudio: 'Super ! Voici une étoile !' },
        en: { title: 'The Star', promptAudio: 'Touch the star! Like the stars in the sky!', successAudio: 'Great! That is a star!' },
      },
      visualAssets: {
        mainSvgOrImage: '🌟',
        choices: [
          { id: 'star', asset: '⭐', isCorrect: true },
          { id: 'heart', asset: '❤️', isCorrect: false },
          { id: 'square', asset: '🟦', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-heart-love',
      domain: 'shapes',
      targetValue: 'heart',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'شَكْلُ القَلْبِ', promptAudio: 'المِسِ القَلْبَ! مِثْلُ حُبِّ مَامَا وَبَابَا!', successAudio: 'أَحْسَنْت! هَذَا قَلْب!' },
        fr: { title: 'Le Cœur', promptAudio: 'Touche le cœur ! Comme l\'amour de maman et papa !', successAudio: 'Bravo ! Voici un cœur !' },
        en: { title: 'The Heart', promptAudio: 'Touch the heart! Like mum and dad\'s love!', successAudio: 'Well done! That is a heart!' },
      },
      visualAssets: {
        mainSvgOrImage: '💌',
        choices: [
          { id: 'heart', asset: '❤️', isCorrect: true },
          { id: 'star', asset: '⭐', isCorrect: false },
          { id: 'diamond', asset: '🔷', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-diamond-ring',
      domain: 'shapes',
      targetValue: 'diamond',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الشَّكْلُ المُعَيَّنُ', promptAudio: 'المِسِ المُعَيَّنَ! مِثْلُ الطَّائِرَةِ الوَرَقِيَّة!', successAudio: 'مُمْتَاز! هَذَا مُعَيَّن!' },
        fr: { title: 'Le Losange', promptAudio: 'Touche le losange ! Comme le cerf-volant !', successAudio: 'Bravo ! Voici un losange !' },
        en: { title: 'The Diamond', promptAudio: 'Touch the diamond! Like the kite!', successAudio: 'Well done! That is a diamond!' },
      },
      visualAssets: {
        mainSvgOrImage: '🪁',
        choices: [
          { id: 'diamond', asset: '🔷', isCorrect: true },
          { id: 'circle', asset: '⚪', isCorrect: false },
          { id: 'triangle', asset: '🔺', isCorrect: false },
        ],
      },
    },
    {
      id: 'shape-trace-circle',
      domain: 'shapes',
      targetValue: 'circle',
      stepNumber: 7,
      interactionType: 'trace',
      i18n: {
        ar: { title: 'تَتَبَّعِ الدَّائِرَةَ بِإِصْبَعِكَ', promptAudio: 'اِرْسُمِ الدَّائِرَةَ بِإِصْبَعِكَ الجَمِيل! دُرْ حَوْلَهَا بِهُدُوء!', successAudio: 'خَطٌّ رَائِع! رَسَمْتَ دَائِرَةً كَامِلَة!' },
        fr: { title: 'Trace le Cercle', promptAudio: 'Trace le cercle avec ton doigt ! Tourne tout doucement !', successAudio: 'Très beau tracé ! Tu as dessiné un cercle parfait !' },
        en: { title: 'Trace the Circle', promptAudio: 'Trace the circle with your finger! Go round and round gently!', successAudio: 'Great trace! You drew a perfect circle!' },
      },
      visualAssets: {
        mainSvgOrImage: '⚪',
      },
    },
    {
      id: 'shape-sort-triangles',
      domain: 'shapes',
      targetValue: 'triangle',
      stepNumber: 8,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'بَيْتُ المُثَلَّثَاتِ',
          promptAudio: 'ضَعِ البِيتْزَا وَالخَيْمَةَ وَالمِسْطَرَةَ فِي بَيْتِ المُثَلَّث! وَالكَعْكَةَ وَالكُرَةَ فِي بَيْتِ الدَّائِرَة!',
          promptText: 'ساعد طفلك على فرز الأشياء المثلثة (بيتزا، خيمة، مسطرة) عن الأشياء المستديرة.',
          successAudio: 'بَطَل! كُلُّ المُثَلَّثَاتِ فِي بَيْتِهَا!',
        },
        fr: {
          title: 'La maison des triangles',
          promptAudio: 'Mets la pizza, la tente et l\'équerre dans la maison du triangle ! Et le biscuit et le ballon dans la maison du cercle !',
          promptText: 'Aidez l\'enfant à trier les objets triangulaires (pizza, tente, équerre) et les objets ronds.',
          successAudio: 'Bravo ! Tous les triangles sont rentrés à la maison !',
        },
        en: {
          title: 'Triangle house',
          promptAudio: 'Put the pizza, the tent and the triangle ruler in the triangle house! And the cookie and the ball in the circle house!',
          promptText: 'Help your child sort triangular things (pizza, tent, ruler) from round things.',
          successAudio: 'You did it! Every triangle is home!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔺',
        sortBins: [
          { id: 'triangles', labelAsset: '🔺' },
          { id: 'circles', labelAsset: '⚪' },
        ],
        sortItems: [
          { id: 'pizza', asset: '🍕', correctBinId: 'triangles' },
          { id: 'tent', asset: '⛺', correctBinId: 'triangles' },
          { id: 'set-square', asset: '📐', correctBinId: 'triangles' },
          { id: 'cookie', asset: '🍪', correctBinId: 'circles' },
          { id: 'ball', asset: '⚽', correctBinId: 'circles' },
        ],
      },
    },
    {
      id: 'shape-connect-twins',
      domain: 'shapes',
      targetValue: 'match',
      stepNumber: 9,
      interactionType: 'connect_dots',
      i18n: {
        ar: { title: 'وَصِّلِ التَّوَائِمَ', promptAudio: 'اعثر على توأم كل شكل! المسه ثم المس شبيهه!', successAudio: 'برافو! وصّلت كل الأشكال!' },
        fr: { title: 'Relie les jumeaux', promptAudio: 'Trouve le jumeau de chaque forme ! Touche-la, puis touche sa pareille !', successAudio: 'Bravo ! Tu as relié toutes les formes !' },
        en: { title: 'Match the twins', promptAudio: 'Find the twin of each shape! Tap it, then tap its match!', successAudio: 'Bravo! You matched every shape!' },
      },
      visualAssets: {
        mainSvgOrImage: '🔺',
        connectPairs: [
          { id: 'circle', leftAsset: '⚪', rightAsset: '⚪' },
          { id: 'triangle', leftAsset: '🔺', rightAsset: '🔺' },
          { id: 'square', leftAsset: '🟦', rightAsset: '🟦' },
          { id: 'star', leftAsset: '⭐', rightAsset: '⭐' },
          { id: 'heart', leftAsset: '❤️', rightAsset: '❤️' },
        ],
      },
    },
    {
      id: 'shape-memory-pairs',
      domain: 'shapes',
      targetValue: 'memory',
      stepNumber: 10,
      interactionType: 'memory_cards',
      i18n: {
        ar: { title: 'لُعْبَةُ الذَّاكِرَةِ', promptAudio: 'اقلب بطاقتين وابحث عن الشكلين المتشابهين!', successAudio: 'ذاكرة قوية! أحسنت!' },
        fr: { title: 'Jeu de mémoire', promptAudio: 'Retourne deux cartes et trouve les deux formes pareilles !', successAudio: 'Quelle bonne mémoire ! Bravo !' },
        en: { title: 'Memory game', promptAudio: 'Flip two cards and find the two matching shapes!', successAudio: 'What a great memory! Well done!' },
      },
      visualAssets: {
        mainSvgOrImage: '🟦',
        memoryPairs: [
          { id: 'm-circle', asset: '⚪' },
          { id: 'm-square', asset: '🟦' },
          { id: 'm-star', asset: '⭐' },
        ],
      },
    },
  ],
};
