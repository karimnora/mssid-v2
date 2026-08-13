import { PreschoolModule } from './types';

// "أَشْكَالِي الصَّغِيرَةُ" — My Little Shapes. Demonstrates 3 of the new interaction mechanics
// (find_path, connect_dots, memory_cards) added alongside the numbers pilot.
export const SHAPES_MODULE: PreschoolModule = {
  id: 'preschool-shapes',
  domain: 'shapes',
  icon: '🔺',
  totalSteps: 3,
  titleI18n: {
    ar: 'أَشْكَالِي الصَّغِيرَةُ',
    fr: 'Mes Petites Formes',
    en: 'My Little Shapes',
  },
  activities: [
    {
      id: 'shape-find-path-triangle',
      domain: 'shapes',
      targetValue: '🔺',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: { title: 'ساعِدِ المُثَلَّثَ', promptAudio: 'اسحبني إلى بيتي! ساعدني أصل!', successAudio: 'وصلت! أنت رائع!' },
        fr: { title: 'Aide le triangle', promptAudio: 'Fais-moi glisser jusqu\'à ma maison ! Aide-moi à arriver !', successAudio: 'J\'y suis arrivé ! Tu es génial !' },
        en: { title: 'Help the triangle', promptAudio: 'Drag me all the way to my house! Help me get there!', successAudio: 'I made it! You are amazing!' },
      },
      visualAssets: {
        mainSvgOrImage: '🔺',
        pathToken: { startAsset: '🔺', endAsset: '🏠', travelerAsset: '🔺' },
      },
    },
    {
      id: 'shape-connect-twins',
      domain: 'shapes',
      targetValue: 'match',
      stepNumber: 2,
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
        ],
      },
    },
    {
      id: 'shape-memory-pairs',
      domain: 'shapes',
      targetValue: 'memory',
      stepNumber: 3,
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
        ],
      },
    },
  ],
};
