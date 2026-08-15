import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade, SubjectId, SubjectInfo, CourseLesson } from '../types';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { Card, Badge, Button } from './ui';
import { Calculator, BookOpen, FlaskConical, Compass, Heart, Award, Languages, Globe, ChevronLeft, Star } from 'lucide-react';

interface CourseSelectionViewProps {
  grade: PrimaryGrade;
  courseSubjects: SubjectInfo[];
  allCourseLessons: CourseLesson[];
  completedLessonIds: string[];
  onSelectLesson: (lesson: CourseLesson) => void;
  onGoHome: () => void;
}

const SUBJECT_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator, BookOpen, FlaskConical, Compass, Heart, Award, Languages, Globe,
};

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
  onGoHome,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(() => getDefaultTrimester());

  // Changing level restarts the Matière choice — a 1AP subject list may not even apply to 5AP.
  useEffect(() => {
    setSelectedSubject(null);
  }, [grade]);

  // STEP 1 — Matière: giant colorful cards, fixed responsive grid, no horizontal scroll.
  if (!selectedSubject) {
    return (
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-black text-[var(--app-text)]">اختر المادة التي تريد مراجعتها — {grade}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {courseSubjects.map((subj) => {
            const IconComp = SUBJECT_ICON_MAP[subj.icon] || BookOpen;
            return (
              <motion.button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-3xl p-5 sm:p-6 min-h-36 text-white shadow-md cursor-pointer bg-gradient-to-br ${subj.color} flex flex-col items-center justify-center gap-2 text-center`}
              >
                <span className="text-4xl sm:text-5xl leading-none">{SUBJECT_EMOJI[subj.id] || '📘'}</span>
                <IconComp className="w-4 h-4 opacity-70" />
                <span className="font-black text-xs sm:text-sm leading-tight">{subj.nameAr}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const subjectInfo = courseSubjects.find((s) => s.id === selectedSubject);
  const isLtrSubject = LTR_SUBJECTS.includes(selectedSubject);
  const termLessons = allCourseLessons.filter(
    (l) => l.subject === selectedSubject && l.grade === grade && l.trimester === selectedTrimester
  );

  // STEP 2 (trimester tabs) + STEP 3 (that trimester's lessons only) — one screen, never all three
  // trimesters shown together, matching "ne jamais afficher les 3 trimestres en même temps".
  return (
    <div className="space-y-4" dir="rtl">
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

      {/* STEP 2 — Trimestre: 3 grands onglets très visibles */}
      <div className="grid grid-cols-3 gap-2.5">
        {([1, 2, 3] as const).map((t) => {
          const isActive = selectedTrimester === t;
          return (
            <motion.button
              key={t}
              onClick={() => setSelectedTrimester(t)}
              whileTap={{ scale: 0.96 }}
              className={`relative min-h-16 rounded-2xl font-black text-xs sm:text-sm px-2 transition-colors cursor-pointer ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="term-tab-active"
                  className="absolute inset-0 rounded-2xl bg-[var(--brand-blue)]"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative">{TRIMESTER_LABELS[t]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* STEP 3 — Liste épurée des cours du trimestre sélectionné */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubject}-${selectedTrimester}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {termLessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {termLessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                return (
                  <Card
                    key={lesson.id}
                    interactive
                    className="p-5 space-y-3 h-full"
                    onClick={() => onSelectLesson(lesson)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <Badge variant="info">{lesson.categoryAr}</Badge>
                      {isCompleted && <Badge variant="success">✓ مكتمل</Badge>}
                    </div>

                    <div dir={isLtrSubject ? 'ltr' : 'rtl'} className="text-right">
                      <h3 className="text-sm font-extrabold font-sans text-[var(--app-text)]">{lesson.titleAr}</h3>
                      <p className="text-xs text-[var(--app-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                        {lesson.summaryAr}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--app-card-border)] text-[11px] font-bold text-[var(--app-text-muted)]">
                      <div className="flex items-center gap-2">
                        {lesson.difficultyTier && (
                          <span className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: lesson.difficultyTier }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </span>
                        )}
                        {lesson.quiz && lesson.quiz.length > 0 && (
                          <span dir="ltr">{lesson.quiz.length} أسئلة</span>
                        )}
                      </div>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card padding="none" className="p-10 text-center space-y-3">
              <BookOpen className="w-10 h-10 opacity-40 mx-auto text-[var(--app-text-muted)]" />
              <h3 className="text-sm font-extrabold text-[var(--app-text)]">لا توجد دروس بعد في هذا الفصل</h3>
              <p className="text-xs text-[var(--app-text-muted)]">جرّب فصلاً دراسياً آخر لهذه المادة.</p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
