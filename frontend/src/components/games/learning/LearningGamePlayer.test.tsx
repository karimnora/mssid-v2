import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));
vi.mock('../../../utils/immersiveFeedback', () => ({ playPop: vi.fn(), playSoftMiss: vi.fn(), playSoftSuccess: vi.fn() }));
vi.mock('../../../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar', direction: 'rtl' }) }));

import { LearningGamePlayer, starsForMisses, suggestedLevel, tierIndex } from './LearningGamePlayer';
import { recordLevel } from './LearningGameEntry';
import { PEEK_MS } from './boards';
import { GAME_PACKS_5AP } from '../../../data/games/packs5ap';
import { GAME_PACKS_PRE } from '../../../data/games/packsPre';
import type { MazeRound, MemoryRound, OrderRound, SortRound } from '../../../data/games/types';

const pack = (id: string) => GAME_PACKS_5AP.find((p) => p.id === id)!;
const levelOf = (packId: string, roundId: string) => pack(packId).rounds.findIndex((r) => r.id === roundId);
const nextButton = () => document.querySelector('[data-lg-next]') as HTMLButtonElement;
const step = (kind: string) => waitFor(() => expect(document.querySelector(`[data-lg-step="${kind}"]`)).toBeTruthy());
const click = (selector: string) => fireEvent.click(document.querySelector(selector)!);

