import { beforeEach, describe, expect, it } from 'vitest';
import {
  adoptGuestProgressIfEmpty,
  appendEvent,
  badgeStorageKey,
  loadActiveChildId,
  loadEvents,
  loadProgress,
  progressOwnerId,
  saveActiveChildId,
  saveProgress,
  suggestNextActivity,
  summarizeBilan,
  todayPlayIds,
  withImpliedGuidedSteps,
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

  it('credits today only for a real success, never a try or a skip', () => {
    const events = [
      { activityId: 'num-0', date: '2020-01-01', quality: 'done' as const },
      { activityId: 'num-3', date: '2026-10-08', quality: 'wrote' as const },
      { activityId: 'num-3', date: '2026-10-08', quality: 'helped' as const },
      { activityId: 'num-4', date: '2026-10-08', quality: 'tried' as const },
      { activityId: 'num-5', date: '2026-10-08', quality: 'skipped' as const },
    ];
    expect(todayPlayIds(events, '2026-10-08')).toEqual(['num-3']);
    expect(todayPlayIds(events, '2026-10-07')).toEqual([]);
  });

  it('builds parent bilan states from events', () => {
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
    expect(rows.find((r) => r.activityId === 'num-1')?.status).toBe('discovered');
    expect(rows.find((r) => r.activityId === 'num-2')?.status).toBe('several');
  });

  it('does not promote two failed traces to Plusieurs fois', () => {
    const rows = summarizeBilan(
      [
        { activityId: 'letters-trace-baa', date: '2026-10-08', quality: 'tried' },
        { activityId: 'letters-trace-baa', date: '2026-10-08', quality: 'tried' },
      ],
      PRESCHOOL_MODULES,
      'fr',
    );
    expect(rows.find((r) => r.activityId === 'letters-trace-baa')?.status).toBe('tried');
  });

  it('records skip as Passé, not Avec de l’aide', () => {
    const rows = summarizeBilan(
      [{ activityId: 'num-0', date: '2026-10-08', quality: 'skipped' }],
      PRESCHOOL_MODULES,
      'fr',
    );
    expect(rows.find((r) => r.activityId === 'num-0')?.status).toBe('skipped');
  });

  it('keeps Avec de l’aide only when help actually happened and there is no success', () => {
    const rows = summarizeBilan(
      [{ activityId: 'num-0', date: '2026-10-08', quality: 'helped' }],
      PRESCHOOL_MODULES,
      'fr',
    );
    expect(rows.find((r) => r.activityId === 'num-0')?.status).toBe('helped');
  });

  it('adopts guest child-1 data onto a new account once', () => {
    saveProgress('child-1', ['num-0']);
    appendEvent('child-1', { activityId: 'num-0', date: '2026-10-08', quality: 'done' });
    adoptGuestProgressIfEmpty(42);
    expect(progressOwnerId(42)).toBe('user-42');
    expect(loadProgress('user-42')).toEqual(['num-0']);
    expect(loadEvents('user-42')).toHaveLength(1);
    saveProgress('user-99', ['already']);
    adoptGuestProgressIfEmpty(99);
    expect(loadProgress('user-99')).toEqual(['already']);
  });

  it('namespaces badges per owner', () => {
    expect(badgeStorageKey('child-1')).toBe('mssid_preschool_badges:child-1');
    expect(badgeStorageKey('user-7')).toBe('mssid_preschool_badges:user-7');
  });

  it('counts a guided counting step as done when the child already succeeded at the ordinary task', () => {
    const numbers = PRESCHOOL_MODULES.find(mod => mod.activities.some(act => act.id === 'num-3-guided'))!;
    const before = numbers.activities.filter(act => !act.id.endsWith('-guided')).map(act => act.id);
    // A child who finished the module before the guided steps existed keeps a finished module.
    const ids = withImpliedGuidedSteps(before, PRESCHOOL_MODULES);
    expect(numbers.activities.every(act => ids.includes(act.id))).toBe(true);
    expect(suggestNextActivity([numbers], ids)).toBeNull();
    // A new child still meets the guided step first.
    expect(suggestNextActivity([numbers], ['num-0', 'num-1', 'num-2'])?.activityId).toBe('num-3-guided');
    // Nothing is invented: an unfinished task does not mark its guided step.
    expect(withImpliedGuidedSteps(['num-0'], PRESCHOOL_MODULES)).toEqual(['num-0']);
  });
  it('restores implied guidance without marking the ordinary task from guidance alone', () => {
    saveProgress('child-1', ['num-3']);
    expect(loadProgress('child-1', PRESCHOOL_MODULES)).toEqual(['num-3', 'num-3-guided']);
    expect(withImpliedGuidedSteps(['num-3-guided'], PRESCHOOL_MODULES)).toEqual(['num-3-guided']);
    const completed = withImpliedGuidedSteps(['num-3'], PRESCHOOL_MODULES);
    expect(withImpliedGuidedSteps(completed, PRESCHOOL_MODULES)).toEqual(completed);
    expect(loadProgress('child-2', PRESCHOOL_MODULES)).toEqual([]);
  });

});
