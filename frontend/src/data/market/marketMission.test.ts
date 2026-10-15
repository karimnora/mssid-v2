import { readFamilyResults } from "../../utils/familyLearning";
import { describe, expect, it, beforeEach } from "vitest";
import { MARKET_PLANS } from "./marketMission";
import {
  readMarketResults,
  recordMarketResult,
  marketStorageKey,
} from "../../utils/marketMissionProgress";
const plans = Object.values(MARKET_PLANS);
beforeEach(() => localStorage.clear());
describe("market curriculum and isolated progress", () => {
  it("has six adapted steps and complete text in each of six bands", () => {
    expect(plans).toHaveLength(6);
    const ids = new Set<string>();
    for (const plan of plans) {
      expect(plan.tasks.map((t) => t.kind)).toEqual([
        "pack",
        "compare",
        "pay",
        "read",
        "share",
        "observe",
      ]);
      for (const task of plan.tasks) {
        expect(ids.has(task.id)).toBe(false);
        ids.add(task.id);
        for (const field of [task.title, task.prompt, task.hint, task.explain])
          for (const lang of ["fr", "ar", "en"] as const)
            expect(field[lang].trim().length).toBeGreaterThan(3);
      }
    }
    expect(ids.size).toBe(36);
  });
  it("checks all numeric answers against quantities and price calculations", () => {
    const packs = [
      [3, 2],
      [4, 2],
      [2 * 3, 3],
      [3 * 4, 2 * 3],
      [18 / 2, 12 / 4],
      [(20 * 3) / 4, 12 * 0.25],
    ];
    const payments = [4, 20, 35, 2 * 30 + 15, 3 * 40 + 25, 240 * (1 - 0.25)];
    const readingAnswers = [
      "Des pommes",
      "Des carottes",
      "4",
      "75 DA",
      "55 DA",
      "150 DA",
    ];
    plans.forEach((plan, i) => {
      const [pack, compare, pay, read, share] = plan.tasks;
      if (
        pack.kind !== "pack" ||
        compare.kind !== "compare" ||
        pay.kind !== "pay" ||
        read.kind !== "read" ||
        share.kind !== "share"
      )
        throw Error("Unexpected curriculum");
      expect(pack.targets).toEqual(packs[i]);
      expect(pay.total).toBe(payments[i]);
      expect(pay.total % Math.min(...pay.coins)).toBe(0);
      expect(read.options[read.correct].fr).toBe(readingAnswers[i]);
      expect(compare.correct).toBe([1, 0, 0, 0, 0, 1][i]);
      expect(share.targets.reduce((a, b) => a + b, 0)).toBe(share.total);
      expect(new Set(share.targets).size).toBe(1);
    });
  });
  it("keeps primary market results in the family notebook whitelist", () => {
    const id = "market-mission:5AP:0";
    localStorage.setItem(
      "market-test",
      JSON.stringify({
        [id]: { outcome: "helped", at: "2026-10-15T10:00:00Z" },
      })
    );
    expect(readFamilyResults("market-test")[id].outcome).toBe("helped");
  });
  it("keeps a prior completion after a later unsuccessful attempt and rejects foreign IDs", () => {
    const at = "2026-10-15T10:00:00Z",
      id = "market-mission:preschool:0";
    const first = recordMarketResult({}, id, "independent", at),
      latest = recordMarketResult(first, id, "review", "2026-10-15T11:00:00Z");
    expect(latest[id]).toMatchObject({ outcome: "review", completedAt: at });
    const key = marketStorageKey("user:1:child:2", "preschool", "fr");
    localStorage.setItem(
      key,
      JSON.stringify({
        ...latest,
        "market-mission:5AP:0": { outcome: "independent", at },
        "market-mission:preschool:1": { outcome: "independent", at: "broken" },
      })
    );
    expect(readMarketResults(key, "preschool")).toEqual(latest);
    expect(
      readMarketResults(
        marketStorageKey("user:1:child:3", "preschool", "fr"),
        "preschool"
      )
    ).toEqual({});
    expect(
      readMarketResults(
        marketStorageKey("user:1:child:2", "preschool", "en"),
        "preschool"
      )
    ).toEqual({});
  });
});
