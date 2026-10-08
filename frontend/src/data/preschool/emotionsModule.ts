import { PreschoolModule } from './types';

/**
 * "مَشَاعِرُنَا" — Nos Émotions (3-5 ans).
 * Each feeling is tied to a concrete situation (ballon, glace tombée, tour cassée)
 * — never four "find the face" in a row with no story.
 */
export const EMOTIONS_MODULE: PreschoolModule = {
  id: 'preschool-emotions',
  domain: 'values',
  icon: '😊',
  totalSteps: 8,
  titleI18n: {
    ar: 'مَشَاعِرُنَا وَأَحَاسِيسُنَا',
    fr: 'Nos Émotions',
    en: 'Our Feelings',
  },
  activities: [
    {
      id: 'emotion-feelings-path',
      domain: 'values',
      targetValue: 'feelings-path',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'طَرِيقُ المَشَاعِر',
          promptAudio: 'اِسْحَبِ الفَنَكَ: فَرَح، بَالُون، حُزْن، لَصْقَة، ثُمَّ عِنَاق!',
          promptText: 'كل المشاعر مقبولة. ننتهي بعناق.',
          successAudio: 'كُلُّ المَشَاعِرِ مَقْبُولَة! أَحْسَنْت!',
        },
        fr: {
          title: 'Le Chemin des Émotions',
          promptAudio: 'Glisse le fennec : joie, ballon, tristesse, pansement, puis un câlin !',
          promptText: 'Toutes les émotions sont OK. On finit par un câlin.',
          successAudio: 'Toutes les émotions sont OK ! Bravo !',
        },
        en: {
          title: 'The Feelings Path',
          promptAudio: 'Drag the fennec: joy, balloon, sadness, bandage, then a hug!',
          promptText: 'Every feeling is OK. We finish with a hug.',
          successAudio: 'Every feeling is OK! Well done!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'feelings',
        pathToken: { startAsset: '😊', endAsset: '🤗', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 30, asset: '😊', color: '#fde68a' },
          { x: 42, y: 16, asset: '🎈', color: '#fecaca' },
          { x: 74, y: 28, asset: '😢', color: '#bfdbfe' },
          { x: 84, y: 58, asset: '🩹', color: '#e9d5ff' },
          { x: 48, y: 78, asset: '🤗', color: '#bbf7d0' },
        ],
      },
    },
    {
      id: 'emotion-happy',
      domain: 'values',
      targetValue: '😊',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'بَالُونُ الفَرَح',
          promptAudio: 'عِنْدَنَا بَالُون! اِلْمَسِ الوَجْهَ الفَرِح!',
          promptText: 'البالون والهدية والحفل = فرح.',
          successAudio: 'نَعَم! هَذَا الفَرَح!',
        },
        fr: {
          title: 'Le Ballon de la Joie',
          promptAudio: 'On a un ballon ! Touche le visage joyeux !',
          promptText: 'Ballon, cadeau, fête = joie.',
          successAudio: 'Oui ! C\'est la joie !',
        },
        en: {
          title: 'The Joy Balloon',
          promptAudio: 'We have a balloon! Touch the happy face!',
          promptText: 'Balloon, gift, party = joy.',
          successAudio: 'Yes! That is joy!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎈',
        choices: [
          { id: 'happy', asset: '😊', isCorrect: true },
          { id: 'sad',   asset: '😢', isCorrect: false },
          { id: 'angry', asset: '😠', isCorrect: false },
        ],
      },
    },
    {
      id: 'emotion-sad',
      domain: 'values',
      targetValue: '😢',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'سَقَطَتِ الآيْس كْرِيم',
          promptAudio: 'سَقَطَتِ الآيْس كْرِيم! اِلْمَسِ الوَجْهَ الحَزِين!',
          promptText: 'عندما نفقد شيئاً نحزن. نعطيه عناقاً.',
          successAudio: 'نَعَم، هَذَا الحُزْن. نُعَانِقُكَ!',
        },
        fr: {
          title: 'La Glace est Tombée',
          promptAudio: 'La glace est tombée ! Touche le visage triste !',
          promptText: 'Quand on perd quelque chose, on est triste. On fait un câlin.',
          successAudio: 'Oui, c\'est la tristesse. On te fait un câlin !',
        },
        en: {
          title: 'The Ice Cream Fell',
          promptAudio: 'The ice cream fell! Touch the sad face!',
          promptText: 'When we lose something we feel sad. We give a hug.',
          successAudio: 'Yes, that is sadness. We hug you!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍦',
        choices: [
          { id: 'sad',   asset: '😢', isCorrect: true },
          { id: 'happy', asset: '😊', isCorrect: false },
          { id: 'wow',   asset: '😮', isCorrect: false },
        ],
      },
    },
    {
      id: 'emotion-angry',
      domain: 'values',
      targetValue: '😠',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'سَقَطَ البُرْج',
          promptAudio: 'سَقَطَ بُرْجُ المُكَعَّبَات! اِلْمَسِ الوَجْهَ الغَاضِب!',
          promptText: 'الغضب يأتي ثم يمر. نتنفس ونبني من جديد.',
          successAudio: 'الغَضَبُ يَمُرّ! نَبْنِي مَرَّةً أُخْرَى!',
        },
        fr: {
          title: 'La Tour est Tombée',
          promptAudio: 'La tour de cubes est tombée ! Touche le visage fâché !',
          promptText: 'La colère vient puis passe. On respire et on reconstruit.',
          successAudio: 'La colère passe ! On reconstruit !',
        },
        en: {
          title: 'The Tower Fell',
          promptAudio: 'The block tower fell! Touch the angry face!',
          promptText: 'Anger comes then goes. We breathe and build again.',
          successAudio: 'Anger passes! We build again!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧱',
        choices: [
          { id: 'angry',  asset: '😠', isCorrect: true },
          { id: 'happy',  asset: '😊', isCorrect: false },
          { id: 'scared', asset: '😨', isCorrect: false },
        ],
      },
    },
    {
      id: 'emotion-sort-context',
      domain: 'values',
      targetValue: 'emotions-sort',
      stepNumber: 5,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'فَرَحٌ أَمْ حُزْن؟',
          promptAudio: 'ضَعِ البَالُونَ وَالهَدِيَّةَ مَعَ الضِّحْكَة، وَاللَّصْقَةَ مَعَ الدَّمْعَة!',
          promptText: 'فرح: حفلة، هدية، طائرة ورقية. حزن: جرح، لعبة ضائعة — ليس المطر (في الجزائر المطر غالباً فرحة).',
          successAudio: 'تَعْرِفُ الفَرَحَ وَالحُزْن!',
        },
        fr: {
          title: 'Joie ou Tristesse ?',
          promptAudio: 'Mets le ballon et le cadeau avec le sourire, le pansement avec la larme !',
          promptText: 'Joie : fête, cadeau, cerf-volant. Tristesse : bobos, jouet perdu — pas la pluie (en Algérie la pluie est souvent une joie).',
          successAudio: 'Tu connais la joie et la tristesse !',
        },
        en: {
          title: 'Joy or Sadness?',
          promptAudio: 'Put the balloon and the gift with the smile, the bandage with the tear!',
          promptText: 'Joy: party, gift, kite. Sadness: boo-boo, lost toy — not rain (in Algeria rain is often a joy).',
          successAudio: 'You know joy and sadness!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🎭',
        sortBins: [
          { id: 'happy_bin', labelAsset: '😊' },
          { id: 'sad_bin',   labelAsset: '😢' },
        ],
        sortItems: [
          { id: 'balloon', asset: '🎈', correctBinId: 'happy_bin' },
          { id: 'gift',    asset: '🎁', correctBinId: 'happy_bin' },
          { id: 'kite',    asset: '🪁', correctBinId: 'happy_bin' },
          { id: 'boo-boo', asset: '🩹', correctBinId: 'sad_bin'   },
          { id: 'lost',    asset: '🧸', correctBinId: 'sad_bin'   },
          { id: 'tear',    asset: '💧', correctBinId: 'sad_bin'   },
        ],
      },
    },
    {
      id: 'emotion-connect',
      domain: 'values',
      targetValue: 'emotion-pairs',
      stepNumber: 6,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'اِرْبِطِ الشُّعُورَ بِالصُّورَة',
          promptAudio: 'اِرْبِطِ الفَرَحَ بِالبَالُون، وَالحُزْنَ بِاللَّصْقَة!',
          promptText: 'فرح↔بالون، حزن↔لصقة، غضب↔مكعبات، مفاجأة↔هدية.',
          successAudio: 'كُلُّ شُعُورٍ لَهُ صُورَة!',
        },
        fr: {
          title: 'Relie le Sentiment à l\'Image',
          promptAudio: 'Relie la joie au ballon, et la tristesse au pansement !',
          promptText: 'Joie↔ballon, tristesse↔pansement, colère↔cubes, surprise↔cadeau.',
          successAudio: 'Chaque sentiment a son image !',
        },
        en: {
          title: 'Match the Feeling to the Picture',
          promptAudio: 'Match joy to the balloon, and sadness to the bandage!',
          promptText: 'Joy↔balloon, sadness↔bandage, anger↔blocks, surprise↔gift.',
          successAudio: 'Every feeling has a picture!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🔗',
        connectPairs: [
          { id: 'joy-balloon',    leftAsset: '😊', rightAsset: '🎈' },
          { id: 'sad-bandaid',    leftAsset: '😢', rightAsset: '🩹' },
          { id: 'angry-blocks',   leftAsset: '😠', rightAsset: '🧱' },
          { id: 'surprise-gift',  leftAsset: '😲', rightAsset: '🎁' },
        ],
      },
    },
    {
      id: 'emotion-memory',
      domain: 'values',
      targetValue: 'emotion-memory',
      stepNumber: 7,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرِ المَشَاعِر',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: فَرِح، حَزِين، غَاضِب!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'ذَاكِرَتُكَ قَوِيَّة!',
        },
        fr: {
          title: 'Mémo des Émotions',
          promptAudio: 'Retourne les cartes ! Dis : joyeux, triste, fâché !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Tu as une super mémoire !',
        },
        en: {
          title: 'Feelings Memory',
          promptAudio: 'Flip the cards! Say: happy, sad, angry!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Your memory is super!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'mem-happy', asset: '😊' },
          { id: 'mem-sad',   asset: '😢' },
          { id: 'mem-angry', asset: '😠' },
        ],
      },
    },
    {
      id: 'emotion-hug',
      domain: 'values',
      targetValue: 'hug',
      stepNumber: 8,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'صَدِيقِي يَبْكِي',
          promptAudio: 'الصَّدِيقُ حَزِين! مَاذَا نَفْعَل؟ اِلْمَسِ العِنَاق!',
          promptText: 'عندما يحزن الصديق: عناق، لا غضب ولا تجاهل.',
          successAudio: 'نَعَمْ! العِنَاقُ يُسَاعِد!',
        },
        fr: {
          title: 'Mon Ami Pleure',
          promptAudio: 'L\'ami est triste ! Que fait-on ? Touche le câlin !',
          promptText: 'Quand un ami est triste : un câlin, pas de colère ni d\'ignorance.',
          successAudio: 'Oui ! Le câlin aide !',
        },
        en: {
          title: 'My Friend is Crying',
          promptAudio: 'The friend is sad! What do we do? Touch the hug!',
          promptText: 'When a friend is sad: a hug, not anger or looking away.',
          successAudio: 'Yes! A hug helps!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '😢',
        choices: [
          { id: 'hug',   asset: '🤗', isCorrect: true },
          { id: 'angry', asset: '😠', isCorrect: false },
          { id: 'hide',  asset: '🙈', isCorrect: false },
        ],
      },
    },
  ],
};
