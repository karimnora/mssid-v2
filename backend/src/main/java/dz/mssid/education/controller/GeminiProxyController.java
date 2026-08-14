package dz.mssid.education.controller;

import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import dz.mssid.education.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class GeminiProxyController {

    private final GeminiAiService geminiAiService;

    @PostMapping({"/api/v1/ai/explain", "/api/gemini/explain"})
    public ResponseEntity<GeminiResponse> askGeminiAssistant(@RequestBody GeminiPromptRequest request) {
        String prompt = request.getFormattedPrompt();
        String context = request.getFormattedContext();

        GeminiResponse response = geminiAiService.generateExplanation(prompt, context);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/v1/ai/prompt", "/api/gemini/prompt"})
    public ResponseEntity<GeminiResponse> askGeminiPrompt(@RequestBody GeminiPromptRequest request) {
        String prompt = request.getFormattedPrompt();
        String context = request.getFormattedContext();

        GeminiResponse response = geminiAiService.generateExplanation(prompt, context);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/v1/ai/solve-exam", "/api/gemini/solve-exam"})
    public ResponseEntity<GeminiResponse> solveExamDetailed(@RequestBody GeminiPromptRequest request) {
        GeminiResponse response = geminiAiService.solveExam(request);
        return ResponseEntity.ok(response);
    }
}
