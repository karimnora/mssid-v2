import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade, SubjectId, SubjectInfo, CourseLesson } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { Card, Badge, Button } from './ui';
import { BookOpen, ChevronLeft, Star, Lock } from 'lucide-react';
import { isFrenchFreeGrade, stripLatinGlosses } from './lessonViewer/youngLessonLayout';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { useTranslation } from '../hooks/useTranslation';
import { getOfficialAxisLabel } from '../utils/curriculumMeta';
import { SubjectIllustratedCard, SubjectVectorIllustration } from './SubjectIllustratedCard';
import { LessonIllustratedCard } from './LessonIllustratedCard';

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
}

const SUBJECT_EMOJI: Record<string, string> = {
  math: '📐',
  arabic: '📗',
  tamazight: 'ⵣ',
  science: '🧪',
  art: '🎨',
  history_geo: '🧭',
  islamic: '🕌',
  civics: '⚖️',
  french: '🇫🇷',
  english: '🇬🇧',
};

const SUBJECT_CARD: Record<string, string> = {
  arabic: 'kids-card-arabe',
  math: 'kids-card-maths',
  french: 'kids-card-francais',
  science: 'kids-card-sciences',
  art: 'kids-card-civics',
  islamic: 'kids-card-islamique',
  history_geo: 'kids-card-histoire',
  civics: 'kids-card-civics',
  english: 'kids-card-english',
  tamazight: 'kids-card-amazigh',
};

// Subjects whose lesson text reads left-to-right — flips only the card's text content, never the
// surrounding RTL layout (a fully mirrored grid would be unverifiable without a real browser here).
const LTR_SUBJECTS: SubjectId[] = ['french', 'english', 'tamazight'];

