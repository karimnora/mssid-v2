import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playBubblePop, playSuccessChime } from './usePreschoolAudio';

interface PreschoolBubblePopProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

interface Bubble {
  id: string;
  x: number; // percent, 10-90
  y: number; // percent, 10-80
  delay: number;
}

// Original "creative_extra" mini-game: pop every floating bubble. Very high tactile satisfaction
// (bounce + pop + sound) for minimal cognitive load — good for counting reinforcement (each pop is
// one more, with the mascot able to count aloud) without any "right/wrong" pressure at all: every
// tap is correct, the only goal is "pop them all".
export const PreschoolBubblePop: React.FC<PreschoolBubblePopProps> = ({ activity, onComplete }) => {
  const count = activity.visualAssets.bubbleCount || 3;
  const asset = activity.visualAssets.bubbleAsset || activity.visualAssets.mainSvgOrImage;

  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: `bubble-${i}`,
      x: 15 + Math.random() * 70,
      y: 10 + Math.random() * 65,
      delay: i * 0.15,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, count]);

  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const completedTriggered = React.useRef(false);

  const handlePop = (id: string) => {
    if (poppedIds.includes(id)) return;
    playBubblePop();
    const next = [...poppedIds, id];
    setPoppedIds(next);
    if (next.length === bubbles.length && !completedTriggered.current) {
      completedTriggered.current = true;
      playSuccessChime();
      setTimeout(onComplete, 900);
    }
  };

  return (
    <div className="relative w-full max-w-sm h-72 sm:h-80 rounded-[2rem] bg-gradient-to-b from-sky-200 to-sky-50 border-4 border-sky-300 overflow-hidden">
      <div className="absolute top-2 inset-x-0 flex justify-center">
        <span className="bg-white/90 text-sky-700 text-sm font-black px-3 py-1 rounded-full shadow">
          {poppedIds.length} / {bubbles.length}
        </span>
      </div>

      <AnimatePresence>
        {bubbles.filter((b) => !poppedIds.includes(b.id)).map((bubble) => (
          <motion.button
            key={bubble.id}
            onClick={() => handlePop(bubble.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: bubble.delay }, default: { duration: 0.3, delay: bubble.delay } }}
            whileTap={{ scale: 1.3 }}
            style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/60 border-2 border-white shadow-lg flex items-center justify-center text-3xl cursor-pointer select-none"
            aria-label={asset}
          >
            {asset}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};
