import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolListenTapProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

// Tap each name to hear it. There is no wrong answer — finishing means every card was heard
// at least once (same high-success finish line as coloring).
export const PreschoolListenTap: React.FC<PreschoolListenTapProps> = ({
  activity, language, onComplete,
}) => {
  const cards = activity.visualAssets.listenCards ?? [];
  const { speak } = usePreschoolSpeech(language);
  const [heardIds, setHeardIds] = useState<Set<string>>(new Set());
  const completedRef = useRef(false);

  useEffect(() => {
    setHeardIds(new Set());
    completedRef.current = false;
  }, [activity.id]);

  const handleTap = (cardId: string, name: string) => {
    speak(name);
    setHeardIds((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      if (cards.length > 0 && cards.every((card) => next.has(card.id)) && !completedRef.current) {
        completedRef.current = true;
        playSuccessChime();
        // Kept a bit longer than the other interaction types' post-success pause: unlike them, the
        // last tap here also triggers a spoken name via `speak()`, and this is the only window
        // before PreschoolActivityPlayer's own speak() call cuts it off.
        setTimeout(onComplete, 500);
      }
      return next;
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-sm px-1">
      {cards.map((card) => {
        const name = card.label[language];
        const heard = heardIds.has(card.id);
        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => handleTap(card.id, name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            aria-label={name}
            className={`min-h-24 rounded-3xl flex flex-col items-center justify-center gap-1
                        shadow-md border-4 cursor-pointer select-none px-2 py-3
                        ${heard
                          ? 'bg-emerald-100 border-emerald-400'
                          : 'bg-white border-amber-200 hover:border-amber-400'}`}
          >
            <span className="text-3xl sm:text-4xl leading-none" aria-hidden="true">{card.asset}</span>
            <span className="text-xs sm:text-sm font-black text-[#1E293B] leading-tight text-center">
              {name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
