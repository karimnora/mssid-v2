import type { CourseLesson, ProgressiveExercise } from '../../types';

const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '').replace(/\s+/g, ' ').trim();

/**
 * A hint that contains the solution ("La réponse est « arrivées »", "246 × 3 = 738.") lets the child
 * copy the answer before trying. The full correction is shown anyway after a second miss, so such a
 * hint only removes the effort. Mission exercises are written without them; this covers the rest.
 */
export function givesAnswer(hint: string, solution: string): boolean {
  const answer = bare(solution);
  const text = bare(hint);
  if (!answer || !text) return false;
  if (answer.length >= 6 && text.includes(answer)) return true;
  // A short answer (« est », « ses », «مربع») is also an ordinary word: it only counts as a whole word.
  const escapedAnswer = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (answer.length >= 3 && new RegExp(`(^|[^\\p{L}\\p{N}])${escapedAnswer}($|[^\\p{L}\\p{N}])`, 'u').test(text)) return true;
  return /^\d+$/.test(answer) && new RegExp(`=\\s*${answer}\\s*[.،]?$`).test(text);
}

function clean(ex: ProgressiveExercise): ProgressiveExercise {
  // Mission exercises are hand-written with hints that guide without answering, and tested as such.
  if (/-m2?-(guided|solo\d+|transfer)$/.test(ex.id)) return ex;
  const solution = String(ex.solutionAr ?? '');
  const progressive = ex.progressiveHints?.filter(hint => !givesAnswer(hint.contentAr, solution));
  const plain = ex.hintsAr?.filter(hint => !givesAnswer(hint, solution)) ?? [];
  const unchanged = progressive?.length === ex.progressiveHints?.length && plain.length === (ex.hintsAr?.length ?? 0);
  if (unchanged) return ex;
  return {
    ...ex,
    progressiveHints: progressive?.length ? progressive : undefined,
    // The single-hint fallback must stay usable: when it gave the answer, reuse the first honest step.
    hintsAr: plain.length ? plain : progressive?.length ? [progressive[0].contentAr] : [],
  };
}

export const withoutAnswerGivingHints = (lesson: CourseLesson): CourseLesson => ({
  ...lesson,
  progressiveExercises: lesson.progressiveExercises?.map(clean),
  evaluationExercises: lesson.evaluationExercises?.map(clean),
});
