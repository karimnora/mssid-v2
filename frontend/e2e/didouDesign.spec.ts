import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

for (const scenario of [
  { name: 'mobile-fr', width: 320, locale: 'fr', theme: 'light' },
  { name: 'mobile-ar-dark', width: 390, locale: 'ar', theme: 'dark' },
  { name: 'desktop-fr', width: 1440, locale: 'fr', theme: 'light' },
] as const) {
  test(`${scenario.name}: Didou, food, wardrobe, growth and messages`, async ({ page }) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: scenario.width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: scenario.theme });
    await page.addInitScript(locale => localStorage.setItem('mssid_locale_preference', locale), scenario.locale);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/?g=4AP');
    const companion = page.locator('[data-companion-card]');
    await expect(companion).toBeVisible({ timeout: 60000 });
    await companion.getByRole('button', { name: scenario.locale === 'fr' ? 'Parler à Didou' : 'أتحدث مع ديدو', exact: true }).click();
    await expect(companion.getByRole('status')).toBeVisible();
    await companion.getByRole('button', { name: scenario.locale === 'fr' ? 'Fermer le message' : 'أغلق الرسالة' }).click();
    await companion.getByRole('button', { name: scenario.locale === 'fr' ? 'Nourrir' : 'أطعم ديدو', exact: true }).click();
    await expect(companion.locator('[data-home-treat]')).toHaveCount(5);
    const folder = resolve('..', 'output', 'didou-design-preview');
    mkdirSync(folder, { recursive: true });
    await companion.screenshot({ path: resolve(folder, `${scenario.name}-home.png`) });
    await companion.getByRole('button', { name: scenario.locale === 'fr' ? 'Sa garde-robe' : 'خزانة ديدو' }).click();
    const studio = page.getByRole('dialog');
    await expect(studio).toBeVisible();
    await studio.locator('[data-outfit="cheche_sahara"]').click();
    await studio.screenshot({ path: resolve(folder, `${scenario.name}-wardrobe.png`) });
    await studio.getByRole('tab', { name: scenario.locale === 'fr' ? 'Nourrir' : 'غذائي' }).click();
    await expect(studio.locator('[data-treat]')).toHaveCount(5);
    await studio.screenshot({ path: resolve(folder, `${scenario.name}-food.png`) });
    await studio.getByRole('tab', { name: scenario.locale === 'fr' ? 'Grandir' : 'أكبر' }).click();
    await expect(studio.locator('.didou-growth-steps li')).toHaveCount(3);
    await expect(studio.locator('.didou-growth-steps [aria-current="step"]')).toHaveCount(1);
    await studio.screenshot({ path: resolve(folder, `${scenario.name}-growth.png`) });
    await studio.getByRole('tab', { name: scenario.locale === 'fr' ? 'Parler' : 'نتحدث' }).click();
    await expect(studio.locator('.didou-dialogues article')).toHaveCount(6);
    await studio.screenshot({ path: resolve(folder, `${scenario.name}-talk.png`) });
    const a11y = await new AxeBuilder({ page }).include('[data-didou-studio]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(studio).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
