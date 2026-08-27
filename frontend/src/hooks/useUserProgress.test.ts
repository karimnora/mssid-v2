import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  applyChallengeXp,
  applyGameXp,
  applyLessonXp,
  createFreshGuestProfile,
  markLessonQuizComplete,
  normalizeUserProfile,
  useUserProgress,
} from './useUserProgress';
import { UserProfile } from '../types';
import { AuthUser } from '../types/auth';

vi.mock('../utils/badgeEngine', () => ({
  applyBadgeEvaluation: (profile: UserProfile) => ({ profile, newlyUnlocked: [] }),
}));

describe('createFreshGuestProfile', () => {
  it('starts at the requested grade with no XP, lessons, or fake 5AP seed', () => {
    const profile = createFreshGuestProfile('1AP');
    expect(profile.grade).toBe('1AP');
    expect(profile.xp).toBe(0);
    expect(profile.level).toBe(1);
    expect(profile.completedLessonIds).toEqual([]);
    expect(profile.completedExamIds).toEqual([]);
    expect(profile.completedChallengeIds).toEqual([]);
    expect(profile.completedGameIds).toEqual([]);
    expect(profile.completedLabIds).toEqual([]);
    expect(profile.badges).toEqual([]);
    expect(profile.completedLessonIds).not.toContain('math-5ap-numbers');
  });
});

describe('normalizeUserProfile', () => {
  it('backfills completedLabIds for profiles saved before that field existed', () => {
    const { completedLabIds: _dropped, ...legacy } = createFreshGuestProfile('2AP');
    const normalized = normalizeUserProfile(legacy as UserProfile);
    expect(normalized.completedLabIds).toEqual([]);
  });
});

describe('lesson completion', () => {
  it('awards XP without marking the lesson complete', () => {
    const profile = createFreshGuestProfile('1AP');
    const next = applyLessonXp(profile, 'math-1ap-nombres', 15);
    expect(next.xp).toBe(15);
    expect(next.completedLessonIds).toEqual([]);
    expect(next.quizFullyValidatedLessonIds).toEqual([]);
    expect(next.quizScores['math-1ap-nombres']).toBe(15);
  });

  it('marks the lesson complete only after a full quiz', () => {
    const withXp = applyLessonXp(createFreshGuestProfile('1AP'), 'math-1ap-nombres', 15);
    const done = markLessonQuizComplete(withXp, 'math-1ap-nombres');
    expect(done.completedLessonIds).toEqual(['math-1ap-nombres']);
    expect(done.quizFullyValidatedLessonIds).toEqual(['math-1ap-nombres']);
  });
});

describe('challenge and game XP', () => {
  it('awards challenge XP only on the first success', () => {
    const first = applyChallengeXp(createFreshGuestProfile('1AP'), 'challenge-1ap-math-numbers', 10);
    expect(first.xp).toBe(10);
    expect(first.completedChallengeIds).toEqual(['challenge-1ap-math-numbers']);
    const replay = applyChallengeXp(first, 'challenge-1ap-math-numbers', 10);
    expect(replay.xp).toBe(10);
  });

  it('does not add arcade XP on replay', () => {
    const first = applyGameXp(createFreshGuestProfile('3AP'), 'dido_runner', 20);
    expect(first.xp).toBe(20);
    expect(applyGameXp(first, 'dido_runner', 20).xp).toBe(20);
  });
});

