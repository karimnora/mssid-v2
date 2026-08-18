package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** A single AI-generated multiple-choice check question attached to a practice exercise — see
 * GeminiAiService.generatePracticeExercise, which requests this shape from Gemini via a strict JSON
 * response schema rather than parsing free text. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickCheckDto {
    private String questionAr;
    private List<QuickCheckOptionDto> options;
}
