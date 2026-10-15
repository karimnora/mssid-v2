import { MARKET_PLANS, type MarketBand } from "../data/market/marketMission";
import type { PreschoolLanguage } from "../data/preschool/types";
import type { FamilyResults, TaskOutcome } from "./familyLearning";
export const marketStorageKey = (
  owner: string,
  band: MarketBand,
  language: PreschoolLanguage
) => "mssid_market_mission_v1:" + owner + ":" + band + ":" + language;
export function readMarketResults(
  key: string,
  band: MarketBand
): FamilyResults {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key) ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const known = new Set(MARKET_PLANS[band].tasks.map((task) => task.id));
    return Object.fromEntries(
      Object.entries(raw).flatMap(([id, v]) => {
        if (
          !known.has(id) ||
          !v ||
          typeof v !== "object" ||
          !["independent", "helped", "review"].includes(v.outcome) ||
          typeof v.at !== "string" ||
          !Number.isFinite(Date.parse(v.at))
        )
          return [];
        const completedAt =
          typeof v.completedAt === "string" &&
          Number.isFinite(Date.parse(v.completedAt))
            ? v.completedAt
            : v.outcome !== "review"
            ? v.at
            : undefined;
        return [
          [
            id,
            {
              outcome: v.outcome,
              at: v.at,
              ...(completedAt ? { completedAt } : {}),
            },
          ],
        ];
      })
    );
  } catch {
    return {};
  }
}
export function recordMarketResult(
  results: FamilyResults,
  id: string,
  outcome: TaskOutcome,
  at = new Date().toISOString()
): FamilyResults {
  const old = results[id];
  const completedAt =
    old?.completedAt ??
    (old && old.outcome !== "review"
      ? old.at
      : outcome !== "review"
      ? at
      : undefined);
  return {
    ...results,
    [id]: { outcome, at, ...(completedAt ? { completedAt } : {}) },
  };
}
