package dz.mssid.education.controller;

import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import dz.mssid.education.service.AiQuotaService;
import dz.mssid.education.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.function.Supplier;

@RestController
@RequiredArgsConstructor
public class GeminiProxyController {

    private final GeminiAiService geminiAiService;
    private final AiQuotaService aiQuotaService;

    // "explain" / "solve" / "generate" (see AiTutorModal.tsx) each get a genuinely different,
    // grade-aware prompt built in GeminiAiService — they used to all silently collapse into the same
    // generic explanation regardless of which mode button the child pressed.
    // SEC-10: cookie JWT required (SecurityConfig). Quota is consumed from the SecurityContext User
    // before any Gemini call — x-user-role / x-user-id headers are ignored. A Gemini failure
    // (status=error) refunds the slot so a FREE account is not charged for a timeout.
    @PostMapping({"/api/v1/ai/explain", "/api/gemini/explain"})
    public ResponseEntity<GeminiResponse> askGeminiAssistant(@RequestBody GeminiPromptRequest request) {
        String promptType = request.getPromptType();
        GeminiResponse response = runMetered(() -> switch (promptType == null ? "explain" : promptType) {
            case "solve" -> geminiAiService.generateGuidedSolution(request);
            case "generate" -> geminiAiService.generatePracticeExercise(request);
            default -> geminiAiService.generateExplanation(request);
        });
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/v1/ai/prompt", "/api/gemini/prompt"})
    public ResponseEntity<GeminiResponse> askGeminiPrompt(@RequestBody GeminiPromptRequest request) {
        return ResponseEntity.ok(runMetered(() -> geminiAiService.generateExplanation(request)));
    }

    @PostMapping({"/api/v1/ai/solve-exam", "/api/gemini/solve-exam"})
    public ResponseEntity<GeminiResponse> solveExamDetailed(@RequestBody GeminiPromptRequest request) {
        return ResponseEntity.ok(runMetered(() -> geminiAiService.solveExam(request)));
    }

    @GetMapping({"/api/v1/ai/quota", "/api/gemini/quota"})
    public ResponseEntity<AiQuotaService.QuotaSnapshot> peekQuota() {
        return ResponseEntity.ok(aiQuotaService.peekAuthenticatedUser());
    }

    private GeminiResponse runMetered(Supplier<GeminiResponse> call) {
        AiQuotaService.QuotaSnapshot consumed = aiQuotaService.consumeAuthenticatedUser();
        GeminiResponse response = call.get();
        if (response != null && "error".equals(response.getStatus())) {
            attachQuota(response, aiQuotaService.refundAuthenticatedUser());
            return response;
        }
        attachQuota(response, consumed);
        return response;
    }

    private static void attachQuota(GeminiResponse response, AiQuotaService.QuotaSnapshot snapshot) {
        if (response == null) {
            return;
        }
        response.setQuotaRemaining(snapshot.remaining());
        response.setQuotaLimit(snapshot.limit());
    }
}
