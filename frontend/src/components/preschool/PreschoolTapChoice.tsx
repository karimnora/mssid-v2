import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolChoice, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { localizeGlyph, activityPicture } from './preschoolGlyphs';
import { PreschoolShapeMark, PreschoolColorDot, isGeometricShape, isColorDot } from './PreschoolShapeMark';

interface PreschoolTapChoiceProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
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

export const PreschoolTapChoice: React.FC<PreschoolTapChoiceProps> = ({ activity, language, onComplete }) => {
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [choices, setChoices] = useState<PreschoolChoice[]>([]);

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
      setWrongId(choiceId);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const prompt = activityPicture(activity, language);

  return (
    <div className="flex flex-col items-center gap-10 px-2">
      <motion.div
        key={activity.id}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
        className="w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] bg-white shadow-md border-4 border-amber-100
                   flex items-center justify-center"
      >
        <span className="text-7xl sm:text-8xl select-none" aria-hidden="true">{prompt}</span>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
        {choices.map((choice) => {
          const glyph = localizeGlyph(choice.asset, language);
          const caption = choice.label?.[language];
          const showColor = isColorDot(choice.asset);
          const showShape = !showColor && isGeometricShape(choice.asset);
          const isWin = solved && choice.isCorrect;
          const isWrong = wrongId === choice.id;

          return (
            <motion.button
              key={choice.id}
              onClick={() => handleTap(choice.id, choice.isCorrect)}
              animate={isWrong ? { x: [0, -10, 10, -10, 0] } : isWin ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={isWrong ? { duration: 0.4 } : spring}
              whileHover={solved ? undefined : { scale: 1.05 }}
              whileTap={solved ? undefined : { scale: 0.95 }}
              disabled={solved}
              aria-label={caption ?? glyph}
              className={`${caption
                ? 'min-h-28 min-w-24 w-24 sm:min-h-32 sm:w-28 py-2 flex-col gap-0.5'
                : 'min-h-24 min-w-24 w-24 h-24 sm:w-28 sm:h-28'}
                          rounded-3xl flex items-center justify-center
                          shadow-lg border-4 cursor-pointer select-none
                          ${isWin
                            ? 'bg-emerald-400 border-emerald-600'
                            : isWrong
                              ? 'bg-rose-100 border-rose-400'
                              : 'bg-white border-amber-200 hover:border-amber-400'}`}
            >
              {showColor
                ? <PreschoolColorDot asset={choice.asset} size={64} />
                : showShape
                  ? <PreschoolShapeMark asset={choice.asset} size={64} />
                  : (
                    <span className={`font-black text-orange-900 leading-none ${glyph.length > 1 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
                      {glyph}
                    </span>
                  )}
              {caption && (
                <span className="text-[10px] sm:text-[11px] font-black text-[#1E293B] leading-tight text-center px-1">
                  {caption}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
