/** Paint and model are separate layers on screen; flatten both for sharing. */
export function composeBoardDrawing(source: HTMLCanvasElement, paths?: string[]): HTMLCanvasElement {
  if (!paths?.length) return source;
  const target = document.createElement('canvas');
  const multiplier = Math.max(1, 1600 / Math.max(source.width, source.height, 1));
  target.width = Math.round(source.width * multiplier);
  target.height = Math.round(source.height * multiplier);
  const ctx = target.getContext('2d');
  if (!ctx) throw new Error('Drawing export unavailable');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0, target.width, target.height);
  const inset = 16 * (window.devicePixelRatio || 1) * multiplier;
  const side = Math.max(1, Math.min(target.width, target.height) - inset * 2);
  ctx.translate((target.width - side) / 2, (target.height - side) / 2);
  ctx.scale(side / 400, side / 400);
  ctx.strokeStyle = '#172033';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const path of paths) ctx.stroke(new Path2D(path));
  return target;
}
