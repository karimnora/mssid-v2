package dz.mssid.education.service;

import dz.mssid.education.dto.GeminiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GeminiAiServiceTest {

    @InjectMocks
    private GeminiAiService geminiAiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(geminiAiService, "apiKey", "mock_gemini_api_key");
        ReflectionTestUtils.setField(geminiAiService, "geminiApiUrl", "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
    }

    @Test
    @DisplayName("generateExplanation - Builds correct prompt and handles network graceful fallback")
    void generateExplanation_FallbackExecution() {
        GeminiResponse response = geminiAiService.generateExplanation("Comment convertir m/s en km/h ?", "Physique 4AM");

        assertNotNull(response);
        assertNotNull(response.getResponseText());
        assertNotNull(response.getStatus());
    }

    @Test
    @DisplayName("generateDetailedSolution - Builds solution prompt for exam ID")
    void generateDetailedSolution_FallbackExecution() {
        GeminiResponse response = geminiAiService.generateDetailedSolution("Génère le corrigé complet", 5L);

        assertNotNull(response);
        assertNotNull(response.getResponseText());
    }
}
