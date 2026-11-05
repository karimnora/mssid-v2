import { test, expect } from '@playwright/test';
import { COMPETENCE_CAHIERS } from '../src/data/cahiers/competenceCahiers';
// The app bundles previews only; the full cahier comes from the backend (same source file).
import { COMPETENCE_CAHIERS as FULL_CAHIERS } from '../content-authoring/competenceCahiers';
const docs = COMPETENCE_CAHIERS.filter(d => d.grade === '1AP').slice(0, 4);
for (const premium of [false, true]) {
  test(`${premium ? 'Premium' : 'Free'} family has predictable cahier access on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem('mssid_locale_preference', 'fr'));
    const unlocked: string[] = []; let requests = 0;
    const snapshot = () => ({ premium, limit: 3, remaining: Math.max(0, 3 - unlocked.length), unlockedIds: unlocked, allowed: true, resetsAt: '2030-01-06T23:00:00Z' });
    await page.route('**/api/**', route => {
      const path = new URL(route.request().url()).pathname;
      if (path.endsWith('/v1/users/me')) return route.fulfill({ json: { id: 7, nom: 'Parent Test', email: 'parent@example.test', role: premium ? 'ROLE_PREMIUM' : 'ROLE_FREE', grade: '1AP' } });
      if (path.endsWith('/cahiers/access')) return route.fulfill({ json: snapshot() });
      // An unlocked cahier is served by the backend (protected premium documents).
      if (path.endsWith('/content')) {
        const doc = FULL_CAHIERS.find(d => d.competenceId === decodeURIComponent(path.split('/').at(-2)!));
        return doc ? route.fulfill({ json: doc }) : route.fulfill({ status: 404, json: {} });
      }
      if (path.endsWith('/unlock')) {
        requests++;
        const id = decodeURIComponent(path.split('/').at(-2)!);
        if (!premium && !unlocked.includes(id) && unlocked.length >= 3) return route.fulfill({ status: 429, json: { ...snapshot(), allowed: false } });
        if (!unlocked.includes(id)) unlocked.push(id);
        return route.fulfill({ json: snapshot() });
      }
      return route.fulfill({ json: {} });
    });
    await page.goto('/labs/cahiers_lab?g=1AP');
    await expect(page.locator('[data-cahier]').first()).toBeVisible({ timeout: 30000 });
    for (const doc of docs.slice(0, premium ? 4 : 3)) {
      await page.locator(`[data-cahier="${doc.competenceId}"]`).click();
      if (!premium) await page.getByRole('button', { name: 'Débloquer ce cahier — 1 crédit' }).click();
      await expect(page.locator('.printable-sheet')).toBeVisible();
      await page.locator('.sheet-print-modal button.kids-close').click();
    }
    if (premium) { expect(requests).toBe(0); return; }
    expect(requests).toBe(3);
    await page.locator(`[data-cahier="${docs[3].competenceId}"]`).click();
    await expect(page.getByText(/Les 3 nouveaux cahiers gratuits/)).toBeVisible();
    await expect(page.getByRole('dialog').getByText(/Renouvellement le/)).toBeVisible();
    await page.getByRole('button', { name: 'Continuer gratuitement' }).click();
    await page.locator(`[data-cahier="${docs[0].competenceId}"]`).click();
    await expect(page.locator('.printable-sheet')).toBeVisible();
    expect(requests).toBe(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
