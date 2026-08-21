import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourseLesson, PrimaryGrade, SubjectId } from '../types';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { LessonExplanationView } from './LessonExplanationView';
import { PracticeExerciseCard } from './PracticeExerciseCard';
import { RevisionSheetViewer } from './RevisionSheetViewer';
import { LoadingFallback } from './LoadingFallback';
import { renderTextWithMath } from './MathExpression';
import { Button, Card, Badge, XPProgressBar } from './ui';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { isFeatureEnabled } from '../featureFlags';
import { playSuccessChime, playGentleNudge } from './preschool/usePreschoolAudio';
import { springBootApi } from '../services/springBootApi';

// R2.1 — code splitting: exactly one of these renders per lesson (gated by lesson.interactiveTool /
// scientificInquiry), so none of them need to be in the initial bundle. This is also what makes the
// App.tsx-level lazy() for the same components actually take effect at the chunk level — Rollup
// merges a dynamically-imported module back into the static bundle wherever it's *also* statically
// imported, and this file used to be exactly that other static import site.
const ArabicCanvasInteractive = lazy(() => import('./ArabicCanvasInteractive').then((m) => ({ default: m.ArabicCanvasInteractive })));
const SorobanInteractive = lazy(() => import('./SorobanInteractive').then((m) => ({ default: m.SorobanInteractive })));
const UnitConverter = lazy(() => import('./UnitConverter').then((m) => ({ default: m.UnitConverter })));
const GeometryVisualizer = lazy(() => import('./GeometryVisualizer').then((m) => ({ default: m.GeometryVisualizer })));
const ScienceLabSimulation = lazy(() => import('./ScienceLabSimulation').then((m) => ({ default: m.ScienceLabSimulation })));
const ScientificInquiryFlow = lazy(() => import('./ScientificInquiryFlow').then((m) => ({ default: m.ScientificInquiryFlow })));
const ArabicConjugator = lazy(() => import('./ArabicConjugator').then((m) => ({ default: m.ArabicConjugator })));
const MultiplicationTableInteractive = lazy(() => import('./MultiplicationTableInteractive').then((m) => ({ default: m.MultiplicationTableInteractive })));
const FrenchLanguageLab = lazy(() => import('./FrenchLanguageLab').then((m) => ({ default: m.FrenchLanguageLab })));
const EnglishLanguageLab = lazy(() => import('./EnglishLanguageLab').then((m) => ({ default: m.EnglishLanguageLab })));
const HistoryGeoInteractive = lazy(() => import('./HistoryGeoInteractive').then((m) => ({ default: m.HistoryGeoInteractive })));
const IslamicEducationInteractive = lazy(() => import('./IslamicEducationInteractive').then((m) => ({ default: m.IslamicEducationInteractive })));
const CivicsInteractive = lazy(() => import('./CivicsInteractive').then((m) => ({ default: m.CivicsInteractive })));
const MathInteractive = lazy(() => import('./MathInteractive').then((m) => ({ default: m.MathInteractive })));
const LanguageLabInteractive = lazy(() => import('./LanguageLabInteractive').then((m) => ({ default: m.LanguageLabInteractive })));
import { BookOpen, CheckCircle2, Trophy, ArrowRight, ArrowLeft, Lightbulb, Gamepad2, Sparkles, Eye, EyeOff, Glasses, Shuffle, RotateCcw, XCircle, Award, ChevronLeft, ChevronRight, ChevronDown, Target, GraduationCap, ClipboardCheck, Printer, Lock, Info } from 'lucide-react';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';

interface LessonViewerProps {
  lesson: CourseLesson;
  allLessons?: CourseLesson[];
  onSelectLesson?: (lesson: CourseLesson) => void;
  onBack: () => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  /** True once this lesson's quiz has been fully answered correctly at least once before — caps XP-per-question to prevent farming via repeated replays. */
  quizAlreadyValidated?: boolean;
  /** Fired once, the moment every question in the quiz has been answered correctly for the first time. */
  onQuizFullyValidated?: (lessonId: string) => void;
  grade?: PrimaryGrade;
  subjectId?: SubjectId;
  trimester?: number | 'all';
  onHomeClick?: () => void;
  tashkeelEnabled?: boolean;
}

type TabId = 'explanation' | 'content' | 'practice' | 'interactive' | 'gameplay' | 'quiz' | 'evaluation';

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

// Shared spring/easing tokens for tab transitions and quiz feedback.
const tabTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };
const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🏆'];

