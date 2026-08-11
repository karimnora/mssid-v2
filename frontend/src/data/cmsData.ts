import {
  CmsUser,
  CmsCurriculumProgram,
  CmsCourseItem,
  CmsExercise,
  CmsExamSpec,
  MediaAsset,
  DocumentImportSession,
  CmsAnalyticsStats,
} from '../types/cms';

export const INITIAL_CMS_USERS: CmsUser[] = [
  {
    id: 'usr_admin',
    name: 'أ. عبد القادر المنصوري',
    email: 'admin.mansouri@education.dz',
    role: 'admin',
    avatar: '👨‍🏫',
    department: 'المفتشية العامة للتعليم الابتدائي',
  },
  {
    id: 'usr_teacher_1',
    name: 'م. مريم العربي',
    email: 'm.larbi@ecole.dz',
    role: 'teacher',
    avatar: '👩‍🏫',
    department: 'قسم الرياضيات والتكنولوجيا',
  },
  {
    id: 'usr_reviewer_1',
    name: 'د. سليم بوعزيز',
    email: 'bouaziz.reviewer@edudz.org',
    role: 'reviewer',
    avatar: '👨‍🔬',
    department: 'اللجنة البيدagogية للمناهج',
  },
];

export const INITIAL_CMS_CURRICULUM_PROGRAM: CmsCurriculumProgram = {
  id: 'prog_dz_2026',
  country: 'الجزائر',
  schoolSystem: 'المنهاج الوطني لوزارة التربية الوطنية الجزائرية',
  academicYear: '2025/2026',
  grade: '5AP',
  subject: 'math',
  updatedAt: new Date().toISOString().slice(0, 10),
  chapters: [
    {
      id: 'chap_math_5ap_01',
      grade: '5AP',
      subject: 'math',
      code: 'CH-M501',
      titleAr: 'الميدان الأول: الأعداد والحساب',
      order: 1,
      competencies: [
        {
          id: 'comp_m501_1',
          code: 'COMP-M501-1',
          domainAr: 'الأعداد والحساب',
          descriptionAr: 'يحل مشكلات متعلقة بالأعداد الطبيعية الكبيرة والأعداد العشرية والكسور.',
        },
      ],
      subLessons: [
        {
          id: 'sub_m501_1_1',
          titleAr: 'الأعداد إلى 999 999 999 (كتابة وقراءة ومقارنة)',
          order: 1,
          objectives: [
            { id: 'obj_1', descriptionAr: 'يتعرف على المراتب والوحدات البسيطة وآلاف وملايين.', bloomTaxonomyLevel: 'comprehension' },
          ],
          contentAr: 'قراءة الأعداد الكبيرة وتفكيكها حسب المراتب...',
        },
        {
          id: 'sub_m501_1_2',
          titleAr: 'الكسور العشرية والأعداد العشرية',
          order: 2,
          objectives: [
            { id: 'obj_2', descriptionAr: 'يحول كسر عشري مقامه 10 أو 100 أو 1000 إلى عدد بالفاصلة.', bloomTaxonomyLevel: 'application' },
          ],
          contentAr: 'الانتقال من كتابة كسرية إلى كتابة بالفاصلة...',
        },
      ],
    },
    {
      id: 'chap_math_5ap_02',
      grade: '5AP',
      subject: 'math',
      code: 'CH-M502',
      titleAr: 'الميدان الثاني: تنظيم المعطيات والتناسبية',
      order: 2,
      competencies: [
        {
          id: 'comp_m502_1',
          code: 'COMP-M502-1',
          domainAr: 'تنظيم المعطيات',
          descriptionAr: 'يستخرج معلومات من جدول أو مخطط بياني ويحسب معامل التناسبية.',
        },
      ],
      subLessons: [
        {
          id: 'sub_m502_2_1',
          titleAr: 'معامل التناسبية والنسبة المئوية',
          order: 1,
          objectives: [
            { id: 'obj_3', descriptionAr: 'يحسب معامل التناسبية ويعبئ جدول تناسبية بسيط.', bloomTaxonomyLevel: 'application' },
          ],
          contentAr: 'طرق حل جدول التناسبية باكتشاف المعامل...',
        },
      ],
    },
    {
      id: 'chap_math_5ap_03',
      grade: '5AP',
      subject: 'math',
      code: 'CH-M503',
      titleAr: 'الميدان الثالث: الهندسة والفضاء',
      order: 3,
      competencies: [
        {
          id: 'comp_m503_1',
          code: 'COMP-M503-1',
          domainAr: 'الهندسة والفضاء',
          descriptionAr: 'يتعرف على الخواص الهندسية للأشكال المستوية والمجسمات ويحسب مساحاتها ومحيطها.',
        },
      ],
      subLessons: [
        {
          id: 'sub_m503_3_1',
          titleAr: 'المحيط والمساحة للمربع والمستطيل',
          order: 1,
          objectives: [
            { id: 'obj_4', descriptionAr: 'يفرق بين مفهوم المحيط ومفهوم المساحة ويطبق القوانين.', bloomTaxonomyLevel: 'application' },
          ],
          contentAr: 'قوانين حساب المحيط والمساحة للأشكال الإعتيادية...',
        },
      ],
    },
  ],
};

