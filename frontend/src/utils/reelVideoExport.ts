import { AdReel } from '../types/reels';
import { renderReelSlideCanvas, shareOrDownloadReelFile } from './reelSlideImage';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920;

/**
 * Exports the whole reel as a single .webm, ready to post to Instagram/Facebook/TikTok (all accept
 * WebM uploads) or convert locally if a platform insists on MP4. Records entirely client-side —
 * each slide's canvas (with Didou composited in, see renderReelSlideCanvas) is held on one output
 * canvas for its `durationSec`, captured via MediaRecorder — no server involved.
 *
 * An earlier version transcoded to .mp4 via ffmpeg.wasm (~25MB WASM payload, its own CSP/worker
 * requirements). Dropped after it turned out unreliable on both mobile and desktop in practice —
 * WebM via MediaRecorder alone is far more broadly and predictably supported, and needs no extra
 * library or CSP allowance at all.
 */
export async function downloadReelAsVideo(reel: AdReel, onProgress?: (fraction: number) => void, mascotImageUrl?: string): Promise<void> {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder is not supported in this browser.');
  }

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = WIDTH;
  outputCanvas.height = HEIGHT;
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) throw new Error('Canvas 2D context unavailable');

  // Fixed frame rate mode: the stream emits frames continuously at FPS regardless of redraws, so a
  // single drawImage per slide (held via setTimeout) is enough — no manual re-draw loop needed.
  const stream = (outputCanvas as HTMLCanvasElement & { captureStream(fps?: number): MediaStream }).captureStream(FPS);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
    ? 'video/webm;codecs=vp8'
    : 'video/webm';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    throw new Error('No supported video/webm codec in this browser.');
  }

  const recorder = new MediaRecorder(stream, { mimeType });
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
    await new Promise((r) => setTimeout(r, Math.max(500, slide.durationSec * 1000)));
    elapsed += slide.durationSec;
    onProgress?.(elapsed / totalDuration);
  }

  recorder.stop();
  const webmBlob = await stopped;
  if (webmBlob.size === 0) throw new Error('Recorded video is empty.');

  await shareOrDownloadReelFile(webmBlob, `reel-${reel.id ?? 'draft'}.webm`, 'video/webm', reel.title);
  onProgress?.(1);
}
