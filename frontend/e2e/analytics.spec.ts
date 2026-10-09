import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const overview = {
  totalUsers: 110, totalXp: 12000, averageXp: 109, averageLevel: 2, averageStreakDays: 3,
  totalCompletedLessons: 44, totalCompletedExams: 5, totalCompletedChallenges: 6, totalBadgesUnlocked: 7,
  newUsersLast7Days: 17, newUsersLast30Days: 37, newUsersToday: 4,
  dailyActiveUsers: 7, weeklyActiveUsers: 8, monthlyActiveUsers: 9, retentionRate7Days: 33.33,
  retentionRate30Days: 66.67, stickinessDauMau: 77.7, activatedUsers: 8, activationRate: 7.2,
  neverActiveUsers: 19, inactive30DaysUsers: 28, emailVerifiedUsers: 95, parentEmailSetUsers: 41,
  roleDistribution: { ROLE_FREE: 109, ROLE_ADMIN: 1 }, gradeDistribution: { '5AP': 110 },
  wilayaDistribution: { '16': 44 }, providerDistribution: { LOCAL: 110 },
  topCompletedLessons: {}, topCompletedExams: {}, topCompletedChallenges: {},
  payments: { totalReceipts: 12, receiptsByStatus: { APPROVED: 12 }, receiptsByMethod: { CCP: 12 },
    totalAmountDzdApproved: 15000, totalAmountDzdPending: 0 },
};

for (const width of [390, 1440]) {
  test(`analytics dates, exports and errors are usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let corruptOverview = false;
    await page.route('**/api/**', route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/v1/users/me')) return route.fulfill({ json: { id: 1, nom: 'Admin', email: 'test@example.com', role: 'ROLE_ADMIN', grade: '5AP' } });
      if (url.pathname.endsWith('/admin/stats/overview')) return route.fulfill({ json: corruptOverview ? {} : overview });
      if (url.pathname.endsWith('/admin/stats/period')) {
        const from = url.searchParams.get('from')!; const to = url.searchParams.get('to')!;
        const days = Array.from({ length: (Date.parse(to) - Date.parse(from)) / 86400000 + 1 }, (_, i) => ({
          date: new Date(Date.parse(from) + i * 86400000).toISOString().slice(0, 10), registrations: i === 0 ? 2 : 0,
          submittedReceipts: i === 0 ? 1 : 0, approvedSubmittedAmountDzd: i === 0 ? 1500 : 0, pendingSubmittedAmountDzd: 0,
        }));
        return route.fulfill({ json: { from, to, timezone: 'UTC', days } });
      }
      return route.fulfill({ json: {} });
    });
    await page.goto('/admin');
    await expect(page.getByText('أكملوا درساً واحداً على الأقل', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '7 أيام / jours', exact: true }).click();
    const period = page.locator('section[aria-labelledby="analytics-period-title"]');
    await expect(period.getByRole('status')).toContainText('2 تسجيل جديد');
    await period.getByText('البيانات اليومية / Données quotidiennes', { exact: true }).click();
    await expect(period.locator('tbody tr')).toHaveCount(7);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'CSV الفترة / période' }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toMatch(/^mssid-periode-.*\.csv$/);
    const csv = await readFile((await download.path())!, 'utf8');
    expect(csv).toContain('approved_amount_of_submitted_receipts_dzd_current_status');
    expect(csv.split('\r\n')).toHaveLength(8);
    const globalDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'CSV الإجماليات / totaux' }).click();
    const snapshot = await readFile((await (await globalDownload).path())!, 'utf8');
    expect(snapshot).toContain('"totalUsers";"110"');
    await expect(page.getByText('110', { exact: true }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(axe.violations).toEqual([]);
    corruptOverview = true;
    await page.getByRole('button', { name: 'تحديث البيانات' }).click();
    await expect(page.getByRole('alert')).toContainText('بيانات الإحصائيات غير مكتملة');
    await expect(page.getByRole('button', { name: 'CSV الإجماليات / totaux' })).toBeDisabled();
    corruptOverview = false;
    await page.getByRole('button', { name: 'تحديث البيانات' }).click();
    await expect(page.getByRole('button', { name: 'CSV الإجماليات / totaux' })).toBeEnabled();
  });
}
