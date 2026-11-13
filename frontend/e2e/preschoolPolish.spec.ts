import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 1280]) {
  test(`preschool guided counting and home activity at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem('mssid_locale_preference', 'fr');
      localStorage.setItem('mssid_preschool_language', 'fr');
    });
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/eveil');
    await expect(page.getByRole('img', { name: 'Didou', exact: true })).toBeVisible();
    const hero = page.getByRole('img', { name: 'Didou', exact: true }).locator('img');
    await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`home-${width}.png`), fullPage: true });
    await page.getByText('Apprendre', { exact: true }).click();
    await page.getByText('Lettres, chiffres et formes', { exact: true }).click();
    await page.getByText('De 0 à 5', { exact: true }).click();
    await page.getByText('🌱 En famille : une idée à la maison', { exact: true }).click();
    await expect(page.getByText(/donnez une cuillère/)).toBeVisible();
    await page.getByRole('button', { name: 'Trois', exact: true }).first().click();
    await expect(page.locator('[data-quantity-guide] > span')).toHaveCount(3);
    await page.getByRole('button', { name: '🍎', exact: true }).first().click();
    await expect(page.getByText('1 / 3', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`count-${width}.png`), fullPage: true });
  });
}

test('young challenge has no nested interactive controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/challenges?g=1AP');
  await page.locator('[data-challenge-id]').first().click();
  await expect(page.locator('button button')).toHaveCount(0);
  const audit = await new AxeBuilder({ page }).withRules(['nested-interactive']).analyze();
  expect(audit.violations).toEqual([]);
});
