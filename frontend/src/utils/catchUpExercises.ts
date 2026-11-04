import { COURSES_DATA } from '../data/coursesData';
import { getLessonsForCompetence } from '../data/competences';
import { isGuidedPractice } from '../components/lessonViewer/practiceAssessment';
import type { CourseLesson } from '../types';

type Exercise = NonNullable<CourseLesson['progressiveExercises']>[number];

/** One exercise the child missed, ready to print on the A4 catch-up sheet. */
export interface CatchUpExercise {
  exerciseId: string;
  promptAr: string;
  lines: number;
  answerAr: string;
}

const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

function promptFor(ex: Exercise): string {
  const lines = [ex.problemAr.trim()];
  if ((ex.type === 'qcm' || ex.type === 'true_false') && ex.options?.length) {
    lines.push(ex.options.map((option, i) => `${LETTERS[i] ?? i + 1}) ${option.textAr}`).join('   '));
  }
  if (ex.type === 'matching' && ex.matchingPairsAr?.length) {
    lines.push(ex.matchingPairsAr.map((pair) => `• ${pair.leftAr}  ←  …`).join('\n'));
  }
  if (ex.type === 'ordering' && ex.orderedItemsAr?.length) {
    lines.push([...ex.orderedItemsAr].sort((a, b) => a.localeCompare(b, 'ar')).join(' / '));
  }
  return lines.join('\n');
}

function answerFor(ex: Exercise): string {
  if (ex.type === 'matching' && ex.matchingPairsAr?.length) {
    return ex.matchingPairsAr.map((pair) => `${pair.leftAr} ← ${pair.rightAr}`).join(' · ');
  }
  if (ex.type === 'ordering' && ex.orderedItemsAr?.length) return ex.orderedItemsAr.join(' ← ');
  const correction = ex.detailedCorrectionAr?.trim();
  const solution = ex.solutionAr?.trim() || ex.fillBlankAnswerAr || (ex.calculationAnswer !== undefined ? String(ex.calculationAnswer).replace('.', ',') : '');
  return correction && correction !== solution ? `${solution} — ${correction}` : solution;
}

function exercisesOf(lessonIds: string[]): Map<string, Exercise> {
  const byId = new Map<string, Exercise>();
  for (const lesson of COURSES_DATA.filter((item) => lessonIds.includes(item.id))) {
    for (const ex of [...(lesson.progressiveExercises ?? []), ...(lesson.evaluationExercises ?? [])]) {
      if (!isGuidedPractice(ex)) byId.set(ex.id, ex);
    }
  }
  return byId;
}

/**
 * The exercises a child missed on a competence, newest first, as printable catch-up items.
 * Ids that no longer exist in the lessons (content edited since) are skipped.
 */
export function catchUpExercises(competenceId: string, missedExerciseIds: string[] = []): CatchUpExercise[] {
  if (missedExerciseIds.length === 0) return [];
  const byId = exercisesOf(getLessonsForCompetence(competenceId));
  return missedExerciseIds
    .map((id) => byId.get(id))
    .filter((ex): ex is Exercise => ex !== undefined)
    .map((ex) => ({
      exerciseId: ex.id,
      promptAr: promptFor(ex),
      lines: ex.type === 'calculation' || ex.type === 'fill_blank' ? 3 : 2,
      answerAr: answerFor(ex),
    }));
}
