import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade } from '../../types';
import { playSuccessChime, playGentleNudge, playModuleCompleteFanfare } from '../preschool/usePreschoolAudio';
import { Trophy, Timer, Zap, Flame, RefreshCw, ArrowRight, Award, Sparkles, Heart } from 'lucide-react';

interface SpeedMathDuelGameProps {
  grade?: PrimaryGrade;
  onExit?: () => void;
  onComplete?: (earnedXp: number, coins: number) => void;
}

interface MathProblem {
  id: string;
  equation: string;
  options: number[];
  correctAnswer: number;
  tip?: string;
}

function generateMathProblem(grade: PrimaryGrade = '3AP'): MathProblem {
  const id = Math.random().toString(36).substring(2, 9);
  let equation = '';
  let correctAnswer = 0;
  let tip = '';

  if (grade === '1AP') {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    const isAdd = Math.random() > 0.3;
    if (isAdd) {
      correctAnswer = a + b;
      equation = `${a} + ${b} = ؟`;
      tip = 'احسب مجموع الخشيبات معاً';
    } else {
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      correctAnswer = max - min;
      equation = `${max} - ${min} = ؟`;
      tip = 'انقص العدد الصغير من الكبير';
    }
  } else if (grade === '2AP') {
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      const a = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 5;
      correctAnswer = a + b;
      equation = `${a} + ${b} = ؟`;
    } else {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * 20) + 1;
      correctAnswer = a - b;
      equation = `${a} - ${b} = ؟`;
    }
  } else if (grade === '3AP') {
    const op = Math.random();
    if (op < 0.6) {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      correctAnswer = a * b;
      equation = `${a} × ${b} = ؟`;
      tip = `جدول الضرب للعدد ${a}`;
    } else {
      const a = Math.floor(Math.random() * 150) + 50;
      const b = Math.floor(Math.random() * 100) + 25;
      correctAnswer = a + b;
      equation = `${a} + ${b} = ؟`;
    }
  } else if (grade === '4AP') {
    const op = Math.random();
    if (op < 0.5) {
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      correctAnswer = a * b;
      equation = `${a} × ${b} = ؟`;
    } else if (op < 0.8) {
      const divisor = Math.floor(Math.random() * 7) + 2;
      const quotient = Math.floor(Math.random() * 12) + 2;
      const dividend = divisor * quotient;
      correctAnswer = quotient;
      equation = `${dividend} ÷ ${divisor} = ؟`;
      tip = 'عكس عملية الضرب';
    } else {
      const a = Math.floor(Math.random() * 400) + 100;
      const b = Math.floor(Math.random() * 300) + 50;
      correctAnswer = a + b;
      equation = `${a} + ${b} = ؟ دج`;
    }
  } else {
    // 5AP
    const op = Math.random();
    if (op < 0.4) {
      const a = Math.floor(Math.random() * 12) + 3;
      const b = Math.floor(Math.random() * 12) + 3;
      correctAnswer = a * b;
      equation = `${a} × ${b} = ؟`;
    } else if (op < 0.7) {
      const divisor = Math.floor(Math.random() * 8) + 3;
      const quotient = Math.floor(Math.random() * 15) + 3;
      const dividend = divisor * quotient;
      correctAnswer = quotient;
      equation = `${dividend} ÷ ${divisor} = ؟`;
    } else {
      const a = Math.floor(Math.random() * 15) + 2;
      const b = 100;
      correctAnswer = a * b;
      equation = `${a} × 100 = ؟`;
    }
  }

  // Generate distinct distractors
  const optionsSet = new Set<number>([correctAnswer]);
  while (optionsSet.size < 4) {
    const delta = Math.floor(Math.random() * 6) + 1;
    const sign = Math.random() > 0.5 ? 1 : -1;
    const wrong = correctAnswer + delta * sign;
    if (wrong >= 0) optionsSet.add(wrong);
  }

  return {
    id,
    equation,
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
    correctAnswer,
    tip,
  };
}

