import { ProgressiveExercise } from '../../types';

export const isGuidedPractice = (ex: ProgressiveExercise) => !ex.type || ex.type === 'short_answer';

export function isFillBlankCorrect(
  ex: Pick<ProgressiveExercise, 'fillBlankAnswerAr' | 'fillBlankComparison'>,
  answer: string,
): boolean {
  if (!ex.fillBlankAnswerAr?.trim() || !answer.trim()) return false;
  // Typography must not make a correct integer fail: accept "23405" and "23 405" alike.
  const integer = /^-?\d{1,3}(?:[ \u00a0\u202f]\d{3})+$/;
  if (integer.test(ex.fillBlankAnswerAr.trim()) && /^-?(?:\d+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)$/.test(answer.trim())) {
    return answer.trim().replace(/[ \u00a0\u202f]/g, '') === ex.fillBlankAnswerAr.trim().replace(/[ \u00a0\u202f]/g, '');
  }
  const normalize = (text: string) => {
    const canonical = text.normalize('NFC').trim();
    if (ex.fillBlankComparison !== 'latin_sentence') return canonical;
    return canonical.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]$/, '').trim().toLowerCase();
  };
  return normalize(answer) === normalize(ex.fillBlankAnswerAr);
}

// Identical category labels are interchangeable, even when their original indices differ.
// Keep vocalisation: it can distinguish answers in Arabic language exercises.
export function isMatchingPairCorrect(ex: ProgressiveExercise, leftIdx: number, rightIdx: number | undefined) {
  const expected = ex.matchingPairsAr?.[leftIdx];
  const selected = rightIdx === undefined ? undefined : ex.matchingPairsAr?.[rightIdx];
  const normalize = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ');
  return !!expected && !!selected && normalize(expected.rightAr) === normalize(selected.rightAr);
}
