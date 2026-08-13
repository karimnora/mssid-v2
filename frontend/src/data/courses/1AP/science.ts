import { CourseLesson } from '../../../types';

const SOURCE_NOTE_1AP_SCIENCE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة التمهيدي/السنة الأولى ابتدائي، مبسّط جداً وبصري (جسمي، الحواس، الفصول) — بدون امتحانات فصلية رسمية في هذا المستوى، وليس نسخة حرفية عن وثيقة رسمية.';

export const SCIENCE_1AP: CourseLesson[] = [
  // ==========================================
  // TRIMESTRE 1
  // ==========================================
  {
    id: 'science-1ap-t1-five-senses-hygiene',
    grade: '1AP',
    subject: 'science',
    trimester: 1,
    domainAr: 'الإنسان والصحة',
    sequenceAr: 'السلسلة 1: حواسي الخمس والنظافة',
    categoryAr: 'التربية العلمية والتكنولوجية',
    titleAr: 'حَوَاسِّي الخَمْسُ وَنَظَافَتِي 👀👂👃👅✋',
    summaryAr: 'يكتشف الطفل حواسه الخمس (البصر، السمع، الشم، الذوق، اللمس) وأهمية غسل يديه دائماً.',
    objectiveAr: 'ربط كل عضو من أعضاء جسمي بالحاسة المناسبة له، واكتساب عادة غسل اليدين.',
    objectivesAr: [
      'أُسَمِّي حَوَاسِّي الخَمْسَ الواحدة تلو الأخرى.',
      'أَرْبِطُ كل عضو (عين، أذن، أنف، لسان، جلد) بحاسته.',
      'أَغْسِلُ يَدَيَّ بِالمَاءِ وَالصَّابُونِ قَبْلَ الأَكْلِ.',
    ],
    discoveryAr: 'أغمض عينيك وشمّ رائحة زهرة 🌸 — بأي عضو تشمّها؟',
    rulesAr: [
      'بِعَيْنَيَّ 👀 أَرَى الأَلْوَانَ وَالأَشْكَالَ.',
      'بِأُذُنَيَّ 👂 أَسْمَعُ الأَصْوَاتَ.',
      'بِأَنْفِي 👃 أَشُمُّ الرَّوَائِحَ.',
      'بِلِسَانِي 👅 أَتَذَوَّقُ الطَّعَامَ، وَبِجِلْدِي ✋ أُحِسُّ بِالحَرِّ وَالبَرْدِ.',
    ],
    examplesAr: [
      { problem: 'بأي عضو نستمع للأغاني؟', solution: 'بِالأُذُنَيْنِ (حاسة السمع).' },
    ],
    detailedCourse: {
      introAr: 'جسمي جميل ومليء بأعضاء تساعدني على اكتشاف العالم من حولي! لكل عضو حاسة خاصة به.',
      vocabulary: [
        { termAr: 'الحَاسَّةُ', definitionAr: 'قدرة عضو في جسمي على الشعور بشيء معين مثل الرؤية أو السمع.' },
      ],
      visualizationHintAr: 'العب مع الطفل لعبة "خمّن بحاسة واحدة": أغمض عينيه واطلب منه تخمين شيء بالشم أو اللمس فقط.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين حاسة الشم وحاسة الذوق.', correctionAr: 'ذكّر الطفل: الأنف يشم الروائح، واللسان يتذوق الطعام داخل الفم.' },
      ],
      takeawayAr: 'حواسي الخمس: العين (أرى)، الأذن (أسمع)، الأنف (أشم)، اللسان (أتذوق)، الجلد (ألمس). أغسل يدي دائماً قبل الأكل.',
    },
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'لعبة مطابقة الحواس الخمس',
      instructionsAr: 'اربط كل عضو بحاسته الصحيحة!',
      pairs: [
        { leftAr: 'العَيْنَانِ 👀', rightAr: 'الرُّؤْيَةُ', explanationAr: 'بعيني أرى الألوان والأشكال.' },
        { leftAr: 'الأُذُنَانِ 👂', rightAr: 'السَّمْعُ', explanationAr: 'بأذني أسمع الأصوات.' },
        { leftAr: 'الأَنْفُ 👃', rightAr: 'الشَّمُّ', explanationAr: 'بأنفي أشم الروائح.' },
        { leftAr: 'اللِّسَانُ 👅', rightAr: 'الذَّوْقُ', explanationAr: 'بلساني أتذوق الطعام.' },
        { leftAr: 'الجِلْدُ ✋', rightAr: 'اللَّمْسُ', explanationAr: 'بجلدي أحس بالحار والبارد.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-sc1ap-senses',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'بأي عضو أرى الألوان؟',
        hintsAr: ['عضوان في وجهي أنظر بهما.'],
        solutionAr: 'العَيْنَانِ',
        detailedCorrectionAr: 'أحسنت! بعيني أرى كل الألوان والأشكال.',
        xpReward: 10,
      },
      {
        id: 'ex2-sc1ap-senses',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'متى يجب أن أغسل يديّ؟',
        hintsAr: ['فكر في وقت الأكل.'],
        solutionAr: 'قَبْلَ الأَكْلِ وَبَعْدَهُ',
        detailedCorrectionAr: 'ممتاز! غسل اليدين قبل الأكل وبعده يحمينا من المرض.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-sc1ap-senses',
      type: 'association',
      titleAr: 'لعبة مطابقة الحواس',
      instructionsAr: 'اربط كل عضو بحاسته الصحيحة!',
      items: [
        { questionOrPromptAr: 'الأَنْفُ 👃', correctAnswerAr: 'الشَّمُّ', optionsAr: ['الشَّمُّ', 'السَّمْعُ', 'الرُّؤْيَةُ'], explanationAr: 'الأنف يشم الروائح.' },
        { questionOrPromptAr: 'الأُذُنُ 👂', correctAnswerAr: 'السَّمْعُ', optionsAr: ['السَّمْعُ', 'الذَّوْقُ', 'اللَّمْسُ'], explanationAr: 'الأذن تسمع الأصوات.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-sc1ap-senses',
        questionAr: 'بأي عضو أتذوق الحلوى؟',
        options: [
          { id: 'a', textAr: 'اللِّسَانُ 👅', isCorrect: true, explanationAr: 'صحيح! اللسان هو عضو الذوق.' },
          { id: 'b', textAr: 'الأَنْفُ 👃', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_SCIENCE,
  },

  // ==========================================
  // TRIMESTRE 2
  // ==========================================
  {
    id: 'science-1ap-t2-my-body-parts',
    grade: '1AP',
    subject: 'science',
    trimester: 2,
    domainAr: 'الإنسان والصحة',
    sequenceAr: 'السلسلة 2: أعضاء جسمي',
    categoryAr: 'التربية العلمية والتكنولوجية',
    titleAr: 'أَتَعَرَّفُ عَلَى أَعْضَاءِ جِسْمِي 🧍',
    summaryAr: 'يتعرف الطفل على أسماء أعضاء جسمه الرئيسية (الرأس، اليدان، الرجلان، البطن، الظهر) ويستعملها في وصف نفسه.',
    objectiveAr: 'تسمية أعضاء الجسم الرئيسية والإشارة إليها بشكل صحيح.',
    objectivesAr: [
      'أُسَمِّي أعضاء جسمي الرئيسية.',
      'أُشِيرُ إِلَى كُلِّ عُضْوٍ عِنْدَمَا أَسْمَعُ اسْمَهُ.',
      'أُدْرِكُ أن جسمي يحتاج للحركة والراحة معاً.',
    ],
    discoveryAr: 'ضع يدك على رأسك 🙆، ثم على بطنك، ثم على ركبتيك. هل عرفت كل الأسماء؟',
    rulesAr: [
      'رَأْسِي 🙆 فِي الأَعْلَى، وَفِيهِ عَيْنَايَ وَأَنْفِي وَفَمِي.',
      'يَدَايَ ✋✋ أَسْتَعْمِلُهُمَا لِلَّعِبِ وَالأَكْلِ وَالكِتَابَةِ.',
      'رِجْلَايَ 🦵🦵 أَسْتَعْمِلُهُمَا لِلْمَشْيِ وَالجَرْيِ وَاللَّعِبِ.',
    ],
    examplesAr: [
      { problem: 'بأي عضو أمشي وأجري؟', solution: 'بِرِجْلَيَّ (القدمين والساقين).' },
    ],
    detailedCourse: {
      introAr: 'جسمي مكوّن من أعضاء كثيرة، كل عضو له اسم ودور مهم. تعلم أسمائها يساعدني على وصف نفسي والاعتناء بصحتي.',
      vocabulary: [
        { termAr: 'العُضْوُ', definitionAr: 'جزء من جسمي له اسم ووظيفة، مثل اليد أو الرجل.' },
      ],
      visualizationHintAr: 'العب لعبة "المس ما أقول": قل اسم عضو واطلب من الطفل لمسه بسرعة (رأس، كتف، ركبة، قدم).',
      commonMistakes: [
        { mistakeAr: 'الخلط بين الكوع والركبة.', correctionAr: 'الكوع في منتصف الذراع، والركبة في منتصف الرجل — قارن بينهما على جسم الطفل مباشرة.' },
      ],
      takeawayAr: 'رأسي في الأعلى، يداي للعمل واللعب، رجلاي للمشي والجري. جسمي يحتاج حركة وراحة معاً.',
    },
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'لعبة مطابقة أعضاء الجسم بوظيفتها',
      instructionsAr: 'اربط كل عضو بما نستعمله من أجله!',
      pairs: [
        { leftAr: 'الرَّأْسُ 🙆', rightAr: 'فيه عيناي وأنفي وفمي', explanationAr: 'الرأس في الأعلى، وفيه معظم أعضاء الحواس.' },
        { leftAr: 'اليَدَانِ ✋✋', rightAr: 'الكِتَابَةُ وَاللَّعِبُ وَالأَكْلُ', explanationAr: 'نستعمل أيدينا للأنشطة اليومية.' },
        { leftAr: 'الرِّجْلَانِ 🦵🦵', rightAr: 'المَشْيُ وَالجَرْيُ', explanationAr: 'نستعمل رجلينا للتنقل واللعب.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-sc1ap-bodyparts',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'بأي عضو أكتب وأرسم؟',
        hintsAr: ['فيه أصابع.'],
        solutionAr: 'بِيَدَيَّ',
        detailedCorrectionAr: 'أحسنت! نستعمل أيدينا للكتابة والرسم.',
        xpReward: 10,
      },
      {
        id: 'ex2-sc1ap-bodyparts',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'أين توجد عيناي وأنفي وفمي؟',
        hintsAr: ['في الجزء العلوي من جسمي.'],
        solutionAr: 'فِي رَأْسِي',
        detailedCorrectionAr: 'ممتاز! كلها موجودة في الرأس.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-sc1ap-bodyparts',
      type: 'quiz_flash',
      titleAr: 'لعبة المس ما أقول',
      instructionsAr: 'اختر العضو الصحيح لكل نشاط!',
      items: [
        { questionOrPromptAr: 'نستعمله للركض واللعب في الساحة', correctAnswerAr: 'الرِّجْلَانِ', optionsAr: ['الرِّجْلَانِ', 'اليَدَانِ'], explanationAr: 'الرجلان تساعداننا على الجري والمشي.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-sc1ap-bodyparts',
        questionAr: 'أين يوجد رأسي بالنسبة لجسمي؟',
        options: [
          { id: 'a', textAr: 'فِي الأَعْلَى', isCorrect: true, explanationAr: 'صحيح! الرأس دائماً في أعلى الجسم.' },
          { id: 'b', textAr: 'فِي الأَسْفَلِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_SCIENCE,
  },

  // ==========================================
  // TRIMESTRE 3
  // ==========================================
  {
    id: 'science-1ap-t3-seasons-weather',
    grade: '1AP',
    subject: 'science',
    trimester: 3,
    domainAr: 'البيئة والطبيعة',
    sequenceAr: 'السلسلة 3: فصول السنة والطقس',
    categoryAr: 'التربية العلمية والتكنولوجية',
    titleAr: 'فُصُولُ السَّنَةِ وَحَالَةُ الطَّقْسِ ☀️🌧️❄️🍂',
    summaryAr: 'يكتشف الطفل فصول السنة الأربعة (الربيع، الصيف، الخريف، الشتاء) وحالات الطقس البسيطة (مشمس، ممطر، بارد).',
    objectiveAr: 'التعرف على فصول السنة الأربعة وربطها بحالة الطقس واللباس المناسب.',
    objectivesAr: [
      'أُسَمِّي فُصُولَ السَّنَةِ الأَرْبَعَةَ.',
      'أَرْبِطُ كُلَّ فَصْلٍ بِحَالَةِ طَقْسٍ مُنَاسِبَةٍ.',
      'أَخْتَارُ اللِّبَاسَ المُنَاسِبَ لِكُلِّ فَصْلٍ.',
    ],
    discoveryAr: 'في أي فصل نلبس معطفاً سميكاً؟ وفي أي فصل نذهب للسباحة؟',
    rulesAr: [
      'الصَّيْفُ ☀️: الجو حار جداً، نلبس ملابس خفيفة ونسبح.',
      'الشِّتَاءُ ❄️: الجو بارد جداً، نلبس معطفاً سميكاً.',
      'الرَّبِيعُ 🌸 وَالخَرِيفُ 🍂: الجو معتدل، تتفتح الزهور في الربيع وتتساقط الأوراق في الخريف.',
    ],
    examplesAr: [
      { problem: 'في أي فصل تسقط أوراق الأشجار؟', solution: 'فِي الخَرِيفِ 🍂.' },
    ],
    detailedCourse: {
      introAr: 'السنة تمر بأربعة فصول جميلة، كل فصل له طقسه الخاص وجماله الخاص!',
      vocabulary: [
        { termAr: 'الفَصْلُ 🍂', definitionAr: 'جزء من السنة له طقس خاص، وهناك 4 فصول.' },
        { termAr: 'الطَّقْسُ', definitionAr: 'حالة الجو في يوم معين: حار، بارد، ممطر، مشمس.' },
      ],
      visualizationHintAr: 'ارسم مع الطفل 4 دوائر تمثل الفصول الأربعة، وألصق فيها صوراً تناسب كل فصل (شمس، ثلج، أوراق، زهور).',
      commonMistakes: [
        { mistakeAr: 'الخلط بين الربيع والخريف.', correctionAr: 'ذكّر الطفل: في الربيع تتفتح الأزهار (بداية)، وفي الخريف تسقط الأوراق (نهاية).' },
      ],
      takeawayAr: 'أربعة فصول: صيف حار، شتاء بارد، ربيع تتفتح فيه الزهور، خريف تتساقط فيه الأوراق. ألبس حسب الفصل.',
    },
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'process_stages',
      titleAr: 'رحلة فصول السنة الأربعة',
      instructionsAr: 'تابع دورة الفصول الأربعة على مدار السنة.',
      stages: [
        { step: 1, titleAr: 'الرَّبِيعُ 🌸', descAr: 'تتفتح الأزهار ويعتدل الجو.', icon: '🌸' },
        { step: 2, titleAr: 'الصَّيْفُ ☀️', descAr: 'الجو حار جداً، نلبس ملابس خفيفة ونسبح.', icon: '☀️' },
        { step: 3, titleAr: 'الخَرِيفُ 🍂', descAr: 'تتساقط أوراق الأشجار ويبرد الجو تدريجياً.', icon: '🍂' },
        { step: 4, titleAr: 'الشِّتَاءُ ❄️', descAr: 'الجو بارد جداً، نلبس معطفاً سميكاً.', icon: '❄️' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-sc1ap-seasons',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'في أي فصل نسبح في البحر؟',
        hintsAr: ['هو الفصل الحار جداً.'],
        solutionAr: 'الصَّيْفُ',
        detailedCorrectionAr: 'أحسنت! في الصيف الجو حار فنسبح.',
        xpReward: 10,
      },
      {
        id: 'ex2-sc1ap-seasons',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ما اللباس المناسب في فصل الشتاء البارد؟',
        hintsAr: ['شيء سميك يدفئنا.'],
        solutionAr: 'مِعْطَفٌ سَمِيكٌ',
        detailedCorrectionAr: 'ممتاز! المعطف السميك يحمينا من البرد.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-sc1ap-seasons',
      type: 'association',
      titleAr: 'لعبة اختر لباس الفصل',
      instructionsAr: 'اربط كل فصل باللباس أو النشاط المناسب له!',
      items: [
        { questionOrPromptAr: 'الشِّتَاءُ ❄️', correctAnswerAr: 'مِعْطَفٌ وَقُفَّازَاتٌ', optionsAr: ['مِعْطَفٌ وَقُفَّازَاتٌ', 'لِبَاسُ السِّبَاحَةِ'], explanationAr: 'في الشتاء نحتاج ملابس دافئة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-sc1ap-seasons',
        questionAr: 'كم عدد فصول السنة؟',
        options: [
          { id: 'a', textAr: '4 فُصُولٍ', isCorrect: true, explanationAr: 'صحيح! الصيف والشتاء والربيع والخريف.' },
          { id: 'b', textAr: '2 فَصْلَانِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_SCIENCE,
  },
];
