import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

for (const voices of ['empty', 'french-only', 'arabic'] as const) {
  test(`4AP mobile with ${voices} voices: compact usable lesson`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(kind => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      localStorage.setItem('mssid_user_profile', JSON.stringify({ grade: '4AP', xp: 0 }));
      Object.defineProperty(window.speechSynthesis, 'getVoices', {
        configurable: true, value: () => kind === 'empty' ? [] : [{ lang: kind === 'arabic' ? 'ar-DZ' : 'fr-FR' }],
      });
    }, voices);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/lesson/math-4ap-numbers-under-100k?g=4AP');
    const lesson = page.locator('.lesson-learning-space');
    const path = lesson.locator('[data-autonomy-path]');
    await expect(path).toBeVisible({ timeout: 60000 });
    await expect(lesson).not.toContainText('محتوى بحاجة إلى تحقق');
    await expect(lesson).not.toContainText('مطابق لبرنامج رسمي');
    await expect(path).toContainText('23 405');
    await expect(path).not.toContainText('23,405');
    expect(await path.evaluate(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const index = node.textContent?.indexOf('23\u202f405') ?? -1;
        if (index < 0) continue;
        const range = document.createRange();
        range.setStart(node, index); range.setEnd(node, index + 2);
        const first = range.getBoundingClientRect().x;
        range.setStart(node, index + 3); range.setEnd(node, index + 6);
        return first < range.getBoundingClientRect().x;
      }
      return false;
    })).toBe(true);
    const goals = lesson.locator('details.lesson-objectives');
    await expect(goals).not.toHaveAttribute('open');
    await goals.locator('summary').click();
    await expect(goals.locator('ul')).toBeVisible();
    await goals.locator('summary').click();
    const select = lesson.getByRole('combobox', { name: 'اختر مرحلة الدرس' });
    await expect(select).toBeVisible();
    await select.selectOption('1');
    await expect(path).not.toBeVisible();
    await select.selectOption('0');
    await expect(path).toBeVisible();
    if (voices === 'arabic') await expect(lesson.locator('[data-tap-speak]').first()).toBeVisible();
    else {
      await expect(lesson.locator('[data-tap-speak]')).toHaveCount(0);
      await expect(lesson.getByRole('status')).toBeVisible();
    }
    const a11y = await new AxeBuilder({ page }).include('.lesson-mobile-step-picker').include('.lesson-objectives').analyze();
    expect(a11y.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const folder = resolve('..', 'output', 'lesson-polish-preview');
    mkdirSync(folder, { recursive: true });
    await lesson.screenshot({ path: resolve(folder, `4ap-${voices}.png`) });
  });
}
