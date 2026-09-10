package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeminiResponse {
    private String answer;
    private String generatedText;
    private String responseText;
    private String status;
    private String modelUsed;
    private Long timestamp;
    private Boolean cacheHit;

    // Populated only by generatePracticeExercise's structured-output path (see GeminiAiService) —
    // null for every other mode (explain/solve/examSolution), which keep using responseText as
    // before. exerciseText/solutionText replace the old convention of asking the model to put a
    // literal "الحل:" heading in free text and hoping the frontend's display matched; quickCheck adds
    // one real interactive multiple-choice question instead of only static prose.
    private String exerciseText;
    private String solutionText;
    private QuickCheckDto quickCheck;

    // Daily quota after this call (or after a refund if Gemini returned status=error).
    private Integer quotaRemaining;
    private Integer quotaLimit;

    public GeminiResponse(String text, String status) {
        this.answer = text;
        this.generatedText = text;
        this.responseText = text;
        this.status = status;
        this.modelUsed = "gemini-3.1-flash-lite";
        this.timestamp = System.currentTimeMillis();
        this.cacheHit = false;
    }
}
