import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DISCOVERY_MODULES } from '../src/data/preschool/discoveryModules';
for (const locale of ['fr', 'ar'] as const) {
    test('mosaic mobile journey ' + locale, async ({ page }, info) => {
        const fr = locale === 'fr';
        const say = (a: string, b: string) => fr ? a : b;
        await page.setViewportSize({ width: 360, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(l => localStorage.setItem('mssid_locale_preference', l), locale);
        await page.route('**/api/**', route => {
            const path = new URL(route.request().url()).pathname;
            if (path.endsWith('/users/me'))
                return route.fulfill({ json: { id: 7, nom: 'Parent Test', email: 'parent@example.test', role: 'ROLE_PREMIUM', grade: '5AP' } });
            if (path.endsWith('/cahiers/access'))
                return route.fulfill({ json: { premium: true, limit: 3, remaining: 3, unlockedIds: [], allowed: true, resetsAt: '2030-01-06T23:00:00Z' } });
            return route.fulfill({ json: {} });
        });
        await page.goto('/labs/cahiers_lab?g=5AP');
        const studio = page.locator('[data-family-studio]');
        await studio.getByRole('button', { name: new RegExp(say('Laboratoires Premium', 'مختبرات Premium')) }).click();
        await studio.getByRole('button', { name: new RegExp(say('Les mosaïques de Didou', 'فسيفساء ديدو')) }).click();
        const stage = studio.locator('[data-adventure="mosaic"]');
        const board = stage.getByRole('group');
        for (const target of [4, 15, 4]) {
            for (let i = 0; i < target; i++)
                await board.getByRole('button').nth(i).click();
            await stage.getByRole('button', { name: say('Vérifier ma mosaïque', 'أتحقّق من الفسيفساء') }).click();
            await expect(stage.getByRole('status')).toContainText(say('Ta mosaïque respecte', 'فسيفساؤك توافق'));
            await stage.getByRole('button', { name: say('Continuer les mosaïques', 'أتابع الفسيفساء') }).click();
        }
        await expect(stage).toContainText(say('Parcours terminé', 'انتهى المسار'));
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const boxes = await board.getByRole('button').evaluateAll(buttons => buttons.map(b => ({ width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height })));
        for (const box of boxes) {
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
        }
        await stage.screenshot({ path: info.outputPath('mosaic-' + locale + '.png'), style: '[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}' });
        const audit = await new AxeBuilder({ page }).include('[data-adventure="mosaic"]').withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(audit.violations).toEqual([]);
        await page.reload();
        await studio.getByRole('button', { name: new RegExp(say('Laboratoires Premium', 'مختبرات Premium')) }).click();
        await studio.getByRole('button', { name: new RegExp(say('Les mosaïques de Didou', 'فسيفساء ديدو')) }).click();
        await stage.locator('summary').click();
        await expect(stage.getByText(say('Réussi seul', 'نجح وحده'), { exact: true })).toHaveCount(3);
        await board.getByRole('button').first().click();
        // Anchored: in Arabic « مهمة سوق ديدو » (the market mission) would match too.
        await studio.getByRole('button', { name: new RegExp('^' + say('Le marché de Didou', 'سوق ديدو')) }).click();
        await page.getByRole('dialog').getByRole('button', { name: say('Continuer', 'متابعة'), exact: true }).click();
        await expect(board.getByRole('button').first()).toHaveAttribute('aria-pressed', 'true');
    });
}
for (const language of ['fr', 'ar', 'en'] as const) {
    test('preschool new paths and language ' + language, async ({ page }, info) => {
        const say = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(l => { localStorage.setItem('mssid_locale_preference', 'fr'); localStorage.setItem('mssid_preschool_language', l); }, language);
        await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
        await page.goto('/eveil');
        await page.getByText(say('Apprendre', 'أَتَعَلَّم', 'Learn'), { exact: true }).click();
        await page.getByText(say('Tracé et créatif', 'الْخَطّ وَالْإِبْدَاع', 'Writing and art'), { exact: true }).click();
        for (const m of DISCOVERY_MODULES)
            await expect(page.getByText(m.titleI18n[language], { exact: true })).toBeVisible();
        await page.getByText(DISCOVERY_MODULES[2].titleI18n[language], { exact: true }).click();
        // Open the first activity by its accessible title.
        await page.getByRole('button', { name: DISCOVERY_MODULES[2].activities[0].i18n[language].title, exact: true }).click();
        await expect(page.locator('[data-discovery-scene]')).toBeVisible();
        await expect(page.getByRole('heading', { name: DISCOVERY_MODULES[2].activities[0].i18n[language].title })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: info.outputPath('preschool-' + language + '.png'), fullPage: true });
    });
}
