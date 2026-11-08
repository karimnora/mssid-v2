import { readLastActivity, migrateGuestLastActivityToUser } from './lastActivity';
import { loadAwardedQuestionIds, migrateGuestQuizRewardsToUser } from './quizRewards';
import { beforeEach, describe, expect, it } from 'vitest';
import { setActiveProgressOwner } from './progressOwner';
import { ownerStorageKey, progressStorage } from './ownerStorage';
import { listLegacyProgress, recoverLegacyProgress } from './legacyProgressRecovery';
import { incrementDailyObjective, getDailyObjectiveProgress } from './dailyObjective';
import { markCemRewarded } from '../data/immersive/cemPrep';

describe('personal device records', () => {
  beforeEach(() => { localStorage.clear(); setActiveProgressOwner(7, 11); });
  it('separates siblings, accounts and guests without adopting unknown legacy records', () => {
    localStorage.setItem('mssid_game_levels', JSON.stringify({ maze: { maxUnlocked: 4 } }));
    expect(progressStorage().getItem('mssid_game_levels')).toBeNull();
    progressStorage().setItem('mssid_game_levels', '{"maze":{"maxUnlocked":2}}');
    setActiveProgressOwner(7, 12);
    expect(progressStorage().getItem('mssid_game_levels')).toBeNull();
    setActiveProgressOwner(8, 11);
    expect(progressStorage().getItem('mssid_game_levels')).toBeNull();
    setActiveProgressOwner();
    expect(progressStorage().getItem('mssid_game_levels')).toBeNull();
    expect(localStorage.getItem('mssid_game_levels')).toContain('4');
  });
  it('recovers only a parent-selected category, once, without changing the original', () => {
    const original = '{"maze":{"maxUnlocked":4}}';
    localStorage.setItem('mssid_game_levels', original);
    expect(listLegacyProgress()).toHaveLength(1);
    expect(recoverLegacyProgress('mssid_game_levels', 'user:7:child:12')).toBe(false);
    expect(recoverLegacyProgress('mssid_game_levels', 'user:7:child:11')).toBe(true);
    expect(localStorage.getItem(ownerStorageKey('mssid_game_levels'))).toBe(original);
    expect(localStorage.getItem('mssid_game_levels')).toBe(original);
    setActiveProgressOwner(7, 12);
    expect(recoverLegacyProgress('mssid_game_levels', 'user:7:child:12')).toBe(false);
  });
  it('never overwrites progress already saved for the destination', () => {
    localStorage.setItem('mssid_game_levels', '{"maze":{"maxUnlocked":4}}');
    progressStorage().setItem('mssid_game_levels', '{"maze":{"maxUnlocked":2}}');
    expect(recoverLegacyProgress('mssid_game_levels', 'user:7:child:11')).toBe(false);
    expect(progressStorage().getItem('mssid_game_levels')).toContain('2');
  });
  it('does not share daily objectives or CEM reward receipts between siblings', () => {
    incrementDailyObjective(); expect(markCemRewarded('exercise')).toBe(true);
    expect(markCemRewarded('exercise')).toBe(false);
    setActiveProgressOwner(7, 12);
    expect(getDailyObjectiveProgress().count).toBe(0);
    expect(markCemRewarded('exercise')).toBe(true);
    setActiveProgressOwner(7, 11);
    expect(getDailyObjectiveProgress().count).toBe(1);
    expect(markCemRewarded('exercise')).toBe(false);
  });
  it('quarantines anonymous quiz and resume data even during login migration', () => {
    localStorage.setItem('mssid_quiz_first_awards', '{"math":["q1"]}');
    localStorage.setItem('mssid_last_activity', JSON.stringify({ kind: 'lesson', grade: '5AP', lessonId: 'math', subject: 'math', titleAr: 'درس' }));
    expect(loadAwardedQuestionIds('math')).toEqual([]);
    expect(readLastActivity()).toBeNull();
    migrateGuestQuizRewardsToUser(7);
    migrateGuestLastActivityToUser(7);
    expect(loadAwardedQuestionIds('math')).toEqual([]);
    expect(readLastActivity()).toBeNull();
    expect(localStorage.getItem('mssid_quiz_first_awards')).toContain('legacy-unassigned');
    expect(localStorage.getItem('mssid_last_activity')).toContain('legacy-unassigned');
  });
  it('recovers a selected quiz receipt without erasing another child’s existing bucket', () => {
    localStorage.setItem('mssid_quiz_first_awards', JSON.stringify({ 'legacy-unassigned': { math: ['q1'] }, 'user:7:child:12': { math: ['q2'] } }));
    expect(recoverLegacyProgress('mssid_quiz_first_awards', 'user:7:child:11')).toBe(true);
    expect(loadAwardedQuestionIds('math')).toEqual(['q1']);
    setActiveProgressOwner(7, 12);
    expect(loadAwardedQuestionIds('math')).toEqual(['q2']);
  });

});
