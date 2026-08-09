package dz.mssid.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class GeminiProxyControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GeminiAiService geminiAiService;

    @InjectMocks
    private GeminiProxyController geminiProxyController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(geminiProxyController).build();
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain - Returns AI generated explanation")
    void askGeminiAssistant_Success() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setPrompt("Explique la poussée d'Archimède");
        request.setSubjectContext("Physique 4AM");

        GeminiResponse response = new GeminiResponse("La poussée d'Archimède est la force particulière...", "success");

        when(geminiAiService.generateExplanation(eq("Explique la poussée d'Archimède"), eq("Physique 4AM"))).thenReturn(response);

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value(response.getAnswer()))
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("POST /api/gemini/prompt - Also accepts prompt and returns explanation")
    void askGeminiPrompt_Success() throws Exception {
        GeminiPromptRequest request = new GeminiPromptRequest();
        request.setPrompt("Qu'est-ce que le théorème de Pythagore ?");
        request.setGrade("5AP");

        GeminiResponse response = new GeminiResponse("Dans un triangle rectangle...", "success");

        when(geminiAiService.generateExplanation(eq("Qu'est-ce que le théorème de Pythagore ?"), eq("5AP"))).thenReturn(response);

        mockMvc.perform(post("/api/gemini/prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Dans un triangle rectangle..."));
    }

    @Test
    @DisplayName("GET /api/gemini/stats - Returns AI proxy stats")
    void getAiStats_Success() throws Exception {
        mockMvc.perform(get("/api/gemini/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OPERATIONAL"))
                .andExpect(jsonPath("$.rateLimiterActive").value(true));
    }
}
