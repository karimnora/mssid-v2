package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiExplainRequest {
    private String prompt;
    private String subjectContext;
    private Long examId;
    private String topic;
    private String question;
    private String grade;

}
