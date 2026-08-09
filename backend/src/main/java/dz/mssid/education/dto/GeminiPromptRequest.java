package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiPromptRequest {

    private String prompt;
    private String subjectContext;
    private Long examId;

    // Champs optionnels du frontend
    private String topic;
    private String question;
    private String grade;

    // ============================================================
    // HELPERS À AJOUTER
    // ============================================================

    public String getFormattedPrompt() {
        if (prompt != null && !prompt.isBlank()) {
            return prompt;
        }
        String t = topic != null ? topic : "";
        String q = question != null ? question : "";
        return (t + " " + q).trim();
    }

    public String getFormattedContext() {
        if (subjectContext != null && !subjectContext.isBlank()) {
            return subjectContext;
        }
        return grade != null ? grade : "5AP";
    }
}