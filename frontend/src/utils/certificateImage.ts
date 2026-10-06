import { Badge, PrimaryGrade } from '../types';
import { shareImageBlob, type ShareOutcome } from './shareContent';

const GRADE_LABEL_AR: Record<PrimaryGrade, string> = {
  '1AP': 'السنة الأولى ابتدائي',
  '2AP': 'السنة الثانية ابتدائي',
  '3AP': 'السنة الثالثة ابتدائي',
  '4AP': 'السنة الرابعة ابتدائي',
  '5AP': 'السنة الخامسة ابتدائي',
};

const CANVAS_SIZE = 1080;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
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

export interface CertificateInput {
  childName: string;
  grade: PrimaryGrade;
  badge: Badge;
}

/**
 * Draws a shareable "diploma" image (1080x1080 PNG) celebrating a badge unlock — pure client-side
 * Canvas 2D, no server round-trip. Reuses the app's self-hosted Cairo font and PWA icon so it looks
 * on-brand without shipping a separate logo asset.
 */
export async function renderCertificateCanvas({ childName, grade, badge }: CertificateInput): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  await Promise.all([
    document.fonts.load("900 66px Cairo"),
    document.fonts.load("800 40px Cairo"),
    document.fonts.load("700 28px Cairo"),
    document.fonts.load("600 24px Cairo"),
    document.fonts.ready,
  ]);

  const S = CANVAS_SIZE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const bgGrad = ctx.createLinearGradient(0, 0, S, S);
  bgGrad.addColorStop(0, '#FFF8E7');
  bgGrad.addColorStop(1, '#FDE9B8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, S, S);

  ctx.lineWidth = 12;
  ctx.strokeStyle = '#D97706';
  roundRectPath(ctx, 40, 40, S - 80, S - 80, 40);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#10B981';
  roundRectPath(ctx, 66, 66, S - 132, S - 132, 30);
  ctx.stroke();

  ctx.font = '34px Cairo';
  ctx.fillStyle = '#F59E0B';
  [[112, 112], [S - 112, 112], [112, S - 112], [S - 112, S - 112]].forEach(([x, y]) => {
    ctx.fillText('⭐', x, y);
  });

  try {
    const logo = await loadImage('/pwa-icon-source.svg');
    ctx.drawImage(logo, S / 2 - 55, 108, 110, 110);
  } catch {
    // Logo is a nice-to-have; a missing/blocked asset shouldn't stop certificate generation.
  }

  ctx.fillStyle = '#065F46';
  ctx.font = '800 34px Cairo';
  ctx.fillText('مَسِيد DZ', S / 2, 260);

  ctx.beginPath();
  ctx.arc(S / 2, 378, 78, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#F59E0B';
  ctx.stroke();
  ctx.font = '68px Cairo';
  ctx.fillStyle = '#1C1917';
  ctx.fillText(badge.icon, S / 2, 400);

  ctx.fillStyle = '#92400E';
  ctx.font = '900 58px Cairo';
  ctx.fillText('شهادة تفوّق', S / 2, 512);

  ctx.fillStyle = '#57534E';
  ctx.font = '700 28px Cairo';
  ctx.fillText('هذه الشهادة تُمنح إلى', S / 2, 566);

  ctx.fillStyle = '#059669';
  ctx.font = '900 64px Cairo';
  ctx.fillText(childName, S / 2, 648);

  ctx.fillStyle = '#78716C';
  ctx.font = '700 26px Cairo';
  ctx.fillText(GRADE_LABEL_AR[grade], S / 2, 690);

  ctx.fillStyle = '#1C1917';
  ctx.font = '800 32px Cairo';
  let y = wrapCenteredText(ctx, `لتميّزه في: ${badge.titleAr}`, S / 2, 762, S - 220, 42);

  ctx.fillStyle = '#78716C';
  ctx.font = '600 24px Cairo';
  wrapCenteredText(ctx, badge.descriptionAr, S / 2, y + 14, S - 280, 32);

  const dateLabel = new Intl.DateTimeFormat('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  ctx.fillStyle = '#A16207';
  ctx.font = '700 24px Cairo';
  ctx.fillText(dateLabel, S / 2, S - 88);

  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas.toBlob returned null'))), 'image/png');
  });
}

export type { ShareOutcome };

/**
 * Shares the PNG through the device's native share sheet (WhatsApp/Facebook Stories included)
 * when the Web Share API supports file sharing, otherwise falls back to a plain download —
 * covers both mobile (share sheet) and desktop (no share target) usage.
 */
export async function shareOrDownloadCertificate(blob: Blob, filename: string, shareText: string): Promise<ShareOutcome> {
  return shareImageBlob(blob, filename, shareText);
}
