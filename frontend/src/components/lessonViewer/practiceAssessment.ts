import { ProgressiveExercise } from '../../types';

export const isGuidedPractice = (ex: ProgressiveExercise) => !ex.type || ex.type === 'short_answer';

// Identical category labels are interchangeable, even when their original indices differ.
// Keep vocalisation: it can distinguish answers in Arabic language exercises.
export function isMatchingPairCorrect(ex: ProgressiveExercise, leftIdx: number, rightIdx: number | undefined) {
  const expected = ex.matchingPairsAr?.[leftIdx];
  const selected = rightIdx === undefined ? undefined : ex.matchingPairsAr?.[rightIdx];
  const normalize = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ');
  return !!expected && !!selected && normalize(expected.rightAr) === normalize(selected.rightAr);
}