describe('LearningGamePlayer', () => {
  it('opens on the map of five open levels and starts any level, not only the first', async () => {
    const plurals = pack('game-5ap-sort-plurals');
    render(<LearningGamePlayer pack={plurals} onExit={vi.fn()} />);
    await step('map');
    expect(document.querySelectorAll('[data-lg-level]')).toHaveLength(plurals.rounds.length);
    expect(plurals.rounds.length).toBeGreaterThan(8);
    expect(document.querySelector(`[data-lg-level="${plurals.rounds.length - 1}"]`)!.hasAttribute('data-boss')).toBe(true);
    expect(document.querySelector('[data-lg-level="0"]')!.getAttribute('data-state')).toBe('now');

    const last = plurals.rounds.length - 1;
    click(`[data-lg-level="${last}"]`); // straight to the final level
    await step('sort');
    expect(screen.getByText(plurals.rounds[last].titleAr)).toBeTruthy();
  });

  it('sort: explains a wrong shelf, reports it once, then gives the stars of the level', async () => {
    const plurals = pack('game-5ap-sort-plurals');
    const level = levelOf(plurals.id, 'three-plurals');
    const round = plurals.rounds[level] as SortRound;
    const onResult = vi.fn();
    const onLevelSolved = vi.fn();
    render(<LearningGamePlayer pack={plurals} onExit={vi.fn()} onResult={onResult} onLevelSolved={onLevelSolved} />);
    click(`[data-lg-level="${level}"]`);
    await step('sort');
    expect(nextButton().hasAttribute('data-lg-skip')).toBe(true);

    const kutub = round.cards.find((c) => c.id === 'kutub')!;
    click('[data-lg-sort-card="kutub"]');
    click('[data-lg-bin="masc"]');
    expect(screen.getByText(kutub.whyAr)).toBeTruthy();
    expect(onResult).toHaveBeenLastCalledWith('arabic-5ap-jam-taksir', { outcome: 'fail', exerciseId: 'game-5ap-sort-plurals:three-plurals' });

    for (const card of round.cards) {
      click(`[data-lg-sort-card="${card.id}"]`);
      click(`[data-lg-bin="${card.bin}"]`);
    }
    await waitFor(() => expect(document.querySelector('[data-lg-clear]')).toBeTruthy());
    expect(document.querySelector('[data-lg-clear]')!.getAttribute('data-lg-clear')).toBe('3'); // one slip still earns 3 stars
    expect(nextButton().hasAttribute('data-lg-skip')).toBe(false);
    expect(onResult).toHaveBeenLastCalledWith('arabic-5ap-jam-taksir', { outcome: 'success', helped: true, exerciseId: 'game-5ap-sort-plurals:three-plurals' });
    expect(onResult).toHaveBeenCalledTimes(2);
    expect(onLevelSolved).toHaveBeenCalledWith('three-plurals', 3);
  });

  it('skips an unfinished level without reporting anything, up to the memo card', async () => {
    const history = pack('game-5ap-order-history');
    const onResult = vi.fn();
    const beforeLast = history.rounds.length - 2;
    render(<LearningGamePlayer pack={history} onExit={vi.fn()} onResult={onResult} startLevel={beforeLast} />);
    await step('order');
    expect(screen.getByText(history.rounds[beforeLast].titleAr)).toBeTruthy();

    fireEvent.click(nextButton()); // skip the level before last
    await waitFor(() => expect(screen.getByText(history.rounds[beforeLast + 1].titleAr)).toBeTruthy());
    expect(screen.getByText(/تَخَطَّيْنَا المُسْتَوَى/)).toBeTruthy();

    fireEvent.click(nextButton()); // skip the last level
    await step('recap');
    expect(onResult).not.toHaveBeenCalled();
    expect(document.querySelectorAll('[data-lg-recap-level]')).toHaveLength(history.rounds.length);
  });

  it('order: the warm-up shows the dates, a card tapped too early is explained, the right order fills the line', async () => {
    const history = pack('game-5ap-order-history');
    const round = history.rounds[0] as OrderRound;
    render(<LearningGamePlayer pack={history} onExit={vi.fn()} />);
    fireEvent.click(nextButton()); // map → suggested level 1
    await step('order');
    expect(document.querySelectorAll('.lg-event .lg-date')).toHaveLength(round.cards.length);

    click('[data-lg-order-card="independence"]');
    expect(screen.getByText(/فِي 5 جُويْلِيَةَ 1962، وَمَا زَالَ هُنَاكَ حَدَثٌ أَقْدَمُ/)).toBeTruthy();

    for (const card of [...round.cards].sort((a, b) => a.rank - b.rank)) click(`[data-lg-order-card="${card.id}"]`);
    expect(document.querySelectorAll('.lg-slot.filled')).toHaveLength(round.cards.length);
    await waitFor(() => expect(document.querySelector('[data-lg-clear]')).toBeTruthy());
  });

  it('maze: a wrong stone is explained, a stone too far is only a nudge, the path reaches the treasure', async () => {
    const timgad = pack('game-5ap-maze-timgad');
    const level = levelOf(timgad.id, 'half');
    const round = timgad.rounds[level] as MazeRound;
    const onResult = vi.fn();
    render(<LearningGamePlayer pack={timgad} onExit={vi.fn()} onResult={onResult} />);
    click(`[data-lg-level="${level}"]`);
    await step('maze');

    click('[data-lg-cell="4,0"]'); // far away: nudge, not a mistake
    expect(onResult).not.toHaveBeenCalled();

    click('[data-lg-cell="1,0"]'); // 0,05 — wrong stone next to Didou
    const wrong = round.grid[1][0];
    expect(wrong.ok).toBe(false);
    expect(screen.getByText(wrong.whyAr!)).toBeTruthy();
    expect(onResult).toHaveBeenCalledWith('math-5ap-fractions', { outcome: 'fail', exerciseId: 'game-5ap-maze-timgad:half' });

    for (const key of ['0,1', '1,1', '2,1', '2,2', '2,3', '3,3', '4,3', '4,4']) click(`[data-lg-cell="${key}"]`);
    await waitFor(() => expect(document.querySelector('[data-lg-clear]')).toBeTruthy());
    expect(onResult).toHaveBeenLastCalledWith('math-5ap-fractions', { outcome: 'success', helped: true, exerciseId: 'game-5ap-maze-timgad:half' });
  });

  it('memory: the warm-up shows every card first, then twins stay face up with their explanation', async () => {
    vi.useFakeTimers();
    try {
      const market = pack('game-5ap-memory-fractions');
      const round = market.rounds[0] as MemoryRound;
      render(<LearningGamePlayer pack={market} onExit={vi.fn()} startLevel={0} />); // no map → level transition under fake timers
      expect(document.querySelector('[data-lg-peek]')).toBeTruthy();
      expect(document.querySelectorAll('[data-lg-card][data-state="up"]')).toHaveLength(round.pairs.length * 2);

      click('[data-lg-card="half-a"]'); // ignored while peeking
      expect(document.querySelector('[data-lg-card="half-a"]')!.getAttribute('data-state')).toBe('up');

      await act(async () => { vi.advanceTimersByTime(PEEK_MS + 50); });
      expect(document.querySelectorAll('[data-lg-card][data-state="down"]')).toHaveLength(round.pairs.length * 2);

      click('[data-lg-card="half-a"]');
      click('[data-lg-card="half-b"]');
      await act(async () => { vi.advanceTimersByTime(500); });
      expect(document.querySelector('[data-lg-card="half-a"]')!.getAttribute('data-state')).toBe('matched');
      expect(screen.getByText(/1\/2 يَعْنِي 1 ÷ 2/)).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });

  it('maze fog: far stones are clouds, and they clear as Didou walks', async () => {
    const timgad = pack('game-5ap-maze-timgad');
    const level = timgad.rounds.length - 1;
    const round = timgad.rounds[level] as MazeRound;
    expect(round.fog).toBe(true);
    render(<LearningGamePlayer pack={timgad} onExit={vi.fn()} startLevel={level} />);
    await step('maze');
    expect(document.querySelector('[data-lg-cell="1,0"]')!.getAttribute('data-state')).toBe('reachable');
    expect(document.querySelector('[data-lg-cell="2,0"]')!.getAttribute('data-state')).toBe('fog');
    click('[data-lg-cell="1,0"]'); // 4/5: right stone, its neighbours come out of the fog
    expect(document.querySelector('[data-lg-cell="2,0"]')!.getAttribute('data-state')).not.toBe('fog');
    expect(document.querySelector(`[data-lg-cell="${round.grid.length - 1},${round.grid[0].length - 1}"]`)!.getAttribute('data-state')).not.toBe('fog');
  });

  it('preschool: every tapped picture is read aloud by its name, and no emoji ever reaches the voice', async () => {
    const speech = await import('../../../utils/speech');
    const farm = GAME_PACKS_PRE.find((p) => p.id === 'game-pre-memory-farm')!;
    const level = farm.rounds.findIndex((r) => r.id === 'three-animals');
    render(<LearningGamePlayer pack={farm} onExit={vi.fn()} startLevel={level} />);
    await step('memory');
    expect(document.querySelector('.lg-player')!.classList.contains('lg-pre')).toBe(true);
    vi.mocked(speech.speakText).mockClear();
    click('[data-lg-card="goat-a"]');
    expect(speech.speakText).toHaveBeenCalledWith('المَاعِزُ', 'ar-SA');
    for (const [text] of vi.mocked(speech.speakText).mock.calls) expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('spreads ten levels over the five difficulty tiers, two levels each', () => {
    expect(Array.from({ length: 10 }, (_, i) => tierIndex(i, 10))).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
    expect(Array.from({ length: 5 }, (_, i) => tierIndex(i, 5))).toEqual([0, 1, 2, 3, 4]);
  });

  it('gives a level 3 stars up to 1 mistake, 2 up to 3, then 1', () => {
    expect([0, 1, 2, 3, 4, 20].map(starsForMisses)).toEqual([3, 3, 2, 2, 1, 1]);
  });

  it('suggests the first unsolved level, then the first one without 3 stars', () => {
    const market = pack('game-5ap-memory-fractions');
    const ids = market.rounds.map((r) => r.id);
    expect(suggestedLevel(market, {})).toBe(0);
    expect(suggestedLevel(market, { [ids[0]]: 3, [ids[2]]: 1 })).toBe(1);
    expect(suggestedLevel(market, Object.fromEntries(ids.map((id, i) => [id, i === 3 ? 2 : 3])))).toBe(3);
  });

  it('gives the pack XP once, when every level has been solved (old lot-1 progress never pays twice)', () => {
    const market = pack('game-5ap-memory-fractions');
    let progress = undefined as Parameters<typeof recordLevel>[1];
    const paid: boolean[] = [];
    for (const r of market.rounds) {
      const out = recordLevel(market, progress, r.id, 2);
      progress = out.progress;
      paid.push(out.giveXp);
    }
    expect(paid).toEqual(market.rounds.map((_, i) => i === market.rounds.length - 1));
    expect(recordLevel(market, progress, market.rounds[0].id, 3)).toMatchObject({ giveXp: false, progress: { levels: { [market.rounds[0].id]: 3 } } });

    const legacy = { stars: 3, xpGiven: true };
    let again = legacy as Parameters<typeof recordLevel>[1];
    for (const r of market.rounds) {
      const out = recordLevel(market, again, r.id, 3);
      expect(out.giveXp).toBe(false);
      again = out.progress;
    }
  });
});
