export interface AuditSection {
  id: string;
  titleAr: string;
  titleFr: string;
  badge: string;
  badgeColor: string;
  items: {
    titleAr: string;
    titleFr: string;
    descriptionAr: string;
    impact: 'critical' | 'high' | 'medium' | 'low';
    status: 'fixed' | 'planned' | 'recommended';
  }[];
}

export const AUDIT_DATA: AuditSection[] = [
  {
    id: 'bugs',
    titleAr: '1. الثغرات والأخطاء البرمجية (Bugs)',
    titleFr: 'Bugs Identifiés',
    badge: '04 أخطاء رئيسية',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    items: [
      {
        titleAr: 'تسريب مفتاح API على العميل (Client-Side Key Leakage)',
        titleFr: 'Exposition de la clé API côté client',
        descriptionAr: 'كانت استدعاءات Gemini تتم مباشرة من المتصفح في النسخ السابقة، مما يتيح استخراج المفتاح واستغلاله. التعديل: إنشاء مسار سيرفر /api/gemini/explain آمن يغلف المفتاح.',
        impact: 'critical',
        status: 'fixed'
      },
      {
        titleAr: 'تزامن حالة React مع التخزين المحلي (State Hydration Mismatch)',
        titleFr: 'Incompatibilité d\'hydratation SSR/LocalStorage',
        descriptionAr: 'عدم تطابق القيم المخزنة في LocalStorage عند أول تحميل للتحكم في نقاط التلميذ والأسئلة المجابة. التعديل: إضافة حارس هيدرة ومزامن آمن في useEffect.',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'عدم معالجة الأخطاء في حسابات كسور السوروبان والتحويلات',
        titleFr: 'Gestion d\'erreurs sur la conversion d\'unités',
        descriptionAr: 'في تمارين تحويل المساحات الفلاحية (m² إلى ha) وأصابع السوروبان، حدوث أخطاء تقريبية float. التعديل: دالة تحويل دقيقة وتثبيت الأرقام العشرية.',
        impact: 'medium',
        status: 'fixed'
      },
      {
        titleAr: 'غياب المهل وإغلاق الاتصال في الاستدعاءات التفاعلية',
        titleFr: 'Absence de timeout sur les requêtes AI',
        descriptionAr: 'عند تجمّد الاتصال بخدمات الذكاء الاصطناعي، يظل واجهة المستخدم في حالة تحميل نهائية. التعديل: استخدام AbortController وواجهة إلغاء مؤقتة.',
        impact: 'medium',
        status: 'fixed'
      }
    ]
  },
  {
    id: 'architecture',
    titleAr: '2. مشاكل الهندسة المعمارية (Architecture)',
    titleFr: 'Problèmes d\'Architecture',
    badge: 'إعادة هيكلة كاملة',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    items: [
      {
        titleAr: 'تشفير المناهج داخل كود المكونات (Hardcoded Curriculum)',
        titleFr: 'Contenu pédagogique codé en dur',
        descriptionAr: 'المشكلة: إضافة درس أو دورة شهادة جديدة كان يتطلب تعديل ملفات React TSX مباشرة. الحل: اعتماد معمارية البيانات المنفصلة (Data-Driven JSON Engine).',
        impact: 'critical',
        status: 'fixed'
      },
      {
        titleAr: 'التثبيت المباشر للأصوات والوسائط بالمسارات المطلقة',
        titleFr: 'Lien برائحي للوسائط',
        descriptionAr: 'تسبب مشاكل أثناء النشر في البيئات الصحافية كـ Cloud Run ومجالات الاستضافة المختلفة. الحل: استخدام محول الوسائط ودعم الصوت التخليقي المباشر.',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'غياب معمارية النمط الاستراتيجي (Strategy Pattern) للدروس',
        titleFr: 'Monوثية المكونات',
        descriptionAr: 'دمج أدوات السوروبان ومحول الوحدات في مكون واحد كبير. الحل: تقسيم المكونات إلى وحدات مستقلة (SorobanInteractive, UnitConverter, GeometryVisualizer).',
        impact: 'high',
        status: 'fixed'
      }
    ]
  },
  {
    id: 'scalable-schema',
    titleAr: '3. معمارية المناهج بدون تعديل كود (No-Code Scalable Schema)',
    titleFr: 'Architecture Extensible Sans Code',
    badge: 'تصميم مرن وسهل Expansion',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    items: [
      {
        titleAr: 'نظام المانيفست الموحد (Curriculum JSON Manifest)',
        titleFr: 'Manifeste JSON de Programme',
        descriptionAr: 'إمكانية إضافة أي درس جديد للسنة 1AP، 2AP، 3AP، 4AP، أو 5AP عن طريق إضافة كائن JSON في /data/coursesData.ts مع تحديد المادة، الملخص، القواعد، وأسئلة الاختبار التفاعلي.',
        impact: 'critical',
        status: 'fixed'
      },
      {
        titleAr: 'محرك الأدوات التفاعلية بالحقن الديناميكي (Interactive Tool Injection)',
        titleFr: 'Injection d\'Outils Interactifs',
        descriptionAr: 'كل درس يستطيع استدعاء أداة تفاعلية (soroban, unit_converter, geometry_visualizer, multiplication_table) فقط بذكر اسمها في حقل interactiveTool داخل بيانات الدرس.',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'مستودع الامتحانات الوطنية (Annales Registry)',
        titleFr: 'Registre الأقاليم للأوراق الرسمية',
        descriptionAr: 'إضافة امتحانات شهادة الابتدائي الجزائري (2008-2026) بحقن بيانات التمارين وسلالم التنقيط بدون إعادة بناء التطبيق.',
        impact: 'high',
        status: 'fixed'
      }
    ]
  },
  {
    id: 'ux_perf_sec_gami',
    titleAr: '4. التحسينات الشاملة (UX, Performance, Security & Gamification)',
    titleFr: 'Améliorations UX, Perf, Sécurité & Gamification',
    badge: 'تصميم عالي الكثافة',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    items: [
      {
        titleAr: 'تصميم عالي الكثافة (High Density Design Theme)',
        titleFr: 'Thème Visuel Haute Densité',
        descriptionAr: 'شريط علوي متين باللون Slate-800، حواف حادة وأنيقة، شارات مستويات واضحة، وتبويب سريع لكل المستويات والأنشطة.',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'نظام التحفيز والتلعيب (Gamification Engine)',
        titleFr: 'Moteur de Gamification',
        descriptionAr: 'عداد أيام التفاعل المتواصل (Streak)، نقاط XP مع كل اختبار أو تمرين سوروبان ناجح، ومستوى التلميذ مع شارات إنجاز مثل "بطل السوروبان" و"مجتهد الجزائر".',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'المعلم الذكي مسيد (AI Tutor - Gemini 3.6 Flash)',
        titleFr: 'Tuteur IA المستقل',
        descriptionAr: 'تكامل آمن خادم-عميل يتيح للتلميذ طلب شرح أي مفهوم أو صياغة مسألة رياضية محلولة بأسلوب المنهاج الجزائري.',
        impact: 'critical',
        status: 'fixed'
      }
    ]
  }
];
