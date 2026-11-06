import { useActivityExitGuard } from '../context/ActivityExitContext';
import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getArenaChallenges } from '../data/challengesData';
import { localDayKey, seededShuffle } from '../data/challenges/fromLessons';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Challenge, PrimaryGrade, SubjectId } from '../types';
import { Button, Card, Badge, XPProgressBar } from './ui';
import {
  Trophy,
  Timer,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Flame,
  Gamepad2,
} from 'lucide-react';
import { stripArabicTashkeel, formatEducationalText } from '../utils/textFormatter';
import { playGentleNudge, playSuccessChime, playModuleCompleteFanfare } from './preschool/usePreschoolAudio';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { isFeatureEnabled } from '../featureFlags';
import { speakText, speechLangForSubject, stopSpeech as stopSynth } from '../utils/speech';
import { SpeedMathDuelGame } from './games/SpeedMathDuelGame';
import { MemoryMatrixGame } from './games/MemoryMatrixGame';
import { BossBattleGame } from './games/BossBattleGame';
import { LearningGamesShelf } from './games/learning/LearningGameEntry';
import type { PracticeResult } from '../utils/competenceProgress';
// Lazy: this section pulls in the Phaser engine (via NumberSortGame/MathStarsGame/DiduRunner/
// TowerStackGame/Galaxy3DGame) — several hundred KB that only the "ألعاب الترويح" tab actually
// needs, and eagerly importing it here would load Phaser for every visitor of the Challenges
// Arena, not just those who open this tab.
const ArcadeGamesSection = lazy(() => import('./games/ArcadeGamesSection').then((m) => ({ default: m.ArcadeGamesSection })));

interface ChallengesArenaProps {
  /** Scopes the entire arena (mode counts, subject list, challenge grid) to the current grade — omit to browse all grades. */
  grade?: PrimaryGrade;
  tashkeelEnabled?: boolean;
  /** Persists the run's XP into the global profile and marks the challenge completed — called once per finished run. */
  onChallengeComplete?: (challengeId: string, earnedXp: number) => void;
  /** IDs already completed — replay awards 0 XP. */
  completedChallengeIds?: string[];
  userXp?: number;
  userBadges?: string[];
  onEarnCoins?: (amount: number) => void;
  /** Learning games: each round reports to the parent notebook through its catalog lesson. */
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
}

const DIFFICULTY_LABEL: Record<Challenge['difficulty'], string> = {
  easy: '🟢 سهل',
  medium: '🟡 متوسط',
  hard: '🔴 صعب',
};

const FORMAT_LABEL: Record<Challenge['format'], string> = {
  quiz_flash: '⚡ سؤال خاطف',
  speed_calc: '🧮 حساب سريع',
  memory: '🧠 تحدي الذاكرة',
  word_scramble: '🔤 ترتيب الكلمات',
  boss_mix: '👑 تحدي الزعيم',
};

type ChallengeMode = 'all' | 'quick' | 'chrono' | 'boss';
type ArenaTab = 'curriculum' | 'speed_math' | 'memory_matrix' | 'boss_battle' | 'arcade';

const MODE_MATCH: Record<Exclude<ChallengeMode, 'all'>, (c: Challenge) => boolean> = {
  quick: (c) => c.format === 'quiz_flash',
  chrono: (c) => c.timeLimitSeconds != null,
  boss: (c) => c.format === 'boss_mix',
};

const MODE_CARDS: { id: Exclude<ChallengeMode, 'all'>; icon: string; titleAr: string; descAr: string; bandClass: string }[] = [
  { id: 'quick', icon: '🎯', titleAr: 'تحدٍّ سريع', descAr: '10 أسئلة خاطفة بدون وقت محدد', bandClass: 'kids-card-defis' },
  { id: 'chrono', icon: '⏱️', titleAr: 'تحدي الزمن', descAr: 'دقيقتان لحل أكبر عدد من الأسئلة', bandClass: 'kids-card-defis' },
  { id: 'boss', icon: '👑', titleAr: 'التحدي الكبير للفصل', descAr: 'تحدٍّ شامل وصعب — للأبطال فقط!', bandClass: 'kids-card-labs' },
];

