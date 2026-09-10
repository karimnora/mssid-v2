package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * An Imagen-3-generated illustration for one Reels Studio slide (see
 * GeminiAiService.generateSlideImage / AdReelController). `imageBase64` is a ready-to-use encoded
 * image (PNG) — unlike NarrationDto's raw PCM, no client-side wrapping is needed before display.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlideImageDto {
    private String status;
    private String errorMessage;
    private String imageBase64;
    private String mimeType;
}
