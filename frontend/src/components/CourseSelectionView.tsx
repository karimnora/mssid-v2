import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PrimaryGrade, SubjectId, SubjectInfo, CourseLesson } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { Card } from './ui';
import { BookOpen, Lock } from 'lucide-react';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { VoiceUnavailableBanner } from './VoiceUnavailableBanner';
import { useTranslation } from '../hooks/useTranslation';
import { SubjectIllustratedCard, SubjectVectorIllustration } from './SubjectIllustratedCard';
import { LessonIllustratedCard } from './LessonIllustratedCard';
import { useLocaleContext } from '../context/LocaleContext';
import didouGuide from '../assets/v2-reused/didou-point.webp';

interface CourseSelectionViewProps {
  grade: PrimaryGrade;
  courseSubjects: SubjectInfo[];
  allCourseLessons: CourseLesson[];
  completedLessonIds: string[];
  onSelectLesson: (lesson: CourseLesson) => void;
  /** Optional — when provided, locked lessons still call onSelectLesson on click (App.tsx routes
   * that to the paywall) but get a visual lock badge here so the child never wonders why nothing
   * seems to happen. Absent entirely means "nothing is ever locked" (no behavior change). */
  isLessonLocked?: (lesson: CourseLesson) => boolean;
  onGoHome: () => void;
  /** When the child picked a subject on HomeView, skip the matière step. */
  initialSubjectId?: SubjectId | null;
  /** Lets the global header back button close the subject step before leaving courses. */
  onSubjectStepBackChange?: (action: (() => void) | null) => void;
}

// Subjects whose lesson text reads left-to-right — flips only the card's text content, never the
// surrounding RTL layout (a fully mirrored grid would be unverifiable without a real browser here).
const LTR_SUBJECTS: SubjectId[] = ['french', 'english', 'tamazight'];

// Algerian school year ≈ Sept-Dec (T1) / Jan-Mar (T2) / Apr-Jun (T3); defaults to T1 outside that
// window (summer break) per the spec ("le trimestre en cours ou le Trimestre 1").
function getDefaultTrimester(): 1 | 2 | 3 {
  const month = new Date().getMonth(); // 0-11
  if (month >= 0 && month <= 2) return 2;
  if (month >= 3 && month <= 5) return 3;
  return 1;
}

// Animation variants for the subject selection grid: cascading stagger with soft slide-up and spring bounce
const subjectGridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

const subjectCardItemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 24,
      mass: 0.8,
    },
  },
};

