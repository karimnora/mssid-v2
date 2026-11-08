import type { UserProfile } from '../types';
import type { MusaidiItem } from '../data/musaidiBank';
import { getCompetence, getLessonCompetences } from '../data/competences';

export interface MusaidiSuggestion { item: MusaidiItem; reasonAr: string; reasonFr: string }
/** Current unresolved misses, or a last failure within 30 days. No diagnosis from missing data. */
export function musaidiSuggestions(bank: MusaidiItem[], stats: UserProfile['competenceStats'], now = new Date(), limit = 3): MusaidiSuggestion[] {
  const result: MusaidiSuggestion[] = [];
  const entries = Object.entries(stats ?? {}).filter(([id, stat]) => {
    const competence = getCompetence(id);
    const age = now.getTime() - Date.parse(stat.lastAt);
    return competence && stat.attempts > 0 && ((stat.missedExerciseIds?.length ?? 0) > 0 || (stat.lastOutcome === 'fail' && age >= 0 && age <= 30 * 86400000));
  }).sort((a,b) => Date.parse(b[1].lastAt) - Date.parse(a[1].lastAt));
  for (const [id, stat] of entries) {
    const competence = getCompetence(id)!;
    const candidates = bank.filter(item => item.competenceId === id || (!item.competenceId && stat.missedExerciseIds?.includes(item.sourceId ?? '') && getLessonCompetences(item.lessonId).some(c => c.id === id)));
    candidates.sort((a,b) => Number(stat.missedExerciseIds?.includes(b.sourceId ?? '')) - Number(stat.missedExerciseIds?.includes(a.sourceId ?? '')));
    for (const item of candidates) {
      if (result.some(s => s.item.id === item.id)) continue;
      result.push({item, reasonAr: `لأنك أخطأت في: ${competence.labelAr}`, reasonFr: `Une erreur à retravailler : ${competence.labelFr}`});
      if (result.length >= limit) return result;
    }
  }
  return result;
}
