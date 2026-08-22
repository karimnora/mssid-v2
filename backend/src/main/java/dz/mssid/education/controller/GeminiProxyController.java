package dz.mssid.education.controller;

import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import dz.mssid.education.service.AiQuotaService;
import dz.mssid.education.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class GeminiProxyController {

    private final GeminiAiService geminiAiService;
    private final AiQuotaService aiQuotaService;

    // "explain" / "solve" / "generate" (see AiTutorModal.tsx) each get a genuinely different,
    // grade-aware prompt built in GeminiAiService — they used to all silently collapse into the same
    // generic explanation regardless of which mode button the child pressed.
    // SEC-10: cookie JWT required (SecurityConfig). Quota is consumed from the SecurityContext User
    // before any Gemini call — x-user-role / x-user-id headers are ignored.
    @PostMapping({"/api/v1/ai/explain", "/api/gemini/explain"})
    public ResponseEntity<GeminiResponse> askGeminiAssistant(@RequestBody GeminiPromptRequest request) {
        aiQuotaService.consumeAuthenticatedUser();
        String promptType = request.getPromptType();
        GeminiResponse response = switch (promptType == null ? "explain" : promptType) {
            case "solve" -> geminiAiService.generateGuidedSolution(request);
            case "generate" -> geminiAiService.generatePracticeExercise(request);
            default -> geminiAiService.generateExplanation(request);
        };
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/v1/ai/prompt", "/api/gemini/prompt"})
    public ResponseEntity<GeminiResponse> askGeminiPrompt(@RequestBody GeminiPromptRequest request) {
        aiQuotaService.consumeAuthenticatedUser();
        GeminiResponse response = geminiAiService.generateExplanation(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/v1/ai/solve-exam", "/api/gemini/solve-exam"})
    public ResponseEntity<GeminiResponse> solveExamDetailed(@RequestBody GeminiPromptRequest request) {
        aiQuotaService.consumeAuthenticatedUser();
        GeminiResponse response = geminiAiService.solveExam(request);
        return ResponseEntity.ok(response);
    }
}
