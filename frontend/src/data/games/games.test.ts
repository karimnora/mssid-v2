import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { PRESCHOOL_MODULES } from '../preschool';
import { GAME_PACKS, canOpenPack, mazeIsSolvable, packsForGrade, packsForLesson } from './index';
import type { GameRound, MazeRound, MemoryRound } from './types';

/** « 3 × 4 », « 42 ÷ 7 », « 38 + 12 », « 5 × 3 + 2 » → their result (× and ÷ before + and −). */
function evaluate(t: string): number | null {
  if (!/^\d+(\s*[×÷+−-]\s*\d+)+$/.test(t)) return null;
  return t
    .replace(/\s/g, '')
    .split(/(?=[+−-])/)
    .reduce((total, part) => {
      const sign = part.startsWith('−') || part.startsWith('-') ? -1 : 1;
      const product = part
        .replace(/^[+−-]/, '')
        .split(/(?=[×÷])/)
        .reduce((p, f) => (f.startsWith('÷') ? p / Number(f.slice(1)) : p * Number(f.replace('×', ''))), 1);
      return total + sign * product;
    }, 0);
}

/** « 3/4 », « 0,75 », « 75% », « 3 × 4 » → their value (Algerian decimal comma). */
function valueOf(text: string): number {
  const t = text.trim();
  const sum = evaluate(t);
  if (sum !== null) return sum;
  const fraction = /^(\d+)\/(\d+)$/.exec(t);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  if (t.endsWith('%')) return Number(t.slice(0, -1).replace(',', '.')) / 100;
  return Number(t.replace(',', '.'));
}
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** The rule of each maths maze, checked against every stone. */
const MAZE_RULES: Record<string, (v: number) => boolean> = {
  'game-2ap-maze-hammadid/even': (v) => v % 2 === 0,
  'game-2ap-maze-hammadid/tens': (v) => v % 10 === 0,
  'game-2ap-maze-hammadid/fives': (v) => v % 5 === 0,
  'game-2ap-maze-hammadid/more-than-60': (v) => v > 60,
  'game-2ap-maze-hammadid/equals-12': (v) => v === 12,
  'game-2ap-maze-hammadid/three-hundreds': (v) => v >= 300 && v < 400,
  'game-2ap-maze-hammadid/makes-50': (v) => v === 50,
  'game-2ap-maze-hammadid/even-big': (v) => v % 2 === 0,
  'game-2ap-maze-hammadid/between-400-500': (v) => v > 400 && v < 500,
  'game-2ap-maze-hammadid/table-4-fog': (v) => v % 4 === 0 && v <= 40,
  'game-5ap-maze-timgad/greater-one': (v) => v > 1,
  'game-5ap-maze-timgad/half': (v) => same(v, 0.5),
  'game-5ap-maze-timgad/greater': (v) => v > 2.5,
  'game-5ap-maze-timgad/quarter': (v) => same(v, 0.25),
  'game-5ap-maze-timgad/three-quarters': (v) => same(v, 0.75),
  'game-5ap-maze-timgad/less-than': (v) => v < 0.6,
  'game-5ap-maze-timgad/two-fifths': (v) => same(v, 0.4),
  'game-5ap-maze-timgad/between-one-two': (v) => v > 1 && v < 2,
  'game-5ap-maze-timgad/one-and-half': (v) => same(v, 1.5),
  'game-5ap-maze-timgad/fog-final': (v) => v > 0.75 && v < 1,
};

/** How big a level's board is: pairs, cards to order, stones. */
function boardSize(round: GameRound): number {
  if (round.kind === 'memory') return round.pairs.length;
  if (round.kind === 'order') return round.cards.length;
  if (round.kind === 'maze') return round.grid.flat().length;
  return round.cards.length;
}

