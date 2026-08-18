import { CourseLesson } from '../../../types';

/**
 * المنهاج الوزاري الجزائري لمادة الرياضيات - السنة الأولى ابتدائي (1AP)
 * مقسم بوضوح على الفصول الثلاثة (Trimestres 1, 2, 3) مع أهداف تعلمية، تفسيرات ميسرة للأطفال،
 * تمارين تدريجية، ألعاب تفاعلية، ومسابقات Quiz كاملة.
 */
const SOURCE_NOTE_1AP_MATH =
  'محتوى بيداغوجي أصلي ومطابق للمنهاج الرسمي لوزارة التربية الوطنية الجزائرية (1AP) أعدته منصة مَسِيد DZ.';

export const MATH_1AP: CourseLesson[] = [
  // =========================================================================
  // الفصل الأول (Trimestre 1): الفضاء، العلاقات المكانية، الأعداد من 0 إلى 5، والأشكال
  // =========================================================================
  {
    id: 'math-1ap-t1-spatial-relations',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الفضاء والهندسة',
    sequenceAr: 'المقطع 1: الفضاء والاتجاهات',
    categoryAr: 'الرياضيات - الفضاء',
    titleAr: 'الفَضَاءُ وَالعَلاَقَاتُ المَكَانِيَّة: فَوْقَ، تَحْتَ، أَمَامَ، وَرَاءَ 🐱⚽',
    summaryAr: 'تعلم تحديد مواضع الأشياء بدقة في المحيط باستعمال: فوق، تحت، أمام، ووراء.',
    objectiveAr: 'أن يتعرف الطفل على موقع الأشياء ويستعمل المفردات المكانية السليمة.',
    objectivesAr: [
      'أُمَيِّزُ بَيْنَ مَوْقِعَيْ "فَوْقَ" ☝️ وَ "تَحْتَ" 👇.',
      'أُمَيِّزُ بَيْنَ "أَمَامَ" 👀 وَ "وَرَاءَ" 🔙.',
      'أُحَدِّدُ مَوْقِعَ الأَشْيَاءِ بِالنِّسْبَةِ لِبَعْضِهَا بِدِقَّةٍ.',
    ],
    discoveryAr: 'انظر في غرفتك: أين يوجد المصباح 💡؟ وأين يوجد السجاد 🧶؟',
    rulesAr: [
      'فَوْقَ (Sur): الشيء الموجود في الأعلى (مثل: القطة فوق الطاولة).',
      'تَحْتَ (Sous): الشيء الموجود في الأسفل (مثل: الكرة تحت السرير).',
      'أَمَامَ (Devant): الشيء المقابل لوجهي.',
      'وَرَاءَ (Derrière): الشيء الموجود في ظهري.',
    ],
    examplesAr: [
      { problem: 'أين تجلس القطة؟ 🐱 (فوق الكرسي)', solution: 'القطة فوق الكرسي.' },
      { problem: 'أين توجد الكرة؟ ⚽ (تحت الطاولة)', solution: 'الكرة تحت الطاولة.' },
    ],
    detailedCourse: {
      introAr: 'في بيتنا ومدرستنا، لكل شيء مكان محدد! نتعلم اليوم الكلمات السحرية التي تدلنا على مكان كل شيء.',
      vocabulary: [
        { termAr: 'فَوْقَ ☝️', definitionAr: 'في الجهة العليا من الشيء.' },
        { termAr: 'تَحْتَ 👇', definitionAr: 'في الجهة السفلى تحت الشيء.' },
        { termAr: 'أَمَامَ 👀', definitionAr: 'في الواجهة التي نقابلها بعيوننا.' },
        { termAr: 'وَرَاءَ 🔙', definitionAr: 'في الخلف وراء ظهورنا.' },
      ],
      visualizationHintAr: 'ضع دباً صغيراً فوق الطاولة ثم تحته واطلب من الطفل نطق الموضع بصوت واضح ومرح.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين أمام ووراء.', correctionAr: 'وجّه نظر الطفل للأمام حيث يرى بعينيه، وللخلف حيث لا يرى.' },
      ],
      takeawayAr: 'فوق = للأعلى، تحت = للأسفل، أمام = في الوجه، وراء = في الظهر.',
    },
    interactiveTool: 'geometry_visualizer',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-spatial',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'أين يجلس العصفور؟ 🐦 (فوق الغصن أم تحته؟)',
        hintsAr: ['العصفور يغرد في الأعلى على الغصن.'],
        solutionAr: 'فَوْقَ الغُصْنِ',
        detailedCorrectionAr: 'أحسنت! العصفور يقف فَوْقَ الغصن.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-spatial',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'يقف المعلم ... التلاميذ ليشرح على السبورة.',
        hintsAr: ['التلاميذ ينظرون إليه مباشرة.'],
        solutionAr: 'أَمَامَ التَّلاَمِيذِ',
        detailedCorrectionAr: 'ممتاز! المعلم يقف أَمَامَ تلاميذه.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-spatial',
      type: 'association',
      titleAr: 'لعبة أين يختبئ الأرنب؟ 🐰',
      instructionsAr: 'اختر الموضع الصحيح لكل شيء بسرعة!',
      items: [
        { questionOrPromptAr: 'الحذاء 👟 بالنسبة للمكتب', correctAnswerAr: 'تَحْتَ المَكْتَبِ', optionsAr: ['تَحْتَ المَكْتَبِ', 'فَوْقَ السَّقْفِ'], explanationAr: 'الحذاء يوضع على الأرض تحت المكتب.' },
        { questionOrPromptAr: 'الكتاب 📚 بالنسبة للطاولة', correctAnswerAr: 'فَوْقَ الطَّاوِلَةِ', optionsAr: ['فَوْقَ الطَّاوِلَةِ', 'تَحْتَ الأَرْضِ'], explanationAr: 'الكتاب نضعه فوق الطاولة لنقرأه.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-spatial',
        questionAr: 'أين توجد الشمس في النهار؟ ☀️',
        options: [
          { id: 'a', textAr: 'فَوْقَ فِي السَّمَاءِ', isCorrect: true, explanationAr: 'صحيح! الشمس ساطعة فوق في السماء.' },
          { id: 'b', textAr: 'تَحْتَ فِي الأَرْضِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t1-right-left-inside-outside',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الفضاء والاتجاهات',
    sequenceAr: 'المقطع 2: الاتجاهات والمواضع',
    categoryAr: 'الرياضيات - الاتجاهات',
    titleAr: 'الاتِّجَاهَاتُ: يَمِينٌ، يَسَارٌ، دَاخِلٌ، خَارِجٌ ✋📦',
    summaryAr: 'تمييز اليد اليمنى واليسرى وتحديد الأشياء الموجودة في الداخل أو الخارج.',
    objectiveAr: 'أن يميز التلميذ بين جهة اليمين واليسار، ومفهومي داخل وخارج.',
    objectivesAr: [
      'أُمَيِّزُ يَدِي اليُمْنَى ✋ عَنْ يَدِي اليُسْرَى 🤚.',
      'أُحَدِّدُ مَا إِذَا كَانَ الشَّيْءُ دَاخِلَ الصُّنْدُوقِ أَوْ خَارِجَهُ.',
    ],
    discoveryAr: 'بأي يد تأكل وتسلم على زملائك؟ إنها يدك اليمنى الجميلة!',
    rulesAr: [
      'اليَدُ اليُمْنَى ✋: اليد التي نأكل بها ونكتب بها ونسلّم بها.',
      'اليَدُ اليُسْرَى 🤚: اليد المقابلة لجهة القلب.',
      'دَاخِلٌ 📦: الشيء المحاط والموجود في الداخل (مثل: الأقلام داخل المقلمة).',
      'خَارِجٌ 🚪: الشيء الموجود في الخارج.',
    ],
    examplesAr: [
      { problem: 'أين توجد الأقلام؟ 🖍️ (داخل المقلمة)', solution: 'داخل المقلمة.' },
    ],
    detailedCourse: {
      introAr: 'اليمين واليسار يرشداننا في كل خطوة! والداخل والخارج يساعداننا في ترتيب أدواتنا.',
      vocabulary: [
        { termAr: 'يَمِينٌ ✋', definitionAr: 'الجهة اليمنى المباركة.' },
        { termAr: 'يَسَارٌ 🤚', definitionAr: 'الجهة المقابلة لليمين.' },
        { termAr: 'دَاخِلٌ 📥', definitionAr: 'في جوف الشيء ومحاط به.' },
        { termAr: 'خَارِجٌ 📤', definitionAr: 'في الفضاء الخارجي طليقاً.' },
      ],
      visualizationHintAr: 'ارسم مع الطفل إطاراً واطلب منه وضع الألعاب داخله وخارجه.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين اليمين واليسار عند مواجهة شخص آخر.', correctionAr: 'تذكير الطفل بالنظر ليده اليمنى هو أولاً.' },
      ],
      takeawayAr: 'اليد اليمنى للأكل والمصافحة. داخل الصندوق عكس خارج الصندوق.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-rl',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'أين توجد التفاحات اللذيذة؟ 🍎 (داخل السلة أم خارجها؟)',
        hintsAr: ['السلة تجمع التفاحات وتحفظها.'],
        solutionAr: 'دَاخِلَ السَّلَّةِ',
        detailedCorrectionAr: 'أحسنت! التفاحات موضوعة دَاخِلَ السلة.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-rl',
      type: 'quiz_flash',
      titleAr: 'تحدي اليمين واليسار السريع ⚡',
      instructionsAr: 'اختر الإجابة الصحيحة بالسرعة القصوى!',
      items: [
        { questionOrPromptAr: 'الأقلام الملونة في المحفظة 🎒', correctAnswerAr: 'دَاخِلَ المِحْفَظَةِ', optionsAr: ['دَاخِلَ المِحْفَظَةِ', 'خَارِجَ المَدْرَسَةِ'], explanationAr: 'الأدوات تكون داخل المحفظة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-rl',
        questionAr: 'بأي يد نأكل الطعام باسم الله؟ 🥣',
        options: [
          { id: 'a', textAr: 'بِاليَدِ اليُمْنَى ✋', isCorrect: true, explanationAr: 'صحيح! الرسول ﷺ علمنا الأكل باليمين.' },
          { id: 'b', textAr: 'بِاليَدِ اليُسْرَى', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t1-numbers-0-5',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 3: الأعداد من 0 إلى 5',
    categoryAr: 'الرياضيات - الأعداد الأولى',
    titleAr: 'أَتَعَرَّفُ عَلَى الأَعْدَادِ: 0 - 1 - 2 - 3 - 4 - 5 🖐️',
    summaryAr: 'عدّ الأشياء من 0 إلى 5 بمساعدة الأصابع ورسم كل رقم بشكل بسيط ومرح.',
    objectiveAr: 'عدّ مجموعة من الأشياء (حتى 5) والربط بينها وبين الرقم المناسب.',
    objectivesAr: [
      'أَعُدُّ الأشياء من 0 إلى 5 بأصابعي.',
      'أَرْبِطُ بين مجموعة أشياء والرقم المناسب لها.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ رَقْمٍ.',
    ],
    discoveryAr: 'ارفع يدك 🖐️ وعُدَّ أصابعك واحداً واحداً: 1، 2، 3، 4، 5!',
    rulesAr: [
      'العَدَدُ 0 يعني: لا يوجد أي شيء، الصندوق فارغ تماماً 📭.',
      '1 ☝️ = شمس واحدة، أنف واحد.',
      '2 ✌️ = عينان، أذنان، يدان.',
      '3 🤟 = إشارات المرور الثلاث.',
      '4 🖐️ = عجلات السيارة الأربع.',
      '5 🖐️ = أصابع اليد الواحدة.',
    ],
    examplesAr: [
      { problem: 'كم عدد التفاحات؟ 🍎🍎🍎', solution: '3 تفاحات' },
    ],
    detailedCourse: {
      introAr: 'الأرقام هي أصدقاؤنا الأوفياء! نعدّ بها ألعابنا ونجومنا وكل ما نحبه.',
      vocabulary: [
        { termAr: 'العَدُّ 🔢', definitionAr: 'حساب كمية الأشياء واحداً تلو الآخر.' },
        { termAr: 'الصِّفْرُ 0', definitionAr: 'يعني لا شيء، صندوق فارغ.' },
      ],
      visualizationHintAr: 'استخدم أصابع يد الطفل واطلب منه تمثيل الأرقام من 1 إلى 5.',
      commonMistakes: [
        { mistakeAr: 'نسيان الصفر (0).', correctionAr: 'أظهر للطفل يداً مغلقة تماماً كدلالة على الصفر.' },
      ],
      takeawayAr: 'أصابع اليد الواحدة 5. والصفر يعني لا يوجد شيء.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num5',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'كم قطة في هذه المجموعة؟ 🐱🐱🐱',
        hintsAr: ['عُدّها: 1، 2، 3!'],
        solutionAr: '3',
        detailedCorrectionAr: 'أحسنت! هناك 3 قطط.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-num5',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'كم أذناً للأرنب الجميل؟ 🐰',
        hintsAr: ['أذن يمنى وأذن يسرى.'],
        solutionAr: '2',
        detailedCorrectionAr: 'ممتاز! للأرنب أذنان اثنتان (2).',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num5',
      type: 'quiz_flash',
      titleAr: 'لعبة أصابع اليد السحرية ✨',
      instructionsAr: 'عُدّ الأصابع واختر الرقم بسرعة!',
      items: [
        { questionOrPromptAr: '✋ (كل أصابع يد واحدة)', correctAnswerAr: '5', optionsAr: ['5', '3', '4'], explanationAr: 'اليد الواحدة فيها 5 أصابع.' },
        { questionOrPromptAr: '✌️ (إصبعان مرفوعان)', correctAnswerAr: '2', optionsAr: ['2', '1', '5'], explanationAr: 'إصبعان يعني العدد 2.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-num5',
        questionAr: 'صندوق ليس فيه أي كرة، كم كرة فيه؟ 📭',
        options: [
          { id: 'a', textAr: '0 (صِفْر)', isCorrect: true, explanationAr: 'صحيح! الصفر يدل على الفراغ.' },
          { id: 'b', textAr: '5', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t1-shapes-colors',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الهندسة والتصنيف',
    sequenceAr: 'المقطع 4: الأشكال والألوان',
    categoryAr: 'الرياضيات - الأشكال والألوان',
    titleAr: 'الأَشْكَالُ الهَنْدَسِيَّةُ وَالأَلْوَانُ 🔴🟦🔺',
    summaryAr: 'التعرف على الأشكال البسيطة (الدائرة، المربع، المثلث، المستطيل) واستقامية الأشياء بالمسطرة.',
    objectiveAr: 'التعرف على الأشكال الأساسية ورسم خطوط مستقيمة بالمسطرة.',
    objectivesAr: [
      'أُمَيِّزُ الدَّائِرَةَ 🟡 وَالمُرَبَّعَ 🟦 وَالمُثَلَّثَ 🔺 وَالمُسْتَطِيلَ 🚪.',
      'أَسْتَعْمِلُ المِسْطَرَةَ لِرَسْمِ خَطٍّ مُسْتَقِيمٍ.',
    ],
    discoveryAr: 'ما شكل عجلة الدراجة؟ وما شكل قطعة البيتزا؟',
    rulesAr: [
      'الدَّائِرَةُ 🟡: شكل مستدير كالشمس أو العجلة.',
      'المُرَبَّعُ 🟦: له 4 أضلاع متساوية مثل النافذة.',
      'المُثَلَّثُ 🔺: له 3 أضلاع مثل قطعة الجبن أو الخيمة.',
      'المُسْتَطِيلُ 🚪: يشبه الباب أو شاشة الهاتف.',
    ],
    examplesAr: [
      { problem: 'ما شكل هذه الكرة؟ 🔴', solution: 'دَائِرَةٌ.' },
    ],
    detailedCourse: {
      introAr: 'العالم من حولنا مليء بالأشكال الهندسية الممتعة! في كل مكان نجد دوائر ومربعات ومثلثات.',
      vocabulary: [
        { termAr: 'الدَّائِرَةُ 🟡', definitionAr: 'خط منحنٍ مغلق ومستدير.' },
        { termAr: 'المُرَبَّعُ 🟦', definitionAr: 'شكل له 4 أضلاع متساوية.' },
        { termAr: 'المُثَلَّثُ 🔺', definitionAr: 'شكل هندسي له 3 أضلاع.' },
      ],
      visualizationHintAr: 'اطلب من الطفل رسم دائرة في الهواء بسبابته.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين المربع والمثلث.', correctionAr: 'عُدَّ أضلاع كل شكل: 4 للمربع و 3 للمثلث.' },
      ],
      takeawayAr: 'دائرة مستديرة، مربع بـ 4 أضلاع، ومثلث بـ 3 أضلاع.',
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
        detailedCorrectionAr: 'أحسنت! هذا مثلث.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-shapes',
      type: 'association',
      titleAr: 'صندوق الأشكال الهندسية',
      instructionsAr: 'اربط كل شيء بشكله المناسب!',
      items: [
        { questionOrPromptAr: 'عجلة السيارة 🚗', correctAnswerAr: 'دَائِرَةٌ', optionsAr: ['دَائِرَةٌ', 'مُرَبَّعٌ'], explanationAr: 'العجلة مستديرة لتدور بسلاسة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-shapes',
        questionAr: 'كم ضلعاً للمثلث؟ 🔺',
        options: [
          { id: 'a', textAr: '3 أَضْلاَع', isCorrect: true, explanationAr: 'صحيح! المثلث له 3 أضلاع.' },
          { id: 'b', textAr: '4 أَضْلاَع', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // =========================================================================
  // الفصل الثاني (Trimestre 2): الأعداد حتى 20، الجمع والطرح، ومقارنة الأطوال
  // =========================================================================
  {
    id: 'math-1ap-t2-numbers-6-10',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 5: الأعداد من 6 إلى 10',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'الأَعْدَادُ مِنْ 6 إِلَى 10 وَتَشْكِيلُ العَشَرَة 🖐️🖐️',
    summaryAr: 'قراءة وكتابة الأعداد (6، 7، 8، 9، 10) وتشكيل حزمة العشرة الأولى باليدين.',
    objectiveAr: 'أن يعد الطفل ويكتب الأعداد حتى 10 ويفهم تشكيل العشرة الأولى.',
    objectivesAr: [
      'أَعُدُّ الأعداد من 6 إلى 10 باستعمال اليدين معاً.',
      'أَفْهَمُ أَنَّ العَدَدَ 10 هُوَ عَشَرَةٌ كَامِلَةٌ (Dizaine).',
      'أَكْتُبُ الأرقام 6، 7، 8، 9، 10 بشكل سليم.',
    ],
    discoveryAr: 'افتح يديك الاثنتين معاً 🖐️🖐️ وعُدَّ أصابعك: 1، 2... حتى تصل إلى 10!',
    rulesAr: [
      '6 = يد كاملة (5) + 1 إصبع.',
      '7 = يد كاملة (5) + 2 أصابع.',
      '8 = يد كاملة (5) + 3 أصابع.',
      '9 = يد كاملة (5) + 4 أصابع.',
      '10 = اليدان كاملتان مفتوحتان (عشرة كاملة!).',
    ],
    examplesAr: [
      { problem: '5 أصابع + 3 أصابع = ؟', solution: '8 أصابع' },
    ],
    detailedCourse: {
      introAr: 'بعد أن تجاوزنا الرقم 5، نحتاج إلى يدنا الثانية لنعد حتى 10 أبطال!',
      vocabulary: [
        { termAr: 'العَشَرَةُ 🔟', definitionAr: 'حزمة من 10 وحدات كاملة.' },
      ],
      visualizationHintAr: 'اطلب من الطفل فتح يد واحدة ثم إضافة أصابع اليد الثانية واحداً فواحداً.',
      commonMistakes: [
        { mistakeAr: 'كتابة الرقم 6 بشكل مقلوب يشبه 2.', correctionAr: 'تذكير الطفل بأن 6 ينظر لليسار و 2 ينظر لليمين.' },
      ],
      takeawayAr: '5 + 5 = 10 (اليدان الاثنتان معاً).',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num10',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما هو العدد الذي يلي 9 مباشرة؟',
        hintsAr: ['هو عدد أصابع يديك الاثنتين.'],
        solutionAr: '10',
        detailedCorrectionAr: 'ممتاز! بعد 9 يأتي 10.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num10',
      type: 'quiz_flash',
      titleAr: 'سباق العدّ للعشرة 🏃',
      instructionsAr: 'اختر العدد الصحيح لإكمال المجموعة!',
      items: [
        { questionOrPromptAr: '8 + ؟ = 10', correctAnswerAr: '2', optionsAr: ['2', '3', '1'], explanationAr: '8 نزيد لها 2 تصبح 10.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-num10',
        questionAr: 'كم إجمالي أصابع يديك الاثنتين؟ 🖐️🖐️',
        options: [
          { id: 'a', textAr: '10 أَصَابِعَ', isCorrect: true, explanationAr: 'صحيح! 5 + 5 = 10.' },
          { id: 'b', textAr: '5 فقط', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-addition-concept',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الحساب والعمليات',
    sequenceAr: 'المقطع 6: مفهوم الجمع والرمز (+)',
    categoryAr: 'الرياضيات - الجمع',
    titleAr: 'مَفْهُومُ الجَمْعِ وَالرَّمْزُ (+) ➕🎈',
    summaryAr: 'استيعاب معنى الإضافة والضم والتعبير عنها بكتابة معادلة الجمع والرمز (+).',
    objectiveAr: 'أن يعبر التلميذ عن ضم مجموعتين بكتابة مساواة جمع بسيطة مثل 3 + 2 = 5.',
    objectivesAr: [
      'أَفْهَمُ أَنَّ الجَمْعَ يَعْنِي إِضَافَةَ وَضَمَّ أَشْيَاءَ مَعًا.',
      'أَسْتَعْمِلُ رَمْزَ الزَّائِد (+) وَرَمْزَ يُسَاوِي (=).',
    ],
    discoveryAr: 'معك 3 بالونات 🎈🎈🎈 وأعطتك أمك بالونين 🎈🎈. كم صار المجموع الكلي؟',
    rulesAr: [
      '➕ عَلاَمَةُ الزَّائِد (+): تدل على الزيادة والضم.',
      '🟰 عَلاَمَةُ يُسَاوِي (=): تدل على النتيجة النهائية.',
      '3 + 2 = 5 (تقرأ: ثلاثة زائد اثنان يساوي خمسة).',
    ],
    examplesAr: [
      { problem: '4 + 1 = ؟', solution: '5' },
    ],
    detailedCourse: {
      introAr: 'الجمع مثل وضع كل الألعاب في صندوق واحد لنعرف كم أصبح عندنا في المجموع!',
      vocabulary: [
        { termAr: 'الجَمْعُ (+)', definitionAr: 'ضم مجموعتين لحساب الكل.' },
      ],
      visualizationHintAr: 'استعمل حبات حلوى ملونة واجمع مجموعتين أمام الطفل.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين رمز الجمع (+) والطرح (-).', correctionAr: 'الزائد (+) يشبه الصليب ويجمع الأشياء ويزيدها.' },
      ],
      takeawayAr: 'الجمع (+) يكبر العدد ويزيده.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-add',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'احسب المجموع: 4 + 3 = ؟',
        hintsAr: ['4 في رأسك وزد 3 بأصابعك: 5، 6، 7.'],
        solutionAr: '7',
        detailedCorrectionAr: 'أحسنت! 4 + 3 = 7.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-add',
      type: 'quiz_flash',
      titleAr: 'سلة التفاح المجموع 🧺',
      instructionsAr: 'احسب المجموع وضع النتيجة في السلة!',
      items: [
        { questionOrPromptAr: '5 + 2 = ؟', correctAnswerAr: '7', optionsAr: ['7', '6', '8'], explanationAr: '5 + 2 = 7.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-add',
        questionAr: 'مع ليلى 3 أقلام واشترت 3 أقلام أخرى. كم قلماً صار معها؟ ✏️',
        options: [
          { id: 'a', textAr: '6 أَقْلاَم (3 + 3 = 6)', isCorrect: true, explanationAr: 'صحيح! 3 + 3 = 6.' },
          { id: 'b', textAr: '3 أقلام', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-numbers-11-20',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 7: الأعداد من 11 إلى 20',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'الأَعْدَادُ مِنْ 11 إِلَى 20: عَشَرَةٌ وَوَحَدَات 🧩',
    summaryAr: 'تسمية وكتابة الأعداد حتى 20 وتفكيكها إلى (10 + وحدات) مثل 14 = 10 + 4.',
    objectiveAr: 'أن يدرك الطفل أن الأعداد من 11 إلى 19 هي عشرة كاملة مضافاً إليها وحدات.',
    objectivesAr: [
      'أَعُدُّ من 11 إلى 20 بسلاسة.',
      'أُفَكِّكُ العدد: 15 = 10 + 5.',
      'أَتَعَرَّفُ عَلَى العَدَدِ 20 (عشرتان كاملتان).',
    ],
    discoveryAr: 'ارفع يديك الاثنتين (10) ثم أضف إصبعاً من صديقك. كم أصبح المجموع؟ (11)!',
    rulesAr: [
      '11 = 10 + 1 (أحد عشر).',
      '12 = 10 + 2 (اثنا عشر).',
      '15 = 10 + 5 (خمسة عشر).',
      '20 = 10 + 10 (عشرون: عشرتان كاملتان).',
    ],
    examplesAr: [
      { problem: '10 + 4 = ؟', solution: '14' },
    ],
    detailedCourse: {
      introAr: 'بعد العشرة الأولى، تبدأ أعداد تتكون من رقمين: 1 في العشرات ورقم الوحدات على اليمين.',
      vocabulary: [
        { termAr: 'تَفْكِيكُ العَدَدِ 🧩', definitionAr: 'كتابة العدد كعشرة كاملة + وحدات.' },
      ],
      visualizationHintAr: 'استعمل حزمة 10 عيدان مربوطة واضف إليها عيداناً مفردة.',
      commonMistakes: [
        { mistakeAr: 'كتابة 13 كـ 31.', correctionAr: 'العشرات (1) تُكتب في اليسار دائماً في هذه المرحلة.' },
      ],
      takeawayAr: 'الأعداد من 11 إلى 19 هي: 10 + أصابع إضافية.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num20',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما هو تفكيك العدد 16؟',
        hintsAr: ['عشرة كاملة + 6.'],
        solutionAr: '10 + 6',
        detailedCorrectionAr: 'أحسنت! 16 = 10 + 6.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num20',
      type: 'quiz_flash',
      titleAr: 'تحدي قطار الأعداد حتى 20 🚂',
      instructionsAr: 'اختر عربة القطار الصحيحة!',
      items: [
        { questionOrPromptAr: 'ما العدد الذي يلي 19؟', correctAnswerAr: '20', optionsAr: ['20', '18', '11'], explanationAr: 'بعد 19 يأتي العدد 20.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-num20',
        questionAr: 'العدد 20 يساوي:',
        options: [
          { id: 'a', textAr: '10 + 10', isCorrect: true, explanationAr: 'صحيح! عشرتان كاملتان = 20.' },
          { id: 'b', textAr: '10 + 2', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-subtraction-and-lengths',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الحساب والقياس',
    sequenceAr: 'المقطع 8: الطرح ومقارنة الأطوال',
    categoryAr: 'الرياضيات - الطرح والأطوال',
    titleAr: 'مَفْهُومُ الطَّرْحِ (-) وَمُقَارَنَةُ الأَطْوَالِ 📏➖',
    summaryAr: 'فهم عملية الإنقاص وحساب الباقي بالرمز (-)، ومقارنة أطوال الأشياء (أطول، أقصر).',
    objectiveAr: 'أن يحسب التلميذ الباقي في عمليات طرح بسيطة ويميز الأطول والأقصر.',
    objectivesAr: [
      'أَفْهَمُ مَعْنَى الإِنْقَاصِ وَالرَّمْزِ (-).',
      'أُقَارِنُ بَيْنَ شَيْئَيْنِ: أَطْوَلُ مِنْ، أَقْصَرُ مِنْ، لَهُمَا نَفْسُ الطُّولِ.',
    ],
    discoveryAr: 'كان في الصحن 5 تفاحات 🍎🍎🍎🍎🍎 أكلت منها اثنتين 😋. كم بقي في الصحن؟',
    rulesAr: [
      '➖ عَلاَمَةُ النَّاقِص (-): تدل على الأخذ والإنقاص والباقي.',
      '5 - 2 = 3 (خمسة ناقص اثنان يساوي ثلاثة).',
      'الزرافة 🦒 أَطْوَلُ مِنْ الكلب 🐕.',
      'الممحاة 🧼 أَقْصَرُ مِنْ المسطرة 📏.',
    ],
    examplesAr: [
      { problem: '6 - 2 = ؟', solution: '4' },
    ],
    detailedCourse: {
      introAr: 'الطرح يساعدنا في معرفة ما تبقى لدينا! ومقارنة الأطوال تدلنا على الأطول والأقصر.',
      vocabulary: [
        { termAr: 'الطَّرْحُ (-)', definitionAr: 'أخذ أو إنقاص عناصر من مجموعة.' },
        { termAr: 'أَطْوَلُ مِنْ 🦒', definitionAr: 'يمتد لمسافة أطول.' },
      ],
      visualizationHintAr: 'ضع مسطرة وقلم تلوين بجانب بعضهما لمقارنة الطول مباشرة.',
      commonMistakes: [
        { mistakeAr: 'مقارنة الأشياء دون وضعها على نفس خط البداية.', correctionAr: 'يجب محاذاة طرفي الشيئين أولاً للحكم الصحيح على الطول.' },
      ],
      takeawayAr: 'الطرح (-) يُنقص العدد. الأطول يمتد لأكثر من الأقصر.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-sub',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'احسب الباقي: 7 - 3 = ؟',
        hintsAr: ['ارفع 7 أصابع واخفض منها 3.'],
        solutionAr: '4',
        detailedCorrectionAr: 'أحسنت! 7 - 3 = 4.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-sub',
      type: 'quiz_flash',
      titleAr: 'لعبة البالونات المنفجرة 🎈',
      instructionsAr: 'احسب الباقي بسرعة!',
      items: [
        { questionOrPromptAr: 'كانت 6 بالونات، فرقعت منها 2 💥. كم بقي؟', correctAnswerAr: '4', optionsAr: ['4', '5', '3'], explanationAr: '6 - 2 = 4.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-sub',
        questionAr: 'المسطرة (30 سم) بالنسبة للممحاة الصغيرة:',
        options: [
          { id: 'a', textAr: 'أَطْوَلُ مِنَ المِمْحَاةِ 📏', isCorrect: true, explanationAr: 'صحيح! المسطرة أطول من الممحاة.' },
          { id: 'b', textAr: 'أقصر من الممحاة', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // =========================================================================
  // الفصل الثالث (Trimestre 3): الأعداد حتى 99، جدول المراتب، الوقت والنقود
  // =========================================================================
  {
    id: 'math-1ap-t3-complete-tens-up-to-90',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الأعداد والحساب',
    sequenceAr: 'المقطع 9: العشرات الكاملة حتى 90',
    categoryAr: 'الرياضيات - العشرات',
    titleAr: 'العَشَرَاتُ الكَامِلَةُ حَتَّى 90 🔟🔢',
    summaryAr: 'القفز بالعشرات وقراءة وكتابة: 10، 20، 30، 40، 50، 60، 70، 80، 90.',
    objectiveAr: 'أن يعد التلميذ بالعشرات التامة ويمثلها بقضبان العشرات.',
    objectivesAr: [
      'أَعُدُّ قَفْزًا بِالعَشَرَاتِ: 10، 20، 30... 90.',
      'أَرْبِطُ كُلَّ عَشَرَةٍ كَامِلَةٍ بِعَدَدِ القُضْبَانِ المُنَاسِبِ.',
    ],
    discoveryAr: 'كل قضيب فيه 10 مربعات! إذا وضعنا 3 قضبان، كم يصبح عندنا؟ (30)!',
    rulesAr: [
      '10 = عشرة واحدة.',
      '20 = عشرتان.',
      '30 = 3 عشرات.',
      '40 = 4 عشرات | 50 = 5 عشرات | 60 = 6 عشرات.',
      '70 = 7 عشرات | 80 = 8 عشرات | 90 = 9 عشرات.',
    ],
    examplesAr: [
      { problem: '4 قضبان عشرات = ؟', solution: '40' },
    ],
    detailedCourse: {
      introAr: 'العد بالعشرات يجعلنا نصل إلى أعداد كبيرة بسرعة وسهولة مذهلة!',
      vocabulary: [
        { termAr: 'عَشَرَاتٌ كَامِلَةٌ 🔟', definitionAr: 'أعداد تنتهي بصفر في خانة الوحدات: 10، 20، 30...' },
      ],
      visualizationHintAr: 'استعمل تطبيق المختبر الرياضي لرؤية قضبان العشرات العشرية.',
      commonMistakes: [
        { mistakeAr: 'نسيان الصفر على اليمين وكتابة 4 بدلاً من 40.', correctionAr: 'أربع عشرات تساوي 40 وليس 4 وحدات.' },
      ],
      takeawayAr: '10، 20، 30، 40، 50، 60، 70، 80، 90 كلها عشرات تامة.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-t90',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: '3 قضبان عشرات كم تساوي من وحدة؟',
        hintsAr: ['10 + 10 + 10 = ؟'],
        solutionAr: '30',
        detailedCorrectionAr: 'أحسنت! 3 عشرات = 30.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-t90',
      type: 'quiz_flash',
      titleAr: 'سلم العشرات الصاعد 🚀',
      instructionsAr: 'اختر العشرات الصحيحة لتصعد للأعلى!',
      items: [
        { questionOrPromptAr: 'ما العشرات التي تأتي بعد 40؟', correctAnswerAr: '50', optionsAr: ['50', '30', '60'], explanationAr: 'بعد 40 تأتي 50 مباشرة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-t90',
        questionAr: '5 عشرات كاملة كم تساوي؟ 🟦🟦🟦🟦🟦',
        options: [
          { id: 'a', textAr: '50 (خَمْسُونَ)', isCorrect: true, explanationAr: 'صحيح! 5 عشرات = 50.' },
          { id: 'b', textAr: '5', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t3-place-value-and-n99',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الأعداد والحساب',
    sequenceAr: 'المقطع 10: الوحدات والعشرات وجدول المراتب حتى 99',
    categoryAr: 'الرياضيات - المراتب والأعداد',
    titleAr: 'الوحدَاتُ وَالعَشَرَاتُ وَالأَعْدَادُ حَتَّى 99 📊',
    summaryAr: 'تفكيك أي عدد ذي رقمين إلى وحدات وعشرات وقراءته ومقارنته حتى 99.',
    objectiveAr: 'أن يميز الطفل بين منزلة الوحدات ومنزلة العشرات في الأعداد حتى 99.',
    objectivesAr: [
      'أُمَيِّزُ رَقْمَ الوَحَدَاتِ (على اليمين) وَرَقْمَ العَشَرَاتِ (على اليسار).',
      'أَقْرَأُ وَأَكْتُبُ الأَعْدَادَ حَتَّى 99.',
      'أُقَارِنُ بَيْنَ عَدَدَيْنِ بِاسْتِعْمَالِ الرموز (> ، <).',
    ],
    discoveryAr: 'العدد 34 فيه 4 مربعات صغيرة و 3 قضبان عشرات. يكتب 34 ويقرأ: أربعة وثلاثون!',
    rulesAr: [
      'الرقم على اليمين = الوَحَدَات (Unités).',
      'الرقم على اليسار = العَشَرَات (Dizaines).',
      '34 = 4 وحدات + 3 عشرات = 4 + 30.',
      'عند المقارنة ننظر أولاً لرقم العشرات: 65 > 42 لأن 6 > 4.',
    ],
    examplesAr: [
      { problem: 'في العدد 52: ما هو رقم الوحدات؟', solution: '2' },
    ],
    detailedCourse: {
      introAr: 'جدول المراتب هو بيت الأعداد المنظم! فيه غرفة للوحدات وغرفة للعشرات.',
      vocabulary: [
        { termAr: 'جَدْوَلُ المَرَاتِبِ 📊', definitionAr: 'جدول ينظم الوحدات على اليمين والعشرات على اليسار.' },
      ],
      visualizationHintAr: 'استخدم مختبر الرياضيات التفاعلي في التطبيق لتفكيك الأعداد حتى 99.',
      commonMistakes: [
        { mistakeAr: 'قراءة العشرات قبل الوحدات بالمقلوب.', correctionAr: 'بالعربية نقرأ الوحدات أولاً ثم العشرات: أربعة وثلاثون (34).' },
      ],
      takeawayAr: 'الوحدات يميناً والعشرات يساراً. 47 = 7 وحدات + 4 عشرات.',
    },
    interactiveTool: 'soroban',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-pl',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'عدد فيه 7 وحدات و 4 عشرات. ما هو؟',
        hintsAr: ['الوحدات على اليمين والعشرات على اليسار.'],
        solutionAr: '47',
        detailedCorrectionAr: 'أحسنت! 7 وحدات و 4 عشرات = 47.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-pl',
      type: 'quiz_flash',
      titleAr: 'تحدي مقارنة الأرقام 🐊',
      instructionsAr: 'اختر العدد الأكبر ليفوز التمساح!',
      items: [
        { questionOrPromptAr: 'أيهما أكبر: 84 أم 69؟', correctAnswerAr: '84', optionsAr: ['84', '69'], explanationAr: '8 عشرات أكبر من 6 عشرات.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-pl',
        questionAr: 'في العدد 73، كم عدد العشرات؟',
        options: [
          { id: 'a', textAr: '7 عَشَرَات (70)', isCorrect: true, explanationAr: 'صحيح! الرقم 7 في خانة العشرات.' },
          { id: 'b', textAr: '3 فقط', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t3-addition-and-time-money',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الحساب والقياس في الحياة',
    sequenceAr: 'المقطع 11: الجمع العمودي، الساعة والنقود',
    categoryAr: 'الرياضيات - تطبيقات الحياة',
    titleAr: 'الجَمْعُ العَمُودِيُّ، السَّاعَةُ التَّامَّةُ وَالنُّقُودُ ⏰🪙➕',
    summaryAr: 'وضع عملية الجمع عمودياً دون احتفاظ، قراءة الساعة التامة، واستعمال النقود الجزائرية (دج).',
    objectiveAr: 'أن يحسب الطفل مجموعاً عمودياً، يقرأ الساعة التامة، ويحسب مشتريات بسيطة بالدينار.',
    objectivesAr: [
      'أَضَعُ عَمَلِيَّةَ الجَمْعِ عَمُودِيًّا: الوحدات تحت الوحدات والعشرات تحت العشرات.',
      'أَقْرَأُ السَّاعَةَ عِنْدَمَا يَكُونُ العَقْرَبُ الكَبِيرُ عِنْدَ 12 (السَّاعَةُ تَمَامًا).',
      'أَتَعَرَّفُ عَلَى القِطَعِ النَّقْدِيَّةِ الجَزَائِرِيَّةِ (5 دج، 10 دج، 20 دج، 50 دج).',
    ],
    discoveryAr: 'العقرب الصغير عند 8 والكبير عند 12 ⬅️ الساعة الثامنة تماماً (08:00) وقت دخول المدرسة 🔔!',
    rulesAr: [
      'في الجمع العمودي: نجمع الوحدات مع الوحدات أولاً، ثم العشرات مع العشرات.',
      'الساعة التامة: العقرب الكبير دائماً عند 12 والصغير يحدد الساعة.',
      'النقود: نجمع ثمن المشتريات بالدينار الجزائري (10 دج + 10 دج = 20 دج).',
    ],
    examplesAr: [
      { problem: '23 + 14 = ؟', solution: '37 (الوحدات: 3+4=7، العشرات: 2+1=3)' },
    ],
    detailedCourse: {
      introAr: 'الرياضيات ترافقنا في كل لحظة: عند معرفة الوقت وعند الشراء من الدكان وعند الحساب!',
      vocabulary: [
        { termAr: 'السَّاعَةُ التَّامَّةُ ⏰', definitionAr: 'عندما يكون العقرب الكبير عند الرقم 12.' },
        { termAr: 'الدِّينَارُ الجَزَائِرِيُّ (دج) 🪙', definitionAr: 'العملة الوطنية التي نشتري بها حاجاتنا.' },
      ],
      visualizationHintAr: 'استعمل ساعة حائط ذات عقارب واطلب من الطفل تحريكها لتشير إلى 9:00.',
      commonMistakes: [
        { mistakeAr: 'جمع الوحدات مع العشرات في الجمع العمودي.', correctionAr: 'التأكيد على وضع الوحدات تحت الوحدات والعشرات تحت العشرات.' },
      ],
      takeawayAr: 'نجمع عمودياً وحدات + وحدات وعشرات + عشرات. والكبير عند 12 يعني الساعة تماماً.',
    },
    interactiveTool: 'unit_converter',
    progressiveExercises: [
      {
        id: 'ex1-math1ap-tm',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'احسب عمودياً: 32 + 24 = ؟',
        hintsAr: ['الوحدات: 2+4=6، العشرات: 3+2=5.'],
        solutionAr: '56',
        detailedCorrectionAr: 'أحسنت! النتيجة هي 56.',
        xpReward: 10,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-tm',
      type: 'quiz_flash',
      titleAr: 'متجر الدكان الصغير 🏪',
      instructionsAr: 'احسب ثمن المشتريات بالدينار!',
      items: [
        { questionOrPromptAr: 'قلم بـ 10 دج وممحاة بـ 10 دج 🪙🪙', correctAnswerAr: '20 دج', optionsAr: ['20 دج', '15 دج', '30 دج'], explanationAr: '10 دج + 10 دج = 20 دج.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-tm',
        questionAr: 'العقرب الصغير عند 4 والكبير عند 12. كم الساعة الآن؟ ⏰',
        options: [
          { id: 'a', textAr: 'السَّاعَةُ الرَّابِعَةُ تَمَامًا (4:00)', isCorrect: true, explanationAr: 'صحيح! العقرب الصغير يشير إلى 4 والكبير عند 12.' },
          { id: 'b', textAr: 'الساعة الثانية عشرة', isCorrect: false },
        ],
      },
    ],
    contentSource: 'official_verified',
    sourceType: 'ministry_official',
    confidenceLevel: 'high',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },
];
