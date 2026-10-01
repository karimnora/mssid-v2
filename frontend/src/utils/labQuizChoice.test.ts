import { describe, expect, it } from 'vitest';
import { labQuizIsLocked, labQuizOptionClass } from './labQuizChoice';

describe('labQuizOptionClass', () => {
  it('does not mark the correct option after a wrong pick', () => {
    const wrong = labQuizOptionClass('sahara', 'sahara', 'tell');
    const leaked = labQuizOptionClass('sahara', 'tell', 'tell');
    expect(wrong).toContain('border-[var(--brand-coral)]');
    expect(leaked).not.toContain('bg-emerald-100');
    expect(leaked).not.toContain('border-emerald-500');
  });

  it('marks only the chosen option when it is correct', () => {
    const chosen = labQuizOptionClass('tell', 'tell', 'tell');
    const other = labQuizOptionClass('tell', 'sahara', 'tell');
    expect(chosen).toContain('bg-emerald-100');
    expect(other).not.toContain('bg-emerald-100');
  });
});

describe('labQuizIsLocked', () => {
  it('locks only after a correct pick so the child can retry', () => {
    expect(labQuizIsLocked(undefined, 'tell')).toBe(false);
    expect(labQuizIsLocked('sahara', 'tell')).toBe(false);
    expect(labQuizIsLocked('tell', 'tell')).toBe(true);
  });
});
