import type { JourneyWorld, JourneyWorldId, LocalizedText } from './journeyWorlds';

/**
 * Didou's maps for 2AP → 5AP. A child spends a whole school year in one grade, so each grade has
 * its own map and its own progress — there is no travel between years. The eight Algerian places
 * (and their scenery, vehicle, medal) are the same as in 1AP; what changes is the theme of each
 * world, Didou's welcome and the three real lessons of that grade, in the order of the trimesters:
 * worlds 1–3 ≈ trimester 1, worlds 4–6 ≈ trimester 2, worlds 7–8 ≈ trimester 3.
 */
type Place = Pick<JourneyWorld, 'id' | 'name' | 'vehicle' | 'badge' | 'medalColor' | 'ys'>;

export function gradeWorlds(
  places: readonly JourneyWorld[],
  plan: { id: JourneyWorldId; subtitle: LocalizedText; welcome: LocalizedText; lessonIds: readonly [string, string, string] }[],
): readonly JourneyWorld[] {
  const byId = new Map<JourneyWorldId, Place>(places.map((p) => [p.id, p]));
  return plan.map((w) => {
    const place = byId.get(w.id);
    if (!place) throw new Error(`Unknown journey place ${w.id}`);
    return { ...place, subtitle: w.subtitle, welcome: w.welcome, lessonIds: w.lessonIds };
  });
}

export const PLAN_2AP = [
  {
    id: 'sahara' as const,
    subtitle: { ar: 'عالم الأعداد حتى 49', fr: "Le monde des nombres jusqu'à 49" },
    welcome: { ar: 'مرحباً بك في الصحراء يا بطل! في السنة الثانية نعدّ حتى 49، ونجمع الأعداد عمودياً', fr: "Bienvenue au Sahara, champion ! En 2AP, on compte jusqu'à 49 et on pose les additions." },
    lessonIds: ['math-2ap-t1-spatial-position', 'math-2ap-t1-numbers-0-49', 'math-2ap-t1-addition-no-carry'] as const,
  },
  {
    id: 'casbah' as const,
    subtitle: { ar: 'عالم المدرسة والشدّة', fr: "Le monde de l'école et de la chadda" },
    welcome: { ar: 'في أزقّة القصبة نقرأ نصوصاً عن المدرسة، ونتعلّم الشدّة ورموز وطننا', fr: "Dans les ruelles de la Casbah, on lit des textes sur l'école, on apprend la chadda et les symboles du pays." },
    lessonIds: ['arabic-2ap-t1-reading-school', 'arabic-2ap-t1-shadda', 'civics-2ap-t1-national-symbols'] as const,
  },
  {
    id: 'sea' as const,
    subtitle: { ar: 'عالم الماء والنظافة', fr: "Le monde de l'eau et de la propreté" },
    welcome: { ar: 'هيا إلى البحر! بالماء نتوضأ ونحافظ على نظافة أجسامنا، ونتعلّم المدّ والتنوين', fr: "En route vers la mer ! Avec l'eau on fait les ablutions et on prend soin du corps, et on apprend le madd et le tanwin." },
    lessonIds: ['islamic-2ap-t1-wudu-steps', 'science-2ap-t1-hygiene-body-care', 'arabic-2ap-t1-madd-tanween'] as const,
  },
  {
    id: 'constantine' as const,
    subtitle: { ar: 'جسور الأعداد حتى 99', fr: "Les ponts des nombres jusqu'à 99" },
    welcome: { ar: 'على جسور قسنطينة نعبر إلى الأعداد حتى 99، ونجمع بالاحتفاظ', fr: "Sur les ponts de Constantine, on passe aux nombres jusqu'à 99 et à l'addition avec retenue." },
    lessonIds: ['math-2ap-t2-numbers-50-99', 'math-2ap-t2-number-framing', 'math-2ap-t2-addition-with-carry'] as const,
  },
  {
    id: 'djurdjura' as const,
    subtitle: { ar: 'عالم النباتات والحيوانات', fr: 'Le monde des plantes et des animaux' },
    welcome: { ar: 'في جبال جرجرة نكتشف النباتات من حولنا والحيوانات الأليفة والبرية', fr: 'Dans le Djurdjura, on découvre les plantes autour de nous, les animaux domestiques et sauvages.' },
    lessonIds: ['science-2ap-t2-plants-around-us', 'science-2ap-t2-domestic-wild-animals', 'arabic-2ap-t2-reading-neighborhood'] as const,
  },
  {
    id: 'timgad' as const,
    subtitle: { ar: 'عالم الأشكال والمئات', fr: 'Le monde des formes et des centaines' },
    welcome: { ar: 'بين أعمدة تيمقاد نتعرّف على الأشكال، ونصل إلى المئات، ونميّز اللام الشمسية والقمرية', fr: "Entre les colonnes de Timgad, on reconnaît les formes, on atteint les centaines et on distingue le lam solaire et lunaire." },
    lessonIds: ['math-2ap-t2-shapes', 'math-2ap-t2-numbers-100-999', 'arabic-2ap-t2-lam-shamsiya-qamariya'] as const,
  },
  {
    id: 'tassili' as const,
    subtitle: { ar: 'عالم الكلمات', fr: 'Le monde des mots' },
    welcome: { ar: 'على صخور الطاسيلي نقرأ الكلمات: نميّز الاسم والفعل والحرف، والمذكّر والمؤنّث', fr: "Sur les rochers du Tassili, on lit les mots : nom, verbe ou lettre, masculin ou féminin." },
    lessonIds: ['arabic-2ap-t3-ism-fil-harf', 'arabic-2ap-t3-taa-marbouta-maftouha', 'arabic-2ap-t3-gender-number'] as const,
  },
  {
    id: 'space' as const,
    subtitle: { ar: 'الضرب والساعة والدينار', fr: "La multiplication, l'heure et le dinar" },
    welcome: { ar: 'انطلق الصاروخ! في الفضاء نتعلّم الضرب، ونقرأ الساعة، ونشتري بالدينار', fr: "Décollage ! Dans l'espace, on apprend la multiplication, on lit l'heure et on achète en dinars." },
    lessonIds: ['math-2ap-t3-multiplication-concept', 'math-2ap-t3-clock-reading', 'math-2ap-t3-currency-dzd'] as const,
  },
];

