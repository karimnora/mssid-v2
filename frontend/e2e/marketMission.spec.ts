import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { MARKET_PLANS } from "../src/data/market/marketMission";
for (const locale of ["fr", "ar"] as const)
  test("full market mission on mobile " + locale, async ({ page }, info) => {
    const t = (fr: string, ar: string) => (locale === "fr" ? fr : ar);
    await page.setViewportSize({ width: 360, height: 900 });
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
            role: "ROLE_PREMIUM",
            grade: "5AP",
          },
        });
      if (path.endsWith("/cahiers/access"))
        return route.fulfill({
          json: {
            premium: true,
            limit: 3,
            remaining: 3,
            unlockedIds: [],
            allowed: true,
            resetsAt: "2030-01-06T23:00:00Z",
          },
        });
      return route.fulfill({ json: {} });
    });
    await page.goto("/labs/cahiers_lab?g=5AP");
    const studio = page.locator("[data-family-studio]");
    const open = async () => {
      await studio
        .getByRole("button", {
          name: new RegExp(t("Laboratoires Premium", "مختبرات Premium")),
        })
        .click();
      await studio
        .getByRole("button", {
          name: new RegExp(t("La mission du marché de Didou", "مهمة سوق ديدو")),
        })
        .click();
    };
    await open();
    const mission = page.locator("[data-market-mission]"),
      verify = () =>
        mission
          .getByRole("button", {
            name: t("Vérifier mon défi", "أتحقق من التحدي"),
            exact: true,
          })
          .click();
    const add = async (i: number, n: number) => {
      for (let j = 0; j < n; j++)
        await mission
          .getByRole("button", {
            name: t("Ajouter à ", "أضيف إلى ") + i,
            exact: true,
          })
          .click();
    };
    await add(1, 1);
    await mission
      .getByRole("button", {
        name: t("Retour aux ateliers", "أعود إلى الورشات"),
      })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: t("Continuer", "متابعة"), exact: true })
      .click();
    await expect(mission.locator(".market-count").first()).toHaveText("1");
    await add(1, 14);
    await add(2, 3);
    await mission.screenshot({
      path: info.outputPath("market-pack-" + locale + ".png"),
      style:
        "[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}",
    });
    const sizes = await mission
      .locator(".market-controls button")
      .evaluateAll((nodes) =>
        nodes.map((n) => ({
          w: n.getBoundingClientRect().width,
          h: n.getBoundingClientRect().height,
        }))
      );
    for (const size of sizes) {
      expect(size.w).toBeGreaterThanOrEqual(44);
      expect(size.h).toBeGreaterThanOrEqual(44);
    }
    await verify();
    await mission
      .getByRole("button", { name: t("Continuer la mission", "أتابع المهمة") })
      .click();
    const compare = MARKET_PLANS["5AP"].tasks[1];
    if (compare.kind !== "compare") throw Error("Missing comparison");
    await mission
      .getByRole("button", {
        name: compare.options[compare.correct][locale],
        exact: true,
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("Terminer cette séance", "أنهي هذه الجلسة"),
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("Ouvrir la séance suivante", "أفتح الجلسة التالية"),
      })
      .click();
    for (const coin of [100, 50, 20, 10])
      await mission
        .getByRole("button", {
          name: t("Ajouter ", "أضيف ") + coin + " DA",
          exact: true,
        })
        .click();
    await verify();
    await mission
      .getByRole("button", { name: t("Continuer la mission", "أتابع المهمة") })
      .click();
    const read = MARKET_PLANS["5AP"].tasks[3];
    if (read.kind !== "read") throw Error("Missing reading");
    await mission
      .getByRole("button", {
        name: read.options[read.correct][locale],
        exact: true,
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("Terminer cette séance", "أنهي هذه الجلسة"),
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("Ouvrir la séance suivante", "أفتح الجلسة التالية"),
      })
      .click();
    for (let i = 1; i <= 3; i++) await add(i, 5);
    await verify();
    await mission
      .getByRole("button", { name: t("Continuer la mission", "أتابع المهمة") })
      .click();
    await mission
      .getByRole("button", {
        name: t("Faire l’observation plus tard", "نؤجل الملاحظة"),
      })
      .click();
    await expect(
      mission.getByRole("heading", {
        name: t("Le carnet du marché", "دفتر السوق"),
      })
    ).toBeVisible();
    await expect(mission.locator(".market-progress")).toContainText("5/6");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .include("[data-market-mission]")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await mission.screenshot({
      path: info.outputPath("market-report-" + locale + ".png"),
      style:
        "[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}",
    });
    await page.reload();
    await open();
    await expect(mission.locator(".market-progress")).toContainText("5/6");
  });
for (const language of ["fr", "ar", "en"] as const)
  test("free preschool market " + language, async ({ page }, info) => {
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
    await page.goto("/eveil");
    await page
      .getByText(t("Ateliers", "الْوَرَشَات", "Create"), { exact: true })
      .click();
    await page
      .getByText(
        t(
          "La mission du marché de Didou",
          "مهمة سوق ديدو",
          "Didou’s market mission"
        ),
        { exact: true }
      )
      .click();
    const mission = page.locator("[data-market-mission]");
    for (let i = 1; i <= 2; i++)
      for (let n = 0; n < (i === 1 ? 3 : 2); n++)
        await mission
          .getByRole("button", {
            name: t("Ajouter à ", "أضيف إلى ", "Add to ") + i,
            exact: true,
          })
          .click();
    await mission
      .getByRole("button", {
        name: t("Vérifier mon défi", "أتحقق من التحدي", "Check my challenge"),
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("Continuer la mission", "أتابع المهمة", "Continue the mission"),
      })
      .click();
    await mission
      .getByRole("button", {
        name: t("5 pommes", "5 تفاحات", "5 apples"),
        exact: true,
      })
      .click();
    await mission
      .getByRole("button", {
        name: t(
          "Terminer cette séance",
          "أنهي هذه الجلسة",
          "Finish this session"
        ),
      })
      .click();
    await expect(
      mission.getByRole("button", {
        name: new RegExp(
          t("Choisir et payer", "أختار وأدفع", "Choose and pay")
        ),
      })
    ).toBeDisabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await mission.screenshot({
      path: info.outputPath("market-preschool-" + language + ".png"),
      style:
        "[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}",
    });
  });
