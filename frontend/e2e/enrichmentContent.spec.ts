import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ENRICHMENT_MODULES } from "../src/data/family/enrichmentContent";
import { EXPLORATION_MODULES } from "../src/data/preschool/explorationModules";
async function mockFamily(
  page: import("@playwright/test").Page,
  grade: string,
  premium: boolean,
  locale = "fr"
) {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(
    (l) => localStorage.setItem("mssid_locale_preference", l),
    locale
  );
  await page.route("**/api/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/users/me"))
      return route.fulfill({
        json: {
          id: 7,
          nom: "Parent Test",
          email: "parent@example.test",
          role: premium ? "ROLE_PREMIUM" : "ROLE_FREE",
          grade,
        },
      });
    if (path.endsWith("/cahiers/access"))
      return route.fulfill({
        json: {
          premium,
          limit: 3,
          remaining: 3,
          unlockedIds: [],
          allowed: true,
          resetsAt: "2030-01-06T23:00:00Z",
        },
      });
    return route.fulfill({ json: {} });
  });
  await page.goto("/labs/cahiers_lab?g=" + grade);
  await page.locator('[data-family-service="library"]').click();
}
for (const grade of ["1AP", "2AP", "3AP", "4AP", "5AP"])
  test(
    "every new primary workshop opens and starts in " + grade,
    async ({ page }) => {
      const locale = grade === "2AP" || grade === "4AP" ? "ar" : "fr";
      await mockFamily(page, grade, true, locale);
      const studio = page.locator("[data-family-studio]");
      for (const module of ENRICHMENT_MODULES.filter(
        (m) => m.grade === grade
      )) {
        await studio
          .locator('[data-enrichment-module="' + module.id + '"]')
          .click();
        const reader = studio.locator("[data-enrichment-reader]");
        await expect(reader.getByRole("heading")).toHaveText(
          module.title[locale]
        );
        const task = module.tasks[0];
        if (task.accepted) {
          if (task.options) {
            const correct = task.options.find((o) =>
              task.accepted!.includes(o.id)
            )!;
            await reader
              .getByRole("button", { name: correct.label[locale], exact: true })
              .click();
          } else {
            await reader.getByRole("textbox").fill(task.accepted[0]);
            await reader
              .getByRole("button", {
                name:
                  locale === "fr" ? "Vérifier ma réponse" : "أتحقق من إجابتي",
                exact: true,
              })
              .click();
          }
          await expect(reader.getByRole("status")).toContainText(
            locale === "fr" ? "Réponse correcte" : "إجابة صحيحة"
          );
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          )
        ).toBe(true);
        await reader
          .getByRole("button", {
            name: locale === "fr" ? "Retour aux ateliers" : "أعود إلى الورشات",
            exact: true,
          })
          .click();
      }
    }
  );
