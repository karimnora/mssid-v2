package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A Gemini-TTS-synthesized narration clip for one Reels Studio slide (see
 * GeminiAiService.generateNarration / AdReelController). `audioBase64` is raw PCM (mimeType carries
 * the sample rate, e.g. "audio/L16;codec=pcm;rate=24000") — the frontend wraps it in a WAV header
 * itself (utils/reelAudio.ts) since the browser's decodeAudioData needs a container format.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NarrationDto {
    private String status;
    private String errorMessage;
    private String audioBase64;
    private String mimeType;
}
