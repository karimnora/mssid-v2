import { test, expect } from '@playwright/test';
import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';
import { readFileSync } from 'node:fs';

const exam = OFFICIAL_EXAMS_DATA.find(item => item.id === 'exam-2018-trim1-math')!;

test('mobile exam printing starts at the page origin without screen chrome', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/v1/users/me', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ id: 1, nom: 'Élève Test', email: 'student@example.test', role: 'ROLE_FREE', grade: '5AP' }),
  }));
  await page.goto('/?g=5AP');
  await page.getByRole('button', { name: 'أختبر', exact: true }).click();
  await page.getByRole('button', { name: 'الاختبارات الفصلية' }).click();
  await page.locator('[data-exam-subject="math"]').click();
  await page.getByText(exam.titleAr, { exact: true }).click();
  const sheet = page.locator('.printable-sheet');
  await expect(sheet).toBeVisible();
  await sheet.evaluate(element => element.setAttribute('data-print-mode', 'subject'));
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'build/exam-print-mobile.png', fullPage: true });
  const subjectPdf = await page.pdf({ path: 'build/exam-subject.pdf', preferCSSPageSize: true, printBackground: true });
  // Chromium emits page dictionaries uncompressed. Catch an extra page containing
  // only an overflowing answer line, even when DOM visibility checks pass.
  expect(subjectPdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(2);
  const bounds = await sheet.boundingBox();
  expect(bounds!.y).toBeLessThan(2);
  const identityBounds = await page.locator('.print-identity').boundingBox();
  expect(identityBounds!.y).toBeLessThan(50);
  await expect(page.locator('.print-identity')).toBeVisible();
  await expect(page.locator('.print-corrige').first()).toBeHidden();
  await expect(page.locator('[data-nav-assess]')).toBeHidden();
  await sheet.evaluate(element => element.setAttribute('data-print-mode', 'corrige'));
  await expect(page.locator('.print-identity')).toBeHidden();
  await expect(page.locator('.print-answer-lines').first()).toBeHidden();
  await expect(page.locator('.print-corrige').first()).toBeVisible();
  await page.pdf({ path: 'build/exam-corrige.pdf', preferCSSPageSize: true, printBackground: true });
});

test('a revision sheet escapes fixed, transformed and clipped mobile containers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(() => {
    document.body.innerHTML = `<div id="root"><header style="height:180px">Navigation</header>
      <main style="padding-top:100px;position:relative;transform:translateY(40px)">
        <div style="position:fixed;inset:0;overflow:hidden;max-height:70vh">
          <div class="no-print" style="height:80px">Imprimer</div>
          <div style="padding:48px"><article class="printable-sheet" dir="rtl">
            <h1>فيشة مراجعة</h1><p>محتوى الدرس</p><footer>mssid-dz.com</footer>
          </article></div>
        </div>
      </main></div>`;
  });
  await page.emulateMedia({ media: 'print' });
  const heading = page.getByRole('heading', { name: 'فيشة مراجعة' });
  await expect(heading).toBeVisible();
  expect((await heading.boundingBox())!.y).toBeLessThan(2);
  await expect(page.getByText('Navigation')).toBeHidden();
  await expect(page.getByText('mssid-dz.com')).toBeVisible();
  await page.pdf({ path: 'build/revision-sheet.pdf', preferCSSPageSize: true });
});

test('preschool pages retain their full A4 height and hide a background exam', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.addStyleTag({ content: readFileSync('src/components/preschool/preschoolWorksheets.css', 'utf8') });
  await page.evaluate(() => {
    document.body.innerHTML = `<div id="root"><main><article class="printable-sheet">Ancien examen</article></main></div>
      <div class="sheet-print-modal" style="position:fixed;padding:48px">
        <div class="preschool-paper-dialog" style="overflow:hidden;max-height:70vh;transform:scale(.95)">
          <button class="no-print">Imprimer</button>
          <article class="printable-sheet preschool-worksheet"><h1>Lettres A</h1><footer class="paper-footer">mssid-dz.com</footer></article>
          <article class="printable-sheet preschool-worksheet"><h1>Lettres B</h1><footer class="paper-footer">mssid-dz.com</footer></article>
        </div>
      </div>`;
  });
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByText('Ancien examen')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Lettres A' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lettres B' })).toBeVisible();
  const sheet = page.locator('.preschool-worksheet').first();
  expect((await sheet.boundingBox())!.height).toBeCloseTo(276 * 96 / 25.4, 0);
  expect((await sheet.boundingBox())!.y).toBeLessThan(2);
  await page.pdf({ path: 'build/preschool-sheets.pdf', preferCSSPageSize: true });
});

test('certificate printing hides an exam behind the certificate overlay', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(() => {
    document.body.innerHTML = `<div id="root"><main><article class="printable-sheet">Ancien examen</article></main>
      <div class="certificate-print-modal" style="position:fixed;inset:0;padding:48px">
        <article class="printable-certificate"><h1>شهادة تقدير</h1><p>mssid-dz.com</p></article>
      </div></div>`;
  });
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByText('Ancien examen')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'شهادة تقدير' })).toBeVisible();
  await expect(page.getByText('mssid-dz.com')).toBeVisible();
  await page.pdf({ path: 'build/certificate-sheet.pdf', preferCSSPageSize: true });
});

test('a worksheet modal nested inside the app root remains printable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(() => {
    document.body.innerHTML = `<div id="root"><main><article class="printable-sheet">Ancien examen</article></main>
      <div class="sheet-print-modal" style="position:fixed;inset:0;padding:48px">
        <div style="max-height:70vh;overflow:hidden;transform:scale(.95)">
          <button class="no-print">Imprimer</button>
          <article class="printable-sheet"><h1>ورقة عمل</h1><p>mssid-dz.com</p></article>
        </div>
      </div></div>`;
  });
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { name: 'ورقة عمل' })).toBeVisible();
  expect((await page.getByRole('heading', { name: 'ورقة عمل' }).boundingBox())!.y).toBeLessThan(2);
  await expect(page.getByText('Ancien examen')).toBeHidden();
  await page.pdf({ path: 'build/generated-worksheet.pdf', preferCSSPageSize: true });
});
