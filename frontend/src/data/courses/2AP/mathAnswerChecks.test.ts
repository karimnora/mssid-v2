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

describe('2AP exercises outside maths check the answer', () => {
  const OPEN_ON_PURPOSE = ['ex2-ar2ap-time', 'ex3-ar2ap-lam', 'ex3-ar2ap-taa', 'ex3-ar2ap-ifh', 'ex2-sc2ap-growth', 'ex3-sc2ap-pl', 'ex3-sc2ap-an', 'ex3-sc2ap-sol', 'ex3-sc2ap-wat', 'ex2-civics2ap-rights2', 'ex2-isl2ap-manners'];
  const exercises = COURSES_2AP.filter(lesson => lesson.subject !== 'math').flatMap(lesson => lesson.progressiveExercises ?? []);

  it('leaves open only the exercises where the child writes a free answer', () => {
    expect(exercises.filter(ex => !ex.type).map(ex => ex.id).filter(id => !OPEN_ON_PURPOSE.includes(id))).toEqual([]);
  });

  it.each(exercises.filter(ex => ex.type === 'qcm').map(ex => [ex.id, ex] as const))('%s offers one right answer among distinct choices', (_id, ex) => {
    // Raw text on purpose: «أَنْتِ» and «أَنْتَ» differ only by a vowel mark and are a real choice.
    const texts = ex.options!.map(option => option.textAr);
    expect(ex.options!.filter(option => option.isCorrect)).toHaveLength(1);
    expect(ex.options!.find(option => option.isCorrect)!.textAr).toBe(ex.solutionAr);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

