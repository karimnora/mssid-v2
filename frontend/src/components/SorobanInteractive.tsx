import React, { useState, useEffect } from 'react';
import { SOROBAN_RULES, SOROBAN_PRACTICE_EXERCISES } from '../data/sorobanData';
import { Play, RotateCcw, CheckCircle2, XCircle, Sparkles, HelpCircle, Zap, ShieldCheck, Timer, Shuffle, Volume2 } from 'lucide-react';
import { SorobanExercise } from '../types';
import { speakText } from '../utils/speech';

interface SorobanInteractiveProps {
  grade?: string;
  onCompleteExercise?: (score: number) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type OperationMode = 'add' | 'subtract' | 'mixed';

const GRADE_TO_DIFFICULTY: Record<string, Difficulty> = {
  '1AP': 'easy',
  '2AP': 'easy',
  '3AP': 'medium',
  '4AP': 'medium',
  '5AP': 'hard',
};

const DIFFICULTY_CONFIG: Record<Difficulty, { min: number; max: number; countMin: number; countMax: number; speedMs: number }> = {
  easy: { min: 1, max: 9, countMin: 3, countMax: 4, speedMs: 1800 },
  medium: { min: 1, max: 20, countMin: 3, countMax: 5, speedMs: 1400 },
  hard: { min: 5, max: 50, countMin: 4, countMax: 6, speedMs: 1000 },
};

const generateSorobanExercise = (difficulty: Difficulty, operationMode: OperationMode): SorobanExercise => {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const count = cfg.countMin + Math.floor(Math.random() * (cfg.countMax - cfg.countMin + 1));
  const numbers: number[] = [];
  let sum = 0;

  for (let i = 0; i < count; i += 1) {
    const magnitude = cfg.min + Math.floor(Math.random() * (cfg.max - cfg.min + 1));
    const wantsSubtract = i > 0 && (operationMode === 'subtract' || (operationMode === 'mixed' && Math.random() < 0.5));
    let n = magnitude;
    if (wantsSubtract) {
      const amount = Math.min(magnitude, sum);
      if (amount > 0) n = -amount;
    }
    numbers.push(n);
    sum += n;
  }

  const operation: SorobanExercise['operation'] = operationMode === 'subtract' ? '-' : operationMode === 'mixed' ? 'mixed' : '+';
  return { id: `gen-${numbers.join('_')}`, numbers, operation, speedMs: cfg.speedMs, expectedSum: sum };
};

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
  const [generatedExercise, setGeneratedExercise] = useState<SorobanExercise | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(GRADE_TO_DIFFICULTY[grade] || 'medium');
  const [operationMode, setOperationMode] = useState<OperationMode>('add');
  const [answerTimerStartedAt, setAnswerTimerStartedAt] = useState<number | null>(null);
  const [elapsedAnswerSeconds, setElapsedAnswerSeconds] = useState<number | null>(null);

