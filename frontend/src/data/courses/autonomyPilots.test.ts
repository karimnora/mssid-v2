import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { useLessonPractice } from '../../components/lessonViewer/useLessonPractice';

vi.mock('../../components/preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));

describe('autonomy pilots', () => {
  it.each(['math-4ap-numbers-under-100k', 'math-5ap-division'])('provides a complete authored progression in %s', id => {
    // The two hand-written pilots; the generated missions are covered in missions/missions.test.ts.
    const lesson = COURSES_DATA.find(l => l.id === id)!;
    const path = lesson.learningPath;
    expect(path).toBeDefined();
    // 4AP gets a second solo attempt (zero inside the number) before the transfer.
    expect(path!.steps.map(s => s.kind)).toEqual(id === 'math-4ap-numbers-under-100k'
      ? ['observe', 'model', 'guided', 'independent', 'independent', 'transfer']
      : ['observe', 'model', 'guided', 'independent', 'transfer']);
    const exercises = [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []];
    for (const step of path!.steps) {
      if ('exerciseId' in step) {
        const ex = exercises.find(e => e.id === step.exerciseId)!;
        expect(ex, step.exerciseId).toBeDefined();
        expect(ex.type).toBe('calculation');
        expect(ex.progressiveHints!.length).toBeGreaterThanOrEqual(2);
      }
    }
    expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(2);
    expect(lesson.quiz.length).toBeGreaterThan(0);
  });

  it.each([
    ['math-4ap-numbers-under-100k', 'guided', 2 * 100],
    ['math-4ap-numbers-under-100k', 'independent', 7 * 100],
    ['math-4ap-numbers-under-100k', 'transfer', 7 * 1000],
    ['math-5ap-division', 'guided', 23 % 5],
    ['math-5ap-division', 'independent', 29 % 6],
    ['math-5ap-division', 'transfer', Math.floor(52 / 8)],
  ])('accepts the mathematically correct %s / %s answer', (id, kind, answer) => {
    const lesson = COURSES_DATA.find(l => l.id === id)!;
    const step = lesson.learningPath?.steps.find(s => s.kind === kind);
    expect(step).toBeDefined();
    if (!step || !('exerciseId' in step)) throw new Error('Missing exercise step');
    const ex = [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []].find(e => e.id === step.exerciseId)!;
    const onComplete = vi.fn();
    const { result } = renderHook(() => useLessonPractice(lesson, onComplete));
    act(() => result.current.handlePracticeAnswerChange(ex.id, answer));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(true);
  });
});
