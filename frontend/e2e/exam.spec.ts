import { test, expect } from '@playwright/test';
import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';

// ExamsViewer is self-report only — no answer-submission endpoint exists (see springBootApi.ts),
// so this flow needs no network mocking beyond the usual guest boot-time check.
//
// exam-2018-trim1-math is a 5AP composition (trimester 1). The 5AP hub defaults to the BEP
// (certificate) kind, so the test must switch to الاختبارات الفصلية before picking maths.
const exam = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-2018-trim1-math')!;

test.beforeEach(async ({ page }) => {
  // Exams are login-gated for guests (see useAppNavigation's guest wall, added after this spec was
  // written) — mock an authenticated 5AP student so the exams pole is reachable at all.
  await page.route('**/v1/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, nom: 'Élève Test', email: 'student@mssid.dz', role: 'ROLE_FREE', grade: '5AP' }),
    })
  );
  await page.goto('/?g=5AP');
});

test('a student can open an exam and mark it complete', async ({ page }) => {
  await page.locator('[data-pole="exams"]').click();
  await page.getByRole('button', { name: 'الاختبارات الفصلية' }).click();
  await page.locator('[data-exam-subject="math"]').click();

  await page.getByText(exam.titleAr, { exact: true }).click();

  await page.getByRole('button', { name: /أنهيت هذا الامتحان التجريبي/ }).click();

  await expect(page.getByText('أحسنت! لقد أتممت هذا الموضوع بنجاح وتم تسجيل تقدمك ✅')).toBeVisible();
});
