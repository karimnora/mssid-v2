import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDelayedCompletion } from './useDelayedCompletion';

afterEach(() => vi.useRealTimers());
describe('delayed game results', () => {
  it('publishes the latest result once', () => {
    vi.useFakeTimers();
    const first = vi.fn(); const latest = vi.fn();
    const { result } = renderHook(() => useDelayedCompletion());
    act(() => { result.current(first, 700); result.current(latest, 900); });
    act(() => vi.advanceTimersByTime(1000));
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });
  it('does not finish a game after leaving it, even through a retained callback', () => {
    vi.useFakeTimers(); const complete = vi.fn();
    const { result, unmount } = renderHook(() => useDelayedCompletion());
    const retired = result.current;
    act(() => retired(complete, 900));
    unmount();
    act(() => { retired(complete, 100); vi.advanceTimersByTime(2000); });
    expect(complete).not.toHaveBeenCalled();
  });
  it('ignores an old activity after switching to another one', () => {
    vi.useFakeTimers(); const complete = vi.fn();
    const { result, rerender } = renderHook(({ id }) => useDelayedCompletion(id), { initialProps: { id: 'first' } });
    const retired = result.current;
    act(() => retired(complete, 900));
    rerender({ id: 'second' });
    act(() => { retired(complete, 100); vi.advanceTimersByTime(2000); });
    expect(complete).not.toHaveBeenCalled();
  });
});
