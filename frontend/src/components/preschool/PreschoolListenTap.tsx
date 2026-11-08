import { usePreschoolEvidence } from './preschoolEvidence';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge, usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolListenTapProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

/** Hold the finish line until the spoken name can finish (TTS is fire-and-forget). */
export function speechHoldMs(text: string): number {
  const n = text.trim().length;
  return Math.min(3500, Math.max(800, 55 * n + 350));
}

// Tap each name to hear it. There is no wrong answer — finishing means every card was heard
// at least once (same high-success finish line as coloring).
export const PreschoolListenTap: React.FC<PreschoolListenTapProps> = ({
  activity, language, onComplete,
}) => {
  const cards = activity.visualAssets.listenCards ?? [];
  const correctId = activity.visualAssets.listenCorrectId;
  const quiz = Boolean(correctId);
  const { speak } = usePreschoolSpeech(language);
  const reportEvidence = usePreschoolEvidence();
  const [heardIds, setHeardIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setHeardIds(new Set());
    setWrongId(null);
    setSolved(false);
    completedRef.current = false;
  }, [activity.id]);

  const finishAfterSpeech = (name: string) => {
    if (completedRef.current) return;
    completedRef.current = true;
    playSuccessChime();
    setTimeout(onComplete, speechHoldMs(name) + 400);
  };

  const handleTap = (cardId: string, name: string) => {
    if (solved) return;
    if (quiz) {
      speak(name);
      if (cardId === correctId) {
        setSolved(true);
        finishAfterSpeech(name);
      } else {
        playGentleNudge();
        reportEvidence();
        setWrongId(cardId);
        setTimeout(() => setWrongId(null), 500);
      }
      return;
    }

    speak(name);
    setHeardIds((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      if (cards.length > 0 && cards.every((card) => next.has(card.id))) finishAfterSpeech(name);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-sm px-1">
      {cards.map((card) => {
        const name = card.label[language];
        const heard = heardIds.has(card.id);
        const isWin = solved && card.id === correctId;
        const isWrong = wrongId === card.id;
        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => handleTap(card.id, name)}
            animate={isWrong ? { x: [0, -10, 10, -10, 0] } : isWin ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            whileHover={solved ? undefined : { scale: 1.05 }}
            whileTap={solved ? undefined : { scale: 0.95 }}
            transition={isWrong ? { duration: 0.4 } : spring}
            disabled={solved}
            aria-label={name}
            className={`min-h-[60px] min-w-[60px] min-h-24 rounded-3xl flex flex-col items-center justify-center gap-1
                        shadow-md border-4 cursor-pointer select-none px-2 py-3
                        ${isWin || heard
                          ? 'bg-emerald-100 border-emerald-400'
                          : isWrong
                            ? 'bg-rose-100 border-rose-400'
                            : 'bg-white border-amber-200 hover:border-amber-400'}`}
          >
            <span className="text-3xl sm:text-4xl leading-none" aria-hidden="true">{card.asset}</span>
            {!quiz && (
              <span className="text-xs sm:text-sm font-black text-[#1E293B] leading-tight text-center">
                {name}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
