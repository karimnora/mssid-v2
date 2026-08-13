import { PreschoolModule } from './types';

// "حَيَوَانَاتِي" — My Animals. Demonstrates the 'sorting' mechanic and the original
// 'creative_extra' mini-game (bubble_pop — see PreschoolBubblePop.tsx).
export const ANIMALS_MODULE: PreschoolModule = {
  id: 'preschool-animals',
  domain: 'animals',
  icon: '🐾',
  totalSteps: 2,
  titleI18n: {
    ar: 'حَيَوَانَاتِي',
    fr: 'Mes Animaux',
    en: 'My Animals',
  },
  activities: [
    {
      id: 'animals-sort-big-small',
      domain: 'animals',
      targetValue: 'sort',
      stepNumber: 1,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'كَبِيرٌ أَمْ صَغِيرٌ؟',
          promptAudio: 'ساعدني! ضع الحيوانات الكبيرة مع الفيل، والحيوانات الصغيرة مع الفأر!',
          successAudio: 'ممتاز! رتبت كل الحيوانات!',
        },
        fr: {
          title: 'Grand ou petit ?',
          promptAudio: 'Aide-moi ! Mets les grands animaux avec l\'éléphant, et les petits avec la souris !',
          successAudio: 'Parfait ! Tu as bien trié tous les animaux !',
        },
        en: {
          title: 'Big or small?',
          promptAudio: 'Help me! Put the big animals with the elephant, and the small ones with the mouse!',
          successAudio: 'Perfect! You sorted every animal!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐘',
        sortBins: [
          { id: 'big', labelAsset: '🐘' },
          { id: 'small', labelAsset: '🐭' },
        ],
        sortItems: [
          { id: 'elephant', asset: '🐘', correctBinId: 'big' },
          { id: 'giraffe', asset: '🦒', correctBinId: 'big' },
          { id: 'mouse', asset: '🐭', correctBinId: 'small' },
          { id: 'hamster', asset: '🐹', correctBinId: 'small' },
        ],
      },
    },
    {
      id: 'animals-bubble-pop',
      domain: 'animals',
      targetValue: 3,
      stepNumber: 2,
      interactionType: 'creative_extra',
      i18n: {
        ar: { title: 'فَقَاعَاتُ الفَرَاشَاتِ', promptAudio: 'فرقع كل الفراشات! هيا، بسرعة!', successAudio: 'فرقعتها كلها! أنت بطل!' },
        fr: { title: 'Bulles de papillons', promptAudio: 'Fais éclater tous les papillons ! Vas-y, vite !', successAudio: 'Tu les as tous éclatés ! Tu es un champion !' },
        en: { title: 'Butterfly bubbles', promptAudio: 'Pop every butterfly bubble! Go, quickly!', successAudio: 'You popped them all! You are a champion!' },
      },
      visualAssets: {
        mainSvgOrImage: '🦋',
        bubbleCount: 3,
        bubbleAsset: '🦋',
      },
    },
  ],
};
