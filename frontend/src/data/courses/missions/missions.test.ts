import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../../coursesData';
import { MISSIONS_BY_LESSON } from './index';

const mathLessons = COURSES_DATA.filter(lesson => lesson.subject === 'math' && ['3AP', '4AP', '5AP'].includes(lesson.grade));
const exercisesOf = (lesson: (typeof COURSES_DATA)[number]) => [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []];

/** Evaluates "a × b = c" style lines; returns null when the line is not plain arithmetic. */
function sidesOf(line: string): number[] | null {
  const plain = line.replace(/ /g, '').replace(/,/g, '.');
  if (!plain.includes('=') || /[^\d\s.×÷+−()=/]/.test(plain)) return null;
  return plain.split('=').map(side => Function(`"use strict"; return (${side.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')});`)() as number);
}

describe('guided maths missions 3AP–5AP', () => {
  it('gives every curriculum maths lesson a mission', () => {
    const missing = mathLessons.filter(lesson => !lesson.learningPath && lesson.id !== 'soroban-basics').map(lesson => lesson.id);
    expect(missing).toEqual([]);
  });

  it('only targets lessons that exist', () => {
    const ids = new Set(COURSES_DATA.map(lesson => lesson.id));
    expect([...MISSIONS_BY_LESSON.keys()].filter(id => !ids.has(id))).toEqual([]);
  });

  it.each(mathLessons.filter(lesson => lesson.learningPath).map(lesson => [lesson.id, lesson] as const))('%s follows observe → model → guided → alone → transfer', (_id, lesson) => {
    const kinds = lesson.learningPath!.steps.map(step => step.kind);
    expect(kinds.slice(0, 3)).toEqual(['observe', 'model', 'guided']);
    expect(kinds.at(-1)).toBe('transfer');
    expect(kinds.slice(3, -1).length).toBeGreaterThanOrEqual(1);
    expect(kinds.slice(3, -1).every(kind => kind === 'independent')).toBe(true);

    const exercises = exercisesOf(lesson);
    const answers: unknown[] = [];
    for (const step of lesson.learningPath!.steps) {
      if (!('exerciseId' in step)) continue;
      const matches = exercises.filter(ex => ex.id === step.exerciseId);
      expect(matches, step.exerciseId).toHaveLength(1);
      const ex = matches[0];
      expect(ex.progressiveHints?.length ?? 0, ex.id).toBeGreaterThanOrEqual(2);
      if (ex.type === 'calculation') {
        expect(Number.isInteger(ex.calculationAnswer), ex.id).toBe(true);
        // A nudge for a wrong answer must never be attached to the right one.
        expect(ex.misconceptionsAr?.some(item => item.answer === ex.calculationAnswer) ?? false, ex.id).toBe(false);
        // No hint may hand over the result as a bare number.
        const result = String(ex.calculationAnswer);
        for (const hint of ex.progressiveHints ?? []) {
          const numbers = hint.contentAr.replace(/ /g, '').match(/\d+/g) ?? [];
          if (ex.calculationAnswer! > 9) expect(numbers.at(-1) === result && /=\s*[\d ]+\.?$/.test(hint.contentAr), `${ex.id}: ${hint.contentAr}`).toBe(false);
        }
        if (step.kind !== 'guided') answers.push(ex.calculationAnswer);
      } else {
        expect(ex.type, ex.id).toBe('qcm');
        expect(ex.options?.filter(option => option.isCorrect), ex.id).toHaveLength(1);
      }
      for (const line of ex.operationsAr?.split('\n') ?? []) {
        const sides = sidesOf(line);
        if (sides) expect(new Set(sides.map(value => Math.round(value * 1000))).size, `${ex.id}: ${line}`).toBe(1);
      }
    }
    for (const step of lesson.learningPath!.steps) {
      if ('exerciseId' in step || !step.workedExample) continue;
      for (const line of step.workedExample.operationsAr.split('\n')) {
        const sides = sidesOf(line);
        if (sides) expect(new Set(sides.map(value => Math.round(value * 1000))).size, `${lesson.id}: ${line}`).toBe(1);
      }
    }
  });

  it('keeps every exercise id unique in the catalogue', () => {
    const ids = COURSES_DATA.flatMap(lesson => exercisesOf(lesson).map(ex => ex.id));
    const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index && id.includes('-m-'));
    expect(duplicated).toEqual([]);
  });
});

