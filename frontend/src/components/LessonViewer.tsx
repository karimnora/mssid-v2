import { LessonExtras } from "./lessonViewer/LessonExtras";
import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import type { PracticeResult } from "../utils/competenceProgress";
import { VillageLessonLayout } from "./lessonViewer/VillageLessonLayout";
import { villageLessonConfig } from "./lessonViewer/villageLessonConfig";
import { villagePilotSteps } from "./lessonViewer/VillageMathPilot";
import { LessonDidou } from "./lessonViewer/LessonDidou";
import { useActivityExitGuard } from "../context/ActivityExitContext";
import { motion, AnimatePresence } from "motion/react";
import { CourseLesson, PrimaryGrade, SubjectId } from "../types";
import { CourseBreadcrumb } from "./CourseBreadcrumb";
import { LessonExplanationView } from "./LessonExplanationView";
import { RevisionSheetViewer } from "./RevisionSheetViewer";
import { ReportErrorButton } from "./ReportErrorButton";
import { LoadingFallback } from "./LoadingFallback";
import { renderTextWithMath } from "./MathExpression";
import { Button, Card, Badge } from "./ui";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import {
  stripArabicTashkeel,
  formatProgressCount,
} from "../utils/textFormatter";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Gamepad2,
  Glasses,
  Trophy,
  ClipboardCheck,
  Printer,
  Lock,
  Info,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useLocaleContext } from "../context/LocaleContext";
