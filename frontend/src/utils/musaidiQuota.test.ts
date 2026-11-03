import { describe, it, expect, beforeEach } from 'vitest';
import { algeriaDay, openCorrection, readOpenedToday, remainingCorrections } from './musaidiQuota';

const day1 = new Date('2026-11-03T10:00:00Z');
const day1Late = new Date('2026-11-03T22:30:00Z'); // 23:30 in Algiers, same day
const day2 = new Date('2026-11-03T23:30:00Z'); // 00:30 in Algiers, next day

describe('« مساعدي » daily corrections', () => {
  beforeEach(() => localStorage.clear());

  it('uses the Algerian calendar day', () => {
    expect(algeriaDay(day1Late)).toBe('2026-11-03');
    expect(algeriaDay(day2)).toBe('2026-11-04');
  });

  it('allows 3 detailed corrections per day for a free account, re-opening is free', () => {
    expect(openCorrection('user:1', false, 'a', day1)).toEqual(['a']);
    expect(openCorrection('user:1', false, 'b', day1)).toEqual(['a', 'b']);
    expect(openCorrection('user:1', false, 'c', day1Late)).toEqual(['a', 'b', 'c']);
    expect(remainingCorrections(false, readOpenedToday('user:1', day1))).toBe(0);
    expect(openCorrection('user:1', false, 'd', day1)).toBeNull();
    expect(openCorrection('user:1', false, 'a', day1)).toEqual(['a', 'b', 'c']);
  });

  it('starts again the next day and keeps accounts separate', () => {
    ['a', 'b', 'c'].forEach((id) => openCorrection('user:1', false, id, day1));
    expect(openCorrection('user:1', false, 'd', day2)).toEqual(['d']);
    expect(openCorrection('user:2', false, 'x', day1)).toEqual(['x']);
  });

  it('never limits Premium', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e']) expect(openCorrection('user:1', true, id, day1)).not.toBeNull();
    expect(remainingCorrections(true, readOpenedToday('user:1', day1))).toBeNull();
  });

  it('survives corrupted storage', () => {
    localStorage.setItem(`mssid_musaidi_v1:user:1:${algeriaDay(day1)}`, '{oops');
    expect(readOpenedToday('user:1', day1)).toEqual([]);
  });
});
