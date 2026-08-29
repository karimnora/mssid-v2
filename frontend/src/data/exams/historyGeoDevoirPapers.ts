import { ExamExercise, OfficialExam, PrimaryGrade } from '../../types';
import { DEVOIR_SOURCE_NOTE_AR } from '../examSourceNotes';

function ex(titleAr: string, points: number, contentAr: string, solutionAr: string, relatedLessonId?: string): ExamExercise {
  return { titleAr, points, contentAr, solutionAr, ...(relatedLessonId ? { relatedLessonId } : {}) };
}

function paper(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  grade: PrimaryGrade;
  n: number;
  titleAr: string;
  durationMinutes: number;
  relatedLessonIds: string[];
  exercises: ExamExercise[];
  problem: ExamExercise;
}): OfficialExam {
  return {
    id: opts.id,
    year: 2026,
    trimester: opts.trimester,
    kind: 'devoir',
    titleAr: `فرض منزلي ${opts.n} — ${opts.titleAr}`,
    sessionAr: `فرض الفصل ${opts.trimester === 1 ? 'الأول' : opts.trimester === 2 ? 'الثاني' : 'الثالث'} 2026`,
    subject: 'history_geo',
    grade: opts.grade,
    durationMinutes: opts.durationMinutes,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: DEVOIR_SOURCE_NOTE_AR,
    relatedLessonIds: opts.relatedLessonIds,
    exercises: opts.exercises,
    problemExercise: opts.problem,
  };
}

/**
 * Weekly-style history/geography homework so the subject gets the same T1–T3 devoir
 * cadence as math/arabic on 3AP–5AP (audit gap: history_geo had 0 devoirs).
 */
