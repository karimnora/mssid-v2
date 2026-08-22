import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourseLesson } from '../../types';
import { Badge } from '../ui';
import { ClipboardCheck } from 'lucide-react';
import { BoundPracticeCard, PracticeBindings } from './practiceBindings';

interface LessonEvaluationPanelProps {
  lesson: CourseLesson;
  practice: PracticeBindings;
  renderArabicText: (text: string | undefined | null) => string;
}

export const LessonEvaluationPanel: React.FC<LessonEvaluationPanelProps> = ({
  lesson,
  practice,
  renderArabicText,
}) => {
  const {
    evaluationExercises,
    evaluationCheckedCount,
    evaluationCorrectCount,
    evaluationComplete,
    evaluationScorePercent,
  } = practice;

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-rose-950 to-slate-900 text-white rounded-3xl p-5 border border-rose-800/50">
        <h3 className="font-black text-sm flex items-center gap-2 mb-1">
          <ClipboardCheck className="w-5 h-5 text-rose-300" />
          <span>التقييم النهائي للدرس</span>
        </h3>
        <p className="text-xs text-rose-200">أجب عن كل الأسئلة للتحقق من إتقانك للدرس. لا بأس بالخطأ — المهم أن تتعلم من التصحيح!</p>
        {evaluationCheckedCount > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-white/10 h-2.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-emerald-400 h-full rounded-full"
                initial={false}
                animate={{ width: `${(evaluationCheckedCount / evaluationExercises.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
            <span dir="ltr" className="text-[11px] font-bold text-rose-200 shrink-0">{evaluationCheckedCount}/{evaluationExercises.length}</span>
          </div>
        )}
      </div>

      {evaluationExercises.map((ex) => (
        <BoundPracticeCard key={ex.id} ex={ex} practice={practice} renderArabicText={renderArabicText} />
      ))}

      <AnimatePresence>
        {evaluationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`rounded-3xl p-5 border space-y-3 ${
              evaluationScorePercent >= 60
                ? 'bg-[var(--brand-emerald)]/10 border-[var(--brand-emerald)]/30'
                : 'bg-[var(--brand-amber)]/10 border-[var(--brand-amber)]/30'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-black text-sm text-[var(--app-text)]">📊 نتيجتك: <span dir="ltr">{evaluationCorrectCount}/{evaluationExercises.length} ({evaluationScorePercent}%)</span></h4>
              <Badge variant="xp"><span dir="ltr">+{evaluationExercises.filter((ex) => practice.practiceCorrect[ex.id]).reduce((sum, ex) => sum + ex.xpReward, 0)} XP</span></Badge>
            </div>
            {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold text-[var(--app-text)] block">أهداف هذا الدرس:</span>
                {lesson.objectivesAr.map((obj, i) => (
                  <p key={i} className="text-xs text-[var(--app-text-muted)] flex items-center gap-1.5">
                    <span>{evaluationScorePercent >= 60 ? '✅' : '🌱'}</span>
                    <span>{renderArabicText(obj)}</span>
                  </p>
                ))}
              </div>
            )}
            {evaluationScorePercent < 60 && (
              <p className="text-xs text-[var(--brand-amber-dark)] bg-[var(--brand-amber)]/15 border border-[var(--brand-amber)]/35 rounded-xl p-2.5">
                💡 لا بأس، هذا جزء طبيعي من التعلّم! راجع "الكورس المفصّل" و"الأمثلة" في تبويب "الملخص والقواعد"، ثم أعد المحاولة — أنت تقترب من الإتقان خطوة بخطوة.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
