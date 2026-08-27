import { test, expect } from '@playwright/test';
import { MATH_5AP } from '../src/data/courses/5AP/math';

// Driven directly from the real lesson data (not hardcoded strings) so this test stays correct if
// the lesson's questions/options are ever edited. Trimester 1 is always free/unlocked regardless of
// paywall flags (see App.tsx's isLessonLocked comment), so this flow needs no login.
const lesson = MATH_5AP.find((l) => l.id === 'math-5ap-large-numbers')!;

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  await page.goto('/');
});

test('a student can navigate to a lesson and complete its quiz', async ({ page }) => {
  // Home now shows subject cards directly (see HomeView.tsx's "kids" redesign) — a subject opens
  // straight into its trimester picker, no more intermediate "مراجعة الدروس" button to click first.
  // data-subject-card (not the visible label): "الرياضيات" also matches the hero's continue-CTA and
  // the unrelated math-lab card, which happens to share the same "kids-card-maths" CSS class.
  await page.locator('[data-subject-card="math"]').click();
  await page.getByRole('button', { name: 'الفصل الأول (Trimestre 1)' }).click();
  await page.getByText(lesson.titleAr, { exact: true }).click();

  // Not anchored: the step-pastille button's accessible name also concatenates an icon and a step
  // index around the label, so only a substring match is reliable here.
  await page.getByRole('button', { name: new RegExp(`الاختبار التفاعلي \\(${lesson.quiz!.length}\\)`) }).click();

  for (const question of lesson.quiz!) {
    const correctOption = question.options.find((o) => o.isCorrect)!;
    // Not exact: each option button's accessible name also concatenates a letter badge (أ/ب/ج...)
    // before the option text, so only a substring match against the option text is reliable.
    await page.getByRole('button', { name: correctOption.textAr }).click();
  }

  await expect(page.getByText('نتيجة الاختبار:')).toBeVisible();
  await expect(page.getByText('100%')).toBeVisible();
});
