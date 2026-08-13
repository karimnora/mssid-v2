import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';

interface PreschoolTapChoiceProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

// Tap the correct choice among a few big buttons. Unlimited attempts — a wrong tap gets a soft
// shake + gentle sound and stays tappable again immediately, it never blocks or counts against the
// child (no "hearts" system at this age, see UX audit).
export const PreschoolTapChoice: React.FC<PreschoolTapChoiceProps> = ({ activity, onComplete }) => {
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const choices = activity.visualAssets.choices || [];

  const handleTap = (choiceId: string, isCorrect: boolean) => {
    if (solved) return;
    if (isCorrect) {
      setSolved(true);
      playSuccessChime();
      setTimeout(onComplete, 900);
    } else {
      playGentleNudge();
      setWrongId(choiceId);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-8xl sm:text-9xl select-none" aria-hidden="true">
        {activity.visualAssets.mainSvgOrImage}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5">
        {choices.map((choice) => (
          <motion.button
            key={choice.id}
            onClick={() => handleTap(choice.id, choice.isCorrect)}
            animate={wrongId === choice.id ? { x: [0, -10, 10, -10, 0] } : solved && choice.isCorrect ? { scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.92 }}
            disabled={solved}
            className={`min-h-24 min-w-24 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-4xl sm:text-5xl font-black flex items-center justify-center shadow-lg border-4 cursor-pointer transition-colors ${
              solved && choice.isCorrect
                ? 'bg-emerald-400 border-emerald-600 text-white'
                : 'bg-white border-amber-200 hover:border-amber-400 text-orange-900'
            }`}
          >
            {choice.asset}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
