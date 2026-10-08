import { test, expect } from '@playwright/test';
import { INTERACTIVE_LABS_LIST } from '../src/data/subjectsData';

// Pre-launch audit: every interactive lab tool (المختبرات التفاعلية) must (a) load without
// throwing, (b) not print console errors, and (c) always leave the visitor an escape hatch back
// to the catalog — ToolsHubView's "اختر مختبراً آخر" banner is rendered for every lab regardless
// of whether that lab also has its own internal back button (several don't — see ActiveWorkspace.tsx),
// so it's the one universal, scriptable "is the user ever trapped" check across all labs.
test.beforeEach(async ({ page }) => {
  // 5AP + ROLE_PREMIUM so no grade-gate or paywall blocks any lab during this pass.
  await page.route('**/v1/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, nom: 'Auditeur Test', email: 'audit@mssid.dz', role: 'ROLE_PREMIUM', grade: '5AP' }),
    })
  );
  // Some labs read feature flags / progress on mount. Left unmocked, these hit the real Render
  // backend, which correctly CORS-rejects a plain localhost:3000 origin — a test artifact, not an
  // app bug, but it drowns out real console errors. Mock them like every other spec in this suite.
  await page.route('**/v1/feature-flags', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await page.route('**/v1/users/me/progress', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
});

// Vite's own HMR client (dev-server only, absent from the production build) tries to open a
// websocket the CSP's connect-src doesn't list — irrelevant to real users, so it's the one console
// line this suite tolerates rather than mocking away.
const isKnownDevOnlyNoise = (text: string): boolean => text.includes('ws://localhost:24678');

for (const lab of INTERACTIVE_LABS_LIST) {
  test(`lab "${lab.id}" (${lab.nameAr}) loads cleanly and stays escapable`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isKnownDevOnlyNoise(msg.text())) consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(`/labs/${lab.id}?g=5AP`);

    const shell = page.locator('[data-lab-shell="true"]');
    await expect(shell).toBeVisible({ timeout: 30_000 });

    // Let any async mount work (data fetches, canvas/audio init) settle before judging console noise.
    await page.waitForTimeout(1500);

    const escapeButton = page.getByRole('button', { name: 'اختر مختبراً آخر' });
    await expect(escapeButton, 'escape-hatch banner missing — user would be stuck on this lab').toBeVisible({ timeout: 5_000 });
    await escapeButton.click();
    await expect(shell, 'lab shell still visible after clicking the escape hatch').not.toBeVisible({ timeout: 10_000 });

    expect(pageErrors, `uncaught errors while "${lab.id}" was open:\n${pageErrors.join('\n')}`).toEqual([]);
    expect(consoleErrors, `console.error output while "${lab.id}" was open:\n${consoleErrors.join('\n')}`).toEqual([]);
  });
}
