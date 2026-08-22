import React from 'react';
import { motion } from 'motion/react';
import { CourseLesson } from '../../types';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { LessonStep } from './shared';

interface LessonStepFooterProps {
  availableSteps: LessonStep[];
  currentStepIndex: number;
  isLastStep: boolean;
  nextStep: LessonStep | null;
  prevStep: LessonStep | null;
  nextLesson: CourseLesson | null;
  renderArabicText: (text: string | undefined | null) => string;
  compact?: boolean;
  hasQuiz: boolean;
  quizPassed: boolean;
  onGoToStep: (index: number) => void;
  onFinishLesson: () => void;
}

export const LessonStepFooter: React.FC<LessonStepFooterProps> = ({
  availableSteps,
  currentStepIndex,
  isLastStep,
  nextStep,
  prevStep,
  nextLesson,
  renderArabicText,
  compact = false,
  hasQuiz,
  quizPassed,
  onGoToStep,
  onFinishLesson,
}) => {
  const canFinish = !hasQuiz || quizPassed;

  const handlePrev = () => {
    if (currentStepIndex > 0) onGoToStep(currentStepIndex - 1);
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
      data-lesson-footer={compact ? 'compact' : 'full'}
    >
      {!compact && (
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[var(--app-text)] font-extrabold text-xs sm:text-sm">
            المرحلة {currentStepIndex + 1} من {availableSteps.length}: {availableSteps[currentStepIndex]?.labelAr}
          </span>
          <span className="text-[10px] font-black text-[var(--brand-emerald-dark)] bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
          </span>
        </div>
      )}

      {compact && (
        <p className="text-center text-xs font-bold text-[var(--app-text-muted)]">
          <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
        </p>
      )}

      {isLastStep && hasQuiz && !quizPassed && (
        <p className="text-center text-sm font-bold text-[var(--app-text-muted)]">
          أجب عن الاختبار أعلاه لتُحتسب الدرس
        </p>
      )}

      {isLastStep && canFinish && (
        <p className="text-center text-sm font-black text-emerald-800 dark:text-emerald-300">
          أحسنت يا بطل! 🏆
        </p>
      )}

      <div className={`flex items-center gap-3 ${currentStepIndex > 0 ? 'justify-between' : 'justify-end'} flex-wrap`}>
        {currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--app-text-muted)] hover:text-[var(--app-text)] cursor-pointer"
          >
            <span className="inline-flex items-center gap-1">
              <ChevronRight className="w-4 h-4" />
              {compact ? 'السابق' : `السابق: ${prevStep?.labelAr ?? ''}`}
            </span>
          </button>
        ) : (
          <span />
        )}

        {!isLastStep && (
          <motion.button
            type="button"
            data-primary-cta="next-step"
            onClick={() => onGoToStep(currentStepIndex + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-3xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>{compact ? 'التالي' : `التالي: ${nextStep?.labelAr ?? ''}`}</span>
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}

        {isLastStep && canFinish && (
          <motion.button
            type="button"
            data-primary-cta="finish-lesson"
            onClick={onFinishLesson}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-3xl shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>
              {nextLesson ? `الدرس الموالي: ${renderArabicText(nextLesson.titleAr)}` : 'العودة لقائمة الدروس'}
            </span>
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
