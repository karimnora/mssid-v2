import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from './coursesData';
import { CHALLENGES_DATA } from './challengesData';
import { numericAssertions } from '../test/mathAssertions';

function explanations(value: unknown, path = ''): { path: string; text: string }[] {
  if (!value || typeof value !== 'object') return [];
  const result: { path: string; text: string }[] = [];
  for (const [key, item] of Object.entries(value)) {
    const next = `${path}.${key}`;
    const isCorrection = /solution|explanation|formula|operations|detailedCorrection|summary|stepsAr|hintsAr|correctionAr|progressiveHints/i.test(next);
    // Wrong answers/common mistakes can intentionally quote a false equality to explain it.
    const isDeliberatelyWrong = /commonMistakes.*mistakeAr/.test(next);
    if (typeof item === 'string' && isCorrection && !isDeliberatelyWrong) result.push({ path: next, text: item });
    else if (item && typeof item === 'object') result.push(...explanations(item, next));
  }
  return result;
}

const mathSources = [...COURSES_DATA, ...CHALLENGES_DATA].filter(item => item.subject === 'math');
describe('math corrections outside exams', () => {
  for (const source of mathSources) {
    it(`checks complete numeric equations in ${source.id}`, () => {
      const errors = explanations(source).flatMap(entry => numericAssertions(entry.text)
        .filter(check => !check.valid).map(check => ({ ...entry, equation: check.expression })));
      expect(errors).toEqual([]);
    });
  }
  it('covers the full grade range and at least 450 numeric assertions', () => {
    expect(new Set(mathSources.map(item => item.grade))).toEqual(new Set(['1AP', '2AP', '3AP', '4AP', '5AP']));
    const count = mathSources.reduce((total, source) => total + explanations(source).reduce((n, entry) => n + numericAssertions(entry.text).length, 0), 0);
    expect(count).toBeGreaterThanOrEqual(450);
  });
});
