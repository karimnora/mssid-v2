/**
 * usePreschoolBadges.ts
 * Évalue les critères des badges maternelle et notifie les nouvelles récompenses.
 * Stockage : localStorage sous "mssid_preschool_badges".
 */
import { useState, useEffect, useMemo } from 'react';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PRESCHOOL_BADGES, PreschoolBadge, PreschoolBadgeCriteria } from '../../data/preschool/preschoolBadgesData';

const STORAGE_KEY = 'mssid_preschool_badges';

export interface PreschoolBadgeState {
  completedActivityIds: string[];
  completedByModule: Record<string, number>;
  streak: number;
}

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

function saveUnlocked(ids: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); } catch {}
}

function evaluate(criteria: PreschoolBadgeCriteria, state: PreschoolBadgeState): boolean {
  switch (criteria.type) {
    case 'activities_count':
      return state.completedActivityIds.length >= criteria.count;

    case 'module_complete': {
      const mod = PRESCHOOL_MODULES.find(m => m.id === criteria.moduleId);
      if (!mod) return false;
      return (state.completedByModule[criteria.moduleId] ?? 0) >= mod.activities.length;
    }

    case 'modules_count': {
      const fullyDone = PRESCHOOL_MODULES.filter(
        m => (state.completedByModule[m.id] ?? 0) >= m.activities.length,
      ).length;
      return fullyDone >= criteria.count;
    }

    case 'streak_days':
      return state.streak >= criteria.days;
  }
}

export function usePreschoolBadges(state: PreschoolBadgeState) {
  const [unlocked, setUnlocked] = useState<Set<string>>(loadUnlocked);
  const [queue, setQueue] = useState<PreschoolBadge[]>([]);

  // Stable key to avoid re-runs on identity change (Object.values order is spec-stable)
  const moduleKey = useMemo(
    () => JSON.stringify(state.completedByModule),
    [state.completedByModule],
  );

  useEffect(() => {
    const newOnes: PreschoolBadge[] = [];

    for (const badge of PRESCHOOL_BADGES) {
      if (unlocked.has(badge.id)) continue;
      if (evaluate(badge.criteria, state)) {
        newOnes.push(badge);
      }
    }

    if (newOnes.length > 0) {
      const next = new Set([...unlocked, ...newOnes.map(b => b.id)]);
      setUnlocked(next);
      setQueue(prev => [...prev, ...newOnes]);
      saveUnlocked(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completedActivityIds.length, state.streak, moduleKey]);

  const dismissBadge = () => setQueue(prev => prev.slice(1));

  return {
    queue,
    dismissBadge,
    unlockedIds: unlocked,
    totalUnlocked: unlocked.size,
  };
}
