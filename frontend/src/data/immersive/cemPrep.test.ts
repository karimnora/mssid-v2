import { describe, expect, it } from 'vitest';
import { CEM_PAPERS, cemErrorRows, markCemRewarded, paperById } from '../../../content-authoring/cemPrep';

describe('CEM prep pack', () => {
  it('ships three original papers distinct from the acquis 2026 ids', () => {
    expect(CEM_PAPERS.map((paper) => paper.id)).toEqual(['cem-math-2027', 'cem-arabic-2027', 'cem-science-2027']);
    expect(paperById('exam-5ap-math-acquis-2026')).toBeUndefined();
    expect(CEM_PAPERS[0].exercises[0].operationsAr).toContain('27.80');
  });

  it('keeps only 5AP review rows on the error sheet', () => {
    const rows = cemErrorRows([
      {
        competenceId: 'math-5ap-c-decimals',
        labelAr: 'عشري',
        labelFr: 'décimaux',
        domainAr: 'حساب',
        status: 'review',
        successes: 0,
        failures: 2,
        reviewLessonId: 'math-5ap-decimals',
      },
      {
        competenceId: 'math-1ap-c-addition',
        labelAr: 'جمع',
        labelFr: 'addition',
        domainAr: 'حساب',
        status: 'review',
        successes: 0,
        failures: 1,
      },
    ]);
    expect(rows.map((row) => row.competenceId)).toEqual(['math-5ap-c-decimals']);
  });

  it('asks a checked answer on every paper exercise', () => {
    for (const paper of CEM_PAPERS) {
      for (const exercise of [...paper.exercises, paper.problem]) {
        expect(exercise.check.choices.length).toBeGreaterThan(1);
        expect(exercise.check.correctIndex).toBeGreaterThanOrEqual(0);
        expect(exercise.check.correctIndex).toBeLessThan(exercise.check.choices.length);
      }
    }
  });

  it('rewards a verified exercise only once', () => {
    localStorage.removeItem('mssid.cemRewarded');
    expect(markCemRewarded('cem-math-2027-0')).toBe(true);
    expect(markCemRewarded('cem-math-2027-0')).toBe(false);
  });
});
