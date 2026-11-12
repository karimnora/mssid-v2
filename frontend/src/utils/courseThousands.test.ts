import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { COURSES_DATA } from '../data/coursesData';
import { isolateMathRuns } from './textFormatter';
const require = createRequire(import.meta.url);
const { normalizeThousands } = require('../../scripts/normalize-course-thousands.cjs') as { normalizeThousands: (text: string) => string };

describe('reviewed catalogue thousands notation', () => {
  it('keeps nonbreaking digit groups inside the same mathematical expression', () => {
    expect(isolateMathRuns('23\u202f405 = 20\u202f000 + 3\u202f000 + 405')).toBe('\u206623\u202f405 = 20\u202f000 + 3\u202f000 + 405\u2069');
  });
  it.each([
    ['23,405 = 20,000 + 3,000 + 400 + 5', '23 405 = 20 000 + 3 000 + 400 + 5'],
    ['2,381,741 km²', '2 381 741 km²'],
    ['1,000.00 − 301.25', '1 000.00 − 301.25'],
    ['0,125 ; 1,25 ; 12.5', '0,125 ; 1,25 ; 12.5'],
    ['1,000,00', '1,000,00'],
  ])('formats %s without changing unrelated punctuation', (input, output) => {
    const expected = output.replace(/(?<=\d) (?=\d{3}(?:\D|$))/g, '\u202f');
    expect(normalizeThousands(input)).toBe(expected);
    expect(normalizeThousands(expected)).toBe(expected);
  });
  it('keeps the pilot value and numeric calculation answer coherent', () => {
    const lesson = COURSES_DATA.find(item => item.id === 'math-4ap-numbers-under-100k')!;
    expect(lesson.learningPath?.steps[0].textAr).toContain('23\u202f405');
    const exercise = lesson.progressiveExercises?.find(item => item.id === 'math-4ap-place-value-guided');
    expect(exercise).toBeDefined();
    expect(exercise?.calculationAnswer).toBe(200);
  });
});
