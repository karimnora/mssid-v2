import { describe, expect, it } from 'vitest';
import { COURSES_3AP } from './3AP';

describe('3AP quiz wrong options carry a targeted explanationAr', () => {
  it('never leaves a false option without explanationAr', () => {
    const missing: string[] = [];
    for (const lesson of COURSES_3AP) {
      for (const q of lesson.quiz ?? []) {
        for (const opt of q.options) {
          if (!opt.isCorrect && !opt.explanationAr?.trim()) {
            missing.push(`${lesson.id} / ${q.id} / ${opt.id}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
