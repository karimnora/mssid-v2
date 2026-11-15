import { test, expect } from '@playwright/test';
import { COURSES_DATA } from '../src/data/coursesData';
import { stripArabicTashkeel } from '../src/utils/textFormatter';

// On a phone the lesson steps are a drop-down list (the step buttons only show from the sm breakpoint).
async function openStep(page: import('@playwright/test').Page, label: RegExp) {
  const picker = page.getByRole('combobox', { name: 'اختر مرحلة الدرس' });
  const labels = await picker.locator('option').allTextContents();
  await picker.selectOption({ label: labels.find(option => label.test(option))! });
}

const normalizeText = (text: string) => stripArabicTashkeel(text.replace(/[\u2066-\u2069]/g, '')).replace(/\s+/g, ' ').trim();

for (const id of ['math-4ap-division-euclidean', 'math-4ap-division-two-digit-divisor', 'math-5ap-division']) {
  test(`math course corrections are readable on mobile: ${id}`, async ({ page }) => {
    test.setTimeout(60_000);
    const lesson = COURSES_DATA.find(item => item.id === id)!;
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
    });
    await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
      ? { id: 1, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE', grade: lesson.grade, score: 0, badges: ['b_welcome'] } : {} }));
    await page.goto(`/lesson/${id}?g=${lesson.grade}`);
    await expect(page.locator('#lesson-active-step-container')).toBeVisible({ timeout: 45_000 });
    await openStep(page, /أتذكر القاعدة/);
    const exampleIndex = id === 'math-4ap-division-two-digit-divisor' ? 1 : 0;
    await page.getByRole('button', { name: /إظهار الحل النموذجي المفصل/ }).nth(exampleIndex).click();
    const solution = page.locator('[data-math-column="solution"]').last();
    await expect(solution).toBeVisible();
    const text = await solution.textContent();
    expect(text).toContain('\u2066');
    expect(normalizeText(text ?? '')).toContain(normalizeText(lesson.examplesAr![exampleIndex].solution));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await solution.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `build/math-course-${id}-320.png` });
    // Answer one question using authored correct data and verify that the feedback is still shown.
    const question = lesson.quiz[0]; const correct = question.options.find(option => option.isCorrect)!;
    await openStep(page, new RegExp(`أختبر نفسي \\(${lesson.quiz.length}\\)`));
    await page.getByRole('button', { name: correct.textAr, exact: false }).click();
    await expect(page.locator('[data-quiz-feedback="correct"]').first()).toBeVisible();
  });
}
