import { describe, expect, it } from 'vitest';
import { OFFICIAL_EXAMS_DATA } from './examsData';

// Independent arithmetic evaluation: no eval(), no dependency on the display formatter.
// Units, verbal answers and vertical operations are reviewed separately; this checks complete
// numeric equalities/comparisons, including fractions, decimal values and operator precedence.
import { numericAssertions } from '../test/mathAssertions';

describe('math exam corrections', () => {
  it('detects wrong totals independently, without dropping terms from chained calculations', () => {
    expect(numericAssertions('12 × 750 = 11 400.')[0].valid).toBe(false);
    expect(numericAssertions('58.35 − 12.40 = 46.95.')[0].valid).toBe(false);
    expect(numericAssertions('1) (120 × 3) ÷ 4 = 90.')[0].valid).toBe(true);
    expect(numericAssertions('5 + 5 + 5 = 15.')[0].valid).toBe(true);
    expect(numericAssertions('40 000 − 33 750 = 6 250.')[0].valid).toBe(true);
  });
  for (const exam of OFFICIAL_EXAMS_DATA.filter(item => item.subject === 'math')) {
    it(`keeps complete numeric solution equations correct: ${exam.id}`, () => {
      for (const exercise of [...exam.exercises, exam.problemExercise]) {
        for (const text of [exercise.solutionAr, exercise.operationsAr ?? '']) {
          const checks = numericAssertions(text);
          expect(checks.filter(check => !check.valid), `${exam.id}: ${exercise.titleAr}`).toEqual([]);
        }
      }
    });
  }
  it('covers more than 250 full numeric equalities and comparisons across the bank', () => {
    const total = OFFICIAL_EXAMS_DATA.filter(item => item.subject === 'math').flatMap(exam => [...exam.exercises, exam.problemExercise])
      .reduce((count, exercise) => count + numericAssertions(exercise.solutionAr).length + numericAssertions(exercise.operationsAr ?? '').length, 0);
    expect(total).toBeGreaterThan(250);
  });
  it('counts fence intervals and both endpoints, and preserves the corrected money total', () => {
    const fence = OFFICIAL_EXAMS_DATA.find(exam => exam.id === 'exam-4ap-math-t3-b-2026')!;
    expect(fence.problemExercise.solutionAr).toContain('15 + 1 = 16');
    const purchase = OFFICIAL_EXAMS_DATA.find(exam => exam.id === 'exam-4ap-math-t1-b-2026')!;
    expect(purchase.problemExercise.solutionAr).toContain('9 000 + 1 200 = 10 200');
  });
});
