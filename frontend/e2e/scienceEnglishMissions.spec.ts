import { test, expect } from '@playwright/test';
import { COURSES_DATA } from '../src/data/coursesData';

for (const grade of ['3AP', '4AP', '5AP']) {
  for (const subject of ['science', 'english']) {
    const lesson = COURSES_DATA.find(item => item.grade === grade && item.subject === subject)!;
    test(`${grade} ${subject}: complete the connected mission on mobile`, async ({ page }) => {
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !message.text().includes('401')) console.error(message.text()); });
      await page.setViewportSize({ width: 390, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        localStorage.setItem('mssid_locale_preference', 'ar');
        localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
      });
      await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
      await page.goto(`/lesson/${lesson.id}?g=${grade}`);
      const path = page.locator(`[data-autonomy-path="${lesson.id}"]`);
      await expect(path).toBeVisible({ timeout: 60_000 });
      await path.getByRole('button', { name: 'أتابع', exact: true }).click();
      await path.getByRole('button', { name: 'أتابع', exact: true }).click();
      const exercises = [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []];
      const steps = lesson.learningPath!.steps.filter(step => 'exerciseId' in step);
      for (const [index, step] of steps.entries()) {
        if (!('exerciseId' in step)) continue;
        const exercise = exercises.find(ex => ex.id === step.exerciseId)!;
        const correct = exercise.options!.find(option => option.isCorrect)!;
        await path.getByRole('button', { name: correct.textAr, exact: true }).click();
        await path.getByRole('button', { name: 'تحقق من الإجابة', exact: true }).click();
        const next = path.getByRole('button', { name: index === steps.length - 1 ? 'أنتقل إلى التدريبات' : 'أتابع', exact: true });
        await expect(next).toBeEnabled();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await next.click();
      }
      await expect(path).not.toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}
