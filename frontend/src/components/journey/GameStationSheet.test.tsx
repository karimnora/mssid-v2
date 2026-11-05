import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));
vi.mock('../../utils/immersiveFeedback', () => ({ playPop: vi.fn(), playSoftMiss: vi.fn(), playSoftSuccess: vi.fn() }));
vi.mock('../../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar', direction: 'rtl' }) }));
vi.mock('../PremiumOffer', () => ({ PremiumOffer: () => <button type="button">offer</button> }));

import { GameStationSheet } from './GameStationSheet';
import { gameStationsForJourney, packsForGrade } from '../../data/games';
import { journeyForGrade } from '../../data/journey/journeyWorlds';
import { clearLineAr } from '../games/learning/LearningGamePlayer';

const [freePack, premiumPack] = packsForGrade('1AP').sort((a, b) => Number(Boolean(b.free)) - Number(Boolean(a.free)));

describe('gameStationsForJourney', () => {
  for (const grade of ['1AP', '2AP', '3AP', '4AP', '5AP'] as const) {
    it(`${grade}: every pack gets its own world, the free one in the first world`, () => {
      const worlds = journeyForGrade(grade)!;
      const placed = gameStationsForJourney(grade, worlds.map((w) => w.lessonIds));
      expect(placed).toHaveLength(packsForGrade(grade).length);
      expect(new Set(placed.map((p) => p.worldIndex)).size).toBe(placed.length);
      expect(placed.find((p) => p.pack.free)?.worldIndex).toBe(0);
      for (const p of placed) expect(p.worldIndex).toBeLessThan(worlds.length);
    });
  }

  it('prefers the world whose lessons the pack reviews', () => {
    const worlds = journeyForGrade('1AP')!;
    const placed = gameStationsForJourney('1AP', worlds.map((w) => w.lessonIds));
    for (const p of placed.filter((x) => !x.pack.free)) {
      const lessons = new Set(p.pack.rounds.map((r) => r.lessonId));
      const reviewsAny = worlds.some((w) => w.lessonIds.some((id) => lessons.has(id)));
      if (reviewsAny) expect(worlds[p.worldIndex].lessonIds.some((id) => lessons.has(id))).toBe(true);
    }
  });

  it('places nothing without worlds', () => {
    expect(gameStationsForJourney('1AP', [])).toEqual([]);
  });
});

describe('GameStationSheet', () => {
  beforeEach(() => window.localStorage.clear());

  it('open pack: ten level drums, the suggested one, then the 3D player on the chosen level', () => {
    render(<GameStationSheet pack={freePack} open lessonTitles={{}} onClose={vi.fn()} />);
    const levels = document.querySelectorAll('[data-gs-level]');
    expect(levels).toHaveLength(freePack.rounds.length);
    expect(document.querySelector('[data-gs-level="0"]')?.getAttribute('data-state')).toBe('now');
    expect(document.querySelector('[data-gs-level="9"]')?.hasAttribute('data-boss')).toBe(true);
    fireEvent.click(document.querySelector('[data-gs-level="3"]')!);
    expect(document.querySelector(`[data-learning-game="${freePack.id}"]`)).not.toBeNull();
    expect(screen.getByText(new RegExp(`المُسْتَوَى 4 / ${freePack.rounds.length}`))).toBeTruthy();
  });

  it('shows the stars kept on the device and suggests the first unsolved level', () => {
    window.localStorage.setItem('mssid_learning_games_v1', JSON.stringify({ [freePack.id]: { levels: { [freePack.rounds[0].id]: 3, [freePack.rounds[1].id]: 2 } } }));
    render(<GameStationSheet pack={freePack} open lessonTitles={{}} onClose={vi.fn()} />);
    expect(document.querySelector('[data-gs-level="0"]')?.getAttribute('data-state')).toBe('done');
    expect(document.querySelector('[data-gs-level="2"]')?.getAttribute('data-state')).toBe('now');
    expect(document.querySelector('[data-gs-play]')?.textContent).toContain('3');
  });

  it('Premium pack on a free account: neutral message, no price, a way back to the free game', () => {
    const onPlayFree = vi.fn();
    render(<GameStationSheet pack={premiumPack} open={false} lessonTitles={{}} onClose={vi.fn()} onPlayFree={onPlayFree} freeTitle={freePack.titleAr} />);
    expect(document.querySelector('[data-gs-level]')).toBeNull();
    expect(document.querySelector('[data-gs-play]')).toBeNull();
    const sheet = document.querySelector('[data-game-sheet]')!;
    expect(sheet.textContent).toContain('حِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ');
    expect(sheet.textContent).toContain(freePack.titleAr);
    expect(sheet.textContent).not.toMatch(/DA|دج|دينار|€/);
    fireEvent.click(document.querySelector('[data-gs-free]')!);
    expect(onPlayFree).toHaveBeenCalled();
  });
});

describe('clearLineAr', () => {
  it('says how the stars were earned', () => {
    expect(clearLineAr(0, 3)).toBe('بِلَا أَيِّ خَطَأٍ · ثَلَاثُ نُجُومٍ');
    expect(clearLineAr(1, 3)).toBe('خَطَأٌ وَاحِدٌ فَقَطْ · ثَلَاثُ نُجُومٍ');
    expect(clearLineAr(2, 2)).toBe('خَطَآنِ · نَجْمَتَانِ');
    expect(clearLineAr(5, 1)).toBe('5 أَخْطَاءٍ · نَجْمَةٌ وَاحِدَةٌ');
    expect(clearLineAr(12, 1)).toBe('12 خَطَأً · نَجْمَةٌ وَاحِدَةٌ');
  });
});
