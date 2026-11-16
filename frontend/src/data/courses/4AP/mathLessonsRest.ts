import { CourseLesson } from '../../../types';
import { build4ApPractice } from './4apExercisePack';

/** Leçons 4–12 — math / 4AP (T1×1, T2×4, T3×4) */
export const MATH_4AP_REST: CourseLesson[] = [
{
    id: 'math-4ap-geometry-lines-polygons',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'الهندسة والفضاء',
    titleAr: 'التوازي والتعامد، المضلعات الخاصة وتناظر الأشكال على شبكة',
    summaryAr: 'التمييز بين الاستقامية والتوازي والتعامد باستخدام المسطرة والكوس، والتعرف على المضلعات الخاصة ورسم نظير شكل بالتناظر المحوري.',
    objectivesAr: [
        'أتحقق من استقامية ثلاث نقاط باستعمال المسطرة.',
        'أُميّز بين المستقيمات المتعامدة والمتوازية.',
        'أتعرّف على خصائص المضلعات الرباعية الخاصة.',
        'أرسم نظير نقطة أو شكل بسيط بالنسبة لمحور تناظر.',
    ],
    detailedCourse: {
        introAr: 'الهندسة تعلّمنا كيف نتحقق من العلاقات بين الخطوط والأشكال باستعمال أدوات دقيقة: المسطرة للاستقامية، والكوس للتعامد، والتناظر لرسم نظير شكل بدقة.',
        vocabulary: [
            { termAr: 'التعامد', definitionAr: 'خاصية مستقيمين يتقاطعان مكوّنين زاوية قائمة (90°).' },
            { termAr: 'التوازي', definitionAr: 'خاصية مستقيمين لا يلتقيان أبداً مهما امتدا.' },
            { termAr: 'محور التناظر', definitionAr: 'خط يقسم الشكل إلى نصفين متطابقين تماماً.' },
        ],
        visualizationHintAr: 'اطوِ ورقة من المنتصف: خط الطي هو محور التناظر.',
        commonMistakes: [
            { mistakeAr: 'التحقق من الاستقامية بالعين فقط.', correctionAr: 'يجب استعمال حرف المسطرة والتأكد أن النقاط الثلاث على نفس الخط.' },
        ],
        takeawayAr: 'التعامد = زاوية قائمة، التوازي = لا التقاء، ونظير نقطة يبعد بنفس المسافة عمودياً على محور التناظر.',
    },
    rulesAr: [
        'المستقيمان المتعامدان يتقاطعان وتشكل بينهما زاوية قائمة (90°) نتحقق منها بالكوس.',
        'المستقيمان المتوازيان لا يتقاطعان أبداً والبعد بينهما ثابت.',
        'المربع: 4 أضلاع متقايسة و4 زوايا قائمة. المستطيل: كل ضلعين متقابلين متقايسان و4 زوايا قائمة.',
        'التناظر المحوري: نظير نقطة يبعد بنفس المسافة وبشكل عمودي عن المحور.',
    ],
    keyFormulas: [
        { labelAr: 'محاور تناظر المربع', formulaAr: '4 محاور تناظر' },
        { labelAr: 'محاور تناظر المستطيل', formulaAr: '2 محوران تناظران' },
    ],
    examplesAr: [
        {
            problem: 'أرسم مستطيلاً ABCD طوله 6cm وعرضه 4cm.\n1) كم زاوية قائمة في المستطيل؟\n2) كم محور تناظر؟',
            solution: '1) 4 زوايا قائمة.\n2) محوران تناظران (منصفا الأضلاع المتقابلة).',
        },
    ],
    interactiveTool: 'geometry_visualizer',
    ...build4ApPractice('math-4ap-geometry-lines-polygons', [
        { problemAr: 'ما الأداة المستخدمة للتحقق من زاوية قائمة؟', solutionAr: 'الكوس', detailedCorrectionAr: 'الكوس يتحقق من التعامد والزوايا القائمة.', options: [{ id: 'a', textAr: 'الكوس', isCorrect: true }, { id: 'b', textAr: 'المدور', isCorrect: false }] },
        { problemAr: 'مستقيمان متوازيان يلتقيان في نقطة واحدة. (صحيح أم خطأ؟)', solutionAr: 'خطأ', detailedCorrectionAr: 'المتوازيان لا يلتقيان أبداً.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: 'كم محور تناظر للمربع؟', solutionAr: '4', detailedCorrectionAr: 'المربع له 4 محاور تناظر.', type: 'fill_blank', fillBlankAnswerAr: '4' },
        { problemAr: 'ما أدقّ اسم لشكل له 4 أضلاع متقايسة و4 زوايا قائمة؟', solutionAr: 'المربع', detailedCorrectionAr: 'المربع يجمع الشرطين معاً. هو أيضاً معين خاص، لكن أدقّ اسم له هو المربع؛ أما المعين الذي ليس مربعاً فليست زواياه قائمة.', options: [{ id: 'a', textAr: 'المربع', isCorrect: true }, { id: 'b', textAr: 'المعين الذي ليس مربعاً', isCorrect: false }] },
    ], [
        { problemAr: 'المستقيمان المتعامدان يشكلان زاوية قياسها 90°. (صحيح أم خطأ؟)', solutionAr: 'صحيح', detailedCorrectionAr: 'التعامد يعني زاوية قائمة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'كم محور تناظر للمستطيل (غير المربع)؟', solutionAr: '2', detailedCorrectionAr: 'المستطيل له محوران فقط.', type: 'qcm', options: [{ id: 'a', textAr: '2', isCorrect: true }, { id: 'b', textAr: '4', isCorrect: false }] },
    ]),
    quiz: [{ id: 'q1', questionAr: 'ما أداة التحقق من التعامد؟', options: [{ id: 'a', textAr: 'الكوس', isCorrect: true, explanationAr: 'الكوس للزوايا القائمة.' }, { id: 'b', textAr: 'المنقلة', isCorrect: false }] }],
    trimester: 1,
},

{
    id: 'math-4ap-division-euclidean',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'الأعداد والحساب',
    titleAr: 'القسمة الإقليدية: مفهوم الحاصل، الباقي وقواعد التوزيع المتساوي',
    summaryAr: 'تسمح القسمة الإقليدية بتقسيم كمية إجمالية إلى حصص متساوية وتحديد ما يتبقى، مع التحقق بالمساواة الإقليدية.',
    objectivesAr: [
        'أُفرّق بين مفهوم المشاركة ومفهوم التقسيم.',
        'أُنجز قسمة إقليدية عمودية بسيطة.',
        'أتحقق بالمساواة: المقسوم = (المقسوم عليه × الحاصل) + الباقي.',
    ],
    detailedCourse: {
        introAr: 'القسمة الإقليدية توزّع كمية بالتساوي مع معرفة ما تبقى. الباقي يجب أن يكون دائماً أصغر من المقسوم عليه.',
        vocabulary: [
            { termAr: 'المقسوم', definitionAr: 'العدد الكلي الذي نريد تقسيمه.' },
            { termAr: 'الباقي', definitionAr: 'ما تبقى بعد التوزيع، ويجب أن يكون < المقسوم عليه.' },
        ],
        visualizationHintAr: 'وزّع 245 كراساً على 8 أقسام: الحاصل 30 والباقي 5.',
        commonMistakes: [
            { mistakeAr: 'باقٍ أكبر من أو يساوي المقسوم عليه.', correctionAr: 'إذا كان الباقي ≥ المقسوم عليه، فالحاصل ناقص.' },
        ],
        takeawayAr: 'المقسوم = (المقسوم عليه × الحاصل) + الباقي، والباقي < المقسوم عليه.',
    },
    rulesAr: [
        'المساواة الإقليدية: المقسوم = (المقسوم عليه × الحاصل) + الباقي.',
        'شرط الباقي: 0 ≤ الباقي < المقسوم عليه.',
        'خطوات القسمة العمودية: اقسم، اضرب، اطرح، أنزل.',
    ],
    keyFormulas: [
        { labelAr: 'المساواة الإقليدية', formulaAr: 'المقسوم = (المقسوم عليه × الحاصل) + الباقي' },
    ],
    examplesAr: [
        {
            problem: 'وزّع 245 كراساً بالتساوي على 8 أقسام. ما حصة كل قسم والباقي؟',
            solution: 'الحاصل 30 والباقي 5. التحقق: 245 = (8 × 30) + 5، والباقي 5 < 8.',
            operationsAr: '245 ÷ 8\n24 ÷ 8 = 3 (الباقي 0)\n5 ÷ 8 = 0 (الباقي 5)\nالحاصل = 30، الباقي = 5\n(30 × 8) + 5 = 245 ✓',
        },
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'written_operation',
      titleAr: 'القسمة الإقليدية عمودياً',
      introAr: 'اضغط على كل قسمة لترى خطواتها كاملة: اقسم، اضرب، اطرح، أنزل.',
      operations: [
        {
          id: 'div1',
          labelAr: '245 ÷ 8',
          operationsAr: '245 ÷ 8\n24 ÷ 8 = 3 (الباقي 0)\n5 ÷ 8 = 0 (الباقي 5)\nالحاصل = 30، الباقي = 5\n(30 × 8) + 5 = 245 ✓',
          solutionAr: '245 = (8 × 30) + 5. الحاصل 30 والباقي 5.',
        },
        {
          id: 'div2',
          labelAr: '187 ÷ 6',
          operationsAr: '187 ÷ 6\n18 ÷ 6 = 3 (الباقي 0)\n7 ÷ 6 = 1 (الباقي 1)\nالحاصل = 31، الباقي = 1\n(31 × 6) + 1 = 187 ✓',
          solutionAr: '187 = (6 × 31) + 1. الحاصل 31 والباقي 1.',
        },
      ],
    },
    ...build4ApPractice('math-4ap-division-euclidean', [
        { problemAr: 'في القسمة الإقليدية، ماذا يمثل الباقي؟', solutionAr: 'ما تبقى بعد التوزيع', detailedCorrectionAr: 'الباقي هو الكمية غير الموزّعة.', options: [{ id: 'a', textAr: 'ما تبقى بعد التوزيع', isCorrect: true }, { id: 'b', textAr: 'عدد الحصص', isCorrect: false }] },
        { problemAr: '187 ÷ 6: ما الحاصل والباقي؟', solutionAr: '31 والباقي 1', detailedCorrectionAr: '(31×6)+1=187.', type: 'qcm', options: [{ id: 'a', textAr: '31 والباقي 1', isCorrect: true }, { id: 'b', textAr: '30 والباقي 7', isCorrect: false }] },
        { problemAr: 'عند قسمة 245 على 8، الحاصل 30 والباقي 5. تحقق: (30×8)+5 = ؟', solutionAr: '245', detailedCorrectionAr: '240+5=245.', type: 'calculation', calculationAnswer: 245, operationsAr: '(30 × 8) + 5\n= 240 + 5\n= 245' },
        { problemAr: '144 ÷ 12 = ؟', solutionAr: '12', detailedCorrectionAr: '144÷12=12 والباقي 0.', type: 'calculation', calculationAnswer: 12, operationsAr: '144 ÷ 12 = 12\n(12 × 12) = 144' },
    ], [
        { problemAr: 'الباقي في القسمة يمكن أن يساوي المقسوم عليه. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'الباقي يجب أن يكون أصغر من المقسوم عليه.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: '358 ÷ 7 = 51 والباقي 1. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '(51×7)+1=358.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    ]),
    quiz: [{ id: 'q1', questionAr: '187 ÷ 6 = ؟', options: [{ id: 'a', textAr: '31 والباقي 1', isCorrect: true, explanationAr: '(31×6)+1=187.' }, { id: 'b', textAr: '30 والباقي 7', isCorrect: false, explanationAr: 'الباقي 7 أكبر من المقسوم عليه 6، فلا تصح القسمة هكذا. نضيف مجموعة من 6: الحاصل 31 والباقي 1.' }] }],
    trimester: 2,
},

{
    id: 'math-4ap-division-two-digit-divisor',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'الأعداد والحساب',
    titleAr: 'القسمة الإقليدية على عدد من رقمين',
    summaryAr: 'تقنية القسمة على مقسوم عليه من رقمين مع تقدير الحاصل والتحقق بالمساواة الإقليدية.',
    objectivesAr: [
        'أُنجز قسمة عمودية على مقسوم عليه من رقمين.',
        'أُقدّر الحاصل قبل البدء.',
        'أتحقق بالمساواة الإقليدية.',
    ],
    detailedCourse: {
        introAr: 'القسمة على رقمين تحتاج تقديراً أدق للحاصل في كل خطوة.',
        vocabulary: [{ termAr: 'التقدير', definitionAr: 'تخمين حجم الحاصل لتسهيل اختيار الرقم الصحيح.' }],
        visualizationHintAr: 'قرب المقسوم عليه لأقرب عشرة قبل التقدير.',
        commonMistakes: [{ mistakeAr: 'اختيار حاصل كبير جداً.', correctionAr: 'إذا تجاوز حاصل الضرب الجزء المقسوم، انقص الرقم.' }],
        takeawayAr: 'نفس قاعدة التحقق: المقسوم = (المقسوم عليه × الحاصل) + الباقي.',
    },
    rulesAr: [
        'نأخذ أكبر عدد من أرقام المقسوم ≥ المقسوم عليه.',
        'نقدّر الحاصل بتقريب المقسوم عليه.',
        'التحقق: المقسوم = (المقسوم عليه × الحاصل) + الباقي.',
    ],
    keyFormulas: [{ labelAr: 'التحقق', formulaAr: 'المقسوم = (المقسوم عليه × الحاصل) + الباقي' }],
    examplesAr: [
        {
            problem: '936 ÷ 24 = ؟',
            solution: '936 ÷ 24 = 39 والباقي 0. التحقق: 24×39=936.',
            operationsAr: '936 ÷ 24\n96 ÷ 24 = 4\n36 ÷ 24 = 1 (تقدير)\nالحاصل = 39\n24 × 39 = 936 ✓',
        },
        {
            problem: '758 ÷ 32 = ؟',
            solution: 'الحاصل 23 والباقي 22. التحقق: 758 = (32 × 23) + 22، والباقي 22 < 32.',
            operationsAr: '758 ÷ 32\n64 ÷ 32 = 2\n118 ÷ 32 = 3 (الباقي 22)\n(32 × 23) + 22 = 758 ✓',
        },
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
      type: 'written_operation',
      titleAr: 'قسمة على عدد من رقمين',
      introAr: 'تقدير الحاصل ثم التحقق: المقسوم = (المقسوم عليه × الحاصل) + الباقي.',
      operations: [
        {
          id: '936-24',
          labelAr: '936 ÷ 24',
          operationsAr: '936 ÷ 24\n= 39 (باقٍ 0)\n24 × 39 = 936 ✓',
          solutionAr: 'الحاصل 39. التحقق: 24×39=936.',
        },
        {
          id: '758-32',
          labelAr: '758 ÷ 32',
          operationsAr: '758 ÷ 32\n= 23 (باقٍ 22)\n(32×23)+22=758 ✓',
          solutionAr: 'الحاصل 23 والباقي 22. الباقي < 32.',
        },
      ],
    },
    ...build4ApPractice('math-4ap-division-two-digit-divisor', [
        { problemAr: '850 ÷ 25 = ؟', solutionAr: '34', detailedCorrectionAr: '850÷25=34 والباقي 0.', type: 'calculation', calculationAnswer: 34 },
        { problemAr: '936 ÷ 24: الباقي يساوي 0. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '24×39=936.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'عند قسمة 758 على 32، الحاصل 23. ما الباقي؟', solutionAr: '22', detailedCorrectionAr: '758 = (32 × 23) + 22. الباقي 22 < 32.', type: 'fill_blank', fillBlankAnswerAr: '22' },
        { problemAr: '672 ÷ 28 = ؟', solutionAr: '24', detailedCorrectionAr: '672÷28=24.', type: 'calculation', calculationAnswer: 24, operationsAr: '672 ÷ 28 = 24\n28 × 24 = 672' },
    ], [
        { problemAr: 'عند القسمة على رقمين نقدّر الحاصل أولاً. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'التقدير يساعد على اختيار الرقم الصحيح.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '504 ÷ 21 = ؟', solutionAr: '24', detailedCorrectionAr: '21×24=504.', type: 'calculation', calculationAnswer: 24 },
    ]),
    quiz: [{ id: 'q1', questionAr: '850 ÷ 25 = ؟', options: [{ id: 'a', textAr: '34', isCorrect: true, explanationAr: '25×34=850.' }, { id: 'b', textAr: '30', isCorrect: false }] }],
    trimester: 2,
},

{
    id: 'math-4ap-measurements-lengths-masses-capacities',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'المقادير والقياس',
    titleAr: 'قياس الأطوال والكتل والسعات: جدول التحويل والعمليات عليها',
    summaryAr: 'التعرف على وحدات الأطوال (m, cm, km) والكتل (g, kg, t) والسعات (L) واستعمال جدول التحويل.',
    objectivesAr: [
        'أُسمّي وحدات القياس الأساسية ومضاعفاتها.',
        'أُحوّل بين الوحدات بجدول التحويل.',
        'أحل مشكلات واقعية بالتحويل.',
    ],
    detailedCourse: {
        introAr: 'لكل قياس وحدة أساسية وجدول تحويل: نضرب للانتقال إلى وحدة أصغر ونقسم للوحدة الأكبر.',
        vocabulary: [
            { termAr: 'المتر', definitionAr: 'الوحدة الأساسية للأطوال.' },
            { termAr: 'الكيلوغرام', definitionAr: 'وحدة الكتلة الشائعة: 1 kg = 1 000 g.' },
        ],
        visualizationHintAr: 'ارسم جدول km → m → cm من اليسار لليمين.',
        commonMistakes: [{ mistakeAr: 'الخلط بين الضرب والقسمة.', correctionAr: 'كبير → صغير = ضرب، صغير → كبير = قسم.' }],
        takeawayAr: '1 m = 100 cm، 1 kg = 1 000 g، 1 t = 1 000 kg.',
    },
    rulesAr: [
        'جدول الأطوال: km, hm, dam, m, dm, cm, mm.',
        '1 m = 10 dm = 100 cm = 1 000 mm.',
        '1 t = 1 000 kg، 1 q = 100 kg.',
        'جدول السعات: hL, daL, L, dL, cL, mL.',
    ],
    keyFormulas: [
        { labelAr: 'تحويل الأطوال', formulaAr: '1 m = 100 cm' },
        { labelAr: 'تحويل الكتل', formulaAr: '1 kg = 1 000 g' },
    ],
    examplesAr: [
        {
            problem: 'شاحنة تحمل 3t و 500kg. ما الحمولة بالكيلوغرام؟',
            solution: '3t = 3 000kg. المجموع 3 500kg.',
            operationsAr: '3 t = 3 × 1 000 = 3 000 kg\n3 000 + 500 = 3 500 kg',
        },
    ],
    interactiveTool: 'unit_converter',
    ...build4ApPractice('math-4ap-measurements-lengths-masses-capacities', [
        { problemAr: '2 kg 500 g = ؟ g', solutionAr: '2500', detailedCorrectionAr: '2kg=2000g، 2000+500=2500g.', type: 'calculation', calculationAnswer: 2500 },
        { problemAr: '1 m = 100 cm. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '1m=100cm.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '300 cm = ؟ m', solutionAr: '3', detailedCorrectionAr: '300÷100=3m.', type: 'fill_blank', fillBlankAnswerAr: '3' },
        { problemAr: '4 kg 200 g = ؟ g', solutionAr: '4200', detailedCorrectionAr: '4kg=4000g، 4000+200=4200g.', type: 'calculation', calculationAnswer: 4200 },
    ], [
        { problemAr: '1 t = 1 000 kg. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'الطن = ألف كيلوغرام.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '5 m = ؟ cm', solutionAr: '500', detailedCorrectionAr: '5×100=500cm.', type: 'calculation', calculationAnswer: 500 },
    ]),
    quiz: [{ id: 'q1', questionAr: '2 kg 500 g = ؟ g', options: [{ id: 'a', textAr: '2 500 g', isCorrect: true, explanationAr: '2000+500=2500g.' }, { id: 'b', textAr: '250 g', isCorrect: false }] }],
    trimester: 2,
},

{
    id: 'math-4ap-fractions',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'الأعداد والحساب',
    titleAr: 'الكسور البسيطة: مفهوم الكسر، المقارنة بالوحدة والتناسب البسيط',
    summaryAr: 'اكتشاف الكسر كجزء من وحدة متساوية، مقارنته بالعدد 1، والتناسب البسيط بين كسرين متكافئين — بدون أعداد عشرية (موضوع 5AP).',
    objectivesAr: [
        'أفهم الكسر كجزء من وحدة مقسّمة إلى أجزاء متساوية.',
        'أُقارن كسراً بالعدد 1.',
        'أُميّز كسرين متكافئين في تناسب بسيط.',
    ],
    detailedCourse: {
        introAr: 'الكسر يمثّل جزءاً من كل: البسط = الأجزاء المأخوذة، المقام = عدد الأجزاء الكلية.',
        vocabulary: [
            { termAr: 'البسط', definitionAr: 'عدد الأجزاء المأخوذة (في الأعلى).' },
            { termAr: 'المقام', definitionAr: 'عدد الأجزاء الكلية (في الأسفل).' },
        ],
        visualizationHintAr: 'قسّم دائرة إلى 4 أجزاء: 3/4 أصغر من 1.',
        commonMistakes: [{ mistakeAr: 'الاعتقاد أن كل كسر < 1.', correctionAr: 'إذا البسط > المقام فالكسر > 1.' }],
        takeawayAr: 'بسط < مقام ⟹ كسر < 1. كسران متكافئان إذا كان التناسب بينهما متساوياً (مثل 1/2 = 2/4).',
    },
    rulesAr: [
        'مقارنة بالوحدة 1: بسط < مقام ⟹ < 1، بسط = مقام ⟹ = 1، بسط > مقام ⟹ > 1.',
        'كسران متكافئان: 1/2 = 2/4 = 3/6 (نضرب أو نقسم البسط والمقام بنفس العدد).',
        'التناسب البسيط: إذا 2/4 = 1/2 فالعلاقة 2×2 = 4×1.',
    ],
    keyFormulas: [
        { labelAr: 'مقارنة بالوحدة', formulaAr: '3/4 < 1 لأن 3 < 4' },
        { labelAr: 'كسر متكافئ', formulaAr: '1/2 = 2/4' },
    ],
    examplesAr: [
        {
            problem: 'قسّم 12 تفاحة بالتساوي على 4 أطفال. ما نصيب كل طفل؟',
            solution: '12 ÷ 4 = 3 تفاحات. أو 12 × (1/4) = 3.',
            operationsAr: '12 ÷ 4 = 3\nأو: 12 × 1/4 = 12/4 = 3',
        },
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
        type: 'number_cards',
        titleAr: 'الكسور: الوحدة والكسر المتكافئ',
        introAr: 'لا فاصلة عشرية هنا — ذلك درس 5AP.',
        cards: [
            { labelAr: 'البسط والمقام', valueDisplay: '3/4', explanationAr: 'البسط 3 = الأجزاء المأخوذة. المقام 4 = أجزاء الوحدة.' },
            { labelAr: 'مقارنة بـ 1', valueDisplay: '3/4 < 1', explanationAr: 'البسط < المقام ⇒ الكسر < 1. 4/4 = 1. 5/4 > 1.' },
            { labelAr: 'كسور متكافئة', valueDisplay: '1/2 = 2/4', explanationAr: 'نضرب البسط والمقام في نفس العدد: 1/2 = 2/4 = 3/6.' },
            { labelAr: 'تقاسم 12 على 4', valueDisplay: '12 ÷ 4', explanationAr: 'كل طفل يأخذ 3 تفاحات = ربع 12.' },
        ],
    },
    ...build4ApPractice('math-4ap-fractions', [
        { problemAr: 'في الكسر 3/4، ما البسط؟', solutionAr: '3', detailedCorrectionAr: 'البسط الرقم العلوي.', options: [{ id: 'a', textAr: '3', isCorrect: true }, { id: 'b', textAr: '4', isCorrect: false }] },
        { problemAr: '3/4 أصغر من 1. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '3 < 4.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '1/2 = ؟/4', solutionAr: '2', detailedCorrectionAr: '1/2 = 2/4.', type: 'fill_blank', fillBlankAnswerAr: '2' },
        { problemAr: '16 ÷ 4 = ؟ (نصيب ربع 16)', solutionAr: '4', detailedCorrectionAr: '16×1/4=4.', type: 'calculation', calculationAnswer: 4 },
    ], [
        { problemAr: '5/5 يساوي 1. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'البسط = المقام.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '2/3 و 4/6 متكافئان. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '4/6 = 2/3.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    ]),
    quiz: [{ id: 'q1', questionAr: '3/4 مقارنة بـ 1؟', options: [{ id: 'a', textAr: 'أصغر', isCorrect: true, explanationAr: '3<4.' }, { id: 'b', textAr: 'أكبر', isCorrect: false }] }],
    trimester: 2,
},

{
    id: 'math-4ap-perimeter-squares-rectangles',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'المقادير والقياس',
    titleAr: 'محيط المربع والمستطيل',
    summaryAr: 'التمييز بين المحيط (طول الحافة الخارجية) وحساب محيط المربع والمستطيل — بدون مساحة (موضوع 5AP).',
    objectivesAr: [
        'أُميّز بين المحيط والمساحة (المساحة في 5AP).',
        'أحسب محيط المربع والمستطيل.',
        'أستعمل الوحدات الصحيحة (m, cm).',
    ],
    detailedCourse: {
        introAr: 'المحيط = طول السياج حول شكل. المساحة (سطح داخلي) تُدرّس في 5AP.',
        vocabulary: [{ termAr: 'المحيط', definitionAr: 'مجموع أطوال أضلاع الشكل.' }],
        visualizationHintAr: 'المحيط = المسافة حول الشكل من الخارج.',
        commonMistakes: [{ mistakeAr: 'استعمال cm² للمحيط.', correctionAr: 'المحيط بوحدات طول فقط (cm, m).' }],
        takeawayAr: 'محيط المربع = 4×الضلع. محيط المستطيل = (الطول+العرض)×2.',
    },
    rulesAr: [
        'محيط المربع = الضلع × 4.',
        'محيط المستطيل = (الطول + العرض) × 2.',
        'المحيط يُقاس بوحدات الطول (m, cm) وليس بوحدات مربعة.',
    ],
    keyFormulas: [
        { labelAr: 'محيط المربع', formulaAr: 'P = 4 × c' },
        { labelAr: 'محيط المستطيل', formulaAr: 'P = (L + l) × 2' },
    ],
    examplesAr: [
        {
            problem: 'حقل مستطيل 45m × 20m. محيطه 130m. سياج بطول 125m (باب 5m). تحقق.',
            solution: 'المحيط = (45+20)×2 = 130m. السياج = 130-5 = 125m.',
            operationsAr: 'P = (45 + 20) × 2\n  = 65 × 2\n  = 130 m\nالسياج = 130 - 5 = 125 m',
        },
    ],
    interactiveTool: 'geometry_visualizer',
    ...build4ApPractice('math-4ap-perimeter-squares-rectangles', [
        { problemAr: 'محيط مربع ضلعه 5cm = ؟', solutionAr: '20', detailedCorrectionAr: '4×5=20cm.', type: 'calculation', calculationAnswer: 20, operationsAr: 'P = 4 × 5 = 20 cm' },
        { problemAr: 'المحيط يُقاس بـ cm². (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'cm² للمساحة فقط.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: 'مستطيل 8cm×3cm: المحيط = ؟', solutionAr: '22', detailedCorrectionAr: '(8+3)×2=22.', type: 'calculation', calculationAnswer: 22, operationsAr: 'P = (8 + 3) × 2 = 22 cm' },
        { problemAr: 'محيط المربع = الضلع × ؟', solutionAr: '4', detailedCorrectionAr: '4 أضلاع متساوية.', type: 'fill_blank', fillBlankAnswerAr: '4' },
    ], [
        { problemAr: 'محيط مربع 6cm = 24cm. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '4×6=24.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'مستطيل 10m×4m: المحيط = ؟', solutionAr: '28', detailedCorrectionAr: '(10+4)×2=28m.', type: 'calculation', calculationAnswer: 28 },
    ]),
    quiz: [{ id: 'q1', questionAr: 'محيط مربع 6cm؟', options: [{ id: 'a', textAr: '24 cm', isCorrect: true, explanationAr: '4×6.' }, { id: 'b', textAr: '36 cm²', isCorrect: false }] }],
    trimester: 3,
},

{
    id: 'math-4ap-composite-shapes-perimeter',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'المقادير والقياس',
    titleAr: 'محيط الأشكال المركبة',
    summaryAr: 'تحليل شكل مركب وحساب محيطه بجمع الأضلاع الخارجية الظاهرة فقط — بدون مساحة.',
    objectivesAr: [
        'أُحلّل شكلاً مركباً إلى أجزاء بسيطة.',
        'أحسب محيط شكل مركب.',
        'لا أحسب الخطوط الداخلية في المحيط.',
    ],
    detailedCourse: {
        introAr: 'محيط الشكل المركب = مجموع أطوال الأضلاع الخارجية فقط.',
        vocabulary: [{ termAr: 'الشكل المركب', definitionAr: 'شكل من عدة أشكال بسيطة مجتمعة.' }],
        visualizationHintAr: 'ارسم حرف L وعدّ الأضلاع الخارجية فقط.',
        commonMistakes: [{ mistakeAr: 'إضافة الخطوط الداخلية.', correctionAr: 'المحيط = الحافة الخارجية فقط.' }],
        takeawayAr: 'تتبّع المحيط الخارجي للشكل المركب واجمع أطوال أضلاعه.',
    },
    rulesAr: [
        'محيط الشكل المركب = مجموع أطوال الأضلاع الخارجية الظاهرة.',
        'لا نحسب الخطوط الداخلية التي قسّمنا بها الشكل.',
        'نرسم الشكل ونعدّ كل ضلع خارجي مرة واحدة فقط.',
    ],
    keyFormulas: [{ labelAr: 'محيط مركب', formulaAr: 'P = مجموع الأضلاع الخارجية' }],
    examplesAr: [
        {
            problem: 'شكل حرف L: جزء 5m×4m وجزء 3m×2m ملحق. احسب المحيط الخارجي.',
            solution: 'نرسم ونعدّ الأضلاع الخارجية: 5+4+3+2+2+4+3+1=24m (حسب الرسم).',
            operationsAr: 'الأضلاع الخارجية:\n5 + 4 + 3 + 2 + 2 + 4 + 3 + 1 = 24 m',
        },
    ],
    interactiveTool: 'geometry_visualizer',
    ...build4ApPractice('math-4ap-composite-shapes-perimeter', [
        { problemAr: 'في محيط الشكل المركب نحسب الخطوط الداخلية. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'الخارجية فقط.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
        { problemAr: 'مربع 4cm ملحق بمستطيل 4cm×2cm (على ضلع). المحيط = 20cm. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '4+4+2+2+4+4=20cm.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'شكل مربع ضلعه 3cm. محيطه = ؟', solutionAr: '12', detailedCorrectionAr: '4×3=12.', type: 'calculation', calculationAnswer: 12 },
        { problemAr: 'المحيط يقيس السطح الداخلي. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'المحيط = الحافة الخارجية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
    ], [
        { problemAr: 'L من مستطيلين: 6+3+3+2+2+3+6+1 = 26cm. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'جمع الأضلاع الخارجية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'محيط مربع 7cm = ؟', solutionAr: '28', detailedCorrectionAr: '4×7=28.', type: 'calculation', calculationAnswer: 28 },
    ]),
    quiz: [{ id: 'q1', questionAr: 'محيط مركب = ؟', options: [{ id: 'a', textAr: 'مجموع الأضلاع الخارجية', isCorrect: true, explanationAr: 'لا الداخلية.' }, { id: 'b', textAr: 'مساحة الأجزاء', isCorrect: false }] }],
    trimester: 3,
},

{
    id: 'math-4ap-proportionally-time-data',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'تنظيم المعطيات والتناسبية',
    titleAr: 'التناسبية البسيطة: الجداول وحل المشكلات',
    summaryAr: 'حل مشكلات تناسبية بسيطة بجداول القيم المترابطة: كلما زادت الكمية المشتراة زاد الثمن بنفس النسبة.',
    objectivesAr: [
        'أكمّل جدول تناسب بسيط.',
        'أحل مشكلة تناسبية (3 كتب = 150 دج، 5 كتب = ؟).',
        'أحل مشكلة تناسبية بسياق آخر (ثمن حسب الكمية المشتراة).',
    ],
    detailedCourse: {
        introAr: 'في التناسب البسيط، عندما يتضاعف أحد الكميتين يتضاعف الآخر بنفس النسبة.',
        vocabulary: [
            { termAr: 'التناسب', definitionAr: 'علاقة بين كميتين تتغيران معاً بنفس النسبة.' },
            { termAr: 'القيمة الوحدوية', definitionAr: 'ثمن أو مقدار الوحدة الواحدة، نجدها بالقسمة على العدد الكلي.' },
        ],
        visualizationHintAr: 'جدول: عدد الكتب | الثمن — 1|50، 2|100، 3|150...',
        commonMistakes: [{ mistakeAr: 'جمع بدل الضرب في التناسب.', correctionAr: 'التناسب = ضرب بنفس المعامل.' }],
        takeawayAr: 'ثمن دفترين 100 دج. ثمن دفتر واحد 50 دج، وثمن 5 دفاتر 250 دج. نجد ثمن الوحدة ثم نضرب في عدد الدفاتر.',
    },
    rulesAr: [
        'التناسب البسيط: نجد قيمة الوحدة ثم نضرب.',
        'كلما زادت الكمية المشتراة زاد الثمن بنفس النسبة، والعكس صحيح.',
        'نتحقق من التناسب: إذا تضاعفت الكمية يتضاعف الثمن.',
    ],
    keyFormulas: [
        { labelAr: 'التناسب', formulaAr: '3 كتب = 150 دج ⟹ 1 كتاب = 50 دج' },
        { labelAr: 'قيمة الوحدة', formulaAr: 'الثمن الكلي ÷ العدد = ثمن الوحدة' },
    ],
    examplesAr: [
        {
            problem: '3 كتب ثمنها 150 دج. ما ثمن 5 كتب؟',
            solution: '1 كتاب = 50 دج. 5 كتب = 250 دج.',
            operationsAr: '150 ÷ 3 = 50 دج/كتاب\n50 × 5 = 250 دج',
        },
        {
            problem: 'كيس أرز 2 kg ثمنه 300 دج. ما ثمن 5 kg من نفس الأرز؟',
            solution: '1 kg = 150 دج. 5 kg = 750 دج.',
            operationsAr: '300 ÷ 2 = 150 دج/kg\n150 × 5 = 750 دج',
        },
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
        type: 'word_problem_scenario',
        titleAr: 'تناسبية بسيطة: الثمن حسب الكمية',
        introAr: 'قيمة الوحدة ثم الضرب في التناسب البسيط.',
        problems: [
            {
                id: 'books',
                situationAr: '3 كتب ثمنها 150 دج. ما ثمن 5 كتب؟',
                choices: [
                    { textAr: '1 كتاب = 50 دج ثم 5 × 50 = 250 دج', isCorrect: true, feedbackAr: 'نجد قيمة الوحدة ثم نضرب.' },
                    { textAr: '150 + 5 = 155 دج', isCorrect: false, feedbackAr: 'التناسب ضرب، لا جمع.' },
                ],
            },
            {
                id: 'rice',
                situationAr: 'كيس أرز 2 kg ثمنه 300 دج. ما ثمن 5 kg؟',
                choices: [
                    { textAr: '300 ÷ 2 = 150 دج/kg ثم 150 × 5 = 750 دج', isCorrect: true, feedbackAr: 'نجد ثمن الكيلوغرام الواحد ثم نضرب في 5.' },
                    { textAr: '300 + 5 = 305 دج', isCorrect: false, feedbackAr: 'التناسب ضرب، لا جمع.' },
                ],
            },
        ],
    },
    ...build4ApPractice('math-4ap-proportionally-time-data', [
        { problemAr: '2 قلم = 40 دج. 1 قلم = ؟', solutionAr: '20', detailedCorrectionAr: '40÷2=20.', type: 'calculation', calculationAnswer: 20 },
        { problemAr: '4 × 50 = 200. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '4×50=200.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '3 كتب = 150 دج. 5 كتب = ؟', solutionAr: '250', detailedCorrectionAr: '50×5=250.', type: 'calculation', calculationAnswer: 250, operationsAr: '150 ÷ 3 = 50\n50 × 5 = 250 دج' },
        { problemAr: '4 m قماش = 80 دج. 7 m = ؟', solutionAr: '140', detailedCorrectionAr: '80÷4=20، 20×7=140.', type: 'calculation', calculationAnswer: 140 },
    ], [
        { problemAr: 'التناسب: نضرب بنفس المعامل. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'نسبة ثابتة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: '3 kg برتقال = 90 دج. 4 kg = ؟', solutionAr: '120', detailedCorrectionAr: '90÷3=30، 30×4=120.', type: 'calculation', calculationAnswer: 120 },
    ]),
    quiz: [{ id: 'q1', questionAr: '3 كتب = 150. 5 كتب؟', options: [{ id: 'a', textAr: '250 دج', isCorrect: true, explanationAr: '50×5.' }, { id: 'b', textAr: '200 دج', isCorrect: false }] }],
    trimester: 3,
},

{
    id: 'math-4ap-pie-charts-histograms',
    grade: '4AP',
    subject: 'math',
    categoryAr: 'تنظيم المعطيات والتناسبية',
    titleAr: 'قراءة الجداول والرسوم البيانية (الأعمدة والقطاعات)',
    summaryAr: 'قراءة وتفسير جداول التوزيع والرسوم بالأعمدة والقطاعات الدائرية لاستخراج معلومات.',
    objectivesAr: [
        'أقرأ جدول توزيع وأستخرج قيمة.',
        'أقرأ رسم أعمدة وأقارن.',
        'أفهم قطاعاً دائرياً كنسبة من الكل.',
    ],
    detailedCourse: {
        introAr: 'الرسوم البيانية تعرض الأعداد بصورة مرئية: الأعمدة للمقارنة، والقطاعات للنسب.',
        vocabulary: [
            { termAr: 'الرسم بالأعمدة', definitionAr: 'أعمدة رأسية أو أفقية طولها يمثل العدد.' },
            { termAr: 'القطاع الدائري', definitionAr: 'جزء من دائرة يمثل نسبة من المجموع.' },
        ],
        visualizationHintAr: 'اقرأ المحور الأفقي (الفئات) والعمودي (الأعداد).',
        commonMistakes: [{ mistakeAr: 'قراءة المحور الخاطئ.', correctionAr: 'تأكد من تسمية كل محور.' }],
        takeawayAr: 'الأعمدة للمقارنة، القطاعات للنسب من 100%.',
    },
    rulesAr: [
        'جدول التوزيع: صف = فئة، عمود = عدد أو نسبة.',
        'الرسم بالأعمدة: أطول عمود = أكبر عدد.',
        'القطاع الدائري: كل قطاع = جزء من المجموع الكلي.',
    ],
    keyFormulas: [{ labelAr: 'قراءة عمود', formulaAr: 'الارتفاع = القيمة على المحور' }],
    examplesAr: [
        {
            problem: 'رسم أعمدة: الرياضيات 25، العربية 30، الفرنسية 15. أي مادة الأكثر؟',
            solution: 'العربية (30) — أطول عمود.',
        },
    ],
    interactiveTool: 'math_lab',
    mathInteractive: {
        type: 'data_matching',
        titleAr: 'أعمدة وجدول: مواد القسم',
        introAr: 'أطول عمود = أكبر عدد. نجمع القيم للمجموع.',
        rows: [
            { labelAr: 'العربية', valueAr: '30' },
            { labelAr: 'الرياضيات', valueAr: '25' },
            { labelAr: 'الفرنسية', valueAr: '15' },
        ],
        insightAr: 'الأطول = العربية (30). المجموع 30+25+15 = 70. القطاع الأكبر في الدائرة يقابل العربية.',
    },
    ...build4ApPractice('math-4ap-pie-charts-histograms', [
        { problemAr: 'أطول عمود = ؟', solutionAr: 'أكبر عدد', detailedCorrectionAr: 'الارتفاع = القيمة.', options: [{ id: 'a', textAr: 'أكبر عدد', isCorrect: true }, { id: 'b', textAr: 'أصغر عدد', isCorrect: false }] },
        { problemAr: '25+30+15 = 70. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'مجموع الأعمدة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'جدول: 5 تلاميذ فئة أ، 8 فئة ب. المجموع = ؟', solutionAr: '13', detailedCorrectionAr: '5+8=13.', type: 'calculation', calculationAnswer: 13 },
        { problemAr: 'القطاع الأكبر = النسبة الأكبر. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'مساحة القطاع ∝ العدد.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    ], [
        { problemAr: '10+20+30 = 60. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'مجموع الجدول.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
        { problemAr: 'أعمدة: 12، 18، 9. الأكبر = ؟', solutionAr: '18', detailedCorrectionAr: '18 > 12 > 9.', type: 'qcm', options: [{ id: 'a', textAr: '18', isCorrect: true }, { id: 'b', textAr: '9', isCorrect: false }] },
    ]),
    quiz: [{ id: 'q1', questionAr: '25، 30، 15 — الأكبر؟', options: [{ id: 'a', textAr: '30', isCorrect: true, explanationAr: 'أطول عمود.' }, { id: 'b', textAr: '15', isCorrect: false }] }],
    trimester: 3,
},
];
