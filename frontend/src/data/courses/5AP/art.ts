import { CourseLesson } from '../../../types';

export const ART_5AP: CourseLesson[] = [
  {
    id: 'art-5ap-t1-complementary-colors',
    grade: '5AP',
    subject: 'art',
    trimester: 1,
    categoryAr: 'تناغم الألوان',
    titleAr: 'الألوان المتكاملة والتباين',
    summaryAr: 'استعمال الألوان المتقابلة على دائرة الألوان (أحمر/أخضر، أزرق/برتقالي) لإبراز العناصر في اللوحة.',
    rulesAr: [
      'اللون المتكامل يقابل لوناً على الدائرة ويُبرِزه عند وضعهما معاً.',
      'التباين القوي يجذب العين نحو موضوع اللوحة.',
    ],
    examplesAr: [
      { problem: 'ما اللون المتكامل للأحمر تقريباً؟', solution: 'الأخضر.' },
    ],
    quiz: [
      {
        id: 'q1-art5ap-complement',
        questionAr: 'لإبراز دائرة حمراء نضع خلفية:',
        options: [
          { id: 'a', textAr: 'خضراء', isCorrect: true, explanationAr: 'الأخضر والأحمر متكاملان.' },
          { id: 'b', textAr: 'حمراء أيضاً', isCorrect: false, explanationAr: 'نفس اللون يُخفِي التباين.' },
          { id: 'c', textAr: 'رمادية فقط', isCorrect: false, explanationAr: 'الرمادي محايد وليس تكاملاً قوياً.' },
        ],
      },
    ],
  },
  {
    id: 'art-5ap-t2-portrait-proportion',
    grade: '5AP',
    subject: 'art',
    trimester: 2,
    categoryAr: 'رسم الوجه',
    titleAr: 'نسب الوجه البسيطة',
    summaryAr: 'تقسيم الوجه: العينان في منتصف الرأس، الأنف في المنتصف، الفم بين الأنف والذقن.',
    rulesAr: [
      'العينان على خط أفقي في منتصف الوجه تقريباً.',
      'الأذنان بين خط العين وخط الأنف.',
    ],
    examplesAr: [
      { problem: 'أين نضع العينين في رسم وجه مبسّط؟', solution: 'في منتصف ارتفاع الرأس تقريباً.' },
    ],
    quiz: [
      {
        id: 'q1-art5ap-face',
        questionAr: 'في رسم وجه مبسّط يكون الأنف:',
        options: [
          { id: 'a', textAr: 'في منتصف الوجه تقريباً', isCorrect: true, explanationAr: 'هذه قاعدة تناسب مبسّطة شائعة.' },
          { id: 'b', textAr: 'على الجبهة', isCorrect: false, explanationAr: 'الأنف ليس على الجبهة.' },
          { id: 'c', textAr: 'تحت الذقن', isCorrect: false, explanationAr: 'الأنف في منتصف الوجه لا تحت الذقن.' },
        ],
      },
    ],
  },
  {
    id: 'art-5ap-t3-heritage-mural',
    grade: '5AP',
    subject: 'art',
    trimester: 3,
    categoryAr: 'الفن التراثي المعاصر',
    titleAr: 'جدارية تراثية: العلم والرموز الوطنية',
    summaryAr: 'تصميم جدارية جماعية تجمع الرموز الوطنية (العلم، النجمة والهلال، القصبة) بأسلوب فني منظم.',
    rulesAr: [
      'الجدارية الجماعية تحتاج خطة ألوان موحّدة.',
      'الرموز الوطنية تُرسم باحترام وتناسق.',
    ],
    examplesAr: [
      { problem: 'ما لون العلم الجزائري؟', solution: 'أخضر وأبيض مع هلال ونجمة حمراء.' },
    ],
    quiz: [
      {
        id: 'q1-art5ap-mural',
        questionAr: 'قبل رسم جدارية جماعية نبدأ بـ:',
        options: [
          { id: 'a', textAr: 'رسم تخطيطي وتوزيع المساحات', isCorrect: true, explanationAr: 'التخطيط يمنع الفوضى في العمل الجماعي.' },
          { id: 'b', textAr: 'اللون العشوائي دون خطة', isCorrect: false, explanationAr: 'العشوائية تُفسد التناسق.' },
          { id: 'c', textAr: 'نسيان موضوع الجدارية', isCorrect: false, explanationAr: 'الموضوع أساس العمل الفني.' },
        ],
      },
    ],
  },
];
