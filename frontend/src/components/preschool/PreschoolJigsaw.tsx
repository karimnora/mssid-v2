import { usePreschoolEvidence } from './preschoolEvidence';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';

interface PreschoolJigsawProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

interface PieceState {
  id: string;
  asset: string;
  correctSlotId: string;
  placedSlotId: string | null;
  offset: { x: number; y: number };
}

const BOARD_WIDTH = 300;
const BOARD_HEIGHT = 200;

// A toddler-friendly jigsaw: instead of interlocking picture-fragment pieces (which need a real art
// pipeline this MVP doesn't have), each slot shows a translucent "ghost" of the piece that belongs
// there — the same shape-matching mechanic as a wooden shape-sorter toy. Dragging is the same raw
// Pointer Events + padded bounding-box hit test used by PreschoolSorting, just against fixed board
// positions instead of category bins.
export const PreschoolJigsaw: React.FC<PreschoolJigsawProps> = ({ activity, onComplete }) => {
  const slots = activity.visualAssets.jigsawSlots || [];
  const pieces = activity.visualAssets.jigsawPieces || [];
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reportEvidence = usePreschoolEvidence();
  const [items, setItems] = useState<PieceState[]>(
    pieces.map((p) => ({ id: p.id, asset: p.asset, correctSlotId: p.correctSlotId, placedSlotId: null, offset: { x: 0, y: 0 } }))
  );
  const draggingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);

  const findSlotUnderPointer = (clientX: number, clientY: number): string | null => {
    const padding = 26;
    for (const slot of slots) {
      const el = slotRefs.current[slot.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left - padding && clientX <= rect.right + padding && clientY >= rect.top - padding && clientY <= rect.bottom + padding) {
        return slot.id;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
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

    const slotId = findSlotUnderPointer(e.clientX, e.clientY);
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (!item) return prev;

      if (slotId && slotId === item.correctSlotId) {
        playSuccessChime();
        const next = prev.map((it) => (it.id === id ? { ...it, placedSlotId: slotId } : it));
        const allPlaced = next.every((it) => it.placedSlotId !== null);
        if (allPlaced && !completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 900);
        }
        return next;
      }

      if (slotId) { reportEvidence(); playGentleNudge(); } // dropped on a slot, but the wrong one
      return prev.map((it) => (it.id === id ? { ...it, offset: { x: 0, y: 0 } } : it)); // snap back
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
        className="relative rounded-[2rem] border-4 border-dashed border-emerald-300 bg-emerald-50 shadow-inner"
      >
        {slots.map((slot) => {
          const ghostPiece = pieces.find((p) => p.correctSlotId === slot.id);
          const placedPiece = items.find((it) => it.correctSlotId === slot.id && it.placedSlotId === slot.id);
          return (
            <div
              key={slot.id}
              ref={(el) => { slotRefs.current[slot.id] = el; }}
              style={{ left: slot.x, top: slot.y, transform: 'translate(-50%, -50%)' }}
              className="absolute w-16 h-16 rounded-2xl border-4 border-dashed border-emerald-300 bg-white/50 flex items-center justify-center"
            >
              {placedPiece ? (
                <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-4xl select-none">
                  {placedPiece.asset}
                </motion.span>
              ) : (
                <span className="text-4xl opacity-25 select-none" aria-hidden="true">
                  {ghostPiece?.asset}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 max-w-sm touch-none">
        {items.filter((it) => it.placedSlotId === null).map((it) => (
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
