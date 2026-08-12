import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHALLENGES_DATA } from '../data/challengesData';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Challenge, SubjectId } from '../types';
import { Button, Card, Badge, XPProgressBar } from './ui';
import { Trophy, Timer, ChevronLeft, CheckCircle2, XCircle, Sparkles, RotateCcw, Zap } from 'lucide-react';
import { stripArabicTashkeel } from '../utils/textFormatter';

interface ChallengesArenaProps {
  tashkeelEnabled?: boolean;
  /** Persists the run's XP into the global profile and marks the challenge completed — called once per finished run. */
  onChallengeComplete?: (challengeId: string, earnedXp: number) => void;
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

export const ChallengesArena: React.FC<ChallengesArenaProps> = ({ tashkeelEnabled = true, onChallengeComplete }) => {
  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const challengeSubjects = useMemo(() => {
    const ids = Array.from(new Set(CHALLENGES_DATA.map((c) => c.subject)));
    return ids.map((id) => SUBJECTS_LIST.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  }, []);

  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Challenge['difficulty'] | 'all'>('all');
  const filteredChallenges = CHALLENGES_DATA.filter(
    (c) => (subjectFilter === 'all' || c.subject === subjectFilter) && (difficultyFilter === 'all' || c.difficulty === difficultyFilter)
  );

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  /** Marks the run finished and reports its earned XP up to the parent exactly once — call instead of setIsFinished directly. */
  const finishChallenge = () => {
    if (!activeChallenge) return;
    setIsFinished(true);
    const earnedXp = Math.round((activeChallenge.xpReward * correctCount) / activeChallenge.items.length);
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
    setTimeLeft(challenge.timeLimitSeconds ?? null);
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
    if (opt === currentItem.correctAnswerAr) setCorrectCount((c) => c + 1);
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
      <div className="space-y-6 dir-rtl" dir="rtl">
        <div className="bg-gradient-to-r from-rose-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-rose-800/40">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-400/30 text-rose-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>نادي التحديات والمسابقات (5AP)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-sans">تحديات مؤقتة وألعاب سريعة لكسب نقاط الخبرة</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">اختر مادة ومستوى صعوبة، وابدأ التحدي لتختبر معلوماتك بسرعة وتربح XP.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-500 px-2 shrink-0">المادة:</span>
          <button
            onClick={() => setSubjectFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subjectFilter === 'all' ? 'bg-rose-600 text-white shadow-xs font-extrabold scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          {challengeSubjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubjectFilter(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                subjectFilter === s.id ? 'bg-rose-600 text-white shadow-xs font-extrabold scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.nameAr}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-500 px-2 shrink-0">الصعوبة:</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                difficultyFilter === d ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d === 'all' ? 'الكل' : DIFFICULTY_LABEL[d]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((challenge) => {
            const subjectName = SUBJECTS_LIST.find((s) => s.id === challenge.subject)?.nameAr || challenge.subject;
            return (
              <Card key={challenge.id} interactive padding="md" onClick={() => startChallenge(challenge)} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{subjectName}</Badge>
                  <Badge variant={challenge.difficulty === 'hard' ? 'danger' : challenge.difficulty === 'medium' ? 'xp' : 'success'}>
                    {DIFFICULTY_LABEL[challenge.difficulty]}
                  </Badge>
                </div>
                <h3 className="font-black text-sm">{renderArabicText(challenge.titleAr)}</h3>
                <p className="text-xs text-[var(--app-text-muted)] leading-relaxed">{renderArabicText(challenge.descriptionAr)}</p>
                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-muted)]">
                  <span>{FORMAT_LABEL[challenge.format]}</span>
                  <span dir="ltr">{challenge.items.length} أسئلة</span>
                </div>
                <Button variant="danger" size="sm" fullWidth icon={<Zap className="w-4 h-4" />}>
                  ابدأ التحدي (<span dir="ltr">+{challenge.xpReward} XP</span>)
                </Button>
              </Card>
            );
          })}
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
            <span dir="ltr">+{Math.round((activeChallenge.xpReward * correctCount) / total)} XP</span>
          </Badge>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" onClick={exitChallenge} icon={<ChevronLeft className="w-4 h-4" />}>
              العودة للقائمة
            </Button>
            <Button variant="danger" onClick={() => startChallenge(activeChallenge)} icon={<RotateCcw className="w-4 h-4" />}>
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
        <h3 className="font-black text-base leading-relaxed">{currentItem && renderArabicText(currentItem.questionOrPromptAr)}</h3>

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
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] hover:bg-[var(--app-card-bg)]'
                  }`}
                >
                  <span dir="ltr">{opt}</span>
                  {isAnswerRevealed && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isAnswerRevealed && isThisSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
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
          <Button variant="danger" fullWidth onClick={goNext}>
            {itemIndex + 1 >= activeChallenge.items.length ? 'إنهاء التحدي' : 'السؤال التالي'}
          </Button>
        )}
      </Card>
    </div>
  );
};
