import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { PreschoolColorDot, isColorDot } from './PreschoolShapeMark';

interface PreschoolMemoryCardsProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

interface Card {
  cardId: string;
  pairId: string;
  asset: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Classic flip-and-match memory game, capped at 2x3 (6 cards / 3 pairs) per the age-appropriate
// design rule — anything bigger overloads working memory at 3-5 years old. Defaults to 2x2 (2 pairs)
// unless the activity supplies 3 pairs.
export const PreschoolMemoryCards: React.FC<PreschoolMemoryCardsProps> = ({ activity, onComplete }) => {
  const pairs = (activity.visualAssets.memoryPairs || []).slice(0, 3); // hard MVP ceiling: 3 pairs

  const cards = useMemo<Card[]>(() => {
    const doubled: Card[] = pairs.flatMap((p) => [
      { cardId: `${p.id}-a`, pairId: p.id, asset: p.asset },
      { cardId: `${p.id}-b`, pairId: p.id, asset: p.asset },
    ]);
    return shuffle(doubled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id]);

  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const handleFlip = (card: Card) => {
    if (busy || flippedIds.includes(card.cardId) || matchedPairIds.includes(card.pairId)) return;

    const nextFlipped = [...flippedIds, card.cardId];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setBusy(true);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.cardId === firstId)!;
      const second = cards.find((c) => c.cardId === secondId)!;

      if (first.pairId === second.pairId) {
        playSuccessChime();
        setTimeout(() => {
          const nextMatched = [...matchedPairIds, first.pairId];
          setMatchedPairIds(nextMatched);
          setFlippedIds([]);
          setBusy(false);
          // Short pause for the last pair's own green flash — PreschoolActivityPlayer's celebration
          // overlay adds its own (longer) pause before advancing, so this no longer needs to. (The
          // 500ms delay this callback is already inside is separate: it's what lets both flipped
          // cards be seen before they're marked matched, and stays as-is.)
          if (nextMatched.length === pairs.length) setTimeout(onComplete, 350);
        }, 500);
      } else {
        playGentleNudge();
        setTimeout(() => {
          setFlippedIds([]);
          setBusy(false);
        }, 800);
      }
    }
  };

  const gridColsClass = cards.length > 4 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className={`grid ${gridColsClass} gap-4 max-w-xs mx-auto`}>
      {cards.map((card) => {
        const isFaceUp = flippedIds.includes(card.cardId) || matchedPairIds.includes(card.pairId);
        return (
          <motion.button
            key={card.cardId}
            onClick={() => handleFlip(card)}
            whileTap={{ scale: 0.94 }}
            animate={matchedPairIds.includes(card.pairId) ? { scale: [1, 1.1, 1] } : {}}
            className={`min-h-24 min-w-24 w-24 h-24 rounded-2xl text-4xl flex items-center justify-center shadow-md border-4 cursor-pointer transition-colors ${
              matchedPairIds.includes(card.pairId)
                ? 'bg-emerald-300 border-emerald-500'
                : isFaceUp
                ? 'bg-white border-amber-400'
                : 'bg-amber-300 border-amber-500'
            }`}
          >
            {isFaceUp
              ? (isColorDot(card.asset) ? <PreschoolColorDot asset={card.asset} size={48} /> : card.asset)
              : '❓'}
          </motion.button>
        );
      })}
    </div>
  );
};