for (const locale of ["fr", "ar"] as const)
  test(
    "full science workshop with explained choices and printing " + locale,
    async ({ page }, info) => {
      const t = (fr: string, ar: string) => (locale === "fr" ? fr : ar);
      await mockFamily(page, "5AP", true, locale);
      const module = ENRICHMENT_MODULES.find(
        (m) => m.id === "explore:5AP:science-enquiry"
      )!;
      await page
        .locator('[data-enrichment-module="' + module.id + '"]')
        .click();
      const reader = page.locator("[data-enrichment-reader]");
      for (let i = 0; i < 4; i++) {
        const task = module.tasks[i],
          correct = task.options!.find((o) => task.accepted!.includes(o.id))!;
        await reader
          .getByRole("button", { name: correct.label[locale], exact: true })
          .click();
        if (i < 3)
          await reader
            .getByRole("button", {
              name: t("Défi suivant", "التحدي التالي"),
              exact: true,
            })
            .click();
      }
      await expect(reader.getByText("4/4")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
      const audit = await new AxeBuilder({ page })
        .include("[data-enrichment-reader]")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await reader.screenshot({
        path: info.outputPath("science-" + locale + ".png"),
        style:
          "[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}",
      });
      await reader
        .getByRole("button", {
          name: t("Imprimer cet atelier", "أطبع هذه الورشة"),
        })
        .click();
      const print = page.getByRole("dialog", {
        name: t("Imprimer mon programme", "طباعة برنامجي"),
      });
      await expect(print.locator(".printable-sheet")).toHaveCount(1);
      await expect(print.locator(".printable-sheet > ol > li")).toHaveCount(4);
      await expect(print.locator(".printable-sheet ul > li")).toHaveCount(12);
      if (locale === "fr") {
        await page.emulateMedia({ media: "print" });
        await page.pdf({
          path: info.outputPath("science-workshop.pdf"),
          format: "A4",
          printBackground: true,
        });
        await page.emulateMedia({ media: "screen" });
      }
      await print
        .getByRole("button", {
          name: t("Afficher les corrigés", "أعرض التصحيح"),
        })
        .click();
      await expect(print.locator(".family-answer-space")).toHaveCount(0);
      await page.keyboard.press("Escape");
      await page.reload();
      await page.locator('[data-family-service="library"]').click();
      await page
        .locator('[data-enrichment-module="' + module.id + '"]')
        .click();
      await expect(
        page.locator("[data-enrichment-reader]").getByText("4/4")
      ).toBeVisible();
    }
  );
test("free discovery does not unlock the paid challenges", async ({ page }) => {
  await mockFamily(page, "1AP", false);
  await page
    .locator('[data-enrichment-module="explore:1AP:daily-maths"]')
    .click();
  await page.getByRole("textbox").fill("5");
  await page
    .getByRole("button", { name: "Vérifier ma réponse", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Défi 2", exact: true })
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Imprimer cet atelier" })
  ).toHaveCount(0);
});
for (const language of ["fr", "ar", "en"] as const)
  test(
    "six new preschool themes fit in " + language,
    async ({ page }, info) => {
      const t = (fr: string, ar: string, en: string) =>
        language === "fr" ? fr : language === "ar" ? ar : en;
      await page.setViewportSize({ width: 320, height: 740 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript((l) => {
        localStorage.setItem("mssid_locale_preference", "fr");
        localStorage.setItem("mssid_preschool_language", l);
      }, language);
      await page.route("**/api/**", (route) =>
        route.fulfill({ status: 401, json: {} })
      );
      for (const module of EXPLORATION_MODULES) {
        await page.goto("/eveil");
        await page
          .getByText(t("Apprendre", "أَتَعَلَّم", "Learn"), { exact: true })
          .click();
        const group = module.id.endsWith("shapes")
          ? t(
              "Lettres, chiffres et formes",
              "حُرُوف، أَرْقَام وَأَشْكَال",
              "Letters, numbers and shapes"
            )
          : module.id.endsWith("nature") || module.id.endsWith("transport")
          ? t("Sciences et monde", "الْعُلُوم وَالْعَالَم", "Science and world")
          : t(
              "Famille et valeurs",
              "الْعَائِلَة وَالْقِيَم",
              "Family and values"
            );
        await page.getByText(group, { exact: true }).click();
        await page
          .getByText(module.titleI18n[language], { exact: true })
          .click();
        const task = module.activities[1];
        await page
          .getByRole("button", { name: task.i18n[language].title, exact: true })
          .click();
        await expect(
          page.getByText(task.i18n[language].promptAudio, { exact: true })
        ).toBeVisible();
        for (const choice of task.visualAssets.choices!)
          await expect(
            page.getByRole("button", { name: choice.asset, exact: true })
          ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          )
        ).toBe(true);
      }
      await page.screenshot({
        path: info.outputPath("preschool-new-" + language + ".png"),
      });
    }
  );

test('new library and its reader remain readable with the manual dark theme',async({page},info)=>{
 await page.addInitScript(()=>{localStorage.setItem('mssid_theme','dark');localStorage.setItem('mssid_theme_manual','true');});await mockFamily(page,'5AP',true,'fr');await expect(page.locator('html')).toHaveClass(/theme-dark/);
 const catalogAudit=await new AxeBuilder({page}).include('[data-enrichment-library]').withTags(['wcag2a','wcag2aa']).analyze();expect(catalogAudit.violations).toEqual([]);
 await page.locator('[data-enrichment-module="explore:5AP:science-enquiry"]').click();const audit=await new AxeBuilder({page}).include('[data-enrichment-reader]').withTags(['wcag2a','wcag2aa']).analyze();expect(audit.violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-enrichment-reader]').screenshot({path:info.outputPath('new-workshop-dark.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
});
