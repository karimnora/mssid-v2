import React, { useState, useEffect, useMemo } from 'react';
import { useActivityExitGuard } from '../context/ActivityExitContext';
import { motion } from 'motion/react';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { CourseLesson, ExamKind, PrimaryGrade, SubjectId, OfficialExam } from '../types';
import { Card, Badge, Button } from './ui';
import { ReportErrorButton } from './ReportErrorButton';
import { getExamKind, examUsesTrimester, preferredExamKind, examKindOrder, examKindBadgeKey } from '../utils/examKind';
import { printDocument } from '../utils/printDocument';
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
  RotateCcw,
  Play,
  Pause,
  Printer,
  Check,
} from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, speechLangForSubject, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { VoiceUnavailableBanner } from './VoiceUnavailableBanner';

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
  /** Opens the contact form pre-filled to report an error on the exam's corrigé — see
   * CLAUDE.md's content-credibility concern: a wrong solution here costs the app trust with
   * parents/teachers more than almost anything else in the app. */
  onReportError?: (contextLabel: string) => void;
  /** Open this paper directly (plan « avant la composition » in the parent notebook). */
  initialExamId?: string;
  onInitialExamOpened?: () => void;
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
  allCourseLessons: CourseLesson[];
}> = ({ lessonId, label, onOpenLesson, allCourseLessons }) => {
  if (!lessonId || !onOpenLesson) return null;
  const lesson = allCourseLessons.find((item) => item.id === lessonId);
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
  onReportError,
  initialExamId,
  onInitialExamOpened,
}) => {
  const t = useTranslation('exams');
  const currentGrade: PrimaryGrade = (grade as PrimaryGrade) || '5AP';
  const isYoungExam = currentGrade === '1AP' || currentGrade === '2AP';
  /** Solutions + timer : 4AP/5AP. Impression du sujet : tous les niveaux qui ont des examens. */
  const showExamTools = currentGrade === '4AP' || currentGrade === '5AP';
  const showPrintButton = currentGrade !== '1AP';
  const showAudio = currentGrade === '1AP' || currentGrade === '2AP' || currentGrade === '3AP';
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
    void speakText(text, /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : speechLangForSubject(selectedSubject ?? 'arabic'), 0.85).then(() => {
      setSpeakingKey((prev) => (prev === key ? null : prev));
    });
  };

  const [kindFilter, setKindFilter] = useState<KindFilter>(preferredExamKind(grade));
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<TrimesterTab>('all');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  // Dynamic import: only needed for the "related lessons" links on a solution — not for viewing
  // the exam itself — so it shouldn't force the full ~4.6 MB lesson catalog into the exams bundle.
  const [allCourseLessons, setAllCourseLessons] = useState<CourseLesson[]>([]);
  useEffect(() => {
    let cancelled = false;
    import('../data/coursesData').then((m) => {
      if (!cancelled) setAllCourseLessons(m.COURSES_DATA);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically reset internal filters when user switches grade in the top navbar
  useEffect(() => {
    setSelectedSubject(null);
    setSelectedExamId(null);
    setSelectedTrimester('all');
    const preferred = preferredExamKind(grade);
    const hasPreferred = OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade && getExamKind(e) === preferred);
    if (hasPreferred) {
      setKindFilter(preferred);
      return;
    }
    const first = OFFICIAL_EXAMS_DATA.find((e) => e.grade === grade);
    if (first) setKindFilter(getExamKind(first));
  }, [grade]);

  // Declared after the grade reset so that a paper opened from the revision plan wins on mount.
  useEffect(() => {
    if (!initialExamId) return;
    const exam = OFFICIAL_EXAMS_DATA.find((e) => e.id === initialExamId);
    if (exam) {
      setSelectedSubject(exam.subject);
      setSelectedExamId(exam.id);
    }
    onInitialExamOpened?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialExamId]);

  const gradeExams = useMemo(
    () => OFFICIAL_EXAMS_DATA.filter((e) => e.grade === currentGrade),
    [currentGrade]
  );
  const completedCount = gradeExams.filter((e) => completedExamIds.includes(e.id)).length;

  const filteredExams = useMemo(() => {
    return gradeExams.filter((e) => getExamKind(e) === kindFilter);
  }, [gradeExams, kindFilter]);

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
    if (examUsesTrimester(kindFilter) && selectedTrimester !== 'all') {
      return subjectExams.filter((e) => e.trimester === selectedTrimester);
    }
    return subjectExams;
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
  const requestLeave = useActivityExitGuard(Boolean(selectedExam) && (isTimerRunning || timerSeconds < 5400) && !completedExamIds.includes(selectedExamId ?? ''));
  const [printMode, setPrintMode] = useState<'subject' | 'corrige'>('subject');

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

  useEffect(() => {
    const resetPrintMode = () => setPrintMode('subject');
    window.addEventListener('afterprint', resetPrintMode);
    return () => window.removeEventListener('afterprint', resetPrintMode);
  }, []);

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

  const handlePrint = (mode: 'subject' | 'corrige' = 'subject') => {
    setPrintMode(mode);
    window.setTimeout(() => { void printDocument('Mssid DZ — امتحان'); }, 50);
  };

  // ================= VIEW 3: Detailed Exam Sheet & Free Solutions =================
  if (selectedExam) {
    const exercisesPoints = selectedExam.exercises.reduce((sum, ex) => sum + ex.points, 0);
    const isCompleted = completedExamIds.includes(selectedExam.id);
    const subjectInfo = SUBJECTS_LIST.find((s) => s.id === selectedExam.subject);

    return (
      <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
        <VoiceUnavailableBanner visible={showAudio && voiceAvailable === false} />
        {/* Top Controls & Navigation Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl shadow-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => requestLeave(() => setSelectedExamId(null))}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            {t('backToExamsOf', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            {showExamTools && (
              <>
            {/* Global Solutions Toggle */}
            <button
              onClick={toggleAllSolutions}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                allSolutionsVisible
                  ? 'bg-sky-100 text-sky-950 border border-sky-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {allSolutionsVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{allSolutionsVisible ? 'إخفاء كافة الحلول' : 'إظهار كافة الحلول مجاناً ✨'}</span>
            </button>
              </>
            )}

            {showPrintButton && (
            <>
            <button
              onClick={() => handlePrint('subject')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-[var(--app-card-border)] transition-colors cursor-pointer border border-[var(--app-card-border)] no-print min-h-12"
              title={t('printExamTitle')}
              data-exam-print="true"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('printSubject')}</span>
            </button>
            <button
              onClick={() => handlePrint('corrige')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 no-print min-h-12"
              title={t('printCorrigeTitle')}
              data-exam-print-corrige="true"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('printCorrige')}</span>
            </button>
            </>
            )}

            {showExamTools && (
              <>
            {/* Exam Simulation Timer */}
            <div className="bg-[var(--app-card-subtle)] text-[var(--app-text)] px-3 py-1.5 rounded-xl flex items-center gap-2.5 border-2 border-[var(--app-card-border)]">
              <Clock className="w-4 h-4 text-[var(--brand-amber)]" />
              <span className="font-mono font-black text-sm exam-timer-value">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`min-w-8 min-h-8 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isTimerRunning ? 'bg-[var(--brand-coral)] text-white' : 'bg-[var(--brand-emerald)] text-white'
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
              </>
            )}
          </div>
        </div>

        {/* Free Educational Banner */}
        {showExamTools && (
        <div data-exam-banner className="p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              ✨
            </span>
            <div>
              <span className="font-extrabold block exam-emerald-banner text-emerald-900">
                جميع الحلول النموذجية وسلالم التنقيط مجانية 100% ومتاحة بالكامل
              </span>
              <span className="exam-emerald-banner-sub text-emerald-700 text-[11px]">
                تدرّب بمرونة، تحقق من خطوات الحل، واكسب نقاط الخبرة!
              </span>
            </div>
          </div>
          <Badge variant="success">نسخة مجانية ومفتوحة 🎓</Badge>
        </div>
        )}

        {/* Official Paper Layout — must use .printable-sheet or @media print hides everything */}
        <div
          className="printable-sheet bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-[var(--app-text)]"
          data-print-mode={printMode}
        >
          <div
            className="print-identity grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold border border-[var(--app-card-border)] rounded-xl p-3 bg-white text-slate-900"
            data-exam-print-identity="true"
          >
            <div>
              {t('printLastName')} <span className="inline-block min-w-20 border-b border-slate-400">........</span>
            </div>
            <div>
              {t('printFirstName')} <span className="inline-block min-w-20 border-b border-slate-400">........</span>
            </div>
            <div>
              {t('printClass')} <span className="inline-block min-w-16 border-b border-slate-400">........</span>
            </div>
            <div>
              {t('printNumber')} <span className="inline-block min-w-12 border-b border-slate-400">........</span>
            </div>
          </div>
          {/* Paper Header */}
          <div className="border-b border-[var(--app-card-border)] pb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[var(--brand-blue-dark)] bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
                  منصة مَسِيد DZ — محتوى متوافق مع منهاج الجيل الثاني الرسمي
                </span>
                <span className="text-xs font-bold text-[var(--brand-blue)] bg-[var(--brand-blue)]/10 px-2.5 py-0.5 rounded-full">
                  {selectedExam.year}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {t(GRADE_TITLE_KEY[selectedExam.grade])}
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {t(examKindBadgeKey(getExamKind(selectedExam)))}
                </span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                {showAudio && (
                  <span className="no-print">
                    <TapSpeakButton
                      snippetKey="exam-title"
                      text={renderArabicText(selectedExam.titleAr)}
                      speakingKey={speakingKey}
                      onSpeak={handleSpeak}
                      size="lg"
                    />
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl font-black text-[var(--app-text)] tracking-tight font-sans">
                  {renderArabicText(selectedExam.titleAr)}
                </h1>
              </div>
              {selectedExam.sourceNoteAr && (
                <p className="text-xs text-[var(--app-text-muted)] max-w-2xl no-print">{selectedExam.sourceNoteAr}</p>
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
                  <div className="pt-1 space-y-1 no-print">
                    <p className="text-[11px] font-black text-[var(--app-text)]">{t('relatedLessonsTitle')}</p>
                    <ul className="text-[11px] text-[var(--app-text-muted)] font-bold space-y-0.5">
                      {linkedLessonIds.map((id) => {
                        const lesson = allCourseLessons.find((item) => item.id === id);
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
                  data-exam-exercise="true"
                  className="p-4 sm:p-5 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {showAudio && (
                        <span className="no-print">
                          <TapSpeakButton
                            snippetKey={`ex-${idx}-title`}
                            text={renderArabicText(ex.titleAr)}
                            speakingKey={speakingKey}
                            onSpeak={handleSpeak}
                          />
                        </span>
                      )}
                      <h3 className="font-black text-sm text-[var(--brand-blue-dark)]">{ex.titleAr}</h3>
                    </div>
                    <Badge variant="xp">{ex.points} نقاط</Badge>
                  </div>

                  {/* Exercise Subject Text */}
                  <div className="flex items-start gap-2 min-w-0">
                    {showAudio && (
                      <span className="no-print shrink-0">
                        <TapSpeakButton
                          snippetKey={`ex-${idx}-body`}
                          text={renderArabicText(ex.contentAr)}
                          speakingKey={speakingKey}
                          onSpeak={handleSpeak}
                        />
                      </span>
                    )}
                    <div className="flex-1 text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed whitespace-pre-line bg-[var(--app-card-bg)] p-4 rounded-xl border border-[var(--app-card-border)] shadow-2xs">
                      {formatEducationalText(renderArabicText(ex.contentAr))}
                    </div>
                  </div>

                  {showExamTools && (
                    <div className="flex items-center justify-between pt-1 no-print">
                      <button
                        onClick={() => toggleSolution(solKey)}
                        className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                          isSolVisible
                            ? 'bg-sky-100 text-sky-950 border border-sky-300'
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
                  )}

                  <div className="print-answer-lines" aria-hidden="true">
                    <div className="print-answer-line" />
                    <div className="print-answer-line" />
                    <div className="print-answer-line" />
                    <div className="print-answer-line" />
                  </div>

                  <div className={`print-corrige ${isSolVisible && showExamTools ? '' : 'print-corrige--screen-hidden'}`}>
                    {selectedExam.subject === 'math' && ex.operationsAr ? (
                      <div
                        className="print-corrige-box grid grid-cols-1 min-[480px]:grid-cols-2 print:grid-cols-2 gap-2 p-3 rounded-xl bg-white text-[var(--kids-ink)] text-sm font-sans border-2 border-[#E7E2D7]"
                        style={{ direction: 'ltr' }}
                        data-exam-two-col="true"
                      >
                        <div className="border-2 border-[#E7E2D7] rounded-xl p-3 space-y-1" dir="rtl">
                          <p className="text-[11px] font-extrabold text-[var(--brand-emerald)]">الحل</p>
                          <div className="whitespace-pre-line leading-relaxed">
                            {formatEducationalText(ex.solutionAr)}
                          </div>
                        </div>
                        <div className="border-2 border-[#E7E2D7] rounded-xl p-3 space-y-1" dir="rtl">
                          <p className="text-[11px] font-extrabold text-[var(--brand-blue)]">العمليات</p>
                          <div className="whitespace-pre-line leading-relaxed font-mono" dir="ltr">
                            {formatEducationalText(ex.operationsAr)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // No operationsAr authored for this exercise yet (see CLAUDE.md's two-column
                      // mandate — most math exercises are still missing this field, tracked as a
                      // content-authoring backlog) — degrade to the same single-column solution box
                      // used for non-math subjects, instead of showing an empty "—" operations panel.
                    <div className="print-corrige-box p-4 rounded-xl bg-white text-[var(--kids-ink)] text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line border-2 border-[#E7E2D7]">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[var(--brand-emerald)] mb-2 border-b border-[#E7E2D7] pb-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>الحل النموذجي المعتمد وسلّم التنقيط:</span>
                      </div>
                      {formatEducationalText(ex.solutionAr)}
                    </div>
                    )}
                  </div>
                  {showExamTools && isSolVisible && (
                    <div className="no-print flex items-center justify-between flex-wrap gap-2">
                      <ReviseLessonButton
                        lessonId={ex.relatedLessonId}
                        label={t('reviseLessonCta')}
                        onOpenLesson={onOpenLesson}
                        allCourseLessons={allCourseLessons}
                      />
                      {onReportError && (
                        <ReportErrorButton
                          contextLabel={`${selectedExam.titleAr} — ${ex.titleAr}`}
                          onReport={onReportError}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Part 2: Integrated Situation (الوضعية الإدماجية) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between bg-amber-500/15 px-4 py-2.5 rounded-xl border border-amber-400/30">
              <h2 className="font-black text-xs sm:text-sm exam-amber-banner text-amber-950">
                الجزء الثاني: الوضعية الإدماجية المركبة ({selectedExam.problemExercise.points} نقاط)
              </h2>
              <span className="text-[11px] exam-amber-banner-sub text-amber-900 font-bold">الإنتاج والحل المركب</span>
            </div>

            <div data-exam-exercise="true" className="p-5 rounded-2xl border border-amber-300/40 bg-amber-500/5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {showAudio && (
                    <span className="no-print">
                      <TapSpeakButton
                        snippetKey="problem-title"
                        text={renderArabicText(selectedExam.problemExercise.titleAr)}
                        speakingKey={speakingKey}
                        onSpeak={handleSpeak}
                      />
                    </span>
                  )}
                  <h3 className="font-black text-sm exam-amber-banner text-amber-950">{selectedExam.problemExercise.titleAr}</h3>
                </div>
                <span className="text-xs font-black bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full">
                  {selectedExam.problemExercise.points} نقاط كاملة
                </span>
              </div>

              {/* Problem Statement */}
              <div className="flex items-start gap-2 min-w-0">
                {showAudio && (
                  <span className="no-print shrink-0">
                    <TapSpeakButton
                      snippetKey="problem-body"
                      text={renderArabicText(selectedExam.problemExercise.contentAr)}
                      speakingKey={speakingKey}
                      onSpeak={handleSpeak}
                    />
                  </span>
                )}
                <div className="flex-1 text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed whitespace-pre-line bg-[var(--app-card-bg)] p-4 rounded-xl border border-amber-200/60 shadow-2xs">
                  {formatEducationalText(renderArabicText(selectedExam.problemExercise.contentAr))}
                </div>
              </div>

              {showExamTools && (
                <div className="flex items-center justify-between pt-1 no-print">
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
              )}

              <div className="print-answer-lines" aria-hidden="true">
                <div className="print-answer-line" />
                <div className="print-answer-line" />
                <div className="print-answer-line" />
                <div className="print-answer-line" />
                <div className="print-answer-line" />
                <div className="print-answer-line" />
              </div>

              <div className={`print-corrige ${showSolutions['problem'] && showExamTools ? '' : 'print-corrige--screen-hidden'}`}>
                <div className="print-corrige-box p-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line border border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 mb-2 uppercase font-bold border-b border-slate-800 pb-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>سلم التنقيط والحل النموذجي للوضعية الإدماجية:</span>
                  </div>
                  {formatEducationalText(selectedExam.problemExercise.solutionAr)}
                </div>
              </div>
              {showExamTools && showSolutions['problem'] && (
                <div className="no-print flex items-center justify-between flex-wrap gap-2">
                  <ReviseLessonButton
                    lessonId={selectedExam.problemExercise.relatedLessonId}
                    label={t('reviseLessonCta')}
                    onOpenLesson={onOpenLesson}
                    allCourseLessons={allCourseLessons}
                  />
                  {onReportError && (
                    <ReportErrorButton
                      contextLabel={`${selectedExam.titleAr} — ${selectedExam.problemExercise.titleAr}`}
                      onReport={onReportError}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Completion Button & Rewards */}
          <div className="pt-4 border-t border-[var(--app-card-border)] no-print">
            {isCompleted ? (
              <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 exam-emerald-banner text-emerald-800 text-sm font-black">
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
      <VoiceUnavailableBanner visible={showAudio && voiceAvailable === false} />
      {/* Hero Header with Active Grade Indicator */}
      {/* Plain hex linear-gradient via inline style, not Tailwind's gradient utilities: Tailwind v4
          compiles its palette (and gradient color-interpolation) through oklch(), which silently
          fails to paint on older Android WebViews (remonte utilisateur : fond absent, texte blanc
          illisible sur fond clair, seule cette carte etait touchee car c'est la seule qui n'utilise
          pas les variables de couleur du projet, deja en hexadecimal, contrairement aux autres cartes). */}
      <div
        className="text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-800/40 relative overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(to right, #1e3a8a, #1e1b4b, #0f172a)' }}
      >
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('heroEyebrow', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            {showAudio && (
              <TapSpeakButton
                snippetKey="hero-title"
                text={t('heroTitle', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
                size="lg"
              />
            )}
            <h1 className="text-xl sm:text-3xl font-black font-sans tracking-tight">
              {t('heroTitle', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
            </h1>
          </div>
          <div className="flex items-start gap-2 min-w-0">
            {showAudio && (
              <TapSpeakButton
                snippetKey="hero-sub"
                text={t('heroSubtitle')}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>
          {gradeExams.length > 0 && (
            <p className="text-xs font-black text-emerald-200 pt-1">
              {t('doneOfTotal', { done: completedCount, total: gradeExams.length })}
            </p>
          )}
        </div>
      </div>

      {gradeExams.length === 0 ? (
        <div
          className="rounded-3xl p-8 sm:p-10 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] text-center space-y-4"
          data-exam-layout="empty"
        >
          <FileText className="w-12 h-12 mx-auto text-[var(--app-text-muted)] opacity-40" />
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {showAudio && (
              <TapSpeakButton
                snippetKey="empty-title"
                text={t('grade1apEmptyTitle')}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <h2 className="text-lg font-black text-[var(--app-text)]">{t('grade1apEmptyTitle')}</h2>
          </div>
          <div className="flex items-start justify-center gap-2 max-w-md mx-auto">
            {showAudio && (
              <TapSpeakButton
                snippetKey="empty-desc"
                text={t('grade1apEmptyDesc')}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <p className="text-sm text-[var(--app-text-muted)] font-bold leading-relaxed">
              {t('grade1apEmptyDesc')}
            </p>
          </div>
          {onOpenCourses && (
            <motion.button
              type="button"
              data-primary-cta="open-courses"
              onClick={onOpenCourses}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-8 py-3.5 rounded-3xl shadow-md cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              {t('grade1apOpenCourses')}
            </motion.button>
          )}
        </div>
      ) : (
        <>
      {!isYoungExam && (() => {
        const kinds = examKindOrder(currentGrade).filter((kind) =>
          gradeExams.some((e) => getExamKind(e) === kind)
        );
        const meta: Record<ExamKind, { title: string; active: string; idle: string }> = {
          acquis: { title: t('kindAcquisTitle'), active: 'bg-teal-700 text-white border-teal-500', idle: 'hover:border-teal-400/50' },
          bep: { title: t('kindBepTitle'), active: 'bg-blue-600 text-white border-blue-500', idle: 'hover:border-blue-400/50' },
          composition: { title: t('kindCompositionsTitle'), active: 'bg-emerald-700 text-white border-emerald-400', idle: 'hover:border-emerald-400/50' },
          devoir: { title: t('kindDevoirsTitle'), active: 'bg-amber-700 text-white border-amber-400', idle: 'hover:border-amber-400/50' },
        };
        const cols =
          kinds.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : kinds.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
        return (
          <div className={`grid grid-cols-1 gap-3 ${cols}`}>
            {kinds.map((kind) => {
              const selected = kindFilter === kind;
              const styles = meta[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  data-exam-kind={kind}
                  onClick={() => {
                    setKindFilter(kind);
                    setSelectedSubject(null);
                    if (!examUsesTrimester(kind)) setSelectedTrimester('all');
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border text-right transition-all cursor-pointer space-y-1 min-h-[48px] ${
                    selected ? `${styles.active} shadow-md scale-[1.01]` : `bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] ${styles.idle}`
                  }`}
                >
                  <h2 className="font-black text-sm sm:text-base">{styles.title}</h2>
                  <p className={`text-[10px] font-black ${selected ? 'text-white' : 'text-[var(--app-text-muted)]'}`}>
                    {t('examsCountLabel', {
                      count: OFFICIAL_EXAMS_DATA.filter((e) => e.grade === currentGrade && getExamKind(e) === kind).length,
                    })}
                  </p>
                </button>
              );
            })}
          </div>
        );
      })()}

      {!isYoungExam && (
      <p
        data-exam-filter-trail
        className="text-xs font-bold text-[var(--app-text-muted)] px-1"
      >
        {t('filterTrail', {
          gradeTitle: t(GRADE_TITLE_KEY[currentGrade]),
          kind: t(examKindBadgeKey(kindFilter)),
          subject: selectedSubject
            ? (SUBJECTS_LIST.find((s) => s.id === selectedSubject)?.nameAr ?? t('allSubjectsShort'))
            : t('allSubjectsShort'),
          trimester: examUsesTrimester(kindFilter)
            ? selectedTrimester === 'all'
              ? t('allTrimesters')
              : t(`trimesterOrdinal${selectedTrimester}` as 'trimesterOrdinal1' | 'trimesterOrdinal2' | 'trimesterOrdinal3')
            : t('endOfCycleShort'),
        })}
      </p>
      )}

      {/* Step 1: Subject Selection Grid for Current Grade */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showAudio && (
              <TapSpeakButton
                snippetKey="subjects-heading"
                text={selectedSubject ? t('changeSubjectLabel') : t('subjectsOfGrade', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <h2 className="text-sm sm:text-base font-black text-[var(--app-text)]">
              {selectedSubject ? t('changeSubjectLabel') : t('subjectsOfGrade', { gradeTitle: t(GRADE_TITLE_KEY[currentGrade]) })}
            </h2>
          </div>
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
              <div key={subj.id} className="relative">
                {showAudio && (
                  <div className="absolute top-1 start-1 z-10">
                    <TapSpeakButton
                      snippetKey={`subj-${subj.id}`}
                      text={subj.nameAr}
                      speakingKey={speakingKey}
                      onSpeak={handleSpeak}
                    />
                  </div>
                )}
                <button
                  data-exam-subject={subj.id}
                  onClick={() => setSelectedSubject(isChosen ? null : subj.id)}
                  className={`w-full rounded-2xl p-4 min-h-24 text-white shadow-xs cursor-pointer bg-gradient-to-br ${subj.color} flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    isChosen ? 'ring-4 ring-[var(--brand-blue)] scale-[1.03] shadow-md' : 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <span className="text-2xl leading-none">{SUBJECT_EMOJI[subj.id] || '📘'}</span>
                  <span className="font-black text-xs leading-tight">{subj.nameAr}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {count} مواضيع
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Trimester Filter & Exam Cards List */}
      <div className="space-y-4 pt-1" data-exam-layout="grid">
        {/* Trimester filter tabs for seasonal compositions */}
        {!isYoungExam && examUsesTrimester(kindFilter) && (
          <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
            <button
              type="button"
              data-exam-trimester="all"
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
                type="button"
                data-exam-trimester={trim}
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
                        {t(examKindBadgeKey(getExamKind(exam)))}
                      </span>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        حلول مجانية ✨
                      </span>
                      {isCompleted && <Badge variant="success">✓ أنجزته</Badge>}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 min-w-0">
                    {showAudio && (
                      <TapSpeakButton
                        snippetKey={`card-${exam.id}`}
                        text={renderArabicText(exam.titleAr)}
                        speakingKey={speakingKey}
                        onSpeak={handleSpeak}
                      />
                    )}
                    <h3 className="flex-1 font-black text-sm leading-relaxed text-[var(--app-text)]">
                      {renderArabicText(exam.titleAr)}
                    </h3>
                  </div>

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
        </>
      )}
    </div>
  );
};
