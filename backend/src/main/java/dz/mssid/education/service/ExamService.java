package dz.mssid.education.service;

import dz.mssid.education.dto.ExamPaperDto;
import dz.mssid.education.dto.ExamSolutionResponse;
import dz.mssid.education.dto.OfficialExamDto;
import dz.mssid.education.entity.ExamPaper;
import dz.mssid.education.repository.ExamPaperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {

    private final ExamPaperRepository examPaperRepository;

    /**
     * Recherche un sujet d'examen par son identifiant.
     */
    @Transactional(readOnly = true)
    public Optional<ExamPaper> findExamById(Long id) {
        return examPaperRepository.findById(id);
    }

    /**
     * Filtre les sujets d'examen selon le niveau (grade) et/ou la matière (subject).
     */
    @Transactional(readOnly = true)
    public List<ExamPaper> filterExams(String grade, String subject) {
        if (grade != null && subject != null) {
            return examPaperRepository.findByNiveauAndMatiere(grade, subject);
        } else if (grade != null) {
            return examPaperRepository.findByNiveau(grade);
        } else if (subject != null) {
            return examPaperRepository.findByMatiere(subject);
        }
        return examPaperRepository.findAll();
    }

    /**
     * Sauvegarde ou met à jour un examen à partir du DTO de création/édition.
     */
    public ExamPaper saveExam(OfficialExamDto dto) {
        ExamPaper exam = new ExamPaper();
        if (dto.getId() != null && !dto.getId().isBlank()) {
            exam.setId(Long.valueOf(dto.getId()));
        }
        exam.setTitre(dto.getTitleAr());
        exam.setMatiere(dto.getSubject());
        exam.setNiveau(dto.getGrade());
        exam.setAnnee(dto.getYear());

        return examPaperRepository.save(exam);
    }

    /**
     * Supprime un sujet d'examen par son identifiant.
     */
    public void deleteExamById(Long id) {
        examPaperRepository.deleteById(id);
    }

    // =========================================================================
    // Vos méthodes existantes conservées pour la rétrocompatibilité :
    // =========================================================================

    @Transactional(readOnly = true)
    public List<ExamPaperDto> getPublicExamPapers() {
        return examPaperRepository.findAll().stream()
                .map(exam -> new ExamPaperDto(
                        exam.getId(),
                        exam.getTitre(),
                        exam.getMatiere(),
                        exam.getNiveau(),
                        exam.getAnnee(),
                        exam.getTrimestre(),
                        exam.getPdfSubjectUrl()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExamSolutionResponse getExamSolutionById(Long examId) {
        ExamPaper exam = examPaperRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Sujet d'examen non trouvé avec ID: " + examId));

        return new ExamSolutionResponse(
                exam.getId(),
                exam.getTitre(),
                exam.getPdfSolutionUrl(),
                exam.getCorrectionBaremeDetails(),
                exam.getAnnee()
        );
    }
}