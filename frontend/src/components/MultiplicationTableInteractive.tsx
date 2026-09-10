import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Trophy } from 'lucide-react';

interface MultiplicationTableInteractiveProps {
  grade?: string;
}

export const MultiplicationTableInteractive: React.FC<MultiplicationTableInteractiveProps> = ({ grade = '4AP' }) => {
  const [selectedDigit, setSelectedDigit] = useState<number>(5);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isTested, setIsTested] = useState<boolean>(false);

  const handleInputChange = (factor: number, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [factor]: val }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsTested(false);
  };

  return (
    <div data-lab-instrument className="kids-pole rounded-[28px] p-5 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300">جَدْوَلُ الضَّرْبِ التَّفَاعُلِيُّ</h2>
            <p className="text-xs text-slate-300">تَدَرَّبْ عَلَى جَدْوَلِ الضَّرْبِ سَرِيعاً مَعَ التَّصْحِيحِ الفَوْرِيِّ</p>
          </div>
        </div>
        <span className="bg-amber-400/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
          أَدَاةُ الرِّيَاضِيَّاتِ
        </span>
      </div>

      {/* Digit Selector 1 to 10 */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-[var(--kids-muted)]">اخْتَر جَدْوَلَ الضَّرْبِ:</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((digit) => (
            <button
              key={digit}
              onClick={() => {
                setSelectedDigit(digit);
                handleReset();
              }}
              className={`hit-target flex items-center justify-center rounded-xl font-black text-sm transition-all cursor-pointer border ${
                selectedDigit === digit
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-110'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              ×{digit}
            </button>
          ))}
        </div>
      </div>

      {/* Table Rows & Interactive Inputs */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-amber-300">
            جَدْوَلُ الضَّرْبِ فِي {selectedDigit}:
          </h3>
          <button
            onClick={handleReset}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إِعَادَةُ المَسْحِ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((factor) => {
            const correctAnswer = selectedDigit * factor;
            const userVal = userAnswers[factor] || '';
            const isCorrect = parseInt(userVal, 10) === correctAnswer;

            return (
              <div
                key={factor}
                className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2"
              >
                <span className="text-xs font-mono font-bold text-slate-300">
                  {selectedDigit} × {factor} =
                </span>
                <input
                  type="number"
                  value={userVal}
                  onChange={(e) => handleInputChange(factor, e.target.value)}
                  placeholder="؟"
                  className={`w-full text-center py-2 px-2 rounded-xl text-sm font-black border transition-all focus:outline-none ${
                    isTested
                      ? isCorrect
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-rose-950 text-rose-300 border-rose-500'
                      : 'bg-slate-950 text-white border-slate-700 focus:border-amber-400'
                  }`}
                />
                {isTested && (
                  <span className="text-[10px] font-mono font-bold">
                    {isCorrect ? '✅ صح' : `❌ النتيجة: ${correctAnswer}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => setIsTested(true)}
            className="hit-target bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            تَأْكِيدُ وَتَصْحِيحُ الإِجَابَاتِ
          </button>
        </div>
      </div>
    </div>
  );
};
