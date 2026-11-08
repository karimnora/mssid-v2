import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { setActiveProgressOwner } from '../../utils/progressOwner';
import { useLevelProgress } from './useLevelProgress';

describe('level progression during child switches', () => {
  beforeEach(() => { localStorage.clear(); setActiveProgressOwner(7, 11); });
  it('keeps each child separate and ignores a callback left by the previous child', () => {
    const { result } = renderHook(() => useLevelProgress('maze', 8));
    act(() => result.current.completeLevel(3, 3));
    const oldCallback = result.current.completeLevel;
    expect(result.current.maxUnlocked).toBe(4);
    act(() => setActiveProgressOwner(7, 12));
    expect(result.current.maxUnlocked).toBe(1);
    act(() => oldCallback(7, 3));
    expect(result.current.maxUnlocked).toBe(1);
    act(() => result.current.completeLevel(1, 2));
    expect(result.current.totalStars).toBe(2);
    act(() => setActiveProgressOwner(7, 11));
    expect(result.current.maxUnlocked).toBe(4);
    expect(result.current.totalStars).toBe(3);
  });
  it('keeps completion callbacks stable across ordinary progress updates', () => {
    const { result, rerender } = renderHook(() => useLevelProgress('maze', 8));
    const complete = result.current.completeLevel;
    act(() => complete(1, 2));
    rerender();
    expect(result.current.completeLevel).toBe(complete);
  });
});
