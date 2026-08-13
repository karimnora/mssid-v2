import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';

interface PreschoolFindPathProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

// Simplified "maze": drag the traveler from the start icon to the end icon along a dashed guide.
// Reaching the end zone is what's checked — never whether the child stayed exactly on the line. A
// 3-5 year old's fine motor control can't reliably trace a narrow path, and punishing that would
// test hand-eye coordination instead of the actual concept (start → end, cause → effect).
export const PreschoolFindPath: React.FC<PreschoolFindPathProps> = ({ activity, onComplete }) => {
  const token = activity.visualAssets.pathToken;
  const endZoneRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [solved, setSolved] = useState(false);
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  if (!token) return null;

  const isOverEndZone = (clientX: number, clientY: number): boolean => {
    const zone = endZoneRef.current;
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    const padding = 44;
    return clientX >= rect.left - padding && clientX <= rect.right + padding && clientY >= rect.top - padding && clientY <= rect.bottom + padding;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (solved) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || solved) return;
    setOffset({ x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging.current || solved) return;
    dragging.current = false;
    if (isOverEndZone(e.clientX, e.clientY)) {
      setSolved(true);
      playSuccessChime();
      setTimeout(onComplete, 900);
    } else {
      setOffset({ x: 0, y: 0 }); // snap back to start — free retry, no penalty
    }
  };

  return (
    <div className="relative w-full max-w-sm h-40 flex items-center justify-between px-2">
      <div className="flex flex-col items-center gap-1 z-0">
        <span className="text-5xl opacity-40">{token.startAsset}</span>
      </div>

      <div className="flex-1 h-1 border-t-4 border-dashed border-amber-300 mx-2" aria-hidden="true" />

      <div ref={endZoneRef} className="flex flex-col items-center gap-1 z-0">
        <span className="text-5xl">{token.endAsset}</span>
      </div>

      <motion.div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ x: offset.x, y: offset.y, touchAction: 'none' }}
        animate={solved ? { scale: [1, 1.3, 1] } : {}}
        className="absolute left-2 text-6xl cursor-grab active:cursor-grabbing select-none z-10"
        role="button"
        aria-label={token.travelerAsset}
      >
        {token.travelerAsset}
      </motion.div>
    </div>
  );
};
