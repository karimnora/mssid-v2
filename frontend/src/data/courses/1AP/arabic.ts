import { CourseLesson } from '../../../types';

const SOURCE_NOTE_1AP_ARABIC =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة التمهيدي/السنة الأولى ابتدائي، مبسّط جداً وبصري يركز على أصوات الحروف والرسم (الغرافيزم) — بدون امتحانات فصلية رسمية في هذا المستوى، وليس نسخة حرفية عن وثيقة رسمية.';

export const ARABIC_1AP: CourseLesson[] = [
  // ==========================================
  // TRIMESTRE 1
  // ==========================================
  {
    id: 'arabic-1ap-t1-letters-group1',
    grade: '1AP',
    subject: 'arabic',
    trimester: 1,
    domainAr: 'الحروف والأصوات',
    sequenceAr: 'السلسلة 1: مجموعة الحروف الأولى (أ - ب - ت - ث)',
    categoryAr: 'اللغة العربية - الحروف الأولى',
    titleAr: 'أَصْوَاتُ الحُرُوفِ: أَ - بَ - تَ - ثَ 🔤',
    summaryAr: 'يكتشف الطفل أصوات وأشكال أول 4 حروف هجائية (أ، ب، ت، ث) من خلال كلمات بسيطة وصور مألوفة.',
    objectiveAr: 'التعرف على صوت وشكل الحروف أ، ب، ت، ث في بداية كلمات بسيطة.',
    objectivesAr: [
      'أَسْمَعُ وَأُمَيِّزُ صوت كل حرف من هذه الحروف الأربعة.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ حرف مكتوباً.',
      'أَذْكُرُ كلمة واحدة تبدأ بكل حرف.',
    ],
    discoveryAr: 'استمع: أَسَدٌ 🦁، بَطَّةٌ 🦆، تُفَّاحَةٌ 🍎، ثَعْلَبٌ 🦊 — ما الصوت الأول في كل كلمة؟',
    rulesAr: [
      'حرف الأَلِفِ (أ): صوته "أَ" مثل أَسَدٌ 🦁.',
      'حرف البَاءِ (ب): صوته "بَ" مثل بَطَّةٌ 🦆.',
      'حرف التَّاءِ (ت): صوته "تَ" مثل تُفَّاحَةٌ 🍎.',
      'حرف الثَّاءِ (ث): صوته "ثَ" مثل ثَعْلَبٌ 🦊.',
    ],
    examplesAr: [
      { problem: 'ما هو الصوت الأول في كلمة "بَطَّةٌ"؟', solution: 'بَ (الباء).' },
    ],
    detailedCourse: {
      introAr: 'كل حرف له صوت خاص به وشكل مميز. نتعلم اليوم أول 4 أصدقاء من الحروف: أ، ب، ت، ث.',
      vocabulary: [
        { termAr: 'الحَرْفُ', definitionAr: 'رمز صغير له صوت خاص، ومنه تتكون الكلمات.' },
      ],
      visualizationHintAr: 'ارسم كل حرف بخط كبير على ورقة وضع بجانبه صورة الحيوان أو الشيء الذي يبدأ به.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين شكل حرف الباء (ب) والتاء (ت).', correctionAr: 'ذكّر الطفل بالنقاط: الباء لها نقطة واحدة تحتها، والتاء لها نقطتان فوقها.' },
      ],
      takeawayAr: 'أ = أَسَدٌ. ب = بَطَّةٌ. ت = تُفَّاحَةٌ. ث = ثَعْلَبٌ. أربعة أصدقاء جدد من الحروف!',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-group1',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما الصوت الأول في كلمة "أَسَدٌ" 🦁؟',
        hintsAr: ['هو أول حرف في الأبجدية.'],
        solutionAr: 'أَ',
        detailedCorrectionAr: 'أحسنت! أَسَدٌ يبدأ بحرف الألف.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-group1',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي حرف نجده في بداية كلمة "ثَعْلَبٌ" 🦊؟',
        hintsAr: ['له 3 نقاط فوقه.'],
        solutionAr: 'ثَ',
        detailedCorrectionAr: 'ممتاز! ثَعْلَبٌ يبدأ بحرف الثاء.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-group1',
      type: 'association',
      titleAr: 'لعبة صيد الحروف والصور',
      instructionsAr: 'اربط كل صورة بالحرف الذي تبدأ به!',
      items: [
        { questionOrPromptAr: 'تُفَّاحَةٌ 🍎', correctAnswerAr: 'تَ', optionsAr: ['تَ', 'بَ', 'أَ'], explanationAr: 'تُفَّاحَةٌ تبدأ بحرف التاء.' },
        { questionOrPromptAr: 'بَطَّةٌ 🦆', correctAnswerAr: 'بَ', optionsAr: ['بَ', 'ثَ', 'أَ'], explanationAr: 'بَطَّةٌ تبدأ بحرف الباء.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-group1',
        questionAr: 'أي حرف نجده في بداية كلمة "بَطَّةٌ"؟',
        options: [
          { id: 'a', textAr: 'بَ', isCorrect: true, explanationAr: 'صحيح! بَطَّةٌ تبدأ بحرف الباء.' },
          { id: 'b', textAr: 'تَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },

  {
    id: 'arabic-1ap-t1-letters-group2',
    grade: '1AP',
    subject: 'arabic',
    trimester: 1,
    domainAr: 'الحروف والأصوات',
    sequenceAr: 'السلسلة 2: مجموعة الحروف (م - ن - ل - ر)',
    categoryAr: 'اللغة العربية - الحروف',
    titleAr: 'أَصْوَاتُ الحُرُوفِ: مَ - نَ - لَ - رَ 🔤',
    summaryAr: 'يتعرف الطفل على أصوات وأشكال الحروف م، ن، ل، ر من خلال كلمات بسيطة مألوفة من محيطه.',
    objectiveAr: 'التعرف على صوت وشكل الحروف م، ن، ل، ر في بداية كلمات بسيطة.',
    objectivesAr: [
      'أَسْمَعُ وَأُمَيِّزُ صوت كل حرف من هذه الحروف الأربعة.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ حرف مكتوباً.',
      'أَنْطِقُ كلمات بسيطة تحتوي على هذه الحروف.',
    ],
    discoveryAr: 'استمع: مَوْزٌ 🍌، نَحْلَةٌ 🐝، لَيْمُونٌ 🍋، رُمَّانٌ — ما الصوت الأول في كل كلمة؟',
    rulesAr: [
      'حرف المِيمِ (م): صوته "مَ" مثل مَوْزٌ 🍌.',
      'حرف النُّونِ (ن): صوته "نَ" مثل نَحْلَةٌ 🐝.',
      'حرف اللَّامِ (ل): صوته "لَ" مثل لَيْمُونٌ 🍋.',
      'حرف الرَّاءِ (ر): صوته "رَ" مثل رُمَّانٌ.',
    ],
    examplesAr: [
      { problem: 'ما هو الصوت الأول في كلمة "نَحْلَةٌ"؟', solution: 'نَ (النون).' },
    ],
    detailedCourse: {
      introAr: 'نواصل رحلتنا مع الحروف! اليوم نتعرف على 4 أصدقاء جدد: م، ن، ل، ر.',
      vocabulary: [
        { termAr: 'النُّطْقُ', definitionAr: 'إخراج صوت الحرف بوضوح من فمنا.' },
      ],
      visualizationHintAr: 'العب لعبة تقليد الصوت: كرر كل حرف بصوت عالٍ مع الطفل عدة مرات.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين صوت النون (ن) واللام (ل).', correctionAr: 'درّب الطفل على النطق البطيء والواضح لكل صوت على حدة.' },
      ],
      takeawayAr: 'م = مَوْزٌ. ن = نَحْلَةٌ. ل = لَيْمُونٌ. ر = رُمَّانٌ. أربعة أصدقاء جدد من الحروف!',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-group2',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما الصوت الأول في كلمة "مَوْزٌ" 🍌؟',
        hintsAr: ['فاكهة صفراء طويلة.'],
        solutionAr: 'مَ',
        detailedCorrectionAr: 'أحسنت! مَوْزٌ يبدأ بحرف الميم.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-group2',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي حرف نجده في بداية كلمة "لَيْمُونٌ" 🍋؟',
        hintsAr: ['فاكهة صفراء حامضة.'],
        solutionAr: 'لَ',
        detailedCorrectionAr: 'ممتاز! لَيْمُونٌ يبدأ بحرف اللام.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-group2',
      type: 'association',
      titleAr: 'لعبة صيد الحروف والصور',
      instructionsAr: 'اربط كل صورة بالحرف الذي تبدأ به!',
      items: [
        { questionOrPromptAr: 'نَحْلَةٌ 🐝', correctAnswerAr: 'نَ', optionsAr: ['نَ', 'مَ', 'رَ'], explanationAr: 'نَحْلَةٌ تبدأ بحرف النون.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-group2',
        questionAr: 'أي حرف نجده في بداية كلمة "مَوْزٌ"؟',
        options: [
          { id: 'a', textAr: 'مَ', isCorrect: true, explanationAr: 'صحيح! مَوْزٌ يبدأ بحرف الميم.' },
          { id: 'b', textAr: 'نَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },

  // ==========================================
  // TRIMESTRE 2
  // ==========================================
  {
    id: 'arabic-1ap-t2-letters-group3',
    grade: '1AP',
    subject: 'arabic',
    trimester: 2,
    domainAr: 'الحروف والأصوات',
    sequenceAr: 'السلسلة 3: مجموعة الحروف (د - ذ - س - ش)',
    categoryAr: 'اللغة العربية - الحروف',
    titleAr: 'أَصْوَاتُ الحُرُوفِ: دَ - ذَ - سَ - شَ 🔤',
    summaryAr: 'يتعرف الطفل على أصوات وأشكال الحروف د، ذ، س، ش من خلال كلمات بسيطة مألوفة.',
    objectiveAr: 'التعرف على صوت وشكل الحروف د، ذ، س، ش في بداية كلمات بسيطة.',
    objectivesAr: [
      'أَسْمَعُ وَأُمَيِّزُ صوت كل حرف من هذه الحروف الأربعة.',
      'أُفَرِّقُ بين صوت الدال (د) والذال (ذ) المتشابهين.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ حرف مكتوباً.',
    ],
    discoveryAr: 'استمع: دُبٌّ 🐻، ذُبَابَةٌ 🪰، سَمَكَةٌ 🐟، شَمْسٌ ☀️ — ما الصوت الأول في كل كلمة؟',
    rulesAr: [
      'حرف الدَّالِ (د): صوته "دَ" مثل دُبٌّ 🐻.',
      'حرف الذَّالِ (ذ): صوته "ذَ" مثل ذُبَابَةٌ 🪰 (يشبه الدال لكن بصوت أخف مع طرف اللسان).',
      'حرف السِّينِ (س): صوته "سَ" مثل سَمَكَةٌ 🐟.',
      'حرف الشِّينِ (ش): صوته "شَ" مثل شَمْسٌ ☀️.',
    ],
    examplesAr: [
      { problem: 'ما هو الصوت الأول في كلمة "شَمْسٌ"؟', solution: 'شَ (الشين).' },
    ],
    detailedCourse: {
      introAr: 'نتعرف اليوم على 4 حروف جديدة: د، ذ، س، ش — بعضها متشابه في الشكل قليلاً، فلنكن منتبهين!',
      vocabulary: [
        { termAr: 'التَّمْيِيزُ الصَّوْتِيُّ', definitionAr: 'القدرة على تفريق صوت حرف عن آخر مشابه له.' },
      ],
      visualizationHintAr: 'ضع يدك على حلقك وأنت تنطق "د" ثم "ذ" لتشعر بالفرق البسيط بين الصوتين.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين صوت السين (س) والشين (ش).', correctionAr: 'ذكّر الطفل: الشين لها 3 نقاط فوقها، والسين ليس لها نقاط.' },
      ],
      takeawayAr: 'د = دُبٌّ. ذ = ذُبَابَةٌ. س = سَمَكَةٌ. ش = شَمْسٌ. انتبه للفرق بين الدال والذال، والسين والشين!',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-group3',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما الصوت الأول في كلمة "سَمَكَةٌ" 🐟؟',
        hintsAr: ['هذا الحرف ليس له نقاط.'],
        solutionAr: 'سَ',
        detailedCorrectionAr: 'أحسنت! سَمَكَةٌ تبدأ بحرف السين.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-group3',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي حرف نجده في بداية كلمة "شَمْسٌ" ☀️؟',
        hintsAr: ['له 3 نقاط فوقه.'],
        solutionAr: 'شَ',
        detailedCorrectionAr: 'ممتاز! شَمْسٌ تبدأ بحرف الشين.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-group3',
      type: 'association',
      titleAr: 'لعبة صيد الحروف والصور',
      instructionsAr: 'اربط كل صورة بالحرف الذي تبدأ به!',
      items: [
        { questionOrPromptAr: 'دُبٌّ 🐻', correctAnswerAr: 'دَ', optionsAr: ['دَ', 'ذَ', 'سَ'], explanationAr: 'دُبٌّ يبدأ بحرف الدال.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-group3',
        questionAr: 'أي حرف نجده في بداية كلمة "سَمَكَةٌ"؟',
        options: [
          { id: 'a', textAr: 'سَ', isCorrect: true, explanationAr: 'صحيح! سَمَكَةٌ تبدأ بحرف السين.' },
          { id: 'b', textAr: 'شَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },

  {
    id: 'arabic-1ap-t2-letters-group4',
    grade: '1AP',
    subject: 'arabic',
    trimester: 2,
    domainAr: 'الحروف والأصوات',
    sequenceAr: 'السلسلة 4: مجموعة الحروف (ع - غ - ف - ق)',
    categoryAr: 'اللغة العربية - الحروف',
    titleAr: 'أَصْوَاتُ الحُرُوفِ: عَ - غَ - فَ - قَ 🔤',
    summaryAr: 'يتعرف الطفل على أصوات وأشكال الحروف ع، غ، ف، ق من خلال كلمات بسيطة مألوفة.',
    objectiveAr: 'التعرف على صوت وشكل الحروف ع، غ، ف، ق في بداية كلمات بسيطة.',
    objectivesAr: [
      'أَسْمَعُ وَأُمَيِّزُ صوت كل حرف من هذه الحروف الأربعة.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ حرف مكتوباً.',
      'أَنْطِقُ كلمات بسيطة تبدأ بهذه الحروف.',
    ],
    discoveryAr: 'استمع: عِنَبٌ 🍇، غُرَابٌ 🐦‍⬛، فِيلٌ 🐘، قِطَّةٌ 🐱 — ما الصوت الأول في كل كلمة؟',
    rulesAr: [
      'حرف العَيْنِ (ع): صوته "عَ" مثل عِنَبٌ 🍇.',
      'حرف الغَيْنِ (غ): صوته "غَ" مثل غُرَابٌ.',
      'حرف الفَاءِ (ف): صوته "فَ" مثل فِيلٌ 🐘.',
      'حرف القَافِ (ق): صوته "قَ" مثل قِطَّةٌ 🐱.',
    ],
    examplesAr: [
      { problem: 'ما هو الصوت الأول في كلمة "فِيلٌ"؟', solution: 'فَ (الفاء).' },
    ],
    detailedCourse: {
      introAr: 'أربعة أصدقاء جدد اليوم: ع، غ، ف، ق. لنستمع جيداً لأصواتهم المميزة!',
      vocabulary: [
        { termAr: 'حُرُوفُ الحَلْقِ', definitionAr: 'حروف تخرج من الحلق مثل العين والغين.' },
      ],
      visualizationHintAr: 'استعمل صوراً كبيرة وملونة للحيوانات والفواكه، وكرر مع الطفل الصوت الأول لكل صورة.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين صوت العين (ع) والغين (غ).', correctionAr: 'ذكّر الطفل: الغين لها نقطة فوقها، والعين ليس لها نقطة.' },
      ],
      takeawayAr: 'ع = عِنَبٌ. غ = غُرَابٌ. ف = فِيلٌ. ق = قِطَّةٌ. أربعة أصدقاء جدد من الحروف!',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-group4',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما الصوت الأول في كلمة "قِطَّةٌ" 🐱؟',
        hintsAr: ['حيوان أليف نربيه في البيت.'],
        solutionAr: 'قَ',
        detailedCorrectionAr: 'أحسنت! قِطَّةٌ تبدأ بحرف القاف.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-group4',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي حرف نجده في بداية كلمة "فِيلٌ" 🐘؟',
        hintsAr: ['حيوان كبير له خرطوم طويل.'],
        solutionAr: 'فَ',
        detailedCorrectionAr: 'ممتاز! فِيلٌ يبدأ بحرف الفاء.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-group4',
      type: 'association',
      titleAr: 'لعبة صيد الحروف والصور',
      instructionsAr: 'اربط كل صورة بالحرف الذي تبدأ به!',
      items: [
        { questionOrPromptAr: 'عِنَبٌ 🍇', correctAnswerAr: 'عَ', optionsAr: ['عَ', 'غَ', 'قَ'], explanationAr: 'عِنَبٌ يبدأ بحرف العين.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-group4',
        questionAr: 'أي حرف نجده في بداية كلمة "قِطَّةٌ"؟',
        options: [
          { id: 'a', textAr: 'قَ', isCorrect: true, explanationAr: 'صحيح! قِطَّةٌ تبدأ بحرف القاف.' },
          { id: 'b', textAr: 'فَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },

  // ==========================================
  // TRIMESTRE 3
  // ==========================================
  {
    id: 'arabic-1ap-t3-letters-group5',
    grade: '1AP',
    subject: 'arabic',
    trimester: 3,
    domainAr: 'الحروف والأصوات',
    sequenceAr: 'السلسلة 5: مجموعة الحروف (ك - ه - و - ي)',
    categoryAr: 'اللغة العربية - الحروف',
    titleAr: 'أَصْوَاتُ الحُرُوفِ: كَ - هَ - وَ - يَ 🔤',
    summaryAr: 'يتعرف الطفل على أصوات وأشكال الحروف ك، ه، و، ي من خلال كلمات بسيطة مألوفة.',
    objectiveAr: 'التعرف على صوت وشكل الحروف ك، ه، و، ي في بداية كلمات بسيطة.',
    objectivesAr: [
      'أَسْمَعُ وَأُمَيِّزُ صوت كل حرف من هذه الحروف الأربعة.',
      'أَتَعَرَّفُ عَلَى شَكْلِ كُلِّ حرف مكتوباً.',
      'أَنْطِقُ كلمات بسيطة تبدأ بهذه الحروف.',
    ],
    discoveryAr: 'استمع: كِتَابٌ 📖، هِلَالٌ 🌙، وَرْدَةٌ 🌹، يَدٌ ✋ — ما الصوت الأول في كل كلمة؟',
    rulesAr: [
      'حرف الكَافِ (ك): صوته "كَ" مثل كِتَابٌ 📖.',
      'حرف الهَاءِ (ه): صوته "هَ" مثل هِلَالٌ 🌙.',
      'حرف الوَاوِ (و): صوته "وَ" مثل وَرْدَةٌ 🌹.',
      'حرف اليَاءِ (ي): صوته "يَ" مثل يَدٌ ✋.',
    ],
    examplesAr: [
      { problem: 'ما هو الصوت الأول في كلمة "وَرْدَةٌ"؟', solution: 'وَ (الواو).' },
    ],
    detailedCourse: {
      introAr: 'أربعة أصدقاء جدد: ك، ه، و، ي. بهذه المجموعة نكون قد تعرفنا على عدد جميل من حروف اللغة العربية!',
      vocabulary: [
        { termAr: 'حُرُوفُ العِلَّةِ', definitionAr: 'حروف مثل الواو والياء قد تُستعمل أيضاً كحروف مد.' },
      ],
      visualizationHintAr: 'اطلب من الطفل رسم يده ✋ وكتابة حرف الياء بجانبها، ورسم وردة 🌹 وكتابة الواو بجانبها.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين شكل الواو (و) والفاء (ف).', correctionAr: 'ذكّر الطفل: الفاء لها نقطة فوقها، والواو ليس لها نقطة.' },
      ],
      takeawayAr: 'ك = كِتَابٌ. ه = هِلَالٌ. و = وَرْدَةٌ. ي = يَدٌ. أربعة أصدقاء جدد من الحروف!',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-group5',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما الصوت الأول في كلمة "كِتَابٌ" 📖؟',
        hintsAr: ['نقرأ فيه القصص.'],
        solutionAr: 'كَ',
        detailedCorrectionAr: 'أحسنت! كِتَابٌ يبدأ بحرف الكاف.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-group5',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أي حرف نجده في بداية كلمة "يَدٌ" ✋؟',
        hintsAr: ['نستعملها للكتابة والمصافحة.'],
        solutionAr: 'يَ',
        detailedCorrectionAr: 'ممتاز! يَدٌ تبدأ بحرف الياء.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-group5',
      type: 'association',
      titleAr: 'لعبة صيد الحروف والصور',
      instructionsAr: 'اربط كل صورة بالحرف الذي تبدأ به!',
      items: [
        { questionOrPromptAr: 'هِلَالٌ 🌙', correctAnswerAr: 'هَ', optionsAr: ['هَ', 'كَ', 'وَ'], explanationAr: 'هِلَالٌ يبدأ بحرف الهاء.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-group5',
        questionAr: 'أي حرف نجده في بداية كلمة "وَرْدَةٌ"؟',
        options: [
          { id: 'a', textAr: 'وَ', isCorrect: true, explanationAr: 'صحيح! وَرْدَةٌ تبدأ بحرف الواو.' },
          { id: 'b', textAr: 'يَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },

  {
    id: 'arabic-1ap-t3-tracing-name',
    grade: '1AP',
    subject: 'arabic',
    trimester: 3,
    domainAr: 'الغرافيزم والكتابة',
    sequenceAr: 'السلسلة 6: أُتْقِنُ رَسْمَ الحُرُوفِ وَأَكْتُبُ اسْمِي',
    categoryAr: 'اللغة العربية - الغرافيزم',
    titleAr: 'أُتْقِنُ رَسْمَ الحُرُوفِ وَأَكْتُبُ اسْمِي ✍️',
    summaryAr: 'يتدرب الطفل على الحركات الأساسية للكتابة (خطوط، دوائر، منحنيات) ثم يحاول كتابة الحروف الأولى من اسمه.',
    objectiveAr: 'إتقان الحركات الأساسية للكتابة (خط مستقيم، دائرة، منحنى) والتدرب على كتابة اسمه.',
    objectivesAr: [
      'أَرْسُمُ خُطُوطاً مستقيمة ومنحنية بيدي بثبات.',
      'أَتَدَرَّبُ عَلَى كِتَابَةِ الحُرُوفِ التي تعلمتها هذه السنة.',
      'أُحَاوِلُ كِتَابَةَ الحَرْفِ الأَوَّلِ مِنِ اسْمِي.',
    ],
    discoveryAr: 'أمسك قلمك جيداً وارسم خطاً مستقيماً من الأعلى إلى الأسفل. هل استطعت؟',
    rulesAr: [
      'أُمْسِكُ القَلَمَ بِثَلَاثَةِ أَصَابِعَ (الإبهام، السبابة، الوسطى) لأكتب بثبات.',
      'أَتَدَرَّبُ على رسم خطوط مستقيمة، ثم دوائر، ثم منحنيات — قبل رسم الحروف الحقيقية.',
      'أَكْتُبُ الحُرُوفَ مِنَ اليَمِينِ إِلَى اليَسَارِ (اتجاه الكتابة العربية).',
    ],
    examplesAr: [
      { problem: 'ارسم دائرة ثم ضع نقطة فوقها. أي حرف يشبه هذا الرسم؟', solution: 'حرف الباء (ب) — دائرة صغيرة (السن) مع نقطة تحتها أو فوقها حسب الحرف.' },
    ],
    detailedCourse: {
      introAr: 'قبل أن نكتب الحروف بشكل جميل، يجب أن تتدرب يدنا على حركات بسيطة: خطوط، دوائر، ومنحنيات.',
      vocabulary: [
        { termAr: 'الغِرَافِيزْمُ ✍️', definitionAr: 'التدرب على حركات اليد الأساسية قبل الكتابة الحقيقية.' },
      ],
      visualizationHintAr: 'دع الطفل يتدرب بإصبعه في الرمل أو الدقيق قبل استعمال القلم، فهذا يقوي عضلات يده بطريقة ممتعة.',
      commonMistakes: [
        { mistakeAr: 'إمساك القلم بقبضة كاملة بدل الأصابع الثلاثة.', correctionAr: 'صحح وضعية إمساك القلم مبكراً لتجنب تعب اليد لاحقاً.' },
      ],
      takeawayAr: 'أتدرب على الخطوط والدوائر والمنحنيات قبل الحروف، وأمسك القلم بثلاثة أصابع، وأكتب من اليمين لليسار.',
    },
    interactiveTool: 'arabic_canvas',
    progressiveExercises: [
      {
        id: 'ex1-ar1ap-tracing',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'بكم إصبعاً يجب أن أمسك القلم؟',
        hintsAr: ['ليس كل الأصابع، فقط بعضها.'],
        solutionAr: '3 (ثَلَاثَةُ أَصَابِعَ)',
        detailedCorrectionAr: 'أحسنت! الإبهام والسبابة والوسطى.',
        xpReward: 10,
      },
      {
        id: 'ex2-ar1ap-tracing',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'في أي اتجاه نكتب الحروف العربية؟',
        hintsAr: ['عكس اتجاه كتابة الأرقام.'],
        solutionAr: 'مِنَ اليَمِينِ إِلَى اليَسَارِ',
        detailedCorrectionAr: 'ممتاز! اللغة العربية تُكتب من اليمين إلى اليسار.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-ar1ap-tracing',
      type: 'quiz_flash',
      titleAr: 'لعبة يد الفنان الصغير',
      instructionsAr: 'اختر الحركة الصحيحة لكل رسم!',
      items: [
        { questionOrPromptAr: 'رسم مستدير بلا زوايا ⭕', correctAnswerAr: 'دَائِرَةٌ', optionsAr: ['دَائِرَةٌ', 'خَطٌّ مُسْتَقِيمٌ'], explanationAr: 'الشكل المستدير هو دائرة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-ar1ap-tracing',
        questionAr: 'كيف يجب أن أمسك القلم لأكتب بشكل جميل؟',
        options: [
          { id: 'a', textAr: 'بثلاثة أصابع بثبات', isCorrect: true, explanationAr: 'صحيح! هذا يساعد على كتابة واضحة ومريحة.' },
          { id: 'b', textAr: 'بقبضة اليد كاملة', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ARABIC,
  },
];