export const ChallengesArena: React.FC<ChallengesArenaProps> = ({
  grade,
  tashkeelEnabled = true,
  onChallengeComplete,
  completedChallengeIds = [],
  userXp = 150,
  userBadges = [],
  onEarnCoins,
  onPracticeResult,
}) => {
  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const isYoung = grade === '1AP' || grade === '2AP';
  const [activeTab, setActiveTab] = useState<ArenaTab>('curriculum');

  // Recomputed on every render
  const dayKey = localDayKey();

  const gradeChallenges = useMemo(
    () => getArenaChallenges(grade),
    [grade, dayKey]
  );

  const challengeSubjects = useMemo(() => {
    const ids = Array.from(new Set(gradeChallenges.map((c) => c.subject)));
    return ids.map((id) => SUBJECTS_LIST.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  }, [gradeChallenges]);

  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Challenge['difficulty'] | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<ChallengeMode>('all');
  const filteredChallenges = useMemo(
    () => {
      const list = gradeChallenges.filter(
        (c) =>
          (subjectFilter === 'all' || c.subject === subjectFilter) &&
          (difficultyFilter === 'all' || c.difficulty === difficultyFilter) &&
          (modeFilter === 'all' || MODE_MATCH[modeFilter](c))
      );
      if (!isYoung) return list;
      const youngPool = list.filter((c) => c.difficulty !== 'hard' && c.format !== 'boss_mix' && c.timeLimitSeconds == null);
      // Rotates daily (like the preschool daily challenge) instead of always truncating to the same
      // 3 items — otherwise most of the 1AP/2AP bank stayed permanently hidden behind the age filter.
      return seededShuffle(youngPool, `young|${grade}|${subjectFilter}|${difficultyFilter}|${dayKey}`).slice(0, 3);
    },
    [gradeChallenges, subjectFilter, difficultyFilter, modeFilter, isYoung, grade, dayKey]
  );

  const modeCounts = useMemo(() => {
    const scoped = gradeChallenges.filter(
      (c) => (subjectFilter === 'all' || c.subject === subjectFilter) && (difficultyFilter === 'all' || c.difficulty === difficultyFilter)
    );
    return {
      quick: scoped.filter(MODE_MATCH.quick).length,
      chrono: scoped.filter(MODE_MATCH.chrono).length,
      boss: scoped.filter(MODE_MATCH.boss).length,
    };
  }, [gradeChallenges, subjectFilter, difficultyFilter]);

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [powerFreezeUsed, setPowerFreezeUsed] = useState(false);
  const [powerFiftyUsed, setPowerFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const requestLeave = useActivityExitGuard(Boolean(activeChallenge) && !isFinished);
  const [runXp, setRunXp] = useState(0);
  const finishedRef = useRef(false);

  // Question/option read-aloud for 1AP/2AP — same TapSpeakButton + speech engine pattern as the
  // lesson viewer's useLessonSpeech, kept local here since a Challenge isn't a CourseLesson.
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakingKeyRef = useRef<string | null>(null);
  const speakSnippet = (key: string, text: string) => {
    if (!isFeatureEnabled('voiceReading') || !text) return;
    if (speakingKeyRef.current === key) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    speakingKeyRef.current = key;
    setSpeakingKey(key);
    const lang = speechLangForSubject(activeChallenge?.subject ?? 'arabic');
    void speakText(text, lang, 0.85).then(() => {
      if (speakingKeyRef.current === key) {
        speakingKeyRef.current = null;
        setSpeakingKey(null);
      }
    });
  };
  useEffect(() => {
    stopSynth();
    speakingKeyRef.current = null;
    setSpeakingKey(null);
  }, [itemIndex, activeChallenge]);

  /** Marks the run finished and reports its earned XP up to the parent exactly once */
  const finishChallenge = () => {
    if (!activeChallenge || finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);
    playModuleCompleteFanfare();
    const alreadyDone = completedChallengeIds.includes(activeChallenge.id);
    const earnedXp = alreadyDone
      ? 0
      : Math.round((activeChallenge.xpReward * correctCount) / activeChallenge.items.length);
    setRunXp(earnedXp);
    onChallengeComplete?.(activeChallenge.id, earnedXp);
    if (correctCount >= Math.ceil(activeChallenge.items.length * 0.7)) {
      onEarnCoins?.(10);
    }
  };

  useEffect(() => {
    if (timeLeft === null || isFinished) return;
    if (timeLeft <= 0) {
      finishChallenge();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isFinished]);

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setItemIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setCorrectCount(0);
    setStreak(0);
    setPowerFreezeUsed(false);
    setPowerFiftyUsed(false);
    setHiddenOptions([]);
    setIsFinished(false);
    setRunXp(0);
    finishedRef.current = false;
    setTimeLeft(grade === '1AP' ? null : (challenge.timeLimitSeconds ?? null));
  };

  const exitChallenge = () => requestLeave(() => {
    setActiveChallenge(null);
    setTimeLeft(null);
  });

  const currentItem = activeChallenge?.items[itemIndex];

  const handlePickOption = (opt: string) => {
    if (isAnswerRevealed || !currentItem) return;
    setSelectedOption(opt);
    setIsAnswerRevealed(true);
    const isCorrect = opt === currentItem.correctAnswerAr;
    if (isCorrect) {
      playSuccessChime();
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      playGentleNudge();
      setStreak(0);
    }
  };

  const handleUseFifty = () => {
    if (powerFiftyUsed || isAnswerRevealed || !currentItem?.optionsAr) return;
    setPowerFiftyUsed(true);
    const wrongOptions = currentItem.optionsAr.filter((o) => o !== currentItem.correctAnswerAr);
    setHiddenOptions(wrongOptions.slice(0, 2));
  };

  const handleUseFreeze = () => {
    if (powerFreezeUsed || timeLeft === null) return;
    setPowerFreezeUsed(true);
    setTimeLeft((t) => (t !== null ? t + 15 : null));
  };

  const handleReveal = () => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);
  };

  const goNext = () => {
    if (!activeChallenge) return;
    if (itemIndex + 1 >= activeChallenge.items.length) {
      finishChallenge();
      return;
    }
    setItemIndex((i) => i + 1);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setHiddenOptions([]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Render Sub-games
  if (activeTab === 'speed_math') {
    return (
      <SpeedMathDuelGame
        grade={grade}
        onExit={() => setActiveTab('curriculum')}
        onComplete={(xp, coins) => {
          onChallengeComplete?.('speed_math_run', xp);
          onEarnCoins?.(coins);
        }}
      />
    );
  }

  if (activeTab === 'memory_matrix') {
    return (
      <MemoryMatrixGame
        grade={grade}
        onExit={() => setActiveTab('curriculum')}
        onComplete={(xp, coins) => {
          onChallengeComplete?.('memory_matrix_run', xp);
          onEarnCoins?.(coins);
        }}
      />
    );
  }

  if (activeTab === 'boss_battle') {
    return (
      <BossBattleGame
        grade={grade}
        onExit={() => setActiveTab('curriculum')}
        onComplete={(xp, coins) => {
          onChallengeComplete?.('boss_battle_run', xp);
          onEarnCoins?.(coins);
        }}
      />
    );
  }

  if (activeTab === 'arcade') {
    return (
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center justify-between bg-[var(--app-card-bg)] p-4 rounded-3xl border border-[var(--app-card-border)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black">ألعاب الترويح المهارية</h2>
              <p className="text-xs text-[var(--app-text-muted)]">العب واكسب نقاط XP لفتح ألعاب جديدة</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => requestLeave(() => setActiveTab('curriculum'))} icon={<ChevronLeft className="w-4 h-4" />}>
            العودة للمسابقات
          </Button>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-[var(--app-text-muted)] py-8">جارٍ تحميل الألعاب…</div>}>
          <ArcadeGamesSection
            grade={grade || '3AP'}
            userXp={userXp}
            userBadges={userBadges}
            completedGameIds={completedChallengeIds}
            onGameComplete={(gameId, xp) => {
              onChallengeComplete?.(gameId, xp);
              onEarnCoins?.(15);
            }}
          />
        </Suspense>
      </div>
    );
  }

  // ================= LIST VIEW =================
  if (!activeChallenge) {
    return (
      <div
        className="space-y-6 dir-rtl"
        dir="rtl"
        data-challenges-layout={isYoung ? 'young' : 'full'}
      >
        {/* Main Hero Header */}
        <div className="bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl overflow-hidden shadow-xs">
          <div className="kids-pole-band kids-card-defis" />
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-700" />
                <span>ساحة التحديات والمسابقات الكبرى{grade ? ` (${grade})` : ''}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>تحديات تفاعلية متجددة</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black font-sans text-[var(--kids-ink)]">
              {isYoung ? 'تحديات قصيرة لمستواك' : 'تحديات مؤقتة لكسب نقاط الخبرة'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] mt-1 max-w-2xl">
              {isYoung
                ? 'سؤال أو اثنان، ثم أحسنت — مثل اللعب بعد الدرس.'
                : 'اختر مادة ومستوى صعوبة، وابدأ التحدي لتختبر معلوماتك بسرعة وتربح XP.'}
            </p>
          </div>
        </div>

        {/* « ألعاب ديدو التعليمية » — immersive learning games of the grade (renders nothing without packs) */}
        {grade && (
          <LearningGamesShelf
            grade={grade}
            onPracticeResult={onPracticeResult}
            onEarnXp={(pack, xp) => onChallengeComplete?.(pack.id, xp)}
          />
        )}

        {/* Top Game Mode Quick Launcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => requestLeave(() => setActiveTab('curriculum'))}
            className={`p-3.5 rounded-2xl border-2 text-right transition-all flex items-center gap-3 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] hover:bg-[var(--app-card-subtle)]'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm text-lg">⚡</div>
            <div>
              <span className="text-xs sm:text-sm font-black block">المسابقات المنهجية</span>
              <span className="text-[10px] text-slate-600 font-bold">المنهاج والدروس</span>
            </div>
          </motion.button>

          {/* Speed Math Duel and Boss Battle both run on a hard countdown / lives system — the
              curriculum challenge list right below deliberately excludes timed and boss-format
              content for 1AP/2AP (see the isYoung filter a few lines down). Keeping those two
              modes out of the quick launcher for young grades keeps that same no-time-pressure
              rule instead of letting it be bypassed via this shortcut grid. */}
          {!isYoung && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('speed_math')}
              className="p-3.5 rounded-2xl border-2 border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] text-right transition-all flex items-center gap-3 cursor-pointer hover:border-emerald-400"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm text-lg">🧮</div>
              <div>
                <span className="text-xs sm:text-sm font-black block">سباق الحساب الخاطف</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold">سرعة + حماس x3</span>
              </div>
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('memory_matrix')}
            className="p-3.5 rounded-2xl border-2 border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] text-right transition-all flex items-center gap-3 cursor-pointer hover:border-indigo-400"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white shadow-sm text-lg">🧠</div>
            <div>
              <span className="text-xs sm:text-sm font-black block">بطاقات الذاكرة</span>
              <span className="text-[10px] text-[var(--app-text-muted)] font-bold">علوم، لغة، ومعالم</span>
            </div>
          </motion.button>

          {!isYoung && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('boss_battle')}
              className="p-3.5 rounded-2xl border-2 border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] text-right transition-all flex items-center gap-3 cursor-pointer hover:border-rose-400"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-white shadow-sm text-lg">👑</div>
              <div>
                <span className="text-xs sm:text-sm font-black block">معركة الزعيم</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold">اهزم وحش الكسل</span>
              </div>
            </motion.button>
          )}
        </div>

        {!isYoung && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)] font-bold px-1">
              <span>اختر نمط اللعب لتصفية التحديات والانتقال إليها مباشرة :</span>
              {modeFilter !== 'all' && (
                <button
                  onClick={() => setModeFilter('all')}
                  className="text-[var(--brand-emerald)] hover:text-[var(--brand-emerald-dark)] underline font-black cursor-pointer"
                >
                  إلغاء الفلترة وعرض الكل ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MODE_CARDS.map((mode) => {
                const isActive = modeFilter === mode.id;
                const count = modeCounts[mode.id];
                return (
                  <motion.div
                    key={mode.id}
                    onClick={() => {
                      setModeFilter(isActive ? 'all' : mode.id);
                      setTimeout(() => {
                        document.getElementById('challenges-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative rounded-3xl overflow-hidden min-h-40 cursor-pointer flex flex-col justify-between gap-3 text-center border-2 transition-all bg-[var(--app-card-bg)] ${
                      isActive ? 'border-[var(--brand-amber)] ring-2 ring-amber-400/60' : 'border-[var(--app-card-border)]'
                    }`}
                  >
                    <div className={`kids-pole-band ${mode.bandClass}`} />
                    <div className="p-5 flex flex-col justify-between gap-3 flex-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-3xl leading-none">{mode.icon}</span>
                        <Badge variant="neutral" className="text-[10px] font-black">
                          <span dir="ltr">{count}</span> تحديات
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <span className="font-black text-base block text-[var(--kids-ink)]">{mode.titleAr}</span>
                        <span className="text-xs text-[var(--app-text-muted)] leading-snug block">{mode.descAr}</span>
                      </div>

                      <div className="pt-2 border-t border-[var(--app-card-border)]">
                        {isActive ? (
                          <span className="w-full py-1.5 px-3 rounded-xl bg-amber-400 text-amber-950 font-black text-xs inline-flex items-center justify-center gap-1">
                            <span>النمط المفعّل حالياً</span>
                          </span>
                        ) : (
                          <span className="w-full py-1.5 px-3 rounded-xl bg-[var(--app-card-subtle)] text-[var(--kids-ink)] font-bold text-xs inline-flex items-center justify-center gap-1">
                            <span>تصفية بهذا النمط</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Liste des Défis */}
        <div id="challenges-list-section" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[var(--app-card-border)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-amber)]"></span>
              <h2 className="text-sm sm:text-base font-black text-[var(--app-text)]">
                قائمة التحديات المتاحة ({filteredChallenges.length})
                {modeFilter !== 'all' && (
                  <span className="text-xs font-bold text-amber-800 mr-2">
                    — نمط: {MODE_CARDS.find((m) => m.id === modeFilter)?.titleAr}
                  </span>
                )}
              </h2>
            </div>
            {modeFilter !== 'all' && (
              <button
                onClick={() => setModeFilter('all')}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                عرض جميع الأنماط
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs overflow-x-auto">
            <span className="text-xs font-extrabold text-[var(--app-text-muted)] px-2 shrink-0">المادة:</span>
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                subjectFilter === 'all' ? 'bg-[var(--brand-emerald)] text-white font-extrabold' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
              }`}
            >
              الكل
            </button>
            {challengeSubjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubjectFilter(s.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  subjectFilter === s.id ? 'bg-[var(--brand-emerald)] text-white font-extrabold' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                {s.nameAr}
              </button>
            ))}
          </div>

          {!isYoung && (
            <div className="flex items-center gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs overflow-x-auto">
              <span className="text-xs font-extrabold text-[var(--app-text-muted)] px-2 shrink-0">الصعوبة:</span>
              {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    difficultyFilter === d ? 'bg-[var(--brand-amber)] text-amber-950 font-extrabold' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                  }`}
                >
                  {d === 'all' ? 'الكل' : DIFFICULTY_LABEL[d]}
                </button>
              ))}
            </div>
          )}

          {filteredChallenges.length === 0 ? (
            <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[var(--app-text)]">لا توجد تحديات مطابقة للفلتر المحدد حالياً.</p>
              <button
                onClick={() => {
                  setModeFilter('all');
                  setSubjectFilter('all');
                  setDifficultyFilter('all');
                }}
                className="text-xs text-[var(--brand-emerald)] font-black hover:underline cursor-pointer"
              >
                إعادة ضبط جميع الفلاتر وعرض كل التحديات
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${isYoung ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
              {filteredChallenges.map((challenge) => {
                const subjectName = SUBJECTS_LIST.find((s) => s.id === challenge.subject)?.nameAr || challenge.subject;
                const done = completedChallengeIds.includes(challenge.id);
                return (
                  <motion.div
                    key={challenge.id}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    <Card
                      interactive
                      padding={isYoung ? 'lg' : 'md'}
                      onClick={() => startChallenge(challenge)}
                      className="space-y-3"
                      data-challenge-id={challenge.id}
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="info">{subjectName}</Badge>
                        {!isYoung && (
                          <Badge variant={challenge.difficulty === 'hard' ? 'danger' : challenge.difficulty === 'medium' ? 'xp' : 'success'}>
                            {DIFFICULTY_LABEL[challenge.difficulty]}
                          </Badge>
                        )}
                      </div>
                      <h3 className={`font-black ${isYoung ? 'text-base' : 'text-sm'}`}>{renderArabicText(challenge.titleAr)}</h3>
                      <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">{renderArabicText(challenge.descriptionAr)}</p>
                      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-muted)]">
                        {!isYoung && <span>{FORMAT_LABEL[challenge.format]}</span>}
                        <span>{challenge.items.length} أسئلة</span>
                      </div>
                      <Button variant="primary" size={isYoung ? 'md' : 'sm'} fullWidth icon={<Zap className="w-4 h-4" />}>
                        {done ? 'إعادة' : 'ابدأ التحدي'}
                        {!done && !isYoung && (
                          <span> (<span dir="ltr">+{challenge.xpReward} XP</span>)</span>
                        )}
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= END SCREEN =================
  if (isFinished) {
    const total = activeChallenge.items.length;
    const percent = Math.round((correctCount / total) * 100);
    return (
      <div className="space-y-6 dir-rtl max-w-xl mx-auto" dir="rtl">
        <Card padding="lg" className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-[var(--kids-ink)]">أحسنت يا بطل! انتهى التحدي!</h2>
          <p className="text-sm text-[var(--app-text-muted)] font-bold">{renderArabicText(activeChallenge.titleAr)}</p>

          <div className="max-w-xs mx-auto">
            <XPProgressBar currentXp={percent} maxXp={100} showLabel={false} />
          </div>

          <div className="flex items-center justify-center gap-4 bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)]">
            <div className="text-center">
              <span className="text-xs text-[var(--app-text-muted)] block font-bold">الإجابات الصحيحة</span>
              <span className="text-base font-black text-emerald-600 font-mono" dir="ltr">{correctCount} / {total}</span>
            </div>
            <div className="text-center border-r border-[var(--app-card-border)] pr-4">
              <span className="text-xs text-[var(--app-text-muted)] block font-bold">النسبة المئوية</span>
              <span className="text-base font-black text-amber-600 font-mono" dir="ltr">{percent}%</span>
            </div>
          </div>

          <Badge variant="xp" pop className="text-sm px-4 py-1.5">
            <span dir="ltr">+{runXp} XP نقاط خبرة</span>
          </Badge>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" onClick={exitChallenge} icon={<ChevronLeft className="w-4 h-4" />}>
              العودة للقائمة
            </Button>
            <Button variant="primary" onClick={() => startChallenge(activeChallenge)} icon={<RotateCcw className="w-4 h-4" />}>
              العب من جديد
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ================= PLAY VIEW =================
  return (
    <div className="space-y-5 dir-rtl max-w-2xl mx-auto" dir="rtl">
      {/* Header HUD */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-[var(--app-card-bg)] p-3 rounded-2xl border border-[var(--app-card-border)]">
        <Button variant="ghost" size="sm" onClick={exitChallenge} icon={<ChevronLeft className="w-4 h-4" />}>
          خروج
        </Button>

        <div className="flex items-center gap-2">
          {streak >= 3 && (
            <div className="flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-xl border border-orange-200 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>x{streak} حماس!</span>
            </div>
          )}

          {timeLeft !== null && (
            <Badge variant={timeLeft <= 10 ? 'danger' : 'neutral'} icon={<Timer className="w-3.5 h-3.5" />}>
              <span dir="ltr">{formatTime(timeLeft)}</span>
            </Badge>
          )}

          <Badge variant="info">
            <span dir="ltr">{itemIndex + 1} / {activeChallenge.items.length}</span>
          </Badge>
        </div>
      </div>

      {/* In-Game Power-Ups */}
      {!isYoung && !isAnswerRevealed && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleUseFifty}
            disabled={powerFiftyUsed || !currentItem?.optionsAr}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              powerFiftyUsed
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 cursor-pointer shadow-xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>حذف إجابتين (50:50)</span>
          </button>

          {timeLeft !== null && (
            <button
              onClick={handleUseFreeze}
              disabled={powerFreezeUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                powerFreezeUsed
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 cursor-pointer shadow-xs'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>+15 ثانية إضافية</span>
            </button>
          )}
        </div>
      )}

      <Card padding="lg" className="space-y-5">
        <div className="flex items-center gap-3">
          {isYoung && currentItem && (
            <TapSpeakButton
              snippetKey={`q-${itemIndex}`}
              text={stripArabicTashkeel(currentItem.questionOrPromptAr).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')}
              speakingKey={speakingKey}
              onSpeak={speakSnippet}
              size={grade === '1AP' ? 'lg' : 'md'}
            />
          )}
          <h3 className="font-black text-base sm:text-lg leading-relaxed text-[var(--app-text)] flex-1">
            {currentItem && renderArabicText(currentItem.questionOrPromptAr)}
          </h3>
        </div>

        {currentItem?.optionsAr && currentItem.optionsAr.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.optionsAr.map((opt, idx) => {
              const isHidden = hiddenOptions.includes(opt);
              const isThisSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentItem.correctAnswerAr;

              if (isHidden) {
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-100 border border-slate-200 opacity-20 pointer-events-none" />
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handlePickOption(opt)}
                  className={`p-4 rounded-2xl border text-right text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                    isAnswerRevealed && isCorrectOpt
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                      : isAnswerRevealed && isThisSelected && !isCorrectOpt
                      ? 'bg-[#FFF5F4] border-[#F0C9C6] text-[#9F221C]'
                      : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] hover:bg-[var(--app-card-bg)] hover:border-emerald-300'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {isYoung && (
                      <TapSpeakButton
                        snippetKey={`q-${itemIndex}-opt-${idx}`}
                        text={stripArabicTashkeel(opt).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')}
                        speakingKey={speakingKey}
                        onSpeak={speakSnippet}
                        size="md"
                      />
                    )}
                    <span>{opt}</span>
                  </span>
                  {isAnswerRevealed && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswerRevealed && isThisSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {!isAnswerRevealed ? (
              <Button variant="accent" onClick={handleReveal} icon={<Sparkles className="w-4 h-4" />}>
                إظهار الإجابة
              </Button>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-sm font-bold text-emerald-900" dir="ltr">
                {currentItem?.correctAnswerAr}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {isAnswerRevealed && currentItem?.explanationAr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-xs leading-relaxed overflow-hidden"
            >
              {formatEducationalText(renderArabicText(currentItem.explanationAr))}
            </motion.div>
          )}
        </AnimatePresence>

        {isAnswerRevealed && (
          <Button variant="primary" fullWidth onClick={goNext}>
            {itemIndex + 1 >= activeChallenge.items.length ? 'إنهاء التحدي' : 'السؤال التالي'}
          </Button>
        )}
      </Card>
    </div>
  );
};
