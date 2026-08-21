import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade } from '../../types';

interface NumberSortGameProps {
  grade: PrimaryGrade;
  onExit: () => void;
  onComplete: (xp: number) => void;
}

interface Level {
  numbers: number[];
  direction: 'asc' | 'desc';
  labelAr: string;
  labelFr: string;
}

const LEVELS: Level[] = [
  {
    numbers: [7, 2, 15, 4],
    direction: 'asc',
    labelAr: 'رتّب 4 أعداد من الأصغر إلى الأكبر',
    labelFr: 'Trie 4 nombres du plus petit au plus grand',
  },
  {
    numbers: [342, 58, 901, 27, 480],
    direction: 'asc',
    labelAr: 'رتّب 5 أعداد من الأصغر إلى الأكبر',
    labelFr: 'Trie 5 nombres du plus petit au plus grand',
  },
  {
    numbers: [5430, 892, 3007, 7654, 1200, 400],
    direction: 'asc',
    labelAr: 'رتّب 6 أعداد من الأصغر إلى الأكبر',
    labelFr: 'Trie 6 nombres du plus petit au plus grand',
  },
  {
    numbers: [12500, 8750, 3200, 99999, 45000, 1050, 67800],
    direction: 'desc',
    labelAr: 'رتّب 7 أعداد من الأكبر إلى الأصغر',
    labelFr: 'Trie 7 nombres du plus grand au plus petit',
  },
];

function isSorted(nums: number[], direction: 'asc' | 'desc'): boolean {
  for (let i = 0; i < nums.length - 1; i++) {
    if (direction === 'asc' ? nums[i] > nums[i + 1] : nums[i] < nums[i + 1]) return false;
  }
  return true;
}

function isCorrectPosition(nums: number[], index: number, direction: 'asc' | 'desc'): boolean {
  const sorted = [...nums].sort((a, b) => (direction === 'asc' ? a - b : b - a));
  return nums[index] === sorted[index];
}

export const NumberSortGame: React.FC<NumberSortGameProps> = ({ grade, onExit, onComplete }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([...LEVELS[0].numbers]);
  const [selected, setSelected] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const level = LEVELS[levelIdx];

  useEffect(() => {
    setNumbers([...LEVELS[levelIdx].numbers]);
    setSelected(null);
    setWon(false);
  }, [levelIdx]);

  const handleTap = useCallback(
    (idx: number) => {
      if (won) return;
      if (selected === null) {
        setSelected(idx);
      } else if (selected === idx) {
        setSelected(null);
      } else {
        const newNums = [...numbers];
        [newNums[selected], newNums[idx]] = [newNums[idx], newNums[selected]];
        setNumbers(newNums);
        setSelected(null);
        if (isSorted(newNums, level.direction)) {
          setWon(true);
          const earned = 15 + levelIdx * 5;
          setTotalXp((prev) => prev + earned);
          setTimeout(() => setShowLevelComplete(true), 600);
        }
      }
    },
    [selected, numbers, won, level.direction, levelIdx]
  );

  const handleNext = () => {
    setShowLevelComplete(false);
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx((prev) => prev + 1);
    } else {
      onComplete(totalXp);
    }
  };

  const gradeLabel = grade <= '2AP' ? '1AP–2AP' : grade <= '3AP' ? '3AP' : '4AP–5AP';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4 pb-8" dir="rtl">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="bg-white/80 rounded-2xl px-4 py-2 text-slate-600 font-bold shadow text-sm"
        >
          ← خروج
        </button>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-blue-700">🔢 طابور الأعداد</h1>
          <p className="text-xs text-blue-400">المستوى {levelIdx + 1} / {LEVELS.length}</p>
        </div>
        <div className="bg-amber-100 rounded-2xl px-4 py-2 text-amber-700 font-bold shadow text-sm">
          ⭐ {totalXp} XP
        </div>
      </div>

      {/* Instruction */}
      <motion.div
        key={levelIdx}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-md px-6 py-4 mb-8 text-center w-full max-w-md"
      >
        <p className="text-blue-800 font-bold text-base">{level.labelAr}</p>
        <p className="text-blue-400 text-sm mt-1">{level.labelFr}</p>
        <p className="text-xs text-slate-400 mt-2">
          {selected !== null ? '👆 اختر عدداً آخر للتبادل' : '👆 اضغط على عدد لاختياره'}
        </p>
      </motion.div>

      {/* Numbers Grid */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
        {numbers.map((num, idx) => {
          const isSelected = selected === idx;
          const correct = isCorrectPosition(numbers, idx, level.direction);
          return (
            <motion.button
              key={`${levelIdx}-${idx}`}
              onClick={() => handleTap(idx)}
              whileTap={{ scale: 0.92 }}
              animate={
                isSelected
                  ? { scale: 1.1, rotate: 3 }
                  : won && correct
                  ? { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 0.8 } }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={`
                rounded-3xl shadow-lg font-extrabold text-xl min-w-[72px] px-4 py-5
                transition-all duration-200
                ${isSelected
                  ? 'bg-amber-400 text-white ring-4 ring-amber-300 shadow-amber-200'
                  : won && correct
                  ? 'bg-emerald-400 text-white shadow-emerald-200'
                  : 'bg-white text-blue-800 hover:bg-sky-50'
                }
              `}
            >
              {num.toLocaleString('ar-DZ')}
            </motion.button>
          );
        })}
      </div>

      {/* Direction hint */}
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm">
        {level.direction === 'asc' ? (
          <span>الأصغر ← الأكبر &nbsp; {numbers.map((n) => n.toLocaleString('ar-DZ')).join(' ← ')}</span>
        ) : (
          <span>الأكبر ← الأصغر</span>
        )}
      </div>

      {/* Level Complete Overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
            >
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-extrabold text-emerald-600 mb-1">أحسنت!</h2>
              <p className="text-slate-500 mb-4">
                {levelIdx < LEVELS.length - 1 ? `استعد للمستوى ${levelIdx + 2}` : 'أكملت جميع المستويات!'}
              </p>
              <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-5 text-amber-700 font-bold text-lg">
                +{15 + levelIdx * 5} XP مكسوبة ⭐
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl px-8 py-3 font-bold text-base shadow-lg w-full"
              >
                {levelIdx < LEVELS.length - 1 ? 'المستوى التالي →' : 'إنهاء اللعبة 🏆'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
