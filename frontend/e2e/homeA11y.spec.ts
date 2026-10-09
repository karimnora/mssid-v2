import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const scenario of [
  { name: 'Arabic home', url: '/', locale: 'ar', colorScheme: 'light' as const },
  { name: 'French home', url: '/', locale: 'fr', colorScheme: 'light' as const },
  { name: 'French home in dark mode', url: '/', locale: 'fr', colorScheme: 'dark' as const },
  { name: 'French preschool', url: '/eveil', locale: 'fr', colorScheme: 'light' as const },
]) {
  test(`${scenario.name} has no automatic accessibility violations on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: scenario.colorScheme, reducedMotion: 'reduce' });
    await page.addInitScript(locale => {
      localStorage.setItem('mssid_locale_preference', locale);
      localStorage.setItem('mssid_preschool_language', locale);
    }, scenario.locale);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(scenario.url);
    if (scenario.url === '/') {
      await expect(page.locator('[data-subject-card="math"]')).toBeVisible();
    } else {
      await expect(page.getByText('Ateliers', { exact: true })).toBeVisible({ timeout: 15000 });
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
