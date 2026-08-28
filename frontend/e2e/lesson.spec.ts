import { test, expect } from '@playwright/test';
import { MATH_5AP } from '../src/data/courses/5AP/math';
import { openMathTrimester1 } from './helpers';

// Driven directly from the real lesson data (not hardcoded strings) so this test stays correct if
// the lesson's questions/options are ever edited. Trimester 1 is always free/unlocked regardless of
// paywall flags (see App.tsx's isLessonLocked comment), so this flow needs no login.
const lesson = MATH_5AP.find((l) => l.id === 'math-5ap-large-numbers')!;

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  // math-5ap-large-numbers lives in the 5AP catalogue; guests boot on 1AP when ?g= is absent.
  await page.goto('/?g=5AP');
});

test('a student can navigate to a lesson and complete its quiz', async ({ page }) => {
  await openMathTrimester1(page);

  const lessonCard = page.locator(`[data-lesson-id="${lesson.id}"]`);
  await expect(lessonCard).toBeVisible({ timeout: 60_000 });
  await lessonCard.click();

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
