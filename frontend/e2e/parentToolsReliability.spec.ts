import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
});

for (const setup of [
  { name: 'mobile-fr', lang: 'fr', width: 320, dark: false },
  { name: 'mobile-ar-dark', lang: 'ar', width: 390, dark: true },
  { name: 'desktop-fr', lang: 'fr', width: 1440, dark: false },
]) {
  test(setup.name + ': isolated profiles, dates and working resource actions', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: setup.width, height: 900 });
    await page.goto('/e2e/parentToolsHarness.html?lang=' + setup.lang + '&dark=' + setup.dark);
    await expect(page.locator('html')).toHaveClass(setup.dark ? 'theme-dark' : 'theme-light');
    const plan = page.locator('[data-exam-plan]');
    await expect(plan.locator('[data-exam-plan-day]')).toHaveCount(10);
    const date = plan.locator('input[type="date"]');
    await date.fill('2026-11-20');
    await expect(plan.locator('[data-exam-plan-day]')).toHaveCount(8);
    await plan.getByRole('button', { name: setup.lang === 'fr' ? 'Marquer fait' : 'تَمَّ اليَوْمَ', exact: true }).first().click();
    await expect(plan.locator('[data-exam-plan-progress]')).toContainText('1/8');
    await plan.getByRole('button', { name: setup.lang === 'fr' ? '▶ Revoir la leçon' : '▶ رَاجِعِ الدَّرْسَ', exact: true }).first().click();
    await expect(page.getByLabel('Ressource ouverte')).toHaveText('arabic-5ap-tamyiz');
    await page.getByRole('button', { name: 'Démo Lina 4AP', exact: true }).click();
    await expect(page.getByLabel('Profil actif')).toContainText('Lina — 4AP');
    await expect(date).toHaveValue('2026-12-01');
    await expect(plan.locator('[data-exam-plan-progress]')).toContainText('0/10');
    await expect(plan).toContainText(setup.lang === 'fr' ? 'Programme général' : 'برنامج مراجعة عام');
    await plan.getByRole('button', { name: setup.lang === 'fr' ? '▶ Revoir la leçon' : '▶ رَاجِعِ الدَّرْسَ', exact: true }).first().click();
    await expect(page.getByLabel('Ressource ouverte')).toContainText('4ap');
    await page.getByRole('button', { name: 'Démo Amine 5AP', exact: true }).click();
    await expect(date).toHaveValue('2026-11-20');
    await expect(plan.locator('[data-exam-plan-progress]')).toContainText('1/8');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(setup.name + '.png'), fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('resource network failure offers a working retry without trapping the parent', async ({ page }) => {
  let failed = false;
  await page.route('**/src/data/coursesData.ts*', route => {
    if (!failed) { failed = true; return route.abort('failed'); }
    return route.continue();
  });
  await page.goto('/e2e/parentToolsHarness.html?lang=fr');
  await expect(page.getByRole('alert')).toContainText('Les cours restent accessibles séparément');
  await page.getByRole('button', { name: 'Recharger la page', exact: true }).click();
  await expect(page.locator('[data-exam-plan-day]')).toHaveCount(10);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a hung canvas export returns text and leaves controls usable', async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.toBlob = () => {}; });
  await page.goto('/e2e/parentToolsHarness.html?lang=fr');
  await expect(page.locator('[data-exam-plan-day]')).toHaveCount(10);
  const exportButton = page.getByRole('button', { name: 'Préparer le bilan sans envoyer' });
  await exportButton.click();
  await expect(page.getByLabel('Résultat export')).toContainText('Bilan de la semaine — Démo Amine', { timeout: 10000 });
  await expect(exportButton).toBeEnabled();
  await page.getByRole('button', { name: 'Démo Lina 4AP', exact: true }).click();
  await expect(page.getByLabel('Résultat export')).toBeEmpty();
  await exportButton.click();
  await expect(page.getByLabel('Résultat export')).toContainText('Bilan de la semaine — Démo Lina');
  await expect(page.getByLabel('Résultat export')).not.toContainText('Amine');
});

test('real browser canvas produces an image without sending it', async ({ page }) => {
  await page.goto('/e2e/parentToolsHarness.html?lang=ar');
  await page.getByRole('button', { name: 'Préparer le bilan sans envoyer' }).click();
  await expect(page.getByLabel('Résultat export')).toHaveText('Image prête : image/png');
});
