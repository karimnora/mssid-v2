import { AdReel } from '../types/reels';
import { renderReelSlideCanvas, downloadBlob } from './reelSlideImage';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

// Records each slide's canvas onto one output canvas, held for its `durationSec`, captured via
// MediaRecorder into a single .webm — no server involved, entirely in the admin's browser.
async function recordSlidesToWebm(reel: AdReel, onProgress?: (fraction: number) => void): Promise<Blob> {
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = WIDTH;
  outputCanvas.height = HEIGHT;
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas 2D context unavailable');

  // Fixed frame rate mode: the stream emits frames continuously at FPS regardless of redraws, so a
  // single drawImage per slide (held via setTimeout) is enough — no manual re-draw loop needed.
  const stream = (outputCanvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(FPS);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
  });

  recorder.start();

  const totalDuration = reel.slides.reduce((sum, s) => sum + s.durationSec, 0) || 1;
  let elapsed = 0;
  for (const slide of reel.slides) {
    const slideCanvas = await renderReelSlideCanvas(slide, reel);
    outCtx.clearRect(0, 0, WIDTH, HEIGHT);
    outCtx.drawImage(slideCanvas, 0, 0);
    await new Promise((r) => setTimeout(r, Math.max(500, slide.durationSec * 1000)));
    elapsed += slide.durationSec;
    onProgress?.((elapsed / totalDuration) * 0.5); // recording = first half of the progress bar
  }

  recorder.stop();
  return stopped;
}

/**
 * Exports the whole reel as a single MP4 for direct posting to Instagram/Facebook/TikTok. Records
 * a .webm client-side (recordSlidesToWebm above), then remuxes/encodes it to .mp4 via ffmpeg.wasm —
 * loaded lazily (dynamic import) only when this function actually runs, so its ~25MB WASM payload
 * never reaches students; only an admin clicking "Télécharger (vidéo MP4)" pays that cost.
 * See index.html's CSP comment for the 'wasm-unsafe-eval' allowance this requires.
 */
export async function downloadReelAsVideo(reel: AdReel, onProgress?: (fraction: number) => void): Promise<void> {
  const webmBlob = await recordSlidesToWebm(reel, onProgress);
  onProgress?.(0.55);

  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { fetchFile, toBlobURL } = await import('@ffmpeg/util');

  const ffmpeg = new FFmpeg();
  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  ffmpeg.on('progress', ({ progress }) => onProgress?.(0.55 + Math.min(1, Math.max(0, progress)) * 0.45));

  await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));
  await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'output.mp4']);
  const data = await ffmpeg.readFile('output.mp4');
  const mp4Blob = new Blob([data as Uint8Array], { type: 'video/mp4' });

  downloadBlob(mp4Blob, `reel-${reel.id ?? 'draft'}.mp4`);
  onProgress?.(1);
}
