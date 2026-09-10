import { AdReel } from '../types/reels';
import { renderReelSlideCanvas, shareOrDownloadReelFile } from './reelSlideImage';
import { decodeAudioBlob, scheduleTransitionChime } from './reelAudio';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

/**
 * Exports the whole reel as a single .webm, ready to post to Instagram/Facebook/TikTok (all accept
 * WebM uploads) or convert locally if a platform insists on MP4. Records entirely client-side —
 * each slide's canvas (with Didou composited in, see renderReelSlideCanvas) is held on one output
 * canvas for its `durationSec`, captured via MediaRecorder — no server involved.
 *
 * `narrations`: per-slide-id WAV Blobs from ReelsStudioModule's "توليد الأصوات" step (Gemini TTS via
 * GeminiAiService.generateNarration, wrapped by utils/reelAudio.ts's pcmBase64ToWavBlob). Mixed into
 * the recording's audio track alongside a short transition chime on every slide — a slide with no
 * narration still gets the chime, so the export is never silent. A slide is held on screen at least
 * as long as its narration takes to finish, even if that's longer than its configured durationSec.
 *
 * An earlier version transcoded to .mp4 via ffmpeg.wasm (~25MB WASM payload, its own CSP/worker
 * requirements). Dropped after it turned out unreliable on both mobile and desktop in practice —
 * WebM via MediaRecorder alone is far more broadly and predictably supported, and needs no extra
 * library or CSP allowance at all.
 */
export async function downloadReelAsVideo(
  reel: AdReel,
  onProgress?: (fraction: number) => void,
  mascotImageUrl?: string,
  narrations?: Record<string, Blob>
): Promise<void> {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder is not supported in this browser.');
  }

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = WIDTH;
  outputCanvas.height = HEIGHT;
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas 2D context unavailable');

  const audioCtx = new AudioContext();
  await audioCtx.resume().catch(() => {});
  const audioDest = audioCtx.createMediaStreamDestination();

  // Fixed frame rate mode: the stream emits frames continuously at FPS regardless of redraws, so a
  // single drawImage per slide (held via setTimeout) is enough — no manual re-draw loop needed.
  const videoStream = (outputCanvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(FPS);
  const combinedStream = new MediaStream([...videoStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()]);

  const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
    .find((t) => MediaRecorder.isTypeSupported(t));
  if (!mimeType) {
    throw new Error('No supported video/webm codec in this browser.');
  }

  const recorder = new MediaRecorder(combinedStream, { mimeType });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const stopped = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    recorder.onerror = () => reject(new Error('MediaRecorder failed while recording the reel.'));
  });

  recorder.start();

  const totalDuration = reel.slides.reduce((sum, s) => sum + s.durationSec, 0) || 1;
  let elapsed = 0;
  for (const slide of reel.slides) {
    const slideCanvas = await renderReelSlideCanvas(slide, reel, mascotImageUrl);
    outCtx.clearRect(0, 0, WIDTH, HEIGHT);
    outCtx.drawImage(slideCanvas, 0, 0);

    const chimeAt = audioCtx.currentTime + 0.02;
    scheduleTransitionChime(audioCtx, audioDest, chimeAt);

    let holdSec = slide.durationSec;
    const narrationBlob = narrations?.[slide.id];
    if (narrationBlob) {
      try {
        const buffer = await decodeAudioBlob(audioCtx, narrationBlob);
        holdSec = Math.max(holdSec, buffer.duration + 0.6);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioDest);
        source.start(audioCtx.currentTime + 0.3);
      } catch {
        // Narration failed to decode (bad/partial audio) — the slide still shows, just silently.
      }
    }

    await new Promise((r) => setTimeout(r, Math.max(500, holdSec * 1000)));
    elapsed += holdSec;
    onProgress?.(Math.min(1, elapsed / totalDuration));
  }

  recorder.stop();
  const webmBlob = await stopped;
  audioCtx.close().catch(() => {});
  if (webmBlob.size === 0) throw new Error('Recorded video is empty.');

  await shareOrDownloadReelFile(webmBlob, `reel-${reel.id ?? 'draft'}.webm`, 'video/webm', reel.title);
  onProgress?.(1);
}
