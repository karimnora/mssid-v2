import { useActivityExitGuard } from '../../context/ActivityExitContext';
import React, { useState, useRef, useEffect } from "react";
import type { CourseLesson } from "../../types";
import type { LessonStep, TabId } from "./shared";
import type { PracticeBindings } from "./practiceBindings";
import type { useLessonQuiz } from "./useLessonQuiz";
import type { useLessonSpeech } from "./useLessonSpeech";
import {
  PilotCompanion,
  PilotDiscoveryFrame,
  PilotContentFrame,
  PilotPractice,
  PilotMotionFrame,
} from "./VillageMathPilot";
import {
  FRACTION_LINES,
  FractionWorkshop,
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
import { VillageLessonScene } from './VillageLessonScene';
import { useFractionJourney } from './useFractionJourney';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import "./villageMathPilot.css";
type Props = {
  lesson: CourseLesson;
  steps: LessonStep[];
  active: TabId;
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
  const [muted, setMuted] = useState(false);
  const pendingAnnouncement = useRef<{ key: string; text: string } | null>(null);
  const [announcementTick, setAnnouncementTick] = useState(0);
  useEffect(() => {
    const pending = pendingAnnouncement.current;
    if (!pending) return;
    let cancelled = false;
    // A microtask also lets StrictMode replay child cleanup before starting the new clip.
    queueMicrotask(() => {
      if (cancelled || pendingAnnouncement.current !== pending) return;
      pendingAnnouncement.current = null;
      if (!muted) speech.speakSnippet(pending.key, pending.text);
    });
    return () => { cancelled = true; };
  }, [announcementTick, muted, speech.speakSnippet]);
  const say = (key: string, text: string) => { if (!muted) speech.speakSnippet(key, text); };
  const journey = useFractionJourney(say);
  useActivityExitGuard(journey.started && !journey.finished);
  const navigate = (tab: TabId) => {
    speech.stopSpeech();
    onTab(tab);
    const announcement = tab === 'interactive' ? journey.line : didouLineForStep(lesson, tab);
    if (announcement) {
      pendingAnnouncement.current = { key: 'phase-' + tab, text: announcement };
      setAnnouncementTick(value => value + 1);
    }
    top.current?.scrollIntoView?.({ behavior: "auto", block: "start" });
  };
  const [tier, setTier] = useState<1 | 2 | 3 | 4 | 5>(1),
    [gate, setGate] = useState(false),
    [report, setReport] = useState(false);
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
  const line = active === "interactive" ? journey.feedback === "success" ? FRACTION_LINES.success : journey.feedback === "retry" ? FRACTION_LINES.retry : journey.line : checked
    ? correct
      ? "أحسنت! " + (lesson.rulesAr?.[0] ?? lesson.summaryAr)
      : "لنجرّب مرة أخرى. " + (ex?.hintsAr?.[0] ?? lesson.summaryAr)
    : selected
    ? selected.isCorrect
      ? "أحسنت! " + (lesson.rulesAr?.[0] ?? lesson.summaryAr)
      : "لنجرّب مرة أخرى. " +
        (question?.hintAr ?? lesson.rulesAr?.[0] ?? lesson.summaryAr)
    : didouLineForStep(lesson, active) ?? lesson.summaryAr;
  const config = villageLessonConfig(lesson);
  const reveal = active === "interactive" ? journey.revealHint :
    active === "practice" &&
    ex &&
    !isGuidedPractice(ex) &&
    (ex.hintsAr.length || ex.progressiveHints?.length)
      ? () => {
          practice.revealHint(ex);
          const hint =
            ex.progressiveHints?.[practice.revealedHints[ex.id] ?? 0]
              ?.contentAr ?? ex.hintsAr[0];
          if (hint) say("pilot-hint-" + ex.id, hint);
        }
      : undefined;
  const phase = active === 'explanation' ? 0 : active === 'interactive' ? 1 : active === 'content' ? 2 : active === 'practice' || active === 'gameplay' ? 3 : 4;
  const next = () => {
    if (active === 'explanation') { navigate('interactive'); }
    else if (active === 'interactive') { if (!journey.completed) return; if (journey.step < 6) { journey.next(); top.current?.scrollIntoView?.({ block: 'start' }); } else navigate('content'); }
    else if (active === 'content') { navigate('practice'); }
    else if (active === 'practice' && exerciseIndex < (lesson.progressiveExercises?.length ?? 0) - 1) { speech.stopSpeech(); onExerciseIndex(exerciseIndex + 1); top.current?.scrollIntoView?.({ block: 'start' }); }
    else if (active === 'practice') navigate(steps.some(step => step.id === 'evaluation') ? 'evaluation' : 'quiz');
    else if (active === 'evaluation') navigate('quiz');
  };
  const previous = () => {
    if (active === 'interactive' && journey.step > 0) { journey.previous(); top.current?.scrollIntoView?.({ block: 'start' }); }
    else if (active === 'interactive') navigate('explanation');
    else if (active === 'content') navigate('interactive');
    else if (active === 'practice' && exerciseIndex > 0) { speech.stopSpeech(); onExerciseIndex(exerciseIndex - 1); }
    else if (active === 'practice') navigate('content');
    else if (active === 'evaluation') navigate('practice');
    else if (active === 'quiz') navigate(steps.some(step => step.id === 'evaluation') ? 'evaluation' : 'practice');
  };
  return (
    <VillageLessonScene><PilotMotionFrame enabled>
      <div
        className="village-theme village-lesson space-y-4"
        dir="rtl"
        data-village-math-pilot={lesson.id}
      >
        <div className="village-scene-bar"><button type="button" data-activity-navigation onClick={onBack} aria-label="أعود إلى دروسي"><ArrowRight/> دروسي</button><strong>مع ديدو</strong><button type="button" data-scene-sound aria-pressed={!muted} aria-label={muted ? 'أشغّل الصوت' : 'أكتم الصوت'} onClick={() => { speech.stopSpeech(); setMuted(value => !value); }}>{muted ? <VolumeX/> : <Volume2/>}</button></div>
        <header ref={top} className="pilot-hero"><p>{lesson.grade} · مع ديدو</p><h1>{lesson.titleAr.split(':')[0]}</h1></header>
        <ol className="village-scene-progress" aria-label="مراحل التعلّم">{['أكتشف','أجرّب','أفهم','أتدرّب','نتيجتي'].map((label, i) => <li key={label} data-pilot-phase={i} aria-current={phase === i ? 'step' : undefined}>{label}</li>)}</ol>
        <PilotCompanion
          lesson={lesson}
          line={line}
          mood={
            correct || selected?.isCorrect || (active === "interactive" && journey.feedback === "success")
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
            say(
              key,
              text.startsWith("أحسنت!") ? FRACTION_LINES.success : text === "لنجرّب مرة أخرى. " + lesson.rulesAr?.[0] ? lesson.rulesAr![0] : text
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
                onSpeak={say}
              >
                <LessonExplanationView
                  lesson={lesson}
                  tashkeelEnabled
                  availableSteps={steps}
                  activeStepId={active}
                  onSelectStep={(id) => navigate(id as TabId)}
                  speakingKey={speech.speakingKey}
                  onSpeak={say}
                />
              </PilotDiscoveryFrame>
              <details className="pilot-optional"><summary>أنشطة إضافية</summary>{extras}</details>
            </>
          )}
          <div hidden={active !== 'interactive'}>{config?.interaction === 'fractions' ? <FractionWorkshop journey={journey}/> : <LessonInteractiveTools lesson={lesson}/>}</div>
          {active === "content" && (
            <PilotContentFrame
              enabled
              lesson={lesson}
              onSpeak={say}
            >
              <LessonContentPanel
                lesson={lesson}
                renderArabicText={renderText}
                speakingKey={speech.speakingKey}
                onSpeak={say}
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
              navigation={false}
              lesson={lesson}
              practice={practice}
              index={exerciseIndex}
              onIndex={(i) => {
                speech.stopSpeech();
                onExerciseIndex(i);
              }}
              renderText={renderText}
              speakingKey={speech.speakingKey}
              onSpeak={say}
              gameAnswers={quiz.gameAnswers}
              onSelectGameOption={quiz.handleSelectGameOption}
              onResetGame={() => quiz.setGameAnswers({})}
            />
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
              onSpeak={say}
            />
          )}
        </div>
        <footer className="village-linear-nav"><button type="button" data-linear-previous disabled={active === 'explanation'} onClick={previous}>السابق</button>{active !== 'quiz' && <button type="button" data-linear-next disabled={active === 'interactive' && !journey.completed} onClick={next}>التالي ←</button>}
          {active === "quiz" && canFinish && (
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
            aria-label="ملخص الجلسة للولي"
            onClick={() => {
              speech.stopSpeech();
              setGate(true);
            }}
          >
            للولي
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
              learn={journey.learn}
              transfer={journey.transfer}
              onContinue={(target) => {
                setReport(false);
                navigate(target);
              }}
            />
          </VillageDialog>
        )}
      </div>
    </PilotMotionFrame></VillageLessonScene>
  );
}