export const HISTORY_GEO_DEVOIR_PAPERS: OfficialExam[] = [
  // ——— 3AP ———
  paper({
    id: 'homework-3ap-historygeo-t1-2026',
    trimester: 1,
    grade: '3AP',
    n: 1,
    titleAr: 'الزمن التاريخي والمعالم الوطنية (السنة الثالثة)',
    durationMinutes: 20,
    relatedLessonIds: ['history-3ap-t1-time-eras-timeline', 'history-3ap-t1-national-landmarks'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'أكمل بالحاضر أو المستقبل: «نمتُ وأنا طفل» (ماضٍ). «أذهب الآن إلى المدرسة» (...). «سأكبر وأصبح طبيباً» (...).',
        'الحاضر: أذهب الآن إلى المدرسة. المستقبل: سأكبر وأصبح طبيباً.',
        'history-3ap-t1-time-eras-timeline'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'اربط كل معلم بوصفه:\nتيمقاد — تيبازة — قصبة الجزائر.\nأ) مدينة رومانية أثرية بولاية باتنة.\nب) موقع ساحلي يجمع آثاراً فينيقية ورومانية.\nجـ) الحي العتيق في العاصمة من العهد العثماني.',
        'تيمقاد = أ. تيبازة = ب. قصبة الجزائر = جـ.',
        'history-3ap-t1-national-landmarks'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر معلماً تاريخياً جزائرياً تعرفه، وحدد في أي عهد بُني (روماني، فينيقي، عثماني، أو ما قبل التاريخ).',
      'إجابة حرة تُقيَّم حسب دقة ربط المعلم بعهده؛ مثال: قصبة الجزائر — العهد العثماني.',
      'history-3ap-t1-national-landmarks'
    ),
  }),
  paper({
    id: 'homework-3ap-historygeo-t2-2026',
    trimester: 2,
    grade: '3AP',
    n: 2,
    titleAr: 'الزمن الفردي والاجتماعي (السنة الثالثة)',
    durationMinutes: 20,
    relatedLessonIds: ['history-3ap-t2-personal-family-calendar'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'ما الفرق بين الزمن الفردي والزمن الاجتماعي؟ اذكر مثالاً لكل واحد.',
        'الزمن الفردي: أحداث تخصني وحدي (مثل عيد ميلادي). الزمن الاجتماعي: أحداث تخص عائلتي أو مجتمعي (مثل عيد الفطر).',
        'history-3ap-t2-personal-family-calendar'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'اذكر اسمَي التقويمين المستعملين في الجزائر.',
        'التقويم الهجري والتقويم الميلادي.',
        'history-3ap-t2-personal-family-calendar'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر مناسبة عائلية مهمة عشتها، وحدد هل تُحسب بالتقويم الهجري أم الميلادي.',
      'إجابة حرة؛ مثال: عيد ميلادي يُحسب بالتقويم الميلادي، وعيد الأضحى يُحسب بالتقويم الهجري.',
      'history-3ap-t2-personal-family-calendar'
    ),
  }),
  paper({
    id: 'homework-3ap-historygeo-t3-2026',
    trimester: 3,
    grade: '3AP',
    n: 3,
    titleAr: 'البيئة المحلية وتضاريس الجزائر (السنة الثالثة)',
    durationMinutes: 20,
    relatedLessonIds: ['geo-3ap-t3-local-environment', 'geo-3ap-t3-relief-climate'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'اذكر نشاطاً واحداً من أنشطة الإنسان في القرية، وآخر من أنشطته في المدينة.',
        'القرية: الفلاحة أو تربية المواشي. المدينة: التجارة أو الصناعة أو الخدمات.',
        'geo-3ap-t3-local-environment'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'اذكر التضاريس الرئيسية الثلاثة للجزائر.',
        'الجبال، السهول، الصحراء.',
        'geo-3ap-t3-relief-climate'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'قارن بين مناخ الشمال ومناخ الجنوب في الجزائر.',
      'الشمال: مناخ معتدل. الجنوب: مناخ صحراوي حار وجاف.',
      'geo-3ap-t3-relief-climate'
    ),
  }),

  // ——— 4AP ———
  paper({
    id: 'homework-4ap-historygeo-t1-2026',
    trimester: 1,
    grade: '4AP',
    n: 1,
    titleAr: 'ما قبل التاريخ وملوك نوميديا (السنة الرابعة)',
    durationMinutes: 25,
    relatedLessonIds: ['history-4ap-prehistory', 'history-4ap-figures-massinissa-jugurtha', 'history-4ap-numidia-syphax-gaia'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'أين يقع موقع عين الحنش؟ وماذا اكتُشف فيه؟',
        'يقع قرب مدينة سطيف، واكتُشفت فيه أدوات حجرية قديمة جداً استعملها إنسان ما قبل التاريخ.',
        'history-4ap-prehistory'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'اذكر اسمَي أشهر ملكين نوميديين درستهما.',
        'الملك ماسينيسا والملك يوغورطة.',
        'history-4ap-figures-massinissa-jugurtha'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر اسم مملكتَي نوميديا قبل توحيدها، واسم ملك كل واحدة منهما.',
      'الماسيليون بقيادة الملك غايا، والماسيصيليون بقيادة الملك سيفاكس.',
      'history-4ap-numidia-syphax-gaia'
    ),
  }),
  paper({
    id: 'homework-4ap-historygeo-t2-2026',
    trimester: 2,
    grade: '4AP',
    n: 2,
    titleAr: 'موقع الجزائر وقراءة الخريطة (السنة الرابعة)',
    durationMinutes: 25,
    relatedLessonIds: ['geo-4ap-algeria-location-world-africa', 'geo-4ap-map-and-legend', 'geo-4ap-relief-climate-algeria'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'في أي قارة تقع الجزائر؟',
        'تقع الجزائر في قارة إفريقيا (شمال إفريقيا).',
        'geo-4ap-algeria-location-world-africa'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'ما فائدة مفتاح الخريطة (الأسطورة)؟',
        'يشرح رموز وألوان الخريطة حتى نفهم ما تمثله.',
        'geo-4ap-map-and-legend'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر التضاريس الثلاثة الكبرى للجزائر.',
      'التل (الشمال)، الهضاب العليا، الصحراء (الجنوب).',
      'geo-4ap-relief-climate-algeria'
    ),
  }),
  paper({
    id: 'homework-4ap-historygeo-t3-2026',
    trimester: 3,
    grade: '4AP',
    n: 3,
    titleAr: 'مياه الجزائر ومناخها والحياة في نوميديا (السنة الرابعة)',
    durationMinutes: 25,
    relatedLessonIds: ['geo-4ap-hydrography-algeria', 'geo-4ap-climate-regions', 'history-4ap-numidia-daily-life'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'ما اسم أطول واد في الجزائر؟',
        'واد الشلف.',
        'geo-4ap-hydrography-algeria'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'اذكر الأقاليم المناخية الثلاثة للجزائر.',
        'مناخ متوسطي (الشمال)، مناخ شبه جاف (الهضاب العليا)، مناخ صحراوي (الجنوب).',
        'geo-4ap-climate-regions'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر نشاطاً واحداً من الحياة اليومية في نوميديا القديمة.',
      'مثال: الزراعة أو تربية الخيل أو النسيج.',
      'history-4ap-numidia-daily-life'
    ),
  }),

  // ——— 5AP ———
  paper({
    id: 'homework-5ap-historygeo-t1-2026',
    trimester: 1,
    grade: '5AP',
    n: 1,
    titleAr: 'المراحل التاريخية وموقع الجزائر (السنة الخامسة)',
    durationMinutes: 25,
    relatedLessonIds: ['history-5ap-periods-landmarks', 'geo-5ap-location-importance'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'اذكر المراحل التاريخية الأربعة الكبرى بالترتيب.',
        'القديمة، الوسيطة، الحديثة، المعاصرة.',
        'history-5ap-periods-landmarks'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'بأي قارة تقع الجزائر؟ وما الدولتان اللتان تحدانها من الشرق؟',
        'تقع في إفريقيا (شمال إفريقيا). تحدها تونس وليبيا من الشرق.',
        'geo-5ap-location-importance'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'فسّر أهمية موقع الجزائر كهمزة وصل بين إفريقيا وأوروبا.',
      'موقعها على البحر الأبيض المتوسط وقربها من أوروبا يجعلها همزة وصل تجارية وثقافية بين القارتين.',
      'geo-5ap-location-importance'
    ),
  }),
  paper({
    id: 'homework-5ap-historygeo-t2-2026',
    trimester: 2,
    grade: '5AP',
    n: 2,
    titleAr: 'تضاريس الجزائر ومناخها (السنة الخامسة)',
    durationMinutes: 25,
    relatedLessonIds: ['geo-5ap-relief-climate-vegetation'],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'اذكر الأقاليم التضاريسية الثلاثة للجزائر.',
        'الشمال (الأطلس التلي)، الهضاب العليا، الجنوب (الصحراء الكبرى).',
        'geo-5ap-relief-climate-vegetation'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'ما الفرق بين العِرق والرَّق في الصحراء؟',
        'العِرق: كثبان رملية متحركة. الرَّق: سطح صخري مستوٍ مغطى بالحصى.',
        'geo-5ap-relief-climate-vegetation'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'فسّر لماذا يقل الغطاء النباتي كلما اتجهنا جنوباً في الجزائر.',
      'لأن كمية الأمطار تقل كلما اتجهنا جنوباً، والمناخ يصبح أكثر جفافاً، فيقل النبات.',
      'geo-5ap-relief-climate-vegetation'
    ),
  }),
  paper({
    id: 'homework-5ap-historygeo-t3-2026',
    trimester: 3,
    grade: '5AP',
    n: 3,
    titleAr: 'الاحتلال الفرنسي 1830 والثورة التحريرية (السنة الخامسة)',
    durationMinutes: 25,
    relatedLessonIds: [
      'history-5ap-french-colonization-popular-resistances',
      'history-5ap-glorious-revolution-1954',
      'history-5ap-national-movement',
      'history-5ap-december-1960-demonstrations',
    ],
    exercises: [
      ex(
        'التمرين الأول (3 نقاط)',
        3,
        'في أي سنة احتلت فرنسا الجزائر؟ وما الذريعة (السبب الظاهري) التي استعملتها؟',
        'سنة 1830م. الذريعة كانت حادثة المروحة، أما السبب الحقيقي فكان طمع فرنسا في خيرات الجزائر وموقعها.',
        'history-5ap-french-colonization-popular-resistances'
      ),
      ex(
        'التمرين الثاني (3 نقاط)',
        3,
        'متى اندلعت الثورة التحريرية الكبرى؟ ومتى تحقق الاستقلال؟',
        'اندلعت في 1 نوفمبر 1954م، وتحقق الاستقلال في 5 جويلية 1962م.',
        'history-5ap-glorious-revolution-1954'
      ),
    ],
    problem: ex(
      'وضعية قصيرة (4 نقاط)',
      4,
      'اذكر حدثاً واحداً من الحركة الوطنية قبل الثورة (بين 1919 و1954)، وحدثاً واحداً وقع أثناء الثورة (بعد 1954).',
      'قبل الثورة: مثلاً مجازر 8 ماي 1945م أو تأسيس المنظمة الخاصة (OS) سنة 1947م. أثناء الثورة: مثلاً مظاهرات 11 ديسمبر 1960م أو مؤتمر الصومام 1956م.',
      'history-5ap-national-movement'
    ),
  }),
];