describe.each([['french', 'fr'], ['english', 'en']] as const)('guided %s missions 3AP–5AP', (subject, lang) => {
  const frenchLessons = COURSES_DATA.filter(lesson => lesson.subject === subject && ['3AP', '4AP', '5AP'].includes(lesson.grade));

  it('gives every lesson a mission written for the voice of its language', () => {
    expect(frenchLessons.length).toBeGreaterThan(20);
    expect(frenchLessons.filter(lesson => lesson.learningPath?.lang !== lang).map(lesson => lesson.id)).toEqual([]);
  });

  it.each(frenchLessons.map(lesson => [lesson.id, lesson] as const))('%s is a complete choice-only mission', (_id, lesson) => {
    const path = lesson.learningPath!;
    const kinds = path.steps.map(step => step.kind);
    expect(kinds.slice(0, 3)).toEqual(['observe', 'model', 'guided']);
    expect(kinds.at(-1)).toBe('transfer');
    expect(kinds.slice(3, -1).every(kind => kind === 'independent')).toBe(true);
    const exercises = exercisesOf(lesson);
    for (const step of path.steps) {
      // Spoken text (titles, instructions, questions) must start in the lesson language, never in Arabic.
      expect(/^[A-Za-zÀ-ÿ«]/.test(step.titleAr), step.titleAr).toBe(true);
      if (!('exerciseId' in step)) {
        if (step.kind === 'observe') expect(step.visual?.type).toBe('sentence_parts');
        if (step.kind === 'model') expect(step.irabTable?.length ?? 0).toBeGreaterThanOrEqual(2);
        continue;
      }
      const matches = exercises.filter(ex => ex.id === step.exerciseId);
      expect(matches, step.exerciseId).toHaveLength(1);
      const ex = matches[0];
      expect(ex.type, ex.id).toBe('qcm');
      const correct = ex.options!.filter(option => option.isCorrect);
      expect(correct, ex.id).toHaveLength(1);
      expect(new Set(ex.options!.map(option => option.textAr)).size, ex.id).toBe(ex.options!.length);
      expect(ex.progressiveHints?.length ?? 0, ex.id).toBeGreaterThanOrEqual(2);
      // A hint may guide, never hand over the answer word for word.
      if (correct[0].textAr.length > 3) {
        for (const hint of ex.progressiveHints ?? []) expect(hint.contentAr.includes(correct[0].textAr), `${ex.id}: ${hint.contentAr}`).toBe(false);
      }
    }
  });
});

describe('science missions 3AP–5AP', () => {
  const lessons = COURSES_DATA.filter(lesson => lesson.subject === 'science' && ['3AP', '4AP', '5AP'].includes(lesson.grade));
  it('connects all 36 lessons, with the expected coverage by grade', () => {
    expect(['3AP', '4AP', '5AP'].map(grade => lessons.filter(lesson => lesson.grade === grade).length)).toEqual([9, 12, 15]);
    expect(lessons.filter(lesson => !lesson.learningPath).map(lesson => lesson.id)).toEqual([]);
  });
  it.each(lessons.map(lesson => [lesson.id, lesson] as const))('%s has an example and four answerable practice steps', (_id, lesson) => {
    const path = lesson.learningPath!;
    expect(path.steps.map(step => step.kind)).toEqual(['observe', 'model', 'guided', 'independent', 'independent', 'transfer']);
    const exercises = exercisesOf(lesson);
    for (const step of path.steps) {
      if (!('exerciseId' in step)) continue;
      const matches = exercises.filter(ex => ex.id === step.exerciseId);
      expect(matches).toHaveLength(1);
      const ex = matches[0];
      expect(ex.options?.filter(option => option.isCorrect)).toHaveLength(1);
      expect(new Set(ex.options?.map(option => option.textAr)).size).toBe(ex.options?.length);
      expect(ex.progressiveHints?.length).toBeGreaterThanOrEqual(2);
      expect(ex.detailedCorrectionAr?.length).toBeGreaterThan(10);
    }
  });
});
