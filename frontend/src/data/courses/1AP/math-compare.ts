import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة أولى ابتدائي: مقارنة الكميات من 10 إلى 49 (أكثر من، أقل من، بقدر) دون رموز < >.';

export const MATH_1AP_COMPARE: CourseLesson[] = [
  {
    id: 'math-1ap-t2-compare-quantities',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الأعداد والحساب',
    sequenceAr: 'المقطع: أُقَارِنُ الكَمِّيَّاتِ (أَكْثَرَ مِنْ، أَقَلَّ مِنْ، بِقَدْرِ)',
    categoryAr: 'الرياضيات - مقارنة الكميات',
    titleAr: 'أُقَارِنُ: أَكْثَرَ مِنْ، أَقَلَّ مِنْ، بِقَدْرِ ⚖️',
    summaryAr: 'يتعلم الطفل مقارنة مجموعتين من 10 إلى 49 باستعمال: أكثر من، أقل من، بقدر، دون رموز > < =.',
    objectiveAr: 'أن يقارن كميتين صغيرتين ويختار العبارة الصحيحة.',
    objectivesAr: [
      'أَقُولُ «أَكْثَرَ مِنْ» عندما تكون المجموعة أكبر.',
      'أَقُولُ «أَقَلَّ مِنْ» عندما تكون المجموعة أصغر.',
      'أَقُولُ «بِقَدْرِ» عندما يكون العدد نفسه في المجموعتين.',
    ],
    discoveryAr: 'في السوق: عند أمينة 5 تَمْرَاتٍ 🌴 وعند يوسف 3 تَمْرَاتٍ. من معه أكثر؟',
    rulesAr: [
      'أَكْثَرَ مِنْ: العدد الأكبر. مثال: 8 أقلام أكثر من 5 أقلام.',
      'أَقَلَّ مِنْ: العدد الأصغر. مثال: 4 كراسات أقل من 7 كراسات.',
      'بِقَدْرِ: نفس العدد في المجموعتين. مثال: 6 كؤوس بقدر 6 صحون.',
      'نقارن بعدّ أو بقراءة الرقم: من 10 إلى 49. الرموز < > تأتي في الفصل الثالث.',
    ],
    examplesAr: [
      { problem: '32 كراسة في الصندوق و 28 في الرف. ماذا نقول؟', solution: '32 أكثر من 28.' },
      { problem: '40 طفلاً و 40 مقعداً. ماذا نقول؟', solution: '40 بقدر 40. الكميتان متساويتان.' },
    ],
    detailedCourse: {
      introAr: 'عندما نشتري تمراً أو نوزّع أقلاماً، نحتاج أن نعرف: من معه أكثر؟ من معه أقل؟ أم الاثنان بقدر؟',
      vocabulary: [
        { termAr: 'أَكْثَرَ مِنْ', definitionAr: 'يعني أن العدد أكبر من العدد الآخر.' },
        { termAr: 'أَقَلَّ مِنْ', definitionAr: 'يعني أن العدد أصغر من العدد الآخر.' },
        { termAr: 'بِقَدْرِ', definitionAr: 'يعني أن العددين متساويان.' },
      ],
      visualizationHintAr: 'ضع صفين من حبات الحمص أو الأزرار: صف من 6 وصف من 4، واطلب من الطفل أن يقول «أكثر / أقل / بقدر».',
      commonMistakes: [
        {
          mistakeAr: 'النظر إلى الحجم لا إلى العدد (علبة كبيرة فيها 3 تمرات وعلبة صغيرة فيها 8).',
          correctionAr: 'نعدّ الحبات واحدة واحدة، لا نحكم بحجم العلبة.',
        },
        {
          mistakeAr: 'قول «أكثر» عندما يكون العددان متساويين.',
          correctionAr: 'إذا كان العدد نفسه نقول «بقدر».',
        },
      ],
      takeawayAr: 'نعدّ ثم نقول: أكثر من / أقل من / بقدر.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-compare',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: '9 كرات ⚽ و 6 كرات. 9 … 6',
        hintsAr: ['أي عدد أكبر؟'],
        solutionAr: 'أَكْثَرَ مِنْ',
        detailedCorrectionAr: '9 أكبر من 6، إذن 9 أكثر من 6.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-compare',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'اشترت مريم 34 تمرة واشترى سامي 41 تمرة. تمر مريم … تمر سامي.',
        hintsAr: ['34 و 41: أيهما أصغر؟'],
        solutionAr: 'أَقَلَّ مِنْ',
        detailedCorrectionAr: '34 أقل من 41.',
        xpReward: 15,
      },
      {
        id: 'ex3-math1ap-compare',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'في المحفظة 8 أقلام وعلى الطاولة 8 أقلام. 8 … 8',
        hintsAr: ['هل العددان مختلفان؟'],
        solutionAr: 'بِقَدْرِ',
        detailedCorrectionAr: 'نفس العدد: 8 بقدر 8.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-compare',
      type: 'association',
      titleAr: 'لعبة الميزان ⚖️',
      instructionsAr: 'اختر العبارة الصحيحة لكل زوج!',
      items: [
        { questionOrPromptAr: '25 و 19', correctAnswerAr: 'أَكْثَرَ مِنْ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: '25 أكبر.' },
        { questionOrPromptAr: '31 و 48', correctAnswerAr: 'أَقَلَّ مِنْ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: '31 أصغر.' },
        { questionOrPromptAr: '40 و 40', correctAnswerAr: 'بِقَدْرِ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: 'العددان متساويان.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-compare',
        questionAr: '5 تَمْرَاتٍ و 2 تَمْرَتَانِ. 5 … 2',
        options: [
          { id: 'a', textAr: 'أَكْثَرَ مِنْ', isCorrect: true, explanationAr: '5 أكبر من 2.' },
          { id: 'b', textAr: 'أَقَلَّ مِنْ', isCorrect: false },
          { id: 'c', textAr: 'بِقَدْرِ', isCorrect: false },
        ],
      },
      {
        id: 'q2-math1ap-compare',
        questionAr: 'متى نقول «بِقَدْرِ»؟',
        options: [
          { id: 'a', textAr: 'عندما يكون العددان متساويين', isCorrect: true, explanationAr: 'بقدر = نفس الكمية.' },
          { id: 'b', textAr: 'عندما يكون أحد العددين أكبر دائماً', isCorrect: false },
          { id: 'c', textAr: 'عندما لا نعرف العدّ', isCorrect: false },
        ],
      },
      {
        id: 'q3-math1ap-compare',
        questionAr: 'في القسم 36 تلميذاً وفي الساحة 49. 36 … 49',
        options: [
          { id: 'a', textAr: 'أَقَلَّ مِنْ', isCorrect: true, explanationAr: '36 أصغر من 49.' },
          { id: 'b', textAr: 'أَكْثَرَ مِنْ', isCorrect: false },
          { id: 'c', textAr: 'بِقَدْرِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
];
