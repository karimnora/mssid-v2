import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { labQuizIsLocked, labQuizOptionClass } from '../utils/labQuizChoice';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface ClockTrainerLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type ClockTab = 'explore' | 'quiz';

const QUIZ_TIMES_HOUR_HALF = [
  { hour: 3, minute: 0, labelAr: 'الثَّالِثَةُ تَمَاماً' },
  { hour: 6, minute: 30, labelAr: 'السَّادِسَةُ وَالنِّصْفُ' },
  { hour: 8, minute: 0, labelAr: 'الثَّامِنَةُ تَمَاماً' },
  { hour: 1, minute: 30, labelAr: 'الوَاحِدَةُ وَالنِّصْفُ' },
  { hour: 9, minute: 0, labelAr: 'التَّاسِعَةُ تَمَاماً' },
];

const QUIZ_TIMES_WITH_QUARTERS = [
  ...QUIZ_TIMES_HOUR_HALF,
  { hour: 9, minute: 15, labelAr: 'التَّاسِعَةُ وَرُبُعٌ' },
  { hour: 12, minute: 45, labelAr: 'الوَاحِدَةُ إِلَّا رُبُعاً' },
];

/** 2AP: hour and half-hour only. Quarters stay for 3AP+. */
export function clockTrainerForGrade(grade?: PrimaryGrade) {
  const hourAndHalfOnly = grade === '2AP';
  return {
    minuteStep: hourAndHalfOnly ? 30 : 5,
    quizTimes: hourAndHalfOnly ? QUIZ_TIMES_HOUR_HALF : QUIZ_TIMES_WITH_QUARTERS,
  };
}

const AnalogClock: React.FC<{ hour: number; minute: number }> = ({ hour, minute }) => {
  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const minuteDeg = minute * 6;
  return (
    <div className="relative w-48 h-48 mx-auto rounded-full bg-white border-4 border-slate-700 shadow-lg">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1 h-3 bg-slate-500 left-1/2 top-1"
          style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: '50% 88px' }}
        />
      ))}
      {/* Inline background (not the bg-slate-900 class): the lab-interior wrapper's force-light-card
          override neutralizes that exact class to white, which made this hand invisible against the
          white clock face — the clock then looked frozen near 12 no matter the real hour, since only
          the (unaffected, sky-600) minute hand stayed visible. */}
      <div
        className="absolute w-1.5 h-14 left-1/2 top-1/2 rounded-full origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`, backgroundColor: '#0f172a' }}
      />
      <div
        className="absolute w-1 h-20 bg-sky-600 left-1/2 top-1/2 rounded-full origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}
      />
      <div className="absolute w-3 h-3 bg-rose-600 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export const ClockTrainerLab: React.FC<ClockTrainerLabProps> = ({ grade = '2AP', onReward, onBack }) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsMath');
  const tCommon = useTranslation('common');
  const { minuteStep, quizTimes } = clockTrainerForGrade(grade);
  const [activeTab, setActiveTab] = useState<ClockTab>('explore');
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(0);
  const [qIdx, setQIdx] = useState<number>(0);
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);

  const currentQ = quizTimes[qIdx % quizTimes.length];
  const options = useMemo(() => {
    const wrongPool = quizTimes.filter((_, i) => i !== qIdx % quizTimes.length);
    const shuffled = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 2);
    return [...shuffled, currentQ].sort(() => Math.random() - 0.5);
  }, [qIdx, currentQ, quizTimes]);

  const handleQuizAnswer = (labelAr: string) => {
    if (labQuizIsLocked(selectedLabel, currentQ.labelAr)) return;
    setSelectedLabel(labelAr);
    if (labelAr === currentQ.labelAr) onReward?.(5, 15);
  };

  const nextQuiz = () => {
    setQIdx((prev) => (prev + 1) % quizTimes.length);
    setSelectedLabel(undefined);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={direction}>
      <div className="kids-pole rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              data-activity-navigation="true" onClick={onBack}
              aria-label={tCommon('backToTools')}
              className="hit-target shrink-0 flex items-center justify-center bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] rounded-2xl border border-[var(--app-card-border)] shadow-sm cursor-pointer"
            >
              {direction === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[var(--brand-emerald-dark)] px-3 py-1 rounded-full text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
              <span>{t('clockBadge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold font-sans text-[var(--kids-ink)]">{t('clockTitle')}</h1>
            <p className="text-xs sm:text-sm text-[var(--kids-muted)] leading-relaxed max-w-3xl">
              {t('clockSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('explore')}
          className={`hit-target px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'explore' ? 'bg-[var(--brand-emerald)] text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          {t('clockTabExplore')}
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`hit-target px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'quiz' ? 'bg-[var(--brand-emerald)] text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          {t('clockTabQuiz')}
        </button>
      </div>

      {activeTab === 'explore' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <AnalogClock hour={hour} minute={minute} />
          <p className="font-extrabold text-3xl text-[var(--brand-emerald)] font-sans tabular-nums">
            {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="space-y-1.5">
              <p className="text-xs font-black text-[var(--app-text-muted)]">{t('clockHoursLabel')}</p>
              <input
                type="range"
                min={0}
                max={11}
                value={hour % 12}
                onChange={(e) => setHour(Number(e.target.value))}
                aria-label={t('clockHoursLabel')}
                className="w-full cursor-pointer accent-[var(--brand-emerald)]"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-black text-[var(--app-text-muted)]">{t('clockMinutesLabel')}</p>
              <input
                type="range"
                min={0}
                max={minuteStep === 30 ? 30 : 55}
                step={minuteStep}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                aria-label={t('clockMinutesLabel')}
                className="w-full cursor-pointer accent-[var(--brand-emerald)]"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <h2 className="text-sm font-black text-[var(--app-text)]">مَا هُوَ الوَقْتُ المَعْرُوضُ عَلَى السَّاعَةِ؟</h2>
          <AnalogClock hour={currentQ.hour} minute={currentQ.minute} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
            {options.map((opt) => (
                <button
                  key={opt.labelAr}
                  type="button"
                  onClick={() => handleQuizAnswer(opt.labelAr)}
                  className={labQuizOptionClass(
                    selectedLabel,
                    opt.labelAr,
                    currentQ.labelAr,
                    'hit-target p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer',
                  )}
                >
                  {opt.labelAr}
                </button>
            ))}
          </div>
          {selectedLabel !== undefined && (
            <div className={`text-sm font-black p-3 rounded-xl max-w-lg mx-auto ${selectedLabel === currentQ.labelAr ? 'bg-emerald-100 text-emerald-900' : 'bg-[#FFF8E7] text-[var(--app-text)] border border-[var(--brand-coral)]'}`}>
              {selectedLabel === currentQ.labelAr ? t('clockCorrectFeedback') : tCommon('tryAgain')}
            </div>
          )}
          {selectedLabel === currentQ.labelAr && (
            <button
              onClick={nextQuiz}
              className="hit-target px-5 py-3 rounded-2xl bg-[var(--brand-emerald)] text-white font-extrabold text-xs sm:text-sm cursor-pointer"
            >
              {t('clockNextButton')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
