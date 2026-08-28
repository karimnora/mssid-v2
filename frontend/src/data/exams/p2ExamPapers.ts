import { ExamExercise, OfficialExam, PrimaryGrade, SubjectId } from '../../types';
import { COMPOSITION_SOURCE_NOTE_AR } from '../examSourceNotes';

function ex(
  titleAr: string,
  points: number,
  contentAr: string,
  solutionAr: string,
  relatedLessonId?: string
): ExamExercise {
  return { titleAr, points, contentAr, solutionAr, ...(relatedLessonId ? { relatedLessonId } : {}) };
}

function paper(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  grade: PrimaryGrade;
  subject: SubjectId;
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
    titleAr: opts.titleAr,
    sessionAr: `الفصل ${opts.trimester === 1 ? 'الأول' : opts.trimester === 2 ? 'الثاني' : 'الثالث'} 2026`,
    subject: opts.subject,
    grade: opts.grade,
    durationMinutes: opts.durationMinutes,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    relatedLessonIds: opts.relatedLessonIds,
    exercises: opts.exercises,
    problemExercise: opts.problem,
  };
}

const DUR: Record<PrimaryGrade, number> = { '1AP': 30, '2AP': 30, '3AP': 30, '4AP': 45, '5AP': 45 };

/** P2 — tamazight, art, technology compositions (3AP–5AP × T1–T3). Original papers. */
export const P2_EXAM_PAPERS: OfficialExam[] = [
  // —— Tamazight ——
  paper({
    id: 'exam-3ap-tamazight-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الأول في اللغة الأمازيغية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-initiation-lettres-formes'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'اكتب الحرف التيفيناغي لصوت (A):', 'ⴰ', 'tamazight-3ap-initiation-lettres-formes'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'أي حرف ينطق مثل الميم (M)؟\nأ) ⵎ  ب) ⴰ  ج) ⵜ', 'أ) ⵎ', 'tamazight-3ap-initiation-lettres-formes'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'ماذا تعني كلمة « Azul » (ⴰⵣⵓⵍ)؟', 'مرحباً وسلاماً.', 'tamazight-3ap-initiation-lettres-formes'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اربط كل حرف بصوته:\nⴱ — B | ⵜ — T | ⵣ — Z', 'ⴱ=B، ⵜ=T، ⵣ=Z.', 'tamazight-3ap-initiation-lettres-formes'),
  }),
  paper({
    id: 'exam-3ap-tamazight-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثاني في اللغة الأمازيغية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-couleurs-nature'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« أخضر » بالأمازيغية تقريباً:', 'Azegzaw.', 'tamazight-3ap-couleurs-nature'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« ماء » بالأمازيغية:', 'Aman (ⴰⵎⴰⵏ).', 'tamazight-3ap-couleurs-nature'),
      ex('التمرين الثالث (2 نقطتان)', 2, '« أصفر » بالأمازيغية:', 'Awragh.', 'tamazight-3ap-couleurs-nature'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'صِف لون السماء ولون العشب بكلمتين أمازيغيتين.', 'السماء: Anili/Azegzaw (أزرق). العشب: Azegzaw (أخضر).', 'tamazight-3ap-couleurs-nature'),
  }),
  paper({
    id: 'exam-3ap-tamazight-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثالث في اللغة الأمازيغية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['tamazight-3ap-corps-animaux'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« رأس » بالأمازيغية:', 'Aqerru.', 'tamazight-3ap-corps-animaux'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« كلب » بالأمازيغية:', 'Aydi.', 'tamazight-3ap-corps-animaux'),
      ex('التمرين الثالث (2 نقطتان)', 2, '« عين » بالأمازيغية:', 'Tililt.', 'tamazight-3ap-corps-animaux'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر عضوين من الجسم واسميهما بالأمازيغية.', 'مثال: Aqerru (رأس)، Afus (يد).', 'tamazight-3ap-corps-animaux'),
  }),

  paper({
    id: 'exam-4ap-tamazight-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الأول في اللغة الأمازيغية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-agemmay-tifinagh-lettres', 'tamazight-4ap-chiffres-comptage'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'اكتب بالتيفيناغ: « ⵉⵙⴽⴽⵉⵍ » تعني:', 'حرف/حروف.', 'tamazight-4ap-agemmay-tifinagh-lettres'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« عشرة » بالأمازيغية:', 'Mraw.', 'tamazight-4ap-chiffres-comptage'),
      ex('التمرين الثالث (2 نقطتان)', 2, '« خمسة » بالأمازيغية:', 'Semmus.', 'tamazight-4ap-chiffres-comptage'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اكتب العدد 3 و5 بالأمازيغية.', '3 = Krad، 5 = Semmus.', 'tamazight-4ap-chiffres-comptage'),
  }),
  paper({
    id: 'exam-4ap-tamazight-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثاني في اللغة الأمازيغية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-famille-salutations'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« أبي » بالأمازيغية:', 'Baba.', 'tamazight-4ap-famille-salutations'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« أمي » بالأمازيغية:', 'Yemma.', 'tamazight-4ap-famille-salutations'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'تحية الصباح:', 'Azul / Seḥḥa.', 'tamazight-4ap-famille-salutations'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'قدّم نفسك بجملة أمازيغية قصيرة.', 'مثال: Azul, ismi Karim.', 'tamazight-4ap-famille-salutations'),
  }),
  paper({
    id: 'exam-4ap-tamazight-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثالث في اللغة الأمازيغية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['tamazight-4ap-yennayer-patrimoine'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« يناير » عيد أمازيغي يسمى:', 'Yennayer.', 'tamazight-4ap-yennayer-patrimoine'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'يناير يحتفل بـ:', 'بداية السنة الأمازيغية والتراث.', 'tamazight-4ap-yennayer-patrimoine'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'التراث الأمازيغي يشمل:', 'اللغة، الملابس، الأغاني، الحرف.', 'tamazight-4ap-yennayer-patrimoine'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر عنصرين من التراث الأمازيغي في بلدك.', 'مثال: القفطان، التيفيناغ، الأغاني، يناير.', 'tamazight-4ap-yennayer-patrimoine'),
  }),

  paper({
    id: 'exam-5ap-tamazight-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الأول في اللغة الأمازيغية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-taseddast-noms-verbes'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« اسم » بالأمازيغية:', 'Isem.', 'tamazight-5ap-taseddast-noms-verbes'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« يكتب » فعل:', 'Aru.', 'tamazight-5ap-taseddast-noms-verbes'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الجملة: « ⴰⵔⵓ ⵉⵙⴻⴽⴽⵉⵍ » تعني تقريباً:', 'يكتب حرفاً.', 'tamazight-5ap-taseddast-noms-verbes'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اكتب جملة قصيرة فيها اسم وفعل.', 'مثال: ⴰⵔⵓ ⵉⵙⵎ (يكتب اسمه).', 'tamazight-5ap-taseddast-noms-verbes'),
  }),
  paper({
    id: 'exam-5ap-tamazight-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثاني في اللغة الأمازيغية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-tinfusin-djeha-uccen'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« حكاية » بالأمازيغية:', 'Tinfusin.', 'tamazight-5ap-tinfusin-djeha-uccen'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'شخصية « جحا » معروفة بـ:', 'الذكاء والفكاهة.', 'tamazight-5ap-tinfusin-djeha-uccen'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الحكاية الشعبية تُنقَل:', 'شفهياً من جيل لجيل.', 'tamazight-5ap-tinfusin-djeha-uccen'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لخّص حكاية قصيرة تعرفها بجملتين.', 'إجابة حسب الحكاية المختارة (جحا، أُوشن...).', 'tamazight-5ap-tinfusin-djeha-uccen'),
  }),
  paper({
    id: 'exam-5ap-tamazight-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'tamazight',
    titleAr: 'اختبار الفصل الثالث في اللغة الأمازيغية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['tamazight-5ap-agellid-tagant-environnement'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, '« جبل » بالأمازيغية:', 'Adrar.', 'tamazight-5ap-agellid-tagant-environnement'),
      ex('التمرين الثاني (2 نقطتان)', 2, '« شجرة » بالأمازيغية:', 'Aseklu.', 'tamazight-5ap-agellid-tagant-environnement'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'نحافظ على البيئة بـ:', 'عدم رمي النفايات، زراعة الأشجار.', 'tamazight-5ap-agellid-tagant-environnement'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر فعلين لحماية الطبيعة في قريتك.', 'مثال: تنظيف الساحة، ترشيد الماء.', 'tamazight-5ap-agellid-tagant-environnement'),
  }),

  // —— Art ——
  paper({
    id: 'exam-3ap-art-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الأول في التربية الفنية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t1-colors-rhythm'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الألوان الأساسية الثلاثة:', 'أحمر، أزرق، أصفر.', 'art-3ap-t1-colors-rhythm'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'أصفر + أزرق =', 'أخضر.', 'art-3ap-t1-colors-rhythm'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'أحمر + أصفر =', 'برتقالي.', 'art-3ap-t1-colors-rhythm'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم دائرة ولوّنها بلون ثانوي (اذكر اللونين الممزوجين).', 'مثال: بنفسجي من أحمر+أزرق.', 'art-3ap-t1-colors-rhythm'),
  }),
  paper({
    id: 'exam-3ap-art-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثاني في التربية الفنية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t2-shapes-composition'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الشكل ذو ثلاثة أضلاع:', 'مثلث.', 'art-3ap-t2-shapes-composition'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'لإبراز موضوع في اللوحة نجعله:', 'أكبر وأوضح.', 'art-3ap-t2-shapes-composition'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الدائرة والمربع من:', 'الأشكال الهندسية الأساسية.', 'art-3ap-t2-shapes-composition'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'صمّم لوحة بيت بمثلث (سقف) ومستطيل (جدار).', 'رسم منظم: سقف مثلث فوق جدار مستطيل.', 'art-3ap-t2-shapes-composition'),
  }),
  paper({
    id: 'exam-3ap-art-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثالث في التربية الفنية - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['art-3ap-t3-zellij-patterns'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الزليج فن يعتمد على:', 'قطع فسيفساء ملوّنة.', 'art-3ap-t3-zellij-patterns'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'التكرار في الزخرفة يُنتج:', 'إيقاعاً بصرياً.', 'art-3ap-t3-zellij-patterns'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'نكمّل نمطاً زخرفياً بـ:', 'تكرار نفس الشكل بانتظام.', 'art-3ap-t3-zellij-patterns'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم صفاً من 4 مربعات متكررة بألوان متناوبة.', 'مربع أحمر، أزرق، أحمر، أزرق...', 'art-3ap-t3-zellij-patterns'),
  }),

  paper({
    id: 'exam-4ap-art-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الأول في التربية الفنية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t1-warm-cool-colors'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'لون دافئ من: أزرق، أحمر، أخضر:', 'أحمر.', 'art-4ap-t1-warm-cool-colors'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الألوان الباردة تُذكّر بـ:', 'الماء والهدوء.', 'art-4ap-t1-warm-cool-colors'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'البرتقالي لون:', 'دافئ.', 'art-4ap-t1-warm-cool-colors'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لوّن شمساً بألوان دافئة وبحراً بألوان باردة.', 'شمس: أصفر/برتقالي. بحر: أزرق/أخضر.', 'art-4ap-t1-warm-cool-colors'),
  }),
  paper({
    id: 'exam-4ap-art-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثاني في التربية الفنية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t2-perspective-simple'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الشيء القريب في اللوحة يكون:', 'أكبر وأسفل.', 'art-4ap-t2-perspective-simple'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الشيء البعيد يكون:', 'أصغر وأعلى.', 'art-4ap-t2-perspective-simple'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الطريق يضيق نحو:', 'خط الأفق.', 'art-4ap-t2-perspective-simple'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم طريقاً يبتعد نحو الأفق مع شجرتين (قريبة كبيرة، بعيدة صغيرة).', 'تدرج الحجم والموضع يُظهر العمق.', 'art-4ap-t2-perspective-simple'),
  }),
  paper({
    id: 'exam-4ap-art-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثالث في التربية الفنية - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['art-4ap-t3-pottery-crafts'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الجرة الفخارية تُستعمل لـ:', 'حفظ الماء أو الطعام.', 'art-4ap-t3-pottery-crafts'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'زخرفة الفخار غالباً:', 'متكررة ومتناظرة.', 'art-4ap-t3-pottery-crafts'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'بعد التشكيل يُجفَّف الفخار ثم:', 'يُحرق في الفرن.', 'art-4ap-t3-pottery-crafts'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم قصعة فخارية وزخّر حافتها بخط متكرر.', 'قصعة دائرية + خطوط أو نقاط متناظرة.', 'art-4ap-t3-pottery-crafts'),
  }),

  paper({
    id: 'exam-5ap-art-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الأول في التربية الفنية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t1-complementary-colors'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'اللون المتكامل للأحمر تقريباً:', 'أخضر.', 'art-5ap-t1-complementary-colors'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'وضع لونين متكاملين يُنتج:', 'تبايناً قوياً.', 'art-5ap-t1-complementary-colors'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'أزرق + برتقالي:', 'متكاملان.', 'art-5ap-t1-complementary-colors'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'صمّم دائرة حمراء على خلفية خضراء وفسّر اختيارك.', 'تباين قوي لجذب العين.', 'art-5ap-t1-complementary-colors'),
  }),
  paper({
    id: 'exam-5ap-art-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثاني في التربية الفنية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t2-portrait-proportion'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'العينان في رسم الوجه تقريباً:', 'في منتصف الرأس.', 'art-5ap-t2-portrait-proportion'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الأنف في:', 'منتصف الوجه تقريباً.', 'art-5ap-t2-portrait-proportion'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الفم بين:', 'الأنف والذقن.', 'art-5ap-t2-portrait-proportion'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم وجهاً مبسّطاً مع خطوط إرشادية للعينين والأنف.', 'خط أفقي للعينين، أنف في المنتصف، فم أسفل.', 'art-5ap-t2-portrait-proportion'),
  }),
  paper({
    id: 'exam-5ap-art-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'art',
    titleAr: 'اختبار الفصل الثالث في التربية الفنية - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['art-5ap-t3-heritage-mural'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'ألوان العلم الجزائري:', 'أخضر، أبيض، أحمر (هلال ونجمة).', 'art-5ap-t3-heritage-mural'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'قبل جدارية جماعية نبدأ بـ:', 'تخطيط وتوزيع المساحات.', 'art-5ap-t3-heritage-mural'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الرموز الوطنية تُرسم:', 'باحترام وتناسق.', 'art-5ap-t3-heritage-mural'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اقترح موضوع جدارية تراثية لقسمك (علم، قصبة، نخيل...).', 'إجابة مع تبرير بسيط للرمز المختار.', 'art-5ap-t3-heritage-mural'),
  }),

  // —— Technology (science lessons, technology subject strand) ——
  paper({
    id: 'exam-3ap-technology-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الأول في التكنولوجيا - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-matter-states-scale-mass'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الميزان يُستعمل لقياس:', 'الكتلة/الوزن.', 'science-3ap-u3-matter-states-scale-mass'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'وحدة قياس الكتلة الشائعة:', 'الغرام (g) أو الكيلوغرام (kg).', 'science-3ap-u3-matter-states-scale-mass'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'المادة الصلبة لها شكل:', 'ثابت وحجم ثابت.', 'science-3ap-u3-matter-states-scale-mass'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'قارن بين مادة صلبة وسائلة (شكل وحجم).', 'صلبة: شكل ثابت. سائلة: تأخذ شكل الإناء.', 'science-3ap-u3-matter-states-scale-mass'),
  }),
  paper({
    id: 'exam-3ap-technology-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثاني في التكنولوجيا - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-weather-climate-raingauge'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'مقياس المطر يُسمى:', 'ميزان المطر / pluviomètre.', 'science-3ap-u3-weather-climate-raingauge'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'نقيس كمية المطر بـ:', 'المليمتر (mm).', 'science-3ap-u3-weather-climate-raingauge'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الترمومتر يقيس:', 'درجة الحرارة.', 'science-3ap-u3-weather-climate-raingauge'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لماذا نضع مقياس المطر في مكان مفتوح؟', 'ليجمع الماء المتساقط دون عوائق.', 'science-3ap-u3-weather-climate-raingauge'),
  }),
  paper({
    id: 'exam-3ap-technology-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثالث في التكنولوجيا - السنة الثالثة',
    durationMinutes: DUR['3AP'],
    relatedLessonIds: ['science-3ap-u3-time-thermometer-electricity', 'science-3ap-u3-lever-balance'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الدارة المغلقة تعني:', 'مسار كهربائي متصل.', 'science-3ap-u3-time-thermometer-electricity'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'المصباح يضيء إذا:', 'الدارة مغلقة والبطارية سليمة.', 'science-3ap-u3-time-thermometer-electricity'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الرافعة تُسهّل:', 'رفع جسم ثقيل.', 'science-3ap-u3-lever-balance'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ارسم دارة بسيطة: بطارية + مصباح + مفتاح.', 'مسار متصل من البطارية للمصباح عبر المفتاح.', 'science-3ap-u3-time-thermometer-electricity'),
  }),

  paper({
    id: 'exam-4ap-technology-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الأول في التكنولوجيا - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-states-of-matter-phase-changes'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'تحول الماء إلى بخار يسمى:', 'تبخراً.', 'science-4ap-states-of-matter-phase-changes'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'تحول البخار إلى ماء:', 'تكثيفاً/تكاثفاً.', 'science-4ap-states-of-matter-phase-changes'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'عند التجميد يصبح الماء:', 'صلباً (جليداً).', 'science-4ap-states-of-matter-phase-changes'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'رتّب: تبخر، تجميد، ذوبان (من ماء سائل إلى جليد).', 'تبخر (سائل→غاز)، تجميد (سائل→صلب)، ذوبان (صلب→سائل).', 'science-4ap-states-of-matter-phase-changes'),
  }),
  paper({
    id: 'exam-4ap-technology-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثاني في التكنولوجيا - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-air-combustion'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الاحتراق يحتاج:', 'وقود + أكسجين + حرارة.', 'science-4ap-air-combustion'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الهواء ضروري للاحتراق لأنه يحتوي:', 'أكسجيناً.', 'science-4ap-air-combustion'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'إطفاء الشمعة بغطاء زجاجي لأن:', 'ينقطع الأكسجين.', 'science-4ap-air-combustion'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لماذا لا يشتعل الخشب في فراغ؟', 'لا يوجد أكسجين في الفراغ.', 'science-4ap-air-combustion'),
  }),
  paper({
    id: 'exam-4ap-technology-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثالث في التكنولوجيا - السنة الرابعة',
    durationMinutes: DUR['4AP'],
    relatedLessonIds: ['science-4ap-earth-rotation-seasons-time', 'science-4ap-combustion-fire-safety'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'دوران الأرض يسبب:', 'تعاقب الليل والنهار.', 'science-4ap-earth-rotation-seasons-time'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'عند حدوث حريق نتصل بـ:', 'الحماية المدنية / 14.', 'science-4ap-combustion-fire-safety'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'لا نلعب بـ:', 'الولاعات والكبريت.', 'science-4ap-combustion-fire-safety'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر قاعدتين للسلامة من الحريق في البيت.', 'لا نترك الموقد دون مراقبة، نبعد القماش عن النار...', 'science-4ap-combustion-fire-safety'),
  }),

  paper({
    id: 'exam-5ap-technology-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الأول في التكنولوجيا - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-matter-mixtures', 'science-5ap-air-properties'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'فصل الرمل عن الماء يمكن بـ:', 'الترشيح.', 'science-5ap-matter-mixtures'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'المغناطيس يجذب:', 'الحديد.', 'science-5ap-matter-mixtures'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الهواء له:', 'وزن ويشغل حجماً.', 'science-5ap-air-properties'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'كيف تفصل برادة الحديد عن الرمل؟', 'بالمغناطيس: يجذب الحديد ويترك الرمل.', 'science-5ap-matter-mixtures'),
  }),
  paper({
    id: 'exam-5ap-technology-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثاني في التكنولوجيا - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-electric-circuit', 'science-5ap-electrical-safety'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'في الدارة المتوالية المصباحان يضيئان:', 'معاً إذا الدارة سليمة.', 'science-5ap-electric-circuit'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'المفتاح وظيفته:', 'فتح وإغلاق الدارة.', 'science-5ap-electric-circuit'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'لا نلمس الأسلاك المكشوفة لأن:', 'الكهرباء خطرة.', 'science-5ap-electrical-safety'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'ما الفرق بين دارة مفتوحة ومغلقة؟', 'مفتوحة: التيار لا يمر. مغلقة: التيار يمر والمصباح يعمل.', 'science-5ap-electric-circuit'),
  }),
  paper({
    id: 'exam-5ap-technology-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'technology',
    titleAr: 'اختبار الفصل الثالث في التكنولوجيا - السنة الخامسة',
    durationMinutes: DUR['5AP'],
    relatedLessonIds: ['science-5ap-pollution-waste-treatment'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'فرز النفايات يساعد على:', 'إعادة التدوير.', 'science-5ap-pollution-waste-treatment'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'التلوث يمس:', 'الهواء والماء والتربة.', 'science-5ap-pollution-waste-treatment'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'لتقليل النفايات نستعمل:', 'أكياس قابلة لإعادة الاستخدام.', 'science-5ap-pollution-waste-treatment'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اقترح حملة في مدرستك لتقليل النفايات البلاستيكية.', 'مثال: زجاجات قابلة لإعادة التعبئة، فرز في الساحة.', 'science-5ap-pollution-waste-treatment'),
  }),
];
