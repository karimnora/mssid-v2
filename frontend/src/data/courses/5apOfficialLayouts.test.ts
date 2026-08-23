import { describe, expect, it } from 'vitest';
import { ARABIC_5AP } from './5AP/arabic';
import { MATH_5AP } from './5AP/math';

const GRAMMAR_LESSON_IDS = [
  'arabic-5ap-sentence-components',
  'arabic-5ap-kan-inna',
  'arabic-5ap-passive-voice',
  'arabic-5ap-annexation-adjective',
  'arabic-5ap-hal-five-names-verbs',
  'arabic-5ap-mutal-verbs-jazm-amr',
];

describe('5AP official layouts', () => {
  it('gives each dense grammar lesson a الكلمة / إعرابها table', () => {
    for (const id of GRAMMAR_LESSON_IDS) {
      const lesson = ARABIC_5AP.find((l) => l.id === id);
      expect(lesson, id).toBeDefined();
      expect(lesson!.irabTableAr?.length, id).toBeGreaterThanOrEqual(2);
    }
  });

  it('poses operations on 5AP calculation examples that already have a numeric solution', () => {
    const operations = MATH_5AP.find((l) => l.id === 'math-5ap-operations');
    expect(operations).toBeDefined();
    const posed = operations!.progressiveWorkedExamples?.filter((ex) => ex.operationsAr);
    expect(posed?.length).toBeGreaterThanOrEqual(3);
    expect(operations!.progressiveExercises?.some((ex) => ex.operationsAr)).toBe(true);
  });
});
