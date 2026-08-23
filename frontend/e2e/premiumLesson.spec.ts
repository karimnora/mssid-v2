import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// math-5ap-division is fully bundled again (free-launch window). The premium fetch path in
// LessonViewer / usePremiumLessonContent stays in the codebase for a later paid window, but this
// lesson must render from COURSES_DATA without calling GET /premium-lessons/{id}.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullContent = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../scripts/premium-content-out/math-5ap-division.full.json'), 'utf-8')
);

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  await page.goto('/?g=5AP');
  await page.getByRole('button', { name: 'مراجعة الدروس' }).click();
  await page.getByRole('button', { name: 'الرياضيات' }).click();
  await page.getByRole('button', { name: 'الفصل الثاني (Trimestre 2)' }).click();
});

test('a guest opens math-5ap-division and sees rules without a premium fetch', async ({ page }) => {
  let premiumFetched = false;
  await page.route('**/v1/courses/premium-lessons/**', (route) => {
    premiumFetched = true;
    route.fulfill({ status: 500, body: '{}' });
  });

  await page.getByText(fullContent.titleAr, { exact: true }).click();
  // Footer CTA is `التالي: {stepLabel}` (LessonStepFooter), not the older
  // `المرحلة الموالية:` copy. Prefer the data attribute so a future label tweak
  // does not break the guest/premium path this spec actually guards.
  await page.locator('[data-primary-cta="next-step"]').click();

  await expect(page.getByText(`${fullContent.rulesAr.length} قواعد أساسية`)).toBeVisible();
  await expect(page.getByText(fullContent.detailedCourse.vocabulary[0].definitionAr)).toBeVisible();
  expect(premiumFetched).toBe(false);
});
