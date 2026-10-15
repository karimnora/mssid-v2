import { describe, expect, it } from 'vitest';
import { COMPETENCES } from '../competences';
import { assertCahierCoverage, cahiersForGrade, getCahier } from '../../../content-authoring/competenceCahiers';

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

  it('gives a figure to the spatial draw-inside-square prompt', () => {
    const spatial = getCahier('math-1ap-c-spatial-position');
    expect(spatial?.exercises.some((exercise) => exercise.figure === 'square-circle')).toBe(true);
    expect(getCahier('math-1ap-c-ruler-lines')?.exercises.some((exercise) => exercise.figure === 'two-dots')).toBe(true);
  });

  it('explains سؤال with a fatha on the hamza and a damma before it', () => {
    const verso = getCahier('ar-5ap-c-spelling')?.versoAr[0] ?? '';
    expect(verso).toContain('سُؤَال');
    expect(verso).toContain('مَفْتُوحَةٌ');
    expect(verso).not.toContain('سَاكِنٌ');
  });
});
