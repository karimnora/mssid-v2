package dz.mssid.education.mapper;

import dz.mssid.education.dto.ExamPaperDto;
import dz.mssid.education.dto.OfficialExamDto;
import dz.mssid.education.entity.ExamPaper;

public class ExamPaperMapper {

    // Nouvelle méthode pour convertir directement l'entité ExamPaper
    public static OfficialExamDto toOfficialExamDto(ExamPaper paper) {
        if (paper == null) return null;

        return OfficialExamDto.builder()
                .id(paper.getId() != null ? paper.getId().toString() : null)
                .year(paper.getAnnee())
                .titleAr(paper.getTitre())
                .subject(paper.getMatiere())
                .grade(paper.getNiveau())
                .durationMinutes(60)
                .totalPoints(20)
                .build();
    }

    // Méthode existante conservée si nécessaire
    public static OfficialExamDto toOfficialExamDto(ExamPaperDto paper) {
        if (paper == null) return null;

        return OfficialExamDto.builder()
                .id(paper.getId() != null ? paper.getId().toString() : null)
                .year(paper.getAnnee())
                .titleAr(paper.getTitre())
                .subject(paper.getMatiere())
                .grade(paper.getNiveau())
                .durationMinutes(60)
                .totalPoints(20)
                .build();
    }
}