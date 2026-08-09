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

@Service
@RequiredArgsConstructor
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public GeminiResponse generateExplanation(String prompt, String subjectContext) {
        String contextStr = (subjectContext != null && !subjectContext.isBlank()) ? subjectContext : "Général";
        String promptStr = (prompt != null && !prompt.isBlank()) ? prompt : "Explication";

        String fullPrompt = "Tu es un professeur algérien expert (Mssid.dz). Explique clairement en français/arabe selon le contexte ("
                + contextStr + "): " + promptStr;

        return callGeminiApi(fullPrompt);
    }

    public GeminiResponse generateDetailedSolution(String prompt, Long examId) {
        String examIdStr = examId != null ? examId.toString() : "N/A";
        String promptStr = (prompt != null && !prompt.isBlank()) ? prompt : "Résolution complète";

        String fullPrompt = "Génère une solution étape par étape détaillée avec barème de notation pour le sujet d'examen #"
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

    // ============================================================
// MÉTHODES DE SURCHARGE POUR COMPATIBILITÉ CONTRÔLEUR / FRONT
// ============================================================

    /**
     * Résout l'erreur : generateExplanation(request)
     */
    public GeminiResponse generateExplanation(GeminiPromptRequest request) {
        String promptText = request.getPrompt() != null && !request.getPrompt().isBlank()
                ? request.getPrompt()
                : ((request.getTopic() != null ? request.getTopic() : "") + " " + (request.getQuestion() != null ? request.getQuestion() : "")).trim();

        String context = request.getSubjectContext() != null && !request.getSubjectContext().isBlank()
                ? request.getSubjectContext()
                : request.getGrade();

        return generateExplanation(promptText, context);
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