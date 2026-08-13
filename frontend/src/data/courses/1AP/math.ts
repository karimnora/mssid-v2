import { CourseLesson } from '../../../types';

// 1AP is an initiation year (no official trimester exams in Algeria) — content here is
// deliberately very visual and playful (large emoji counters, short sentences) for 5-6 year-olds
// who are not yet fully reading. Original MSSID DZ authoring following the general structure of
// the official 1AP curriculum (nombres 0-20, formes, couleurs, comparaison) — not a verbatim
// reproduction of a ministry document.
const SOURCE_NOTE_1AP_MATH =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة التمهيدي/السنة الأولى ابتدائي، مبسّط جداً وبصري (بدون امتحانات فصلية رسمية في هذا المستوى) — وليس نسخة حرفية عن وثيقة رسمية.';

export const MATH_1AP: CourseLesson[] = [
  // ==========================================
  // TRIMESTRE 1
  // ==========================================
  {
    id: 'math-1ap-t1-numbers-0-5',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'السلسلة 1: الأعداد من 0 إلى 5',
    categoryAr: 'الرياضيات - الأعداد الأولى',
    titleAr: 'أَتَعَرَّفُ عَلَى الأَعْدَادِ: 0 - 1 - 2 - 3 - 4 - 5 🖐️',
    summaryAr: 'يتعلم الطفل عدّ الأشياء من 0 إلى 5 بمساعدة أصابعه ورسم كل رقم بشكل بسيط ومرح.',
    objectiveAr: 'عدّ مجموعة من الأشياء (حتى 5) والربط بينها وبين الرقم المناسب.',
    objectivesAr: [
      'أَعُدُّ الأشياء من 0 إلى 5 بأصابعي.',
      'أَرْبِطُ بين مجموعة أشياء والرقم المناسب لها.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ رَقْمٍ.',
    ],
    discoveryAr: 'ارفع يدك 🖐️ وعُدَّ أصابعك واحداً واحداً: 1، 2، 3، 4، 5!',
    rulesAr: [
      'العَدَدُ 0 يعني: لا يوجد أي شيء، الصندوق فارغ تماماً.',
      'نَعُدُّ الأشياء بالترتيب: 1، 2، 3، 4، 5 — كل شيء له رقم واحد فقط.',
      'عدد أصابع اليد الواحدة هو 5.',
    ],
    examplesAr: [
      { problem: 'كم عدد التفاحات؟ 🍎🍎🍎', solution: '3 تفاحات' },
    ],
    detailedCourse: {
      introAr: 'الأعداد أصدقاؤنا الصغار! كل عدد له شكل خاص به، ونتعلمه بالعدّ على أصابعنا وبالنظر إلى الأشياء من حولنا.',
      vocabulary: [
        { termAr: 'العَدُّ 🔢', definitionAr: 'قول الأرقام بالترتيب: 1، 2، 3...' },
        { termAr: 'صِفْرٌ 0️⃣', definitionAr: 'يعني لا يوجد أي شيء إطلاقاً.' },
      ],
      visualizationHintAr: 'استعمل أزراراً أو حبات فول واطلب من الطفل ترتيبها بجانب كل رقم مكتوب على ورقة.',
      commonMistakes: [
        { mistakeAr: 'عدّ نفس الشيء مرتين.', correctionAr: 'علّم الطفل تحريك الإصبع أو الشيء بعد عدّه حتى لا يعيد عدّه.' },
      ],
      takeawayAr: 'أعدّ الأشياء بالترتيب: 0 (لا شيء)، 1، 2، 3، 4، 5 (كل أصابع يدي الواحدة).',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-numbers05',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'عُدَّ: ⭐⭐⭐ — كم عدد النجوم؟',
        hintsAr: ['عُدّ نجمة نجمة: 1، 2، 3.'],
        solutionAr: '3',
        detailedCorrectionAr: 'أحسنت! يوجد 3 نجوم.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-numbers05',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ارفع 4 أصابع من يدك. كم أصبعاً بقي مطوياً؟',
        hintsAr: ['يدك فيها 5 أصابع كلها.'],
        solutionAr: '1',
        detailedCorrectionAr: 'ممتاز! 5 أصابع - 4 مرفوعة = 1 مطوي.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-numbers05',
      type: 'association',
      titleAr: 'لعبة عدّ النجوم 🌟',
      instructionsAr: 'اربط كل مجموعة نجوم بالرقم الصحيح!',
      items: [
        { questionOrPromptAr: '⭐⭐', correctAnswerAr: '2', optionsAr: ['2', '4', '1'], explanationAr: 'يوجد نجمتان، إذن الرقم 2.' },
        { questionOrPromptAr: '⭐⭐⭐⭐⭐', correctAnswerAr: '5', optionsAr: ['5', '3', '2'], explanationAr: 'يوجد 5 نجوم، مثل أصابع يدك!' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-numbers05',
        questionAr: 'كم عدد الكرات؟ ⚽⚽⚽⚽',
        options: [
          { id: 'a', textAr: '4', isCorrect: true, explanationAr: 'صحيح! عددنا 4 كرات.' },
          { id: 'b', textAr: '2', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t1-numbers-6-10',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'السلسلة 2: الأعداد من 6 إلى 10',
    categoryAr: 'الرياضيات - الأعداد الأولى',
    titleAr: 'أُوَاصِلُ العَدَّ: 6 - 7 - 8 - 9 - 10 🙌',
    summaryAr: 'يواصل الطفل تعلم الأعداد من 6 إلى 10 باستعمال يديه الاثنتين وأشياء ملموسة.',
    objectiveAr: 'عدّ مجموعة من الأشياء حتى 10 والربط بينها وبين الرقم المناسب.',
    objectivesAr: [
      'أَعُدُّ الأشياء من 6 إلى 10 مستعملاً يديّ الاثنتين.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ رَقْمٍ من 6 إلى 10.',
      'أُرَتِّبُ الأعداد من 0 إلى 10 بالترتيب الصحيح.',
    ],
    discoveryAr: 'ارفع يديك الاثنتين 🙌 وعُدَّ كل أصابعك: كم أصبعاً عندك؟',
    rulesAr: [
      'يَدَايَ الاثْنَتَانِ فِيهِمَا 10 أَصَابِعَ: 5 في اليد اليمنى و 5 في اليد اليسرى.',
      'بعد العدد 9 يأتي العدد 10 — وهو أول عدد فيه رقمان (1 و 0).',
      'نرتب الأعداد من الأصغر للأكبر: 0، 1، 2، 3، 4، 5، 6، 7، 8، 9، 10.',
    ],
    examplesAr: [
      { problem: 'كم عدد الفراشات؟ 🦋🦋🦋🦋🦋🦋🦋', solution: '7 فراشات' },
    ],
    detailedCourse: {
      introAr: 'بعد أن تعلمنا العدّ حتى 5 بيد واحدة، نستعمل الآن يدينا الاثنتين معاً لنصل إلى 10!',
      vocabulary: [
        { termAr: 'عَشَرَةٌ 🙌', definitionAr: 'عدد أصابع يديك الاثنتين معاً.' },
      ],
      visualizationHintAr: 'ألصق 10 ملصقات صغيرة على ورقة، واطلب من الطفل عدّها بصوت عالٍ من 1 إلى 10.',
      commonMistakes: [
        { mistakeAr: 'نسيان ترتيب الأعداد ذهاباً وإياباً.', correctionAr: 'تدرّب يومياً على العدّ من 0 إلى 10 ثم من 10 إلى 0.' },
      ],
      takeawayAr: 'بعد 5 يأتي: 6، 7، 8، 9، 10. العدد 10 هو عدد أصابع يديّ الاثنتين معاً.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-numbers610',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'عُدَّ: 🐟🐟🐟🐟🐟🐟 — كم عدد الأسماك؟',
        hintsAr: ['عُدّها واحدة واحدة.'],
        solutionAr: '6',
        detailedCorrectionAr: 'أحسنت! يوجد 6 أسماك.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-numbers610',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما هو العدد الذي يأتي بعد 9 مباشرة؟',
        hintsAr: ['هو عدد أصابع يديك الاثنتين.'],
        solutionAr: '10',
        detailedCorrectionAr: 'ممتاز! بعد 9 يأتي 10.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-numbers610',
      type: 'quiz_flash',
      titleAr: 'سباق العدّ حتى 10',
      instructionsAr: 'اختر الرقم الصحيح لكل مجموعة بسرعة!',
      items: [
        { questionOrPromptAr: '🐦🐦🐦🐦🐦🐦🐦🐦', correctAnswerAr: '8', optionsAr: ['8', '6', '10'], explanationAr: 'عددنا 8 عصافير.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-numbers610',
        questionAr: 'كم إجمالي أصابع يديك الاثنتين؟',
        options: [
          { id: 'a', textAr: '10', isCorrect: true, explanationAr: 'صحيح! 5 + 5 = 10.' },
          { id: 'b', textAr: '5', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t1-shapes-colors',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الهندسة والتصنيف',
    sequenceAr: 'السلسلة 3: الأشكال والألوان',
    categoryAr: 'الرياضيات - الأشكال والألوان',
    titleAr: 'الأَشْكَالُ وَالأَلْوَانُ مِنْ حَوْلِي 🔴🟦🔺',
    summaryAr: 'يتعرف الطفل على الأشكال البسيطة (الدائرة، المربع، المثلث) والألوان الأساسية (أحمر، أزرق، أصفر، أخضر) بطريقة بصرية ومرحة.',
    objectiveAr: 'التعرف على الأشكال والألوان الأساسية وتصنيف الأشياء حسبها.',
    objectivesAr: [
      'أُمَيِّزُ الدَّائِرَةَ وَالمُرَبَّعَ وَالمُثَلَّثَ.',
      'أُسَمِّي الألوان الأساسية: أحمر، أزرق، أصفر، أخضر.',
      'أُصَنِّفُ الأشياء حسب شكلها أو لونها.',
    ],
    discoveryAr: 'انظر حولك في الغرفة: ما هو أول شيء أحمر تراه؟ وما هو أول شيء مستدير تراه؟',
    rulesAr: [
      'الدَّائِرَةُ 🔴: شكل مستدير مثل الكرة أو عجلة السيارة.',
      'المُرَبَّعُ 🟦: له 4 أضلاع متساوية، مثل النافذة المربعة.',
      'المُثَلَّثُ 🔺: له 3 أضلاع فقط، مثل قطعة البيتزا.',
      'الألوان الأساسية: أحمر 🔴، أزرق 🔵، أصفر 🟡، أخضر 🟢.',
    ],
    examplesAr: [
      { problem: 'ما شكل ولون هذه الكرة؟ 🔴', solution: 'دَائِرَةٌ حَمْرَاءُ.' },
    ],
    detailedCourse: {
      introAr: 'العالم من حولنا مليء بالأشكال والألوان الجميلة! نتعلم تسميتها لنصف كل شيء نراه بدقة.',
      vocabulary: [
        { termAr: 'الشَّكْلُ', definitionAr: 'صورة الشيء الخارجية: مستدير، مربع، مثلث...' },
        { termAr: 'اللَّوْنُ', definitionAr: 'ما نراه بعيوننا يميز الأشياء: أحمر، أزرق...' },
      ],
      visualizationHintAr: 'اجمع مع الطفل أشياء ملونة من المنزل (لعب، ملابس) واطلب منه تصنيفها حسب اللون في صناديق مختلفة.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين المربع والمثلث.', correctionAr: 'ذكّر الطفل: المربع له 4 أضلاع، والمثلث له 3 فقط — عدّا الأضلاع معاً.' },
      ],
      takeawayAr: 'دائرة = مستديرة. مربع = 4 أضلاع. مثلث = 3 أضلاع. الألوان الأساسية: أحمر، أزرق، أصفر، أخضر.',
    },
    interactiveTool: 'geometry_visualizer',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-shapes',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما اسم هذا الشكل؟ 🔺',
        hintsAr: ['له 3 أضلاع فقط.'],
        solutionAr: 'مُثَلَّثٌ',
        detailedCorrectionAr: 'أحسنت! هذا مثلث لأن له 3 أضلاع.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-shapes',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما لون الموزة؟ 🍌',
        hintsAr: ['نفس لون الشمس ☀️.'],
        solutionAr: 'أَصْفَرُ',
        detailedCorrectionAr: 'ممتاز! الموزة صفراء اللون.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-shapes',
      type: 'association',
      titleAr: 'لعبة صندوق الأشكال والألوان',
      instructionsAr: 'اربط كل شيء بشكله ولونه الصحيح!',
      items: [
        { questionOrPromptAr: 'عجلة الدراجة ⚪', correctAnswerAr: 'دَائِرَةٌ', optionsAr: ['دَائِرَةٌ', 'مُرَبَّعٌ'], explanationAr: 'العجلة مستديرة الشكل.' },
        { questionOrPromptAr: 'ورقة الشجر 🍃', correctAnswerAr: 'أَخْضَرُ', optionsAr: ['أَخْضَرُ', 'أَحْمَرُ'], explanationAr: 'أوراق الشجر خضراء عادة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-shapes',
        questionAr: 'أي شكل له 4 أضلاع متساوية؟',
        options: [
          { id: 'a', textAr: 'المُرَبَّعُ 🟦', isCorrect: true, explanationAr: 'صحيح! المربع له 4 أضلاع متساوية.' },
          { id: 'b', textAr: 'الدَّائِرَةُ 🔴', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // ==========================================
  // TRIMESTRE 2
  // ==========================================
  {
    id: 'math-1ap-t2-numbers-11-15',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'السلسلة 4: الأعداد من 11 إلى 15',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'أَتَعَلَّمُ الأَعْدَادَ: 11 - 12 - 13 - 14 - 15 🎈',
    summaryAr: 'يتعلم الطفل الأعداد من 11 إلى 15 باستعمال يديه الاثنتين (10) زائد أصابع أخرى.',
    objectiveAr: 'عدّ مجموعة من الأشياء حتى 15 والتعرف على شكل كل رقم.',
    objectivesAr: [
      'أَعُدُّ من 11 إلى 15 (عشرة كاملة + أصابع إضافية).',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ رَقْمٍ من 11 إلى 15.',
      'أُرَتِّبُ الأعداد من 0 إلى 15.',
    ],
    discoveryAr: 'ارفع يديك الاثنتين (10) ثم أضف إصبعاً واحداً من صديقك. كم أصبحت؟',
    rulesAr: [
      'العدد 11 = 10 (يدان كاملتان) + 1 إصبع إضافي.',
      'العدد 15 = 10 + 5 (عشرة كاملة وخمسة أصابع من يد أخرى).',
      'كل هذه الأعداد أكبر من 10، لذلك تُكتب برقمين: 1 ثم رقم آخر.',
    ],
    examplesAr: [
      { problem: 'عندك 10 حبات عنب، وأعطاك صديقك 3 حبات أخرى. كم أصبح عندك؟', solution: '13 حبة عنب.' },
    ],
    detailedCourse: {
      introAr: 'بعد العشرة الكاملة (يدينا الاثنتين)، نُضيف أصابع أخرى لنصل إلى أعداد أكبر مثل 11، 12، 13، 14، 15!',
      vocabulary: [
        { termAr: 'أَحَدَ عَشَرَ 11', definitionAr: 'عشرة كاملة زائد واحد.' },
      ],
      visualizationHintAr: 'استعمل حزمة من 10 عيدان مربوطة معاً + عيدان مفردة لتوضيح فكرة 10 + الباقي.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين كتابة 12 و 21.', correctionAr: 'ذكّر الطفل: نبدأ دائماً بالعشرة (1) على اليسار، ثم الباقي على اليمين.' },
      ],
      takeawayAr: 'كل الأعداد بعد 10 = عشرة كاملة + أصابع إضافية. مثال: 14 = 10 + 4.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-numbers1115',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'عندك 10 بالونات، وأخذت 2 أخرى. كم أصبح عندك؟ 🎈',
        hintsAr: ['10 + 2 = ؟'],
        solutionAr: '12',
        detailedCorrectionAr: 'أحسنت! 10 + 2 = 12.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-numbers1115',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما هو العدد الذي يأتي بعد 14 مباشرة؟',
        hintsAr: ['فكر في العدّ: 12، 13، 14...'],
        solutionAr: '15',
        detailedCorrectionAr: 'ممتاز! بعد 14 يأتي 15.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-numbers1115',
      type: 'quiz_flash',
      titleAr: 'سباق العدّ حتى 15',
      instructionsAr: 'اختر الرقم الصحيح بسرعة!',
      items: [
        { questionOrPromptAr: '10 أصابع + 3 أصابع = ؟', correctAnswerAr: '13', optionsAr: ['13', '10', '17'], explanationAr: '10 + 3 = 13.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-numbers1115',
        questionAr: 'العدد 15 يساوي:',
        options: [
          { id: 'a', textAr: '10 + 5', isCorrect: true, explanationAr: 'صحيح! عشرة كاملة زائد خمسة.' },
          { id: 'b', textAr: '10 + 8', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-more-less-equal',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'المقارنة والتصنيف',
    sequenceAr: 'السلسلة 5: أكثر من، أقل من، بقدر',
    categoryAr: 'الرياضيات - المقارنة',
    titleAr: 'أُقَارِنُ الكَمِّيَّاتِ: أَكْثَرُ، أَقَلُّ، بِقَدْرِ 🍎🍐',
    summaryAr: 'يتعلم الطفل مقارنة مجموعتين من الأشياء ومعرفة أيهما أكثر أو أقل أو متساويتان (بقدر).',
    objectiveAr: 'مقارنة مجموعتين من الأشياء بصرياً وتحديد الأكثر والأقل والمتساوي.',
    objectivesAr: [
      'أُقَارِنُ بين مجموعتين وأقول أيهما أكثر.',
      'أُقَارِنُ بين مجموعتين وأقول أيهما أقل.',
      'أَتَعَرَّفُ عَلَى مَعْنَى "بِقَدْرِ" (متساويتان).',
    ],
    discoveryAr: 'عندك 4 تفاحات 🍎🍎🍎🍎 وعند صديقك 2 تفاحة 🍎🍎. من عنده أكثر؟',
    rulesAr: [
      'أَكْثَرُ مِنْ: عندما يكون عدد المجموعة الأولى أكبر من الثانية.',
      'أَقَلُّ مِنْ: عندما يكون عدد المجموعة الأولى أصغر من الثانية.',
      'بِقَدْرِ (مُتَسَاوِيَتَانِ): عندما يكون عدد المجموعتين نفسه تماماً.',
    ],
    examplesAr: [
      { problem: '🍎🍎🍎 مقابل 🍐🍐🍐 — هل هما بقدر؟', solution: 'نعم، بقدر (3 = 3).' },
    ],
    detailedCourse: {
      introAr: 'لكي نعرف من عنده أكثر أو أقل، نعدّ كل مجموعة ثم نقارن العددين.',
      vocabulary: [
        { termAr: 'بِقَدْرِ ⚖️', definitionAr: 'عندما تكون كميتان متساويتين تماماً.' },
      ],
      visualizationHintAr: 'ضع مجموعتين من الحلوى أمام الطفل واطلب منه أن يشير للمجموعة الأكثر بيده مباشرة.',
      commonMistakes: [
        { mistakeAr: 'الحكم بالعين دون العدّ الفعلي.', correctionAr: 'شجع الطفل دائماً على عدّ كل مجموعة بإصبعه قبل الحكم عليها.' },
      ],
      takeawayAr: 'أعدّ كل مجموعة، ثم أقارن: أكثر (عدد أكبر)، أقل (عدد أصغر)، بقدر (نفس العدد).',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-compare',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: '🐱🐱🐱 مقابل 🐶🐶 — أيهما أكثر؟',
        hintsAr: ['عُدّ القطط ثم عُدّ الكلاب.'],
        solutionAr: 'القِطَطُ (3 أكثر من 2)',
        detailedCorrectionAr: 'أحسنت! 3 قطط أكثر من 2 كلب.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-compare',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: '🌸🌸🌸🌸 مقابل 🌼🌼🌼🌼 — هل هما بقدر؟',
        hintsAr: ['عُدّ كلتا المجموعتين.'],
        solutionAr: 'نَعَمْ، بِقَدْرِ (4 = 4)',
        detailedCorrectionAr: 'ممتاز! كلتا المجموعتين فيهما 4 زهرات.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-compare',
      type: 'association',
      titleAr: 'لعبة الميزان المرح',
      instructionsAr: 'اختر أيهما أكثر أو أقل أو بقدر!',
      items: [
        { questionOrPromptAr: '🍬🍬🍬🍬🍬 مقابل 🍬🍬', correctAnswerAr: 'المَجْمُوعَةُ الأُولَى أَكْثَرُ', optionsAr: ['المَجْمُوعَةُ الأُولَى أَكْثَرُ', 'مُتَسَاوِيَتَانِ'], explanationAr: '5 حلوى أكثر من 2 حلوى.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-compare',
        questionAr: 'عندك 3 كرات وعند أختك 3 كرات أيضاً. ماذا نقول؟',
        options: [
          { id: 'a', textAr: 'الكَمِّيَّتَانِ بِقَدْرِ (متساويتان)', isCorrect: true, explanationAr: 'صحيح! 3 = 3، إذن هما بقدر.' },
          { id: 'b', textAr: 'عندي أكثر', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // ==========================================
  // TRIMESTRE 3
  // ==========================================
  {
    id: 'math-1ap-t3-numbers-16-20',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'السلسلة 6: الأعداد من 16 إلى 20',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'أُتِمُّ رِحْلَتِي مَعَ الأَعْدَادِ: 16 - 17 - 18 - 19 - 20 🏆',
    summaryAr: 'يُتمّ الطفل رحلته مع أعداد السنة الأولى فيتعلم 16 إلى 20، آخر محطة قبل الانتقال لمنازل جديدة.',
    objectiveAr: 'عدّ مجموعة من الأشياء حتى 20 والتعرف على شكل كل رقم من 16 إلى 20.',
    objectivesAr: [
      'أَعُدُّ من 16 إلى 20.',
      'أَتَعَرَّفُ عَلَى العَدَدِ 20 كَآخِرِ مَحَطَّةٍ فِي رِحْلَتِي.',
      'أُرَتِّبُ كُلَّ الأعداد من 0 إلى 20 بالترتيب.',
    ],
    discoveryAr: 'لديك 10 أصابع يديك + 10 أصابع قدميك. كم المجموع الكلي؟',
    rulesAr: [
      'العدد 20 = 10 + 10 (يدان كاملتان مرتين، أو يدان وقدمان).',
      'من 16 إلى 20، نتقدم واحداً واحداً: 16، 17، 18، 19، 20.',
      'العدد 20 هو آخر عدد نتعلمه في السنة الأولى، ونواصل في السنة القادمة!',
    ],
    examplesAr: [
      { problem: 'عندك 10 كرات حمراء و 8 كرات زرقاء. كم كرة عندك؟', solution: '18 كرة.' },
    ],
    detailedCourse: {
      introAr: 'ها نحن نصل إلى آخر أعداد هذه السنة! بعد أن أتقنّا العدّ حتى 15، نتابع الرحلة حتى نصل إلى 20 بفخر.',
      vocabulary: [
        { termAr: 'عِشْرُونَ 20 🏆', definitionAr: 'عدد يساوي 10 + 10، آخر عدد نتعلمه هذه السنة.' },
      ],
      visualizationHintAr: 'ارسم مع الطفل خط أعداد كبير من 0 إلى 20 وعلّقه على الحائط، واطلب منه لمس كل عدد وهو يعدّه.',
      commonMistakes: [
        { mistakeAr: 'التوقف أو التردد عند الانتقال من 19 إلى 20.', correctionAr: 'ذكّر الطفل أن 20 يأتي مباشرة بعد 19، تماماً كما يأتي 10 بعد 9.' },
      ],
      takeawayAr: 'من 16 إلى 20 نتقدم واحداً واحداً. 20 = 10 + 10، وهو آخر عدد في رحلة هذه السنة.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-numbers1620',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما هو العدد الذي يأتي بعد 17؟',
        hintsAr: ['فكر في العدّ: 15، 16، 17...'],
        solutionAr: '18',
        detailedCorrectionAr: 'أحسنت! بعد 17 يأتي 18.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-numbers1620',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما هو آخر عدد نتعلمه في هذه السنة؟',
        hintsAr: ['هو أكبر عدد وصلنا إليه.'],
        solutionAr: '20',
        detailedCorrectionAr: 'ممتاز! العدد 20 هو آخر محطة في رحلتنا.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-numbers1620',
      type: 'quiz_flash',
      titleAr: 'سباق الوصول إلى 20',
      instructionsAr: 'اختر الرقم الصحيح لإكمال رحلة الأعداد!',
      items: [
        { questionOrPromptAr: '10 + 10 = ؟', correctAnswerAr: '20', optionsAr: ['20', '15', '11'], explanationAr: '10 + 10 = 20.' },
      ],
      xpReward: 25,
    },
    quiz: [
      {
        id: 'q1-math1ap-numbers1620',
        questionAr: 'أي عدد يأتي بعد 19 مباشرة؟',
        options: [
          { id: 'a', textAr: '20', isCorrect: true, explanationAr: 'صحيح! بعد 19 يأتي 20.' },
          { id: 'b', textAr: '10', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },
];
