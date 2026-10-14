import { test, expect, Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });
async function draw(page: Page) {
  const canvas = page.locator('svg[width="260"]');
  await canvas.click({ trial: true });
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.7);
  await page.mouse.down(); await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.7, { steps: 8 }); await page.mouse.up();
  await expect(canvas.locator('polyline')).toHaveCount(1);
}

for (const [language, tried, stay, leave] of [
  ['ar', 'جَرَّبْتُ', 'متابعة', 'خروج'], ['fr', 'J’ai essayé', 'Continuer', 'Quitter'], ['en', 'I tried', 'Continue', 'Leave'],
]) {
  test(`tracing preserves work when continuing in ${language}`, async ({ page }) => {
    await page.goto(`/e2e/activityExitHarness.html?lang=${language}`);
    await page.getByRole('button', { name: 'Open tracing' }).click(); await draw(page);
    const points = await page.locator('svg[width="260"] polyline').getAttribute('points');
    await page.getByRole('button', { name: tried, exact: true }).click(); await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: 'Home tab' }).click(); await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: stay, exact: true })).toBeFocused();
    await page.getByRole('button', { name: stay, exact: true }).click();
    await expect(page.locator('svg[width="260"] polyline')).toHaveAttribute('points', points!);
    await page.getByRole('button', { name: 'Home tab' }).click(); await page.getByRole('button', { name: leave, exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Activity catalogue' })).toBeVisible();
  });
}

test('browser back and forward preserve history after Continue and leave after confirmation', async ({ page }) => {
  await page.goto('/e2e/activityExitHarness.html?lang=fr');
  await page.getByRole('button', { name: 'Open tracing' }).click(); await draw(page);
  const activityURL = page.url();
  await page.evaluate(() => history.back()); await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(activityURL);
  await page.getByRole('button', { name: 'Continuer', exact: true }).click();
  await expect(page.locator('svg[width="260"] polyline')).toHaveCount(1);
  await page.evaluate(() => history.back()); await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Quitter', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Activity catalogue' })).toBeVisible();
  await page.evaluate(() => history.forward()); await expect(page.locator('svg[width="260"]')).toBeVisible();
  await page.getByRole('button', { name: 'Home tab' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('grade changes wait for confirmation and cancel preserves the grade', async ({ page }) => {
  await page.goto('/e2e/activityExitHarness.html?lang=fr');
  await page.getByRole('button', { name: 'Open tracing' }).click(); await draw(page);
  await page.getByRole('button', { name: 'Change grade' }).click();
  await expect(page.locator('output')).toHaveText('1AP');
  await page.getByRole('button', { name: 'Continuer', exact: true }).click(); await expect(page.locator('output')).toHaveText('1AP');
  await page.getByRole('button', { name: 'Change grade' }).click(); await page.getByRole('button', { name: 'Quitter', exact: true }).click();
  await expect(page.locator('output')).toHaveText('2AP');
});

test('empty tracing leaves immediately without confirmation', async ({ page }) => {
  await page.goto('/e2e/activityExitHarness.html?lang=fr');
  await page.getByRole('button', { name: 'Open tracing' }).click();
  await page.getByRole('button', { name: 'Home tab' }).click();
  await expect(page.getByRole('heading', { name: 'Activity catalogue' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a game catalogue leaves freely, but leaving a puzzle round asks first', async ({ page }) => {
  await page.goto('/e2e/activityExitHarness.html?lang=fr');
  await page.getByRole('button', { name: 'Open puzzle' }).click();
  await page.getByRole('button', { name: 'Home tab' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open puzzle' }).click();
  await page.getByRole('button').filter({ hasText: 'N1' }).click();
  await page.getByRole('button', { name: '🚪', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Continuer', exact: true }).click();
  await expect(page.getByRole('button', { name: '🚪', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '🚪', exact: true }).click();
  await page.getByRole('button', { name: 'Quitter', exact: true }).click();
  await expect(page.getByRole('button').filter({ hasText: 'N1' })).toBeVisible();
  await page.getByRole('button', { name: 'Home tab' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a lab asks only after interaction and a new visit starts clean', async ({ page }) => {
  await page.goto('/e2e/activityExitHarness.html?lang=fr');
  await page.getByRole('button', { name: 'Open lab' }).click();
  await page.locator('[data-activity-navigation]').click();
  await expect(page.getByRole('heading', { name: 'Activity catalogue' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open lab' }).click();
  await page.getByRole('button', { name: '5', exact: true }).click();
  await page.locator('[data-activity-navigation]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'متابعة', exact: true }).click();
  await page.locator('[data-activity-navigation]').click();
  await page.getByRole('button', { name: 'خروج', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Activity catalogue' })).toBeVisible();
  await page.getByRole('button', { name: 'Open lab' }).click();
  await page.getByRole('button', { name: 'Home tab' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
