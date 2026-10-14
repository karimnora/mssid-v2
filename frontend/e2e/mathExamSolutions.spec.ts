import { test, expect } from '@playwright/test';
import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';

for (const width of [320, 390, 1280]) {
  test(`acquis math solutions keep calculations and parentheses coherent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
    });
    await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
      ? { id: 1, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: '5AP', score: 0, badges: ['b_welcome'] } : {} }));
    await page.goto('/?g=5AP');
    await page.getByRole('button', { name: 'أختبر', exact: true }).click();
    await page.locator('[data-exam-kind="acquis"]').click();
    await page.locator('[data-exam-subject="math"]').click();
    const exam = OFFICIAL_EXAMS_DATA.find(item => item.id === 'exam-5ap-math-acquis-2026')!;
    await page.getByText(exam.titleAr, { exact: true }).click();
    await page.getByRole('button', { name: /إظهار كافة الحلول/ }).click();
    const sheet = page.locator('.printable-sheet');
    await expect(sheet).toContainText('45.95');
    await expect(sheet).not.toContainText('46.95');
    const solutions = page.locator('[data-exam-two-col]');
    expect(await solutions.nth(1).textContent()).toContain('\u2066(120 × 3) ÷ 4 = 90\u2069');
    const columns = await solutions.nth(1).locator(':scope > div').all();
    const solutionBox = (await columns[0].boundingBox())!;
    const operationsBox = (await columns[1].boundingBox())!;
    if (width < 480) expect(operationsBox.y).toBeGreaterThan(solutionBox.y + solutionBox.height - 2);
    else expect(operationsBox.y).toBeCloseTo(solutionBox.y, 0);
    for (const solution of await solutions.all()) {
      await solution.scrollIntoViewIfNeeded();
      await expect(solution).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await solutions.nth(1).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `build/math-acquis-solutions-${width}.png` });
    if (width === 390) {
      await sheet.evaluate(element => element.setAttribute('data-print-mode', 'corrige'));
      await page.emulateMedia({ media: 'print' });
      const printedColumns = await solutions.nth(1).locator(':scope > div').all();
      expect((await printedColumns[0].boundingBox())!.y).toBeCloseTo((await printedColumns[1].boundingBox())!.y, 0);
      await page.pdf({ path: 'build/math-acquis-corrected.pdf', preferCSSPageSize: true, printBackground: true });
      await expect(sheet).toContainText('45.95');
      expect(await solutions.nth(1).textContent()).toContain('\u2066(120 × 3) ÷ 4 = 90\u2069');
    }
  });
}
