import { test, expect } from '@playwright/test';

// One example lesson per distinct lesson.interactiveTool value (see LessonInteractiveTools.tsx),
// covering both the full step-navigator layout (3AP+) and the compact/playful layout (1AP/2AP,
// no direct step-navigator — must advance via the "next" button instead).
const CASES: { tool: string; id: string; grade: string }[] = [
  { tool: 'arabic_conjugator', id: 'arabic-3ap-t1-conjugation-past-present', grade: '3AP' },
  { tool: 'arabic_canvas', id: 'arabic-3ap-t1-nominal-verbal-sentences', grade: '3AP' },
  { tool: 'science_lab', id: 'art-3ap-t1-colors-rhythm', grade: '3AP' },
  { tool: 'civics_lab', id: 'civics-3ap-t1-school-rules-symbols', grade: '3AP' },
  { tool: 'english_dialogue_lab', id: 'english-3ap-u1-greetings-alphabet', grade: '3AP' },
  { tool: 'history_geo_lab', id: 'history-3ap-t1-time-eras-timeline', grade: '3AP' },
  { tool: 'islamic_lab', id: 'islamic-3ap-t1-pillars-purity-surahs', grade: '3AP' },
  { tool: 'math_lab', id: 'math-3ap-t1-numbers-to-999', grade: '3AP' },
  { tool: 'multiplication_table', id: 'math-3ap-t1-multiplication-intro', grade: '3AP' },
  { tool: 'geometry_visualizer', id: 'math-3ap-t1-geometry-lines', grade: '3AP' },
  { tool: 'unit_converter', id: 'math-3ap-t2-units-length-mass', grade: '3AP' },
  { tool: 'clock_trainer', id: 'math-3ap-t3-time-read', grade: '3AP' },
  { tool: 'tamazight_lab', id: 'tamazight-3ap-initiation-lettres-formes', grade: '3AP' },
  { tool: 'english_lab', id: 'english-4ap-unit1-family-friends', grade: '4AP' },
  { tool: 'french_dialogue_lab', id: 'french-3ap-p1-seq1-greetings-letters', grade: '3AP' },
  { tool: 'french_lab', id: 'french-4ap-projet1-seq1-presentation-famille', grade: '4AP' },
  { tool: 'soroban', id: 'soroban-basics', grade: '5AP' },
  // Compact/playful layout (1AP/2AP) — different code path (buildPlayful1APSteps), no direct
  // step-navigator list, must click through via the footer's "next" button instead.
  { tool: 'civics_lab (1AP compact layout)', id: 'civics-1ap-t1-greetings-respect', grade: '1AP' },
  { tool: 'unit_converter (2AP compact layout)', id: 'math-2ap-t3-meter-cm', grade: '2AP' },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1, nom: 'Auditeur Test', email: 'audit@mssid.dz', role: 'ROLE_PREMIUM', grade: '5AP' }) })
  );
  await page.route('**/v1/feature-flags', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await page.route('**/v1/users/me/progress', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
});

for (const c of CASES) {
  test(`lesson interactive tool "${c.tool}" (${c.id}) does not kick the student out of the lesson`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(`/lesson/${c.id}?g=${c.grade}`);
    await expect(page.locator('#lesson-active-step-container')).toBeVisible({ timeout: 30_000 });

    // Advance step by step (works for both the direct step-navigator and the compact/playful
    // footer-only layout) until the interactive tool step's loading fallback or content shows up,
    // or there is no "next" button left.
    const interactiveMarker = page.getByText('جاري تحميل الأداة التفاعلية...').or(
      page.locator('#lesson-active-step-container').getByText('الأداة التفاعلية المخصصة').or(page.getByText('أُجَرِّبُ'))
    );
    for (let i = 0; i < 8; i++) {
      if (await interactiveMarker.first().isVisible().catch(() => false)) break;
      const nextBtn = page.locator('[data-primary-cta="next-step"]');
      if (!(await nextBtn.isVisible().catch(() => false))) break;
      await nextBtn.click();
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(1500);

    await expect(page.locator('#lesson-active-step-container'), `left the lesson after opening the interactive step for ${c.id}`).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `horizontal overflow in ${c.id}`).toBe(true);

    // Generic interaction: click the first clickable control found anywhere in the lesson's
    // current step content, then re-check we're still on the lesson.
    const firstButton = page.locator('#lesson-active-step-container').getByRole('button').first();
    if (await firstButton.count() > 0) {
      await firstButton.click({ timeout: 5_000 }).catch(() => {});
      await page.waitForTimeout(500);
      await expect(page.locator('#lesson-active-step-container'), `left the lesson after interacting inside the tool for ${c.id}`).toBeVisible();
    }

    expect(pageErrors, `uncaught errors on "${c.id}":\n${pageErrors.join('\n')}`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `horizontal overflow after interaction in ${c.id}`).toBe(true);
  });
}
