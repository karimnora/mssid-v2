import React, { useEffect, useState, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { canShowDecimalsTab } from '../utils/labGradePolicy';

interface FractionsDecimalsLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type FractionsTab = 'visual' | 'decimals';

const FRACTION_QUESTIONS = [
  { id: 1, denom: 2, target: 1, qAr: 'لَوِّنْ نِصْفَ (1/2) الشَّكْلِ' },
  { id: 2, denom: 4, target: 1, qAr: 'لَوِّنْ رُبُعَ (1/4) الشَّكْلِ' },
  { id: 3, denom: 4, target: 3, qAr: 'لَوِّنْ ثَلَاثَةَ أَرْبَاعٍ (3/4) الشَّكْلِ' },
  { id: 4, denom: 3, target: 2, qAr: 'لَوِّنْ ثُلْثَيْنِ (2/3) الشَّكْلِ' },
];

const DECIMAL_POINTS = [
  { value: 0, labelAr: '0' },
  { value: 0.1, labelAr: '0.1' },
  { value: 0.2, labelAr: '0.2' },
  { value: 0.5, labelAr: '0.5' },
  { value: 0.7, labelAr: '0.7' },
  { value: 1, labelAr: '1' },
];

const DECIMAL_QUESTIONS = [
  { id: 1, qAr: 'مَا هُوَ العَدَدُ العَشْرِيُّ المُوَافِقُ لِـ 1/2؟', correct: 0.5, options: [0.5, 0.2, 0.7] },
  { id: 2, qAr: 'أَيُّ عَدَدٍ عَشْرِيٍّ يُسَاوِي 1/10؟', correct: 0.1, options: [0.1, 1, 0.7] },
];

export const FractionsDecimalsLab: React.FC<FractionsDecimalsLabProps> = ({ grade = '3AP', onReward, onBack }) => {
  const showDecimals = canShowDecimalsTab(grade);
  const [activeTab, setActiveTab] = useState<FractionsTab>('visual');
  const [qIdx, setQIdx] = useState<number>(0);
  const [filled, setFilled] = useState<number>(0);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [decimalPoint, setDecimalPoint] = useState<number>(0.5);
  const [decimalAnswers, setDecimalAnswers] = useState<Record<number, boolean>>({});

  const currentQ = FRACTION_QUESTIONS[qIdx];
  const slices = useMemo(() => Array.from({ length: currentQ.denom }, (_, i) => i), [currentQ]);

  const toggleSlice = (i: number) => {
    setFilled((prev) => (i < prev ? i : i + 1));
    setChecked(null);
  };

  const checkAnswer = () => {
    const ok = filled === currentQ.target;
    setChecked(ok);
    if (ok) onReward?.(5, 15);
  };

  const nextQuestion = () => {
    setQIdx((prev) => (prev + 1) % FRACTION_QUESTIONS.length);
    setFilled(0);
    setChecked(null);
  };

  const handleDecimalAnswer = (qId: number, val: number, correct: number) => {
    setDecimalAnswers((prev) => ({ ...prev, [qId]: true }));
    if (val === correct) onReward?.(5, 15);
  };

  useEffect(() => {
    if (!showDecimals && activeTab === 'decimals') {
      setActiveTab('visual');
    }
  }, [showDecimals, activeTab]);

  return (
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-orange-600 via-amber-700 to-yellow-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-500/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="العودة للأدوات"
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>مختبر الكسور والأعداد العشرية (4AP - 5AP)</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">الكُسُورُ وَالأَعْدَادُ العَشْرِيَّةُ</h1>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed max-w-3xl">
              لوّن أجزاء الشكل لتشكيل الكسر المطلوب، وتعرّف على العلاقة بين الكسور والأعداد العشرية.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'visual' ? 'bg-orange-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          🍕 الكسور بالصور
        </button>
        {showDecimals && (
        <button
          onClick={() => setActiveTab('decimals')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'decimals' ? 'bg-amber-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          🔢 الأعداد العشرية
        </button>
        )}
      </div>

      {activeTab === 'visual' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <h2 className="text-lg font-black text-[var(--app-text)]">{currentQ.qAr}</h2>
          <div className="flex justify-center gap-1.5 max-w-md mx-auto flex-wrap">
            {slices.map((i) => (
              <button
                key={i}
                onClick={() => toggleSlice(i)}
                aria-label={`الجزء رقم ${i + 1} من ${slices.length}${i < filled ? ' ممتلئ' : ' فارغ'}`}
                aria-pressed={i < filled}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center text-xl font-black ${
                  i < filled ? 'bg-orange-500 border-orange-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text-muted)]'
                }`}
              >
                {i < filled ? '🍊' : ''}
              </button>
            ))}
          </div>
          <p className="font-black text-2xl text-orange-700 font-sans">
            {filled}/{currentQ.denom}
          </p>
          {checked !== null && (
            <div className={`text-sm font-black p-3 rounded-xl ${checked ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
              {checked ? 'إِجَابَةٌ صَحِيحَةٌ! أَحْسَنْتَ 🌟' : 'حَاوِلْ مِنْ جَدِيدٍ، عُدَّ الأَجْزَاءَ المَطْلُوبَةَ جَيِّداً.'}
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={checkAnswer}
              className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              تَحَقَّقْ مِنَ الإِجَابَةِ ✅
            </button>
            {checked && (
              <button
                onClick={nextQuestion}
                className="px-5 py-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                السُّؤَالُ التَّالِي ⟵
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'decimals' && (
        <div className="space-y-5">
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <h2 className="text-lg font-black text-[var(--app-text)]">خَطُّ الأَعْدَادِ العَشْرِيَّةِ (0 إِلَى 1)</h2>
            <div className="relative max-w-lg mx-auto h-16 flex items-center">
              <div className="absolute inset-x-0 h-1.5 bg-amber-200 rounded-full" />
              {DECIMAL_POINTS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setDecimalPoint(p.value)}
                  style={{ left: `${p.value * 100}%` }}
                  className={`absolute -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer transition-all border-2 ${
                    decimalPoint === p.value ? 'bg-amber-600 text-white border-amber-700 scale-125 shadow-md' : 'bg-white text-amber-800 border-amber-300'
                  }`}
                >
                  {p.labelAr}
                </button>
              ))}
            </div>
            <p className="font-black text-2xl text-amber-700 font-sans">{decimalPoint}</p>
            <p className="text-xs font-bold text-[var(--app-text-muted)]">
              اضغط على نقطة على الخط لتتعرف على قيمتها العشرية.
            </p>
          </div>

          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[var(--app-text)]">اختبر معلوماتك:</h3>
            {DECIMAL_QUESTIONS.map((q) => {
              const isAnswered = !!decimalAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
                  <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((val) => {
                      const isCorrect = val === q.correct;
                      return (
                        <button
                          key={val}
                          onClick={() => !isAnswered && handleDecimalAnswer(q.id, val, q.correct)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer font-sans ${
                            isAnswered
                              ? isCorrect
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                              : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-amber-400'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
