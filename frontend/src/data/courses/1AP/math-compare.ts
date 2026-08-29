import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة أولى ابتدائي: مقارنة الكميات من 0 إلى 20 (أكثر من، أقل من، بقدر) دون رموز < >.';

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
    summaryAr: 'يتعلم الطفل مقارنة مجموعتين من 0 إلى 20 باستعمال: أكثر من، أقل من، بقدر، دون رموز > < =.',
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
      'نقارن بعدّ أو بقراءة الرقم: من 0 إلى 20. الرموز < > تأتي في الفصل الثالث.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'word_problem_scenario',
      titleAr: 'أكثر من، أقل من، بقدر',
      introAr: 'عدّ ثم اختر العبارة. بدون رموز < > هنا.',
      problems: [
        {
          id: 'more',
          situationAr: 'عند أمينة 5 تَمْرَاتٍ وعند يوسف 3. ماذا نقول؟',
          choices: [
            { textAr: '5 أكثر من 3', isCorrect: true, feedbackAr: 'نعم: العدد الأكبر = أكثر من.' },
            { textAr: '5 أقل من 3', isCorrect: false, feedbackAr: '5 أكبر من 3.' },
          ],
        },
        {
          id: 'equal',
          situationAr: '12 طفلاً و 12 مقعداً. ماذا نقول؟',
          choices: [
            { textAr: '12 بقدر 12', isCorrect: true, feedbackAr: 'نفس العدد = بقدر.' },
            { textAr: '12 أكثر من 12', isCorrect: false, feedbackAr: 'العددان متساويان: بقدر.' },
          ],
        },
      ],
    },
    examplesAr: [
      { problem: '12 كراسة في الصندوق و 8 في الرف. ماذا نقول؟', solution: '12 أكثر من 8.' },
      { problem: '15 طفلاً و 15 مقعداً. ماذا نقول؟', solution: '15 بقدر 15. الكميتان متساويتان.' },
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
        problemAr: 'اشترت مريم 14 تمرة واشترى سامي 17 تمرة. تمر مريم … تمر سامي.',
        hintsAr: ['14 و 17: أيهما أصغر؟'],
        solutionAr: 'أَقَلَّ مِنْ',
        detailedCorrectionAr: '14 أقل من 17.',
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
        { questionOrPromptAr: '15 و 12', correctAnswerAr: 'أَكْثَرَ مِنْ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: '15 أكبر.' },
        { questionOrPromptAr: '9 و 16', correctAnswerAr: 'أَقَلَّ مِنْ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: '9 أصغر.' },
        { questionOrPromptAr: '20 و 20', correctAnswerAr: 'بِقَدْرِ', optionsAr: ['أَكْثَرَ مِنْ', 'أَقَلَّ مِنْ', 'بِقَدْرِ'], explanationAr: 'العددان متساويان.' },
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
        questionAr: 'في القسم 13 تلميذاً وفي الساحة 18. 13 … 18',
        options: [
          { id: 'a', textAr: 'أَقَلَّ مِنْ', isCorrect: true, explanationAr: '13 أصغر من 18.' },
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
