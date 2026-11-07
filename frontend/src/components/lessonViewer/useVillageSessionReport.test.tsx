import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useVillageSessionReport } from './useVillageSessionReport';
import { setActiveProgressOwner } from '../../utils/progressOwner';
import type { CourseLesson } from '../../types';
import type { FractionObservations } from './fractionJourneyContent';
import type { PracticeBindings } from './practiceBindings';
const lesson = { id: 'math-5ap-fractions', grade: '5AP', titleAr: 'Fractions', quiz: [], progressiveExercises: [] } as unknown as CourseLesson;
const practice = { sessionResults: {} } as PracticeBindings;
beforeEach(() => { vi.useFakeTimers(); setActiveProgressOwner(7); });
afterEach(() => { vi.useRealTimers(); setActiveProgressOwner(); });
const setup = () => {
  const saved = vi.fn();
  const view = renderHook(({ learn }: { learn: FractionObservations }) => useVillageSessionReport(lesson, learn, {}, practice, {}, saved), { initialProps: { learn: {} } });
  return { ...view, saved };
};
it('does not save raw touches and batches rapid verified outcomes into one latest report', () => {
  const view = setup();
  for (let i = 0; i < 20; i++) view.rerender({ learn: {} });
  act(() => vi.advanceTimersByTime(1000));
  expect(view.saved).not.toHaveBeenCalled();
  for (let i = 1; i <= 5; i++) {
    view.rerender({ learn: { decompose: { completed: true, helped: false, attempts: i } } });
    act(() => vi.advanceTimersByTime(100));
  }
  expect(view.saved).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(600));
  expect(view.saved).toHaveBeenCalledTimes(1);
  expect(view.saved.mock.calls[0][1].villageSummary.learn.decompose.attempts).toBe(5);
  view.unmount();
  expect(view.saved).toHaveBeenCalledTimes(1);
});
it('flushes the final pending outcome on lesson exit', () => {
  const view = setup();
  view.rerender({ learn: { decompose: { completed: false, helped: true, attempts: 1 } } });
  view.unmount();
  expect(view.saved).toHaveBeenCalledTimes(1);
  act(() => vi.advanceTimersByTime(1000));
  expect(view.saved).toHaveBeenCalledTimes(1);
});
it('never flushes the previous child into a new active profile', () => {
  const view = setup();
  view.rerender({ learn: { decompose: { completed: true, helped: false, attempts: 1 } } });
  setActiveProgressOwner(7, 12);
  view.unmount();
  expect(view.saved).not.toHaveBeenCalled();
});
