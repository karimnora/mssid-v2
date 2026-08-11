import React, { useState, useEffect } from 'react';
import { CourseLesson, PrimaryGrade, SubjectId } from '../types';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { SorobanInteractive } from './SorobanInteractive';
import { UnitConverter } from './UnitConverter';
import { GeometryVisualizer } from './GeometryVisualizer';
import { ScienceLabSimulation } from './ScienceLabSimulation';
import { ScientificInquiryFlow } from './ScientificInquiryFlow';
import { ArabicConjugator } from './ArabicConjugator';
import { MultiplicationTableInteractive } from './MultiplicationTableInteractive';
import { FrenchLanguageLab } from './FrenchLanguageLab';
import { EnglishLanguageLab } from './EnglishLanguageLab';
import { HistoryGeoInteractive } from './HistoryGeoInteractive';
import { IslamicEducationInteractive } from './IslamicEducationInteractive';
import { LessonExplanationView } from './LessonExplanationView';
import { ArabicCanvasInteractive } from './ArabicCanvasInteractive';
import { ScienceReactorInteractive } from './ScienceReactorInteractive';
import { PracticeExerciseCard } from './PracticeExerciseCard';
import { BookOpen, CheckCircle2, Trophy, ArrowRight, Lightbulb, Gamepad2, Sparkles, Eye, EyeOff, Glasses, Shuffle, RotateCcw, XCircle, Award, ChevronLeft, ChevronRight, Target, GraduationCap, ClipboardCheck } from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';

interface LessonViewerProps {
  lesson: CourseLesson;
  allLessons?: CourseLesson[];
  onSelectLesson?: (lesson: CourseLesson) => void;
  onBack: () => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  grade?: PrimaryGrade;
  subjectId?: SubjectId;
  trimester?: number | 'all';
  onHomeClick?: () => void;
  tashkeelEnabled?: boolean;
}

// The 4-tier practice progression requested for lesson depth: level 1-4 on each ProgressiveExercise
// maps directly to one of these tiers (level 5 reserved for an optional extra-challenge exercise,
// grouped visually with tier 4). Purely a presentation grouping — no new data field needed.
const PRACTICE_TIERS: { level: number; icon: string; titleAr: string }[] = [
  { level: 1, icon: '🔍', titleAr: 'المستوى 1 — أكتشف' },
  { level: 2, icon: '✏️', titleAr: 'المستوى 2 — أتدرب' },
  { level: 3, icon: '🎯', titleAr: 'المستوى 3 — أتقن' },
  { level: 4, icon: '🏆', titleAr: 'المستوى 4 — التحدي' },
  { level: 5, icon: '🌟', titleAr: 'تحدٍّ إضافي' },
];

