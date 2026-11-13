import type { CourseLesson, LearningPath, ProgressiveExercise } from '../../types';
import { applyMission, applyNextMission, MISSIONS_BY_LESSON, SECOND_MISSIONS_BY_LESSON } from './missions';

const placeValueExercises: ProgressiveExercise[] = [
  {
    id: 'math-4ap-place-value-guided', level: 1, levelLabelAr: 'أكمل معي', type: 'calculation',
    problemAr: 'في العدد 34 206، الرقم 2 في منزلة المئات. أكمل: قيمة هذا الرقم = 2 × 100 = … اكتب القيمة بالأرقام.',
    hintsAr: ['مئتان تعني مئة ومئة.'],
    progressiveHints: [
      { labelAr: 'أنظر', contentAr: 'الرقم 2 هنا لا يمثل وحدتين؛ إنه يمثل مئتين.' },
      { labelAr: 'أبدأ الحساب', contentAr: '2 × 100 = 100 + 100. اجمع المئتين.' },
    ],
    calculationAnswer: 200, solutionAr: '200', operationsAr: '2 × 100 = 100 + 100 = 200',
    misconceptionsAr: [{ answer: 2, feedbackAr: 'كتبتَ الرقم نفسه. المطلوب قيمته: كم يساوي وهو في منزلة المئات؟' }],
    detailedCorrectionAr: 'الرقم هو 2، لكنه في منزلة المئات. قيمته مئتان: 200.', xpReward: 10,
  },
  {
    id: 'math-4ap-place-value-independent', level: 2, levelLabelAr: 'أحاول وحدي', type: 'calculation',
    problemAr: 'في العدد 52 708، ما قيمة الرقم 7؟ اكتب القيمة بالأرقام، وليس الرقم وحده.',
    hintsAr: ['ابدأ من اليمين: وحدات، عشرات، مئات.'],
    progressiveHints: [
      { labelAr: 'أحدد المنزلة', contentAr: 'من اليمين: 8 وحدات، 0 عشرات، ثم 7 مئات.' },
      { labelAr: 'أحسب القيمة', contentAr: 'سبع مئات تعني 7 × 100. اكتب ناتج الضرب.' },
    ],
    calculationAnswer: 700, solutionAr: '700', operationsAr: '7 × 100 = 700',
    misconceptionsAr: [
      { answer: 7, feedbackAr: 'كتبتَ الرقم نفسه. المطلوب قيمته في مكانه.' },
      { answer: 70, feedbackAr: 'انتبه إلى الصفر: هو يحفظ منزلة العشرات، والرقم 7 بعده.' },
    ],
    detailedCorrectionAr: 'الرقم 7 في منزلة المئات، لذلك قيمته 700. الصفر يحفظ منزلة العشرات.', xpReward: 15,
  },
  {
    id: 'math-4ap-place-value-independent-2', level: 2, levelLabelAr: 'أحاول وحدي مرة ثانية', type: 'calculation',
    problemAr: 'في العدد 60 518، ما قيمة الرقم 6؟ اكتب القيمة بالأرقام.',
    hintsAr: ['عُدّ المنازل من اليمين حتى تصل إلى الرقم 6.'],
    progressiveHints: [
      { labelAr: 'أحدد المنزلة', contentAr: 'من اليمين: 8 وحدات، 1 عشرات، 5 مئات، 0 آلاف، ثم 6 عشرات الآلاف.' },
      { labelAr: 'أحسب القيمة', contentAr: 'عشرة آلاف تُكتب 10000. احسب قيمة ست عشرات آلاف.' },
    ],
    calculationAnswer: 60000, solutionAr: '60000', operationsAr: '6 × 10000 = 60000',
    misconceptionsAr: [
      { answer: 6, feedbackAr: 'كتبتَ الرقم نفسه. المطلوب قيمته في مكانه.' },
      { answer: 6000, feedbackAr: 'قريب! لكن الصفر بعد 6 يحفظ منزلة الآلاف. الرقم 6 في المنزلة التي قبلها.' },
    ],
    detailedCorrectionAr: 'الرقم 6 في منزلة عشرات الآلاف، لذلك قيمته 60000. الصفر يحفظ منزلة الآلاف الفارغة.', xpReward: 15,
  },
];

