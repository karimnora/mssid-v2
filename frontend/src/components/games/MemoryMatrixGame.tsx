import { useActivityExitGuard } from '../../context/ActivityExitContext';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade } from '../../types';
import { playSuccessChime, playGentleNudge, playModuleCompleteFanfare } from '../preschool/usePreschoolAudio';
import { Trophy, Timer, Brain, ArrowRight, RefreshCw, Sparkles, Star } from 'lucide-react';
import { TapSpeakButton } from '../lessonViewer/TapSpeakButton';
import { speakText, stopSpeech as stopSynth } from '../../utils/speech';

interface MemoryMatrixGameProps {
  grade?: PrimaryGrade;
  onExit?: () => void;
  onComplete?: (earnedXp: number, coins: number) => void;
}

interface MemoryCardItem {
  uid: string;
  pairId: string;
  label: string;
  icon: string;
  category: string;
}

type MemoryTheme = 'colors' | 'science' | 'arabic' | 'algeria' | 'math';

const THEME_DATA: Record<
  MemoryTheme,
  {
    titleAr: string;
    icon: string;
    pairs: { id: string; a: { text: string; icon: string }; b: { text: string; icon: string } }[];
  }
> = {
  // The only theme offered to 1AP/2AP (see isYoung below) — CLAUDE.md caps their curriculum at
  // colors/shapes/five-senses vocabulary, so the other four themes (human organs, fractions,
  // wilaya monuments, synonyms/antonyms) stay reserved for 3AP+ even at a reduced card count.
  colors: {
    titleAr: 'الألوان والأشياء',
    icon: '🎨',
    pairs: [
      { id: 'p1', a: { text: 'أَحْمَرُ', icon: '🔴' }, b: { text: 'تُفَّاحَةٌ', icon: '🍎' } },
      { id: 'p2', a: { text: 'أَصْفَرُ', icon: '🟡' }, b: { text: 'مَوْزَةٌ', icon: '🍌' } },
      { id: 'p3', a: { text: 'أَخْضَرُ', icon: '🟢' }, b: { text: 'وَرَقَةُ شَجَرٍ', icon: '🍃' } },
      { id: 'p4', a: { text: 'أَزْرَقُ', icon: '🔵' }, b: { text: 'السَّمَاءُ', icon: '🌤️' } },
    ],
  },
  science: {
    titleAr: 'العلوم وجسم الإنسان',
    icon: '🧪',
    pairs: [
      { id: 'p1', a: { text: 'القلب', icon: '❤️' }, b: { text: 'ضخ الدم', icon: '🩸' } },
      { id: 'p2', a: { text: 'الرئتان', icon: '🫁' }, b: { text: 'التنفس', icon: '💨' } },
      { id: 'p3', a: { text: 'الشمس', icon: '☀️' }, b: { text: 'ضوء وحرارة', icon: '✨' } },
      { id: 'p4', a: { text: 'النحاس', icon: '🪙' }, b: { text: 'ناقل للكهرباء', icon: '⚡' } },
      { id: 'p5', a: { text: 'الخشب', icon: '🪵' }, b: { text: 'عازل للكهرباء', icon: '🛡️' } },
      { id: 'p6', a: { text: 'المعدة', icon: '🥣' }, b: { text: 'هضم الأغذية', icon: '🥗' } },
    ],
  },
  arabic: {
    titleAr: 'المرادفات والأضداد',
    icon: '📖',
    pairs: [
      { id: 'p1', a: { text: 'شجاع', icon: '🦁' }, b: { text: 'مقدام', icon: '⚔️' } },
      { id: 'p2', a: { text: 'مسرور', icon: '😊' }, b: { text: 'فرحان', icon: '🎉' } },
      { id: 'p3', a: { text: 'كبير', icon: '🐘' }, b: { text: 'ضده: صغير', icon: '🐜' } },
      { id: 'p4', a: { text: 'سريع', icon: '🐆' }, b: { text: 'ضده: بطيء', icon: '🐢' } },
      { id: 'p5', a: { text: 'العلم', icon: '💡' }, b: { text: 'ضده: الجهل', icon: '🌑' } },
      { id: 'p6', a: { text: 'الوفاء', icon: '🤝' }, b: { text: 'الإخلاص', icon: '💎' } },
    ],
  },
  algeria: {
    titleAr: 'معالم وولايات الجزائر',
    icon: '🗺️',
    pairs: [
      { id: 'p1', a: { text: 'الجزائر العاصمة', icon: '🏛️' }, b: { text: 'مقام الشهيد', icon: '🇩🇿' } },
      { id: 'p2', a: { text: 'قسنطينة', icon: '🌉' }, b: { text: 'مدينة الجسور', icon: '🏰' } },
      { id: 'p3', a: { text: 'وهران', icon: '🌊' }, b: { text: 'حصن سانتا كروز', icon: '⛵' } },
      { id: 'p4', a: { text: 'تمنراست', icon: '⛰️' }, b: { text: 'جبال الهقار', icon: '🏜️' } },
      { id: 'p5', a: { text: 'غرداية', icon: '🌴' }, b: { text: 'قصور وادي ميزاب', icon: '🕌' } },
      { id: 'p6', a: { text: 'عنابة', icon: '⚓' }, b: { text: 'بونة وسان أوغسطين', icon: '⛪' } },
    ],
  },
  math: {
    titleAr: 'الكسور والهندسة',
    icon: '🧮',
    pairs: [
      { id: 'p1', a: { text: '1/2', icon: '🌗' }, b: { text: 'النصف (50%)', icon: '⚖️' } },
      { id: 'p2', a: { text: '1/4', icon: '🌘' }, b: { text: 'الربع (25%)', icon: '🥧' } },
      { id: 'p3', a: { text: 'المثلث', icon: '🔺' }, b: { text: '3 أضلاع و3 زوايا', icon: '📐' } },
      { id: 'p4', a: { text: 'المربع', icon: '⏹️' }, b: { text: '4 أضلاع متقايسة', icon: '📏' } },
      { id: 'p5', a: { text: 'المستطيل', icon: '▭' }, b: { text: 'كل ضلعين متقابلين متقايسان', icon: '📦' } },
      { id: 'p6', a: { text: 'الدائرة', icon: '⭕' }, b: { text: 'خط منحنٍ مغلق ومركز', icon: '🎯' } },
    ],
  },
};

