package dz.mssid.education.service;

import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Condensed digest of the official Algerian primary curriculum (الجيل الثاني — see the project's
    // CLAUDE.md for the full reference), one entry per grade. This is what keeps "المعلم مسيد" from
    // answering a 2AP child with a 5AP notion the child hasn't been taught yet — without this the
    // model has no signal at all about what "5AP" or "2AP" actually means pedagogically.
    private static final Map<String, String> GRADE_CURRICULUM = Map.of(
            "1AP", "الحروف العربية وحركاتها القصيرة والمدود، الأعداد من 0 إلى 20، المقارنة (أكثر/أقل)، الجمع البسيط بالمحسوسات، الحواس الخمس.",
            "2AP", "الشدة والتنوين، اللام الشمسية والقمرية، الأعداد حتى 999، الجمع بالاحتفاظ، بداية الطرح، المستقيم والمربع والمستطيل.",
            "3AP", "أنواع الكلمة (اسم/فعل/حرف)، المذكر والمؤنث والمفرد والجمع، الأعداد حتى 9999، جدول الضرب، الطرح بالاحتفاظ، وحدات الطول والكتلة، بداية الفرنسية والإنجليزية.",
            "4AP", "الجملة الاسمية والفعلية، إنّ وأخواتها، كان وأخواتها، الهمزة، الأعداد حتى 99999، القسمة الإقليدية، الكسور البسيطة، محيط المربع والمستطيل، محاور التناظر.",
            "5AP", "النعت والمنعوت، المفاعيل، جمع المذكر والمؤنث السالم وجمع التكسير، الأسماء الخمسة والأفعال الخمسة، الأعداد حتى المليار، الكسور والأعداد العشرية، النسبة المئوية، المساحة وحجم متوازي المستطيلات."
    );

    private static final Set<String> GRADES_NEEDING_FULL_TASHKEEL = Set.of("1AP", "2AP", "3AP");

    private String curriculumDigest(String grade) {
        return GRADE_CURRICULUM.getOrDefault(grade, GRADE_CURRICULUM.get("5AP"));
    }

    // Shared persona + guardrails prepended to every prompt sent to Gemini. Keeping this in one
    // place means every mode (explain/solve/generate) enforces the same age-appropriateness and
    // curriculum-scope rules instead of each hand-rolling its own instructions.
    private String buildPersona(String grade) {
        StringBuilder sb = new StringBuilder();
        sb.append("أنت \"المعلم مسيد\"، معلم جزائري ودود يساعد تلميذاً في مستوى ").append(grade)
                .append(" وفق المنهاج الرسمي الجزائري (الجيل الثاني). التزم بدقة بهذه القواعد:\n");
        sb.append("- لا تشرح أبداً مفهوماً أعلى من مستوى ").append(grade)
                .append(". المفاهيم المسموح بها لهذا المستوى فقط: ").append(curriculumDigest(grade)).append("\n");
        sb.append("- استعمل جملاً قصيرة وواضحة ولهجة مشجعة تناسب طفلاً في هذا العمر.\n");
        if (GRADES_NEEDING_FULL_TASHKEEL.contains(grade)) {
            sb.append("- شكّل كل الكلمات العربية تشكيلاً كاملاً (الفتحة والضمة والكسرة والسكون).\n");
        }
        sb.append("- استعمل أمثلة من الحياة اليومية الجزائرية (الدينار، السوق، المدرسة، العائلة).\n");
        sb.append("- إن كان الموضوع بالفرنسية أو الإنجليزية، أجب بنفس تلك اللغة.\n");
        sb.append("- إن كان الطلب خارج المواد الدراسية أو غير لائق لطفل، اعتذر بلطف ووجّهه للعودة إلى دروسه بدل الإجابة عنه.\n");
        sb.append("- لا تختلق معلومات دينية أو تاريخية غير دقيقة.\n\n");
        return sb.toString();
    }

    /** Mode "اشرح لي درساً": définition simple + exemple concret + astuce à retenir. */
    public GeminiResponse generateExplanation(GeminiPromptRequest request) {
        String grade = request.getFormattedGrade();
        String topic = request.getFormattedPrompt();
        String fullPrompt = buildPersona(grade)
                + "اشرح المفهوم التالي في ثلاثة أجزاء قصيرة وواضحة:\n"
                + "1) تعريف بسيط\n2) مثال ملموس من الحياة اليومية\n3) قاعدة أو حيلة يتذكرها التلميذ بسهولة\n\n"
                + "الموضوع: " + topic;
        return callGeminiApi(fullPrompt);
    }

    /**
     * Mode "حل مسألة أو سؤال": raisonnement guidé étape par étape puis réponse finale isolée — pas
     * juste le résultat brut, pour que l'élève apprenne la méthode et pas seulement la réponse.
     */
    public GeminiResponse generateGuidedSolution(GeminiPromptRequest request) {
        String grade = request.getFormattedGrade();
        String question = request.getFormattedPrompt();
        String fullPrompt = buildPersona(grade)
                + "التلميذ يطلب حل هذا السؤال. اشرح طريقة الحل خطوة بخطوة بلغة بسيطة، "
                + "ثم اذكر الجواب النهائي بوضوح تحت عنوان \"الجواب:\"، "
                + "ثم أضف سطراً واحداً تحت عنوان \"تذكّر:\" يلخص القاعدة المستعملة.\n\n"
                + "السؤال: " + question;
        return callGeminiApi(fullPrompt);
    }

    /**
     * Mode "ولّد مسألة تدريبية جديدة": un exercice inédit dans le style du programme officiel, avec
     * son corrigé séparé sous un titre dédié pour qu'un parent puisse vérifier sans le générer lui-même.
     */
    public GeminiResponse generatePracticeExercise(GeminiPromptRequest request) {
        String grade = request.getFormattedGrade();
        String topic = request.getFormattedPrompt();
        String fullPrompt = buildPersona(grade)
                + "ولّد تمريناً تدريبياً واحداً جديداً يناسب هذا المستوى حول الموضوع التالي، "
                + "بنفس أسلوب المنهاج الرسمي الجزائري. اكتب نص التمرين فقط أولاً، "
                + "ثم ضع الحل الكامل تحت عنوان منفصل \"الحل:\" حتى يتحقق منه الوالدان.\n\n"
                + "الموضوع: " + topic;
        return callGeminiApi(fullPrompt);
    }

    /** Corrigé détaillé (avec barème) d'un examen existant — flux distinct du tutorat par sujet libre. */
    public GeminiResponse generateDetailedSolution(String prompt, Long examId) {
        String examIdStr = examId != null ? examId.toString() : "N/A";
        String promptStr = (prompt != null && !prompt.isBlank()) ? prompt : "Résolution complète";

        String fullPrompt = "Tu es un professeur algérien expert (Mssid.dz). Génère une solution étape par étape détaillée avec barème de notation pour le sujet d'examen #"
                + examIdStr + ": " + promptStr;

        return callGeminiApi(fullPrompt);
    }

    private GeminiResponse callGeminiApi(String textPrompt) {
        String url = geminiApiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", textPrompt)))
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);
            String generatedText = extractTextFromGeminiResponse(response);
            return new GeminiResponse(generatedText, "success");
        } catch (Exception e) {
            return new GeminiResponse("Erreur lors de l'appel de l'API Gemini: " + e.getMessage(), "error");
        }
    }

    private String extractTextFromGeminiResponse(Map<?, ?> response) {
        try {
            List<?> candidates = (List<?>) response.get("candidates");
            Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) candidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> part = (Map<?, ?>) parts.get(0);
            return (String) part.get("text");
        } catch (Exception e) {
            return "Aucun texte retourné dans la réponse.";
        }
    }

    /**
     * Résout l'erreur : solveExam(request)
     */
    public GeminiResponse solveExam(GeminiPromptRequest request) {
        String promptText = request.getPrompt() != null && !request.getPrompt().isBlank()
                ? request.getPrompt()
                : "Résolution de l'examen #" + request.getExamId();

        return generateDetailedSolution(promptText, request.getExamId());
    }
}
