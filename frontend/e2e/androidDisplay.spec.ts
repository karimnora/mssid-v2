import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Android viewport/UA approximation; this does not emulate the native keyboard or system bars.
const cases = [
  { width: 320, height: 740, locale: 'ar', dark: false },
  { width: 320, height: 740, locale: 'fr', dark: true },
  { width: 390, height: 844, locale: 'ar', dark: true },
  { width: 430, height: 932, locale: 'fr', dark: false },
  { width: 844, height: 390, locale: 'ar', dark: false },
  { width: 844, height: 390, locale: 'fr', dark: true },
];

async function checkWidth(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

async function checkModal(page: Page, panel: Locator) {
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  const body = panel.locator('.kids-modal-body');
  if (await body.count()) {
    expect(await body.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await body.evaluate(element => { element.scrollTop = element.scrollHeight; });
  }
  const close = panel.locator('.kids-close').last();
  await expect(close).toBeVisible();
  // The close control remains usable even at the bottom of a long sheet.
  await close.click();
  await expect(panel).not.toBeVisible();
  await checkWidth(page);
}

for (const scenario of cases) {
  test.describe(`${scenario.width}x${scenario.height} ${scenario.locale} ${scenario.dark ? 'dark' : 'light'}`, () => {
    test.use({ viewport: { width: scenario.width, height: scenario.height },
      userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36',
      hasTouch: true });
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(({ locale, dark }) => {
        localStorage.setItem('mssid_locale_preference', locale);
        localStorage.setItem('mssid_preschool_language', locale);
        localStorage.setItem('mssid_user_profile', JSON.stringify({ xp: 0, badges: ['b_welcome'] }));
        localStorage.setItem('mssid_pwa_dismissed_time', String(Date.now()));
        localStorage.setItem('mssid_theme', dark ? 'dark' : 'light');
        localStorage.setItem('mssid_theme_manual', 'true');
      }, scenario);
      await page.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/users/me')
        ? { id: 1, nom: 'Auditeur mobile', email: 'display@example.test', role: 'ROLE_FREE', grade: '5AP', score: 0, badges: ['b_welcome'] } : {} }));
      await page.route('**/accounts.google.com/**', route => route.abort());
    });

    for (const screen of [
      { name: 'home', url: '/?g=5AP', ready: '[data-home-layout]' },
      { name: 'courses', url: '/courses?g=5AP', ready: 'main h2' },
      { name: 'exams', url: '/exams?g=5AP', ready: '[data-exam-subject]' },
      { name: 'challenges', url: '/challenges?g=5AP', ready: '[data-challenge-id]' },
      { name: 'preschool', url: '/eveil', ready: '[data-preschool-mute]' },
    ]) {
      test(`${screen.name} fits and keeps navigation reachable`, async ({ page }) => {
        test.setTimeout(60_000);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(screen.url);
        await expect(page.locator(screen.ready).first()).toBeVisible({ timeout: 45_000 });
        await checkWidth(page);
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await checkWidth(page);
        if (screen.name === 'home') {
          const companion = page.locator('[data-companion-card]');
          await companion.scrollIntoViewIfNeeded();
          const companionAudit = await new AxeBuilder({ page }).include('[data-companion-info]')
            .withTags(['wcag2a', 'wcag2aa']).analyze();
          expect(companionAudit.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
        }
        await page.evaluate(() => scrollTo(0, 0));
        if (screen.name !== 'preschool') {
          const navbar = page.locator('[data-nav-child]');
          await expect(navbar.locator('[data-nav-settings]')).toBeVisible();
          await navbar.locator('[data-nav-settings]').click();
          await checkModal(page, page.locator('.kids-modal-panel'));
        } else {
          await expect(page.locator('[data-preschool-mute]')).toBeVisible();
        }
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, detail: node.failureSummary })) }))).toEqual([]);
        expect(errors).toEqual([]);
        if (scenario.width === 320 || scenario.height === 390) await page.screenshot({ path: `build/display-${screen.name}-${scenario.width}-${scenario.locale}.png` });
      });
    }

    test('profile and tutor sheets remain scrollable and closable', async ({ page }) => {
      await page.goto('/?g=5AP');
      await expect(page.locator('[data-home-layout]')).toBeVisible();
      await page.locator('[data-nav-profile]').click();
      await checkModal(page, page.locator('.kids-modal-panel'));
      const tutor = page.locator('[data-nav-compact] button.kids-nav-ai');
      if (scenario.width < 768) {
        await tutor.click();
        const panel = page.getByRole('dialog', { name: /Mon accompagnement MSSID|مرافقتي مع مسيد/ });
        await expect(panel).toBeVisible();
        await checkWidth(page);
        expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
        // Guided support uses a scrolling overlay, not a kids-modal-body sheet.
        const lastControl = panel.getByRole('button').last();
        await lastControl.scrollIntoViewIfNeeded();
        await expect(lastControl).toBeInViewport();
        const close = panel.getByRole('button', { name: /^(Fermer|أغلق)$/ });
        await close.scrollIntoViewIfNeeded();
        await expect(close).toBeInViewport();
        await close.click();
        await expect(panel).not.toBeVisible();
        await checkWidth(page);
      }
    });

    test('login and registration fit a short keyboard-sized viewport', async ({ page }) => {
      await page.route('**/api/v1/users/me', route => route.fulfill({ status: 401, json: {} }));
      await page.goto('/?g=5AP');
      await page.getByRole('button', { name: /تسجيل الدخول \/ إنشاء حساب مجاني|Connexion \/ Inscription/ }).click();
      const panel = page.locator('.kids-modal-panel');
      await expect(panel).toBeVisible();
      // Guest profile entry opens authentication directly.
      await expect(panel.locator('input[type="email"]')).toBeVisible();
      await panel.getByRole('button', { name: /إنشاء حساب|Créer un compte/ }).first().click();
      await expect(panel.locator('input[autocomplete="name"]')).toBeVisible();
      await expect(panel.locator('input[required]')).toHaveCount(2);
      await expect(panel.locator('select[required]')).toHaveCount(0);
      await expect(panel.locator('select')).toBeVisible();
      await page.setViewportSize({ width: scenario.width, height: Math.min(scenario.height, 480) });
      await checkModal(page, panel);
    });
  });
}
