import { usePreschoolEvidence } from './preschoolEvidence';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolChoice, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { PreschoolColorDot, isColorDot } from './PreschoolShapeMark';

interface PreschoolSequenceProps {
  activity: PreschoolActivity;
  language?: PreschoolLanguage;
  onComplete: () => void;
}

function shuffleChoices(list: PreschoolChoice[]): PreschoolChoice[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

/**
 * Pattern row (always LTR — math convention) + "?" + shuffled choices.
 * Resets when the activity changes so Suivant does not leave a frozen puzzle.
 */
export const PreschoolSequence: React.FC<PreschoolSequenceProps> = ({
  activity, language = 'fr', onComplete,
}) => {
  const reportEvidence = usePreschoolEvidence();
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [choices, setChoices] = useState<PreschoolChoice[]>([]);

  const pattern = activity.visualAssets.sequencePattern ?? [];
  const answer = activity.visualAssets.choices?.find((c) => c.isCorrect)?.asset ?? '⭐';

  useEffect(() => {
    setSolved(false);
    setWrongId(null);
    setChoices(shuffleChoices(activity.visualAssets.choices || []));
  }, [activity.id]);

  const handleTap = (choiceId: string, isCorrect: boolean) => {
    if (solved) return;
    if (isCorrect) {
      setSolved(true);
      playSuccessChime();
      setTimeout(onComplete, 900);
    } else {
      playGentleNudge();
      reportEvidence();
      setWrongId(choiceId);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full px-2">
      <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2">
        {pattern.map((item, i) => (
          <div
            key={`${activity.id}-${i}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-amber-200 shadow-sm
                       flex items-center justify-center text-3xl sm:text-4xl select-none"
          >
            {isColorDot(item) ? <PreschoolColorDot asset={item} size={40} /> : item}
          </div>
        ))}

        <span className="text-2xl text-orange-400 font-black select-none" aria-hidden>
          →
        </span>

        <motion.div
          key={`${activity.id}-slot`}
          animate={solved ? { scale: [1, 1.2, 1] } : { scale: [1, 1.08, 1] }}
          transition={solved ? spring : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm select-none
                      ${solved
                        ? 'bg-emerald-100 border-4 border-emerald-400'
                        : 'bg-amber-100 border-2 border-dashed border-amber-400 text-amber-600'}`}
        >
          {solved
            ? (isColorDot(answer) ? <PreschoolColorDot asset={answer} size={40} /> : answer)
            : '?'}
        </motion.div>
      </div>

      <p className="text-sm font-black text-orange-800 text-center">
        {language === 'ar' ? 'مَاذَا يَأْتِي بَعْد؟' : language === 'fr' ? 'Qu\'est-ce qui vient ensuite ?' : 'What comes next?'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {choices.map((choice) => (
          <motion.button
            key={choice.id}
            onClick={() => handleTap(choice.id, choice.isCorrect)}
            animate={
              wrongId === choice.id
                ? { x: [0, -10, 10, -10, 0] }
                : solved && choice.isCorrect
                  ? { scale: [1, 1.2, 1] }
                  : { scale: 1 }
            }
            transition={wrongId === choice.id ? { duration: 0.4 } : spring}
            whileHover={solved ? undefined : { scale: 1.05 }}
            whileTap={solved ? undefined : { scale: 0.95 }}
            disabled={solved}
            className={`min-h-[60px] min-w-[60px] w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-4xl sm:text-5xl font-black
                        flex items-center justify-center shadow-lg border-4 cursor-pointer
                        select-none
                        ${solved && choice.isCorrect
                          ? 'bg-emerald-400 border-emerald-600 text-white'
                          : wrongId === choice.id
                            ? 'bg-rose-100 border-rose-400'
                            : 'bg-white border-amber-200 hover:border-amber-400 text-orange-900'}`}
          >
            {isColorDot(choice.asset)
              ? <PreschoolColorDot asset={choice.asset} size={56} />
              : choice.asset}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
