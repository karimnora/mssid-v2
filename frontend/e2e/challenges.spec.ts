import { test, expect } from '@playwright/test';
import { CHALLENGES_DATA } from '../src/data/challengesData';

// A flat, filterable grid (no login required) — no submit-answer endpoint exists either (static
// data, self-scored client-side), so this needs no network mocking beyond the guest boot check.
const challenge = CHALLENGES_DATA.find((c) => c.id === 'challenge-math-large-numbers')!;

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  // challenge-math-large-numbers is authored for 5AP only (getArenaChallenges filters by grade).
  await page.goto('/?g=5AP');
});

test('a student can complete a challenge, answering every item correctly', async ({ page }) => {
  await page.getByRole('button', { name: 'ساحة التحديات' }).click();
  await page.locator('[data-challenge-id="challenge-math-large-numbers"]').click();

  for (let i = 0; i < challenge.items.length; i++) {
    const item = challenge.items[i];
    await page.getByRole('button', { name: item.correctAnswerAr, exact: true }).click();

    const isLast = i === challenge.items.length - 1;
    await page.getByRole('button', { name: isLast ? 'إنهاء التحدي' : 'السؤال التالي' }).click();
  }

  await expect(page.getByRole('heading', { name: 'انتهى التحدي!' })).toBeVisible();
  await expect(page.getByText(`${challenge.items.length} / ${challenge.items.length}`)).toBeVisible();
});
