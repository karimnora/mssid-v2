import { CourseLesson } from '../../../types';

export const TAMAZIGHT_3AP: CourseLesson[] = [
  {
    id: 'tamazight-3ap-initiation-lettres-formes',
    grade: '3AP',
    subject: 'tamazight',
    trimester: 1,
    categoryAr: 'Asenfar 1 : Agemmay d Tira (مشروع 1: اكتشاف حروف التيفيناغ)',
    titleAr: 'Tussna n Yisekkilen n Tifinagh (التعرف على حروف التيفيناغ وأشكالها)',
    summaryAr: 'مدخل مبسط وشيق للأطفال لاكتشاف أشكال حروف التيفيناغ الهندسية (الدوائر، الخطوط، النقاط) ونطقها ومقارنتها بالحروف العربية واللاتينية.',
    objectivesAr: [
      'التعرف على الحروف البصرية الأولى: ⴰ (A)، ⴱ (B)، ⵎ (M)، ⵜ (T)، ⵣ (Z).',
      'رسم الحروف الهندسية بدقة ومتعة.',
      'قراءة مقاطع صوتية بسيطة وكلمات أولى.',
    ],
    detailedCourse: {
      introAr: 'مرحباً بكم في عالم التيفيناغ! حروف لغتنا الأمازيغية تشبه لوحات فنية جميلة مستوحاة من رموز الطبيعة والنقوش التراثية الجزائرية.',
      vocabulary: [
        { termAr: 'Asekkil (ⴰⵙⴻⴽⴽⵉⵍ)', definitionAr: 'الحرف الواحد.' },
        { termAr: 'Tira (ⵜⵉⵔⴰ)', definitionAr: 'الرسم والكتابة.' },
        { termAr: 'Aman (ⴰⵎⴰⵏ)', definitionAr: 'الماء الصافي.' },
        { termAr: 'Azul (ⴰⵣⵓⵍ)', definitionAr: 'مرحباً وسلاماً.' },
      ],
      visualizationHintAr: 'الحرف ⵔ دائرة مثل القمر 🌕، والحرف + مثل الزائد (T)، والحرف ⵣ رمز الفرح والحرية.',
      commonMistakes: [
        {
          mistakeAr: 'كتابة الحروف من اليمين إلى اليسار.',
          correctionAr: 'تكتب التيفيناغ واللاتينية في المدرسة الجزائرية من اليسار إلى اليمين (LTR).',
        },
      ],
      takeawayAr: 'ⴰ = A, ⴱ = B, ⵎ = M, ⵜ = T, ⵣ = Z.',
    },
    rulesAr: [
      'حرف ⴰ ينطق مثل الألف المفتوحة (A) : Aman (ماء).',
      'حرف ⴱ ينطق مثل الباء (B) : Baba (أبي).',
      'حرف ⵎ ينطق مثل الميم (M) : Mraw (عشرة).',
      'حرف ⵜ ينطق مثل التاء (T) : Taddart (قرية).',
    ],
    keyFormulas: [
      { labelAr: 'الحروف الأولى الأساسية', formulaAr: 'ⴰ (A) - ⴱ (B) - ⵎ (M) - ⵜ (T) - ⵣ (Z)' },
    ],
    examplesAr: [
      {
        problem: 'ما هو الحرف الأول في كلمة « ⴰⵎⴰⵏ » (Aman) ؟',
        solution: 'الحرف هو ⴰ (A) ويعني الماء.',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'أي من الحروف التالية يمثل حرف الميم (M) بالتيفيناغ ؟',
        options: [
          { id: 'a', textAr: 'ⵎ (Yam / M)', isCorrect: true, explanationAr: 'أحسنت! ⵎ هو حرف الميم التيفيناغي.' },
          { id: 'b', textAr: 'ⴰ (A)', isCorrect: false },
          { id: 'c', textAr: 'ⴱ (B)', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-3ap-couleurs-nature',
    grade: '3AP',
    subject: 'tamazight',
    trimester: 2,
    categoryAr: 'Asenfar 2 : Initen d Ugama (مشروع 2: الألوان والطبيعة)',
    titleAr: 'Initen n Ugama (الألوان وعناصر الطبيعة بالأمازيغية)',
    summaryAr: 'تعلّم تسميات الألوان (الأخضر، الأزرق، الأصفر، الأحمر، الأبيض، الأسود) وعناصر الطبيعة الجميلة كالماء والشمس والجبل.',
    objectivesAr: [
      'تسمية الألوان الأساسية: Azegzaw (أخضر), Anili/Azegzaw (أزرق), Awragh (أصفر), Azeggaɣ (أحمر), Amellal (أبيض), Aberkan (أسود).',
      'وصف أشياء الطبيعة بألوانها.',
    ],
    detailedCourse: {
      introAr: 'طبيعة بلادنا الجزائرية ملونة ورائعة: الجبال الخضراء، الصحراء الذهبية، والبحر الأزرق!',
      vocabulary: [
        { termAr: 'Azegza (ⴰⵣⴻⴳⵣⴰ)', definitionAr: 'الأخضر (لون أوراق الشجر).' },
        { termAr: 'Azeggaɣ (ⴰⵣⴻⴳⴳⴰⵖ)', definitionAr: 'الأحمر (لون الورد والرمان).' },
        { termAr: 'Awraɣ (ⴰⵡⵔⴰⵖ)', definitionAr: 'الأصفر (لون الرمال والشمس).' },
        { termAr: 'Amellal (ⴰⵎⴻⵍⵍⴰⵍ)', definitionAr: 'الأبيض (لون الثلج الصافي).' },
        { termAr: 'Aberkan (ⴰⴱⴻⵔⴽⴰⵏ)', definitionAr: 'الأسود (لون الليل).' },
      ],
      visualizationHintAr: 'العلم الوطني: Azegzaw (أخضر) + Amellal (أبيض) + Azeggaɣ (نجمة وهلال أحمر).',
      commonMistakes: [
        {
          mistakeAr: 'الخلط بين Azegza (أخضر) و Azeggaɣ (أحمر).',
          correctionAr: 'Azegza فيه حرف الزاي (أخضر) بينما Azeggaɣ فيه حرف الغين المضخم (أحمر).',
        },
      ],
      takeawayAr: 'العلم الجزائري يجمع: الأخضر (Azegzaw)، الأبيض (Amellal)، والأحمر (Azeggaɣ).',
    },
    rulesAr: [
      'Azegzaw = أخضر',
      'Azeggaɣ = أحمر',
      'Awraɣ = أصفر',
      'Amellal = أبيض',
      'Aberkan = أسود',
    ],
    keyFormulas: [
      { labelAr: 'ألوان الراية الوطنية الجزائرية', formulaAr: 'Azegzaw (أخضر) + Amellal (أبيض) + Azeggaɣ (أحمر)' },
    ],
    examplesAr: [
      {
        problem: 'ما هو لون الثلج على قمم جرجرة بالأمازيغية؟',
        solution: 'Amellal (أبيض ناصع).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ماذا يعني اللون « Azegzaw » (ⴰⵣⴻⴳⵣⴰⵡ) ؟',
        options: [
          { id: 'a', textAr: 'الأخضر', isCorrect: true, explanationAr: 'ممتاز! Azegzaw هو اللون الأخضر لون الطبيعة والربيع.' },
          { id: 'b', textAr: 'الأصفر', isCorrect: false },
          { id: 'c', textAr: 'الأسود', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-3ap-corps-animaux',
    grade: '3AP',
    subject: 'tamazight',
    trimester: 3,
    categoryAr: 'Asenfar 3 : Tafekka d Yiɣersiwen (مشروع 3: جسم الإنسان والحيوانات الأليفة)',
    titleAr: 'Tafekka-inu d Yiɣersiwen (أعضاء الجسم والحيوانات المحبوبة)',
    summaryAr: 'تسمية أعضاء الجسم الأساسية (الرأس، العين، اليد، القدم، القلب) والحيوانات الأليفة في البيئة الجزائرية.',
    objectivesAr: [
      'تسمية أعضاء الجسم: Aqerru (الرأس), Tiṭ (العين), Afus (اليد), Aḍar (الرجل), Ul (القلب).',
      'تسمية الحيوانات الأليفة: Amcic (القط), Aqjun (الكلب), Aydi (الكلب), Aserdun (البغل), Taɣaṭ (العنزة).',
    ],
    detailedCourse: {
      introAr: 'جسمنا هبة عظيمة نتنقل به ونكتشف العالم، وحيوانات الريف والواحات أصدقاء مخلصون للإنسان.',
      vocabulary: [
        { termAr: 'Afus (ⴰⴼⵓⵙ)', definitionAr: 'اليد (أداة العمل والتحية).' },
        { termAr: 'Aḍar (ⴰⴹⴰⵕ)', definitionAr: 'القدم / الرجل للركض والمشي.' },
        { termAr: 'Tiṭ (ⵜⵉⵟ)', definitionAr: 'العين للإبصار ورؤية الجمال.' },
        { termAr: 'Ul (ⵓⵍ)', definitionAr: 'القلب النابض بالمحبة.' },
        { termAr: 'Amcic (ⴰⵎⵛⵉⵛ)', definitionAr: 'القط الأليف الجميل.' },
      ],
      visualizationHintAr: 'ضع يدك على قلبك وقل: « Ul-iw yeččur d tayri » (قلبي مليء بالمحبة).',
      commonMistakes: [
        {
          mistakeAr: 'الخلط بين Afus (يد) و Aḍar (رجل).',
          correctionAr: 'Afus = يد، Aḍar = رجل/قدم.',
        },
      ],
      takeawayAr: 'Afus = اليد، Aḍar = القدم، Tiṭ = العين، Ul = القلب.',
    },
    rulesAr: [
      'Afus deg ufus (يداً بيد) = شعار التعاون والتضامن الجزائري.',
      'Tiṭ (العين) جمعها Tiṭṭawin (العيون).',
      'Aqerru = الرأس المفكر.',
    ],
    keyFormulas: [
      { labelAr: 'أعضاء الجسم الأساسية', formulaAr: 'Afus (يد) - Aḍar (قدم) - Tiṭ (عين) - Ul (قلب)' },
    ],
    examplesAr: [
      {
        problem: 'ما معنى المثل الشعبي الأمازيغي: « Afus deg ufus » ؟',
        solution: 'معناه: يداً في يد للتعاون وبناء الوطن (التويزة الجزائرية).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ماذا تعني كلمة « Afus » (ⴰⴼⵓⵙ) ؟',
        options: [
          { id: 'a', textAr: 'اليد', isCorrect: true, explanationAr: 'أحسنت! Afus تعني اليد، ومنها عبارة "Afus deg ufus" (يداً في يد).' },
          { id: 'b', textAr: 'العين', isCorrect: false },
          { id: 'c', textAr: 'الرأس', isCorrect: false },
        ],
      },
    ],
  },
];
