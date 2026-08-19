import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// T2/T3 server-side content gate (pilot) — see trimesterAccess.ts's doc comment and
// PremiumContentController on the backend. math-5ap-division is a "shell" lesson in the frontend
// bundle (empty quiz/rulesAr) whose real content only ever arrives through the mocked endpoint
// below — this proves both branches: an authorized fetch hydrates the lesson, a 403 shows the
// upsell instead of a broken/empty screen.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullContent = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../scripts/premium-content-out/math-5ap-division.full.json'), 'utf-8')
);

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  await page.goto('/');
  await page.getByRole('button', { name: 'مراجعة الدروس' }).click();
  await page.getByRole('button', { name: 'الرياضيات' }).click();
  await page.getByRole('button', { name: 'الفصل الثاني (Trimestre 2)' }).click();
});

test('a PREMIUM/ADMIN fetch hydrates the shell lesson with the real content', async ({ page }) => {
  await page.route('**/v1/courses/premium-lessons/math-5ap-division', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fullContent) })
  );

  await page.getByText(fullContent.titleAr, { exact: true }).click();
  // rulesAr renders under the "الملخص والقواعد" step, not the default "explanation" one — advance
  // via the main "next step" CTA (the step-pastille button's own accessible name is ambiguous with it).
  await page.getByRole('button', { name: 'المرحلة الموالية: الملخص والقواعد' }).click();

  // rulesAr/detailedCourse are empty/undefined in the bundled shell — seeing the real rule count and
  // a vocabulary definition proves the fetched content was merged in. (rulesAr text itself isn't
  // asserted directly: the component splits each rule at its first colon into separate title/body
  // elements, and further isolates numeric/math runs into their own <span> — asserting on the plain-
  // prose vocabulary definition below is a more robust signal of a successful merge.)
  await expect(page.getByText(`${fullContent.rulesAr.length} قواعد أساسية`)).toBeVisible();
  await expect(page.getByText(fullContent.detailedCourse.vocabulary[0].definitionAr)).toBeVisible();
});

test('a non-premium account sees the upsell message, not a broken empty lesson', async ({ page }) => {
  await page.route('**/v1/courses/premium-lessons/math-5ap-division', (route) =>
    route.fulfill({ status: 403, contentType: 'application/json', body: '{}' })
  );

  await page.getByText(fullContent.titleAr, { exact: true }).click();

  await expect(
    page.getByText('هذا الدرس ضمن محتوى الفصلين الثاني والثالث، وهو متاح فقط للمشتركين في mssid dz Premium.')
  ).toBeVisible();
  await expect(page.getByText(fullContent.detailedCourse.vocabulary[0].definitionAr)).not.toBeVisible();
});
