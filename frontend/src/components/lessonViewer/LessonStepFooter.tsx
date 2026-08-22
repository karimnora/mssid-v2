import React from 'react';
import { CourseLesson } from '../../types';
import { Button } from '../ui';
import { ArrowLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { LessonStep } from './shared';

interface LessonStepFooterProps {
  availableSteps: LessonStep[];
  currentStepIndex: number;
  isLastStep: boolean;
  nextStep: LessonStep | null;
  prevStep: LessonStep | null;
  previousLesson: CourseLesson | null;
  nextLesson: CourseLesson | null;
  renderArabicText: (text: string | undefined | null) => string;
  onGoToStep: (index: number) => void;
  onSelectLesson?: (lesson: CourseLesson) => void;
  onBack: () => void;
}

export const LessonStepFooter: React.FC<LessonStepFooterProps> = ({
  availableSteps,
  currentStepIndex,
  isLastStep,
  nextStep,
  prevStep,
  previousLesson,
  nextLesson,
  renderArabicText,
  onGoToStep,
  onSelectLesson,
  onBack,
}) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border border-emerald-500/20">
          <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
        </div>
        <div>
          <span className="text-[var(--app-text)] font-extrabold text-xs sm:text-sm block">
            المرحلة {currentStepIndex + 1} من {availableSteps.length}: {availableSteps[currentStepIndex]?.labelAr} 🎯
          </span>
          <span className="text-[var(--app-text-muted)] text-[11px] font-bold">
            {!isLastStep
              ? `الخطوة التالية: ${nextStep?.labelAr} (بقي ${availableSteps.length - (currentStepIndex + 1)} مراحل)`
              : 'أحسنت يا بطل! أتممت جميع مراحل هذا الدرس 🏆'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {availableSteps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => onGoToStep(idx)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs ring-2 ring-emerald-300/60 scale-105'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
              title={`${step.labelAr} (${idx + 1}/${availableSteps.length})`}
            >
              {isDone ? '✓' : idx + 1}
            </button>
          );
        })}
      </div>
    </div>

    {!isLastStep ? (
      <div className="flex items-center justify-between flex-wrap gap-3">
        {currentStepIndex > 0 ? (
          <button
            onClick={() => onGoToStep(currentStepIndex - 1)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" />
            <span>السابق: {prevStep?.labelAr}</span>
          </button>
        ) : previousLesson ? (
          <button
            onClick={() => onSelectLesson?.(previousLesson)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الدرس السابق</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => onGoToStep(currentStepIndex + 1)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-2.5 mr-auto"
        >
          <span>المرحلة الموالية: {nextStep?.labelAr}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 text-center space-y-1.5">
          <div className="text-2xl">🎉</div>
          <h3 className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300">
            أحسنت يا بطل! أتممت جميع مراحل هذا الدرس بنجاح! 🏆
          </h3>
          <p className="text-[11px] text-[var(--app-text-muted)]">
            أكملت كافة المراحل (<span dir="ltr">{availableSteps.length} / {availableSteps.length}</span>). يمكنك الآن الانتقال إلى الدرس التالي!
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onGoToStep(0)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مراجعة من البداية</span>
            </button>
            {currentStepIndex > 0 && (
              <button
                onClick={() => onGoToStep(currentStepIndex - 1)}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center cursor-pointer transition-all active:scale-95"
                title="الرجوع للمرحلة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {nextLesson ? (
            <button
              onClick={() => onSelectLesson?.(nextLesson)}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-2.5 mr-auto"
            >
              <span>الدرس الموالي: {renderArabicText(nextLesson.titleAr)}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Trophy className="w-4 h-4" />}
              onClick={onBack}
              className="font-black text-xs mr-auto"
            >
              إتمام المحور والعودة لقائمة الدروس 🎓
            </Button>
          )}
        </div>
      </div>
    )}
  </div>
);
