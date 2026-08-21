/**
 * useDailyChallenge.ts
 * Sélectionne 3 activités-défi chaque jour de façon déterministe (hash de la date),
 * suit la progression + le streak en localStorage, et détecte automatiquement les
 * complétions en observant completedActivityIds.
 */
import { useState, useEffect, useMemo } from 'react';
import { PreschoolModule, PreschoolActivity, PreschoolLanguage } from '../data/preschool/types';

const STORAGE_KEY = 'mssid_daily_challenge';

export interface ChallengeItem {
  moduleId: string;
  activityId: string;
  module: PreschoolModule;
  activity: PreschoolActivity;
}

interface StoredChallenge {
  date: string;              // 'YYYY-MM-DD' du défi courant
  completedIds: string[];    // IDs d'activités complétées pour CE défi
  lastDoneDate: string | null; // Dernière date où le défi a été ENTIÈREMENT terminé
  streak: number;            // Jours consécutifs
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// LCG pseudo-random with seed
function lcgNext(seed: number): number {
  return ((seed * 1664525 + 1013904223) & 0x7fffffff) >>> 0;
}

function hashDate(date: string): number {
  return date.split('').reduce((acc, c, i) => ((acc * 31 + c.charCodeAt(0) * (i + 1)) | 0) >>> 0, 7);
}

// Modules considérés pour les défis quotidiens (pas les jeux arcade)
const CHALLENGE_MODULE_IDS = [
  'preschool-letters',
  'preschool-numbers',
  'preschool-shapes',
  'preschool-colors',
  'preschool-animals',
  'preschool-body',
  'preschool-seasons',
  'preschool-food',
  'preschool-family',
  'preschool-algeria',
  'preschool-sequences',
];

function pickDailyChallenges(dateStr: string, allModules: PreschoolModule[]): ChallengeItem[] {
  const pool = allModules.filter(m => CHALLENGE_MODULE_IDS.includes(m.id) && m.activities.length > 0);
  if (pool.length === 0) return [];

  const result: ChallengeItem[] = [];
  const usedModules = new Set<string>();
  let seed = hashDate(dateStr);

  for (let attempt = 0; result.length < 3 && attempt < 60; attempt++) {
    seed = lcgNext(seed);
    const mod = pool[seed % pool.length];
    if (usedModules.has(mod.id)) continue;
    usedModules.add(mod.id);
    seed = lcgNext(seed);
    const act = mod.activities[seed % mod.activities.length];
    result.push({ moduleId: mod.id, activityId: act.id, module: mod, activity: act });
  }
  return result;
}

function loadStored(): StoredChallenge {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredChallenge;
      // New day → reset completions but keep streak
      if (parsed.date !== today()) {
        return { ...parsed, date: today(), completedIds: [] };
      }
      return parsed;
    }
  } catch {}
  return { date: today(), completedIds: [], lastDoneDate: null, streak: 0 };
}

function saveStored(s: StoredChallenge) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export function useDailyChallenge(
  allModules: PreschoolModule[],
  completedActivityIds: string[],
  language: PreschoolLanguage,
) {
  const [stored, setStored] = useState<StoredChallenge>(loadStored);
  const todayStr = today();

  const challengeItems = useMemo(
    () => pickDailyChallenges(todayStr, allModules),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayStr], // allModules is stable (module-level constant)
  );

  // Auto-detect completions by watching completedActivityIds
  useEffect(() => {
    if (challengeItems.length === 0) return;

    const newlyDone = challengeItems
      .map(i => i.activityId)
      .filter(id => completedActivityIds.includes(id) && !stored.completedIds.includes(id));

    if (newlyDone.length === 0) return;

    const merged = [...stored.completedIds, ...newlyDone];
    const allDone = challengeItems.every(i => merged.includes(i.activityId));

    let next = { ...stored, completedIds: merged };

    if (allDone && stored.lastDoneDate !== todayStr) {
      const newStreak = stored.lastDoneDate === yesterday() ? stored.streak + 1 : 1;
      next = { ...next, lastDoneDate: todayStr, streak: newStreak };
    }

    setStored(next);
    saveStored(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedActivityIds]);

  const completedToday = challengeItems.filter(i => stored.completedIds.includes(i.activityId)).length;

  const getLabel = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const nextIncompleteItem = challengeItems.find(i => !stored.completedIds.includes(i.activityId)) ?? null;

  return {
    challengeItems,
    completedIds: stored.completedIds,
    streak: stored.streak,
    completedToday,
    challengeComplete: completedToday === challengeItems.length && challengeItems.length > 0,
    nextIncompleteItem,
    getLabel,
  };
}
