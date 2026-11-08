import type { PrimaryGrade } from '../types';
export interface MusaidiHelpCount { lessonId: string; competenceId?: string; grade: PrimaryGrade; count: number; lastAt: string }
const key = (owner: string) => `mssid_musaidi_help_v1:${owner}`;
export function readMusaidiHelp(owner: string): MusaidiHelpCount[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key(owner)) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r): r is MusaidiHelpCount => !!r && typeof r.lessonId === 'string' && ['1AP','2AP','3AP','4AP','5AP'].includes(r.grade) && Number.isSafeInteger(r.count) && r.count > 0 && typeof r.lastAt === 'string' && (r.competenceId === undefined || typeof r.competenceId === 'string'));
  } catch { return []; }
}
/** One request per question opening, recorded by the UI on its first explicit help action. */
export function recordMusaidiHelp(owner: string, entry: Omit<MusaidiHelpCount, 'count' | 'lastAt'>) {
  const rows = readMusaidiHelp(owner);
  const existing = rows.find(r => r.lessonId === entry.lessonId && r.competenceId === entry.competenceId && r.grade === entry.grade);
  if (existing) { existing.count += 1; existing.lastAt = new Date().toISOString(); }
  else rows.push({...entry, count:1, lastAt:new Date().toISOString()});
  try { localStorage.setItem(key(owner), JSON.stringify(rows.slice(-200))); } catch { /* Private mode: no invented count. */ }
}