export const SpeedMathDuelGame: React.FC<SpeedMathDuelGameProps> = ({
  grade = '3AP',
  onExit,
  onComplete,
}) => {
  const TOTAL_TIME = grade === '1AP' || grade === '2AP' ? 75 : 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [problem, setProblem] = useState<MathProblem>(() => generateMathProblem(grade));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [powerFreezeUsed, setPowerFreezeUsed] = useState(false);
  const [powerFiftyUsed, setPowerFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFinish = useCallback(() => {
    setIsGameOver(true);
    playModuleCompleteFanfare();
    const earnedXp = Math.max(15, score * 5 + bestStreak * 3);
    const earnedCoins = Math.max(10, Math.floor(score * 2.5));
    onComplete?.(earnedXp, earnedCoins);
  }, [score, bestStreak, onComplete]);

  // The countdown interval below is only (re)created when isGameOver flips, so its closure
  // would otherwise keep calling the handleFinish from that render — stale score/bestStreak,
  // meaning a natural timeout always paid out the minimum reward. A ref always holds the
  // latest handleFinish so the interval calls the up-to-date version without needing to be
  // torn down and rebuilt on every score change (which would jitter the 1s cadence).
  const handleFinishRef = useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // Countdown timer
  useEffect(() => {
    if (isGameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  const handleSelectOption = (opt: number) => {
    if (feedback !== null || isGameOver) return;
    setSelectedOption(opt);

    if (opt === problem.correctAnswer) {
      playSuccessChime();
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      setScore((s) => s + 10 * multiplier);

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        setHiddenOptions([]);
        setProblem(generateMathProblem(grade));
      }, 500);
    } else {
      playGentleNudge();
      setFeedback('wrong');
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => {
          handleFinish();
        }, 800);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setSelectedOption(null);
        }, 600);
      }
    }
  };

  const handleUseFreeze = () => {
    if (powerFreezeUsed || isGameOver) return;
    setPowerFreezeUsed(true);
    setTimeLeft((t) => t + 15);
  };

  const handleUseFifty = () => {
    if (powerFiftyUsed || isGameOver) return;
    setPowerFiftyUsed(true);
    const wrongOptions = problem.options.filter((o) => o !== problem.correctAnswer);
    const toHide = wrongOptions.slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleRestart = () => {
    setTimeLeft(TOTAL_TIME);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setIsGameOver(false);
    setFeedback(null);
    setSelectedOption(null);
    setPowerFreezeUsed(false);
    setPowerFiftyUsed(false);
    setHiddenOptions([]);
    setProblem(generateMathProblem(grade));
  };

  return (
    <div data-lab-instrument className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-slate-900 text-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 relative overflow-hidden" dir="rtl">
      {/* Background Neon Accent Glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">سباق الحساب الخاطف</h2>
            <span className="text-xs text-emerald-400 font-bold">مستوى {grade}</span>
          </div>
        </div>

        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <span>خروج</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isGameOver ? (
        <div className="space-y-5">
          {/* Status HUD (Lives, Timer, Score, Multiplier) */}
          <div className="grid grid-cols-4 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 backdrop-blur-md">
            {/* Lives */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 font-bold mb-1">الفرص</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    className={`w-4 h-4 transition-all ${
                      heart <= lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 scale-75 opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Time Left */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 font-bold mb-1 flex items-center gap-1">
                <Timer className="w-3 h-3 text-amber-400" />
                <span>الوقت</span>
              </span>
              <span className={`text-base font-black ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 font-bold mb-1">النقاط</span>
              <span className="text-base font-black text-emerald-400 font-mono">{score}</span>
            </div>

            {/* Streak Multiplier */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 font-bold mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>حماس</span>
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {streak >= 5 ? 'x3 🔥' : streak >= 3 ? 'x2 ⚡' : 'x1'}
              </span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-amber-400'}`}
              animate={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Power-ups Bar */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleUseFifty}
              disabled={powerFiftyUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                powerFiftyUsed
                  ? 'bg-slate-800 text-slate-600 border border-slate-700/30 opacity-50 cursor-not-allowed'
                  : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 cursor-pointer'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>حذف إجابتين (50:50)</span>
            </button>

            <button
              onClick={handleUseFreeze}
              disabled={powerFreezeUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                powerFreezeUsed
                  ? 'bg-slate-800 text-slate-600 border border-slate-700/30 opacity-50 cursor-not-allowed'
                  : 'bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 cursor-pointer'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>+15 ثانية إضافية</span>
            </button>
          </div>

          {/* Math Problem Card */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 sm:p-8 rounded-3xl border-2 border-slate-700/80 text-center shadow-lg relative min-h-36 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={problem.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="space-y-2"
              >
                <div className="text-3xl sm:text-5xl font-black text-white tracking-wide font-mono" dir="ltr">
                  {problem.equation}
                </div>
                {problem.tip && (
                  <p className="text-xs text-amber-300/80 font-bold mt-1">💡 {problem.tip}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {problem.options.map((opt) => {
              const isHidden = hiddenOptions.includes(opt);
              const isSelected = selectedOption === opt;
              const isCorrect = opt === problem.correctAnswer;

              let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-emerald-400 text-white';
              if (feedback && isSelected) {
                btnStyle = isCorrect ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white';
              }

              if (isHidden) {
                return (
                  <div key={opt} className="h-14 sm:h-16 rounded-2xl bg-slate-800/30 border border-slate-800 opacity-20 pointer-events-none" />
                );
              }

              return (
                <motion.button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={`h-14 sm:h-16 rounded-2xl border-2 font-black text-xl sm:text-2xl transition-all shadow-md flex items-center justify-center font-mono cursor-pointer ${btnStyle}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Game Over & Rewards Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6 space-y-5"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">انتهت جولة السباق!</h3>
            <p className="text-sm text-slate-300 font-bold">أداء رائع وسرعة بديهة ممتازة</p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block font-bold">النقاط</span>
              <span className="text-lg font-black text-amber-400">{score}</span>
            </div>
            <div className="text-center border-x border-slate-700">
              <span className="text-[11px] text-slate-400 block font-bold">أطول حماس</span>
              <span className="text-lg font-black text-orange-400">x{bestStreak}</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400 block font-bold">المكافأة</span>
              <span className="text-lg font-black text-emerald-400">+{Math.max(15, score * 5)} XP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>جولة جديدة</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                العودة للساحة
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
