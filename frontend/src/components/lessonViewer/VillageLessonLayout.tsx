import React, { useState, useRef } from "react";
import type { CourseLesson } from "../../types";
import type { LessonStep, TabId } from "./shared";
import type { PracticeBindings } from "./practiceBindings";
import type { useLessonQuiz } from "./useLessonQuiz";
import type { useLessonSpeech } from "./useLessonSpeech";
import {
  PilotPhases,
  PilotCompanion,
  PilotDiscoveryFrame,
  PilotContentFrame,
  PilotPractice,
  PilotMotionFrame,
  PilotOptional,
} from "./VillageMathPilot";
import {
  FRACTION_LINES,
  FractionWorkshop,
  type FractionObservations,
} from "./FractionWorkshop";
import { LessonExplanationView } from "../LessonExplanationView";
import { LessonContentPanel } from "./LessonContentPanel";
import { LessonEvaluationPanel } from "./LessonEvaluationPanel";
import { LessonQuizPanel } from "./LessonQuizPanel";
import { LessonInteractiveTools } from "./LessonInteractiveTools";
import { didouLineForStep } from "./LessonDidou";
import { ParentGateModal } from "../ParentGateModal";
import { VillageDialog } from "../home/VillageDialog";
import { villageLessonConfig } from "./villageLessonConfig";
import { isGuidedPractice } from "./practiceAssessment";
import { SessionLearningReport } from "./SessionLearningReport";
import "./villageMathPilot.css";
type Props = {
  lesson: CourseLesson;
  steps: LessonStep[];
  active: TabId;
  onSelect: (index: number) => void;
  onTab: (tab: TabId) => void;
  practice: PracticeBindings;
  quiz: ReturnType<typeof useLessonQuiz>;
  speech: ReturnType<typeof useLessonSpeech>;
  exerciseIndex: number;
  onExerciseIndex: (index: number) => void;
  renderText: (text: string | null | undefined) => string;
  onBack: () => void;
  onFinish: () => void;
  canFinish: boolean;
  extras?: React.ReactNode;
};
export function VillageLessonLayout({
  lesson,
  steps,
  active,
  onSelect,
  onTab,
  practice,
  quiz,
  speech,
  exerciseIndex,
  onExerciseIndex,
  renderText,
  onBack,
  onFinish,
  canFinish,
  extras,
}: Props) {
  const top = useRef<HTMLElement>(null);
  const navigate = (tab: TabId) => {
    speech.stopSpeech();
    onTab(tab);
    top.current?.scrollIntoView?.({ behavior: "auto", block: "start" });
  };
  const [tier, setTier] = useState<1 | 2 | 3 | 4 | 5>(1),
    [gate, setGate] = useState(false),
    [report, setReport] = useState(false),
    [lab, setLab] = useState(false);
  const [learn, setLearn] = useState<FractionObservations>({}),
    [transfer, setTransfer] = useState<FractionObservations>({});
  const ex = lesson.progressiveExercises?.[exerciseIndex];
  const checked =
    active === "practice" && ex && practice.practiceChecked[ex.id];
  const correct = checked && ex && practice.practiceCorrect[ex.id];
  const question =
    active === "quiz"
      ? lesson.quiz.find((q) => q.id === quiz.recentAnswerId)
      : undefined;
  const selected = question?.options.find(
    (o) => o.id === quiz.selectedAnswers[question.id]
  );
  const line = active === "interactive" ? (lab ? FRACTION_LINES.lab : "جَرِّبْ بِيَدِكَ: اُنْقُرْ وَاكْتَشِفْ.") : checked
    ? correct
      ? "أحسنت! " + (lesson.rulesAr?.[0] ?? lesson.summaryAr)
      : "لنجرّب مرة أخرى. " + (ex?.hintsAr?.[0] ?? lesson.summaryAr)
    : selected
    ? selected.isCorrect
      ? "أحسنت! " + (lesson.rulesAr?.[0] ?? lesson.summaryAr)
      : "لنجرّب مرة أخرى. " +
        (question?.hintAr ?? lesson.rulesAr?.[0] ?? lesson.summaryAr)
    : didouLineForStep(lesson, active) ?? lesson.summaryAr;
  const index = steps.findIndex((s) => s.id === active);
  const config = villageLessonConfig(lesson);
  const reveal =
    active === "practice" &&
    ex &&
    !isGuidedPractice(ex) &&
    (ex.hintsAr.length || ex.progressiveHints?.length)
      ? () => {
          practice.revealHint(ex);
          const hint =
            ex.progressiveHints?.[practice.revealedHints[ex.id] ?? 0]
              ?.contentAr ?? ex.hintsAr[0];
          if (hint) speech.speakSnippet("pilot-hint-" + ex.id, hint);
        }
      : undefined;
  const select = (i: number) => {
    speech.stopSpeech();
    onSelect(i);
    top.current?.scrollIntoView?.({ behavior: "auto", block: "start" });
  };
  return (
    <PilotMotionFrame enabled>
      <div
        className="village-theme village-lesson space-y-4"
        dir="rtl"
        data-village-math-pilot={lesson.id}
      >
        <header ref={top} className="pilot-hero">
          <button type="button" data-activity-navigation onClick={onBack}>
            قائمة الدروس ←
          </button>
          <p>مع ديدو · {lesson.grade}</p>
          <h1>{lesson.titleAr.split(":")[0]}</h1>
          <p>{lesson.objectivesAr?.[0]}</p>
        </header>
        <PilotPhases steps={steps} active={active} onSelect={select} />
        <PilotCompanion
          lesson={lesson}
          line={line}
          mood={
            correct || selected?.isCorrect
              ? "cheer"
              : active === "explanation"
              ? "greet"
              : "point"
          }
          reactionKey={
            checked
              ? ex?.id + ":" + !!correct
              : selected
              ? question?.id + ":" + selected.id
              : ""
          }
          onSpeak={(key, text) =>
            speech.speakSnippet(
              key,
              text.startsWith("أحسنت!") ? FRACTION_LINES.success : text
            )
          }
          speaking={!!speech.speakingKey}
          onStop={speech.stopSpeech}
          onRevealHint={reveal}
        />
        <div id="lesson-active-step-container">
          {active === "explanation" && (
            <>
              <PilotDiscoveryFrame
                enabled
                lesson={lesson}
                onSpeak={speech.speakSnippet}
              >
                <LessonExplanationView
                  lesson={lesson}
                  tashkeelEnabled
                  availableSteps={steps}
                  activeStepId={active}
                  onSelectStep={(id) => navigate(id as TabId)}
                  speakingKey={speech.speakingKey}
                  onSpeak={speech.speakSnippet}
                />
              </PilotDiscoveryFrame>
              {extras}
            </>
          )}
          <div hidden={active !== "interactive"}>
            {config?.interaction === "fractions" ? (
              <>
                <div className="pilot-row">
                  <button
                    type="button"
                    data-fraction-mode="learn"
                    aria-pressed={!lab}
                    onClick={() => setLab(false)}
                  >
                    أكتشف وأجرّب
                  </button>
                  <button
                    type="button"
                    data-fraction-mode="lab"
                    aria-pressed={lab}
                    onClick={() => setLab(true)}
                  >
                    مختبر الحديقة
                  </button>
                </div>
                <div hidden={lab}>
                  <FractionWorkshop
                    onSpeak={speech.speakSnippet}
                    onObserve={(key, result) =>
                      setLearn((prev) => ({ ...prev, [key]: result }))
                    }
                  />
                </div>
                <div hidden={!lab}>
                  <FractionWorkshop
                    transfer
                    onSpeak={speech.speakSnippet}
                    onObserve={(key, result) =>
                      setTransfer((prev) => ({ ...prev, [key]: result }))
                    }
                  />
                </div>
              </>
            ) : (
              <LessonInteractiveTools lesson={lesson} />
            )}
          </div>
          {active === "content" && (
            <PilotContentFrame
              enabled
              lesson={lesson}
              onSpeak={speech.speakSnippet}
            >
              <LessonContentPanel
                lesson={lesson}
                renderArabicText={renderText}
                speakingKey={speech.speakingKey}
                onSpeak={speech.speakSnippet}
                selectedExampleTier={tier}
                onSelectExampleTier={setTier}
                visibleSolutions={quiz.visibleSolutions}
                onToggleSolution={(i) =>
                  quiz.setVisibleSolutions((prev) => ({
                    ...prev,
                    [i]: !prev[i],
                  }))
                }
                onGoToSimulation={() => navigate("gameplay")}
              />
            </PilotContentFrame>
          )}
          {active === "practice" && (
            <PilotPractice
              lesson={lesson}
              practice={practice}
              index={exerciseIndex}
              onIndex={(i) => {
                speech.stopSpeech();
                onExerciseIndex(i);
              }}
              renderText={renderText}
              speakingKey={speech.speakingKey}
              onSpeak={speech.speakSnippet}
              gameAnswers={quiz.gameAnswers}
              onSelectGameOption={quiz.handleSelectGameOption}
              onResetGame={() => quiz.setGameAnswers({})}
            />
          )}
          {(active === "evaluation" || active === "quiz") && (
            <div className="pilot-result-tabs">
              <button
                type="button"
                aria-pressed={active === "evaluation"}
                onClick={() => navigate("evaluation")}
              >
                أقيّم تعلّمي
              </button>
              <button
                type="button"
                aria-pressed={active === "quiz"}
                onClick={() => navigate("quiz")}
              >
                نتيجتي
              </button>
            </div>
          )}
          {active === "evaluation" && (
            <LessonEvaluationPanel
              lesson={lesson}
              practice={practice}
              renderArabicText={renderText}
            />
          )}
          {active === "quiz" && (
            <LessonQuizPanel
              lesson={lesson}
              shuffledQuiz={quiz.shuffledQuiz}
              selectedAnswers={quiz.selectedAnswers}
              recentAnswerId={quiz.recentAnswerId}
              renderArabicText={renderText}
              onSelectOption={quiz.handleSelectOption}
              onShuffle={quiz.initializeShuffledQuiz}
              onReset={quiz.handleResetQuiz}
              speakingKey={speech.speakingKey}
              onSpeak={speech.speakSnippet}
            />
          )}
        </div>
        <footer className="pilot-row">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => select(index - 1)}
          >
            السابق
          </button>
          {index < steps.length - 1 && (
            <button type="button" onClick={() => select(index + 1)}>
              التالي
            </button>
          )}
          {canFinish && (
            <button
              type="button"
              data-primary-cta="finish-lesson"
              onClick={onFinish}
            >
              أنهي الدرس
            </button>
          )}
          <button
            type="button"
            data-session-parent
            onClick={() => {
              speech.stopSpeech();
              setGate(true);
            }}
          >
            ملخص الجلسة للولي
          </button>
        </footer>
        <ParentGateModal
          isOpen={gate}
          onClose={() => setGate(false)}
          onVerified={() => {
            setGate(false);
            setReport(true);
          }}
        />
        {report && (
          <VillageDialog
            titleId="session-report-title"
            className="home-preview-learning village-session-dialog"
            onClose={() => setReport(false)}
          >
            <SessionLearningReport
              lesson={lesson}
              practice={practice}
              quiz={quiz}
              learn={learn}
              transfer={transfer}
              onContinue={(target) => {
                setReport(false);
                navigate(target);
                if (target === "interactive") setLab(true);
              }}
            />
          </VillageDialog>
        )}
      </div>
    </PilotMotionFrame>
  );
}
