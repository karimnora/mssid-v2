import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GAME_PACKS_5AP } from '../../../data/games/packs5ap';
import { setActiveProgressOwner } from '../../../utils/progressOwner';
import { recoverLegacyProgress } from '../../../utils/legacyProgressRecovery';
import { readPackLevels, usePackLevels } from './LearningGameEntry';

vi.mock('./LearningGamePlayer', () => ({ LearningGamePlayer: () => null }));

const pack = GAME_PACKS_5AP[0];
const level = pack.rounds[0].id;
const legacyKey = 'mssid_learning_games_v1';

beforeEach(() => { localStorage.clear(); setActiveProgressOwner(7, 11); });
afterEach(() => { setActiveProgressOwner(); });

describe('CX-03 learning game progress per child', () => {
  it('keeps siblings’ stars separate and restores each child’s best result', () => {
    const { result } = renderHook(() => usePackLevels(pack));
    act(() => result.current.solveLevel(level, 3));
    expect(readPackLevels(pack.id)).toEqual({ [level]: 3 });

    act(() => setActiveProgressOwner(7, 12));
    expect(result.current.levels).toEqual({});
    act(() => result.current.solveLevel(level, 1));
    expect(readPackLevels(pack.id)).toEqual({ [level]: 1 });

    act(() => setActiveProgressOwner(7, 11));
    expect(result.current.levels).toEqual({ [level]: 3 });
    act(() => result.current.solveLevel(level, 1));
    expect(readPackLevels(pack.id)).toEqual({ [level]: 3 });
  });

  it('rejects callbacks retained from the previous child and grants pack XP once per child', () => {
    const earned = vi.fn();
    const { result } = renderHook(() => usePackLevels(pack, earned));
    const previousChildSolve = result.current.solveLevel;
    act(() => setActiveProgressOwner(7, 12));
    act(() => previousChildSolve(level, 3));
    expect(result.current.levels).toEqual({});
    expect(earned).not.toHaveBeenCalled();

    act(() => { for (const round of pack.rounds) result.current.solveLevel(round.id, 3); });
    expect(earned).toHaveBeenCalledTimes(1);
    act(() => result.current.solveLevel(level, 3));
    expect(earned).toHaveBeenCalledTimes(1);

    act(() => setActiveProgressOwner(7, 11));
    expect(result.current.levels).toEqual({});
    act(() => { for (const round of pack.rounds) result.current.solveLevel(round.id, 3); });
    expect(earned).toHaveBeenCalledTimes(2);
    expect(earned).toHaveBeenLastCalledWith(pack, pack.xp);
  });

  it('recovers legacy stars only for the parent-selected child, preserving the original', () => {
    const original = JSON.stringify({ [pack.id]: { levels: { [level]: 2 }, xpGiven: true } });
    localStorage.setItem(legacyKey, original);
    expect(readPackLevels(pack.id)).toEqual({});
    expect(recoverLegacyProgress(legacyKey, 'user:7:child:11')).toBe(true);
    expect(readPackLevels(pack.id)).toEqual({ [level]: 2 });
    expect(localStorage.getItem(legacyKey)).toBe(original);

    setActiveProgressOwner(7, 12);
    expect(readPackLevels(pack.id)).toEqual({});
    expect(recoverLegacyProgress(legacyKey, 'user:7:child:12')).toBe(false);
    setActiveProgressOwner(8, 11);
    expect(readPackLevels(pack.id)).toEqual({});
    setActiveProgressOwner();
    expect(readPackLevels(pack.id)).toEqual({});
  });
});
