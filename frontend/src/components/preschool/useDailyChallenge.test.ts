import { describe, it, expect } from 'vitest';
import { localDateKey, localYesterdayKey } from './useDailyChallenge';

describe('daily challenge calendar (device timezone, not UTC)', () => {
  it('formats a local calendar day as YYYY-MM-DD', () => {
    const morning = new Date(2026, 7, 22, 0, 30, 0);
    expect(localDateKey(morning)).toBe('2026-08-22');
  });

  it('keeps the local calendar day at 00:30 local, not the UTC ISO date', () => {
    const justAfterMidnight = new Date(2026, 7, 23, 0, 30, 0);
    expect(localDateKey(justAfterMidnight)).toBe('2026-08-23');
  });

  it('yesterday is the previous local calendar day, including month boundaries', () => {
    const firstOfMarch = new Date(2026, 2, 1, 12, 0, 0);
    expect(localYesterdayKey(firstOfMarch)).toBe('2026-02-28');
  });
});