// Guided 3-step browsing flow (Matière → Trimestre → Liste) replacing the old horizontally-
// scrolling subject-tabs-bar + "all trimesters" grid. Grade/level selection stays outside this
// component (Navbar's grade switcher) — this only owns what happens once "Réviser un cours" is
// picked from HomeView.
export const CourseSelectionView: React.FC<CourseSelectionViewProps> = ({
  grade,
  courseSubjects,
  allCourseLessons,
  completedLessonIds,
  onSelectLesson,
  isLessonLocked,
  onGoHome,
  initialSubjectId = null,
  onSubjectStepBackChange,
}) => {
  const t = useTranslation('courses');
  const { locale, direction } = useLocaleContext();
  const reduceMotion = useReducedMotion();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(() =>
    initialSubjectId && courseSubjects.some((subject) => subject.id === initialSubjectId)
      ? initialSubjectId
      : null,
  );
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(() => getDefaultTrimester());

  // Changing level restarts the Matière choice — a 1AP subject list may not even apply to 5AP.
  // Do not wipe on mount: that would cancel a subject picked from HomeView.
  const previousGradeRef = useRef(grade);
  useEffect(() => {
    onSubjectStepBackChange?.(selectedSubject ? () => setSelectedSubject(null) : null);
    return () => onSubjectStepBackChange?.(null);
  }, [selectedSubject, onSubjectStepBackChange]);
  useEffect(() => {
    if (previousGradeRef.current === grade) return;
    previousGradeRef.current = grade;
    setSelectedSubject(null);
  }, [grade]);

  // 1AP-3AP: these readers are still fragile, so every screen (not just lesson content) gets a
  // listen button on its instructions and subject names — matching the audio guidance level inside
  // a lesson instead of leaving the child alone with plain text until they've picked a subject.
  const showAudio = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const voiceAvailable = useVoiceAvailable(locale === 'fr' ? 'fr-FR' : 'ar-SA');
  useEffect(() => stopSpeech, []);
  const handleSpeak = (key: string, text: string) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    void speakText(text, /[\u0600-\u06ff]/u.test(text) ? 'ar-SA' : 'fr-FR', 0.85).then(() => {
      setSpeakingKey((prev) => (prev === key ? null : prev));
    });
  };

  // STEP 1 — Matière: giant colorful cards, fixed responsive grid, no horizontal scroll.
  const visibleSubjects = courseSubjects.filter((s) => isToolAvailableForGrade(s, grade));

  if (!selectedSubject) {
    return (
      <div className="course-browser space-y-5" dir={direction} data-course-browser="subjects">
        {showAudio && <VoiceUnavailableBanner visible={voiceAvailable === false} />}
        <header className="course-catalog-heading flex items-center gap-4">
          <img src={didouGuide} alt="" width={64} height={92} decoding="async" className="w-16 h-[92px] object-contain shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <span className="course-eyebrow">{grade} · {t('subjectsCountLabel', { count: visibleSubjects.length })}</span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">{t('catalogHeading')}</h1>
            <p className="text-sm text-[var(--app-text-muted)] leading-relaxed">{t('catalogSubtitle')}</p>
          </div>
          {showAudio && <TapSpeakButton snippetKey="step1-heading" text={t('catalogSubtitle')} speakingKey={speakingKey} onSpeak={handleSpeak} />}
        </header>

        {/* Schoolmouv-style illustrated banners: single column on mobile, 2 columns on tablet/desktop */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4"
          variants={subjectGridVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
        >
          {visibleSubjects.map((subj) => {
            const subjectLessons = allCourseLessons.filter(
              (l) => l.subject === subj.id && l.grade === grade,
            );
            const completedCount = subjectLessons.filter((l) =>
              completedLessonIds.includes(l.id),
            ).length;

            return (
              <motion.div key={subj.id} variants={subjectCardItemVariants} className="h-full" data-course-subject={subj.id}>
                <SubjectIllustratedCard
                  id={subj.id}
                  nameAr={subj.nameAr}
                  nameFr={subj.nameFr}
                  grade={grade}
                  totalLessons={subjectLessons.length}
                  completedLessons={completedCount}
                  onClick={() => setSelectedSubject(subj.id)}
                  showAudio={showAudio}
                  speakingKey={speakingKey}
                  onSpeak={handleSpeak}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  const subjectInfo = courseSubjects.find((s) => s.id === selectedSubject);
  const isLtrSubject = LTR_SUBJECTS.includes(selectedSubject);
  // 1AP/2AP: title + icon is enough to pick a lesson — a full pedagogical summary paragraph and a
  // quiz-count pill are reading load a 7-year-old doesn't need on a tile they're just scanning.
  const isSimpleCard = grade === '1AP' || grade === '2AP';
  const termLessons = allCourseLessons.filter(
    (l) => l.subject === selectedSubject && l.grade === grade && l.trimester === selectedTrimester
  );

  // Sample one lesson per trimester tab just to answer "is this whole term locked?" — isLessonLocked
  // only ever looks at lesson.trimester, so any lesson from that term gives the right answer.
  const isTrimesterLocked = (t: 1 | 2 | 3): boolean => {
    if (!isLessonLocked) return false;
    const sample = allCourseLessons.find((l) => l.subject === selectedSubject && l.grade === grade && l.trimester === t);
    return sample ? isLessonLocked(sample) : false;
  };

  // Trimester stats
  const trimesterStats = ([1, 2, 3] as const).map((t) => {
    const lessons = allCourseLessons.filter(
      (l) => l.subject === selectedSubject && l.grade === grade && l.trimester === t,
    );
    const completed = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return {
      trimester: t,
      total: lessons.length,
      completed,
      isFullyCompleted: lessons.length > 0 && completed === lessons.length,
    };
  });

  const activeTermLessons = allCourseLessons.filter(
    (l) => l.subject === selectedSubject && l.grade === grade && l.trimester === selectedTrimester,
  );
  const activeTermCompleted = activeTermLessons.filter((l) =>
    completedLessonIds.includes(l.id),
  ).length;
  const activeTermPercent =
    activeTermLessons.length > 0
      ? Math.round((activeTermCompleted / activeTermLessons.length) * 100)
      : 0;

  const allTermDone = termLessons.length > 0 && termLessons.every(lesson => completedLessonIds.includes(lesson.id));
  const suggestedLesson = termLessons.find(lesson => !completedLessonIds.includes(lesson.id) && !isLessonLocked?.(lesson))
    ?? (allTermDone ? termLessons.find(lesson => !isLessonLocked?.(lesson)) : undefined);

  // STEP 2 (trimester tabs) + STEP 3 (that trimester's lessons only) — one screen, never all three
  // trimesters shown together, matching "ne jamais afficher les 3 trimestres en même temps".
  return (
    <div className="course-browser space-y-4 sm:space-y-5" dir={direction} data-course-browser="lessons">
      {showAudio && <VoiceUnavailableBanner visible={voiceAvailable === false} />}
      <CourseBreadcrumb
        grade={grade}
        subjectId={selectedSubject}
        trimester={selectedTrimester}
        onHomeClick={onGoHome}
        onSubjectClick={() => setSelectedSubject(null)}
      />

      <header className="course-subject-heading">
        <div className="flex items-center gap-4 min-w-0">
          <div className="course-subject-art shrink-0"><SubjectVectorIllustration id={selectedSubject} /></div>
          <div className="min-w-0 flex-1">
            <span className="course-eyebrow">{grade} · {t('trimesterPrefixLabel')} {selectedTrimester}</span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--app-text)] break-words">{locale === 'fr' ? subjectInfo?.nameFr : subjectInfo?.nameAr}</h1>
            <p className="text-sm text-[var(--app-text-muted)] mt-1">{t('completedLessonsLabel', { count: activeTermCompleted, total: activeTermLessons.length })}</p>
          </div>
          {showAudio && subjectInfo && <TapSpeakButton snippetKey="step2-subject" text={locale === 'fr' ? subjectInfo.nameFr : subjectInfo.nameAr} speakingKey={speakingKey} onSpeak={handleSpeak} />}
        </div>
        <div className="course-progress-track" role="progressbar" aria-label={t('courseProgressLabel')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={activeTermPercent}>
          <div style={{ width: activeTermPercent + '%' }} />
        </div>
      </header>

      {/* STEP 2 — 3 Grands onglets de Trimestre avec badges d'avancement intégrés */}
      <div className="course-term-picker grid grid-cols-3 gap-2" role="group" aria-label={t('chooseTrimesterLabel')}>
        {([1, 2, 3] as const).map(term => {
          const stat = trimesterStats[term - 1];
          return <button type="button" key={term} aria-pressed={selectedTrimester === term} onClick={() => setSelectedTrimester(term)}>
            <span className="flex items-center justify-center gap-1 font-extrabold text-sm">
              {isTrimesterLocked(term) && <Lock className="w-4 h-4" aria-hidden="true" />}
              {isSimpleCard ? t('trimesterPrefixLabel') + ' ' + term : t(term === 1 ? 'trimester1Label' : term === 2 ? 'trimester2Label' : 'trimester3Label')}
            </span>
            <span className="text-xs font-bold mt-1" dir="ltr">{stat.completed}/{stat.total} {stat.isFullyCompleted ? '✓' : ''}</span>
          </button>;
        })}
      </div>

      {suggestedLesson && <section className="course-next-lesson flex items-center gap-3">
        <img src={didouGuide} alt="" width={46} height={66} decoding="async" className="w-[46px] h-[66px] object-contain shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="course-eyebrow mb-1">{t(allTermDone ? 'reviewLessonAction' : 'suggestedLessonLabel')}</p>
          <p dir={isLtrSubject ? 'ltr' : 'rtl'} className="text-sm font-extrabold leading-relaxed text-[var(--app-text)]">{suggestedLesson.titleAr}</p>
        </div>
        <button type="button" data-course-start onClick={() => onSelectLesson(suggestedLesson)} className="course-start-button">{t(allTermDone ? 'reviewLessonAction' : 'openLessonAction')}</button>
      </section>}

      {/* STEP 3 — Liste illustrée des cours du trimestre sélectionné */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubject}-${selectedTrimester}`}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {termLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {termLessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const locked = isLessonLocked?.(lesson) ?? false;
                return (
                  <LessonIllustratedCard
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    subjectId={selectedSubject}
                    isCompleted={isCompleted}
                    isLocked={locked}
                    isSuggested={!allTermDone && suggestedLesson?.id === lesson.id}
                    grade={grade}
                    onClick={() => onSelectLesson(lesson)}
                    showAudio={showAudio}
                    speakingKey={speakingKey}
                    onSpeak={handleSpeak}
                  />
                );
              })}
            </div>
          ) : (
            <Card padding="none" className="p-12 text-center space-y-3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 opacity-40 mx-auto text-[var(--app-text-muted)]" />
              <h3 className="text-base font-black text-[var(--app-text)]">
                {t('noLessonsHeading')}
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">
                {t('noLessonsSubtext')}
              </p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
