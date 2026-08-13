import React, { useRef, useState } from 'react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';

interface PreschoolTraceProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

const CANVAS_SIZE = 260;
// Minimum finger-drawn path length before we accept the trace. Deliberately generous — the goal at
// this age is the tracing *motion* and letter/numeral familiarity, not stroke accuracy. A strict
// path-matching score against a reference SVG would frustrate a 3-5 year old for no pedagogical gain.
const MIN_STROKE_LENGTH = 120;

// Finger-tracing over a big translucent numeral guide. Free-draw SVG polyline captured via Pointer
// Events (works for touch, mouse and pen identically). "تحقق" is always enabled — a child can tap it
// any time, and gets an encouraging nudge to draw a bit more rather than a hard failure.
export const PreschoolTrace: React.FC<PreschoolTraceProps> = ({ activity, onComplete }) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [nudge, setNudge] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  const toLocalPoint = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    setPoints((prev) => [...prev, toLocalPoint(e.clientX, e.clientY)]);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return;
    setPoints((prev) => [...prev, toLocalPoint(e.clientX, e.clientY)]);
  };

  const handlePointerUp = () => {
    drawing.current = false;
  };

  const pathLength = points.reduce((total, p, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return total + Math.hypot(p.x - prev.x, p.y - prev.y);
  }, 0);

  const handleValidate = () => {
    if (pathLength >= MIN_STROKE_LENGTH) {
      playSuccessChime();
      setTimeout(onComplete, 900);
    } else {
      setNudge(true);
      setTimeout(() => setNudge(false), 500);
    }
  };

  const handleReset = () => setPoints([]);

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="touch-none rounded-[2rem] border-4 border-amber-300 bg-white shadow-inner cursor-crosshair select-none"
      >
        {/* Faint guide glyph — traced over, never a strict target */}
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          fontSize={CANVAS_SIZE * 0.65}
          fontWeight={900}
          fill="#fde68a"
          dominantBaseline="middle"
        >
          {activity.visualAssets.mainSvgOrImage}
        </text>
        {points.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#f97316"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
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
