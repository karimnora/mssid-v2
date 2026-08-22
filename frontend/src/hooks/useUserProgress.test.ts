import { describe, expect, it } from 'vitest';
import { createFreshGuestProfile, normalizeUserProfile } from './useUserProgress';
import { UserProfile } from '../types';

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