// Fisher-Yates array shuffle helper to ensure correct options are not always in the 1st position
const shuffleOptions = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  allLessons = [],
  onSelectLesson,
  onBack,
  onCompleteQuiz,
  grade = lesson.grade,
  subjectId = lesson.subject,
  trimester,
  onHomeClick,
  tashkeelEnabled = true,
}) => {
  const currentIndex = allLessons.length > 0 ? allLessons.findIndex((l) => l.id === lesson.id) : -1;
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [shuffledQuiz, setShuffledQuiz] = useState<CourseLesson['quiz']>([]);
  const [visibleSolutions, setVisibleSolutions] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'explanation' | 'content' | 'practice' | 'interactive' | 'gameplay' | 'quiz' | 'evaluation'>('explanation');
  const [selectedExampleTier, setSelectedExampleTier] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Practice exercises state ("Je m'entraîne" — progressiveExercises)
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string | number>>({});
  const [practiceChecked, setPracticeChecked] = useState<Record<string, boolean>>({});
  const [practiceCorrect, setPracticeCorrect] = useState<Record<string, boolean>>({});
  const [awardedExerciseIds, setAwardedExerciseIds] = useState<Set<string>>(new Set());

  // Matching exercises: tap a left item, then a right item, to connect them (leftIdx -> rightIdx)
  const [matchingRightOrder, setMatchingRightOrder] = useState<Record<string, number[]>>({});
  const [matchingConnections, setMatchingConnections] = useState<Record<string, Record<number, number>>>({});
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState<Record<string, number | null>>({});

  // Ordering exercises: tap items in the order believed correct; tapping again undoes that item
  const [orderingShuffled, setOrderingShuffled] = useState<Record<string, number[]>>({});
  const [orderingSelections, setOrderingSelections] = useState<Record<string, number[]>>({});

  const canCheckExercise = (ex: NonNullable<CourseLesson['progressiveExercises']>[number]): boolean => {
    const answer = practiceAnswers[ex.id];
    if (ex.type === 'qcm' || ex.type === 'true_false') return answer !== undefined;
    if (ex.type === 'fill_blank') return !!String(answer ?? '').trim();
    if (ex.type === 'calculation') return answer !== undefined && answer !== '';
    if (ex.type === 'matching') return Object.keys(matchingConnections[ex.id] || {}).length === (ex.matchingPairsAr?.length || 0);
    if (ex.type === 'ordering') return (orderingSelections[ex.id] || []).length === (ex.orderedItemsAr?.length || 0);
    return true; // reveal-based types
  };

  const checkPracticeExercise = (ex: NonNullable<CourseLesson['progressiveExercises']>[number]) => {
    const answer = practiceAnswers[ex.id];
    let isCorrect = true; // default for reveal-based types (short_answer — not auto-validated)
    if (ex.type === 'qcm' || ex.type === 'true_false') {
      const opt = ex.options?.find((o) => o.id === answer);
      isCorrect = !!opt?.isCorrect;
    } else if (ex.type === 'fill_blank') {
      const expected = (ex.fillBlankAnswerAr || '').trim();
      isCorrect = String(answer ?? '').trim() === expected;
    } else if (ex.type === 'calculation') {
      isCorrect = Number(answer) === ex.calculationAnswer;
    } else if (ex.type === 'matching' && ex.matchingPairsAr) {
      const conns = matchingConnections[ex.id] || {};
      isCorrect =
        Object.keys(conns).length === ex.matchingPairsAr.length &&
        ex.matchingPairsAr.every((_, leftIdx) => conns[leftIdx] === leftIdx);
    } else if (ex.type === 'ordering' && ex.orderedItemsAr) {
      const seq = orderingSelections[ex.id] || [];
      isCorrect = seq.length === ex.orderedItemsAr.length && seq.every((originalIdx, position) => originalIdx === position);
    }

    setPracticeChecked((prev) => ({ ...prev, [ex.id]: true }));
    setPracticeCorrect((prev) => ({ ...prev, [ex.id]: isCorrect }));
    if (isCorrect && !awardedExerciseIds.has(ex.id)) {
      onCompleteQuiz(lesson.id, ex.xpReward);
      setAwardedExerciseIds((prev) => new Set(prev).add(ex.id));
    }
  };

  const resetPracticeExercise = (ex: NonNullable<CourseLesson['progressiveExercises']>[number]) => {
    setPracticeChecked((prev) => ({ ...prev, [ex.id]: false }));
    setPracticeAnswers((prev) => ({ ...prev, [ex.id]: '' }));
    if (ex.type === 'matching') {
      setMatchingConnections((prev) => ({ ...prev, [ex.id]: {} }));
      setMatchingSelectedLeft((prev) => ({ ...prev, [ex.id]: null }));
    }
    if (ex.type === 'ordering') {
      setOrderingSelections((prev) => ({ ...prev, [ex.id]: [] }));
    }
  };

  // Per-exercise callback factories for <PracticeExerciseCard>, shared identically by the
  // tiered practice section and the final evaluation section (exercise ids are unique across both).
  const setAnswerFor = (exId: string) => (value: string | number) => setPracticeAnswers((prev) => ({ ...prev, [exId]: value }));
  const setMatchingSelectedLeftFor = (exId: string) => (leftIdx: number | null) => setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: leftIdx }));
  const connectMatchingFor = (exId: string) => (leftIdx: number, rightIdx: number) => {
    setMatchingConnections((prev) => ({ ...prev, [exId]: { ...(prev[exId] || {}), [leftIdx]: rightIdx } }));
    setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: null }));
  };
  const disconnectMatchingFor = (exId: string) => (leftIdx: number) => {
    setMatchingConnections((prev) => {
      const next = { ...(prev[exId] || {}) };
      delete next[leftIdx];
      return { ...prev, [exId]: next };
    });
  };
  const toggleOrderingItemFor = (exId: string) => (originalIdx: number) => {
    setOrderingSelections((prev) => {
      const cur = prev[exId] || [];
      if (cur.includes(originalIdx)) return { ...prev, [exId]: cur.filter((i) => i !== originalIdx) };
      return { ...prev, [exId]: [...cur, originalIdx] };
    });
  };

  // Final evaluation summary — reuses the exact same practiceChecked/practiceCorrect state as the
  // tiered practice exercises (exercise ids are unique across the two lists).
  const evaluationExercises = lesson.evaluationExercises || [];
  const evaluationCheckedCount = evaluationExercises.filter((ex) => practiceChecked[ex.id]).length;
  const evaluationCorrectCount = evaluationExercises.filter((ex) => practiceChecked[ex.id] && practiceCorrect[ex.id]).length;
  const evaluationComplete = evaluationExercises.length > 0 && evaluationCheckedCount === evaluationExercises.length;
  const evaluationScorePercent = evaluationExercises.length > 0 ? Math.round((evaluationCorrectCount / evaluationExercises.length) * 100) : 0;

  // Determine effective interactive tool for the lesson
  const getEffectiveTool = () => {
    if (lesson.interactiveTool) return lesson.interactiveTool;
    switch (lesson.subject) {
      case 'arabic': return 'arabic_canvas';
      case 'science': return 'science_reactor';
      case 'math': return 'geometry_visualizer';
      case 'french': return 'french_lab';
      case 'english': return 'english_lab';
      case 'history_geo': return 'history_geo_lab';
      case 'islamic': return 'islamic_lab';
      default: return 'arabic_canvas';
    }
  };

  const effectiveTool = getEffectiveTool();

  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  // Function to initialize and shuffle question options
  const initializeShuffledQuiz = () => {
    if (!lesson.quiz || lesson.quiz.length === 0) {
      setShuffledQuiz([]);
      return;
    }
    const shuffled = lesson.quiz.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));
    setShuffledQuiz(shuffled);
  };

  useEffect(() => {
    setVisibleSolutions({});
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setSelectedExampleTier(1);
    setPracticeAnswers({});
    setPracticeChecked({});
    setPracticeCorrect({});
    setAwardedExerciseIds(new Set());
    setMatchingConnections({});
    setMatchingSelectedLeft({});
    setOrderingSelections({});

    const newMatchingRightOrder: Record<string, number[]> = {};
    const newOrderingShuffled: Record<string, number[]> = {};
    [...(lesson.progressiveExercises || []), ...(lesson.evaluationExercises || [])].forEach((ex) => {
      if (ex.type === 'matching' && ex.matchingPairsAr) {
        newMatchingRightOrder[ex.id] = shuffleOptions(ex.matchingPairsAr.map((_, i) => i));
      }
      if (ex.type === 'ordering' && ex.orderedItemsAr) {
        newOrderingShuffled[ex.id] = shuffleOptions(ex.orderedItemsAr.map((_, i) => i));
      }
    });
    setMatchingRightOrder(newMatchingRightOrder);
    setOrderingShuffled(newOrderingShuffled);

    initializeShuffledQuiz();
  }, [lesson.id]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleCalculateQuizScore = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    const currentQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
    currentQuiz.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctOpt = q.options.find((opt) => opt.isCorrect);
      if (selected && correctOpt && selected === correctOpt.id) {
        correctCount++;
      }
    });

    const earnedXp = correctCount * 15;
    onCompleteQuiz(lesson.id, earnedXp);
  };

  const handleResetQuiz = () => {
    setQuizSubmitted(false);
    setSelectedAnswers({});
    initializeShuffledQuiz(); // Re-shuffle options for new randomized positions
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* 1. Fil d'Ariane (Breadcrumb) Bar */}
      <CourseBreadcrumb
        grade={grade}
        subjectId={subjectId}
        trimester={trimester}
        currentLesson={lesson}
        onHomeClick={() => {
          if (onHomeClick) onHomeClick();
          else onBack();
        }}
        onSubjectClick={onBack}
      />

      {/* 2. Header Bar with Back Button, Lesson Counter and Next/Prev Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-emerald-700 font-bold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>قائمة الدروس</span>
          </button>

          {allLessons.length > 0 && currentIndex >= 0 && (
            <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800">
              الدرس {currentIndex + 1} من {allLessons.length}
            </span>
          )}
        </div>

        {/* Top Quick Next/Prev Controls */}
        {allLessons.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => previousLesson && onSelectLesson?.(previousLesson)}
              disabled={!previousLesson}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                previousLesson
                  ? 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 dark:bg-slate-700 dark:text-slate-100 shadow-2xs'
                  : 'bg-slate-100/50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed opacity-50'
              }`}
              title={previousLesson ? `الدرس السابق: ${renderArabicText(previousLesson.titleAr)}` : 'لا يوجد درس سابق'}
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">الدرس السابق</span>
              <span className="sm:hidden">السابق</span>
            </button>

            <button
              onClick={() => nextLesson && onSelectLesson?.(nextLesson)}
              disabled={!nextLesson}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                nextLesson
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  : 'bg-slate-100/50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed opacity-50'
              }`}
              title={nextLesson ? `الدرس التالي: ${renderArabicText(nextLesson.titleAr)}` : 'لا يوجد درس تالي'}
            >
              <span className="hidden sm:inline">الدرس التالي</span>
              <span className="sm:hidden">التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lesson Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              {lesson.contentSource === 'official_verified' && <span>✅ محتوى مطابق لبرنامج رسمي موثّق</span>}
              {lesson.contentSource === 'corroborated' && <span className="text-sky-300">🔎 محتوى مُرجَّح (تمت مقارنته بمصدر ثانوي غير رسمي)</span>}
              {lesson.contentSource === 'complementary' && <span className="text-amber-300">✨ محتوى تربوي تكميلي أصلي (مسيد DZ)</span>}
              {(lesson.contentSource === 'needs_verification' || !lesson.contentSource) && (
                <span className="text-slate-400">⚠️ محتوى بحاجة إلى تحقق (المصدر غير مؤكد بعد)</span>
              )}
            </div>
            {lesson.difficultyTier && (
              <span className="text-xs font-bold bg-white/10 border border-white/20 rounded-full px-3 py-1">
                {'⭐'.repeat(lesson.difficultyTier)} {lesson.difficultyTier === 1 ? 'سهل' : lesson.difficultyTier === 2 ? 'متوسط' : 'متقدم'}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black mb-3">{renderArabicText(lesson.titleAr)}</h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {renderArabicText(lesson.summaryAr)}
          </p>
          {lesson.sourceNoteAr && (
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-3xl mt-2 border-t border-white/10 pt-2">
              ℹ️ {renderArabicText(lesson.sourceNoteAr)}
            </p>
          )}
        </div>
      </div>

      {/* Creative mission wrapper (presentation only — never a source of new official notions) */}
      {lesson.missionTitleAr && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-5 shadow-md">
          <h2 className="font-black text-base sm:text-lg mb-1">{renderArabicText(lesson.missionTitleAr)}</h2>
          {lesson.missionIntroAr && <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">{renderArabicText(lesson.missionIntroAr)}</p>}
        </div>
      )}

      {/* Learning objectives — "à la fin de cette leçon, je sais..." */}
      {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2.5">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>في نهاية هذا الدرس، سأكون قادراً على:</span>
          </h3>
          <ul className="space-y-1.5">
            {lesson.objectivesAr.map((obj, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                <span className="text-indigo-500 shrink-0">◆</span>
                <span>{renderArabicText(obj)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section Sub-Tabs */}
      <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-300 w-fit text-xs font-bold overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'explanation' ? 'bg-indigo-700 text-white font-extrabold shadow-sm' : 'text-slate-800 hover:text-slate-900 font-bold'
          }`}
        >
          <Glasses className="w-3.5 h-3.5" />
          <span>شرح الدرس والتطبيقات</span>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'content' ? 'bg-white text-slate-900 font-extrabold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-bold'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>الملخص والقواعد</span>
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'interactive' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-700 hover:text-slate-900 font-bold'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>الأداة التفاعلية المخصصة</span>
        </button>
        {lesson.progressiveExercises && lesson.progressiveExercises.length > 0 && (
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'practice' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-slate-700 hover:text-slate-900 font-bold'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>أتدرب ({lesson.progressiveExercises.length})</span>
          </button>
        )}
        {lesson.gameplay_simulation && (
          <button
            onClick={() => setActiveTab('gameplay')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'gameplay' ? 'bg-indigo-600 text-white font-extrabold shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>لعبة المحاكاة التفاعلية</span>
          </button>
        )}
        {evaluationExercises.length > 0 && (
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'evaluation' ? 'bg-rose-600 text-white font-extrabold shadow-sm' : 'text-slate-700 hover:text-slate-900 font-bold'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>التقييم النهائي ({evaluationExercises.length})</span>
          </button>
        )}
        {lesson.quiz.length > 0 && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'quiz' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>الاختبار التفاعلي ({lesson.quiz.length})</span>
          </button>
        )}
      </div>

      {/* TAB 0: LESSON EXPLANATION & VULGARISATION */}
      {activeTab === 'explanation' && (
        <LessonExplanationView
          lesson={lesson}
          tashkeelEnabled={tashkeelEnabled}
          onProceedToSummary={() => setActiveTab('content')}
        />
      )}

      {/* TAB GAMEPLAY: INTERACTIVE SIMULATION */}
      {activeTab === 'gameplay' && lesson.gameplay_simulation && (
        <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
      )}

      {/* TAB PRACTICE: "أتدرب" — exercises grouped by tier (أكتشف/أتدرب/أتقن/التحدي), then the mini-game challenge */}
      {activeTab === 'practice' && lesson.progressiveExercises && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {PRACTICE_TIERS.map((tier) => {
            const tierExercises = lesson.progressiveExercises!.filter((ex) => ex.level === tier.level);
            if (tierExercises.length === 0) return null;
            return (
              <div key={tier.level} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="text-lg">{tier.icon}</span>
                  <h3 className="font-black text-sm text-slate-800">{tier.titleAr}</h3>
                  <span className="text-[10px] font-bold text-slate-400">({tierExercises.length})</span>
                </div>
                <div className="space-y-4">
                  {tierExercises.map((ex) => (
                    <PracticeExerciseCard
                      key={ex.id}
                      ex={ex}
                      renderArabicText={renderArabicText}
                      answer={practiceAnswers[ex.id]}
                      setAnswer={setAnswerFor(ex.id)}
                      isChecked={!!practiceChecked[ex.id]}
                      isCorrect={!!practiceCorrect[ex.id]}
                      canCheck={canCheckExercise(ex)}
                      onCheck={() => checkPracticeExercise(ex)}
                      onReset={() => resetPracticeExercise(ex)}
                      matchingRightOrder={matchingRightOrder[ex.id] || []}
                      matchingConnections={matchingConnections[ex.id] || {}}
                      matchingSelectedLeft={matchingSelectedLeft[ex.id] ?? null}
                      setMatchingSelectedLeft={setMatchingSelectedLeftFor(ex.id)}
                      connectMatching={connectMatchingFor(ex.id)}
                      disconnectMatching={disconnectMatchingFor(ex.id)}
                      orderingShuffled={orderingShuffled[ex.id] || []}
                      orderingSelection={orderingSelections[ex.id] || []}
                      toggleOrderingItem={toggleOrderingItemFor(ex.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Mini-game challenge ("Défi") */}
          {lesson.educationalGame && (
            <div className="bg-gradient-to-r from-purple-950 to-slate-900 text-white rounded-3xl p-5 space-y-3 border border-purple-800/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🏆 التحدي: {renderArabicText(lesson.educationalGame.titleAr)}</span>
                </h3>
                <span className="text-[10px] font-bold bg-white/10 px-2.5 py-1 rounded-full">+{lesson.educationalGame.xpReward} XP</span>
              </div>
              <p className="text-xs text-purple-200">{renderArabicText(lesson.educationalGame.instructionsAr)}</p>
              <div className="space-y-2">
                {lesson.educationalGame.items.map((item, i) => (
                  <div key={i} className="bg-slate-950/60 border border-purple-900/50 rounded-xl p-3 text-xs">
                    <p className="font-bold mb-1.5">{renderArabicText(item.questionOrPromptAr)}</p>
                    {item.optionsAr && (
                      <div className="flex gap-2 flex-wrap">
                        {item.optionsAr.map((optAr) => (
                          <span key={optAr} className="px-2.5 py-1 rounded-lg bg-white/10 text-purple-100">
                            {renderArabicText(optAr)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: CONTENT & RULES */}
      {activeTab === 'content' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sciences: question → observation → hypothesis → experiment → result → explanation */}
          {lesson.scientificInquiry && (
            <ScientificInquiryFlow
              inquiry={lesson.scientificInquiry}
              renderArabicText={renderArabicText}
              hasSimulation={!!lesson.gameplay_simulation}
              onGoToSimulation={() => setActiveTab('gameplay')}
            />
          )}

          {/* Executive Lesson Summary Card */}
          {lesson.summaryAr && (
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800/80 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">ملخص الدرس المفاهيمي الشامل</h3>
                </div>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                  مادة {lesson.subject === 'math' ? 'الرياضيات' : lesson.subject === 'arabic' ? 'اللغة العربية' : lesson.subject === 'science' ? 'العلوم' : 'المنهج الدراسي'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
                {formatEducationalText(lesson.summaryAr)}
              </p>
            </div>
          )}

          {/* Detailed course: intro, vocabulary, common mistakes, "à retenir" synthesis */}
          {lesson.detailedCourse && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>الكورس المفصّل</span>
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
                {renderArabicText(lesson.detailedCourse.introAr)}
              </p>

              {lesson.detailedCourse.vocabulary && lesson.detailedCourse.vocabulary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-slate-600 block">📖 كلمات مهمة أتذكرها:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lesson.detailedCourse.vocabulary.map((v, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                        <span className="font-black text-indigo-700 block">{renderArabicText(v.termAr)}</span>
                        <span className="text-slate-600">{renderArabicText(v.definitionAr)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lesson.detailedCourse.visualizationHintAr && (
                <p className="text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-start gap-2">
                  <span>🖼️</span>
                  <span>{renderArabicText(lesson.detailedCourse.visualizationHintAr)}</span>
                </p>
              )}

              {lesson.detailedCourse.commonMistakes && lesson.detailedCourse.commonMistakes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-rose-700 block">⚠️ أخطاء شائعة يجب الانتباه إليها:</span>
                  {lesson.detailedCourse.commonMistakes.map((m, i) => (
                    <div key={i} className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-1">
                      <p className="text-rose-800"><span className="font-bold">❌ </span>{renderArabicText(m.mistakeAr)}</p>
                      <p className="text-emerald-800"><span className="font-bold">✅ </span>{renderArabicText(m.correctionAr)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-sm font-bold text-amber-900">
                💡 أتذكر: {renderArabicText(lesson.detailedCourse.takeawayAr)}
              </div>
            </div>
          )}

          {/* 5-tier progressive worked examples */}
          {lesson.progressiveWorkedExamples && lesson.progressiveWorkedExamples.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>أمثلة متدرّجة (من الأسهل إلى التحدي)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {lesson.progressiveWorkedExamples.map((ex) => (
                  <button
                    key={ex.tier}
                    onClick={() => setSelectedExampleTier(ex.tier)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedExampleTier === ex.tier ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ex.labelAr}
                  </button>
                ))}
              </div>
              {(() => {
                const activeExample = lesson.progressiveWorkedExamples!.find((ex) => ex.tier === selectedExampleTier) || lesson.progressiveWorkedExamples![0];
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 whitespace-pre-line">
                      {activeExample.isRealLife && <span className="text-emerald-600">🏠 </span>}
                      {renderArabicText(activeExample.problem)}
                    </p>
                    {activeExample.stepsAr && activeExample.stepsAr.length > 0 && (
                      <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pr-1">
                        {activeExample.stepsAr.map((step, i) => (
                          <li key={i}>{renderArabicText(step)}</li>
                        ))}
                      </ol>
                    )}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 whitespace-pre-line">
                      <span className="font-bold">✅ الحل: </span>
                      {renderArabicText(activeExample.solution)}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Golden Rules with Detailed Explanations & Simple Examples */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>القواعد الذهبية للدرس مدعومة بالأمثلة المبسطة</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  شرح ميسر لكل قاعدة مع أمثلة تطبيقية مباشرة لترسيخ الفهم
                </p>
              </div>
              <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                {lesson.rulesAr.length} قواعد أساسية
              </span>
            </div>

            <div className="space-y-4">
              {lesson.rulesAr.map((rule, idx) => {
                // Parse rule title and body
                const colonIdx = rule.indexOf(':');
                let title = '';
                let body = rule;
                if (colonIdx > 0 && colonIdx < 50) {
                  title = rule.substring(0, colonIdx).trim();
                  body = rule.substring(colonIdx + 1).trim();
                }

                // Check if rule contains inline example
                const hasExplicitExample = rule.includes('مثال') || rule.includes('مثال:');
                const matchingExample = lesson.examplesAr && lesson.examplesAr[idx];

                return (
                  <div key={idx} className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-emerald-300 transition-all">
                    {/* Rule Header */}
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        {title && (
                          <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                            <span>{title}</span>
                          </h4>
                        )}
                        <p className="text-xs sm:text-sm text-slate-800 font-sans leading-relaxed font-semibold whitespace-pre-line">
                          {formatEducationalText(renderArabicText(body))}
                        </p>
                      </div>
                    </div>

                    {/* Simple Practical Example Card */}
                    <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3.5 text-xs text-emerald-950 font-sans space-y-1.5 mr-0 sm:mr-11">
                      <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 text-xs">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>📌 مثال تطبيقي مبسط ومباشر:</span>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-emerald-200 text-slate-800 font-medium leading-relaxed font-sans whitespace-pre-line">
                        {matchingExample ? (
                          <span>
                            <strong className="text-emerald-800">التطبيق: </strong>
                            {formatEducationalText(matchingExample.problem)}
                            <br />
                            <strong className="text-indigo-700">الحل والنتيجة: </strong>
                            <span className="text-indigo-900 font-bold">{formatEducationalText(matchingExample.solution)}</span>
                          </span>
                        ) : hasExplicitExample ? (
                          <span>
                            تطبيق القاعدة مبيّن أعلاه في الجزء المحدد بكلمة (مثال)، حيث تلاحظ تحويل النظرية إلى نتيجة حاسمة بسيطة.
                          </span>
                        ) : lesson.subject === 'math' ? (
                          <span>
                            تطبيقيّاً: نطبق القاعدة مباشرة في المسائل عن طريق التعويض العددي ومراعاة الترتيب والخطوات التدرجية.
                          </span>
                        ) : lesson.subject === 'arabic' ? (
                          <span>
                            تطبيقيّاً: في الجملة الشفهية والكتابية، يُضبط الحرف الأخير حسب موقعه الإعرابي وفق هذه القاعدة بالضبط.
                          </span>
                        ) : (
                          <span>
                            تطبيقيّاً: هذه القاعدة تشرح الظاهرة العلمية أو المفهوم بشكل عملي يمكن ملاحظته واختباره بالعين المجردة.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Formulas Grid if available */}
          {lesson.keyFormulas && lesson.keyFormulas.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>القوانين والعبارات المفتاحية للدرس:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.keyFormulas.map((kf, kIdx) => (
                  <div key={kIdx} className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl space-y-1.5">
                    <span className="text-xs font-extrabold text-amber-950 block">{kf.labelAr}</span>
                    <span className="text-xs sm:text-sm font-mono font-black text-slate-900 block bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs whitespace-pre-line">
                      {formatEducationalText(kf.formulaAr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worked Examples if available */}
          {lesson.examplesAr && lesson.examplesAr.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>أمثلة وتمارين نموذجية محلولة بالتفصيل</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    حاول حل المسألة بنفسك أولاً، ثم اكشف عن الحل النموذجي المفصل
                  </p>
                </div>
              </div>

              {lesson.examplesAr.map((ex, exIdx) => {
                const isVisible = !!visibleSolutions[exIdx];
                return (
                  <div key={exIdx} className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                    <div className="text-xs sm:text-sm font-bold text-amber-300 font-sans leading-relaxed whitespace-pre-line bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      ❓ المشكلة / الوضعية {exIdx + 1}: {formatEducationalText(ex.problem)}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                      <button
                        onClick={() =>
                          setVisibleSolutions((prev) => ({
                            ...prev,
                            [exIdx]: !prev[exIdx],
                          }))
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 cursor-pointer shadow-xs active:scale-95"
                      >
                        {isVisible ? (
                          <>
                            <EyeOff className="w-4 h-4 text-emerald-400" />
                            <span>إخفاء الحل النموذجي</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span>إظهار الحل النموذجي المفصل 💡</span>
                          </>
                        )}
                      </button>

                      {!isVisible && (
                        <span className="text-[11px] text-slate-400 italic">
                          🔒 الحل مخفي للتفكير الشخصي
                        </span>
                      )}
                    </div>

                    {isVisible && (
                      <div className="text-xs sm:text-sm text-emerald-200 font-sans border-t border-emerald-900/60 pt-3 leading-relaxed bg-emerald-950/80 p-4 rounded-xl border border-emerald-800/80 animate-in fade-in duration-200 whitespace-pre-line">
                        <span className="font-extrabold text-amber-300 block mb-1">💡 الحل والتبسيط النموذجي:</span>
                        {formatEducationalText(renderArabicText(ex.solution))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE TOOL */}
      {activeTab === 'interactive' && (
        <div className="space-y-4">
          {effectiveTool === 'arabic_canvas' && <ArabicCanvasInteractive lesson={lesson} grade={lesson.grade} />}
          {effectiveTool === 'science_reactor' && <ScienceReactorInteractive lesson={lesson} grade={lesson.grade} />}
          {effectiveTool === 'soroban' && <SorobanInteractive grade={lesson.grade} />}
          {effectiveTool === 'unit_converter' && <UnitConverter grade={lesson.grade} />}
          {effectiveTool === 'geometry_visualizer' && <GeometryVisualizer grade={lesson.grade} />}
          {effectiveTool === 'science_lab' && (
            <ScienceLabSimulation gameplay={lesson.gameplay_simulation || {
              id: lesson.id,
              type: 'circuit',
              titleAr: lesson.titleAr,
              descriptionAr: lesson.summaryAr,
              instructionsAr: ['تفاعل مع أجهزة المحاكاة والمختبر'],
              targetOutput: 100,
              badgeRewardAr: 'عالم العلوم 🔬'
            }} grade={lesson.grade} />
          )}
          {effectiveTool === 'arabic_conjugator' && <ArabicConjugator grade={lesson.grade} />}
          {effectiveTool === 'multiplication_table' && <MultiplicationTableInteractive grade={lesson.grade} />}
          {effectiveTool === 'french_lab' && <FrenchLanguageLab grade={lesson.grade} />}
          {effectiveTool === 'english_lab' && <EnglishLanguageLab grade={lesson.grade} />}
          {effectiveTool === 'history_geo_lab' && <HistoryGeoInteractive grade={lesson.grade} />}
          {effectiveTool === 'islamic_lab' && <IslamicEducationInteractive grade={lesson.grade} config={lesson.islamicInteractive} />}
        </div>
      )}

      {/* TAB: FINAL EVALUATION — mixed exercise types, difficulty progression, then a self-check summary */}
      {activeTab === 'evaluation' && evaluationExercises.length > 0 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-rose-950 to-slate-900 text-white rounded-3xl p-5 border border-rose-800/50">
            <h3 className="font-black text-sm flex items-center gap-2 mb-1">
              <ClipboardCheck className="w-5 h-5 text-rose-300" />
              <span>التقييم النهائي للدرس</span>
            </h3>
            <p className="text-xs text-rose-200">أجب عن كل الأسئلة للتحقق من إتقانك للدرس. لا بأس بالخطأ — المهم أن تتعلم من التصحيح!</p>
            {evaluationCheckedCount > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(evaluationCheckedCount / evaluationExercises.length) * 100}%` }} />
                </div>
                <span className="text-[11px] font-bold text-rose-200 shrink-0">{evaluationCheckedCount}/{evaluationExercises.length}</span>
              </div>
            )}
          </div>

          {evaluationExercises.map((ex) => (
            <PracticeExerciseCard
              key={ex.id}
              ex={ex}
              renderArabicText={renderArabicText}
              answer={practiceAnswers[ex.id]}
              setAnswer={setAnswerFor(ex.id)}
              isChecked={!!practiceChecked[ex.id]}
              isCorrect={!!practiceCorrect[ex.id]}
              canCheck={canCheckExercise(ex)}
              onCheck={() => checkPracticeExercise(ex)}
              onReset={() => resetPracticeExercise(ex)}
              matchingRightOrder={matchingRightOrder[ex.id] || []}
              matchingConnections={matchingConnections[ex.id] || {}}
              matchingSelectedLeft={matchingSelectedLeft[ex.id] ?? null}
              setMatchingSelectedLeft={setMatchingSelectedLeftFor(ex.id)}
              connectMatching={connectMatchingFor(ex.id)}
              disconnectMatching={disconnectMatchingFor(ex.id)}
              orderingShuffled={orderingShuffled[ex.id] || []}
              orderingSelection={orderingSelections[ex.id] || []}
              toggleOrderingItem={toggleOrderingItemFor(ex.id)}
            />
          ))}

          {/* Self-check summary + remediation, shown once every question has been answered */}
          {evaluationComplete && (
            <div className={`rounded-3xl p-5 border space-y-3 ${evaluationScorePercent >= 60 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-black text-sm text-slate-900">📊 نتيجتك: {evaluationCorrectCount}/{evaluationExercises.length} ({evaluationScorePercent}%)</h4>
                <span className="text-xs font-bold text-slate-500">+{evaluationExercises.filter((ex) => practiceCorrect[ex.id]).reduce((sum, ex) => sum + ex.xpReward, 0)} XP</span>
              </div>
              {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-700 block">أهداف هذا الدرس:</span>
                  {lesson.objectivesAr.map((obj, i) => (
                    <p key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <span>{evaluationScorePercent >= 60 ? '✅' : '🌱'}</span>
                      <span>{renderArabicText(obj)}</span>
                    </p>
                  ))}
                </div>
              )}
              {evaluationScorePercent < 60 && (
                <p className="text-xs text-amber-800 bg-amber-100 border border-amber-300 rounded-xl p-2.5">
                  💡 لا بأس، هذا جزء طبيعي من التعلّم! راجع "الكورس المفصّل" و"الأمثلة" في تبويب "الملخص والقواعد"، ثم أعد المحاولة — أنت تقترب من الإتقان خطوة بخطوة.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUIZ */}
      {activeTab === 'quiz' && lesson.quiz.length > 0 && (() => {
        const activeQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
        const totalQuestions = activeQuiz.length;
        const answeredCount = Object.keys(selectedAnswers).length;
        const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

        let correctCount = 0;
        if (quizSubmitted) {
          activeQuiz.forEach((q) => {
            const selected = selectedAnswers[q.id];
            const correctOpt = q.options.find((o) => o.isCorrect);
            if (selected && correctOpt && selected === correctOpt.id) {
              correctCount++;
            }
          });
        }

        const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        return (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
            {/* Quiz Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>الاختبار التفاعلي المتقدم</span>
                </h3>
                <p className="text-xs text-slate-500">
                  خيار الإجابات مخلّط عشوائياً لضمان الفهم الحقيقي وليس الحفظ فقط
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={initializeShuffledQuiz}
                  disabled={quizSubmitted}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  title="إعادة خلط أماكن الإجابات عشوائياً"
                >
                  <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>خلط الخيارات 🎲</span>
                </button>

                <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                  +{totalQuestions * 15} XP
                </span>
              </div>
            </div>

            {/* Answer Progress Tracker (Before Submit) */}
            {!quizSubmitted && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>تقدم الإجابات:</span>
                  <span className="text-indigo-700 font-mono">
                    {answeredCount} من {totalQuestions} سؤال (مكتمل {Math.round((answeredCount / totalQuestions) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Score Summary Card (Post Submit) */}
            {quizSubmitted && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/80 space-y-4 shadow-md animate-in fade-in duration-300">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                        <span>نتيجة الاختبار:</span>
                        <span className="text-amber-300 font-mono font-black text-xl">{scorePercentage}%</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        {scorePercentage === 100
                          ? '🏆 إجابات ممتازة ومثالية! لقد أتقنت درس اليوم بنجاح كامل.'
                          : scorePercentage >= 70
                          ? '🌟 أداء رائع ومتميز! استمر على هذا المستوى القوي.'
                          : scorePercentage >= 50
                          ? '👍 نتيجة جيدة! يمكنك مراجعة الإجابات أدناه للوصول إلى 100%.'
                          : '💡 تحتاج إلى مراجعة بسيطة للدرس وإعادة الاختبار لترسيخ المفاهيم.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة الاختبار وخلط الخيارات 🔄</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-indigo-900/80 text-center text-xs">
                  <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                    <span className="text-slate-400 block text-[10px] font-bold">إجابات صحيحة</span>
                    <span className="text-emerald-400 font-black text-sm">{correctCount}</span>
                  </div>
                  <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                    <span className="text-slate-400 block text-[10px] font-bold">إجابات خاطئة</span>
                    <span className="text-rose-400 font-black text-sm">{totalQuestions - correctCount}</span>
                  </div>
                  <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                    <span className="text-slate-400 block text-[10px] font-bold">النقاط المكتسبة</span>
                    <span className="text-amber-300 font-black text-sm">+{correctCount * 15} XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {activeQuiz.map((q, qIdx) => {
                const selected = selectedAnswers[q.id];
                const correctOpt = q.options.find((o) => o.isCorrect);
                const isUserCorrect = selected && correctOpt && selected === correctOpt.id;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                      quizSubmitted
                        ? isUserCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/20'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-slate-900">
                        <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <span>{q.questionAr}</span>
                      </div>

                      {quizSubmitted && (
                        <span
                          className={`text-[11px] font-black px-3 py-1 rounded-full border shrink-0 flex items-center gap-1 ${
                            isUserCorrect
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-in zoom-in-50 fade-in duration-300 motion-reduce:animate-none'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isUserCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>إجابة صحيحة</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>إجابة خاطئة</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isOptSelected = selected === opt.id;
                        let btnStyle = 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 hover:bg-slate-50';

                        if (quizSubmitted) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold shadow-xs';
                          } else if (isOptSelected && !opt.isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                          } else {
                            btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                          }
                        } else if (isOptSelected) {
                          btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-black ring-2 ring-indigo-200 shadow-xs';
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`text-right p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              {/* Option Arabic Label (أ، ب، ج، د) */}
                              <span
                                className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 border ${
                                  quizSubmitted && opt.isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-700'
                                    : isOptSelected
                                    ? 'bg-indigo-600 text-white border-indigo-700'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {optionLetters[optIdx] || optIdx + 1}
                              </span>
                              <span>{renderArabicText(opt.textAr)}</span>
                            </div>

                            {quizSubmitted && opt.isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && isOptSelected && !opt.isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Post-submit Explanation Box */}
                    {quizSubmitted && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 font-sans leading-relaxed">
                        <span className="font-extrabold text-indigo-900 block flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>التفسير والشرح العلمي للحل:</span>
                        </span>
                        <p className="text-slate-800 font-medium">
                          {renderArabicText(
                            q.options.find((o) => o.isCorrect)?.explanationAr ||
                              q.options.find((o) => o.id === selected)?.explanationAr ||
                              'الإجابة الصحيحة تم اختيارها استناداً لقاعدة الدرس الذهبية.',
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {!quizSubmitted ? (
                <button
                  onClick={handleCalculateQuizScore}
                  disabled={answeredCount === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الإجابات وحساب النتيجة ({answeredCount}/{totalQuestions})</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 w-full justify-between flex-wrap">
                  <span>تهانينا! تم احتساب النقاط وإضافتها إلى رصيدك الدراسي.</span>
                  <button
                    onClick={handleResetQuiz}
                    className="bg-white border border-emerald-300 text-emerald-900 px-3.5 py-1.5 rounded-xl hover:bg-emerald-100 font-extrabold cursor-pointer transition-all"
                  >
                    إعادة الاختبار بخلط جديد 🎲
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      {/* Bottom Next/Previous Lesson Navigation Footer */}
      {allLessons.length > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4 transition-all">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>متابعة التعلم - التنقل بين دروس المادة ({currentIndex >= 0 ? currentIndex + 1 : 1} من {allLessons.length})</span>
            </span>
            <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800">
              {lesson.categoryAr}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Previous Lesson Button */}
            {previousLesson ? (
              <button
                onClick={() => onSelectLesson?.(previousLesson)}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all text-right group cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-2xs">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">الدرس السابق / Précédent</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mt-0.5">
                      {previousLesson.titleAr}
                    </span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs flex items-center gap-2 justify-center opacity-60">
                <span>بداية دروس هذا المحور الدراسي</span>
              </div>
            )}

            {/* Next Lesson Button */}
            {nextLesson ? (
              <button
                onClick={() => onSelectLesson?.(nextLesson)}
                className="flex items-center justify-between p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/30 hover:border-indigo-500 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 transition-all text-right group cursor-pointer"
              >
                <div className="flex items-center gap-3 justify-between w-full overflow-hidden">
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">الدرس التالي / Suivant</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mt-0.5">
                      {nextLesson.titleAr}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs flex items-center gap-2 justify-center opacity-60">
                <span>🎉 وصلت لنهاية دروس هذا المحور!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
