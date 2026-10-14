import { test, expect } from '@playwright/test';
import { GAMES } from '../src/components/preschool/gamesHubCatalog';

for (const width of [320, 390]) {
  test.describe(`games ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true });
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        localStorage.setItem('mssid_locale_preference', 'ar');
        localStorage.setItem('mssid_preschool_language', 'fr');
        localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 400, badges: ['b_welcome'] }));
      });
      await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
        ? { id: 1, nom: 'Test', role: 'ROLE_FREE', grade: '5AP', xp: 400, score: 400, badges: ['b_welcome'] } : {} }));
    });
    const arenaGames = [
      { id: 'speed_math', titleAr: 'سباق الحساب الخاطف', preschool: false },
      { id: 'memory_matrix', titleAr: 'بطاقات الذاكرة', preschool: false },
      { id: 'boss_battle', titleAr: 'معركة الزعيم', preschool: false },
    ];
    for (const game of [...arenaGames, ...GAMES.map(game => ({ ...game, preschool: true }))]) {
      test(`${game.preschool ? 'preschool' : 'arena'} ${game.id} fits its playing surface`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(game.preschool ? '/eveil' : '/challenges?g=5AP');
        if (game.preschool) {
          await page.getByText('Jouer', { exact: true }).click();
          await page.locator(`[data-preschool-game="${game.id}"]`).click();
        } else {
          await page.getByRole('button', { name: new RegExp(game.titleAr) }).click();
        }
        await expect(page.locator(game.preschool ? '[data-preschool-game]' : '[data-challenges-layout]')).toHaveCount(0);
        if (game.preschool) {
          const firstLevel = page.getByRole('button', { name: /▶ Jouer/ }).first();
          if (await firstLevel.count()) await firstLevel.click();
          // Phaser games initialize asynchronously after choosing a level.
          if (['car_maze', 'farm', 'balloon_pop', 'fruit_catcher', 'little_fisher'].includes(game.id)) {
            await expect(page.locator('canvas').first()).toBeVisible();
          }
        }
        await expect(page.getByRole('button').last()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        const canvases = page.locator('canvas');
        for (const canvas of await canvases.all()) {
          const box = await canvas.boundingBox();
          if (box && box.width) {
            expect(box.x).toBeGreaterThanOrEqual(-1);
            expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
          }
        }
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        expect(errors).toEqual([]);
        if (width === 320) await page.screenshot({ path: `build/display-game-${game.id}-320.png`, fullPage: true });
      });
    }
  });
}
