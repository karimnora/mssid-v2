import type { FractionObservations } from '../components/lessonViewer/fractionJourneyContent';
import type { PrimaryGrade, UserProfile } from '../types';
export interface VillageSessionSummary {
  id: string;
  title: string;
  grade: PrimaryGrade;
  learn: FractionObservations;
  transfer: FractionObservations;
  examples?: string[];
  alone: number;
  helped: number;
  needs: number;
  quizCorrect: number;
  quizTotal: number;
  next: 'interactive' | 'practice' | 'quiz';
}

export interface VillageSummaryEntry {
  at: string;
  lessonId: string;
  villageSummary: VillageSessionSummary;
}
export const MAX_VILLAGE_SUMMARIES = 6;
export function villageDay(at: string): string {
  const date = new Date(at);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('sv-SE', { timeZone: 'Africa/Algiers' });
}
/** Separate bounded observations; one latest summary per lesson and Algerian calendar day. */
export function mergeVillageSummaries(...groups: ReadonlyArray<ReadonlyArray<VillageSummaryEntry>>): VillageSummaryEntry[] {
  const latest = new Map<string, VillageSummaryEntry>();
  for (const group of groups) for (const entry of group) {
    if (!entry?.villageSummary || !entry.lessonId || !villageDay(entry.at)) continue;
    const key = entry.lessonId + ':' + villageDay(entry.at);
    const previous = latest.get(key);
    if (!previous || Date.parse(entry.at) >= Date.parse(previous.at)) latest.set(key, entry);
  }
  const result = [...latest.values()].sort((a, b) => Date.parse(a.at) - Date.parse(b.at)).slice(-MAX_VILLAGE_SUMMARIES);
  return groups.find(group => JSON.stringify(group) === JSON.stringify(result)) as VillageSummaryEntry[] | undefined ?? result;
}
/** Upgrade existing local or remote saves without consuming any scored-history slot. */
export function separateVillageHistory(profile: {
  lessonSessions?: UserProfile['lessonSessions'];
  villageSummaries?: VillageSummaryEntry[];
}) {
  const sessions = profile.lessonSessions ?? [];
  const legacy = sessions.flatMap(s => s.villageSummary ? [{ at: s.at, lessonId: s.lessonId, villageSummary: s.villageSummary }] : []);
  return {
    lessonSessions: legacy.length ? sessions.filter(s => !s.villageSummary) : sessions,
    villageSummaries: mergeVillageSummaries(profile.villageSummaries ?? [], legacy),
  };
}
