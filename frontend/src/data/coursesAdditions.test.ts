import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from './coursesData';

const byId = (id: string) => COURSES_DATA.find((lesson) => lesson.id === id);

describe('Phase 107 curriculum additions (new files only)', () => {
  it('registers the five official-gap lessons without duplicating ids', () => {
    const ids = [
      'arabic-1ap-t2-madd',
      'math-1ap-t2-compare-quantities',
      'math-5ap-circle-radius',
      'french-5ap-projet3-inventions-ecologie',
      'english-5ap-unit8-will-going-to',
      'english-5ap-unit9-giving-directions',
    ];
    ids.forEach((id) => expect(byId(id), id).toBeDefined());
    const allIds = COURSES_DATA.map((l) => l.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('keeps the existing 5AP French patrimoine lesson untouched', () => {
    const patrimoine = byId('french-5ap-projet3-visites-patrimoine');
    expect(patrimoine).toBeDefined();
    expect(patrimoine!.titleAr).toMatch(/patrimoine/i);
    expect(byId('french-5ap-projet3-inventions-ecologie')!.id).not.toBe(patrimoine!.id);
  });

  it('1AP madd and compare stay within 1AP constraints (quiz, no formal évaluation)', () => {
    ['arabic-1ap-t2-madd', 'math-1ap-t2-compare-quantities'].forEach((id) => {
      const lesson = byId(id)!;
      expect(lesson.grade).toBe('1AP');
      expect(lesson.evaluationExercises).toBeUndefined();
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      expect(lesson.educationalGame).toBeDefined();
    });
  });

  it('5AP circle uses the geometry domain and diameter = 2 × radius', () => {
    const lesson = byId('math-5ap-circle-radius')!;
    expect(lesson.categoryAr).toBe('الهندسة والفضاء');
    expect(lesson.rulesAr.some((r) => r.includes('2') && r.includes('شعاع'))).toBe(true);
  });
});
