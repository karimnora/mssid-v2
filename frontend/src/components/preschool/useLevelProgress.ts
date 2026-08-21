/**
 * useLevelProgress.ts
 * Hook partagé pour sauvegarder la progression par niveaux de chaque jeu.
 * Stockage : localStorage sous la clé "mssid_game_levels".
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mssid_game_levels';

interface GameProgress {
  /** Plus haut niveau débloqué (1-indexé). Commence à 1. */
  maxUnlocked: number;
  /** Étoiles gagnées par niveau (1-3). */
  stars: Record<number, number>;
}

type AllProgress = Record<string, GameProgress>;

function load(): AllProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(data: AllProgress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
}

export function useLevelProgress(gameId: string, totalLevels = 4) {
  const [all, setAll] = useState<AllProgress>(load);

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
      save(updated);
      return updated;
    });
  }, [gameId, totalLevels]);

  /** Réinitialise la progression d'un jeu (debug / replay). */
  const resetProgress = useCallback(() => {
    setAll(prev => {
      const updated = { ...prev, [gameId]: { maxUnlocked: 1, stars: {} } };
      save(updated);
      return updated;
    });
  }, [gameId]);

  /** Étoiles totales gagnées dans ce jeu. */
  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  return { maxUnlocked, stars, totalStars, completeLevel, resetProgress };
}
