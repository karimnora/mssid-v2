import { progressStorage } from './ownerStorage';
// Client-side "objectif du jour" (daily objective) tracker.
// Simple and local-only by design: counts exercises/quizzes completed today, resetting at midnight.
// Not a substitute for server-authoritative gamification (see Phase 7 report — streak/XP validation
// remains client-trusted end to end and is flagged as follow-up work).

const STORAGE_KEY = 'mssid_daily_objective';
export const DAILY_OBJECTIVE_TARGET = 3;

interface DailyObjectiveState {
  date: string; // YYYY-MM-DD
  count: number;
}

const todayKey = (): string => new Date().toISOString().slice(0, 10);

const readState = (): DailyObjectiveState => {
  if (typeof window === 'undefined') return { date: todayKey(), count: 0 };
  try {
    const raw = progressStorage().getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyObjectiveState;
      if (parsed.date === todayKey()) return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return { date: todayKey(), count: 0 };
};

export const getDailyObjectiveProgress = (): DailyObjectiveState => readState();

export const incrementDailyObjective = (): DailyObjectiveState => {
  const state = readState();
  const next = { date: todayKey(), count: state.count + 1 };
  if (typeof window !== 'undefined') {
    progressStorage().setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
};