export const MemoryMatrixGame: React.FC<MemoryMatrixGameProps> = ({
  grade = '3AP',
  onExit,
  onComplete,
}) => {
  const isYoung = grade === '1AP' || grade === '2AP';
  const availableThemes: MemoryTheme[] = isYoung
    ? ['colors']
    : ['science', 'arabic', 'algeria', 'math'];
  const [selectedTheme, setSelectedTheme] = useState<MemoryTheme>(isYoung ? 'colors' : 'science');
  const [cards, setCards] = useState<MemoryCardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const requestLeave = useActivityExitGuard(!isWon);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakSnippet = (key: string, text: string) => {
    if (speakingKey === key) {
      stopSynth();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    void speakText(text, 'ar-SA', 0.85).then(() => {
      setSpeakingKey((k) => (k === key ? null : k));
    });
  };
  useEffect(() => stopSynth, []);

  // Initialize and shuffle cards
  const initGame = (themeKey: MemoryTheme) => {
    const rawPairs = THEME_DATA[themeKey].pairs;
    // For 1AP-2AP, use 4 pairs (8 cards), for 3AP-5AP use 6 pairs (12 cards)
    const pairCount = grade === '1AP' || grade === '2AP' ? 4 : 6;
    const selectedPairs = rawPairs.slice(0, pairCount);

    const cardList: MemoryCardItem[] = [];
    selectedPairs.forEach((p) => {
      cardList.push({
        uid: `${p.id}-a`,
        pairId: p.id,
        label: p.a.text,
        icon: p.a.icon,
        category: 'A',
      });
      cardList.push({
        uid: `${p.id}-b`,
        pairId: p.id,
        label: p.b.text,
        icon: p.b.icon,
        category: 'B',
      });
    });

    // Shuffle
    setCards(cardList.sort(() => Math.random() - 0.5));
    setFlippedUids([]);
    setMatchedPairIds([]);
    setMoves(0);
    setSeconds(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame(selectedTheme);
  }, [selectedTheme, grade]);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Handle Card Click
  const handleCardClick = (card: MemoryCardItem) => {
    if (
      isWon ||
      flippedUids.includes(card.uid) ||
      matchedPairIds.includes(card.pairId) ||
      flippedUids.length >= 2
    ) {
      return;
    }

    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.uid === nextFlipped[0]);
      const secondCard = cards.find((c) => c.uid === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Matched!
        playSuccessChime();
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedUids([]);

        const totalPairs = grade === '1AP' || grade === '2AP' ? 4 : 6;
        if (nextMatched.length >= totalPairs) {
          setIsWon(true);
          playModuleCompleteFanfare();
          const earnedXp = Math.max(20, 60 - moves * 2);
          const earnedCoins = 15;
          onComplete?.(earnedXp, earnedCoins);
        }
      } else {
        // Mismatch
        playGentleNudge();
        setTimeout(() => {
          setFlippedUids([]);
        }, 1000);
      }
    }
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div data-lab-instrument className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 text-white rounded-3xl shadow-2xl border-2 border-indigo-500/30 relative overflow-hidden" dir="rtl">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -left-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">تحدي بطاقات الذاكرة والمطابقة</h2>
            <span className="text-xs text-indigo-400 font-bold">اربط كل عنصر بالبطاقة المكملة له</span>
          </div>
        </div>

        {onExit && (
          <button
            onClick={() => { if (onExit) requestLeave(onExit); }}
            className={`rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isYoung ? 'min-w-[60px] min-h-[60px] px-4 text-sm' : 'px-3 py-1.5 text-xs'
            }`}
          >
            <span>خروج</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Theme Selector Pills — 1AP/2AP only ever get one age-appropriate theme, so there's
          nothing to choose between; skip the selector entirely for them. */}
      {availableThemes.length > 1 && (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {availableThemes.map((themeKey) => {
          const t = THEME_DATA[themeKey];
          const isCurrent = selectedTheme === themeKey;
          return (
            <button
              key={themeKey}
              onClick={() => setSelectedTheme(themeKey)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                isCurrent
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.titleAr}</span>
            </button>
          );
        })}
      </div>
      )}

      {/* Game HUD */}
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 mb-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
          <Timer className="w-4 h-4 text-amber-400" />
          <span>الوقت: <strong className="text-amber-400 font-mono text-sm">{formatTimer(seconds)}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>المحاولات: <strong className="text-indigo-400 font-mono text-sm">{moves}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
          <span>المطابقات: <strong className="text-emerald-400 font-mono text-sm">{matchedPairIds.length}/{grade === '1AP' || grade === '2AP' ? 4 : 6}</strong></span>
        </div>
      </div>

      {/* Cards Grid */}
      {!isWon ? (
        <div className={`grid gap-3 ${grade === '1AP' || grade === '2AP' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}>
          {cards.map((card) => {
            const isFlipped = flippedUids.includes(card.uid);
            const isMatched = matchedPairIds.includes(card.pairId);

            return (
              <motion.div
                key={card.uid}
                onClick={() => handleCardClick(card)}
                whileHover={!isMatched && !isFlipped ? { scale: 1.03 } : {}}
                whileTap={!isMatched && !isFlipped ? { scale: 0.96 } : {}}
                className={`h-24 sm:h-28 rounded-2xl cursor-pointer select-none transition-all duration-300 relative flex flex-col items-center justify-center p-2 text-center border-2 ${
                  isMatched
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 opacity-90 shadow-md shadow-emerald-900/30'
                    : isFlipped
                    ? 'bg-gradient-to-br from-indigo-800 to-slate-800 border-indigo-400 text-white shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700/80 text-slate-400 shadow-sm'
                }`}
              >
                {isFlipped || isMatched ? (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <span className="text-2xl sm:text-3xl">{card.icon}</span>
                    <span className="text-xs font-bold text-slate-100 line-clamp-2 leading-tight">
                      {card.label}
                    </span>
                    {isYoung && (
                      <TapSpeakButton
                        snippetKey={card.uid}
                        text={card.label}
                        speakingKey={speakingKey}
                        onSpeak={speakSnippet}
                        size="md"
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 opacity-60">
                    <span className="text-xl">❓</span>
                    <span className="text-[10px] font-bold text-slate-400">اقلب البطاقة</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
              <Star className="w-7 h-7 fill-amber-400 scale-110" />
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-white">ذاكرة حديدية وذكاء فائق!</h3>
            <p className="text-sm text-slate-300 font-bold">
              أنهيت جميع المطابقات في {formatTimer(seconds)} فقط وبـ {moves} محاولة.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => initGame(selectedTheme)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة اللعب</span>
            </button>

            {onExit && (
              <button
                onClick={() => { if (onExit) requestLeave(onExit); }}
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
