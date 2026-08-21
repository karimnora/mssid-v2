import { PreschoolModule } from './types';

/**
 * "عَائِلَتِي الحَبِيبَة" — Ma Famille (Éducation Civique 0AP).
 * Name family members with a concrete tap (maman, papa, papi, bébé).
 * Roles are objects of daily life (story, bottle, ball, tea) — not gendered jobs.
 */
export const FAMILY_MODULE: PreschoolModule = {
  id: 'preschool-family',
  domain: 'values',
  icon: '👨‍👩‍👧‍👦',
  totalSteps: 8,
  titleI18n: {
    ar: 'عَائِلَتِي الحَبِيبَة',
    fr: 'Ma Chère Famille',
    en: 'My Dear Family',
  },
  activities: [
    {
      id: 'family-fennec-home',
      domain: 'values',
      targetValue: 'family',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الفَنَكُ يَعُودُ إِلَى البَيْت',
          promptAudio: 'اِسْحَبِ الفَنَكَ: بَاب، صَالُون، مَطْبَخ، غُرْفَة، ثُمَّ العَائِلَة!',
          promptText: 'اسحب الفنك من غرفة إلى غرفة حتى يجد عائلته.',
          successAudio: 'أَهْلاً بِالعَائِلَة! البَيْتُ دَافِئ!',
        },
        fr: {
          title: 'Le Fennec Rentre Chez Lui',
          promptAudio: 'Glisse le fennec : porte, salon, cuisine, chambre, puis la famille !',
          promptText: 'Aidez l\'enfant à visiter chaque pièce jusqu\'à la famille.',
          successAudio: 'Bienvenue à la maison ! Rien de mieux que sa famille !',
        },
        en: {
          title: 'The Fennec Goes Home',
          promptAudio: 'Drag the fennec: door, living room, kitchen, bedroom, then the family!',
          promptText: 'Help the child visit each room until the family.',
          successAudio: 'Welcome home! Nothing is better than family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'home',
        pathToken: { startAsset: '🚪', endAsset: '👨‍👩‍👧', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 32, asset: '🚪', color: '#fed7aa' },
          { x: 40, y: 18, asset: '🛋️', color: '#e9d5ff' },
          { x: 74, y: 28, asset: '🍳', color: '#fecaca' },
          { x: 84, y: 60, asset: '🛏️', color: '#bae6fd' },
          { x: 48, y: 78, asset: '👨‍👩‍👧', color: '#bbf7d0' },
        ],
      },
    },
    {
      id: 'family-mom',
      domain: 'values',
      targetValue: 'mom',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أُمِّي',
          promptAudio: 'اِلْمَسْ أُمِّي! أُمِّي تَحْضُنُنِي!',
          promptText: 'ساعد الطفل على تمييز صورة الأم.',
          successAudio: 'أَحْسَنْت! هَذِهِ أُمُّك!',
        },
        fr: {
          title: 'Maman',
          promptAudio: 'Touche maman ! Maman me serre dans ses bras !',
          promptText: 'Aidez l\'enfant à reconnaître maman.',
          successAudio: 'Bravo ! Voici maman !',
        },
        en: {
          title: 'Mom',
          promptAudio: 'Touch mom! Mom gives me a hug!',
          promptText: 'Help the child recognise mom.',
          successAudio: 'Well done! That is mom!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👩',
        choices: [
          { id: 'mom', asset: '👩', isCorrect: true },
          { id: 'dad', asset: '👨', isCorrect: false },
          { id: 'granny', asset: '👵', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-dad',
      domain: 'values',
      targetValue: 'dad',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَبِي',
          promptAudio: 'اِلْمَسْ أَبِي! أَبِي يَلْعَبُ مَعِي!',
          promptText: 'ساعد الطفل على تمييز صورة الأب.',
          successAudio: 'بَرَاوَ! هَذَا أَبُوك!',
        },
        fr: {
          title: 'Papa',
          promptAudio: 'Touche papa ! Papa joue avec moi !',
          promptText: 'Aidez l\'enfant à reconnaître papa.',
          successAudio: 'Bravo ! Voici papa !',
        },
        en: {
          title: 'Dad',
          promptAudio: 'Touch dad! Dad plays with me!',
          promptText: 'Help the child recognise dad.',
          successAudio: 'Bravo! That is dad!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👨',
        choices: [
          { id: 'dad', asset: '👨', isCorrect: true },
          { id: 'mom', asset: '👩', isCorrect: false },
          { id: 'grandpa', asset: '👴', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-grandparents',
      domain: 'values',
      targetValue: 'grandparents',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'جَدِّي',
          promptAudio: 'اِلْمَسْ جَدِّي! جَدِّي يَحْكِي لِي القِصَص!',
          promptText: 'نحترم الجد والجدة ونحبهما.',
          successAudio: 'أَحْسَنْت! نُحِبُّ جَدَّنَا!',
        },
        fr: {
          title: 'Papi',
          promptAudio: 'Touche papi ! Papi me raconte des histoires !',
          promptText: 'On respecte et on aime beaucoup papi et mamie.',
          successAudio: 'Bravo ! On aime papi !',
        },
        en: {
          title: 'Grandpa',
          promptAudio: 'Touch grandpa! Grandpa tells me stories!',
          promptText: 'We respect and love grandpa and grandma.',
          successAudio: 'Well done! We love grandpa!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👴',
        choices: [
          { id: 'grandpa', asset: '👴', isCorrect: true },
          { id: 'boy',     asset: '👦', isCorrect: false },
          { id: 'mom',     asset: '👩', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-grandma',
      domain: 'values',
      targetValue: 'grandma',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'جَدَّتِي',
          promptAudio: 'اِلْمَسْ جَدَّتِي! جَدَّتِي تُحِبُّنِي كَثِيراً!',
          promptText: 'ساعد الطفل على تمييز صورة الجدة.',
          successAudio: 'أَحْسَنْت! هَذِهِ جَدَّتُك!',
        },
        fr: {
          title: 'Mamie',
          promptAudio: 'Touche mamie ! Mamie m\'aime beaucoup !',
          promptText: 'Aidez l\'enfant à reconnaître mamie.',
          successAudio: 'Bravo ! Voici mamie !',
        },
        en: {
          title: 'Grandma',
          promptAudio: 'Touch grandma! Grandma loves me so much!',
          promptText: 'Help the child recognise grandma.',
          successAudio: 'Well done! That is grandma!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👵',
        choices: [
          { id: 'granny', asset: '👵', isCorrect: true },
          { id: 'mom',    asset: '👩', isCorrect: false },
          { id: 'boy',    asset: '👦', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-baby',
      domain: 'values',
      targetValue: 'baby',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الطِّفْلُ الصَّغِير',
          promptAudio: 'اِلْمَسِ الرَّضِيع! الرَّضِيعُ صَغِيرٌ وَنَاعِم!',
          promptText: 'نرفق بالرضيع: إنه أصغر فرد في العائلة.',
          successAudio: 'رَائِع! هَذَا رَضِيع!',
        },
        fr: {
          title: 'Le Bébé',
          promptAudio: 'Touche le bébé ! Le bébé est petit et doux !',
          promptText: 'On est gentil avec le bébé : c\'est le plus petit de la famille.',
          successAudio: 'Bravo ! Voici un bébé !',
        },
        en: {
          title: 'The Baby',
          promptAudio: 'Touch the baby! The baby is small and soft!',
          promptText: 'We are gentle with the baby: the smallest in the family.',
          successAudio: 'Great! That is a baby!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👶',
        choices: [
          { id: 'baby', asset: '👶', isCorrect: true },
          { id: 'dad',  asset: '👨', isCorrect: false },
          { id: 'granny', asset: '👵', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-roles',
      domain: 'values',
      targetValue: 'family-roles',
      stepNumber: 7,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'مَنْ يُحِبُّ مَاذَا؟',
          promptAudio: 'اِرْبِطِ الجَدَّةَ بِالقِصَّة، وَالرَّضِيعَ بِالقَارُورَة!',
          promptText: 'جدة↔قصة، رضيع↔رضاعة، طفل↔كرة، جد↔شاي.',
          successAudio: 'كُلُّ وَاحِدٍ فِي العَائِلَةِ مَحْبُوب!',
        },
        fr: {
          title: 'Qui Aime Quoi ?',
          promptAudio: 'Relie mamie au livre, et le bébé au biberon !',
          promptText: 'Mamie↔histoire, bébé↔biberon, enfant↔ballon, papi↔thé.',
          successAudio: 'Chacun dans la famille est aimé !',
        },
        en: {
          title: 'Who Loves What?',
          promptAudio: 'Match grandma to the book, and the baby to the bottle!',
          promptText: 'Grandma↔story, baby↔bottle, child↔ball, grandpa↔tea.',
          successAudio: 'Everyone in the family is loved!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏡',
        connectPairs: [
          { id: 'granny-story', leftAsset: '👵', rightAsset: '📖' },
          { id: 'baby-bottle',  leftAsset: '👶', rightAsset: '🍼' },
          { id: 'child-ball',   leftAsset: '👦', rightAsset: '⚽' },
          { id: 'grandpa-tea',  leftAsset: '👴', rightAsset: '🍵' },
        ],
      },
    },
    {
      id: 'family-memory',
      domain: 'values',
      targetValue: 'family-memory',
      stepNumber: 8,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ أَفْرَادَ العَائِلَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: أُمّ، أَب، رَضِيع!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'عَظِيم! أَنْتَ تَعْرِفُ عَائِلَتَك!',
        },
        fr: {
          title: 'Mémo de la Famille',
          promptAudio: 'Retourne les cartes ! Dis : maman, papa, bébé !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Formidable ! Tu connais ta famille !',
        },
        en: {
          title: 'Family Memory Game',
          promptAudio: 'Flip the cards! Say: mom, dad, baby!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Amazing! You know your family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'fam-mom',  asset: '👩' },
          { id: 'fam-dad',  asset: '👨' },
          { id: 'fam-baby', asset: '👶' },
        ],
      },
    },
  ],
};
