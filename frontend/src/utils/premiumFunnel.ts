import { SPRING_BOOT_BASE_URL } from '../services/springBootApi';
import type { PrimaryGrade } from '../types';
import { villageDay } from './villageSession';
export type PremiumEvent = 'lock_open' | 'parent_interest' | 'offer_open' | 'demo_complete' | 'musaidi_suggestion' | 'musaidi_correction' | 'musaidi_twin' | 'musaidi_revision';
/** Aggregate actions, not unique families. Never attach identity or authentication. */
export function recordPremiumEvent(event: PremiumEvent, grade?: PrimaryGrade): void {
  if (!['lock_open', 'parent_interest', 'offer_open', 'demo_complete', 'musaidi_suggestion', 'musaidi_correction', 'musaidi_twin', 'musaidi_revision'].includes(event)) return;
  const safeGrade = ['1AP','2AP','3AP','4AP','5AP'].includes(grade ?? '') ? grade : 'unknown';
  const payload = { event, grade: safeGrade, day: villageDay(new Date().toISOString()) };
  try {
    const key = 'mssid_premium_funnel_counts_v1';
    const counts = JSON.parse(localStorage.getItem(key) ?? '{}');
    counts[event] = Math.max(0, Number(counts[event]) || 0) + 1;
    localStorage.setItem(key, JSON.stringify(counts));
  } catch { /* The server counter does not depend on local storage. */ }
  // No retries: an ambiguous response must not count the same action twice.
  void fetch(SPRING_BOOT_BASE_URL.replace(/\/$/, '') + '/v1/analytics/premium-funnel', {
    method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true,
  }).catch(() => { /* Measurement never blocks the activity. */ });
}
