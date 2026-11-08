import { getActiveProgressOwner } from './progressOwner';
import { ownerStorageKey } from './ownerStorage';

const CLAIMS = 'mssid_legacy_progress_claims_v1';
const scopedKeys = ['mssid_game_levels', 'mssid_learning_games_v1', 'mssid_missions_v1', 'mssid_discovered_wilayas', 'mssid_completed_expeditions', 'mssid_daily_objective', 'mssid.cemRewarded'];
const bucketKeys = ['mssid_quiz_first_awards', 'mssid_quiz_game_xp', 'mssid_quiz_revision_day', 'mssid_last_activity'];
export interface LegacyProgressItem { key: string; value: unknown; bucket: boolean }
function read(key: string): unknown {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function listLegacyProgress(): LegacyProgressItem[] {
  try {
    const claims = read(CLAIMS);
    return [...scopedKeys, ...bucketKeys].flatMap(key => {
      const claim = record(claims) ? claims[key] : undefined;
      if (record(claim) && (claim.applied || claim.owner !== getActiveProgressOwner())) return [];
      const raw = read(key);
      const bucket = bucketKeys.includes(key);
      const value = record(claim) ? claim.original : bucket && record(raw) && raw['legacy-unassigned'] ? raw['legacy-unassigned'] : raw;
      if (!value || (record(value) && !Object.keys(value).length)) return [];
      if (bucket && record(value) && Object.keys(value).some(k => k === 'guest' || k.startsWith('user:'))) return [];
      return [{ key, value, bucket }];
    });
  } catch { return []; }
}
/** Parent-selected transfer only, into an empty destination. Never awards XP or overwrites progress. */
export function recoverLegacyProgress(key: string, owner: string): boolean {
  if (owner !== getActiveProgressOwner()) return false;
  try {
    const item = listLegacyProgress().find(entry => entry.key === key);
    if (!item) return false;
    const target = item.bucket ? key : ownerStorageKey(key, owner);
    const current = read(target);
    if (item.bucket ? record(current) && current[owner] != null : current != null) return false;
    const claims = read(CLAIMS);
    // Claim first: a failed destination write must never allow assignment to a different child.
    localStorage.setItem(CLAIMS, JSON.stringify({ ...(record(claims) ? claims : {}), [key]: { owner, applied: false, savedAt: new Date().toISOString(), original: item.value } }));
    if (item.bucket) {
      const scoped = record(current) && current['legacy-unassigned'] ? current : { 'legacy-unassigned': item.value };
      localStorage.setItem(target, JSON.stringify({ ...scoped, [owner]: item.value }));
    } else localStorage.setItem(target, JSON.stringify(item.value));
    const claimed = read(CLAIMS);
    if (record(claimed) && record(claimed[key])) {
      claimed[key].applied = true;
      localStorage.setItem(CLAIMS, JSON.stringify(claimed));
    }
    return true;
  } catch { return false; }
}