describe('Didou learning games content', () => {
  it('has unique ids, ten levels of the pack engine, and levels on real lessons of the grade', () => {
    expect(new Set(GAME_PACKS.map((p) => p.id)).size).toBe(GAME_PACKS.length);
    for (const pack of GAME_PACKS) {
      expect(pack.id, pack.id).toMatch(new RegExp(`^game-${pack.grade.toLowerCase()}-${pack.engine}-`));
      expect(pack.rounds, pack.id).toHaveLength(10);
      expect(new Set(pack.rounds.map((r) => r.id)).size, pack.id).toBe(10);
      expect(pack.recapAr.length, pack.id).toBeGreaterThan(0);
      for (const round of pack.rounds) {
        const at = `${pack.id}/${round.id}`;
        expect(round.kind, at).toBe(pack.engine);
        if (pack.grade === 'PRE') {
          // Preschool levels belong to a module of the preschool catalog.
          expect(PRESCHOOL_MODULES.some((m) => m.id === round.lessonId), at).toBe(true);
        } else {
          const lesson = COURSES_DATA.find((l) => l.id === round.lessonId);
          expect(lesson, at).toBeTruthy();
          expect(lesson!.grade, at).toBe(pack.grade);
          expect(lesson!.subject, at).toBe(pack.subject);
        }
        expect(round.sayAr && round.hintAr && round.successAr, at).toBeTruthy();
        expect(packsForLesson(round.lessonId), at).toContain(pack);
      }
    }
  });

  it('climbs in difficulty: only the first level is a warm-up, no board is smaller than it, the last one is the biggest', () => {
    for (const pack of GAME_PACKS) {
      expect(pack.rounds.map((r) => Boolean(r.easy)), pack.id).toEqual(pack.rounds.map((_, i) => i === 0));
      if (pack.engine === 'sort') continue; // sort grows by trickier words, not by more cards
      const sizes = pack.rounds.map(boardSize);
      for (let i = 1; i < sizes.length; i++) expect(sizes[i], `${pack.id} level ${i + 1}`).toBeGreaterThanOrEqual(sizes[0]);
      expect(sizes[sizes.length - 1], pack.id).toBe(Math.max(...sizes));
      expect(sizes[sizes.length - 1], pack.id).toBeGreaterThan(sizes[0]);
    }
  });

  it('reads every card aloud for young readers (preschool and 1AP), and only for them', () => {
    for (const pack of GAME_PACKS) expect(Boolean(pack.young), pack.id).toBe(pack.grade === '1AP' || pack.grade === 'PRE');
    for (const pack of GAME_PACKS.filter((p) => p.engine === 'memory' && p.subject !== 'math')) {
      for (const round of pack.rounds as MemoryRound[]) expect(round.mismatchAr, `${pack.id}/${round.id}`).toMatch(/\{va\}[\s\S]*\{vb\}/);
    }
  });

  it('opens exactly the first pack of each grade to free accounts', () => {
    const grades = new Set(GAME_PACKS.map((p) => p.grade));
    for (const grade of grades) {
      const packs = packsForGrade(grade);
      expect(packs.filter((p) => p.free).map((p) => p.id), grade).toEqual([packs[0].id]);
    }
    const premiumOnly = GAME_PACKS.find((p) => !p.free)!;
    expect(canOpenPack(premiumOnly, false)).toBe(false);
    expect(canOpenPack(premiumOnly, true)).toBe(true);
    expect(canOpenPack(GAME_PACKS.find((p) => p.free)!, false)).toBe(true);
  });

  it('memory: twins really are equal, and no two cards of a round look alike or share a value', () => {
    for (const pack of GAME_PACKS) {
      for (const round of pack.rounds.filter((r): r is MemoryRound => r.kind === 'memory')) {
        const at = `${pack.id}/${round.id}`;
        const texts = round.pairs.flatMap((p) => [p.a, p.b]);
        expect(new Set(texts).size, at).toBe(texts.length);
        expect(new Set(round.pairs.map((p) => p.valueAr)).size, at).toBe(round.pairs.length);
        for (const p of round.pairs) {
          expect(p.linkAr, `${at}/${p.id}`).toBeTruthy();
          if (pack.subject === 'math') expect(same(valueOf(p.a), valueOf(p.b)), `${at}/${p.id}`).toBe(true);
        }
        if (pack.subject === 'math') {
          const values = round.pairs.map((p) => valueOf(p.a));
          for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) expect(same(values[i], values[j]), at).toBe(false);
        }
      }
    }
  });

  it('sort: every card has a basket and its own explanation, every basket gets at least two cards', () => {
    for (const pack of GAME_PACKS) {
      for (const round of pack.rounds) {
        if (round.kind !== 'sort') continue;
        const at = `${pack.id}/${round.id}`;
        const bins = round.bins.map((b) => b.id);
        expect(new Set(round.cards.map((c) => c.textAr)).size, at).toBe(round.cards.length);
        for (const c of round.cards) expect(bins.includes(c.bin) && c.whyAr.length > 0, `${at}/${c.id}`).toBe(true);
        for (const b of bins) expect(round.cards.filter((c) => c.bin === b).length, `${at}/${b}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('order: one card per place, and the explanation names the card and its date', () => {
    for (const pack of GAME_PACKS) {
      for (const round of pack.rounds) {
        if (round.kind !== 'order') continue;
        const at = `${pack.id}/${round.id}`;
        expect(new Set(round.cards.map((c) => c.rank)).size, at).toBe(round.cards.length);
        expect(round.wrongAr, at).toContain('{card}');
        expect(round.wrongAr, at).toContain('{key}');
        for (const c of round.cards) expect(c.keyAr && c.emoji, `${at}/${c.id}`).toBeTruthy();
      }
    }
  });

  it('maze: rectangular grids with a path to the treasure, every wrong stone explained, stones true to the rule', () => {
    for (const pack of GAME_PACKS) {
      for (const round of pack.rounds.filter((r): r is MazeRound => r.kind === 'maze')) {
        const at = `${pack.id}/${round.id}`;
        const width = round.grid[0].length;
        for (const row of round.grid) expect(row.length, at).toBe(width);
        expect(mazeIsSolvable(round.grid), at).toBe(true);
        for (const cell of round.grid.flat()) if (!cell.ok) expect(cell.whyAr, `${at}/${cell.t}`).toBeTruthy();
        const rule = MAZE_RULES[at];
        // Primary maths mazes are made of numbers, checked one by one; preschool mazes are pictures.
        if (pack.subject === 'math' && pack.grade !== 'PRE') {
          expect(rule, `${at}: add its rule to MAZE_RULES`).toBeTruthy();
          for (const cell of round.grid.flat()) expect(rule(valueOf(cell.t)), `${at}/${cell.t}`).toBe(cell.ok);
        }
      }
    }
  });

  it('hides only expert mazes in fog: the last level of each maze pack', () => {
    for (const pack of GAME_PACKS.filter((p) => p.engine === 'maze')) {
      expect((pack.rounds as MazeRound[]).map((r) => Boolean(r.fog)), pack.id).toEqual(pack.rounds.map((_, i) => i === pack.rounds.length - 1));
    }
  });

  it('detects a maze with no way through', () => {
    const blocked = [
      [{ t: '1', ok: true as const }, { t: '2', ok: false as const, whyAr: 'x' }],
      [{ t: '3', ok: false as const, whyAr: 'x' }, { t: '4', ok: true as const }],
    ];
    expect(mazeIsSolvable(blocked)).toBe(false);
  });
});
