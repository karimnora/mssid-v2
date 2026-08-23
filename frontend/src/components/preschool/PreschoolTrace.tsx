import React, { useEffect, useRef, useState } from 'react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';
import { localizeGlyph } from './preschoolGlyphs';

interface PreschoolTraceProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

const CANVAS_SIZE = 260;
const MIN_STROKE_LENGTH = 120;
const HIT_RADIUS = 22;
const TRACE_FONT = `900 ${Math.round(CANVAS_SIZE * 0.65)}px system-ui, "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", Arial, sans-serif`;

interface Pt { x: number; y: number }

function rasterizeGlyph(glyph: string): ImageData | null {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.font = TRACE_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 28;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const x = CANVAS_SIZE / 2;
  const y = CANVAS_SIZE * 0.58;
  ctx.strokeText(glyph, x, y);
  ctx.fillText(glyph, x, y);
  return ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function isOnGlyph(mask: ImageData | null, x: number, y: number): boolean {
  if (!mask) return true;
  const r = HIT_RADIUS;
  const w = mask.width;
  const h = mask.height;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const px = Math.round(x + dx);
      const py = Math.round(y + dy);
      if (px < 0 || py < 0 || px >= w || py >= h) continue;
      if (mask.data[(py * w + px) * 4 + 3] > 12) return true;
    }
  }
  return false;
}

function strokeLength(pts: Pt[]): number {
  return pts.reduce((total, p, i) => {
    if (i === 0) return 0;
    const prev = pts[i - 1];
    return total + Math.hypot(p.x - prev.x, p.y - prev.y);
  }, 0);
}

export const PreschoolTrace: React.FC<PreschoolTraceProps> = ({ activity, language, onComplete }) => {
  const [strokes, setStrokes] = useState<Pt[][]>([]);
  const [nudge, setNudge] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);
  const liveStroke = useRef<Pt[]>([]);
  const maskRef = useRef<ImageData | null>(null);

  const glyph = localizeGlyph(
    activity.i18n[language].glyph ?? activity.visualAssets.mainSvgOrImage,
    language,
  );

  useEffect(() => {
    maskRef.current = rasterizeGlyph(glyph);
    setStrokes([]);
    liveStroke.current = [];
    drawing.current = false;
  }, [glyph, activity.id]);

  const toLocalPoint = (clientX: number, clientY: number): Pt => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = toLocalPoint(e.clientX, e.clientY);
    if (!isOnGlyph(maskRef.current, pt.x, pt.y)) return;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    liveStroke.current = [pt];
    setStrokes((prev) => [...prev, [pt]]);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return;
    const pt = toLocalPoint(e.clientX, e.clientY);
    liveStroke.current = [...liveStroke.current, pt];
    setStrokes((prev) => {
      if (prev.length === 0) return [[pt]];
      const next = prev.slice(0, -1);
      next.push([...liveStroke.current]);
      return next;
    });
  };

  const handlePointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const done = liveStroke.current;
    liveStroke.current = [];
    if (done.length < 2) {
      setStrokes((prev) => prev.slice(0, -1));
    }
  };

  const pathLength = strokes.reduce((sum, s) => sum + strokeLength(s), 0);

  const handleValidate = () => {
    if (pathLength >= MIN_STROKE_LENGTH) {
      playSuccessChime();
      setTimeout(onComplete, 900);
    } else {
      setNudge(true);
      setTimeout(() => setNudge(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="touch-none rounded-[2rem] border-4 border-amber-300 bg-white shadow-inner select-none"
        style={{ cursor: 'crosshair' }}
      >
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          fontSize={CANVAS_SIZE * 0.65}
          fontWeight={900}
          fontFamily='system-ui, "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", Arial, sans-serif'
          fill="#fde68a"
          dominantBaseline="middle"
        >
          {glyph}
        </text>
        {strokes.map((pts, i) =>
          pts.length > 1 ? (
            <polyline
              key={i}
              points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#f97316"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null
        )}
      </svg>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setStrokes([])}
          className="min-h-14 px-5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-sm cursor-pointer transition-colors"
        >
          🔄
        </button>
        <button
          onClick={handleValidate}
          className={`min-h-14 px-8 rounded-2xl font-black text-white text-lg shadow-lg cursor-pointer transition-transform ${
            nudge ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          ✓
        </button>
      </div>
    </div>
  );
};
