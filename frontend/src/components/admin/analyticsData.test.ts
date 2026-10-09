import { describe, expect, it } from 'vitest';
import { isStatsPeriod, periodCsv, periodError, toCsv } from './analyticsData';

describe('analytics periods and exports', () => {
  it('validates dates, leap days, inclusive 366-day limit and future dates', () => {
    expect(periodError('2024-01-01', '2024-12-31', '2025-01-01')).toBeNull();
    expect(periodError('2024-01-01', '2025-01-01', '2025-01-01')).toContain('366');
    expect(periodError('2025-02-29', '2025-03-01', '2025-04-01')).not.toBeNull();
    expect(periodError('2024-02-29', '2024-02-29', '2025-01-01')).toBeNull();
    expect(periodError('2025-02-02', '2025-02-01', '2025-04-01')).not.toBeNull();
    expect(periodError('2025-02-01', '2025-02-03', '2025-02-02')).not.toBeNull();
  });
  it('rejects missing days, negative values and out-of-order series', () => {
    const day = { date: '2025-01-01', registrations: 2, submittedReceipts: 0, approvedSubmittedAmountDzd: 0, pendingSubmittedAmountDzd: 0 };
    const period = { from: day.date, to: day.date, timezone: 'UTC', days: [day] };
    expect(isStatsPeriod(period, day.date, day.date)).toBe(true);
    expect(isStatsPeriod({ ...period, days: [] }, day.date, day.date)).toBe(false);
    expect(isStatsPeriod({ ...period, days: [{ ...day, registrations: -1 }] }, day.date, day.date)).toBe(false);
    expect(isStatsPeriod({ ...period, days: [{ ...day, date: '2025-01-02' }] }, day.date, day.date)).toBe(false);
    expect(periodCsv(period)).toContain('"2025-01-01";"UTC";"2";"0";"0";"0"');
  });
  it('exports Excel-compatible quoted CSV with formula protection', () => {
    const csv = toCsv([['عنوان; "test"', '=HYPERLINK("bad")', ' \t@SUM(1)', 42]]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('"عنوان; ""test"""');
    expect(csv).toContain('"\'=HYPERLINK');
    expect(csv).toContain('"\' \t@SUM');
    expect(csv).toContain(';"42"');
  });
});
