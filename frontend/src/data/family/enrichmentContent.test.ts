import { describe, expect, it, beforeEach } from "vitest";
import { ENRICHMENT_MODULES } from "./enrichmentContent";
import { FAMILY_MODULES } from "./familyContent";
import {
  checkFamilyAnswer,
  readFamilyResults,
} from "../../utils/familyLearning";
beforeEach(() => localStorage.clear());
describe("enrichment learning content", () => {
  it("adds 33 distinct four-challenge workshops without replacing existing content", () => {
    expect(ENRICHMENT_MODULES).toHaveLength(33);
    expect(ENRICHMENT_MODULES.flatMap((m) => m.tasks)).toHaveLength(132);
    const ids = new Set(
      FAMILY_MODULES.flatMap((m) => [m.id, ...m.tasks.map((t) => t.id)])
    );
    for (const module of ENRICHMENT_MODULES) {
      expect(ids.has(module.id)).toBe(false);
      ids.add(module.id);
      expect(module.tasks).toHaveLength(4);
      for (const task of module.tasks) {
        expect(ids.has(task.id)).toBe(false);
        ids.add(task.id);
        for (const text of [task.prompt, task.answer, task.hint, task.method])
          for (const lang of ["fr", "ar"] as const)
            expect(text[lang].trim().length).toBeGreaterThan(0);
      }
    }
  });
  it("checks mathematical answers against independent calculations and supports Arabic digits", () => {
    const answers = {
      "1AP": [7 - 2, 4 + 3, 10 - 6, 8 - 5],
      "2AP": [25 + 15, 50 - 40, 3 * 4, 80 - 30],
      "3AP": [4 * 6, 24 / 3, 10 + 25, 1000 - 250],
      "4AP": [28 / 4, 2 * (8 + 5), 180 / 3, 4 * 125],
      "5AP": [800 * (1 - 0.15), (180 / 3) * 5, 12 * 7, 1500 - 350],
    };
    for (const [grade, expected] of Object.entries(answers)) {
      const module = ENRICHMENT_MODULES.find(
        (m) => m.id === "explore:" + grade + ":daily-maths"
      )!;
      module.tasks.forEach((task, i) => {
        expect(checkFamilyAnswer(task, String(expected[i]))).toBe(true);
        expect(checkFamilyAnswer(task, String(expected[i] + 1))).toBe(false);
      });
    }
    expect(checkFamilyAnswer(ENRICHMENT_MODULES[0].tasks[0], "٥")).toBe(true);
  });
  it("provides one unambiguous correct choice with varied positions and explained feedback", () => {
    const correctPositions = new Set<string>();
    for (const module of ENRICHMENT_MODULES)
      for (const task of module.tasks) {
        if (!task.options) continue;
        expect(task.options).toHaveLength(3);
        expect(new Set(task.options.map((o) => o.label.fr)).size).toBe(3);
        const accepted = task.options.filter((o) =>
          checkFamilyAnswer(task, o.id)
        );
        expect(accepted).toHaveLength(1);
        expect(accepted[0].label).toEqual(task.answer);
        correctPositions.add(accepted[0].id);
      }
    expect(correctPositions.size).toBe(3);
  });
  it("keeps language-learning content in its target language and open writing ungraded", () => {
    for (const module of ENRICHMENT_MODULES.filter((m) => m.language))
      for (const task of module.tasks) {
        expect(task.prompt.fr).toBe(task.prompt.ar);
        expect(task.method.fr).toBe(task.method.ar);
        expect(task.language).toBe(module.language);
      }
    for (const module of ENRICHMENT_MODULES.filter(
      (m) => m.domain === "writing"
    ))
      for (const task of module.tasks) {
        expect(task.accepted).toBeUndefined();
        expect(checkFamilyAnswer(task, "anything")).toBeNull();
      }
    expect(
      ENRICHMENT_MODULES.filter((m) => m.domain === "english").map(
        (m) => m.grade
      )
    ).toEqual(["3AP", "4AP", "5AP"]);
  });
  it("persists new IDs without accepting unknown or malformed results", () => {
    const id = ENRICHMENT_MODULES[0].tasks[0].id,
      at = "2026-10-15T10:00:00Z";
    localStorage.setItem(
      "expanded",
      JSON.stringify({
        [id]: { outcome: "helped", at },
        fake: { outcome: "independent", at },
      })
    );
    expect(readFamilyResults("expanded")).toEqual({
      [id]: { outcome: "helped", at, completedAt: at },
    });
  });
});