// Regression test for the external review finding: a child who spent all their coins down to a
// real 0 balance got silently reset to 150 free coins on the next lab reward, because `|| 150`
// treats a genuine 0 as "missing" (revue externe #4).
describe('handleLabReward', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds the reward on top of a real zero balance instead of resetting to the 150 demo default', () => {
    const { result } = renderHook(() => useUserProgress({ authUser: null }));

    act(() => {
      result.current.setUserProfile((prev) => ({ ...prev, goldCoins: 0 }));
    });
    act(() => {
      result.current.handleLabReward(20, 0);
    });

    expect(result.current.userProfile.goldCoins).toBe(20);
  });

  it('still applies the 150 default when goldCoins was never set', () => {
    const { result } = renderHook(() => useUserProgress({ authUser: null }));

    act(() => {
      result.current.setUserProfile((prev) => ({ ...prev, goldCoins: undefined }));
    });
    act(() => {
      result.current.handleLabReward(20, 0);
    });

    expect(result.current.userProfile.goldCoins).toBe(170);
  });
});

// Regression test for the external review finding: on a family device shared between siblings, a
// guest's (or a previous sibling's) local completedExamIds/completedChallengeIds/badges used to
// bleed into whichever real account logged in next, whenever that account's own server data for a
// field happened to be a genuinely empty array — `authUser.completedExamIds.length > 0 ? ... : prev`
// silently kept the leftover local data instead of trusting the server (revue externe #5).
describe('authUser merge does not leak local guest/sibling progress into a real account', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('trusts the server\'s genuinely empty history instead of falling back to local leftovers', () => {
    const { result, rerender } = renderHook(
      ({ authUser }: { authUser: AuthUser | null }) => useUserProgress({ authUser }),
      { initialProps: { authUser: null as AuthUser | null } }
    );

    act(() => {
      result.current.setUserProfile((prev) => ({
        ...prev,
        completedExamIds: ['exam-from-sibling'],
        completedChallengeIds: ['challenge-from-sibling'],
        badges: ['badge-from-sibling'],
        streakDays: 12,
      }));
    });

    const realAccount: AuthUser = {
      id: 1,
      nom: 'Kid B',
      email: 'kidb@example.com',
      role: 'ROLE_FREE',
      score: 0,
      completedExamIds: [],
      completedChallengeIds: [],
      badges: [],
      streakDays: 0,
    };

    act(() => {
      rerender({ authUser: realAccount });
    });

    expect(result.current.userProfile.completedExamIds).toEqual([]);
    expect(result.current.userProfile.completedChallengeIds).toEqual([]);
    expect(result.current.userProfile.badges).toEqual([]);
    expect(result.current.userProfile.streakDays).toBe(0);
  });

  it('still keeps local progress when the server genuinely has not sent that field at all', () => {
    const { result, rerender } = renderHook(
      ({ authUser }: { authUser: AuthUser | null }) => useUserProgress({ authUser }),
      { initialProps: { authUser: null as AuthUser | null } }
    );

    act(() => {
      result.current.setUserProfile((prev) => ({
        ...prev,
        completedExamIds: ['exam-local'],
      }));
    });

    const realAccount: AuthUser = {
      id: 2,
      nom: 'Kid A',
      email: 'kida@example.com',
      role: 'ROLE_FREE',
      score: 5,
    };

    act(() => {
      rerender({ authUser: realAccount });
    });

    expect(result.current.userProfile.completedExamIds).toEqual(['exam-local']);
  });
});

describe('logout does not replay the welcome badge toast', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('clears the unlock queue when resetting to a guest profile', () => {
    const { result } = renderHook(() => useUserProgress({ authUser: null }));

    act(() => {
      result.current.setNewlyUnlockedBadges([
        {
          id: 'b_welcome',
          titleAr: 'مجتهد الجزائر',
          descriptionAr: 'انضمامك لمنصة مسيد DZ والبدء في التعلم',
          icon: '🇩🇿',
          category: 'general',
          criteria: { type: 'first_login' },
        },
      ]);
    });
    expect(result.current.newlyUnlockedBadges).toHaveLength(1);

    act(() => {
      result.current.handleLogoutProgressReset('5AP');
    });

    expect(result.current.newlyUnlockedBadges).toEqual([]);
    expect(result.current.userProfile.badges).toEqual([]);
    expect(result.current.userProfile.xp).toBe(0);
  });
});
