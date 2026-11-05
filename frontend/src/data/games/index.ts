import type { GameGrade, GamePack, MazeCell } from './types';
import { GAME_PACKS_PRE } from './packsPre';
import { GAME_PACKS_1AP } from './packs1ap';
import { GAME_PACKS_2AP } from './packs2ap';
import { GAME_PACKS_3AP } from './packs3ap';
import { GAME_PACKS_4AP } from './packs4ap';
import { GAME_PACKS_5AP } from './packs5ap';

export type { GamePack, GameRound, GameEngine, GameGrade, MazeCell } from './types';

/** Every learning-game pack, in the order they are shown. */
export const GAME_PACKS: GamePack[] = [...GAME_PACKS_PRE, ...GAME_PACKS_1AP, ...GAME_PACKS_2AP, ...GAME_PACKS_3AP, ...GAME_PACKS_4AP, ...GAME_PACKS_5AP];

export function packsForGrade(grade: GameGrade): GamePack[] {
  return GAME_PACKS.filter((pack) => pack.grade === grade);
}

/** Packs with at least one round on this lesson (lesson page banner). */
export function packsForLesson(lessonId: string): GamePack[] {
  return GAME_PACKS.filter((pack) => pack.rounds.some((round) => round.lessonId === lessonId));
}

export interface GameStationPlacement {
  pack: GamePack;
  worldIndex: number;
}

/**
 * Where the grade's games sit on Didou's journey map, one station per pack, never two in one world.
 * The free pack goes in the first world, so every account meets it early. Each other pack goes to
 * the world whose three lessons it reviews the most (ties: the earlier world), else to the first
 * world still without a game. Game stations are bonus stops: they never lock the lesson path.
 */
export function gameStationsForJourney(grade: GameGrade, worldLessonIds: ReadonlyArray<readonly string[]>): GameStationPlacement[] {
  if (!worldLessonIds.length) return [];
  const packs = packsForGrade(grade);
  const taken = new Set<number>();
  const placed: GameStationPlacement[] = [];
  const free = packs.find((p) => p.free);
  if (free) {
    placed.push({ pack: free, worldIndex: 0 });
    taken.add(0);
  }
  for (const pack of packs) {
    if (pack === free) continue;
    const lessons = new Set(pack.rounds.map((r) => r.lessonId));
    let best = -1;
    let bestHits = 0;
    worldLessonIds.forEach((ids, k) => {
      const hits = ids.filter((id) => lessons.has(id)).length;
      if (!taken.has(k) && hits > bestHits) {
        best = k;
        bestHits = hits;
      }
    });
    if (best === -1) best = worldLessonIds.findIndex((_, k) => !taken.has(k));
    if (best === -1) break;
    taken.add(best);
    placed.push({ pack, worldIndex: best });
  }
  return placed.sort((a, b) => a.worldIndex - b.worldIndex);
}

/** Free accounts: the pack flagged `free`, one per grade (checked by a test). */
export function canOpenPack(pack: GamePack, premium: boolean): boolean {
  return premium || Boolean(pack.free);
}

/** Orthogonal neighbours inside the grid. */
export function mazeNeighbours(grid: MazeCell[][], r: number, c: number): [number, number][] {
  return ([[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]] as [number, number][]).filter(
    ([y, x]) => y >= 0 && y < grid.length && x >= 0 && x < grid[y].length,
  );
}

/** True when the treasure (last cell) can be reached from [0][0] walking only on `ok` stones. */
export function mazeIsSolvable(grid: MazeCell[][]): boolean {
  const goalR = grid.length - 1;
  const goalC = grid[goalR].length - 1;
  if (!grid[0][0].ok || !grid[goalR][goalC].ok) return false;
  const seen = new Set(['0,0']);
  const queue: [number, number][] = [[0, 0]];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === goalR && c === goalC) return true;
    for (const [y, x] of mazeNeighbours(grid, r, c)) {
      const key = `${y},${x}`;
      if (!seen.has(key) && grid[y][x].ok) {
        seen.add(key);
        queue.push([y, x]);
      }
    }
  }
  return false;
}
