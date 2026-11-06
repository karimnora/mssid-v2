/** Device-local aggregate counts only: no identity, answers, timestamps or network request. */
export type PremiumEvent = 'lock_open' | 'parent_interest' | 'offer_open' | 'demo_complete';
export function recordPremiumEvent(event: PremiumEvent): void {
  try {
    const key = 'mssid_premium_funnel_counts_v1';
    const counts = JSON.parse(localStorage.getItem(key) ?? '{}');
    counts[event] = Math.max(0, Number(counts[event]) || 0) + 1;
    localStorage.setItem(key, JSON.stringify(counts));
  } catch { /* Measurement never interrupts an activity. */ }
}
