import { test, expect } from '@playwright/test';
test.use({ storageState: { cookies: [], origins: [] } });
test('a first-time V2 account can choose a child and keep that choice', async ({ page }) => {
  await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/v1/users/me')) return route.fulfill({ json: { id: 1, nom: 'Parent Test', email: 'parent@example.com', role: 'ROLE_FREE', grade: '1AP' } });
    if (path.endsWith('/v1/children')) return route.fulfill({ json: [{ id: 9, displayName: 'لينا', grade: '1AP', avatar: '🦊' }] });
    return route.fulfill({ json: {} });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'من يتعلّم اليوم؟' })).toBeVisible();
  await page.getByText('لينا', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'من يتعلّم اليوم؟' })).not.toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('mssid_active_child_id'))).toBe('9');
  await page.reload();
  await expect(page.locator('[data-subject-card="math"]')).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'من يتعلّم اليوم؟' })).not.toBeVisible();
});
test('a malformed child response offers a fallback without crashing the app', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ json: route.request().url().endsWith('/v1/users/me')
    ? { id: 1, nom: 'Parent Test', email: 'parent@example.com', role: 'ROLE_FREE', grade: '1AP' } : {} }));
  await page.goto('/');
  await expect(page.getByText('تعذر جلب الملفات من الخادم. يمكنك المتابعة بالحساب.')).toBeVisible();
  await page.getByRole('button', { name: /متابعة بدون ملف طفل/ }).click();
  await expect(page.locator('[data-subject-card="math"]')).toBeVisible({ timeout: 15000 });
});
