import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { localizeGlyph, localizePicture } from './preschoolGlyphs';

interface PreschoolConnectDotsProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Match pairs by tapping — left item, then its right match — instead of drawing a precise line
// between two arbitrary points (unreliable with a toddler's finger, and visually noisy). A matched
// pair turns green with a checkmark; a wrong tap gets a gentle nudge and both deselect for retry.
export const PreschoolConnectDots: React.FC<PreschoolConnectDotsProps> = ({ activity, language, onComplete }) => {
  const pairs = activity.visualAssets.connectPairs || [];
  const shuffledRight = useMemo(() => shuffle(pairs), [pairs]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPulseId, setWrongPulseId] = useState<string | null>(null);

  const handleTapLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeftId(id);
  };

  const handleTapRight = (rightPairId: string) => {
    if (!selectedLeftId || matchedIds.includes(rightPairId)) return;
    if (selectedLeftId === rightPairId) {
      const nextMatched = [...matchedIds, selectedLeftId];
      setMatchedIds(nextMatched);
      setSelectedLeftId(null);
      playSuccessChime();
      if (nextMatched.length === pairs.length) {
        setTimeout(onComplete, 900);
      }
    } else {
      setWrongPulseId(rightPairId);
      playGentleNudge();
      setTimeout(() => {
        setWrongPulseId(null);
        setSelectedLeftId(null);
      }, 450);
    }
  };

  return (
    <div className="flex items-start justify-center gap-10 sm:gap-16 w-full max-w-sm">
      <div className="flex flex-col gap-4">
        {pairs.map((pair) => {
          const isMatched = matchedIds.includes(pair.id);
          const isSelected = selectedLeftId === pair.id;
          return (
            <motion.button
              key={pair.id}
              onClick={() => handleTapLeft(pair.id)}
              whileTap={!isMatched ? { scale: 0.9 } : undefined}
              disabled={isMatched}
              className={`min-h-20 min-w-20 w-20 h-20 rounded-2xl text-4xl flex items-center justify-center shadow-md border-4 transition-colors cursor-pointer ${
                isMatched
                  ? 'bg-emerald-400 border-emerald-600'
                  : isSelected
                  ? 'bg-amber-300 border-amber-500'
                  : 'bg-white border-amber-200'
              }`}
            >
              {isMatched ? '✅' : localizePicture(pair.leftAsset, language)}
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {shuffledRight.map((pair) => {
          const isMatched = matchedIds.includes(pair.id);
          const isWrong = wrongPulseId === pair.id;
          return (
            <motion.button
              key={pair.id}
              onClick={() => handleTapRight(pair.id)}
              whileTap={!isMatched ? { scale: 0.9 } : undefined}
              animate={isWrong ? { x: [0, -8, 8, -8, 0] } : {}}
              disabled={isMatched}
              className={`min-h-20 min-w-20 w-20 h-20 rounded-2xl text-4xl flex items-center justify-center shadow-md border-4 transition-colors cursor-pointer ${
                isMatched ? 'bg-emerald-400 border-emerald-600' : 'bg-white border-sky-200'
              }`}
            >
              {isMatched ? '✅' : localizeGlyph(pair.rightAsset, language)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
