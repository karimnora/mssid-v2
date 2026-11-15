import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

for (const scenario of [
  { grade: '1AP', width: 320, locale: 'ar', dark: false },
  { grade: '2AP', width: 390, locale: 'fr', dark: true },
  { grade: '3AP', width: 768, locale: 'fr', dark: false },
  { grade: '4AP', width: 390, locale: 'ar', dark: true },
  { grade: '5AP', width: 1440, locale: 'fr', dark: false },
] as const) {
  test(`${scenario.grade} ${scenario.width}px ${scenario.locale}: home stays readable and starts learning`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: scenario.width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: scenario.dark ? 'dark' : 'light' });
    await page.addInitScript(({ grade, locale }) => {
      localStorage.setItem('mssid_locale_preference', locale);
      localStorage.setItem('mssid_user_profile', JSON.stringify({ grade, xp: 0 }));
      Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true, value: () => [{ lang: 'ar-DZ' }, { lang: 'fr-FR' }] });
    }, scenario);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(`/?g=${scenario.grade}`);
    const home = page.locator('[data-home-layout]');
    const cards = home.locator('[data-subject-card]');
    await expect(cards).toHaveCount(4, { timeout: 60_000 });
    await expect(cards.first()).toBeVisible();
    expect(await cards.first().evaluate(element => getComputedStyle(element.parentElement!).opacity)).toBe('1');
    await expect(home).toHaveAttribute('dir', scenario.locale === 'ar' ? 'rtl' : 'ltr');
    const start = home.locator('.home-primary-action');
    await expect(start).toBeVisible();
    const bounds = await start.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(60);
    expect(bounds!.y + bounds!.height).toBeLessThan(800);
    const beforeCompanion = await home.evaluate(element => {
      const subjects = element.querySelector('#home-subjects-heading')!;
      const companion = element.querySelector('[data-companion-card]')!;
      return !!(subjects.compareDocumentPosition(companion) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(beforeCompanion).toBe(true);
    for (const card of await cards.all()) {
      const speaker = card.locator('[data-tap-speak]');
      if (await speaker.count()) {
        const cardBox = await card.boundingBox();
        const speakerBox = await speaker.boundingBox();
        expect(speakerBox!.y).toBeGreaterThanOrEqual(cardBox!.y);
        expect(speakerBox!.x).toBeGreaterThanOrEqual(cardBox!.x);
        expect(speakerBox!.x + speakerBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width);
      }
    }
    await expect(home.locator('.home-village-scene')).toHaveJSProperty('complete', true);
    expect(await home.locator('.home-village-scene').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const folder = resolve('..', 'output', 'home-refresh');
    mkdirSync(folder, { recursive: true });
    await page.screenshot({ path: resolve(folder, `${scenario.grade}-${scenario.locale}-${scenario.width}.png`), fullPage: true });
    const result = await new AxeBuilder({ page }).include('[data-home-layout]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations).toEqual([]);
    await start.click();
    await expect(page.locator('[data-course-browser]')).toHaveAttribute('data-course-browser', 'lessons');
    await expect(page.locator('[data-course-subject="math"]')).toHaveCount(0);
    await page.goto(`/?g=${scenario.grade}`);
    const subjectButton = page.locator('[data-subject-card="arabic"] > button');
    await subjectButton.click();
    await expect(page.locator('[data-course-browser]')).toHaveAttribute('data-course-browser', 'lessons');
    expect(errors).toEqual([]);
  });
}
