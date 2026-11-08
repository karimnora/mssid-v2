/**
 * useLevelProgress.ts
 * Hook partagé pour sauvegarder la progression par niveaux de chaque jeu.
 * Stockage : localStorage sous la clé "mssid_game_levels".
 */
import { useState, useEffect, useCallback } from 'react';

import { progressStorage, useProgressOwner } from '../../utils/ownerStorage';
import { getActiveProgressOwner } from '../../utils/progressOwner';

const STORAGE_KEY = 'mssid_game_levels';

interface GameProgress {
  /** Plus haut niveau débloqué (1-indexé). Commence à 1. */
  maxUnlocked: number;
  /** Étoiles gagnées par niveau (1-3). */
  stars: Record<number, number>;
}

type AllProgress = Record<string, GameProgress>;

function load(owner?: string): AllProgress {
  if (typeof window === 'undefined') return {};
  try {
    const value = JSON.parse(progressStorage(owner).getItem(STORAGE_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function save(data: AllProgress, owner: string) {
  try { progressStorage(owner).setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
}

export function useLevelProgress(gameId: string, totalLevels = 4) {
  const owner = useProgressOwner();
  const [snapshot, setSnapshot] = useState(() => ({ owner, data: load(owner) }));
  const all = snapshot.owner === owner ? snapshot.data : load(owner);
  const setAll = useCallback((update: (prev: AllProgress) => AllProgress) => {
    if (getActiveProgressOwner() !== owner) return;
    const data = update(load(owner));
    setSnapshot({ owner, data });
  }, [owner]);
  useEffect(() => { setSnapshot({ owner, data: load(owner) }); }, [owner]);

  const game: GameProgress = all[gameId] ?? { maxUnlocked: 1, stars: {} };
  const { maxUnlocked, stars } = game;

  /**
   * Appelé à la fin d'un niveau réussi.
   * @param level      Le niveau complété (1-indexé).
   * @param earnedStars Étoiles gagnées (1-3).
   */
  const completeLevel = useCallback((level: number, earnedStars: number) => {
    setAll(prev => {
      const g = prev[gameId] ?? { maxUnlocked: 1, stars: {} };
      const next: GameProgress = {
        maxUnlocked: Math.min(Math.max(g.maxUnlocked, level + 1), totalLevels),
        stars: {
          ...g.stars,
          [level]: Math.max(g.stars[level] ?? 0, earnedStars),
        },
      };
      const updated = { ...prev, [gameId]: next };
      save(updated, owner);
      return updated;
    });
  }, [gameId, totalLevels, owner, setAll]);

  /** Réinitialise la progression d'un jeu (debug / replay). */
  const resetProgress = useCallback(() => {
    setAll(prev => {
      const updated = { ...prev, [gameId]: { maxUnlocked: 1, stars: {} } };
      save(updated, owner);
      return updated;
    });
  }, [gameId, owner, setAll]);

  /** Étoiles totales gagnées dans ce jeu. */
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  return { maxUnlocked, stars, totalStars, completeLevel, resetProgress };
}