export const INITIAL_CMS_COURSES: CmsCourseItem[] = [
  {
    id: 'cms_course_math_numbers',
    chapterId: 'chap_math_5ap_01',
    grade: '5AP',
    subject: 'math',
    titleAr: 'الأعداد الكبيرة إلى 999 999 999 والتفكيك النموذجي',
    titleFr: 'Les grands nombres jusqu’à 999 999 999',
    summaryAr: 'درس مفصل لقراءة وكتابة وتفكيك الأعداد الطبيعية الكبيرة بالاستعانة بجدول المراتب.',
    bodyHtmlContent: `
      <div class="space-y-4 text-right dir-rtl">
        <h3 class="text-lg font-bold text-slate-900">1. جدول المراتب والوحدات</h3>
        <p class="text-slate-700 leading-relaxed">تتكون الأعداد الكبيرة من منزلة الوحدات البسيطة (آحاد، عشرات، مئات)، منزلة الآلاف، ومنزلة الملايين.</p>
        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <strong class="text-amber-900 block mb-1">القاعدة الذهبية:</strong>
          <p class="text-slate-800 text-sm">لقراءة عدد كبير، نقسم أرقامه إلى أفواج من ثلاثة أرقام بدءاً من اليمين، ثم نقرأ من اليسار إلى اليمين.</p>
        </div>
      </div>
    `,
    rulesAr: [
      'نقسم أرقام العدد إلى مجموعات من 3 أرقام ابتداءً من اليمين.',
      'التفكيك النموذجي: 425 100 = (4 × 100000) + (2 × 10000) + (5 × 1000) + 100.',
    ],
    keyFormulas: [
      { labelAr: 'التفكيك حسب المراتب', formulaAr: 'N = (a × 10ⁿ) + (b × 10ⁿ⁻¹) + ...' },
    ],
    mediaUrls: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'],
    attachments: [
      { name: 'جدول_المراتب_الرسمي_5AP.pdf', url: '#', size: '1.2 MB' },
    ],
    interactiveTool: 'soroban',
    version: 2,
    versionsHistory: [
      {
        versionNumber: 1,
        updatedAt: '2026-01-10',
        authorName: 'م. مريم العربي',
        titleAr: 'الأعداد الكبيرة إلى 999 999 999',
        summaryAr: 'المسودة الأولى للدرس.',
        bodyHtmlContent: '<p>مسودة أولية...</p>',
        changeLogAr: 'إنشاء الدرس المبدئي',
      },
      {
        versionNumber: 2,
        updatedAt: '2026-02-01',
        authorName: 'أ. عبد القادر المنصوري',
        titleAr: 'الأعداد الكبيرة إلى 999 999 999 والتفكيك النموذجي',
        summaryAr: 'إضافة التفكيك النموذجي وجدول المراتب البيدagogي.',
        bodyHtmlContent: '<p>نسخة معتمدة ومراجعة...</p>',
        changeLogAr: 'اعتماد المراجعة النهائية إضافة التفكيك النموذجي.',
      },
    ],
    workflowStatus: 'published',
    authorName: 'م. مريم العربي',
    reviewerName: 'د. سليم بوعزيز',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'cms_course_math_fractions',
    chapterId: 'chap_math_5ap_01',
    grade: '5AP',
    subject: 'math',
    titleAr: 'الكسور العشرية والكتابة بالفاصلة',
    titleFr: 'Fractions décimales et écriture à virgule',
    summaryAr: 'طريقة تحويل الكسر العشري إلى عدد عشري وطرح وجمع الأعداد العشرية.',
    bodyHtmlContent: `
      <div class="space-y-3 dir-rtl text-right">
        <h4 class="font-extrabold text-slate-900">طريقة التحويل:</h4>
        <p>لكتابة كسر عشري مقامه 10 أو 100 على شكل عدد عشري، نكتب بسطه ثم نضع الفاصلة بعد عدد أرقام مساوٍ لأصفار المقام.</p>
      </div>
    `,
    rulesAr: [
      'الكسر العشري هو كل كسر مقامه 10، 100، 1000...',
      'العدد العشري يتكون من جزء صحيح وجزء عشري تفصلهما فاصلة.',
    ],
    keyFormulas: [
      { labelAr: 'تحويل 100/X', formulaAr: '247 / 100 = 2.47' },
    ],
    mediaUrls: [],
    attachments: [],
    interactiveTool: 'unit_converter',
    version: 1,
    versionsHistory: [],
    workflowStatus: 'published',
    authorName: 'أ. عبد القادر المنصوري',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
];

export const INITIAL_CMS_EXERCISES: CmsExercise[] = [
  {
    id: 'ex_001',
    chapterId: 'chap_math_5ap_01',
    grade: '5AP',
    subject: 'math',
    titleAr: 'مقارنة وتحويل الكسر العشري 75/10',
    type: 'qcm',
    difficulty: 'easy',
    estimatedMinutes: 3,
    pointsXp: 15,
    questionAr: 'ما هو العدد العشري المساوي للكسر العشري 75/10؟',
    options: [
      { id: 'opt1', textAr: '0.75', isCorrect: false, explanationAr: 'خطأ، 0.75 تساوي 75/100.' },
      { id: 'opt2', textAr: '7.5', isCorrect: true, explanationAr: 'ممتاز! قسمة 75 على 10 تزح الفاصلة مرتبة واحدة لليسار.' },
      { id: 'opt3', textAr: '75.0', isCorrect: false, explanationAr: 'خطأ.' },
    ],
    correctSolutionAr: '7.5',
    stepByStepExplanationAr: 'المقام به صفر واحد (10)، نضع الفاصلة بعد رقم واحد من اليمين في العدد 75 لتصبح 7.5.',
    competencyCode: 'COMP-M501-1',
    workflowStatus: 'published',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'ex_002',
    chapterId: 'chap_math_5ap_03',
    grade: '5AP',
    subject: 'math',
    titleAr: 'حساب مساحة ومحيط حقل مستطيل',
    type: 'calculation',
    difficulty: 'medium',
    estimatedMinutes: 10,
    pointsXp: 30,
    questionAr: 'حقل مستطيل الشكل طوله 120m وعرضه 60m. احسب محيط هذا الحقل ومساحته.',
    correctSolutionAr: 'المحيط = (120 + 60) × 2 = 360m | المساحة = 120 × 60 = 7200 m²',
    stepByStepExplanationAr: `
      1. محيط المستطيل = (الطول + العرض) × 2 = (120 + 60) × 2 = 180 × 2 = 360m.
      2. مساحة المستطيل = الطول × العرض = 120 × 60 = 7200 m².
    `,
    competencyCode: 'COMP-M503-1',
    workflowStatus: 'published',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'ex_003',
    chapterId: 'chap_math_5ap_01',
    grade: '5AP',
    subject: 'math',
    titleAr: 'تعبئة الفراغات في قانون مساحة المربع',
    type: 'fill_blanks',
    difficulty: 'easy',
    estimatedMinutes: 4,
    pointsXp: 20,
    questionAr: 'أكمل عبارة قانون حساب مساحة المربع بالألفاظ المناسبة.',
    fillBlanksTextAr: 'مساحة المربع تساوي [الضلع] × [الضلع]، بينما محيط المربع يساوي [الضلع] × [4].',
    correctSolutionAr: 'الضلع، الضلع، الضلع، 4',
    stepByStepExplanationAr: 'مساحة المربع = الضلع × الضلع. ومحيطه = الضلع × 4.',
    workflowStatus: 'review',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
];

export const INITIAL_CMS_EXAMS: CmsExamSpec[] = [
  {
    id: 'exam_spec_5ap_trim1_2026',
    grade: '5AP',
    subject: 'math',
    year: 2026,
    sessionAr: 'امتحان الفصل الأول 2025/2026',
    titleAr: 'اختبار الفصل الأول في مادة الرياضيات - السنة الخامسة ابتدائي',
    durationMinutes: 90,
    totalPoints: 10,
    passingScore: 5,
    exerciseIds: ['ex_001', 'ex_002', 'ex_003'],
    autoGradingEnabled: true,
    workflowStatus: 'published',
    authorName: 'أ. عبد القادر المنصوري',
    createdAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'exam_spec_5ap_2026',
    grade: '5AP',
    subject: 'math',
    year: 2026,
    sessionAr: 'دورة جوان 2026 النموذجية',
    titleAr: 'امتحان شهادة التعليم الابتدائي التجريبي - رياضيات 2026',
    durationMinutes: 90,
    totalPoints: 10,
    passingScore: 5,
    exerciseIds: ['ex_001', 'ex_002', 'ex_003'],
    autoGradingEnabled: true,
    workflowStatus: 'published',
    authorName: 'أ. عبد القادر المنصوري',
    createdAt: new Date().toISOString().slice(0, 10),
  },
];

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med_001',
    name: 'جدول_المراتب_الرسمي_الوزاري.pdf',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    sizeFormatted: '1.4 MB',
    uploadedAt: '2026-01-15',
    tags: ['وزارة التربية', 'جدول المراتب', '5AP'],
  },
  {
    id: 'med_002',
    name: 'صورة_معداد_السوروبان_الياباني.png',
    type: 'illustration',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    sizeFormatted: '850 KB',
    uploadedAt: '2026-02-01',
    tags: ['سوروبان', 'حساب ذهني', 'تفاعلي'],
  },
  {
    id: 'med_003',
    name: 'شرح_فيديو_التناسبية_المنهاج.mp4',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sizeFormatted: '14.2 MB',
    uploadedAt: '2026-02-03',
    tags: ['فيديو', 'تناسبية', 'شرح'],
  },
];

