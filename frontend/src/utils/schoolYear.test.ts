import { describe, expect, it, vi, afterEach } from 'vitest';
import { currentSchoolYearLabel } from './schoolYear';

describe('currentSchoolYearLabel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns year/year+1 from September onward', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 5)); // 2026-09-05 (month is 0-indexed)
    expect(currentSchoolYearLabel()).toBe('2026 / 2027');
  });

  it('still returns the previous school year in the summer before September', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 5, 20)); // 2027-06-20 — still 2026/2027
    expect(currentSchoolYearLabel()).toBe('2026 / 2027');
  });

  it('rolls over exactly on September 1st', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 7, 31)); // 2027-08-31 — last day of the old year
    expect(currentSchoolYearLabel()).toBe('2026 / 2027');

    vi.setSystemTime(new Date(2027, 8, 1)); // 2027-09-01 — new school year starts
    expect(currentSchoolYearLabel()).toBe('2027 / 2028');
  });
});
