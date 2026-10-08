import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage, PreschoolStoryFrame } from '../../data/preschool/types';
import { playGentleNudge, playSuccessChime } from './usePreschoolAudio';
import { PreschoolAsset } from './PreschoolAsset';

interface PreschoolStoryOrderProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

function shuffleFrames(list: PreschoolStoryFrame[]): PreschoolStoryFrame[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PreschoolStoryOrder: React.FC<PreschoolStoryOrderProps> = ({
  activity, language, onComplete,
}) => {
  const frames = activity.visualAssets.storyFrames ?? [];
  const [order, setOrder] = useState<PreschoolStoryFrame[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    setOrder(shuffleFrames(frames));
    setPicked([]);
    setWrongId(null);
    setSolved(false);
    doneRef.current = false;
  }, [activity.id]);

  const handleTap = (frame: PreschoolStoryFrame) => {
    if (solved || picked.includes(frame.id)) return;
    const nextIndex = picked.length + 1;
    if (frame.order !== nextIndex) {
      playGentleNudge();
      setWrongId(frame.id);
      setTimeout(() => {
        setWrongId(null);
        setPicked([]);
      }, 450);
      return;
    }
    const next = [...picked, frame.id];
    setPicked(next);
    if (next.length === frames.length && !doneRef.current) {
      doneRef.current = true;
      setSolved(true);
      playSuccessChime();
      setTimeout(onComplete, 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex items-center gap-2 text-lg font-black text-orange-800">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`min-h-10 min-w-10 rounded-full flex items-center justify-center border-2 ${
              picked.length >= n ? 'bg-emerald-400 border-emerald-600 text-white' : 'bg-white border-amber-200'
            }`}
          >
            {n}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {order.map((frame) => {
          const caption = frame.caption?.[language];
          const isPicked = picked.includes(frame.id);
          const isWrong = wrongId === frame.id;
          return (
            <motion.button
              key={frame.id}
              type="button"
              onClick={() => handleTap(frame)}
              animate={isWrong ? { x: [0, -8, 8, -8, 0] } : isPicked ? { scale: 1.06 } : { scale: 1 }}
              whileTap={solved ? undefined : { scale: 0.95 }}
              transition={isWrong ? { duration: 0.4 } : spring}
              disabled={solved}
              aria-label={caption ?? frame.asset}
              className={`min-h-28 rounded-3xl flex flex-col items-center justify-center gap-1
                          shadow-md border-4 cursor-pointer select-none px-1 py-2
                          ${isPicked
                            ? 'bg-emerald-100 border-emerald-400'
                            : isWrong
                              ? 'bg-rose-100 border-rose-400'
                              : 'bg-white border-amber-200'}`}
            >
              <PreschoolAsset asset={frame.asset} size={52} textClassName="text-4xl leading-none" />
              {caption && (
                <span className="text-[10px] font-black text-[#1E293B] leading-tight text-center">
                  {caption}
                </span>
              )}
              {isPicked && (
                <span className="text-xs font-black text-emerald-800">
                  {picked.indexOf(frame.id) + 1}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
