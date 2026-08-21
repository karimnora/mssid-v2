import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpellingChampGameProps {
  onExit: () => void;
  onComplete: (xp: number) => void;
}

interface WordChallenge {
  hint: string;
  hintFr: string;
  correct: string;
  options: string[];
}

const WORD_BANK: WordChallenge[] = [
  // Level 1 — simple words (1AP-2AP)
  { hint: '🌳 شجرة', hintFr: 'arbre', correct: 'شَجَرَةٌ', options: ['شَجَرَةٌ', 'شَجِرَةٌ', 'شاجِرَةٌ', 'شَجَرُ'] },
  { hint: '📚 كتاب', hintFr: 'livre', correct: 'كِتَابٌ', options: ['كِتَابٌ', 'كَتَابٌ', 'كِتَبٌ', 'كُتَابٌ'] },
  { hint: '🏠 منزل', hintFr: 'maison', correct: 'مَنْزِلٌ', options: ['مَنْزِلٌ', 'مَنْزَلٌ', 'مَنزِيلٌ', 'مِنْزَلٌ'] },
  { hint: '☀️ شمس', hintFr: 'soleil', correct: 'شَمْسٌ', options: ['شَمْسٌ', 'شَامِسٌ', 'شُمُوسٌ', 'شَمِسٌ'] },
  { hint: '🌊 بحر', hintFr: 'mer', correct: 'بَحْرٌ', options: ['بَحْرٌ', 'بَاحِرٌ', 'بَحِيرٌ', 'بُحَرٌ'] },
  { hint: '🐑 خروف', hintFr: 'mouton', correct: 'خَرُوفٌ', options: ['خَرُوفٌ', 'خَرُفٌ', 'خَرَوْفٌ', 'خِرَافٌ'] },
  { hint: '🍎 تفاحة', hintFr: 'pomme', correct: 'تُفَّاحَةٌ', options: ['تُفَّاحَةٌ', 'تُفَاحَةٌ', 'تَفَّاحَةٌ', 'تُفَاحٌ'] },
  { hint: '✏️ قلم', hintFr: 'stylo', correct: 'قَلَمٌ', options: ['قَلَمٌ', 'قَالِمٌ', 'قِلَمٌ', 'قَلَامٌ'] },
  { hint: '💧 ماء', hintFr: 'eau', correct: 'مَاءٌ', options: ['مَاءٌ', 'مَاءَ', 'مَاءِ', 'ماءً'] },
  { hint: '🌸 وردة', hintFr: 'rose', correct: 'وَرْدَةٌ', options: ['وَرْدَةٌ', 'وَرَدَةٌ', 'وُرْدَةٌ', 'وَارِدَةٌ'] },
  // Level 2 — medium complexity (2AP-3AP)
  { hint: '📝 التعليم', hintFr: 'l\'enseignement', correct: 'التَّعْلِيمُ', options: ['التَّعْلِيمُ', 'التَعْلِيمُ', 'التَّعْلِيمِ', 'تَعْلِيمٌ'] },
  { hint: '🏫 مدرسة', hintFr: 'école', correct: 'مَدْرَسَةٌ', options: ['مَدْرَسَةٌ', 'مَدَارِسَةٌ', 'مَدَرَسَةٌ', 'مُدَرِّسَةٌ'] },
  { hint: '👩‍🏫 أستاذة', hintFr: 'professeure', correct: 'أُسْتَاذَةٌ', options: ['أُسْتَاذَةٌ', 'أُسْتَاذٌ', 'اسْتَاذَةٌ', 'أُسْتَاذَةً'] },
  { hint: '🌿 النبات', hintFr: 'la plante', correct: 'النَّبَاتُ', options: ['النَّبَاتُ', 'النَبَاتُ', 'نَبَاتٌ', 'النَّبَاتِ'] },
  { hint: '🧪 تجربة', hintFr: 'expérience', correct: 'تَجْرِبَةٌ', options: ['تَجْرِبَةٌ', 'تَجَرِبَةٌ', 'تَجْرُبَةٌ', 'تِجْرِبَةٌ'] },
  // Level 3 — grammar-aware (3AP-4AP)
  { hint: '✅ المعلومة الصحيحة — "كان الطالب..."', hintFr: 'L\'élève était studieux', correct: 'كَانَ الطَّالِبُ مُجْتَهِدًا', options: ['كَانَ الطَّالِبُ مُجْتَهِدًا', 'كَانَ الطَّالِبَ مُجْتَهِدٌ', 'كَانَ الطَّالِبُ مُجْتَهِدٌ', 'كَانَ الطَّالِبُ مُجْتَهِدِ'] },
  { hint: '✅ إنّ + المبتدأ', hintFr: 'La science est une lumière', correct: 'إِنَّ الْعِلْمَ نُورٌ', options: ['إِنَّ الْعِلْمَ نُورٌ', 'إِنَّ الْعِلْمُ نُورٌ', 'إنَّ الْعِلْمَ نُورَ', 'أَنَّ الْعِلْمَ نُورٌ'] },
  { hint: '🔡 الهمزة الصحيحة', hintFr: 'demander', correct: 'سَأَلَ', options: ['سَأَلَ', 'سَاءَلَ', 'سَالَ', 'سَئِلَ'] },
  // Level 4 — advanced (4AP-5AP)
  { hint: '✅ جمع المذكر السالم', hintFr: 'les enseignants (pluriel masc.)', correct: 'الْمُعَلِّمُونَ', options: ['الْمُعَلِّمُونَ', 'الْمُعَلِّمِينَ', 'الْمُعَلِّمِينُ', 'الْمُعَلِّمُون'] },
  { hint: '✅ همزة القطع', hintFr: 'ils s\'assoient', correct: 'يَجْلِسُونَ', options: ['يَجْلِسُونَ', 'يِجْلِسُونَ', 'يُجْلِسُونَ', 'يجلسون'] },
];

