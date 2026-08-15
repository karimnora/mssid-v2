import { CourseLesson } from '../../../types';

export const TAMAZIGHT_4AP: CourseLesson[] = [
  {
    id: 'tamazight-4ap-agemmay-tifinagh-lettres',
    grade: '4AP',
    subject: 'tamazight',
    trimester: 1,
    categoryAr: 'Asenfar 1 : Agemmay n Tifinagh (مشروع 1: الأبجدية التيفيناغ)',
    titleAr: 'Agemmay n Tifinagh (الأبجدية التيفيناغ والحروف الأساسية)',
    summaryAr: 'تعلّم حروف الأبجدية التيفيناغ الرسمية (ⵜⵉⴼⵉⵏⴰⵖ) المعتمدة في المناهج الجزائرية، مقارنتها بالحروف اللاتينية وطريقة نطقها وكتابتها مع أمثلة تراثية.',
    objectivesAr: [
      'التعرف على حروف التيفيناغ الأساسية ونطقها الصحيح (ⴰ, ⴱ, ⴳ, ⴷ, ⴻ, ⴼ, ⵉ, ⵣ, ⵎ, ⵏ, ⵔ, ⵙ, ⵜ, ⵓ, ⵡ, ⵢ).',
      'الربط بين الحرف التيفيناغ والنسخ اللاتيني والترجمة العربية.',
      'كتابة كلمات أولى بالخط التيفيناغي الهندسي.',
    ],
    detailedCourse: {
      introAr: 'الأبجدية التيفيناغية (ⵜⵉⴼⵉⵏⴰⵖ) من أقدم أنظمة الكتابة في العالم وشمال إفريقيا، وتتميز بأشكالها الهندسية المتقنة (الدوائر، الخطوط، والصلبان) المستوحاة من الطبيعة والرموز التراثية.',
      vocabulary: [
        { termAr: 'Agemmay (ⴰⴳⴻⵎⵎⴰⵢ)', definitionAr: 'الأبجدية / الحروف الهجائية.' },
        { termAr: 'Asekkil (ⴰⵙⴻⴽⴽⵉⵍ)', definitionAr: 'الحرف الواحد (جمعها: Isekkilen / ⵉⵙⴻⴽⴽⵉⵍⴻⵏ).' },
        { termAr: 'Tira (ⵜⵉⵔⴰ)', definitionAr: 'الكتابة والخط.' },
        { termAr: 'Taɣri (ⵜⴰⵖⵔⵉ)', definitionAr: 'الحركات وحروف العلة (ⴰ = a, ⵉ = i, ⵓ = u, ⴻ = e).' },
      ],
      visualizationHintAr: 'انتبه إلى الأشكال الهندسية: ⵔ دائرة، + علامة زائد (T)، ⵙ خطان مموجان (S)، ⵣ رمز الإنسان الحر أزا.',
      commonMistakes: [
        {
          mistakeAr: 'الخلط بين حرف ⵔ (R) وحرف ⵄ (العين).',
          correctionAr: 'حرف ⵔ دائرة كاملة بسيطة، بينما ⵄ دائرة مقسومة أفقياً.',
        },
      ],
      takeawayAr: 'الحروف الصوتية الأساسية في تمازيغت هي: ⴰ (A)، ⵉ (I)، ⵓ (U)، و ⴻ (E - التاء الخفيفة المعجمة).',
    },
    rulesAr: [
      'Agemmay n Tifinagh : يتكون من حروف صامتة وحروف علّة (Tifinaɣ n uselmed).',
      'حرف ⴰ (A) : مثل كلمة Agellid (ⴰⴳⴻⵍⵍⵉⴷ) أي الملك (ماصينيسا).',
      'حرف ⵣ (Z) : رمز الهوية الأمازيغية والإنسان الحر (Amaziɣ).',
      'حرف ⵜ (T) : يكتب كعلامة + ويميز المؤنث في اللغة الأمازيغية (Taddart = القرية).',
      'اتجاه الكتابة المعتمد في المدارس الجزائرية هو من اليسار إلى اليمين (LTR).',
    ],
    keyFormulas: [
      { labelAr: 'الحروف الصوتية الأساسية (Tiɣra)', formulaAr: 'ⴰ (A) - ⵉ (I) - ⵓ (U) - ⴻ (E)' },
      { labelAr: 'علامة التأنيث (T...T)', formulaAr: 'Argaz (رجل) ➔ Tamegert / Tameṭṭut (امرأة) | Axxam (بيت) ➔ Taxxamt (غرفة)' },
    ],
    examplesAr: [
      {
        problem: 'اقرأ الكلمات التالية المكتوبة بالتيفيناغ واللاتينية:\n1. ⴰⴳⴻⵍⵍⵉⴷ (Agellid)\n2. ⵜⴰⴷⴷⴰⵔⵜ (Taddart)\n3. ⴰⵡⵔⵖ (Awrɣ)',
        solution: '1. Agellid = الملك (الزعيم)\n2. Taddart = القرية / الدشرة\n3. Awrɣ = اللون الذهبي / الفنك الذهبي',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما هو الحرف التيفيناغي الذي يمثل رمز الإنسان الحر والهوية الأمازيغية ؟',
        options: [
          { id: 'a', textAr: 'ⵣ (Yaz / Z)', isCorrect: true, explanationAr: 'أحسنت! ⵣ هو حرف الزاي الأمازيغي الذي يرمز للإنسان الحر المتشبث بأرضه وسمائه.' },
          { id: 'b', textAr: 'ⵔ (R)', isCorrect: false },
          { id: 'c', textAr: 'ⵜ (T)', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        questionAr: 'ما معنى كلمة « Taddart » (ⵜⴰⴷⴷⴰⵔⵜ) ؟',
        options: [
          { id: 'a', textAr: 'القرية / الحي الأصيل', isCorrect: true, explanationAr: 'ممتاز! Taddart تعني القرية أو الدشرة التقليدية.' },
          { id: 'b', textAr: 'البحر', isCorrect: false },
          { id: 'c', textAr: 'الشمس', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-4ap-chiffres-comptage',
    grade: '4AP',
    subject: 'tamazight',
    trimester: 1,
    categoryAr: 'Asenfar 1 : Imḍanen (الأعداد والحساب بالأمازيغية)',
    titleAr: 'Imḍanen seg 1 ar 10 (الأعداد من 1 إلى 10 بالأمازيغية)',
    summaryAr: 'تعلّم نطق وكتابة الأعداد من 1 إلى 10 باللغة الأمازيغية مع تطبيقات عملية على العد وحساب الأدوات المدرسية والكنوز التراثية.',
    objectivesAr: [
      'حفظ ونطق الأعداد من 1 إلى 10 (Yiwen, Sin, Kraḍ, Kuẓ, Semmus, Sḍis, Sa, Ttam, Tẓa, Mraw).',
      'كتابة الأرقام بالخط التيفيناغي واللاتيني.',
      'العد التصاعدي وحساب الأشياء الملموسة في القسم والمنزل.',
    ],
    detailedCourse: {
      introAr: 'العد بالأمازيغية منظم ومنطقي جداً. الأعداد الأساسية من 1 إلى 10 تشكل اللبنة الأولى لبناء كل العمليات الحسابية في الحياة اليومية.',
      vocabulary: [
        { termAr: 'Yiwen (ⵢⵉⵡⴻⵏ)', definitionAr: 'واحد (1)' },
        { termAr: 'Sin (ⵙⵉⵏ)', definitionAr: 'اثنان (2)' },
        { termAr: 'Kraḍ (ⴽⵕⴰⴹ)', definitionAr: 'ثلاثة (3)' },
        { termAr: 'Kuẓ (ⴽⵓⵥ)', definitionAr: 'أربعة (4)' },
        { termAr: 'Semmus (ⵙⴻⵎⵎⵓⵙ)', definitionAr: 'خمسة (5)' },
        { termAr: 'Mraw (ⵎⵔⴰⵡ)', definitionAr: 'عشرة (10)' },
      ],
      visualizationHintAr: 'اربط كل رقم بعدد أصابع يدك: يد واحدة = Semmus (5)، اليدان معاً = Mraw (10).',
      commonMistakes: [
        {
          mistakeAr: 'الخلط بين Kraḍ (3) و Kuẓ (4).',
          correctionAr: 'Kraḍ (ⴽⵕⴰⴹ) هو 3، بينما Kuẓ (ⴽⵓⵥ) هو 4.',
        },
      ],
      takeawayAr: '1=Yiwen, 2=Sin, 3=Kraḍ, 4=Kuẓ, 5=Semmus, 6=Sḍis, 7=Sa, 8=Ttam, 9=Tẓa, 10=Mraw.',
    },
    rulesAr: [
      '1 = Yiwen (ⵢⵉⵡⴻⵏ) / 2 = Sin (ⵙⵉⵏ) / 3 = Kraḍ (ⴽⵕⴰⴹ) / 4 = Kuẓ (ⴽⵓⵥ) / 5 = Semmus (ⵙⴻⵎⵎⵓⵙ)',
      '6 = Sḍis (ⵚⴹⵉⵙ) / 7 = Sa (ⵙⴰ) / 8 = Ttam (ⵜⵜⴰⵎ) / 9 = Tẓa (ⵜⵥⴰ) / 10 = Mraw (ⵎⵔⴰⵡ)',
      'السؤال عن العدد يكون بعبارة : « Acḥal ? » (ⴰⵛⵃⴰⵍ ؟ = كم ؟)',
    ],
    keyFormulas: [
      { labelAr: 'العد من 1 إلى 5', formulaAr: 'Yiwen (1), Sin (2), Kraḍ (3), Kuẓ (4), Semmus (5)' },
      { labelAr: 'العد من 6 إلى 10', formulaAr: 'Sḍis (6), Sa (7), Ttam (8), Tẓa (9), Mraw (10)' },
    ],
    examplesAr: [
      {
        problem: 'Acḥal n yetran yellan ? (كم عدد النجوم ؟) ⭐️⭐️⭐️',
        solution: 'Llan kraḍ (3) n yetran (توجد 3 نجوم).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما هو العدد الذي يقابل كلمة « Semmus » (ⵙⴻⵎⵎⵓⵙ) ؟',
        options: [
          { id: 'a', textAr: '5 (خمسة)', isCorrect: true, explanationAr: 'صحيح! Semmus تعني 5 باللغة الأمازيغية.' },
          { id: 'b', textAr: '2 (اثنان)', isCorrect: false },
          { id: 'c', textAr: '8 (ثمانية)', isCorrect: false },
        ],
      },
      {
        id: 'q2',
        questionAr: 'ما هو المقابل الأمازيغي للعدد 10 ؟',
        options: [
          { id: 'a', textAr: 'Mraw (ⵎⵔⴰⵡ)', isCorrect: true, explanationAr: 'ممتاز! Mraw تعني عشرة (10).' },
          { id: 'b', textAr: 'Sin', isCorrect: false },
          { id: 'c', textAr: 'Sa', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-4ap-famille-salutations',
    grade: '4AP',
    subject: 'tamazight',
    trimester: 2,
    categoryAr: 'Asenfar 2 : Tawacult-iw (مشروع 2: عائلتي والتحيات)',
    titleAr: 'Tawacult d Usnirem (أفراد العائلة وعبارات التحية)',
    summaryAr: 'تعلّم تسميات أفراد العائلة (الأب، الأم، الأخ، الأخت، الجد والجدة) وعبارات التحية والترحيب الأمازيغية اليومية.',
    objectivesAr: [
      'استعمال عبارات التحية: Azul (ⴰⵣⵓⵍ), Ansuf (ⴰⵏⵙⵓⴼ), Tanemmirt (ⵜⴰⵏⴻⵎⵎⵉⵔⵜ).',
      'تسمية أفراد العائلة: Baba, Yemma, Gma, Weltma, Jidda, Jeddi.',
      'تقديم النفس والعائلة بجمل بسيطة ومفيدة.',
    ],
    detailedCourse: {
      introAr: 'التحية وصلة الرحم من أسمى القيم الجزائرية. كلمة « Azul » تعني السلام والتحية وهي مكونة رمزياً من « Az » (القرب) و« Ul » (القلب)، أي السلام الصادر من صميم القلب.',
      vocabulary: [
        { termAr: 'Azul (ⴰⵣⵓⵍ)', definitionAr: 'مرحباً / السلام والتحية العطرة.' },
        { termAr: 'Tanemmirt (ⵜⴰⵏⴻⵎⵎⵉⵔⵜ)', definitionAr: 'شكراً جزيلاً.' },
        { termAr: 'Baba (ⴱⴰⴱⴰ)', definitionAr: 'أبي / الوالد.' },
        { termAr: 'Yemma (ⵢⴻⵎⵎⴰ)', definitionAr: 'أمي / الوالدة.' },
        { termAr: 'Gma (ⴳⵎⴰ)', definitionAr: 'أخي.' },
        { termAr: 'Weltma (ⵡⴻⵍⵜⵎⴰ)', definitionAr: 'أختي.' },
      ],
      visualizationHintAr: 'قل "Azul fell-awen" لتحية أصدقائك في الصباح، و"Tanemmirt" عند شكر أحدهم.',
      commonMistakes: [
        {
          mistakeAr: 'نسيان أن Weltma للمؤنث (الأخت) و Gma للمذكر (الأخ).',
          correctionAr: 'Gma = أخي، Weltma = أختي.',
        },
      ],
      takeawayAr: 'Azul = السلام/مرحباً، Tanemmirt = شكراً، Ar tufat = إلى اللقاء.',
    },
    rulesAr: [
      'Azul (ⴰⵣⵓⵍ) = السلام والتحية.',
      'Tanemmirt (ⵜⴰⵏⴻⵎⵎⵉⵔⵜ) = شكراً.',
      'Ar tufat (ⴰⵔ ⵜⵓⴼⴰⵜ) = إلى اللقاء.',
      'Tawacult (ⵜⴰⵡⴰⵛⵓⵍⵜ) = العائلة والأسرة.',
    ],
    keyFormulas: [
      { labelAr: 'التحيات اليومية', formulaAr: 'Azul (مرحباً) - Tanemmirt (شكراً) - Ar tufat (إلى اللقاء)' },
      { labelAr: 'أفراد العائلة', formulaAr: 'Baba (أبي) - Yemma (أمي) - Gma (أخي) - Weltma (أختي)' },
    ],
    examplesAr: [
      {
        problem: 'كيف تقدم نفسك باللغة الأمازيغية؟',
        solution: 'Azul ! Isem-iw Massinissa. Nek d anelmad deg uɣerbaz amezwaru. (مرحباً! اسمي ماصينيسا، أنا تلميذ في المدرسة الابتدائية).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ماذا تعني كلمة « Tanemmirt » (ⵜⴰⵏⴻⵎⵎⵉⵔⵜ) ؟',
        options: [
          { id: 'a', textAr: 'شكراً جزيلاً', isCorrect: true, explanationAr: 'أحسنت! Tanemmirt تعني شكراً.' },
          { id: 'b', textAr: 'إلى اللقاء', isCorrect: false },
          { id: 'c', textAr: 'نعم', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-4ap-yennayer-patrimoine',
    grade: '4AP',
    subject: 'tamazight',
    trimester: 3,
    categoryAr: 'Asenfar 3 : Tfaskiwin d Yennayer (مشروع 3: الأعياد ويناير)',
    titleAr: 'Tfaska n Yennayer (عيد يناير والتراث الوطني الجزائري)',
    summaryAr: 'التعرف على عيد يناير الوطني (رأس السنة الأمازيغية 12 جانفي)، مظاهر الاحتفال، الأطباق التقليدية والرموز الزراعية والتضامنية.',
    objectivesAr: [
      'التعرف على تاريخ ودلالة عيد يناير (رأس السنة الفلاحية الأمازيغية).',
      'تسمية الأطباق التقليدية (Seksu, Ibiwsen, Trejjet, Tifiras).',
      'التعبير عن التضامن والبهجة الوطنية والاحتفال الجماعي.',
    ],
    detailedCourse: {
      introAr: 'يناير (Yennayer / ⵢⴻⵏⵏⴰⵢⴻⵔ) هو رأس السنة الأمازيغية الفلاحية، يحتفل به الجزائريون في 12 جانفي كرمز للأرض والخير والخصوبة وتجدد الطبيعة والتضامن الأسري.',
      vocabulary: [
        { termAr: 'Yennayer (ⵢⴻⵏⵏⴰⵢⴻⵔ)', definitionAr: 'رأس السنة الأمازيغية وعيد وطني رسمي.' },
        { termAr: 'Tfaska (ⵜⴼⴰⵙⴽⴰ)', definitionAr: 'العيد والاحتفال والبهجة.' },
        { termAr: 'Seksu (ⵙⴻⴽⵙⵓ)', definitionAr: 'الكسكسي الجزائري التقليدي بسبع خضار.' },
        { termAr: 'Imensi (ⵉⵎⴻⵏⵙⵉ)', definitionAr: 'العشاء العائلي الاحتفالي.' },
      ],
      visualizationHintAr: 'تذكر عبارة التهنئة: « Asseggas Ameggaz » (ⴰⵙⴻⴳⴳⴰⵙ ⴰⵎⴻⴳⴳⴰⵣ = سنة سعيدة ومباركة).',
      commonMistakes: [
        {
          mistakeAr: 'الاعتقاد بأن يناير مجرد عشاء فقط.',
          correctionAr: 'يناير رمز للارتباط بالأرض الفلاحية والتضامن والتكافل بين الجيران وتمني الخير للجميع.',
        },
      ],
      takeawayAr: 'Asseggas Ameggaz = سنة سعيدة وكل عام والجزائر بخير.',
    },
    rulesAr: [
      'Yennayer d ass amezwaru deg useggas amaziɣ (يناير هو اليوم الأول من السنة الأمازيغية).',
      'العبارة المشهورة للتهنئة : « Asseggas Ameggaz » (عام سعيد).',
      'إعداد طبق الكسكسي بالخضار المتنوعة تفاؤلاً بمحصول زراعي وفير.',
    ],
    keyFormulas: [
      { labelAr: 'عبارة التهنئة السنوية', formulaAr: 'Asseggas Ameggaz ! (ⴰⵙⴻⴳⴳⴰⵙ ⴰⵎⴻⴳⴳⴰⵣ ! = سنة سعيدة)' },
    ],
    examplesAr: [
      {
        problem: 'ماذا نتمنى للناس في مناسبة يناير؟',
        solution: 'Asseggas Ameggaz d unebbaɣur ! (سنة مباركة ومزدهرة بالخير والصحة والبركات).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما هي العبارة الشهيرة للتهنئة بحلول رأس السنة الأمازيغية ؟',
        options: [
          { id: 'a', textAr: 'Asseggas Ameggaz (ⴰⵙⴻⴳⴳⴰⵙ ⴰⵎⴻⴳⴳⴰⵣ)', isCorrect: true, explanationAr: 'صحيح! Asseggas Ameggaz تعني سنة سعيدة ومباركة.' },
          { id: 'b', textAr: 'Ar tufat', isCorrect: false },
          { id: 'c', textAr: 'Azul', isCorrect: false },
        ],
      },
    ],
  },
];
