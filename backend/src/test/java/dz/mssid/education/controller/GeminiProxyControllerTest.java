package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import dz.mssid.education.exception.AiQuotaExceededException;
import dz.mssid.education.exception.GlobalExceptionHandler;
import dz.mssid.education.service.AiQuotaService;
import dz.mssid.education.service.GeminiAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class GeminiProxyControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GeminiAiService geminiAiService;

    @Mock
    private AiQuotaService aiQuotaService;

    @InjectMocks
    private GeminiProxyController geminiProxyController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(geminiProxyController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        lenient().when(aiQuotaService.consumeAuthenticatedUser())
                .thenReturn(new AiQuotaService.QuotaSnapshot(true, 3, 2, 24));
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain with promptType=explain (or absent) - routes to generateExplanation")
    void askGeminiAssistant_ExplainMode() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setTopic("La poussée d'Archimède");
        request.setGrade("5AP");

        GeminiResponse response = new GeminiResponse("La poussée d'Archimède est la force particulière...", "success");
        when(geminiAiService.generateExplanation(any(GeminiPromptRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value(response.getAnswer()))
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain with promptType=solve - routes to generateGuidedSolution")
    void askGeminiAssistant_SolveMode() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setTopic("الكسور");
        request.setQuestion("احسب 1/2 + 1/4");
        request.setGrade("4AP");
        request.setPromptType("solve");

        GeminiResponse response = new GeminiResponse("الجواب: 3/4", "success");
        when(geminiAiService.generateGuidedSolution(any(GeminiPromptRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("الجواب: 3/4"));
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain with promptType=generate - routes to generatePracticeExercise")
    void askGeminiAssistant_GenerateMode() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setTopic("جدول الضرب");
        request.setGrade("3AP");
        request.setPromptType("generate");

        GeminiResponse response = new GeminiResponse("تمرين: احسب 6 × 7\nالحل: 42", "success");
        when(geminiAiService.generatePracticeExercise(any(GeminiPromptRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("تمرين: احسب 6 × 7\nالحل: 42"));
    }

    @Test
    @DisplayName("POST /api/gemini/prompt - Also accepts a raw prompt and returns an explanation")
    void askGeminiPrompt_Success() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setPrompt("Qu'est-ce que le théorème de Pythagore ?");
        request.setGrade("5AP");

        GeminiResponse response = new GeminiResponse("Dans un triangle rectangle...", "success");
        when(geminiAiService.generateExplanation(any(GeminiPromptRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/gemini/prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Dans un triangle rectangle..."));
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain - exhausted account quota returns 429 without calling Gemini")
    void askGeminiAssistant_QuotaExceeded_Returns429() throws Exception {
        doThrow(new AiQuotaExceededException(3, 0, 12)).when(aiQuotaService).consumeAuthenticatedUser();

        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setTopic("الكسور");
        request.setGrade("5AP");

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.status").value(429))
                .andExpect(jsonPath("$.limit").value(3))
                .andExpect(jsonPath("$.remaining").value(0));

        verify(geminiAiService, never()).generateExplanation(any());
    }
}
