import { describe, it, expect } from 'vitest';
import { quizStars } from './quizStars';

describe('quizStars', () => {
  it('gives 3 stars when every answer was right the first time', () => {
    expect(quizStars(5, 0)).toBe(3);
  });
  it('gives 2 stars from 60 % right on the first try', () => {
    expect(quizStars(5, 1)).toBe(2);
    expect(quizStars(5, 2)).toBe(2);
  });
  it('always gives at least 1 star for a finished quiz', () => {
    expect(quizStars(5, 3)).toBe(1);
    expect(quizStars(5, 5)).toBe(1);
    expect(quizStars(0, 0)).toBe(1);
  });
});
