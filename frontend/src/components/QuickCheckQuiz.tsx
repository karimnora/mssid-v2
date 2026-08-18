import React, { useState } from 'react';
import { CheckCircle2, XCircle, Brain } from 'lucide-react';

export interface QuickCheckOption {
  labelAr: string;
  isCorrect: boolean;
}

interface QuickCheckQuizProps {
  questionAr: string;
  options: QuickCheckOption[];
  onCorrect?: () => void;
}

// Generic, data-driven check question — deliberately scoped to the one activity type actually
// produced today (GeminiAiService.generatePracticeExercise's structured quickCheck): a single
// multiple-choice question. Visual language mirrors PracticeExerciseCard's existing 'qcm' type
// (same emerald/rose feedback colors) so an AI-generated check question doesn't look like a
// different product from the hand-authored lesson exercises.
export const QuickCheckQuiz: React.FC<QuickCheckQuizProps> = ({ questionAr, options, onCorrect }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const isAnswered = selectedIdx !== null;
  const isCorrectSelected = isAnswered && !!options[selectedIdx]?.isCorrect;

  const handleSelect = (idx: number) => {
    if (isCorrectSelected) return;
    setSelectedIdx(idx);
    if (options[idx]?.isCorrect) onCorrect?.();
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
        <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>سؤال تحقق سريع: {questionAr}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
          if (isAnswered) {
            if (opt.isCorrect) style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
            else if (isSelected) style = 'bg-rose-50 border-rose-400 text-rose-900';
            else style = 'bg-slate-50 border-slate-100 text-slate-500';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isCorrectSelected}
              className={`text-right p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
            >
              <span>{opt.labelAr}</span>
              {isAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <p className={`text-xs font-bold ${isCorrectSelected ? 'text-emerald-700' : 'text-amber-700'}`}>
          {isCorrectSelected ? '✅ أحسنت! إجابة صحيحة.' : '💡 ليست هذه الإجابة، جرّب اختياراً آخر.'}
        </p>
      )}
    </div>
  );
};
