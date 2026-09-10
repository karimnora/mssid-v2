import { AdReel, ReelSlide } from '../types/reels';

const WIDTH = 1080;
const HEIGHT = 1920;

// Standard Tailwind palette hex values for the shades Gemini tends to pick (500-900) — enough to
// resolve a "from-X via-Y to-Z" class string (see GeminiAiService.REEL_SCRIPT_SCHEMA's bgColor
// description) into real Canvas gradient stops. Canvas can't read Tailwind classes directly like the
// DOM can, so this table exists purely for the export step; the live editor preview (ReelsStudioModule)
// applies the classes as real Tailwind CSS instead and never needs this map.
const TAILWIND_HEX: Record<string, string> = {
  'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155', 'slate-800': '#1e293b', 'slate-900': '#0f172a',
  'amber-500': '#f59e0b', 'amber-600': '#d97706', 'amber-700': '#b45309', 'amber-800': '#92400e', 'amber-900': '#78350f',
  'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c', 'orange-800': '#9a3412', 'orange-900': '#7c2d12',
  'rose-500': '#f43f5e', 'rose-600': '#e11d48', 'rose-700': '#be123c', 'rose-800': '#9f1239', 'rose-900': '#881337',
  'pink-500': '#ec4899', 'pink-600': '#db2777', 'pink-700': '#be185d', 'pink-800': '#9d174d', 'pink-900': '#831843',
  'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3', 'indigo-900': '#312e81',
  'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce', 'purple-800': '#6b21a8', 'purple-900': '#581c87',
  'violet-500': '#8b5cf6', 'violet-600': '#7c3aed', 'violet-700': '#6d28d9', 'violet-800': '#5b21b6', 'violet-900': '#4c1d95',
  'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8', 'blue-800': '#1e40af', 'blue-900': '#1e3a8a',
  'sky-500': '#0ea5e9', 'sky-600': '#0284c7', 'sky-700': '#0369a1', 'sky-800': '#075985', 'sky-900': '#0c4a6e',
  'cyan-500': '#06b6d4', 'cyan-600': '#0891b2', 'cyan-700': '#0e7490', 'cyan-800': '#155e75', 'cyan-900': '#164e63',
  'teal-500': '#14b8a6', 'teal-600': '#0d9488', 'teal-700': '#0f766e', 'teal-800': '#115e59', 'teal-900': '#134e4a',
  'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857', 'emerald-800': '#065f46', 'emerald-900': '#064e3b',
};

