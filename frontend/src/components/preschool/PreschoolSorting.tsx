import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { PreschoolColorDot, isColorDot } from './PreschoolShapeMark';

interface PreschoolSortingProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

interface ItemState {
  id: string;
  asset: string;
  correctBinId: string;
  sortedBinId: string | null;
  offset: { x: number; y: number };
}

// Drag each item into the matching category bin (e.g. big vs small animals). Built on the same raw
// Pointer Events technique as PreschoolDragDrop, generalized to N bins. A wrong-bin drop never
// "locks in" — the item snaps back to the tray for another try, exactly like a wrong tap elsewhere
// in Mode Éveil: mistakes cost nothing but a soft sound.
export const PreschoolSorting: React.FC<PreschoolSortingProps> = ({ activity, onComplete }) => {
  const bins = activity.visualAssets.sortBins ?? [];
  const sortItems = activity.visualAssets.sortItems ?? [];
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [items, setItems] = useState<ItemState[]>(
    sortItems.map((it) => ({ id: it.id, asset: it.asset, correctBinId: it.correctBinId, sortedBinId: null, offset: { x: 0, y: 0 } }))
  );
  const draggingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);

  const findBinUnderPointer = (clientX: number, clientY: number): string | null => {
    const padding = 30;
    for (const bin of bins) {
      const el = binRefs.current[bin.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left - padding && clientX <= rect.right + padding && clientY >= rect.top - padding && clientY <= rect.bottom + padding) {
        return bin.id;
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

    const binId = findBinUnderPointer(e.clientX, e.clientY);
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (!item) return prev;

      if (binId && binId === item.correctBinId) {
        playSuccessChime();
        const next = prev.map((it) => (it.id === id ? { ...it, sortedBinId: binId } : it));
        const allSorted = next.every((it) => it.sortedBinId !== null);
        if (allSorted && !completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 900);
        }
        return next;
      }

      if (binId) playGentleNudge(); // dropped in a bin, but the wrong one
      return prev.map((it) => (it.id === id ? { ...it, offset: { x: 0, y: 0 } } : it)); // snap back
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {bins.map((bin) => (
          <div
            key={bin.id}
            ref={(el) => { binRefs.current[bin.id] = el; }}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] border-4 border-dashed border-sky-400 bg-sky-50 flex items-center justify-center"
          >
            {isColorDot(bin.labelAsset)
              ? <PreschoolColorDot asset={bin.labelAsset} size={56} />
              : <span className="text-5xl select-none" aria-hidden="true">{bin.labelAsset}</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 max-w-sm touch-none">
        {items.filter((it) => it.sortedBinId === null).map((it) => (
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
            {isColorDot(it.asset)
              ? <PreschoolColorDot asset={it.asset} size={56} />
              : it.asset}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
