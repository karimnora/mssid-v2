import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const cases = [
  { name: '4ap-mobile', id: 'math-4ap-numbers-under-100k', grade: '4AP', width: 320, locale: 'ar', theme: 'light', answers: ['200', '700', '60000', '7000'] },
  { name: '5ap-mobile', id: 'math-5ap-division', grade: '5AP', width: 390, locale: 'ar', theme: 'light', answers: ['3', '5', '6'] },
  { name: '5ap-dark-fr', id: 'math-5ap-division', grade: '5AP', width: 390, locale: 'fr', theme: 'dark', answers: ['3', '5', '6'] },
  { name: '4ap-desktop', id: 'math-4ap-numbers-under-100k', grade: '4AP', width: 1440, locale: 'fr', theme: 'light', answers: ['200', '700', '60000', '7000'] },
] as const;

for (const scenario of cases) {
  test(`${scenario.name}: concrete example, retry and transfer stay free`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: scenario.width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: scenario.theme });
    await page.addInitScript(locale => {
      localStorage.setItem('mssid_locale_preference', locale);
      localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
    }, scenario.locale);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(`/lesson/${scenario.id}?g=${scenario.grade}`);
    const path = page.locator(`[data-autonomy-path="${scenario.id}"]`);
    await expect(path).toBeVisible({ timeout: 60_000 });
    await expect(path.getByRole('button', { name: 'أرجع', exact: true })).toBeDisabled();
    if (scenario.grade === '5AP') expect(await path.textContent()).toContain('\u206617 − 16 = 1\u2069');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    const folder = resolve('..', 'output', 'pedagogy-preview');
    mkdirSync(folder, { recursive: true });
    await path.screenshot({ path: resolve(folder, `${scenario.name}-observe.png`) });
    const a11y = await new AxeBuilder({ page }).include('[data-autonomy-path]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations).toEqual([]);

    await path.getByRole('button', { name: 'أتابع', exact: true }).click();
    await expect(path.locator('[data-math-worked-example="two-column"]')).toBeVisible();
    await path.screenshot({ path: resolve(folder, `${scenario.name}-model.png`) });
    await path.getByRole('button', { name: 'أتابع', exact: true }).click();
    await expect(path.getByRole('button', { name: 'أتابع', exact: true })).toBeDisabled();
    await path.getByRole('spinbutton').fill('2');
    await path.getByRole('button', { name: 'تحقق من الإجابة', exact: true }).click();
    await expect(path.getByRole('button', { name: 'أتابع', exact: true })).toBeDisabled();
    await path.getByRole('button', { name: 'حاول مرة أخرى', exact: true }).click();

    for (const [index, answer] of scenario.answers.entries()) {
      await path.getByRole('spinbutton').fill(answer);
      await path.getByRole('button', { name: 'تحقق من الإجابة', exact: true }).click();
      const next = path.getByRole('button', { name: index === scenario.answers.length - 1 ? 'أنتقل إلى التدريبات' : 'أتابع', exact: true });
      await expect(next).toBeEnabled();
      if (index === scenario.answers.length - 1) await path.screenshot({ path: resolve(folder, `${scenario.name}-transfer.png`) });
      await next.click();
    }
    await expect(path).not.toBeVisible();
    await expect(page.getByRole('button', { name: /Premium|اشتراك|شراء|payer|abonnement/i })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
