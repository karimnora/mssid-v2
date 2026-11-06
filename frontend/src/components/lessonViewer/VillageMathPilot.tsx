"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { Volume2, Lightbulb, ArrowLeft, ArrowRight } from "lucide-react";
import type { CourseLesson } from "../../types";
import type { LessonStep, TabId } from "./shared";
import { VillageDialog } from "../home/VillageDialog";
import { GuidedMathSupport } from "../GuidedMathSupport";
import { LessonPracticePanel } from "./LessonPracticePanel";
import { BoundPracticeCard, type PracticeBindings } from "./practiceBindings";
import { TapSpeakButton } from "./TapSpeakButton";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { motionTokens } from "../home/villageMotion";
import { stopSpeech } from "../../utils/speech";
import greet from "../../assets/design/home-v3/didou-greet.webp";
import point from "../../assets/design/home-v3/didou-point.webp";
import cheer from "../../assets/design/home-v3/didou-cheer.webp";
import "./villageMathPilot.css";
export { VILLAGE_MATH_PILOT } from "./villageLessonConfig";
const ORDER: TabId[] = [
  "explanation",
  "interactive",
  "content",
  "practice",
  "gameplay",
  "evaluation",
  "quiz",
];
const LABELS: Partial<Record<TabId, string>> = {
  explanation: "أكتشف",
  interactive: "أجرّب",
  content: "أفهم",
  practice: "أتدرّب",
  evaluation: "أقيّم تعلّمي",
  quiz: "نتيجتي",
};
export function villagePilotSteps(steps: LessonStep[]) {
  return [...steps]
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
    .map((s) => ({ ...s, labelAr: LABELS[s.id] ?? s.labelAr }));
}
export function PilotDiscovery({
  lesson,
  onSpeak,
}: {
  lesson: CourseLesson;
  onSpeak: (key: string, text: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const words = lesson.detailedCourse?.vocabulary ?? [];
  const item = words[index];
  useEffect(() => () => stopSpeech(), [index]);
  return (
    <section className="pilot-discovery" data-pilot-discovery>
      <h2>{lesson.missionTitleAr ?? lesson.titleAr}</h2>
      <p>{lesson.detailedCourse?.introAr ?? lesson.summaryAr}</p>
      <details><summary>كلمات الدرس</summary>
      {item && (
        <article className="pilot-notion">
          <h3>{item.termAr}</h3>
          <p>{item.definitionAr}</p>
          <div className="pilot-row">
            <button
              type="button"
              aria-label="اسمع هذه الفكرة"
              onClick={() =>
                onSpeak(
                  `pilot-word-${index}`,
                  `${item.termAr}. ${item.definitionAr}`
                )
              }
            >
              <Volume2 />
            </button>
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ArrowRight /> السابق
            </button>
            <button
              type="button"
              disabled={index === words.length - 1}
              onClick={() => setIndex((i) => i + 1)}
            >
              الفكرة التالية <ArrowLeft />
            </button>
          </div>
          <small>
            فكرة {index + 1} من {words.length}
          </small>
        </article>
      )}
      </details>
    </section>
  );
}
export function PilotPractice({
  lesson,
  practice,
  navigation = true,
  index,
  onIndex,
  renderText,
  speakingKey,
  onSpeak,
  gameAnswers,
  onSelectGameOption,
  onResetGame,
}: {
  navigation?: boolean;
  gameAnswers: Record<number, string>;
  onSelectGameOption: (index: number, value: string) => void;
  onResetGame: () => void;
  lesson: CourseLesson;
  practice: PracticeBindings;
  index: number;
  onIndex: (i: number) => void;
  renderText: (text: string | undefined | null) => string;
  speakingKey: string | null;
  onSpeak: (key: string, text: string) => void;
}) {
  const exercises = lesson.progressiveExercises ?? [];
  return (
    <section data-pilot-practice>
      {navigation && (
      <div className="pilot-row">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onIndex(index - 1)}
        >
          <ArrowRight /> السابق
        </button>
        <span>
          تمرين {index + 1} من {exercises.length}
        </span>
        <button
          type="button"
          disabled={index >= exercises.length - 1}
          onClick={() => onIndex(index + 1)}
        >
          التالي <ArrowLeft />
        </button>
      </div>
      )}
      {!navigation && <p>تمرين {index + 1} من {exercises.length}</p>}
      {exercises.map((ex, i) => (
        <div key={ex.id} hidden={i !== index} data-pilot-exercise={ex.id}>
          <BoundPracticeCard
            ex={ex}
            lesson={lesson}
            practice={practice}
            renderArabicText={renderText}
            leadAudio={
              <TapSpeakButton
                snippetKey={`practice-${ex.id}`}
                text={ex.problemAr}
                speakingKey={speakingKey}
                onSpeak={onSpeak}
                size="lg"
              />
            }
          />
        </div>
      ))}
      <LessonPracticePanel
        gameOnly
        lesson={lesson}
        practice={practice}
        renderArabicText={renderText}
        gameAnswers={gameAnswers}
        onSelectGameOption={onSelectGameOption}
        onResetGame={onResetGame}
        speakingKey={speakingKey}
        onSpeak={onSpeak}
      />
    </section>
  );
}
export function PilotCompanion({
  lesson,
  line,
  mood,
  reactionKey,
  onSpeak,
  speaking,
  onStop,
  onRevealHint,
}: {
  lesson: CourseLesson;
  line: string;
  mood: "greet" | "point" | "cheer";
  reactionKey: string;
  onSpeak: (key: string, text: string) => void;
  speaking: boolean;
  onStop: () => void;
  onRevealHint?: () => void;
}) {
  const [help, setHelp] = useState(false);
  const reduced = useMotionPreference();
  const previous = useRef(reactionKey);
  const sequence = useRef(0);
  useEffect(() => {
    if (reactionKey && previous.current !== reactionKey)
      onSpeak(`pilot-feedback-${++sequence.current}`, line);
    previous.current = reactionKey;
  }, [reactionKey]);
  useEffect(() => () => stopSpeech(), []);
  const ask = () => {
    if (onRevealHint) { onRevealHint(); return; }
    setHelp(true);
  };
  return (
    <aside className="pilot-companion" data-pilot-companion={mood}>
      <motion.img
        src={mood === "cheer" ? cheer : mood === "point" ? point : greet}
        alt="ديدو يرافقك"
        animate={
          reduced ? undefined : { y: speaking ? [0, -3, 0] : [0, -1, 0] }
        }
        transition={{
          duration: speaking ? motionTokens.breath : motionTokens.idle,
          repeat: Infinity,
        }}
      />
      <div>
        <p aria-live="polite">{line}</p>
        <div className="pilot-row">
          <button
            type="button"
            data-pilot-listen
            aria-label={speaking ? "أوقف صوت ديدو" : "اسمع ديدو"}
            onClick={() => (speaking ? onStop() : onSpeak("pilot-guide", line))}
          >
            <Volume2 /> {speaking ? "أوقف" : "اسمع"}
          </button>
          <button type="button" data-pilot-help onClick={ask}>
            <Lightbulb /> ساعدني
          </button>
        </div>
      </div>
      {help && (
        <VillageDialog
          titleId="pilot-help-title"
          onClose={() => setHelp(false)}
        >
          <h2 id="pilot-help-title">نفهم معًا</h2>
          <p>{lesson.rulesAr?.[0] ?? lesson.summaryAr}</p>
          <GuidedMathSupport lesson={lesson} />
        </VillageDialog>
      )}
    </aside>
  );
}

export function PilotRules({
  lesson,
  onSpeak,
}: {
  lesson: CourseLesson;
  onSpeak: (key: string, text: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const rules = lesson.rulesAr ?? [];
  const rule = rules[index];
  useEffect(() => () => stopSpeech(), [index]);
  return (
    <section className="pilot-notion" data-pilot-rule>
      <h2>أفهم القاعدة</h2>
      <p>{rule ?? lesson.summaryAr}</p>
      <div className="pilot-row">
        <button
          type="button"
          onClick={() =>
            onSpeak(`pilot-rule-${index}`, rule ?? lesson.summaryAr)
          }
        >
          <Volume2 /> اسمع القاعدة
        </button>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          السابقة
        </button>
        <button
          type="button"
          disabled={index >= rules.length - 1}
          onClick={() => setIndex((i) => i + 1)}
        >
          القاعدة التالية
        </button>
      </div>
    </section>
  );
}

export function PilotContentFrame({
  enabled,
  lesson,
  onSpeak,
  children,
}: {
  enabled: boolean;
  lesson: CourseLesson;
  onSpeak: (key: string, text: string) => void;
  children: React.ReactNode;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <>
      <PilotRules lesson={lesson} onSpeak={onSpeak} />
      <details>
        <summary>كل القواعد والأمثلة المحلولة</summary>
        {children}
      </details>
    </>
  );
}

export function PilotOptional({
  enabled,
  label,
  children,
}: {
  enabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return enabled ? (
    <details className="pilot-optional">
      <summary>{label}</summary>
      {children}
    </details>
  ) : (
    <>{children}</>
  );
}
export function PilotDiscoveryFrame({
  enabled,
  lesson,
  onSpeak,
  children,
}: {
  enabled: boolean;
  lesson: CourseLesson;
  onSpeak: (key: string, text: string) => void;
  children: React.ReactNode;
}) {
  return enabled ? (
    <>
      <PilotDiscovery lesson={lesson} onSpeak={onSpeak} />
      <PilotOptional enabled label="الشرح الكامل وأهداف الدرس">
        {children}
      </PilotOptional>
    </>
  ) : (
    <>{children}</>
  );
}

export function PilotMotionFrame({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return enabled ? (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  ) : (
    <>{children}</>
  );
}
