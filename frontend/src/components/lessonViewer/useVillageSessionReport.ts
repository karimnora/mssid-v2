import { useEffect, useRef, useState } from 'react';
import type { CourseLesson } from '../../types';
import type { PracticeResult } from '../../utils/competenceProgress';
import type { VillageSessionSummary } from '../../utils/villageSession';
import type { FractionObservations } from './fractionJourneyContent';
import { isGuidedPractice } from './practiceAssessment';
import type { PracticeBindings } from './practiceBindings';
export function useVillageSessionReport(lesson: CourseLesson, learn: FractionObservations, transfer: FractionObservations, practice: PracticeBindings, selected: Record<string, string>, onResult?: (id: string, result: PracticeResult) => void, examples: string[] = []) {
  const [id] = useState(() => crypto.randomUUID?.() ?? Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
  const callback = useRef(onResult);
  useEffect(() => { callback.current = onResult; }, [onResult]);
  const outcomes = Object.values(practice.sessionResults);
  const exercised = [...(lesson.progressiveExercises ?? []), ...(lesson.evaluationExercises ?? [])].filter(ex => !isGuidedPractice(ex));
  const snapshot: VillageSessionSummary = {
    id, title: lesson.titleAr, grade: lesson.grade, learn, transfer,
    examples: [...examples, ...exercised.filter(ex => practice.sessionResults[ex.id]).map(ex => ex.problemAr)].slice(0, 5),
    alone: outcomes.filter(r => r.correct && !r.helped).length,
    helped: outcomes.filter(r => r.correct && r.helped).length,
    needs: outcomes.filter(r => !r.correct).length,
    quizCorrect: lesson.quiz.filter(q => q.options.some(o => o.isCorrect && o.id === selected[q.id])).length,
    quizTotal: lesson.quiz.length,
    next: !['decompose', 'bound', 'equivalent', 'explain'].every(key => transfer[key as keyof FractionObservations]?.completed) ? 'interactive' : exercised.some(ex => !practice.sessionResults[ex.id]?.correct) ? 'practice' : 'quiz',
  };
  const serialized = JSON.stringify(snapshot);
  const observed = Object.keys(learn).length + Object.keys(transfer).length + outcomes.length + Object.keys(selected).length > 0;
  useEffect(() => {
    if (observed) callback.current?.(lesson.id, { outcome: 'success', villageSummary: JSON.parse(serialized) });
  }, [serialized, observed, lesson.id]);
}
