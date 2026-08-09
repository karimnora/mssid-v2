package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class SolveExamRequest {
    private String prompt;
    private Long examId;
    private String subjectContext;

    // Constructeur par défaut
    public SolveExamRequest() {
    }

    public SolveExamRequest(String prompt, Long examId, String subjectContext) {
        this.prompt = prompt;
        this.examId = examId;
        this.subjectContext = subjectContext;
    }

}
