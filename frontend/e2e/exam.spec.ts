import { test, expect } from '@playwright/test';
import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';

// ExamsViewer is self-report only — no answer-submission endpoint exists (see springBootApi.ts),
// so this flow needs no network mocking beyond the usual guest boot-time check.
//
// This exam has no `trimester` field, so it only ever appears under the default "end_of_cycle"
// category (grade 5AP's other category, "trimester_general", filters on `trimester != null`) —
// and that default category hides the trimester tabs entirely, so no trimester click is needed.
const exam = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-2018-trim1-math')!;

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  await page.goto('/');
});

test('a student can open an exam and mark it complete', async ({ page }) => {
  await page.getByRole('button', { name: 'بنك الامتحانات والاختبارات' }).click();
  // Default category is "end_of_cycle", where this exam lives — no extra category/trimester click needed.
  await page.getByRole('button', { name: 'الرياضيات' }).click();

  await page.getByText(exam.titleAr, { exact: true }).click();

  await page.getByRole('button', { name: /أنهيت هذا الامتحان التجريبي/ }).click();

  await expect(page.getByText('أحسنت! لقد أتممت هذا الموضوع بنجاح وتم تسجيل تقدمك ✅')).toBeVisible();
});
