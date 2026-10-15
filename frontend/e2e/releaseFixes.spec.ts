import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mssid_locale_preference', 'fr'));
});

test('real settings keep the account and grade unchanged until confirmation', async ({ page }) => {
  const account = { id: 123, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: '1AP', score: 0, badges: ['b_welcome'] };
  const gradeUpdates: unknown[] = [];
  await page.route('**/api/**', route => {
    if (route.request().method() === 'PUT') {
      const patch = route.request().postDataJSON(); if (Object.prototype.hasOwnProperty.call(patch, 'grade')) gradeUpdates.push(patch); Object.assign(account, patch);
      return route.fulfill({ json: account });
    }
    return route.fulfill({ json: route.request().url().includes('/users/me') ? account : {} });
  });
  await page.goto('/labs/primary_math_ops?g=1AP');
  await page.getByRole('button', { name: '5', exact: true }).click();
  await page.locator('[data-nav-settings]').click();
  await page.getByRole('button', { name: /2ème année/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/g=1AP$/); expect(account.grade).toBe('1AP'); expect(gradeUpdates).toHaveLength(0);
  await page.getByRole('button', { name: 'Continuer', exact: true }).click();
  await expect(page).toHaveURL(/g=1AP$/); expect(account.grade).toBe('1AP'); expect(gradeUpdates).toHaveLength(0);
  await page.locator('[data-nav-settings]').click(); await page.getByRole('button', { name: /2ème année/ }).click();
  await page.getByRole('button', { name: 'Quitter', exact: true }).click();
  await expect(page).toHaveURL(/g=2AP$/);
  await expect.poll(() => account.grade).toBe('2AP');
  expect(gradeUpdates).toHaveLength(1);
  expect(gradeUpdates[0]).toMatchObject({ grade: '2AP' });
});

test('real mobile Games tab opens the catalogue after leaving a used lab', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
    ? { id: 123, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: '1AP', score: 0, badges: ['b_welcome'] } : {} }));
  await page.goto('/labs/primary_math_ops?g=1AP');
  await page.getByRole('button', { name: '5', exact: true }).click();
  await page.locator('[data-nav-compact]').getByRole('button', { name: 'Jouer', exact: true }).click();
  await page.getByRole('button', { name: 'Quitter', exact: true }).click();
  await expect(page.locator('[data-lab-shell]')).toHaveCount(0);
  await expect(page.locator('[data-labs-layout="full"]')).toHaveAttribute('data-lab-focused', 'false');
});

test('tapping the selected writing letter preserves the actual canvas pixels', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
    ? { id: 123, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: '5AP', score: 0, badges: ['b_welcome'] } : {} }));
  await page.goto('/labs/touch_writing?g=5AP');
  const canvas = page.locator('canvas[width="600"]');
  await canvas.click({ trial: true });
  const before = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.3); await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 12 }); await page.mouse.up();
  const drawn = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()); expect(drawn).not.toBe(before);
  await page.locator('[data-writing-item][aria-pressed="true"]').click();
  expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(drawn);
});