export const PLAN_3AP = [
  {
    id: 'sahara' as const,
    subtitle: { ar: 'عالم الأعداد حتى 999 والضرب', fr: "Les nombres jusqu'à 999 et la multiplication" },
    welcome: { ar: 'مرحباً بك في الصحراء! في السنة الثالثة نجمع ونطرح بالاحتفاظ، ونبدأ جداول الضرب', fr: 'Bienvenue au Sahara ! En 3AP, on additionne et soustrait avec retenue, et on commence les tables.' },
    lessonIds: ['math-3ap-t1-numbers-to-999', 'math-3ap-t1-addition-subtraction', 'math-3ap-t1-multiplication-intro'] as const,
  },
  {
    id: 'casbah' as const,
    subtitle: { ar: 'عالم الجمل والمعالم', fr: 'Le monde des phrases et des monuments' },
    welcome: { ar: 'في القصبة نبني الجملة الاسمية والفعلية، ونصرّف الأفعال، ونزور معالم وطننا', fr: 'Dans la Casbah, on construit des phrases, on conjugue et on visite les monuments du pays.' },
    lessonIds: ['arabic-3ap-t1-nominal-verbal-sentences', 'arabic-3ap-t1-conjugation-past-present', 'history-3ap-t1-national-landmarks'] as const,
  },
  {
    id: 'sea' as const,
    subtitle: { ar: 'عالم الجسم والزمن', fr: 'Le monde du corps et du temps' },
    welcome: { ar: 'على القارب نتنفّس هواء البحر: نكتشف التنفس ونبض القلب، والطهارة، وخطّ الزمن', fr: "En bateau, on respire l'air de la mer : la respiration, le cœur, la pureté, et la frise du temps." },
    lessonIds: ['science-3ap-u1-respiration-heartbeat', 'islamic-3ap-t1-pillars-purity-surahs', 'history-3ap-t1-time-eras-timeline'] as const,
  },
  {
    id: 'constantine' as const,
    subtitle: { ar: 'جسور الآلاف والقياس', fr: 'Les ponts des milliers et des mesures' },
    welcome: { ar: 'على جسور قسنطينة نصل إلى الآلاف، ونقيس الأطوال والكتل، ونرسم المستقيمات المتعامدة', fr: 'Sur les ponts de Constantine, on atteint les milliers, on mesure et on trace des droites perpendiculaires.' },
    lessonIds: ['math-3ap-t2-thousands-numbers', 'math-3ap-t2-units-length-mass', 'math-3ap-t2-perpendicular-lines'] as const,
  },
  {
    id: 'djurdjura' as const,
    subtitle: { ar: 'عالم النبات والحيوان', fr: 'Le monde des plantes et des animaux' },
    welcome: { ar: 'في جرجرة نزرع البذور ونتابع نموّها، ونكتشف كيف يتغذّى كلّ حيوان', fr: "Dans le Djurdjura, on sème des graines, on suit leur croissance et on découvre ce que mange chaque animal." },
    lessonIds: ['science-3ap-u2-plants-growth-germination', 'science-3ap-u2-water-transport-plant', 'science-3ap-u2-animals-diets-movement'] as const,
  },
  {
    id: 'timgad' as const,
    subtitle: { ar: 'عالم الزوايا والإضافة', fr: "Le monde des angles et de l'annexion" },
    welcome: { ar: 'بين أعمدة تيمقاد نكتشف الزاوية القائمة، والأعداد الكبيرة، والمركّب الإضافي', fr: "Entre les colonnes de Timgad : l'angle droit, les grands nombres et le complément du nom." },
    lessonIds: ['math-3ap-t2-right-angles', 'math-3ap-t2-tens-of-thousands', 'arabic-3ap-t2-idafa-construct'] as const,
  },
  {
    id: 'tassili' as const,
    subtitle: { ar: 'عالم الفاعل والسيرة', fr: 'Le monde du sujet et de la Sîra' },
    welcome: { ar: 'على صخور الطاسيلي نبحث عمّن قام بالفعل، ونطرح الأسئلة، ونتعرّف على سيرة نبيّنا ﷺ', fr: 'Sur les rochers du Tassili : qui fait l\'action ? On pose des questions et on découvre la vie du Prophète ﷺ.' },
    lessonIds: ['arabic-3ap-t3-subject-object', 'arabic-3ap-t3-question-tools', 'islamic-3ap-t3-ethics-sirah'] as const,
  },
  {
    id: 'space' as const,
    subtitle: { ar: 'القسمة والمجسّمات وتضاريس الجزائر', fr: "La division, les solides et le relief de l'Algérie" },
    welcome: { ar: 'من الصاروخ نرى الجزائر من فوق! نتعلّم القسمة بباقٍ، والمجسّمات، والتضاريس', fr: "Depuis la fusée, on voit l'Algérie d'en haut ! La division avec reste, les solides et le relief." },
    lessonIds: ['math-3ap-t3-division-remainder', 'math-3ap-t3-solids-nets', 'geo-3ap-t3-relief-climate'] as const,
  },
];

