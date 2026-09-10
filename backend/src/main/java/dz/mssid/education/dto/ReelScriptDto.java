package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Gemini-generated reel draft returned by POST /api/v1/admin/reels/generate — not persisted yet,
 * the admin edits it in ReelsStudioModule.tsx before saving (see AdReelController.saveReel).
 * `status` follows the same "success"/"error" convention as GeminiResponse (not a boolean) so the
 * frontend's error-message handling stays consistent across every AI endpoint in this app.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReelScriptDto {
    private String status;
    private String errorMessage;

    private String title;
    private String description;
    private String category;
    private List<String> tags;
    private List<ReelSlideDto> slides;
}
