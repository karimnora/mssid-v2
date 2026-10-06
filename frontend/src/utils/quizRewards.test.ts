import { afterEach, describe, expect, it } from 'vitest';
import { setActiveProgressOwner } from './progressOwner';
import {
  claimDailyLessonRevisionBonus,
  clearGuestQuizRewards,
  hasAwardedGameXp,
  loadAwardedQuestionIds,
  migrateGuestQuizRewardsToUser,
  persistAwardedQuestionId,
  persistGameXpAwarded,
} from './quizRewards';

describe('quizRewards', () => {
  afterEach(() => {
    localStorage.clear();
    setActiveProgressOwner(null);
  });

  it('remembers first-success question ids across a reload', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'q1');
    persistAwardedQuestionId('math-1ap-nombres', 'q1');
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['q1']);
  });

  it('gives one revision bonus per lesson per day', () => {
    expect(claimDailyLessonRevisionBonus('math-1ap-nombres')).toBe(true);
    expect(claimDailyLessonRevisionBonus('math-1ap-nombres')).toBe(false);
    expect(claimDailyLessonRevisionBonus('arabic-1ap-letters')).toBe(true);
  });

  it('records game XP once per lesson', () => {
    expect(hasAwardedGameXp('math-1ap-nombres')).toBe(false);
    persistGameXpAwarded('math-1ap-nombres');
    expect(hasAwardedGameXp('math-1ap-nombres')).toBe(true);
  });

  it('keeps first-success awards on one profile from blocking the next person on the same device', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'q1');
    setActiveProgressOwner(42);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual([]);
    persistAwardedQuestionId('math-1ap-nombres', 'q2');
    setActiveProgressOwner(null);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['q1']);
    setActiveProgressOwner(42);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['q2']);
  });

  it('copies guest awards onto an empty account then drops the guest ledger', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'q1');
    migrateGuestQuizRewardsToUser(7);
    setActiveProgressOwner(7);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['q1']);
    setActiveProgressOwner(null);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual([]);
  });

  it('does not overwrite an existing account ledger with leftover guest awards', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'guest-q');
    setActiveProgressOwner(9);
    persistAwardedQuestionId('math-1ap-nombres', 'user-q');
    migrateGuestQuizRewardsToUser(9);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['user-q']);
  });

  it('clears only the guest ledger on logout', () => {
    persistAwardedQuestionId('math-1ap-nombres', 'guest-q');
    setActiveProgressOwner(3);
    persistAwardedQuestionId('math-1ap-nombres', 'user-q');
    setActiveProgressOwner(null);
    clearGuestQuizRewards();
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual([]);
    setActiveProgressOwner(3);
    expect(loadAwardedQuestionIds('math-1ap-nombres')).toEqual(['user-q']);
  });
});
