import { ExamExercise, OfficialExam } from '../../types';
import { DEVOIR_SOURCE_NOTE_AR } from '../examSourceNotes';

const note = DEVOIR_SOURCE_NOTE_AR;

/**
 * Second devoir (homework) per subject per trimester for 5AP, closing the audit gap where every
 * (grade, subject, trimester) had exactly 1 composition + 1 devoir instead of the target
 * 1 composition + 2 devoirs. Covers all 9 non-science 5AP subjects × 3 trimesters (27 papers).
 * Science already has 2 devoirs/trimester on 5AP and is intentionally left untouched here.
 * Original MSSID papers built from real catalog lessons — not aggregator PDFs.
 */
function hw(opts: {
  id: string;
  trimester: 1 | 2 | 3;
  subject: OfficialExam['subject'];
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
    grade: '5AP',
    durationMinutes: 25,
    totalPoints: 10,
    contentSource: 'complementary',
    sourceNoteAr: note,
    relatedLessonIds: opts.relatedLessonIds,
    exercises: opts.exercises,
    problemExercise: opts.problem,
  };
}

export const DEVOIR_EXTRA_5AP: OfficialExam[] = [
  // ═══════════════════════ ARABIC ═══════════════════════
  hw({
    id: 'homework-5ap-arabic-t1b-2026',
    trimester: 1,
    subject: 'arabic',
    titleAr: 'فرض منزلي 2 — المفعول المطلق والمفعول لأجله (السنة الخامسة)',
    relatedLessonIds: ['arabic-5ap-maf3ul-types', 'arabic-5ap-mutal-verbs-jazm-amr'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-maf3ul-types',
        contentAr: 'أضف مفعولاً مطلقاً يؤكد الفعل في: «انتصر الفريقُ ...» ثم أعربه.',
        solutionAr: 'انتصر الفريقُ انتصاراً. انتصاراً: مفعول مطلق منصوب وعلامة نصبه الفتحة الظاهرة.',
        irabTableAr: [
          { wordAr: 'انْتَصَرَ', analysisAr: 'فعل ماضٍ مبني على الفتح.' },
          { wordAr: 'الفَرِيقُ', analysisAr: 'فاعل مرفوع وعلامة رفعه الضمة الظاهرة.' },
          { wordAr: 'انْتِصَاراً', analysisAr: 'مفعول مطلق منصوب وعلامة نصبه الفتحة الظاهرة.' },
        ],
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-maf3ul-types',
        contentAr: 'بيّن المفعول لأجله في: «سَافَرَ خَالِدٌ طَلَباً لِلْعِلْمِ.» ثم بيّن السؤال الذي يجيب عنه.',
        solutionAr: 'طَلَباً: مفعول لأجله منصوب، يجيب عن سؤال «لماذا سافر خالد؟».',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'arabic-5ap-mutal-verbs-jazm-amr',
      contentAr: 'اجزم الفعل «يَسْعَى» بعد «لَمْ»، ثم ابنِ منه فعل الأمر.',
      solutionAr: 'لَمْ يَسْعَ (حُذفت الألف، وعلامة الجزم حذف حرف العلة). فعل الأمر: اِسْعَ (بحذف حرف العلة أيضاً).',
    },
  }),
  hw({
    id: 'homework-5ap-arabic-t2b-2026',
    trimester: 2,
    subject: 'arabic',
    titleAr: 'فرض منزلي 2 — التمييز والمثنى وجمع المذكر السالم (السنة الخامسة)',
    relatedLessonIds: ['arabic-5ap-tamyiz', 'arabic-5ap-muthanna-sound-plurals'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-tamyiz',
        contentAr: 'أزل الغموض بتمييز مناسب: «عِنْدِي ثَلَاثُونَ ...» (المقصود: أشجار).',
        solutionAr: 'عِنْدِي ثَلَاثُونَ شَجَرَةً. شَجَرَةً: تمييز ذات منصوب يوضح المعدود.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-muthanna-sound-plurals',
        contentAr: 'ثنّ كلمة «مُعَلِّمَةٌ» في حالة الرفع، ثم اجمعها جمع مؤنث سالماً.',
        solutionAr: 'المثنى: مُعَلِّمَتَانِ. الجمع: مُعَلِّمَاتٌ.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'arabic-5ap-muthanna-sound-plurals',
      contentAr: 'اكتب جملة فيها جمع مذكر سالم منصوب، ثم بيّن علامة نصبه.',
      solutionAr: 'مثال: رَأَيْتُ الفَلَّاحِينَ فِي الحَقْلِ. الفلاحينَ: جمع مذكر سالم منصوب وعلامة نصبه الياء.',
    },
  }),
  hw({
    id: 'homework-5ap-arabic-t3b-2026',
    trimester: 3,
    subject: 'arabic',
    titleAr: 'فرض منزلي 2 — جمع التكسير والألف اللينة (السنة الخامسة)',
    relatedLessonIds: ['arabic-5ap-jam-taksir', 'arabic-5ap-alif-layina'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-jam-taksir',
        contentAr: 'اجمع الكلمتين التاليتين جمع تكسير: قَلَمٌ — وَلَدٌ.',
        solutionAr: 'قَلَمٌ ← أَقْلَامٌ. وَلَدٌ ← أَوْلَادٌ.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'arabic-5ap-alif-layina',
        contentAr: 'اكتب الألف اللينة الصحيحة في الفعل «رَمَ..»، ثم تحقق بإسناده إلى «أنا».',
        solutionAr: '«رَمَى» (بالألف المقصورة)، لأن أصلها يظهر ياءً عند الإسناد: رَمَيْتُ.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'arabic-5ap-jam-taksir',
      contentAr: 'ميّز في الجملة: «قَرَأَ الرِّجَالُ كُتُباً مُفِيدَةً» بين جمعي التكسير، ثم أعرب كلمة «كُتُباً».',
      solutionAr: 'الرِّجَالُ وكُتُباً كلاهما جمع تكسير (تغيّرت صورة المفرد: رَجُل/كِتَاب).',
      irabTableAr: [{ wordAr: 'كُتُباً', analysisAr: 'مفعول به منصوب وعلامة نصبه الفتحة الظاهرة.' }],
    },
  }),

  // ═══════════════════════ MATH ═══════════════════════
  hw({
    id: 'homework-5ap-math-t1b-2026',
    trimester: 1,
    subject: 'math',
    titleAr: 'فرض منزلي 2 — قياس الأطوال وتصنيف الزوايا (السنة الخامسة)',
    relatedLessonIds: ['math-5ap-lengths-masses-capacities', 'math-5ap-lines-angles'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-lengths-masses-capacities',
        contentAr: 'حوّل: 4 km إلى m، ثم 250 cm إلى m.',
        solutionAr: '4 km = 4 000 m. 250 cm = 2.5 m.',
        operationsAr: '4 × 1000 = 4000\n250 ÷ 100 = 2.5',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-lines-angles',
        contentAr: 'صنّف هذه الزوايا حسب قياسها: 35° — 90° — 120°.',
        solutionAr: '35°: زاوية حادة. 90°: زاوية قائمة. 120°: زاوية منفرجة.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'math-5ap-lines-angles',
      contentAr: 'مستقيمان (D1) و(D2) كلاهما عمودي على نفس المستقيم (D3). ماذا تستنتج عن العلاقة بين (D1) و(D2)؟ فسّر إجابتك.',
      solutionAr: '(D1) و(D2) متوازيان، لأن مستقيمين عموديين على نفس المستقيم الثالث يكونان متوازيين حتماً.',
    },
  }),
  hw({
    id: 'homework-5ap-math-t2b-2026',
    trimester: 2,
    subject: 'math',
    titleAr: 'فرض منزلي 2 — الأشكال الهندسية والمدد الزمنية (السنة الخامسة)',
    relatedLessonIds: ['math-5ap-polygons-triangles', 'math-5ap-durations'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-polygons-triangles',
        contentAr: 'مثلث أضلاعه الثلاثة متقايسة. ما نوعه؟ وكم قياس كل زاوية فيه؟',
        solutionAr: 'مثلث متقايس الأضلاع، وقياس كل زاوية فيه 60° (لأن 180° ÷ 3 = 60°).',
        operationsAr: '180 ÷ 3 = 60',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-polygons-triangles',
        contentAr: 'ميّز بين المربع والمعين من خلال زواياهما.',
        solutionAr: 'المربع له أربعة أضلاع متقايسة وأربع زوايا قائمة. المعين له أربعة أضلاع متقايسة، ولا يُشترط أن تكون زواياه قائمة. إذا كانت زوايا المعين الأربع قائمة فهو مربع؛ فالمربع حالة خاصة من المعين.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'math-5ap-durations',
      contentAr: 'انطلق قطار من الجزائر العاصمة على الساعة 07h40min، ووصل البليدة على الساعة 08h25min. ما مدة الرحلة؟',
      solutionAr: 'من 07h40 إلى 08h25 = 45min. مدة الرحلة 45 دقيقة.',
    },
  }),
  hw({
    id: 'homework-5ap-math-t3b-2026',
    trimester: 3,
    subject: 'math',
    titleAr: 'فرض منزلي 2 — حجم المكعب والدائرة (السنة الخامسة)',
    relatedLessonIds: ['math-5ap-symmetry-solides', 'math-5ap-circle-radius'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-symmetry-solides',
        contentAr: 'صندوق مكعب طول ضلعه 3 cm، مملوء بمكعبات وحدة (1 cm³ لكل واحدة). كل طبقة أفقية فيها 3×3 مكعباً، والصندوق فيه 3 طبقات. كم مكعب وحدة يملأ الصندوق كله؟ (احسب بالعدّ طبقة بطبقة)',
        solutionAr: 'عدد مكعبات الطبقة الواحدة = 3×3 = 9. عدد الطبقات = 3. المجموع = 9 × 3 = 27 مكعب وحدة، أي الحجم = 27 cm³.',
        operationsAr: ' 3\n× 3\n---\n 9\n\n 9\n× 3\n---\n27',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'math-5ap-circle-radius',
        contentAr: 'شعاع دائرة سلة كرة السلة يساوي 23 cm تقريباً. ما طول قطرها؟',
        solutionAr: 'القطر = 2 × الشعاع = 2 × 23 = 46 cm.',
        operationsAr: ' 23\n×  2\n----\n 46',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'math-5ap-symmetry-solides',
      contentAr: 'صندوق هدية على شكل مكعب طول ضلعه 2 cm. احسب حجمه بعدّ مكعبات الوحدة طبقة بطبقة (وليس بتطبيق الصيغة مباشرة)، ثم تحقق أن نتيجتك تساوي الضلع مضروباً في نفسه ثلاث مرات.',
      solutionAr: 'كل طبقة فيها 2×2 = 4 مكعبات وحدة. عدد الطبقات = 2. المجموع = 4 × 2 = 8 مكعبات وحدة، أي الحجم = 8 cm³. وبالفعل 2×2×2 = 8، فالصيغة اختصار للعدّ وليست قاعدة تُحفظ فقط.',
    },
  }),

  // ═══════════════════════ FRENCH ═══════════════════════
  hw({
    id: 'homework-5ap-french-t1b-2026',
    trimester: 1,
    subject: 'french',
    titleAr: 'Devoir 2 — Le monde animal : GNS/GV et adjectifs (5AP)',
    relatedLessonIds: ['french-5ap-projet1-monde-animal'],
    exercises: [
      {
        titleAr: 'Exercice 1 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet1-monde-animal',
        contentAr: 'Souligne le GNS dans la phrase : « Le fennec creuse un terrier dans le sable. »',
        solutionAr: 'Le GNS est « Le fennec ».',
      },
      {
        titleAr: 'Exercice 2 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet1-monde-animal',
        contentAr: "Accorde l'adjectif au féminin pluriel : « La gazelle est rapide. » → « Les gazelles sont ......... »",
        solutionAr: '« Les gazelles sont rapides. »',
      },
    ],
    problem: {
      titleAr: 'Situation courte (4 pts)',
      points: 4,
      relatedLessonId: 'french-5ap-projet1-monde-animal',
      contentAr: 'Conjugue « avoir » au présent avec « il », puis complète : « Le chameau ... deux bosses. »',
      solutionAr: '« Le chameau a deux bosses. » (avoir → il a)',
    },
  }),
  hw({
    id: 'homework-5ap-french-t2b-2026',
    trimester: 2,
    subject: 'french',
    titleAr: "Devoir 2 — L'imparfait et la voix passive (5AP)",
    relatedLessonIds: ['french-5ap-projet2-imparfait', 'french-5ap-projet2-voix-passive'],
    exercises: [
      {
        titleAr: 'Exercice 1 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet2-imparfait',
        contentAr: "Conjugue « dormir » à l'imparfait avec « nous » : Nous ...... quand l'alerte a sonné.",
        solutionAr: "« Nous dormions quand l'alerte a sonné. »",
      },
      {
        titleAr: 'Exercice 2 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet2-voix-passive',
        contentAr: 'Transforme à la voix passive : « Les secouristes ont sauvé la famille. »',
        solutionAr: '« La famille a été sauvée par les secouristes. »',
      },
    ],
    problem: {
      titleAr: 'Situation courte (4 pts)',
      points: 4,
      relatedLessonId: 'french-5ap-projet2-imparfait',
      contentAr: "Décris en 2 phrases la situation avant une inondation, en utilisant l'imparfait (le ciel, la rivière...).",
      solutionAr: 'Exemple : Le ciel était gris. La rivière montait doucement.',
    },
  }),
  hw({
    id: 'homework-5ap-french-t3b-2026',
    trimester: 3,
    subject: 'french',
    titleAr: 'Devoir 2 — Les articulateurs chronologiques (5AP)',
    relatedLessonIds: ['french-5ap-projet3-connecteurs-chronologiques'],
    exercises: [
      {
        titleAr: 'Exercice 1 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet3-connecteurs-chronologiques',
        contentAr: "Quel articulateur marque toujours la fin d'un récit ?",
        solutionAr: '« Enfin ».',
      },
      {
        titleAr: 'Exercice 2 (3 pts)',
        points: 3,
        relatedLessonId: 'french-5ap-projet3-connecteurs-chronologiques',
        contentAr: "Complète avec les articulateurs qui manquent : « ......, nous sommes arrivés au musée. ......, nous avons visité les salles. »",
        solutionAr: "« D'abord, nous sommes arrivés au musée. Ensuite (ou Puis), nous avons visité les salles. »",
      },
    ],
    problem: {
      titleAr: 'Situation courte (4 pts)',
      points: 4,
      relatedLessonId: 'french-5ap-projet3-connecteurs-chronologiques',
      contentAr: "Raconte en 3 phrases une visite (école, musée, ferme...) en utilisant d'abord, ensuite, enfin.",
      solutionAr: "Exemple : D'abord, nous sommes montés dans le bus. Ensuite, nous avons visité la ferme. Enfin, nous sommes rentrés à l'école.",
    },
  }),

  // ═══════════════════════ ENGLISH ═══════════════════════
  hw({
    id: 'homework-5ap-english-t1b-2026',
    trimester: 1,
    subject: 'english',
    titleAr: 'Homework 2 — To Be, To Have & possessive adjectives (5AP)',
    relatedLessonIds: ['english-5ap-unit1-school-family'],
    exercises: [
      {
        titleAr: 'Exercise 1 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit1-school-family',
        contentAr: 'Complete with is/are: My parents ___ at home. My sister ___ ten years old.',
        solutionAr: 'are / is.',
      },
      {
        titleAr: 'Exercise 2 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit1-school-family',
        contentAr: 'Complete with have/has: My grandfather ___ a big garden. I ___ two cousins.',
        solutionAr: 'has / have.',
      },
    ],
    problem: {
      titleAr: 'Short task (4 pts)',
      points: 4,
      relatedLessonId: 'english-5ap-unit1-school-family',
      contentAr: 'Write 2 sentences about your family using possessive adjectives (my, his, her).',
      solutionAr: 'Example: My grandmother is kind. Her name is Amina.',
    },
  }),
  hw({
    id: 'homework-5ap-english-t2b-2026',
    trimester: 2,
    subject: 'english',
    titleAr: 'Homework 2 — Where/What questions & articles (5AP)',
    relatedLessonIds: ['english-5ap-unit2-occupations-workplaces'],
    exercises: [
      {
        titleAr: 'Exercise 1 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit2-occupations-workplaces',
        contentAr: 'Write the correct article: My uncle is ___ engineer. He works at ___ farm.',
        solutionAr: 'an / a.',
      },
      {
        titleAr: 'Exercise 2 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit2-occupations-workplaces',
        contentAr: 'Complete the question to ask about the place: ___ does a baker work?',
        solutionAr: 'Where.',
      },
    ],
    problem: {
      titleAr: 'Short task (4 pts)',
      points: 4,
      relatedLessonId: 'english-5ap-unit2-occupations-workplaces',
      contentAr: 'Write a question with "What does...do?" and its answer, about a policeman.',
      solutionAr: 'Example: What does a policeman do? He protects people.',
    },
  }),
  hw({
    id: 'homework-5ap-english-t3b-2026',
    trimester: 3,
    subject: 'english',
    titleAr: 'Homework 2 — Health advice & simple past (5AP)',
    relatedLessonIds: ['english-5ap-unit4-food-health-shopping', 'english-5ap-unit7-simple-past'],
    exercises: [
      {
        titleAr: 'Exercise 1 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit4-food-health-shopping',
        contentAr: 'Give advice with should/shouldn\'t: My friend has a toothache. He ___ eat sweets.',
        solutionAr: "shouldn't.",
      },
      {
        titleAr: 'Exercise 2 (3 pts)',
        points: 3,
        relatedLessonId: 'english-5ap-unit7-simple-past',
        contentAr: 'Put the verb in the simple past: Yesterday, I ___ (eat) couscous with my family.',
        solutionAr: 'ate.',
      },
    ],
    problem: {
      titleAr: 'Short task (4 pts)',
      points: 4,
      relatedLessonId: 'english-5ap-unit7-simple-past',
      contentAr: 'Write two sentences about what you did yesterday, using one regular and one irregular verb.',
      solutionAr: 'Example: I played football. I saw my cousin.',
    },
  }),

  // ═══════════════════════ ISLAMIC ═══════════════════════
  hw({
    id: 'homework-5ap-islamic-t1b-2026',
    trimester: 1,
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — الإيثار وسورتا القدر والبينة (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-ethics-altruism-cooperation', 'islamic-5ap-quran-qadr-bayyinah'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-ethics-altruism-cooperation',
        contentAr: 'ما معنى «الإيثار»؟ اذكر مثالاً من حياتك اليومية.',
        solutionAr: 'الإيثار: تقديم الغير على نفسك في أمر تحبه. مثال: أُعطي زميلي حصتي من الطعام وهو محتاج.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-quran-qadr-bayyinah',
        contentAr: 'ما الليلة التي تحدثت عنها سورة القدر؟ وما فضلها؟',
        solutionAr: 'ليلة القدر، وهي خير من ألف شهر.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'islamic-5ap-ethics-altruism-cooperation',
      contentAr: 'رأى أنيس زميله لا يملك أدوات مدرسية كافية. كيف يطبق قيمة الإيثار والتعاون؟',
      solutionAr: 'يشاركه بعض أدواته أو يساعده على تدبيرها دون انتظار مقابل؛ هذا تعاون على البر.',
    },
  }),
  hw({
    id: 'homework-5ap-islamic-t2b-2026',
    trimester: 2,
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — سورتا التين والزلزلة وحديث الإتقان (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-quran-tin-zalzalah', 'islamic-5ap-hadith-honesty-work-solidarity'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-quran-tin-zalzalah',
        contentAr: 'بأي صفة كرّم الله الإنسان في سورة التين؟',
        solutionAr: 'خلقه في «أحسن تقويم».',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-hadith-honesty-work-solidarity',
        contentAr: 'ماذا يعلمنا الحديث الشريف عن إتقان العمل؟',
        solutionAr: 'يحب الله من العامل إذا عمل عملاً أن يُتقنه.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'islamic-5ap-quran-tin-zalzalah',
      contentAr: 'ماذا تفهم من أن سورة الزلزلة تخبر أن من يعمل مثقال ذرة خيراً أو شراً يراه؟ وكيف يؤثر هذا في تصرفاتك؟',
      solutionAr: 'كل عمل، ولو صغيراً، محسوب يوم القيامة؛ فأحرص على فعل الخير ولو كان بسيطاً، وأتجنب الإساءة ولو كانت صغيرة.',
    },
  }),
  hw({
    id: 'homework-5ap-islamic-t3b-2026',
    trimester: 3,
    subject: 'islamic',
    titleAr: 'فرض منزلي 2 — الإيمان باليوم الآخر والخلفاء الراشدون (السنة الخامسة)',
    relatedLessonIds: ['islamic-5ap-faith-dayafter-destiny', 'islamic-5ap-sirah-rashidun-caliphs'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-faith-dayafter-destiny',
        contentAr: 'ماذا يعني الإيمان بالقدر خيره وشره؟',
        solutionAr: 'الرضا بقضاء الله وتقديره، سواء كان في ظاهره خيراً أم شراً، مع الأخذ بالأسباب.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'islamic-5ap-sirah-rashidun-caliphs',
        contentAr: 'من الخليفة الراشد الذي اشتهر بالعدل الشديد حتى مع نفسه؟',
        solutionAr: 'عمر بن الخطاب رضي الله عنه.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'islamic-5ap-faith-dayafter-destiny',
      contentAr: 'كيف يساعدك الإيمان باليوم الآخر على الصبر عند حدوث مصيبة؟',
      solutionAr: 'أعلم أن كل شيء محسوب وسأُجازى على صبري، فأصبر وأرضى بقضاء الله ولا أيأس.',
    },
  }),

  // ═══════════════════════ CIVICS ═══════════════════════
  hw({
    id: 'homework-5ap-civics-t1b-2026',
    trimester: 1,
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — الرموز الوطنية وحقوق الطفل (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-national-symbols', 'civics-5ap-child-rights'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-national-symbols',
        contentAr: 'من كتب كلمات النشيد الوطني «قسماً»؟ وماذا يرمز إليه؟',
        solutionAr: 'الشاعر الثوري مفدي زكرياء، ويرمز لنضال الشعب الجزائري من أجل الحرية.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-child-rights',
        contentAr: 'ما اسم الاتفاقية الدولية التي تضمن حقوق الطفل؟ اذكر حقاً منها غير التعليم.',
        solutionAr: 'الاتفاقية الدولية لحقوق الطفل (CIDE). مثال: الحق في الصحة، أو اللعب، أو الحماية من العنف.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'civics-5ap-national-symbols',
      contentAr: 'لماذا يُعتبر الدستور من رموز سيادة الدولة رغم أنه ليس علماً ولا نشيداً؟',
      solutionAr: 'لأنه القانون الأعلى الذي يحدد حقوق وواجبات كل مواطن وينظم سلطات الدولة، فهو أساس سيادتها القانونية.',
    },
  }),
  hw({
    id: 'homework-5ap-civics-t2b-2026',
    trimester: 2,
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — وسائل الإعلام والاتصال (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-media'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-media',
        contentAr: 'اذكر أنواع وسائل الإعلام الثلاثة.',
        solutionAr: 'الصحافة المكتوبة، الوسائط السمعية البصرية (الإذاعة والتلفزيون)، الإعلام الرقمي.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-media',
        contentAr: 'اذكر أدوار وسائل الإعلام الثلاثة.',
        solutionAr: 'الإعلام (الإخبار)، التثقيف، والترفيه.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'civics-5ap-media',
      contentAr: 'رأى صديقك خبراً مثيراً على شبكة اجتماعية بلا مصدر واضح، وأراد مشاركته فوراً. ما نصيحتك له؟',
      solutionAr: 'أنصحه بالتحقق من الخبر في مصدر إعلامي موثوق قبل مشاركته، لتجنب نشر معلومات خاطئة.',
    },
  }),
  hw({
    id: 'homework-5ap-civics-t3b-2026',
    trimester: 3,
    subject: 'civics',
    titleAr: 'فرض منزلي 2 — السلامة المرورية والتضامن (السنة الخامسة)',
    relatedLessonIds: ['civics-5ap-road-safety', 'civics-5ap-solidarity-volunteering'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-road-safety',
        contentAr: 'من أين يجب أن يعبر الراجل الطريق؟ ولماذا حتى لو بدا الطريق خالياً؟',
        solutionAr: 'من ممر الراجلين، لأن العبور من خارجه خطير حتى لو بدا الطريق خالياً من السيارات.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'civics-5ap-solidarity-volunteering',
        contentAr: 'ما معنى «التويزة» في التراث الجزائري؟',
        solutionAr: 'عمل جماعي تطوعي تقليدي جزائري لخدمة المصلحة المشتركة، مثل تنظيف الحي جماعياً.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'civics-5ap-road-safety',
      contentAr: 'صعد رجل مسن إلى الترامواي ولم يجد مقعداً شاغراً. ماذا يفعل تلميذ جالس؟ ولماذا؟',
      solutionAr: 'يقوم فوراً ويترك مقعده للرجل المسن؛ التنازل عن المقعد لكبار السن سلوك حضاري واجب في وسائل النقل العمومي.',
    },
  }),

  // ═══════════════════════ HISTORY_GEO ═══════════════════════
  hw({
    id: 'homework-5ap-historygeo-t1b-2026',
    trimester: 1,
    subject: 'history_geo',
    titleAr: 'فرض منزلي 2 — الفتح الإسلامي لشمال إفريقيا (السنة الخامسة)',
    relatedLessonIds: ['history-5ap-islamic-conquest'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'history-5ap-islamic-conquest',
        contentAr: 'من هو القائد الذي أسس مدينة القيروان؟ وفي أي سنة تقريباً؟',
        solutionAr: 'عقبة بن نافع، سنة 670م تقريباً.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'history-5ap-islamic-conquest',
        contentAr: 'اذكر اسم زعيمة أمازيغية قادت مقاومة قوية ضد الفتح الإسلامي.',
        solutionAr: 'الكاهنة (ديهيا).',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'history-5ap-islamic-conquest',
      contentAr: 'فسّر بجملتين كيف أصبحت الجزائر جزءاً من الحضارة العربية الإسلامية رغم مقاومة كسيلة والكاهنة في البداية.',
      solutionAr: 'بعد المقاومة، دخل الأمازيغ في الإسلام تدريجياً واعتنقوه، فأصبحت الجزائر جزءاً من العالم الإسلامي العربي إلى اليوم.',
    },
  }),
  hw({
    id: 'homework-5ap-historygeo-t2b-2026',
    trimester: 2,
    subject: 'history_geo',
    titleAr: 'فرض منزلي 2 — أقاليم الجزائر التضاريسية (السنة الخامسة)',
    relatedLessonIds: ['geo-5ap-relief-climate-vegetation'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'geo-5ap-relief-climate-vegetation',
        contentAr: 'ما اسم السلسلة الجبلية التي تحاذي الساحل الشمالي للجزائر؟',
        solutionAr: 'الأطلس التلي.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'geo-5ap-relief-climate-vegetation',
        contentAr: 'أين تقع الهضاب العليا بالنسبة للأطلس التلي والأطلس الصحراوي؟',
        solutionAr: 'تقع بينهما، وتُعتبر منطقة انتقالية شبه جافة.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'geo-5ap-relief-climate-vegetation',
      contentAr: 'فسّر لماذا يكون الغطاء النباتي في الشمال أكثف منه في الهضاب العليا.',
      solutionAr: 'لأن الشمال يتلقى أمطاراً أكثر ومناخه متوسطي معتدل، بينما الهضاب العليا شبه جافة وأمطارها أقل.',
    },
  }),
  hw({
    id: 'homework-5ap-historygeo-t3b-2026',
    trimester: 3,
    subject: 'history_geo',
    titleAr: 'فرض منزلي 2 — العهد العثماني وتوزيع السكان (السنة الخامسة)',
    relatedLessonIds: ['history-5ap-ottoman-era', 'geo-5ap-population-economy-hazards'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'history-5ap-ottoman-era',
        contentAr: 'كم عدد البايلكات التي نُظّمت إليها الجزائر في العهد العثماني؟ اذكر واحداً منها وعاصمته.',
        solutionAr: 'أربع بايلكات. مثال: بايلك الشرق وعاصمته قسنطينة.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'geo-5ap-population-economy-hazards',
        contentAr: 'أين يتركز معظم سكان الجزائر؟ ولماذا؟',
        solutionAr: 'في الشريط الساحلي والإقليم الشمالي، لاعتدال المناخ ووفرة العمل والماء.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'history-5ap-ottoman-era',
      contentAr: 'فسّر كيف أثّرت هزيمة معركة نافارين (1827م) على مستقبل الجزائر.',
      solutionAr: 'أضعفت الأسطول البحري الجزائري، مما سهّل على فرنسا غزو الجزائر بحراً بعد 3 سنوات فقط، سنة 1830م.',
    },
  }),

  // ═══════════════════════ TAMAZIGHT ═══════════════════════
  hw({
    id: 'homework-5ap-tamazight-t1b-2026',
    trimester: 1,
    subject: 'tamazight',
    titleAr: 'فرض منزلي 2 — الضمائر والتأنيث بالأمازيغية (السنة الخامسة)',
    relatedLessonIds: ['tamazight-5ap-taseddast-noms-verbes'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-taseddast-noms-verbes',
        contentAr: 'اكتب ضمير المتكلم المفرد (أنا) بالأمازيغية.',
        solutionAr: 'Nek.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-taseddast-noms-verbes',
        contentAr: 'حوّل « Aqcic » (ولد) إلى المؤنث.',
        solutionAr: 'Taqcict (بنت).',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'tamazight-5ap-taseddast-noms-verbes',
      contentAr: 'اكتب جملة قصيرة تبدأ بفعل ثم فاعل، وهو الترتيب الشائع في الجملة الأمازيغية الفعلية.',
      solutionAr: 'مثال: Yura wergaz (كتب الرجلُ) — فعل ثم فاعل.',
    },
  }),
  hw({
    id: 'homework-5ap-tamazight-t2b-2026',
    trimester: 2,
    subject: 'tamazight',
    titleAr: 'فرض منزلي 2 — حكايات جحا وابن آوى (السنة الخامسة)',
    relatedLessonIds: ['tamazight-5ap-tinfusin-djeha-uccen'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-tinfusin-djeha-uccen',
        contentAr: 'ماذا ترمز شخصية « Uccen » (ابن آوى) في الحكايات الشعبية؟',
        solutionAr: 'المكر والحيلة والطمع.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-tinfusin-djeha-uccen',
        contentAr: 'بأي عبارة تُختتم الحكاية التراثية الأمازيغية عادة؟',
        solutionAr: '« D tanfust-iw tefra... » (انتهت حكايتي).',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'tamazight-5ap-tinfusin-djeha-uccen',
      contentAr: 'ما العبرة الأخلاقية التي تستخلصها من قصة جحا وابن آوى؟',
      solutionAr: 'الحكمة والذكاء والعدل ينتصرون دائماً على المكر والطمع.',
    },
  }),
  hw({
    id: 'homework-5ap-tamazight-t3b-2026',
    trimester: 3,
    subject: 'tamazight',
    titleAr: 'فرض منزلي 2 — حيوانات الجزائر بالأمازيغية (السنة الخامسة)',
    relatedLessonIds: ['tamazight-5ap-agellid-tagant-environnement'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-agellid-tagant-environnement',
        contentAr: 'اكتب اسم « النسر » بالأمازيغية.',
        solutionAr: 'Igider.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'tamazight-5ap-agellid-tagant-environnement',
        contentAr: '« Izem » ترمز إلى أي صفة؟',
        solutionAr: 'الشجاعة والقوة (الأسد).',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'tamazight-5ap-agellid-tagant-environnement',
      contentAr: 'اقترح فعلاً واحداً لحماية غابات جبال جرجرة والأوراس من الحرائق.',
      solutionAr: 'مثال: عدم إشعال النار في الغابة، والتبليغ فوراً عن أي دخان أو حريق.',
    },
  }),

  // ═══════════════════════ ART ═══════════════════════
  hw({
    id: 'homework-5ap-art-t1b-2026',
    trimester: 1,
    subject: 'art',
    titleAr: 'فرض منزلي 2 — الألوان المتكاملة في التصميم (السنة الخامسة)',
    relatedLessonIds: ['art-5ap-t1-complementary-colors'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t1-complementary-colors',
        contentAr: 'ما اللون المتكامل للأصفر؟',
        solutionAr: 'البنفسجي.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t1-complementary-colors',
        contentAr: 'لماذا تُستعمل الألوان المتكاملة كثيراً في ملصقات الإشهار؟',
        solutionAr: 'لأنها تُنتج تبايناً بصرياً قوياً يجذب الانتباه بسرعة.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'art-5ap-t1-complementary-colors',
      contentAr: 'صمّم شعاراً بسيطاً بلونين متكاملين لناد رياضي مدرسي، واذكر اللونين المختارين.',
      solutionAr: 'مثال: شعار أصفر على خلفية بنفسجية — تباين قوي وواضح من بعيد.',
    },
  }),
  hw({
    id: 'homework-5ap-art-t2b-2026',
    trimester: 2,
    subject: 'art',
    titleAr: 'فرض منزلي 2 — نسب الوجه: الأذنان والمسافات (السنة الخامسة)',
    relatedLessonIds: ['art-5ap-t2-portrait-proportion'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t2-portrait-proportion',
        contentAr: 'بين أي خطين تقريباً تقع الأذنان في رسم الوجه؟',
        solutionAr: 'بين خط العينين وخط الأنف تقريباً (بنفس ارتفاعهما تقريباً).',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t2-portrait-proportion',
        contentAr: 'لماذا نرسم خطوطاً إرشادية خفيفة قبل البدء برسم الوجه؟',
        solutionAr: 'لتوزيع العينين والأنف والفم بنسب متوازنة قبل إضافة التفاصيل النهائية.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'art-5ap-t2-portrait-proportion',
      contentAr: 'ارسم بيضة الوجه وحدد بخط أفقي خفيف موضع الأذنين، ثم فسّر اختيارك.',
      solutionAr: 'الأذنان توضعان على ارتفاع يمتد تقريباً من خط العينين إلى خط الأنف، لتحقيق نسب واقعية للوجه.',
    },
  }),
  hw({
    id: 'homework-5ap-art-t3b-2026',
    trimester: 3,
    subject: 'art',
    titleAr: 'فرض منزلي 2 — رموز الجدارية التراثية (السنة الخامسة)',
    relatedLessonIds: ['art-5ap-t3-heritage-mural'],
    exercises: [
      {
        titleAr: 'التمرين الأول (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t3-heritage-mural',
        contentAr: 'اذكر رمزاً تراثياً جزائرياً غير العلم يصلح موضوعاً لجدارية (معلم أو زخرفة).',
        solutionAr: 'مثال: قصبة الجزائر، الزليج، النخيل، الفنك.',
      },
      {
        titleAr: 'التمرين الثاني (3 نقاط)',
        points: 3,
        relatedLessonId: 'art-5ap-t3-heritage-mural',
        contentAr: 'لماذا نوزّع المساحات بين المشاركين قبل البدء برسم جدارية جماعية؟',
        solutionAr: 'لتجنب التداخل والفوضى وضمان تناسق العمل النهائي.',
      },
    ],
    problem: {
      titleAr: 'وضعية قصيرة (4 نقاط)',
      points: 4,
      relatedLessonId: 'art-5ap-t3-heritage-mural',
      contentAr: 'اقترح جدارية مدرسية تجمع بين رمزين تراثيين مختلفين، وفسّر اختيارك بجملة واحدة.',
      solutionAr: 'مثال: النخيل وقصبة الجزائر معاً، لأنهما يمثلان الطبيعة والعمارة التراثية الجزائرية.',
    },
  }),
];
