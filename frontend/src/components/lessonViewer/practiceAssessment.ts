import { ProgressiveExercise } from '../../types';

export const isGuidedPractice = (ex: ProgressiveExercise) => !ex.type || ex.type === 'short_answer';

const GENERIC_HINTS = new Set(['فكر جيدا قبل الاجابة', 'فكر جيدا قبل الإجابة', 'حاول بنفسك', 'راجع الدرس', 'تذكر القاعدة']);

export function getPracticeHints(ex: Pick<ProgressiveExercise, 'hintsAr' | 'progressiveHints'>) {
  const useful = (text: string) => {
    const plain = text.normalize('NFC').replace(/[\u064b-\u065f\u0670]/g, '').replace(/[.!؟?،؛:]/g, '').replace(/\s+/g, ' ').trim();
    return plain.length > 0 && !GENERIC_HINTS.has(plain);
  };
  const progressive = (ex.progressiveHints ?? []).filter(hint => useful(hint.contentAr));
  return progressive.length ? progressive : (ex.hintsAr ?? []).filter(useful).map(contentAr => ({ labelAr: 'تلميح', contentAr }));
}

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
