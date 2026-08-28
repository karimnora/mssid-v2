import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getArenaChallenges } from '../data/challengesData';
import { localDayKey } from '../data/challenges/fromLessons';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Challenge, PrimaryGrade, SubjectId } from '../types';
import { Button, Card, Badge, XPProgressBar } from './ui';
import { Trophy, Timer, ChevronLeft, CheckCircle2, XCircle, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { stripArabicTashkeel } from '../utils/textFormatter';
import { playGentleNudge, playSuccessChime } from './preschool/usePreschoolAudio';

interface ChallengesArenaProps {
  /** Scopes the entire arena (mode counts, subject list, challenge grid) to the current grade — omit to browse all grades. */
  grade?: PrimaryGrade;
  tashkeelEnabled?: boolean;
  /** Persists the run's XP into the global profile and marks the challenge completed — called once per finished run. */
  onChallengeComplete?: (challengeId: string, earnedXp: number) => void;
  /** IDs already completed — replay awards 0 XP. */
  completedChallengeIds?: string[];
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

const MODE_MATCH: Record<Exclude<ChallengeMode, 'all'>, (c: Challenge) => boolean> = {
  quick: (c) => c.format === 'quiz_flash',
  chrono: (c) => c.timeLimitSeconds != null,
  boss: (c) => c.format === 'boss_mix',
};

const MODE_CARDS: { id: Exclude<ChallengeMode, 'all'>; icon: string; titleAr: string; descAr: string; bandClass: string }[] = [
  { id: 'quick', icon: '🎯', titleAr: 'اختبار سريع', descAr: '10 أسئلة خاطفة بدون وقت محدد', bandClass: 'kids-card-examens' },
  { id: 'chrono', icon: '⏱️', titleAr: 'تحدي الزمن', descAr: 'دقيقتان لحل أكبر عدد من الأسئلة', bandClass: 'kids-card-defis' },
  { id: 'boss', icon: '👑', titleAr: 'التحدي الكبير للفصل', descAr: 'تحدٍّ شامل وصعب — للأبطال فقط!', bandClass: 'kids-card-labs' },
];

export const ChallengesArena: React.FC<ChallengesArenaProps> = ({
  grade,
  tashkeelEnabled = true,
  onChallengeComplete,
  completedChallengeIds = [],
}) => {
  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const isYoung = grade === '1AP' || grade === '2AP';

  // Recomputed on every render (cheap: one Date + toISOString), included in the memo key below so a
  // session left open across midnight gets today's daily challenge set instead of freezing on the
  // day the component first mounted.
  const dayKey = localDayKey();

  // Every count/list in this arena is derived from this grade-scoped base list — never a hardcoded
  // total — so a 3AP student never sees mode/subject counts inflated by 5AP-only content.
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
      return list
        .filter((c) => c.difficulty !== 'hard' && c.format !== 'boss_mix' && c.timeLimitSeconds == null)
        .slice(0, 3);
    },
    [gradeChallenges, subjectFilter, difficultyFilter, modeFilter, isYoung]
  );

  // Mode-card counts respect grade + whichever subject/difficulty pill is currently active, so they
  // stay accurate as the student filters instead of always showing the same total.
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
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [runXp, setRunXp] = useState(0);
  const finishedRef = useRef(false);

  /** Marks the run finished and reports its earned XP up to the parent exactly once — call instead of setIsFinished directly. */
  const finishChallenge = () => {
    if (!activeChallenge || finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);
    const alreadyDone = completedChallengeIds.includes(activeChallenge.id);
    const earnedXp = alreadyDone
      ? 0
      : Math.round((activeChallenge.xpReward * correctCount) / activeChallenge.items.length);
    setRunXp(earnedXp);
    onChallengeComplete?.(activeChallenge.id, earnedXp);
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
    setIsFinished(false);
    setRunXp(0);
    finishedRef.current = false;
    setTimeLeft(grade === '1AP' ? null : (challenge.timeLimitSeconds ?? null));
  };

  const exitChallenge = () => {
    setActiveChallenge(null);
    setTimeLeft(null);
  };

  const currentItem = activeChallenge?.items[itemIndex];

  const handlePickOption = (opt: string) => {
    if (isAnswerRevealed || !currentItem) return;
    setSelectedOption(opt);
    setIsAnswerRevealed(true);
    const isCorrect = opt === currentItem.correctAnswerAr;
    if (isCorrect) {
      playSuccessChime();
      setCorrectCount((c) => c + 1);
    } else {
      playGentleNudge();
    }
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
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ================= LIST VIEW =================
  if (!activeChallenge) {
    return (
      <div
        className="space-y-6 dir-rtl"
        dir="rtl"
        data-challenges-layout={isYoung ? 'young' : 'full'}
      >
        {/* Plain hex linear-gradient via inline style, not Tailwind's gradient utilities — Tailwind v4's
            oklch()-based palette/gradients silently fail to paint on some older Android WebViews. */}
        <div className="bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl overflow-hidden">
          <div className="kids-pole-band kids-card-defis" />
          <div className="p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>نادي التحديات والمسابقات{grade ? ` (${grade})` : ''}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-sans text-[var(--kids-ink)]">
            {isYoung ? 'تحديات قصيرة لمستواك' : 'تحديات مؤقتة لكسب نقاط الخبرة'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--kids-muted)] mt-1 max-w-2xl">
            {isYoung
              ? 'سؤال أو اثنان، ثم أحسنت — مثل اللعب بعد الدرس.'
              : 'اختر مادة ومستوى صعوبة، وابدأ التحدي لتختبر معلوماتك بسرعة وتربح XP.'}
          </p>
          </div>
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
                    <span className="text-xs text-[var(--kids-muted)] leading-snug block">{mode.descAr}</span>
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
      <div className="space-y-6 dir-rtl" dir="rtl">
        <Card padding="lg" className="text-center space-y-4">
          <Trophy className="w-14 h-14 text-amber-400 mx-auto" />
          <h2 className="text-xl font-black">انتهى التحدي!</h2>
          <p className="text-sm text-[var(--app-text-muted)]">{renderArabicText(activeChallenge.titleAr)}</p>
          <div className="max-w-xs mx-auto">
            <XPProgressBar currentXp={percent} maxXp={100} showLabel={false} />
          </div>
          <p className="text-sm font-bold" dir="ltr">
            {correctCount} / {total} ({percent}%)
          </p>
          <Badge variant="xp" pop>
            <span dir="ltr">+{runXp} XP</span>
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
    <div className="space-y-5 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={exitChallenge} icon={<ChevronLeft className="w-4 h-4" />}>
          خروج
        </Button>
        <div className="flex items-center gap-3">
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

      <Card padding="lg" className="space-y-5">
        <h3 className="font-black text-base leading-relaxed text-[var(--app-text)]">{currentItem && renderArabicText(currentItem.questionOrPromptAr)}</h3>

        {currentItem?.optionsAr && currentItem.optionsAr.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.optionsAr.map((opt, idx) => {
              const isThisSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentItem.correctAnswerAr;
              return (
                <button
                  key={idx}
                  onClick={() => handlePickOption(opt)}
                  className={`p-4 rounded-2xl border text-right text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isAnswerRevealed && isCorrectOpt
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : isAnswerRevealed && isThisSelected && !isCorrectOpt
                      ? 'bg-[#FFF5F4] border-[#F0C9C6] text-[#9F221C]'
                      : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] hover:bg-[var(--app-card-bg)]'
                  }`}
                >
                  <span>{opt}</span>
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
              {renderArabicText(currentItem.explanationAr)}
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
