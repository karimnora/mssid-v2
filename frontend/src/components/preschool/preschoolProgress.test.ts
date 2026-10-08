import { beforeEach, describe, expect, it } from 'vitest';
import {
  appendEvent,
  loadActiveChildId,
  loadProgress,
  saveActiveChildId,
  saveProgress,
  summarizeBilan,
  todayPlayIds,
} from './preschoolProgress';
import { PRESCHOOL_MODULES } from '../../data/preschool';

beforeEach(() => {
  localStorage.clear();
});

describe('preschool per-child progress', () => {
  it('migrates the unkeyed progress bag onto child-1 only', () => {
    localStorage.setItem('mssid_preschool_progress', JSON.stringify(['num-0', 'num-1']));
    expect(loadProgress('child-1')).toEqual(['num-0', 'num-1']);
    expect(loadProgress('child-2')).toEqual([]);
  });

  it('keeps two children on separate keys', () => {
    saveProgress('child-1', ['num-0']);
    saveProgress('child-2', ['num-5']);
    saveActiveChildId('child-2');
    expect(loadProgress('child-1')).toEqual(['num-0']);
    expect(loadProgress('child-2')).toEqual(['num-5']);
    expect(loadActiveChildId()).toBe('child-2');
  });

  it('credits today plays, not a lifetime completion', () => {
    const events = [
      { activityId: 'num-0', date: '2020-01-01', quality: 'done' as const },
      { activityId: 'num-3', date: '2026-10-08', quality: 'wrote' as const },
      { activityId: 'num-3', date: '2026-10-08', quality: 'helped' as const },
    ];
    expect(todayPlayIds(events, '2026-10-08')).toEqual(['num-3']);
    expect(todayPlayIds(events, '2026-10-07')).toEqual([]);
  });

  it('builds parent bilan states from events', () => {
    appendEvent('child-1', { activityId: 'num-0', date: '2026-10-07', quality: 'done' });
    appendEvent('child-1', { activityId: 'num-1', date: '2026-10-08', quality: 'helped' });
    appendEvent('child-1', { activityId: 'num-1', date: '2026-10-08', quality: 'done' });
    appendEvent('child-1', { activityId: 'num-2', date: '2026-10-08', quality: 'done' });
    appendEvent('child-1', { activityId: 'num-2', date: '2026-10-08', quality: 'done' });
    const rows = summarizeBilan(
      [
        { activityId: 'num-0', date: '2026-10-07', quality: 'done' },
        { activityId: 'num-1', date: '2026-10-08', quality: 'helped' },
        { activityId: 'num-1', date: '2026-10-08', quality: 'done' },
        { activityId: 'num-2', date: '2026-10-08', quality: 'done' },
        { activityId: 'num-2', date: '2026-10-08', quality: 'done' },
      ],
      PRESCHOOL_MODULES,
      'fr',
    );
    expect(rows.find((r) => r.activityId === 'num-0')?.status).toBe('discovered');
    expect(rows.find((r) => r.activityId === 'num-1')?.status).toBe('helped');
    expect(rows.find((r) => r.activityId === 'num-2')?.status).toBe('several');
  });
});
