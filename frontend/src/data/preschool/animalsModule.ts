import { PreschoolModule } from './types';

// "حَيَوَانَاتِي" — My Animals. Teaches 6 individual farm/pet/wild animals (cow, sheep, chicken,
// cat, dog, lion) via tap_choice, plus the original big/small sort and butterfly bubble_pop, an
// animal-to-favorite-food matching game, and a 3-pair animal memory game.
export const ANIMALS_MODULE: PreschoolModule = {
  id: 'preschool-animals',
  domain: 'animals',
  icon: '🐾',
  totalSteps: 10,
  titleI18n: {
    ar: 'حَيَوَانَاتِي',
    fr: 'Mes Animaux',
    en: 'My Animals',
  },
  activities: [
    {
      id: 'animals-cow',
      domain: 'animals',
      targetValue: 'cow',
      stepNumber: 1,
      interactionType: 'tap_choice',
      echoWord: { ar: 'بَقَرَة', fr: 'vache', en: 'cow' },
      i18n: {
        ar: { title: 'البَقَرَةُ الحَنُونَةُ', promptAudio: 'المِسِ البَقَرَةَ! هِيَ تُعْطِينَا الحَلِيبَ اللَّذِيذ!', successAudio: 'أَحْسَنْت! هَذِهِ بَقَرَة!' },
        fr: { title: 'La Vache Gentille', promptAudio: 'Touche la vache ! Elle nous donne du bon lait !', successAudio: 'Bravo ! Voici une vache !' },
        en: { title: 'The Gentle Cow', promptAudio: 'Touch the cow! She gives us tasty milk!', successAudio: 'Well done! That is a cow!' },
      },
      visualAssets: {
        mainSvgOrImage: '🥛',
        choices: [
          { id: 'cow', asset: '🐄', isCorrect: true },
          { id: 'sheep', asset: '🐑', isCorrect: false },
          { id: 'dog', asset: '🐶', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-sheep',
      domain: 'animals',
      targetValue: 'sheep',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الخَرُوفُ الصُّوفِيُّ', promptAudio: 'المِسِ الخَرُوفَ! صُوفُهُ نَاعِمٌ وَدَافِئ!', successAudio: 'رَائِع! هَذَا خَرُوف!' },
        fr: { title: 'Le Mouton Laineux', promptAudio: 'Touche le mouton ! Sa laine est douce et chaude !', successAudio: 'Super ! Voici un mouton !' },
        en: { title: 'The Woolly Sheep', promptAudio: 'Touch the sheep! Its wool is soft and warm!', successAudio: 'Great! That is a sheep!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧶',
        choices: [
          { id: 'sheep', asset: '🐑', isCorrect: true },
          { id: 'cat', asset: '🐱', isCorrect: false },
          { id: 'lion', asset: '🦁', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-chicken',
      domain: 'animals',
      targetValue: 'chicken',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الدَّجَاجَةُ المُنَقْنِقَةُ', promptAudio: 'المِسِ الدَّجَاجَةَ! هِيَ تُعْطِينَا البَيْضَ!', successAudio: 'مُمْتَاز! هَذِهِ دَجَاجَة!' },
        fr: { title: 'La Poule Caquetante', promptAudio: 'Touche la poule ! Elle nous donne des œufs !', successAudio: 'Bravo ! Voici une poule !' },
        en: { title: 'The Clucking Hen', promptAudio: 'Touch the hen! She gives us eggs!', successAudio: 'Well done! That is a hen!' },
      },
      visualAssets: {
        mainSvgOrImage: '🥚',
        choices: [
          { id: 'chicken', asset: '🐔', isCorrect: true },
          { id: 'cow', asset: '🐄', isCorrect: false },
          { id: 'dog', asset: '🐶', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-cat',
      domain: 'animals',
      targetValue: 'cat',
      stepNumber: 4,
      interactionType: 'tap_choice',
      echoWord: { ar: 'قِطَّة', fr: 'chat', en: 'cat' },
      i18n: {
        ar: { title: 'القِطَّةُ اللَّطِيفَةُ', promptAudio: 'المِسِ القِطَّةَ! هِيَ تَقُولُ: نَاؤُو!', successAudio: 'أَحْسَنْت! هَذِهِ قِطَّة!' },
        fr: { title: 'Le Chat Mignon', promptAudio: 'Touche le chat ! Il dit : Miaou !', successAudio: 'Bravo ! Voici un chat !' },
        en: { title: 'The Cute Cat', promptAudio: 'Touch the cat! It says: Meow!', successAudio: 'Well done! That is a cat!' },
      },
      visualAssets: {
        mainSvgOrImage: '🧶',
        choices: [
          { id: 'cat', asset: '🐱', isCorrect: true },
          { id: 'sheep', asset: '🐑', isCorrect: false },
          { id: 'chicken', asset: '🐔', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-dog',
      domain: 'animals',
      targetValue: 'dog',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الكَلْبُ الوَفِيُّ', promptAudio: 'المِسِ الكَلْبَ! هُوَ يَقُولُ: هَاو هَاو!', successAudio: 'رَائِع! هَذَا كَلْب!' },
        fr: { title: 'Le Chien Fidèle', promptAudio: 'Touche le chien ! Il dit : Ouaf ouaf !', successAudio: 'Super ! Voici un chien !' },
        en: { title: 'The Loyal Dog', promptAudio: 'Touch the dog! It says: Woof woof!', successAudio: 'Great! That is a dog!' },
      },
      visualAssets: {
        mainSvgOrImage: '🦴',
        choices: [
          { id: 'dog', asset: '🐶', isCorrect: true },
          { id: 'lion', asset: '🦁', isCorrect: false },
          { id: 'cow', asset: '🐄', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-lion',
      domain: 'animals',
      targetValue: 'lion',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: { title: 'الأَسَدُ المَلِكُ', promptAudio: 'المِسِ الأَسَدَ! هُوَ مَلِكُ الغَابَة القَوِيّ!', successAudio: 'مُمْتَاز! هَذَا أَسَد!' },
        fr: { title: 'Le Lion Roi', promptAudio: 'Touche le lion ! C\'est le roi puissant de la jungle !', successAudio: 'Bravo ! Voici un lion !' },
        en: { title: 'The King Lion', promptAudio: 'Touch the lion! He is the mighty king of the jungle!', successAudio: 'Well done! That is a lion!' },
      },
      visualAssets: {
        mainSvgOrImage: '👑',
        choices: [
          { id: 'lion', asset: '🦁', isCorrect: true },
          { id: 'sheep', asset: '🐑', isCorrect: false },
          { id: 'cat', asset: '🐱', isCorrect: false },
        ],
      },
    },
    {
      id: 'animals-sort-big-small',
      domain: 'animals',
      targetValue: 'sort',
      stepNumber: 7,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'كَبِيرٌ أَمْ صَغِيرٌ؟',
          promptAudio: 'سَاعِدْنِي! ضَعِ الحَيَوَانَاتِ الكَبِيرَةَ مَعَ الفِيلِ، وَالحَيَوَانَاتِ الصَّغِيرَةَ مَعَ الفَأْرِ!',
          successAudio: 'مُمْتَاز! رَتَّبْتَ كُلَّ الحَيَوَانَاتِ!',
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
      id: 'animals-favorite-food',
      domain: 'animals',
      targetValue: 'connect',
      stepNumber: 8,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'مَاذَا يَأْكُلُ كُلُّ حَيَوَانٍ؟',
          promptAudio: 'وَصِّلْ كُلَّ حَيَوَانٍ مَعَ طَعَامِهِ المُفَضَّل!',
          promptText: 'ساعد طفلك على مطابقة الحيوان مع طعامه.',
          successAudio: 'رَائِع! أَطْعَمْتَ كُلَّ الحَيَوَانَات!',
        },
        fr: {
          title: 'Que mange chaque animal ?',
          promptAudio: 'Relie chaque animal à son aliment préféré !',
          promptText: 'Aidez l\'enfant à associer l\'animal à sa nourriture.',
          successAudio: 'Bravo ! Tu as nourri tous les animaux !',
        },
        en: {
          title: 'What does each animal eat?',
          promptAudio: 'Match each animal with its favorite food!',
          promptText: 'Help your child match the animal to its food.',
          successAudio: 'Great! You fed every animal!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍽️',
        connectPairs: [
          { id: 'cow-grass', leftAsset: '🐄', rightAsset: '🌾' },
          { id: 'cat-fish', leftAsset: '🐱', rightAsset: '🐟' },
          { id: 'dog-bone', leftAsset: '🐶', rightAsset: '🦴' },
          { id: 'rabbit-carrot', leftAsset: '🐰', rightAsset: '🥕' },
        ],
      },
    },
    {
      id: 'animals-bubble-pop',
      domain: 'animals',
      targetValue: 3,
      stepNumber: 9,
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
    {
      id: 'animals-memory-farm',
      domain: 'animals',
      targetValue: 'memory',
      stepNumber: 10,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'ذَاكِرَةُ حَيَوَانَاتِ المَزْرَعَةِ',
          promptAudio: 'اِفْتَحِ البِطَاقَاتِ وَابْحَثْ عَنِ الحَيَوَانَيْنِ المُتَشَابِهَيْن!',
          promptText: 'شجعي طفلك على مطابقة البطاقات.',
          successAudio: 'ذَاكِرَةٌ رَائِعَة! أَحْسَنْتَ يَا بَطَل!',
        },
        fr: {
          title: 'Mémoire des Animaux',
          promptAudio: 'Retourne les cartes et trouve les paires d\'animaux pareils !',
          promptText: 'Aidez l\'enfant à mémoriser les cartes.',
          successAudio: 'Quelle mémoire formidable ! Félicitations !',
        },
        en: {
          title: 'Farm Animal Memory Game',
          promptAudio: 'Flip the cards and find the matching animal pairs!',
          promptText: 'Encourage your child to find the pairs.',
          successAudio: 'Super memory! Great job!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🐾',
        memoryPairs: [
          { id: 'mem-cow', asset: '🐄' },
          { id: 'mem-sheep', asset: '🐑' },
          { id: 'mem-chicken', asset: '🐔' },
        ],
      },
    },
  ],
};
