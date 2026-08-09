package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSolutionResponse {
    private Long examId;
    private String titre;
    private String pdfSolutionUrl;
    private String baremeDetails;
    private Integer annee;
}
