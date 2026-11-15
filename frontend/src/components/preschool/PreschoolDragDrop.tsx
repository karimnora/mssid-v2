import { usePreschoolEvidence } from './preschoolEvidence';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playGentleNudge, playSuccessChime, usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolDragDropProps {
  activity: PreschoolActivity;
  language?: PreschoolLanguage;
  onComplete: () => void;
}

interface ItemState {
  id: string;
  asset: string;
  dropped: boolean;
  offset: { x: number; y: number };
}

const DONE: Record<PreschoolLanguage, string> = {
  ar: 'أَنْهَيْتُ',
  fr: "J'ai fini",
  en: "I'm done",
};

const TOO_SOON: Record<PreschoolLanguage, string> = {
  ar: 'لَيْسَ بَعْد! عُدَّ مَرَّةً أُخْرَى',
  fr: 'Pas encore ! Compte encore',
  en: 'Not yet! Count again',
};

// Counting via drag-and-drop, built on raw Pointer Events (not HTML5 native drag, which barely works
// on touch/mobile Safari). The child decides when the collection is complete — "I'm done" — instead
// of auto-winning at the target count.
export const PreschoolDragDrop: React.FC<PreschoolDragDropProps> = ({
  activity, language = 'ar', onComplete,
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragItems = activity.visualAssets.dragItems || [];
  const reportEvidence = usePreschoolEvidence();
  const [items, setItems] = useState<ItemState[]>(
    dragItems.map((item) => ({ id: item.id, asset: item.asset, dropped: false, offset: { x: 0, y: 0 } }))
  );
  const dragged = useRef(false);
  const draggingId = useRef<string | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);
  const [tooSoon, setTooSoon] = useState(false);
  const { speak } = usePreschoolSpeech(language);

  const target = activity.visualAssets.dropZoneCount || dragItems.length;
  const hasExtras = dragItems.length > target;
  // Guided step: the target is shown and the basket stops at it. Without help, the child counts on
  // their own: the basket accepts more than asked and "I'm done" checks the exact number.
  const guided = !!activity.showQuantityGuide;
  const basketFull = (prev: ItemState[]) => guided && hasExtras && prev.filter((it) => it.dropped).length >= target;

  const isOverDropZone = (clientX: number, clientY: number): boolean => {
    const zone = dropZoneRef.current;
    if (!zone) return false;
    const rect = zone.getBoundingClientRect();
    const padding = 40;
    return (
      clientX >= rect.left - padding &&
      clientX <= rect.right + padding &&
      clientY >= rect.top - padding &&
      clientY <= rect.bottom + padding
    );
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragged.current = false;
    draggingId.current = id;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const id = draggingId.current;
    if (!id) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 8) dragged.current = true;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, offset: { x: dx, y: dy } } : it)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const id = draggingId.current;
    draggingId.current = null;
    if (!id) return;

    const dropped = isOverDropZone(e.clientX, e.clientY);
    setItems((prev) => {
      if (dropped && basketFull(prev)) {
        playGentleNudge();
        return prev.map((it) => (it.id === id ? { ...it, offset: { x: 0, y: 0 } } : it));
      }
      return prev.map((it) => (
        it.id === id
          ? { ...it, dropped: dropped ? true : it.dropped, offset: dropped ? it.offset : { x: 0, y: 0 } }
          : it
      ));
    });
  };

  const addToBasket = (id: string) => {
    if (completedRef.current) return;
    setItems(prev => {
      if (basketFull(prev)) {
        playGentleNudge();
        return prev;
      }
      return prev.map(item => item.id === id ? { ...item, dropped: true, offset: { x: 0, y: 0 } } : item);
    });
  };

  const returnToTray = (id: string) => {
    if (completedRef.current) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, dropped: false, offset: { x: 0, y: 0 } } : it)));
  };

  const handleDone = () => {
    if (completedRef.current) return;
    const droppedCount = items.filter((it) => it.dropped).length;
    const enough = hasExtras ? droppedCount === target : droppedCount >= target;
    if (!enough) {
      reportEvidence();
      playGentleNudge();
      speak(TOO_SOON[language]);
      setTooSoon(true);
      window.setTimeout(() => setTooSoon(false), 1800);
      return;
    }
    completedRef.current = true;
    playSuccessChime();
    setTimeout(onComplete, 900);
  };

  const droppedCount = items.filter((it) => it.dropped).length;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div
        ref={dropZoneRef}
        className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[2rem] border-4 border-dashed border-amber-400 bg-amber-50 flex flex-col items-center justify-center p-2"
      >
        <span className="text-6xl select-none" aria-hidden="true">{activity.visualAssets.mainSvgOrImage}</span>
        {activity.showQuantityGuide && (
          <div aria-hidden="true" className="flex flex-wrap justify-center gap-1 max-w-36" data-quantity-guide>
            {Array.from({ length: target }, (_, i) => <span key={i} className={`h-4 w-4 rounded-full border-2 ${i < droppedCount ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-amber-400'}`} />)}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-1 min-h-8">
          {items.filter((it) => it.dropped).map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => returnToTray(it.id)}
              aria-label={`${it.asset} basket`}
              className="min-h-[60px] min-w-[60px] text-2xl leading-none cursor-pointer "
            >
              {it.asset}
            </button>
          ))}
        </div>
        <span className="absolute -bottom-3 bg-emerald-500 text-white text-sm font-black px-3 py-1 rounded-full shadow">
          <bdi dir="ltr">{guided ? `${droppedCount} / ${target}` : droppedCount}</bdi>
        </span>
      </div>

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
            tabIndex={0}
            onClick={() => { if (!dragged.current) addToBasket(it.id); }}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); addToBasket(it.id); } }}
            aria-label={it.asset}
          >
            {it.asset}
          </motion.div>
        ))}
      </div>

      {tooSoon && (
        <p
          data-preschool-count="nudge"
          className="w-full max-w-sm text-center text-sm font-black text-[#0f172a]
                     bg-[#FFF8E7] border-2 border-[#E7E2D7] rounded-2xl px-3 py-2"
        >
          {TOO_SOON[language]}
        </p>
      )}

      <motion.button
        type="button"
        data-preschool-count="done"
        aria-label={DONE[language]}
        whileTap={{ scale: 0.95 }}
        onClick={handleDone}
        className="min-w-[60px] w-full max-w-sm min-h-[72px] rounded-3xl px-4 text-lg font-black cursor-pointer
 bg-[#008751] text-white border-2 border-emerald-300"
      >
        {DONE[language]}
      </motion.button>
    </div>
  );
};
