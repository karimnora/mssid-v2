// Same Premium services for every duration. Explicit plan IDs avoid confusing
// the new 6-month 1500 DA offer with legacy 12-month receipts at 1500 DA.
export const SUBSCRIPTION_PLANS = [
  { id: 'P3M', months: 3, priceDzd: 900, monthlyDzd: 300 },
  { id: 'P6M', months: 6, priceDzd: 1500, monthlyDzd: 250 },
  { id: 'P12M', months: 12, priceDzd: 2400, monthlyDzd: 200 },
] as const;
export type SubscriptionPlanId = typeof SUBSCRIPTION_PLANS[number]['id'];
export const DEFAULT_SUBSCRIPTION_PLAN = SUBSCRIPTION_PLANS[2];