const TRIMESTER_LABELS: Record<1 | 2 | 3, string> = {
  1: 'الفصل الأول (Trimestre 1)',
  2: 'الفصل الثاني (Trimestre 2)',
  3: 'الفصل الثالث (Trimestre 3)',
};

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
}) => {
  const t = useTranslation('courses');
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
    if (previousGradeRef.current === grade) return;
    previousGradeRef.current = grade;
    setSelectedSubject(null);
  }, [grade]);

  // 1AP-3AP: these readers are still fragile, so every screen (not just lesson content) gets a
  // listen button on its instructions and subject names — matching the audio guidance level inside
  // a lesson instead of leaving the child alone with plain text until they've picked a subject.
  const showAudio = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const voiceAvailable = useVoiceAvailable('ar-SA');
  useEffect(() => stopSpeech, []);
  const handleSpeak = (key: string, text: string) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    void speakText(text, 'ar-SA', 0.85).then(() => {
      setSpeakingKey((prev) => (prev === key ? null : prev));
    });
  };

  // STEP 1 — Matière: giant colorful cards, fixed responsive grid, no horizontal scroll.
  const visibleSubjects = courseSubjects.filter((s) => isToolAvailableForGrade(s, grade));

  if (!selectedSubject) {
    return (
      <div className="space-y-4" dir="rtl">
        {showAudio && voiceAvailable === false && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl px-4 py-2.5">
            <span aria-hidden="true">🔇</span>
            <span>القراءة الصوتية غير متوفرة على هذا الجهاز حالياً.</span>
          </div>
        )}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showAudio && (
              <TapSpeakButton
                snippetKey="step1-heading"
                text={grade === '1AP' ? "اختر المادة التي تريد مراجعتها يا بطل" : "اختر المادة التي تريد مراجعتها"}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <div>
              <h2 className="text-lg font-black text-[var(--app-text)]">
                {grade === '1AP' ? 'المواد الدراسية المقررة — السنة الأولى ابتدائي 🌟' : `المواد الدراسية المقررة — ${grade}`}
              </h2>
              <p className="text-xs text-[var(--app-text-muted)] mt-0.5 font-bold">
                {isFrenchFreeGrade(grade)
                  ? 'المقرر الدراسي الجزائري الرسمي — طور التعليم المبكر'
                  : 'Matières du programme officiel algérien'}
              </p>
            </div>
          </div>
          <Badge variant="info">{visibleSubjects.length} مواد</Badge>
        </div>

        {/* Schoolmouv-style illustrated banners: single column on mobile, 2 columns on tablet/desktop */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4"
          variants={subjectGridVariants}
          initial="hidden"
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
              <motion.div key={subj.id} variants={subjectCardItemVariants} className="h-full">
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

  // STEP 2 (trimester tabs) + STEP 3 (that trimester's lessons only) — one screen, never all three
  // trimesters shown together, matching "ne jamais afficher les 3 trimestres en même temps".
  return (
    <div className="space-y-4 sm:space-y-5" dir="rtl">
      <CourseBreadcrumb
        grade={grade}
        subjectId={selectedSubject}
        trimester={selectedTrimester}
        onHomeClick={onGoHome}
        onSubjectClick={() => setSelectedSubject(null)}
      />

      {/* Header Banner for Selected Subject */}
      <div className="kids-pop bg-white dark:bg-slate-900 border-2 border-[#E7E2D7] dark:border-slate-800 rounded-[28px] p-5 sm:p-6 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative shadow-xs">
              <div className="w-24 h-24 absolute -bottom-2 -end-2">
                <SubjectVectorIllustration id={selectedSubject} />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[var(--app-text)] truncate">
                  {subjectInfo?.nameAr}
                </h1>
                <Badge variant="success">{grade}</Badge>
                {showAudio && subjectInfo && (
                  <TapSpeakButton
                    snippetKey="step2-subject"
                    text={subjectInfo.nameAr}
                    speakingKey={speakingKey}
                    onSpeak={handleSpeak}
                  />
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--app-text-muted)] font-semibold mt-0.5">
                {subjectInfo?.nameFr} — المقرر الدراسي الجزائري الرسمي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-center bg-slate-50 dark:bg-slate-800/90 rounded-2xl px-5 py-2.5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
              <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
                {activeTermCompleted} / {activeTermLessons.length}
              </span>
              <span className="text-[11px] font-extrabold text-[var(--app-text-muted)]">
                دروس مكتملة (الفصل {selectedTrimester})
              </span>
            </div>
          </div>
        </div>

        {/* Trimester Progress Mini-bar */}
        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${activeTermPercent}%` }}
          />
        </div>
      </div>

      {/* STEP 2 — 3 Grands onglets de Trimestre avec badges d'avancement intégrés */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {([1, 2, 3] as const).map((t) => {
          const isActive = selectedTrimester === t;
          const isLocked = isTrimesterLocked(t);
          const stat = trimesterStats[t - 1];

          return (
            <motion.button
              key={t}
              onClick={() => setSelectedTrimester(t)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-2xl p-3 sm:p-4 font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-h-[76px] sm:min-h-[84px] text-center ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-2 border-[#E7E2D7] dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="term-tab-active"
                  className={`absolute inset-0 rounded-2xl ${SUBJECT_CARD[selectedSubject] ?? 'kids-card-maths'}`}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-1.5 justify-center">
                  {isLocked && <Lock className="w-3.5 h-3.5 shrink-0 text-amber-300" />}
                  {grade === '1AP' || grade === '2AP' ? (
                    <span className="text-base sm:text-lg font-black leading-tight">
                      الفصل {t}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-black leading-tight">
                      {isFrenchFreeGrade(grade) ? stripLatinGlosses(TRIMESTER_LABELS[t]) : TRIMESTER_LABELS[t]}
                    </span>
                  )}
                </div>

                {/* Progress pill on each trimester tab */}
                <div className="mt-1 flex items-center gap-1">
                  {stat.isFullyCompleted ? (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      ✓ مكتمل
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {stat.completed}/{stat.total} درس
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* STEP 3 — Liste illustrée des cours du trimestre sélectionné */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubject}-${selectedTrimester}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
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
                لا توجد دروس بعد في هذا الفصل
              </h3>
              <p className="text-xs text-[var(--app-text-muted)]">
                جرّب فصلاً دراسياً آخر لهذه المادة لتصفح المحتوى.
              </p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
