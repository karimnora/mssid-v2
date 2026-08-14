import React, { useState, useEffect, useMemo } from 'react';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { AuthService } from '../services/authService';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { AuthUser } from '../types/auth';
import { PrimaryGrade, SubjectId } from '../types';
import { Card, Badge, Button } from './ui';
import {
  Award, Clock, FileText, CheckCircle2, ChevronLeft, Calendar, Lock, Sparkles, Trophy,
  BookOpen, Archive, Star,
} from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';

interface ExamsViewerProps {
  /** Scopes the subject grid + exam pool to the currently selected grade. Omit to browse all grades. */
  grade?: PrimaryGrade;
  tashkeelEnabled?: boolean;
  /** Exam ids the student has already self-reported as done (drives the "✅ أنهيت الامتحان" button state). */
  completedExamIds?: string[];
  /** Called once when the student marks the currently-open exam as completed — grants a flat XP bonus (no auto-grading exists yet). */
  onExamComplete?: (examId: string) => void;
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

type TrimesterTab = 1 | 2 | 3 | 'archive';

const TRIMESTER_TAB_LABEL: Record<TrimesterTab, string> = {
  1: 'الفصل الأول',
  2: 'الفصل الثاني',
  3: 'الفصل الثالث',
  archive: 'الأرشيف الرسمي',
};

// Same "current trimester" heuristic as CourseSelectionView (Algerian school year ≈ Sept-Dec /
// Jan-Mar / Apr-Jun) — kept as a local copy since the two components aren't meant to share state.
function getDefaultTrimester(): 1 | 2 | 3 {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 2;
  if (month >= 3 && month <= 5) return 3;
  return 1;
}

// Guided 3-step flow (Matière → Trimestre/Archive → Liste des sujets) matching CourseSelectionView's
// pattern, then a focused paper-view for the picked exam — replacing the old flat pill-filtered list.
export const ExamsViewer: React.FC<ExamsViewerProps> = ({ grade, tashkeelEnabled = true, completedExamIds = [], onExamComplete }) => {
  const gradeExams = useMemo(
    () => (grade ? OFFICIAL_EXAMS_DATA.filter((e) => e.grade === grade) : OFFICIAL_EXAMS_DATA),
    [grade]
  );

  const availableSubjects = useMemo(() => {
    const ids = Array.from(new Set(gradeExams.map((e) => e.subject)));
    return ids.map((id) => SUBJECTS_LIST.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  }, [gradeExams]);

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [selectedTab, setSelectedTab] = useState<TrimesterTab>(() => getDefaultTrimester());
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Changing grade restarts the whole flow — a subject/exam picked for 5AP may not exist for 2AP.
  useEffect(() => {
    setSelectedSubject(null);
    setSelectedExamId(null);
  }, [grade]);

  const subjectExams = useMemo(
    () => (selectedSubject ? gradeExams.filter((e) => e.subject === selectedSubject) : []),
    [gradeExams, selectedSubject]
  );
  const hasArchive = subjectExams.some((e) => e.trimester == null);

  // Picking a subject lands on the current trimester if it has papers, else the first trimester
  // that does, else the official archive — never an empty tab by default.
  useEffect(() => {
    if (!selectedSubject) return;
    setSelectedExamId(null);
    const def = getDefaultTrimester();
    if (subjectExams.some((e) => e.trimester === def)) {
      setSelectedTab(def);
      return;
    }
    const firstTagged = subjectExams.find((e) => e.trimester != null);
    setSelectedTab(firstTagged ? (firstTagged.trimester as 1 | 2 | 3) : 'archive');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject]);

  const tabExams = subjectExams.filter((e) => (selectedTab === 'archive' ? e.trimester == null : e.trimester === selectedTab));
  const selectedExam = selectedExamId ? OFFICIAL_EXAMS_DATA.find((e) => e.id === selectedExamId) : null;

  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(5400); // 90 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Paywall state
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());

  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const isUserPremiumOrAdmin = currentUser?.role === 'ROLE_PREMIUM' || currentUser?.role === 'ROLE_ADMIN';

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
    if (!isUserPremiumOrAdmin) {
      setIsPaywallOpen(true);
      return;
    }
    setShowSolutions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUserUpgraded = (upgradedUser: AuthUser) => {
    setCurrentUser(upgradedUser);
    setIsPaywallOpen(false);
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openExam = (examId: string) => {
    setSelectedExamId(examId);
    setShowSolutions({});
    setTimerSeconds(5400);
    setIsTimerRunning(false);
  };

  // ================= STEP 1 — Matière =================
  if (!selectedSubject) {
    return (
      <div className="space-y-6 dir-rtl" dir="rtl">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-purple-800/40">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>الأرشيف الرسمي لشهادة التعليم الابتدائي{grade ? ` — ${grade}` : ''}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-sans">اختر المادة لمراجعة مواضيع الامتحانات والاختبارات</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            مواضيع الديوان الوطني للامتحانات والمسابقات واختبارات الفصول الثلاثة، مع الحلول النموذجية والتنقيط.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSubjects.map((subj) => {
            const count = gradeExams.filter((e) => e.subject === subj.id).length;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`rounded-3xl p-5 sm:p-6 min-h-36 text-white shadow-md cursor-pointer bg-gradient-to-br ${subj.color} flex flex-col items-center justify-center gap-2 text-center transition-transform hover:scale-[1.03] active:scale-[0.97]`}
              >
                <span className="text-4xl sm:text-5xl leading-none">{SUBJECT_EMOJI[subj.id] || '📘'}</span>
                <span className="font-black text-xs sm:text-sm leading-tight">{subj.nameAr}</span>
                <Badge variant="neutral" className="!bg-white/15 !text-white !border-white/30">
                  <span dir="ltr">{count}</span> مواضيع
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const subjectInfo = SUBJECTS_LIST.find((s) => s.id === selectedSubject);

  // ================= STEP 3 — Paper view (once an exam card is picked) =================
  if (selectedExam) {
    const exercisesPoints = selectedExam.exercises.reduce((sum, ex) => sum + ex.points, 0);
    return (
      <div className="space-y-6 dir-rtl" dir="rtl">
        {isPaywallOpen && (
          <SubscriptionPaywall user={currentUser} onClose={() => setIsPaywallOpen(false)} onSuccessUpgrade={handleUserUpgraded} />
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedExamId(null)} icon={<ChevronLeft className="w-4 h-4" />}>
            رجوع لقائمة المواضيع
          </Button>
          <div className="bg-slate-900/90 border border-purple-500/40 p-3 rounded-2xl flex items-center gap-3 shrink-0 shadow-inner">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">مؤقت الامتحان التجريبي:</span>
              <span className="font-mono font-black text-amber-400 text-lg">{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isTimerRunning ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isTimerRunning ? 'إيقاف' : 'بدء المؤقت (90د)'}
            </button>
          </div>
        </div>

        {!isUserPremiumOrAdmin && (
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-extrabold text-amber-950 block">حسابك الحالي في الوضع المجاني (ROLE_FREE)</span>
                <span className="text-slate-600 text-[11px]">
                  تصفح الامتحانات والأسئلة مجاني للجميع. رؤية الحلول النموذجية والسلالم المنقطة تتطلب تفعيل اشتراك mssid dz عبر بريدي موب / CCP.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsPaywallOpen(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>تفعيل اشتراك mssid dz (بريدي موب)</span>
            </button>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                الجمهورية الجزائرية الديمقراطية الشعبية - وزارة التربية الوطنية
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-2 font-sans">{renderArabicText(selectedExam.titleAr)}</h2>
              {selectedExam.sourceNoteAr && (
                <p className="text-[11px] text-slate-500 mt-1.5 max-w-xl">{selectedExam.sourceNoteAr}</p>
              )}
            </div>
            <div className="text-left text-xs font-bold text-slate-500">
              <div>المادة: {subjectInfo?.nameAr}</div>
              <div>المدة: <span dir="ltr">{selectedExam.durationMinutes}</span> دقيقة</div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              الجزء الأول: {selectedExam.exercises.length} تمارين مستقلة ({exercisesPoints} نقاط)
            </h3>

            {selectedExam.exercises.map((ex, idx) => {
              const solKey = `ex-${idx}`;
              const isSolVisible = showSolutions[solKey];

              return (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-extrabold text-sm text-purple-950">{ex.titleAr}</h4>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {ex.points} نقاط
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-200">
                    {ex.contentAr}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleSolution(solKey)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        isUserPremiumOrAdmin
                          ? 'text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                          : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 font-extrabold'
                      }`}
                    >
                      {isUserPremiumOrAdmin ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isSolVisible ? 'إخفاء الحل النموذجي' : 'إظهار الحل النموذجي والتنقيط'}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>فتح الحل النموذجي (محتوى مدفوع)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isSolVisible && isUserPremiumOrAdmin && (
                    <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-sans leading-relaxed whitespace-pre-line border border-slate-800 animate-in fade-in duration-200">
                      <span className="text-[10px] font-mono text-emerald-400 block mb-1 uppercase font-bold">الحل النموذجي المعتمد:</span>
                      {formatEducationalText(ex.solutionAr)}
                    </div>
                  )}
                </div>
              );
            })}

            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 mt-6">
              الجزء الثاني: الوضعية الإدماجية ({selectedExam.problemExercise.points} نقاط)
            </h3>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-extrabold text-sm text-amber-950">{selectedExam.problemExercise.titleAr}</h4>
                <span className="text-xs font-extrabold bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full">
                  {selectedExam.problemExercise.points} نقاط كاملة
                </span>
              </div>

              <div className="text-xs text-slate-900 font-sans leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-amber-200">
                {formatEducationalText(renderArabicText(selectedExam.problemExercise.contentAr))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleSolution('problem')}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isUserPremiumOrAdmin
                      ? 'text-amber-900 hover:text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-300'
                      : 'text-amber-950 bg-amber-200 hover:bg-amber-300 border border-amber-400 font-extrabold'
                  }`}
                >
                  {isUserPremiumOrAdmin ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{showSolutions['problem'] ? 'إخفاء الحل المفصل' : 'إظهار الحل الإدماجي المفصل'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-800" />
                      <span>فتح حل الوضعية الإدماجية (محتوى مدفوع)</span>
                    </>
                  )}
                </button>
              </div>

              {showSolutions['problem'] && isUserPremiumOrAdmin && (
                <div className="p-4 rounded-xl bg-slate-900 text-white text-xs font-sans leading-relaxed whitespace-pre-line border border-slate-800 animate-in fade-in duration-200">
                  <span className="text-[10px] font-mono text-amber-400 block mb-1 uppercase font-bold">الحل النموذجي وسلم التنقيط للوضعية:</span>
                  {formatEducationalText(selectedExam.problemExercise.solutionAr)}
                </div>
              )}
            </div>

            <div className="pt-2">
              {completedExamIds.includes(selectedExam.id) ? (
                <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-extrabold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>أنجزت هذا الموضوع ✅</span>
                </div>
              ) : (
                <button
                  onClick={() => onExamComplete?.(selectedExam.id)}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Trophy className="w-4.5 h-4.5" />
                  <span>✅ أنهيت هذا الامتحان (<span dir="ltr">+50 XP</span>)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= STEP 2 — Trimestre/Archive tabs + exam card grid =================
  const tabs: TrimesterTab[] = hasArchive ? [1, 2, 3, 'archive'] : [1, 2, 3];

  return (
    <div className="space-y-5 dir-rtl" dir="rtl">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => setSelectedSubject(null)} icon={<ChevronLeft className="w-4 h-4" />}>
          المواد
        </Button>
        <span className="text-2xl">{SUBJECT_EMOJI[selectedSubject] || '📘'}</span>
        <h2 className="text-lg font-black text-[var(--app-text)]">{subjectInfo?.nameAr}</h2>
        {grade && <Badge variant="info">{grade}</Badge>}
      </div>

      <div className={`grid grid-cols-2 ${hasArchive ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-2.5`}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab;
          const count = subjectExams.filter((e) => (tab === 'archive' ? e.trimester == null : e.trimester === tab)).length;
          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`relative min-h-16 rounded-2xl font-black text-xs sm:text-sm px-2 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                isActive ? 'bg-[var(--brand-blue)] text-white shadow-lg' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {tab === 'archive' ? <Archive className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              <span>{TRIMESTER_TAB_LABEL[tab]}</span>
              <span className="text-[10px] opacity-80" dir="ltr">{count}</span>
            </button>
          );
        })}
      </div>

      {tabExams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tabExams.map((exam) => {
            const isCompleted = completedExamIds.includes(exam.id);
            return (
              <Card key={exam.id} interactive padding="md" onClick={() => openExam(exam.id)} className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <Badge variant="info" icon={<FileText className="w-3 h-3" />}>{exam.year}</Badge>
                  {isCompleted && <Badge variant="success">✓ مكتمل</Badge>}
                </div>
                <h3 className="font-black text-sm leading-relaxed">{renderArabicText(exam.titleAr)}</h3>
                <p className="text-xs text-[var(--app-text-muted)]">{exam.sessionAr}</p>
                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--app-text-muted)] pt-2 border-t border-[var(--app-card-border)]">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span dir="ltr">{exam.durationMinutes} د</span></span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /><span dir="ltr">{exam.totalPoints} ن</span></span>
                </div>
                <Button variant="info" size="sm" fullWidth icon={<BookOpen className="w-4 h-4" />}>
                  عرض الموضوع
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="none" className="p-10 text-center space-y-3">
          <FileText className="w-10 h-10 opacity-40 mx-auto text-[var(--app-text-muted)]" />
          <h3 className="text-sm font-extrabold text-[var(--app-text)]">لا توجد مواضيع بعد في هذا القسم</h3>
          <p className="text-xs text-[var(--app-text-muted)]">جرّب فصلاً دراسياً آخر لهذه المادة.</p>
        </Card>
      )}
    </div>
  );
};
