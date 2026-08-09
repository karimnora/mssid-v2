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

    public GeminiResponse(String text, String status) {
        this.answer = text;
        this.generatedText = text;
        this.responseText = text;
        this.status = status;
        this.modelUsed = "gemini-2.5-flash";
        this.timestamp = System.currentTimeMillis();
        this.cacheHit = false;
    }
}
