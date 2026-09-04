import { CourseLesson } from '../../../types';
import { SURAH_TAKATHUR } from './shortSurahs';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة ثانية: سورة التكاثر ضمن سور 2AP الرسمية، معانٍ مبسّطة للطفل.';

export const ISLAMIC_2AP_GAPS: CourseLesson[] = [
  {
    id: 'islamic-2ap-t3-surah-takathur',
    grade: '2AP',
    subject: 'islamic',
    trimester: 3,
    domainAr: 'القرآن الكريم',
    sequenceAr: 'السلسلة 9: سورة التكاثر',
    categoryAr: 'التربية الإسلامية - القرآن الكريم',
    titleAr: 'حِفْظُ سُورَةِ التَّكَاثُرِ 📖',
    summaryAr: 'يحفظ التلميذ سورة التكاثر ويفهم ببساطة أن كثرة الأشياء يجب ألا تُنسينا شكر الله.',
    objectiveAr: 'حفظ سورة التكاثر وترديدها آية آية مع معنى مبسّط.',
    objectivesAr: [
      'أَحْفَظُ سُورَةَ التَّكَاثُرِ.',
      'أَفْهَمُ أَنَّ الشُّكْرَ أَهَمُّ مِنْ جَمْعِ الأَشْيَاءِ فَقَطْ.',
      'أَرُدِّدُ الآيَاتِ بِهُدُوءٍ دُونَ تَفْسِيرٍ مُخِيفٍ.',
    ],
    discoveryAr: 'هل نحتاج دائماً ألعاباً أكثر لنكون سعداء؟ بماذا نشكر الله بدل التفاخر؟',
    rulesAr: [
      'سُورَةُ التَّكَاثُرِ تُذَكِّرُنَا أَلَّا نَنْشَغِلَ بِكَثْرَةِ الأَشْيَاءِ عَنِ الخَيْرِ.',
      'نَشْكُرُ اللَّهَ عَلَى مَا نَمْلِكُ: الصِّحَّةِ، العَائِلَةِ، الطَّعَامِ.',
      'نَحْفَظُ السُّورَةَ آيَةً آيَةً كَمَا فِي المُصْحَفِ.',
    ],
    examplesAr: [
      { problem: 'ما الخُلق الذي تعلّمنا إياه السورة ببساطة؟', solution: 'الشكر وعدم الانشغال بالتفاخر بالأشياء.' },
    ],
    detailedCourse: {
      introAr: 'التكاثر يعني التفاخر بالكثرة. السورة تذكّرنا بالشكر.',
      vocabulary: [
        { termAr: 'التَّكَاثُرُ', definitionAr: 'الانشغال بجمع الأشياء والتفاخر بها.' },
        { termAr: 'النَّعِيمُ', definitionAr: 'نعم الله التي نشكره عليها.' },
      ],
      visualizationHintAr: 'اقرأ الآية من الأداة، كرّرها، ثم انتقل للتالية. لا تشغيل صوت تلقائي.',
      commonMistakes: [
        { mistakeAr: 'حفظ السورة دون ربطها بالشكر اليومي.', correctionAr: 'بعد الحفظ: اذكر نعمة واحدة تشكر الله عليها.' },
      ],
      takeawayAr: 'أحفظ التكاثر وأشكر الله بدل التفاخر بما أملك.',
    },
    interactiveTool: 'islamic_lab',
    islamicInteractive: {
      type: 'quran_explorer',
      titleAr: 'سُورَةُ التَّكَاثُرِ',
      introAr: 'اقرأ السورة آية آية. اضغط على آية لترى معناها البسيط.',
      verses: SURAH_TAKATHUR,
    },
    progressiveExercises: [
      {
        id: 'ex1-isl2ap-takathur',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — أكتشف',
        problemAr: 'ماذا تعني كلمة التكاثر هنا ببساطة؟',
        hintsAr: ['كثرة الأشياء.'],
        solutionAr: 'التَّفَاخُرُ بِالكَثْرَةِ / جَمْعُ الأَشْيَاءِ',
        detailedCorrectionAr: 'الانشغال بكثرة الأشياء.',
        xpReward: 10,
      },
      {
        id: 'ex2-isl2ap-takathur',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'ماذا نفعل بدل التفاخر بالألعاب؟',
        hintsAr: ['خُلق تجاه نعم الله.'],
        solutionAr: 'نَشْكُرُ اللَّهَ',
        detailedCorrectionAr: 'نشكر الله على نعمه.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-isl-2ap-takathur',
      type: 'quiz_flash',
      titleAr: 'شكر لا تفاخر',
      instructionsAr: 'اختر التصرف الجميل!',
      items: [
        { questionOrPromptAr: 'عندك ألعاب كثيرة وصديقك لا', correctAnswerAr: 'أُشَارِكُهُ وَأَشْكُرُ اللَّهَ', optionsAr: ['أُشَارِكُهُ وَأَشْكُرُ اللَّهَ', 'أَتَفَاخَرُ عَلَيْهِ'], explanationAr: 'الشكر والمشاركة لا التفاخر.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-isl2ap-takathur',
        questionAr: 'سورة التكاثر تذكّرنا بـ:',
        options: [
          { id: 'a', textAr: 'الشُّكْرِ عَلَى النِّعَمِ', isCorrect: true, explanationAr: 'لا ننشغل بالتفاخر عن الشكر.' },
          { id: 'b', textAr: 'جَمْعِ الأَلْعَابِ فَقَطْ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
];