const placeValueTransfer: ProgressiveExercise = {
  id: 'math-4ap-place-value-transfer', level: 3, levelLabelAr: 'أجرّب عدداً جديداً', type: 'calculation',
  problemAr: 'وصل عدد كتب مكتبة إلى 47 032 كتاباً. ما قيمة الرقم 7 في هذا العدد؟ اكتب القيمة بالأرقام.',
  hintsAr: ['حدد منزلة 7 قبل كتابة قيمته.'],
  progressiveHints: [
    { labelAr: 'أحدد المكان', contentAr: 'من اليمين: 2 وحدات، 3 عشرات، 0 مئات، ثم 7 آلاف.' },
    { labelAr: 'أحسب', contentAr: 'كل ألف يساوي 1000. احسب قيمة سبعة آلاف.' },
  ],
  calculationAnswer: 7000, solutionAr: '7000', operationsAr: '7 × 1000 = 7000',
  misconceptionsAr: [
    { answer: 7, feedbackAr: 'كتبتَ الرقم نفسه. المطلوب قيمته في مكانه.' },
    { answer: 700, feedbackAr: 'كانت 700 قيمة الرقم 7 في العدد السابق. هنا تغيّر مكانه.' },
  ],
  detailedCorrectionAr: 'هنا 7 في منزلة الآلاف، وليس المئات. قيمته 7000. قيمة الرقم تتغير عندما تتغير منزلته.', xpReward: 20,
};

const placeValuePath: LearningPath = {
  titleAr: 'المهمة الأولى: أعرف قيمة كل رقم',
  prerequisiteAr: 'أتذكر: عشر وحدات تكوّن عشرة، وعشر عشرات تكوّن مئة. سأبدأ بمنزلة الرقم، ثم أحسب قيمته.',
  steps: [
    {
      kind: 'observe', titleAr: 'أنظر إلى مكان الرقم',
      textAr: 'في 23 405 لا تعني الأرقام كميات متساوية.\nاضغط على كل رقم في الجدول لتكتشف قيمته.',
      visual: { type: 'place_value', columnsAr: ['عشرات الآلاف', 'آلاف', 'مئات', 'عشرات', 'وحدات'], digits: [2, 3, 4, 0, 5], captionAr: '23 405 = 20 000 + 3 000 + 400 + 5. الصفر يحفظ مكان العشرات.' },
    },
    {
      kind: 'model', titleAr: 'أرى كيف أحسب القيمة',
      textAr: 'أريد قيمة 4 في 23 405.\nأولاً: أبدأ من اليمين: 5 وحدات، 0 عشرات، 4 مئات.\nثانياً: إذن 4 يمثل أربع مئات، وليس أربع وحدات.\nثالثاً: أضرب 4 في 100.',
      workedExample: { operationsAr: '4 × 100 = 400\n23 405 = 20 000 + 3 000 + 400 + 5', solution: 'الرقم 4، منزلته المئات، وقيمته 400. هذه ثلاثة أشياء مختلفة: الرقم، والمنزلة، والقيمة.' },
    },
    { kind: 'guided', titleAr: 'أكمل معي', textAr: 'المنزلة معطاة لك. أكمل الحساب، ثم اضغط «تحقق من الإجابة».', exerciseId: placeValueExercises[0].id },
    { kind: 'independent', titleAr: 'أحاول وحدي أولاً', textAr: 'هذه المرة أحدد المنزلة بنفسي. إذا تعثرت، أستطيع طلب مساعدة.', exerciseId: placeValueExercises[1].id },
    { kind: 'independent', titleAr: 'أحاول وحدي مع عدد أكبر', textAr: 'نفس الطريقة: أعدّ المنازل من اليمين، ثم أحسب القيمة. انتبه إلى الصفر.', exerciseId: placeValueExercises[2].id },
    { kind: 'transfer', titleAr: 'هل يتغير معنى الرقم؟', textAr: 'أطبق الطريقة على عدد جديد. أحدد مكان الرقم قبل حساب قيمته، دون نسخ جواب المثال السابق.', exerciseId: placeValueTransfer.id },
  ],
};

