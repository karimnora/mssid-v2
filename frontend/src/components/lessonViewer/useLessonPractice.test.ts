import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CourseLesson, ProgressiveExercise } from '../../types';
import { COURSES_DATA } from '../../data/coursesData';
import { useLessonPractice } from './useLessonPractice';
import { isGuidedPractice } from './practiceAssessment';
import { playGentleNudge, playSuccessChime } from '../preschool/usePreschoolAudio';

vi.mock('../preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));
vi.mock('./shared', async (importOriginal) => ({
  ...await importOriginal<typeof import('./shared')>(),
  shuffleOptions: <T,>(items: T[]) => [...items].reverse(),
}));

const exercise: ProgressiveExercise = {
  id: 'qcm', level: 1, levelLabelAr: 'أتدرب', type: 'qcm', problemAr: '1 + 1؟', hintsAr: [],
  options: [{ id: 'right', textAr: '2', isCorrect: true }, { id: 'wrong', textAr: '3', isCorrect: false }],
  solutionAr: '2', detailedCorrectionAr: '1 + 1 = 2', xpReward: 10,
};
const lesson: CourseLesson = {
  id: 'practice-test', grade: '1AP', subject: 'math', categoryAr: '', titleAr: '', summaryAr: '',
  rulesAr: [], quiz: [], progressiveExercises: [exercise],
};
const catalogueExercises = COURSES_DATA.flatMap(l => [...(l.progressiveExercises || []), ...(l.evaluationExercises || [])]);

describe('practice assessment integrity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('records guided correction consultation without awarding success or XP for all affected catalogue exercises', () => {
    const onComplete = vi.fn();
    const guided = catalogueExercises.filter(isGuidedPractice);
    expect(guided.length).toBeGreaterThan(0);
    const { result } = renderHook(() => useLessonPractice(lesson, onComplete));
    act(() => guided.forEach(ex => result.current.checkPracticeExercise(ex)));
    for (const ex of guided) {
      expect(result.current.practiceChecked[ex.id]).toBe(true);
      expect(result.current.practiceCorrect[ex.id]).toBeUndefined();
    }
    expect(onComplete).not.toHaveBeenCalled();
    expect(playSuccessChime).not.toHaveBeenCalled();
    expect(playGentleNudge).not.toHaveBeenCalled();
    expect(result.current.awardedExerciseIds.size).toBe(0);
  });

  it('excludes guided activities from the scored evaluation', () => {
    const guided = { ...exercise, id: 'guided', type: undefined };
    const { result } = renderHook(() => useLessonPractice({ ...lesson, evaluationExercises: [guided, exercise] }, vi.fn()));
    act(() => result.current.checkPracticeExercise(guided));
    expect(result.current.evaluationExercises).toEqual([guided, exercise]);
    expect(result.current.scoredEvaluationExercises).toEqual([exercise]);
    expect(result.current.evaluationCheckedCount).toBe(0);
    expect(result.current.evaluationComplete).toBe(false);
    act(() => result.current.handlePracticeAnswerChange(exercise.id, 'right'));
    act(() => result.current.checkPracticeExercise(exercise));
    expect(result.current.evaluationComplete).toBe(true);
    expect(result.current.evaluationScorePercent).toBe(100);
  });

  const ambiguous = catalogueExercises.filter(ex => ex.type === 'matching' &&
    new Set(ex.matchingPairsAr!.map(pair => pair.rightAr)).size < ex.matchingPairsAr!.length);
  it.each(ambiguous.map(ex => [ex.id, ex] as const))('accepts interchangeable matching targets in %s', (_id, ex) => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useLessonPractice(lesson, onComplete));
    const pairs = ex.matchingPairsAr!;
    const first = pairs.findIndex((p, i) => pairs.some((other, j) => i !== j && p.rightAr === other.rightAr));
    const second = pairs.findIndex((p, i) => i !== first && p.rightAr === pairs[first].rightAr);
    act(() => pairs.forEach((_, i) => result.current.handleConnectMatching(ex.id, i, i === first ? second : i === second ? first : i)));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(lesson.id, ex.xpReward);
  });

  it('rejects a different category and repeated use of a single target', () => {
    const ex: ProgressiveExercise = { ...exercise, type: 'matching', matchingPairsAr: [
      { leftAr: 'بنت', rightAr: 'مفتوحة' }, { leftAr: 'شجرة', rightAr: 'مربوطة' }, { leftAr: 'معلمات', rightAr: 'مفتوحة' },
    ] };
    const onComplete = vi.fn();
    const { result } = renderHook(() => useLessonPractice(lesson, onComplete));
    act(() => [1, 0, 2].forEach((r, l) => result.current.handleConnectMatching(ex.id, l, r)));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(false);
    act(() => [0, 1, 0].forEach((r, l) => result.current.handleConnectMatching(ex.id, l, r)));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('keeps shuffled choices stable during answering and retry, and grades by option ID', () => {
    const onComplete = vi.fn();
    const { result, rerender } = renderHook(() => useLessonPractice(lesson, onComplete));
    expect(result.current.practiceOptionOrder.qcm).toEqual(['wrong', 'right']);
    act(() => result.current.handlePracticeAnswerChange(exercise.id, 'right'));
    rerender();
    expect(result.current.practiceOptionOrder.qcm).toEqual(['wrong', 'right']);
    act(() => result.current.checkPracticeExercise(exercise));
    expect(result.current.practiceCorrect.qcm).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
    act(() => result.current.resetPracticeExercise(exercise));
    expect(result.current.canCheckExercise(exercise)).toBe(false);
    expect(result.current.practiceOptionOrder.qcm).toEqual(['wrong', 'right']);
    act(() => result.current.handlePracticeAnswerChange(exercise.id, 'right'));
    act(() => result.current.checkPracticeExercise(exercise));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
