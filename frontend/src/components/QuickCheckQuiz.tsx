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
    <div className="bg-white border-2 border-[#E7E2D7] rounded-[22px] p-4 space-y-3">
      <p className="text-sm font-extrabold text-[var(--kids-ink)] flex items-center gap-1.5">
        <Brain className="w-4 h-4 text-[var(--kids-grass-2)] shrink-0" />
        <span>سؤال تحقق سريع: {questionAr}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let style = 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-ink)]';
          if (isAnswered) {
            if (opt.isCorrect) style = 'bg-[#ECFDF5] border-[var(--kids-grass-2)] text-[#065F46] font-extrabold';
            else if (isSelected) style = 'bg-[#FFF5F4] border-[var(--brand-coral)] text-[var(--brand-coral)]';
            else style = 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-muted)]';
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isCorrectSelected}
              className={`text-right p-3 min-h-[var(--hit)] rounded-2xl border-2 text-sm cursor-pointer flex items-center justify-between gap-2 ${style}`}
            >
              <span>{opt.labelAr}</span>
              {isAnswered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-[var(--kids-grass-2)] shrink-0" />}
              {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0" />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <p className={`text-sm font-extrabold ${isCorrectSelected ? 'text-[var(--kids-grass-2)]' : 'text-[#8A5A12]'}`}>
          {isCorrectSelected ? '✅ أحسنت! إجابة صحيحة.' : '💡 ليست هذه الإجابة، جرّب اختياراً آخر.'}
        </p>
      )}
    </div>
  );
};
