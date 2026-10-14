import { test, expect, Page } from '@playwright/test';
import { PRINTABLE_CATEGORY_LABELS } from '../src/data/preschool/printablesData';

async function printSnapshot(page: Page, button: ReturnType<Page['getByRole']>) {
  await button.click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __printCalls?: number }).__printCalls ?? 0)).toBe(1);
  await page.evaluate(() => {
    document.body.innerHTML = (window as unknown as { __printSnapshot: string }).__printSnapshot;
  });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  test.describe(`real print documents at ${viewport.width}px`, () => {
    test.use({ viewport });
    for (const language of ['ar', 'fr', 'en'] as const) {
      for (const category of ['graphisme', 'lettres', 'chiffres', 'logique', 'motricite', 'coloriage'] as const) {
      test(`preschool ${language} ${category} booklet`, async ({ page }) => {
        await page.goto(`/e2e/printHarness.html?view=preschool&lang=${language}`);
        await page.getByRole('button', { name: PRINTABLE_CATEGORY_LABELS[category][language], exact: true }).click();
        const button = page.getByRole('button', { name: /طباعة الدفتر|Imprimer le cahier|Print booklet/ });
        await expect(button).toBeVisible();
        const count = Number((await button.textContent())!.match(/\((\d+)\)/)![1]);
        await printSnapshot(page, button);
        await expect(page.locator('.preschool-worksheet')).toHaveCount(count);
        await expect(page.getByRole('button')).toHaveCount(0);
        const pdf = await page.pdf({ path: `build/print-preschool-${language}-${category}-${viewport.width}.pdf`, preferCSSPageSize: true });
        expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(count);
        expect(pdf.toString('latin1')).toContain('/Font');
      });
      }
    }
    test('wilayas certificate', async ({ page }) => {
      await page.goto('/e2e/printHarness.html?view=wilayas');
      await page.getByRole('button', { name: 'شهادة المستكشف الوطني', exact: true }).click();
      await printSnapshot(page, page.getByRole('button', { name: 'طباعة الشهادة (Imprimer)', exact: true }));
      await expect(page.locator('.printable-certificate')).toBeVisible();
      const pdf = await page.pdf({ path: `build/print-wilayas-${viewport.width}.pdf`, preferCSSPageSize: true, printBackground: true });
      expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
      expect(pdf.toString('latin1')).toContain('/Font');
    });
    for (const view of ['worksheet', 'certificate', 'revision'] as const) {
      test(view, async ({ page }) => {
        await page.goto(`/e2e/printHarness.html?view=${view}`);
        const button = page.getByRole('button', { name: /طباعة/ }).first();
        await expect(button).toBeVisible();
        await printSnapshot(page, button);
        const paper = page.locator('.printable-sheet, .printable-certificate');
        await expect(paper).toBeVisible();
        await expect(page.getByRole('button')).toHaveCount(0);
        const pdf = await page.pdf({ path: `build/print-${view}-${viewport.width}.pdf`, preferCSSPageSize: true, printBackground: true });
        expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
        expect(pdf.toString('latin1')).toContain('/Font');
        if (view === 'certificate') {
          const size = pdf.toString('latin1').match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/)!;
          expect(Number(size[1])).toBeGreaterThan(Number(size[2]));
        }
      });
    }
    for (const view of ['writing', 'tamazight'] as const) {
      test(view, async ({ page, context }) => {
        await context.addInitScript(() => { window.print = () => {}; });
        await page.goto(`/e2e/printHarness.html?view=${view}`);
        const printButton = page.getByTitle(view === 'writing'
          ? 'طباعة ورقة نشاط جاهزة للتدريب بالقلم على الورق'
          : 'طباعة فرض المراقبة المستمرة A4 بالتيفيناغ');
        await expect(printButton).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await printButton.click();
        const popup = await popupPromise;
        await expect(popup.locator('.header')).toBeVisible();
        await popup.evaluate(() => document.fonts.ready);
        const pdf = await popup.pdf({ path: `build/print-${view}-${viewport.width}.pdf`, preferCSSPageSize: true, printBackground: true });
        expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
      });
    }
    test('worksheet summary variant', async ({ page }) => {
      await page.goto('/e2e/printHarness.html?view=worksheet');
      await page.getByRole('combobox').last().selectOption('summary_card');
      await printSnapshot(page, page.getByRole('button', { name: /طباعة/ }).first());
      const pdf = await page.pdf({ path: `build/print-summary-${viewport.width}.pdf`, preferCSSPageSize: true });
      expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
      expect(pdf.toString('latin1')).toContain('/Font');
    });
    for (const language of ['fr', 'en', 'ber'] as const) {
      test(`writing variant ${language}`, async ({ page, context }) => {
        await context.addInitScript(() => { window.print = () => {}; });
        await page.goto('/e2e/printHarness.html?view=writing');
        await page.getByRole('button', { name: language === 'fr' ? /Français Cursive/ : language === 'en' ? /English Script/ : /Tamazight/ }).click();
        const popupPromise = page.waitForEvent('popup');
        await page.getByTitle('طباعة ورقة نشاط جاهزة للتدريب بالقلم على الورق').click();
        const popup = await popupPromise;
        await expect(popup.locator('.big-char')).toBeVisible();
        await expect(popup.locator('html')).toHaveAttribute('lang', language);
        const pdf = await popup.pdf({ path: `build/print-writing-${language}-${viewport.width}.pdf`, preferCSSPageSize: true });
        expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
        expect(pdf.toString('latin1')).toContain('/Font');
      });
    }
    test('tamazight 5AP variant', async ({ page, context }) => {
      await context.addInitScript(() => { window.print = () => {}; });
      await page.goto('/e2e/printHarness.html?view=tamazight&grade=5AP');
      const popupPromise = page.waitForEvent('popup');
      await page.getByTitle('طباعة فرض المراقبة المستمرة A4 بالتيفيناغ').click();
      const popup = await popupPromise;
      await expect(popup.locator('.header')).toContainText('5AP');
      const pdf = await popup.pdf({ path: `build/print-tamazight-5ap-${viewport.width}.pdf`, preferCSSPageSize: true });
      expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
      expect(pdf.toString('latin1')).toContain('/Font');
    });
  });
}

const certificateTemplates = ['honor_board', 'math_champion', 'arabic_calligraphy', 'reading_crown',
  'science_explorer', 'wilayas_ambassador', 'daily_perseverance', 'first_ap_graduate',
  'second_ap_graduate', 'third_ap_graduate', 'fourth_ap_graduate', 'exam_acquis_5ap'];

for (const template of certificateTemplates) {
  test(`certificate template ${template} fits one landscape page`, async ({ page }) => {
    await page.goto('/e2e/printHarness.html?view=certificate&allDiplomas=true');
    const choice = page.locator(`[data-certificate-template="${template}"]`);
    await expect(choice).toBeEnabled();
    await choice.click();
    await printSnapshot(page, page.getByRole('button', { name: /طباعة/ }).first());
    const pdf = await page.pdf({ path: `build/print-template-${template}.pdf`, preferCSSPageSize: true, printBackground: true });
    expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
    expect(pdf.toString('latin1')).toContain('/Font');
    const size = pdf.toString('latin1').match(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/)!;
    expect(Number(size[1])).toBeGreaterThan(Number(size[2]));
  });
}
