import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Lock, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { CourseLesson, SubjectId, PrimaryGrade } from '../types';
import { useLocaleContext } from '../context/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';

interface LessonIllustratedCardProps {
  lesson: CourseLesson;
  index: number;
  subjectId: SubjectId;
  isCompleted: boolean;
  isLocked: boolean;
  isSuggested?: boolean;
  onClick: () => void;
  showAudio?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  grade?: PrimaryGrade;
}

export const LessonIllustratedCard: React.FC<LessonIllustratedCardProps> = ({
  lesson, index, subjectId, isCompleted, isLocked, isSuggested = false, onClick,
  showAudio = false, speakingKey = null, onSpeak, grade = lesson.grade,
}) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('courses');
  const reduceMotion = useReducedMotion();
  const young = grade === '1AP' || grade === '2AP';
  const textDirection = ['french', 'english', 'tamazight'].includes(subjectId) ? 'ltr' : 'rtl';
  const status = isCompleted ? t('completedBadge') : isLocked ? t('lessonLockedLabel') : isSuggested ? t('suggestedLessonLabel') : null;
  return (
    <article className="course-lesson-card relative h-full" data-suggested={isSuggested || undefined} data-completed={isCompleted || undefined}>
      <motion.button type="button" data-lesson-id={lesson.id} onClick={onClick}
        whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        className="course-lesson-action w-full h-full text-start" aria-label={lesson.titleAr} aria-describedby={status ? `lesson-status-${lesson.id}` : undefined}>
        <span className={`course-lesson-top flex items-center gap-3 ${showAudio && onSpeak ? 'pe-16' : ''}`}>
          <span className="course-lesson-number" aria-hidden="true">
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : String(index + 1).padStart(2, '0')}
          </span>
          {status && <span id={`lesson-status-${lesson.id}`} className="course-lesson-status text-xs font-extrabold">{status}</span>}
        </span>
        <span className="block min-w-0 space-y-2" dir={textDirection}>
          <span className="block text-base sm:text-lg font-extrabold leading-relaxed text-[var(--app-text)]">{lesson.titleAr}</span>
          {!young && lesson.summaryAr && <span className="block line-clamp-2 text-sm leading-relaxed text-[var(--app-text-muted)]">{lesson.summaryAr}</span>}
        </span>
        <span className="course-lesson-footer flex items-center justify-between gap-3">
          <span className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{isLocked ? t('lessonLockedLabel') : isCompleted ? t('reviewLessonAction') : t('openLessonAction')}</span>
          </span>
          {direction === 'rtl' ? <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden="true" /> : <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />}
        </span>
      </motion.button>
      {showAudio && onSpeak && <div className="absolute top-4 end-4">
        <TapSpeakButton snippetKey={`lesson-${lesson.id}`} text={lesson.titleAr} speakingKey={speakingKey} onSpeak={onSpeak} />
      </div>}
    </article>
  );
};
