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
import { setActiveProgressOwner } from '../utils/progressOwner';
import { loadAwardedQuestionIds, persistAwardedQuestionId } from '../utils/quizRewards';

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

  it('keeps valid XP and lessons when other fields are the wrong type', () => {
    const salvaged = normalizeUserProfile({
      name: 'سارة',
      grade: '3AP',
      xp: '40',
      completedLessonIds: ['math-3ap-ok', 12, null],
      completedExamIds: 'not-an-array',
      quizScores: { 'math-3ap-ok': 15, bad: 'nope' },
      lastActiveDate: new Date().toISOString().slice(0, 10),
    });
    expect(salvaged.name).toBe('سارة');
    expect(salvaged.grade).toBe('3AP');
    expect(salvaged.xp).toBe(40);
    expect(salvaged.completedLessonIds).toEqual(['math-3ap-ok']);
    expect(salvaged.completedExamIds).toEqual([]);
    expect(salvaged.quizScores).toEqual({ 'math-3ap-ok': 15 });
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
    const done = markLessonQuizComplete(withXp, 'math-1ap-t1-spatial-relations');
    expect(done.completedLessonIds).toEqual(['math-1ap-t1-spatial-relations']);
    expect(done.quizFullyValidatedLessonIds).toEqual(['math-1ap-t1-spatial-relations']);
    expect(done.competenceStats['math-1ap-c-spatial-position']?.successes).toBe(1);
    expect(done.competenceStats['math-1ap-c-spatial-position']?.failures).toBe(0);
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

  // Makes DIDOU_STAGES[1]'s "+10% de pièces d'or" perk real end-to-end, from the same entry point
  // every lab reward goes through.
  it('applies the Didou stage-2 +10% gold bonus once the student reaches level 4', () => {
    const { result } = renderHook(() => useUserProgress({ authUser: null }));

    act(() => {
      result.current.setUserProfile((prev) => ({ ...prev, goldCoins: 0, level: 4 }));
    });
    act(() => {
      result.current.handleLabReward(20, 0);
    });

    expect(result.current.userProfile.goldCoins).toBe(22);
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

  it('does not adopt guest history into a different account even if its server fields are absent', () => {
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

    expect(result.current.userProfile.completedExamIds).toEqual([]);
  });

  it('preserves local fields on a partial update of the same account', () => {
    const account: AuthUser = { id: 2, nom: 'Kid A', email: 'kida@example.test', role: 'ROLE_FREE', score: 5 };
    const { result, rerender } = renderHook(({ authUser }) => useUserProgress({ authUser }), { initialProps: { authUser: account } });
    act(() => result.current.setUserProfile(prev => ({ ...prev, completedExamIds: ['exam-local'] })));
    rerender({ authUser: { ...account, nom: 'Updated name' } });
    expect(result.current.userProfile.completedExamIds).toEqual(['exam-local']);
  });

  it('does not overlay account XP onto a selected child slot', () => {
    localStorage.setItem(
      'mssid_user_profile_child_7',
      JSON.stringify({
        ...createFreshGuestProfile('1AP'),
        name: 'Lina',
        completedExamIds: ['exam-lina'],
      }),
    );

    const realAccount: AuthUser = {
      id: 1,
      nom: 'Parent',
      email: 'parent@example.com',
      role: 'ROLE_FREE',
      score: 400,
      completedExamIds: [],
    };

    const { result } = renderHook(() => useUserProgress({ authUser: realAccount, activeChildId: 7 }));

    expect(result.current.userProfile.name).toBe('Lina');
    expect(result.current.userProfile.completedExamIds).toEqual(['exam-lina']);
    expect(result.current.userProfile.xp).toBe(0);
  });
});

describe('logout does not replay the welcome badge toast', () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveProgressOwner(null);
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

  it('drops guest quiz awards on logout without touching another account on the same device', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'guest-q');
    setActiveProgressOwner(4);
    persistAwardedQuestionId('math-1ap-nombres', 'user-q');
    const { result } = renderHook(() => useUserProgress({ authUser: null }));

    act(() => {
      result.current.handleLogoutProgressReset('1AP');
    });

    setActiveProgressOwner(null);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual([]);
    setActiveProgressOwner(4);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['user-q']);
  });
});

describe('handleQuizMiss', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records a mapped 1AP miss into competence stats for the parent notebook', () => {
    const { result } = renderHook(() => useUserProgress({ authUser: null }));
    act(() => {
      result.current.setUserProfile(createFreshGuestProfile('1AP'));
    });
    act(() => {
      result.current.handleQuizMiss('math-1ap-t1-spatial-relations');
    });
    expect(result.current.userProfile.competenceStats['math-1ap-c-spatial-position']?.lastOutcome).toBe('fail');
    expect(result.current.userProfile.competenceStats['math-1ap-c-spatial-position']?.failures).toBe(1);
  });
});
