import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة ثانية: تنقّل الحيوانات، الهواء، أدوات بسيطة، أشياء كهربائية يومية.';

export const SCIENCE_2AP_GAPS: CourseLesson[] = [
  {
    id: 'science-2ap-t2-animal-movement',
    grade: '2AP',
    subject: 'science',
    trimester: 2,
    domainAr: 'العالم الحي',
    sequenceAr: 'السلسلة 6ب: تنقل الحيوانات',
    categoryAr: 'التربية العلمية والتكنولوجية',
    titleAr: 'كَيْفَ تَتَنَقَّلُ الحَيَوَانَاتُ؟ 🐾',
    summaryAr: 'يميّز التلميذ أنماط التنقل: المشي، الطيران، السباحة، والزحف.',
    objectiveAr: 'ربط حيوان مألوف بطريقة تنقّله.',
    objectivesAr: [
      'أَقُولُ: القِطُّ يَمْشِي، العُصْفُورُ يَطِيرُ، السَّمَكَةُ تَسْبَحُ، الثُّعْبَانُ يَزْحَفُ.',
      'أَرْبِطُ عُضْواً بِالتَّنَقُّلِ: أَجْنِحَةٌ / زَعَانِفُ / أَرْجُلٌ.',
      'أُلَاحِظُ أَنَّ بَعْضَ الحَيَوَانَاتِ تَتَنَقَّلُ بِأَكْثَرِ مِنْ طَرِيقَةٍ (البَطُّ يَمْشِي وَيَسْبَحُ).',
    ],
    discoveryAr: 'في الحديقة عصفور وقطة وحلزون. كيف يصل كل واحد إلى الغصن أو العشب؟',
    rulesAr: [
      'المَشْيُ: أرجل على الأرض (قط، كلب، حصان).',
      'الطَّيَرَانُ: أجنحة في الهواء (عصفور، فراشة).',
      'السِّبَاحَةُ: زعانف في الماء (سمكة). البط يسبح أيضاً.',
      'الزَّحْفُ: بلا أرجل ظاهرة أو بأرجل قصيرة جداً (ثعبان، حلزون).',
    ],
    examplesAr: [
      { problem: 'بماذا تطير الفراشة؟', solution: 'بأجنحتها.' },
      { problem: 'هل السمكة تمشي؟', solution: 'لا، تسبح بزعانفها.' },
    ],
    detailedCourse: {
      introAr: 'كل حيوان يتنقل بما يناسب جسمه ومكان عيشه: أرض، هواء، ماء.',
      vocabulary: [
        { termAr: 'الزِّعْنِفَةُ 🐟', definitionAr: 'عضو السباحة عند السمكة.' },
        { termAr: 'الجَنَاحُ 🐦', definitionAr: 'عضو الطيران.' },
      ],
      visualizationHintAr: 'قلّد مع الطفل: زحف، طيران بالذراعين، سباحة.',
      commonMistakes: [
        { mistakeAr: 'كل الطيور لا تمشي.', correctionAr: 'الدجاجة تمشي كثيراً وتطير قليلاً.' },
      ],
      takeawayAr: 'أرجل → مشي. أجنحة → طيران. زعانف → سباحة. زحف بلا أرجل طويلة.',
    },
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'اربط الحيوان بتنقله',
      instructionsAr: 'طابق كل حيوان بطريقة تنقله!',
      pairs: [
        { leftAr: 'العُصْفُورُ 🐦', rightAr: 'يَطِيرُ', explanationAr: 'أجنحة.' },
        { leftAr: 'السَّمَكَةُ 🐟', rightAr: 'تَسْبَحُ', explanationAr: 'زعانف.' },
        { leftAr: 'الثُّعْبَانُ 🐍', rightAr: 'يَزْحَفُ', explanationAr: 'بدون أرجل.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-sc2ap-move',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — أكتشف',
        problemAr: 'كيف يتنقل القط؟',
        hintsAr: ['له أربع أرجل.'],
        solutionAr: 'يَمْشِي',
        detailedCorrectionAr: 'القط يمشي على أربع.',
        xpReward: 10,
      },
      {
        id: 'ex2-sc2ap-move',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'بماذا تسبح السمكة؟',
        hintsAr: ['أعضاء على جنبيها.'],
        solutionAr: 'بِالزَّعَانِفِ',
        detailedCorrectionAr: 'الزعانف تساعد السمكة على السباحة.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-sc2ap-move',
      type: 'association',
      titleAr: 'يمشي أم يطير؟',
      instructionsAr: 'اختر التنقل!',
      items: [
        { questionOrPromptAr: 'الحِصَانُ 🐴', correctAnswerAr: 'يَمْشِي', optionsAr: ['يَمْشِي', 'يَطِيرُ'], explanationAr: 'أرجل قوية.' },
        { questionOrPromptAr: 'الفَرَاشَةُ 🦋', correctAnswerAr: 'تَطِيرُ', optionsAr: ['تَطِيرُ', 'تَسْبَحُ'], explanationAr: 'أجنحة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-sc2ap-move',
        questionAr: 'الحلزون يتنقل بـ:',
        options: [
          { id: 'a', textAr: 'الزَّحْفِ', isCorrect: true, explanationAr: 'يزحف ببطء على الأرض.' },
          { id: 'b', textAr: 'الطَّيَرَانِ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
  {
    id: 'science-2ap-t3-air',
    grade: '2AP',
    subject: 'science',
    trimester: 3,
    domainAr: 'المادة والتكنولوجيا',
    sequenceAr: 'السلسلة 7ب: الهواء',
    categoryAr: 'التربية العلمية والتكنولوجية',
    titleAr: 'الهَوَاءُ مِنْ حَوْلِنَا 💨',
    summaryAr: 'يكتشف التلميذ أن الهواء موجود رغم أنه لا يُرى، وأنه يحرّك الأشياء ونتنفسه.',
    objectiveAr: 'إدراك وجود الهواء ببعض الآثار البسيطة (الريح، البالون، التنفس).',
    objectivesAr: [
      'أَقُولُ: الهَوَاءُ لَا نَرَاهُ لَكِنَّهُ مَوْجُودٌ.',
      'أُلَاحِظُ أَثَرَهُ: تَحْرِيكُ الأَوْرَاقِ، نَفْخُ البَالُونِ.',
      'أَعْرِفُ أَنَّنَا نَتَنَفَّسُ الهَوَاءَ.',
    ],
    discoveryAr: 'لوّح بمروحة ورقية أو كيس فارغ: لماذا يتحرّك؟ هل «لا شيء» يدفعه؟',
    rulesAr: [
      'الهَوَاءُ مَادَّةٌ شَفَّافَةٌ تَمْلَأُ المَكَانَ.',
      'الرِّيحُ هَوَاءٌ يَتَحَرَّكُ: تُحَرِّكُ الأَوْرَاقَ وَالرَّايَةَ.',
      'نَمْلَأُ البَالُونَ بِالهَوَاءِ عِنْدَ النَّفْخِ.',
      'نَحْتَاجُ الهَوَاءَ لِلتَّنَفُّسِ (رَبْطٌ بِدَرْسِ القَلْبِ وَالرِّئَتَيْنِ).',
    ],
    examplesAr: [
      { problem: 'لماذا ترتفع الراية في الساحة؟', solution: 'لأن الريح (هواء متحرك) تدفعها.' },
      { problem: 'هل الكيس «الفارغ» فارغ حقاً؟', solution: 'فيه هواء حتى قبل أن نغلقه بإحكام أحياناً؛ بالنفع نزيد الهواء.' },
    ],
    detailedCourse: {
      introAr: 'ما لا نراه قد يكون موجوداً. الهواء نلمسه بآثاره.',
      vocabulary: [
        { termAr: 'الرِّيحُ 🍃', definitionAr: 'هواء يتحرّك.' },
        { termAr: 'النَّفْخُ', definitionAr: 'إدخال هواء من الفم في بالون أو كيس.' },
      ],
      visualizationHintAr: 'انفخ بالوناً ثم أفلته: الهواء يخرج ويدفعه.',
      commonMistakes: [
        { mistakeAr: 'الهواء = لا شيء.', correctionAr: 'الهواء مادة: يحرّك ويُتنفَّس ويُنفخ.' },
      ],
      takeawayAr: 'الهواء موجود دون أن نراه. الريح أثره. نتنفسه وننفخ به.',
    },
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'أثر الهواء',
      instructionsAr: 'اربط الظاهرة بالهواء!',
      pairs: [
        { leftAr: 'أَوْرَاقٌ تَتَحَرَّكُ 🍃', rightAr: 'رِيحٌ', explanationAr: 'هواء متحرك.' },
        { leftAr: 'بَالُونٌ مَنْفُوخٌ 🎈', rightAr: 'هَوَاءٌ دَاخِلَهُ', explanationAr: 'نفخنا هواء.' },
        { leftAr: 'شَهِيقٌ 😮‍💨', rightAr: 'نَتَنَفَّسُ هَوَاءً', explanationAr: 'الرئتان تأخذان الهواء.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-sc2ap-air',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — أكتشف',
        problemAr: 'هل نرى الهواء بأعيننا عادة؟',
        hintsAr: ['شفاف.'],
        solutionAr: 'لَا',
        detailedCorrectionAr: 'لا نراه لكن نحسّ أثره.',
        xpReward: 10,
      },
      {
        id: 'ex2-sc2ap-air',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ماذا نضع داخل البالون عند النفخ؟',
        hintsAr: ['ما نخرجه من الفم.'],
        solutionAr: 'الهَوَاءَ',
        detailedCorrectionAr: 'النفخ يملأ البالون هواءً.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-sc2ap-air',
      type: 'quiz_flash',
      titleAr: 'هواء أم لا؟',
      instructionsAr: 'اختر!',
      items: [
        { questionOrPromptAr: 'تحريك الغسيل على الحبل', correctAnswerAr: 'الهَوَاءُ / الرِّيحُ', optionsAr: ['الهَوَاءُ / الرِّيحُ', 'الحَجَرُ'], explanationAr: 'الريح تدفع القماش.' },
        { questionOrPromptAr: 'نملأ البالون بـ', correctAnswerAr: 'الهَوَاءِ', optionsAr: ['الهَوَاءِ', 'الحَجَرِ'], explanationAr: 'النفخ يدخل هواء.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-sc2ap-air',
        questionAr: 'الريح هي:',
        options: [
          { id: 'a', textAr: 'هَوَاءٌ يَتَحَرَّكُ', isCorrect: true, explanationAr: 'الريح هواء متحرك.' },
          { id: 'b', textAr: 'مَاءٌ يَسِيلُ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
];
