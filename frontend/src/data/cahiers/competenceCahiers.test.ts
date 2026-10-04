import { describe, expect, it } from 'vitest';
import { COMPETENCES } from '../competences';
import { assertCahierCoverage, cahiersForGrade, getCahier } from './competenceCahiers';

describe('competence cahiers', () => {
  it('covers every mapped competence with a front sheet and a verso', () => {
    expect(assertCahierCoverage()).toEqual([]);
    for (const competence of COMPETENCES) {
      const cahier = getCahier(competence.id);
      expect(cahier?.exercises.length).toBeGreaterThan(0);
      expect(cahier?.versoAr.length).toBe(cahier?.exercises.length);
    }
  });

  it('keeps 1AP maths sheets for the evening print', () => {
    expect(cahiersForGrade('1AP').some((cahier) => cahier.competenceId === 'math-1ap-c-addition')).toBe(true);
  });
});