  // Selected Rule Guide
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);

  // Beginner micro-tutorial (3 steps): raise the unit bead (5), lower one unit bead (1), free practice
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const TUTORIAL_STEPS = [
    { titleAr: 'الخطوة 1: الخرزة الخماسية', bodyAr: 'اضغط على الخرزة العلوية في تِيجة الوحدات (أقصى اليمين) لترفعها. هذه الخرزة تساوي 5.' },
    { titleAr: 'الخطوة 2: خرزات الوحدة', bodyAr: 'الآن اضغط على إحدى الخرزات السفلية في نفس التيجة. كل خرزة سفلية تساوي 1 فقط.' },
    { titleAr: 'الخطوة 3: جرّب بنفسك!', bodyAr: 'أحسنت! لديك الآن 6 (5+1) على المعداد. استمر في التجربة بحرية أو اضغط "إنهاء الدرس".' },
  ];

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

  // Anzan Flash Runner (uses a freshly generated exercise when available, otherwise the curated static list)
  const currentAnzanEx = generatedExercise || SOROBAN_PRACTICE_EXERCISES[anzanExerciseIndex];

  const startAnzan = () => {
    setAnzanRunning(true);
    setCurrentFlashIndex(0);
    setUserAnzanAnswer('');
    setAnzanResult(null);
    setElapsedAnswerSeconds(null);
    setAnswerTimerStartedAt(null);
  };

  const handleGenerateExercise = () => {
    setGeneratedExercise(generateSorobanExercise(difficulty, operationMode));
    setAnzanRunning(false);
    setCurrentFlashIndex(-1);
    setUserAnzanAnswer('');
    setAnzanResult(null);
    setElapsedAnswerSeconds(null);
    setAnswerTimerStartedAt(null);
  };

  const handleSelectStaticExercise = (i: number) => {
    setAnzanExerciseIndex(i);
    setGeneratedExercise(null);
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
        setAnswerTimerStartedAt(Date.now());
      }
    }
  }, [anzanRunning, currentFlashIndex, currentAnzanEx]);

  const startTutorial = () => {
    handleResetAbacus();
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const endTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  // Auto-advance the tutorial as the child performs the requested gesture on the units rod (index 4)
  useEffect(() => {
    if (!showTutorial) return;
    const unitRod = rods[4];
    if (tutorialStep === 0 && unitRod.upper) {
      setTutorialStep(1);
    } else if (tutorialStep === 1 && unitRod.lowerCount >= 1) {
      setTutorialStep(2);
    }
  }, [rods, showTutorial, tutorialStep]);

  const verifyAnzanAnswer = () => {
    const userVal = parseInt(userAnzanAnswer.trim(), 10);
    const elapsed = answerTimerStartedAt ? (Date.now() - answerTimerStartedAt) / 1000 : null;
    setElapsedAnswerSeconds(elapsed);

    if (userVal === currentAnzanEx.expectedSum) {
      const timeMsg = elapsed !== null ? ` (في ${elapsed.toFixed(1)} ثانية ⏱️)` : '';
      setAnzanResult({ correct: true, msg: `إجابة صحيحة ممتعة! أحسنت يا بطل السوروبان 🎉${timeMsg}` });
      if (onCompleteExercise) onCompleteExercise(20);
    } else {
      setAnzanResult({
        correct: false,
        msg: `إجابة خاطئة. المجموع الصحيح هو ${currentAnzanEx.expectedSum}`,
      });
    }
  };

  return (
    <div data-lab-instrument className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-6 shadow-xs dir-rtl" dir="rtl">
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

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveToolTab('abacus')}
            className={`hit-target px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'abacus' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            المعداد الحر
          </button>
          <button
            onClick={() => setActiveToolTab('anzan')}
            className={`hit-target px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'anzan' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            تحدي الحساب الذهني السريع
          </button>
          <button
            onClick={() => setActiveToolTab('rules')}
            className={`hit-target px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
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
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-indigo-700 font-mono tracking-wider">{currentValue.toLocaleString('ar-DZ')}</span>
                <span className="text-xs text-slate-600 font-mono">({currentValue})</span>
                <button
                  onClick={() => speakText(`${currentValue}`, 'ar-SA', 0.9)}
                  aria-label="استمع للعدد"
                  className="hit-target shrink-0 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              <button
                onClick={() => setAbacusValue(2026)}
                className="hit-target px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
              >
                مثل 2026
              </button>
              <button
                onClick={() => setAbacusValue(74518)}
                className="hit-target px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
              >
                مثل 74518
              </button>
              <button
                onClick={handleResetAbacus}
                className="hit-target flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                تصفير المعداد
              </button>
              <button
                onClick={startTutorial}
                className="hit-target flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                🎓 دليل المبتدئين (3 خطوات)
              </button>
            </div>
          </div>

          {/* Beginner Micro-Tutorial Banner (3 steps) */}
          {showTutorial && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1">
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${i <= tutorialStep ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-xs sm:text-sm text-indigo-900">
                      {TUTORIAL_STEPS[tutorialStep].titleAr}
                    </h4>
                    <button
                      onClick={() => speakText(TUTORIAL_STEPS[tutorialStep].bodyAr, 'ar-SA', 0.88)}
                      aria-label="استمع للشرح"
                      className="hit-target shrink-0 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-indigo-800 mt-0.5 leading-relaxed">
                    {TUTORIAL_STEPS[tutorialStep].bodyAr}
                  </p>
                </div>
              </div>
              <button
                onClick={endTutorial}
                className="shrink-0 px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold cursor-pointer"
              >
                {tutorialStep === 2 ? 'إنهاء الدرس' : 'تخطي'}
              </button>
            </div>
          )}

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
                const isTutorialTarget = showTutorial && tutorialStep < 2 && idx === 4;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center transition-all ${
                      isTutorialTarget ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-900 rounded-2xl animate-pulse' : ''
                    }`}
                  >
                    {/* Upper Rod Section (Value 5) */}
                    <div className="w-16 sm:w-20 h-20 sm:h-24 bg-slate-800/80 rounded-t-xl border-x-2 border-slate-600 relative flex justify-center py-1 sm:py-2">
                      <div className="w-1 sm:w-1.5 h-full bg-amber-400/40 absolute top-0 rounded-full" />
                      {/* Upper Bead — sized to the project's 60px min touch target (see --hit in index.css) */}
                      <button
                        onClick={() => toggleUpperBead(idx)}
                        className={`hit-target w-14 sm:w-16 rounded-md transition-all duration-200 z-10 cursor-pointer shadow-md flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${
                          rod.upper
                            ? 'translate-y-9 sm:translate-y-11 bg-amber-500 text-slate-950 border border-amber-300 shadow-amber-500/50'
                            : 'translate-y-0 bg-slate-600 text-slate-300 border border-slate-500 hover:bg-slate-500'
                        }`}
                        title="خرزة خماسية (تساوي 5)"
                      >
                        5
                      </button>
                    </div>

                    {/* Beam Separator */}
                    <div className="w-16 sm:w-20 h-2.5 sm:h-3 bg-amber-800 border-y-2 border-amber-600 z-20 flex items-center justify-center relative shadow-sm">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white/80" />
                    </div>

                    {/* Lower Rod Section (4 Beads, 1 each) */}
                    <div className="w-16 sm:w-20 h-40 sm:h-48 bg-slate-800/80 rounded-b-xl border-x-2 border-slate-600 relative flex flex-col justify-between items-center py-1 sm:py-2">
                      <div className="w-1 sm:w-1.5 h-full bg-amber-400/40 absolute top-0 rounded-full" />

                      {[1, 2, 3, 4].map((beadNum) => {
                        const isActivated = rod.lowerCount >= beadNum;
                        return (
                          <button
                            key={beadNum}
                            onClick={() => setLowerCount(idx, beadNum)}
                            className={`hit-target w-14 sm:w-16 !min-h-[36px] sm:!min-h-[40px] rounded-md transition-all duration-200 z-10 cursor-pointer shadow-xs flex items-center justify-center text-[8px] sm:text-[9px] font-bold ${
                              isActivated
                                ? '-translate-y-2 sm:-translate-y-2.5 bg-emerald-500 text-slate-950 border border-emerald-300'
                                : 'translate-y-2 sm:translate-y-2.5 bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
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
                      <span className="text-[8px] sm:text-[10px] text-slate-300 block whitespace-nowrap">{rodPowerLabel}</span>
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
          <div className="bg-[#FFF8E7] text-slate-900 rounded-2xl p-4 sm:p-5 border border-[#E7E2D7]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-indigo-200 inline-block">
                  تدريب الحساب الذهني الخاطف (Anzan)
                </span>
                <h4 className="text-base sm:text-lg font-bold mt-1 text-slate-900">
                  {generatedExercise ? 'تمرين مولّد جديد 🎲' : `تمرين ${anzanExerciseIndex + 1} من ${SOROBAN_PRACTICE_EXERCISES.length}`}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                <span className="text-[10px] text-slate-600 shrink-0 ml-1">التمارين الجاهزة:</span>
                {SOROBAN_PRACTICE_EXERCISES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectStaticExercise(i)}
                    className={`hit-target rounded-lg text-xs font-bold shrink-0 ${
                      !generatedExercise && anzanExerciseIndex === i ? 'bg-amber-400 text-slate-950 font-black' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                      difficulty === d ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d === 'easy' ? '⭐ سهل' : d === 'medium' ? '⭐⭐ متوسط' : '⭐⭐⭐ صعب'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                {(['add', 'subtract', 'mixed'] as OperationMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setOperationMode(m)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                      operationMode === m ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m === 'add' ? 'جمع (+)' : m === 'subtract' ? 'طرح (−)' : 'مختلط (+/−)'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateExercise}
              className="hit-target w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-amber-800 font-bold text-xs px-4 rounded-xl transition-all cursor-pointer mb-1"
            >
              <Shuffle className="w-4 h-4" />
              <span>توليد تمرين جديد حسب المستوى المختار</span>
            </button>

            <div className="h-32 sm:h-36 bg-white rounded-xl border-2 border-indigo-200 flex items-center justify-center relative overflow-hidden my-4 p-3 text-center">
              {anzanRunning && currentFlashIndex >= 0 && currentFlashIndex < currentAnzanEx.numbers.length ? (
                <div
                  key={currentFlashIndex}
                  className={`text-4xl sm:text-5xl font-black animate-pulse font-mono ${
                    currentAnzanEx.numbers[currentFlashIndex] < 0 ? 'text-rose-700' : 'text-amber-700'
                  }`}
                >
                  {currentAnzanEx.numbers[currentFlashIndex] > 0 ? `+${currentAnzanEx.numbers[currentFlashIndex]}` : currentAnzanEx.numbers[currentFlashIndex]}
                </div>
              ) : currentFlashIndex >= currentAnzanEx.numbers.length ? (
                <div className="text-emerald-800 font-bold text-xs sm:text-sm">انتهى العرض الخاطف! أدخل المجموع النهائي أدناه</div>
              ) : (
                <div className="text-slate-600 text-xs leading-relaxed max-w-xs">اضغط على زر "ابدأ العرض الخاطف" لبدء ظهور الأعداد بسرعة</div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={startAnzan}
                disabled={anzanRunning}
                className="hit-target w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs px-4 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4" />
                <span>{anzanRunning ? 'جاري العرض الخاطف...' : 'ابدأ العرض الخاطف'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  placeholder="المجموع المتوقع..."
                  aria-label="المجموع المتوقع"
                  value={userAnzanAnswer}
                  onChange={(e) => setUserAnzanAnswer(e.target.value)}
                  className="hit-target flex-1 sm:w-36 bg-white border-2 border-slate-300 text-slate-900 text-base font-bold rounded-xl px-3 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={verifyAnzanAnswer}
                  className="hit-target bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  تحقق
                </button>
              </div>
            </div>

            {anzanResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 flex-wrap ${
                anzanResult.correct ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {anzanResult.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                  <span>{anzanResult.msg}</span>
                </div>
                {elapsedAnswerSeconds !== null && !anzanResult.correct && (
                  <span className="flex items-center gap-1 text-[10px] opacity-80 shrink-0">
                    <Timer className="w-3.5 h-3.5" />
                    {elapsedAnswerSeconds.toFixed(1)} ثانية
                  </span>
                )}
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
                className={`hit-target w-full text-right p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
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
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-indigo-900">
                    {SOROBAN_RULES[selectedRuleIndex].titleAr}
                  </h4>
                  <button
                    onClick={() =>
                      speakText(
                        `${SOROBAN_RULES[selectedRuleIndex].titleAr}. ${SOROBAN_RULES[selectedRuleIndex].descriptionAr}`,
                        'ar-SA',
                        0.85
                      )
                    }
                    aria-label="استمع للقاعدة"
                    className="hit-target shrink-0 flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-black font-mono px-2 py-0.5 rounded-lg border border-amber-300">
                  {SOROBAN_RULES[selectedRuleIndex].ruleFormulaAr}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {SOROBAN_RULES[selectedRuleIndex].descriptionAr}
              </p>

              <div className="bg-white p-3 rounded-xl border border-slate-200 mb-4">
                <span className="text-[10px] font-bold text-slate-600 block mb-1 uppercase">خطوات تحريك الخرزات:</span>
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
