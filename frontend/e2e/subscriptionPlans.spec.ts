import { test, expect } from '@playwright/test';
for (const locale of ['ar', 'fr']) {
  test(`family subscription plan selection and receipt upload work on mobile in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(loc => { localStorage.setItem('mssid_locale_preference', loc); Math.random = () => 0; }, locale);
    let uploaded: any;
    await page.route('**/api/**', route => {
      const path = new URL(route.request().url()).pathname;
      if (path.endsWith('/users/me')) return route.fulfill({ json: { id: 7, nom: 'Parent Test', email: 'parent@example.test', role: 'ROLE_FREE', grade: '1AP' } });
      if (path.endsWith('/cahiers/access')) return route.fulfill({ json: { premium: false, limit: 3, remaining: 0, unlockedIds: [], allowed: true, resetsAt: '2030-01-06T23:00:00Z' } });
      if (path.endsWith('/receipt/upload')) { uploaded = route.request().postDataJSON(); return route.fulfill({ json: { ...uploaded, id: 42, durationMonths: 3, status: 'PENDING_VERIFICATION' } }); }
      return route.fulfill({ json: {} });
    });
    await page.goto('/labs/cahiers_lab?g=1AP');
    await page.locator('[data-cahier]').first().click();
    await page.getByRole('dialog').getByRole('button', { name: locale === 'fr' ? 'Découvrir Premium — pour les parents' : 'اكتشاف Premium — للأهل' }).click();
    const gate = () => page.getByRole('dialog', { name: locale === 'fr' ? 'Espace parents' : 'بوابة الوالدين' });
    await gate().getByRole('spinbutton').fill('20');
    await gate().getByRole('button', { name: locale === 'fr' ? 'Continuer' : 'متابعة' }).click();
    // Two offers since the 2026-11-03 decision: 3 months (900 DA) and 12 months (2 400 DA).
    await expect(page.getByRole('radio')).toHaveCount(2);
    await page.getByRole('radio', { name: /^3 (mois|أشهر)/ }).check();
    await expect(page.locator('form input:disabled')).toHaveValue(locale === 'fr' ? '900 DA — abonnement de 3 mois' : '900 دج — اشتراك 3 أشهر');
    await page.locator('input[type="file"]').setInputFiles({ name: 'recu.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5j0AAAAASUVORK5CYII=', 'base64') });
    await page.getByRole('button', { name: locale === 'fr' ? 'Envoyer le reçu de paiement' : 'إرسال وصل الدفع' }).click();
    // Financial confirmation must render above the offer, not be hidden underneath it.
    await gate().getByRole('spinbutton').fill('20');
    await gate().getByRole('button', { name: locale === 'fr' ? 'Continuer' : 'متابعة' }).click();
    await expect(page.getByText(locale === 'fr' ? 'Le reçu a été envoyé et attend une vérification manuelle' : 'تم إرسال وصل الدفع وهو بانتظار التحقق اليدوي')).toBeVisible();
    expect(uploaded.planId).toBe('P3M'); expect(uploaded.amountDzd).toBe(900);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
