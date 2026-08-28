import { expect, type Page } from '@playwright/test';

/** CourseSelectionView mounts only after the lazy coursesData chunk (~4 MB) resolves. */
export async function waitForCoursesReady(page: Page): Promise<void> {
  const loading = page.getByText('جاري تحميل الدروس...');
  if (await loading.isVisible().catch(() => false)) {
    await expect(loading).toBeHidden({ timeout: 60_000 });
  }
}

export async function openMathTrimester1(page: Page): Promise<void> {
  await page.locator('[data-subject-card="math"]').click();
  await waitForCoursesReady(page);
  const trimester1 = page.getByRole('button', { name: /الفصل الأول|Trimestre 1/i });
  await expect(trimester1).toBeVisible({ timeout: 60_000 });
  await trimester1.click();
}
