import { PreschoolModule } from './types';

/**
 * "عَائِلَتِي الحَبِيبَة" — Ma Famille (Éducation Civique 0AP).
 * Covers: family members (mom, dad, siblings, grandparents), roles, bonds.
 * Interaction mix: find_path, tap_choice ×3, connect_dots, memory_cards.
 */
export const FAMILY_MODULE: PreschoolModule = {
  id: 'preschool-family',
  domain: 'values',
  icon: '👨‍👩‍👧‍👦',
  totalSteps: 6,
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
          title: 'الفَنَكُ يَعُودُ إِلَى بَيْتِهِ',
          promptAudio: 'اِسْحَبِ الفَنَكَ الصَّغِيرَ لِيَعُودَ إِلَى عَائِلَتِهِ فِي البَيْت!',
          promptText: 'اسحب الفنك نحو بيت العائلة.',
          successAudio: 'أَهْلاً بِالعَائِلَة! لَا شَيْءَ أَجْمَلُ مِنَ العَوْدَةِ إِلَى البَيْت!',
        },
        fr: {
          title: 'Le Fennec Rentre Chez Lui',
          promptAudio: 'Fais glisser le petit fennec pour qu\'il rentre chez sa famille à la maison !',
          promptText: 'Aide l\'enfant à glisser le fennec vers la maison familiale.',
          successAudio: 'Bienvenue à la maison ! Rien de mieux que rentrer chez sa famille !',
        },
        en: {
          title: 'The Fennec Goes Home',
          promptAudio: 'Drag the little fennec to go back home to his family!',
          promptText: 'Help the child drag the fennec toward the family home.',
          successAudio: 'Welcome home! Nothing is better than returning to family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathToken: { startAsset: '🦊', endAsset: '🏡', travelerAsset: '🦊' },
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
          title: 'أُمِّي الغَالِيَة',
          promptAudio: 'اِلْمَسْ أُمِّي! الأُمُّ تُحِبُّنَا وَتُطْعِمُنَا وَتَحْضُنُنَا بِدِفْءٍ وَحَنَان!',
          promptText: 'تحدث عن مدى حب الأم وتضحياتها.',
          successAudio: 'مُمْتَاز! الأُمُّ هِيَ أَغْلَى شَخْصٍ فِي الحَيَاة!',
        },
        fr: {
          title: 'Ma Précieuse Maman',
          promptAudio: 'Touche maman ! Maman nous aime, nous nourrit et nous serre dans ses bras !',
          promptText: 'Parlez de l\'amour et des sacrifices de la maman.',
          successAudio: 'Super ! Maman est la personne la plus précieuse de la vie !',
        },
        en: {
          title: 'My Dear Mom',
          promptAudio: 'Touch mom! Mom loves us, feeds us and holds us in her warm arms!',
          promptText: 'Talk about a mother\'s love and sacrifices.',
          successAudio: 'Wonderful! Mom is the most precious person in life!',
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
          title: 'أَبِي الكَرِيم',
          promptAudio: 'اِلْمَسْ أَبِي! الأَبُ يَعْمَلُ لِيُوَفِّرَ لَنَا كُلَّ مَا نَحْتَاجُهُ وَيَحْمِينَا!',
          promptText: 'تحدث عن دور الأب في الأسرة وتضحياته.',
          successAudio: 'بَرَاوَ! أَبِي هُوَ القَوِيُّ الذِي يَحْمِي العَائِلَة!',
        },
        fr: {
          title: 'Mon Cher Papa',
          promptAudio: 'Touche papa ! Papa travaille pour nous donner tout ce dont on a besoin et il nous protège !',
          promptText: 'Parlez du rôle du père dans la famille et de ses sacrifices.',
          successAudio: 'Bravo ! Papa est le fort qui protège toute la famille !',
        },
        en: {
          title: 'My Dear Dad',
          promptAudio: 'Touch dad! Dad works to give us everything we need and he protects us!',
          promptText: 'Talk about the father\'s role in the family and his sacrifices.',
          successAudio: 'Bravo! Dad is the strong one who protects the whole family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👨',
        choices: [
          { id: 'dad',    asset: '👨', isCorrect: true },
          { id: 'mom',    asset: '👩', isCorrect: false },
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
          title: 'جَدِّي وَجَدَّتِي',
          promptAudio: 'اِلْمَسْ جَدِّي! الجَدُّ وَالجَدَّةُ يُحِبَّانِنَا كَثِيراً وَيَحْكِيَانِ لَنَا القِصَص!',
          promptText: 'تحدث عن الاحترام الواجب للأجداد.',
          successAudio: 'أَحْسَنْت! نَحْتَرِمُ جَدَّنَا وَجَدَّتَنَا وَنُحِبُّهُمَا كَثِيرا!',
        },
        fr: {
          title: 'Papi et Mamie',
          promptAudio: 'Touche papi ! Papi et mamie nous aiment beaucoup et nous racontent des histoires !',
          promptText: 'Parlez du respect qu\'on doit aux grands-parents.',
          successAudio: 'Bravo ! On respecte et on aime beaucoup notre papi et notre mamie !',
        },
        en: {
          title: 'Grandpa and Grandma',
          promptAudio: 'Touch grandpa! Grandpa and grandma love us so much and tell us stories!',
          promptText: 'Talk about the respect we owe to grandparents.',
          successAudio: 'Well done! We respect and love our grandpa and grandma very much!',
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
      id: 'family-roles',
      domain: 'values',
      targetValue: 'family-roles',
      stepNumber: 5,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'مَنْ يَفْعَلُ مَاذَا فِي العَائِلَة؟',
          promptAudio: 'اِرْبُطْ كُلَّ فَرْدٍ بِمَا يَفْعَلُهُ! الأُمُّ تَطْبُخُ وَالأَبُ يَعْمَلُ وَالطِّفْلُ يَتَعَلَّم!',
          promptText: 'ساعد طفلك على ربط كل فرد من الأسرة بدوره.',
          successAudio: 'وَاوَ! كُلُّ وَاحِدٍ فِي العَائِلَةِ لَهُ دَوْرٌ مُهِم!',
        },
        fr: {
          title: 'Qui Fait Quoi dans la Famille ?',
          promptAudio: 'Relie chaque membre à ce qu\'il fait ! Maman cuisine, papa travaille, l\'enfant apprend !',
          promptText: 'Aidez l\'enfant à associer chaque membre de la famille à son rôle.',
          successAudio: 'Wow ! Chaque membre de la famille a un rôle important !',
        },
        en: {
          title: 'Who Does What in the Family?',
          promptAudio: 'Match each family member to what they do! Mom cooks, dad works, the child learns!',
          promptText: 'Help the child associate each family member with their role.',
          successAudio: 'Wow! Every member of the family has an important role!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏡',
        connectPairs: [
          { id: 'mom-cook',    leftAsset: '👩', rightAsset: '🍳' },
          { id: 'dad-work',    leftAsset: '👨', rightAsset: '💼' },
          { id: 'child-learn', leftAsset: '👦', rightAsset: '📚' },
          { id: 'granny-story', leftAsset: '👵', rightAsset: '📖' },
        ],
      },
    },
    {
      id: 'family-memory',
      domain: 'values',
      targetValue: 'family-memory',
      stepNumber: 6,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ أَفْرَادَ العَائِلَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ وَاجِدِ الأَزْوَاج! قُلِ اسْمَ كُلِّ فَرْدٍ مِنَ العَائِلَة!',
          promptText: 'شجع طفلك على نطق أسماء أفراد الأسرة.',
          successAudio: 'عَظِيمٌ! أَنْتَ تَعْرِفُ جَمِيعَ أَفْرَادِ عَائِلَتِك!',
        },
        fr: {
          title: 'Mémo de la Famille',
          promptAudio: 'Retourne les cartes et trouve les paires ! Dis le nom de chaque membre de la famille !',
          promptText: 'Encouragez l\'enfant à dire les noms des membres de la famille.',
          successAudio: 'Formidable ! Tu connais tous les membres de ta famille !',
        },
        en: {
          title: 'Family Memory Game',
          promptAudio: 'Flip the cards and find the pairs! Say the name of each family member!',
          promptText: 'Encourage the child to say the names of family members.',
          successAudio: 'Amazing! You know all the members of your family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'fam-mom',     asset: '👩'  },
          { id: 'fam-dad',     asset: '👨'  },
          { id: 'fam-grandpa', asset: '👴'  },
          { id: 'fam-granny',  asset: '👵'  },
          { id: 'fam-baby',    asset: '👶'  },
        ],
      },
    },
  ],
};
