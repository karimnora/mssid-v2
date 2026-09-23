import { expect, test } from '@playwright/test';

test.use({ channel: process.env.PLAYWRIGHT_CHANNEL, viewport: { width: 390, height: 844 } });

test('preschool workshop keeps its parent screen and confirms image download on mobile', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mssid_locale_preference', 'fr');
    localStorage.setItem('mssid_preschool_language', 'fr');
  });
  await page.route('**/api/**', (route) => route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }));
  await page.goto('/eveil');
  await page.getByText('Ateliers', { exact: true }).click();
  await page.getByText('Tableau Magique', { exact: true }).click();

  const back = page.getByRole('button', { name: 'Retour aux ateliers' });
  await expect(back).toBeVisible();
  expect((await back.boundingBox())!.y).toBeGreaterThanOrEqual(32);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByRole('button', { name: '✏️ Traçage' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger 📥' }).click();
  await download;
  await expect(page.getByRole('status')).toContainText('Téléchargement lancé');

  await back.click();
  await expect(page.getByText('Piano et mélodies', { exact: true })).toBeVisible();
});
