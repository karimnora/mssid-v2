import { test, expect } from '@playwright/test';

// Login/register flow, API mocked at the network layer (see playwright.config.ts) — no real
// Spring Boot backend needed. Locators follow the same Testing-Library-style convention already
// used across src/components/*.test.tsx: role/placeholder/text, no test IDs.

test.beforeEach(async ({ page }) => {
  // A fresh guest session: AuthContext's boot-time fetchCurrentUser() must fail cleanly.
  await page.route('**/v1/users/me', (route) => route.fulfill({ status: 401, body: '{}' }));
  await page.goto('/');
});

test('a guest can log in with valid credentials', async ({ page }) => {
  await page.route('**/v1/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        nom: 'سارة المتفوقة',
        email: 'premium@mssid.dz',
        roleName: 'ROLE_PREMIUM',
        user: { email: 'premium@mssid.dz', role: 'ROLE_PREMIUM' },
      }),
    })
  );

  await page.getByRole('button', { name: 'تسجيل الدخول / إنشاء حساب مجاني 🚀' }).click();
  await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();

  await page.getByPlaceholder('example@mssid.dz').fill('premium@mssid.dz');
  await page.getByPlaceholder('••••••••').fill('password123');

  // Scoped to the <form> — the login/register tab button above it also reads exactly
  // "تسجيل الدخول", so an unscoped getByRole('button', { name: 'تسجيل الدخول' }) matches both.
  const submitButton = page.locator('form').getByRole('button', { name: 'تسجيل الدخول', exact: true });
  const [loginRequest] = await Promise.all([
    page.waitForRequest('**/v1/auth/login'),
    submitButton.click(),
  ]);
  expect(loginRequest.postDataJSON()).toMatchObject({ email: 'premium@mssid.dz' });

  await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).not.toBeVisible();
});

test('a parent can register without duplicating the child grade', async ({ page }) => {
  await page.route('**/v1/auth/register', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        nom: 'يونس',
        email: 'younes@mssid.dz',
        roleName: 'ROLE_FREE',
        user: { id: 2, nom: 'يونس', email: 'younes@mssid.dz', role: 'ROLE_FREE' },
      }),
    })
  );

  await page.getByRole('button', { name: 'تسجيل الدخول / إنشاء حساب مجاني 🚀' }).click();
  // Scoped to the modal overlay — an unscoped match also catches the Home CTA button just clicked
  // above, which contains the same "إنشاء حساب" substring and sits behind the modal once it's open.
  const modal = page.locator('.fixed.inset-0.z-50');
  await modal.getByRole('button', { name: /إنشاء حساب/i }).first().click();

  await page.getByPlaceholder('مثال: يونس الجزائري').fill('يونس');
  await page.getByPlaceholder('example@mssid.dz').fill('younes@mssid.dz');
  await page.getByPlaceholder('••••••••').fill('password123');
  // School level is selected later in each child's profile.
  await expect(modal.locator('select[required]')).toHaveCount(0);

  const [registerRequest] = await Promise.all([
    page.waitForRequest('**/v1/auth/register'),
    page.getByRole('button', { name: 'إنشاء الحساب' }).click(),
  ]);
  expect(registerRequest.postDataJSON()).toMatchObject({ nom: 'يونس', email: 'younes@mssid.dz', password: 'password123' });
  expect(registerRequest.postDataJSON()).not.toHaveProperty('grade');
  await expect(modal).not.toBeVisible();
});
