import { test, expect } from '@playwright/test';
import { COURSES_DATA } from '../src/data/coursesData';

for (const subject of ['science', 'english', 'french']) {
  const language = subject === 'science' ? 'ar-SA' : subject === 'english' ? 'en-US' : 'fr-FR';
  for (const available of [false, true]) {
    test(`3AP ${subject}: matching voice ${available}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(({ language, available }) => {
        localStorage.setItem('mssid_locale_preference', 'fr');
        localStorage.setItem('mssid_user_profile', JSON.stringify({ grade: '3AP', xp: 0 }));
        Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true,
          value: () => [{ lang: available ? language : 'de-DE', name: 'Test', default: true, localService: true, voiceURI: 'test' }],
        });
      }, { language, available });
      await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
      await page.goto('/courses?g=3AP');
      const browser = page.locator('[data-course-browser]');
      await expect(browser).toBeVisible({ timeout: 60_000 });
      await browser.locator(`[data-course-subject="${subject}"]`).getByRole('button').last().click();
      await browser.getByRole('group').getByRole('button').first().click();
      const card = browser.locator('article').first();
      await expect(card).toBeVisible();
      await expect(card.locator('[data-tap-speak]')).toHaveCount(available ? 1 : 0);
      const lesson = COURSES_DATA.find(item => item.grade === '3AP' && item.subject === subject)!;
      await page.goto(`/lesson/${lesson.id}?g=3AP`);
      const space = page.locator('.lesson-learning-space');
      await expect(space).toBeVisible();
      if (available) await expect(space.locator('[data-tap-speak]').first()).toBeVisible();
      else await expect(space.locator('[data-tap-speak]')).toHaveCount(0);
      await expect(space.locator('[data-autonomy-path]')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
