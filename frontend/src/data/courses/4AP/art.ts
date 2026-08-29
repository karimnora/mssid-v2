import { CourseLesson } from '../../../types';
import { build4ApPractice } from './4apExercisePack';

export const ART_4AP: CourseLesson[] = [
  {
    id: 'art-4ap-t1-warm-cool-colors',
    grade: '4AP',
    subject: 'art',
    trimester: 1,
    categoryAr: 'نظرية الألوان',
    titleAr: 'الألوان الدافئة والباردة',
    summaryAr: 'تمييز الألوان الدافئة (أحمر، برتقالي، أصفر) والباردة (أزرق، أخضر، بنفسجي) واستعمالها في التعبير عن المشاعر والمناظر.',
    detailedCourse: {
      introAr: 'الألوان الدافئة تُشعرنا بالحرارة والحيوية (كالشمس والنار)، والألوان الباردة تُشعرنا بالهدوء والانتعاش (كالماء والسماء).',
      vocabulary: [
        { termAr: 'الألوان الدافئة 🔥', definitionAr: 'أحمر، برتقالي، أصفر — تُذكّر بالشمس والنار.' },
        { termAr: 'الألوان الباردة 💧', definitionAr: 'أزرق، أخضر، بنفسجي — تُذكّر بالماء والهدوء.' },
      ],
      visualizationHintAr: 'ارسم شمساً بألوان دافئة وبحراً بألوان باردة في نفس اللوحة — لاحظ الفرق في الإحساس الذي يتركه كل جانب.',
      commonMistakes: [
        { mistakeAr: 'الاعتقاد أن الأخضر لون دافئ.', correctionAr: 'الأخضر لون بارد لأنه يذكرنا بالطبيعة والماء لا بالنار.' },
      ],
      takeawayAr: 'الدافئة (أحمر/برتقالي/أصفر) = حرارة وحيوية. الباردة (أزرق/أخضر/بنفسجي) = هدوء وانتعاش.',
    },
    rulesAr: [
      'الألوان الدافئة تُذكّر بالشمس والحيوية.',
      'الألوان الباردة تُذكّر بالماء والهدوء.',
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر الألوان الدافئة والباردة 🌡️',
      instructionsAr: 'اربط كل لون بفئته!',
      pairs: [
        { leftAr: 'الأحمر 🔴', rightAr: 'لون دافئ', explanationAr: 'الأحمر يذكرنا بالنار والحرارة.' },
        { leftAr: 'الأزرق 🔵', rightAr: 'لون بارد', explanationAr: 'الأزرق يذكرنا بالماء والهدوء.' },
        { leftAr: 'الأصفر 🟡', rightAr: 'لون دافئ', explanationAr: 'الأصفر يذكرنا بالشمس.' },
      ],
    },
    examplesAr: [
      { problem: 'أي لون دافئ من: أزرق، أحمر، أخضر؟', solution: 'الأحمر.' },
    ],
    ...build4ApPractice(
      'art-4ap-t1-warm-cool-colors',
      [
        { problemAr: 'أي الألوان التالية دافئ: الأزرق أم الأحمر؟', solutionAr: 'الأحمر', detailedCorrectionAr: 'الأحمر لون دافئ يذكرنا بالنار.', options: [{ id: 'a', textAr: 'الأحمر', isCorrect: true }, { id: 'b', textAr: 'الأزرق', isCorrect: false }] },
        { problemAr: 'البحر يُرسم عادة بألوان ....', solutionAr: 'باردة', detailedCorrectionAr: 'الأزرق والأخضر ألوان باردة تناسب رسم البحر.', type: 'fill_blank', fillBlankAnswerAr: 'باردة' },
        { problemAr: 'الأخضر لون بارد. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'صحيح، الأخضر بارد لأنه يذكرنا بالطبيعة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'لرسم مشهد غروب الشمس (حار ومشرق)، أي مجموعة ألوان تختار؟', solutionAr: 'أحمر، برتقالي، أصفر', detailedCorrectionAr: 'الألوان الدافئة تُعبّر عن حرارة وضوء الغروب.', options: [{ id: 'a', textAr: 'أحمر، برتقالي، أصفر', isCorrect: true }, { id: 'b', textAr: 'أزرق، أخضر، بنفسجي', isCorrect: false }] },
      ],
      [
        { problemAr: 'الأزرق والأخضر من الألوان الباردة. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'كلاهما يذكرنا بالماء والطبيعة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'أي لون من هذه القائمة دافئ؟', solutionAr: 'برتقالي', detailedCorrectionAr: 'البرتقالي لون دافئ.', options: [{ id: 'a', textAr: 'برتقالي', isCorrect: true }, { id: 'b', textAr: 'أزرق', isCorrect: false }] },
      ],
    ),
    educationalGame: {
      id: 'game-art4ap-warm-cool',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي الألوان الدافئة والباردة',
      instructionsAr: 'اختر الإجابة الصحيحة بسرعة!',
      items: [
        { questionOrPromptAr: 'الشمس تُرسم عادة بألوان...', correctAnswerAr: 'دافئة', optionsAr: ['دافئة', 'باردة'], explanationAr: 'الشمس ساطعة وحارة، تُرسم بالأصفر والبرتقالي.' },
        { questionOrPromptAr: 'لون يذكرنا بالهدوء والماء:', correctAnswerAr: 'الأزرق', optionsAr: ['الأزرق', 'الأحمر', 'الأصفر'], explanationAr: 'الأزرق لون بارد يوحي بالهدوء.' },
      ],
      xpReward: 20,
    },
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
    detailedCourse: {
      introAr: 'المنظور البسيط طريقة لإيهام العين بالعمق في لوحة مسطحة: القريب كبير في الأسفل، والبعيد صغير في الأعلى نحو خط الأفق.',
      vocabulary: [
        { termAr: 'المنظور 👁️', definitionAr: 'أسلوب رسم يعطي إحساساً بالعمق والمسافة في لوحة مسطحة.' },
        { termAr: 'خط الأفق', definitionAr: 'الخط البعيد حيث تبدو الأشياء صغيرة جداً أو تختفي.' },
      ],
      visualizationHintAr: 'ارسم طريقاً يبدأ عريضاً في أسفل الورقة ويضيق تدريجياً كلما اقترب من الأعلى.',
      commonMistakes: [
        { mistakeAr: 'رسم كل عناصر الطريق بنفس العرض.', correctionAr: 'يجب أن يضيق الطريق تدريجياً كلما ابتعد ليوحي بالعمق.' },
      ],
      takeawayAr: 'القريب: كبير وأسفل اللوحة. البعيد: صغير وأعلى نحو الأفق.',
    },
    rulesAr: [
      'القريب يكون أكبر وأسفل في اللوحة.',
      'البعيد يكون أصغر وأعلى نحو الأفق.',
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر المنظور البسيط 👁️',
      instructionsAr: 'اربط كل موقع في اللوحة بحجم العنصر المناسب!',
      pairs: [
        { leftAr: 'عنصر قريب (أسفل اللوحة)', rightAr: 'حجم كبير', explanationAr: 'القريب من الناظر يُرسم أكبر.' },
        { leftAr: 'عنصر بعيد (قرب الأفق)', rightAr: 'حجم صغير', explanationAr: 'البعيد عن الناظر يُرسم أصغر.' },
        { leftAr: 'خط الأفق', rightAr: 'أبعد نقطة في اللوحة', explanationAr: 'خط الأفق هو أبعد ما تراه العين.' },
      ],
    },
    examplesAr: [
      { problem: 'أين نرسم الشجرة القريبة في اللوحة؟', solution: 'أسفل وأكبر من الشجرة البعيدة.' },
    ],
    ...build4ApPractice(
      'art-4ap-t2-perspective-simple',
      [
        { problemAr: 'أين نرسم الشجرة القريبة في اللوحة؟', solutionAr: 'أسفل وكبيرة', detailedCorrectionAr: 'العنصر القريب يُرسم في الأسفل وبحجم كبير.', options: [{ id: 'a', textAr: 'أسفل وكبيرة', isCorrect: true }, { id: 'b', textAr: 'أعلى وصغيرة', isCorrect: false }] },
        { problemAr: 'الطريق البعيد نحو الأفق يبدو ....', solutionAr: 'ضيقاً', detailedCorrectionAr: 'كلما ابتعد الطريق ضاق تدريجياً نحو الأفق.', type: 'fill_blank', fillBlankAnswerAr: 'ضيقاً' },
        { problemAr: 'كل عناصر اللوحة تُرسم بنفس الحجم في المنظور البسيط. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'المنظور يعتمد بالضبط على تغيير الحجم حسب المسافة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: 'لرسم شارع طويل يمتد بعيداً، ماذا تفعل بعرضه كلما اقترب من الأفق؟', solutionAr: 'أُضيّقه تدريجياً', detailedCorrectionAr: 'تضييق العرض تدريجياً يعطي إحساساً بالعمق والمسافة.', options: [{ id: 'a', textAr: 'أُضيّقه تدريجياً', isCorrect: true }, { id: 'b', textAr: 'أُوسّعه', isCorrect: false }] },
      ],
      [
        { problemAr: 'العنصر البعيد يُرسم أصغر من القريب. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'هذا أساس المنظور البسيط.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'خط الأفق هو:', solutionAr: 'أبعد خط تراه العين', detailedCorrectionAr: 'عنده تبدو الأشياء صغيرة جداً أو تختفي.', options: [{ id: 'a', textAr: 'أبعد خط تراه العين', isCorrect: true }, { id: 'b', textAr: 'أقرب نقطة في اللوحة', isCorrect: false }] },
      ],
    ),
    educationalGame: {
      id: 'game-art4ap-perspective',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي المنظور البسيط',
      instructionsAr: 'اختر الإجابة الصحيحة بسرعة!',
      items: [
        { questionOrPromptAr: 'لإيحاء البعد نجعل الطريق نحو الأفق:', correctAnswerAr: 'يضيق ويصغر', optionsAr: ['يضيق ويصغر', 'يتسع ويكبر'], explanationAr: 'التضييق التدريجي يوحي بالمسافة.' },
        { questionOrPromptAr: 'العنصر في أسفل اللوحة عادة يكون:', correctAnswerAr: 'قريباً وكبيراً', optionsAr: ['قريباً وكبيراً', 'بعيداً وصغيراً'], explanationAr: 'أسفل اللوحة يمثل المقدمة القريبة.' },
      ],
      xpReward: 20,
    },
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
    detailedCourse: {
      introAr: 'الفخار حرفة جزائرية عريقة: يُشكَّل الطين باليد أو على الدولاب، ثم يُجفَّف ويُحرق، وأخيراً يُزخرف بنقوش تراثية.',
      vocabulary: [
        { termAr: 'الفخار 🏺', definitionAr: 'أواني مصنوعة من الطين المُشكَّل والمُحرَق، كالجرة والقصعة.' },
        { termAr: 'الدولاب', definitionAr: 'أداة دائرية دوّارة يستعملها الحرفي لتشكيل الطين بانتظام.' },
      ],
      visualizationHintAr: 'تخيل قطعة طين تدور على الدولاب بينما تُشكّلها يدا الحرفي إلى جرة مستديرة.',
      commonMistakes: [
        { mistakeAr: 'الاعتقاد أن الفخار يُصنع من الخشب.', correctionAr: 'الفخار يُصنع من الطين، وليس من الخشب أو المعدن.' },
      ],
      takeawayAr: 'الفخار: طين يُشكَّل ويُجفَّف ويُحرق ثم يُزخرف بنقوش متكررة ومتناظرة.',
    },
    rulesAr: [
      'الفخار يُشكَّل باليد أو على الدولاب ثم يُجفَّف ويُحرق.',
      'الزخرفة على الفخار غالباً متكررة ومتناظرة.',
    ],
    interactiveTool: 'science_lab',
    gameplay_simulation: {
      type: 'matching_lab',
      titleAr: 'مختبر الفخار والحرف اليدوية 🏺',
      instructionsAr: 'اربط كل أداة أو مادة بدورها في صناعة الفخار!',
      pairs: [
        { leftAr: 'الطين', rightAr: 'المادة الأولية للفخار', explanationAr: 'الفخار يُصنع أساساً من الطين.' },
        { leftAr: 'الدولاب 🌀', rightAr: 'تشكيل الإناء بانتظام', explanationAr: 'الدولاب الدوّار يساعد الحرفي على تشكيل جدران متساوية.' },
        { leftAr: 'الفرن', rightAr: 'حرق وتصليب الفخار', explanationAr: 'الحرق يجعل الطين صلباً ومتيناً.' },
      ],
    },
    examplesAr: [
      { problem: 'ما أداة تقليدية لحفظ الماء في البيت القديم؟', solution: 'الجرة الفخارية.' },
    ],
    ...build4ApPractice(
      'art-4ap-t3-pottery-crafts',
      [
        { problemAr: 'من أي مادة يُصنع الفخار؟', solutionAr: 'الطين', detailedCorrectionAr: 'الطين هو المادة الأساسية للفخار.', options: [{ id: 'a', textAr: 'الطين', isCorrect: true }, { id: 'b', textAr: 'الخشب', isCorrect: false }] },
        { problemAr: 'الأداة الدائرية التي تساعد الحرفي على تشكيل الإناء تُسمى ....', solutionAr: 'الدولاب', detailedCorrectionAr: 'الدولاب الدوّار يساعد على تشكيل جدران متساوية.', type: 'fill_blank', fillBlankAnswerAr: 'الدولاب' },
        { problemAr: 'يُحرق الفخار بعد تجفيفه ليصبح صلباً. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'الحرق في الفرن يجعل الطين صلباً ومتيناً.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'ما الأداة التقليدية الجزائرية لحفظ الماء باردة في البيت القديم؟', solutionAr: 'الجرة الفخارية', detailedCorrectionAr: 'الجرة الفخارية كانت تُستعمل لحفظ الماء بارداً.', options: [{ id: 'a', textAr: 'الجرة الفخارية', isCorrect: true }, { id: 'b', textAr: 'صندوق خشبي', isCorrect: false }] },
      ],
      [
        { problemAr: 'زخرفة الفخار التقليدي غالباً عشوائية بلا نظام. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'الزخرفة غالباً متكررة ومتناظرة، وليست عشوائية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: 'القصعة والجرة أمثلة على:', solutionAr: 'أواني فخارية تقليدية', detailedCorrectionAr: 'كلاهما من أدوات الفخار التقليدي الجزائري.', options: [{ id: 'a', textAr: 'أواني فخارية تقليدية', isCorrect: true }, { id: 'b', textAr: 'أدوات معدنية حديثة', isCorrect: false }] },
      ],
    ),
    educationalGame: {
      id: 'game-art4ap-pottery',
      type: 'quiz_flash',
      titleAr: '🎮 تحدي الفخار والحرف اليدوية',
      instructionsAr: 'اختر الإجابة الصحيحة بسرعة!',
      items: [
        { questionOrPromptAr: 'الفخار يُصنع من:', correctAnswerAr: 'الطين', optionsAr: ['الطين', 'الزجاج', 'المعدن'], explanationAr: 'الطين هو المادة الأساسية للفخار.' },
        { questionOrPromptAr: 'زخرفة الفخار التقليدي غالباً تكون:', correctAnswerAr: 'متكررة ومتناظرة', optionsAr: ['متكررة ومتناظرة', 'عشوائية'], explanationAr: 'الحرفيون يتبعون أنماطاً محفوظة ومتكررة.' },
      ],
      xpReward: 20,
    },
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
