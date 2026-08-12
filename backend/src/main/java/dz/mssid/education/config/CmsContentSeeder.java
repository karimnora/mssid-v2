package dz.mssid.education.config;

import dz.mssid.education.entity.CmsExamSpec;
import dz.mssid.education.entity.CmsExercise;
import dz.mssid.education.repository.CmsExamSpecRepository;
import dz.mssid.education.repository.CmsExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the CMS exam bank (cms_exams / cms_exercises) with the 12 grade-5AP trimester
 * compositions authored for the Exams/Challenges expansion (Math/Arabic/French/Science x T1-T3).
 * Idempotent: skips an exam (and its exercises) whose deterministic ID already exists, so this
 * is safe to run on every startup. Content mirrors frontend/src/data/examsData.ts exactly, so the
 * backend becomes a real source of truth for this content rather than a divergent copy.
 */
@Component
@RequiredArgsConstructor
public class CmsContentSeeder implements CommandLineRunner {

    private final CmsExamSpecRepository cmsExamSpecRepository;
    private final CmsExerciseRepository cmsExerciseRepository;

    private record ExerciseSpec(String titleAr, double points, String contentAr, String solutionAr) {
    }

    @Override
    public void run(String... args) {
        seedMathT1();
        seedMathT2();
        seedMathT3();
        seedArabicT1();
        seedArabicT2();
        seedArabicT3();
        seedFrenchT1();
        seedFrenchT2();
        seedFrenchT3();
        seedScienceT1();
        seedScienceT2();
        seedScienceT3();
    }

    private void seedExam(String examId, String subject, String titleAr, String sessionAr,
                           int durationMinutes, List<ExerciseSpec> exercises, ExerciseSpec integration) {
        if (cmsExamSpecRepository.existsById(examId)) {
            return;
        }

        List<String> exerciseIds = new ArrayList<>();
        int order = 1;
        for (ExerciseSpec spec : exercises) {
            String exerciseId = examId + "-ex" + order;
            saveExerciseIfAbsent(exerciseId, subject, "exam_exercise", spec);
            exerciseIds.add(exerciseId);
            order++;
        }
        String integrationId = examId + "-integration";
        saveExerciseIfAbsent(integrationId, subject, "situation_integration", integration);
        exerciseIds.add(integrationId);

        String now = LocalDateTime.now().toString();
        CmsExamSpec exam = CmsExamSpec.builder()
                .id(examId)
                .grade("5AP")
                .subject(subject)
                .year(2026)
                .sessionAr(sessionAr)
                .titleAr(titleAr)
                .durationMinutes(durationMinutes)
                .totalPoints(10)
                .passingScore(5)
                .exerciseIds(exerciseIds)
                .autoGradingEnabled(false)
                .workflowStatus("published")
                .authorName("Mssid DZ Content Team")
                .createdAt(now)
                .updatedAt(now)
                .build();
        cmsExamSpecRepository.save(exam);
    }

    private void saveExerciseIfAbsent(String id, String subject, String type, ExerciseSpec spec) {
        if (cmsExerciseRepository.existsById(id)) {
            return;
        }
        CmsExercise exercise = CmsExercise.builder()
                .id(id)
                .grade("5AP")
                .subject(subject)
                .titleAr(spec.titleAr())
                .type(type)
                .difficulty("medium")
                .estimatedMinutes(15)
                .pointsXp((int) Math.round(spec.points() * 10))
                .questionAr(spec.contentAr())
                .correctSolutionAr(spec.solutionAr())
                .workflowStatus("published")
                .updatedAt(LocalDateTime.now().toString())
                .build();
        cmsExerciseRepository.save(exercise);
    }

