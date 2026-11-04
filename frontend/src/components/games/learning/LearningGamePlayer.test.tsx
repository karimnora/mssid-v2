import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));
vi.mock('../../../utils/immersiveFeedback', () => ({ playPop: vi.fn(), playSoftMiss: vi.fn(), playSoftSuccess: vi.fn() }));
vi.mock('../../../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar', direction: 'rtl' }) }));

import { LearningGamePlayer, starsForMisses } from './LearningGamePlayer';
import { GAME_PACKS_5AP } from '../../../data/games/packs5ap';
import type { MazeRound, OrderRound, SortRound } from '../../../data/games/types';

const pack = (id: string) => GAME_PACKS_5AP.find((p) => p.id === id)!;
const nextButton = () => document.querySelector('[data-lg-next]') as HTMLButtonElement;
const step = (kind: string) => waitFor(() => expect(document.querySelector(`[data-lg-step="${kind}"]`)).toBeTruthy());
const click = (selector: string) => fireEvent.click(document.querySelector(selector)!);

describe('LearningGamePlayer', () => {
  it('sort: explains a wrong shelf, reports it once, then opens the next round when every card is placed', async () => {
    const plurals = pack('game-5ap-sort-plurals');
    const round = plurals.rounds[0] as SortRound;
    const onResult = vi.fn();
    render(<LearningGamePlayer pack={plurals} onExit={vi.fn()} onResult={onResult} />);

    fireEvent.click(nextButton()); // story → round 1
    await step('sort');
    expect(nextButton().disabled).toBe(true);

    const kutub = round.cards.find((c) => c.id === 'kutub')!;
    click('[data-lg-sort-card="kutub"]');
    click('[data-lg-bin="masc"]');
    expect(screen.getByText(kutub.whyAr)).toBeTruthy();
    expect(onResult).toHaveBeenLastCalledWith('arabic-5ap-jam-taksir', { outcome: 'fail', exerciseId: 'game-5ap-sort-plurals:three-plurals' });

    for (const card of round.cards) {
      click(`[data-lg-sort-card="${card.id}"]`);
      click(`[data-lg-bin="${card.bin}"]`);
    }
    await waitFor(() => expect(nextButton().disabled).toBe(false));
    expect(onResult).toHaveBeenLastCalledWith('arabic-5ap-jam-taksir', { outcome: 'success', helped: true, exerciseId: 'game-5ap-sort-plurals:three-plurals' });
    expect(onResult).toHaveBeenCalledTimes(2);
  });

  it('order: a card tapped too early is explained with its date, the right order fills the timeline', async () => {
    const history = pack('game-5ap-order-history');
    const round = history.rounds[0] as OrderRound;
    render(<LearningGamePlayer pack={history} onExit={vi.fn()} />);
    fireEvent.click(nextButton());
    await step('order');

    click('[data-lg-order-card="independence"]');
    expect(screen.getByText(/فِي 5 جُويْلِيَةَ 1962، وَمَا زَالَ هُنَاكَ حَدَثٌ أَقْدَمُ/)).toBeTruthy();

    for (const card of [...round.cards].sort((a, b) => a.rank - b.rank)) click(`[data-lg-order-card="${card.id}"]`);
    expect(document.querySelectorAll('.lg-slot.filled')).toHaveLength(round.cards.length);
    await waitFor(() => expect(nextButton().disabled).toBe(false));
  });

  it('maze: a wrong stone is explained, a stone too far is only a nudge, the path reaches the treasure', async () => {
    const timgad = pack('game-5ap-maze-timgad');
    const round = timgad.rounds[0] as MazeRound;
    const onResult = vi.fn();
    render(<LearningGamePlayer pack={timgad} onExit={vi.fn()} onResult={onResult} />);
    fireEvent.click(nextButton());
    await step('maze');

    click('[data-lg-cell="4,0"]'); // far away: nudge, not a mistake
    expect(onResult).not.toHaveBeenCalled();

    click('[data-lg-cell="1,0"]'); // 0,05 — wrong stone next to Didou
    const wrong = round.grid[1][0];
    expect(wrong.ok).toBe(false);
    expect(screen.getByText(wrong.whyAr!)).toBeTruthy();
    expect(onResult).toHaveBeenCalledWith('math-5ap-fractions', { outcome: 'fail', exerciseId: 'game-5ap-maze-timgad:half' });

    for (const key of ['0,1', '1,1', '2,1', '2,2', '2,3', '3,3', '4,3', '4,4']) click(`[data-lg-cell="${key}"]`);
    await waitFor(() => expect(nextButton().disabled).toBe(false));
    expect(onResult).toHaveBeenLastCalledWith('math-5ap-fractions', { outcome: 'success', helped: true, exerciseId: 'game-5ap-maze-timgad:half' });
  });

  it('memory: twins stay face up with their explanation', async () => {
    const market = pack('game-5ap-memory-fractions');
    render(<LearningGamePlayer pack={market} onExit={vi.fn()} />);
    fireEvent.click(nextButton());
    await step('memory');

    click('[data-lg-card="half-a"]');
    click('[data-lg-card="half-b"]');
    await waitFor(() => expect(document.querySelector('[data-lg-card="half-a"]')!.getAttribute('data-state')).toBe('matched'));
    expect(screen.getByText(/1\/2 يَعْنِي 1 ÷ 2/)).toBeTruthy();
  });

  it('gives 3 stars up to 2 mistakes, 2 up to 6, then 1', () => {
    expect([0, 2, 3, 6, 7, 20].map(starsForMisses)).toEqual([3, 3, 2, 2, 1, 1]);
  });
});
