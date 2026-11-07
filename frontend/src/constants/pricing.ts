// Same Premium services for every duration. Decision of 2026-11-03: two offers only (3 and 12 months);
// the 6-month offer is dropped. New P6M purchases are rejected server-side; already filed P6M / LEGACY_12M receipts keep their duration.
export const SUBSCRIPTION_PLANS = [
  { id: 'P3M', months: 3, priceDzd: 900, monthlyDzd: 300 },
  { id: 'P12M', months: 12, priceDzd: 2400, monthlyDzd: 200 },
] as const;
export type SubscriptionPlanId = typeof SUBSCRIPTION_PLANS[number]['id'];
export const DEFAULT_SUBSCRIPTION_PLAN = SUBSCRIPTION_PLANS[1];
