import { ExamExercise, OfficialExam, PrimaryGrade, SubjectId } from '../../types';
import { DEVOIR_SOURCE_NOTE_AR } from '../examSourceNotes';

const note = DEVOIR_SOURCE_NOTE_AR;

function hw(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  grade: PrimaryGrade;
  subject: SubjectId;
  titleAr: string;
  relatedLessonIds: string[];
  exercises: ExamExercise[];
  problem: ExamExercise;
}): OfficialExam {
  return {
    id: opts.id,
    year: 2026,
    trimester: opts.trimester,
    kind: 'devoir',
    titleAr: opts.titleAr,
    sessionAr: `فرض الفصل ${opts.trimester === 1 ? 'الأول' : opts.trimester === 2 ? 'الثاني' : 'الثالث'} 2026`,
    subject: opts.subject,
    grade: opts.grade,
    durationMinutes: 20,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: note,
    relatedLessonIds: opts.relatedLessonIds,
    exercises: opts.exercises,
    problemExercise: opts.problem,
  };
}

/**
 * 1 homework per term for islamic/civics (2AP–5AP) and french/english (3AP–5AP).
 * Original MSSID papers from catalog lessons — not aggregator PDFs.
 */
export const SECONDARY_DEVOIR_PAPERS: OfficialExam[] = [
  // ——— 2AP ISLAMIC ———
  hw({
    id: 'homework-2ap-islamic-t1-2026',
    trimester: 1,
    grade: '2AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 1 — السور القصيرة والوضوء (السنة الثانية)',
    relatedLessonIds: ['islamic-2ap-t1-short-surahs-1', 'islamic-2ap-t1-wudu-steps'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t1-short-surahs-1', contentAr: 'اذكر سورتين قصيرتين تحفظهما في هذا الفصل.', solutionAr: 'مثال مقبول: الفاتحة، الإخلاص، الفلق، الناس، الكوثر…' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t1-wudu-steps', contentAr: 'ما أول عمل في الوضوء بعد النية؟', solutionAr: 'غسل اليدين (ثم المضمضة والاستنشاق وغسل الوجه…).' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-2ap-t1-wudu-steps', contentAr: 'يريد كريم الصلاة بعد اللعب. ماذا يفعل قبل أن يكبّر؟', solutionAr: 'يتوضأ وضوءاً كاملاً ثم يستقبل القبلة.' },
  }),
  hw({
    id: 'homework-2ap-islamic-t2-2026',
    trimester: 2,
    grade: '2AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — الصلوات الخمس وآداب الطعام (السنة الثانية)',
    relatedLessonIds: ['islamic-2ap-t2-five-prayers-rakaat', 'islamic-2ap-t2-manners-eating-cleanliness'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t2-five-prayers-rakaat', contentAr: 'كم ركعة في صلاة الظهر؟', solutionAr: 'أربع ركعات.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t2-manners-eating-cleanliness', contentAr: 'ماذا نقول قبل الأكل؟', solutionAr: 'بسم الله (وباليد اليمنى، ومن أمامنا).' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-2ap-t2-manners-eating-cleanliness', contentAr: 'نسي سامي التسمية ثم تذكّر في وسط الأكل. ماذا يقول؟', solutionAr: 'بسم الله أوّله وآخره.' },
  }),
  hw({
    id: 'homework-2ap-islamic-t3-2026',
    trimester: 3,
    grade: '2AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 3 — الصدق وبرّ الوالدين (السنة الثانية)',
    relatedLessonIds: ['islamic-2ap-t3-honesty-tolerance-parents', 'islamic-2ap-t3-surah-maun-asr'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t3-honesty-tolerance-parents', contentAr: 'اذكر أدباً واحداً مع الوالدين.', solutionAr: 'الاستئذان، الكلام اللطيف، المساعدة، عدم رفع الصوت…' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-2ap-t3-surah-maun-asr', contentAr: 'سورة الماعون تنهى عن عمل سيئ. اذكره.', solutionAr: 'منع الماعون / إهمال اليتيم / الرياء في الصلاة (إجابة واحدة تكفي).' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-2ap-t3-honesty-tolerance-parents', contentAr: 'كسر آدم إناء أمه. ماذا يفعل الصادق؟', solutionAr: 'يعترف ويعتذر ويساعد في الإصلاح.' },
  }),

  // ——— 2AP CIVICS ———
  hw({
    id: 'homework-2ap-civics-t1-2026',
    trimester: 1,
    grade: '2AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 1 — الاحترام والعلم الوطني (السنة الثانية)',
    relatedLessonIds: ['civics-2ap-t1-listening-respect', 'civics-2ap-t1-national-symbols'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t1-listening-respect', contentAr: 'كيف نتصرف حين يتكلم المعلم؟', solutionAr: 'نصمت ونستمع ونرفع اليد قبل الكلام.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t1-national-symbols', contentAr: 'ما ألوان العلم الوطني؟', solutionAr: 'أخضر وأبيض ونجمة وهلال أحمران.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-2ap-t1-national-symbols', contentAr: 'عند رفع العلم في الساحة، ماذا نفعل؟', solutionAr: 'نقف احتراماً ونصمت (ولا نلعب بالعلم).' },
  }),
  hw({
    id: 'homework-2ap-civics-t2-2026',
    trimester: 2,
    grade: '2AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — النظافة والملك العام (السنة الثانية)',
    relatedLessonIds: ['civics-2ap-t2-cleanliness-property', 'civics-2ap-t2-public-private-property'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t2-cleanliness-property', contentAr: 'أين نرمي الورق في الساحة؟', solutionAr: 'في سلة المهملات.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t2-public-private-property', contentAr: 'صنّف: كرسي القسم — حقيبة ليلى. ملك عام أم خاص؟', solutionAr: 'كرسي القسم: عام (للمدرسة). الحقيبة: خاص.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-2ap-t2-public-private-property', contentAr: 'رسم تلميذ على جدار المدرسة. لماذا هذا خطأ؟', solutionAr: 'الجدار ملك عام: نتلفه فنضرّ الجميع.' },
  }),
  hw({
    id: 'homework-2ap-civics-t3-2026',
    trimester: 3,
    grade: '2AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 3 — السلامة في الطريق واللعب (السنة الثانية)',
    relatedLessonIds: ['civics-2ap-t3-road-safety', 'civics-2ap-t3-right-to-play-rest'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t3-road-safety', contentAr: 'من أين نعبر الطريق؟', solutionAr: 'من الممر المخصص للراجلين (أو مع راشد).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-2ap-t3-right-to-play-rest', contentAr: 'لماذا يحتاج الطفل إلى الراحة بعد الدراسة؟', solutionAr: 'ليستعيد نشاطه وينمو جسمه (حق اللعب والراحة).' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-2ap-t3-road-safety', contentAr: 'كرة خرجت إلى الطريق. ماذا تفعل؟', solutionAr: 'لا أركض خلفها. أنتظر أو أطلب راشداً.' },
  }),

  // ——— 3AP ISLAMIC ———
  hw({
    id: 'homework-3ap-islamic-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 1 — أركان الإسلام والطهارة (السنة الثالثة)',
    relatedLessonIds: ['islamic-3ap-t1-pillars-purity-surahs'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t1-pillars-purity-surahs', contentAr: 'اذكر ركنين من أركان الإسلام.', solutionAr: 'الشهادة، الصلاة، الزكاة، الصوم، الحج (اثنان يكفيان).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t1-pillars-purity-surahs', contentAr: 'متى نتوضأ؟', solutionAr: 'قبل الصلاة / عند انتقاض الوضوء.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-3ap-t1-pillars-purity-surahs', contentAr: 'حان وقت العصر وأنت في ساحة المدرسة. ماذا تفعل؟', solutionAr: 'أستأذن وأتوضأ وأصلي في وقتها إن تيسّر المكان.' },
  }),
  hw({
    id: 'homework-3ap-islamic-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — سور قصيرة وأوقات الصلاة (السنة الثالثة)',
    relatedLessonIds: ['islamic-3ap-t2-short-surahs', 'islamic-3ap-t2-prayer-times-rakaat'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t2-short-surahs', contentAr: 'سورة العاديات تتحدث عن ماذا في مطلعها؟', solutionAr: 'الخيل العادية (الضابحة) / القسم بالعاديات.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t2-prayer-times-rakaat', contentAr: 'كم ركعة في المغرب؟ ومتى وقتها تقريباً؟', solutionAr: 'ثلاث ركعات، بعد غروب الشمس.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-3ap-t2-prayer-times-rakaat', contentAr: 'رتّب: العشاء — الفجر — الظهر.', solutionAr: 'الفجر ثم الظهر ثم العشاء.' },
  }),
  hw({
    id: 'homework-3ap-islamic-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 3 — السيرة والهجرة (السنة الثالثة)',
    relatedLessonIds: ['islamic-3ap-t3-ethics-sirah', 'islamic-3ap-t3-hijra'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t3-ethics-sirah', contentAr: 'بماذا لُقّب النبي ﷺ قبل البعثة؟', solutionAr: 'الصادق الأمين.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-3ap-t3-hijra', contentAr: 'من مكة هاجر النبي ﷺ إلى أي مدينة؟', solutionAr: 'يثرب / المدينة المنورة.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-3ap-t3-ethics-sirah', contentAr: 'وجد يوسف محفظة زميله وفيها مال. ماذا يفعل الصادق؟', solutionAr: 'يرجعها إلى صاحبها أو إلى المعلم.' },
  }),

  // ——— 3AP CIVICS ———
  hw({
    id: 'homework-3ap-civics-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 1 — نظام القسم والرموز (السنة الثالثة)',
    relatedLessonIds: ['civics-3ap-t1-school-rules-symbols'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t1-school-rules-symbols', contentAr: 'اذكر قاعدتين من نظام القسم.', solutionAr: 'رفع اليد، عدم الضرب، المحافظة على الكراريس…' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t1-school-rules-symbols', contentAr: 'ما النشيد الوطني الجزائري؟', solutionAr: 'قسماً.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-3ap-t1-school-rules-symbols', contentAr: 'زميلك يتكلم أثناء شرح الدرس. كيف تنصحه بلطف؟', solutionAr: 'نذكّره برفع اليد وبأن الجميع يحتاج السماع.' },
  }),
  hw({
    id: 'homework-3ap-civics-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — السلامة والتغذية (السنة الثالثة)',
    relatedLessonIds: ['civics-3ap-t2-safety-nutrition-rules'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t2-safety-nutrition-rules', contentAr: 'لماذا نغسل اليدين قبل الأكل؟', solutionAr: 'لإزالة الجراثيم والوقاية من المرض.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t2-safety-nutrition-rules', contentAr: 'اذكر غذاءً مفيداً للنشاط في المدرسة.', solutionAr: 'خبز، حليب، فواكه، تمر… (ليس رقائق مالحة فقط).' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-3ap-t2-safety-nutrition-rules', contentAr: 'في الاستراحة اشتريت حلوى كثيرة بدل وجبة. ما النصيحة؟', solutionAr: 'التوازن: وجبة خفيفة مفيدة أفضل من الإفراط في السكر.' },
  }),
  hw({
    id: 'homework-3ap-civics-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 3 — الحوار والبيئة (السنة الثالثة)',
    relatedLessonIds: ['civics-3ap-t3-dialogue-respect-environment'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t3-dialogue-respect-environment', contentAr: 'كيف نتحاور دون شتم؟', solutionAr: 'نستمع ثم نتكلم بهدوء ونحترم الرأي الآخر.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-3ap-t3-dialogue-respect-environment', contentAr: 'اذكر عملاً يحمي بيئة الحي.', solutionAr: 'عدم رمي الأوساخ، سقي شجرة، عدم حرق البلاستيك…' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-3ap-t3-dialogue-respect-environment', contentAr: 'اختلفت مع زميلك على دور في مسرحية القسم. اقترح حلاً.', solutionAr: 'نتقاسم الأدوار أو نقترع ونقبل النتيجة.' },
  }),

  // ——— 4AP FRENCH (débutant — ex-3AP, migré suite au changement de calendrier MEN 2026-2027) ———
  // Ces 3 devoirs référencent les leçons "beginner" désormais en grade 4AP (voir 4AP/french.ts).
  // Les 2 premières tombent toutes deux en trimestre 1 (les séquences correspondantes y sont regroupées).
  hw({
    id: 'homework-4ap-french-beg1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 1 — Salutations et lettres (4AP)',
    relatedLessonIds: ['french-3ap-p1-seq1-greetings-letters', 'french-3ap-p1-seq2-class-letters'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p1-seq1-greetings-letters', contentAr: 'Complète : Bon… Karim ! (matin)', solutionAr: 'Bonjour.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p1-seq2-class-letters', contentAr: 'Écris la voyelle manquante : l…vre (livre).', solutionAr: 'i → livre.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-3ap-p1-seq1-greetings-letters', contentAr: 'Tu arrives en classe le matin. Écris une phrase pour saluer la maîtresse.', solutionAr: 'Exemple : Bonjour madame. / Bonjour maîtresse.' },
  }),
  hw({
    id: 'homework-4ap-french-beg2-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 2 — Famille et nombres (4AP)',
    relatedLessonIds: ['french-3ap-p2-seq1-family-letters', 'french-3ap-p2-seq2-numbers-age'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p2-seq1-family-letters', contentAr: 'Qui est le père de ton père ? (un mot)', solutionAr: 'Le grand-père / papy.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p2-seq2-numbers-age', contentAr: 'Écris en lettres : 8.', solutionAr: 'huit.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-3ap-p2-seq2-numbers-age', contentAr: 'Sara a 8 ans. Écris : « J’ai … ans. » comme si tu étais Sara.', solutionAr: 'J’ai huit ans.' },
  }),
  hw({
    id: 'homework-4ap-french-beg3-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 3 — Animaux et repas (4AP)',
    relatedLessonIds: ['french-3ap-p3-seq1-animals-sounds', 'french-3ap-p4-seq1-meals-verbs'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p3-seq1-animals-sounds', contentAr: 'Le chat dit : miaou. Et le chien ?', solutionAr: 'Ouaf / wouah.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-3ap-p4-seq1-meals-verbs', contentAr: 'Complète : Je … du pain. (manger)', solutionAr: 'mange.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-3ap-p4-seq1-meals-verbs', contentAr: 'Écris deux aliments que tu manges au goûter à l’école.', solutionAr: 'Exemple : du pain et une pomme / un yaourt et des dattes.' },
  }),

  // ——— 3AP ENGLISH ———
  hw({
    id: 'homework-3ap-english-t1-2026',
    trimester: 1,
    grade: '3AP',
    subject: 'english',
    titleAr: 'Homework 1 — Greetings & family (3AP)',
    relatedLessonIds: ['english-3ap-u1-greetings-alphabet', 'english-3ap-u1-family-friends-numbers'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u1-greetings-alphabet', contentAr: 'How do you say hello in the morning?', solutionAr: 'Good morning.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u1-family-friends-numbers', contentAr: 'Complete: This is my … (mother).', solutionAr: 'mum / mother / mom.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-3ap-u1-greetings-alphabet', contentAr: 'Write: Hello, my name is … (your first name).', solutionAr: 'Hello, my name is [prénom].' },
  }),
  hw({
    id: 'homework-3ap-english-t2-2026',
    trimester: 2,
    grade: '3AP',
    subject: 'english',
    titleAr: 'Homework 2 — School objects & colours (3AP)',
    relatedLessonIds: ['english-3ap-u2-school-objects-commands', 'english-3ap-u3-colors-shapes-home'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u2-school-objects-commands', contentAr: 'Point to a pencil. How do you ask for it? (Please, a …)', solutionAr: 'Please, a pencil. / Can I have a pencil, please?' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u3-colors-shapes-home', contentAr: 'What colour is the Algerian flag’s left band?', solutionAr: 'Green.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-3ap-u2-school-objects-commands', contentAr: 'Name two objects in your schoolbag.', solutionAr: 'book, pencil, rubber, ruler…' },
  }),
  hw({
    id: 'homework-3ap-english-t3-2026',
    trimester: 3,
    grade: '3AP',
    subject: 'english',
    titleAr: 'Homework 3 — Food & body (3AP)',
    relatedLessonIds: ['english-3ap-u4-food-drinks', 'english-3ap-u5-body-parts-review'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u4-food-drinks', contentAr: 'I like milk. I don’t like … (a drink you refuse).', solutionAr: 'Exemple : coffee / soda. (any plausible drink)' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-3ap-u5-body-parts-review', contentAr: 'We see with our …', solutionAr: 'eyes.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-3ap-u4-food-drinks', contentAr: 'Write one sentence: I like … and I don’t like …', solutionAr: 'Exemple : I like dates and I don’t like onions.' },
  }),

  // ——— 4AP ISLAMIC ———
  hw({
    id: 'homework-4ap-islamic-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 1 — سور الضحى والعلق (السنة الرابعة)',
    relatedLessonIds: ['islamic-4ap-quran-duha-shams', 'islamic-4ap-quran-alaq-balad'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-quran-duha-shams', contentAr: 'بماذا أقسم الله في أول سورة الضحى؟', solutionAr: 'بالضحى.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-quran-alaq-balad', contentAr: 'ما أول كلمة نزلت من القرآن؟', solutionAr: 'اقرأ.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-4ap-quran-duha-shams', contentAr: 'كيف تطبق «وأما السائل فلا تنهر» في ساحة المدرسة؟', solutionAr: 'لا أزجر من يطلب مساعدة أو قلماً؛ أردّ بلطف.' },
  }),
  hw({
    id: 'homework-4ap-islamic-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — الرسل والوضوء (السنة الرابعة)',
    relatedLessonIds: ['islamic-4ap-faith-messengers-books', 'islamic-4ap-worship-wudu-prayer-friday'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-faith-messengers-books', contentAr: 'اذكر رسولين من أولي العزم.', solutionAr: 'نوح، إبراهيم، موسى، عيسى، محمد ﷺ (اثنان).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-worship-wudu-prayer-friday', contentAr: 'لماذا نغسل الوجه في الوضوء؟', solutionAr: 'ركن من أركان الوضوء / طهارة للصلاة.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-4ap-worship-wudu-prayer-friday', contentAr: 'يوم الجمعة، ماذا يستحب قبل الصلاة؟', solutionAr: 'الغسل والطهارة والتبكير والاستماع إلى الخطبة.' },
  }),
  hw({
    id: 'homework-4ap-islamic-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 3 — برّ الوالدين والأمانة (السنة الرابعة)',
    relatedLessonIds: ['islamic-4ap-ethics-parents-neighbors-charity', 'islamic-4ap-modesty-honesty-cheating-waste'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-ethics-parents-neighbors-charity', contentAr: 'اذكر حقاً للجار.', solutionAr: 'عدم الإيذاء، السلام، المساعدة عند الحاجة.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-4ap-modesty-honesty-cheating-waste', contentAr: 'لماذا الغش في الفرض حرام؟', solutionAr: 'لأنّه كذب وخيانة للأمانة العلمية.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-4ap-modesty-honesty-cheating-waste', contentAr: 'عرض عليك زميل جواب الفرض. ماذا تردّ؟', solutionAr: 'أرفض وأعتمد على مراجعتي؛ الغش ظلم.' },
  }),

  // ——— 4AP CIVICS ———
  hw({
    id: 'homework-4ap-civics-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 1 — الملك والسلامة المرورية (السنة الرابعة)',
    relatedLessonIds: ['civics-4ap-public-private-property', 'civics-4ap-road-safety'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-public-private-property', contentAr: 'حديقة البلدية ملك لمن؟', solutionAr: 'ملك عام / للجميع عبر البلدية.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-road-safety', contentAr: 'ماذا يعني الضوء الأحمر للراجل؟', solutionAr: 'قف / لا تعبر.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-4ap-road-safety', contentAr: 'تعبر مع جدك طريقاً بلا ممر. ما القاعدة؟', solutionAr: 'ننظر يساراً ثم يميناً، نعبر بسرعة دون جري بين السيارات.' },
  }),
  hw({
    id: 'homework-4ap-civics-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — المؤسسات العمومية (السنة الرابعة)',
    relatedLessonIds: ['civics-4ap-public-institutions'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-public-institutions', contentAr: 'أين نذهب للتلقيح غالباً؟', solutionAr: 'العيادة / المركز الصحي / المستشفى.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-public-institutions', contentAr: 'ما دور المدرسة كمؤسسة عمومية؟', solutionAr: 'التعليم والتربية للجميع.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-4ap-public-institutions', contentAr: 'ضاعت بطاقة هوية الأب. أي مؤسسة تساعد؟', solutionAr: 'البلدية / الدائرة (مصلحة الحالة المدنية).' },
  }),
  hw({
    id: 'homework-4ap-civics-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 3 — الهوية والرموز الوطنية (السنة الرابعة)',
    relatedLessonIds: ['civics-4ap-national-identity-symbols'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-national-identity-symbols', contentAr: 'ما عاصمة الجزائر؟', solutionAr: 'الجزائر (العاصمة).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-4ap-national-identity-symbols', contentAr: 'اذكر رمزاً وطنياً غير العلم.', solutionAr: 'النشيد قسماً، النجمة والهلال، شعار الدولة…' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-4ap-national-identity-symbols', contentAr: 'لماذا نحترم العلم في الملعب المدرسي؟', solutionAr: 'لأنه يرمز للوطن وللشهداء، واحترامه واجب مدني.' },
  }),

  // ——— 4AP FRENCH (grammaire) ———
  // Trimestre fields below shifted up by 1 (T1→T2, T2→T3) to make room for the migrated
  // beginner sequences above (see project_men_2026_2027_curriculum_change memory); IDs kept as-is.
  hw({
    id: 'homework-4ap-french-t1-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 1 — Présentation et maison (4AP)',
    relatedLessonIds: ['french-4ap-projet1-seq1-presentation-famille', 'french-4ap-projet1-seq2-maison-quartier'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet1-seq1-presentation-famille', contentAr: 'Complète : Je … Karim. (s’appeler)', solutionAr: 'm’appelle.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet1-seq2-maison-quartier', contentAr: 'Où dors-tu ? Dans la …', solutionAr: 'chambre.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-4ap-projet1-seq1-presentation-famille', contentAr: 'Présente ta famille en deux phrases (noms des personnes).', solutionAr: 'Exemple : J’habite avec papa, maman et ma sœur. Mon frère s’appelle Yanis.' },
  }),
  hw({
    id: 'homework-4ap-french-t2-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 2 — Fêtes et possessifs (4AP)',
    relatedLessonIds: ['french-4ap-projet2-seq1-anniversaire-fete', 'french-4ap-projet2-seq2-fetes-nationales-possessifs'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet2-seq1-anniversaire-fete', contentAr: 'On dit : Joyeux … ! (anniversaire)', solutionAr: 'anniversaire.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet2-seq2-fetes-nationales-possessifs', contentAr: 'Complète : C’est … cartable. (moi)', solutionAr: 'mon.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-4ap-projet2-seq2-fetes-nationales-possessifs', contentAr: 'Quelle fête nationale algérienne connais-tu ? Écris une phrase.', solutionAr: 'Exemple : Le 5 juillet, on fête l’indépendance. / Le 1er novembre.' },
  }),
  hw({
    id: 'homework-4ap-french-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'french',
    titleAr: 'Devoir 3 — Animaux et impératif (4AP)',
    relatedLessonIds: ['french-4ap-projet3-seq1-animaux-domestiques', 'french-4ap-projet3-seq2-environnement-imperatif'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet3-seq1-animaux-domestiques', contentAr: 'Le chat et le chien sont des animaux …', solutionAr: 'domestiques.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-4ap-projet3-seq2-environnement-imperatif', contentAr: 'À l’impératif : (ne pas) jeter les papiers par terre.', solutionAr: 'Ne jette pas les papiers par terre.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-4ap-projet3-seq2-environnement-imperatif', contentAr: 'Écris deux consignes pour garder la cour propre (impératif).', solutionAr: 'Exemple : Jette les papiers à la poubelle. Ferme le robinet.' },
  }),

  // ——— 4AP ENGLISH ———
  hw({
    id: 'homework-4ap-english-t1-2026',
    trimester: 1,
    grade: '4AP',
    subject: 'english',
    titleAr: 'Homework 1 — Family & classroom (4AP)',
    relatedLessonIds: ['english-4ap-unit1-family-friends', 'english-4ap-unit2-school-classroom'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit1-family-friends', contentAr: 'My father’s brother is my …', solutionAr: 'uncle.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit2-school-classroom', contentAr: 'Sit down. What is this? (a command at school)', solutionAr: 'A classroom instruction / Sit down is an order.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-4ap-unit2-school-classroom', contentAr: 'Name three things on your desk.', solutionAr: 'book, pencil, rubber / ruler / copybook.' },
  }),
  hw({
    id: 'homework-4ap-english-t2-2026',
    trimester: 2,
    grade: '4AP',
    subject: 'english',
    titleAr: 'Homework 2 — Meals & pets (4AP)',
    relatedLessonIds: ['english-4ap-unit4-food-meals', 'english-4ap-unit5-pets-animals'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit4-food-meals', contentAr: 'Breakfast is in the … (morning / evening)', solutionAr: 'morning.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit5-pets-animals', contentAr: 'A cat has got … (tails: one or two?)', solutionAr: 'one tail. / A cat has got a tail.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-4ap-unit4-food-meals', contentAr: 'Write: I like … for lunch. (an Algerian dish or fruit)', solutionAr: 'Exemple : I like couscous for lunch. / I like dates.' },
  }),
  hw({
    id: 'homework-4ap-english-t3-2026',
    trimester: 3,
    grade: '4AP',
    subject: 'english',
    titleAr: 'Homework 3 — Hobbies & routines (4AP)',
    relatedLessonIds: ['english-4ap-unit6-hobbies-games', 'english-4ap-unit6-daily-routines-review'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit6-hobbies-games', contentAr: 'I play football. Football is a …', solutionAr: 'hobby / sport / game.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-4ap-unit6-daily-routines-review', contentAr: 'I … my teeth in the morning. (brush)', solutionAr: 'brush.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-4ap-unit6-daily-routines-review', contentAr: 'Write two sentences about your day: I get up… I go to school…', solutionAr: 'Exemple : I get up at 7. I go to school at 8.' },
  }),

  // ——— 5AP ISLAMIC ———
  hw({
    id: 'homework-5ap-islamic-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 1 — الإيمان والملائكة (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-quran-fajr-ala', 'islamic-5ap-faith-allah-angels'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-faith-allah-angels', contentAr: 'اذكر اسم ملَكين ومهمة أحدهما.', solutionAr: 'جبريل للوحي، ميكائيل للرزق، إسرافيل للصور، ملك الموت… (اثنان).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-quran-fajr-ala', contentAr: 'سورة الأعلى تدعو إلى ماذا في مطلعها؟', solutionAr: 'تسبيح اسم ربك الأعلى / تنزيه الله.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-5ap-faith-allah-angels', contentAr: 'كيف يظهر الإيمان بالملائكة في سلوكك اليومي؟', solutionAr: 'أستحي من المعصية لأن الملائكة تكتب الأعمال، وأصدق بالغيب.' },
  }),
  hw({
    id: 'homework-5ap-islamic-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — الزكاة والتيمم (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-zakat-social-solidarity', 'islamic-5ap-worship-tayammum-khuffain'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-zakat-social-solidarity', contentAr: 'لمن تُعطى الزكاة من هؤلاء: فقير الحي — تاجر غني؟', solutionAr: 'للفقير لا للتاجر الغني.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-worship-tayammum-khuffain', contentAr: 'متى يجوز التيمم بدل الوضوء؟', solutionAr: 'عند فقد الماء أو الخوف من الضرر باستعماله.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-5ap-zakat-social-solidarity', contentAr: 'جمعت قسمك تبرعات للمسجد. كيف ترتبط بالزكاة والتكافل؟', solutionAr: 'عمل تكافلي يقرب معنى الزكاة: حق معلوم للفقير والتضامن.' },
  }),
  hw({
    id: 'homework-5ap-islamic-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'islamic',
    titleAr: 'فرض منزلي 3 — الحج والأمانة (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-hajj-and-umrah', 'islamic-5ap-ethics-amana-selfcontrol-environment'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-hajj-and-umrah', contentAr: 'ما الفرق الأساسي بين الحج والعمرة؟', solutionAr: 'الحج ركن في أشهر معلومة؛ العمرة تطوع في أي وقت (غالباً).' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'islamic-5ap-ethics-amana-selfcontrol-environment', contentAr: 'وجدت هاتفاً في الساحة. ما حكم الأمانة؟', solutionAr: 'أسلّمه للإدارة ولا أخفيه.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'islamic-5ap-ethics-amana-selfcontrol-environment', contentAr: 'كيف تحمي نعمة الماء في المدرسة؟', solutionAr: 'أغلق الحنفية، لا أُسرف في الوضوء، أنبّه زملائي.' },
  }),

  // ——— 5AP CIVICS ———
  hw({
    id: 'homework-5ap-civics-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 1 — الرموز وحقوق الطفل (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-national-symbols', 'civics-5ap-child-rights'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-national-symbols', contentAr: 'اذكر رمزين للدولة الجزائرية.', solutionAr: 'العلم، النشيد قسماً، ختم الدولة…' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-child-rights', contentAr: 'اذكر حقّين من حقوق الطفل.', solutionAr: 'التعليم، الصحة، الحماية، اللعب، الهوية…' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-5ap-child-rights', contentAr: 'طفل يُجبر على العمل بدل المدرسة. أي حقّ انتُهك؟ وماذا تفعل؟', solutionAr: 'حق التعليم. أخبر راشداً موثوقاً / إدارة المدرسة.' },
  }),
  hw({
    id: 'homework-5ap-civics-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — الخدمات والبريد (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-public-services-edu-health', 'civics-5ap-algerie-poste'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-public-services-edu-health', contentAr: 'ما الفرق بين المدرسة والمستشفى كخدمتين عموميتين؟', solutionAr: 'المدرسة للتعليم، المستشفى للعلاج والصحة.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-algerie-poste', contentAr: 'لماذا نكتب الرمز البريدي على الظرف؟', solutionAr: 'ليصل الإرسال إلى البلدية الصحيحة بسرعة.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-5ap-algerie-poste', contentAr: 'تريد إرسال بطاقة لجدك في ولاية أخرى. اذكر خطوتين.', solutionAr: 'أكتب العنوان والرمز البريدي وألصق الطابع في مكتب البريد.' },
  }),
  hw({
    id: 'homework-5ap-civics-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'civics',
    titleAr: 'فرض منزلي 3 — الإنترنت والملك العام (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-internet-safety', 'civics-5ap-public-property-environment'],
    exercises: [
      { titleAr: 'التمرين الأول (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-internet-safety', contentAr: 'لماذا لا نشارك كلمة السر مع زميل؟', solutionAr: 'لحماية الحساب والخصوصية ومنع الانتحال.' },
      { titleAr: 'التمرين الثاني (3 نقاط)', points: 3, relatedLessonId: 'civics-5ap-public-property-environment', contentAr: 'كسر مقعد في الحديقة العامة: على من الضرر؟', solutionAr: 'على الجميع لأن المقعد ملك عام.' },
    ],
    problem: { titleAr: 'وضعية قصيرة (4 نقاط)', points: 4, relatedLessonId: 'civics-5ap-internet-safety', contentAr: 'طلب منك شخص على النت صورتك ومدرستك. ماذا تفعل؟', solutionAr: 'لا أرسل شيئاً وأخبر ولي الأمر أو معلماً.' },
  }),

  // ——— 5AP FRENCH ———
  hw({
    id: 'homework-5ap-french-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'french',
    titleAr: 'Devoir 1 — Monde animal (5AP)',
    relatedLessonIds: ['french-5ap-projet1-monde-animal'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet1-monde-animal', contentAr: 'Le fennec vit surtout dans le … (désert / mer)', solutionAr: 'désert.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet1-monde-animal', contentAr: 'Mets au passé composé : Le lion (chasser) la gazelle.', solutionAr: 'Le lion a chassé la gazelle.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-5ap-projet1-monde-animal', contentAr: 'Écris 3 phrases sur un animal d’Algérie (où il vit, ce qu’il mange).', solutionAr: 'Exemple : Le fennec vit dans le Sahara. Il mange des insectes. Il a de grandes oreilles.' },
  }),
  hw({
    id: 'homework-5ap-french-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'french',
    titleAr: 'Devoir 2 — Catastrophes et secours (5AP)',
    relatedLessonIds: ['french-5ap-projet2-catastrophes-secours'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet2-catastrophes-secours', contentAr: 'En cas de séisme à l’école, on se met sous un …', solutionAr: 'bureau / table solide.' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet2-catastrophes-secours', contentAr: 'Complète au futur : Les pompiers … (arriver) vite.', solutionAr: 'arriveront.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-5ap-projet2-catastrophes-secours', contentAr: 'Écris une consigne de sécurité en 2 phrases (inondation ou feu).', solutionAr: 'Exemple : En cas d’incendie, on ne prend pas l’ascenseur. On suit le maître vers la sortie.' },
  }),
  hw({
    id: 'homework-5ap-french-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'french',
    titleAr: 'Devoir 3 — Patrimoine et écologie (5AP)',
    relatedLessonIds: ['french-5ap-projet3-visites-patrimoine', 'french-5ap-projet3-inventions-ecologie'],
    exercises: [
      { titleAr: 'Exercice 1 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet3-visites-patrimoine', contentAr: 'Cite un lieu du patrimoine algérien (ville ou monument).', solutionAr: 'Casbah d’Alger, Timgad, Tassili, Djemila…' },
      { titleAr: 'Exercice 2 (3 pts)', points: 3, relatedLessonId: 'french-5ap-projet3-inventions-ecologie', contentAr: 'Pourquoi recycle-t-on le plastique ?', solutionAr: 'Pour moins polluer et réutiliser la matière.' },
    ],
    problem: { titleAr: 'Situation courte (4 pts)', points: 4, relatedLessonId: 'french-5ap-projet3-inventions-ecologie', contentAr: 'Propose une action écologique pour ta classe (2 phrases).', solutionAr: 'Exemple : Nous trions le papier. Nous éteignons la lumière en sortant.' },
  }),

  // ——— 5AP ENGLISH ———
  hw({
    id: 'homework-5ap-english-t1-2026',
    trimester: 1,
    grade: '5AP',
    subject: 'english',
    titleAr: 'Homework 1 — School & family (5AP)',
    relatedLessonIds: ['english-5ap-unit1-school-family'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit1-school-family', contentAr: 'There are 26 letters in the English …', solutionAr: 'alphabet.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit1-school-family', contentAr: 'My mother’s sister is my …', solutionAr: 'aunt.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-5ap-unit1-school-family', contentAr: 'Write 2 sentences: I live in … My school is in … (a wilaya).', solutionAr: 'Exemple : I live in Oran. My school is in Oran.' },
  }),
  hw({
    id: 'homework-5ap-english-t2-2026',
    trimester: 2,
    grade: '5AP',
    subject: 'english',
    titleAr: 'Homework 2 — Jobs (5AP)',
    relatedLessonIds: ['english-5ap-unit2-occupations-workplaces'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit2-occupations-workplaces', contentAr: 'A doctor works in a …', solutionAr: 'hospital / clinic.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit2-occupations-workplaces', contentAr: 'What does a teacher do?', solutionAr: 'A teacher teaches (pupils / at school).' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-5ap-unit2-occupations-workplaces', contentAr: 'Write: I want to be a … because …', solutionAr: 'Exemple : I want to be a doctor because I help people.' },
  }),
  hw({
    id: 'homework-5ap-english-t3-2026',
    trimester: 3,
    grade: '5AP',
    subject: 'english',
    titleAr: 'Homework 3 — Holidays & future (5AP)',
    relatedLessonIds: ['english-5ap-unit5-travel-transport-holidays', 'english-5ap-unit8-will-going-to'],
    exercises: [
      { titleAr: 'Exercise 1 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit5-travel-transport-holidays', contentAr: 'We go to Algiers by … (train / spoon)', solutionAr: 'train.' },
      { titleAr: 'Exercise 2 (3 pts)', points: 3, relatedLessonId: 'english-5ap-unit8-will-going-to', contentAr: 'Tomorrow I … visit Tlemcen. (going to)', solutionAr: 'am going to.' },
    ],
    problem: { titleAr: 'Short task (4 pts)', points: 4, relatedLessonId: 'english-5ap-unit8-will-going-to', contentAr: 'Write two holiday plans with going to.', solutionAr: 'Exemple : I am going to visit Bejaia. I am going to swim.' },
  }),
];
