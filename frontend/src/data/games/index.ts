import type { PrimaryGrade } from '../../types';
import type { GamePack, MazeCell } from './types';
import { GAME_PACKS_1AP } from './packs1ap';
import { GAME_PACKS_5AP } from './packs5ap';

export type { GamePack, GameRound, GameEngine, MazeCell } from './types';

/** Every learning-game pack, in the order they are shown. */
export const GAME_PACKS: GamePack[] = [...GAME_PACKS_1AP, ...GAME_PACKS_5AP];

export function packsForGrade(grade: PrimaryGrade): GamePack[] {
  return GAME_PACKS.filter((pack) => pack.grade === grade);
}

/** Packs with at least one round on this lesson (lesson page banner). */
export function packsForLesson(lessonId: string): GamePack[] {
  return GAME_PACKS.filter((pack) => pack.rounds.some((round) => round.lessonId === lessonId));
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
