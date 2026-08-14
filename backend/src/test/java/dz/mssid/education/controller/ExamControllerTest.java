package dz.mssid.education.controller;

import dz.mssid.education.dto.ExamPaperDto;
import dz.mssid.education.dto.ExamSolutionResponse;
import dz.mssid.education.service.ExamService;
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

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ExamControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ExamService examService;

    @InjectMocks
    private ExamController examController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(examController).build();
    }

    @Test
    @DisplayName("GET /api/v1/exams/public/list - Returns list of exam papers")
    void getAllExamPapers_Success() throws Exception {
        ExamPaperDto paper = new ExamPaperDto(
                1L,
                "Examen Physique 4AM",
                "Physique",
                "4AM",
                2024,
                2,
                "https://mssid.dz/pdf/physique_4am.pdf"
        );

        when(examService.getPublicExamPapers()).thenReturn(List.of(paper));

        mockMvc.perform(get("/api/v1/exams/public/list")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titre").value("Examen Physique 4AM"))
                .andExpect(jsonPath("$[0].matiere").value("Physique"))
                .andExpect(jsonPath("$[0].niveau").value("4AM"));
    }

    @Test
    @DisplayName("GET /api/v1/exams/{examId}/solutions - Returns official solution by exam ID")
    void getOfficialExamSolution_Success() throws Exception {
        ExamSolutionResponse solution = new ExamSolutionResponse(
                1L,
                "Examen Physique 4AM",
                "https://mssid.dz/pdf/physique_4am_sol.pdf",
                "Solution détaillée étape par étape",
                2024
        );

        when(examService.getExamSolutionById(1L)).thenReturn(solution);

        mockMvc.perform(get("/api/v1/exams/1/solutions")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.examId").value(1))
                .andExpect(jsonPath("$.pdfSolutionUrl").value("https://mssid.dz/pdf/physique_4am_sol.pdf"))
                .andExpect(jsonPath("$.baremeDetails").value("Solution détaillée étape par étape"));
    }
}
