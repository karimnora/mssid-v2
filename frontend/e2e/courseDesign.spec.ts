import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const cases = [
  { grade: '1AP', locale: 'ar', width: 320, theme: 'light' },
  { grade: '2AP', locale: 'fr', width: 390, theme: 'light' },
  { grade: '3AP', locale: 'ar', width: 768, theme: 'light' },
  { grade: '4AP', locale: 'ar', width: 390, theme: 'dark' },
  { grade: '5AP', locale: 'fr', width: 1440, theme: 'light' },
] as const;

for (const scenario of cases) {
  test(`${scenario.grade} ${scenario.locale}: subject, trimester, lesson and return`, async ({ page }) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: scenario.width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: scenario.theme });
    await page.addInitScript(({ locale, grade }) => {
      localStorage.setItem('mssid_locale_preference', locale);
      localStorage.setItem('mssid_user_profile', JSON.stringify({ grade, xp: 0, badges: ['b_welcome'] }));
    }, scenario);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    const folder = resolve('..', 'output', 'course-design-preview');
    mkdirSync(folder, { recursive: true });
    await page.goto(`/courses?g=${scenario.grade}`);
    const browser = page.locator('[data-course-browser]');
    await expect(browser).toHaveAttribute('data-course-browser', 'subjects', { timeout: 60000 });
    await expect(browser).toHaveAttribute('dir', scenario.locale === 'fr' ? 'ltr' : 'rtl');
    await browser.screenshot({ path: resolve(folder, `${scenario.grade}-subjects.png`) });
    await browser.locator('[data-course-subject="math"]').getByRole('button').last().click();
    await expect(browser).toHaveAttribute('data-course-browser', 'lessons');
    const terms = browser.getByRole('group');
    await terms.getByRole('button').first().click();
    await expect(terms.getByRole('button').first()).toHaveAttribute('aria-pressed', 'true');
    const start = browser.locator('[data-course-start]');
    await expect(start).toBeVisible();
    const firstId = await browser.locator('[data-lesson-id]').first().getAttribute('data-lesson-id');
    await terms.getByRole('button').nth(1).click();
    await expect(terms.getByRole('button').nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(browser.locator('[data-lesson-id]').first()).not.toHaveAttribute('data-lesson-id', firstId!);
    await terms.getByRole('button').first().click();
    await expect(browser.locator('[data-lesson-id]').first()).toHaveAttribute('data-lesson-id', firstId!);
    const a11y = await new AxeBuilder({ page }).include('[data-course-browser]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await browser.screenshot({ path: resolve(folder, `${scenario.grade}-lessons.png`) });
    if (scenario.grade === '3AP') {
      const card = browser.locator('[data-lesson-id]').first();
      await card.focus();
      await page.keyboard.press('Enter');
    } else await start.click();
    await expect(page).toHaveURL(new RegExp('/lesson/' + firstId));
    const lesson = page.locator('.lesson-learning-space');
    await expect(lesson).toBeVisible();
    if (scenario.grade === '4AP' || scenario.grade === '5AP') {
      await expect(lesson.locator('.lesson-stage-picker [aria-current="step"]')).toHaveCount(1);
      const lessonA11y = await new AxeBuilder({ page }).include('.lesson-reading-heading').include('.lesson-stage-picker')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(lessonA11y.violations).toEqual([]);
    }
    await lesson.screenshot({ path: resolve(folder, `${scenario.grade}-lesson.png`) });
    await expect(page.getByRole('button', { name: /Premium|اشتراك|شراء|payer|abonnement/i })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await lesson.locator('.lesson-toolbar').getByRole('button').first().click();
    await expect(page).toHaveURL(/\/courses/);
    expect(errors).toEqual([]);
  });
}
