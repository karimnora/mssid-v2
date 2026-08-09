package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamPaperDto {
    private Long id;
    private String titre;
    private String matiere;
    private String niveau;
    private Integer annee;
    private Integer trimestre;
    private String pdfSubjectUrl;
}