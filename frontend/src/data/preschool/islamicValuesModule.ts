import { PreschoolModule } from './types';

/**
 * "قِيَمِي وَإِيمَانِي الصَّغِيرُ" — Éveil islamique & valeurs (3-5 ans).
 *
 * No Quran recitation (TTS would distort verses). Concrete gestures:
 * Bismillah before food, Alhamdulillah after, Salam, mosque, sharing.
 */
export const ISLAMIC_VALUES_MODULE: PreschoolModule = {
  id: 'preschool-islamic-values',
  domain: 'values',
  icon: '🕌',
  totalSteps: 7,
  titleI18n: {
    ar: 'قِيَمِي وَإِيمَانِي الصَّغِيرُ',
    fr: 'Mes Valeurs & Ma Petite Foi',
    en: 'My Values & My Little Faith',
  },
  activities: [
    {
      id: 'values-mosque-path',
      domain: 'values',
      targetValue: 'mosque-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الطَّرِيقُ إِلَى المَسْجِد',
          promptAudio: 'اِسْحَبِ الفَنَكَ: بَيْت، تُفَّاحَة، سَلَام، هَدِيَّة، ثُمَّ المَسْجِد!',
          promptText: 'من البيت إلى المسجد، مع التحية والمشاركة.',
          successAudio: 'وَصَلْنَا إِلَى المَسْجِد! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Chemin vers la Mosquée',
          promptAudio: 'Glisse le fennec : maison, pomme, salut, cadeau, puis la mosquée !',
          promptText: 'De la maison à la mosquée, avec le salut et le partage.',
          successAudio: 'Nous voilà à la mosquée ! Bravo !',
        },
        en: {
          title: 'The Path to the Mosque',
          promptAudio: 'Drag the fennec: house, apple, greeting, gift, then the mosque!',
          promptText: 'From home to the mosque, with greeting and sharing.',
          successAudio: 'We reached the mosque! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'mosque',
        pathToken: { startAsset: '🏠', endAsset: '🕌', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 32, asset: '🏠', color: '#fed7aa' },
          { x: 40, y: 16, asset: '🍎', color: '#fecaca' },
          { x: 72, y: 28, asset: '🤝', color: '#bbf7d0' },
          { x: 84, y: 58, asset: '🎁', color: '#e9d5ff' },
          { x: 48, y: 78, asset: '🕌', color: '#86efac' },
        ],
      },
    },
    {
      id: 'values-bismillah',
      domain: 'values',
      targetValue: 'bismillah',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'بِسْمِ اللَّهِ',
          promptAudio: 'سَنَأْكُلُ! نَقُولُ بِسْمِ اللَّهِ. اِلْمَسِ التُّفَّاحَة!',
          promptText: 'قبل الأكل والشرب نقول بسم الله.',
          successAudio: 'بِسْمِ اللَّهِ! أَحْسَنْت!',
        },
        fr: {
          title: 'Bismillah',
          promptAudio: 'On va manger ! On dit Bismillah. Touche la pomme !',
          promptText: 'Avant de manger et de boire, on dit Bismillah.',
          successAudio: 'Bismillah ! Bravo !',
        },
        en: {
          title: 'Bismillah',
          promptAudio: 'We are going to eat! We say Bismillah. Touch the apple!',
          promptText: 'Before eating and drinking we say Bismillah.',
          successAudio: 'Bismillah! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍎',
        choices: [
          { id: 'food', asset: '🍎', isCorrect: true },
          { id: 'car',  asset: '🚗', isCorrect: false },
          { id: 'ball', asset: '⚽', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-alhamdulillah',
      domain: 'values',
      targetValue: 'alhamdulillah',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الحَمْدُ لِلَّهِ',
          promptAudio: 'انْتَهَيْنَا مِنَ الأَكْل! نَقُولُ الحَمْدُ لِلَّهِ. اِلْمَسِ اليَدَيْن!',
          promptText: 'بعد الأكل نشكر الله: الحمد لله.',
          successAudio: 'الحَمْدُ لِلَّهِ! شُكْراً!',
        },
        fr: {
          title: 'Alhamdulillah',
          promptAudio: 'On a fini de manger ! On dit Alhamdulillah. Touche les deux mains !',
          promptText: 'Après le repas, on remercie Allah : Alhamdulillah.',
          successAudio: 'Alhamdulillah ! Merci !',
        },
        en: {
          title: 'Alhamdulillah',
          promptAudio: 'We finished eating! We say Alhamdulillah. Touch the two hands!',
          promptText: 'After the meal we thank Allah: Alhamdulillah.',
          successAudio: 'Alhamdulillah! Thank you!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🤲',
        choices: [
          { id: 'thanks', asset: '🤲', isCorrect: true },
          { id: 'apple',  asset: '🍎', isCorrect: false },
          { id: 'toy',    asset: '🧸', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-salam',
      domain: 'values',
      targetValue: 'salam',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'السَّلَامُ عَلَيْكُمْ',
          promptAudio: 'نَرَى صَدِيقاً! نَقُولُ السَّلَامُ عَلَيْكُمْ. اِلْمَسِ اليَدَيْن!',
          promptText: 'نلقي السلام ونصافح برفق.',
          successAudio: 'وَعَلَيْكُمُ السَّلَام! أَحْسَنْت!',
        },
        fr: {
          title: 'As-salamu alaykum',
          promptAudio: 'On voit un ami ! On dit As-salamu alaykum. Touche les mains !',
          promptText: 'On salue et on serre la main gentiment.',
          successAudio: 'Wa alaykum as-salam ! Bravo !',
        },
        en: {
          title: 'As-salamu alaykum',
          promptAudio: 'We see a friend! We say As-salamu alaykum. Touch the hands!',
          promptText: 'We greet and shake hands kindly.',
          successAudio: 'Wa alaykum as-salam! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🤝',
        choices: [
          { id: 'handshake', asset: '🤝', isCorrect: true },
          { id: 'hide',      asset: '🙈', isCorrect: false },
          { id: 'car',       asset: '🚗', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-mosque-tap',
      domain: 'values',
      targetValue: 'mosque',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'هَذَا المَسْجِد',
          promptAudio: 'اِلْمَسِ المَسْجِد! المَسْجِدُ بَيْتُ الصَّلَاة!',
          promptText: 'المسجد مكان هادئ للصلاة.',
          successAudio: 'رَائِع! هَذَا مَسْجِد!',
        },
        fr: {
          title: 'Voici la Mosquée',
          promptAudio: 'Touche la mosquée ! La mosquée est la maison de la prière !',
          promptText: 'La mosquée est un lieu calme pour prier.',
          successAudio: 'Bravo ! Voici une mosquée !',
        },
        en: {
          title: 'This is the Mosque',
          promptAudio: 'Touch the mosque! The mosque is the house of prayer!',
          promptText: 'The mosque is a quiet place to pray.',
          successAudio: 'Great! That is a mosque!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        choices: [
          { id: 'mosque', asset: '🕌', isCorrect: true },
          { id: 'house',  asset: '🏠', isCorrect: false },
          { id: 'school', asset: '🏫', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-good-manners',
      domain: 'values',
      targetValue: 'manners',
      stepNumber: 6,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أَخْلَاقِي الجَمِيلَة',
          promptAudio: 'ضَعِ الهَدِيَّةَ وَالعِنَاقَ مَعَ الوَجْهِ الضَّاحِك، وَالصُّرَاخَ مَعَ الوَجْهِ الحَزِين!',
          promptText: 'نشارك ونساعد. لا نصرخ ولا نرمي الأوساخ.',
          successAudio: 'أَخْلَاقُكَ جَمِيلَة! أَنْتَ طِفْلٌ طَيِّب!',
        },
        fr: {
          title: 'Mes Bonnes Manières',
          promptAudio: 'Mets le cadeau et le câlin avec le visage joyeux, le cri avec le visage triste !',
          promptText: 'On partage et on aide. On ne crie pas, on ne jette pas par terre.',
          successAudio: 'Tes manières sont belles ! Tu es un enfant gentil !',
        },
        en: {
          title: 'My Good Manners',
          promptAudio: 'Put the gift and the hug with the happy face, the shout with the sad face!',
          promptText: 'We share and help. We do not shout or throw trash.',
          successAudio: 'Your manners are beautiful! You are a kind child!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '💛',
        sortBins: [
          { id: 'kind', labelAsset: '😄' },
          { id: 'needs-practice', labelAsset: '🙁' },
        ],
        sortItems: [
          { id: 'share',  asset: '🎁', correctBinId: 'kind' },
          { id: 'hug',    asset: '🤗', correctBinId: 'kind' },
          { id: 'help',   asset: '🤝', correctBinId: 'kind' },
          { id: 'shout',  asset: '📢', correctBinId: 'needs-practice' },
          { id: 'litter', asset: '🗑️', correctBinId: 'needs-practice' },
          { id: 'ignore', asset: '🙉', correctBinId: 'needs-practice' },
        ],
      },
    },
    {
      id: 'values-memory',
      domain: 'values',
      targetValue: 'values-memory',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ قِيَمِي',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: مَسْجِد، سَلَام، تُفَّاحَة!',
          promptText: 'ثلاث أزواج : مسجد، سلام، طعام (بسم الله).',
          successAudio: 'بَرَاوَ! قِيَمُكَ جَمِيلَة!',
        },
        fr: {
          title: 'Mémo de Ma Petite Foi',
          promptAudio: 'Retourne les cartes ! Dis : mosquée, salut, pomme !',
          promptText: 'Trois paires : mosquée, salut, nourriture (Bismillah).',
          successAudio: 'Bravo ! Tes valeurs sont belles !',
        },
        en: {
          title: 'My Little Faith Memory',
          promptAudio: 'Flip the cards! Say: mosque, greeting, apple!',
          promptText: 'Three pairs: mosque, greeting, food (Bismillah).',
          successAudio: 'Bravo! Your values are beautiful!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-mosque', asset: '🕌' },
          { id: 'mem-salam',  asset: '🤝' },
          { id: 'mem-apple',  asset: '🍎' },
        ],
      },
    },
  ],
};
