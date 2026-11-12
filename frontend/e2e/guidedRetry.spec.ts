import { test, expect, type Locator } from '@playwright/test';

async function tapInReadingArea(control: Locator) {
  // Scroll like a reader so the fixed bottom navigation does not cover the touch target.
  await control.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await control.click();
}

test('ordinary 5AP practice gives a hint before revealing QCM answers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('mssid_locale_preference', 'ar');
    localStorage.setItem('mssid_user_profile', JSON.stringify({ grade: '5AP', xp: 0 }));
  });
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/lesson/math-5ap-large-numbers?g=5AP');
  const select = page.getByRole('combobox', { name: 'اختر مرحلة الدرس' });
  await expect(select).toBeVisible({ timeout: 60000 });
  const practice = await select.getByRole('option', { name: /أتدرب/ }).getAttribute('value');
  await select.selectOption(practice!);
  const card = page.locator('.exercise-surface').filter({ has: page.getByRole('button', { name: '35', exact: true }) }).first();
  await tapInReadingArea(card.getByRole('button', { name: '35', exact: true }));
  await tapInReadingArea(card.getByRole('button', { name: 'تحقق من الإجابة', exact: true }));
  await expect(card.getByRole('status')).toBeVisible();
  await expect(card.locator('.lucide-circle-check')).toHaveCount(0);
  await expect(card).not.toContainText('إذن رقم منزلة الملايين');
  await tapInReadingArea(card.getByRole('button', { name: 'حاول مرة أخرى', exact: true }));
  await expect(card.getByText(/فترة الملايين هي الفترة الثالثة/)).toBeVisible();
  await tapInReadingArea(card.getByRole('button', { name: '350', exact: true }));
  await tapInReadingArea(card.getByRole('button', { name: 'تحقق من الإجابة', exact: true }));
  await expect(card).toContainText('إذن رقم منزلة الملايين');
  await tapInReadingArea(card.getByRole('button', { name: 'حاول مرة أخرى', exact: true }));
  await tapInReadingArea(card.getByRole('button', { name: '3', exact: true }));
  await tapInReadingArea(card.getByRole('button', { name: 'تحقق من الإجابة', exact: true }));
  await expect(card.getByText(/أحسنت! إجابة صحيحة/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
