import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ لسنة ثانية: الوثائق الشخصية (بطاقة التعريف، دفتر العائلة). الدينار كرمز موجود في درس الرموز الوطنية.';

export const CIVICS_2AP_GAPS: CourseLesson[] = [
  {
    id: 'civics-2ap-t1-personal-documents',
    grade: '2AP',
    subject: 'civics',
    trimester: 1,
    domainAr: 'الهوية والوثائق',
    sequenceAr: 'السلسلة 3: وثائقي الشخصية',
    categoryAr: 'التربية المدنية - الهوية',
    titleAr: 'وَثَائِقِي: بِطَاقَةُ التَّعْرِيفِ وَدَفْتَرُ العَائِلَةِ 🪪',
    summaryAr: 'يتعرّف التلميذ على وثائق الهوية الرسمية للأسرة: بطاقة التعريف الوطنية ودفتر العائلة، دون بيانات حقيقية.',
    objectiveAr: 'تسمية وثيقتين رسميتين وفهم أنهما تخصّان الهوية ولا نلعب بهما.',
    objectivesAr: [
      'أُسَمِّي بِطَاقَةَ التَّعْرِيفِ الوَطَنِيَّةَ.',
      'أُسَمِّي دَفْتَرَ العَائِلَةِ.',
      'أَعْرِفُ أَنَّ الوَثَائِقَ تُحْفَظُ عِنْدَ الوَالِدَيْنِ وَلَا نُضَيِّعُهَا.',
    ],
    discoveryAr: 'عندما يطلب الموظف في البلدية «دفتر العائلة»، ماذا يُخرج الأب أو الأم من الحقيبة؟',
    rulesAr: [
      'بِطَاقَةُ التَّعْرِيفِ الوَطَنِيَّةُ: بطاقة رسمية تحمل اسم الشخص وصورته، للراشدين غالباً.',
      'دَفْتَرُ العَائِلَةِ: دفتر تسجَّل فيه الأسرة (الوالدان والأبناء).',
      'البِطَاقَةُ المَدْرَسِيَّةُ مُخْتَلِفَةٌ: تُعرِّف بي في المدرسة فقط.',
      'لَا نَرْسُمُ عَلَى الوَثَائِقِ وَلَا نُعْطِيهَا لِغَرِيبٍ.',
    ],
    examplesAr: [
      { problem: 'أين تُستعمل بطاقة التعريف غالباً؟', solution: 'لإثبات الهوية عند المصالح الرسمية (مع راشد).' },
      { problem: 'هل دفتر العائلة لعبة؟', solution: 'لا، وثيقة رسمية نحفظها.' },
    ],
    detailedCourse: {
      introAr: 'لكل أسرة أوراق تثبت من نحن. الطفل يعرف أسماءها ويحترمها؛ الوالدان يحتفظان بها.',
      vocabulary: [
        { termAr: 'بِطَاقَةُ التَّعْرِيفِ 🪪', definitionAr: 'بطاقة رسمية للهوية.' },
        { termAr: 'دَفْتَرُ العَائِلَةِ 📘', definitionAr: 'دفتر تسجَّل فيه أفراد الأسرة.' },
      ],
      visualizationHintAr: 'أرِ نموذجاً فارغاً أو صورة عامة — لا تمسح بيانات حقيقية على الشاشة.',
      commonMistakes: [
        { mistakeAr: 'خلط البطاقة المدرسية ببطاقة التعريف الوطنية.', correctionAr: 'المدرسية للمدرسة فقط. التعريف وثيقة الدولة للراشد.' },
      ],
      takeawayAr: 'بطاقة تعريف + دفتر عائلة = وثائق رسمية. نحفظها، لا نلعب بها.',
    },
    interactiveTool: 'civics_lab',
    civicsInteractive: {
      type: 'institution_cards',
      titleAr: 'بطاقات وثائقي',
      introAr: 'تعرّف على وثائق الأسرة الرسمية.',
      cards: [
        { nameAr: 'بِطَاقَةُ التَّعْرِيفِ', iconEmoji: '🪪', roleAr: 'هُوِيَّةُ الرَّاشِدِ', detailsAr: 'اسم وصورة. وثيقة الدولة. لا نلعب بها.' },
        { nameAr: 'دَفْتَرُ العَائِلَةِ', iconEmoji: '📘', roleAr: 'وَثِيقَةُ الأُسْرَةِ', detailsAr: 'يُسجَّل فيه الوالدان والأبناء.' },
        { nameAr: 'البِطَاقَةُ المَدْرَسِيَّةُ', iconEmoji: '🏫', roleAr: 'هُوِيَّةٌ فِي المَدْرَسَةِ', detailsAr: 'تُعرِّف بي عند المعلم والحارس فقط.' },
      ],
    },
    progressiveExercises: [
      {
        id: 'ex1-civics2ap-docs',
        level: 1,
        levelLabelAr: '🟢 المستوى 1 — أكتشف',
        problemAr: 'ما اسم الدفتر الذي تُسجَّل فيه الأسرة؟',
        hintsAr: ['دفتر…'],
        solutionAr: 'دَفْتَرُ العَائِلَةِ',
        detailedCorrectionAr: 'دفتر العائلة وثيقة الأسرة.',
        xpReward: 10,
      },
      {
        id: 'ex2-civics2ap-docs',
        level: 2,
        levelLabelAr: '🟡 المستوى 2 — أتدرب',
        problemAr: 'هل نعطي دفتر العائلة لصديق في الساحة؟',
        hintsAr: ['وثيقة رسمية.'],
        solutionAr: 'لَا',
        detailedCorrectionAr: 'الوثائق تبقى عند الوالدين.',
        xpReward: 15,
      },
    ],
    educationalGame: {
      id: 'game-civics2ap-docs',
      type: 'quiz_flash',
      titleAr: 'أي وثيقة؟',
      instructionsAr: 'اختر الوثيقة المناسبة!',
      items: [
        { questionOrPromptAr: 'تُعرِّف بي داخل المدرسة', correctAnswerAr: 'البِطَاقَةُ المَدْرَسِيَّةُ', optionsAr: ['البِطَاقَةُ المَدْرَسِيَّةُ', 'دَفْتَرُ العَائِلَةِ'], explanationAr: 'المدرسية للمدرسة.' },
        { questionOrPromptAr: 'يُسجَّل فيها الإخوة', correctAnswerAr: 'دَفْتَرُ العَائِلَةِ', optionsAr: ['دَفْتَرُ العَائِلَةِ', 'البِطَاقَةُ المَدْرَسِيَّةُ'], explanationAr: 'دفتر العائلة.' },
      ],
      xpReward: 20,
    },
    quiz: [
      {
        id: 'q1-civics2ap-docs',
        questionAr: 'بطاقة التعريف الوطنية هي:',
        options: [
          { id: 'a', textAr: 'وَثِيقَةٌ رَسْمِيَّةٌ لِلهُوِيَّةِ', isCorrect: true, explanationAr: 'وثيقة دولة، ليست لعبة.' },
          { id: 'b', textAr: 'بِطَاقَةُ لَعِبٍ', isCorrect: false },
        ],
      },
    ],
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
  },
];
