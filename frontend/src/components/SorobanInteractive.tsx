import React, { useState, useEffect } from 'react';
import { SOROBAN_RULES, SOROBAN_PRACTICE_EXERCISES } from '../data/sorobanData';
import { Play, RotateCcw, CheckCircle2, XCircle, Sparkles, HelpCircle, Zap, ShieldCheck } from 'lucide-react';

interface SorobanInteractiveProps {
  grade?: string;
  onCompleteExercise?: (score: number) => void;
}

export const SorobanInteractive: React.FC<SorobanInteractiveProps> = ({ grade = '4AP', onCompleteExercise }) => {
  // 5 Rods for 0-99,999 representation
  // Each rod has upperBead (0 or 5) and lowerBeads (0 to 4)
  const [rods, setRods] = useState<{ upper: boolean; lowerCount: number }[]>([
    { upper: false, lowerCount: 0 }, // Rod 4 (10,000s)
    { upper: false, lowerCount: 0 }, // Rod 3 (1,000s)
    { upper: false, lowerCount: 0 }, // Rod 2 (100s)
    { upper: false, lowerCount: 0 }, // Rod 1 (10s)
    { upper: false, lowerCount: 0 }, // Rod 0 (1s)
  ]);

  const [activeTab, setActiveToolTab] = useState<'abacus' | 'anzan' | 'rules'>('abacus');

  // Anzan State
  const [anzanRunning, setAnzanRunning] = useState(false);
  const [currentFlashIndex, setCurrentFlashIndex] = useState(-1);
  const [anzanExerciseIndex, setAnzanExerciseIndex] = useState(0);
  const [userAnzanAnswer, setUserAnzanAnswer] = useState('');
  const [anzanResult, setAnzanResult] = useState<{ correct: boolean; msg: string } | null>(null);

  // Selected Rule Guide
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);

  // Calculate current value represented on abacus
  const currentValue = rods.reduce((acc, rod, idx) => {
    const power = Math.pow(10, 4 - idx);
    const rodVal = (rod.upper ? 5 : 0) + rod.lowerCount;
    return acc + rodVal * power;
  }, 0);

  const handleResetAbacus = () => {
    setRods([
      { upper: false, lowerCount: 0 },
      { upper: false, lowerCount: 0 },
      { upper: false, lowerCount: 0 },
      { upper: false, lowerCount: 0 },
      { upper: false, lowerCount: 0 },
    ]);
  };

  const toggleUpperBead = (rodIndex: number) => {
    setRods((prev) =>
      prev.map((r, i) => (i === rodIndex ? { ...r, upper: !r.upper } : r))
    );
  };

  const setLowerCount = (rodIndex: number, count: number) => {
    setRods((prev) =>
      prev.map((r, i) =>
        i === rodIndex
          ? { ...r, lowerCount: r.lowerCount === count ? count - 1 : count }
          : r
      )
    );
  };

  // Set specific value on abacus
  const setAbacusValue = (val: number) => {
    const valStr = val.toString().padStart(5, '0').slice(-5);
    const newRods = valStr.split('').map((char) => {
      const num = parseInt(char, 10);
      const upper = num >= 5;
      const lowerCount = num % 5;
      return { upper, lowerCount };
    });
    setRods(newRods);
  };

  // Anzan Flash Runner
  const currentAnzanEx = SOROBAN_PRACTICE_EXERCISES[anzanExerciseIndex];

  const startAnzan = () => {
    setAnzanRunning(true);
    setCurrentFlashIndex(0);
    setUserAnzanAnswer('');
    setAnzanResult(null);
  };

  useEffect(() => {
    if (anzanRunning && currentFlashIndex >= 0) {
      if (currentFlashIndex < currentAnzanEx.numbers.length) {
        const timer = setTimeout(() => {
          setCurrentFlashIndex((prev) => prev + 1);
        }, currentAnzanEx.speedMs);
        return () => clearTimeout(timer);
      } else {
        setAnzanRunning(false);
      }
    }
  }, [anzanRunning, currentFlashIndex, currentAnzanEx]);

  const verifyAnzanAnswer = () => {
    const userVal = parseInt(userAnzanAnswer.trim(), 10);
    if (userVal === currentAnzanEx.expectedSum) {
      setAnzanResult({ correct: true, msg: 'إجابة صحيحة ممتعة! أحسنت يا بطل السوروبان 🎉' });
      if (onCompleteExercise) onCompleteExercise(20);
    } else {
      setAnzanResult({
        correct: false,
        msg: `إجابة خاطئة. المجموع الصحيح هو ${currentAnzanEx.expectedSum}`,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-6 shadow-xs dir-rtl" dir="rtl">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
            🧮
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-sans">
              المعداد الياباني التفاعلي (السوروبان - Soroban)
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              تقنية الحساب الذهني السريع وتفعيل الفص الأيمن للدماغ
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveToolTab('abacus')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'abacus' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المعداد الحر
          </button>
          <button
            onClick={() => setActiveToolTab('anzan')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'anzan' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تحدي Anzan السريع
          </button>
          <button
            onClick={() => setActiveToolTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            قواعد المكملات (5 & 10)
          </button>
        </div>
      </div>

      {/* 1. FREE ABACUS VIEW */}
      {activeTab === 'abacus' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 gap-3">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-500 block">القيمة الممثلة حالياً:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-indigo-700 font-mono tracking-wider">{currentValue.toLocaleString('ar-DZ')}</span>
                <span className="text-xs text-slate-400 font-mono">({currentValue})</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              <button
                onClick={() => setAbacusValue(2026)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
              >
                مثل 2026
              </button>
              <button
                onClick={() => setAbacusValue(74518)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
              >
                مثل 74518
              </button>
              <button
                onClick={handleResetAbacus}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                تصفير المعداد
              </button>
            </div>
          </div>

          {/* Abacus Graphics Container */}
          <div className="bg-slate-900 rounded-2xl p-3 sm:p-6 text-white shadow-inner relative border-4 border-amber-900/60 overflow-x-auto">
            {/* Wooden Frame Label */}
            <div className="text-center text-[9px] sm:text-[10px] font-mono text-amber-300 uppercase tracking-widest mb-2 sm:mb-3">
              SOROBAN ALGERIA // JAPANESE ABACUS SIMULATOR
            </div>

            <div className="flex justify-center items-center gap-1.5 sm:gap-6 min-w-[300px] py-1 sm:py-2">
              {rods.map((rod, idx) => {
                const rodPowerLabel = ['عشرات الآلاف', 'الآلاف', 'المئات', 'العشرات', 'الوحدات'][idx];
                const digitValue = (rod.upper ? 5 : 0) + rod.lowerCount;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Upper Rod Section (Value 5) */}
                    <div className="w-9 sm:w-12 h-16 sm:h-20 bg-slate-800/80 rounded-t-xl border-x-2 border-slate-600 relative flex justify-center py-1 sm:py-2">
                      <div className="w-1 sm:w-1.5 h-full bg-amber-400/40 absolute top-0 rounded-full" />
                      {/* Upper Bead */}
                      <button
                        onClick={() => toggleUpperBead(idx)}
                        className={`w-8 sm:w-10 h-6 sm:h-7 rounded-md transition-all duration-200 z-10 cursor-pointer shadow-md flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${
                          rod.upper
                            ? 'translate-y-7 sm:translate-y-9 bg-amber-500 text-slate-950 border border-amber-300 shadow-amber-500/50'
                            : 'translate-y-0 bg-slate-600 text-slate-300 border border-slate-500 hover:bg-slate-500'
                        }`}
                        title="خرزة خماسية (تساوي 5)"
                      >
                        5
                      </button>
                    </div>

                    {/* Beam Separator */}
                    <div className="w-12 sm:w-16 h-2.5 sm:h-3 bg-amber-800 border-y-2 border-amber-600 z-20 flex items-center justify-center relative shadow-sm">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white/80" />
                    </div>

                    {/* Lower Rod Section (4 Beads, 1 each) */}
                    <div className="w-9 sm:w-12 h-28 sm:h-36 bg-slate-800/80 rounded-b-xl border-x-2 border-slate-600 relative flex flex-col justify-between items-center py-1 sm:py-2">
                      <div className="w-1 sm:w-1.5 h-full bg-amber-400/40 absolute top-0 rounded-full" />

                      {[1, 2, 3, 4].map((beadNum) => {
                        const isActivated = rod.lowerCount >= beadNum;
                        return (
                          <button
                            key={beadNum}
                            onClick={() => setLowerCount(idx, beadNum)}
                            className={`w-8 sm:w-10 h-5 sm:h-6 rounded-md transition-all duration-200 z-10 cursor-pointer shadow-xs flex items-center justify-center text-[8px] sm:text-[9px] font-bold ${
                              isActivated
                                ? '-translate-y-1.5 sm:-translate-y-2 bg-emerald-500 text-slate-950 border border-emerald-300'
                                : 'translate-y-1.5 sm:translate-y-2 bg-slate-700 text-slate-400 border border-slate-600 hover:bg-slate-600'
                            }`}
                          >
                            1
                          </button>
                        );
                      })}
                    </div>

                    {/* Rod Digit & Name */}
                    <div className="text-center mt-1.5 sm:mt-2">
                      <span className="text-xs sm:text-sm font-black text-amber-400 font-mono block">{digitValue}</span>
                      <span className="text-[8px] sm:text-[10px] text-slate-400 block whitespace-nowrap">{rodPowerLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. ANZAN FLASH MATH TEST */}
      {activeTab === 'anzan' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-700/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-indigo-400/20 inline-block">
                  تدريب Anzan - الحساب الذهني الخاطف
                </span>
                <h4 className="text-base sm:text-lg font-bold mt-1">تمرين {anzanExerciseIndex + 1} من {SOROBAN_PRACTICE_EXERCISES.length}</h4>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                <span className="text-[10px] text-slate-400 shrink-0 ml-1">التمارين:</span>
                {SOROBAN_PRACTICE_EXERCISES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAnzanExerciseIndex(i); setAnzanResult(null); }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${
                      anzanExerciseIndex === i ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Flash Screen Box */}
            <div className="h-32 sm:h-36 bg-slate-950 rounded-xl border border-indigo-500/30 flex items-center justify-center relative overflow-hidden my-4 p-3 text-center">
              {anzanRunning && currentFlashIndex >= 0 && currentFlashIndex < currentAnzanEx.numbers.length ? (
                <div key={currentFlashIndex} className="text-4xl sm:text-5xl font-black text-amber-400 animate-pulse font-mono">
                  {currentAnzanEx.numbers[currentFlashIndex] > 0 ? `+${currentAnzanEx.numbers[currentFlashIndex]}` : currentAnzanEx.numbers[currentFlashIndex]}
                </div>
              ) : currentFlashIndex >= currentAnzanEx.numbers.length ? (
                <div className="text-emerald-400 font-bold text-xs sm:text-sm">انتهى العرض الخاطف! أدخل المجموع النهائي أدناه</div>
              ) : (
                <div className="text-slate-400 text-xs leading-relaxed max-w-xs">اضغط على زر "ابدأ العرض الخاطف" لبدء ظهور الأعداد بسرعة</div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={startAnzan}
                disabled={anzanRunning}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>{anzanRunning ? 'جاري العرض الخاطف...' : 'ابدأ العرض الخاطف (Anzan)'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  placeholder="المجموع المتوقع..."
                  value={userAnzanAnswer}
                  onChange={(e) => setUserAnzanAnswer(e.target.value)}
                  className="flex-1 sm:w-36 bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={verifyAnzanAnswer}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  تحقق
                </button>
              </div>
            </div>

            {anzanResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                anzanResult.correct ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40' : 'bg-rose-500/20 text-rose-200 border-rose-500/40'
              }`}>
                {anzanResult.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{anzanResult.msg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SOROBAN RULES GUIDE */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">قواعد أصدقاء 5 و 10:</h4>
            {SOROBAN_RULES.map((rule, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRuleIndex(idx)}
                className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  selectedRuleIndex === idx
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{rule.titleAr}</span>
                  <span className="font-mono bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">
                    {rule.ruleFormulaAr}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-sm text-indigo-900">
                  {SOROBAN_RULES[selectedRuleIndex].titleAr}
                </h4>
                <span className="bg-amber-100 text-amber-900 text-xs font-black font-mono px-2 py-0.5 rounded-lg border border-amber-300">
                  {SOROBAN_RULES[selectedRuleIndex].ruleFormulaAr}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {SOROBAN_RULES[selectedRuleIndex].descriptionAr}
              </p>

              <div className="bg-white p-3 rounded-xl border border-slate-200 mb-4">
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">خطوات تحريك الخرزات:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-800 font-medium">
                  {SOROBAN_RULES[selectedRuleIndex].beadStepsAr.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-indigo-900 text-indigo-100 p-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
              <span>{SOROBAN_RULES[selectedRuleIndex].exampleAr}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
