import React, { useState, useEffect, useMemo } from 'react';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { COURSES_DATA } from '../data/coursesData';
import { CourseLesson, ExamKind, PrimaryGrade, SubjectId, OfficialExam } from '../types';
import { Card, Badge, Button } from './ui';
import { PrimaryAverageCalculator } from './PrimaryAverageCalculator';
import { getExamKind } from '../utils/examKind';
import { useTranslation } from '../hooks/useTranslation';
import {
  Clock,
  FileText,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Trophy,
  BookOpen,
  Star,
  Eye,
  EyeOff,
  GraduationCap,
  RotateCcw,
  Play,
  Pause,
  Printer,
  Check,
} from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';

interface ExamsViewerProps {
  /** Grade selected from the top global navigation bar (1AP to 5AP) */
  grade?: PrimaryGrade;
  tashkeelEnabled?: boolean;
  /** Exam ids the student has already self-reported as done */
  completedExamIds?: string[];
  /** Called once when the student marks the currently-open exam as completed */
  onExamComplete?: (examId: string) => void;
  /** 1AP empty-state: jump back to the courses pole */
  onOpenCourses?: () => void;
  /** Open a catalog lesson from a corrigé (« réviser cette leçon ») */
  onOpenLesson?: (lesson: CourseLesson) => void;
}

const SUBJECT_EMOJI: Record<string, string> = {
  math: '📐',
  arabic: '📖',
  science: '🧪',
  french: '🇫🇷',
  english: '🇬🇧',
  history_geo: '🌍',
  islamic: '🕌',
  civics: '⚖️',
};

const GRADE_TITLE_KEY: Record<PrimaryGrade, 'gradeTitle1AP' | 'gradeTitle2AP' | 'gradeTitle3AP' | 'gradeTitle4AP' | 'gradeTitle5AP'> = {
  '1AP': 'gradeTitle1AP',
  '2AP': 'gradeTitle2AP',
  '3AP': 'gradeTitle3AP',
  '4AP': 'gradeTitle4AP',
  '5AP': 'gradeTitle5AP',
};

type KindFilter = ExamKind;
type TrimesterTab = 1 | 2 | 3 | 'all';

const ReviseLessonButton: React.FC<{
  lessonId?: string;
  label: string;
  onOpenLesson?: (lesson: CourseLesson) => void;
}> = ({ lessonId, label, onOpenLesson }) => {
  if (!lessonId || !onOpenLesson) return null;
  const lesson = COURSES_DATA.find((item) => item.id === lessonId);
  if (!lesson) return null;
  return (
    <button
      type="button"
      onClick={() => onOpenLesson(lesson)}
      className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl bg-sky-100 text-sky-950 border border-sky-300 hover:bg-sky-200 transition-all cursor-pointer"
    >
      <BookOpen className="w-3.5 h-3.5" />
      <span>
        {label} · {lesson.titleAr}
      </span>
    </button>
  );
};

