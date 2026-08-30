import { CourseLesson } from '../../../types';

/**
 * المنهاج الوزاري الجزائري لمادة الرياضيات - السنة الأولى ابتدائي (1AP)
 * T1 : فضاء + قدرات + أعداد 0–9 + أشكال.
 * T2 : 10–20 (عشرات/وحدات) + جمع/طرح بسيط + مقارنة كميات.
 * T3 : الأعداد من 21 إلى 99 (عشرات ووحدات) + رموز < > (حتى 99) + مسائل ذهنية حتى 20.
 * ملاحظة: الكفاءة الشاملة الرسمية (الوثيقة المرافقة) تستهدف الأعداد الطبيعية الأصغر من 100.
 */
const SOURCE_NOTE_1AP_MATH =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ وفق المنهاج الرسمي 1AP: فضاء وقدرات، أعداد 0–99، جمع وطرح بسيط، مقارنة < >، هندسة.';

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
    titleAr: 'الفَضَاءُ: فَوْقَ، تَحْتَ، أَمَامَ، وَرَاءَ، بَيْنَ 🐱⚽',
    summaryAr: 'تحديد موضع الأشياء: فوق/تحت، أمام/وراء، وبين شيئين.',
    objectiveAr: 'أن يستعمل الطفل المفردات المكانية بما فيها «بين».',
    objectivesAr: [
      'أُمَيِّزُ بَيْنَ مَوْقِعَيْ "فَوْقَ" ☝️ وَ "تَحْتَ" 👇.',
      'أُمَيِّزُ بَيْنَ "أَمَامَ" 👀 وَ "وَرَاءَ" 🔙.',
      'أَقُولُ «بَيْنَ» عِنْدَمَا يَكُونُ الشَّيْءُ فِي الوَسَطِ.',
      'أُمَيِّزُ الأَعْلَى (Haut) مِنَ الأَسْفَلِ (Bas).',
    ],
    discoveryAr: 'انظر في غرفتك: أين يوجد المصباح 💡؟ وأين يوجد السجاد 🧶؟',
    rulesAr: [
      'فَوْقَ (Sur): الشيء الموجود في الأعلى (مثل: القطة فوق الطاولة).',
      'تَحْتَ (Sous): الشيء الموجود في الأسفل (مثل: الكرة تحت السرير).',
      'أَمَامَ (Devant): الشيء المقابل لوجهي.',
      'وَرَاءَ (Derrière): الشيء الموجود في ظهري.',
      'بَيْنَ (Entre): الشيء في الوسط، مثل الكرة بين الكرسي والطاولة.',
      'أَعْلَى / أَسْفَل (Haut / Bas): السقف في الأعلى، والأرض في الأسفل.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'shape_explorer',
      titleAr: 'أين يوجد الشيء؟',
      introAr: 'اضغط على كل موضع: فوق، تحت، أمام، وراء، بين.',
      shapes: [
        { id: 'above', nameAr: 'فَوْقَ', visualHint: '☝️', propertiesAr: ['الشيء في الأعلى.', 'مثال: القطة فوق الكرسي.'] },
        { id: 'below', nameAr: 'تَحْتَ', visualHint: '👇', propertiesAr: ['الشيء في الأسفل.', 'مثال: الكرة تحت الطاولة.'] },
        { id: 'front', nameAr: 'أَمَامَ', visualHint: '👀', propertiesAr: ['الشيء مقابل وجهي.', 'مثال: الحقيبة أمام الباب.'] },
        { id: 'back', nameAr: 'وَرَاءَ', visualHint: '🔙', propertiesAr: ['الشيء في ظهري.', 'مثال: الحديقة وراء المدرسة.'] },
        { id: 'between', nameAr: 'بَيْنَ', visualHint: '↔️', propertiesAr: ['الشيء في الوسط.', 'مثال: الكرة بين الكرسي والطاولة.'] },
      ],
    },
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
        { termAr: 'بَيْنَ ↔️', definitionAr: 'في الوسط بين شيئين.' },
        { termAr: 'أَعْلَى / أَسْفَل ⬆️⬇️', definitionAr: 'الأعلى نحو السقف، الأسفل نحو الأرض.' },
      ],
      visualizationHintAr: 'ضع دباً صغيراً فوق الطاولة ثم تحته واطلب من الطفل نطق الموضع بصوت واضح ومرح.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين أمام ووراء.', correctionAr: 'وجّه نظر الطفل للأمام حيث يرى بعينيه، وللخلف حيث لا يرى.' },
      ],
      takeawayAr: 'فوق / تحت، أمام / وراء، وبين = في الوسط.',
    },
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
        problemAr: 'الكرة ⚽ بين الكرسي والطاولة. أين هي؟',
        hintsAr: ['ليست فوق ولا تحت: هي في الوسط.'],
        solutionAr: 'بَيْنَ الكُرْسِيِّ وَالطَّاوِلَةِ',
        detailedCorrectionAr: 'نعم، الكرة بَيْنَ الاثنين.',
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
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
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
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'shape_explorer',
      titleAr: 'يمين، يسار، داخل، خارج',
      introAr: 'اضغط على كل كلمة مكانية.',
      shapes: [
        { id: 'right', nameAr: 'يَمِينٌ', visualHint: '✋', propertiesAr: ['اليد اليمنى: نأكل ونكتب ونسلّم بها.'] },
        { id: 'left', nameAr: 'يَسَارٌ', visualHint: '🤚', propertiesAr: ['اليد اليسرى: المقابلة لجهة القلب.'] },
        { id: 'in', nameAr: 'دَاخِلٌ', visualHint: '📦', propertiesAr: ['الشيء محاط من كل الجهات.', 'مثال: الأقلام داخل المقلمة.'] },
        { id: 'out', nameAr: 'خَارِجٌ', visualHint: '🚪', propertiesAr: ['الشيء في الفضاء الخارجي.', 'مثال: الكرة خارج الصندوق.'] },
      ],
    },
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
      {
        id: 'ex2-math1ap-rl',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'بِأَيِّ يَدٍ تُسَلِّمُ عَلَى صَدِيقِكَ عِنْدَ اللِّقَاءِ؟ 🤝',
        hintsAr: ['هِيَ نَفْسُ اليَدِ الَّتِي تَأْكُلُ بِهَا.'],
        solutionAr: 'بِاليَدِ اليُمْنَى',
        detailedCorrectionAr: 'ممتاز! نُسَلِّمُ دَائِمًا بِاليَدِ اليُمْنَى.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-rl',
      type: 'quiz_flash',
      titleAr: 'تحدي اليمين واليسار السريع ⚡',
      instructionsAr: 'اختر الإجابة الصحيحة بالسرعة القصوى!',
      items: [
        { questionOrPromptAr: 'الأقلام الملونة في المحفظة 🎒', correctAnswerAr: 'دَاخِلَ المِحْفَظَةِ', optionsAr: ['دَاخِلَ المِحْفَظَةِ', 'خَارِجَ المَدْرَسَةِ'], explanationAr: 'الأدوات تكون داخل المحفظة.' },
        { questionOrPromptAr: 'الكُرَةُ 🏀 مَوْضُوعَةٌ عَلَى الأَرْضِ بِجَانِبِ الصُّنْدُوقِ', correctAnswerAr: 'خَارِجَ الصُّنْدُوقِ', optionsAr: ['خَارِجَ الصُّنْدُوقِ', 'دَاخِلَ الصُّنْدُوقِ'], explanationAr: 'الكرة على الأرض بجانب الصندوق، إذن هي خارجه.' },
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
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
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
      'أَقُولُ مَا قَبْلَ العَدَدِ وَمَا بَعْدَهُ (3: قَبْلَهُ 2، بَعْدَهُ 4).',
    ],
    discoveryAr: 'ارفع يدك 🖐️ وعُدَّ أصابعك واحداً واحداً: 1، 2، 3، 4، 5!',
    rulesAr: [
      'العَدَدُ 0 يعني: لا يوجد أي شيء، الصندوق فارغ تماماً 📭.',
      '1 ☝️ = شمس واحدة، أنف واحد.',
      '2 ✌️ = عينان، أذنان، يدان.',
      '3 🤟 = إشارات المرور الثلاث.',
      '4 🚗 = عجلات السيارة الأربع.',
      '5 🖐️ = أصابع اليد الواحدة.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'visual_counting',
      titleAr: 'عُدَّ الأشياء من 0 إلى 5',
      introAr: 'عُدَّ الأشياء في الصندوق ثم اضغط على العدد الصحيح 👇',
      items: [
        { id: 'n0', emoji: '🍉', count: 0, labelAr: 'الصندوق فارغ... كم بطيخة تراها؟', choices: [0, 1, 2] },
        { id: 'n1', emoji: '🍉', count: 1, labelAr: 'كم بطيخة؟', choices: [1, 2, 3] },
        { id: 'n2', emoji: '🌸', count: 2, labelAr: 'كم زهرة؟', choices: [1, 2, 3] },
        { id: 'n3', emoji: '⚽', count: 3, labelAr: 'كم كرة؟', choices: [2, 3, 4] },
        { id: 'n4', emoji: '🍅', count: 4, labelAr: 'كم طماطم؟', choices: [3, 4, 5] },
        { id: 'n5', emoji: '🍏', count: 5, labelAr: 'كم تفاحة؟', choices: [4, 5, 6] },
      ],
    },
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
    sequenceAr: 'المقطع 4: الأشكال والألوان',
    categoryAr: 'الرياضيات - الأشكال والألوان',
    titleAr: 'الأَشْكَالُ: مُرَبَّعٌ، مُسْتَطِيلٌ، مُثَلَّثٌ، دَائِرَةٌ 🔴🟦🔺',
    summaryAr: 'التعرّف على الأشكال الأربعة وتسميتها وفرزها. المسطرة في الفصل الثالث.',
    objectiveAr: 'أن يسمي الطفل المربع والمستطيل والمثلث والدائرة ويفرّق بينها.',
    objectivesAr: [
      'أُسَمِّي الدَّائِرَةَ 🟡 وَالمُرَبَّعَ 🟦 وَالمُثَلَّثَ 🔺 وَالمُسْتَطِيلَ 🚪.',
      'أُفَرِّزُ الأَشْكَالَ: أَضَعُ كُلَّ نَوْعٍ فِي صُنْدُوقِهِ.',
    ],
    discoveryAr: 'ما شكل عجلة الدراجة 🚲؟ وما شكل قطعة البيتزا 🍕؟',
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
        { termAr: 'المُسْتَطِيلُ 🚪', definitionAr: 'شكل له 4 أضلاع: ضلعان طويلان وضلعان قصيران.' },
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
      {
        id: 'ex2-math1ap-shapes',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'كَمْ ضِلْعًا لِلْمُرَبَّعِ؟ 🟦',
        hintsAr: ['عُدَّ أَضْلاَعَهُ الأَرْبَعَةَ المُتَسَاوِيَةَ.'],
        solutionAr: '4 أَضْلاَعٍ',
        detailedCorrectionAr: 'ممتاز! لِلْمُرَبَّعِ 4 أضلاع متساوية.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-shapes',
      type: 'association',
      titleAr: 'صندوق الأشكال الهندسية',
      instructionsAr: 'اربط كل شيء بشكله المناسب!',
      items: [
        { questionOrPromptAr: 'عجلة السيارة 🚗', correctAnswerAr: 'دَائِرَةٌ', optionsAr: ['دَائِرَةٌ', 'مُرَبَّعٌ'], explanationAr: 'العجلة مستديرة لتدور بسلاسة.' },
        { questionOrPromptAr: 'شَاشَةُ الهَاتِفِ 📱', correctAnswerAr: 'مُسْتَطِيلٌ', optionsAr: ['مُسْتَطِيلٌ', 'مُثَلَّثٌ'], explanationAr: 'شاشة الهاتف مستطيلة الشكل.' },
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
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // =========================================================================
  // بقية T1: الأعداد 6–9 (قبل العشرة). T2 يبدأ من 10.
  // =========================================================================
  {
    id: 'math-1ap-t2-numbers-6-10',
    grade: '1AP',
    subject: 'math',
    trimester: 1,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 5: الأعداد من 6 إلى 9',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'الأَعْدَادُ 6، 7، 8، 9 وَمَا قَبْلُ وَمَا بَعْدُ 🖐️',
    summaryAr: 'قراءة وكتابة 6 إلى 9، وترتيب الأعداد: ما قبل الرقم وما بعده. العشرة تبدأ في الفصل الثاني.',
    objectiveAr: 'أن يعد الطفل إلى 9 ويعرف السابق واللاحق.',
    objectivesAr: [
      'أَعُدُّ مِنْ 6 إِلَى 9 بِأَصَابِعِ اليَدَيْنِ.',
      'أَكْتُبُ الأَرْقَامَ 6، 7، 8، 9.',
      'أَقُولُ: قَبْلَ 8 يَأْتِي 7، وَبَعْدَ 8 يَأْتِي 9.',
    ],
    discoveryAr: 'يد كاملة (5) ثم إصبع، إصبعان، ثلاثة، أربعة: 6، 7، 8، 9!',
    rulesAr: [
      '6 = يد (5) + 1.',
      '7 = يد (5) + 2.',
      '8 = يد (5) + 3.',
      '9 = يد (5) + 4.',
      'السَّابِقُ: العدد الذي يأتي قبل. اللَّاحِقُ: الذي يأتي بعد.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'visual_counting',
      titleAr: 'عُدَّ من 6 إلى 9',
      introAr: 'يد كاملة (5) + أصابع اليد الثانية. عُدَّ ثم اضغط على العدد الصحيح 👇',
      items: [
        { id: 'n6', emoji: '⭐', count: 6, labelAr: 'كم نجمة؟', choices: [5, 6, 7] },
        { id: 'n7', emoji: '🎈', count: 7, labelAr: 'كم بالوناً؟', choices: [6, 7, 8] },
        { id: 'n8', emoji: '🐟', count: 8, labelAr: 'كم سمكة؟', choices: [7, 8, 9] },
        { id: 'n9', emoji: '🌼', count: 9, labelAr: 'كم زهرة؟', choices: [8, 9, 10] },
      ],
    },
    examplesAr: [
      { problem: 'ما قبل 7؟ ما بعد 7؟', solution: 'قبل 7: 6. بعد 7: 8.' },
    ],
    detailedCourse: {
      introAr: 'أكملنا اليد الأولى، نفتح أصابع اليد الثانية حتى 9. الرقم 10 ننتظره في الفصل الثاني مع العشرات.',
      vocabulary: [
        { termAr: 'السَّابِقُ', definitionAr: 'العدد الذي يأتي مباشرة قبل عدد.' },
        { termAr: 'اللَّاحِقُ', definitionAr: 'العدد الذي يأتي مباشرة بعد عدد.' },
      ],
      visualizationHintAr: 'صفّ بطاقات 6 7 8 9 واطلب إخفاء واحدة: ما الرقم الناقص؟',
      commonMistakes: [
        { mistakeAr: 'كتابة 6 مقلوبة مثل 9.', correctionAr: '6 بطنها في الأسفل، 9 بطنها في الأعلى.' },
      ],
      takeawayAr: '0 إلى 9 أرقام. قبل / بعد. العشرة = بداية العشرات.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num10',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما العدد الذي يلي 8؟',
        hintsAr: ['8 ثم إصبع واحد.'],
        solutionAr: '9',
        detailedCorrectionAr: 'بعد 8 يأتي 9.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-num10',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'يَدٌ كَامِلَةٌ (5) + إِصْبَعَانِ = كَمْ؟',
        hintsAr: ['ابدأ من 5 ثم أضف 1، 2.'],
        solutionAr: '7',
        detailedCorrectionAr: 'أحسنت! 5 + 2 = 7.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num10',
      type: 'quiz_flash',
      titleAr: 'قطار 6 إلى 9 🚂',
      instructionsAr: 'اختر السابق أو اللاحق!',
      items: [
        { questionOrPromptAr: 'ما قبل 9؟', correctAnswerAr: '8', optionsAr: ['8', '7', '6'], explanationAr: 'قبل 9 يأتي 8.' },
        { questionOrPromptAr: '5 + 3 = ؟', correctAnswerAr: '8', optionsAr: ['8', '7', '9'], explanationAr: '5 + 3 = 8.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-num10',
        questionAr: 'ما العدد الذي يأتي بعد 6 مباشرة؟',
        options: [
          { id: 'a', textAr: '7', isCorrect: true, explanationAr: 'بعد 6 يأتي 7.' },
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
    id: 'math-1ap-t2-addition-concept',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الحساب والعمليات',
    sequenceAr: 'المقطع 6: مفهوم الجمع والرمز (+)',
    categoryAr: 'الرياضيات - الجمع',
    titleAr: 'الجَمْعُ: أُضِيفُ، أَجْمَعُ، أَتَقَدَّمُ ➕🎈',
    summaryAr: 'الجمع يعني أن نُضيف، أن نضمّ مجموعتين، أو أن نتقدّم على الخط العددي. جمع ذهني لأعداد أصغر من 10.',
    objectiveAr: 'أن يربط الطفل الجمع بثلاث صور: إضافة، تجميع، تقدّم، ويحسب مجاميع أصغر من 10.',
    objectivesAr: [
      'أَفْهَمُ الجَمْعَ: أُضِيفُ (Rajouter)، أَضُمُّ (Regrouper)، أَتَقَدَّمُ (Avancer).',
      'أَحْسُبُ ذِهْنِيًّا مَجَامِيعَ أَصْغَرَ مِنْ 10، مِثْلَ 3 + 2 = 5.',
      'أَسْتَعْمِلُ رَمْزَيْ (+) وَ (=).',
    ],
    discoveryAr: 'معك 3 بالونات 🎈🎈🎈 وأعطتك أمك بالونين 🎈🎈. أضفتُ، ضممتُ، تقدّمتُ: كم صار؟',
    rulesAr: [
      'أُضِيفُ: كان معي 4، أضفت 2 → 4 + 2.',
      'أَضُمُّ: 3 تفاح أحمر مع 2 أخضر في سلة واحدة.',
      'أَتَقَدَّمُ: أقف على 5 في الخط العددي وأتقدّم خطوتين → 7.',
      '3 + 2 = 5 (ثلاثة زائد اثنان يساوي خمسة).',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'word_problem_scenario',
      titleAr: 'أجمع: أضيف، أضمّ، أتقدّم',
      introAr: 'مجاميع أصغر من 10. اختر العملية الصحيحة.',
      problems: [
        {
          id: 'add-balloons',
          situationAr: 'معك 3 بالونات، وأعطتك أمك بالونين. كم صار؟',
          choices: [
            { textAr: '3 + 2 = 5', isCorrect: true, feedbackAr: 'نعم: أضفت، ضممت، تقدّمت إلى 5.' },
            { textAr: '3 − 2 = 1', isCorrect: false, feedbackAr: 'الأم أعطت بالونات: نضيف، لا ننقص.' },
          ],
        },
        {
          id: 'add-line',
          situationAr: 'أقف على 4 في الخط العددي وأتقدّم خطوتين. أين أصل؟',
          choices: [
            { textAr: '6', isCorrect: true, feedbackAr: '4 ثم 5 ثم 6. 4 + 2 = 6.' },
            { textAr: '2', isCorrect: false, feedbackAr: 'التقدّم يزيد العدد.' },
          ],
        },
      ],
    },
    examplesAr: [
      { problem: '4 + 1 = ؟', solution: '5' },
    ],
    detailedCourse: {
      introAr: 'الجمع ثلاث حركات: أُضيف شيئاً، أضمّ مجموعتين، أو أتقدّم على الخط.',
      vocabulary: [
        { termAr: 'أُضِيفُ ➕', definitionAr: 'أزيد كمية على كمية.' },
        { termAr: 'أَضُمُّ 🧺', definitionAr: 'أضع المجموعتين معاً.' },
        { termAr: 'أَتَقَدَّمُ ➡️', definitionAr: 'أمشي إلى الأمام على خط الأعداد.' },
      ],
      visualizationHintAr: 'استعمل حبات حلوى ملونة واجمع مجموعتين أمام الطفل.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين رمز الجمع (+) والطرح (-).', correctionAr: 'الزائد (+) يشبه الصليب ويجمع الأشياء ويزيدها.' },
      ],
      takeawayAr: 'الجمع = أضيف أو أضمّ أو أتقدّم. نبدأ بمجاميع أصغر من 10.',
    },
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
      {
        id: 'ex2-math1ap-add',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'عِنْدَ سَامِي 2 كِتَابٍ، وَأَهْدَاهُ صَدِيقُهُ 4 كُتُبٍ أُخْرَى. كَمْ كِتَابًا صَارَ عِنْدَهُ؟ 📚',
        hintsAr: ['اجْمَعْ 2 + 4.'],
        solutionAr: '6',
        detailedCorrectionAr: 'ممتاز! 2 + 4 = 6 كتب.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-add',
      type: 'quiz_flash',
      titleAr: 'سلة التفاح المجموع 🧺',
      instructionsAr: 'احسب المجموع وضع النتيجة في السلة!',
      items: [
        { questionOrPromptAr: '5 + 2 = ؟', correctAnswerAr: '7', optionsAr: ['7', '6', '8'], explanationAr: '5 + 2 = 7.' },
        { questionOrPromptAr: '3 + 4 = ؟', correctAnswerAr: '7', optionsAr: ['7', '6', '8'], explanationAr: '3 + 4 = 7.' },
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
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-numbers-11-20',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 7: الأعداد من 10 إلى 20',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'مِنْ 10 إِلَى 20: عَشَرَاتٌ وَوَحَدَاتٌ وَكِتَابَةٌ 🧩',
    summaryAr: 'العشرة الأولى، ثم 11 إلى 20: تفكيك (عشرات + وحدات)، كتابة بالأرقام والحروف، وإطار العدد بين جارين أو بين عشرتين.',
    objectiveAr: 'أن يكتب الطفل 10–20 بالأرقام والحروف ويفككها إلى عشرات ووحدات ويؤطر عدداً.',
    objectivesAr: [
      'أَقْرَأُ وَأَكْتُبُ مِنْ 10 إِلَى 20 بِالأَرْقَامِ وَبِالحُرُوفِ (عَشَرَة، أَحَدَ عَشَرَ، عِشْرُونَ).',
      'أُفَكِّكُ: 14 = 1 عَشَرَة + 4 وَحَدَات.',
      'أُؤَطِّرُ عَدَدًا: 14 بَيْنَ 13 وَ 15، أَوْ بَيْنَ 10 وَ 20.',
    ],
    discoveryAr: 'ارفع يديك (10) ثم أضف إصبعاً من صديقك: 11. هذه عشرات ووحدات!',
    rulesAr: [
      '10 = عَشَرَة (عشرة واحدة، صفر وحدات).',
      '11 = أَحَدَ عَشَرَ = 10 + 1.  12 = اِثْنَا عَشَرَ = 10 + 2.',
      '15 = خَمْسَةَ عَشَرَ.  20 = عِشْرُونَ (عشرتان).',
      'الإِطَارُ: العدد بين جاره السابق واللاحق، أو بين عشرتين.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'place_value_blocks',
      titleAr: 'من 10 إلى 20: عشرة ووحدات',
      introAr: 'اضغط على كل عدد لترى حزمة العشرة ووحداته المفردة.',
      items: [
        { id: 'pv10', value: 10, tens: 1, units: 0, labelAr: 'عشرة' },
        { id: 'pv11', value: 11, tens: 1, units: 1, labelAr: 'أحد عشر' },
        { id: 'pv15', value: 15, tens: 1, units: 5, labelAr: 'خمسة عشر' },
        { id: 'pv20', value: 20, tens: 2, units: 0, labelAr: 'عشرون (إطار 14: 10 < 14 < 20)' },
      ],
    },
    examplesAr: [
      { problem: 'اكتب 16 بالحروف وفكّكه.', solution: 'سِتَّةَ عَشَرَ. 16 = 1 عشرة + 6 وحدات.' },
      { problem: 'أطّر 14 بين عددين متتاليين وبين عشرتين.', solution: '13 < 14 < 15. و 10 < 14 < 20.' },
    ],
    detailedCourse: {
      introAr: 'من 10 تبدأ العشرات: رقم على اليسار للعشرات، ورقم على اليمين للوحدات. نكتب أيضاً بالحروف.',
      vocabulary: [
        { termAr: 'العَشَرَةُ 🔟', definitionAr: 'حزمة من 10 وحدات.' },
        { termAr: 'الوِحْدَاتُ', definitionAr: 'الرقم على اليمين: كم بقي بعد العشرة.' },
        { termAr: 'الإِطَارُ', definitionAr: 'وضع العدد بين جارين أو بين عشرتين.' },
      ],
      visualizationHintAr: 'حزمة 10 عيدان + عيدان مفردة. بطاقات: عشرة، أحد عشر، اثنا عشر...',
      commonMistakes: [
        { mistakeAr: 'كتابة 13 كـ 31.', correctionAr: 'العشرات يساراً والوحدات يميناً: 13 وليس 31.' },
      ],
      takeawayAr: '10–20: أرقام + حروف. عشرات ووحدات. إطار بين جارين أو عشرتين.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num20',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'اكتب بالحروف: 12. ثم فكّك 12.',
        hintsAr: ['عشرة + اثنان. اثنا عشر.'],
        solutionAr: 'اِثْنَا عَشَرَ. 10 + 2',
        detailedCorrectionAr: '12 = اثنا عشر = 1 عشرة + 2 وحدات.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-num20',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'العدد 17 بين أي عشرتين؟ وبين أي عددين متتاليين؟',
        hintsAr: ['العشرتان 10 و 20. الجاران 16 و 18.'],
        solutionAr: '10 و 20. وَ 16 وَ 18',
        detailedCorrectionAr: '10 < 17 < 20، و 16 < 17 < 18.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num20',
      type: 'quiz_flash',
      titleAr: 'تحدي قطار الأعداد حتى 20 🚂',
      instructionsAr: 'اختر عربة القطار الصحيحة!',
      items: [
        { questionOrPromptAr: 'كيف نكتب 10 بالحروف؟', correctAnswerAr: 'عَشَرَة', optionsAr: ['عَشَرَة', 'عِشْرُونَ', 'أَحَدَ عَشَرَ'], explanationAr: '10 = عشرة.' },
        { questionOrPromptAr: 'مَا العَدَدُ الَّذِي يَسْبِقُ 20 مُبَاشَرَةً؟', correctAnswerAr: '19', optionsAr: ['19', '18', '21'], explanationAr: 'قبل 20 يأتي العدد 19.' },
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
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t2-subtraction-and-lengths',
    grade: '1AP',
    subject: 'math',
    trimester: 2,
    domainAr: 'الحساب والعمليات',
    sequenceAr: 'المقطع 8: الطرح البسيط',
    categoryAr: 'الرياضيات - الطرح',
    titleAr: 'الطَّرْحُ: أَنْقُصُ، أُخْرِجُ، أَرْجِعُ ➖🎈',
    summaryAr: 'الطرح يعني أن ننقص، أن نُخرج، أو أن نرجع على الخط العددي. باقٍ بسيط دون مقارنة أطوال.',
    objectiveAr: 'أن يربط الطفل الطرح بثلاث صور: إنقاص، إخراج، تراجع، ويحسب باقياً أصغر من 10.',
    objectivesAr: [
      'أَفْهَمُ الطَّرْحَ: أَنْقُصُ (Retirer)، أُخْرِجُ (Enlever)، أَرْجِعُ (Reculer).',
      'أَحْسُبُ البَاقِيَ: 5 − 2 = 3.',
    ],
    discoveryAr: 'كان في الصحن 5 تفاحات 🍎🍎🍎🍎🍎 أكلت منها اثنتين. أنقصتُ، أخرجتُ، رجعتُ: كم بقي؟',
    rulesAr: [
      'أَنْقُصُ: آخذ كمية من مجموعة.',
      'أُخْرِجُ: أزيل عناصر (بالونات تنفجر، حلوى تُؤكل).',
      'أَرْجِعُ: أقف على 7 وأتراجع خطوتين → 5.',
      '5 − 2 = 3 (خمسة ناقص اثنان يساوي ثلاثة).',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'word_problem_scenario',
      titleAr: 'أطرح: أنقص، أخرج، أرجع',
      introAr: 'باقٍ أصغر من 10.',
      problems: [
        {
          id: 'sub-apples',
          situationAr: 'كان في الصحن 5 تفاحات، أكلت منها اثنتين. كم بقي؟',
          choices: [
            { textAr: '5 − 2 = 3', isCorrect: true, feedbackAr: 'أنقصتُ وأخرجتُ: بقي 3.' },
            { textAr: '5 + 2 = 7', isCorrect: false, feedbackAr: 'الأكل ينقص الكمية.' },
          ],
        },
        {
          id: 'sub-line',
          situationAr: 'أقف على 7 وأتراجع خطوتين. أين أصل؟',
          choices: [
            { textAr: '5', isCorrect: true, feedbackAr: '7 ثم 6 ثم 5. 7 − 2 = 5.' },
            { textAr: '9', isCorrect: false, feedbackAr: 'التراجع ينقص العدد.' },
          ],
        },
      ],
    },
    examplesAr: [
      { problem: '6 − 2 = ؟', solution: '4' },
    ],
    detailedCourse: {
      introAr: 'الطرح عكس الجمع: ننقص، نُخرج، أو نرجع على الخط.',
      vocabulary: [
        { termAr: 'أَنْقُصُ ➖', definitionAr: 'آخذ كمية من الكل.' },
        { termAr: 'أُخْرِجُ 🎈', definitionAr: 'أزيل عناصر من المجموعة.' },
        { termAr: 'أَرْجِعُ ⬅️', definitionAr: 'أمشي إلى الخلف على خط الأعداد.' },
      ],
      visualizationHintAr: 'ارفع 7 أصابع واخفض 3. أو امشِ إلى الخلف على خط مرسوم على الأرض.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين (+) و (−).', correctionAr: 'الزائد يزيد، الناقص ينقص أو يرجع.' },
      ],
      takeawayAr: 'الطرح = أنقص أو أُخرج أو أرجع. الباقي أصغر من العدد الأول.',
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
      {
        id: 'ex2-math1ap-sub',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'عَلِيٌّ عَلَى الخَطِّ عِنْدَ 8. رَجَعَ 3 خُطُوَاتٍ. أَيْنَ وَقَفَ؟',
        hintsAr: ['ارجع: 7، 6، 5.'],
        solutionAr: '5',
        detailedCorrectionAr: '8 − 3 = 5. الرجوع على الخط هو طرح.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-sub',
      type: 'quiz_flash',
      titleAr: 'لعبة البالونات المنفجرة 🎈',
      instructionsAr: 'احسب الباقي بسرعة!',
      items: [
        { questionOrPromptAr: 'كانت 6 بالونات، فرقعت منها 2 💥. كم بقي؟', correctAnswerAr: '4', optionsAr: ['4', '5', '3'], explanationAr: '6 - 2 = 4.' },
        { questionOrPromptAr: 'كَانَتْ مَعَ نُورَ 9 حَلْوَى 🍬 وَأَكَلَتْ 5 مِنْهَا. كَمْ بَقِيَ؟', correctAnswerAr: '4', optionsAr: ['4', '5', '3'], explanationAr: '9 - 5 = 4.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-sub',
        questionAr: 'كان مع ليلى 6 أقلام، أعطت صديقتها قلمين. كم بقي؟ ✏️',
        options: [
          { id: 'a', textAr: '4 أَقْلاَم (6 − 2 = 4)', isCorrect: true, explanationAr: 'أنقصنا 2 من 6 فبقي 4.' },
          { id: 'b', textAr: '8 أقلام', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  // =========================================================================
  // الفصل الثالث: الأعداد من 21 إلى 99، مقارنة < > حتى 99، مسائل حتى 20.
  // =========================================================================
  {
    id: 'math-1ap-t3-numbers-21-99',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الأعداد والعدّ',
    sequenceAr: 'المقطع 10: الأعداد من 21 إلى 99 (العشرات)',
    categoryAr: 'الرياضيات - الأعداد',
    titleAr: 'أَكْتَشِفُ العَشَرَاتِ: مِنْ 21 إِلَى 99 🔟🔟',
    summaryAr: 'بعد العشرين، نتعلم أسماء العشرات (عشرون، ثلاثون... تسعون) ونفكك كل عدد إلى عشرات ووحدات، ثم نقارن بـ > و < حتى 99.',
    objectiveAr: 'أن يقرأ الطفل ويكتب أعداداً من 21 إلى 99، يفككها إلى عشرات ووحدات، ويقارن بينها.',
    objectivesAr: [
      'أَحْفَظُ أَسْمَاءَ العَشَرَاتِ: 20 عِشْرُونَ، 30 ثَلَاثُونَ، 40 أَرْبَعُونَ، 50 خَمْسُونَ، 60 سِتُّونَ، 70 سَبْعُونَ، 80 ثَمَانُونَ، 90 تِسْعُونَ.',
      'أُفَكِّكُ عَدَدًا: 45 = 4 عَشَرَات + 5 وَحَدَات.',
      'أُقَارِنُ عَدَدَيْنِ حَتَّى 99 بِاسْتِعْمَالِ > وَ < وَ =.',
    ],
    discoveryAr: 'بعد 20 (عشرتان)، نضيف عشرة أخرى فنصل إلى 30 (ثلاث عشرات). هكذا نتقدّم عشرة عشرة حتى 90!',
    rulesAr: [
      'أَسْمَاءُ العَشَرَاتِ: 20 عِشْرُونَ — 30 ثَلَاثُونَ — 40 أَرْبَعُونَ — 50 خَمْسُونَ — 60 سِتُّونَ — 70 سَبْعُونَ — 80 ثَمَانُونَ — 90 تِسْعُونَ.',
      'العَدَدُ = عَشَرَاتٌ + وَحَدَاتٌ: 45 = 40 + 5 = 4 عشرات و5 وحدات.',
      'أَكْبَرُ العَدَدَيْنِ هُوَ مَنْ لَهُ عَشَرَاتٌ أَكْثَرَ: 62 أَكْبَرُ مِنْ 58 لِأَنَّ 6 عَشَرَاتٍ أَكْثَرُ مِنْ 5.',
      'إِذَا تَسَاوَتِ العَشَرَاتُ، نُقَارِنُ الوَحَدَاتِ: 43 أَصْغَرُ مِنْ 47.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'place_value_blocks',
      titleAr: 'من 21 إلى 99: عشرات ووحدات',
      introAr: 'اضغط على كل عدد لترى حزم العشرات ووحداته المفردة.',
      items: [
        { id: 'pv23', value: 23, tens: 2, units: 3, labelAr: 'ثلاثة وعشرون' },
        { id: 'pv45', value: 45, tens: 4, units: 5, labelAr: 'خمسة وأربعون' },
        { id: 'pv68', value: 68, tens: 6, units: 8, labelAr: 'ثمانية وستون' },
        { id: 'pv99', value: 99, tens: 9, units: 9, labelAr: 'تسعة وتسعون (أكبر عدد بخانتين)' },
      ],
    },
    examplesAr: [
      { problem: 'اكتب 45 بالحروف وفكّكه.', solution: 'خَمْسَةٌ وَأَرْبَعُونَ. 45 = 4 عشرات + 5 وحدات.' },
      { problem: 'قارن: 62 و 58. أيّهما أكبر؟', solution: '62 أَكْبَرُ مِنْ 58 (6 عشرات > 5 عشرات). نكتب: 62 > 58.' },
    ],
    detailedCourse: {
      introAr: 'بعد العشرين، الأعداد تتقدّم عشرة عشرة: عشرون، ثم ثلاثون، ثم أربعون... حتى تسعون. كل عدد بين ذلك يُصنع من عشرات ووحدات.',
      vocabulary: [
        { termAr: 'العَشَرَاتُ 🔟🔟', definitionAr: 'الرقم الأول من اليسار: كم حزمة من 10.' },
        { termAr: 'الوِحْدَاتُ', definitionAr: 'الرقم الثاني من اليمين: كم بقي بعد العشرات.' },
        { termAr: 'أَكْبَرُ مِنْ / أَصْغَرُ مِنْ', definitionAr: 'نقارن العشرات أولاً، فإن تساوت نقارن الوحدات.' },
      ],
      visualizationHintAr: 'استعمل حزم من 10 عيدان (مطاطة تجمعها) + عيدان مفردة. مثلاً 45 = 4 حزم + 5 عيدان مفردة. اعرض العددين معاً على الطاولة ليقارن الطفل الحزم أولاً.',
      commonMistakes: [
        { mistakeAr: 'كتابة 45 كـ 54 (عكس الرقمين).', correctionAr: 'العشرات دائماً على اليسار: 4 عشرات ثم 5 وحدات = 45.' },
        { mistakeAr: 'مقارنة الوحدات قبل العشرات.', correctionAr: 'نقارن العشرات أولاً دائماً. 71 أكبر من 69 رغم أن 9 أكبر من 1، لأن 7 عشرات أكبر من 6 عشرات.' },
      ],
      takeawayAr: '20 عشرون ... 90 تسعون. كل عدد = عشرات + وحدات. نقارن العشرات أولاً ثم الوحدات.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-num99',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'اكتب بالحروف: 30. ثم فكّك 36.',
        hintsAr: ['30 = ثلاث عشرات بالضبط. 36 = 3 عشرات + 6 وحدات.'],
        solutionAr: 'ثَلَاثُونَ. 36 = 30 + 6',
        detailedCorrectionAr: '30 = ثلاثون. 36 = 3 عشرات و6 وحدات.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-num99',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'قارن بـ > أو < : 74 ... 79',
        hintsAr: ['العشرات متساوية (7)، قارن الوحدات: 4 و9.'],
        solutionAr: '74 < 79',
        detailedCorrectionAr: 'العشرات متساوية، والوحدات 4 أصغر من 9، إذن 74 < 79.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-num99',
      type: 'quiz_flash',
      titleAr: 'قطار العشرات الكبير 🚂🔟',
      instructionsAr: 'اختر العربة الصحيحة!',
      items: [
        { questionOrPromptAr: 'كيف نكتب 80 بالحروف؟', correctAnswerAr: 'ثَمَانُونَ', optionsAr: ['ثَمَانُونَ', 'تِسْعُونَ', 'سَبْعُونَ'], explanationAr: '80 = ثمانون.' },
        { questionOrPromptAr: 'أَيُّ عَدَدٍ أَكْبَرُ: 52 أَمْ 49؟', correctAnswerAr: '52', optionsAr: ['52', '49', 'متساويان'], explanationAr: '5 عشرات أكبر من 4 عشرات، إذن 52 أكبر.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-num99',
        questionAr: 'العدد 90 يساوي:',
        options: [
          { id: 'a', textAr: '9 عَشَرَات', isCorrect: true, explanationAr: 'صحيح! تسع حزم من 10 = 90.' },
          { id: 'b', textAr: '9 وَحَدَات', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },

  {
    id: 'math-1ap-t3-addition-and-time-money',
    grade: '1AP',
    subject: 'math',
    trimester: 3,
    domainAr: 'الحساب وحل المشكلات',
    sequenceAr: 'المقطع 11: مسائل يومية وحساب ذهني حتى 20',
    categoryAr: 'الرياضيات - المسائل',
    titleAr: 'أَحُلُّ مَسْأَلَةً: أَفْهَمُ وَأَخْتَارُ (+) أَوْ (−) 🧩',
    summaryAr: 'مسائل قصيرة من الحياة اليومية: فهم النص، اختيار الجمع أو الطرح، وحساب ذهني حتى 20.',
    objectiveAr: 'أن يفهم الطفل المسألة ويختار العملية المناسبة ويحسب ذهنياً حتى 20.',
    objectivesAr: [
      'أَقْرَأُ المَسْأَلَةَ وَأَبْحَثُ عَنِ الكَلِمَاتِ: رَبِحَ / أَضَافَ → جَمْع، فَقَدَ / أَعْطَى → طَرْح.',
      'أَحْسُبُ ذِهْنِيًّا مَجَامِيعَ وَبَوَاقِيَ حَتَّى 20 (مِثْلَ 12 + 5، 18 − 3).',
    ],
    discoveryAr: 'عليٌّ معه 3 بِلِّيَات، ربح 2. هل نضيف أم ننقص؟ نضيف: 3 + 2 = 5.',
    rulesAr: [
      'الجَمْع: ربح، اشترى، جاء، أضاف، تقدّم.',
      'الطَّرْح: فقد، أعطى، أكل، رجع، نقص.',
      'حساب ذهني حتى 20: 8 + 7 = 15، 14 − 6 = 8.',
      'نقرأ المسألة مرتين: ماذا حدث؟ ثم نختار العملية.',
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'word_problem_scenario',
      titleAr: 'مسألة: أجمع أم أطرح؟',
      introAr: 'ربح / أضاف → جمع. فقد / أعطى → طرح. حساب حتى 20.',
      problems: [
        {
          id: 'marbles',
          situationAr: 'علي معه 3 بليات، ربح 2. كم صار معه؟',
          choices: [
            { textAr: '3 + 2 = 5', isCorrect: true, feedbackAr: 'ربح = جمع.' },
            { textAr: '3 − 2 = 1', isCorrect: false, feedbackAr: 'الربح يزيد الكمية.' },
          ],
        },
        {
          id: 'dates',
          situationAr: 'كان في السلة 12 تمرة، أكلت ليلى 4. كم بقي؟',
          choices: [
            { textAr: '12 − 4 = 8', isCorrect: true, feedbackAr: 'أكل = طرح.' },
            { textAr: '12 + 4 = 16', isCorrect: false, feedbackAr: 'الأكل ينقص التمر.' },
          ],
        },
      ],
    },
    examplesAr: [
      { problem: 'علي معه 3 بليات، ربح 2. كم صار معه؟', solution: 'جمع: 3 + 2 = 5.' },
      { problem: 'كان في السلة 12 تمرة، أكلت ليلى 4. كم بقي؟', solution: 'طرح: 12 − 4 = 8.' },
    ],
    detailedCourse: {
      introAr: 'المسألة قصة قصيرة. نفهم ماذا حدث ثم نختار + أو − ثم نحسب.',
      vocabulary: [
        { termAr: 'المَسْأَلَةُ 🧩', definitionAr: 'قصة فيها أعداد نبحث عن الجواب.' },
        { termAr: 'الحِسَابُ الذِّهْنِيُّ', definitionAr: 'نجمع أو ننقص في الرأس حتى 20.' },
      ],
      visualizationHintAr: 'ارسم البليات أو التمر على ورقة ثم أضف أو امسح.',
      commonMistakes: [
        { mistakeAr: 'الجمع دائماً لأن العددين ظاهران.', correctionAr: 'نسأل: هل الكمية كبرت أم صغرت؟' },
      ],
      takeawayAr: 'أفهم القصة → أختار + أو − → أحسب ذهنياً حتى 20.',
    },
    progressiveExercises: [
      {
        id: 'ex1-math1ap-tm',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'سَامِي مَعَهُ 9 كُرَاتٍ، أَعْطَاهُ صَدِيقُهُ 6. كَمْ صَارَ مَعَهُ؟',
        hintsAr: ['أعطاه = أضاف. 9 + 6 حتى 20.'],
        solutionAr: '15',
        detailedCorrectionAr: 'جمع: 9 + 6 = 15.',
        xpReward: 10,
      },
      {
        id: 'ex2-math1ap-tm',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'كَانَتْ مَعَ نُورَ 18 حَلْوَى، أَكَلَتْ 5. كَمْ بَقِيَ؟ أَجْمَعُ أَمْ أَطْرَحُ؟',
        hintsAr: ['أكلت = أنقصت.'],
        solutionAr: 'أَطْرَحُ: 18 − 5 = 13',
        detailedCorrectionAr: 'الطرح لأن الكمية نقصت. 18 − 5 = 13.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-math-1ap-tm',
      type: 'quiz_flash',
      titleAr: 'مخبر المسائل 🧩',
      instructionsAr: 'اختر العملية ثم النتيجة!',
      items: [
        { questionOrPromptAr: 'علي 3 بليات، ربح 2. العملية؟', correctAnswerAr: '3 + 2', optionsAr: ['3 + 2', '3 − 2', '2 − 3'], explanationAr: 'ربح = جمع.' },
        { questionOrPromptAr: '12 + 7 = ؟ (ذهني حتى 20)', correctAnswerAr: '19', optionsAr: ['19', '18', '17'], explanationAr: '12 + 7 = 19.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-math1ap-tm',
        questionAr: 'كان في الحافلة 11 طفلاً، نزل 4. ماذا نفعل؟',
        options: [
          { id: 'a', textAr: 'نَطْرَحُ: 11 − 4 = 7', isCorrect: true, explanationAr: 'نزل = نقص. 11 − 4 = 7.' },
          { id: 'b', textAr: 'نجمع: 11 + 4 = 15', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_MATH,
  },
];
