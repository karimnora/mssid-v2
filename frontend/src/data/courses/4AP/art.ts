import { CourseLesson } from '../../../types';

export const ART_4AP: CourseLesson[] = [
  {
    id: 'art-4ap-t1-warm-cool-colors',
    grade: '4AP',
    subject: 'art',
    trimester: 1,
    categoryAr: 'نظرية الألوان',
    titleAr: 'الألوان الدافئة والباردة',
    summaryAr: 'تمييز الألوان الدافئة (أحمر، برتقالي، أصفر) والباردة (أزرق، أخضر، بنفسجي) واستعمالها في التعبير عن المشاعر والمناظر.',
    rulesAr: [
      'الألوان الدافئة تُذكّر بالشمس والحيوية.',
      'الألوان الباردة تُذكّر بالماء والهدوء.',
    ],
    examplesAr: [
      { problem: 'أي لون دافئ من: أزرق، أحمر، أخضر؟', solution: 'الأحمر.' },
    ],
    quiz: [
      {
        id: 'q1-art4ap-warm',
        questionAr: 'لرسم شاطئ مشمس نفضّل غالباً:',
        options: [
          { id: 'a', textAr: 'ألواناً دافئة', isCorrect: true, explanationAr: 'الدفء يعكس ضوء الشمس.' },
          { id: 'b', textAr: 'ألواناً باردة فقط', isCorrect: false, explanationAr: 'الباردة وحدها لا تعكس حرارة الشمس.' },
          { id: 'c', textAr: 'الأسود فقط', isCorrect: false, explanationAr: 'الأسود ليس لوناً دافئاً أو بارداً بالمعنى المعتاد.' },
        ],
      },
    ],
  },
  {
    id: 'art-4ap-t2-perspective-simple',
    grade: '4AP',
    subject: 'art',
    trimester: 2,
    categoryAr: 'المنظور البسيط',
    titleAr: 'الأمام والخلف: المنظور البسيط',
    summaryAr: 'وضع الأشياء القريبة أسفل اللوحة وأكبر حجماً، والبعيدة أعلى وأصغر لإيحاء العمق.',
    rulesAr: [
      'القريب يكون أكبر وأسفل في اللوحة.',
      'البعيد يكون أصغر وأعلى نحو الأفق.',
    ],
    examplesAr: [
      { problem: 'أين نرسم الشجرة القريبة في اللوحة؟', solution: 'أسفل وأكبر من الشجرة البعيدة.' },
    ],
    quiz: [
      {
        id: 'q1-art4ap-perspective',
        questionAr: 'لإيحاء البعد في رسم طريق نجعل الطريق:',
        options: [
          { id: 'a', textAr: 'يضيق ويصغر نحو الأفق', isCorrect: true, explanationAr: 'هذا يُوحي بالعمق والبعد.' },
          { id: 'b', textAr: 'بعرض ثابت من الأسفل للأعلى', isCorrect: false, explanationAr: 'العرض الثابت لا يُظهر البعد.' },
          { id: 'c', textAr: 'مختفياً تماماً', isCorrect: false, explanationAr: 'يجب أن يبقى الطريق مرئياً.' },
        ],
      },
    ],
  },
  {
    id: 'art-4ap-t3-pottery-crafts',
    grade: '4AP',
    subject: 'art',
    trimester: 3,
    categoryAr: 'الحرف التراثية',
    titleAr: 'الفخار والحرف اليدوية الجزائرية',
    summaryAr: 'اكتشاف أشكال الفخار التقليدي (القصعة، الجرة) وزخرفتها بخطوط ونقوش مستوحاة من التراث.',
    rulesAr: [
      'الفخار يُشكَّل باليد أو على الدولاب ثم يُجفَّف ويُحرق.',
      'الزخرفة على الفخار غالباً متكررة ومتناظرة.',
    ],
    examplesAr: [
      { problem: 'ما أداة تقليدية لحفظ الماء في البيت القديم؟', solution: 'الجرة الفخارية.' },
    ],
    quiz: [
      {
        id: 'q1-art4ap-pottery',
        questionAr: 'زخرفة الفخار التقليدي غالباً تكون:',
        options: [
          { id: 'a', textAr: 'متكررة ومتناظرة', isCorrect: true, explanationAr: 'التناظر جزء من جمال الحرف اليدوية.' },
          { id: 'b', textAr: 'عشوائية بلا نظام', isCorrect: false, explanationAr: 'الحرفيون يتبعون أنماطاً محفوظة.' },
          { id: 'c', textAr: 'بالحبر على الورق', isCorrect: false, explanationAr: 'الزخرفة على الفخار لا على الورق.' },
        ],
      },
    ],
  },
];
