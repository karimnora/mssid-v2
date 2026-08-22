import { PreschoolModule } from './types';

/**
 * "جِسْمِي الرَّائِعُ" — Mon Corps (Éducation Scientifique 0AP).
 * Covers: face parts, limbs, five senses, hygiene habits.
 * Interaction mix: find_path, tap_choice ×4, connect_dots, sorting, memory_cards.
 */
export const BODY_MODULE: PreschoolModule = {
  id: 'preschool-body',
  domain: 'world',
  icon: '🧍',
  totalSteps: 7,
  titleI18n: {
    ar: 'جِسْمِي الرَّائِعُ',
    fr: 'Mon Corps Merveilleux',
    en: 'My Amazing Body',
  },
  activities: [
    {
      id: 'body-fennec-wash',
      domain: 'world',
      targetValue: 'hygiene',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الفَنَكُ يَغْسِلُ يَدَيْهِ',
          promptAudio: 'اِسْحَبِ الفَنَكَ: يَدَان، صَابُون، مَاء، فُقَّاعَات، ثُمَّ المِنْشَفَة!',
          promptText: 'اسحب الفنك على خطوات غسل اليدين حتى المنشفة.',
          successAudio: 'أَحْسَنْتَ! يَدَانِ نَظِيفَتَانِ تُبْعِدَانِ الجَرَاثِيم!',
        },
        fr: {
          title: 'Le Fennec se lave les mains',
          promptAudio: 'Glisse le fennec : mains, savon, eau, bulles, puis la serviette !',
          promptText: 'Aidez l\'enfant à suivre les étapes du lavage des mains.',
          successAudio: 'Bravo ! Des mains propres éloignent les microbes !',
        },
        en: {
          title: 'The Fennec Washes His Hands',
          promptAudio: 'Drag the fennec: hands, soap, water, bubbles, then the towel!',
          promptText: 'Help the child follow the hand-washing steps.',
          successAudio: 'Well done! Clean hands keep germs away!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'bath',
        pathToken: { startAsset: '🖐️', endAsset: '🧻', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 30, asset: '🖐️', color: '#fecaca' },
          { x: 40, y: 18, asset: '🧴', color: '#e9d5ff' },
          { x: 72, y: 28, asset: '🚿', color: '#bae6fd' },
          { x: 82, y: 58, asset: '🫧', color: '#e0f2fe' },
          { x: 52, y: 76, asset: '💧', color: '#a5f3fc' },
          { x: 20, y: 78, asset: '🧻', color: '#fef9c3' },
        ],
      },
    },
    {
      id: 'body-eyes',
      domain: 'world',
      targetValue: 'eyes',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'العَيْنَانِ',
          promptAudio: 'اِلْمَسِ العَيْنَيْنِ! نَرَى بِهِمَا كُلَّ الأَلْوَانِ وَالأَشْكَال!',
          promptText: 'ساعد طفلك على تمييز العينين بين أجزاء الوجه.',
          successAudio: 'رَائِعٌ! عَيْنَاكَ جَمِيلَتَانِ وَتَرَيَانِ كُلَّ شَيْء!',
        },
        fr: {
          title: 'Les Yeux',
          promptAudio: 'Touche les yeux ! On voit toutes les couleurs et toutes les formes avec eux !',
          promptText: 'Aidez l\'enfant à identifier les yeux parmi les parties du visage.',
          successAudio: 'Excellent ! Tes yeux sont magnifiques et voient tout !',
        },
        en: {
          title: 'The Eyes',
          promptAudio: 'Touch the eyes! We see all colors and shapes with them!',
          promptText: 'Help the child identify the eyes among face parts.',
          successAudio: 'Excellent! Your eyes are beautiful and see everything!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👁️',
        choices: [
          { id: 'eyes', asset: '👁️', isCorrect: true },
          { id: 'mouth', asset: '👄', isCorrect: false },
          { id: 'ear', asset: '👂', isCorrect: false },
        ],
      },
    },
    {
      id: 'body-ears',
      domain: 'world',
      targetValue: 'ears',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الأُذُنَانِ',
          promptAudio: 'اِلْمَسِ الأُذُنَيْنِ! نَسْمَعُ بِهِمَا الأَصْوَاتَ وَالمُوسِيقَى الجَمِيلَة!',
          promptText: 'اطلب من الطفل أن يشير إلى أذنيه.',
          successAudio: 'بَرَاوَ! أُذُنَاكَ تَسْمَعَانِ كُلَّ الأَصْوَات!',
        },
        fr: {
          title: 'Les Oreilles',
          promptAudio: 'Touche les oreilles ! On entend les sons et la belle musique avec elles !',
          promptText: 'Demandez à l\'enfant de montrer ses oreilles.',
          successAudio: 'Bravo ! Tes oreilles entendent tous les sons !',
        },
        en: {
          title: 'The Ears',
          promptAudio: 'Touch the ears! We hear sounds and beautiful music with them!',
          promptText: 'Ask the child to point to their ears.',
          successAudio: 'Bravo! Your ears can hear every sound!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👂',
        choices: [
          { id: 'ear', asset: '👂', isCorrect: true },
          { id: 'eye', asset: '👁️', isCorrect: false },
          { id: 'hand', asset: '🖐️', isCorrect: false },
        ],
      },
    },
    {
      id: 'body-hands',
      domain: 'world',
      targetValue: 'hands',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اليَدَانِ',
          promptAudio: 'اِلْمَسِ اليَدَيْنِ! نَلْمَسُ بِهِمَا وَنَرْسُمُ وَنَبْنِي وَنَأْكُل!',
          promptText: 'شجّع طفلك على مشاهدة يديه وتحريكهما.',
          successAudio: 'أَحْسَنْت! يَدَاكَ رَائِعَتَانِ وَتَصْنَعَانِ كُلَّ شَيْء!',
        },
        fr: {
          title: 'Les Mains',
          promptAudio: 'Touche les mains ! On touche, dessine, construit et mange avec elles !',
          promptText: 'Encouragez l\'enfant à regarder et bouger ses mains.',
          successAudio: 'Super ! Tes mains sont formidables et font tout !',
        },
        en: {
          title: 'The Hands',
          promptAudio: 'Touch the hands! We touch, draw, build and eat with them!',
          promptText: 'Encourage the child to look at and move their hands.',
          successAudio: 'Great! Your hands are amazing and can do everything!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🖐️',
        choices: [
          { id: 'hand', asset: '🖐️', isCorrect: true },
          { id: 'foot', asset: '🦶', isCorrect: false },
          { id: 'nose', asset: '👃', isCorrect: false },
        ],
      },
    },
    {
      id: 'body-senses',
      domain: 'world',
      targetValue: 'senses',
      stepNumber: 5,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'الحَوَاسُّ الخَمْسُ',
          promptAudio: 'اِرْبِطْ: الأَنْفُ يَشُمُّ، وَالأُذُنُ تَسْمَعُ، وَالعَيْنُ تَرَى!',
          promptText: 'ساعد طفلك على ربط كل حاسة بوظيفتها.',
          successAudio: 'رَائِعٌ جِدَّاً! حَوَاسُّكَ الخَمْسُ هِيَ هِبَةٌ مِنَ اللَّه!',
        },
        fr: {
          title: 'Les Cinq Sens',
          promptAudio: 'Relie : le nez sent, l\'oreille entend, l\'œil voit !',
          promptText: 'Aidez l\'enfant à relier chaque sens à sa fonction.',
          successAudio: 'Magnifique ! Tes cinq sens sont un cadeau extraordinaire !',
        },
        en: {
          title: 'The Five Senses',
          promptAudio: 'Match them: the nose smells, the ear hears, the eye sees!',
          promptText: 'Help the child match each sense to its function.',
          successAudio: 'Amazing! Your five senses are a wonderful gift!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🌟',
        connectPairs: [
          { id: 'eye-see',   leftAsset: '👁️', rightAsset: '🌈' },
          { id: 'ear-hear',  leftAsset: '👂', rightAsset: '🎵' },
          { id: 'nose-smell',leftAsset: '👃', rightAsset: '🌸' },
          { id: 'hand-touch',leftAsset: '🖐️', rightAsset: '🧸' },
        ],
      },
    },
    {
      id: 'body-sorting',
      domain: 'world',
      targetValue: 'body-parts',
      stepNumber: 6,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'وَجْهٌ أَمْ يَدٌ وَقَدَم؟',
          promptAudio: 'صَنِّفِ الصُّوَر! أَجْزَاءُ الوَجْهِ فِي مَكَانِهَا وَالأَطْرَافُ فِي مَكَانِهَا!',
          promptText: 'ساعد طفلك على تمييز أجزاء الوجه عن الأطراف.',
          successAudio: 'مُمْتَاز! أَنْتَ تَعْرِفُ جِسْمَكَ جَيِّداً جِدَّاً!',
        },
        fr: {
          title: 'Visage ou Main/Pied ?',
          promptAudio: 'Classe les images ! Les parties du visage dans le visage et les membres dans le corps !',
          promptText: 'Aidez l\'enfant à distinguer les parties du visage des membres.',
          successAudio: 'Super ! Tu connais très bien ton corps !',
        },
        en: {
          title: 'Face or Hand/Foot?',
          promptAudio: 'Sort the pictures! Face parts in the face zone and limbs in the body zone!',
          promptText: 'Help the child distinguish face parts from limbs.',
          successAudio: 'Excellent! You know your body very well!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧍',
        sortBins: [
          { id: 'face',  labelAsset: '😊' },
          { id: 'limbs', labelAsset: '🦵' },
        ],
        sortItems: [
          { id: 'sort-eye',   asset: '👁️', correctBinId: 'face'  },
          { id: 'sort-nose',  asset: '👃', correctBinId: 'face'  },
          { id: 'sort-mouth', asset: '👄', correctBinId: 'face'  },
          { id: 'sort-ear',   asset: '👂', correctBinId: 'face'  },
          { id: 'sort-hand',  asset: '🖐️', correctBinId: 'limbs' },
          { id: 'sort-foot',  asset: '🦶', correctBinId: 'limbs' },
        ],
      },
    },
    {
      id: 'body-memory',
      domain: 'world',
      targetValue: 'body-memory',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ أَجْزَاءَ الجِسْم',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ وَاجِدِ الأَزْوَاجَ المُتَشَابِهَة! قُلِ اسْمَ كُلِّ جُزْءٍ بِصَوْتٍ عَالٍ!',
          promptText: 'شجّع طفلك على نطق اسم كل جزء يكتشفه.',
          successAudio: 'بَرَاوَ بَطَل! ذَاكِرَتُكَ قَوِيَّةٌ وَرَائِعَة!',
        },
        fr: {
          title: 'Mémo du Corps',
          promptAudio: 'Retourne les cartes et trouve les paires ! Dis le nom de chaque partie à voix haute !',
          promptText: 'Encouragez l\'enfant à nommer chaque partie qu\'il découvre.',
          successAudio: 'Bravo champion ! Ta mémoire est incroyablement forte !',
        },
        en: {
          title: 'Body Memory Game',
          promptAudio: 'Flip the cards and find the matching pairs! Say the name of each body part out loud!',
          promptText: 'Encourage the child to name each body part they discover.',
          successAudio: 'Bravo champion! Your memory is incredibly strong!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-eyes',  asset: '👁️' },
          { id: 'mem-hands', asset: '🖐️' },
          { id: 'mem-feet',  asset: '🦶' },
        ],
      },
    },
  ],
};
