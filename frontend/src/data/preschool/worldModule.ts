import { PreschoolModule } from './types';

// "عَالَمِي الصَّغِيرُ وَرُوتِينِي" — Discovery of the World, Animals & Daily Routine.
// 1. "أصدقاء الغابة والصحراء": Reconnaissance des animaux d'Algérie (الجمل، الفنك، الغزال)
// 2. "روتين الصباح": Ordonner et ranger les moments de la journée
// 3. "أصوات الحيوانات": Association de l'animal et son habitat
export const WORLD_MODULE: PreschoolModule = {
  id: 'preschool-world',
  domain: 'animals',
  icon: '🌍',
  totalSteps: 3,
  titleI18n: {
    ar: 'عَالَمِي الصَّغِيرُ وَقِيَمِي',
    fr: 'Mon Petit Monde & Valeurs',
    en: 'My Little World & Values',
  },
  activities: [
    {
      id: 'world-algerian-animals',
      domain: 'animals',
      targetValue: 'camel',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَدِيقُنَا سَفِينَةُ الصَّحْرَاءِ',
          promptAudio: 'أَيْنَ صَدِيقُنَا الجَمَلُ الَّذِي يَعِيشُ فِي الصَّحْرَاءِ؟ اِلْمِسْهُ!',
          promptText: 'ساعد طفلك على التعرف على الجمل في الصحراء.',
          successAudio: 'أَحْسَنْت! هَذَا صَدِيقُنَا الجَمَلُ القَوِيّ!',
        },
        fr: {
          title: 'Les Animaux du Sahara',
          promptAudio: 'Où est notre ami le dromadaire du désert ? Touche-le !',
          promptText: 'Invitez l\'enfant à toucher le dromadaire.',
          successAudio: 'Super ! C\'est le dromadaire, le roi des dunes !',
        },
        en: {
          title: 'Animals of the Desert',
          promptAudio: 'Where is our friend the camel who lives in the desert? Tap him!',
          promptText: 'Help your child tap the camel.',
          successAudio: 'Well done! That is our strong camel friend!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏜️',
        choices: [
          { id: 'camel', asset: '🐪', isCorrect: true },
          { id: 'penguin', asset: '🐧', isCorrect: false },
          { id: 'octopus', asset: '🐙', isCorrect: false },
        ],
      },
    },
    {
      id: 'world-morning-routine',
      domain: 'animals',
      targetValue: 'hygiene',
      stepNumber: 2,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'رُوتِينِي الصَّبَاحِيُّ النَّشِيطُ',
          promptAudio: 'ضَعْ أَدَوَاتِ النَّظَافَةِ مَعَ المَغْسَلَةِ، وَالأَلْعَابَ فِي صُنْدُوقِ الأَلْعَابِ!',
          promptText: 'شجع طفلك على فرز أدوات النظافة وأدوات اللعب.',
          successAudio: 'نَظَافَةٌ وَتَرْتِيبٌ رَائِعَان! أَنْتَ بَطَلٌ مُهَذَّبٌ وَنَشِيط!',
        },
        fr: {
          title: 'Ma Belle Routine du Matin',
          promptAudio: 'Mets les affaires de toilette près du lavabo, et les jouets dans le coffre !',
          promptText: 'Aidez l\'enfant à trier les objets d\'hygiène et les jouets.',
          successAudio: 'Bravo ! Tu es très propre et bien ordonné !',
        },
        en: {
          title: 'My Morning Routine',
          promptAudio: 'Put hygiene items near the sink and toys in the toy box!',
          promptText: 'Help your child sort hygiene items and toys.',
          successAudio: 'Splendid! You are tidy, clean and smart!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧼',
        sortBins: [
          { id: 'hygiene', labelAsset: '🪥' },
          { id: 'toys', labelAsset: '🧸' },
        ],
        sortItems: [
          { id: 'soap', asset: '🧼', correctBinId: 'hygiene' },
          { id: 'brush', asset: '🪥', correctBinId: 'hygiene' },
          { id: 'car', asset: '🚗', correctBinId: 'toys' },
          { id: 'ball', asset: '⚽', correctBinId: 'toys' },
        ],
      },
    },
    {
      id: 'world-match-homes',
      domain: 'animals',
      targetValue: 'habitat',
      stepNumber: 3,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'كُلُّ حَيَوَانٍ فِي بَيْتِهِ',
          promptAudio: 'وَصِّلْ كُلَّ حَيَوَانٍ مَعَ بَيْتِهِ الجَمِيل!',
          promptText: 'ساعد طفلك على مطابقة الحيوان مع موطنه.',
          successAudio: 'عَادَتْ كُلُّ الحَيَوَانَاتِ إِلَى بُيُوتِهَا الدَّافِئَة! بَرَافُو!',
        },
        fr: {
          title: 'Chaque Animal dans sa Maison',
          promptAudio: 'Relie chaque animal à sa jolie maison !',
          promptText: 'Aidez l\'enfant à relier chaque animal à son abri.',
          successAudio: 'Magnifique ! Tous les animaux sont bien à l\'abri !',
        },
        en: {
          title: 'Each Animal at Home',
          promptAudio: 'Match each animal with its cozy home!',
          promptText: 'Help your child match each animal to its home.',
          successAudio: 'Wonderful! All animals are back home safely!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏕️',
        connectPairs: [
          { id: 'bird-nest', leftAsset: '🐦', rightAsset: '🪺' },
          { id: 'bee-hive', leftAsset: '🐝', rightAsset: '🍯' },
          { id: 'fish-sea', leftAsset: '🐟', rightAsset: '🌊' },
        ],
      },
    },
  ],
};