const divisionExercises: ProgressiveExercise[] = [
  {
    id: 'math-5ap-division-guided', level: 1, levelLabelAr: 'أكمل معي', type: 'calculation',
    problemAr: 'أوزّع 23 قلماً على 5 أطفال بالتساوي. أعطي كل طفل 4 أقلام: 5 × 4 = 20. كم قلماً يبقى؟ اكتب الباقي بالأرقام.',
    hintsAr: ['أطرح ما وزعته من عدد الأقلام في البداية.'],
    progressiveHints: [
      { labelAr: 'أحدد الكميتين', contentAr: 'كان عندي 23 قلماً. وزّعت 20 قلماً.' },
      { labelAr: 'أبدأ', contentAr: 'أحسب 23 − 20. ثم أتحقق أن الباقي أصغر من 5.' },
    ],
    calculationAnswer: 3, solutionAr: '3', operationsAr: '5 × 4 = 20\n23 − 20 = 3\n23 = (5 × 4) + 3\n0 ≤ 3 < 5',
    detailedCorrectionAr: 'يبقى 3 أقلام. لا تكفي لإعطاء كل واحد من الأطفال الخمسة قلماً آخر. الحاصل 4 والباقي 3.', xpReward: 10,
  },
  {
    id: 'math-5ap-division-independent', level: 2, levelLabelAr: 'أحاول وحدي', type: 'calculation',
    problemAr: 'أوزّع 29 قلماً على 6 أطفال بالتساوي، مع إعطاء كل طفل أكبر عدد ممكن من الأقلام الكاملة. كم قلماً يبقى؟ اكتب الباقي فقط.',
    hintsAr: ['أبحث في مضاعفات 6، ثم أحسب ما لم أوزعه.'],
    progressiveHints: [
      { labelAr: 'أبحث', contentAr: '6 × 4 = 24، و6 × 5 = 30. لا أستطيع توزيع أقلام أكثر من 29.' },
      { labelAr: 'أحسب الباقي', contentAr: 'أعطي كل طفل 4 أقلام، فأوزع 24. أطرح 24 من 29، وأتحقق أن الباقي أصغر من 6.' },
    ],
    calculationAnswer: 5, solutionAr: '5', operationsAr: '6 × 4 = 24\n29 − 24 = 5\n29 = (6 × 4) + 5\n0 ≤ 5 < 6',
    detailedCorrectionAr: 'الحاصل 4، والباقي 5. بقيت خمسة أقلام، وهي لا تكفي لإعطاء كل طفل قلماً آخر.', xpReward: 15,
  },
];

const divisionTransfer: ProgressiveExercise = {
  id: 'math-5ap-division-transfer', level: 3, levelLabelAr: 'أطبّق في وضعية جديدة', type: 'calculation',
  problemAr: 'أضع 52 بطاقة في أكياس، في كل كيس 8 بطاقات. كم كيساً ممتلئاً أستطيع تكوينه؟ اكتب عدد الأكياس، وليس الباقي.',
  hintsAr: ['هنا أعرف عدد البطاقات في الكيس وأبحث عن عدد الأكياس.'],
  progressiveHints: [
    { labelAr: 'أجرب المضاعفات', contentAr: '8 × 6 = 48، و8 × 7 = 56. عندي 52 بطاقة فقط.' },
    { labelAr: 'أقرأ المطلوب', contentAr: 'أستطيع استعمال 48 بطاقة في أكياس كاملة، وتبقى 4 بطاقات. المطلوب هو عدد الأكياس الكاملة.' },
  ],
  calculationAnswer: 6, solutionAr: '6', operationsAr: '8 × 6 = 48\n52 − 48 = 4\n52 = (8 × 6) + 4\n0 ≤ 4 < 8',
  detailedCorrectionAr: 'أكوّن 6 أكياس ممتلئة، وتبقى 4 بطاقات لا تكفي لملء كيس آخر. في هذه الوضعية الحاصل هو عدد الأكياس: 6.', xpReward: 20,
};

