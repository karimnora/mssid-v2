import { describe, expect, it } from 'vitest';
import { isFillBlankCorrect } from './practiceAssessment';

describe('fill-blank answer comparison', () => {
  it('accepts the same grouped integer with normal, nonbreaking or no spaces', () => {
    const ex = { fillBlankAnswerAr: '23\u202f405' };
    expect(isFillBlankCorrect(ex, '23405')).toBe(true);
    expect(isFillBlankCorrect(ex, '23 405')).toBe(true);
    expect(isFillBlankCorrect(ex, '23\u00a0405')).toBe(true);
    expect(isFillBlankCorrect(ex, '23,405')).toBe(false);
    expect(isFillBlankCorrect(ex, '234.05')).toBe(false);
  });
  it('keeps Arabic vocalisation and Latin spelling significant by default', () => {
    expect(isFillBlankCorrect({ fillBlankAnswerAr: 'أَنْتِ' }, 'أَنْتَ')).toBe(false);
    expect(isFillBlankCorrect({ fillBlankAnswerAr: 'His' }, 'his')).toBe(false);
    expect(isFillBlankCorrect({ fillBlankAnswerAr: 'école' }, 'ecole')).toBe(false);
    expect(isFillBlankCorrect({ fillBlankAnswerAr: 'école' }, ' e\u0301cole ')).toBe(true);
    expect(isFillBlankCorrect({}, '')).toBe(false);
  });

  it('only tolerates incidental typography when the exercise explicitly opts in', () => {
    const ex = { fillBlankAnswerAr: "L'éléphant est grand.", fillBlankComparison: 'latin_sentence' as const };
    expect(isFillBlankCorrect(ex, 'l’éléphant  est grand')).toBe(true);
    expect(isFillBlankCorrect(ex, 'L elephant est grand')).toBe(false);
    expect(isFillBlankCorrect(ex, "L'elephant est grand.")).toBe(false);
    expect(isFillBlankCorrect(ex, "L'éléphant sont grand.")).toBe(false);
  });
});