/** Brief particle burst played once next to a freshly-correct quiz answer. */
const ConfettiBurst: React.FC = () => (
  <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 34 + (i % 3) * 10;
      return (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 text-xs"
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 6,
            scale: 1,
            rotate: (i % 2 === 0 ? 1 : -1) * 90,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
        </motion.span>
      );
    })}
  </span>
);

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson: lessonProp,
  allLessons = [],
  onSelectLesson,
  onBack,
  onCompleteQuiz,
  quizAlreadyValidated = false,
  onQuizFullyValidated,
  grade = lessonProp.grade,
  subjectId = lessonProp.subject,
  trimester,
  onHomeClick,
  tashkeelEnabled = true,
}) => {
  // T2/T3 server-side content gate (pilot — see trimesterAccess.ts's doc comment, and
  // PremiumContentController on the backend). A "shell" lesson (premiumContentPending) ships with
  // empty quiz/rulesAr and no detailedCourse/progressiveExercises/etc. — the real content is fetched
  // here and merged on top, only ever reaching a PREMIUM/ADMIN account (the endpoint 403s otherwise).
  const [premiumContent, setPremiumContent] = useState<Partial<CourseLesson> | null>(null);
  const [premiumFetchState, setPremiumFetchState] = useState<'idle' | 'loading' | 'forbidden' | 'error' | 'done'>('idle');

  useEffect(() => {
    setPremiumContent(null);
    if (!lessonProp.premiumContentPending) {
      setPremiumFetchState('idle');
      return;
    }
    setPremiumFetchState('loading');
    let cancelled = false;
    springBootApi.getPremiumLessonContent(lessonProp.id).then((res) => {
      if (cancelled) return;
      if (res.status === 200 && res.data) {
        setPremiumContent(res.data);
        setPremiumFetchState('done');
      } else if (res.status === 403) {
        setPremiumFetchState('forbidden');
      } else {
        setPremiumFetchState('error');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lessonProp.id, lessonProp.premiumContentPending]);

  const lesson: CourseLesson = premiumContent ? { ...lessonProp, ...premiumContent } : lessonProp;

  const currentIndex = allLessons.length > 0 ? allLessons.findIndex((l) => l.id === lesson.id) : -1;
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [shuffledQuiz, setShuffledQuiz] = useState<CourseLesson['quiz']>([]);
  const [awardedQuizIds, setAwardedQuizIds] = useState<Set<string>>(new Set());
  const [gameAnswers, setGameAnswers] = useState<Record<number, string>>({});
  const [gameXpAwarded, setGameXpAwarded] = useState(false);
  const [recentAnswerId, setRecentAnswerId] = useState<string | null>(null);
  const [visibleSolutions, setVisibleSolutions] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<TabId>('explanation');
  const [selectedExampleTier, setSelectedExampleTier] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showRevisionSheet, setShowRevisionSheet] = useState(false);
  const [showParentInfo, setShowParentInfo] = useState(false);
  const enablePrintablePDFs = useFeatureFlag('enablePrintablePDFs');

  // Text-to-speech read-aloud — 1AP/2AP/3AP students are still learning to read, so a giant speaker
  // button reads the lesson's title/summary/rules out loud via the browser's built-in Arabic voice.
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeech = () => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel(); // clear any stray queued utterance first
    // Tashkeel (diacritics) genuinely improves Arabic TTS pronunciation, so this reads the lesson's
    // raw text regardless of the tashkeelEnabled display toggle — that prop only affects what's shown.
    const textToRead = [lesson.titleAr, lesson.summaryAr, ...(lesson.rulesAr || [])].filter(Boolean).join('. ');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Per-block read-aloud for "الكورس المفصّل" (vocabulary/common mistakes/takeaway) — the main
  // handleToggleSpeech button above only ever reads titleAr/summaryAr/rulesAr, leaving this section
  // (often the longest) unreachable for a child who can't read it. Deliberately no play/pause state
  // of its own — a fresh tap always interrupts whatever's playing, same as the main button's cancel().
  const speakBlock = (text: string) => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Small 🔊 button next to one content block, same isYoungGrade gate as the main read-aloud button
  // above (1AP-3AP only — older students read fine and don't need it cluttering every block).
  const renderSpeakButton = (text: string | undefined, label: string) =>
    isYoungGrade && text ? (
      <button
        type="button"
        onClick={() => speakBlock(text)}
        title={`استمع: ${label}`}
        className="shrink-0 w-7 h-7 rounded-full bg-[var(--brand-blue)]/15 hover:bg-[var(--brand-blue)]/25 text-[var(--brand-blue-dark)] flex items-center justify-center cursor-pointer text-sm"
      >
        🔊
      </button>
    ) : null;

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

  // Latest-values ref for checkPracticeExercise/resetPracticeExercise below — set directly during
  // render (not in a useEffect, so there's no post-commit lag) so those two callbacks can stay
  // referentially stable (useCallback with an empty dep array) without going stale. Stability here is
  // what lets <PracticeExerciseCard>'s React.memo actually skip re-renders — a new onCheck/onReset
  // reference on every keystroke elsewhere would defeat it regardless of any other prop being stable.
  const practiceStateRef = useRef({ practiceAnswers, matchingConnections, orderingSelections, awardedExerciseIds });
  practiceStateRef.current = { practiceAnswers, matchingConnections, orderingSelections, awardedExerciseIds };

  const checkPracticeExercise = useCallback((ex: NonNullable<CourseLesson['progressiveExercises']>[number]) => {
    const { practiceAnswers, matchingConnections, orderingSelections, awardedExerciseIds } = practiceStateRef.current;
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
  }, [lesson.id, onCompleteQuiz]);

  const resetPracticeExercise = useCallback((ex: NonNullable<CourseLesson['progressiveExercises']>[number]) => {
    setPracticeChecked((prev) => ({ ...prev, [ex.id]: false }));
    setPracticeAnswers((prev) => ({ ...prev, [ex.id]: '' }));
    if (ex.type === 'matching') {
      setMatchingConnections((prev) => ({ ...prev, [ex.id]: {} }));
      setMatchingSelectedLeft((prev) => ({ ...prev, [ex.id]: null }));
    }
    if (ex.type === 'ordering') {
      setOrderingSelections((prev) => ({ ...prev, [ex.id]: [] }));
    }
  }, []);

  // Generic, exId-taking setters for <PracticeExerciseCard> — stable across renders (empty dep array,
  // pure functional state updates) so passing them as props never defeats PracticeExerciseCard's
  // React.memo. Shared identically by the tiered practice section and the final evaluation section
  // (exercise ids are unique across both).
  const handlePracticeAnswerChange = useCallback((exId: string, value: string | number) => {
    setPracticeAnswers((prev) => ({ ...prev, [exId]: value }));
  }, []);
  const handleMatchingSelectLeft = useCallback((exId: string, leftIdx: number | null) => {
    setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: leftIdx }));
  }, []);
  const handleConnectMatching = useCallback((exId: string, leftIdx: number, rightIdx: number) => {
    setMatchingConnections((prev) => ({ ...prev, [exId]: { ...(prev[exId] || {}), [leftIdx]: rightIdx } }));
    setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: null }));
  }, []);
  const handleDisconnectMatching = useCallback((exId: string, leftIdx: number) => {
    setMatchingConnections((prev) => {
      const next = { ...(prev[exId] || {}) };
      delete next[leftIdx];
      return { ...prev, [exId]: next };
    });
  }, []);
  const handleToggleOrderingItem = useCallback((exId: string, originalIdx: number) => {
    setOrderingSelections((prev) => {
      const cur = prev[exId] || [];
      if (cur.includes(originalIdx)) return { ...prev, [exId]: cur.filter((i) => i !== originalIdx) };
      return { ...prev, [exId]: [...cur, originalIdx] };
    });
  }, []);

  // Final evaluation summary — reuses the exact same practiceChecked/practiceCorrect state as the
  // tiered practice exercises (exercise ids are unique across the two lists).
  const evaluationExercises = lesson.evaluationExercises || [];
  const evaluationCheckedCount = evaluationExercises.filter((ex) => practiceChecked[ex.id]).length;
  const evaluationCorrectCount = evaluationExercises.filter((ex) => practiceChecked[ex.id] && practiceCorrect[ex.id]).length;
  const evaluationComplete = evaluationExercises.length > 0 && evaluationCheckedCount === evaluationExercises.length;
  const evaluationScorePercent = evaluationExercises.length > 0 ? Math.round((evaluationCorrectCount / evaluationExercises.length) * 100) : 0;

  // Determine effective interactive tool for the lesson. Math and science were audited (2026) for
  // interactiveTool relevance: a subject-wide default here produced mismatched tools (e.g. geometry
  // shapes on a clock-reading lesson, or the arabic writing canvas on an art-themed civics lesson).
  // Every subject has now been through this audit (2026) and every lesson explicitly sets
  // interactiveTool when a relevant tool exists — an unset interactiveTool means the lesson
  // genuinely has no dedicated tool, not "guess one from the subject".
  const effectiveTool = lesson.interactiveTool;

  // A lab-style tool renders nothing without its per-lesson config (see the `&&` guards below), so
  // the tab itself must stay hidden in that case too — otherwise clicking it shows an empty screen.
  const toolRequiresConfig: Partial<Record<string, boolean>> = {
    science_lab: !!lesson.gameplay_simulation,
    math_lab: !!lesson.mathInteractive,
    islamic_lab: !!lesson.islamicInteractive,
    civics_lab: !!lesson.civicsInteractive,
    history_geo_lab: !!lesson.historyGeoInteractive,
    french_dialogue_lab: !!lesson.languageInteractive,
    english_dialogue_lab: !!lesson.languageInteractive,
  };
  const hasRenderableInteractiveTool = !!effectiveTool && (toolRequiresConfig[effectiveTool] ?? true);

  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  // Same normalization as renderArabicText, but also isolates embedded math expressions
  // (e.g. "(3 + 5) × 2") in a fixed-LTR span so bidi reordering doesn't mirror the parentheses.
  const renderArabicMath = (text: string | undefined | null): React.ReactNode => {
    return renderTextWithMath(renderArabicText(text));
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
    setAwardedQuizIds(new Set());
    setRecentAnswerId(null);
    setSelectedExampleTier(1);
    setActiveTab('explanation');
    setPracticeAnswers({});
    setPracticeChecked({});
    setPracticeCorrect({});
    setAwardedExerciseIds(new Set());
    setMatchingConnections({});
    setMatchingSelectedLeft({});
    setOrderingSelections({});
    setGameAnswers({});
    setGameXpAwarded(false);

    // Never let a read-aloud from the previous lesson keep playing after navigating away.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);

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

    // Also stop any read-aloud in progress if the whole viewer unmounts (e.g. "back to lesson list").
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  // Auto-clear the transient "just answered" marker that triggers the confetti burst.
  useEffect(() => {
    if (!recentAnswerId) return;
    const t = setTimeout(() => setRecentAnswerId(null), 900);
    return () => clearTimeout(t);
  }, [recentAnswerId]);

  // Immediate per-question feedback: selecting an option locks that question in right away
  // (no separate "submit" step), awards XP the moment a question is first answered correctly,
  // and triggers the correct/incorrect spring animation for that question only.
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (selectedAnswers[questionId] !== undefined) return; // already locked
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    const currentQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
    const question = currentQuiz.find((q) => q.id === questionId);
    const correctOpt = question?.options.find((o) => o.isCorrect);
    const isCorrect = !!correctOpt && correctOpt.id === optionId;
    setRecentAnswerId(questionId);
    // Multisensory feedback — visual badge/confetti alone leaves the pre-readers this quiz is aimed
    // at (same audience as the TTS button above) without confirmation during the page's most frequent
    // interaction.
    if (isCorrect) playSuccessChime(); else playGentleNudge();
    if (isCorrect && !awardedQuizIds.has(questionId)) {
      onCompleteQuiz(lesson.id, quizAlreadyValidated ? 5 : 15);
      const newAwarded = new Set(awardedQuizIds).add(questionId);
      setAwardedQuizIds(newAwarded);

      // First time every question in the quiz has been answered correctly — lock in the reduced-XP rule for good.
      if (!quizAlreadyValidated && newAwarded.size === currentQuiz.length) {
        onQuizFullyValidated?.(lesson.id);
      }
    }
  };

  const handleSelectGameOption = (itemIndex: number, optionAr: string) => {
    if (gameAnswers[itemIndex] !== undefined) return; // already locked
    setGameAnswers((prev) => {
      const next = { ...prev, [itemIndex]: optionAr };
      const game = lesson.educationalGame;
      if (game && !gameXpAwarded && Object.keys(next).length === game.items.length) {
        const allCorrect = game.items.every((item, i) => next[i] === item.correctAnswerAr);
        if (allCorrect) {
          setGameXpAwarded(true);
          onCompleteQuiz(lesson.id, game.xpReward);
        }
      }
      return next;
    });
  };

  // Dynamically compute the exact steps available for this lesson (matching the header perfectly)
  const availableSteps = React.useMemo(() => {
    const steps: {
      id: TabId;
      labelAr: string;
      icon: React.ReactNode;
      activeClass: string;
      badgeColor: string;
    }[] = [
      {
        id: 'explanation',
        labelAr: 'شرح الدرس والتطبيقات',
        icon: <Glasses className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-blue)] text-white ring-2 ring-blue-400',
        badgeColor: 'from-blue-600 to-indigo-600',
      },
      {
        id: 'content',
        labelAr: 'الملخص والقواعد',
        icon: <BookOpen className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400',
        badgeColor: 'from-emerald-600 to-teal-700',
      },
    ];

    if (hasRenderableInteractiveTool) {
      steps.push({
        id: 'interactive',
        labelAr: 'الأداة التفاعلية المخصصة',
        icon: <Sparkles className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400',
        badgeColor: 'from-amber-500 to-orange-600',
      });
    }

    if (lesson.progressiveExercises && lesson.progressiveExercises.length > 0) {
      steps.push({
        id: 'practice',
        labelAr: `أتدرب (${lesson.progressiveExercises.length})`,
        icon: <Award className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400',
        badgeColor: 'from-amber-500 to-yellow-600',
      });
    }

    if (lesson.gameplay_simulation) {
      steps.push({
        id: 'gameplay',
        labelAr: 'لعبة المحاكاة التفاعلية',
        icon: <Gamepad2 className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-blue)] text-white ring-2 ring-sky-400',
        badgeColor: 'from-purple-600 to-indigo-600',
      });
    }

    if (evaluationExercises.length > 0) {
      steps.push({
        id: 'evaluation',
        labelAr: `التقييم النهائي (${evaluationExercises.length})`,
        icon: <ClipboardCheck className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-coral)] text-white ring-2 ring-rose-400',
        badgeColor: 'from-rose-500 to-pink-600',
      });
    }

    if (lesson.quiz.length > 0) {
      steps.push({
        id: 'quiz',
        labelAr: `الاختبار التفاعلي (${lesson.quiz.length})`,
        icon: <Trophy className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400',
        badgeColor: 'from-emerald-500 to-teal-600',
      });
    }

    return steps;
  }, [hasRenderableInteractiveTool, lesson.progressiveExercises, lesson.gameplay_simulation, evaluationExercises.length, lesson.quiz.length]);

  const currentStepIndex = Math.max(0, availableSteps.findIndex((s) => s.id === activeTab));
  const isLastStep = currentStepIndex >= availableSteps.length - 1;
  const nextStep = !isLastStep ? availableSteps[currentStepIndex + 1] : null;
  const prevStep = currentStepIndex > 0 ? availableSteps[currentStepIndex - 1] : null;
  
  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(availableSteps.length - 1, index));
    if (availableSteps[clamped]) {
      setActiveTab(availableSteps[clamped].id);
      setTimeout(() => {
        const topEl = document.getElementById('lesson-active-step-container');
        if (topEl) {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRecentAnswerId(null);
    // Letting these be answered again is safe against XP farming: quizAlreadyValidated (persisted
    // in the profile, survives this reset and even leaving/reopening the lesson) caps every
    // question at 5 XP instead of 15 once the quiz has been fully passed once.
    setAwardedQuizIds(new Set());
    initializeShuffledQuiz(); // Re-shuffle options for new randomized positions
  };

  // Intercepts the render for a shell lesson still resolving (or denied) its server-side content —
  // every hook above has already run unconditionally, so this early return is safe.
  if (lessonProp.premiumContentPending && premiumFetchState !== 'done') {
    return (
      <div className="space-y-6 dir-rtl" dir="rtl">
        <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} onClick={onBack}>
          قائمة الدروس
        </Button>
        {premiumFetchState === 'loading' && <LoadingFallback label="جاري تحميل محتوى الدرس..." />}
        {premiumFetchState === 'forbidden' && (
          <Card padding="lg" className="text-center space-y-4">
            <Lock className="w-10 h-10 mx-auto text-[var(--brand-amber)]" />
            <h2 className="text-base font-black text-[var(--app-text)]">{renderArabicText(lesson.titleAr)}</h2>
            <p className="text-sm text-[var(--app-text-muted)] max-w-md mx-auto">
              هذا الدرس ضمن محتوى الفصلين الثاني والثالث، وهو متاح فقط للمشتركين في mssid dz Premium.
            </p>
            <Button variant="ghost" size="sm" onClick={onBack}>
              العودة لقائمة الدروس
            </Button>
          </Card>
        )}
        {premiumFetchState === 'error' && (
          <Card padding="lg" className="text-center space-y-4">
            <p className="text-sm text-[var(--app-text-muted)]">تعذر تحميل محتوى الدرس. تحقق من اتصالك وحاول مجدداً.</p>
            <Button variant="outline" size="sm" onClick={onBack}>
              العودة لقائمة الدروس
            </Button>
          </Card>
        )}
      </div>
    );
  }

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
      <Card padding="none" className="flex items-center justify-between flex-wrap gap-3 p-3.5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} onClick={onBack}>
            قائمة الدروس
          </Button>

          {allLessons.length > 0 && currentIndex >= 0 && (
            <Badge variant="info">
              <span dir="ltr">{currentIndex + 1} / {allLessons.length}</span>
              <span>الدرس</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {enablePrintablePDFs && (
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => setShowRevisionSheet(true)}
              title="فيشة مراجعة قابلة للطباعة"
            >
              <span className="hidden sm:inline">فيشة المراجعة</span>
              <span className="sm:hidden">📄</span>
            </Button>
          )}

          {/* Top Quick Next/Prev Controls */}
          {allLessons.length > 1 && (
            <>
              <Button
                variant="outline"
                size="md"
                icon={<ChevronRight className="w-4 h-4" />}
                disabled={!previousLesson}
                onClick={() => previousLesson && onSelectLesson?.(previousLesson)}
                title={previousLesson ? `الدرس السابق: ${renderArabicText(previousLesson.titleAr)}` : 'لا يوجد درس سابق'}
              >
                <span className="hidden sm:inline">الدرس السابق</span>
                <span className="sm:hidden">السابق</span>
              </Button>

              <Button
                variant={isLastStep ? 'info' : 'outline'}
                size="md"
                icon={isLastStep ? <ChevronLeft className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                iconPosition="end"
                disabled={!nextLesson || !isLastStep}
                onClick={() => isLastStep && nextLesson && onSelectLesson?.(nextLesson)}
                title={
                  !isLastStep
                    ? 'أكمل جميع مراحل هذا الدرس للتمكن من الانتقال للدرس التالي 🔒'
                    : nextLesson
                    ? `الدرس التالي: ${renderArabicText(nextLesson.titleAr)}`
                    : 'لا يوجد درس تالي'
                }
              >
                <span className="hidden sm:inline">الدرس التالي</span>
                <span className="sm:hidden">التالي</span>
              </Button>
            </>
          )}
        </div>
      </Card>

      {showRevisionSheet && (
        <RevisionSheetViewer lesson={lesson} onClose={() => setShowRevisionSheet(false)} tashkeelEnabled={tashkeelEnabled} />
      )}

      {/* Read-aloud button — 1AP/2AP/3AP students are still learning to read, so this gives them a
          giant, unmissable way to hear the lesson instead of relying purely on text. */}
      {isYoungGrade && (
        <button
          onClick={handleToggleSpeech}
          className={`w-full min-h-16 rounded-3xl flex items-center justify-center gap-3 text-lg sm:text-xl font-black shadow-lg transition-all cursor-pointer active:scale-[0.98] ${
            isSpeaking
              ? 'bg-[var(--brand-coral)] text-white animate-pulse'
              : 'bg-[var(--brand-amber)] text-slate-950 hover:brightness-105'
          }`}
        >
          <span className="text-2xl">{isSpeaking ? '⏹️' : '🔊'}</span>
          <span>{isSpeaking ? 'إيقاف الاستماع' : 'إستمع للدرس'}</span>
        </button>
      )}

      {/* Lesson Hero Banner — bold, fixed-gradient showcase, intentionally vibrant regardless of theme */}
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
              <Badge variant="xp">
                {'⭐'.repeat(lesson.difficultyTier)} {lesson.difficultyTier === 1 ? 'سهل' : lesson.difficultyTier === 2 ? 'متوسط' : 'متقدم'}
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black mb-3">{renderArabicText(lesson.titleAr)}</h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {renderArabicMath(lesson.summaryAr)}
          </p>
          {lesson.sourceNoteAr && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <button
                onClick={() => setShowParentInfo((v) => !v)}
                aria-expanded={showParentInfo}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>معلومة لولي الأمر</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showParentInfo ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {showParentInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-3xl pt-2">
                      {renderArabicMath(lesson.sourceNoteAr)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Creative mission wrapper (presentation only — never a source of new official notions) */}
      {lesson.missionTitleAr && (
        <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-emerald)] text-white rounded-3xl p-5 shadow-md">
          <h2 className="font-black text-base sm:text-lg mb-1">{renderArabicText(lesson.missionTitleAr)}</h2>
          {lesson.missionIntroAr && <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{renderArabicText(lesson.missionIntroAr)}</p>}
        </div>
      )}

      {/* Learning objectives — "à la fin de cette leçon, je sais..." */}
      {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
        <Card padding="none" className="p-5">
          <h3 className="font-extrabold text-sm text-[var(--app-text)] flex items-center gap-2 mb-2.5">
            <Target className="w-4 h-4 text-[var(--brand-blue)]" />
            <span>في نهاية هذا الدرس، سأكون قادراً على:</span>
          </h3>
          <ul className="space-y-1.5">
            {lesson.objectivesAr.map((obj, i) => (
              <li key={i} className="text-xs sm:text-sm text-[var(--app-text-muted)] flex items-start gap-2">
                <span className="text-[var(--brand-blue)] shrink-0">◆</span>
                <span>{renderArabicMath(obj)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* 4. Unified Step Navigation Header with pastilles and progress */}
      <div id="lesson-active-step-container" className="scroll-mt-20 bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {currentStepIndex + 1}
            </span>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--app-text-muted)] block">
                مراحل الدرس خطوة بخطوة 🎯
              </span>
              <h2 className="text-xs sm:text-sm font-black text-[var(--app-text)]">
                {availableSteps[currentStepIndex]?.labelAr || 'مرحلة الدرس'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[var(--brand-emerald-dark)] bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              الخطوة <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
            </span>
          </div>
        </div>

        {/* Interactive Step Pastilles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2 pt-1">
          {availableSteps.map((step, idx) => {
            const isActive = step.id === activeTab;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`flex items-center justify-between gap-2 min-h-12 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                  isActive
                    ? `${step.activeClass} shadow-md scale-[1.02]`
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="shrink-0">{isCompleted ? '✅' : step.icon}</span>
                  <span className="truncate">{step.labelAr}</span>
                </div>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isActive ? 'bg-white/25 text-white' : isCompleted ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-black/5 dark:bg-white/10'
                }`}>
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content — cross-fades/slides between sections on every switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={tabTransition}
        >
          {/* TAB 0: LESSON EXPLANATION & VULGARISATION */}
          {activeTab === 'explanation' && (
            <LessonExplanationView
              lesson={lesson}
              tashkeelEnabled={tashkeelEnabled}
              availableSteps={availableSteps}
              activeStepId={activeTab}
              onSelectStep={(stepId) => setActiveTab(stepId as TabId)}
            />
          )}

          {/* TAB GAMEPLAY: INTERACTIVE SIMULATION */}
          {activeTab === 'gameplay' && lesson.gameplay_simulation && (
            <Suspense fallback={<LoadingFallback label="جاري تحميل المحاكاة..." />}>
              <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
            </Suspense>
          )}

          {/* TAB PRACTICE: "أتدرب" — exercises grouped by tier (أكتشف/أتدرب/أتقن/التحدي), then the mini-game challenge */}
          {activeTab === 'practice' && lesson.progressiveExercises && (
            <div className="space-y-6">
              {PRACTICE_TIERS.map((tier) => {
                const tierExercises = lesson.progressiveExercises!.filter((ex) => ex.level === tier.level);
                if (tierExercises.length === 0) return null;
                return (
                  <div key={tier.level} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-2">
                      <span className="text-lg">{tier.icon}</span>
                      <h3 className="font-black text-sm text-[var(--app-text)]">{tier.titleAr}</h3>
                      <span className="text-[10px] font-bold text-[var(--app-text-muted)]">({tierExercises.length})</span>
                    </div>
                    <div className="space-y-4">
                      {tierExercises.map((ex) => (
                        <PracticeExerciseCard
                          key={ex.id}
                          ex={ex}
                          renderArabicText={renderArabicText}
                          answer={practiceAnswers[ex.id]}
                          onAnswerChange={handlePracticeAnswerChange}
                          isChecked={!!practiceChecked[ex.id]}
                          isCorrect={!!practiceCorrect[ex.id]}
                          canCheck={canCheckExercise(ex)}
                          onCheck={checkPracticeExercise}
                          onReset={resetPracticeExercise}
                          matchingRightOrder={matchingRightOrder[ex.id] || []}
                          matchingConnections={matchingConnections[ex.id] || {}}
                          matchingSelectedLeft={matchingSelectedLeft[ex.id] ?? null}
                          onMatchingSelectLeft={handleMatchingSelectLeft}
                          onConnectMatching={handleConnectMatching}
                          onDisconnectMatching={handleDisconnectMatching}
                          orderingShuffled={orderingShuffled[ex.id] || []}
                          orderingSelection={orderingSelections[ex.id] || []}
                          onToggleOrderingItem={handleToggleOrderingItem}
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
                    <Badge variant="xp"><span dir="ltr">+{lesson.educationalGame.xpReward} XP</span></Badge>
                  </div>
                  <p className="text-xs text-purple-200">{renderArabicText(lesson.educationalGame.instructionsAr)}</p>
                  <div className="space-y-2">
                    {lesson.educationalGame.items.map((item, i) => {
                      const selected = gameAnswers[i];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === item.correctAnswerAr;
                      return (
                        <div key={i} className="bg-slate-950/60 border border-purple-900/50 rounded-xl p-3 text-xs space-y-2">
                          <p className="font-bold mb-1.5">{renderArabicText(item.questionOrPromptAr)}</p>
                          {item.optionsAr && (
                            <div className="flex gap-2 flex-wrap">
                              {item.optionsAr.map((optAr) => {
                                const isThisCorrect = optAr === item.correctAnswerAr;
                                const isThisSelected = selected === optAr;
                                let style = 'bg-white/10 text-purple-100 hover:bg-white/20 cursor-pointer';
                                if (isAnswered) {
                                  style = isThisCorrect
                                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold'
                                    : isThisSelected
                                    ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50'
                                    : 'bg-white/5 text-purple-300/60';
                                }
                                return (
                                  <button
                                    key={optAr}
                                    type="button"
                                    disabled={isAnswered}
                                    onClick={() => handleSelectGameOption(i, optAr)}
                                    className={`px-2.5 py-1 rounded-lg transition-colors ${style}`}
                                  >
                                    {renderArabicText(optAr)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {isAnswered && item.explanationAr && (
                            <p className={`text-[11px] ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                              {isCorrect ? '✅ ' : '💡 '}{renderArabicText(item.explanationAr)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {Object.keys(gameAnswers).length === lesson.educationalGame.items.length && (
                    <button
                      type="button"
                      onClick={() => setGameAnswers({})}
                      className="text-[11px] font-bold text-purple-200 hover:text-white underline cursor-pointer"
                    >
                      إعادة المحاولة 🔄
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: CONTENT & RULES */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Sciences: question → observation → hypothesis → experiment → result → explanation */}
              {lesson.scientificInquiry && (
                <Suspense fallback={<LoadingFallback label="جاري التحميل..." minHeight="160px" />}>
                  <ScientificInquiryFlow
                    inquiry={lesson.scientificInquiry}
                    renderArabicText={renderArabicText}
                    hasSimulation={!!lesson.gameplay_simulation}
                    onGoToSimulation={() => setActiveTab('gameplay')}
                  />
                </Suspense>
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
                <Card padding="none" className="p-5 sm:p-6 space-y-4">
                  <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[var(--brand-blue)]" />
                    <span>الكورس المفصّل</span>
                  </h3>
                  <div className="flex items-start gap-2 bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)]/25 rounded-2xl p-4">
                    <p className="flex-1 text-sm text-[var(--app-text)] leading-relaxed">
                      {renderArabicText(lesson.detailedCourse.introAr)}
                    </p>
                    {renderSpeakButton(lesson.detailedCourse.introAr, 'المقدمة')}
                  </div>

                  {lesson.detailedCourse.vocabulary && lesson.detailedCourse.vocabulary.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--app-text-muted)] block">📖 كلمات مهمة أتذكرها:</span>
                        {renderSpeakButton(
                          lesson.detailedCourse.vocabulary.map((v) => `${v.termAr}. ${v.definitionAr}`).join('. '),
                          'الكلمات المهمة'
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {lesson.detailedCourse.vocabulary.map((v, i) => (
                          <div key={i} className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-xl p-3 text-xs">
                            <span className="font-black text-[var(--brand-blue-dark)] block">{renderArabicText(v.termAr)}</span>
                            <span className="text-[var(--app-text-muted)]">{renderArabicText(v.definitionAr)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lesson.detailedCourse.visualizationHintAr && (
                    <p className="text-xs text-[var(--brand-blue-dark)] bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)]/25 rounded-xl p-3 flex items-start gap-2">
                      <span>🖼️</span>
                      <span>{renderArabicText(lesson.detailedCourse.visualizationHintAr)}</span>
                    </p>
                  )}

                  {lesson.detailedCourse.commonMistakes && lesson.detailedCourse.commonMistakes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--brand-coral-dark)] block">⚠️ أخطاء شائعة يجب الانتباه إليها:</span>
                        {renderSpeakButton(
                          lesson.detailedCourse.commonMistakes
                            .map((m) => `خطأ شائع: ${m.mistakeAr}. الصواب: ${m.correctionAr}`)
                            .join('. '),
                          'الأخطاء الشائعة'
                        )}
                      </div>
                      {lesson.detailedCourse.commonMistakes.map((m, i) => (
                        <div key={i} className="bg-[var(--brand-coral)]/10 border border-[var(--brand-coral)]/25 rounded-xl p-3 text-xs space-y-1">
                          <p className="text-[var(--brand-coral-dark)]"><span className="font-bold">❌ </span>{renderArabicText(m.mistakeAr)}</p>
                          <p className="text-[var(--brand-emerald-dark)]"><span className="font-bold">✅ </span>{renderArabicText(m.correctionAr)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-start gap-2 bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/35 rounded-2xl p-4 text-sm font-bold text-[var(--brand-amber-dark)]">
                    <span className="flex-1">💡 أتذكر: {renderArabicText(lesson.detailedCourse.takeawayAr)}</span>
                    {renderSpeakButton(lesson.detailedCourse.takeawayAr, 'ملخص أتذكر')}
                  </div>
                </Card>
              )}

              {/* 5-tier progressive worked examples */}
              {lesson.progressiveWorkedExamples && lesson.progressiveWorkedExamples.length > 0 && (
                <Card padding="none" className="p-5 sm:p-6 space-y-4">
                  <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[var(--brand-amber)]" />
                    <span>أمثلة متدرّجة (من الأسهل إلى التحدي)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lesson.progressiveWorkedExamples.map((ex) => (
                      <button
                        key={ex.tier}
                        onClick={() => setSelectedExampleTier(ex.tier)}
                        className={`min-h-10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedExampleTier === ex.tier
                            ? 'bg-[var(--brand-amber)] text-slate-950 font-black shadow-xs'
                            : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:opacity-80'
                        }`}
                      >
                        {ex.labelAr}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {(() => {
                      const activeExample = lesson.progressiveWorkedExamples!.find((ex) => ex.tier === selectedExampleTier) || lesson.progressiveWorkedExamples![0];
                      return (
                        <motion.div
                          key={selectedExampleTier}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={tabTransition}
                          className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-2xl p-4 space-y-2"
                        >
                          <p className="text-xs sm:text-sm font-bold text-[var(--app-text)] whitespace-pre-line">
                            {activeExample.isRealLife && <span className="text-[var(--brand-emerald)]">🏠 </span>}
                            {renderArabicText(activeExample.problem)}
                          </p>
                          {activeExample.stepsAr && activeExample.stepsAr.length > 0 && (
                            <ol className="list-decimal list-inside text-xs text-[var(--app-text-muted)] space-y-1 pr-1">
                              {activeExample.stepsAr.map((step, i) => (
                                <li key={i}>{renderArabicText(step)}</li>
                              ))}
                            </ol>
                          )}
                          <div className="bg-[var(--brand-emerald)]/10 border border-[var(--brand-emerald)]/30 rounded-xl p-3 text-xs text-[var(--brand-emerald-dark)] whitespace-pre-line">
                            <span className="font-bold">✅ الحل: </span>
                            {renderArabicText(activeExample.solution)}
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </Card>
              )}

              {/* Golden Rules with Detailed Explanations & Simple Examples */}
              <Card padding="none" className="p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[var(--app-text)] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--brand-emerald)]" />
                      <span>القواعد الذهبية للدرس مدعومة بالأمثلة المبسطة</span>
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)] font-sans mt-0.5">
                      شرح ميسر لكل قاعدة مع أمثلة تطبيقية مباشرة لترسيخ الفهم
                    </p>
                  </div>
                  <Badge variant="success">
                    {lesson.rulesAr.length} قواعد أساسية
                  </Badge>
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
                      <div key={idx} className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-2xl p-4 sm:p-5 space-y-3 hover:border-[var(--brand-emerald)]/60 transition-all">
                        {/* Rule Header */}
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[var(--brand-emerald)] text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {idx + 1}
                          </span>
                          <div className="space-y-1">
                            {title && (
                              <h4 className="font-black text-sm sm:text-base text-[var(--app-text)] flex items-center gap-2">
                                <span>{title}</span>
                              </h4>
                            )}
                            <p className="text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed font-semibold whitespace-pre-line">
                              {formatEducationalText(renderArabicText(body))}
                            </p>
                          </div>
                        </div>

                        {/* Simple Practical Example Card */}
                        <div className="bg-[var(--brand-emerald)]/10 border border-[var(--brand-emerald)]/25 rounded-xl p-3.5 text-xs text-[var(--app-text)] font-sans space-y-1.5 mr-0 sm:mr-11">
                          <div className="flex items-center gap-1.5 font-extrabold text-[var(--brand-emerald-dark)] text-xs">
                            <Lightbulb className="w-4 h-4 text-[var(--brand-amber)] shrink-0" />
                            <span>📌 مثال تطبيقي مبسط ومباشر:</span>
                          </div>

                          <div className="bg-[var(--app-card-bg)] p-3 rounded-lg border border-[var(--brand-emerald)]/25 text-[var(--app-text)] font-medium leading-relaxed font-sans whitespace-pre-line">
                            {matchingExample ? (
                              <span>
                                <strong className="text-[var(--brand-emerald-dark)]">التطبيق: </strong>
                                {formatEducationalText(matchingExample.problem)}
                                <br />
                                <strong className="text-[var(--brand-blue-dark)]">الحل والنتيجة: </strong>
                                <span className="text-[var(--brand-blue-dark)] font-bold">{formatEducationalText(matchingExample.solution)}</span>
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
              </Card>

              {/* Key Formulas Grid if available */}
              {lesson.keyFormulas && lesson.keyFormulas.length > 0 && (
                <Card padding="none" className="p-5 space-y-3">
                  <h3 className="font-extrabold text-sm text-[var(--app-text)] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--brand-amber)]" />
                    <span>القوانين والعبارات المفتاحية للدرس:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lesson.keyFormulas.map((kf, kIdx) => (
                      <div key={kIdx} className="bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/25 p-4 rounded-2xl space-y-1.5">
                        <span className="text-xs font-extrabold text-[var(--brand-amber-dark)] block">{kf.labelAr}</span>
                        {/* dir="ltr": formulas are numeric/symbolic content, isolated to avoid bidi reordering */}
                        <span dir="ltr" className="text-xs sm:text-sm font-mono font-black text-[var(--app-text)] block bg-[var(--app-card-bg)] p-2.5 rounded-xl border border-[var(--brand-amber)]/25 shadow-2xs whitespace-pre-line text-right">
                          {formatEducationalText(kf.formulaAr)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Worked Examples if available */}
              {lesson.examplesAr && lesson.examplesAr.length > 0 && (
                <Card padding="none" className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[var(--brand-emerald)]" />
                        <span>أمثلة وتمارين نموذجية محلولة بالتفصيل</span>
                      </h3>
                      <p className="text-xs text-[var(--app-text-muted)]">
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
                          <motion.button
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 1 }}
                            onClick={() =>
                              setVisibleSolutions((prev) => ({
                                ...prev,
                                [exIdx]: !prev[exIdx],
                              }))
                            }
                            className="min-h-12 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 cursor-pointer shadow-xs"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                            <span>{isVisible ? 'إخفاء الحل النموذجي' : 'إظهار الحل النموذجي المفصل 💡'}</span>
                          </motion.button>

                          {!isVisible && (
                            <span className="text-[11px] text-slate-400 italic">
                              🔒 الحل مخفي للتفكير الشخصي
                            </span>
                          )}
                        </div>

                        <AnimatePresence>
                          {isVisible && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={tabTransition}
                              className="text-xs sm:text-sm text-emerald-200 font-sans border-t border-emerald-900/60 pt-3 leading-relaxed bg-emerald-950/80 p-4 rounded-xl border border-emerald-800/80 whitespace-pre-line overflow-hidden"
                            >
                              <span className="font-extrabold text-amber-300 block mb-1">💡 الحل والتبسيط النموذجي:</span>
                              {formatEducationalText(renderArabicText(ex.solution))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE TOOL */}
          {activeTab === 'interactive' && hasRenderableInteractiveTool && (
            <Suspense fallback={<LoadingFallback label="جاري تحميل الأداة التفاعلية..." />}>
              <div className="space-y-4">
                {effectiveTool === 'arabic_canvas' && <ArabicCanvasInteractive lesson={lesson} grade={lesson.grade} />}
                {effectiveTool === 'soroban' && <SorobanInteractive grade={lesson.grade} />}
                {effectiveTool === 'unit_converter' && <UnitConverter grade={lesson.grade} />}
                {effectiveTool === 'geometry_visualizer' && <GeometryVisualizer grade={lesson.grade} />}
                {effectiveTool === 'science_lab' && lesson.gameplay_simulation && (
                  <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
                )}
                {effectiveTool === 'arabic_conjugator' && <ArabicConjugator grade={lesson.grade} />}
                {effectiveTool === 'multiplication_table' && <MultiplicationTableInteractive grade={lesson.grade} />}
                {effectiveTool === 'french_lab' && <FrenchLanguageLab grade={lesson.grade} />}
                {effectiveTool === 'english_lab' && <EnglishLanguageLab grade={lesson.grade} />}
                {effectiveTool === 'history_geo_lab' && lesson.historyGeoInteractive && <HistoryGeoInteractive config={lesson.historyGeoInteractive} />}
                {effectiveTool === 'islamic_lab' && lesson.islamicInteractive && <IslamicEducationInteractive config={lesson.islamicInteractive} />}
                {effectiveTool === 'civics_lab' && lesson.civicsInteractive && <CivicsInteractive config={lesson.civicsInteractive} />}
                {effectiveTool === 'math_lab' && lesson.mathInteractive && <MathInteractive config={lesson.mathInteractive} />}
                {effectiveTool === 'french_dialogue_lab' && lesson.languageInteractive && <LanguageLabInteractive config={lesson.languageInteractive} subject="french" />}
                {effectiveTool === 'english_dialogue_lab' && lesson.languageInteractive && <LanguageLabInteractive config={lesson.languageInteractive} subject="english" />}
              </div>
            </Suspense>
          )}

          {/* TAB: FINAL EVALUATION — mixed exercise types, difficulty progression, then a self-check summary */}
          {activeTab === 'evaluation' && evaluationExercises.length > 0 && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-rose-950 to-slate-900 text-white rounded-3xl p-5 border border-rose-800/50">
                <h3 className="font-black text-sm flex items-center gap-2 mb-1">
                  <ClipboardCheck className="w-5 h-5 text-rose-300" />
                  <span>التقييم النهائي للدرس</span>
                </h3>
                <p className="text-xs text-rose-200">أجب عن كل الأسئلة للتحقق من إتقانك للدرس. لا بأس بالخطأ — المهم أن تتعلم من التصحيح!</p>
                {evaluationCheckedCount > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-emerald-400 h-full rounded-full"
                        initial={false}
                        animate={{ width: `${(evaluationCheckedCount / evaluationExercises.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                      />
                    </div>
                    <span dir="ltr" className="text-[11px] font-bold text-rose-200 shrink-0">{evaluationCheckedCount}/{evaluationExercises.length}</span>
                  </div>
                )}
              </div>

              {evaluationExercises.map((ex) => (
                <PracticeExerciseCard
                  key={ex.id}
                  ex={ex}
                  renderArabicText={renderArabicText}
                  answer={practiceAnswers[ex.id]}
                  onAnswerChange={handlePracticeAnswerChange}
                  isChecked={!!practiceChecked[ex.id]}
                  isCorrect={!!practiceCorrect[ex.id]}
                  canCheck={canCheckExercise(ex)}
                  onCheck={checkPracticeExercise}
                  onReset={resetPracticeExercise}
                  matchingRightOrder={matchingRightOrder[ex.id] || []}
                  matchingConnections={matchingConnections[ex.id] || {}}
                  matchingSelectedLeft={matchingSelectedLeft[ex.id] ?? null}
                  onMatchingSelectLeft={handleMatchingSelectLeft}
                  onConnectMatching={handleConnectMatching}
                  onDisconnectMatching={handleDisconnectMatching}
                  orderingShuffled={orderingShuffled[ex.id] || []}
                  orderingSelection={orderingSelections[ex.id] || []}
                  onToggleOrderingItem={handleToggleOrderingItem}
                />
              ))}

              {/* Self-check summary + remediation, shown once every question has been answered */}
              <AnimatePresence>
                {evaluationComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className={`rounded-3xl p-5 border space-y-3 ${
                      evaluationScorePercent >= 60
                        ? 'bg-[var(--brand-emerald)]/10 border-[var(--brand-emerald)]/30'
                        : 'bg-[var(--brand-amber)]/10 border-[var(--brand-amber)]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-black text-sm text-[var(--app-text)]">📊 نتيجتك: <span dir="ltr">{evaluationCorrectCount}/{evaluationExercises.length} ({evaluationScorePercent}%)</span></h4>
                      <Badge variant="xp"><span dir="ltr">+{evaluationExercises.filter((ex) => practiceCorrect[ex.id]).reduce((sum, ex) => sum + ex.xpReward, 0)} XP</span></Badge>
                    </div>
                    {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-extrabold text-[var(--app-text)] block">أهداف هذا الدرس:</span>
                        {lesson.objectivesAr.map((obj, i) => (
                          <p key={i} className="text-xs text-[var(--app-text-muted)] flex items-center gap-1.5">
                            <span>{evaluationScorePercent >= 60 ? '✅' : '🌱'}</span>
                            <span>{renderArabicText(obj)}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {evaluationScorePercent < 60 && (
                      <p className="text-xs text-[var(--brand-amber-dark)] bg-[var(--brand-amber)]/15 border border-[var(--brand-amber)]/35 rounded-xl p-2.5">
                        💡 لا بأس، هذا جزء طبيعي من التعلّم! راجع "الكورس المفصّل" و"الأمثلة" في تبويب "الملخص والقواعد"، ثم أعد المحاولة — أنت تقترب من الإتقان خطوة بخطوة.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 3: QUIZ — immediate per-question feedback with live XP tracking */}
          {activeTab === 'quiz' && lesson.quiz.length > 0 && (() => {
            const activeQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
            const totalQuestions = activeQuiz.length;
            const answeredCount = Object.keys(selectedAnswers).length;
            const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

            let correctCount = 0;
            activeQuiz.forEach((q) => {
              const selected = selectedAnswers[q.id];
              const correctOpt = q.options.find((o) => o.isCorrect);
              if (selected && correctOpt && selected === correctOpt.id) {
                correctCount++;
              }
            });

            const quizComplete = totalQuestions > 0 && answeredCount === totalQuestions;
            const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

            return (
              <Card padding="none" className="p-5 sm:p-6 space-y-6">
                {/* Quiz Top Bar */}
                <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[var(--app-text)] flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[var(--brand-amber)]" />
                      <span>الاختبار التفاعلي المتقدم</span>
                    </h3>
                    <p className="text-xs text-[var(--app-text-muted)]">
                      كل سؤال يُصحَّح فور اختيار إجابته — خيار الإجابات مخلّط عشوائياً لضمان الفهم الحقيقي
                    </p>
                  </div>

                  <Button variant="outline" size="sm" icon={<Shuffle className="w-3.5 h-3.5 text-[var(--brand-blue)]" />} disabled={quizComplete} onClick={initializeShuffledQuiz} title="إعادة خلط أماكن الإجابات عشوائياً">
                    خلط الخيارات 🎲
                  </Button>
                </div>

                {/* Live XP progress — updates in real time as questions are answered correctly */}
                <XPProgressBar currentXp={correctCount * 15} maxXp={totalQuestions * 15} showLabel />

                {/* Score Summary Card (once every question has been answered) */}
                <AnimatePresence>
                  {quizComplete && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/80 space-y-4 shadow-md"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                            <Award className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                              <span>نتيجة الاختبار:</span>
                              <span dir="ltr" className="text-amber-300 font-mono font-black text-xl">{scorePercentage}%</span>
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

                        <Button variant="accent" size="sm" icon={<RotateCcw className="w-4 h-4" />} onClick={handleResetQuiz}>
                          إعادة الاختبار وخلط الخيارات 🔄
                        </Button>
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
                          <span dir="ltr" className="text-amber-300 font-black text-sm">+{correctCount * 15} XP</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Questions List */}
                <div className="space-y-6">
                  {activeQuiz.map((q, qIdx) => {
                    const selected = selectedAnswers[q.id];
                    const isAnswered = selected !== undefined;
                    const correctOpt = q.options.find((o) => o.isCorrect);
                    const isUserCorrect = !!selected && !!correctOpt && selected === correctOpt.id;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-colors space-y-4 ${
                          isAnswered
                            ? isUserCorrect
                              ? 'border-[var(--brand-emerald)]/40 bg-[var(--brand-emerald)]/5'
                              : 'border-[var(--brand-coral)]/40 bg-[var(--brand-coral)]/5'
                            : 'border-[var(--app-card-border)] bg-[var(--app-card-subtle)]'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-[var(--app-text)]">
                            <span className="w-7 h-7 rounded-xl bg-[var(--brand-blue)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {qIdx + 1}
                            </span>
                            <span>{q.questionAr}</span>
                          </div>

                          {isAnswered && (
                            <span className="relative shrink-0">
                              {isUserCorrect && recentAnswerId === q.id && <ConfettiBurst />}
                              <motion.span
                                key={`badge-${q.id}`}
                                initial={isUserCorrect ? { scale: 0, rotate: -10, opacity: 0 } : { x: 0 }}
                                animate={isUserCorrect ? { scale: 1, rotate: 0, opacity: 1 } : { x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                                transition={isUserCorrect ? { type: 'spring', stiffness: 500, damping: 15 } : { duration: 0.5 }}
                                className={`text-[11px] font-black px-3 py-1 rounded-full border flex items-center gap-1 ${
                                  isUserCorrect
                                    ? 'bg-[var(--brand-emerald)]/15 text-[var(--brand-emerald-dark)] border-[var(--brand-emerald)]/40'
                                    : 'bg-[var(--brand-coral)]/15 text-[var(--brand-coral-dark)] border-[var(--brand-coral)]/40'
                                }`}
                              >
                                {isUserCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>إجابة صحيحة</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>إجابة خاطئة</span>
                                  </>
                                )}
                              </motion.span>
                            </span>
                          )}
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isOptSelected = selected === opt.id;
                            let btnStyle = 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] hover:border-[var(--brand-blue)]/50 text-[var(--app-text)]';

                            if (isAnswered) {
                              if (opt.isCorrect) {
                                btnStyle = 'bg-[var(--brand-emerald)]/15 border-[var(--brand-emerald)] text-[var(--brand-emerald-dark)] font-extrabold shadow-xs';
                              } else if (isOptSelected && !opt.isCorrect) {
                                btnStyle = 'bg-[var(--brand-coral)]/15 border-[var(--brand-coral)] text-[var(--brand-coral-dark)] font-bold';
                              } else {
                                btnStyle = 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text-muted)] opacity-60';
                              }
                            }

                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleSelectOption(q.id, opt.id)}
                                disabled={isAnswered}
                                className={`min-h-12 text-right p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                                  isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                                } ${btnStyle}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {/* Option Arabic Label (أ، ب، ج، د) */}
                                  <span
                                    className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 border ${
                                      isAnswered && opt.isCorrect
                                        ? 'bg-[var(--brand-emerald)] text-white border-[var(--brand-emerald-dark)]'
                                        : isOptSelected
                                        ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue-dark)]'
                                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-card-border)]'
                                    }`}
                                  >
                                    {optionLetters[optIdx] || optIdx + 1}
                                  </span>
                                  <span>{renderArabicText(opt.textAr)}</span>
                                </div>

                                {isAnswered && opt.isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-[var(--brand-emerald)] shrink-0" />
                                )}
                                {isAnswered && isOptSelected && !opt.isCorrect && (
                                  <XCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Post-answer Explanation Box */}
                        <AnimatePresence>
                          {isAnswered && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={tabTransition}
                              className="bg-[var(--app-card-bg)] p-3.5 rounded-xl border border-[var(--app-card-border)] text-xs text-[var(--app-text)] space-y-1 font-sans leading-relaxed overflow-hidden"
                            >
                              <span className="font-extrabold text-[var(--brand-blue-dark)] block flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
                                <span>التفسير والشرح العلمي للحل:</span>
                              </span>
                              <p className="text-[var(--app-text)] font-medium">
                                {renderArabicText(
                                  q.options.find((o) => o.isCorrect)?.explanationAr ||
                                    q.options.find((o) => o.id === selected)?.explanationAr ||
                                    'الإجابة الصحيحة تم اختيارها استناداً لقاعدة الدرس الذهبية.',
                                )}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom status line */}
                {!quizComplete ? (
                  <div className="text-xs font-bold text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] p-3.5 rounded-xl border border-[var(--app-card-border)] text-center">
                    <span dir="ltr">{answeredCount} / {totalQuestions}</span> أسئلة أُجيب عنها — تابع الإجابة لرؤية تقدمك مباشرة
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[var(--brand-emerald-dark)] font-bold text-xs bg-[var(--brand-emerald)]/10 p-3.5 rounded-xl border border-[var(--brand-emerald)]/30 w-full justify-between flex-wrap">
                    <span>تهانينا! تم احتساب النقاط وإضافتها إلى رصيدك الدراسي.</span>
                    <Button variant="outline" size="sm" onClick={handleResetQuiz}>
                      إعادة الاختبار بخلط جديد 🎲
                    </Button>
                  </div>
                )}
              </Card>
            );
          })()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Step-by-Step Lesson Progress & Navigation Footer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* Step Progress Info Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border border-emerald-500/20">
              <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
            </div>
            <div>
              <span className="text-[var(--app-text)] font-extrabold text-xs sm:text-sm block">
                المرحلة {currentStepIndex + 1} من {availableSteps.length}: {availableSteps[currentStepIndex]?.labelAr} 🎯
              </span>
              <span className="text-[var(--app-text-muted)] text-[11px] font-bold">
                {!isLastStep
                  ? `الخطوة التالية: ${nextStep?.labelAr} (بقي ${availableSteps.length - (currentStepIndex + 1)} مراحل)`
                  : 'أحسنت يا بطل! أتممت جميع مراحل هذا الدرس 🏆'}
              </span>
            </div>
          </div>

          {/* Child-friendly Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {availableSteps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(idx)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs ring-2 ring-emerald-300/60 scale-105'
                      : isDone
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                  title={`${step.labelAr} (${idx + 1}/${availableSteps.length})`}
                >
                  {isDone ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Action Controls */}
        {!isLastStep ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Previous Step or Lesson */}
            {currentStepIndex > 0 ? (
              <button
                onClick={() => goToStep(currentStepIndex - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
                <span>السابق: {prevStep?.labelAr}</span>
              </button>
            ) : previousLesson ? (
              <button
                onClick={() => onSelectLesson?.(previousLesson)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>
            ) : (
              <div />
            )}

            {/* Main Next Step Button */}
            <button
              onClick={() => goToStep(currentStepIndex + 1)}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-2.5 mr-auto"
            >
              <span>المرحلة الموالية: {nextStep?.labelAr}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Step N: Last Step! Show visual congratulation and Next Lesson CTA */
          <div className="space-y-4">
            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 text-center space-y-1.5">
              <div className="text-2xl">🎉</div>
              <h3 className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300">
                أحسنت يا بطل! أتممت جميع مراحل هذا الدرس بنجاح! 🏆
              </h3>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                أكملت كافة المراحل (<span dir="ltr">{availableSteps.length} / {availableSteps.length}</span>). يمكنك الآن الانتقال إلى الدرس التالي!
              </p>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToStep(0)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] hover:text-[var(--app-text)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>مراجعة من البداية</span>
                </button>
                {currentStepIndex > 0 && (
                  <button
                    onClick={() => goToStep(currentStepIndex - 1)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--app-text-muted)] text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center cursor-pointer transition-all active:scale-95"
                    title="الرجوع للمرحلة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {nextLesson ? (
                <button
                  onClick={() => onSelectLesson?.(nextLesson)}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-2.5 mr-auto"
                >
                  <span>الدرس الموالي: {renderArabicText(nextLesson.titleAr)}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon={<Trophy className="w-4 h-4" />}
                  onClick={onBack}
                  className="font-black text-xs mr-auto"
                >
                  إتمام المحور والعودة لقائمة الدروس 🎓
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Compact pill button used in the section sub-tab bar — distinct from the CTA-style <Button>. */
const TabPill: React.FC<{ active: boolean; activeClass: string; icon: React.ReactNode; onClick: () => void; children: React.ReactNode }> = ({
  active,
  activeClass,
  icon,
  onClick,
  children,
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`min-h-12 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 text-xs font-bold ${
      active ? `${activeClass} font-extrabold shadow-sm` : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
    }`}
  >
    {icon}
    <span>{children}</span>
  </motion.button>
);
