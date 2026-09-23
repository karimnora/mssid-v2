import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('the primary header returns from a directly opened lesson to its course list', async ({ page }) => {
  await page.route('**/api/**', (route) => route.fulfill({
    status: route.request().url().includes('/users/me') ? 401 : 200,
    contentType: 'application/json',
    body: '{}',
  }));
  await page.goto('/lesson/math-1ap-t1-spatial-relations?g=1AP');
  await expect(page.locator('#lesson-active-step-container')).toBeVisible({ timeout: 30_000 });
  await page.locator('[data-nav-back]').click();
  await expect(page).toHaveURL(/\/courses\?g=1AP$/);
  await expect(page.locator('#lesson-active-step-container')).not.toBeVisible();
  await expect(page.getByText('الرياضيات').first()).toBeVisible();
});
