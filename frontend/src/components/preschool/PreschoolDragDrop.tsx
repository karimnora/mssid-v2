import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playGentleNudge, playSuccessChime } from './usePreschoolAudio';

interface PreschoolDragDropProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

interface ItemState {
  id: string;
  asset: string;
  dropped: boolean;
  offset: { x: number; y: number };
}

// Counting via drag-and-drop, built on raw Pointer Events (not HTML5 native drag, which barely works
// on touch/mobile Safari) so it behaves identically on a parent's or a child's finger, mouse or pen.
// Success only requires dropping every item near the basket — generous hit-testing (a padded
// bounding box), never precise pixel targeting, per the "wide tolerance" rule for this age band.
export const PreschoolDragDrop: React.FC<PreschoolDragDropProps> = ({ activity, onComplete }) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragItems = activity.visualAssets.dragItems || [];
  const [items, setItems] = useState<ItemState[]>(
    dragItems.map((item) => ({ id: item.id, asset: item.asset, dropped: false, offset: { x: 0, y: 0 } }))
  );
  const draggingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);

  const isOverDropZone = (clientX: number, clientY: number): boolean => {
    const zone = dropZoneRef.current;
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    const padding = 40; // generous hit area — easier for a small, imprecise finger to succeed
    return (
      clientX >= rect.left - padding &&
      clientX <= rect.right + padding &&
      clientY >= rect.top - padding &&
      clientY <= rect.bottom + padding
    );
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingId.current = id;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const id = draggingId.current;
    if (!id) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, offset: { x: dx, y: dy } } : it)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const id = draggingId.current;
    draggingId.current = null;
    if (!id) return;

    const dropped = isOverDropZone(e.clientX, e.clientY);
    const target = activity.visualAssets.dropZoneCount || dragItems.length;
    const hasExtras = dragItems.length > target;
    setItems((prev) => {
      if (dropped && hasExtras) {
        const already = prev.filter((it) => it.dropped).length;
        if (already >= target) {
          playGentleNudge();
          return prev.map((it) => (it.id === id ? { ...it, offset: { x: 0, y: 0 } } : it));
        }
      }
      const next = prev.map((it) => (it.id === id ? { ...it, dropped: dropped ? true : it.dropped, offset: dropped ? it.offset : { x: 0, y: 0 } } : it));
      const droppedCount = next.filter((it) => it.dropped).length;
      const enough = hasExtras ? droppedCount === target : droppedCount >= target;
      if (dropped && enough && !completedRef.current) {
        completedRef.current = true;
        playSuccessChime();
        setTimeout(onComplete, 900);
      }
      return next;
    });
  };

  const droppedCount = items.filter((it) => it.dropped).length;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Drop zone (basket) */}
      <div
        ref={dropZoneRef}
        className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] border-4 border-dashed border-amber-400 bg-amber-50 flex items-center justify-center"
      >
        <span className="text-7xl select-none" aria-hidden="true">{activity.visualAssets.mainSvgOrImage}</span>
        <span className="absolute -bottom-3 bg-emerald-500 text-white text-sm font-black px-3 py-1 rounded-full shadow">
          {droppedCount} / {activity.visualAssets.dropZoneCount || dragItems.length}
        </span>
      </div>

      {/* Draggable tray */}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-sm touch-none">
        {items.filter((it) => !it.dropped).map((it) => (
          <motion.div
            key={it.id}
            onPointerDown={(e) => handlePointerDown(e, it.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ x: it.offset.x, y: it.offset.y, touchAction: 'none' }}
            whileTap={{ scale: 1.15 }}
            className="text-5xl cursor-grab active:cursor-grabbing select-none"
            role="button"
            aria-label={it.asset}
          >
            {it.asset}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