export const PLAN_4AP = [
  {
    id: 'sahara' as const,
    subtitle: { ar: 'عالم الأعداد حتى 100 000', fr: "Les nombres jusqu'à 100 000" },
    welcome: { ar: 'الصحراء واسعة كالأعداد الكبيرة! نقرأ الأعداد حتى 100 000 ونقارنها ونحسب بها', fr: "Le Sahara est grand comme les grands nombres ! On lit, compare et calcule jusqu'à 100 000." },
    lessonIds: ['math-4ap-numbers-under-100k', 'math-4ap-compare-order-100k', 'math-4ap-operations-addition-multiplication'] as const,
  },
  {
    id: 'casbah' as const,
    subtitle: { ar: 'عالم الإعراب ونوميديا', fr: "Le monde de l'analyse et de la Numidie" },
    welcome: { ar: 'في القصبة نُعرب الفاعل والمفعول به، ونعود إلى زمن مملكتي نوميديا', fr: 'Dans la Casbah, on analyse le sujet et le complément, et on remonte au temps des royaumes numides.' },
    lessonIds: ['arabic-4ap-parts-of-speech-sentences', 'arabic-4ap-fail-maf3ul-irab', 'history-4ap-numidia-syphax-gaia'] as const,
  },
  {
    id: 'sea' as const,
    subtitle: { ar: 'عالم الهضم والماء', fr: "Le monde de la digestion et de l'eau" },
    welcome: { ar: 'في رحلة القارب نتتبّع طريق الطعام في جسمنا، ونعرف حاجتنا إلى الماء، ونحفظ سورتي الضحى والشمس', fr: "En bateau, on suit le trajet des aliments, on comprend notre besoin d'eau et on apprend deux sourates." },
    lessonIds: ['science-4ap-digestion-nutrition', 'science-4ap-water-body-needs', 'islamic-4ap-quran-duha-shams'] as const,
  },
  {
    id: 'constantine' as const,
    subtitle: { ar: 'جسور القسمة والكسور', fr: 'Les ponts de la division et des fractions' },
    welcome: { ar: 'على جسور قسنطينة نقسم بالعدل، ونحوّل القياسات، ونكتشف الكسور', fr: 'Sur les ponts de Constantine, on partage, on convertit les mesures et on découvre les fractions.' },
    lessonIds: ['math-4ap-division-euclidean', 'math-4ap-measurements-lengths-masses-capacities', 'math-4ap-fractions'] as const,
  },
  {
    id: 'djurdjura' as const,
    subtitle: { ar: 'عالم الماء والتضاريس', fr: "Le monde de l'eau et du relief" },
    welcome: { ar: 'من قمم جرجرة نتابع دورة الماء، والأودية، وتضاريس الجزائر ومناخها', fr: "Depuis les sommets du Djurdjura, on suit le cycle de l'eau, les oueds, le relief et le climat." },
    lessonIds: ['science-4ap-water-cycle', 'science-4ap-algerian-rivers-nature', 'geo-4ap-relief-climate-algeria'] as const,
  },
  {
    id: 'timgad' as const,
    subtitle: { ar: 'عالم الصفة والخريطة', fr: "Le monde de l'adjectif et de la carte" },
    welcome: { ar: 'في تيمقاد نصف ما نراه بالصفة، ونستعمل الأسماء الموصولة، ونقرأ الخريطة ومفتاحها', fr: 'À Timgad, on décrit avec l\'adjectif, on utilise les relatifs et on lit une carte et sa légende.' },
    lessonIds: ['arabic-4ap-sifa-mawsuf', 'arabic-4ap-asma-mawsula', 'geo-4ap-map-and-legend'] as const,
  },
  {
    id: 'tassili' as const,
    subtitle: { ar: 'عالم الكتابة والحياة القديمة', fr: "Le monde de l'écriture et de la vie d'autrefois" },
    welcome: { ar: 'على صخور الطاسيلي نكتب الهمزة صحيحة، وننتج فقرتنا، ونكتشف الحياة اليومية في نوميديا', fr: "Sur les rochers du Tassili, on écrit la hamza juste, on rédige un paragraphe et on découvre la vie en Numidie." },
    lessonIds: ['arabic-4ap-hamza-mutawassita', 'arabic-4ap-written-production', 'history-4ap-numidia-daily-life'] as const,
  },
  {
    id: 'space' as const,
    subtitle: { ar: 'المحيط والتناسبية ودوران الأرض', fr: 'Le périmètre, la proportionnalité et la rotation de la Terre' },
    welcome: { ar: 'من الفضاء نرى الأرض تدور فيتعاقب الليل والنهار! ونحسب المحيط ونحلّ مسائل التناسب', fr: "Depuis l'espace, on voit la Terre tourner : jour et nuit ! On calcule des périmètres et des problèmes de proportionnalité." },
    lessonIds: ['math-4ap-perimeter-squares-rectangles', 'math-4ap-proportionally-time-data', 'science-4ap-earth-rotation-seasons-time'] as const,
  },
];

