import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { INTERACTIVE_LABS_LIST } from '../src/data/subjectsData';
import { COURSES_DATA } from '../src/data/coursesData';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('mssid_locale_preference', 'ar');
    // Keep the unrelated welcome toast deterministic; it otherwise appears while auth boots.
    localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
    class SilentAudio extends EventTarget {
      src = ''; preload = ''; paused = true;
      play() { this.paused = false; return Promise.resolve(); }
      pause() { this.paused = true; }
      removeAttribute() { this.src = ''; }
    }
    Object.defineProperty(window, 'Audio', { value: SilentAudio });
  });
  await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
    ? { id: 1, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: new URL(page.url()).searchParams.get('g') || '5AP', score: 0, badges: ['b_welcome'] } : {} }));
});

async function checkWidth(page: Page) {
  const overflow = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('body *')]
    .filter(el => { const rect = el.getBoundingClientRect(); return rect.width > 0 && (rect.right > innerWidth + 2 || rect.left < -2); })
    .slice(0, 12).map(el => ({ tag: el.tagName, classes: el.className, text: el.textContent?.slice(0, 40) })));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(overflow)).toBe(true);
}

for (const width of [320, 390]) {
  for (const lab of INTERACTIVE_LABS_LIST) {
    test(`${lab.id} mobile ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/labs/${lab.id}?g=5AP`);
      const shell = page.locator('[data-lab-shell="true"]');
      await expect(shell).toBeVisible();
      await expect(shell.getByRole('button').first()).toBeVisible();
      await checkWidth(page);
      // Check both the top and bottom of long tools, not only their catalogue cards.
      await shell.getByRole('button').last().scrollIntoViewIfNeeded();
      await checkWidth(page);
      // A control clipped behind fixed app chrome at an arbitrary scroll offset is not its target size.
      // Audit the layout at its stable initial position, after checking the full tool's width.
      await page.evaluate(() => scrollTo(0, 0));
      const result = await new AxeBuilder({ page }).include('[data-lab-shell="true"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(result.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
      expect(errors).toEqual([]);
      if (width === 390 && ['french_lab', 'english_lab', 'science_lab', 'soroban', 'islamic_lab'].includes(lab.id)) {
        await page.screenshot({ path: `build/mobile-${lab.id}.png`, fullPage: true });
      }
    });
  }

  for (const lesson of COURSES_DATA.filter(item => item.islamicInteractive?.type === 'quran_explorer')) {
    test(`course surahs ${lesson.id} mobile ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/lesson/${lesson.id}?g=${lesson.grade}`);
      const content = page.locator('#lesson-active-step-container');
      await expect(content).toBeVisible();
      for (let i = 0; i < 8; i++) {
        if (await content.getByRole('heading', { name: /الأداة التفاعلية المخصصة|أُجَرِّبُ|أُجَرِّبُ وأكتشف|أجرّب/ }).first().isVisible()) break;
        await page.locator('[data-primary-cta="next-step"]').click();
      }
      const player = page.locator('[data-quran-player]');
      await expect(player).toBeVisible();
      await checkWidth(page);
      const surahTabs = page.locator('[data-quran-course-surah]');
      for (let surahIndex = 0; surahIndex < Math.max(1, await surahTabs.count()); surahIndex++) {
        if (await surahTabs.count()) await surahTabs.nth(surahIndex).click();
        const verse = player.locator('[data-full-surah] button').last();
        await verse.click();
        await expect(verse).toBeVisible();
        const control = player.locator('[data-quran-recite="ayah"]');
        await control.click();
        await expect(control).toHaveAttribute('aria-label', 'إيقاف تلاوة الآية');
        await control.click();
        await checkWidth(page);
      }
      await page.evaluate(() => scrollTo(0, 0));
      const result = await new AxeBuilder({ page }).include('[data-islamic-tool="quran-explorer"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      if (result.violations.length) await page.screenshot({ path: `build/mobile-course-failure-${lesson.id}-${width}.png` });
      expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, detail: node.failureSummary })) }))).toEqual([]);
      if (width === 390) await page.screenshot({ path: `build/mobile-course-${lesson.id}.png` });
    });
  }
}
