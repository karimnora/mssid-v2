import React from 'react';
import { motion } from 'motion/react';
import { CourseLesson, SubjectId, PrimaryGrade } from '../types';
import { useLocaleContext } from '../context/LocaleContext';
import {
  CheckCircle2,
  Clock,
  Lock,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { Badge } from './ui';
import { getOfficialAxisLabel } from '../utils/curriculumMeta';

interface LessonIllustratedCardProps {
  lesson: CourseLesson;
  index: number;
  subjectId: SubjectId;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
  showAudio?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  grade?: PrimaryGrade;
}

const SUBJECT_STYLES: Record<
  string,
  {
    themeGradient: string;
    lightBg: string;
    numberBg: string;
    numberText: string;
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    accentGlow: string;
    bulletBg: string;
  }
> = {
  french: {
    themeGradient: 'from-purple-500 to-fuchsia-600',
    lightBg: 'bg-purple-50/70 dark:bg-purple-950/20',
    numberBg: 'bg-purple-100 dark:bg-purple-900/60',
    numberText: 'text-purple-700 dark:text-purple-200',
    badgeBg: 'bg-purple-100/80 dark:bg-purple-900/50',
    badgeText: 'text-purple-800 dark:text-purple-200',
    borderHover: 'hover:border-purple-300 dark:hover:border-purple-600',
    accentGlow: 'rgba(168, 85, 247, 0.12)',
    bulletBg: 'bg-purple-500',
  },
  math: {
    themeGradient: 'from-sky-500 to-blue-600',
    lightBg: 'bg-sky-50/70 dark:bg-sky-950/20',
    numberBg: 'bg-sky-100 dark:bg-sky-900/60',
    numberText: 'text-sky-700 dark:text-sky-200',
    badgeBg: 'bg-sky-100/80 dark:bg-sky-900/50',
    badgeText: 'text-sky-800 dark:text-sky-200',
    borderHover: 'hover:border-sky-300 dark:hover:border-sky-600',
    accentGlow: 'rgba(2, 132, 199, 0.12)',
    bulletBg: 'bg-sky-500',
  },
  science: {
    themeGradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    numberBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    numberText: 'text-emerald-700 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100/80 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-600',
    accentGlow: 'rgba(16, 185, 129, 0.12)',
    bulletBg: 'bg-emerald-500',
  },
  history_geo: {
    themeGradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50/70 dark:bg-amber-950/20',
    numberBg: 'bg-amber-100 dark:bg-amber-900/60',
    numberText: 'text-amber-700 dark:text-amber-200',
    badgeBg: 'bg-amber-100/80 dark:bg-amber-900/50',
    badgeText: 'text-amber-800 dark:text-amber-200',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-600',
    accentGlow: 'rgba(245, 158, 11, 0.12)',
    bulletBg: 'bg-amber-500',
  },
  civics: {
    themeGradient: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-50/70 dark:bg-orange-950/20',
    numberBg: 'bg-orange-100 dark:bg-orange-900/60',
    numberText: 'text-orange-700 dark:text-orange-200',
    badgeBg: 'bg-orange-100/80 dark:bg-orange-900/50',
    badgeText: 'text-orange-800 dark:text-orange-200',
    borderHover: 'hover:border-orange-300 dark:hover:border-orange-600',
    accentGlow: 'rgba(249, 115, 22, 0.12)',
    bulletBg: 'bg-orange-500',
  },
  english: {
    themeGradient: 'from-violet-500 to-indigo-600',
    lightBg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    numberBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    numberText: 'text-indigo-700 dark:text-indigo-200',
    badgeBg: 'bg-indigo-100/80 dark:bg-indigo-900/50',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-600',
    accentGlow: 'rgba(99, 102, 241, 0.12)',
    bulletBg: 'bg-indigo-500',
  },
  arabic: {
    themeGradient: 'from-emerald-600 to-green-700',
    lightBg: 'bg-green-50/70 dark:bg-green-950/20',
    numberBg: 'bg-green-100 dark:bg-green-900/60',
    numberText: 'text-green-700 dark:text-green-200',
    badgeBg: 'bg-green-100/80 dark:bg-green-900/50',
    badgeText: 'text-green-800 dark:text-green-200',
    borderHover: 'hover:border-green-300 dark:hover:border-green-600',
    accentGlow: 'rgba(5, 150, 105, 0.12)',
    bulletBg: 'bg-green-600',
  },
  islamic: {
    themeGradient: 'from-emerald-600 to-amber-600',
    lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    numberBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    numberText: 'text-emerald-700 dark:text-emerald-200',
    badgeBg: 'bg-emerald-100/80 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-600',
    accentGlow: 'rgba(4, 120, 87, 0.12)',
    bulletBg: 'bg-emerald-600',
  },
  tamazight: {
    themeGradient: 'from-teal-500 to-amber-600',
    lightBg: 'bg-teal-50/70 dark:bg-teal-950/20',
    numberBg: 'bg-teal-100 dark:bg-teal-900/60',
    numberText: 'text-teal-700 dark:text-teal-200',
    badgeBg: 'bg-teal-100/80 dark:bg-teal-900/50',
    badgeText: 'text-teal-800 dark:text-teal-200',
    borderHover: 'hover:border-teal-300 dark:hover:border-teal-600',
    accentGlow: 'rgba(13, 148, 136, 0.12)',
    bulletBg: 'bg-teal-500',
  },
  art: {
    themeGradient: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50/70 dark:bg-rose-950/20',
    numberBg: 'bg-rose-100 dark:bg-rose-900/60',
    numberText: 'text-rose-700 dark:text-rose-200',
    badgeBg: 'bg-rose-100/80 dark:bg-rose-900/50',
    badgeText: 'text-rose-800 dark:text-rose-200',
    borderHover: 'hover:border-rose-300 dark:hover:border-rose-600',
    accentGlow: 'rgba(251, 113, 133, 0.12)',
    bulletBg: 'bg-rose-500',
  },
};

/**
 * Modern illustrated card for an individual lesson within a trimester.
 * Designed with child ergonomics, clear step badges, completion checkmarks,
 * pedagogical axis tags, duration & quiz count, and Schoolmouv-inspired accents.
 */
export const LessonIllustratedCard: React.FC<LessonIllustratedCardProps> = ({
  lesson,
  index,
  subjectId,
  isCompleted,
  isLocked,
  onClick,
  showAudio = false,
  speakingKey = null,
  onSpeak,
  grade,
}) => {
  const { direction, locale } = useLocaleContext();
  const isRtl = direction === 'rtl';
  const style = SUBJECT_STYLES[subjectId] || SUBJECT_STYLES.math;
  const is1AP = grade === '1AP';
  const axisLabel = is1AP ? null : getOfficialAxisLabel(lesson);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      data-lesson-id={lesson.id}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-[22px] bg-white dark:bg-slate-900 border-2 transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
        isCompleted
          ? 'border-emerald-200/90 dark:border-emerald-800/60 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20'
          : `border-[#EFE9DF] dark:border-slate-800 ${style.borderHover}`
      } ${isLocked ? 'opacity-85' : ''}`}
    >
      {/* Top row: step number + status / audio / tags */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Ordinal Step Badge */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg transition-transform duration-200 group-hover:scale-105 shadow-xs shrink-0 ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : isLocked
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                  : `${style.numberBg} ${style.numberText}`
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : isLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          {/* Audio Button for early childhood reading assistance */}
          {showAudio && onSpeak && (
            <div
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <TapSpeakButton
                snippetKey={`lesson-${lesson.id}`}
                text={lesson.titleAr}
                speakingKey={speakingKey}
                onSpeak={onSpeak}
              />
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {lesson.categoryAr && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${style.badgeBg} ${style.badgeText}`}
            >
              {lesson.categoryAr}
            </span>
          )}

          {isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
              <span>{is1AP ? 'بَطَل! مُكْتَمَل 🌟' : 'مكتمل'}</span>
            </span>
          ) : isLocked ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#5A3B00] bg-[#FFF8E7] border border-[#F5D98A] px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
              <span>مغلق</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Center content: Lesson title and brief summary */}
      <div className="space-y-1.5 min-w-0">
        <h3 className={`${is1AP ? 'text-[17px] sm:text-[19px]' : 'text-[15.5px] sm:text-[17px]'} font-black text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors`}>
          {lesson.titleAr}
        </h3>

        {lesson.summaryAr && (
          <p className={`${is1AP ? 'text-xs sm:text-[13px]' : 'text-xs'} text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal`}>
            {lesson.summaryAr}
          </p>
        )}

        {/* Official Curriculum Axis if available */}
        {axisLabel && (
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md max-w-full truncate">
              <BookOpen className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">{axisLabel}</span>
            </span>
          </div>
        )}
      </div>

      {/* Bottom meta row: duration, difficulty stars, quizzes & open arrow */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Duration or 1AP Playful Activity Pill */}
          {is1AP ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full text-[11px] font-black border border-amber-200/60 dark:border-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>تعلّم ولعب</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>15 د</span>
            </span>
          )}

          {/* Difficulty Stars */}
          {lesson.difficultyTier && (
            <span className="flex items-center gap-0.5 text-amber-400" title={`مستوى الصعوبة: ${lesson.difficultyTier}`}>
              {Array.from({ length: lesson.difficultyTier }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </span>
          )}

          {/* Quiz count */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <span className={`inline-flex items-center gap-1 ${is1AP ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full text-[11px] font-black' : 'text-slate-500 dark:text-slate-400'}`}>
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{is1AP ? `${lesson.quiz.length} تحديات ⭐` : `${lesson.quiz.length} أسئلة`}</span>
            </span>
          )}
        </div>

        {/* Action arrow button */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-115 shrink-0 ${
            isCompleted
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-emerald-600 group-hover:text-white'
          }`}
        >
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </div>
    </motion.div>
  );
};
