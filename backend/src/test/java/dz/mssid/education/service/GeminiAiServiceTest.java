package dz.mssid.education.service;

import dz.mssid.education.dto.GeminiPromptRequest;
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

    // Gemini rejects the fake key above, so every call here exercises the caught-exception /
    // error-status path — same as before this test was written. What we're actually checking is
    // that the new grade-aware prompt-building methods don't throw and always return a well-formed
    // GeminiResponse, for every grade/mode combination the frontend can request.

    @Test
    @DisplayName("generateExplanation - builds a grade-aware prompt for every primary grade without throwing")
    void generateExplanation_AllGrades() {
        for (String grade : new String[]{"1AP", "2AP", "3AP", "4AP", "5AP"}) {
            GeminiPromptRequest request = GeminiPromptRequest.builder()
                    .topic("القسمة الإقليدية")
                    .grade(grade)
                    .build();

            GeminiResponse response = geminiAiService.generateExplanation(request);

            assertNotNull(response, "grade=" + grade);
            assertNotNull(response.getResponseText(), "grade=" + grade);
            assertNotNull(response.getStatus(), "grade=" + grade);
        }
    }

    @Test
    @DisplayName("generateGuidedSolution - builds a step-by-step solving prompt without throwing")
    void generateGuidedSolution_Works() {
        GeminiPromptRequest request = GeminiPromptRequest.builder()
                .topic("الكسور")
                .question("احسب 1/2 + 1/4")
                .grade("4AP")
                .build();

        GeminiResponse response = geminiAiService.generateGuidedSolution(request);

        assertNotNull(response);
        assertNotNull(response.getResponseText());
        assertNotNull(response.getStatus());
    }

    @Test
    @DisplayName("generatePracticeExercise - builds a new-exercise-generation prompt without throwing")
    void generatePracticeExercise_Works() {
        GeminiPromptRequest request = GeminiPromptRequest.builder()
                .topic("جدول الضرب")
                .grade("3AP")
                .build();

        GeminiResponse response = geminiAiService.generatePracticeExercise(request);

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