const divisionPath: LearningPath = {
  titleAr: 'المهمة الأولى: أقسم وأفهم الباقي',
  prerequisiteAr: 'أتذكر الضرب والطرح: 4 × 4 = 16، و17 − 16 = 1. سأستعملهما لأقسم وأتحقق من جوابي.',
  steps: [
    {
      kind: 'observe', titleAr: 'أوزّع بالتساوي',
      textAr: 'عندي 17 قلماً و4 أطفال. أعطي كل طفل 4 أقلام، فأوزّع 16 قلماً. يبقى قلم واحد. لا يكفي لأعطي كل طفل قلماً آخر دون تقسيم القلم.',
      visual: { type: 'equal_shares', groups: 4, perGroup: 4, remainder: 1, captionAr: 'أربع حصص متساوية، في كل حصة 4 أقلام، وقلم واحد متبقٍّ.' },
    },
    {
      kind: 'model', titleAr: 'أسمّي الأعداد وأتحقق',
      textAr: '17 هو المقسوم: كل الأقلام.\n4 هو المقسوم عليه: عدد الأطفال.\nالحاصل 4: نصيب كل طفل.\nالباقي 1: ما لم أوزعه.\n\nلماذا لا أتوقف عند 3 أقلام لكل طفل؟ لأنه ستبقى 5 أقلام، وهي تكفي لإعطاء كل طفل قلماً آخر. إذن أواصل التوزيع.',
      workedExample: { operationsAr: '4 × 4 = 16\n17 − 16 = 1\n17 = (4 × 4) + 1\n0 ≤ 1 < 4', solution: '17 ÷ 4: الحاصل 4 والباقي 1. أتحقق بالضرب ثم بإضافة الباقي. الباقي غير سالب وأصغر من المقسوم عليه. هذه قسمة إقليدية.' },
    },
    { kind: 'guided', titleAr: 'أكمل معي حساب الباقي', textAr: 'الضرب معطى لك. أكمل الطرح، ثم تحقق من جوابك.', exerciseId: divisionExercises[0].id },
    { kind: 'independent', titleAr: 'أبحث وأحسب وحدي', textAr: 'أختار الضرب المناسب، ثم أطرح. أستطيع طلب مساعدة إذا احتجت إليها.', exerciseId: divisionExercises[1].id },
    { kind: 'transfer', titleAr: 'أستعمل القسمة بطريقة أخرى', textAr: 'هذه المرة أبحث عن عدد المجموعات. أقرأ جيداً: هل المطلوب الحاصل أم الباقي؟', exerciseId: divisionTransfer.id },
  ],
};

/** Keep IDs, ordinary rules, quiz questions and previously awarded rewards intact. */
export function applyAutonomyPilot(lesson: CourseLesson): CourseLesson {
  if (lesson.id === 'math-4ap-numbers-under-100k') {
    return {
      ...lesson,
      summaryAr: 'أعرف منزلة كل رقم وقيمته، ثم أتدرّب على قراءة الأعداد وتفكيكها وحصرها. أبدأ بمهمة قصيرة عن قيمة الرقم.',
      learningPath: placeValuePath,
      progressiveExercises: [...placeValueExercises, ...lesson.progressiveExercises ?? []],
      evaluationExercises: [...lesson.evaluationExercises ?? [], placeValueTransfer],
    };
  }
  if (lesson.id === 'math-5ap-division') {
    return {
      ...lesson,
      summaryAr: 'أبدأ بتوزيع أشياء بالتساوي. أفهم الحاصل والباقي، وأتحقق من جوابي بالضرب والطرح، ثم أواصل إلى تدريبات القسمة.',
      learningPath: divisionPath,
      progressiveExercises: [...divisionExercises, ...lesson.progressiveExercises ?? []],
      evaluationExercises: [...lesson.evaluationExercises ?? [], divisionTransfer],
    };
  }
  const mission = MISSIONS_BY_LESSON.get(lesson.id);
  const withMission = mission ? applyMission(lesson, mission) : lesson;
  const second = SECOND_MISSIONS_BY_LESSON.get(lesson.id);
  return second ? applyNextMission(withMission, second) : withMission;
}
