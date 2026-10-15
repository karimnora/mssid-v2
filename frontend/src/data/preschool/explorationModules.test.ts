import { describe, it, expect } from "vitest";
import { EXPLORATION_MODULES } from "./explorationModules";
import { PRESCHOOL_MODULES } from "./index";
describe("preschool thematic exploration", () => {
  it("adds six reachable themes and 36 distinct multilingual activities", () => {
    expect(EXPLORATION_MODULES).toHaveLength(6);
    expect(EXPLORATION_MODULES.flatMap((m) => m.activities)).toHaveLength(36);
    const allIds = PRESCHOOL_MODULES.flatMap((m) => [
      m.id,
      ...m.activities.map((a) => a.id),
    ]);
    expect(new Set(allIds).size).toBe(allIds.length);
    for (const module of EXPLORATION_MODULES) {
      expect(PRESCHOOL_MODULES.some((m) => m.id === module.id)).toBe(true);
      expect(module.totalSteps).toBe(6);
      expect(module.activities.map((a) => a.stepNumber)).toEqual([
        1, 2, 3, 4, 5, 6,
      ]);
      for (const activity of module.activities)
        for (const lang of ["ar", "fr", "en"] as const) {
          expect(activity.i18n[lang].promptAudio.length).toBeGreaterThan(5);
          expect(activity.i18n[lang].title.length).toBeGreaterThan(0);
          expect(activity.i18n[lang].instructionText).toBe(
            activity.i18n[lang].promptAudio
          );
        }
    }
  });
  it("provides valid matching, sorting, repeating patterns and narrated story orders", () => {
    for (const module of EXPLORATION_MODULES)
      for (const activity of module.activities) {
        const assets = activity.visualAssets;
        if (assets.choices)
          expect(assets.choices.filter((c) => c.isCorrect)).toHaveLength(1);
        if (assets.sortItems) {
          const bins = new Set(assets.sortBins!.map((b) => b.id));
          for (const item of assets.sortItems)
            expect(bins.has(item.correctBinId)).toBe(true);
        }
        if (assets.sequencePattern) {
          const pattern = assets.sequencePattern;
          const period = [2, 3].find((n) =>
            pattern.every((v, i) => v === pattern[i % n])
          )!;
          expect(period).toBeTruthy();
          expect(assets.choices!.find((c) => c.isCorrect)!.asset).toBe(
            pattern[pattern.length % period]
          );
        }
        if (assets.storyFrames)
          expect(assets.storyFrames.map((f) => f.order)).toEqual([1, 2, 3]);
        if (assets.listenCards)
          expect(new Set(assets.listenCards.map((c) => c.asset)).size).toBe(
            assets.listenCards.length
          );
      }
  });
});
