import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePreschoolBadges } from './usePreschoolBadges';
import { badgeStorageKey } from './preschoolProgress';

beforeEach(() => {
  localStorage.clear();
});

describe('usePreschoolBadges owner key', () => {
  it('does not inherit another profile’s badges', () => {
    localStorage.setItem(badgeStorageKey('child-1'), JSON.stringify(['first-star']));
    const { result } = renderHook(() =>
      usePreschoolBadges({
        ownerId: 'user-9',
        completedActivityIds: [],
        completedByModule: {},
        streak: 0,
      }),
    );
    expect(result.current.unlockedIds.has('first-star')).toBe(false);
  });

  it('does not copy previous badges when a new owner earns their first star', () => {
    localStorage.setItem(badgeStorageKey('user-1'), JSON.stringify(['pb_50_activities']));
    const base = { completedActivityIds: [] as string[], completedByModule: {}, streak: 0 };
    const { result, rerender } = renderHook((props) => usePreschoolBadges(props), {
      initialProps: { ...base, ownerId: 'user-1' },
    });
    rerender({ ...base, ownerId: 'user-2', completedActivityIds: ['num-0'] });
    expect(result.current.unlockedIds.has('pb_first_star')).toBe(true);
    expect(result.current.unlockedIds.has('pb_50_activities')).toBe(false);
    expect(JSON.parse(localStorage.getItem(badgeStorageKey('user-2'))!)).toEqual(['pb_first_star']);
  });
});