export const PLAN_5AP = [
  {
    id: 'sahara' as const,
    subtitle: { ar: 'عالم الأعداد الكبيرة وموقع الجزائر', fr: "Les grands nombres et la place de l'Algérie" },
    welcome: { ar: 'سنتك الأخيرة في الابتدائي تبدأ هنا! نقرأ الأعداد حتى المليار، ونحدّد موقع الجزائر أكبر بلد في إفريقيا', fr: "Ta dernière année du primaire commence ici ! Les nombres jusqu'au milliard, et l'Algérie, le plus grand pays d'Afrique." },
    lessonIds: ['math-5ap-large-numbers', 'math-5ap-operations', 'geo-5ap-location-importance'] as const,
  },
  {
    id: 'casbah' as const,
    subtitle: { ar: 'عالم الجملة ومراحل التاريخ', fr: "Le monde de la phrase et des époques de l'histoire" },
    welcome: { ar: 'في القصبة نكشف أسرار الجملة والمبني للمجهول، ونرتّب مراحل تاريخنا الأربع', fr: "Dans la Casbah, on perce les secrets de la phrase et du passif, et on range les quatre époques de notre histoire." },
    lessonIds: ['arabic-5ap-sentence-components', 'arabic-5ap-passive-voice', 'history-5ap-periods-landmarks'] as const,
  },
  {
    id: 'sea' as const,
    subtitle: { ar: 'عالم الهواء والفتح الإسلامي', fr: "Le monde de l'air et de la conquête islamique" },
    welcome: { ar: 'نبحر على خطى الفاتحين نحو القيروان، ونكتشف في الطريق التنفّس وخصائص الهواء', fr: "On navigue sur les traces des conquérants vers Kairouan, et on découvre la respiration et les propriétés de l'air." },
    lessonIds: ['science-5ap-respiration-health', 'science-5ap-air-properties', 'history-5ap-islamic-conquest'] as const,
  },
  {
    id: 'constantine' as const,
    subtitle: { ar: 'جسور القسمة والكسور والمدد', fr: 'Les ponts de la division, des fractions et des durées' },
    welcome: { ar: 'على جسور قسنطينة نقسم قسمة إقليدية، ونفهم الكسور، ونحسب مدّة الرحلة', fr: 'Sur les ponts de Constantine : la division euclidienne, les fractions et le calcul des durées.' },
    lessonIds: ['math-5ap-division', 'math-5ap-fractions', 'math-5ap-durations'] as const,
  },
  {
    id: 'djurdjura' as const,
    subtitle: { ar: 'عالم الكهرباء والنبات والتضاريس', fr: "Le monde de l'électricité, des plantes et du relief" },
    welcome: { ar: 'في جرجرة نركّب دارة كهربائية، ونكتشف تكاثر النباتات، والتضاريس والمناخ', fr: 'Dans le Djurdjura, on monte un circuit électrique, on découvre la reproduction des plantes, le relief et le climat.' },
    lessonIds: ['science-5ap-electric-circuit', 'science-5ap-plant-reproduction', 'geo-5ap-relief-climate-vegetation'] as const,
  },
  {
    id: 'timgad' as const,
    subtitle: { ar: 'عالم الإعراب المتقدّم', fr: "Le monde de l'analyse avancée" },
    welcome: { ar: 'بين أعمدة تيمقاد نُعرب النواسخ والمفاعيل والتمييز: نحو قويّ لامتحان نهاية الابتدائي', fr: "Entre les colonnes de Timgad : les nawasikh, les compléments et le tamyiz, une grammaire solide pour l'examen de fin de primaire." },
    lessonIds: ['arabic-5ap-kan-inna', 'arabic-5ap-maf3ul-types', 'arabic-5ap-tamyiz'] as const,
  },
  {
    id: 'tassili' as const,
    subtitle: { ar: 'ذاكرة المقاومة والثورة', fr: 'La mémoire de la résistance et de la Révolution' },
    welcome: { ar: 'على صخور الطاسيلي نحفظ ذاكرة شعبنا: المقاومات الشعبية وثورة نوفمبر المجيدة، ونتعلّم الحال', fr: "Sur les rochers du Tassili, on garde la mémoire du peuple : les résistances et la glorieuse Révolution de Novembre, et on apprend le hâl." },
    lessonIds: ['arabic-5ap-hal-five-names-verbs', 'history-5ap-french-colonization-popular-resistances', 'history-5ap-glorious-revolution-1954'] as const,
  },
  {
    id: 'space' as const,
    subtitle: { ar: 'الأعداد العشرية والنسب والمساحات', fr: 'Les décimaux, les pourcentages et les aires' },
    welcome: { ar: 'الصاروخ الأخير قبل المتوسّطة! نحسب بالأعداد العشرية والنسب المئوية والمساحات', fr: 'La dernière fusée avant le collège ! Les décimaux, les pourcentages et les aires.' },
    lessonIds: ['math-5ap-decimals', 'math-5ap-percentage-scale', 'math-5ap-perimeters-areas'] as const,
  },
];
