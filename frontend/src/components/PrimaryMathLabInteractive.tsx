import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import { isFeatureEnabled } from '../featureFlags';
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
  const stripMax = primaryMathNumberStripMax(grade);
  const stripCount = stripMax + 1;
  const showColumnOps = canShowColumnCarryOps(grade);

  const [activeTab, setActiveTab] = useState<SubTab>('number_strip');

  // --- 1. Number Strip State (0 to 99) ---
  const [selectedNumber, setSelectedNumber] = useState<number>(() => Math.min(25, stripMax));
  const [stripFilter, setStripFilter] = useState<'all' | 'even' | 'odd' | 'tens'>('all');
  const [mysteryTarget, setMysteryTarget] = useState<number>(() => {
    const min = stripMax <= 20 ? 1 : 10;
    return Math.floor(Math.random() * Math.max(1, stripMax - min)) + min;
  });
  const [mysteryFeedback, setMysteryFeedback] = useState<string | null>(null);

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

  // Sound synthesis
  const speakNumber = (num: number) => {
    if (!isFeatureEnabled('voiceReading')) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${num}`);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Check Addition
  const checkAddition = () => {
    const expectedSum = addNum1 + addNum2;
    const userUnits = parseInt(addUnitsInput, 10);
    const userTens = parseInt(addTensInput, 10);
    const userTotal = userTens * 10 + userUnits;

    if (userTotal === expectedSum) {
      setAddSuccess(true);
      setAddFeedback('ممتاز يا بطل! الحساب صحيح 100% وتمت معالجة الاحتفاظ بنجاح 🌟');
      onReward?.(10, 30);
    } else {
      setAddSuccess(false);
      setAddFeedback(`انتبه: ${addNum1 % 10} + ${addNum2 % 10} = ${(addNum1 % 10) + (addNum2 % 10)}. ضع رقم الوحدات في الأسفل وارفع الاحتفاظ فوق العشرات!`);
    }
  };

  const newAdditionExercise = () => {
    const n1 = Math.floor(Math.random() * 60) + 15;
    const n2 = Math.floor(Math.random() * 35) + 8;
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
      setSubFeedback('أحسنت صنعاً! عملية الطرح بالاستعارة صحيحة تماماً 🌟');
      onReward?.(10, 30);
    } else {
      setSubSuccess(false);
      setSubFeedback(`تذكر: إذا كان رقم الوحدات العلوي أصغر، نستعير 10 من العشرات (أو نطبق طريقة الإضافة والإرجاع).`);
    }
  };

  const newSubtractionExercise = () => {
    const n1 = Math.floor(Math.random() * 50) + 40;
    const n2 = Math.floor(Math.random() * 30) + 11;
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
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>مختبر الرياضيات التفاعلي — {grade === '1AP' ? 'السنة الأولى (0–20)' : 'السنة الأولى والثانية (1AP / 2AP)'}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-sans">
            {grade === '1AP'
              ? 'الشريط العددي حتى 20'
              : 'الشريط العددي حتى 99 والعمليات العمودية (الجمع والطرح)'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed max-w-3xl">
            {grade === '1AP'
              ? 'استكشف الأعداد من 0 إلى 20 وتعلّم تفكيك الوحدات والعشرات.'
              : 'استكشف الشريط العددي من 0 إلى 99، وتعلّم تفكيك الوحدات والعشرات، وتدرّب خطوة بخطوة على وضع العمليات الحسابية بالاحتفاظ والاستعارة.'}
          </p>
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
          <span>🔢 الشريط العددي (0 إلى {stripMax})</span>
        </button>

        {showColumnOps && (
        <>
        <button
          onClick={() => setActiveTab('column_addition')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'column_addition'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>➕ الجمع العمودي بالاحتفاظ</span>
        </button>

        <button
          onClick={() => setActiveTab('column_subtraction')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'column_subtraction'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>➖ الطرح العمودي بالاستعارة</span>
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
                  تفكيك العدد المختار
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-amber-600 font-mono">
                    {selectedNumber}
                  </span>
                  <button
                    onClick={() => speakNumber(selectedNumber)}
                    className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    title="استمع لنطق العدد"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tens and Units blocks */}
              <div className="flex items-center gap-4 bg-[var(--app-card-subtle)] p-4 rounded-2xl border border-[var(--app-card-border)]">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-blue-600 block">العشرات (Dizaines)</span>
                  <span className="text-2xl font-black text-blue-700 font-mono">{tensOfSelected}</span>
                  <span className="text-[10px] text-[var(--app-text-muted)]">({tensOfSelected * 10})</span>
                </div>
                <div className="w-px h-10 bg-[var(--app-card-border)]" />
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-600 block">الوحدات (Unités)</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">{unitsOfSelected}</span>
                  <span className="text-[10px] text-[var(--app-text-muted)]">({unitsOfSelected})</span>
                </div>
              </div>
            </div>

            {/* Visual Blocks representation */}
            <div className="space-y-3">
              <div className="text-xs font-black text-[var(--app-text)]">التمثيل بقطع وقضبان الحساب:</div>
              <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] flex items-center gap-6 flex-wrap">
                {/* Tens bars */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--app-text-muted)] font-bold">العشرات:</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: tensOfSelected }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-14 bg-gradient-to-t from-blue-600 to-blue-400 rounded-md shadow-2xs border border-blue-700 flex flex-col justify-between py-1 items-center"
                        title="قضيب 10"
                      >
                        {Array.from({ length: 5 }).map((_, d) => (
                          <div key={d} className="w-2.5 h-1 bg-white/40 rounded-full" />
                        ))}
                      </div>
                    ))}
                    {tensOfSelected === 0 && <span className="text-xs text-slate-400">لا توجد عشرات</span>}
                  </div>
                </div>

                {/* Units cubes */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--app-text-muted)] font-bold">الوحدات:</span>
                  <div className="flex items-center gap-1 flex-wrap max-w-xs">
                    {Array.from({ length: unitsOfSelected }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-sm shadow-2xs border border-emerald-700"
                        title="مربع وحدة"
                      />
                    ))}
                    {unitsOfSelected === 0 && <span className="text-xs text-slate-400">0 وحدات</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-[var(--app-text-muted)]">تصفية الشريط:</span>
              <button
                onClick={() => setStripFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'all' ? 'bg-amber-500 text-slate-950 font-sans' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                الكل (0-{stripMax})
              </button>
              {stripMax > 20 && (
              <button
                onClick={() => setStripFilter('tens')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'tens' ? 'bg-blue-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                العشرات الكاملة (10, 20...)
              </button>
              )}
              <button
                onClick={() => setStripFilter('even')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'even' ? 'bg-emerald-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                الأعداد الزوجية
              </button>
              <button
                onClick={() => setStripFilter('odd')}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                  stripFilter === 'odd' ? 'bg-purple-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
                }`}
              >
                الأعداد الفردية
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
                الجمع العمودي بالاحتفاظ
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)] mt-1">
                احسب العملية العمودية خطوة بخطوة
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={newAdditionExercise} icon={<RotateCcw className="w-4 h-4" />}>
              عملية جديدة
            </Button>
          </div>

          {/* Interactive Column Grid */}
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-[var(--app-card-subtle)] border-2 border-emerald-300 space-y-4 text-center">
            {/* Carry input */}
            <div className="flex items-center justify-end gap-6 pl-8">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center bg-amber-50">
                <input
                  type="text"
                  maxLength={1}
                  placeholder="1"
                  value={addCarryInput}
                  onChange={(e) => setAddCarryInput(e.target.value)}
                  className="w-full h-full text-center font-mono font-black text-amber-700 text-sm focus:outline-hidden"
                  title="مكان الاحتفاظ"
                />
              </div>
              <div className="w-8" />
            </div>

            {/* Row 1 */}
            <div className="flex items-center justify-end gap-6 text-3xl font-black font-mono text-[var(--app-text)] pl-8">
              <span className="w-8">{Math.floor(addNum1 / 10)}</span>
              <span className="w-8">{addNum1 % 10}</span>
            </div>

            {/* Row 2 with + sign */}
            <div className="flex items-center justify-between text-3xl font-black font-mono text-[var(--app-text)] border-b-4 border-slate-900 pb-2">
              <span className="text-emerald-600 text-4xl">+</span>
              <div className="flex items-center gap-6">
                <span className="w-8">{Math.floor(addNum2 / 10)}</span>
                <span className="w-8">{addNum2 % 10}</span>
              </div>
            </div>

            {/* Result inputs */}
            <div className="flex items-center justify-end gap-6 pt-2 pl-8">
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
              تحقق من صحة العملية ✨
            </Button>
          </div>

          {addFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold text-center ${
                addSuccess ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {addFeedback}
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
                الطرح العمودي بالاستعارة
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)] mt-1">
                احسب عملية الطرح بالاستعارة والإرجاع
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={newSubtractionExercise} icon={<RotateCcw className="w-4 h-4" />}>
              عملية جديدة
            </Button>
          </div>

          {/* Interactive Subtraction Grid */}
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-[var(--app-card-subtle)] border-2 border-blue-300 space-y-4 text-center">
            {/* Row 1 */}
            <div className="flex items-center justify-end gap-6 text-3xl font-black font-mono text-[var(--app-text)] pl-8">
              <span className="w-8">{Math.floor(subNum1 / 10)}</span>
              <span className="w-8">{subNum1 % 10}</span>
            </div>

            {/* Row 2 with - sign */}
            <div className="flex items-center justify-between text-3xl font-black font-mono text-[var(--app-text)] border-b-4 border-slate-900 pb-2">
              <span className="text-blue-600 text-4xl">-</span>
              <div className="flex items-center gap-6">
                <span className="w-8">{Math.floor(subNum2 / 10)}</span>
                <span className="w-8">{subNum2 % 10}</span>
              </div>
            </div>

            {/* Result inputs */}
            <div className="flex items-center justify-end gap-6 pt-2 pl-8">
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
              تحقق من صحة الطرح ✨
            </Button>
          </div>

          {subFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold text-center ${
                subSuccess ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {subFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