    // ==========================================
    // 🔢 MATHÉMATIQUES
    // ==========================================
    private void seedMathT1() {
        seedExam(
                "exam-5ap-math-t1-2026",
                "math",
                "اختبار الفصل الأول في الرياضيات - السنة الخامسة ابتدائي",
                "الفصل الأول 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "أ) اكتب العدد التالي بالأرقام: [ثلاثة ملايين وخمسمائة وأربعة آلاف ومئتان].\nب) رتّب الأعداد التالية تصاعدياً: 3,504,200 - 3,450,200 - 3,540,020.",
                                "أ) 3,504,200.\nب) 3,450,200 < 3,504,200 < 3,540,020."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "أنجز العمليات التالية عمودياً:\n1) 4,586 + 3,275 = ...\n2) 7,502 - 3,649 = ...",
                                "1) 4,586 + 3,275 = 7,861.\n2) 7,502 - 3,649 = 3,853."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "احسب: 246 × 3 = ...\nثم قدّر ناتج 289 + 411 بتقريب كل عدد لأقرب مئة.",
                                "246 × 3 = 738.\nالتقدير: 300 + 400 = 700."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "ارسم قطعة مستقيمة [AB] طولها 8cm، وعيّن نقطتها المنتصفة O.\n- احسب طول القطعة [AO].",
                                "طول [AO] = 8 ÷ 2 = 4cm.")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "اشترى تاجر 25 كيس أرز بسعر 850 دج للكيس، وباع منها 18 كيساً بسعر 1000 دج للكيس.\n1) احسب ثمن شراء الأكياس كلها.\n2) احسب ثمن بيع الأكياس الـ18.\n3) هل ربح التاجر أم خسر من هذه العملية؟ وبكم؟",
                        "1) ثمن الشراء الكلي = 25 × 850 = 21,250 DA.\n2) ثمن بيع 18 كيساً = 18 × 1000 = 18,000 DA.\n3) بما أن التاجر لم يبع سوى 18 كيساً من أصل 25 التي اشتراها، فإن الحكم بالربح أو الخسارة يتطلب معرفة ثمن بيع الأكياس السبعة المتبقية؛ بالنسبة للأكياس المباعة فقط، حقق التاجر مبيعات بـ18,000 DA.")
        );
    }

    private void seedMathT2() {
        seedExam(
                "exam-5ap-math-t2-2026",
                "math",
                "اختبار الفصل الثاني في الرياضيات - السنة الخامسة ابتدائي",
                "الفصل الثاني 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "أجرِ القسمة الإقليدية: 97 ÷ 8.\n- ما هو الحاصل والباقي؟",
                                "97 = (8 × 12) + 1. الحاصل = 12، الباقي = 1."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "قارن الكسرين التاليين باستعمال الرمز المناسب (< أو > أو =):\n1) 5/8 ..... 3/8\n2) 17/5 ..... 4",
                                "1) 5/8 > 3/8.\n2) 17/5 = 3 + 2/5، وبما أن 2/5 < 1 فإن 17/5 < 4."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "احسب: 9.25 + 4.6 = ...\nثم رتّب تنازلياً: 8.09 - 8.9 - 8.19.",
                                "9.25 + 4.6 = 13.85.\nالترتيب التنازلي: 8.9 > 8.19 > 8.09."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "حوّل: 1) 3.2 km إلى m. 2) 750 g إلى kg.",
                                "1) 3.2 km = 3,200 m.\n2) 750 g = 0.75 kg.")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "خصّص فلاح 3/5 من أرضه (مساحتها الكلية 900 m²) لزراعة القمح، والباقي للخضروات.\n1) احسب مساحة الأرض المخصصة للقمح.\n2) احسب مساحة الأرض المخصصة للخضروات.",
                        "1) مساحة القمح = 900 × 3/5 = 540 m².\n2) مساحة الخضروات = 900 - 540 = 360 m².")
        );
    }

    private void seedMathT3() {
        seedExam(
                "exam-5ap-math-t3-2026",
                "math",
                "اختبار الفصل الثالث في الرياضيات - السنة الخامسة ابتدائي",
                "الفصل الثالث 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "ارسم مستطيلاً طوله 7cm وعرضه 4cm.\n- احسب محيطه ومساحته.",
                                "المحيط = (7 + 4) × 2 = 22cm.\nالمساحة = 7 × 4 = 28cm²."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "إذا كان 3kg من التفاح بـ450 دج، فما ثمن 5kg من نفس التفاح؟",
                                "ثمن 5kg = (5 × 450) ÷ 3 = 750 دج."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "احسب 15% من 6,000 دج.\nثم احسب ثمن سلعة بعد تخفيض بنسبة 15% إذا كان ثمنها الأصلي 6,000 دج.",
                                "مبلغ 15% = (6,000 × 15) ÷ 100 = 900 دج.\nالثمن بعد التخفيض = 6,000 - 900 = 5,100 دج."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "رسم مستقيمان (D1) و(D2) متعامدان على نفس المستقيم (D3).\n- ماذا تستنتج عن العلاقة بين (D1) و(D2)؟",
                                "إذا كان (D1) ⊥ (D3) و(D2) ⊥ (D3) فإن (D1) و(D2) متوازيان حتماً.")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "يقطع دراج مسافة 60km بسرعة منتظمة في 2h.\n1) احسب سرعته المتوسطة بالـ km/h.\n2) بنفس السرعة، ما المسافة التي يقطعها في 3h؟",
                        "1) السرعة = 60 ÷ 2 = 30 km/h.\n2) المسافة في 3h = 30 × 3 = 90 km.")
        );
    }

    // ==========================================
    // 📖 اللغة العربية
    // ==========================================
    private void seedArabicT1() {
        seedExam(
                "exam-5ap-arabic-t1-2026",
                "arabic",
                "اختبار الفصل الأول في اللغة العربية - السنة الخامسة ابتدائي",
                "الفصل الأول 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول: الفهم (1.5 نقطة)", 1.5,
                                "اقرأ النص التالي ثم أجب:\n« يحب أحمد المدرسة كثيراً، فهو يستيقظ باكراً كل صباح، ويستعد بسرعة، ويصل إلى القسم قبل زملائه. »\n1) بمَ يشعر أحمد تجاه المدرسة؟\n2) استخرج من النص فعلاً مضارعاً.",
                                "1) يشعر أحمد بحب كبير تجاه المدرسة.\n2) من الأفعال المضارعة: يحب، يستيقظ، يستعد، يصل."),
                        new ExerciseSpec("التمرين الثاني: القواعد (1.5 نقطة)", 1.5,
                                "حدد الفاعل والمفعول به في الجملة: « قرأ التلميذُ القصةَ. »",
                                "الفاعل: التلميذُ (مرفوع بالضمة). المفعول به: القصةَ (منصوب بالفتحة)."),
                        new ExerciseSpec("التمرين الثالث: الصرف (1.5 نقطة)", 1.5,
                                "صرّف الفعل « كَتَبَ » في المضارع مع الضمائر: أنا، أنتَ، هو.",
                                "أنا أكتُبُ، أنتَ تكتُبُ، هو يكتُبُ."),
                        new ExerciseSpec("التمرين الرابع: الإملاء (1.5 نقطة)", 1.5,
                                "اكتب جمع الكلمات التالية: كتاب - مدرسة - قلم.",
                                "كتاب → كُتُب. مدرسة → مدارس. قلم → أقلام.")
                ),
                new ExerciseSpec("الوضعية الإدماجية: التعبير الكتابي (4 نقاط)", 4,
                        "اكتب فقرة من 4 إلى 5 أسطر تصف فيها يومك الأول في المدرسة، مستعملاً فعلين ماضيين على الأقل.",
                        "نموذج إجابة: « في يومي الأول بالمدرسة، استيقظتُ باكراً ولبستُ ملابسي الجديدة. ذهبتُ مع والدي وشعرتُ بفرحة كبيرة عندما قابلتُ معلمتي وزملائي الجدد. لعبنا معاً في الساحة، وأحببتُ مدرستي من أول يوم. » (يُقيَّم النص حسب سلامة اللغة وتوظيف الأفعال الماضية ووضوح الأفكار.)")
        );
    }

    private void seedArabicT2() {
        seedExam(
                "exam-5ap-arabic-t2-2026",
                "arabic",
                "اختبار الفصل الثاني في اللغة العربية - السنة الخامسة ابتدائي",
                "الفصل الثاني 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول: الفهم (1.5 نقطة)", 1.5,
                                "اقرأ النص التالي ثم أجب:\n« هرع رجال الحماية المدنية إلى مكان الحريق، وعملوا بسرعة لإنقاذ السكان، وتمكنوا من إخماد النار قبل أن تنتشر. »\n1) ماذا فعل رجال الحماية المدنية؟\n2) استخرج من النص فعلين ماضيين.",
                                "1) هرعوا إلى مكان الحريق وأنقذوا السكان وأخمدوا النار.\n2) من الأفعال الماضية: هرع، عملوا، تمكنوا، أخمدت."),
                        new ExerciseSpec("التمرين الثاني: القواعد (1.5 نقطة)", 1.5,
                                "ميّز بين النعت والمنعوت في الجملة: « رأيتُ رجلاً شجاعاً. »",
                                "المنعوت: رجلاً. النعت: شجاعاً (يطابق المنعوت في التذكير والتنكير والإعراب)."),
                        new ExerciseSpec("التمرين الثالث: الصرف (1.5 نقطة)", 1.5,
                                "حوّل الأفعال التالية من الماضي إلى المضارع: نجح - وصل - سمع.",
                                "نجح → ينجح. وصل → يصل. سمع → يسمع."),
                        new ExerciseSpec("التمرين الرابع: الإملاء (1.5 نقطة)", 1.5,
                                "أدرج الهمزة في مكانها الصحيح: « سُ...ل التلميذ عن دروسه » (سئل/سؤل/سءل).",
                                "الصحيح: « سُئِلَ التلميذ عن دروسه » — الهمزة على الياء لأنها مكسورة وما قبلها مضموم.")
                ),
                new ExerciseSpec("الوضعية الإدماجية: التعبير الكتابي (4 نقاط)", 4,
                        "اكتب فقرة من 4 إلى 5 أسطر تصف فيها سلوك رجل الحماية المدنية أثناء تدخله في كارثة طبيعية.",
                        "نموذج إجابة: « عندما وقع الزلزال، هرع رجال الحماية المدنية بسرعة إلى الأحياء المتضررة. عملوا بشجاعة لإنقاذ العائلات المحاصرة، وقدموا الإسعافات الأولية للجرحى. لقد ضحّوا بوقتهم وراحتهم من أجل سلامة الآخرين، فاستحقوا كل تقدير واحترام. » (يُقيَّم النص حسب سلامة اللغة ووضوح الوصف.)")
        );
    }

    private void seedArabicT3() {
        seedExam(
                "exam-5ap-arabic-t3-2026",
                "arabic",
                "اختبار الفصل الثالث في اللغة العربية - السنة الخامسة ابتدائي",
                "الفصل الثالث 2026",
                90,
                List.of(
                        new ExerciseSpec("التمرين الأول: الفهم (1.5 نقطة)", 1.5,
                                "اقرأ النص التالي ثم أجب:\n« تُعد قصبة الجزائر معلماً تاريخياً عريقاً، يزورها آلاف السياح كل عام للتعرف على عمارتها الفريدة وتاريخها العريق. »\n1) لماذا يزور السياح قصبة الجزائر؟\n2) اذكر مرادف كلمة « عريقاً ».",
                                "1) يزورونها للتعرف على عمارتها الفريدة وتاريخها.\n2) مرادف « عريقاً »: أصيلاً / قديماً."),
                        new ExerciseSpec("التمرين الثاني: القواعد (1.5 نقطة)", 1.5,
                                "حدد المبتدأ والخبر في الجملة: « المعلمُ التاريخيُّ جميلٌ. »",
                                "المبتدأ: المعلمُ التاريخيُّ. الخبر: جميلٌ (مرفوع بالضمة)."),
                        new ExerciseSpec("التمرين الثالث: الصرف (1.5 نقطة)", 1.5,
                                "اكتب فعل الأمر من الأفعال التالية: يزورُ - يحافظُ - يحترمُ.",
                                "يزور → زُرْ. يحافظ → حافِظْ. يحترم → احترِمْ."),
                        new ExerciseSpec("التمرين الرابع: الإملاء (1.5 نقطة)", 1.5,
                                "ميّز التاء المربوطة من التاء المفتوحة في الكلمات: مدرسة - بيت - حديقة.",
                                "التاء المربوطة: مدرسة، حديقة. التاء المفتوحة: بيت.")
                ),
                new ExerciseSpec("الوضعية الإدماجية: التعبير الكتابي (4 نقاط)", 4,
                        "اكتب فقرة من 4 إلى 5 أسطر تصف فيها زيارة قمتَ بها إلى معلم أثري أو تاريخي في الجزائر.",
                        "نموذج إجابة: « زرتُ مع عائلتي مدينة تيمقاد الأثرية. أعجبتني الأعمدة الرومانية القديمة وشعرتُ أنني أعيش في زمن مضى. تعلمتُ من هذه الزيارة أهمية المحافظة على تراثنا الوطني العريق للأجيال القادمة. » (يُقيَّم النص حسب سلامة اللغة ووضوح الوصف.)")
        );
    }

    // ==========================================
    // 🥖 FRANÇAIS
    // ==========================================
    private void seedFrenchT1() {
        seedExam(
                "exam-5ap-french-t1-2026",
                "french",
                "Composition du 1er trimestre — Français — 5ème Année Primaire",
                "Trimestre 1 - 2026",
                90,
                List.of(
                        new ExerciseSpec("Exercice 1 : Compréhension (1.5 point)", 1.5,
                                "Lis le texte puis réponds :\n« Le lion est un animal sauvage. Il vit dans la savane avec sa famille. Il a un pelage doré et une grande crinière. »\n1) Où vit le lion ?\n2) Relève un adjectif qualificatif dans le texte.",
                                "1) Le lion vit dans la savane.\n2) « sauvage », « doré » ou « grande » sont des adjectifs qualificatifs."),
                        new ExerciseSpec("Exercice 2 : Grammaire (1.5 point)", 1.5,
                                "Souligne le GNS et encadre le GV : « Le grand éléphant traverse la rivière. »",
                                "GNS : « Le grand éléphant ». GV : « traverse la rivière »."),
                        new ExerciseSpec("Exercice 3 : Conjugaison (1.5 point)", 1.5,
                                "Conjugue le verbe « manger » au présent avec : je, tu, ils.",
                                "Je mange, tu manges, ils mangent."),
                        new ExerciseSpec("Exercice 4 : Orthographe (1.5 point)", 1.5,
                                "Mets au féminin : un chat blanc → une chatte ......\nun gros chien → une ...... chienne.",
                                "Une chatte blanche. Une grosse chienne.")
                ),
                new ExerciseSpec("Situation d'intégration : Production écrite (4 points)", 4,
                        "Décris ton animal préféré en 4 à 5 phrases (son apparence, où il vit, ce qu'il mange).",
                        "Exemple de réponse : « Mon animal préféré est le chat. Il a un pelage doux et des yeux verts. Il vit dans ma maison avec ma famille. Il mange des croquettes et boit du lait. J'aime jouer avec lui tous les jours. » (Évaluation selon la richesse du vocabulaire et la correction grammaticale.)")
        );
    }

    private void seedFrenchT2() {
        seedExam(
                "exam-5ap-french-t2-2026",
                "french",
                "Composition du 2ème trimestre — Français — 5ème Année Primaire",
                "Trimestre 2 - 2026",
                90,
                List.of(
                        new ExerciseSpec("Exercice 1 : Compréhension (1.5 point)", 1.5,
                                "Lis le texte puis réponds :\n« Après le séisme, les pompiers sont arrivés rapidement. Ils ont sauvé plusieurs familles et ont soigné les blessés. »\n1) Qui est arrivé rapidement ?\n2) Relève un verbe au passé composé.",
                                "1) Les pompiers sont arrivés rapidement.\n2) « sont arrivés » ou « ont sauvé » ou « ont soigné »."),
                        new ExerciseSpec("Exercice 2 : Grammaire (1.5 point)", 1.5,
                                "Identifie le COD dans la phrase : « Le pompier sauve l'enfant. »",
                                "Le COD est « l'enfant » (répond à la question « qui ? » après le verbe, sans préposition)."),
                        new ExerciseSpec("Exercice 3 : Conjugaison (1.5 point)", 1.5,
                                "Conjugue au passé composé : « Elle ___ (partir) tôt. » / « Il ___ (sauver) un chat. »",
                                "Elle est partie tôt. Il a sauvé un chat."),
                        new ExerciseSpec("Exercice 4 : Orthographe (1.5 point)", 1.5,
                                "Complète par le bon homophone : « Les secouristes ...... (a/ont) aidé les blessés. »",
                                "Les secouristes ont aidé les blessés (« ont » = verbe avoir, pas « a »).")
                ),
                new ExerciseSpec("Situation d'intégration : Production écrite (4 points)", 4,
                        "Raconte en 4 à 5 phrases, au passé composé, comment les secours sont intervenus lors d'une catastrophe naturelle.",
                        "Exemple de réponse : « Hier, un incendie s'est déclaré près de chez moi. Les pompiers sont arrivés très vite avec leurs camions. Ils ont éteint le feu et ont sauvé toutes les familles du quartier. Tout le monde était très reconnaissant envers eux. » (Évaluation selon l'usage correct du passé composé et la cohérence du récit.)")
        );
    }

    private void seedFrenchT3() {
        seedExam(
                "exam-5ap-french-t3-2026",
                "french",
                "Composition du 3ème trimestre — Français — 5ème Année Primaire",
                "Trimestre 3 - 2026",
                90,
                List.of(
                        new ExerciseSpec("Exercice 1 : Compréhension (1.5 point)", 1.5,
                                "Lis le texte puis réponds :\n« Demain, notre classe visitera le musée de la Casbah. Nous découvrirons son architecture ancienne et son histoire fascinante. »\n1) Où la classe ira-t-elle demain ?\n2) Relève un verbe au futur simple.",
                                "1) La classe visitera le musée de la Casbah.\n2) « visitera » ou « découvrirons »."),
                        new ExerciseSpec("Exercice 2 : Grammaire (1.5 point)", 1.5,
                                "Identifie le complément circonstanciel de temps (CCT) dans : « Demain, nous visiterons Timgad. »",
                                "Le CCT est « Demain » (répond à la question « quand ? »)."),
                        new ExerciseSpec("Exercice 3 : Conjugaison (1.5 point)", 1.5,
                                "Conjugue au futur simple : « Nous ___ (visiter) le musée. » / « Vous ___ (être) surpris. »",
                                "Nous visiterons le musée. Vous serez surpris."),
                        new ExerciseSpec("Exercice 4 : Orthographe (1.5 point)", 1.5,
                                "Choisis le bon homophone : « ...... (Où/Ou) se trouve le musée ? »",
                                "Où se trouve le musée ? (« Où » indique un lieu).")
                ),
                new ExerciseSpec("Situation d'intégration : Production écrite (4 points)", 4,
                        "Écris une courte lettre à un ami pour lui raconter, au futur simple, la visite d'un lieu historique que ta classe organisera.",
                        "Exemple de réponse : « Cher ami, la semaine prochaine, notre classe visitera la Casbah d'Alger. Nous découvrirons ses ruelles anciennes et son architecture unique. Le guide nous racontera son histoire. J'ai hâte d'y aller ! » (Évaluation selon l'usage correct du futur simple et la structure de la lettre.)")
        );
    }

    // ==========================================
    // 🔬 التربية العلمية والتكنولوجية
    // ==========================================
    private void seedScienceT1() {
        seedExam(
                "exam-5ap-science-t1-2026",
                "science",
                "اختبار الفصل الأول في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي",
                "الفصل الأول 2026",
                60,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "اذكر اسمين لعنصرين من الجهاز التنفسي يمر بهما الهواء قبل وصوله إلى الرئتين.",
                                "الأنف والرغامى (القصبة الهوائية) هما عنصران يمر بهما الهواء قبل الوصول إلى الرئتين، ثم القصبات الهوائية."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "أين تتم المبادلات الغازية التنفسية؟ اذكر الغاز الذي يدخل الدم والغاز الذي يخرج منه.",
                                "تتم المبادلات الغازية في الأسناخ الرئوية. يدخل الأكسجين (O₂) إلى الدم، ويخرج ثاني أكسيد الكربون (CO₂)."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "اذكر نوعين من الأوعية الدموية ودور كل واحد منهما.",
                                "الشرايين: تنقل الدم المحمل بالأكسجين من القلب إلى الأعضاء. الأوردة: تعيد الدم المحمل بثاني أكسيد الكربون من الأعضاء إلى القلب."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "اذكر قاعدتين من قواعد الوقاية والحفاظ على صحة الجهاز التنفسي.",
                                "من قواعد الوقاية: تهوية الغرف يومياً، وممارسة الرياضة في الهواء النقي، وتجنب استنشاق الدخان.")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "أغلق أحمد نوافذ غرفته وترك موقد التدفئة مشتعلاً طوال الليل. في الصباح شعر بدوار وصداع شديدين.\n1) ما سبب هذه الأعراض في رأيك؟\n2) اقترح حلين لتجنب هذا الخطر مستقبلاً.",
                        "1) استنشق أحمد على الأرجح غاز أول أكسيد الكربون (CO) الناتج عن احتراق غير تام للموقد بسبب انعدام التهوية.\n2) الحلول: تهوية الغرفة قبل النوم، وعدم ترك المواقد مشتعلة طوال الليل في غرفة مغلقة.")
        );
    }

    private void seedScienceT2() {
        seedExam(
                "exam-5ap-science-t2-2026",
                "science",
                "اختبار الفصل الثاني في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي",
                "الفصل الثاني 2026",
                60,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "اذكر العناصر الثلاثة التي يحتاجها النبات الأخضر للنمو.",
                                "يحتاج النبات الأخضر إلى: الماء والأملاح المعدنية، الضوء، وغاز ثاني أكسيد الكربون (CO₂)."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "ما اسم الجزء الذي يمتص الماء والأملاح المعدنية من التربة؟ وماذا يحدث للنبات إذا قُطع هذا الجزء؟",
                                "الأوبار الماصة الموجودة في جذر النبات. إذا قُطع الجذر أو الأوبار الماصة، يموت النبات لعدم قدرته على الامتصاص."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "اذكر مرضين من أمراض سوء التغذية وسبب كل واحد منهما.",
                                "فقر الدم: سببه نقص الحديد. الكساح: سببه نقص فيتامين D والكالسيوم."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "اذكر قاعدتين صحيتين للتغذية السليمة.",
                                "من القواعد الصحية: تناول وجبات متوازنة موزعة على أوقات محددة، وشرب كمية كافية من الماء يومياً.")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "يعاني الطفل سامي من انحناء في عظام ساقيه وتأخر في ظهور أسنانه.\n1) ما اسم المرض الذي يعاني منه سامي في رأيك؟ وما سببه؟\n2) اقترح حلاً غذائياً لمساعدته.",
                        "1) يعاني سامي على الأرجح من مرض الكساح، الناتج عن نقص فيتامين D والكالسيوم.\n2) الحل: تناول أغذية غنية بالكالسيوم (الحليب ومشتقاته) والتعرض المعتدل لأشعة الشمس.")
        );
    }

    private void seedScienceT3() {
        seedExam(
                "exam-5ap-science-t3-2026",
                "science",
                "اختبار الفصل الثالث في التربية العلمية والتكنولوجية - السنة الخامسة ابتدائي",
                "الفصل الثالث 2026",
                60,
                List.of(
                        new ExerciseSpec("التمرين الأول (1.5 نقطة)", 1.5,
                                "اذكر مادتين ناقلتين للكهرباء ومادتين عازلتين لها.",
                                "ناقلتان: الحديد، النحاس. عازلتان: البلاستيك، الخشب."),
                        new ExerciseSpec("التمرين الثاني (1.5 نقطة)", 1.5,
                                "اذكر مراحل دورة الماء في الطبيعة الأربع.",
                                "التبخر، ثم التكاثف، ثم الهطول، ثم الجريان والعودة إلى البحار والأنهار."),
                        new ExerciseSpec("التمرين الثالث (1.5 نقطة)", 1.5,
                                "اذكر طريقتين تكيّف بهما النباتات الصحراوية مع قلة الماء.",
                                "امتداد الجذور عميقاً بحثاً عن الماء، وادّخار الماء في ساق أو أوراق لحمية (كالصبار)."),
                        new ExerciseSpec("التمرين الرابع (1.5 نقطة)", 1.5,
                                "ما الفرق بين الحيوانات البيوضة والحيوانات الولودة؟ اذكر مثالاً لكل نوع.",
                                "البيوضة تضع بيضاً ينمو الجنين خارج جسم الأم (مثال: الدجاجة). الولودة يلد صغارها أحياء مباشرة (مثال: القطة).")
                ),
                new ExerciseSpec("الوضعية الإدماجية (4 نقاط)", 4,
                        "أراد تلميذ التحقق تجريبياً من أن الهواء مادة حقيقية تشغل حيّزاً من الفضاء.\n1) اقترح تجربة بسيطة يمكنه القيام بها.\n2) فسّر النتيجة المتوقعة من هذه التجربة.",
                        "1) يمكن غمر كأس مقلوب رأساً على عقب في وعاء ماء.\n2) الماء لا يملأ الكأس بالكامل، لأن الهواء المحبوس بداخله يشغل حيّزاً ويمنع الماء من الدخول، مما يثبت أن الهواء مادة حقيقية.")
        );
    }
}
