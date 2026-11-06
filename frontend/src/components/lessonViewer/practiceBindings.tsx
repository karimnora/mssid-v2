import React from 'react';
import { GuidedMathSupport } from '../GuidedMathSupport';
import { CourseLesson } from '../../types';
import { PracticeExerciseCard } from '../PracticeExerciseCard';
import { useLessonPractice } from './useLessonPractice';

export type PracticeBindings = ReturnType<typeof useLessonPractice>;

export const BoundPracticeCard: React.FC<{
  ex: NonNullable<CourseLesson['progressiveExercises']>[number];
  practice: PracticeBindings;
  renderArabicText: (text: string | undefined | null) => string;
  playful?: boolean;
  leadAudio?: React.ReactNode;
  lesson?: CourseLesson;
}> = ({ ex, practice, renderArabicText, playful = false, leadAudio, lesson }) => (
  <>
  <PracticeExerciseCard
    ex={ex}
    revealedHintCount={practice.revealedHints[ex.id] ?? 0}
    onRevealHint={() => practice.revealHint(ex)}
    renderArabicText={renderArabicText}
    playful={playful}
    leadAudio={leadAudio}
    optionOrder={practice.practiceOptionOrder[ex.id]}
    answer={practice.practiceAnswers[ex.id]}
    onAnswerChange={practice.handlePracticeAnswerChange}
    isChecked={!!practice.practiceChecked[ex.id]}
    isCorrect={!!practice.practiceCorrect[ex.id]}
    canCheck={practice.canCheckExercise(ex)}
    onCheck={practice.checkPracticeExercise}
    onReset={practice.resetPracticeExercise}
    matchingRightOrder={practice.matchingRightOrder[ex.id] || []}
    matchingConnections={practice.matchingConnections[ex.id] || {}}
    matchingSelectedLeft={practice.matchingSelectedLeft[ex.id] ?? null}
    onMatchingSelectLeft={practice.handleMatchingSelectLeft}
    onConnectMatching={practice.handleConnectMatching}
    onDisconnectMatching={practice.handleDisconnectMatching}
    orderingShuffled={practice.orderingShuffled[ex.id] || []}
    orderingSelection={practice.orderingSelections[ex.id] || []}
    onToggleOrderingItem={practice.handleToggleOrderingItem}
  />
  {lesson && <GuidedMathSupport lesson={lesson} />}
  </>
);
