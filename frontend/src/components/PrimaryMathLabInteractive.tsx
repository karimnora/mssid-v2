import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { speakText } from '../utils/speech';
import {
  Calculator,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Flame,
  HelpCircle,
  Layers,
  Volume2,
} from 'lucide-react';
import { PrimaryGrade } from '../types';
import {
  canShowColumnCarryOps,
  primaryMathNumberStripMax,
} from '../utils/labGradePolicy';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface PrimaryMathLabInteractiveProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type SubTab = 'number_strip' | 'column_addition' | 'column_subtraction';

export const PrimaryMathLabInteractive: React.FC<PrimaryMathLabInteractiveProps> = ({
  grade = '2AP',
  onReward,
  onBack,
}) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsMath');
  const tCommon = useTranslation('common');
  const stripMax = primaryMathNumberStripMax(grade);
  const stripCount = stripMax + 1;
  const showColumnOps = canShowColumnCarryOps(grade);

  const [activeTab, setActiveTab] = useState<SubTab>('number_strip');

  // --- 1. Number Strip State (0 to 99) ---
  const [selectedNumber, setSelectedNumber] = useState<number>(() => Math.min(25, stripMax));
  const [stripFilter, setStripFilter] = useState<'all' | 'even' | 'odd' | 'tens'>('all');

  // --- 2. Column Addition State ---
  const [addNum1, setAddNum1] = useState<number>(47);
  const [addNum2, setAddNum2] = useState<number>(38);
  const [addUnitsInput, setAddUnitsInput] = useState<string>('');
  const [addTensInput, setAddTensInput] = useState<string>('');
  const [addCarryInput, setAddCarryInput] = useState<string>('');
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  // --- 3. Column Subtraction State ---
  const [subNum1, setSubNum1] = useState<number>(63);
  const [subNum2, setSubNum2] = useState<number>(27);
  const [subUnitsInput, setSubUnitsInput] = useState<string>('');
  const [subTensInput, setSubTensInput] = useState<string>('');
  const [subFeedback, setSubFeedback] = useState<string | null>(null);
  const [subSuccess, setSubSuccess] = useState<boolean>(false);

  // Sound synthesis — routed through the shared speakText utility so this gets the same reliable
  // native Android TTS (via Capacitor) as other labs, instead of the Android WebView's own
  // window.speechSynthesis, which commonly reports zero installed voices there.
  const speakNumber = (num: number) => {
    speakText(`${num}`, 'ar-SA', 0.9);
  };

  // Check Addition
  const checkAddition = () => {
    const expectedSum = addNum1 + addNum2;
    const userUnits = parseInt(addUnitsInput, 10);
    const userTens = parseInt(addTensInput, 10);
    const userTotal = userTens * 10 + userUnits;

    if (userTotal === expectedSum) {
      setAddSuccess(true);
      setAddFeedback('ok');
      onReward?.(10, 30);
    } else {
      setAddSuccess(false);
      setAddFeedback('hint');
    }
  };

  const newAdditionExercise = () => {
    // The result only has tens+units input boxes (no hundreds), so the sum must stay ≤99 — the old
    // ranges (15-74 + 8-42) could reach 116, making the exercise impossible to answer correctly.
    // Also force a genuine carry (units digits summing to ≥10) to match "الجمع بالاحتفاظ".
    let n1 = 0;
    let n2 = 0;
    do {
      n1 = Math.floor(Math.random() * 60) + 15; // 15–74
      n2 = Math.floor(Math.random() * 35) + 8; // 8–42
    } while (n1 + n2 > 99 || (n1 % 10) + (n2 % 10) < 10);
    setAddNum1(n1);
    setAddNum2(n2);
    setAddUnitsInput('');
    setAddTensInput('');
    setAddCarryInput('');
    setAddFeedback(null);
    setAddSuccess(false);
  };

  // Check Subtraction
  const checkSubtraction = () => {
    const expectedDiff = subNum1 - subNum2;
    const userUnits = parseInt(subUnitsInput, 10);
    const userTens = parseInt(subTensInput, 10);
    const userTotal = userTens * 10 + userUnits;

    if (userTotal === expectedDiff) {
      setSubSuccess(true);
      setSubFeedback('ok');
      onReward?.(10, 30);
    } else {
      setSubSuccess(false);
      setSubFeedback('hint');
    }
  };

  const newSubtractionExercise = () => {
    // The tab is titled "بالاستعارة" (WITH borrowing), so force the units digit of n1 to be
    // strictly smaller than n2's — otherwise the random pair sometimes needed no borrowing at all,
    // silently skipping the very skill this exercise claims to practice.
    let n1 = 0;
    let n2 = 0;
    do {
      n1 = Math.floor(Math.random() * 50) + 40; // 40–89
      n2 = Math.floor(Math.random() * 30) + 11; // 11–40
    } while (n1 <= n2 || n1 % 10 >= n2 % 10);
    setSubNum1(n1);
    setSubNum2(n2);
    setSubUnitsInput('');
    setSubTensInput('');
    setSubFeedback(null);
    setSubSuccess(false);
  };

  const tensOfSelected = Math.floor(selectedNumber / 10);
  const unitsOfSelected = selectedNumber % 10;

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir={direction}>
      {/* Header */}
      <div className="kids-pole rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label={tCommon('backToTools')}
              className="shrink-0 w-14 h-14 flex items-center justify-center bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] rounded-2xl border border-[var(--app-card-border)] shadow-sm cursor-pointer"
            >
              {direction === 'rtl' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[var(--brand-emerald-dark)] px-3 py-1 rounded-full text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
              <span>{t('pmlBadge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold font-sans text-[var(--kids-ink)]">
              {t('pmlTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--kids-muted)] leading-relaxed max-w-3xl">
              {t('pmlSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('number_strip')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'number_strip'
              ? 'bg-amber-500 text-slate-950 shadow-md font-sans'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>{t('pmlTabNumberStrip')}</span>
        </button>

        {showColumnOps && (
        <>
        <button
          onClick={() => setActiveTab('column_addition')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'column_addition'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>{t('pmlTabAddition')}</span>
        </button>

        <button
          onClick={() => setActiveTab('column_subtraction')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'column_subtraction'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>{t('pmlTabSubtraction')}</span>
        </button>
        </>
        )}
      </div>

      {/* TAB 1: Number Strip (0 to 99) */}
      {activeTab === 'number_strip' && (
        <div className="space-y-6">
          {/* Card: Inspection & Visual Decomposition */}
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[var(--app-card-border)] pb-4">
              <div>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full">
                  {t('pmlDecompositionLabel')}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-amber-600 font-mono">
                    {selectedNumber}
                  </span>
                  <button
                    onClick={() => speakNumber(selectedNumber)}
                    className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    title={t('pmlListenTitle')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tens and Units blocks */}
              <div className="flex items-center gap-4 bg-[var(--app-card-subtle)] p-4 rounded-2xl border border-[var(--app-card-border)]">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-blue-600 block">{t('pmlTensStat')}</span>
                  <span className="text-2xl font-black text-blue-700 font-mono">{tensOfSelected}</span>
                  <span className="text-[10px] text-[var(--app-text-muted)]">({tensOfSelected * 10})</span>
                </div>
                <div className="w-px h-10 bg-[var(--app-card-border)]" />
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-700 block">{t('pmlUnitsStat')}</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">{unitsOfSelected}</span>
                  <span className="text-[10px] text-[var(--app-text-muted)]">({unitsOfSelected})</span>
                </div>
              </div>
            </div>

            {/* Visual Blocks representation */}
            <div className="space-y-3">
              <div className="text-xs font-black text-[var(--app-text)]">{t('pmlBlocksRepresentationLabel')}</div>
              <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] flex items-center gap-6 flex-wrap">
                {/* Tens bars */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--app-text-muted)] font-bold">{t('pmlTensRodsLabel')}</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: tensOfSelected }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-14 bg-gradient-to-t from-blue-600 to-blue-400 rounded-md shadow-2xs border border-blue-700 flex flex-col justify-between py-1 items-center"
                        title={t('pmlRodTitle')}
                      >
                        {Array.from({ length: 5 }).map((_, d) => (
                          <div key={d} className="w-2.5 h-1 bg-white/40 rounded-full" />
                        ))}
                      </div>
                    ))}
                    {tensOfSelected === 0 && <span className="text-xs text-slate-400">{t('pmlNoTens')}</span>}
                  </div>
                </div>

                {/* Units cubes */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--app-text-muted)] font-bold">{t('pmlUnitsCubesLabel')}</span>
                  <div className="flex items-center gap-1 flex-wrap max-w-xs">
                    {Array.from({ length: unitsOfSelected }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-sm shadow-2xs border border-emerald-700"
                        title={t('pmlUnitSquareTitle')}
                      />
                    ))}
                    {unitsOfSelected === 0 && <span className="text-xs text-slate-400">{t('pmlZeroUnits')}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-[var(--app-text-muted)]">{t('pmlFilterLabel')}</span>
              <button
                onClick={() => setStripFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'all' ? 'bg-amber-500 text-slate-950 font-sans' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                {t('pmlFilterAll')}
              </button>
              {stripMax > 20 && (
              <button
                onClick={() => setStripFilter('tens')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'tens' ? 'bg-blue-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                {t('pmlFilterTens')}
              </button>
              )}
              <button
                onClick={() => setStripFilter('even')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'even' ? 'bg-emerald-700 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                {t('pmlFilterEven')}
              </button>
              <button
                onClick={() => setStripFilter('odd')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'odd' ? 'bg-purple-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                {t('pmlFilterOdd')}
              </button>
            </div>

            {/* 0-99 Interactive Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-72 overflow-y-auto p-2 border border-[var(--app-card-border)] rounded-2xl bg-[var(--app-card-subtle)]">
              {Array.from({ length: stripCount }).map((_, num) => {
                const isSelected = selectedNumber === num;
                const isTens = num % 10 === 0;
                const isEven = num % 2 === 0;

                let isVisible = true;
                if (stripFilter === 'tens') isVisible = isTens;
                if (stripFilter === 'even') isVisible = isEven;
                if (stripFilter === 'odd') isVisible = !isEven;

                return (
                  <button
                    key={num}
                    disabled={!isVisible}
                    onClick={() => setSelectedNumber(num)}
                    className={`h-9 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 scale-110 shadow-md ring-2 ring-amber-300 font-sans'
                        : isTens
                        ? 'bg-blue-100 text-blue-900 border border-blue-300 font-bold'
                        : isVisible
                        ? 'bg-[var(--app-card-bg)] text-[var(--app-text)] border border-[var(--app-card-border)] hover:border-amber-400'
                        : 'opacity-20 bg-slate-200 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Column Addition */}
      {activeTab === 'column_addition' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4">
            <div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {t('pmlAdditionBadge')}
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)] mt-1">
                {t('pmlAdditionHeading')}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={newAdditionExercise} icon={<RotateCcw className="w-4 h-4" />}>
              {t('pmlNewExerciseButton')}
            </Button>
          </div>

          {/* Interactive Column Grid — every row below is forced dir="ltr" (Western digits are
              always read left-to-right even on an RTL page) AND uses justify-center with a
              same-width leading spacer/operator column, instead of justify-end/between + one-sided
              padding: that edge-anchored approach was tuned for the old ambient-RTL layout, and
              flipped to the wrong edge once dir="ltr" changed which side "end" means, throwing the
              rows out of alignment with each other. Centering is symmetric regardless of direction,
              so it can't drift like that again. */}
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-[var(--app-card-subtle)] border-2 border-emerald-300 space-y-4 text-center" dir="ltr">
            {/* Carry input — leading column aligns with the tens digit below */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center bg-amber-50">
                <input
                  type="text"
                  maxLength={1}
                  placeholder="1"
                  value={addCarryInput}
                  onChange={(e) => setAddCarryInput(e.target.value)}
                  className="w-full h-full text-center font-mono font-black text-amber-700 text-sm focus:outline-hidden"
                  title={t('pmlCarryTitle')}
                />
              </div>
              <span className="w-8" />
            </div>

            {/* Row 1 — leading spacer matches row 2's operator column width */}
            <div className="flex items-center justify-center gap-6 text-3xl font-black font-mono text-[var(--app-text)]">
              <span className="w-8" />
              <span className="w-8">{Math.floor(addNum1 / 10)}</span>
              <span className="w-8">{addNum1 % 10}</span>
            </div>

            {/* Row 2 with + sign */}
            <div className="flex items-center justify-center gap-6 text-3xl font-black font-mono text-[var(--app-text)] border-b-4 border-slate-900 pb-2">
              <span className="w-8 text-emerald-700 text-4xl">+</span>
              <span className="w-8">{Math.floor(addNum2 / 10)}</span>
              <span className="w-8">{addNum2 % 10}</span>
            </div>

            {/* Result inputs */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <span className="w-8" />
              <input
                type="text"
                maxLength={1}
                value={addTensInput}
                onChange={(e) => setAddTensInput(e.target.value)}
                placeholder="?"
                className="w-10 h-12 rounded-xl border-2 border-emerald-500 text-center font-mono font-black text-2xl bg-[var(--app-card-bg)] text-[var(--app-text)] focus:ring-2 focus:ring-emerald-400"
              />
              <input
                type="text"
                maxLength={1}
                value={addUnitsInput}
                onChange={(e) => setAddUnitsInput(e.target.value)}
                placeholder="?"
                className="w-10 h-12 rounded-xl border-2 border-emerald-500 text-center font-mono font-black text-2xl bg-[var(--app-card-bg)] text-[var(--app-text)] focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <Button variant="primary" fullWidth onClick={checkAddition}>
              {t('pmlCheckAdditionButton')}
            </Button>
          </div>

          {addFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold text-center ${
                addSuccess ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {addSuccess
                ? t('pmlAdditionSuccess')
                : t('pmlAdditionHint', {
                    a: addNum1 % 10,
                    b: addNum2 % 10,
                    sum: (addNum1 % 10) + (addNum2 % 10),
                  })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Column Subtraction */}
      {activeTab === 'column_subtraction' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4">
            <div>
              <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                {t('pmlSubtractionBadge')}
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)] mt-1">
                {t('pmlSubtractionHeading')}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={newSubtractionExercise} icon={<RotateCcw className="w-4 h-4" />}>
              {t('pmlNewExerciseButton')}
            </Button>
          </div>

          {/* Interactive Subtraction Grid — dir="ltr" for the same reason as the addition grid
              above, plus justify-center with a same-width leading spacer instead of
              justify-end/between + one-sided padding (see the addition grid's comment: that
              edge-anchored approach flips to the wrong edge once dir="ltr" changes what "end"
              means, throwing the rows out of alignment with each other). */}
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-[var(--app-card-subtle)] border-2 border-blue-300 space-y-4 text-center" dir="ltr">
            {/* Row 1 — leading spacer matches row 2's operator column width */}
            <div className="flex items-center justify-center gap-6 text-3xl font-black font-mono text-[var(--app-text)]">
              <span className="w-8" />
              <span className="w-8">{Math.floor(subNum1 / 10)}</span>
              <span className="w-8">{subNum1 % 10}</span>
            </div>

            {/* Row 2 with - sign */}
            <div className="flex items-center justify-center gap-6 text-3xl font-black font-mono text-[var(--app-text)] border-b-4 border-slate-900 pb-2">
              <span className="w-8 text-blue-600 text-4xl">-</span>
              <span className="w-8">{Math.floor(subNum2 / 10)}</span>
              <span className="w-8">{subNum2 % 10}</span>
            </div>

            {/* Result inputs */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <span className="w-8" />
              <input
                type="text"
                maxLength={1}
                value={subTensInput}
                onChange={(e) => setSubTensInput(e.target.value)}
                placeholder="?"
                className="w-10 h-12 rounded-xl border-2 border-blue-500 text-center font-mono font-black text-2xl bg-[var(--app-card-bg)] text-[var(--app-text)] focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                maxLength={1}
                value={subUnitsInput}
                onChange={(e) => setSubUnitsInput(e.target.value)}
                placeholder="?"
                className="w-10 h-12 rounded-xl border-2 border-blue-500 text-center font-mono font-black text-2xl bg-[var(--app-card-bg)] text-[var(--app-text)] focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <Button variant="primary" fullWidth onClick={checkSubtraction}>
              {t('pmlCheckSubtractionButton')}
            </Button>
          </div>

          {subFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold text-center ${
                subSuccess ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {subSuccess ? t('pmlSubtractionSuccess') : t('pmlSubtractionHint')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
