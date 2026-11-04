import { describe, expect, it } from 'vitest';
import { examCountdown, inDaysAr, inDaysFr } from './examCountdown';

describe('examCountdown (J-15 banner)', () => {
  it('stays hidden more than 15 days before the trimester compositions', () => {
    expect(examCountdown(new Date(2026, 10, 4))).toBeNull(); // 27 days before 1 December
  });

  it('shows from J-15 to J-1 with the trimester and the days left', () => {
    expect(examCountdown(new Date(2026, 10, 16))).toEqual({ examDate: '2026-12-01', trimester: 1, daysLeft: 15 });
    expect(examCountdown(new Date(2026, 10, 30))?.daysLeft).toBe(1);
    expect(examCountdown(new Date(2027, 1, 25))).toMatchObject({ examDate: '2027-03-08', trimester: 2 });
  });

  it('is gone on the day itself (the next window is months away)', () => {
    expect(examCountdown(new Date(2026, 11, 1))).toBeNull();
  });

  it('agrees the Arabic number with the count of days', () => {
    expect(inDaysAr(1)).toBe('غداً');
    expect(inDaysAr(2)).toBe('بعد يومين');
    expect(inDaysAr(7)).toBe('بعد 7 أيام');
    expect(inDaysAr(10)).toBe('بعد 10 أيام');
    expect(inDaysAr(11)).toBe('بعد 11 يوماً');
    expect(inDaysFr(1)).toBe('demain');
    expect(inDaysFr(12)).toBe('dans 12 jours');
  });
});
