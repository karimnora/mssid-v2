import { afterEach, describe, expect, it } from 'vitest';
import {
  claimDailyLessonRevisionBonus,
  hasAwardedGameXp,
  loadAwardedQuestionIds,
  persistAwardedQuestionId,
  persistGameXpAwarded,
} from './quizRewards';

describe('quizRewards', () => {
  afterEach(() => {
    localStorage.clear();
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
});
