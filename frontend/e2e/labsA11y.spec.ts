import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { INTERACTIVE_LABS_LIST } from '../src/data/subjectsData';

// Pre-launch accessibility pass over every interactive lab tool (WCAG 2.2 AA, per CLAUDE.md's own
// contrast/touch-target rules). Automated axe-core scans catch objective violations (contrast,
// missing labels, target size); they do not replace a manual screen-reader/keyboard pass, but they
// are the highest-value automatable slice of it.
test.beforeEach(async ({ page }) => {
  await page.route('**/v1/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, nom: 'Auditeur Test', email: 'audit@mssid.dz', role: 'ROLE_PREMIUM', grade: '5AP' }),
    })
  );
  await page.route('**/v1/feature-flags', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await page.route('**/v1/users/me/progress', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
});

for (const lab of INTERACTIVE_LABS_LIST) {
  test(`lab "${lab.id}" (${lab.nameAr}) has no automatic WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(`/labs/${lab.id}?g=5AP`);
    await expect(page.locator('[data-lab-shell="true"]')).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(1000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      // AppRatingPrompt is global app chrome that can pop up over *any* screen at an arbitrary
      // moment (not one of the lab tools this suite audits) and flakily appears mid-animation
      // depending on unrelated session state — scope this suite to the lab itself and cover the
      // prompt's own accessibility in a dedicated, deterministic test instead.
      .exclude('#app-rating-prompt')
      .analyze();

    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
    }));

    expect(summary, `axe violations on "${lab.id}":\n${JSON.stringify(summary, null, 2)}`).toEqual([]);
  });
}