import { getOfficialAxisLabel } from "../utils/curriculumMeta";
import { TabId, LessonStep, tabTransition } from "./lessonViewer/shared";
import { usePremiumLessonContent } from "./lessonViewer/usePremiumLessonContent";
import { useLessonSpeech } from "./lessonViewer/useLessonSpeech";
import { useLessonPractice } from "./lessonViewer/useLessonPractice";
import { useLessonQuiz } from "./lessonViewer/useLessonQuiz";
import {
  LessonInteractiveTools,
  hasRenderableInteractiveTool,
} from "./lessonViewer/LessonInteractiveTools";
import { LessonPracticePanel } from "./lessonViewer/LessonPracticePanel";
import { LessonEvaluationPanel } from "./lessonViewer/LessonEvaluationPanel";
import { LessonQuizPanel } from "./lessonViewer/LessonQuizPanel";
import { LessonContentPanel } from "./lessonViewer/LessonContentPanel";
import { LessonStepFooter } from "./lessonViewer/LessonStepFooter";
import { YoungLessonStory } from "./lessonViewer/YoungLessonStory";
import { TapSpeakButton } from "./lessonViewer/TapSpeakButton";
import { VoiceUnavailableBanner } from "./VoiceUnavailableBanner";
import {
  buildPlayful1APSteps,
  isPlayful1AP as isPlayful1APGrade,
  parsePlayfulSnippet,
} from "./lessonViewer/youngLessonLayout";
const ScienceLabSimulation = lazy(() =>
  import("./ScienceLabSimulation").then((m) => ({
    default: m.ScienceLabSimulation,
  }))
);
interface LessonViewerProps {
  demo?: boolean;
  lesson: CourseLesson;
  allLessons?: CourseLesson[];
  onSelectLesson?: (lesson: CourseLesson) => void;
  onBack: () => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  quizAlreadyValidated?: boolean;
  onQuizFullyValidated?: (lessonId: string) => void;
  onQuizMiss?: (lessonId: string, competenceId?: string) => void;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  grade?: PrimaryGrade;
  subjectId?: SubjectId;
  trimester?: number | "all";
  onHomeClick?: () => void;
  tashkeelEnabled?: boolean;
  /** Opens the contact form pre-filled to report an error on this lesson (a grammar rule, a
   * mistake in the explanation...) — see CLAUDE.md's content-credibility concern. */
  onReportError?: (contextLabel: string) => void;
}
export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson: lessonProp,
  demo = false,
  allLessons = [],
  onSelectLesson,
  onBack,
  onCompleteQuiz,
  quizAlreadyValidated = false,
  onQuizFullyValidated,
  onQuizMiss,
  onPracticeResult,
  grade = lessonProp.grade,
  subjectId = lessonProp.subject,
  trimester,
  onHomeClick,
  tashkeelEnabled = true,
  onReportError,
}) => {
  const t = useTranslation("courses");
  const { direction, locale } = useLocaleContext();
  const villageLayout = locale === "ar" && !!villageLessonConfig(lessonProp);
  const [pilotExerciseIndex, setPilotExerciseIndex] = useState(0);
  const { lesson, premiumFetchState } = usePremiumLessonContent(lessonProp);
  const speech = useLessonSpeech(lesson, grade);
  const practice = useLessonPractice(
    lesson,
    onCompleteQuiz,
    onQuizMiss,
    onPracticeResult
  );
  const quiz = useLessonQuiz({
    demo,
    lesson,
    quizAlreadyValidated,
    onCompleteQuiz,
    onQuizFullyValidated,
    onQuizMiss,
  });
  const currentIndex =
    allLessons.length > 0
      ? allLessons.findIndex((l) => l.id === lesson.id)
      : -1;
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;
  const [activeTab, setActiveTab] = useState<TabId>("explanation");
  const [selectedExampleTier, setSelectedExampleTier] = useState<
    1 | 2 | 3 | 4 | 5
  >(1);
  const [showRevisionSheet, setShowRevisionSheet] = useState(false);
  const [showParentInfo, setShowParentInfo] = useState(false);
  const enablePrintablePDFs = useFeatureFlag("enablePrintablePDFs");
  const showInteractive = hasRenderableInteractiveTool(lesson);

  // True once the child has correctly answered at least one quiz question but hasn't finished all
  // of them — since quiz state is plain useState (never persisted), navigating away and back means
  // re-answering questions already gotten right. Guards every exit path with one confirmation
  // instead of letting a stray tap on the phone's hardware back button silently discard that.
  const quizInProgress =
    Object.keys(quiz.selectedAnswers).length > 0 && !quiz.quizFullyPassed;
  // Protect answers and partial connections too, before the child checks their answer.
  const totalPracticeExercises =
    (lesson.progressiveExercises?.length || 0) +
    practice.evaluationExercises.length;
  const practiceStarted =
    Object.values(practice.practiceAnswers).some(
      (answer) => String(answer).trim().length > 0
    ) ||
    Object.values(practice.matchingConnections).some(
      (connections) => Object.keys(connections).length > 0
    ) ||
    Object.values(practice.orderingSelections).some(
      (selection) => selection.length > 0
    ) ||
    Object.values(practice.matchingSelectedLeft).some(
      (selection) => selection !== null
    ) ||
    practice.awardedExerciseIds.size > 0;
  const practiceInProgress =
    practiceStarted &&
    practice.awardedExerciseIds.size < totalPracticeExercises;
  const hasUnsavedProgress = quizInProgress || practiceInProgress;
  const guardLeave = useActivityExitGuard(hasUnsavedProgress);
  useEffect(() => {
    setActiveTab("explanation");
    setPilotExerciseIndex(0);
    setSelectedExampleTier(1);
    setShowParentInfo(false);
    setShowRevisionSheet(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [lesson.id]);
  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return "";
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };
  const renderArabicMath = (
    text: string | undefined | null
  ): React.ReactNode => {
    return renderTextWithMath(renderArabicText(text));
  };
  const isPlayful1AP = isPlayful1APGrade(grade);
  const isCompactGrade = grade === "1AP" || grade === "2AP";
  // Keep the current step visible when the step row scrolls sideways (« monde de jeu » design).
  const stepRowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = stepRowRef.current;
    const current = row?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!row || !current || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const box = current.getBoundingClientRect();
    row.scrollBy?.({
      left: box.left + box.width / 2 - (rowBox.left + rowBox.width / 2),
      behavior: "smooth",
    });
  }, [activeTab]);
  const titleSnippet = isPlayful1AP
    ? parsePlayfulSnippet(renderArabicText(lesson.titleAr), 0)
    : null;
  const availableSteps = React.useMemo(() => {
    if (isPlayful1AP) {
      const iconFor = (id: TabId) => {
        if (id === "practice") return <Gamepad2 className="w-5 h-5" />;
        if (id === "quiz") return <Trophy className="w-5 h-5" />;
        if (id === "interactive") return <Sparkles className="w-5 h-5" />;
        return <Glasses className="w-5 h-5" />;
      };
      return buildPlayful1APSteps(lesson, {
        hasInteractive: showInteractive,
      }).map((step) => ({
        id: step.id,
        labelAr: step.labelAr,
        icon: iconFor(step.id),
        activeClass: "bg-[var(--brand-blue)] text-white ring-2 ring-blue-400",
        badgeColor: "from-blue-600 to-blue-700",
      }));
    }

    // 2AP keeps the same tabs as 3AP-5AP (nothing is dropped) but with short child verbs instead of
    // adult-register labels — a 7-year-old scans "أَتَعَلَّمُ" faster than "شرح الدرس والتطبيقات".
    const short2AP = grade === "2AP";
    const steps: LessonStep[] = [
      {
        id: "explanation",
        labelAr: short2AP ? "أَتَعَلَّمُ" : "شرح الدرس والتطبيقات",
        icon: <Glasses className="w-4 h-4" />,
        activeClass: "bg-[var(--brand-blue)] text-white ring-2 ring-blue-400",
        badgeColor: "from-blue-600 to-blue-700",
      },
      {
        id: "content",
        labelAr: short2AP ? "القَوَاعِدُ" : "الملخص والقواعد",
        icon: <BookOpen className="w-4 h-4" />,
        activeClass:
          "bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400",
        badgeColor: "from-emerald-600 to-teal-700",
      },
    ];
    if (showInteractive) {
      steps.push({
        id: "interactive",
        labelAr: short2AP ? "أُجَرِّبُ" : "الأداة التفاعلية المخصصة",
        icon: <Sparkles className="w-4 h-4" />,
        activeClass:
          "bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400",
        badgeColor: "from-amber-500 to-orange-600",
      });
    }
    if (lesson.progressiveExercises && lesson.progressiveExercises.length > 0) {
      steps.push({
        id: "practice",
        labelAr: short2AP
          ? `أَتَدَرَّبُ (${lesson.progressiveExercises.length})`
          : `أتدرب (${lesson.progressiveExercises.length})`,
        icon: <Award className="w-4 h-4" />,
        activeClass:
          "bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400",
        badgeColor: "from-amber-500 to-yellow-600",
      });
    }
    if (lesson.gameplay_simulation) {
      steps.push({
        id: "gameplay",
        labelAr: short2AP ? "أَلْعَبُ" : "لعبة المحاكاة التفاعلية",
        icon: <Gamepad2 className="w-4 h-4" />,
        activeClass: "bg-[var(--brand-blue)] text-white ring-2 ring-sky-400",
        badgeColor: "from-blue-600 to-blue-700",
      });
    }
    if (practice.evaluationExercises.length > 0) {
      steps.push({
        id: "evaluation",
        labelAr: short2AP
          ? `تَقْيِيمِي (${practice.evaluationExercises.length})`
          : `التقييم النهائي (${practice.evaluationExercises.length})`,
        icon: <ClipboardCheck className="w-4 h-4" />,
        activeClass: "bg-[var(--brand-coral)] text-white ring-2 ring-rose-400",
        badgeColor: "from-amber-500 to-orange-600",
      });
    }
    if (lesson.quiz.length > 0) {
      steps.push({
        id: "quiz",
        labelAr: short2AP
          ? `أُجِيبُ (${lesson.quiz.length})`
          : `الاختبار التفاعلي (${lesson.quiz.length})`,
        icon: <Trophy className="w-4 h-4" />,
        activeClass:
          "bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400",
        badgeColor: "from-emerald-500 to-teal-600",
      });
    }
    return steps;
  }, [
    isPlayful1AP,
    showInteractive,
    lesson,
    practice.evaluationExercises.length,
    grade,
  ]);
  const currentStepIndex = Math.max(
    0,
    availableSteps.findIndex((s) => s.id === activeTab)
  );
  const isLastStep = currentStepIndex >= availableSteps.length - 1;
  const nextStep = !isLastStep ? availableSteps[currentStepIndex + 1] : null;
  const prevStep =
    currentStepIndex > 0 ? availableSteps[currentStepIndex - 1] : null;
  const hasQuiz = lesson.quiz.length > 0;
  const quizPassed = quizAlreadyValidated || quiz.quizFullyPassed;
  const quizAnswered = quizAlreadyValidated || quiz.quizAnswered;
  // Browsing stays free, but a quiz-bearing lesson cannot be completed before the child has
  // received feedback on each question and found every correct answer.
  const canCompleteLesson = !hasQuiz || quizPassed;
  const finishAndContinue = () => {
    if (!canCompleteLesson) return;
    if (quizPassed) onQuizFullyValidated?.(lesson.id);
    if (nextLesson) onSelectLesson?.(nextLesson);
    else onBack();
  };
  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(availableSteps.length - 1, index));
    if (availableSteps[clamped]) {
      setActiveTab(availableSteps[clamped].id);
      setTimeout(() => {
        const topEl = document.getElementById("lesson-active-step-container");
        // Optional chaining: jsdom (unit tests) doesn't implement scrollIntoView at all — every
        // real browser does, so this changes nothing for actual users.
        topEl?.scrollIntoView?.({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  };
  if (lessonProp.premiumContentPending && premiumFetchState !== "done") {
    return (
      <div className="space-y-6" dir={direction}>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowRight className="w-4 h-4" />}
          data-activity-navigation="true"
          onClick={onBack}
        >
          {t("lessonsListButton")}
        </Button>
        {premiumFetchState === "loading" && (
          <LoadingFallback label={t("loadingLessonContent")} />
        )}
        {premiumFetchState === "forbidden" && (
          <Card padding="lg" className="text-center space-y-4">
            <Lock className="w-10 h-10 mx-auto text-[var(--brand-amber)]" />
            <h2 className="text-base font-black text-[var(--app-text)]">
              {renderArabicText(lesson.titleAr)}
            </h2>
            <p className="text-sm text-[var(--app-text-muted)] max-w-md mx-auto">
              {t("premiumForbiddenText")}
            </p>
            <Button
              variant="ghost"
              size="sm"
              data-activity-navigation="true"
              onClick={onBack}
            >
              {t("backToLessonsListButton")}
            </Button>
          </Card>
        )}
        {premiumFetchState === "error" && (
          <Card padding="lg" className="text-center space-y-4">
            <p className="text-sm text-[var(--app-text-muted)]">
              {t("loadFailedText")}
            </p>
            <Button
              variant="outline"
              size="sm"
              data-activity-navigation="true"
              onClick={onBack}
            >
              {t("backToLessonsListButton")}
            </Button>
          </Card>
        )}
      </div>
    );
  }
  if (villageLayout)
    return (
      <VillageLessonLayout
        key={lesson.id}
        lesson={lesson}
        onPracticeResult={demo ? undefined : onPracticeResult}
        demo={demo}
        steps={villagePilotSteps(availableSteps)}
        active={activeTab}
        onTab={setActiveTab}
        practice={practice}
        quiz={quiz}
        speech={speech}
        exerciseIndex={pilotExerciseIndex}
        onExerciseIndex={setPilotExerciseIndex}
        renderText={renderArabicText}
        onBack={() => guardLeave(onBack)}
        onFinish={finishAndContinue}
        canFinish={canCompleteLesson}
        extras={demo ? undefined :
          <LessonExtras
            lesson={lesson}
            collapsible
            onPracticeResult={onPracticeResult}
            onCompleteQuiz={onCompleteQuiz}
          />
        }
      />
    );
  return (
    <>
      <div
        className={`space-y-4 sm:space-y-6 dir-rtl overflow-x-clip ${""}`}
        dir="rtl"
      >
        <div className={isPlayful1AP ? "hidden sm:block" : undefined}>
          <CourseBreadcrumb
            grade={grade}
            subjectId={subjectId}
            trimester={trimester}
            currentLesson={lesson}
            onHomeClick={() =>
              guardLeave(() => {
                if (onHomeClick) onHomeClick();
                else onBack();
              })
            }
            onSubjectClick={() => guardLeave(onBack)}
          />
        </div>

        <Card
          padding="none"
          className="flex items-center justify-between flex-wrap gap-3 p-3.5"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => guardLeave(onBack)}
            >
              <span className={isPlayful1AP ? "sm:hidden" : "hidden"}>
                الدروس
              </span>
              <span className={isPlayful1AP ? "hidden sm:inline" : undefined}>
                قائمة الدروس
              </span>
            </Button>

            {allLessons.length > 0 && currentIndex >= 0 && (
              <Badge variant="info">
                <span dir="ltr">
                  {formatProgressCount(currentIndex + 1, allLessons.length)}
                </span>
                <span>{isPlayful1AP ? "دَرْس" : "الدرس"}</span>
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
                data-lesson-print="true"
              >
                <span className="hidden sm:inline">فيشة المراجعة</span>
                <span className="sm:hidden">📄</span>
              </Button>
            )}

            {!isCompactGrade && allLessons.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="md"
                  icon={<ChevronRight className="w-4 h-4" />}
                  disabled={!previousLesson}
                  onClick={() =>
                    previousLesson &&
                    guardLeave(() => onSelectLesson?.(previousLesson))
                  }
                  title={
                    previousLesson
                      ? `الدرس السابق: ${renderArabicText(
                          previousLesson.titleAr
                        )}`
                      : "لا يوجد درس سابق"
                  }
                >
                  <span className="hidden sm:inline">الدرس السابق</span>
                  <span className="sm:hidden">السابق</span>
                </Button>

                <Button
                  variant={isLastStep ? "info" : "outline"}
                  size="md"
                  icon={
                    isLastStep ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="end"
                  disabled={!nextLesson || !isLastStep || !canCompleteLesson}
                  onClick={() => {
                    if (!isLastStep || !nextLesson || !canCompleteLesson)
                      return;
                    finishAndContinue();
                  }}
                  title={
                    !isLastStep
                      ? "أكمل جميع مراحل هذا الدرس للتمكن من الانتقال للدرس التالي 🔒"
                      : nextLesson
                      ? `الدرس التالي: ${renderArabicText(nextLesson.titleAr)}`
                      : "لا يوجد درس تالي"
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
          <RevisionSheetViewer
            lesson={lesson}
            onClose={() => setShowRevisionSheet(false)}
            tashkeelEnabled={tashkeelEnabled}
          />
        )}

        <VoiceUnavailableBanner
          visible={speech.isYoungGrade && speech.voiceAvailable === false}
        />

        {isPlayful1AP ? (
          <div
            className="rounded-3xl bg-emerald-50 border border-emerald-100 p-4 sm:p-8 space-y-3"
            data-lesson-hero="1ap"
          >
            {titleSnippet && (
              <div className="flex items-center gap-3 min-w-0">
                <TapSpeakButton
                  snippetKey="title"
                  text={titleSnippet.speak}
                  speakingKey={speech.speakingKey}
                  onSpeak={speech.speakSnippet}
                  size="lg"
                />
                <div className="flex-1 min-w-0 flex flex-col items-center gap-2">
                  <span
                    className="text-4xl sm:text-6xl leading-none"
                    aria-hidden="true"
                  >
                    {titleSnippet.letterVisual ?? titleSnippet.emoji}
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black text-[#1E293B] leading-snug text-center px-1 break-words">
                    {titleSnippet.headline}
                  </h1>
                </div>
              </div>
            )}
            {lesson.instructionAudioAr && (
              <div className="flex items-center justify-center gap-3 bg-white/80 border border-emerald-100 rounded-2xl px-4 py-3">
                <TapSpeakButton
                  snippetKey="instruction"
                  text={lesson.instructionAudioAr}
                  speakingKey={speech.speakingKey}
                  onSpeak={speech.speakSnippet}
                  size="lg"
                />
                <p className="text-sm font-bold text-slate-700 text-center leading-relaxed">
                  {renderArabicMath(lesson.instructionAudioAr)}
                </p>
              </div>
            )}
            {(lesson.sourceNoteAr ||
              (lesson.objectivesAr && lesson.objectivesAr.length > 0) ||
              getOfficialAxisLabel(lesson)) && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowParentInfo((v) => !v)}
                  aria-expanded={showParentInfo}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>معلومة لولي الأمر</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      showParentInfo ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
            <AnimatePresence initial={false}>
              {showParentInfo &&
                (lesson.sourceNoteAr ||
                  (lesson.objectivesAr && lesson.objectivesAr.length > 0) ||
                  getOfficialAxisLabel(lesson)) && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="text-slate-500 text-xs leading-relaxed overflow-hidden space-y-2"
                  >
                    {getOfficialAxisLabel(lesson) && (
                      <p className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                        محور المنهاج:{" "}
                        {renderArabicMath(getOfficialAxisLabel(lesson)!)}
                      </p>
                    )}
                    {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-600 block">
                          سيتعلم طفلك في هذا الدرس:
                        </span>
                        <ul className="space-y-1">
                          {lesson.objectivesAr.map((obj, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="shrink-0">◆</span>
                              <span>{renderArabicMath(obj)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {lesson.sourceNoteAr && (
                      <p>{renderArabicMath(lesson.sourceNoteAr)}</p>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl overflow-hidden relative">
            <div className="kids-hero-band" />
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <BookOpen className="w-4 h-4" />
                  {lesson.contentSource === "official_verified" && (
                    <span>✅ محتوى مطابق لبرنامج رسمي موثّق</span>
                  )}
                  {lesson.contentSource === "corroborated" && (
                    <span className="text-sky-700">
                      🔎 محتوى مُرجَّح (تمت مقارنته بمصدر ثانوي غير رسمي)
                    </span>
                  )}
                  {lesson.contentSource === "complementary" && (
                    <span className="text-amber-700">
                      ✨ محتوى تربوي تكميلي أصلي (مسيد DZ)
                    </span>
                  )}
                  {(lesson.contentSource === "needs_verification" ||
                    !lesson.contentSource) && (
                    <span className="text-slate-500">
                      ⚠️ محتوى بحاجة إلى تحقق (المصدر غير مؤكد بعد)
                    </span>
                  )}
                </div>
                {lesson.difficultyTier && (
                  <Badge variant="xp">
                    {"⭐".repeat(lesson.difficultyTier)}{" "}
                    {lesson.difficultyTier === 1
                      ? "سهل"
                      : lesson.difficultyTier === 2
                      ? "متوسط"
                      : "متقدم"}
                  </Badge>
                )}
                {getOfficialAxisLabel(lesson) && (
                  <Badge
                    variant="info"
                    className="max-w-[14rem] truncate"
                    title={getOfficialAxisLabel(lesson)}
                  >
                    {getOfficialAxisLabel(lesson)}
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-3 mb-3">
                {speech.isYoungGrade && (
                  <TapSpeakButton
                    snippetKey="title"
                    text={renderArabicText(lesson.titleAr)}
                    speakingKey={speech.speakingKey}
                    onSpeak={speech.speakSnippet}
                    size={grade === "2AP" ? "lg" : "md"}
                  />
                )}
                <h1 className="text-xl sm:text-2xl font-black min-w-0 text-[var(--kids-ink)]">
                  {renderArabicText(lesson.titleAr)}
                </h1>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-3xl text-[var(--kids-muted)]">
                {renderArabicMath(lesson.summaryAr)}
              </p>
              {onReportError && (
                <div className="mt-1.5">
                  <ReportErrorButton
                    contextLabel={`الدرس: ${lesson.titleAr} (${grade})`}
                    onReport={onReportError}
                  />
                </div>
              )}
              {lesson.sourceNoteAr && (
                <div className="mt-3 border-t pt-2 border-[var(--app-card-border)]">
                  <button
                    onClick={() => setShowParentInfo((v) => !v)}
                    aria-expanded={showParentInfo}
                    className="flex items-center gap-1.5 text-[11px] font-bold transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>معلومة لولي الأمر</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showParentInfo ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {showParentInfo && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-[10px] leading-relaxed max-w-3xl pt-2 text-slate-500">
                          {renderArabicMath(lesson.sourceNoteAr)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {lesson.missionTitleAr && !isPlayful1AP && (
          <div className="bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl overflow-hidden">
            <div className="h-3.5 w-full bg-[var(--brand-blue)]" />
            <div className="p-5">
              <h2 className="font-black text-base sm:text-lg mb-1 text-[var(--kids-ink)]">
                {renderArabicText(lesson.missionTitleAr)}
              </h2>
              {lesson.missionIntroAr && (
                <p className="text-xs sm:text-sm text-[var(--kids-muted)] leading-relaxed">
                  {renderArabicText(lesson.missionIntroAr)}
                </p>
              )}
            </div>
          </div>
        )}

        {lesson.objectivesAr &&
          lesson.objectivesAr.length > 0 &&
          !isPlayful1AP && (
            <Card padding="none" className="p-5">
              <h3 className="font-extrabold text-sm text-[var(--app-text)] flex items-center gap-2 mb-2.5">
                <Target className="w-4 h-4 text-[var(--brand-blue)]" />
                <span>في نهاية هذا الدرس، سأكون قادراً على:</span>
              </h3>
              <ul className="space-y-1.5">
                {lesson.objectivesAr.map((obj, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-[var(--app-text-muted)] flex items-start gap-2"
                  >
                    <span className="text-[var(--brand-blue)] shrink-0">◆</span>
                    <span>{renderArabicMath(obj)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

        <div
          id="lesson-active-step-container"
          className="scroll-mt-20 bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3"
          data-lesson-layout={isCompactGrade ? "compact" : "full"}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                {currentStepIndex + 1}
              </span>
              <div>
                {isPlayful1AP ? (
                  <h2 className="text-lg sm:text-xl font-black text-[var(--app-text)]">
                    {availableSteps[currentStepIndex]?.labelAr || "أَنْظُرُ"}
                  </h2>
                ) : (
                  <>
                    <span className="text-[10px] sm:text-xs font-bold text-[var(--app-text-muted)] block">
                      مراحل الدرس خطوة بخطوة 🎯
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-[var(--app-text)]">
                      {availableSteps[currentStepIndex]?.labelAr ||
                        "مرحلة الدرس"}
                    </h2>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[var(--brand-emerald-dark)] bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                الخطوة <span dir="ltr">{currentStepIndex + 1}</span> من{" "}
                <span dir="ltr">{availableSteps.length}</span>
              </span>
            </div>
          </div>

          {!isCompactGrade && (
            <div
              ref={stepRowRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2 pt-1"
              data-lesson-steps
              data-lesson-step-count={availableSteps.length}
            >
              {availableSteps.map((step, idx) => {
                const isActive = step.id === activeTab;
                const isCompleted = idx < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    data-step-state={
                      isActive ? "active" : isCompleted ? "done" : "todo"
                    }
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => goToStep(idx)}
                    className={`flex items-center justify-between gap-2 min-h-12 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                      isActive
                        ? `${step.activeClass} shadow-md scale-[1.02]`
                        : isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                        : "bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="shrink-0">
                        {isCompleted ? "✅" : step.icon}
                      </span>
                      <span className="truncate">{step.labelAr}</span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isActive
                          ? "bg-white/25 text-white"
                          : isCompleted
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          : "bg-black/5 dark:bg-white/10"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={tabTransition}
            className="min-w-0"
          >
            {activeTab === "explanation" && (
              <LessonExtras
                lesson={lesson}
                playful={isPlayful1AP}
                onPracticeResult={onPracticeResult}
                onCompleteQuiz={onCompleteQuiz}
              />
            )}
            {!isPlayful1AP && <LessonDidou lesson={lesson} tab={activeTab} />}

            {activeTab === "explanation" &&
              (isPlayful1AP ? (
                <YoungLessonStory
                  lesson={lesson}
                  tashkeelEnabled={tashkeelEnabled}
                  speakingKey={speech.speakingKey}
                  onSpeak={speech.speakSnippet}
                />
              ) : (
                <>
                  <LessonExplanationView
                    lesson={lesson}
                    tashkeelEnabled={tashkeelEnabled}
                    availableSteps={availableSteps}
                    activeStepId={activeTab}
                    onSelectStep={(stepId) => setActiveTab(stepId as TabId)}
                    speakingKey={
                      speech.isYoungGrade ? speech.speakingKey : null
                    }
                    onSpeak={
                      speech.isYoungGrade ? speech.speakSnippet : undefined
                    }
                  />
                </>
              ))}

            {activeTab === "gameplay" && lesson.gameplay_simulation && (
              <Suspense
                fallback={<LoadingFallback label="جاري تحميل المحاكاة..." />}
              >
                <ScienceLabSimulation
                  gameplay={lesson.gameplay_simulation}
                  grade={lesson.grade}
                />
              </Suspense>
            )}

            {activeTab === "practice" && lesson.progressiveExercises && (
              <LessonPracticePanel
                lesson={lesson}
                practice={practice}
                renderArabicText={renderArabicText}
                gameAnswers={quiz.gameAnswers}
                onSelectGameOption={quiz.handleSelectGameOption}
                onResetGame={() => quiz.setGameAnswers({})}
                playful={isPlayful1AP}
                speakingKey={speech.isYoungGrade ? speech.speakingKey : null}
                onSpeak={speech.isYoungGrade ? speech.speakSnippet : undefined}
              />
            )}

            {activeTab === "content" && (
              <>
                <LessonContentPanel
                  lesson={lesson}
                  renderArabicText={renderArabicText}
                  speakingKey={speech.isYoungGrade ? speech.speakingKey : null}
                  onSpeak={
                    speech.isYoungGrade ? speech.speakSnippet : undefined
                  }
                  selectedExampleTier={selectedExampleTier}
                  onSelectExampleTier={setSelectedExampleTier}
                  visibleSolutions={quiz.visibleSolutions}
                  onToggleSolution={(index) =>
                    quiz.setVisibleSolutions((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  onGoToSimulation={() => setActiveTab("gameplay")}
                />
              </>
            )}

            {activeTab === "interactive" && showInteractive && (
              <>
                <LessonInteractiveTools lesson={lesson} />
              </>
            )}

            {activeTab === "evaluation" &&
              practice.evaluationExercises.length > 0 && (
                <LessonEvaluationPanel
                  lesson={lesson}
                  practice={practice}
                  renderArabicText={renderArabicText}
                />
              )}

            {activeTab === "quiz" && lesson.quiz.length > 0 && (
              <LessonQuizPanel
                lesson={lesson}
                shuffledQuiz={quiz.shuffledQuiz}
                selectedAnswers={quiz.selectedAnswers}
                recentAnswerId={quiz.recentAnswerId}
                renderArabicText={renderArabicText}
                onSelectOption={quiz.handleSelectOption}
                onShuffle={quiz.initializeShuffledQuiz}
                onReset={quiz.handleResetQuiz}
                playful={isPlayful1AP}
                speakingKey={speech.isYoungGrade ? speech.speakingKey : null}
                onSpeak={speech.isYoungGrade ? speech.speakSnippet : undefined}
                nextLessonTitle={
                  isPlayful1AP && nextLesson
                    ? renderArabicText(nextLesson.titleAr)
                    : undefined
                }
                onContinueNext={
                  isPlayful1AP && canCompleteLesson
                    ? finishAndContinue
                    : undefined
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        <LessonStepFooter
          availableSteps={availableSteps}
          currentStepIndex={currentStepIndex}
          isLastStep={isLastStep}
          nextStep={nextStep}
          prevStep={prevStep}
          nextLesson={nextLesson}
          renderArabicText={renderArabicText}
          compact={isCompactGrade}
          playful={isPlayful1AP}
          hasQuiz={hasQuiz}
          quizPassed={quizPassed}
          onGoToStep={goToStep}
          onFinishLesson={finishAndContinue}
        />
      </div>
    </>
  );
};