export const ExamsViewer: React.FC<ExamsViewerProps> = ({
  grade,
  tashkeelEnabled = true,
  completedExamIds = [],
  onExamComplete,
  onOpenCourses,
  onOpenLesson,
}) => {
  const t = useTranslation('exams');
  const currentGrade: PrimaryGrade = (grade as PrimaryGrade) || '5AP';

  const [kindFilter, setKindFilter] = useState<KindFilter>(grade === '5AP' || !grade ? 'bep' : 'composition');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<TrimesterTab>('all');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Automatically reset internal filters when user switches grade in the top navbar
  useEffect(() => {
    setSelectedSubject(null);
    setSelectedExamId(null);
    setKindFilter(grade === '5AP' ? 'bep' : 'composition');
  }, [grade]);

  const filteredExams = useMemo(() => {
    return OFFICIAL_EXAMS_DATA.filter((e) => e.grade === currentGrade && getExamKind(e) === kindFilter);
  }, [currentGrade, kindFilter]);

  // Available subjects for the currently selected grade
  const availableSubjects = useMemo(() => {
    const ids = Array.from(new Set(filteredExams.map((e) => e.subject)));
    return ids
      .map((id) => SUBJECTS_LIST.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => !!s);
  }, [filteredExams]);

  // Exams filtered by selected subject
  const subjectExams = useMemo(() => {
    if (!selectedSubject) return filteredExams;
    return filteredExams.filter((e) => e.subject === selectedSubject);
  }, [filteredExams, selectedSubject]);

  // Exams filtered by trimester (when applicable)
  const displayedExams = useMemo(() => {
    if (kindFilter === 'bep') {
      return subjectExams;
    }
    if (selectedTrimester === 'all') {
      return subjectExams;
    }
    return subjectExams.filter((e) => e.trimester === selectedTrimester);
  }, [kindFilter, selectedTrimester, subjectExams]);

  const selectedExam = useMemo(() => {
    return selectedExamId ? OFFICIAL_EXAMS_DATA.find((e) => e.id === selectedExamId) : null;
  }, [selectedExamId]);

  // Free Solutions state
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [allSolutionsVisible, setAllSolutionsVisible] = useState<boolean>(false);

  // Interactive timer
  const [timerSeconds, setTimerSeconds] = useState<number>(5400);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleSolution = (key: string) => {
    setShowSolutions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllSolutions = () => {
    if (!selectedExam) return;
    const nextState = !allSolutionsVisible;
    setAllSolutionsVisible(nextState);
    const newShow: Record<string, boolean> = { problem: nextState };
    selectedExam.exercises.forEach((_, idx) => {
      newShow[`ex-${idx}`] = nextState;
    });
    setShowSolutions(newShow);
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openExam = (exam: OfficialExam) => {
    setSelectedExamId(exam.id);
    setShowSolutions({});
    setAllSolutionsVisible(false);
    setTimerSeconds(exam.durationMinutes ? exam.durationMinutes * 60 : 5400);
    setIsTimerRunning(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // ================= VIEW 3: Detailed Exam Sheet & Free Solutions =================
  if (selectedExam) {
    const exercisesPoints = selectedExam.exercises.reduce((sum, ex) => sum + ex.points, 0);
    const isCompleted = completedExamIds.includes(selectedExam.id);
    const subjectInfo = SUBJECTS_LIST.find((s) => s.id === selectedExam.subject);

    return (
      <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
        {/* Top Controls & Navigation Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl shadow-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedExamId(null)}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            {t('backToExamsOf', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Solutions Toggle */}
            <button
              onClick={toggleAllSolutions}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                allSolutionsVisible
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {allSolutionsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{allSolutionsVisible ? 'إخفاء كافة الحلول' : 'إظهار كافة الحلول مجاناً ✨'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card-border)] transition-colors cursor-pointer border border-[var(--app-card-border)]"
              title="طباعة ورقة الامتحان"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>

            {/* Exam Simulation Timer */}
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-2.5 shadow-xs">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-black text-amber-300 text-sm">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isTimerRunning ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
                title={isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل المؤقت'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(selectedExam.durationMinutes ? selectedExam.durationMinutes * 60 : 5400);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="إعادة ضبط المؤقت"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Free Educational Banner */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              ✨
            </span>
            <div>
              <span className="font-extrabold block text-emerald-900">
                جميع الحلول النموذجية وسلالم التنقيط مجانية 100% ومتاحة بالكامل
              </span>
              <span className="text-emerald-700 text-[11px]">
                تدرّب بمرونة، تحقق من خطوات الحل، واكسب نقاط الخبرة!
              </span>
            </div>
          </div>
          <Badge variant="success">نسخة مجانية ومفتوحة 🎓</Badge>
        </div>

        {/* Official Paper Layout */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Paper Header */}
          <div className="border-b border-[var(--app-card-border)] pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                  الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية
                </span>
                <span className="text-xs font-bold text-[var(--brand-blue)] bg-[var(--brand-blue)]/10 px-2.5 py-0.5 rounded-full">
                  {selectedExam.year}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {t(GRADE_TITLE_KEY[selectedExam.grade])}
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {getExamKind(selectedExam) === 'devoir'
                    ? t('devoirBadge')
                    : getExamKind(selectedExam) === 'bep'
                      ? t('bepBadge')
                      : t('compositionBadge')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[var(--app-text)] tracking-tight font-sans">
                {renderArabicText(selectedExam.titleAr)}
              </h1>
              {selectedExam.sourceNoteAr && (
                <p className="text-xs text-[var(--app-text-muted)] max-w-2xl">{selectedExam.sourceNoteAr}</p>
              )}
              {(() => {
                const linkedLessonIds = [
                  ...new Set(
                    [
                      ...(selectedExam.relatedLessonIds || []),
                      ...selectedExam.exercises.map((ex) => ex.relatedLessonId),
                      selectedExam.problemExercise.relatedLessonId,
                    ].filter((id): id is string => Boolean(id))
                  ),
                ];
                if (linkedLessonIds.length === 0) return null;
                return (
                  <div className="pt-1 space-y-1">
                    <p className="text-[11px] font-black text-[var(--app-text)]">{t('relatedLessonsTitle')}</p>
                    <ul className="text-[11px] text-[var(--app-text-muted)] font-bold space-y-0.5">
                      {linkedLessonIds.map((id) => {
                        const lesson = COURSES_DATA.find((item) => item.id === id);
                        return <li key={id}>{lesson ? lesson.titleAr : id}</li>;
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>

            <div className="bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)] text-xs font-bold text-[var(--app-text-muted)] space-y-1 text-right shrink-0">
              <div>المادة: <span className="text-[var(--app-text)] font-extrabold">{subjectInfo?.nameAr}</span></div>
              <div>المدة المحددة: <span className="text-[var(--app-text)] font-extrabold" dir="ltr">{selectedExam.durationMinutes}</span> دقيقة</div>
              <div>المجموع الكلي: <span className="text-[var(--brand-amber-dark)] font-extrabold" dir="ltr">{selectedExam.totalPoints}</span> نقاط</div>
            </div>
          </div>

          {/* Part 1: Independent Exercises */}
          <div className="space-y-5">
            <div className="flex items-center justify-between bg-[var(--app-card-subtle)] px-4 py-2.5 rounded-xl border border-[var(--app-card-border)]">
              <h2 className="font-black text-xs sm:text-sm text-[var(--app-text)]">
                الجزء الأول: {selectedExam.exercises.length} تمارين مستقلة ({exercisesPoints} نقاط)
              </h2>
              <span className="text-[11px] text-[var(--app-text-muted)] font-bold">سلالم التنقيط الرسمية</span>
            </div>

            {selectedExam.exercises.map((ex, idx) => {
              const solKey = `ex-${idx}`;
              const isSolVisible = showSolutions[solKey];

              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-black text-sm text-[var(--brand-blue-dark)]">{ex.titleAr}</h3>
                    <Badge variant="xp">{ex.points} نقاط</Badge>
                  </div>

                  {/* Exercise Subject Text */}
                  <div className="text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed whitespace-pre-line bg-[var(--app-card-bg)] p-4 rounded-xl border border-[var(--app-card-border)] shadow-2xs">
                    {formatEducationalText(renderArabicText(ex.contentAr))}
                  </div>

                  {/* Free Solution Toggle Button */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleSolution(solKey)}
                      className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                        isSolVisible
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isSolVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>إخفاء الحل النموذجي</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>إظهار الحل النموذجي والتنقيط (مجاناً)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Solution Box */}
                  {isSolVisible && (
                    <div className="space-y-2">
                      <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line border border-slate-800 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mb-2 uppercase font-bold border-b border-slate-800 pb-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>الحل النموذجي المعتمد وسلّم التنقيط:</span>
                        </div>
                        {formatEducationalText(ex.solutionAr)}
                      </div>
                      <ReviseLessonButton
                        lessonId={ex.relatedLessonId}
                        label={t('reviseLessonCta')}
                        onOpenLesson={onOpenLesson}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Part 2: Integrated Situation (الوضعية الإدماجية) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between bg-amber-500/15 px-4 py-2.5 rounded-xl border border-amber-400/30">
              <h2 className="font-black text-xs sm:text-sm text-amber-950">
                الجزء الثاني: الوضعية الإدماجية المركبة ({selectedExam.problemExercise.points} نقاط)
              </h2>
              <span className="text-[11px] text-amber-900 font-bold">الإنتاج والحل المركب</span>
            </div>

            <div className="p-5 rounded-2xl border border-amber-300/40 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-sm text-amber-950">{selectedExam.problemExercise.titleAr}</h3>
                <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full">
                  {selectedExam.problemExercise.points} نقاط كاملة
                </span>
              </div>

              {/* Problem Statement */}
              <div className="text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed whitespace-pre-line bg-[var(--app-card-bg)] p-4 rounded-xl border border-amber-200/60 shadow-2xs">
                {formatEducationalText(renderArabicText(selectedExam.problemExercise.contentAr))}
              </div>

              {/* Problem Solution Toggle Button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleSolution('problem')}
                  className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    showSolutions['problem']
                      ? 'bg-amber-200 text-amber-950 border border-amber-400'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-xs'
                  }`}
                >
                  {showSolutions['problem'] ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>إخفاء حل الوضعية الإدماجية</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إظهار الحل الإدماجي المفصل وسلم التنقيط (مجاناً)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Problem Solution Content */}
              {showSolutions['problem'] && (
                <div className="space-y-2">
                  <div className="p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line border border-slate-800 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 mb-2 uppercase font-bold border-b border-slate-800 pb-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>سلم التنقيط والحل النموذجي للوضعية الإدماجية:</span>
                    </div>
                    {formatEducationalText(selectedExam.problemExercise.solutionAr)}
                  </div>
                  <ReviseLessonButton
                    lessonId={selectedExam.problemExercise.relatedLessonId}
                    label={t('reviseLessonCta')}
                    onOpenLesson={onOpenLesson}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Completion Button & Rewards */}
          <div className="pt-4 border-t border-[var(--app-card-border)]">
            {isCompleted ? (
              <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-sm font-black">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>أحسنت! لقد أتممت هذا الموضوع بنجاح وتم تسجيل تقدمك ✅</span>
              </div>
            ) : (
              <button
                onClick={() => onExamComplete?.(selectedExam.id)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-105 text-white text-sm font-black shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <Trophy className="w-5 h-5 text-amber-300" />
                <span>✅ أنهيت هذا الامتحان التجريبي (<span dir="ltr">+50 XP</span>)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW 1 & 2: Grade-driven View + Exam Cards =================
  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Hero Header with Active Grade Indicator */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('heroEyebrow', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-sans tracking-tight">
            {t('heroTitle', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentGrade === '1AP' ? t('grade1apEmptyDesc') : t('heroSubtitle')}
          </p>
        </div>
      </div>

      {currentGrade === '1AP' ? (
        <div className="space-y-4">
          <Card padding="none" className="p-8 text-center space-y-4 bg-[var(--app-card-bg)]">
            <GraduationCap className="w-10 h-10 mx-auto text-[var(--brand-blue)]" />
            <h2 className="text-base font-black text-[var(--app-text)]">{t('grade1apEmptyTitle')}</h2>
            <p className="text-xs text-[var(--app-text-muted)] leading-relaxed max-w-xl mx-auto">
              {t('grade1apEmptyDesc')}
            </p>
            {onOpenCourses && (
              <Button variant="info" onClick={onOpenCourses}>
                {t('grade1apOpenCourses')}
              </Button>
            )}
          </Card>
          <PrimaryAverageCalculator grade={currentGrade} />
        </div>
      ) : (
        <>
      {(() => {
        const kinds: ExamKind[] = currentGrade === '5AP' ? ['bep', 'composition', 'devoir'] : ['composition', 'devoir'];
        const meta: Record<ExamKind, { title: string; desc: string; active: string; idle: string }> = {
          bep: { title: t('kindBepTitle'), desc: t('kindBepDesc'), active: 'bg-blue-600 text-white border-blue-500', idle: 'hover:border-blue-400/50' },
          composition: { title: t('kindCompositionsTitle'), desc: t('kindCompositionsDesc'), active: 'bg-emerald-600 text-white border-emerald-500', idle: 'hover:border-emerald-400/50' },
          devoir: { title: t('kindDevoirsTitle'), desc: t('kindDevoirsDesc'), active: 'bg-amber-500 text-white border-amber-400', idle: 'hover:border-amber-400/50' },
        };
        return (
          <div className={`grid grid-cols-1 gap-3 ${kinds.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {kinds.map((kind) => {
              const selected = kindFilter === kind;
              const styles = meta[kind];
              return (
                <button
                  key={kind}
                  onClick={() => {
                    setKindFilter(kind);
                    setSelectedSubject(null);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border text-right transition-all cursor-pointer space-y-1 ${
                    selected ? `${styles.active} shadow-md scale-[1.01]` : `bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] ${styles.idle}`
                  }`}
                >
                  <h2 className="font-black text-sm sm:text-base">{styles.title}</h2>
                  <p className={`text-[10px] font-black ${selected ? 'text-white/90' : 'text-[var(--app-text-muted)]'}`}>
                    {t('examsCountLabel', {
                      count: OFFICIAL_EXAMS_DATA.filter((e) => e.grade === currentGrade && getExamKind(e) === kind).length,
                    })}
                  </p>
                  <p className={`text-xs leading-snug ${selected ? 'text-white/85' : 'text-[var(--app-text-muted)]'}`}>
                    {styles.desc}
                  </p>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* Step 1: Subject Selection Grid for Current Grade */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-black text-[var(--app-text)]">
            {selectedSubject ? t('changeSubjectLabel') : t('subjectsOfGrade', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
          </h2>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-xs text-[var(--brand-blue)] font-extrabold hover:underline cursor-pointer"
            >
              عرض جميع المواد
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableSubjects.map((subj) => {
            const count = filteredExams.filter((e) => e.subject === subj.id).length;
            const isChosen = selectedSubject === subj.id;

            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(isChosen ? null : subj.id)}
                className={`rounded-2xl p-4 min-h-24 text-white shadow-xs cursor-pointer bg-gradient-to-br ${subj.color} flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                  isChosen ? 'ring-4 ring-purple-400 scale-[1.03] shadow-md' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <span className="text-2xl leading-none">{SUBJECT_EMOJI[subj.id] || '📘'}</span>
                <span className="font-black text-xs leading-tight">{subj.nameAr}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {count} مواضيع
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Trimester Filter & Exam Cards List */}
      <div className="space-y-4 pt-1">
        {/* Trimester filter tabs for seasonal compositions */}
        {kindFilter !== 'bep' && (
          <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
            <button
              onClick={() => setSelectedTrimester('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                selectedTrimester === 'all'
                  ? 'bg-[var(--brand-blue)] text-white shadow-xs'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              جميع الفصول
            </button>
            {[1, 2, 3].map((trim) => (
              <button
                key={trim}
                onClick={() => setSelectedTrimester(trim as TrimesterTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                  selectedTrimester === trim
                    ? 'bg-[var(--brand-blue)] text-white shadow-xs'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                الفصل {trim === 1 ? 'الأول' : trim === 2 ? 'الثاني' : 'الثالث'}
              </button>
            ))}
          </div>
        )}

        {/* Exam Cards Grid */}
        {displayedExams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedExams.map((exam) => {
              const isCompleted = completedExamIds.includes(exam.id);
              const subj = SUBJECTS_LIST.find((s) => s.id === exam.subject);

              return (
                <Card
                  key={exam.id}
                  interactive
                  padding="md"
                  onClick={() => openExam(exam)}
                  className="space-y-3 border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--brand-blue)] transition-all"
                >
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <Badge variant="info" icon={<FileText className="w-3 h-3" />}>
                      {exam.year}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                        {getExamKind(exam) === 'devoir'
                          ? t('devoirBadge')
                          : getExamKind(exam) === 'bep'
                            ? t('bepBadge')
                            : t('compositionBadge')}
                      </span>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        حلول مجانية ✨
                      </span>
                      {isCompleted && <Badge variant="success">✓ أنجزته</Badge>}
                    </div>
                  </div>

                  <h3 className="font-black text-sm leading-relaxed text-[var(--app-text)]">
                    {renderArabicText(exam.titleAr)}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)]">
                    <span>{subj?.nameAr}</span>
                    <span>{exam.sessionAr}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-muted)] pt-2 border-t border-[var(--app-card-border)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span dir="ltr">{exam.durationMinutes} دقيقة</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span dir="ltr">{exam.totalPoints} نقاط</span>
                    </span>
                  </div>

                  <Button variant="info" size="sm" fullWidth icon={<BookOpen className="w-4 h-4" />}>
                    فتح ورقة الامتحان
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card padding="none" className="p-10 text-center space-y-3 bg-[var(--app-card-bg)]">
            <FileText className="w-10 h-10 opacity-30 mx-auto text-[var(--app-text-muted)]" />
            <h3 className="text-sm font-extrabold text-[var(--app-text)]">{t('noExamsTitle')}</h3>
            <p className="text-xs text-[var(--app-text-muted)]">
              {t('noExamsDesc', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
            </p>
          </Card>
        )}
      </div>
          <PrimaryAverageCalculator grade={currentGrade} />
        </>
      )}
    </div>
  );
};
