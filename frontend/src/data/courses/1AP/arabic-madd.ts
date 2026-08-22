import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة أولى ابتدائي: المدود الثلاثة بعد الحركات القصيرة، دون نسخ درس الحركات الموجود.';

export const ARABIC_1AP_MADD: CourseLesson[] = [
  {
    id: 'arabic-1ap-t2-madd',
    grade: '1AP',
    subject: 'arabic',
    trimester: 2,
    domainAr: 'الحركات والأصوات',
    sequenceAr: 'السلسلة: المُدُودُ الطَّوِيلَةُ (بِالأَلِفِ، بِالوَاوِ، بِاليَاءِ)',
    categoryAr: 'اللغة العربية - المدود',
    titleAr: 'أَتَعَرَّفُ عَلَى المُدُودِ: ا ـ و ـ ي 🎵',
    summaryAr: 'يتعلم الطفل إطالة صوت الحركة القصيرة بمدّها: الفتحة + ا، الضمة + و، الكسرة + ي، ويقرأ كلمات مصوّرة قصيرة.',
    objectiveAr: 'التمييز سماعاً وكتابةً بين الحركة القصيرة والمدّ الطويل الموافق لها.',
    objectivesAr: [
      'أُطِيلُ صَوْتَ الفَتْحَةِ بِالأَلِفِ: بَ ← بَا.',
      'أُطِيلُ صَوْتَ الضَّمَّةِ بِالوَاوِ: بُ ← بُو، وَصَوْتَ الكَسْرَةِ بِاليَاءِ: بِ ← بِي.',
      'أَقْرَأُ كَلِمَاتٍ بَسِيطَةً فِيهَا مَدٌّ: بَابٌ، نُورٌ، تِينٌ.',
    ],
    discoveryAr: 'استمع: بَ … ثم بَا. هل بقي الصوت قصيراً أم صار أطول مثل غناء؟',
    rulesAr: [
      'المَدُّ بِالأَلِفِ: بعد الفتحة نكتب ا فنمدّ الصوت: بَ + ا = بَا، مثل بَابٌ 🚪.',
      'المَدُّ بِالوَاوِ: بعد الضمة نكتب و فنمدّ الصوت: نُ + و = نُو، مثل نُورٌ 💡.',
      'المَدُّ بِاليَاءِ: بعد الكسرة نكتب ي فنمدّ الصوت: تِ + ي = تِي، مثل تِينٌ 🍈.',
      'الحركة القصيرة صوت قصير، والمدّ صوت أطول. لا نخلط بَ وَبَا.',
    ],
    examplesAr: [
      { problem: 'أمدّ الفتحة في «بَ». ماذا أكتب؟', solution: 'بَا (فتحة + ألف المد).' },
      { problem: 'أي مدّ في كلمة «نُورٌ»؟', solution: 'مدّ بالواو بعد الضمة: نُو.' },
    ],
    detailedCourse: {
      introAr: 'تعلّمنا الحركات القصيرة. اليوم نُطيل الصوت قليلاً: هذا هو المدّ. ثلاثة أصدقاء: الألف والواو والياء.',
      vocabulary: [
        { termAr: 'المَدُّ 🎵', definitionAr: 'إطالة صوت الحركة بحرف يُكتب بعدها: ا أو و أو ي.' },
        { termAr: 'أَلِفُ المَدِّ ا', definitionAr: 'تمدّ الفتحة: بَا، دَا، مثل بَابٌ.' },
        { termAr: 'وَاوُ المَدِّ و', definitionAr: 'تمدّ الضمة: بُو، نُو، مثل نُورٌ.' },
        { termAr: 'يَاءُ المَدِّ ي', definitionAr: 'تمدّ الكسرة: بِي، تِي، مثل تِينٌ.' },
      ],
      visualizationHintAr: 'ارسم خطاً قصيراً لصوت بَ وخطاً أطول لصوت بَا، واطلب من الطفل أن يغنّي الصوت الطويل بفم مفتوح.',
      commonMistakes: [
        {
          mistakeAr: 'قراءة بَا مثل بَ (بدون إطالة).',
          correctionAr: 'عند رؤية الألف بعد الفتحة نمدّ الصوت: بااا، لا نقف عند بَ.',
        },
        {
          mistakeAr: 'وضع واو المد بعد الفتحة أو ياء المد بعد الضمة.',
          correctionAr: 'الفتحة مع ا فقط، الضمة مع و فقط، الكسرة مع ي فقط.',
        },
      ],
      takeawayAr: 'َ + ا = مد بالألف | ُ + و = مد بالواو | ِ + ي = مد بالياء.',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-madd',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'بَ + ا = ؟',
        hintsAr: ['الفتحة تمدّها الألف.'],
        solutionAr: 'بَا',
        detailedCorrectionAr: 'بَ ثم ألف المدّ تعطي بَا.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-madd',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي مدّ في كلمة «تِينٌ» 🍈؟',
        hintsAr: ['انظر الحرف بعد الكسرة.'],
        solutionAr: 'مَدٌّ بِاليَاءِ',
        detailedCorrectionAr: 'تِ + ي = تِي: مدّ بالياء.',
        xpReward: 15,
      },
      {
        id: 'ex3-ar1ap-madd',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'اقرأ: بَابُ المَسْجِدِ 🕌 — أين المدّ؟',
        hintsAr: ['ابحث عن ألف بعد فتحة.'],
        solutionAr: 'بَا في بَابُ',
        detailedCorrectionAr: 'في «بَابُ» مدّ بالألف: بَا.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-madd',
      type: 'association',
      titleAr: 'لعبة المدود الثلاثة 🎶',
      instructionsAr: 'اربط كل مقطع بنوع المدّ!',
      items: [
        { questionOrPromptAr: 'بَا', correctAnswerAr: 'مَدٌّ بِالأَلِفِ', optionsAr: ['مَدٌّ بِالأَلِفِ', 'مَدٌّ بِالوَاوِ', 'مَدٌّ بِاليَاءِ'], explanationAr: 'فتحة + ا.' },
        { questionOrPromptAr: 'نُو', correctAnswerAr: 'مَدٌّ بِالوَاوِ', optionsAr: ['مَدٌّ بِالأَلِفِ', 'مَدٌّ بِالوَاوِ', 'مَدٌّ بِاليَاءِ'], explanationAr: 'ضمة + و.' },
        { questionOrPromptAr: 'تِي', correctAnswerAr: 'مَدٌّ بِاليَاءِ', optionsAr: ['مَدٌّ بِالأَلِفِ', 'مَدٌّ بِالوَاوِ', 'مَدٌّ بِاليَاءِ'], explanationAr: 'كسرة + ي.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-madd',
        questionAr: 'بَ + ا = ؟',
        options: [
          { id: 'a', textAr: 'بَا', isCorrect: true, explanationAr: 'صحيح: الفتحة تُمدّ بالألف.' },
          { id: 'b', textAr: 'بُو', isCorrect: false },
          { id: 'c', textAr: 'بِي', isCorrect: false },
        ],
      },
      {
        id: 'q2-ar1ap-madd',
        questionAr: 'كلمة «نُورٌ» 💡 فيها مدّ…',
        options: [
          { id: 'a', textAr: 'بِالوَاوِ', isCorrect: true, explanationAr: 'نُ + و = نُو.' },
          { id: 'b', textAr: 'بِالأَلِفِ', isCorrect: false },
          { id: 'c', textAr: 'بِاليَاءِ', isCorrect: false },
        ],
      },
      {
        id: 'q3-ar1ap-madd',
        questionAr: 'ما الفرق بين بَ وَبَا؟',
        options: [
          { id: 'a', textAr: 'بَا صوت أطول (مدّ)', isCorrect: true, explanationAr: 'الألف تمدّ الفتحة.' },
          { id: 'b', textAr: 'لا فرق بينهما', isCorrect: false },
          { id: 'c', textAr: 'بَا أقصر من بَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
];
