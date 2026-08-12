import React, { useState, useEffect, useMemo } from 'react';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { AuthService } from '../services/authService';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { AuthUser } from '../types/auth';
import { SubjectId } from '../types';
import { Award, Clock, FileText, CheckCircle2, HelpCircle, ChevronLeft, Calendar, Lock, Sparkles, ShieldCheck, Trophy } from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';

interface ExamsViewerProps {
  tashkeelEnabled?: boolean;
  /** Exam ids the student has already self-reported as done (drives the "✅ أنهيت الامتحان" button state). */
  completedExamIds?: string[];
  /** Called once when the student marks the currently-open exam as completed — grants a flat XP bonus (no auto-grading exists yet). */
  onExamComplete?: (examId: string) => void;
}

export const ExamsViewer: React.FC<ExamsViewerProps> = ({ tashkeelEnabled = true, completedExamIds = [], onExamComplete }) => {
  const examSubjects = useMemo(() => {
    const ids = Array.from(new Set(OFFICIAL_EXAMS_DATA.map((e) => e.subject)));
    return ids.map((id) => SUBJECTS_LIST.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  }, []);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'all'>('all');
  const filteredExams = useMemo(
    () => (selectedSubjectFilter === 'all' ? OFFICIAL_EXAMS_DATA : OFFICIAL_EXAMS_DATA.filter((e) => e.subject === selectedSubjectFilter)),
    [selectedSubjectFilter]
  );
  const [selectedExamId, setSelectedExamId] = useState<string>(OFFICIAL_EXAMS_DATA[0].id);
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(5400); // 90 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Paywall state
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());

  const selectedExam = OFFICIAL_EXAMS_DATA.find((e) => e.id === selectedExamId) || OFFICIAL_EXAMS_DATA[0];
  const selectedExamSubjectNameAr = SUBJECTS_LIST.find((s) => s.id === selectedExam.subject)?.nameAr || selectedExam.subject;
  const exercisesPoints = selectedExam.exercises.reduce((sum, ex) => sum + ex.points, 0);
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

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Paywall Modal */}
      {isPaywallOpen && (
        <SubscriptionPaywall
          user={currentUser}
          onClose={() => setIsPaywallOpen(false)}
          onSuccessUpgrade={handleUserUpgraded}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-purple-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>الأرشيف الرسمي لشهادة التعليم الابتدائي (5AP)</span>
            <span className="text-amber-300 font-mono text-[11px] bg-slate-900/60 px-2 py-0.5 rounded-full border border-purple-500/30 mr-2">
              الدور الحالي: {currentUser?.role || 'ROLE_FREE'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-sans">
            مواضيع امتحانات الشهادة الرسمية مع الحلول النموذجية
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            تدرّب على المواضيع الرسمية الصادرة عن الديوان الوطني للامتحانات والمسابقات (2008–2018) مع تنقيط التمرين والوضعية الإدماجية.
          </p>
        </div>

        {/* Timer Control Badge */}
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

      {/* Role Notice & Upgrade Bar */}
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

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <span className="text-xs font-extrabold text-slate-500 px-2 shrink-0 flex items-center gap-1">
          <FileText className="w-4 h-4 text-purple-600" />
          <span>اختر المادة:</span>
        </span>
        <button
          onClick={() => {
            setSelectedSubjectFilter('all');
            setShowSolutions({});
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedSubjectFilter === 'all'
              ? 'bg-indigo-700 text-white shadow-xs font-extrabold scale-105'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          الكل
        </button>
        {examSubjects.map((subj) => (
          <button
            key={subj.id}
            onClick={() => {
              setSelectedSubjectFilter(subj.id);
              const firstMatch = OFFICIAL_EXAMS_DATA.find((e) => e.subject === subj.id);
              if (firstMatch) setSelectedExamId(firstMatch.id);
              setShowSolutions({});
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedSubjectFilter === subj.id
                ? 'bg-indigo-700 text-white shadow-xs font-extrabold scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {subj.nameAr}
          </button>
        ))}
      </div>

      {/* Session/Trimester Selector Pills */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <span className="text-xs font-extrabold text-slate-500 px-2 shrink-0 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>اختر الدورة:</span>
        </span>
        {filteredExams.map((exam) => {
          const isSelected = exam.id === selectedExamId;
          return (
            <button
              key={exam.id}
              onClick={() => { setSelectedExamId(exam.id); setShowSolutions({}); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-purple-700 text-white shadow-xs font-extrabold scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {exam.sessionAr}
            </button>
          );
        })}
      </div>

      {/* Main Paper Display Box */}
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
            <div>المادة: {selectedExamSubjectNameAr}</div>
            <div>المدة: <span dir="ltr">{selectedExam.durationMinutes}</span> دقيقة</div>
          </div>
        </div>

        {/* Exercises List */}
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

          {/* Problem Solving / الوضعية الإدماجية */}
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

          {/* Self-reported completion — no auto-grading exists yet, so this is a declarative "I finished this paper" action. */}
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
};
