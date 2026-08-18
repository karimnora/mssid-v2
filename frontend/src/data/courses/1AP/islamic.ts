import { CourseLesson } from '../../../types';

const SOURCE_NOTE_1AP_ISLAMIC =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة التمهيدي/السنة الأولى ابتدائي، مبسّط جداً وبصري (سورة الفاتحة، سور قصيرة جداً، آداب بسيطة) — بدون امتحانات فصلية رسمية في هذا المستوى، وليس نسخة حرفية عن وثيقة رسمية، والمعاني القرآنية مبسّطة للطفل ولا تُغني عن الرجوع للتفسير المعتمد.';

export const ISLAMIC_1AP: CourseLesson[] = [
  // ==========================================
  // TRIMESTRE 1
  // ==========================================
  {
    id: 'islamic-1ap-t1-fatiha-basmala',
    grade: '1AP',
    subject: 'islamic',
    trimester: 1,
    domainAr: 'القرآن الكريم',
    sequenceAr: 'السلسلة 1: سورة الفاتحة، البسملة والحمدلة',
    categoryAr: 'التربية الإسلامية - القرآن الكريم',
    titleAr: 'سُورَةُ الفَاتِحَةِ، البَسْمَلَةُ وَالحَمْدَلَةُ 🤲',
    summaryAr: 'يحفظ الطفل سورة الفاتحة، ويتعود قول "بِسْمِ اللهِ" عند بدء كل عمل و"الحَمْدُ لِلَّهِ" عند انتهائه.',
    objectiveAr: 'حفظ سورة الفاتحة وترديدها، واعتياد ذكر الله في الحياة اليومية.',
    objectivesAr: [
      'أَحْفَظُ سُورَةَ الفَاتِحَةِ وَأُرَدِّدُهَا.',
      'أَقُولُ "بِسْمِ اللهِ" قَبْلَ كُلِّ عَمَلٍ.',
      'أَقُولُ "الحَمْدُ لِلَّهِ" بَعْدَ الانْتِهَاءِ مِنَ العَمَلِ.',
    ],
    discoveryAr: 'ماذا نقول قبل أن نبدأ الأكل؟ 🍽️',
    rulesAr: [
      'سُورَةُ الفَاتِحَةِ هي أول سورة في القرآن، ونقرؤها في كل صلاة.',
      'البَسْمَلَةُ: أقول "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ" عند بداية أي عمل.',
      'الحَمْدَلَةُ: أقول "الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ" شكراً لله بعد الانتهاء.',
    ],
    examplesAr: [
      { problem: 'ماذا نقول قبل الأكل؟', solution: 'بِسْمِ اللهِ.' },
    ],
    detailedCourse: {
      introAr: 'سورة الفاتحة أول سورة نحفظها، ونقرؤها في كل صلاة. وقول "بسم الله" و"الحمد لله" عادة جميلة نتعود عليها كل يوم.',
      vocabulary: [
        { termAr: 'البَسْمَلَةُ 🤲', definitionAr: 'قول "بسم الله الرحمن الرحيم" قبل بدء أي عمل.' },
      ],
      visualizationHintAr: 'استمع مع الطفل لتلاوة قصيرة لسورة الفاتحة وردد معه آية آية ببطء.',
      commonMistakes: [
        { mistakeAr: 'نسيان قول البسملة عند بدء الأكل أو أي عمل.', correctionAr: 'ذكّر الطفل بلطف حتى تصبح البسملة عادة يومية تلقائية.' },
      ],
      takeawayAr: 'أحفظ سورة الفاتحة، وأقول "بسم الله" قبل كل عمل، و"الحمد لله" بعد الانتهاء منه.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'استكشف آيات سورة الفاتحة',
      introAr: 'اضغط على كل آية لتسمع معناها البسيط.',
      verses: [
        { surahAr: 'سُورَةُ الفَاتِحَةِ', verseAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', meaningAr: 'نبدأ باسم الله الرحمن الرحيم.' },
        { surahAr: 'سُورَةُ الفَاتِحَةِ', verseAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', meaningAr: 'الشكر والثناء لله رب كل المخلوقات.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-fatiha',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ماذا نقول قبل بدء الأكل؟',
        hintsAr: ['تبدأ بكلمة "بِسْمِ"...'],
        solutionAr: 'بِسْمِ اللهِ',
        detailedCorrectionAr: 'أحسنت! نقول البسملة قبل كل عمل.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-fatiha',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما هي أول سورة في المصحف؟',
        hintsAr: ['نقرؤها في كل صلاة.'],
        solutionAr: 'سُورَةُ الفَاتِحَةِ',
        detailedCorrectionAr: 'ممتاز! سورة الفاتحة هي أول سورة.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-fatiha',
      type: 'quiz_flash',
      titleAr: 'لعبة البسملة والحمدلة',
      instructionsAr: 'اختر الجواب الصحيح!',
      items: [
        { questionOrPromptAr: 'بعد الانتهاء من الأكل نقول:', correctAnswerAr: 'الحَمْدُ لِلَّهِ', optionsAr: ['الحَمْدُ لِلَّهِ', 'بِسْمِ اللهِ'], explanationAr: 'نحمد الله بعد الانتهاء.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-fatiha',
        questionAr: 'ماذا نقول عند بداية أي عمل؟',
        options: [
          { id: 'a', textAr: 'بِسْمِ اللهِ', isCorrect: true, explanationAr: 'صحيح! نبدأ أعمالنا بالبسملة.' },
          { id: 'b', textAr: 'مَعَ السَّلَامَةِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ISLAMIC,
  },

  // ==========================================
  // TRIMESTRE 2
  // ==========================================
  {
    id: 'islamic-1ap-t2-short-surahs-ikhlas-nas',
    grade: '1AP',
    subject: 'islamic',
    trimester: 2,
    domainAr: 'القرآن الكريم',
    sequenceAr: 'السلسلة 2: سورتا الإخلاص والناس',
    categoryAr: 'التربية الإسلامية - القرآن الكريم',
    titleAr: 'أَحْفَظُ سُورَتَيِ الإِخْلَاصِ وَالنَّاسِ 📖',
    summaryAr: 'يحفظ الطفل سورتي الإخلاص والناس، مع فهم بسيط جداً لفكرتهما (الله واحد، ونطلب حمايته).',
    objectiveAr: 'حفظ وترديد سورتي الإخلاص والناس بشكل صحيح.',
    objectivesAr: [
      'أَحْفَظُ سُورَةَ الإِخْلَاصِ كَامِلَةً.',
      'أَحْفَظُ سُورَةَ النَّاسِ كَامِلَةً.',
      'أَفْهَمُ أَنَّ اللهَ وَاحِدٌ وَيَحْمِينَا.',
    ],
    discoveryAr: 'من يحمينا من كل شيء يخيفنا؟',
    rulesAr: [
      'سُورَةُ الإِخْلَاصِ: تُخبرنا أن الله واحد لا شريك له.',
      'سُورَةُ النَّاسِ: نطلب فيها من الله أن يحمينا من كل شر.',
      'نقول "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ" قبل قراءة أي سورة.',
    ],
    examplesAr: [
      { problem: 'أي سورة تخبرنا أن الله واحد؟', solution: 'سُورَةُ الإِخْلَاصِ.' },
    ],
    detailedCourse: {
      introAr: 'سورتان قصيرتان جداً وجميلتان: الإخلاص تُخبرنا عن الله الواحد، والناس نطلب فيها حمايته لنا.',
      vocabulary: [
        { termAr: 'الحِمَايَةُ 🛡️', definitionAr: 'أن يحفظنا الله من كل شيء يؤذينا.' },
      ],
      visualizationHintAr: 'استمع مع الطفل لتلاوة قصيرة لكل سورة، وكرر معه جملة جملة ببطء وبصوت هادئ.',
      commonMistakes: [
        { mistakeAr: 'نسيان البسملة قبل قراءة السورة.', correctionAr: 'ذكّر الطفل دائماً بالبدء بـ"بسم الله" قبل كل سورة.' },
      ],
      takeawayAr: 'سورة الإخلاص: الله واحد. سورة الناس: نطلب حماية الله من كل شر.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'مستكشف السور القصيرة',
      introAr: 'استمع وردد معي هاتين السورتين الجميلتين.',
      verses: [
        { surahAr: 'سُورَةُ الإِخْلَاصِ', verseAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ', meaningAr: 'الله واحد أحد لا شريك له.' },
        { surahAr: 'سُورَةُ النَّاسِ', verseAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', meaningAr: 'نطلب من الله أن يحمينا نحن البشر.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-shortsurahs',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'أي سورة نطلب فيها حماية الله؟',
        hintsAr: ['اسمها يدل على البشر.'],
        solutionAr: 'سُورَةُ النَّاسِ',
        detailedCorrectionAr: 'أحسنت! سورة الناس نطلب فيها الحماية.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-shortsurahs',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ماذا تخبرنا سورة الإخلاص عن الله؟',
        hintsAr: ['عدد كم إله يوجد؟'],
        solutionAr: 'أَنَّ اللهَ وَاحِدٌ',
        detailedCorrectionAr: 'ممتاز! الله واحد أحد لا شريك له.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-shortsurahs',
      type: 'memory',
      titleAr: 'لعبة حفظ السور القصيرة',
      instructionsAr: 'اربط كل سورة بمعناها البسيط!',
      items: [
        { questionOrPromptAr: 'سُورَةُ الإِخْلَاصِ', correctAnswerAr: 'اللهُ وَاحِدٌ', optionsAr: ['اللهُ وَاحِدٌ', 'الحِمَايَةُ'], explanationAr: 'الإخلاص تخبرنا بوحدانية الله.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-shortsurahs',
        questionAr: 'ماذا نطلب من الله في سورة الناس؟',
        options: [
          { id: 'a', textAr: 'الحِمَايَةَ مِنْ كُلِّ شَرٍّ', isCorrect: true, explanationAr: 'صحيح! نطلب حماية الله من كل شر.' },
          { id: 'b', textAr: 'المَالَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ISLAMIC,
  },

  // ==========================================
  // TRIMESTRE 3
  // ==========================================
  {
    id: 'islamic-1ap-t3-thanks-manners',
    grade: '1AP',
    subject: 'islamic',
    trimester: 3,
    domainAr: 'العبادات والأخلاق',
    sequenceAr: 'السلسلة 3: الشكر والاستئذان',
    categoryAr: 'التربية الإسلامية - الأخلاق',
    titleAr: 'أَتَعَلَّمُ الشُّكْرَ وَالاسْتِئْذَانَ 🙏',
    summaryAr: 'يتعلم الطفل قول "شكراً" عند تلقي معروف، و"من فضلك" عند طلب شيء، والاستئذان قبل دخول الغرفة.',
    objectiveAr: 'اكتساب عادات الشكر والاستئذان البسيطة في التعامل اليومي.',
    objectivesAr: [
      'أَقُولُ "شُكْراً" عِنْدَمَا يُقَدِّمُ لِيَ أَحَدٌ مَعْرُوفاً.',
      'أَقُولُ "مِنْ فَضْلِكَ" عِنْدَمَا أَطْلُبُ شَيْئاً.',
      'أَسْتَأْذِنُ قَبْلَ دُخُولِ غُرْفَةِ أَحَدٍ.',
    ],
    discoveryAr: 'أعطاك صديقك قلماً. ماذا تقول له؟',
    rulesAr: [
      'الشُّكْرُ: أقول "شُكْراً" أو "جَزَاكَ اللهُ خَيْراً" لمن أحسن إليّ.',
      'الاسْتِئْذَانُ: أقول "السَّلَامُ عَلَيْكُمْ، هَلْ يُمْكِنُنِي الدُّخُولُ؟" قبل دخول غرفة مغلقة.',
      'الأَدَبُ فِي الطَّلَبِ: أقول "مِنْ فَضْلِكَ" عندما أطلب شيئاً من أحد.',
    ],
    examplesAr: [
      { problem: 'تريد الدخول إلى غرفة والدتك وهي مغلقة الباب. ماذا تفعل؟', solution: 'أَطْرُقُ البَابَ وَأَسْتَأْذِنُ قَبْلَ الدُّخُولِ.' },
    ],
    detailedCourse: {
      introAr: 'ديننا الجميل علّمنا عادات صغيرة تجعلنا محبوبين: الشكر عند تلقي معروف، والاستئذان قبل الدخول.',
      vocabulary: [
        { termAr: 'الاسْتِئْذَانُ 🚪', definitionAr: 'طلب الإذن قبل دخول مكان أو أخذ شيء.' },
      ],
      visualizationHintAr: 'العب مع الطفل مسرحية قصيرة: يطرق الباب، يقول السلام، وينتظر الإذن قبل الدخول.',
      commonMistakes: [
        { mistakeAr: 'الدخول إلى الغرف دون طرق الباب أو الاستئذان.', correctionAr: 'درّب الطفل يومياً على طرق الباب والاستئذان قبل الدخول، حتى تصبح عادة تلقائية.' },
      ],
      takeawayAr: 'أقول "شكراً" عند تلقي معروف، و"من فضلك" عند الطلب، وأستأذن قبل دخول أي غرفة.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'concept_cards',
      titleAr: 'بطاقات الأدب الجميل',
      introAr: 'اكتشف العادات الجميلة التي يحثّنا عليها ديننا.',
      concepts: [
        { nameAr: 'الشُّكْرُ', descAr: 'أقول "شكراً" لمن يقدم لي معروفاً.' },
        { nameAr: 'الاسْتِئْذَانُ', descAr: 'أطرق الباب وأستأذن قبل الدخول.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-manners',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'أعطاك جارك حلوى. ماذا تقول له؟',
        hintsAr: ['كلمة نقولها عند تلقي معروف.'],
        solutionAr: 'شُكْراً',
        detailedCorrectionAr: 'أحسنت! نقول شكراً لمن أحسن إلينا.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-manners',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'تريد دخول غرفة أختك. ماذا تفعل قبل الدخول؟',
        hintsAr: ['فعل نقوم به على الباب.'],
        solutionAr: 'أَطْرُقُ البَابَ وَأَسْتَأْذِنُ',
        detailedCorrectionAr: 'ممتاز! الاستئذان قبل الدخول أدب جميل.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-manners',
      type: 'quiz_flash',
      titleAr: 'لعبة الطفل المؤدب',
      instructionsAr: 'اختر التصرف المؤدب الصحيح!',
      items: [
        { questionOrPromptAr: 'تريد قلم أخيك', correctAnswerAr: 'أَقُولُ: مِنْ فَضْلِكَ', optionsAr: ['أَقُولُ: مِنْ فَضْلِكَ', 'آخُذُهُ بِدُونِ كَلَامٍ'], explanationAr: 'الأدب يقتضي طلب الأشياء بلطف.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-manners',
        questionAr: 'ماذا أقول قبل دخول غرفة مغلقة؟',
        options: [
          { id: 'a', textAr: 'أَسْتَأْذِنُ وَأَطْرُقُ البَابَ', isCorrect: true, explanationAr: 'صحيح! الاستئذان أدب إسلامي جميل.' },
          { id: 'b', textAr: 'أَدْخُلُ مُبَاشَرَةً', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ISLAMIC,
  },
];