function resolveGradientStops(bgColor: string): [string, string] {
  const fromMatch = bgColor.match(/from-([a-z]+-\d00)/);
  const toMatch = bgColor.match(/to-([a-z]+-\d00)/);
  const from = (fromMatch && TAILWIND_HEX[fromMatch[1]]) || TAILWIND_HEX['emerald-600'];
  const to = (toMatch && TAILWIND_HEX[toMatch[1]]) || TAILWIND_HEX['cyan-700'];
  return [from, to];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Splits `text` onto centered lines no wider than `maxWidth`; returns the y just past the last line drawn. */
function wrapCenteredText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ');
  let line = '';
  let cursorY = y;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, cx, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, cx, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

/**
 * Renders one reel slide as a 1080×1920 (9:16) canvas — high-resolution enough for direct posting
 * to Instagram/Facebook/TikTok. Reuses the wrap/gradient-drawing approach from certificateImage.ts's
 * renderCertificateCanvas, adapted to a vertical social layout instead of a square diploma.
 *
 * `mascotImageUrl`: a data: URL of the live Didou3DAvatar SVG, serialized once by ReelsStudioModule
 * from a hidden real instance of that component (see its getMascotSvgDataUrl) — Gemini only writes
 * text, it has no access to the app's assets/components to draw Didou itself, so the actual mascot
 * illustration is composited here in plain Canvas 2D instead. Falls back to the small brand logo
 * alone when no mascot is available (e.g. the SVG couldn't be captured yet).
 */
export async function renderReelSlideCanvas(slide: ReelSlide, reel: Pick<AdReel, 'title'>, mascotImageUrl?: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  await Promise.all([
    document.fonts.load("900 76px Cairo"),
    document.fonts.load("800 52px Cairo"),
    document.fonts.load("700 40px Cairo"),
    document.fonts.load("600 34px Cairo"),
    document.fonts.ready,
  ]);

  const textColor = slide.textColor || '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const [from, to] = resolveGradientStops(slide.bgColor);
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grad.addColorStop(0, from);
  grad.addColorStop(1, to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle vignette so light-colored text stays legible regardless of the gradient's endpoints.
  const vignette = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.25, WIDTH / 2, HEIGHT / 2, HEIGHT * 0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  let y = 320;
  ctx.fillStyle = textColor;
  ctx.font = '900 72px Cairo';
  y = wrapCenteredText(ctx, slide.title, WIDTH / 2, y, WIDTH - 140, 84) + 40;

  ctx.font = '700 46px Cairo';
  y = wrapCenteredText(ctx, slide.content, WIDTH / 2, y, WIDTH - 160, 62) + 30;

  if (slide.subtext) {
    ctx.font = '600 36px Cairo';
    ctx.globalAlpha = 0.88;
    y = wrapCenteredText(ctx, slide.subtext, WIDTH / 2, y, WIDTH - 200, 48) + 20;
    ctx.globalAlpha = 1;
  }

  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    ctx.font = '600 34px Cairo';
    for (const point of slide.bulletPoints) {
      y = wrapCenteredText(ctx, `• ${point}`, WIDTH / 2, y, WIDTH - 220, 46) + 8;
    }
  }

  // Didou "presenting" the slide — the live app mascot (captured from a real Didou3DAvatar instance,
  // see ReelsStudioModule's getMascotSvgDataUrl), not a generic logo, when available.
  if (mascotImageUrl) {
    try {
      const mascot = await loadImage(mascotImageUrl);
      const mascotSize = 340;
      ctx.drawImage(mascot, WIDTH / 2 - mascotSize / 2, HEIGHT - mascotSize - 110, mascotSize, mascotSize);
    } catch {
      // A capture failure shouldn't stop the export — falls through to the plain brand footer below.
    }
  } else {
    try {
      const logo = await loadImage('/pwa-icon-source.svg');
      ctx.drawImage(logo, WIDTH / 2 - 34, HEIGHT - 150, 68, 68);
    } catch {
      // Logo is a nice-to-have; a missing/blocked asset shouldn't stop the export.
    }
  }
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.85;
  ctx.font = '800 30px Cairo';
  ctx.fillText('مَسِيد DZ', WIDTH / 2, HEIGHT - 56);
  ctx.globalAlpha = 1;

  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))), 'image/png');
  });
}

function triggerDownloadLink(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * A plain `<a download>` click reliably saves a file on desktop, but many mobile browsers/WebViews
 * silently ignore it for blob: URLs (it just opens the file in a viewer tab instead of saving it) —
 * exactly the "not downloadable on mobile" bug reported for this feature. Mirrors
 * certificateImage.ts's shareOrDownloadCertificate: prefer the native share sheet (which mobile
 * browsers DO support for blob files) and fall back to the plain link only when sharing isn't
 * available (desktop browsers with no share target).
 */
export async function shareOrDownloadReelFile(blob: Blob, filename: string, mimeType: string, shareText: string): Promise<void> {
  const file = new File([blob], filename, { type: mimeType });
  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] }) && navigator.share) {
    try {
      await navigator.share({ files: [file], title: 'مَسِيد DZ', text: shareText });
      return;
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return; // user cancelled the share sheet
      // Any other share failure falls through to the download link below.
    }
  }
  triggerDownloadLink(blob, filename);
}

/** Renders every slide and triggers one PNG share/download per slide, named reel-{id}-slide-{n}.png. */
export async function downloadReelAsImages(reel: AdReel, mascotImageUrl?: string): Promise<void> {
  const idPart = reel.id ?? 'draft';
  for (let i = 0; i < reel.slides.length; i++) {
    const canvas = await renderReelSlideCanvas(reel.slides[i], reel, mascotImageUrl);
    const blob = await canvasToPngBlob(canvas);
    await shareOrDownloadReelFile(blob, `reel-${idPart}-slide-${i + 1}.png`, 'image/png', reel.title);
    // Stagger slightly — triggering several share-sheet/download prompts in the same tick confuses
    // some mobile browsers into only honoring the first one.
    await new Promise((r) => setTimeout(r, 300));
  }
}
