/**
 * usePreschoolBadges.ts
 * Évalue les critères des badges maternelle et notifie les nouvelles récompenses.
 * Stockage : localStorage sous "mssid_preschool_badges".
 */
import { useState, useEffect, useMemo } from 'react';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PRESCHOOL_BADGES, PreschoolBadge, PreschoolBadgeCriteria } from '../../data/preschool/preschoolBadgesData';
import { badgeStorageKey, GUEST_OWNER_ID, LEGACY_BADGES_KEY } from './preschoolProgress';

export interface PreschoolBadgeState {
  ownerId: string;
  completedActivityIds: string[];
  completedByModule: Record<string, number>;
  streak: number;
}

function loadUnlocked(ownerId: string): Set<string> {
  try {
    const key = badgeStorageKey(ownerId);
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw) as string[]);
    if (ownerId === GUEST_OWNER_ID) {
      const legacy = localStorage.getItem(LEGACY_BADGES_KEY);
      if (legacy) {
        localStorage.setItem(key, legacy);
        return new Set(JSON.parse(legacy) as string[]);
      }
    }
    return new Set();
  } catch { return new Set(); }
}

function saveUnlocked(ownerId: string, ids: Set<string>) {
  try { localStorage.setItem(badgeStorageKey(ownerId), JSON.stringify([...ids])); } catch {}
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
  const [unlocked, setUnlocked] = useState<Set<string>>(() => loadUnlocked(state.ownerId));
  const [queue, setQueue] = useState<PreschoolBadge[]>([]);

  useEffect(() => {
    setUnlocked(loadUnlocked(state.ownerId));
    setQueue([]);
  }, [state.ownerId]);

  // Stable key to avoid re-runs on identity change (Object.values order is spec-stable)
  const moduleKey = useMemo(
    () => JSON.stringify(state.completedByModule),
    [state.completedByModule],
  );

  useEffect(() => {
    // Read this owner's snapshot, never the previous render's owner state.
    const ownerUnlocked = loadUnlocked(state.ownerId);
    const newOnes: PreschoolBadge[] = [];

    for (const badge of PRESCHOOL_BADGES) {
      if (ownerUnlocked.has(badge.id)) continue;
      if (evaluate(badge.criteria, state)) {
        newOnes.push(badge);
      }
    }

    if (newOnes.length > 0) {
      const next = new Set([...ownerUnlocked, ...newOnes.map(b => b.id)]);
      setUnlocked(next);
      setQueue(prev => [...prev, ...newOnes]);
      saveUnlocked(state.ownerId, next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ownerId, state.completedActivityIds.length, state.streak, moduleKey]);

  const dismissBadge = () => setQueue(prev => prev.slice(1));

  return {
    queue,
    dismissBadge,
    unlockedIds: unlocked,
    totalUnlocked: unlocked.size,
  };
}
