import type { AdminStatsOverview } from './AnalyticsModule';

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isDistribution = (value: unknown) => isObject(value) && Object.values(value).every(isNumber);

/** Reject missing/malformed facts rather than silently displaying invented zeroes. */
export function isStatsOverview(value: unknown): value is AdminStatsOverview {
  if (!isObject(value) || !isObject(value.payments)) return false;
  const numbers = ['totalUsers', 'totalXp', 'averageXp', 'averageLevel', 'averageStreakDays',
    'totalCompletedLessons', 'totalCompletedExams', 'totalCompletedChallenges', 'totalBadgesUnlocked',
    'newUsersLast7Days', 'newUsersLast30Days', 'newUsersToday', 'dailyActiveUsers', 'weeklyActiveUsers',
    'monthlyActiveUsers', 'retentionRate7Days', 'retentionRate30Days', 'stickinessDauMau',
    'activatedUsers', 'activationRate', 'neverActiveUsers', 'inactive30DaysUsers', 'emailVerifiedUsers', 'parentEmailSetUsers'];
  const maps = ['roleDistribution', 'gradeDistribution', 'wilayaDistribution', 'providerDistribution',
    'topCompletedLessons', 'topCompletedExams', 'topCompletedChallenges'];
  return numbers.every(key => isNumber(value[key])) && maps.every(key => isDistribution(value[key]))
    && ['totalReceipts', 'totalAmountDzdApproved', 'totalAmountDzdPending'].every(key => isNumber(value.payments[key]))
    && ['receiptsByStatus', 'receiptsByMethod'].every(key => isDistribution(value.payments[key]));
}

export interface StatsDay {
  date: string;
  registrations: number;
  submittedReceipts: number;
  approvedSubmittedAmountDzd: number;
  pendingSubmittedAmountDzd: number;
}
export interface StatsPeriod { from: string; to: string; timezone: string; days: StatsDay[] }

const validDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date)
  && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
export function periodError(from: string, to: string, today = new Date().toISOString().slice(0, 10)): string | null {
  if (!validDate(from) || !validDate(to) || from > to) return 'اختر تاريخ بداية ونهاية صالحين.';
  if (to > today) return 'لا يمكن اختيار تاريخ في المستقبل.';
  if ((Date.parse(to) - Date.parse(from)) / 86400000 > 365) return 'الحد الأقصى للفترة هو 366 يوماً.';
  return null;
}
export function isStatsPeriod(value: unknown, from: string, to: string): value is StatsPeriod {
  if (!isObject(value) || value.from !== from || value.to !== to || typeof value.timezone !== 'string'
      || !Array.isArray(value.days) || periodError(from, to)) return false;
  const count = (Date.parse(to) - Date.parse(from)) / 86400000 + 1;
  return value.days.length === count && value.days.every((day, index) => isObject(day)
    && day.date === new Date(Date.parse(from) + index * 86400000).toISOString().slice(0, 10)
    && ['registrations', 'submittedReceipts', 'approvedSubmittedAmountDzd', 'pendingSubmittedAmountDzd'].every(key => isNumber(day[key])));
}

// BOM for Excel; quote cells and neutralize spreadsheet formula injection in distribution keys.
export function toCsv(rows: (string | number)[][]): string {
  return '\uFEFF' + rows.map(row => row.map(value => {
    let cell = String(value);
    if (typeof value === 'string' && /^[\s]*[=+@-]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replaceAll('"', '""') + '"';
  }).join(';')).join('\r\n');
}
export function overviewCsv(stats: AdminStatsOverview): string {
  const rows: (string | number)[][] = [['scope', 'metric', 'value']];
  const append = (value: Record<string, unknown>, prefix: string) => Object.entries(value).forEach(([key, item]) => {
    if (typeof item === 'number') rows.push(['snapshot_current_and_cumulative', prefix + key, item]);
    else if (isObject(item)) append(item, prefix + key + '.');
  });
  append(stats as unknown as Record<string, unknown>, '');
  return toCsv(rows);
}
export function periodCsv(period: StatsPeriod): string {
  return toCsv([['date', 'timezone', 'registrations', 'submitted_receipts',
    'approved_amount_of_submitted_receipts_dzd_current_status', 'pending_amount_of_submitted_receipts_dzd_current_status'],
    ...period.days.map(day => [day.date, period.timezone, day.registrations, day.submittedReceipts,
      day.approvedSubmittedAmountDzd, day.pendingSubmittedAmountDzd])]);
}
export function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
