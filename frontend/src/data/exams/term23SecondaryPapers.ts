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

function arPaper(opts: {
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

function enPaper(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  grade: PrimaryGrade;
  titleAr: string;
  relatedLessonIds: string[];
  exercises: ExamExercise[];
  problem: ExamExercise;
}): OfficialExam {
  return {
    id: opts.id,
    year: 2026,
    trimester: opts.trimester,
    titleAr: opts.titleAr,
    sessionAr: `Term ${opts.trimester} - 2026`,
    subject: 'english',
    grade: opts.grade,
    durationMinutes: opts.grade === '3AP' ? 30 : 45,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: COMPOSITION_SOURCE_NOTE_AR,
    relatedLessonIds: opts.relatedLessonIds,
    exercises: opts.exercises,
    problemExercise: opts.problem,
  };
}

/** T2/T3 compositions for islamic, civics (2AP–5AP) and english (3AP–5AP). Original papers, not aggregator PDFs. */
export const TERM23_SECONDARY_PAPERS: OfficialExam[] = [
  arPaper({
    id: 'exam-2ap-islamic-t2-2026',
    trimester: 2,
    grade: '2AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثاني في التربية الإسلامية - السنة الثانية',
    durationMinutes: 30,
    relatedLessonIds: ['islamic-2ap-t2-five-prayers-rakaat', 'islamic-2ap-t2-manners-eating-cleanliness'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'عدد الصلوات المفروضة في اليوم:', 'خمس صلوات.', 'islamic-2ap-t2-five-prayers-rakaat'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'صلاة الظهر تكون في:\nأ) منتصف النهار تقريباً  ب) بعد العشاء', 'أ) في منتصف النهار / بعد الزوال.', 'islamic-2ap-t2-five-prayers-rakaat'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'قبل الأكل أقول:', 'بسم الله.', 'islamic-2ap-t2-manners-eating-cleanliness'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'رتّب اثنتين من الصلوات الخمس حسب الوقت في اليوم.', 'مثال: الفجر ثم الظهر ثم العصر ثم المغرب ثم العشاء.', 'islamic-2ap-t2-five-prayers-rakaat'),
  }),
  arPaper({
    id: 'exam-2ap-islamic-t3-2026',
    trimester: 3,
    grade: '2AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثالث في التربية الإسلامية - السنة الثانية',
    durationMinutes: 30,
    relatedLessonIds: ['islamic-2ap-t3-honesty-tolerance-parents', 'islamic-2ap-t3-surah-maun-asr'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الصدق يعني:', 'أقول الحق ولا أكذب.', 'islamic-2ap-t3-honesty-tolerance-parents'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'برّ الوالدين يعني:', 'طاعتهما والإحسان إليهما.', 'islamic-2ap-t3-honesty-tolerance-parents'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'سورة العصر تذكّرنا بـ:', 'قيمة الوقت والإيمان والعمل الصالح.', 'islamic-2ap-t3-surah-maun-asr'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اكتب سلوكاً صادقاً في القسم وسلوكاً بارّاً في البيت.', 'القسم: أعترف إن أخطأت. البيت: أساعد أمي وأسمع كلام أبي.', 'islamic-2ap-t3-honesty-tolerance-parents'),
  }),
  arPaper({
    id: 'exam-2ap-civics-t2-2026',
    trimester: 2,
    grade: '2AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثاني في التربية المدنية - السنة الثانية',
    durationMinutes: 30,
    relatedLessonIds: ['civics-2ap-t2-cleanliness-property', 'civics-2ap-t2-public-private-property'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'أحافظ على نظافة:', 'قسمي ومدرستي وساحتي.', 'civics-2ap-t2-cleanliness-property'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'المدرسة ملكية:\nأ) عامة  ب) خاصة بتلميذ واحد', 'أ) عامة.', 'civics-2ap-t2-public-private-property'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'محفظتي المدرسية ملكية:', 'خاصة بي.', 'civics-2ap-t2-public-private-property'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لماذا لا نكتب على طاولة القسم؟', 'لأنها ملك للجميع / ملكية عامة يجب المحافظة عليها.', 'civics-2ap-t2-public-private-property'),
  }),
  arPaper({
    id: 'exam-2ap-civics-t3-2026',
    trimester: 3,
    grade: '2AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثالث في التربية المدنية - السنة الثانية',
    durationMinutes: 30,
    relatedLessonIds: ['civics-2ap-t3-road-safety', 'civics-2ap-t3-right-to-play-rest'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الإشارة الحمراء تعني:', 'قف.', 'civics-2ap-t3-road-safety'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'أعبر الطريق من:', 'ممر الراجلين.', 'civics-2ap-t3-road-safety'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'اللعب والراحة حق للطفل:\nأ) نعم  ب) لا', 'أ) نعم.', 'civics-2ap-t3-right-to-play-rest'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر قاعدتين للأمان في الطريق.', 'أعبر من الممر، أنتظر الضوء الأخضر، لا ألعب وسط السيارات.', 'civics-2ap-t3-road-safety'),
  }),

  arPaper({
    id: 'exam-3ap-islamic-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثاني في التربية الإسلامية - السنة الثالثة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-3ap-t2-short-surahs', 'islamic-3ap-t2-prayer-times-rakaat'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'سورة الشرح تبشّر بأن:', 'مع العسر يسراً.', 'islamic-3ap-t2-short-surahs'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'صلاة المغرب تكون:', 'بعد غروب الشمس مباشرة.', 'islamic-3ap-t2-prayer-times-rakaat'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'عدد ركعات صلاة الفجر:', 'ركعتان.', 'islamic-3ap-t2-prayer-times-rakaat'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر صلاةً ووقتها وعدد ركعاتها.', 'مثال: المغرب بعد الغروب، ثلاث ركعات.', 'islamic-3ap-t2-prayer-times-rakaat'),
  }),
  arPaper({
    id: 'exam-3ap-islamic-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثالث في التربية الإسلامية - السنة الثالثة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-3ap-t3-ethics-sirah', 'islamic-3ap-t3-hijra'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'أرضعت النبي ﷺ في البادية:', 'حليمة السعدية.', 'islamic-3ap-t3-ethics-sirah'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الهجرة كانت من مكة إلى:', 'المدينة.', 'islamic-3ap-t3-hijra'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'التقويم الهجري يبدأ من:', 'عام الهجرة.', 'islamic-3ap-t3-hijra'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لماذا هاجر النبي ﷺ؟ اذكر سبباً واحداً.', 'للدعوة في أمان بعد أذى قريش، وبناء مجتمع في المدينة.', 'islamic-3ap-t3-hijra'),
  }),
  arPaper({
    id: 'exam-3ap-civics-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثاني في التربية المدنية - السنة الثالثة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-3ap-t2-safety-nutrition-rules'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'قبل أكل الفاكهة يجب:', 'غسلها بالماء.', 'civics-3ap-t2-safety-nutrition-rules'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'أغسل يديّ قبل الأكل لأنها:', 'عادة صحية تقي من الجراثيم.', 'civics-3ap-t2-safety-nutrition-rules'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الأكل من الشارع دون غسل اليدين:', 'خطر على الصحة.', 'civics-3ap-t2-safety-nutrition-rules'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اقترح قاعدتين صحيّتين في ساحة المدرسة بعد الرياضة.', 'أشرب ماءً، أغسل يديّ، لا أشتري أكلاً وسخاً، أرتاح في الظل.', 'civics-3ap-t2-safety-nutrition-rules'),
  }),
  arPaper({
    id: 'exam-3ap-civics-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثالث في التربية المدنية - السنة الثالثة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-3ap-t3-dialogue-respect-environment'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'عند اختلاف الرأي يجب:', 'الحوار بهدوء دون صراخ.', 'civics-3ap-t3-dialogue-respect-environment'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'القمامة توضع في:', 'السلة.', 'civics-3ap-t3-dialogue-respect-environment'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'أحافظ على شجرة الحي لأنها:', 'جزء من محيطنا المشترك.', 'civics-3ap-t3-dialogue-respect-environment'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اكتب قاعدتين: واحدة للحوار وواحدة للبيئة.', 'أحترم رأي زميلي. لا أرمي الورق في الساحة.', 'civics-3ap-t3-dialogue-respect-environment'),
  }),

  enPaper({
    id: 'exam-3ap-english-t2-2026',
    trimester: 2,
    grade: '3AP',
    titleAr: '2nd term English test — Year 3 (3AP)',
    relatedLessonIds: ['english-3ap-u2-school-objects-commands', 'english-3ap-u3-colors-shapes-home'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, 'What colour is the Algerian flag’s star? a) red  b) blue', 'a) red.', 'english-3ap-u3-colors-shapes-home'),
      ex('Exercise 2 (2 pts)', 2, '"Sit down" means:', 'اجلس / sit (command).', 'english-3ap-u2-school-objects-commands'),
      ex('Exercise 3 (2 pts)', 2, 'A ball is a: a) circle  b) square', 'a) circle.', 'english-3ap-u3-colors-shapes-home'),
    ],
    problem: ex('Speaking / writing (4 pts)', 4, 'Name two classroom objects in English.', 'Example: a book, a pencil / a bag, a ruler.', 'english-3ap-u2-school-objects-commands'),
  }),
  enPaper({
    id: 'exam-3ap-english-t3-2026',
    trimester: 3,
    grade: '3AP',
    titleAr: '3rd term English test — Year 3 (3AP)',
    relatedLessonIds: ['english-3ap-u4-food-drinks', 'english-3ap-u4-numbers-counting', 'english-3ap-u5-body-parts-review'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, '"Water" in Arabic is:', 'ماء.', 'english-3ap-u4-food-drinks'),
      ex('Exercise 2 (2 pts)', 2, 'I eat with my: a) hands/mouth  b) ears', 'We eat with the mouth; we use hands to hold food. Expected: mouth / hands.', 'english-3ap-u5-body-parts-review'),
      ex('Exercise 3 (2 pts)', 2, 'Ten in numbers is:', '10.', 'english-3ap-u4-numbers-counting'),
    ],
    problem: ex('Speaking / writing (4 pts)', 4, 'Write two food or drink words you like.', 'Example: I like bread. I like water / milk.', 'english-3ap-u4-food-drinks'),
  }),

  arPaper({
    id: 'exam-4ap-islamic-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثاني في التربية الإسلامية - السنة الرابعة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-4ap-faith-messengers-books', 'islamic-4ap-worship-wudu-prayer-friday'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'نؤمن برسل الله ومنهم:', 'محمد ﷺ وجميع الرسل.', 'islamic-4ap-faith-messengers-books'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'صلاة الجمعة بدل صلاة:', 'الظهر يوم الجمعة.', 'islamic-4ap-worship-wudu-prayer-friday'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الكتب السماوية نؤمن بها ومنها:', 'القرآن الكريم.', 'islamic-4ap-faith-messengers-books'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'اذكر شرطين لصحة الصلاة من الطهارة.', 'الوضوء (أو التيمم إن تعذّر الماء)، طهارة البدن والثوب والمكان، استقبال القبلة.', 'islamic-4ap-worship-wudu-prayer-friday'),
  }),
  arPaper({
    id: 'exam-4ap-islamic-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثالث في التربية الإسلامية - السنة الرابعة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-4ap-sirah-medina-badr', 'islamic-4ap-ethics-parents-neighbors-charity'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'غزوة بدر كانت بعد الهجرة إلى:', 'المدينة.', 'islamic-4ap-sirah-medina-badr'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'برّ الوالدين:', 'إحسان وطاعة في المعروف.', 'islamic-4ap-ethics-parents-neighbors-charity'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'حق الجار:', 'عدم أذاه والإحسان إليه.', 'islamic-4ap-ethics-parents-neighbors-charity'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'كيف تعامل جارك في العمارة؟ اذكر سلوكين.', 'ألقي السلام، لا أرفع الصوت ليلاً، أساعد إن احتاج.', 'islamic-4ap-ethics-parents-neighbors-charity'),
  }),
  arPaper({
    id: 'exam-4ap-civics-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثاني في التربية المدنية - السنة الرابعة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-4ap-public-institutions'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'البريد مؤسسة:', 'عمومية تخدم المواطنين.', 'civics-4ap-public-institutions'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'البلدية تساعد في:', 'شؤون القرب والخدمات المحلية.', 'civics-4ap-public-institutions'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'المدرسة مؤسسة:', 'عمومية للتعليم.', 'civics-4ap-public-institutions'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'لماذا نحتاج إلى البلدية والبريد؟ مثال من حياتك.', 'البلدية: وثائق الحالة المدنية. البريد: إرسال رسالة أو حوالة.', 'civics-4ap-public-institutions'),
  }),
  arPaper({
    id: 'exam-4ap-civics-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثالث في التربية المدنية - السنة الرابعة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-4ap-national-identity-symbols'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'العلم والنشيد والعملة من:', 'رموز السيادة الوطنية.', 'civics-4ap-national-identity-symbols'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'النشيد الوطني:', 'قسماً.', 'civics-4ap-national-identity-symbols'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'العملة الجزائرية:', 'الدينار.', 'civics-4ap-national-identity-symbols'),
    ],
    problem: ex('وضعية بسيطة (4 نقاط)', 4, 'كيف تحترم العلم في ساحة المدرسة؟', 'أقف منتصباً، أنشد باحترام، لا أعبث بالعلم.', 'civics-4ap-national-identity-symbols'),
  }),

  enPaper({
    id: 'exam-4ap-english-t2-2026',
    trimester: 2,
    grade: '4AP',
    titleAr: '2nd term English test — Year 4 (4AP)',
    relatedLessonIds: ['english-4ap-unit4-food-meals', 'english-4ap-unit5-pets-animals'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, '"I like apples" means:', 'أحب التفاح.', 'english-4ap-unit4-food-meals'),
      ex('Exercise 2 (2 pts)', 2, 'A cat is a: a) pet  b) classroom', 'a) pet.', 'english-4ap-unit5-pets-animals'),
      ex('Exercise 3 (2 pts)', 2, '"Bread" in Arabic is:', 'خبز.', 'english-4ap-unit4-food-meals'),
    ],
    problem: ex('Short text (4 pts)', 4, 'Write 3 sentences: a meal at home in Algeria.', 'Example: I eat bread. I drink water. I like couscous on Friday.', 'english-4ap-unit4-food-meals'),
  }),
  enPaper({
    id: 'exam-4ap-english-t3-2026',
    trimester: 3,
    grade: '4AP',
    titleAr: '3rd term English test — Year 4 (4AP)',
    relatedLessonIds: ['english-4ap-unit6-hobbies-games', 'english-4ap-unit6-daily-routines-review'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, 'I play football in the: a) stadium/yard  b) fridge', 'a) yard / playground / stadium.', 'english-4ap-unit6-hobbies-games'),
      ex('Exercise 2 (2 pts)', 2, '"I wake up" happens usually:', 'in the morning.', 'english-4ap-unit6-daily-routines-review'),
      ex('Exercise 3 (2 pts)', 2, 'Present simple: He .... (play) football.', 'plays.', 'english-4ap-unit6-daily-routines-review'),
    ],
    problem: ex('Short text (4 pts)', 4, 'Write 3 sentences about your Friday (hobby + time).', 'Example: I get up at 8. I play football. I visit my grandparents.', 'english-4ap-unit6-daily-routines-review'),
  }),

  arPaper({
    id: 'exam-5ap-islamic-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثاني في التربية الإسلامية - السنة الخامسة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-5ap-zakat-social-solidarity', 'islamic-5ap-sirah-hijra-brotherhood'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الزكاة:', 'حق معلوم في المال للفقراء، ركن من أركان الإسلام.', 'islamic-5ap-zakat-social-solidarity'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'المؤاخاة في المدينة ربطت بين:', 'المهاجرين والأنصار.', 'islamic-5ap-sirah-hijra-brotherhood'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الهجرة إلى المدينة كانت من:', 'مكة.', 'islamic-5ap-sirah-hijra-brotherhood'),
    ],
    problem: ex('وضعية إدماجية (4 نقاط)', 4, 'كيف يظهر التكافل في حيّك كما في الزكاة والمؤاخاة؟', 'مساعدة محتاج، صدقة، عدم احتكار، إكرام الجار كما آخى النبي بين المهاجرين والأنصار.', 'islamic-5ap-zakat-social-solidarity'),
  }),
  arPaper({
    id: 'exam-5ap-islamic-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'islamic',
    titleAr: 'اختبار الفصل الثالث في التربية الإسلامية - السنة الخامسة',
    durationMinutes: 45,
    relatedLessonIds: ['islamic-5ap-hajj-and-umrah', 'islamic-5ap-ethics-amana-selfcontrol-environment'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'الحج واجب على:', 'المستطيع مرة في العمر.', 'islamic-5ap-hajj-and-umrah'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الأمانة تعني:', 'حفظ الحقوق وعدم الخيانة.', 'islamic-5ap-ethics-amana-selfcontrol-environment'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'العمرة:', 'عبادة مستقلة وليست بديلاً عن حج الفريضة.', 'islamic-5ap-hajj-and-umrah'),
    ],
    problem: ex('وضعية إدماجية (4 نقاط)', 4, 'كيف تطبق الأمانة في الامتحان وفي حماية البيئة؟', 'لا أغشّ. لا أفسد الحديقة ولا أسرف الماء.', 'islamic-5ap-ethics-amana-selfcontrol-environment'),
  }),
  arPaper({
    id: 'exam-5ap-civics-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثاني في التربية المدنية - السنة الخامسة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-5ap-commune', 'civics-5ap-wilaya'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'البلدية أقرب إدارة لـ:', 'سكان الحي والقرية.', 'civics-5ap-commune'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'الولاية تجمع عدة:', 'بلديات.', 'civics-5ap-wilaya'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'الوالي:', 'يسهر على تطبيق القانون في الولاية.', 'civics-5ap-wilaya'),
    ],
    problem: ex('وضعية إدماجية (4 نقاط)', 4, 'فرّق بجملة بين دور البلدية ودور الولاية.', 'البلدية خدمات القرب (نظافة، حالة مدنية). الولاية تنسّق عدة بلديات وتمثّل الدولة.', 'civics-5ap-commune'),
  }),
  arPaper({
    id: 'exam-5ap-civics-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'civics',
    titleAr: 'اختبار الفصل الثالث في التربية المدنية - السنة الخامسة',
    durationMinutes: 45,
    relatedLessonIds: ['civics-5ap-internet-safety', 'civics-5ap-child-rights'],
    exercises: [
      ex('التمرين الأول (2 نقطتان)', 2, 'من حقوق الطفل:', 'التعلم والحماية والصحة.', 'civics-5ap-child-rights'),
      ex('التمرين الثاني (2 نقطتان)', 2, 'لا أشارك على الإنترنت دون راشد:', 'عنوان البيت ورقم الهاتف.', 'civics-5ap-internet-safety'),
      ex('التمرين الثالث (2 نقطتان)', 2, 'إذا طلب غريب لقاء عبر الشبكة:', 'أخبر راشداً ولا أوافق.', 'civics-5ap-internet-safety'),
    ],
    problem: ex('وضعية إدماجية (4 نقاط)', 4, 'اكتب قاعدتين لأمان الإنترنت وقاعدة لحقك في المدرسة.', 'لا أعطي بياناتي. لا أفتح روابط مجهولة. لي حق التعلم في قسم آمن.', 'civics-5ap-internet-safety'),
  }),

  enPaper({
    id: 'exam-5ap-english-t2-2026',
    trimester: 2,
    grade: '5AP',
    titleAr: '2nd term English test — Year 5 (5AP)',
    relatedLessonIds: ['english-5ap-unit2-occupations-workplaces'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, 'A teacher works at a:', 'school.', 'english-5ap-unit2-occupations-workplaces'),
      ex('Exercise 2 (2 pts)', 2, 'A doctor works at a:', 'hospital.', 'english-5ap-unit2-occupations-workplaces'),
      ex('Exercise 3 (2 pts)', 2, '"Baker" in Arabic is close to:', 'خبّاز.', 'english-5ap-unit2-occupations-workplaces'),
    ],
    problem: ex('Writing (4 pts)', 4, 'Write 4 sentences: a job in your family or neighbourhood (place + verb).', 'Example: My uncle is a farmer. He works on a farm. He grows wheat. He lives near Sétif.', 'english-5ap-unit2-occupations-workplaces'),
  }),
  enPaper({
    id: 'exam-5ap-english-t3-2026',
    trimester: 3,
    grade: '5AP',
    titleAr: '3rd term English test — Year 5 (5AP)',
    relatedLessonIds: ['english-5ap-unit5-travel-transport-holidays', 'english-5ap-unit8-will-going-to', 'english-5ap-unit3-time-weather-seasons', 'english-5ap-unit9-giving-directions'],
    exercises: [
      ex('Exercise 1 (2 pts)', 2, 'Tomorrow I .... visit Oran. (will / yesterday)', 'will.', 'english-5ap-unit8-will-going-to'),
      ex('Exercise 2 (2 pts)', 2, '"It is sunny" means the weather is:', 'مشمس.', 'english-5ap-unit3-time-weather-seasons'),
      ex('Exercise 3 (2 pts)', 2, 'Turn left / go straight are used to:', 'give directions.', 'english-5ap-unit9-giving-directions'),
    ],
    problem: ex('Writing (4 pts)', 4, 'Write 4 sentences: a holiday in Algeria (will + place + activity).', 'Example: I will go to Béjaïa. I will see the sea. I will eat couscous. I will visit my cousins.', 'english-5ap-unit5-travel-transport-holidays'),
  }),
];
