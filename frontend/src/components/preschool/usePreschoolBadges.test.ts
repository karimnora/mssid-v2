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
});
