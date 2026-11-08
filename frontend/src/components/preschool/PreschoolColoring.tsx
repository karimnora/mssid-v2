import React, { useEffect, useRef, useState } from 'react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';

interface PreschoolColoringProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

const CANVAS_SIZE = 260;
const PALETTE = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7'];
const EMPTY_FILL = '#f8fafc';

// Tap-to-fill coloring book: each region is a simple declared shape (circle/ellipse/rect) rather
// than hand-authored SVG path data, so new pictures stay cheap to add. There's no "wrong" color —
// finishing means every region got *some* color, matching how a real coloring book works at this
// age (the point is the coloring motion and color exploration, not matching a reference palette).
export const PreschoolColoring: React.FC<PreschoolColoringProps> = ({ activity, onComplete }) => {
  const regions = activity.visualAssets.coloringRegions || [];
  const [fills, setFills] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0]);
  const completedRef = useRef(false);

  useEffect(() => {
    setFills({});
    setSelectedColor(PALETTE[0]);
    completedRef.current = false;
  }, [activity.id]);

  const handleFill = (regionId: string) => {
    setFills((prev) => {
      const next = { ...prev, [regionId]: selectedColor };
      const allFilled = regions.every((r) => !!next[r.id]);
      if (allFilled && !completedRef.current) {
        completedRef.current = true;
        playSuccessChime();
        setTimeout(onComplete, 900);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="rounded-[2rem] border-4 border-amber-300 bg-white shadow-inner select-none touch-none"
      >
        {regions.map((region) => {
          const fill = fills[region.id] || EMPTY_FILL;
          const isFilled = !!fills[region.id];
          if (region.shape === 'circle') {
            return (
              <circle
                key={region.id}
                cx={region.x}
                cy={region.y}
                r={region.size}
                fill={fill}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray={isFilled ? undefined : '4 4'}
                className="cursor-pointer"
                onPointerDown={() => handleFill(region.id)}
              />
            );
          }
          if (region.shape === 'ellipse') {
            return (
              <ellipse
                key={region.id}
                cx={region.x}
                cy={region.y}
                rx={region.size}
                ry={region.size2 ?? region.size}
                fill={fill}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray={isFilled ? undefined : '4 4'}
                className="cursor-pointer"
                onPointerDown={() => handleFill(region.id)}
              />
            );
          }
          return (
            <rect
              key={region.id}
              x={region.x}
              y={region.y}
              width={region.size}
              height={region.size2 ?? region.size}
              rx={4}
              fill={fill}
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray={isFilled ? undefined : '4 4'}
              className="cursor-pointer"
              onPointerDown={() => handleFill(region.id)}
            />
          );
        })}
      </svg>

      <div className="flex items-center gap-3">
        {PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: color }}
            className={`min-h-[60px] min-w-[60px] w-12 h-12 rounded-full shadow-md cursor-pointer transition-transform ${
              selectedColor === color ? 'scale-125 ring-4 ring-offset-2 ring-amber-400' : 'hover:scale-110'
            }`}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
};
