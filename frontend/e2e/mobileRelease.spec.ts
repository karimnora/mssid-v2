import { test, expect } from '@playwright/test';

test.use({ channel: process.env.PLAYWRIGHT_CHANNEL, viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mssid_locale_preference', 'fr'));
  await page.route('**/api/**', (route) => route.fulfill({
    status: route.request().url().includes('/users/me') ? 401 : 200,
    contentType: 'application/json', body: '{}',
  }));
  await page.route('**/accounts.google.com/**', (route) => route.abort());
});

test('Android browser installation and voluntary review from settings', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (Linux; Android 14) Chrome/131.0 Mobile' }));
  await page.goto('/');
  const install = page.getByRole('link', { name: 'Télécharger sur Google Play', exact: true }).first();
  await expect(install).toBeVisible({ timeout: 20000 });
  await expect(install).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=dz.mssid.app');
  await page.getByRole('button', { name: 'Plus tard', exact: true }).click();
  await page.locator('[data-nav-settings]').click();
  await expect(page.getByText(/^Version \d+\.\d+\.\d+$/)).toBeVisible();
  await page.getByRole('button', { name: 'Noter sur Google Play', exact: true }).click();
  const prompt = page.locator('#app-rating-prompt');
  await expect(prompt).toBeVisible();
  await expect(prompt.getByRole('button', { name: /étoile/ })).toHaveCount(0);
  await prompt.getByRole('button', { name: 'Noter sur Google Play', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Espace parents' })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Fermer' }).click();
  expect(await page.evaluate(() => localStorage.getItem('mssid_rating_prompt_status'))).toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('iPad desktop mode retains home-screen installation and contact feedback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15 Safari/605.1.15' });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajouter à l’écran d’accueil' }).click({ timeout: 20000 });
  await expect(page.getByRole('status').filter({ hasText: 'Dans Safari' })).toBeVisible();
  await page.getByRole('button', { name: 'Plus tard', exact: true }).click();
  await page.locator('[data-nav-settings]').click();
  await expect(page.getByRole('button', { name: 'Noter sur Google Play' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Envoyer mon avis' }).click();
  await expect(page.getByRole('textbox').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
