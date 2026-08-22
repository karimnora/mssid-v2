import { describe, expect, it } from 'vitest';
import {
  applyChallengeXp,
  applyGameXp,
  applyLessonXp,
  createFreshGuestProfile,
  markLessonQuizComplete,
  normalizeUserProfile,
} from './useUserProgress';
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
