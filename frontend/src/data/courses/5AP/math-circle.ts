import { CourseLesson } from '../../../types';

export const MATH_5AP_CIRCLE: CourseLesson[] = [
  {
    id: 'math-5ap-circle-radius',
    grade: '5AP',
    subject: 'math',
    categoryAr: 'الهندسة والفضاء',
    unitAr: 'الهندسة والفضاء',
    trimester: 3,
    difficultyTier: 2,
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr:
      'محتوى تربوي أصلي أعدّته مَسِيد DZ: الدائرة والمركز والشعاع والقطر وفق منهاج الجيل الثاني (5AP). ليس إعادة لدرس المحيطات أو المجسمات الموجود.',
    objectivesAr: [
      'أُعَرِّفُ الدائرة: كل نقاطها على البعد نفسه من المركز.',
      'أُمَيِّزُ المركز والشعاع والقطر.',
      'أَسْتَعْمِلُ القاعدة: القطر = ضعف الشعاع.',
      'أَرْسُمُ دائرة بالمدور انطلاقاً من مركز وشعاع معلوم.',
    ],
    missionTitleAr: '⭕ مهمة: صحن الكسكسي والساعة',
    missionIntroAr:
      'صحن الكسكسي في البيت وساعة الحائط في القسم شكلان دائريان. ساعد أحمد على تسمية المركز والشعاع والقطر دون خلط مع قطر المربع.',
    titleAr: 'الدائرة: المركز، الشعاع والقطر',
    summaryAr:
      'الدائرة خط منحنٍ مغلق، كل نقطة منه تبعد البعد نفسه عن نقطة داخلية تُسمّى المركز. الشعاع يصل المركز بنقطة من الدائرة. القطر يمرّ بالمركز ويربط نقطتين من الدائرة، وهو ضعف الشعاع.',
    discoveryAr: 'ضع نقطة O على الورقة وافتح المدور مسافة ثابتة. ماذا ترسم عندما تدور؟',
    rulesAr: [
      'المَرْكَزُ: النقطة الداخلية التي تبعد عنها كل نقاط الدائرة البعد نفسه.',
      'الشُّعَاعُ: القطعة التي تربط المركز بنقطة من الدائرة. كل الأشعة في الدائرة نفسها متقايسة.',
      'القُطْرُ: قطعة تمرّ بالمركز وتربط نقطتين من الدائرة. القطر = الشعاع × 2.',
      'لا نخلط قطر الدائرة مع قطر المربع أو المعين: هنا القطر خط داخل دائرة يمرّ بالمركز.',
    ],
    keyFormulas: [
      { labelAr: 'القطر بدلالة الشعاع', formulaAr: 'ق = 2 × ش', noteAr: 'ق القطر، ش الشعاع (نفس الوحدة).' },
      { labelAr: 'الشعاع بدلالة القطر', formulaAr: 'ش = ق ÷ 2' },
    ],
    examplesAr: [
      {
        problem: 'شعاع دائرة ساعة الحائط 12 cm. ما طول القطر؟',
        solution: 'ق = 2 × 12 = 24 cm.',
      },
      {
        problem: 'قطر صحن دائري 18 cm. ما طول الشعاع؟',
        solution: 'ش = 18 ÷ 2 = 9 cm.',
      },
    ],
    detailedCourse: {
      introAr: 'كثير من الأشياء حولنا دائرية: صحن، غطاء قدر، إطار دراجة. لنتحدث عنها بلغة الرياضيات.',
      vocabulary: [
        { termAr: 'الدَّائِرَةُ', definitionAr: 'خط منحنٍ مغلق، كل نقطة منه على البعد نفسه من المركز.' },
        { termAr: 'المَرْكَزُ', definitionAr: 'النقطة الداخلية الثابتة التي نفتح عليها المدور.' },
        { termAr: 'الشُّعَاعُ', definitionAr: 'المسافة من المركز إلى أي نقطة من الدائرة.' },
        { termAr: 'القُطْرُ', definitionAr: 'قطعة تمر بالمركز وتربط نقطتين من الدائرة، طولها ضعف الشعاع.' },
      ],
      visualizationHintAr: 'ارسم دائرة بالمدور: الإبرة على المركز، الفتحة هي الشعاع، والخط من حافة إلى حافة مروراً بالمركز هو القطر.',
      commonMistakes: [
        {
          mistakeAr: 'اعتبار الشعاع هو الخط من حافة إلى حافة.',
          correctionAr: 'من حافة إلى حافة مروراً بالمركز هو القطر. الشعاع ينطلق من المركز ويتوقف عند الدائرة.',
        },
        {
          mistakeAr: 'نسيان الضرب في 2: شعاع 5 cm فيُكتب القطر 5 cm.',
          correctionAr: 'القطر دائماً ضعف الشعاع: 5 × 2 = 10 cm.',
        },
      ],
      takeawayAr: 'مركز + شعاع ثابت = دائرة. القطر = 2 × الشعاع.',
    },
    interactiveTool: 'geometry_visualizer',
    progressiveExercises: [
      {
        id: 'math-5ap-circle-ex1',
        level: 1,
        levelLabelAr: '🔍 أكتشف',
        type: 'qcm',
        problemAr: 'ما اسم النقطة التي نضع عليها إبرة المدور؟',
        hintsAr: ['هي نقطة داخل الدائرة.'],
        options: [
          { id: 'a', textAr: 'المركز', isCorrect: true },
          { id: 'b', textAr: 'القطر', isCorrect: false },
          { id: 'c', textAr: 'الزاوية', isCorrect: false },
        ],
        solutionAr: 'المركز',
        detailedCorrectionAr: 'إبرة المدور تُوضع على المركز.',
        xpReward: 10,
      },
      {
        id: 'math-5ap-circle-ex2',
        level: 2,
        levelLabelAr: '✏️ أتدرب',
        type: 'calculation',
        problemAr: 'شعاع دائرة 7 cm. احسب القطر بالسنتيمتر (الرقم فقط).',
        hintsAr: ['القطر = ضعف الشعاع.'],
        calculationAnswer: 14,
        solutionAr: '14',
        detailedCorrectionAr: 'ق = 2 × 7 = 14 cm.',
        xpReward: 15,
      },
      {
        id: 'math-5ap-circle-ex3',
        level: 3,
        levelLabelAr: '🎯 أتقن',
        type: 'calculation',
        problemAr: 'قطر ملعب دائري صغير 30 m. ما طول الشعاع بالمتر؟ (الرقم فقط)',
        hintsAr: ['الشعاع = القطر ÷ 2.'],
        calculationAnswer: 15,
        solutionAr: '15',
        detailedCorrectionAr: 'ش = 30 ÷ 2 = 15 m.',
        xpReward: 20,
      },
    ],
    educationalGame: {
      id: 'math-5ap-circle-game',
      type: 'association',
      titleAr: 'سمِّ أجزاء الدائرة',
      instructionsAr: 'اربط كل وصف بالكلمة الصحيحة.',
      items: [
        { questionOrPromptAr: 'من المركز إلى الدائرة', correctAnswerAr: 'الشعاع', optionsAr: ['الشعاع', 'القطر', 'الزاوية'] },
        { questionOrPromptAr: 'يمر بالمركز ويربط نقطتين من الدائرة', correctAnswerAr: 'القطر', optionsAr: ['الشعاع', 'القطر', 'الوتر'] },
        { questionOrPromptAr: 'نقطة ثابتة داخل الدائرة', correctAnswerAr: 'المركز', optionsAr: ['المركز', 'الرأس', 'الضلع'] },
      ],
      xpReward: 25,
    },
    quiz: [
      {
        id: 'q1-math-5ap-circle',
        questionAr: 'إذا كان الشعاع 9 cm، فالقطر يساوي:',
        options: [
          { id: 'a', textAr: '18 cm', isCorrect: true, explanationAr: 'القطر = 2 × 9 = 18 cm.' },
          { id: 'b', textAr: '9 cm', isCorrect: false },
          { id: 'c', textAr: '4.5 cm', isCorrect: false },
        ],
      },
      {
        id: 'q2-math-5ap-circle',
        questionAr: 'كل نقاط الدائرة:',
        options: [
          { id: 'a', textAr: 'تبعد البعد نفسه عن المركز', isCorrect: true, explanationAr: 'هذا تعريف الدائرة.' },
          { id: 'b', textAr: 'تبعد أبعاداً مختلفة عن المركز', isCorrect: false },
          { id: 'c', textAr: 'تكون دائماً داخل مربع', isCorrect: false },
        ],
      },
      {
        id: 'q3-math-5ap-circle',
        questionAr: 'قطر دائرة 20 cm. الشعاع يساوي:',
        options: [
          { id: 'a', textAr: '10 cm', isCorrect: true, explanationAr: 'ش = 20 ÷ 2 = 10 cm.' },
          { id: 'b', textAr: '40 cm', isCorrect: false },
          { id: 'c', textAr: '20 cm', isCorrect: false },
        ],
      },
    ],
  },
];
