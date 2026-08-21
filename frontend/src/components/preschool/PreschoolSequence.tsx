import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';

interface PreschoolSequenceProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

/**
 * Affiche un pattern de symboles + un point d'interrogation à la fin,
 * puis 3 boutons-choix. Même logique douce que TapChoice : erreur = shake, jamais bloquant.
 */
export const PreschoolSequence: React.FC<PreschoolSequenceProps> = ({ activity, onComplete }) => {
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const pattern = activity.visualAssets.sequencePattern ?? [];
  const choices = activity.visualAssets.choices ?? [];

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
    <div className="flex flex-col items-center gap-8 w-full px-2">
      {/* Pattern row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {pattern.map((item, i) => (
          <div
            key={i}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-amber-200 shadow-sm
                       flex items-center justify-center text-3xl sm:text-4xl select-none"
          >
            {item}
          </div>
        ))}

        {/* Arrow */}
        <span className="text-2xl text-orange-400 font-black select-none">→</span>

        {/* Question mark slot */}
        <motion.div
          animate={{ scale: solved ? 0 : [1, 1.08, 1] }}
          transition={{ repeat: solved ? 0 : Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 border-2 border-dashed border-amber-400
                     flex items-center justify-center text-2xl font-black text-amber-600 shadow-sm select-none"
        >
          {solved
            ? choices.find(c => c.isCorrect)?.asset
            : '?'}
        </motion.div>
      </div>

      {/* Choices */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {choices.map(choice => (
          <motion.button
            key={choice.id}
            onClick={() => handleTap(choice.id, choice.isCorrect)}
            animate={
              wrongId === choice.id
                ? { x: [0, -10, 10, -10, 0] }
                : solved && choice.isCorrect
                ? { scale: [1, 1.25, 1] }
                : {}
            }
            transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.92 }}
            disabled={solved}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-4xl sm:text-5xl font-black
                        flex items-center justify-center shadow-lg border-4 cursor-pointer
                        transition-colors select-none
                        ${solved && choice.isCorrect
                          ? 'bg-emerald-400 border-emerald-600 text-white'
                          : 'bg-white border-amber-200 hover:border-amber-400 text-orange-900'}`}
          >
            {choice.asset}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