const QUESTIONS_PER_GAME = 10;

function shuffleOptions(options: string[]): string[] {
  return [...options].sort(() => Math.random() - 0.5);
}

function buildRound(pool: WordChallenge[]): WordChallenge & { shuffledOptions: string[] } {
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { ...item, shuffledOptions: shuffleOptions(item.options) };
}

export const SpellingChampGame: React.FC<SpellingChampGameProps> = ({ onExit, onComplete }) => {
  const poolRef = useRef(WORD_BANK);
  const buildNext = useCallback(() => buildRound(poolRef.current), []);

  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(() => buildNext());
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleChoose = (option: string) => {
    if (chosen !== null) return;
    setChosen(option);
    const correct = option === current.correct;
    if (correct) {
      setScore((s) => s + 1);
      setTotalXp((xp) => xp + 20);
    }
    setTimeout(() => {
      if (round + 1 >= QUESTIONS_PER_GAME) {
        setGameOver(true);
      } else {
        setRound((r) => r + 1);
        setCurrent(buildNext());
        setChosen(null);
      }
    }, 1200);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
        >
          <div className="text-6xl mb-3">{score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-extrabold text-purple-700 mb-1">انتهت اللعبة!</h2>
          <p className="text-slate-500 mb-2">
            {score} / {QUESTIONS_PER_GAME} إجابات صحيحة
          </p>
          <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-5 text-amber-700 font-bold text-lg">
            +{totalXp} XP ⭐
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(totalXp)}
            className="bg-gradient-to-br from-violet-400 to-purple-600 text-white rounded-2xl px-8 py-3 font-bold text-base shadow-lg w-full"
          >
            إنهاء اللعبة 🏆
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4 pb-8" dir="rtl">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="bg-white/80 rounded-2xl px-4 py-2 text-slate-600 font-bold shadow text-sm"
        >
          ← خروج
        </button>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-purple-700">✍️ بطل الإملاء</h1>
          <p className="text-xs text-purple-400">{round + 1} / {QUESTIONS_PER_GAME}</p>
        </div>
        <div className="bg-amber-100 rounded-2xl px-4 py-2 text-amber-700 font-bold shadow text-sm">
          ⭐ {totalXp} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md bg-white/60 rounded-full h-3 mb-6">
        <motion.div
          className="bg-purple-500 h-3 rounded-full"
          animate={{ width: `${((round) / QUESTIONS_PER_GAME) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Score */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: QUESTIONS_PER_GAME }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${i < round ? (score > round - (round - i) ? 'bg-emerald-400' : 'bg-rose-300') : 'bg-slate-200'}`}
          />
        ))}
      </div>

      {/* Hint card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-lg px-6 py-6 mb-6 text-center w-full max-w-md"
        >
          <p className="text-4xl mb-2">{current.hint}</p>
          <p className="text-purple-400 text-sm italic">{current.hintFr}</p>
          <p className="text-slate-500 text-sm mt-2">اختر الكتابة الصحيحة:</p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {current.shuffledOptions.map((opt) => {
          const isChosen = chosen === opt;
          const isCorrect = opt === current.correct;
          const showFeedback = chosen !== null;

          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoose(opt)}
              disabled={chosen !== null}
              animate={
                showFeedback && isCorrect
                  ? { scale: [1, 1.08, 1], transition: { duration: 0.4 } }
                  : {}
              }
              className={`
                rounded-3xl px-4 py-4 font-bold text-base shadow transition-all duration-300 text-right
                ${!showFeedback
                  ? 'bg-white text-slate-800 hover:bg-purple-50 hover:shadow-purple-100'
                  : isCorrect
                  ? 'bg-emerald-400 text-white shadow-emerald-200'
                  : isChosen
                  ? 'bg-rose-400 text-white shadow-rose-200'
                  : 'bg-white/50 text-slate-400'}
              `}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {chosen !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-5 rounded-2xl px-5 py-3 text-sm font-bold ${chosen === current.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
          >
            {chosen === current.correct ? '✅ ممتاز! +20 XP' : `❌ الصحيح: ${current.correct}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
