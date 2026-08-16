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
    tier?: 'red_remove' | 'white_polish' | 'yellow_upgrade';
  }[];
}

export const AUDIT_DATA: AuditSection[] = [
  {
    id: 'synthesis_orientation',
    titleAr: '🎯 خلاصة التوجيه البيداغوجي والتقني (Synthèse d\'Orientation)',
    titleFr: 'Synthèse d\'Orientation MEN',
    badge: '3 محاور رئيسية',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    items: [
      {
        titleAr: '🔴 العناصر الملغاة والمحذوفة (À Supprimer)',
        titleFr: 'Conformité Stricte MEN',
        descriptionAr: 'تمت إزالة وتطهير كل العناصر الخارجة عن المنهاج الرسمي الجزائري الصادر عن وزارة التربية الوطنية (MEN)، والتبعيات الوهمية أو المصطلحات غير المعتمدة، لضمان تركيز التلميذ 100% على الكفاءات المستهدفة بالامتحانات الرسمية.',
        impact: 'critical',
        status: 'fixed',
        tier: 'red_remove'
      },
      {
        titleAr: '⚪ رفع جودة العناصر المتوسطة (Médiocre → Haut Engagement)',
        titleFr: 'Engagement Cognitif & Visuel',
        descriptionAr: 'تحويل النصوص والواجهات الجامدة إلى تجارب تفاعلية غنية بالألوان البصرية المريحة، والخطوط العربية الرسمية المعتمدة (Readex Pro، Cairo، Amiri)، مع مؤشرات صوتية وتفاعل باللمس يعزز التركيز الذهني لدى تلاميذ الطور الابتدائي.',
        impact: 'high',
        status: 'fixed',
        tier: 'white_polish'
      },
      {
        titleAr: '🟡 ترقية الوحدات للتميز البيداغوجي (À Améliorer → Excellence)',
        titleFr: 'Outils d\'Excellence Trimestrielle',
        descriptionAr: 'تطوير أدوات التحضير للاختبارات الفصلية وتقييم المكتسبات (5AP)، محاكي السوروبان، مخابر العلوم وتجارب الدارة الكهربائية، ومولد الفروض والامتحانات القابلة للطباعة A4 مع سلالم التنقيط وقسائم التصحيح النموذجية.',
        impact: 'high',
        status: 'fixed',
        tier: 'yellow_upgrade'
      }
    ]
  },
  {
    id: 'bugs',
    titleAr: '1. الثغرات والأخطاء المعالجة (Bugs & Security)',
    titleFr: 'Bugs & Sécurité Résolus',
    badge: '04 أخطاء رئيسية',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    items: [
      {
        titleAr: 'عزل وتأمين مفتاح API على الخادم (Secure Server-Side Proxy)',
        titleFr: 'Exposition de la clé API côté client',
        descriptionAr: 'عزل استدعاءات الذكاء الاصطناعي في مسار خادم آمن /api/gemini/explain لمنع تسريب المفاتيح وحماية بيانات التلاميذ.',
        impact: 'critical',
        status: 'fixed'
      },
      {
        titleAr: 'تزامن حالة التخزين المحلي الآمن (Hydration & LocalStorage Guard)',
        titleFr: 'Incompatibilité d\'hydratation SSR/LocalStorage',
        descriptionAr: 'تثبيت تقدم التلميذ ونقاط الخبرة والدروس المنجزة بدون فقدان البيانات أو تعارض التزامن.',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'معالجة حسابات التحويلات والكسور والسوروبان بدقة تامة',
        titleFr: 'Gestion d\'erreurs sur la conversion d\'unités',
        descriptionAr: 'ضبط دوال تحويل المساحات والمقادير وعمليات العداد الرقمي بدون أخطاء تقريبية.',
        impact: 'medium',
        status: 'fixed'
      },
      {
        titleAr: 'إدارة مهل الاتصال ومرونة الواجهة (AbortController & Resilient UI)',
        titleFr: 'Absence de timeout sur les requêtes AI',
        descriptionAr: 'منع تجمّد الواجهة مع توفير ردود احتياطية فورية عند ضعف شبكة الإنترنت.',
        impact: 'medium',
        status: 'fixed'
      }
    ]
  },
  {
    id: 'architecture',
    titleAr: '2. البنية البرمجية والمناهج (Data-Driven Architecture)',
    titleFr: 'Architecture Extensible',
    badge: 'معمارية مرنة بدون كود',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    items: [
      {
        titleAr: 'معمارية المناهج المنفصلة (Data-Driven JSON Manifest)',
        titleFr: 'Curriculum JSON Modulaire',
        descriptionAr: 'فصل تام لبيانات الدروس والامتحانات والمخابر عن كود الواجهات لسهولة التوسع والتعديل وفق التدرجات الوزارية السنوية.',
        impact: 'critical',
        status: 'fixed'
      },
      {
        titleAr: 'الحقن الديناميكي للأدوات والمخابر التفاعلية (Tool Injection Engine)',
        titleFr: 'Injection d\'Outils Pédagogiques',
        descriptionAr: 'ربط مباشر بين كل درس ومخبره التفاعلي المخصص (سوروبان، دارة كهربائية، خط عربي، متحف تاريخ، محول مقادير).',
        impact: 'high',
        status: 'fixed'
      },
      {
        titleAr: 'بنك الامتحانات الوطنية وتقييم المكتسبات (Official Exams Registry)',
        titleFr: 'Banque d\'Examens & Acquis 5AP',
        descriptionAr: 'مواضيع امتحانات ونماذج تقييم المكتسبات مع الحلول التفصيلية وإمكانية الطباعة الورقية A4.',
        impact: 'high',
        status: 'fixed'
      }
    ]
  }
];
