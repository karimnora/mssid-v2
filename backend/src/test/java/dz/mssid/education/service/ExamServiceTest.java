package dz.mssid.education.service;

import dz.mssid.education.dto.ExamPaperDto;
import dz.mssid.education.dto.ExamSolutionResponse;
import dz.mssid.education.entity.ExamPaper;
import dz.mssid.education.repository.ExamPaperRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamPaperRepository examPaperRepository;

    @InjectMocks
    private ExamService examService;

    private ExamPaper mockExam;

    @BeforeEach
    void setUp() {
        mockExam = ExamPaper.builder()
                .id(1L)
                .titre("Examen de Mathématiques 5AP")
                .matiere("Mathématiques")
                .niveau("5AP")
                .annee(2024)
                .trimestre(1)
                .pdfSubjectUrl("https://mssid.dz/pdf/math_5ap.pdf")
                .pdfSolutionUrl("https://mssid.dz/pdf/math_5ap_corrige.pdf")
                .correctionBaremeDetails("Exercice 1: 5pts, Exercice 2: 5pts, Problème: 10pts")
                .build();
    }

    @Test
    @DisplayName("getPublicExamPapers - Returns list of public exam paper DTOs")
    void getPublicExamPapers_ReturnsList() {
        when(examPaperRepository.findAll()).thenReturn(List.of(mockExam));

        List<ExamPaperDto> result = examService.getPublicExamPapers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Examen de Mathématiques 5AP", result.get(0).getTitre());
        assertEquals("Mathématiques", result.get(0).getMatiere());
        assertEquals("5AP", result.get(0).getNiveau());
    }

    @Test
    @DisplayName("getExamSolutionById - Returns detailed solution for existing exam ID")
    void getExamSolutionById_Success() {
        when(examPaperRepository.findById(1L)).thenReturn(Optional.of(mockExam));

        ExamSolutionResponse response = examService.getExamSolutionById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getExamId());
        assertEquals("https://mssid.dz/pdf/math_5ap_corrige.pdf", response.getPdfSolutionUrl());
        assertTrue(response.getBaremeDetails().contains("Exercice 1"));
    }

    @Test
    @DisplayName("getExamSolutionById - Throws Exception when exam ID does not exist")
    void getExamSolutionById_NotFound_ThrowsException() {
        when(examPaperRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> examService.getExamSolutionById(99L));
        assertTrue(exception.getMessage().contains("Sujet d'examen non trouvé avec ID: 99"));
    }
}