export const INITIAL_IMPORT_SESSIONS: DocumentImportSession[] = [
  {
    id: 'imp_001',
    filename: 'المنهاج_الرسمي_للتربية_الوطنية_السنة_الخامسة_ابتدائي_2026.pdf',
    fileType: 'pdf',
    fileSizeBytes: 3450000,
    extractedTextPreview: 'الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التربية الوطنية... الميدان الأول: الأعداد والحساب...',
    detectedGrade: '5AP',
    detectedSubject: 'math',
    detectedChapters: [
      {
        titleAr: 'الميدان الأول: الأعداد والحساب',
        competenciesAr: ['يحل مشكلات الأعداد الطبيعية والعشرية'],
        lessonsAr: ['الأعداد إلى 999 999 999', 'الكسور العشرية'],
      },
      {
        titleAr: 'الميدان الثاني: تنظيم المعطيات',
        competenciesAr: ['حل مشكلات التناسبية المباشرة'],
        lessonsAr: ['جدول التناسبية والنسبة المئوية'],
      },
    ],
    status: 'preview',
    createdAt: new Date().toISOString().slice(0, 10),
  },
];

export const INITIAL_CMS_ANALYTICS: CmsAnalyticsStats = {
  totalCourses: 18,
  totalExercises: 42,
  totalExams: 8,
  totalMediaAssets: 24,
  publishedRatio: 0.82,
  activeStudentsCount: 1420,
  averagePassRatePercent: 78.5,
  averageTimeSpentMinutes: 24,
  statusBreakdown: {
    published: 18,
    validated: 4,
    review: 3,
    draft: 5,
    archived: 1,
  },
  topConsultedLessons: [
    { titleAr: 'الأعداد الكبيرة والتفكيك النموذجي', views: 840, subject: 'math' },
    { titleAr: 'السوروبان: جمع وطرح الأعداد المزدوجة', views: 620, subject: 'soroban' },
    { titleAr: 'الكسور العشرية والكتابة بالفاصلة', views: 590, subject: 'math' },
    { titleAr: 'قواعد النحو: الفاعل والمفعول به', views: 510, subject: 'arabic' },
  ],
};
