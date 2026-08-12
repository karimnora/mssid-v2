import { OfficialExam } from '../types';

const COMPOSITION_SOURCE_NOTE_AR = 'تركيبة أصلية أعدّتها مَسِيد DZ مستوحاة من شكل التقييمات الفصلية المعتمدة في المدرسة الابتدائية الجزائرية — ليست نسخة حرفية عن موضوع رسمي صادر عن الديوان الوطني للامتحانات والمسابقات.';

export const OFFICIAL_EXAMS_DATA: OfficialExam[] = [
  {
    id: 'exam-2018-trim1-math',
    year: 2018,
    titleAr: 'اختبار الفصل الأول المشترك في الرياضيات - السنة الخامسة ابتدائي (مقاطعة صالح باي)',
    sessionAr: 'اختبار الفصل الأول 2017 - 2018',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    exercises: [
      {
        titleAr: 'التمرين الأول (1.5 نقطة)',
        points: 1.5,
        contentAr: 'أ) أكتب العدد الآتي بالأرقام: [مليونان وثلاثمائة وواحد وثمانون ألفاً وسبعمائة وواحد وأربعون].\nب) أحصر العدد 42 بين مضاعفين متتاليين للعدد 5.\nجـ) ما هو عدد المئات في العدد الآتي: 26281؟',
        solutionAr: 'أ) كتابة العدد بالأرقام: 2 381 741.\nب) حصر العدد 42 بين مضاعفين متتاليين للعدد 5: 40 < 42 < 45.\nجـ) رقم المئات هو 2، أما عدد المئات في العدد 26281 فهو 262 (لأن 26281 ÷ 100 = 262 والباقي 81).'
      },
      {
        titleAr: 'التمرين الثاني (1.5 نقطة)',
        points: 1.5,
        contentAr: 'أنجز العمليات الآتية عمودياً:\n1) 2345 × 76 = ...\n2) 100167 - 56789 = ...\n3) 436783 + 12589 = ...',
        solutionAr: '1) 2345 × 76 = 178,220.\n2) 100167 - 56789 = 43,378.\n3) 436783 + 12589 = 449,372.'
      },
      {
        titleAr: 'التمرين الثالث (1.5 نقطة)',
        points: 1.5,
        contentAr: 'لخياطة قطعة قماش طولها 26 متراً استعملت منها 19 متراً.\n- جد طول القطعة الباقية بالسنتيمتر (cm).',
        solutionAr: '1) طول القماش المتبقي بالأمتار: 26 - 19 = 7 أمتار.\n2) تحويل إلى السنتيمتر: 7m = 700 cm.'
      },
      {
        titleAr: 'التمرين الرابع (1.5 نقطة)',
        points: 1.5,
        contentAr: '- أرسم قطعة المستقيم [AB] طولها 6cm وعين النقطة O منتصفها.\n- ارسم المستقيم (C) عمودياً على قطعة المستقيم [AB] ويمر بالنقطة O.\n- ما نوع الزوايا الناتجة؟',
        solutionAr: '1) طول القطعة AO يساوي OB ويساوي 3cm.\n2) نوع الزوايا الناتجة عن تعامد المستقيم (C) مع القطعة [AB] في النقطة O هي زوايا قائمة (90 درجة) وعددها 4 زوايا قائمة.'
      }
    ],
    problemExercise: {
      titleAr: 'الوضعية الإدماجية (4 نقاط)',
      points: 4,
      contentAr: 'أعطى الأب لابنه أحمد مبلغاً من المال قدره 40500 ديناراً، اشترى منه 6 كتب سعر الكتاب الواحد 1200 ديناراً و حاسوباً صغيراً لأخيه سمير بـ 22000 ديناراً.\n1) ما هو ثمن شراء الكتب؟\n2) أحسب ثمن كل المشتريات.\n3) كم ديناراً بقي مع أحمد؟',
      solutionAr: '1) ثمن شراء الكتب: 1200 × 6 = 7200 DA.\n2) ثمن كل المشتريات: 7200 (الكتب) + 22000 (الحاسوب) = 29200 DA.\n3) المبلغ المتبقي مع أحمد: 40500 - 29200 = 11300 DA.'
    }
  },
  {
    id: 'exam-2018-math',
    year: 2018,
    titleAr: 'امتحان شهادة التعليم الابتدائي - دورة ماي 2018',
    sessionAr: 'دورة ماي 2018',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    exercises: [
      {
        titleAr: 'التمرين الأول (1.5 نقطة)',
        points: 1.5,
        contentAr: 'ضع الرمز المناسب مكان النقط ( > ، < ، = ):\n1) 10/2 ..... 9\n2) 283.5 ..... 35.28\n3) 3h15min ..... 195min',
        solutionAr: '1) 10/2 = 5 ، وبما أن 5 < 9 فإن: 10/2 < 9.\n2) 283.5 أكبر من 35.28 لأن الجزء الصحيح 283 > 35.\n3) 3h15min = (3 × 60) + 15 = 180 + 15 = 195min. إذن: 3h15min = 195min.'
      },
      {
        titleAr: 'التمرين الثاني (1.5 نقطة)',
        points: 1.5,
        contentAr: 'بمناسبة عيد الفطر المبارك قام بائع الملابس بتخفيض الأسعار بنسبة 15%، فإذا كان سعر الفستان 4500 دينار:\n- أحسب مبلغ التخفيض.\n- ما هو ثمن الفستان بعد التخفيض؟',
        solutionAr: '1) حساب مبلغ التخفيض: (4500 × 15) ÷ 100 = 67500 ÷ 100 = 675 دينار.\n2) ثمن الفستان بعد التخفيض: 4500 - 675 = 3825 دينار.'
      },
      {
        titleAr: 'التمرين الثالث (1.5 نقطة)',
        points: 1.5,
        contentAr: 'يسير دراج بسرعة منتظمة حيث يقطع مسافة 30km في 1h (ساعة واحدة).\n- من خلال ملاحظتك للشكل، استنتج المسافة التي يقطعها الدراج في 2h ثم في 3h.',
        solutionAr: '1) المسافة المقطوعة في 2h: 30 × 2 = 60 km.\n2) المسافة المقطوعة في 3h: 30 × 3 = 90 km.\nنلاحظ أن الوضعية متناسبة لأن النسب ثابته.'
      },
      {
        titleAr: 'التمرين الرابع (1.5 نقطة)',
        points: 1.5,
        contentAr: 'ارسم مستطيلاً ABCD طوله 6cm وعرضه 3cm. ارسم قطري المستطيل ونقطة تقاطعهما O.\nما نوع المثلث AOB الناتج؟',
        solutionAr: 'المثلث AOB متساوي الساقين لأن قطري المستطيل متناصفان ومتساويان وطول OA يساوي OB.'
      }
    ],
    problemExercise: {
      titleAr: 'الوضعية الإدماجية (4 نقاط)',
      points: 4,
      contentAr: 'يقدر إنتاج معصرة بـ 150L من زيت الزيتون، وضعها صاحبها في قارورات سعة القارورة الواحدة 100cL.\n- كم عدد القارورات التي ملأها؟\n- إذا كان ثمن اللتر الواحد 700 دينار، أحسب ثمن بيع الزيت الإجمالي.',
      solutionAr: '1) التحويل: 100cL = 1L.\n2) عدد القارورات المملوءة = 150 ÷ 1 = 150 قارورة.\n3) ثمن بيع الزيت الإجمالي = 150 × 700 = 105,000 دينار جزائري.'
    }
  },
  {
    id: 'exam-2017-math',
    year: 2017,
    titleAr: 'امتحان شهادة التعليم الابتدائي - دورة ماي 2017',
    sessionAr: 'دورة ماي 2017',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    exercises: [
      {
        titleAr: 'التمرين الأول (1.5 نقطة)',
        points: 1.5,
        contentAr: 'احسب بوضع العملية العمودية:\n1) 700.80 - 27.4 = ...\n2) 72.25 × 8 = ...\n3) 120.25 + 14.03 = ...',
        solutionAr: '1) 700.80 - 27.4 = 673.4\n2) 72.25 × 8 = 578\n3) 120.25 + 14.03 = 134.28'
      },
      {
        titleAr: 'التمرين الثاني (1.5 نقطة)',
        points: 1.5,
        contentAr: 'يخطو جدك 250 خطوة من المنزل إلى المسجد، إذا علمت أن طول كل خطوة هو 50cm.\n- احسب بالأمتار المسافة التي يقطعها الجد للذهاب إلى المسجد.',
        solutionAr: '1) حساب المسافة بالسنتيمتر: 250 × 50 = 12500 cm.\n2) تحويل المسافة إلى الأمتار: 12500 cm = 125 m.'
      },
      {
        titleAr: 'التمرين الثالث (1.5 نقطة)',
        points: 1.5,
        contentAr: 'أقلعت طائرة من المطار (أ) على الساعة 6h20min ودامت رحلتها في الجو 55min.\n- ما هو وقت وصول الطائرة إلى المطار (ب)؟',
        solutionAr: 'وقت الوصول = وقت الانطلاق + مدة السفر.\n6h 20min + 55min = 6h 75min = 7h 15min.\nوصلت الطائرة على الساعة 7 و15 دقيقة.'
      },
      {
        titleAr: 'التمرين الرابع (1.5 نقطة)',
        points: 1.5,
        contentAr: 'ارسم قطعة مستقيمة AB طولها 6cm. عين النقطة O منتصف هذه القطعة.\n- احسب طول القطعة AO.',
        solutionAr: 'النقطة O تقسم AB إلى النصف، إذن طول AO = 6 ÷ 2 = 3 cm.'
      }
    ],
    problemExercise: {
      titleAr: 'الوضعية الإدماجية (4 نقاط)',
      points: 4,
      contentAr: 'اشترى فاكهاني 4 صناديق برتقال، وزن الصندوق الواحد 10kg وثمن الكيلوغرام الواحد 50 دينار. واشترى 30kg تفاح بسعر 60 دينار للكيلوغرام.\nواكترى مركبة لنقل الفاكهة بـ 150 دينار.\n- احسب ثمن شراء البرتقال والتفاح وكلفة المشتريات الإجمالية.',
      solutionAr: '1) وزن البرتقال الكلي = 4 × 10 = 40 kg.\n2) ثمن شراء البرتقال = 40 × 50 = 2000 DA.\n3) ثمن شراء التفاح = 30 × 60 = 1800 DA.\n4) ثمن المشتريات الإجمالي = 2000 + 1800 = 3800 DA.\n5) الكلفة الإجمالية للمشتريات = 3800 + 150 (النقل) = 3950 DA.'
    }
  },
  {
    id: 'exam-2016-math',
    year: 2016,
    titleAr: 'امتحان شهادة التعليم الابتدائي - دورة ماي 2016',
    sessionAr: 'دورة ماي 2016',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    exercises: [
      {
        titleAr: 'التمرين الأول (1.5 نقطة)',
        points: 1.5,
        contentAr: 'احسب عمودياً العمليات الآتية:\n1) 135.15 × 6 = ...\n2) 120.1 - 10 = ...\n3) 17.37 + 3.12 = ...',
        solutionAr: '1) 135.15 × 6 = 810.90\n2) 120.1 - 10 = 110.1\n3) 17.37 + 3.12 = 20.49'
      },
      {
        titleAr: 'التمرين الثاني (1.5 نقطة)',
        points: 1.5,
        contentAr: 'استفاد عامل من زيادة قدرها 10% من أجرته الشهرية التي تبلغ 40,000 DA.\n- احسب مقدار الزيادة بالدينار.\n- ما هو مقدار أجرته الشهرية الجديدة بعد الزيادة؟',
        solutionAr: '1) مقدار الزيادة = (40000 × 10) ÷ 100 = 4000 DA.\n2) الأجرة الجديدة = 40000 + 4000 = 44,000 DA.'
      },
      {
        titleAr: 'التمرين الثالث (1.5 نقطة)',
        points: 1.5,
        contentAr: 'في مدرسة 200 تلميذاً، 60% منهم إناث.\n- احسب عدد الإناث وعدد الذكور ونسبة الذكور المئوية.',
        solutionAr: '1) عدد الإناث = (200 × 60) ÷ 100 = 120 بنتاً.\n2) عدد الذكور = 200 - 120 = 80 ولداً.\n3) نسبة الذكور المئوية = 100% - 60% = 40% (أو (80 × 100) ÷ 200 = 40%).'
      },
      {
        titleAr: 'التمرين الرابع (1.5 نقطة)',
        points: 1.5,
        contentAr: 'ارسم مستقيماً (D)، عين عليه النقطتين A و B المسافة بينهما 4cm.\nعين النقطة O منتصف القطعة [AB]. ارسم الدائرة التي مركزها O ونصف قطرها OA.',
        solutionAr: 'طول نصف القطر OA = 2cm وقطر الدائرة AB = 4cm.'
      }
    ],
    problemExercise: {
      titleAr: 'الوضعية الإدماجة (4 نقاط)',
      points: 4,
      contentAr: 'اشترى مدير مدرسة 120 قرصاً مضغوطاً بـ 45 DA للقرص ونقلها بـ 100 DA. وباع القرص الواحد بـ 55 DA.\n- احسب كلفة الأقراص وثمن بيعها وهل ربح المدير أم خسر وكم كان ذلك؟',
      solutionAr: '1) ثمن شراء الأقراص = 120 × 45 = 5400 DA.\n2) الكلفة الإجمالية = 5400 + 100 = 5500 DA.\n3) ثمن بيع الأقراص = 120 × 55 = 6600 DA.\n4) بما أن ثمن البيع (6600) أكبر من الكلفة (5500) فإن المدير ربح.\n5) الربح الصافي = 6600 - 5500 = 1100 DA.'
    }
  },

  // ==========================================
  // 🔢 MATHÉMATIQUES — Compositions trimestrielles 2026
  // ==========================================
  {
    id: 'exam-5ap-math-t1-2026',
    year: 2026,
    trimester: 1,
    titleAr: 'اختبار الفصل الأول في الرياضيات - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الأول 2026',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'أ) اكتب العدد التالي بالأرقام: [ثلاثة ملايين وخمسمائة وأربعة آلاف ومئتان].\nب) رتّب الأعداد التالية تصاعدياً: 3,504,200 - 3,450,200 - 3,540,020.', solutionAr: 'أ) 3,504,200.\nب) 3,450,200 < 3,504,200 < 3,540,020.' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'أنجز العمليات التالية عمودياً:\n1) 4,586 + 3,275 = ...\n2) 7,502 - 3,649 = ...', solutionAr: '1) 4,586 + 3,275 = 7,861.\n2) 7,502 - 3,649 = 3,853.' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'احسب: 246 × 3 = ...\nثم قدّر ناتج 289 + 411 بتقريب كل عدد لأقرب مئة.', solutionAr: '246 × 3 = 738.\nالتقدير: 300 + 400 = 700.' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'ارسم قطعة مستقيمة [AB] طولها 8cm، وعيّن نقطتها المنتصفة O.\n- احسب طول القطعة [AO].', solutionAr: 'طول [AO] = 8 ÷ 2 = 4cm.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'اشترى تاجر 25 كيس أرز بسعر 850 دج للكيس، وباع منها 18 كيساً بسعر 1000 دج للكيس.\n1) احسب ثمن شراء الأكياس كلها.\n2) احسب ثمن بيع الأكياس الـ18.\n3) هل ربح التاجر أم خسر من هذه العملية؟ وبكم؟', solutionAr: '1) ثمن الشراء الكلي = 25 × 850 = 21,250 DA.\n2) ثمن بيع 18 كيساً = 18 × 1000 = 18,000 DA.\n3) بما أن التاجر لم يبع سوى 18 كيساً من أصل 25 التي اشتراها (18,000 < 21,250 حتى قبل بيع الباقي)، فإن الحكم بالربح أو الخسارة يتطلب معرفة ثمن بيع الأكياس السبعة المتبقية؛ لكن بالنسبة للأكياس المباعة فقط، حقق التاجر مبيعات بـ18,000 DA.' },
  },
  {
    id: 'exam-5ap-math-t2-2026',
    year: 2026,
    trimester: 2,
    titleAr: 'اختبار الفصل الثاني في الرياضيات - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثاني 2026',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'أجرِ القسمة الإقليدية: 97 ÷ 8.\n- ما هو الحاصل والباقي؟', solutionAr: '97 = (8 × 12) + 1. الحاصل = 12، الباقي = 1.' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'قارن الكسرين التاليين باستعمال الرمز المناسب (< أو > أو =):\n1) 5/8 ..... 3/8\n2) 17/5 ..... 4', solutionAr: '1) 5/8 > 3/8.\n2) 17/5 = 3 + 2/5، وبما أن 2/5 < 1 فإن 17/5 < 4.' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'احسب: 9.25 + 4.6 = ...\nثم رتّب تنازلياً: 8.09 - 8.9 - 8.19.', solutionAr: '9.25 + 4.6 = 13.85.\nالترتيب التنازلي: 8.9 > 8.19 > 8.09.' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'حوّل: 1) 3.2 km إلى m. 2) 750 g إلى kg.', solutionAr: '1) 3.2 km = 3,200 m.\n2) 750 g = 0.75 kg.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'خصّص فلاح 3/5 من أرضه (مساحتها الكلية 900 m²) لزراعة القمح، والباقي للخضروات.\n1) احسب مساحة الأرض المخصصة للقمح.\n2) احسب مساحة الأرض المخصصة للخضروات.', solutionAr: '1) مساحة القمح = 900 × 3/5 = 540 m².\n2) مساحة الخضروات = 900 - 540 = 360 m².' },
  },
  {
    id: 'exam-5ap-math-t3-2026',
    year: 2026,
    trimester: 3,
    titleAr: 'اختبار الفصل الثالث في الرياضيات - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثالث 2026',
    subject: 'math',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'ارسم مستطيلاً طوله 7cm وعرضه 4cm.\n- احسب محيطه ومساحته.', solutionAr: 'المحيط = (7 + 4) × 2 = 22cm.\nالمساحة = 7 × 4 = 28cm².' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'إذا كان 3kg من التفاح بـ450 دج، فما ثمن 5kg من نفس التفاح؟', solutionAr: 'ثمن 5kg = (5 × 450) ÷ 3 = 750 دج.' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'احسب 15% من 6,000 دج.\nثم احسب ثمن سلعة بعد تخفيض بنسبة 15% إذا كان ثمنها الأصلي 6,000 دج.', solutionAr: 'مبلغ 15% = (6,000 × 15) ÷ 100 = 900 دج.\nالثمن بعد التخفيض = 6,000 - 900 = 5,100 دج.' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'رسم مستقيمان (D1) و(D2) متعامدان على نفس المستقيم (D3).\n- ماذا تستنتج عن العلاقة بين (D1) و(D2)؟', solutionAr: 'إذا كان (D1) ⊥ (D3) و(D2) ⊥ (D3) فإن (D1) و(D2) متوازيان حتماً.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'يقطع دراج مسافة 60km بسرعة منتظمة في 2h.\n1) احسب سرعته المتوسطة بالـ km/h.\n2) بنفس السرعة، ما المسافة التي يقطعها في 3h؟', solutionAr: '1) السرعة = 60 ÷ 2 = 30 km/h.\n2) المسافة في 3h = 30 × 3 = 90 km.' },
  },

  // ==========================================
  // 📖 اللغة العربية — الاختبارات الفصلية 2026
  // ==========================================
  {
    id: 'exam-5ap-arabic-t1-2026',
    year: 2026,
    trimester: 1,
    titleAr: 'اختبار الفصل الأول في اللغة العربية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الأول 2026',
    subject: 'arabic',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول: الفهم (1.5 نقطة)', points: 1.5, contentAr: 'اقرأ النص التالي ثم أجب:\n« يحب أحمد المدرسة كثيراً، فهو يستيقظ باكراً كل صباح، ويستعد بسرعة، ويصل إلى القسم قبل زملائه. »\n1) بمَ يشعر أحمد تجاه المدرسة؟\n2) استخرج من النص فعلاً مضارعاً.', solutionAr: '1) يشعر أحمد بحب كبير تجاه المدرسة.\n2) من الأفعال المضارعة: يحب، يستيقظ، يستعد، يصل.' },
      { titleAr: 'التمرين الثاني: القواعد (1.5 نقطة)', points: 1.5, contentAr: 'حدد الفاعل والمفعول به في الجملة: « قرأ التلميذُ القصةَ. »', solutionAr: 'الفاعل: التلميذُ (مرفوع بالضمة). المفعول به: القصةَ (منصوب بالفتحة).' },
      { titleAr: 'التمرين الثالث: الصرف (1.5 نقطة)', points: 1.5, contentAr: 'صرّف الفعل « كَتَبَ » في المضارع مع الضمائر: أنا، أنتَ، هو.', solutionAr: 'أنا أكتُبُ، أنتَ تكتُبُ، هو يكتُبُ.' },
      { titleAr: 'التمرين الرابع: الإملاء (1.5 نقطة)', points: 1.5, contentAr: 'اكتب جمع الكلمات التالية: كتاب - مدرسة - قلم.', solutionAr: 'كتاب → كُتُب. مدرسة → مدارس. قلم → أقلام.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية: التعبير الكتابي (4 نقاط)', points: 4, contentAr: 'اكتب فقرة من 4 إلى 5 أسطر تصف فيها يومك الأول في المدرسة، مستعملاً فعلين ماضيين على الأقل.', solutionAr: 'نموذج إجابة: « في يومي الأول بالمدرسة، استيقظتُ باكراً ولبستُ ملابسي الجديدة. ذهبتُ مع والدي وشعرتُ بفرحة كبيرة عندما قابلتُ معلمتي وزملائي الجدد. لعبنا معاً في الساحة، وأحببتُ مدرستي من أول يوم. » (يُقيَّم النص حسب سلامة اللغة وتوظيف الأفعال الماضية ووضوح الأفكار.)' },
  },
  {
    id: 'exam-5ap-arabic-t2-2026',
    year: 2026,
    trimester: 2,
    titleAr: 'اختبار الفصل الثاني في اللغة العربية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثاني 2026',
    subject: 'arabic',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول: الفهم (1.5 نقطة)', points: 1.5, contentAr: 'اقرأ النص التالي ثم أجب:\n« هرع رجال الحماية المدنية إلى مكان الحريق، وعملوا بسرعة لإنقاذ السكان، وتمكنوا من إخماد النار قبل أن تنتشر. »\n1) ماذا فعل رجال الحماية المدنية؟\n2) استخرج من النص فعلين ماضيين.', solutionAr: '1) هرعوا إلى مكان الحريق وأنقذوا السكان وأخمدوا النار.\n2) من الأفعال الماضية: هرع، عملوا، تمكنوا، أخمدت.' },
      { titleAr: 'التمرين الثاني: القواعد (1.5 نقطة)', points: 1.5, contentAr: 'ميّز بين النعت والمنعوت في الجملة: « رأيتُ رجلاً شجاعاً. »', solutionAr: 'المنعوت: رجلاً. النعت: شجاعاً (يطابق المنعوت في التذكير والتنكير والإعراب).' },
      { titleAr: 'التمرين الثالث: الصرف (1.5 نقطة)', points: 1.5, contentAr: 'حوّل الأفعال التالية من الماضي إلى المضارع: نجح - وصل - سمع.', solutionAr: 'نجح → ينجح. وصل → يصل. سمع → يسمع.' },
      { titleAr: 'التمرين الرابع: الإملاء (1.5 نقطة)', points: 1.5, contentAr: 'أدرج الهمزة في مكانها الصحيح: « سُ...ل التلميذ عن دروسه » (سئل/سؤل/سءل).', solutionAr: 'الصحيح: « سُئِلَ التلميذ عن دروسه » — الهمزة على الياء لأنها مكسورة وما قبلها مضموم.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية: التعبير الكتابي (4 نقاط)', points: 4, contentAr: 'اكتب فقرة من 4 إلى 5 أسطر تصف فيها سلوك رجل الحماية المدنية أثناء تدخله في كارثة طبيعية.', solutionAr: 'نموذج إجابة: « عندما وقع الزلزال، هرع رجال الحماية المدنية بسرعة إلى الأحياء المتضررة. عملوا بشجاعة لإنقاذ العائلات المحاصرة، وقدموا الإسعافات الأولية للجرحى. لقد ضحّوا بوقتهم وراحتهم من أجل سلامة الآخرين، فاستحقوا كل تقدير واحترام. » (يُقيَّم النص حسب سلامة اللغة ووضوح الوصف.)' },
  },
  {
    id: 'exam-5ap-arabic-t3-2026',
    year: 2026,
    trimester: 3,
    titleAr: 'اختبار الفصل الثالث في اللغة العربية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثالث 2026',
    subject: 'arabic',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول: الفهم (1.5 نقطة)', points: 1.5, contentAr: 'اقرأ النص التالي ثم أجب:\n« تُعد قصبة الجزائر معلماً تاريخياً عريقاً، يزورها آلاف السياح كل عام للتعرف على عمارتها الفريدة وتاريخها العريق. »\n1) لماذا يزور السياح قصبة الجزائر؟\n2) اذكر مرادف كلمة « عريقاً ».', solutionAr: '1) يزورونها للتعرف على عمارتها الفريدة وتاريخها.\n2) مرادف « عريقاً »: أصيلاً / قديماً.' },
      { titleAr: 'التمرين الثاني: القواعد (1.5 نقطة)', points: 1.5, contentAr: 'حدد المبتدأ والخبر في الجملة: « المعلمُ التاريخيُّ جميلٌ. »', solutionAr: 'المبتدأ: المعلمُ التاريخيُّ. الخبر: جميلٌ (مرفوع بالضمة).' },
      { titleAr: 'التمرين الثالث: الصرف (1.5 نقطة)', points: 1.5, contentAr: 'اكتب فعل الأمر من الأفعال التالية: يزورُ - يحافظُ - يحترمُ.', solutionAr: 'يزور → زُرْ. يحافظ → حافِظْ. يحترم → احترِمْ.' },
      { titleAr: 'التمرين الرابع: الإملاء (1.5 نقطة)', points: 1.5, contentAr: 'ميّز التاء المربوطة من التاء المفتوحة في الكلمات: مدرسة - بيت - حديقة.', solutionAr: 'التاء المربوطة: مدرسة، حديقة. التاء المفتوحة: بيت.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية: التعبير الكتابي (4 نقاط)', points: 4, contentAr: 'اكتب فقرة من 4 إلى 5 أسطر تصف فيها زيارة قمتَ بها إلى معلم أثري أو تاريخي في الجزائر.', solutionAr: 'نموذج إجابة: « زرتُ مع عائلتي مدينة تيمقاد الأثرية. أعجبتني الأعمدة الرومانية القديمة وشعرتُ أنني أعيش في زمن مضى. تعلمتُ من هذه الزيارة أهمية المحافظة على تراثنا الوطني العريق للأجيال القادمة. » (يُقيَّم النص حسب سلامة اللغة ووضوح الوصف.)' },
  },

  // ==========================================
  // 🥖 FRANÇAIS — Compositions trimestrielles 2026
  // ==========================================
  {
    id: 'exam-5ap-french-t1-2026',
    year: 2026,
    trimester: 1,
    titleAr: 'Composition du 1er trimestre — Français — 5ème Année Primaire',
    sessionAr: 'Trimestre 1 - 2026',
    subject: 'french',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'Exercice 1 : Compréhension (1.5 point)', points: 1.5, contentAr: 'Lis le texte puis réponds :\n« Le lion est un animal sauvage. Il vit dans la savane avec sa famille. Il a un pelage doré et une grande crinière. »\n1) Où vit le lion ?\n2) Relève un adjectif qualificatif dans le texte.', solutionAr: '1) Le lion vit dans la savane.\n2) « sauvage », « doré » ou « grande » sont des adjectifs qualificatifs.' },
      { titleAr: 'Exercice 2 : Grammaire (1.5 point)', points: 1.5, contentAr: 'Souligne le GNS et encadre le GV : « Le grand éléphant traverse la rivière. »', solutionAr: 'GNS : « Le grand éléphant ». GV : « traverse la rivière ».' },
      { titleAr: 'Exercice 3 : Conjugaison (1.5 point)', points: 1.5, contentAr: 'Conjugue le verbe « manger » au présent avec : je, tu, ils.', solutionAr: 'Je mange, tu manges, ils mangent.' },
      { titleAr: 'Exercice 4 : Orthographe (1.5 point)', points: 1.5, contentAr: 'Mets au féminin : un chat blanc → une chatte ......\nun gros chien → une ...... chienne.', solutionAr: 'Une chatte blanche. Une grosse chienne.' },
    ],
    problemExercise: { titleAr: "Situation d'intégration : Production écrite (4 points)", points: 4, contentAr: "Décris ton animal préféré en 4 à 5 phrases (son apparence, où il vit, ce qu'il mange).", solutionAr: "Exemple de réponse : « Mon animal préféré est le chat. Il a un pelage doux et des yeux verts. Il vit dans ma maison avec ma famille. Il mange des croquettes et boit du lait. J'aime jouer avec lui tous les jours. » (Évaluation selon la richesse du vocabulaire et la correction grammaticale.)" },
  },
  {
    id: 'exam-5ap-french-t2-2026',
    year: 2026,
    trimester: 2,
    titleAr: 'Composition du 2ème trimestre — Français — 5ème Année Primaire',
    sessionAr: 'Trimestre 2 - 2026',
    subject: 'french',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'Exercice 1 : Compréhension (1.5 point)', points: 1.5, contentAr: "Lis le texte puis réponds :\n« Après le séisme, les pompiers sont arrivés rapidement. Ils ont sauvé plusieurs familles et ont soigné les blessés. »\n1) Qui est arrivé rapidement ?\n2) Relève un verbe au passé composé.", solutionAr: "1) Les pompiers sont arrivés rapidement.\n2) « sont arrivés » ou « ont sauvé » ou « ont soigné »." },
      { titleAr: 'Exercice 2 : Grammaire (1.5 point)', points: 1.5, contentAr: "Identifie le COD dans la phrase : « Le pompier sauve l'enfant. »", solutionAr: "Le COD est « l'enfant » (répond à la question « qui ? » après le verbe, sans préposition)." },
      { titleAr: 'Exercice 3 : Conjugaison (1.5 point)', points: 1.5, contentAr: "Conjugue au passé composé : « Elle ___ (partir) tôt. » / « Il ___ (sauver) un chat. »", solutionAr: "Elle est partie tôt. Il a sauvé un chat." },
      { titleAr: 'Exercice 4 : Orthographe (1.5 point)', points: 1.5, contentAr: "Complète par le bon homophone : « Les secouristes ...... (a/ont) aidé les blessés. »", solutionAr: "Les secouristes ont aidé les blessés (« ont » = verbe avoir, pas « a »)." },
    ],
    problemExercise: { titleAr: "Situation d'intégration : Production écrite (4 points)", points: 4, contentAr: "Raconte en 4 à 5 phrases, au passé composé, comment les secours sont intervenus lors d'une catastrophe naturelle.", solutionAr: "Exemple de réponse : « Hier, un incendie s'est déclaré près de chez moi. Les pompiers sont arrivés très vite avec leurs camions. Ils ont éteint le feu et ont sauvé toutes les familles du quartier. Tout le monde était très reconnaissant envers eux. » (Évaluation selon l'usage correct du passé composé et la cohérence du récit.)" },
  },
  {
    id: 'exam-5ap-french-t3-2026',
    year: 2026,
    trimester: 3,
    titleAr: 'Composition du 3ème trimestre — Français — 5ème Année Primaire',
    sessionAr: 'Trimestre 3 - 2026',
    subject: 'french',
    grade: '5AP',
    durationMinutes: 90,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'Exercice 1 : Compréhension (1.5 point)', points: 1.5, contentAr: "Lis le texte puis réponds :\n« Demain, notre classe visitera le musée de la Casbah. Nous découvrirons son architecture ancienne et son histoire fascinante. »\n1) Où la classe ira-t-elle demain ?\n2) Relève un verbe au futur simple.", solutionAr: "1) La classe visitera le musée de la Casbah.\n2) « visitera » ou « découvrirons »." },
      { titleAr: 'Exercice 2 : Grammaire (1.5 point)', points: 1.5, contentAr: "Identifie le complément circonstanciel de temps (CCT) dans : « Demain, nous visiterons Timgad. »", solutionAr: "Le CCT est « Demain » (répond à la question « quand ? »)." },
      { titleAr: 'Exercice 3 : Conjugaison (1.5 point)', points: 1.5, contentAr: "Conjugue au futur simple : « Nous ___ (visiter) le musée. » / « Vous ___ (être) surpris. »", solutionAr: "Nous visiterons le musée. Vous serez surpris." },
      { titleAr: 'Exercice 4 : Orthographe (1.5 point)', points: 1.5, contentAr: "Choisis le bon homophone : « ...... (Où/Ou) se trouve le musée ? »", solutionAr: "Où se trouve le musée ? (« Où » indique un lieu)." },
    ],
    problemExercise: { titleAr: "Situation d'intégration : Production écrite (4 points)", points: 4, contentAr: "Écris une courte lettre à un ami pour lui raconter, au futur simple, la visite d'un lieu historique que ta classe organisera.", solutionAr: "Exemple de réponse : « Cher ami, la semaine prochaine, notre classe visitera la Casbah d'Alger. Nous découvrirons ses ruelles anciennes et son architecture unique. Le guide nous racontera son histoire. J'ai hâte d'y aller ! » (Évaluation selon l'usage correct du futur simple et la structure de la lettre.)" },
  },

  // ==========================================
  // 🔬 التربية العلمية والتكنولوجية — الاختبارات الفصلية 2026
  // ==========================================
  {
    id: 'exam-5ap-science-t1-2026',
    year: 2026,
    trimester: 1,
    titleAr: 'اختبار الفصل الأول في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الأول 2026',
    subject: 'science',
    grade: '5AP',
    durationMinutes: 60,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'اذكر اسمين لعنصرين من الجهاز التنفسي يمر بهما الهواء قبل وصوله إلى الرئتين.', solutionAr: 'الأنف والرغامى (القصبة الهوائية) هما عنصران يمر بهما الهواء قبل الوصول إلى الرئتين، ثم القصبات الهوائية.' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'أين تتم المبادلات الغازية التنفسية؟ اذكر الغاز الذي يدخل الدم والغاز الذي يخرج منه.', solutionAr: 'تتم المبادلات الغازية في الأسناخ الرئوية. يدخل الأكسجين (O₂) إلى الدم، ويخرج ثاني أكسيد الكربون (CO₂).' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'اذكر نوعين من الأوعية الدموية ودور كل واحد منهما.', solutionAr: 'الشرايين: تنقل الدم المحمل بالأكسجين من القلب إلى الأعضاء. الأوردة: تعيد الدم المحمل بثاني أكسيد الكربون من الأعضاء إلى القلب.' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'اذكر قاعدتين من قواعد الوقاية والحفاظ على صحة الجهاز التنفسي.', solutionAr: 'من قواعد الوقاية: تهوية الغرف يومياً، وممارسة الرياضة في الهواء النقي، وتجنب استنشاق الدخان.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'أغلق أحمد نوافذ غرفته وترك موقد التدفئة مشتعلاً طوال الليل. في الصباح شعر بدوار وصداع شديدين.\n1) ما سبب هذه الأعراض في رأيك؟\n2) اقترح حلين لتجنب هذا الخطر مستقبلاً.', solutionAr: '1) استنشق أحمد على الأرجح غاز أول أكسيد الكربون (CO) الناتج عن احتراق غير تام للموقد بسبب انعدام التهوية.\n2) الحلول: تهوية الغرفة قبل النوم، وعدم ترك المواقد مشتعلة طوال الليل في غرفة مغلقة.' },
  },
  {
    id: 'exam-5ap-science-t2-2026',
    year: 2026,
    trimester: 2,
    titleAr: 'اختبار الفصل الثاني في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثاني 2026',
    subject: 'science',
    grade: '5AP',
    durationMinutes: 60,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'اذكر العناصر الثلاثة التي يحتاجها النبات الأخضر للنمو.', solutionAr: 'يحتاج النبات الأخضر إلى: الماء والأملاح المعدنية، الضوء، وغاز ثاني أكسيد الكربون (CO₂).' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'ما اسم الجزء الذي يمتص الماء والأملاح المعدنية من التربة؟ وماذا يحدث للنبات إذا قُطع هذا الجزء؟', solutionAr: 'الأوبار الماصة الموجودة في جذر النبات. إذا قُطع الجذر أو الأوبار الماصة، يموت النبات لعدم قدرته على الامتصاص.' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'اذكر مرضين من أمراض سوء التغذية وسبب كل واحد منهما.', solutionAr: 'فقر الدم: سببه نقص الحديد. الكساح: سببه نقص فيتامين D والكالسيوم.' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'اذكر قاعدتين صحيتين للتغذية السليمة.', solutionAr: 'من القواعد الصحية: تناول وجبات متوازنة موزعة على أوقات محددة، وشرب كمية كافية من الماء يومياً.' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'يعاني الطفل سامي من انحناء في عظام ساقيه وتأخر في ظهور أسنانه.\n1) ما اسم المرض الذي يعاني منه سامي في رأيك؟ وما سببه؟\n2) اقترح حلاً غذائياً لمساعدته.', solutionAr: '1) يعاني سامي على الأرجح من مرض الكساح، الناتج عن نقص فيتامين D والكالسيوم.\n2) الحل: تناول أغذية غنية بالكالسيوم (الحليب ومشتقاته) والتعرض المعتدل لأشعة الشمس.' },
  },
  {
    id: 'exam-5ap-science-t3-2026',
    year: 2026,
    trimester: 3,
    titleAr: 'اختبار الفصل الثالث في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي',
    sessionAr: 'الفصل الثالث 2026',
    subject: 'science',
    grade: '5AP',
    durationMinutes: 60,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    exercises: [
      { titleAr: 'التمرين الأول (1.5 نقطة)', points: 1.5, contentAr: 'اذكر مادتين ناقلتين للكهرباء ومادتين عازلتين لها.', solutionAr: 'ناقلتان: الحديد، النحاس. عازلتان: البلاستيك، الخشب.' },
      { titleAr: 'التمرين الثاني (1.5 نقطة)', points: 1.5, contentAr: 'اذكر مراحل دورة الماء في الطبيعة الأربع.', solutionAr: 'التبخر، ثم التكاثف، ثم الهطول، ثم الجريان والعودة إلى البحار والأنهار.' },
      { titleAr: 'التمرين الثالث (1.5 نقطة)', points: 1.5, contentAr: 'اذكر طريقتين تكيّف بهما النباتات الصحراوية مع قلة الماء.', solutionAr: 'امتداد الجذور عميقاً بحثاً عن الماء، وادّخار الماء في ساق أو أوراق لحمية (كالصبار).' },
      { titleAr: 'التمرين الرابع (1.5 نقطة)', points: 1.5, contentAr: 'ما الفرق بين الحيوانات البيوضة والحيوانات الولودة؟ اذكر مثالاً لكل نوع.', solutionAr: 'البيوضة تضع بيضاً ينمو الجنين خارج جسم الأم (مثال: الدجاجة). الولودة يلد صغارها أحياء مباشرة (مثال: القطة).' },
    ],
    problemExercise: { titleAr: 'الوضعية الإدماجية (4 نقاط)', points: 4, contentAr: 'أراد تلميذ التحقق تجريبياً من أن الهواء مادة حقيقية تشغل حيّزاً من الفضاء.\n1) اقترح تجربة بسيطة يمكنه القيام بها.\n2) فسّر النتيجة المتوقعة من هذه التجربة.', solutionAr: '1) يمكن غمر كأس مقلوب رأساً على عقب في وعاء ماء.\n2) الماء لا يملأ الكأس بالكامل، لأن الهواء المحبوس بداخله يشغل حيّزاً ويمنع الماء من الدخول، مما يثبت أن الهواء مادة حقيقية.' },
  },
];
