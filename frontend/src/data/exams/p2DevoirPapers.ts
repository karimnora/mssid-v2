import { ExamExercise, OfficialExam, PrimaryGrade, SubjectId } from '../../types';
import { DEVOIR_SOURCE_NOTE_AR } from '../examSourceNotes';

function ex(titleAr: string, points: number, contentAr: string, solutionAr: string, relatedLessonId?: string): ExamExercise {
  return { titleAr, points, contentAr, solutionAr, ...(relatedLessonId ? { relatedLessonId } : {}) };
}

function paper(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  grade: PrimaryGrade;
  subject: SubjectId;
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
    subject: opts.subject,
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

const DUR: Record<PrimaryGrade, number> = { '1AP': 20, '2AP': 20, '3AP': 20, '4AP': 25, '5AP': 25 };

/**
 * Weekly-style homework for tamazight / art / technology so P2 subjects get the same
 * T1–T3 devoir cadence as math/arabic on 3AP–5AP (audit gap: 0 devoirs for these 3 subjects).
 * Same relatedLessonIds as the P2_EXAM_PAPERS composition for that grade/trimester, new exercises.
 */
export const P2_DEVOIR_PAPERS: OfficialExam[] = [
  // ═══════════ Tamazight ═══════════
  paper({
    id: 'homework-3ap-tamazight-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'tamazight',
    n: 1,
    titleAr: 'حروف التيفيناغ الأولى (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-initiation-lettres-formes'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'اكتب الحرف التيفيناغي لصوت (T).', 'ⵜ.', 'tamazight-3ap-initiation-lettres-formes'),
      ex('التمرين الثاني (3 نقاط)', 3, 'ماذا نقول لصديقنا الأمازيغي عند اللقاء؟', 'Azul (ⴰⵣⵓⵍ) — تعني مرحباً.', 'tamazight-3ap-initiation-lettres-formes'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اربط: ⴰ ↔ ؟ و ⵎ ↔ ؟ (اكتب الصوت اللاتيني لكل حرف).', 'ⴰ = A، ⵎ = M.', 'tamazight-3ap-initiation-lettres-formes'),
  }),
  paper({
    id: 'homework-3ap-tamazight-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'tamazight',
    n: 2,
    titleAr: 'الألوان والطبيعة بالأمازيغية (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-couleurs-nature'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'كيف نقول « أزرق » تقريباً بالأمازيغية؟', 'Anili (أو Azegzaw حسب اللهجة).', 'tamazight-3ap-couleurs-nature'),
      ex('التمرين الثاني (3 نقاط)', 3, 'اكتب كلمة « ماء » بالأمازيغية.', 'Aman (ⴰⵎⴰⵏ).', 'tamazight-3ap-couleurs-nature'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اذكر لونين من ألوان الطبيعة بكلمتين أمازيغيتين.', 'مثال: Azegzaw (أخضر)، Awragh (أصفر).', 'tamazight-3ap-couleurs-nature'),
  }),
  paper({
    id: 'homework-3ap-tamazight-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'tamazight',
    n: 3,
    titleAr: 'جسمي والحيوانات بالأمازيغية (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-corps-animaux'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« يد » بالأمازيغية:', 'Afus.', 'tamazight-3ap-corps-animaux'),
      ex('التمرين الثاني (3 نقاط)', 3, '« كلب » بالأمازيغية:', 'Aydi.', 'tamazight-3ap-corps-animaux'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اذكر عضوين من جسمك بالأمازيغية.', 'مثال: Aqerru (رأس)، Afus (يد).', 'tamazight-3ap-corps-animaux'),
  }),
  paper({
    id: 'homework-4ap-tamazight-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'tamazight',
    n: 1,
    titleAr: 'التيفيناغ والأعداد (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-agemmay-tifinagh-lettres', 'tamazight-4ap-chiffres-comptage'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« واحد » و« اثنان » بالأمازيغية:', 'Yiwen (1)، Sin (2).', 'tamazight-4ap-chiffres-comptage'),
      ex('التمرين الثاني (3 نقاط)', 3, 'بأي رسم كتابي أمازيغي قديم نكتب؟', 'بالتيفيناغ (Tifinagh).', 'tamazight-4ap-agemmay-tifinagh-lettres'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اكتب الأعداد من 1 إلى 5 بالأمازيغية.', 'Yiwen، Sin، Krad، Ukkuz، Semmus.', 'tamazight-4ap-chiffres-comptage'),
  }),
  paper({
    id: 'homework-4ap-tamazight-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'tamazight',
    n: 2,
    titleAr: 'العائلة والتحيات (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-famille-salutations'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« أخي » بالأمازيغية:', 'Gma.', 'tamazight-4ap-famille-salutations'),
      ex('التمرين الثاني (3 نقاط)', 3, 'كيف نودّع صديقاً بالأمازيغية؟', 'مثال: Ar tufat (إلى الغد).', 'tamazight-4ap-famille-salutations'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اكتب حواراً قصيراً من جملتين للتحية والرد.', 'مثال: Azul! — Azul, amek telliḍ? (مرحباً! — مرحباً، كيف حالك؟).', 'tamazight-4ap-famille-salutations'),
  }),
  paper({
    id: 'homework-4ap-tamazight-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'tamazight',
    n: 3,
    titleAr: 'ينّاير والتراث الأمازيغي (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-yennayer-patrimoine'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'ما اسم السنة الأمازيغية الجديدة؟', 'Yennayer.', 'tamazight-4ap-yennayer-patrimoine'),
      ex('التمرين الثاني (3 نقاط)', 3, 'اذكر عنصراً واحداً من التراث الأمازيغي.', 'مثال: التيفيناغ، القفطان، الأغاني الشعبية.', 'tamazight-4ap-yennayer-patrimoine'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'لماذا يحتفل الجزائريون بيناير؟', 'لأنه يمثل بداية السنة الفلاحية الأمازيغية ورمزاً للهوية والتراث الوطني.', 'tamazight-4ap-yennayer-patrimoine'),
  }),
  paper({
    id: 'homework-5ap-tamazight-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'tamazight',
    n: 1,
    titleAr: 'الاسم والفعل بالأمازيغية (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-taseddast-noms-verbes'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« اسم » بالأمازيغية:', 'Isem.', 'tamazight-5ap-taseddast-noms-verbes'),
      ex('التمرين الثاني (3 نقاط)', 3, '« يكتب » فعل أمازيغي:', 'Aru.', 'tamazight-5ap-taseddast-noms-verbes'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اكتب جملة قصيرة فيها اسم.', 'مثال: Isem-iw d Karim (اسمي كريم).', 'tamazight-5ap-taseddast-noms-verbes'),
  }),
  paper({
    id: 'homework-5ap-tamazight-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'tamazight',
    n: 2,
    titleAr: 'حكايات جحا الشعبية (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-tinfusin-djeha-uccen'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« حكاية » بالأمازيغية:', 'Tinfusin.', 'tamazight-5ap-tinfusin-djeha-uccen'),
      ex('التمرين الثاني (3 نقاط)', 3, 'من هي الشخصية الشعبية المعروفة بالذكاء والفكاهة في الحكايات؟', 'جحا (Djeha).', 'tamazight-5ap-tinfusin-djeha-uccen'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'لماذا تُعتبر الحكايات الشعبية مهمة للحفاظ على الثقافة؟', 'لأنها تنقل القيم والعادات من جيل إلى جيل شفهياً.', 'tamazight-5ap-tinfusin-djeha-uccen'),
  }),
  paper({
    id: 'homework-5ap-tamazight-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'tamazight',
    n: 3,
    titleAr: 'الطبيعة والبيئة بالأمازيغية (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-agellid-tagant-environnement'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, '« جبل » و« شجرة » بالأمازيغية:', 'Adrar (جبل)، Aseklu (شجرة).', 'tamazight-5ap-agellid-tagant-environnement'),
      ex('التمرين الثاني (3 نقاط)', 3, 'اذكر فعلاً واحداً يضر بالبيئة.', 'مثال: رمي النفايات، قطع الأشجار.', 'tamazight-5ap-agellid-tagant-environnement'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اقترح فعلين للحفاظ على الطبيعة.', 'مثال: عدم رمي النفايات، غرس الأشجار، ترشيد استهلاك الماء.', 'tamazight-5ap-agellid-tagant-environnement'),
  }),

  // ═══════════ Art ═══════════
  paper({
    id: 'homework-3ap-art-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'art',
    n: 1,
    titleAr: 'الألوان الأساسية (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t1-colors-rhythm'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'اذكر الألوان الأساسية الثلاثة.', 'أحمر، أزرق، أصفر.', 'art-3ap-t1-colors-rhythm'),
      ex('التمرين الثاني (3 نقاط)', 3, 'أحمر + أزرق = ؟', 'بنفسجي.', 'art-3ap-t1-colors-rhythm'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم شكلاً ولوّنه بلون ثانوي، واذكر اللونين اللذين مزجتهما.', 'مثال: أخضر من مزج أزرق وأصفر.', 'art-3ap-t1-colors-rhythm'),
  }),
  paper({
    id: 'homework-3ap-art-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'art',
    n: 2,
    titleAr: 'الأشكال والتركيب (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t2-shapes-composition'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'اذكر شكلين هندسيين أساسيين.', 'مثال: دائرة، مربع، مثلث.', 'art-3ap-t2-shapes-composition'),
      ex('التمرين الثاني (3 نقاط)', 3, 'لإبراز عنصر في اللوحة نجعله:', 'أكبر حجماً وأوضح لوناً.', 'art-3ap-t2-shapes-composition'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'صمّم رسماً بسيطاً لبيت باستعمال مثلث ومستطيل.', 'سقف مثلث فوق جدار مستطيل.', 'art-3ap-t2-shapes-composition'),
  }),
  paper({
    id: 'homework-3ap-art-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'art',
    n: 3,
    titleAr: 'فن الزليج (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t3-zellij-patterns'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'ما هو الزليج؟', 'فن زخرفي يعتمد على قطع فسيفساء ملونة متكررة.', 'art-3ap-t3-zellij-patterns'),
      ex('التمرين الثاني (3 نقاط)', 3, 'التكرار في الزخرفة يُنتج:', 'إيقاعاً بصرياً منظماً.', 'art-3ap-t3-zellij-patterns'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم نمطاً زخرفياً بسيطاً من 4 أشكال متكررة.', 'مثال: مربع، دائرة، مربع، دائرة بألوان متناوبة.', 'art-3ap-t3-zellij-patterns'),
  }),
  paper({
    id: 'homework-4ap-art-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'art',
    n: 1,
    titleAr: 'الألوان الدافئة والباردة (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t1-warm-cool-colors'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'اذكر لوناً دافئاً ولوناً بارداً.', 'دافئ: أحمر أو برتقالي. بارد: أزرق أو أخضر.', 'art-4ap-t1-warm-cool-colors'),
      ex('التمرين الثاني (3 نقاط)', 3, 'الألوان الباردة تُستعمل لتصوير:', 'الماء، السماء، الهدوء.', 'art-4ap-t1-warm-cool-colors'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم مشهداً يجمع ألواناً دافئة وباردة (مثلاً شمس وبحر).', 'شمس بألوان دافئة (أصفر/برتقالي)، بحر بألوان باردة (أزرق).', 'art-4ap-t1-warm-cool-colors'),
  }),
  paper({
    id: 'homework-4ap-art-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'art',
    n: 2,
    titleAr: 'المنظور البسيط (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t2-perspective-simple'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'الشيء القريب في اللوحة يُرسم:', 'أكبر حجماً.', 'art-4ap-t2-perspective-simple'),
      ex('التمرين الثاني (3 نقاط)', 3, 'الشيء البعيد يُرسم:', 'أصغر حجماً.', 'art-4ap-t2-perspective-simple'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم طريقاً يضيق تدريجياً نحو الأفق.', 'الطريق عريض في الأسفل ويضيق كلما اقترب من خط الأفق.', 'art-4ap-t2-perspective-simple'),
  }),
  paper({
    id: 'homework-4ap-art-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'art',
    n: 3,
    titleAr: 'الفخار والحرف اليدوية (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t3-pottery-crafts'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'لماذا صُنع الفخار قديماً؟', 'لحفظ الماء أو الطعام.', 'art-4ap-t3-pottery-crafts'),
      ex('التمرين الثاني (3 نقاط)', 3, 'بعد تشكيل الفخار وتجفيفه، ماذا يحدث له؟', 'يُحرق في الفرن ليصبح صلباً.', 'art-4ap-t3-pottery-crafts'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم إناءً فخارياً بسيطاً وزخرف حافته.', 'شكل دائري بخطوط أو نقاط متكررة على الحافة.', 'art-4ap-t3-pottery-crafts'),
  }),
  paper({
    id: 'homework-5ap-art-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'art',
    n: 1,
    titleAr: 'الألوان المتكاملة (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t1-complementary-colors'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'ما هو اللون المتكامل للأزرق؟', 'البرتقالي.', 'art-5ap-t1-complementary-colors'),
      ex('التمرين الثاني (3 نقاط)', 3, 'وضع لونين متكاملين جنباً إلى جنب يُنتج:', 'تبايناً بصرياً قوياً.', 'art-5ap-t1-complementary-colors'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم شكلاً بلونين متكاملين وفسّر اختيارك.', 'مثال: دائرة صفراء على خلفية بنفسجية — تباين قوي يجذب الانتباه.', 'art-5ap-t1-complementary-colors'),
  }),
  paper({
    id: 'homework-5ap-art-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'art',
    n: 2,
    titleAr: 'نسب الوجه في البورتريه (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t2-portrait-proportion'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'أين تقع العينان تقريباً في رسم الوجه؟', 'في منتصف الرأس تقريباً.', 'art-5ap-t2-portrait-proportion'),
      ex('التمرين الثاني (3 نقاط)', 3, 'أين يقع الفم؟', 'بين الأنف والذقن.', 'art-5ap-t2-portrait-proportion'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'ارسم وجهاً مبسّطاً محترماً هذه النسب.', 'خط أفقي للعينين في المنتصف، أنف تحته، فم أسفل الأنف.', 'art-5ap-t2-portrait-proportion'),
  }),
  paper({
    id: 'homework-5ap-art-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'art',
    n: 3,
    titleAr: 'الجدارية التراثية (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t3-heritage-mural'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'اذكر ألوان العلم الجزائري.', 'أخضر، أبيض، أحمر (مع الهلال والنجمة).', 'art-5ap-t3-heritage-mural'),
      ex('التمرين الثاني (3 نقاط)', 3, 'قبل رسم جدارية جماعية، ماذا يجب أن نفعل أولاً؟', 'نخطط ونوزع المساحات بين المشاركين.', 'art-5ap-t3-heritage-mural'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اقترح موضوعاً لجدارية تراثية جزائرية.', 'مثال: القصبة، النخيل، العلم الوطني — مع تبرير بسيط للرمز المختار.', 'art-5ap-t3-heritage-mural'),
  }),

  // ═══════════ Technology ═══════════
  paper({
    id: 'homework-3ap-technology-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'technology',
    n: 1,
    titleAr: 'الكتلة وحالات المادة (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-matter-states-scale-mass'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'الميزان يُستعمل لقياس:', 'الكتلة (الوزن).', 'science-3ap-u3-matter-states-scale-mass'),
      ex('التمرين الثاني (3 نقاط)', 3, 'المادة الصلبة شكلها:', 'ثابت لا يتغير.', 'science-3ap-u3-matter-states-scale-mass'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'قارن بين شكل المادة الصلبة وشكل المادة السائلة.', 'الصلبة: شكل ثابت. السائلة: تأخذ شكل الإناء الذي توضع فيه.', 'science-3ap-u3-matter-states-scale-mass'),
  }),
  paper({
    id: 'homework-3ap-technology-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'technology',
    n: 2,
    titleAr: 'الطقس وأدوات القياس (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-weather-climate-raingauge'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'أداة قياس كمية الأمطار تسمى:', 'مقياس المطر (pluviomètre).', 'science-3ap-u3-weather-climate-raingauge'),
      ex('التمرين الثاني (3 نقاط)', 3, 'الترمومتر يقيس:', 'درجة الحرارة.', 'science-3ap-u3-weather-climate-raingauge'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'لماذا نضع مقياس المطر في الهواء الطلق بدون سقف؟', 'ليجمع كل ماء المطر المتساقط دون أن يحجبه شيء.', 'science-3ap-u3-weather-climate-raingauge'),
  }),
  paper({
    id: 'homework-3ap-technology-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'technology',
    n: 3,
    titleAr: 'الدارة الكهربائية البسيطة (السنة الثالثة)',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-time-thermometer-electricity'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'الدارة الكهربائية البسيطة تتكون من:', 'عمود (بطارية) + أسلاك + مصباح.', 'science-3ap-u3-time-thermometer-electricity'),
      ex('التمرين الثاني (3 نقاط)', 3, 'متى يضيء المصباح؟', 'عندما تكون الدارة مغلقة.', 'science-3ap-u3-time-thermometer-electricity'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'لماذا لا يضيء المصباح أحياناً رغم توصيل الأسلاك؟', 'قد يكون سلك غير موصول (دارة مفتوحة)، أو العمود فارغاً، أو المصباح محروقاً.', 'science-3ap-u3-time-thermometer-electricity'),
  }),
  paper({
    id: 'homework-4ap-technology-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'technology',
    n: 1,
    titleAr: 'حالات المادة وتحولاتها (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-states-of-matter-phase-changes'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'تحول الماء السائل إلى بخار يسمى:', 'تبخّراً.', 'science-4ap-states-of-matter-phase-changes'),
      ex('التمرين الثاني (3 نقاط)', 3, 'تحول الماء السائل إلى جليد يسمى:', 'تجميداً.', 'science-4ap-states-of-matter-phase-changes'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'رتّب: تبخر، تكاثف، تجميد، حسب حالتَي المادة المرتبطتين بكل واحد.', 'تبخر: سائل ← غاز. تكاثف: غاز ← سائل. تجميد: سائل ← صلب.', 'science-4ap-states-of-matter-phase-changes'),
  }),
  paper({
    id: 'homework-4ap-technology-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'technology',
    n: 2,
    titleAr: 'الهواء والاحتراق (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-air-combustion'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'الاحتراق يحتاج إلى ثلاثة عناصر، اذكرها.', 'وقود، أكسجين، وحرارة.', 'science-4ap-air-combustion'),
      ex('التمرين الثاني (3 نقاط)', 3, 'لماذا يُعتبر الهواء ضرورياً للاحتراق؟', 'لأنه يحتوي على الأكسجين.', 'science-4ap-air-combustion'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'فسّر لماذا تنطفئ الشمعة إذا غطيناها بكأس زجاجي.', 'لأن الغطاء يمنع وصول الأكسجين فينقطع عن الشعلة.', 'science-4ap-air-combustion'),
  }),
  paper({
    id: 'homework-4ap-technology-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'technology',
    n: 3,
    titleAr: 'دوران الأرض والسلامة من الحريق (السنة الرابعة)',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-earth-rotation-seasons-time', 'science-4ap-combustion-fire-safety'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'دوران الأرض حول نفسها يسبب:', 'تعاقب الليل والنهار.', 'science-4ap-earth-rotation-seasons-time'),
      ex('التمرين الثاني (3 نقاط)', 3, 'عند نشوب حريق، بأي رقم نتصل؟', 'الحماية المدنية (رقم 14).', 'science-4ap-combustion-fire-safety'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اذكر قاعدتَي سلامة لتجنب الحرائق في المنزل.', 'مثال: عدم ترك الموقد مشتعلاً بدون مراقبة، إبعاد الأقمشة عن النار، عدم اللعب بالكبريت.', 'science-4ap-combustion-fire-safety'),
  }),
  paper({
    id: 'homework-5ap-technology-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'technology',
    n: 1,
    titleAr: 'خلائط المادة وخصائص الهواء (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-matter-mixtures', 'science-5ap-air-properties'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'كيف نفصل الرمل عن الماء؟', 'بالترشيح (الفلترة).', 'science-5ap-matter-mixtures'),
      ex('التمرين الثاني (3 نقاط)', 3, 'هل للهواء وزن؟', 'نعم، الهواء له وزن ويشغل حيزاً (حجماً).', 'science-5ap-air-properties'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'كيف تفصل برادة الحديد المخلوطة بالرمل؟', 'باستعمال المغناطيس: يجذب برادة الحديد ويترك الرمل.', 'science-5ap-matter-mixtures'),
  }),
  paper({
    id: 'homework-5ap-technology-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'technology',
    n: 2,
    titleAr: 'الدارة الكهربائية والسلامة (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-electric-circuit', 'science-5ap-electrical-safety'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'ما وظيفة المفتاح في الدارة الكهربائية؟', 'فتح الدارة وإغلاقها للتحكم في المصباح.', 'science-5ap-electric-circuit'),
      ex('التمرين الثاني (3 نقاط)', 3, 'لماذا لا نلمس الأسلاك الكهربائية المكشوفة؟', 'لأن التماس بها قد يسبب صعقة كهربائية خطيرة.', 'science-5ap-electrical-safety'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'فسّر الفرق بين الدارة المفتوحة والدارة المغلقة.', 'المفتوحة: لا يمر التيار والمصباح مطفأ. المغلقة: يمر التيار والمصباح مضاء.', 'science-5ap-electric-circuit'),
  }),
  paper({
    id: 'homework-5ap-technology-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'technology',
    n: 3,
    titleAr: 'التلوث ومعالجة النفايات (السنة الخامسة)',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-pollution-waste-treatment'],
    exercises: [
      ex('التمرين الأول (3 نقاط)', 3, 'فرز النفايات يساعد على:', 'إعادة تدويرها بدل رميها.', 'science-5ap-pollution-waste-treatment'),
      ex('التمرين الثاني (3 نقاط)', 3, 'اذكر عنصراً واحداً يمكن أن يتلوث بالنفايات.', 'مثال: الماء، الهواء، أو التربة.', 'science-5ap-pollution-waste-treatment'),
    ],
    problem: ex('وضعية قصيرة (4 نقاط)', 4, 'اقترح إجراءً واحداً لتقليل النفايات البلاستيكية في مدرستك.', 'مثال: استعمال زجاجات ماء قابلة لإعادة الاستخدام بدل الأكياس والزجاجات البلاستيكية.', 'science-5ap-pollution-waste-treatment'),
  }),
];
