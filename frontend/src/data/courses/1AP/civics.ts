import { CourseLesson } from '../../../types';

const SOURCE_NOTE_1AP_CIVICS =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة التمهيدي/السنة الأولى ابتدائي، مبسّط جداً وبصري (التحية، المشاركة، قواعد القسم) — بدون امتحانات فصلية رسمية في هذا المستوى، وليس نسخة حرفية عن وثيقة رسمية.';

export const CIVICS_1AP: CourseLesson[] = [
  // ==========================================
  // TRIMESTRE 1
  // ==========================================
  {
    id: 'civics-1ap-t1-greetings-respect',
    grade: '1AP',
    subject: 'civics',
    trimester: 1,
    domainAr: 'الحياة اليومية والقيم',
    sequenceAr: 'السلسلة 1: التحية واحترام الكبار',
    categoryAr: 'التربية المدنية',
    titleAr: 'أُلْقِي التَّحِيَّةَ وَأَحْتَرِمُ الكِبَارَ 👋',
    summaryAr: 'يتعلم الطفل إلقاء السلام والرد عليه، والتأدب مع المعلم والوالدين والكبار.',
    objectiveAr: 'إتقان إلقاء التحية والرد عليها، والتحلي بالأدب مع الكبار.',
    objectivesAr: [
      'أُلْقِي السَّلَامَ عِنْدَ لِقَاءِ أَحَدٍ.',
      'أَرُدُّ السَّلَامَ عِنْدَمَا يُحَيِّينِي أَحَدٌ.',
      'أَسْتَمِعُ لِلْكِبَارِ بِأَدَبٍ.',
    ],
    discoveryAr: 'دخل معلمك إلى القسم صباحاً. ماذا تقول له؟',
    rulesAr: [
      'التَّحِيَّةُ: أقول "السَّلَامُ عَلَيْكُمْ" عند لقاء أحد.',
      'الرَّدُّ: أقول "وَعَلَيْكُمُ السَّلَامُ" عندما يحييني أحد.',
      'احترام الكبير: أستمع لأبي وأمي ومعلمي، ولا أرفع صوتي عليهم.',
    ],
    examplesAr: [
      { problem: 'إذا قال لك صديقك "السلام عليكم"، بم تردّ؟', solution: 'وَعَلَيْكُمُ السَّلَامُ.' },
    ],
    detailedCourse: {
      introAr: 'التحية أول باب نفتح به المحبة مع الآخرين. نتعلم اليوم كيف نلقي السلام ونردّ عليه بابتسامة.',
      vocabulary: [
        { termAr: 'التَّحِيَّةُ 👋', definitionAr: 'كلمة لطيفة نقولها عند لقاء أحد.' },
      ],
      visualizationHintAr: 'العب مع الطفل مسرحية قصيرة: يلتقي صديقان، يتصافحان ويتبادلان السلام بابتسامة.',
      commonMistakes: [
        { mistakeAr: 'الرد على السلام بصوت غير واضح.', correctionAr: 'شجع الطفل على الرد بوضوح وابتسامة.' },
      ],
      takeawayAr: 'أُلقي السلام: "السلام عليكم". أرد السلام: "وعليكم السلام". وأحترم الكبار وأستمع لهم بأدب.',
    },
    interactiveTool: 'civics_lab',
    civicsInteractive: {
      type: 'civic_scenario',
      titleAr: 'مواقف التحية والأدب',
      introAr: 'اختر التصرف المؤدب الصحيح في كل موقف!',
      scenarios: [
        {
          id: 'sc1-civics1ap-t1',
          titleAr: 'دخول المعلم إلى القسم',
          situationAr: 'دخل معلمك إلى القسم صباحاً. ماذا تفعل؟',
          choices: [
            { textAr: 'أُلقي السلام بابتسامة', isCorrect: true, feedbackAr: 'أحسنت! هذا يُظهر أدبك واحترامك.' },
            { textAr: 'أستمر في اللعب دون الالتفات', isCorrect: false, feedbackAr: 'من الأدب أن نحيي معلمنا عند دخوله.' },
          ],
        },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-civics1ap-greetings',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ماذا نقول عند لقاء صديق؟',
        hintsAr: ['كلمة السلام الإسلامية.'],
        solutionAr: 'السَّلَامُ عَلَيْكُمْ',
        detailedCorrectionAr: 'أحسنت! هذه تحيتنا الجميلة.',
        xpReward: 10,
      },
      {
        id: 'ex2-civics1ap-greetings',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'كيف نتصرف عندما يتحدث إلينا الجد أو المعلم؟',
        hintsAr: ['هل نصرخ أم نستمع بهدوء؟'],
        solutionAr: 'نَسْتَمِعُ بِأَدَبٍ وَهُدُوءٍ',
        detailedCorrectionAr: 'ممتاز! احترام الكبار من الآداب الجميلة.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-civics1ap-greetings',
      type: 'quiz_flash',
      titleAr: 'لعبة التحية اللطيفة',
      instructionsAr: 'اختر الرد الصحيح على التحية!',
      items: [
        { questionOrPromptAr: 'صديقك قال: "السلام عليكم"', correctAnswerAr: 'وَعَلَيْكُمُ السَّلَامُ', optionsAr: ['وَعَلَيْكُمُ السَّلَامُ', 'مَعَ السَّلَامَةِ'], explanationAr: 'هذا هو الرد الصحيح على السلام.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-civics1ap-greetings',
        questionAr: 'ماذا نقول عند لقاء شخص نعرفه؟',
        options: [
          { id: 'a', textAr: 'السَّلَامُ عَلَيْكُمْ', isCorrect: true, explanationAr: 'صحيح! هذه تحيتنا الجميلة.' },
          { id: 'b', textAr: 'لا شيء', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_CIVICS,
  },

  // ==========================================
  // TRIMESTRE 2
  // ==========================================
  {
    id: 'civics-1ap-t2-sharing-cooperation',
    grade: '1AP',
    subject: 'civics',
    trimester: 2,
    domainAr: 'الحياة الجماعية',
    sequenceAr: 'السلسلة 2: المشاركة والتعاون',
    categoryAr: 'التربية المدنية',
    titleAr: 'أُشَارِكُ وَأَتَعَاوَنُ مَعَ رِفَاقِي 🤝',
    summaryAr: 'يتعلم الطفل قيمة مشاركة ألعابه وأدواته مع رفاقه، والتعاون معهم في الأنشطة الجماعية.',
    objectiveAr: 'اكتساب سلوك المشاركة والتعاون مع الرفاق في اللعب والأنشطة.',
    objectivesAr: [
      'أُشَارِكُ أَلْعَابِي وَأَدَوَاتِي مَعَ رِفَاقِي.',
      'أَتَعَاوَنُ مَعَ رِفَاقِي فِي الأَلْعَابِ الجَمَاعِيَّةِ.',
      'أُسَاعِدُ زَمِيلِي عِنْدَمَا يَحْتَاجُ مُسَاعَدَتِي.',
    ],
    discoveryAr: 'عندك لعبة واحدة فقط، وصديقك يريد اللعب معك. ماذا تفعل؟',
    rulesAr: [
      'المُشَارَكَةُ: أُشارك ألعابي وأقلامي مع رفاقي بسرور.',
      'التَّعَاوُنُ: نعمل معاً في اللعبة الجماعية حتى ننجح جميعاً.',
      'المُسَاعَدَةُ: أُساعد زميلي إذا سقط منه شيء أو احتاج مساعدة.',
    ],
    examplesAr: [
      { problem: 'زميلك نسي قلمه في البيت. ماذا تفعل؟', solution: 'أُشَارِكُهُ قَلَمِي.' },
    ],
    detailedCourse: {
      introAr: 'الحياة أجمل عندما نشارك ونتعاون مع أصدقائنا! تعلم اليوم كيف تكون صديقاً جميلاً يحب المشاركة.',
      vocabulary: [
        { termAr: 'المُشَارَكَةُ 🤝', definitionAr: 'أن أعطي جزءاً من أشيائي لرفاقي ليستفيدوا معي.' },
      ],
      visualizationHintAr: 'العب مع الطفل لعبة جماعية بسيطة تتطلب التناوب والمشاركة، وامدحه كلما شارك بلطف.',
      commonMistakes: [
        { mistakeAr: 'رفض مشاركة الألعاب مع الرفاق دائماً.', correctionAr: 'اشرح للطفل أن المشاركة تجعل اللعب أكثر متعة للجميع، بما فيه هو.' },
      ],
      takeawayAr: 'أُشارك ألعابي وأدواتي مع رفاقي، وأتعاون معهم، وأساعد من يحتاج مساعدتي.',
    },
    interactiveTool: 'civics_lab',
    civicsInteractive: {
      type: 'civic_scenario',
      titleAr: 'مواقف المشاركة والتعاون',
      introAr: 'اختر التصرف الصحيح في كل موقف!',
      scenarios: [
        {
          id: 'sc1-civics1ap-t2',
          titleAr: 'لعبة واحدة',
          situationAr: 'عندك لعبة واحدة فقط، وصديقك يريد اللعب معك. ماذا تفعل؟',
          choices: [
            { textAr: 'نتناوب على اللعب معاً', isCorrect: true, feedbackAr: 'أحسنت! التناوب طريقة جميلة للمشاركة.' },
            { textAr: 'أرفض وألعب وحدي', isCorrect: false, feedbackAr: 'المشاركة تجعل اللعب أكثر متعة للجميع.' },
          ],
        },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-civics1ap-sharing',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'زميلك سقط منه قلمه. ماذا تفعل؟',
        hintsAr: ['فكر في المساعدة اللطيفة.'],
        solutionAr: 'أُسَاعِدُهُ فِي الْتِقَاطِ قَلَمِهِ',
        detailedCorrectionAr: 'أحسنت! مساعدة الآخرين خُلق جميل.',
        xpReward: 10,
      },
      {
        id: 'ex2-civics1ap-sharing',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما الشيء الجميل الذي نفعله عندما نلعب في مجموعة؟',
        hintsAr: ['كلمة تبدأ بحرف التاء.'],
        solutionAr: 'التَّعَاوُنُ',
        detailedCorrectionAr: 'ممتاز! التعاون يجعلنا ننجح معاً.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-civics1ap-sharing',
      type: 'quiz_flash',
      titleAr: 'لعبة الصديق الكريم',
      instructionsAr: 'اختر التصرف الصحيح في كل موقف!',
      items: [
        { questionOrPromptAr: 'عندك حلوى واحدة وصديقك بجانبك', correctAnswerAr: 'أُقَاسِمُهُ إِيَّاهَا', optionsAr: ['أُقَاسِمُهُ إِيَّاهَا', 'آكُلُهَا وَحْدِي'], explanationAr: 'المشاركة تجعلنا أصدقاء أفضل.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-civics1ap-sharing',
        questionAr: 'ماذا نفعل عندما يحتاج زميلنا للمساعدة؟',
        options: [
          { id: 'a', textAr: 'نُسَاعِدُهُ بِسُرُورٍ', isCorrect: true, explanationAr: 'صحيح! مساعدة الآخرين خُلق جميل.' },
          { id: 'b', textAr: 'نتجاهله', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_CIVICS,
  },

  // ==========================================
  // TRIMESTRE 3
  // ==========================================
  {
    id: 'civics-1ap-t3-classroom-rules',
    grade: '1AP',
    subject: 'civics',
    trimester: 3,
    domainAr: 'الحياة الجماعية',
    sequenceAr: 'السلسلة 3: قواعد القسم البسيطة',
    categoryAr: 'التربية المدنية',
    titleAr: 'قَوَاعِدُ قِسْمِي البَسِيطَةُ 🏫',
    summaryAr: 'يتعلم الطفل قواعد بسيطة جداً للعيش في القسم بهدوء ونظام: الهدوء أثناء الشرح، ترتيب الأدوات، واحترام الدور.',
    objectiveAr: 'تطبيق قواعد بسيطة للحياة الجماعية داخل القسم: الهدوء، الترتيب، احترام الدور.',
    objectivesAr: [
      'أَبْقَى هَادِئاً عِنْدَمَا يَشْرَحُ المُعَلِّمُ.',
      'أُرَتِّبُ أَدَوَاتِي فِي مِحْفَظَتِي بَعْدَ الاسْتِعْمَالِ.',
      'أَحْتَرِمُ دَوْرِي وَأَنْتَظِرُ دَوْرَ رِفَاقِي.',
    ],
    discoveryAr: 'إذا تحدث كل تلاميذ القسم في نفس الوقت، هل نستطيع سماع المعلم؟',
    rulesAr: [
      'الهُدُوءُ: أبقى هادئاً وأنصت عندما يشرح المعلم.',
      'التَّرْتِيبُ: أُرتب أدواتي (قلمي، كراسي) في محفظتي بعد الاستعمال.',
      'احْتِرَامُ الدَّوْرِ: أنتظر دوري في الطابور أو عند اللعب دون مزاحمة.',
    ],
    examplesAr: [
      { problem: 'انتهيت من استعمال ألوانك. ماذا تفعل بها؟', solution: 'أُرَتِّبُهَا فِي مِحْفَظَتِي.' },
    ],
    detailedCourse: {
      introAr: 'القسم بيتنا الصغير الذي نتعلم فيه معاً. لكي نكون سعداء فيه، نتبع قواعد بسيطة جداً: الهدوء، الترتيب، واحترام الدور.',
      vocabulary: [
        { termAr: 'الدَّوْرُ 🔢', definitionAr: 'ننتظر كل واحد بدوره دون مزاحمة الآخرين.' },
      ],
      visualizationHintAr: 'العب مع الطفل لعبة "الطابور المرح": يقف الجميع في صف وينتظر كل واحد دوره للحصول على شيء.',
      commonMistakes: [
        { mistakeAr: 'مزاحمة الرفاق لأخذ الدور قبل الآخرين.', correctionAr: 'ذكّر الطفل أن انتظار الدور يجعل الجميع سعداء ومرتاحين.' },
      ],
      takeawayAr: 'أبقى هادئاً عند الشرح، أُرتب أدواتي بعد الاستعمال، وأحترم دوري وأنتظر دور رفاقي.',
    },
    interactiveTool: 'civics_lab',
    civicsInteractive: {
      type: 'civic_scenario',
      titleAr: 'مواقف قواعد القسم',
      introAr: 'اختر التصرف الصحيح في كل موقف من مواقف القسم!',
      scenarios: [
        {
          id: 'sc1-civics1ap-t3',
          titleAr: 'وقت الشرح',
          situationAr: 'المعلم يشرح الدرس. ماذا تفعل؟',
          choices: [
            { textAr: 'أبقى هادئاً وأستمع', isCorrect: true, feedbackAr: 'أحسنت! الهدوء يساعدنا على الفهم.' },
            { textAr: 'أتحدث مع زميلي', isCorrect: false, feedbackAr: 'الحديث أثناء الشرح يزعج الجميع ويمنعنا من الفهم.' },
          ],
        },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-civics1ap-rules',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ماذا نفعل عندما يشرح المعلم الدرس؟',
        hintsAr: ['فكر في السكوت والإنصات.'],
        solutionAr: 'نَبْقَى هَادِئِينَ وَنَسْتَمِعُ',
        detailedCorrectionAr: 'أحسنت! الهدوء يساعدنا على فهم الدرس.',
        xpReward: 10,
      },
      {
        id: 'ex2-civics1ap-rules',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'انتهيت من الرسم بالألوان. ماذا تفعل بها؟',
        hintsAr: ['فكر في الترتيب.'],
        solutionAr: 'أُرَتِّبُهَا فِي مَكَانِهَا',
        detailedCorrectionAr: 'ممتاز! الترتيب يجعل القسم منظماً وجميلاً.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-civics1ap-rules',
      type: 'quiz_flash',
      titleAr: 'لعبة تلميذ القسم المثالي',
      instructionsAr: 'اختر التصرف الصحيح في كل موقف من مواقف القسم!',
      items: [
        { questionOrPromptAr: 'تريد الشرب من الماء وهناك طابور', correctAnswerAr: 'أَنْتَظِرُ دَوْرِي', optionsAr: ['أَنْتَظِرُ دَوْرِي', 'أَتَجَاوَزُ الأَطْفَالَ'], explanationAr: 'احترام الدور قاعدة مهمة للعيش معاً.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-civics1ap-rules',
        questionAr: 'ماذا نفعل عندما ننتظر دورنا في الطابور؟',
        options: [
          { id: 'a', textAr: 'نَنْتَظِرُ بِهُدُوءٍ دُونَ مُزَاحَمَةٍ', isCorrect: true, explanationAr: 'صحيح! هذا يُظهر احترامنا لرفاقنا.' },
          { id: 'b', textAr: 'نَتَجَاوَزُ الآخَرِينَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_CIVICS,
  },
];
