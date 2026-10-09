import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ viewport: { width: 390, height: 844 } });

test('admin can find and inspect a course without publishing or modifying content', async ({ page }) => {
  const mutations: string[] = [];
  await page.route('**/api/**', route => {
    const request = route.request();
    if (request.method() !== 'GET') mutations.push(request.method() + ' ' + new URL(request.url()).pathname);
    if (request.url().endsWith('/v1/users/me')) return route.fulfill({ json: { id: 1, nom: 'Admin Test', email: 'test@example.com', role: 'ROLE_ADMIN', grade: '5AP' } });
    if (request.url().includes('/admin/stats/overview')) return route.fulfill({ status: 503, json: { message: 'Statistics unavailable in this catalog test' } });
    return route.fulfill({ json: {} });
  });
  await page.goto('/admin');
  await page.getByRole('button', { name: /مراقبة المحتوى|المحتوى/, exact: true }).click();
  await expect(page.getByRole('heading', { name: /Contrôle des cours/ })).toBeVisible({ timeout: 30000 });
  const search = page.getByRole('searchbox', { name: /Recherche/ });
  await search.fill('islamic-5ap-worship-tayammum-khuffain');
  await expect(page.getByRole('status')).toContainText('1 درس مطابق');
  await page.getByRole('button', { name: 'فحص الدرس', exact: true }).click();
  await expect(page.locator('#review-detail-title')).toBeFocused();
  await expect(page.getByRole('link', { name: /معاينة الدرس كما يراه التلميذ/ })).toHaveAttribute('href', '/lesson/islamic-5ap-worship-tayammum-khuffain?g=5AP');
  await expect(page.getByRole('heading', { name: /أسئلة التقييم والإجابات/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).include('section[aria-labelledby="content-review-title"]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole('button', { name: 'إغلاق تفاصيل الدرس' }).click();
  await search.fill('no-such-lesson-000');
  await expect(page.getByText('لا توجد دروس مطابقة. غيّر الفلاتر أو أعد ضبطها.')).toBeVisible();
  await page.getByRole('button', { name: 'إعادة ضبط الفلاتر' }).click();
  await page.getByRole('button', { name: /حالة غير محددة/ }).click();
  await expect(page.getByLabel('حالة المراجعة / Statut')).toHaveValue('unspecified');
  await page.getByRole('button', { name: 'إعادة ضبط الفلاتر' }).click();
  await expect(page.getByRole('button', { name: 'فحص الدرس', exact: true })).toHaveCount(25);
  await page.getByRole('button', { name: 'الصفحة التالية', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('الصفحة 2');
  // Account progress synchronization may POST outside this catalog; only content mutations matter.
  expect(mutations.filter(request => /courses|content|feature-flags/.test(request))).toEqual([]);
});

test('a visitor cannot open the admin content catalog', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/admin');
  await expect(page.locator('[data-subject-card="math"]')).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('heading', { name: /Contrôle des cours/ })).toHaveCount(0);
});
