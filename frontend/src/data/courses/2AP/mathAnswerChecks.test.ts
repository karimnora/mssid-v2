import { describe, expect, it } from 'vitest';
import { COURSES_2AP } from './index';

const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '');

describe('2AP maths exercises check the answer', () => {
  const exercises = COURSES_2AP.filter(lesson => lesson.subject === 'math').flatMap(lesson => lesson.progressiveExercises ?? []);

  it('leaves no exercise without a verified answer', () => {
    expect(exercises.filter(ex => !ex.type).map(ex => ex.id)).toEqual([]);
  });

  it.each(exercises.map(ex => [ex.id, ex] as const))('%s has a consistent expected answer', (_id, ex) => {
    if (ex.type === 'calculation') {
      // The typed number is the one the written solution shows, and it stays inside the 2AP range.
      expect(bare(ex.solutionAr).match(/\d+/)?.[0]).toBe(String(ex.calculationAnswer));
      expect(ex.calculationAnswer).toBeLessThan(1000);
    } else if (ex.type === 'qcm') {
      const texts = ex.options!.map(option => bare(option.textAr));
      expect(ex.options!.filter(option => option.isCorrect)).toHaveLength(1);
      expect(new Set(texts).size).toBe(texts.length);
    }
  });

  it('keeps every number of the 2AP maths lessons under 1000, except the next number after 999', () => {
    const offenders: string[] = [];
    for (const lesson of COURSES_2AP.filter(l => l.subject === 'math')) {
      for (const number of JSON.stringify(lesson).match(/\d{4,}/g) ?? []) if (number !== '1000' || lesson.id !== 'math-2ap-t2-numbers-100-999') offenders.push(`${lesson.id}: ${number}`);
    }
    expect(offenders).toEqual([]);
  });
});
