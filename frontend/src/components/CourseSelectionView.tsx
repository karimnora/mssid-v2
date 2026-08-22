import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade, SubjectId, SubjectInfo, CourseLesson } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { Card, Badge } from './ui';
import { BookOpen, ChevronLeft, Lock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface CourseSelectionViewProps {
  grade: PrimaryGrade;
  courseSubjects: SubjectInfo[];
  allCourseLessons: CourseLesson[];
  completedLessonIds: string[];
  onSelectLesson: (lesson: CourseLesson) => void;
  isLessonLocked?: (lesson: CourseLesson) => boolean;
  onGoHome: () => void;
}

const SUBJECT_EMOJI: Record<string, string> = {
  math: '📐',
  arabic: '📖',
  tamazight: 'ⵣ',
  science: '🧪',
  history_geo: '🌍',
  islamic: '🕌',
  civics: '⚖️',
  french: '🇫🇷',
  english: '🇬🇧',
};

const LTR_SUBJECTS: SubjectId[] = ['french', 'english', 'tamazight'];

function getDefaultTrimester(): 1 | 2 | 3 {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 2;
  if (month >= 3 && month <= 5) return 3;
  return 1;
}

export const CourseSelectionView: React.FC<CourseSelectionViewProps> = ({
  grade,
  courseSubjects,
  allCourseLessons,
  completedLessonIds,
  onSelectLesson,
  isLessonLocked,
  onGoHome,
}) => {
  const t = useTranslation('courses');
  const compact = grade === '1AP' || grade === '2AP';
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(() => getDefaultTrimester());

  useEffect(() => {
    setSelectedSubject(null);
  }, [grade]);

  const visibleSubjects = courseSubjects.filter((s) => isToolAvailableForGrade(s, grade));
  const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

  if (!selectedSubject) {
    return (
      <div className="space-y-6" dir="rtl" data-course-layout={compact ? 'compact' : 'full'}>
        <h2 className="text-lg font-black text-[var(--app-text)]">{t('chooseSubjectHeading', { grade })}</h2>
        <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
          {visibleSubjects.map((subj) => (
            <motion.button
              key={subj.id}
              type="button"
              onClick={() => setSelectedSubject(subj.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className={`rounded-3xl p-6 min-h-32 text-white shadow-md cursor-pointer bg-gradient-to-br ${subj.color} flex flex-col items-center justify-center gap-3 text-center`}
            >
              <span className="text-4xl leading-none">{SUBJECT_EMOJI[subj.id] || '📘'}</span>
              <span className="font-black text-sm leading-tight">{subj.nameAr}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const subjectInfo = courseSubjects.find((s) => s.id === selectedSubject);
  const isLtrSubject = LTR_SUBJECTS.includes(selectedSubject);
  const termLessons = allCourseLessons.filter(
    (l) => l.subject === selectedSubject && l.grade === grade && l.trimester === selectedTrimester
  );
  const nextLesson = termLessons.find((l) => !completedLessonIds.includes(l.id) && !(isLessonLocked?.(l) ?? false));

  const isTrimesterLocked = (term: 1 | 2 | 3): boolean => {
    if (!isLessonLocked) return false;
    const sample = allCourseLessons.find((l) => l.subject === selectedSubject && l.grade === grade && l.trimester === term);
    return sample ? isLessonLocked(sample) : false;
  };

  const trimesterLabel = (term: 1 | 2 | 3) => {
    if (compact) {
      return term === 1 ? t('trimesterShort1') : term === 2 ? t('trimesterShort2') : t('trimesterShort3');
    }
    return term === 1 ? t('trimester1Label') : term === 2 ? t('trimester2Label') : t('trimester3Label');
  };

  return (
    <div className="space-y-5" dir="rtl" data-course-layout={compact ? 'compact' : 'full'}>
      <CourseBreadcrumb
        grade={grade}
        subjectId={selectedSubject}
        trimester={selectedTrimester}
        onHomeClick={onGoHome}
        onSubjectClick={() => setSelectedSubject(null)}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xl">{SUBJECT_EMOJI[selectedSubject] || '📘'}</span>
        <h2 className="text-lg font-black text-[var(--app-text)]">{subjectInfo?.nameAr}</h2>
        <Badge variant="info">{grade}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {([1, 2, 3] as const).map((term) => {
          const isActive = selectedTrimester === term;
          return (
            <motion.button
              key={term}
              type="button"
              onClick={() => setSelectedTrimester(term)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              data-trimester-tab={term}
              className={`relative min-h-14 rounded-2xl font-black text-sm px-2 cursor-pointer ${
                isActive ? 'text-white shadow-lg' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="term-tab-active"
                  className="absolute inset-0 rounded-2xl bg-[var(--brand-blue)]"
                  transition={spring}
                />
              )}
              <span className="relative flex items-center justify-center gap-1.5">
                {isTrimesterLocked(term) && <Lock className="w-3 h-3 shrink-0" />}
                {trimesterLabel(term)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {compact && nextLesson && (
        <motion.button
          type="button"
          data-next-lesson-cta={nextLesson.id}
          onClick={() => onSelectLesson(nextLesson)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          className="w-full rounded-3xl p-5 bg-emerald-600 text-white font-black text-base shadow-md cursor-pointer"
        >
          {t('nextUncompletedCta')}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubject}-${selectedTrimester}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {termLessons.length > 0 ? (
            <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
              {termLessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const locked = isLessonLocked?.(lesson) ?? false;
                return (
                  <Card
                    key={lesson.id}
                    interactive
                    padding="sm"
                    className={`space-y-2 h-full ${locked ? 'relative overflow-hidden' : ''}`}
                    onClick={() => onSelectLesson(lesson)}
                  >
                    {compact ? (
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          dir={isLtrSubject ? 'ltr' : 'rtl'}
                          className={`text-sm font-extrabold text-[var(--app-text)] flex-1 ${isLtrSubject ? 'text-left' : 'text-right'}`}
                        >
                          {lesson.titleAr}
                        </h3>
                        {locked ? (
                          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        ) : (
                          isCompleted && <Badge variant="success">{t('completedBadge')}</Badge>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="info">{lesson.categoryAr}</Badge>
                          {locked ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" />
                              <span>{t('premiumBadge')}</span>
                            </span>
                          ) : (
                            isCompleted && <Badge variant="success">{t('completedBadge')}</Badge>
                          )}
                        </div>
                        <div dir={isLtrSubject ? 'ltr' : 'rtl'} className={isLtrSubject ? 'text-left' : 'text-right'}>
                          <h3 className="text-sm font-extrabold text-[var(--app-text)]">{lesson.titleAr}</h3>
                          <p className="text-xs text-[var(--app-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                            {lesson.summaryAr}
                          </p>
                        </div>
                        <div className="flex items-center justify-end pt-1">
                          <ChevronLeft className="w-4 h-4 text-[var(--app-text-muted)]" />
                        </div>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card padding="none" className="p-10 text-center space-y-3">
              <BookOpen className="w-10 h-10 opacity-40 mx-auto text-[var(--app-text-muted)]" />
              <h3 className="text-sm font-extrabold text-[var(--app-text)]">{t('noLessonsHeading')}</h3>
              <p className="text-xs text-[var(--app-text-muted)]">{t('noLessonsSubtext')}</p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
