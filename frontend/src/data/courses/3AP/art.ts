import { CourseLesson } from '../../../types';

export const ART_3AP: CourseLesson[] = [
  {
    id: 'art-3ap-t1-colors-rhythm',
    grade: '3AP',
    subject: 'art',
    trimester: 1,
    domainAr: 'التربية الفنية والموسيقية',
    sequenceAr: 'السلسلة 1: الألوان الأساسية والإيقاع الموسيقي',
    categoryAr: 'الألوان والإيقاع',
    titleAr: 'الأَلْوَانُ الأَسَاسِيَّةُ وَالأَلْوَانُ الثَّانَوِيَّةُ وَالإِيقَاعُ المُوسِيقِيُّ',
    summaryAr: 'يتعلم الطفل التمييز بين الألوان الأساسية (الأحمر، الأزرق، الأصفر) وكيفية مزجها للحصول على الألوان الثانوية، إضافة للتعرف على الإيقاع والأنشودة.',
    objectivesAr: [
      'أُمَيِّزُ الأَلْوَانَ الأَسَاسِيَّةَ الثَّلاَثَةَ.',
      'أَمْزُجُ لَوْنَيْنِ أَسَاسِيَّيْنِ لِلْحُصُولِ عَلَى لَوْنٍ ثَانَوِيٍّ.',
    ],
    detailedCourse: {
      introAr: 'الألوان الأساسية الثلاثة تكفي لصنع كل الألوان الأخرى! امزج اثنين منها فتحصل على لون ثانوي جديد.',
      vocabulary: [
        { termAr: 'الألوان الأساسية 🎨', definitionAr: 'ثلاثة ألوان لا تنتج عن مزج ألوان أخرى: الأحمر، الأزرق، الأصفر.' },
        { termAr: 'الألوان الثانوية', definitionAr: 'ألوان تنتج عن مزج لونين أساسيين: الأخضر، البرتقالي، البنفسجي.' },
      ],
      visualizationHintAr: 'امزج قطرة من اللون الأصفر مع قطرة من الأزرق على ورقة بيضاء وشاهد الأخضر يظهر أمامك.',
      commonMistakes: [
        { mistakeAr: 'الاعتقاد أن الأخضر لون أساسي.', correctionAr: 'الأخضر ثانوي: ينتج فقط من مزج الأصفر والأزرق.' },
      ],
      takeawayAr: 'ثلاثة أساسية (أحمر، أزرق، أصفر) تُمزج لتنتج ثلاثة ثانوية (أخضر، برتقالي، بنفسجي).',
    },
    rulesAr: [
      'الأَلْوَانُ الأَسَاسِيَّةُ: الأَحْمَرُ، الأَزْرَقُ، الأَصْفَرُ.',
      'أصفر + أزرق = أَخْضَرُ | أحمر + أصفر = بَرْتُقَالِيُّ | أحمر + أزرق = بَنَفْسَجِيُّ',
    ],
    keyFormulas: [
      { labelAr: 'مزج الألوان الثانوية', formulaAr: 'أصفر+أزرق=أخضر | أحمر+أصفر=برتقالي | أحمر+أزرق=بنفسجي' },
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر مزج الألوان 🎨',
      instructionsAr: 'اربط كل مزيج من لونين أساسيين باللون الثانوي الناتج!',
      pairs: [
        { leftAr: 'أصفر + أزرق', rightAr: 'أخضر 🟢', explanationAr: 'مزج الأصفر مع الأزرق ينتج الأخضر.' },
        { leftAr: 'أحمر + أصفر', rightAr: 'برتقالي 🟠', explanationAr: 'مزج الأحمر مع الأصفر ينتج البرتقالي.' },
        { leftAr: 'أحمر + أزرق', rightAr: 'بنفسجي 🟣', explanationAr: 'مزج الأحمر مع الأزرق ينتج البنفسجي.' },
      ],
    },
    examplesAr: [
      { problem: 'ما اللون الناتج عن مزج الأصفر والأزرق؟', solution: 'الأخضر.' },
    ],
    progressiveExercises: [
      {
        id: 'ex1-art3ap-colors',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — سهل',
        problemAr: 'ما هي الألوان الأساسية الثلاثة؟',
        hintsAr: ['لا تنتج عن مزج ألوان أخرى.'],
        solutionAr: 'الأَحْمَرُ، الأَزْرَقُ، الأَصْفَرُ',
        detailedCorrectionAr: 'صحيح! هذه الألوان الثلاثة أساس كل الألوان الأخرى.',
        xpReward: 10,
      },
      {
        id: 'ex2-art3ap-colors',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — متوسط',
        problemAr: 'ماذا ينتج عن مزج الأحمر والأزرق معاً؟',
        hintsAr: ['لون بين الأحمر والأزرق، يُستعمل في الزهور الجميلة.'],
        solutionAr: 'البَنَفْسَجِيُّ',
        detailedCorrectionAr: 'ممتاز! أحمر + أزرق = بنفسجي.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-art3ap-colors',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي مزج الألوان',
      instructionsAr: 'اختر اللون الناتج بسرعة!',
      items: [
        { questionOrPromptAr: 'اللون الناتج عن مزج الأحمر والأصفر هو:', correctAnswerAr: 'البرتقالي', optionsAr: ['البرتقالي', 'الأخضر', 'البنفسجي'], explanationAr: 'أحمر + أصفر = برتقالي.' },
        { questionOrPromptAr: 'هل الأزرق لون أساسي أم ثانوي؟', correctAnswerAr: 'أساسي', optionsAr: ['أساسي', 'ثانوي'], explanationAr: 'الأزرق أحد الألوان الأساسية الثلاثة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-art3ap-colors',
        questionAr: 'اللون الأخضر هو لون:',
        options: [
          { id: 'a', textAr: 'ثانوي', isCorrect: true, explanationAr: 'الأخضر ينتج عن مزج الأصفر والأزرق.' },
          { id: 'b', textAr: 'أساسي', isCorrect: false, explanationAr: 'الألوان الأساسية ثلاثة فقط.' },
          { id: 'c', textAr: 'محايد', isCorrect: false, explanationAr: 'الأخضر لون ثانوي وليس محايداً.' },
        ],
      },
    ],
  },
  {
    id: 'art-3ap-t2-shapes-composition',
    grade: '3AP',
    subject: 'art',
    trimester: 2,
    domainAr: 'التربية الفنية والموسيقية',
    categoryAr: 'الأشكال والتكوين',
    titleAr: 'الأشكال الهندسية في التكوين الفني',
    summaryAr: 'استعمال الدائرة والمربع والمثلث لبناء لوحة متوازنة: أمامية، خلفية، وتكرار الأشكال.',
    objectivesAr: ['أُمَيِّزُ الأشكال الهندسية البسيطة.', 'أُكَوِّنُ لوحةً متوازنةً بأشكال ملوّنة.'],
    detailedCourse: {
      introAr: 'في اللوحة الفنية، نستعمل الأشكال الهندسية البسيطة لبناء تكوين متوازن: شكل كبير في المقدمة وأشكال أصغر في الخلفية.',
      vocabulary: [
        { termAr: 'التكوين الفني 🖼️', definitionAr: 'طريقة ترتيب الأشكال والألوان في اللوحة لجعلها متوازنة وجميلة.' },
        { termAr: 'المقدمة والخلفية', definitionAr: 'المقدمة: أقرب عنصر للناظر (يكون أكبر). الخلفية: أبعد عنصر (يكون أصغر).' },
      ],
      visualizationHintAr: 'ارسم دائرة كبيرة في أسفل الورقة (مقدمة) ومربعاً صغيراً في الأعلى (خلفية) — لاحظ الفرق في الإحساس بالمسافة.',
      commonMistakes: [
        { mistakeAr: 'رسم كل الأشكال بنفس الحجم في اللوحة.', correctionAr: 'تكبير الشكل المهم (مقدمة) وتصغير الباقي (خلفية) يعطي إحساساً بالعمق.' },
      ],
      takeawayAr: 'الدائرة والمربع والمثلث أشكال أساسية. الكبير قريب (مقدمة)، الصغير بعيد (خلفية).',
    },
    rulesAr: [
      'الدائرة والمربع والمثلث أشكال أساسية في الرسم.',
      'نُكَبِّرُ الشكل المهم ونُصَغِّرُ الخلفية لإبراز الموضوع.',
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر الأشكال والتكوين 🔺',
      instructionsAr: 'اربط كل شكل بخاصيته!',
      pairs: [
        { leftAr: 'المثلث 🔺', rightAr: '3 أضلاع', explanationAr: 'المثلث شكل له ثلاثة أضلاع.' },
        { leftAr: 'المربع 🟥', rightAr: '4 أضلاع متساوية', explanationAr: 'المربع له أربعة أضلاع متساوية الطول.' },
        { leftAr: 'الدائرة ⚪', rightAr: 'بلا أضلاع أو زوايا', explanationAr: 'الدائرة شكل مستدير بدون أضلاع.' },
      ],
    },
    examplesAr: [
      { problem: 'ما الشكل الذي له ثلاثة أضلاع؟', solution: 'المثلث.' },
    ],
    progressiveExercises: [
      {
        id: 'ex1-art3ap-shapes',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — سهل',
        problemAr: 'كم ضلعاً للمثلث؟',
        hintsAr: ['عُدّ أضلاعه: واحد، اثنان...'],
        solutionAr: '3',
        detailedCorrectionAr: 'صحيح! المثلث له ثلاثة أضلاع.',
        xpReward: 10,
      },
      {
        id: 'ex2-art3ap-shapes',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — متوسط',
        problemAr: 'لإبراز شجرة في مقدمة اللوحة، كيف نرسمها؟',
        hintsAr: ['المقدمة قريبة من الناظر، فتكون...؟'],
        solutionAr: 'كَبِيرَةً',
        detailedCorrectionAr: 'ممتاز! العنصر القريب يُرسَم أكبر ليبدو في المقدمة.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-art3ap-shapes',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي الأشكال والتكوين',
      instructionsAr: 'اختر الإجابة الصحيحة بسرعة!',
      items: [
        { questionOrPromptAr: 'أي شكل ليس له زوايا؟', correctAnswerAr: 'الدائرة', optionsAr: ['الدائرة', 'المربع', 'المثلث'], explanationAr: 'الدائرة مستديرة بلا زوايا.' },
        { questionOrPromptAr: 'العنصر البعيد في اللوحة يُرسَم:', correctAnswerAr: 'أصغر', optionsAr: ['أصغر', 'أكبر'], explanationAr: 'البعيد يبدو أصغر من القريب.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-art3ap-shapes',
        questionAr: 'لإبراز شجرة في لوحة نجعلها:',
        options: [
          { id: 'a', textAr: 'أكبر من الخلفية', isCorrect: true, explanationAr: 'التكبير يجذب العين نحو الموضوع الرئيسي.' },
          { id: 'b', textAr: 'أصغر من كل شيء', isCorrect: false, explanationAr: 'هذا يُخفِي الموضوع بدل إبرازه.' },
          { id: 'c', textAr: 'بلا لون', isCorrect: false, explanationAr: 'اللون يُساعد على التمييز لا إخفاء الشكل.' },
        ],
      },
    ],
  },
  {
    id: 'art-3ap-t3-zellij-patterns',
    grade: '3AP',
    subject: 'art',
    trimester: 3,
    domainAr: 'التربية الفنية والموسيقية',
    categoryAr: 'الزخرفة التراثية',
    titleAr: 'الزخارف الجزائرية والتكرار الإيقاعي',
    summaryAr: 'اكتشاف الزخارف في السجاد والبلاط (الزليج) والتكرار المنتظم للأشكال لصنع إيقاع بصري.',
    objectivesAr: ['أُلاحِظُ التكرار في الزخارف التراثية.', 'أُكَمِّلُ نمطاً زخرفياً بسيطاً.'],
    detailedCourse: {
      introAr: 'الزليج الجزائري فن قديم يُزيّن به البيوت والمساجد، ويعتمد على تكرار أشكال هندسية صغيرة لتكوين نمط كبير جميل.',
      vocabulary: [
        { termAr: 'الزليج 🀄', definitionAr: 'فسيفساء تقليدية من قطع صغيرة ملونة تُرتَّب لتكوين زخرفة هندسية.' },
        { termAr: 'النمط المتكرر', definitionAr: 'شكل أو رسمة تتكرر بانتظام لتكوين زخرفة متناسقة.' },
      ],
      visualizationHintAr: 'ارسم مثلثاً صغيراً ثم كرره أربع مرات بجانب بعضه البعض — لاحظ كيف يتكوّن نمط منتظم.',
      commonMistakes: [
        { mistakeAr: 'الاعتقاد أن الزليج رسم عشوائي.', correctionAr: 'الزليج يعتمد على تكرار منتظم لأشكال هندسية محسوبة بدقة.' },
      ],
      takeawayAr: 'الزليج فسيفساء هندسية جزائرية تراثية، أساسها التكرار المنتظم للأشكال.',
    },
    rulesAr: [
      'التكرار المنتظم يُنتِج إيقاعاً بصرياً جميلاً.',
      'الزليج الجزائري يعتمد على أشكال هندسية متداخلة.',
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر الزخارف الجزائرية 🀄',
      instructionsAr: 'اربط كل عنصر تراثي بمكان استعماله!',
      pairs: [
        { leftAr: 'الزليج 🀄', rightAr: 'جدران البيوت والمساجد', explanationAr: 'الزليج يُستعمل لتزيين الجدران والأرضيات.' },
        { leftAr: 'السجاد المزخرف 🧶', rightAr: 'أرضية البيت', explanationAr: 'السجاد التقليدي يُفرش على الأرض بزخارف متكررة.' },
        { leftAr: 'النمط المتكرر', rightAr: 'إيقاع بصري منتظم', explanationAr: 'تكرار الشكل بانتظام ينتج إيقاعاً بصرياً جميلاً.' },
      ],
    },
    examplesAr: [
      { problem: 'ما معنى «تكرار النمط» في الزخرفة؟', solution: 'إعادة نفس الشكل أو اللون بانتظام.' },
    ],
    progressiveExercises: [
      {
        id: 'ex1-art3ap-pattern',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — سهل',
        problemAr: 'ما اسم الفن الذي يعتمد على قطع فسيفساء ملونة متكررة؟',
        hintsAr: ['فن جزائري تراثي يُستعمل في تزيين الجدران.'],
        solutionAr: 'الزَّلِيجُ',
        detailedCorrectionAr: 'صحيح! الزليج فسيفساء هندسية تقليدية.',
        xpReward: 10,
      },
      {
        id: 'ex2-art3ap-pattern',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — متوسط',
        problemAr: 'لماذا يبدو النمط المتكرر جميلاً في نظر المشاهد؟',
        hintsAr: ['فكّر في الإيقاع المنتظم كما في الموسيقى.'],
        solutionAr: 'لِأَنَّهُ مُنَظَّمٌ وَمُتَنَاسِقٌ (إِيقَاعٌ بَصَرِيٌّ)',
        detailedCorrectionAr: 'ممتاز! التكرار المنتظم يخلق انسجاماً يشبه الإيقاع الموسيقي لكن للعين.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-art3ap-pattern',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي الزخارف الجزائرية',
      instructionsAr: 'اختر الإجابة الصحيحة بسرعة!',
      items: [
        { questionOrPromptAr: 'الزليج هو فن يعتمد على:', correctAnswerAr: 'فسيفساء هندسية متكررة', optionsAr: ['فسيفساء هندسية متكررة', 'الرسم بالفحم فقط', 'النحت على الحجر'], explanationAr: 'الزليج فسيفساء من قطع هندسية متكررة.' },
        { questionOrPromptAr: 'تكرار شكل بانتظام في الزخرفة يُنتج:', correctAnswerAr: 'إيقاعاً بصرياً', optionsAr: ['إيقاعاً بصرياً', 'فوضى بصرية'], explanationAr: 'التكرار المنتظم يخلق انسجاماً وإيقاعاً للعين.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-art3ap-pattern',
        questionAr: 'الزليج هو فن يعتمد على:',
        options: [
          { id: 'a', textAr: 'قطع فسيفساء ملوّنة', isCorrect: true, explanationAr: 'الزليج فسيفساء هندسية تراثية.' },
          { id: 'b', textAr: 'النحت على الخشب فقط', isCorrect: false, explanationAr: 'الزليج يخص البلاط والفسيفساء.' },
          { id: 'c', textAr: 'الرسم بالفحم', isCorrect: false, explanationAr: 'هذا أسلوب رسم مختلف عن الزليج.' },
        ],
      },
    ],
  },
];
