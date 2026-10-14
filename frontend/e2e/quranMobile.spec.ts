import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 430]) {
  test(`Sourati remains readable and usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 640 : 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      class SilentAudio extends EventTarget {
        src = ''; preload = ''; paused = true;
        play() { this.paused = false; return Promise.resolve(); }
        pause() { this.paused = true; }
        removeAttribute() { this.src = ''; }
      }
      Object.defineProperty(window, 'Audio', { value: SilentAudio });
    });
    await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
      ? { id: 1, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: '5AP', score: 0, badges: ['b_welcome'] } : {} }));
    await page.goto('/labs/quran_lab?g=5AP');
    const lab = page.locator('[data-lab-instrument]');
    await expect(lab.getByRole('heading', { name: 'مختبر السور القصيرة' })).toBeVisible();
    await page.screenshot({ path: `build/sourati-top-${width}.png` });
    const overflowing = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('body *')]
      .filter(element => element.getBoundingClientRect().right > innerWidth + 2 || element.getBoundingClientRect().left < -2)
      .slice(0, 15).map(element => ({ tag: element.tagName, classes: element.className, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.getBoundingClientRect().width, text: element.textContent?.slice(0, 50) })));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(overflowing)).toBe(true);
    for (const control of ['surah', 'ayah']) {
      const button = lab.locator(`[data-quran-recite="${control}"]`);
      await expect(button).toBeVisible();
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
    await lab.getByRole('button', { name: 'استمع لتلاوة السورة' }).click();
    await expect(lab.getByRole('button', { name: 'إيقاف تلاوة السورة' })).toBeVisible();
    await lab.getByRole('button', { name: 'إيقاف تلاوة السورة' }).click();
    await lab.getByRole('button', { name: '3AP', exact: true }).click();
    await lab.locator('[data-quran-lab-surah]').last().click();
    const middleVerse = lab.locator('[data-full-surah] button').nth(3);
    await middleVerse.click();
    await lab.getByRole('button', { name: 'استمع لتلاوة الآية' }).click();
    await expect(lab.getByRole('button', { name: 'إيقاف تلاوة الآية' })).toBeVisible();
    await lab.getByRole('button', { name: 'إيقاف تلاوة الآية' }).click();
    const lastVerse = lab.locator('[data-full-surah] button').last();
    await lastVerse.click();
    await expect(lastVerse).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const violations = await new AxeBuilder({ page }).include('[data-lab-instrument]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(violations.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
    await page.screenshot({ path: `build/sourati-mobile-${width}.png` });
  });
}
