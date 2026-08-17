package dz.mssid.education.controller;

import dz.mssid.education.dto.ExamPaperDto;
import dz.mssid.education.dto.ExamSolutionResponse;
import dz.mssid.education.dto.OfficialExamDto;
import dz.mssid.education.entity.ExamPaper;
import dz.mssid.education.mapper.ExamPaperMapper;
import dz.mssid.education.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    /**
     * Endpoint public : Récupérer tous les examens officiels (ExamPaperDto).
     * GET /api/v1/exams/public/list
     */
    @GetMapping("/public/list")
    public ResponseEntity<List<ExamPaperDto>> getAllPublicExams() {
        List<ExamPaperDto> exams = examService.getPublicExamPapers();
        return ResponseEntity.ok(exams);
    }

    /**
     * Endpoint public : Récupérer un examen spécifique par son ID.
     * GET /api/v1/exams/public/{id}
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<OfficialExamDto> getPublicExamById(@PathVariable Long id) {
        return examService.findExamById(id)
                .map(ExamPaperMapper::toOfficialExamDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint public : Filtrer les examens par niveau (ex: 5AP) et matière.
     * GET /api/v1/exams/public/filter?grade=5AP&subject=math
     */
    @GetMapping("/public/filter")
    public ResponseEntity<List<OfficialExamDto>> filterPublicExams(
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String subject) {

        List<OfficialExamDto> filteredExams = examService.filterExams(grade, subject)
                .stream()
                .map(ExamPaperMapper::toOfficialExamDto)
                .toList();
        return ResponseEntity.ok(filteredExams);
    }

    /**
     * Endpoint : Obtenir la solution officielle d'un examen.
     * GET /api/v1/exams/{examId}/solutions
     * SEC-04: this is the paywalled asset (the frontend already gates the "show solution" UI behind
     * ROLE_PREMIUM/ROLE_ADMIN — see ExamsViewer.tsx's isUserPremiumOrAdmin) but nothing enforced that
     * server-side, so any authenticated free account could fetch any exam's solution directly.
     */
    @GetMapping("/{examId}/solutions")
    @PreAuthorize("hasRole('PREMIUM') or hasRole('ADMIN')")
    public ResponseEntity<ExamSolutionResponse> getOfficialExamSolution(@PathVariable Long examId) {
        ExamSolutionResponse solution = examService.getExamSolutionById(examId);
        return ResponseEntity.ok(solution);
    }

    /**
     * Endpoint restreint : Ajouter un nouvel examen (Administrateur).
     * POST /api/v1/exams/admin/create
     */
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficialExamDto> createExam(@RequestBody OfficialExamDto examDto) {
        ExamPaper createdExam = examService.saveExam(examDto);
        OfficialExamDto responseDto = ExamPaperMapper.toOfficialExamDto(createdExam);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /**
     * Endpoint restreint : Supprimer un examen par son ID.
     * DELETE /api/v1/exams/admin/{id}
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExamById(id);
        return ResponseEntity.noContent().build();
    }
}
