import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { GARDEN_PLANS } from '../src/data/garden/gardenMission';
for (const locale of ['fr', 'ar'] as const) {
    test('full garden mission on mobile ' + locale, async ({ page }, info) => {
        const say = (fr: string, ar: string) => locale === 'fr' ? fr : ar;
        const plan = GARDEN_PLANS['5AP'];
        await page.setViewportSize({ width: 360, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(l => localStorage.setItem('mssid_locale_preference', l), locale);
        await page.route('**/api/**', route => { const path = new URL(route.request().url()).pathname; if (path.endsWith('/users/me'))
            return route.fulfill({ json: { id: 7, nom: 'Parent Test', email: 'parent@example.test', role: 'ROLE_PREMIUM', grade: '5AP' } }); if (path.endsWith('/cahiers/access'))
            return route.fulfill({ json: { premium: true, limit: 3, remaining: 3, unlockedIds: [], allowed: true, resetsAt: '2030-01-06T23:00:00Z' } }); return route.fulfill({ json: {} }); });
        await page.goto('/labs/cahiers_lab?g=5AP');
        const studio = page.locator('[data-family-studio]');
        await studio.getByRole('button', { name: new RegExp(say('Laboratoires Premium', 'مختبرات Premium')) }).click();
        await studio.getByRole('button', { name: new RegExp(say('La mission du jardin de Didou', 'مهمة حديقة ديدو')) }).click();
        const mission = page.locator('[data-garden-mission]');
        const board = mission.locator('.garden-seed-grid');
        const rootBounds=await mission.boundingBox();const headingBounds=await mission.locator('.garden-top h3').boundingBox();expect(headingBounds!.x).toBeGreaterThanOrEqual(rootBounds!.x-1);expect(headingBounds!.x+headingBounds!.width).toBeLessThanOrEqual(rootBounds!.x+rootBounds!.width+1);
        await board.getByRole('button').first().click();
        await mission.getByRole('button', { name: say('Retour', 'رجوع'), exact: true }).click();
        await page.getByRole('dialog').getByRole('button', { name: say('Continuer', 'متابعة'), exact: true }).click();
        await expect(board.getByRole('button').first()).toHaveAttribute('aria-pressed', 'true');
        for (let i = 1; i < 15; i++)
            await board.getByRole('button').nth(i).click();
        const boxes = await board.getByRole('button').evaluateAll(bs => bs.map(b => ({ w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height })));
        for (const b of boxes) {
            expect(b.w).toBeGreaterThanOrEqual(44);
            expect(b.h).toBeGreaterThanOrEqual(44);
        }
        await mission.getByRole('button', { name: say('Vérifier mon défi', 'أتحقّق من التحدي') }).click();
        await mission.getByRole('button', { name: say('Continuer la mission', 'أتابع المهمة') }).click();
        await mission.getByRole('textbox').fill('180');
        await mission.getByRole('button', { name: say('Vérifier mon défi', 'أتحقّق من التحدي') }).click();
        await mission.getByRole('button', { name: say('Terminer cette séance', 'أنهي هذه الجلسة') }).click();
        await mission.getByRole('button', { name: say('Ouvrir la séance suivante', 'أفتح الجلسة التالية') }).click();
        for (let i = 1; i <= 4; i++)
            for (let j = 0; j < 3; j++)
                await mission.getByRole('button', { name: say('Arroser le pot ', 'أسقي الأصيص ') + i, exact: true }).click();
        await mission.screenshot({ path: info.outputPath('garden-water-' + locale + '.png'), style: '[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}' });
        await mission.getByRole('button', { name: say('Vérifier mon défi', 'أتحقّق من التحدي') }).click();
        await mission.getByRole('button', { name: say('Continuer la mission', 'أتابع المهمة') }).click();
        const reading = plan.tasks[3];
        if (reading.kind !== 'read')
            throw Error('Reading task missing');
        await mission.getByRole('button', { name: reading.options.find(o => o.id === reading.correct)!.label[locale], exact: true }).click();
        await mission.getByRole('button', { name: say('Terminer cette séance', 'أنهي هذه الجلسة') }).click();
        await mission.getByRole('button', { name: say('Ouvrir la séance suivante', 'أفتح الجلسة التالية') }).click();
        for (let i = 1; i <= 4; i++)
            for (let j = 0; j < 5; j++)
                await mission.getByRole('button', { name: say('Ajouter au panier ', 'أضيف للسلة ') + i, exact: true }).click();
        await mission.getByRole('button', { name: say('Vérifier mon défi', 'أتحقّق من التحدي') }).click();
        await mission.getByRole('button', { name: say('Continuer la mission', 'أتابع المهمة') }).click();
        await mission.getByRole('button', { name: say('Faire l’observation plus tard', 'نؤجّل الملاحظة') }).click();
        await expect(mission.getByRole('heading', { name: say('Le carnet du jardin', 'دفتر الحديقة') })).toBeVisible();
        await expect(mission.getByLabel(say('Défis réussis', 'تحديات ناجحة'))).toContainText('5 / 6');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const audit = await new AxeBuilder({ page }).include('[data-garden-mission]').withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(audit.violations).toEqual([]);
        await mission.screenshot({ path: info.outputPath('garden-report-' + locale + '.png'), style: '[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}' });
        await page.reload();
        await studio.getByRole('button', { name: new RegExp(say('Laboratoires Premium', 'مختبرات Premium')) }).click();
        await studio.getByRole('button', { name: new RegExp(say('La mission du jardin de Didou', 'مهمة حديقة ديدو')) }).click();
        await expect(mission.getByLabel(say('Défis réussis', 'تحديات ناجحة'))).toContainText('5 / 6');
    });
}
for (const language of ['fr', 'ar', 'en'] as const) {
    test('preschool garden discovery ' + language, async ({ page }, info) => {
        const t = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(l => { localStorage.setItem('mssid_locale_preference', 'fr'); localStorage.setItem('mssid_preschool_language', l); }, language);
        await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
        await page.goto('/eveil');
        await page.getByText(t('Ateliers', 'الْوَرَشَات', 'Create'), { exact: true }).click();
        await page.getByText(t('La mission du jardin de Didou', 'مهمة حديقة ديدو', 'Didou’s garden mission'), { exact: true }).click();
        const mission = page.locator('[data-garden-mission="preschool"]');
        await expect(mission).toBeVisible();
        const board = mission.locator('.garden-seed-grid');
        for (let i = 0; i < 3; i++)
            await board.getByRole('button').nth(i).click();
        await mission.getByRole('button', { name: t('Vérifier mon défi', 'أتحقّق من التحدي', 'Check my challenge') }).click();
        await mission.getByRole('button', { name: t('Continuer la mission', 'أتابع المهمة', 'Continue the mission') }).click();
        await mission.locator('.garden-number-choices').getByRole('button', { name: '4', exact: true }).click();
        await mission.getByRole('button', { name: t('Terminer cette séance', 'أنهي هذه الجلسة', 'Finish this session') }).click();
        await expect(mission.locator('.garden-sessions button').nth(1)).toBeDisabled();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await mission.screenshot({ path: info.outputPath('garden-preschool-' + language + '.png'), style: '[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}' });
    });
}
