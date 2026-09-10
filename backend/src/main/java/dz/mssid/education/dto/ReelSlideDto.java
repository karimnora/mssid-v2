package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** One 9:16 slide of an AI-generated reel script — see GeminiAiService.generateReelScript. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReelSlideDto {
    private String title;
    private String content;
    private String subtext;
    private List<String> bulletPoints;
    private int durationSec;
    private String bgColor;
}
