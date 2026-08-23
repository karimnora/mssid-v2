import React, { useEffect, useRef, useState } from 'react';
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
  label?: { ar: string; fr: string; en: string };
  correctBinId: string;
  sortedBinId: string | null;
  offset: { x: number; y: number };
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

function itemsFromActivity(activity: PreschoolActivity, language: PreschoolLanguage): ItemState[] {
  const list = activity.i18n[language].sortItems ?? activity.visualAssets.sortItems ?? [];
  return list.map((it) => ({
    id: it.id,
    asset: it.asset,
    label: it.label,
    correctBinId: it.correctBinId,
    sortedBinId: null,
    offset: { x: 0, y: 0 },
  }));
}

// Drag each item into the matching category bin (e.g. big vs small animals). Built on the same raw
// Pointer Events technique as PreschoolDragDrop, generalized to N bins. A wrong-bin drop never
// "locks in" — the item snaps back to the tray for another try, exactly like a wrong tap elsewhere
// in Mode Éveil: mistakes cost nothing but a soft sound.
export const PreschoolSorting: React.FC<PreschoolSortingProps> = ({ activity, language, onComplete }) => {
  const bins = activity.i18n[language].sortBins ?? activity.visualAssets.sortBins ?? [];
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [items, setItems] = useState<ItemState[]>(() => itemsFromActivity(activity, language));
  const draggingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);

  useEffect(() => {
    setItems(itemsFromActivity(activity, language));
    completedRef.current = false;
  }, [activity.id, language]);

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

      if (binId) playGentleNudge();
      return prev.map((it) => (it.id === id ? { ...it, offset: { x: 0, y: 0 } } : it));
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {bins.map((bin) => {
          const caption = bin.label?.[language];
          return (
            <div
              key={bin.id}
              ref={(el) => { binRefs.current[bin.id] = el; }}
              className="w-28 min-h-28 sm:w-32 sm:min-h-32 rounded-[1.75rem] border-4 border-dashed border-sky-400 bg-sky-50 flex flex-col items-center justify-center gap-1 px-2 py-3"
            >
              {isColorDot(bin.labelAsset)
                ? <PreschoolColorDot asset={bin.labelAsset} size={56} />
                : <span className="text-5xl select-none" aria-hidden="true">{bin.labelAsset}</span>}
              {caption && (
                <span className="text-[11px] font-black text-[#1E293B] text-center leading-tight">{caption}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-sm touch-none">
        {items.filter((it) => it.sortedBinId === null).map((it) => {
          const caption = it.label?.[language];
          return (
            <motion.div
              key={it.id}
              onPointerDown={(e) => handlePointerDown(e, it.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ x: it.offset.x, y: it.offset.y, touchAction: 'none' }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={`${caption
                ? 'min-h-16 px-3 py-2 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-2'
                : ''}
                            text-5xl cursor-grab active:cursor-grabbing select-none`}
              role="button"
              aria-label={caption ?? it.asset}
            >
              {isColorDot(it.asset)
                ? <PreschoolColorDot asset={it.asset} size={caption ? 28 : 56} />
                : <span className={caption ? 'text-2xl leading-none' : undefined} aria-hidden="true">{it.asset}</span>}
              {caption && (
                <span className="text-sm font-black text-[#1E293B] leading-none">{caption}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
