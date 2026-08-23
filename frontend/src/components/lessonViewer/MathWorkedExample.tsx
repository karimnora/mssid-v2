import React from 'react';
import { motion } from 'motion/react';
import { formatEducationalText } from '../../utils/textFormatter';

interface MathWorkedExampleProps {
  solution: string;
  operationsAr?: string;
  renderArabicText?: (text: string | undefined | null) => string;
  /** Dark cards in the examples list; light cards inside the rules panel. */
  tone?: 'dark' | 'light';
}

/**
 * Official Algerian 2-column layout for posed math (CLAUDE.md, 2AP–5AP):
 * الحل / الأجوبة on the left, العمليات on the right.
 * First DOM child is العمليات so RTL places it on the right.
 */
export const MathWorkedExample: React.FC<MathWorkedExampleProps> = ({
  solution,
  operationsAr,
  renderArabicText = (t) => t || '',
  tone = 'dark',
}) => {
  const formattedSolution = formatEducationalText(renderArabicText(solution));

  if (!operationsAr) {
    const box =
      tone === 'dark'
        ? 'text-xs sm:text-sm text-emerald-200 font-sans leading-relaxed bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800/80 whitespace-pre-line'
        : 'text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed whitespace-pre-line';
    return (
      <div className={box} data-math-worked-example="flat">
        <span className={`font-extrabold block mb-1 ${tone === 'dark' ? 'text-amber-300' : 'text-[var(--brand-blue-dark)]'}`}>
          الحل / الأجوبة:
        </span>
        {formattedSolution}
      </div>
    );
  }

  const opBox =
    tone === 'dark'
      ? 'bg-slate-950 p-4 rounded-2xl border border-sky-800/60 space-y-1.5 min-h-[4.5rem]'
      : 'bg-sky-50 p-4 rounded-2xl border border-sky-200 space-y-1.5 min-h-[4.5rem]';
  const solBox =
    tone === 'dark'
      ? 'bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800/80 space-y-1.5 min-h-[4.5rem]'
      : 'bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1.5 min-h-[4.5rem]';

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-sans"
      dir="rtl"
      data-math-worked-example="two-column"
    >
      <motion.div
        data-math-column="operations"
        className={opBox}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <span className={`font-extrabold block ${tone === 'dark' ? 'text-sky-300' : 'text-sky-800'}`}>
          العمليات
        </span>
        <div
          dir="ltr"
          className={`font-mono whitespace-pre-line text-right leading-relaxed ${
            tone === 'dark' ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          {operationsAr}
        </div>
      </motion.div>
      <motion.div
        data-math-column="solution"
        className={solBox}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        <span className={`font-extrabold block ${tone === 'dark' ? 'text-amber-300' : 'text-emerald-800'}`}>
          الحل / الأجوبة
        </span>
        <div
          className={`leading-relaxed whitespace-pre-line ${
            tone === 'dark' ? 'text-emerald-200' : 'text-emerald-950'
          }`}
        >
          {formattedSolution}
        </div>
      </motion.div>
    </div>
  );
};
