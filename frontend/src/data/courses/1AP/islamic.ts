import { CourseLesson } from '../../../types';
import {
  SURAH_FALAQ,
  SURAH_FATIHA,
  SURAH_IKHLAS,
  SURAH_KAWTHAR,
  SURAH_MASAD,
  SURAH_NAS,
  SURAH_NASR,
} from './shortSurahs';

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
      visualizationHintAr: 'اقرأ مع الطفل سورة الفاتحة آية آية من الأداة التفاعلية، دون تشغيل صوت تلقائي.',
      commonMistakes: [
        { mistakeAr: 'نسيان قول البسملة عند بدء الأكل أو أي عمل.', correctionAr: 'ذكّر الطفل بلطف حتى تصبح البسملة عادة يومية تلقائية.' },
      ],
      takeawayAr: 'أحفظ سورة الفاتحة، وأقول "بسم الله" قبل كل عمل، و"الحمد لله" بعد الانتهاء منه.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'سُورَةُ الفَاتِحَةِ كَامِلَةً',
      introAr: 'اقرأ السورة كلها. اضغط على آية لترى معناها البسيط.',
      verses: SURAH_FATIHA,
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
  {
    id: 'islamic-1ap-t1-surah-falaq-kawthar',
    grade: '1AP',
    subject: 'islamic',
    trimester: 1,
    domainAr: 'القرآن الكريم',
    sequenceAr: 'السلسلة 4: سورتا الفلق والكوثر',
    categoryAr: 'التربية الإسلامية - القرآن الكريم',
    titleAr: 'أَحْفَظُ سُورَتَيِ الفَلَقِ وَالكَوْثَرِ 🌅',
    summaryAr: 'يحفظ الطفل سورتي الفلق والكوثر، ويتعلم طلب الحماية من الله وشكره على نعمه الكثيرة.',
    objectiveAr: 'حفظ وترديد سورتي الفلق والكوثر بشكل صحيح مع فهم بسيط لمعناهما.',
    objectivesAr: [
      'أَحْفَظُ سُورَةَ الفَلَقِ كَامِلَةً.',
      'أَحْفَظُ سُورَةَ الكَوْثَرِ كَامِلَةً.',
      'أَشْكُرُ اللهَ عَلَى نِعَمِهِ الكَثِيرَةِ.',
    ],
    discoveryAr: 'متى نطلب من الله أن يحمينا من الظلام والخوف؟',
    rulesAr: [
      'سُورَةُ الفَلَقِ: نطلب فيها من الله الحماية من كل شر عند الصباح.',
      'سُورَةُ الكَوْثَرِ: أقصر سورة في القرآن، نشكر فيها الله على نعمه الكثيرة.',
      'الكَوْثَرُ نهر عظيم في الجنة أعطاه الله لنبينا محمد ﷺ.',
    ],
    examplesAr: [
      { problem: 'ما هي أقصر سورة في القرآن الكريم؟', solution: 'سُورَةُ الكَوْثَرِ.' },
    ],
    detailedCourse: {
      introAr: 'سورتان جميلتان قصيرتان: الفلق نطلب فيها حماية الله، والكوثر نشكره فيها على عطائه الكثير.',
      vocabulary: [
        { termAr: 'الفَلَقُ 🌅', definitionAr: 'ضوء الصباح الذي يظهر بعد الليل.' },
        { termAr: 'الكَوْثَرُ 💧', definitionAr: 'نهر عظيم في الجنة، ومعناه أيضاً الخير الكثير.' },
      ],
      visualizationHintAr: 'اقرأ السورتين كاملتين من الأداة التفاعلية، آية آية، دون صوت تلقائي.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين سورة الفلق وسورة الناس.', correctionAr: 'ذكّر الطفل أن الفلق تبدأ بـ"قل أعوذ برب الفلق" والناس بـ"قل أعوذ برب الناس".' },
      ],
      takeawayAr: 'سورة الفلق: أطلب حماية الله. سورة الكوثر: أشكر الله على خيره الكثير.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'سُورَتَا الفَلَقِ وَالكَوْثَرِ كَامِلَتَانِ',
      introAr: 'اقرأ كل سورة كاملة. اضغط على آية لترى معناها البسيط.',
      verses: [...SURAH_FALAQ, ...SURAH_KAWTHAR],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-falaqkawthar',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ما هي أقصر سورة في القرآن؟',
        hintsAr: ['اسمها يدل على الخير الكثير.'],
        solutionAr: 'سُورَةُ الكَوْثَرِ',
        detailedCorrectionAr: 'أحسنت! سورة الكوثر أقصر سورة في القرآن.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-falaqkawthar',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'في أي سورة نطلب حماية الله من الشر؟',
        hintsAr: ['اسمها يدل على ضوء الصباح.'],
        solutionAr: 'سُورَةُ الفَلَقِ',
        detailedCorrectionAr: 'ممتاز! سورة الفلق نطلب فيها الحماية.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-falaqkawthar',
      type: 'memory',
      titleAr: 'لعبة ربط السور بمعانيها',
      instructionsAr: 'اربط كل سورة بمعناها البسيط!',
      items: [
        { questionOrPromptAr: 'سُورَةُ الكَوْثَرِ', correctAnswerAr: 'شُكْرُ اللهِ عَلَى الخَيْرِ الكَثِيرِ', optionsAr: ['شُكْرُ اللهِ عَلَى الخَيْرِ الكَثِيرِ', 'طَلَبُ الحِمَايَةِ'], explanationAr: 'الكوثر تعني الخير الكثير الذي أعطانا الله إياه.' },
        { questionOrPromptAr: 'سُورَةُ الفَلَقِ', correctAnswerAr: 'طَلَبُ الحِمَايَةِ مِنَ الشَّرِّ', optionsAr: ['طَلَبُ الحِمَايَةِ مِنَ الشَّرِّ', 'شُكْرُ اللهِ عَلَى الخَيْرِ الكَثِيرِ'], explanationAr: 'الفلق نطلب فيها حماية الله من كل شر.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-falaqkawthar',
        questionAr: 'ماذا أعطى الله نبينا محمداً ﷺ في سورة الكوثر؟',
        options: [
          { id: 'a', textAr: 'الخَيْرَ الكَثِيرَ', isCorrect: true, explanationAr: 'صحيح! الكوثر يعني الخير الكثير.' },
          { id: 'b', textAr: 'المَالَ فَقَطْ', isCorrect: false },
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
      visualizationHintAr: 'اقرأ سورتي الإخلاص والناس كاملتين من الأداة التفاعلية، دون صوت تلقائي.',
      commonMistakes: [
        { mistakeAr: 'نسيان البسملة قبل قراءة السورة.', correctionAr: 'ذكّر الطفل دائماً بالبدء بـ"بسم الله" قبل كل سورة.' },
      ],
      takeawayAr: 'سورة الإخلاص: الله واحد. سورة الناس: نطلب حماية الله من كل شر.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'سُورَتَا الإِخْلَاصِ وَالنَّاسِ كَامِلَتَانِ',
      introAr: 'اقرأ كل سورة كاملة. اضغط على آية لترى معناها البسيط.',
      verses: [...SURAH_IKHLAS, ...SURAH_NAS],
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

  {
    id: 'islamic-1ap-t2-shahada-pillars',
    grade: '1AP',
    subject: 'islamic',
    trimester: 2,
    domainAr: 'الأذكار والعقيدة',
    sequenceAr: 'السلسلة: الشهادتان',
    categoryAr: 'التربية الإسلامية - الأذكار',
    titleAr: 'أَحْفَظُ الشَّهَادَتَيْنِ 🤲',
    summaryAr: 'يحفظ الطفل صيغة الشهادتين ويردّدها كذكر يومي، دون تفصيل أركان الإسلام الخمسة.',
    objectiveAr: 'حفظ الشهادتين وفهم معناهما البسيط: لا إله إلا الله، محمد رسول الله.',
    objectivesAr: [
      'أَرُدِّدُ: أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ.',
      'أَرُدِّدُ: وَأَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللهِ.',
      'أَعْرِفُ أَنَّ هَذَا ذِكْرٌ نَقُولُهُ كُلَّ يَوْمٍ.',
    ],
    discoveryAr: 'ماذا يقول المسلم ليشهد أن الله واحد وأن محمداً رسوله؟',
    rulesAr: [
      'الشَّهَادَةُ الأُولَى: أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ.',
      'الشَّهَادَةُ الثَّانِيَةُ: وَأَشْهَدُ أَنَّ مُحَمَّداً رَسُولُ اللهِ.',
      'نقولهما معاً: هذا ذكر جميل مثل البسملة والحمدلة.',
    ],
    examplesAr: [
      { problem: 'أكمل: أشهد أن لا إله إلا …', solution: 'اللهُ.' },
    ],
    detailedCourse: {
      introAr: 'بعد البسملة والحمدلة نتعلّم كلمتين عظيمتين: نشهد أن الله واحد، وأن محمداً رسوله.',
      vocabulary: [
        { termAr: 'أَشْهَدُ', definitionAr: 'أقول وأعلم بقلبي.' },
        { termAr: 'رَسُولُ اللهِ', definitionAr: 'محمد ﷺ بعثه الله ليعلّمنا الخير.' },
      ],
      visualizationHintAr: 'ردّد مع الطفل الجملة مرتين ببطء، نصفين: لا إله إلا الله، ثم محمد رسول الله.',
      commonMistakes: [
        { mistakeAr: 'حفظ الأركان الخمسة قبل إتقان الشهادتين.', correctionAr: 'في 1AP نتقن الشهادتين كذكر. الأركان لاحقاً.' },
      ],
      takeawayAr: 'أشهد أن لا إله إلا الله وأن محمداً رسول الله.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'concept_cards',
      titleAr: 'كلمتا الشهادة',
      introAr: 'اضغط على كل كلمة لتقرأها.',
      concepts: [
        { nameAr: 'لَا إِلَهَ إِلَّا اللهُ', descAr: 'الله واحد لا شريك له.' },
        { nameAr: 'مُحَمَّدٌ رَسُولُ اللهِ', descAr: 'محمد ﷺ رسولنا.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-pillars',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'أكمل: أشهد أن لا إله إلا …',
        hintsAr: ['اسم ربنا.'],
        solutionAr: 'اللهُ',
        detailedCorrectionAr: 'لا إله إلا الله.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-pillars',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'من رسول الله الذي نذكره في الشهادة الثانية؟',
        hintsAr: ['اسمه محمد.'],
        solutionAr: 'مُحَمَّدٌ ﷺ',
        detailedCorrectionAr: 'وأشهد أن محمداً رسول الله.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-pillars',
      type: 'quiz_flash',
      titleAr: 'الشهادتان',
      instructionsAr: 'اختر التتمة الصحيحة!',
      items: [
        { questionOrPromptAr: 'أشهد أن لا إله إلا', correctAnswerAr: 'اللهُ', optionsAr: ['اللهُ', 'المَلَكُ'], explanationAr: 'لا إله إلا الله.' },
        { questionOrPromptAr: 'محمد … الله', correctAnswerAr: 'رَسُولُ', optionsAr: ['رَسُولُ', 'كِتَابُ'], explanationAr: 'محمد رسول الله.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-pillars',
        questionAr: 'ماذا نقول في الشهادتين؟',
        options: [
          { id: 'a', textAr: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَنَّ مُحَمَّداً رَسُولُ اللهِ', isCorrect: true, explanationAr: 'هذه صيغة الشهادتين.' },
          { id: 'b', textAr: 'الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ', isCorrect: false },
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
    titleAr: 'الأَدَبُ: شُكْرٌ، صِدْقٌ، طَهَارَةٌ 🙏🧼',
    summaryAr: 'يتعلم الطفل الشكر والاستئذان، والصدق، والنظافة (الطهارة) كآداب إسلامية يومية.',
    objectiveAr: 'اكتساب عادات الشكر والصدق والطهارة والاستئذان.',
    objectivesAr: [
      'أَقُولُ «شُكْراً» وَ«مِنْ فَضْلِكَ» وَأَسْتَأْذِنُ.',
      'أَصْدُقُ فِي كَلَامِي وَلَا أَكْذِبُ.',
      'أَغْسِلُ يَدَيَّ وَأَهْتَمُّ بِطَهَارَتِي.',
    ],
    discoveryAr: 'أعطاك صديقك قلماً. ماذا تقول له؟',
    rulesAr: [
      'الشُّكْرُ: أقول "شُكْراً" أو "جَزَاكَ اللهُ خَيْراً" لمن أحسن إليّ.',
      'الاسْتِئْذَانُ: أقول "السَّلَامُ عَلَيْكُمْ" وأطرق الباب قبل الدخول.',
      'الصِّدْقُ: أقول الحق ولو كان صعباً. الكذب يؤذي.',
      'الطَّهَارَةُ: أغسل يديّ قبل الأكل وبعد الخلاء، وثوبي نظيف.',
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
        { nameAr: 'الصِّدْقُ', descAr: 'أقول الحق ولا أكذب.' },
        { nameAr: 'الطَّهَارَةُ', descAr: 'أغسل يديّ وأحافظ على نظافتي.' },
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
        { questionOrPromptAr: 'كسرت كأساً. ماذا تقول؟', correctAnswerAr: 'أَصْدُقُ: أَنَا كَسَرْتُهُ', optionsAr: ['أَصْدُقُ: أَنَا كَسَرْتُهُ', 'أَكْذِبُ: لَسْتُ أَنَا'], explanationAr: 'الصدق أدب إسلامي.' },
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
  {
    id: 'islamic-1ap-t3-parents-kindness',
    grade: '1AP',
    subject: 'islamic',
    trimester: 3,
    domainAr: 'العبادات والأخلاق',
    sequenceAr: 'السلسلة 6: بر الوالدين وطاعتهما',
    categoryAr: 'التربية الإسلامية - الأخلاق',
    titleAr: 'أَبَرُّ وَالِدَيَّ وَأُطِيعُهُمَا 👨‍👩‍👧',
    summaryAr: 'يتعلم الطفل حب واحترام وطاعة والديه، وأن رضاهما من رضا الله.',
    objectiveAr: 'اكتساب سلوكيات بر الوالدين البسيطة في الحياة اليومية.',
    objectivesAr: [
      'أُحِبُّ وَالِدَيَّ وَأَحْتَرِمُهُمَا.',
      'أُطِيعُ وَالِدَيَّ فِيمَا يَأْمُرَانِ بِهِ مَا لَمْ يَكُنْ فِيهِ مَعْصِيَةٌ.',
      'أُسَاعِدُ وَالِدَيَّ فِي الأَعْمَالِ البَسِيطَةِ فِي البَيْتِ.',
    ],
    discoveryAr: 'من يعتني بك ويحبك أكثر من كل أحد؟',
    rulesAr: [
      'بِرُّ الوَالِدَيْنِ: حبهما واحترامهما وطاعتهما وعدم رفع الصوت عليهما.',
      'رِضَا الوَالِدَيْنِ مِنْ رِضَا اللهِ، وَغَضَبُهُمَا مِنْ غَضَبِ اللهِ.',
      'أُسَاعِدُ وَالِدَتِي فِي تَرْتِيبِ أَلْعَابِي، وَأُسَاعِدُ وَالِدِي فِي الأَعْمَالِ الخَفِيفَةِ.',
    ],
    examplesAr: [
      { problem: 'طلبت منك أمك ترتيب ألعابك، ماذا تفعل؟', solution: 'أُرَتِّبُ أَلْعَابِي فَوْراً وَبِابْتِسَامَةٍ.' },
    ],
    detailedCourse: {
      introAr: 'والدانا هما أغلى الناس علينا، ربّانا بحب وتعب، فديننا يأمرنا بحبهما واحترامهما وطاعتهما دائماً.',
      vocabulary: [
        { termAr: 'البِرُّ 💚', definitionAr: 'الإحسان والطاعة واللطف مع الوالدين.' },
      ],
      visualizationHintAr: 'اطلب من الطفل رسم قلب صغير وكتابة اسم أمه وأبيه بداخله، وتحدث معه عن كيف يسعدهما.',
      commonMistakes: [
        { mistakeAr: 'رفع الصوت أو الغضب على الوالدين.', correctionAr: 'علّم الطفل أن الكلام اللطيف والهادئ هو ما يحب الله ويحب الوالدان.' },
      ],
      takeawayAr: 'أحب والديّ وأحترمهما وأطيعهما، وأساعدهما دائماً بابتسامة.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'concept_cards',
      titleAr: 'بطاقات بر الوالدين',
      introAr: 'اكتشف كيف تكون طفلاً باراً بوالديه.',
      concepts: [
        { nameAr: 'الطَّاعَةُ', descAr: 'أطيع والديّ فيما يأمران به من خير.' },
        { nameAr: 'المُسَاعَدَةُ', descAr: 'أساعد والديّ في الأعمال البسيطة بالبيت.' },
        { nameAr: 'الاحْتِرَامُ', descAr: 'أتكلم مع والديّ بصوت هادئ ولطيف.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-parents',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'طلب منك أبوك أن تخفض صوت التلفاز. ماذا تفعل؟',
        hintsAr: ['بر الوالدين يعني الطاعة.'],
        solutionAr: 'أُخَفِّضُ الصَّوْتَ فَوْراً',
        detailedCorrectionAr: 'أحسنت! طاعة الوالدين من بر الوالدين.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-parents',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'رضا من يوصلنا إلى رضا الله؟',
        hintsAr: ['هما أقرب الناس إليك.'],
        solutionAr: 'رِضَا الوَالِدَيْنِ',
        detailedCorrectionAr: 'ممتاز! رضا الوالدين من رضا الله.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-parents',
      type: 'quiz_flash',
      titleAr: 'لعبة الطفل البار',
      instructionsAr: 'اختر التصرف البار الصحيح!',
      items: [
        { questionOrPromptAr: 'طلبت منك أمك المساعدة في ترتيب الطاولة', correctAnswerAr: 'أُسَاعِدُهَا بِسُرْعَةٍ وَابْتِسَامَةٍ', optionsAr: ['أُسَاعِدُهَا بِسُرْعَةٍ وَابْتِسَامَةٍ', 'أَتَجَاهَلُ طَلَبَهَا'], explanationAr: 'مساعدة الوالدين من بر الوالدين.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-parents',
        questionAr: 'ماذا يوصل إليه رضا الوالدين؟',
        options: [
          { id: 'a', textAr: 'رِضَا اللهِ', isCorrect: true, explanationAr: 'صحيح! رضا الوالدين من رضا الله.' },
          { id: 'b', textAr: 'لَا شَيْءَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ISLAMIC,
  },
  {
    id: 'islamic-1ap-t3-surah-masad-nasr',
    grade: '1AP',
    subject: 'islamic',
    trimester: 3,
    domainAr: 'القرآن الكريم',
    sequenceAr: 'السلسلة: سورتا المسد والنصر',
    categoryAr: 'التربية الإسلامية - القرآن الكريم',
    titleAr: 'أَحْفَظُ سُورَتَيِ المَسَدِ وَالنَّصْرِ 📖',
    summaryAr: 'يحفظ الطفل سورتي المسد والنصر ويردّدهما مع معنى بسيط جداً.',
    objectiveAr: 'حفظ وترديد سورتي المسد والنصر.',
    objectivesAr: [
      'أَرُدِّدُ سُورَةَ المَسَدِ.',
      'أَرُدِّدُ سُورَةَ النَّصْرِ.',
      'أَعْرِفُ أَنَّ النَّصْرَ نِعْمَةٌ مِنَ اللهِ.',
    ],
    discoveryAr: 'سور قصيرة في آخر المصحف: بعد الكوثر والناس… المسد والنصر.',
    rulesAr: [
      'سُورَةُ المَسَدِ قصيرة، نحفظها آية آية مع المعلم.',
      'سُورَةُ النَّصْرِ تتحدث عن نصر الله. نحمد الله على النصر.',
      'نردّد بعد البسملة، ببطء، كما في الفاتحة والإخلاص.',
    ],
    examplesAr: [
      { problem: 'متى نقول البسملة قبل السورة؟', solution: 'دائماً قبل التلاوة.' },
    ],
    detailedCourse: {
      introAr: 'أكملنا الفاتحة والإخلاص والفلق والناس والكوثر. اليوم سورتا المسد والنصر.',
      vocabulary: [
        { termAr: 'سُورَةُ المَسَدِ', definitionAr: 'سورة قصيرة في جزء عمّ نحفظها.' },
        { termAr: 'سُورَةُ النَّصْرِ', definitionAr: 'سورة قصيرة عن نصر الله.' },
      ],
      visualizationHintAr: 'اقرأ سورتي المسد والنصر كاملتين من الأداة التفاعلية، آية آية، دون صوت تلقائي.',
      commonMistakes: [
        { mistakeAr: 'الخلط بين أسماء السور القصيرة.', correctionAr: 'كل سورة اسمها لافتة: المسد / النصر.' },
      ],
      takeawayAr: 'أحفظ المسد والنصر مع السور القصيرة الأخرى.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'سُورَتَا المَسَدِ وَالنَّصْرِ كَامِلَتَانِ',
      introAr: 'اقرأ كل سورة كاملة. اضغط على آية لترى معناها البسيط.',
      verses: [...SURAH_MASAD, ...SURAH_NASR],
    },
    progressiveExercises: [
      {
        id: 'ex1-isl1ap-masad',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — ألعب وأتعلم',
        problemAr: 'ماذا نقول قبل تلاوة أي سورة؟',
        hintsAr: ['بسم الله…'],
        solutionAr: 'البَسْمَلَةُ',
        detailedCorrectionAr: 'نبدأ بالبسملة.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl1ap-masad',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'سورة تتحدث عن نصر الله. ما اسمها؟',
        hintsAr: ['اسمها النصر.'],
        solutionAr: 'سُورَةُ النَّصْرِ',
        detailedCorrectionAr: 'سورة النصر.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl1ap-masad',
      type: 'association',
      titleAr: 'أي سورة؟',
      instructionsAr: 'اربط الاسم!',
      items: [
        { questionOrPromptAr: 'نصر الله والفتح', correctAnswerAr: 'النَّصْرُ', optionsAr: ['النَّصْرُ', 'المَسَدُ'], explanationAr: 'سورة النصر.' },
        { questionOrPromptAr: 'سورة قصيرة في جزء عمّ بعد الناس', correctAnswerAr: 'المَسَدُ', optionsAr: ['المَسَدُ', 'الفَاتِحَةُ'], explanationAr: 'المسد من القصار.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl1ap-masad',
        questionAr: 'أي سورتيْن نحفظ في هذا الدرس؟',
        options: [
          { id: 'a', textAr: 'المَسَدُ وَالنَّصْرُ', isCorrect: true, explanationAr: 'نعم، المسد والنصر.' },
          { id: 'b', textAr: 'البَقَرَةُ وَآلُ عِمْرَانَ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE_1AP_ISLAMIC,
  },
];
