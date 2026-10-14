import { useSyncExternalStore } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './authService';
import { springBootApi } from './springBootApi';
import { useUserProgress } from '../hooks/useUserProgress';
import { progressSync, retryPendingProgress, restorePendingProgress } from './progressSync';
import { mapAuthProfile } from './authProfile';

vi.mock('../utils/badgeEngine', () => ({ applyBadgeEvaluation: (profile: unknown) => ({ profile, newlyUnlocked: [] }) }));
const account = { id: 123, nom: 'Test', email: 'test@example.test', role: 'ROLE_FREE' as const, score: 80, xp: 80, level: 1, goldCoins: 150 };
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
beforeEach(() => {
  localStorage.clear(); AuthService.setCurrentUser(null);
  vi.spyOn(springBootApi, 'updateUserProgress').mockResolvedValue({ data: {}, status: 200 });
});
afterEach(() => { cleanup(); AuthService.setCurrentUser(null); vi.restoreAllMocks(); });

describe('account and progress release fixes', () => {
  it('keeps the session and local save if server deletion fails', async () => {
    AuthService.setCurrentUser(account); localStorage.setItem('mssid_user_profile', 'keep me');
    localStorage.setItem('mssid_local_activities_v1_123', 'keep my games');
    // Exercise the real deleteAccount method, including its resolved HTTP error result.
    vi.spyOn(springBootApi, 'request').mockResolvedValue({ error: 'Deletion failed', status: 500 });
    expect(await AuthService.deleteAccountAsync()).toEqual({ success: false, error: 'Deletion failed' });
    expect(AuthService.getCurrentUser()).toEqual(account);
    expect(localStorage.getItem('mssid_user_profile')).toBe('keep me');
    expect(localStorage.getItem('mssid_local_activities_v1_123')).toBe('keep my games');
  });
  it('clears the session only after server-confirmed deletion', async () => {
    AuthService.setCurrentUser(account);
    localStorage.setItem('mssid_local_activities_v1_123', 'my games');
    vi.spyOn(springBootApi, 'request').mockResolvedValue({ status: 204 });
    expect(await AuthService.deleteAccountAsync()).toEqual({ success: true });
    expect(AuthService.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('mssid_local_activities_v1_123')).toBeNull();
  });
  it('keeps connected lab XP, level and coins coherent, including rapid consecutive rewards', async () => {
    AuthService.setCurrentUser(account);
    const { result } = renderHook(() => {
      const authUser = useSyncExternalStore(AuthService.subscribe, AuthService.getCurrentUser);
      return useUserProgress({ authUser });
    });
    act(() => { result.current.handleLabReward(20, 30); result.current.handleLabReward(10, 20); });
    expect(result.current.userProfile).toMatchObject({ xp: 130, level: 2, goldCoins: 180 });
    expect(AuthService.getCurrentUser()).toMatchObject({ score: 130, xp: 130, level: 2, goldCoins: 180 });
    await retryPendingProgress();
    expect(springBootApi.updateUserProgress).toHaveBeenLastCalledWith(expect.objectContaining({ xp: 130, goldCoins: 180 }));
  });
  it.each(['password', 'Google', 'registration'] as const)('restores the complete server history after %s', async method => {
    const dto = { ...account, completedExamIds: ['exam-a'], completedChallengeIds: ['challenge-a'],
      badgeUnlockedAt: { b_welcome: '2026-10-14' }, lastActiveDate: '2026-10-14', quizScores: { lesson: 30 } };
    const response = { data: { user: dto }, status: 200 };
    vi.spyOn(springBootApi, 'login').mockResolvedValue(response);
    vi.spyOn(springBootApi, 'loginWithGoogle').mockResolvedValue(response);
    vi.spyOn(springBootApi, 'register').mockResolvedValue(response);
    const result = method === 'password' ? await AuthService.loginAsync(account.email, 'test')
      : method === 'Google' ? await AuthService.loginWithGoogleAsync('test-token')
      : await AuthService.registerAsync('Test', account.email, 'test', '1AP');
    expect(result.user).toMatchObject({ completedExamIds: ['exam-a'], completedChallengeIds: ['challenge-a'],
      badgeUnlockedAt: { b_welcome: '2026-10-14' }, lastActiveDate: '2026-10-14', quizScores: { lesson: 30 } });
  });
  it('does not carry a guest or another account history into a new account', () => {
    localStorage.setItem('mssid_user_profile', JSON.stringify({ completedExamIds: ['guest-exam'], completedLabIds: ['guest-lab'], xp: 999 }));
    const { result, rerender } = renderHook(({ user }) => useUserProgress({ authUser: user }), { initialProps: { user: mapAuthProfile(account) } });
    expect(result.current.userProfile.completedExamIds).toEqual([]);
    expect(result.current.userProfile.completedLabIds).toEqual([]);
    rerender({ user: mapAuthProfile({ ...account, id: 456, xp: 0, score: 0, completedExamIds: [] }) });
    expect(result.current.userProfile).toMatchObject({ xp: 0, completedExamIds: [] });
  });
  it('restores local-only game and lab history for the same account without sharing it', () => {
    const user = mapAuthProfile(account);
    const first = renderHook(() => useUserProgress({ authUser: user }));
    act(() => { first.result.current.handleVisitLab('quran_lab'); first.result.current.handleCompleteGame('memory', 0); });
    first.unmount();
    const second = renderHook(({ current }) => useUserProgress({ authUser: current }), { initialProps: { current: user } });
    expect(second.result.current.userProfile.completedLabIds).toEqual(['quran_lab']);
    expect(second.result.current.userProfile.completedGameIds).toEqual(['memory']);
    second.rerender({ current: mapAuthProfile({ ...account, id: 456 }) });
    expect(second.result.current.userProfile.completedLabIds).toEqual([]);
    expect(second.result.current.userProfile.completedGameIds).toEqual([]);
  });
  it('retains unsaved points through a failed refresh and restores only the same account after reload', async () => {
    AuthService.setCurrentUser(account);
    vi.mocked(springBootApi.updateUserProgress).mockResolvedValue({ error: 'offline', status: 500 });
    AuthService.addScore(30); await retryPendingProgress();
    expect(progressSync.getSnapshot().status).toBe('pending');
    const get = vi.spyOn(springBootApi, 'fetchCurrentUser').mockResolvedValue({ data: account, status: 200 });
    await AuthService.fetchProfileFromDbAsync();
    expect(get).not.toHaveBeenCalled(); expect(AuthService.getCurrentUser()?.xp).toBe(110);
    AuthService.setCurrentUser(null);
    expect(restorePendingProgress(account).xp).toBe(110);
    expect(restorePendingProgress({ ...account, id: 456 }).xp).toBe(80);
    AuthService.hydrateCurrentUser(account); await retryPendingProgress();
    expect(AuthService.getCurrentUser()?.xp).toBe(110);
    vi.mocked(springBootApi.updateUserProgress).mockResolvedValue({ data: { ...account, xp: 110 }, status: 200 });
    await retryPendingProgress();
    expect(progressSync.getSnapshot().status).toBe('synced');
    expect(localStorage.getItem('mssid_progress_pending_v1_123')).toBeNull();
  });
  it('does not overwrite a newer gain with a slow refresh response', async () => {
    AuthService.setCurrentUser(account);
    let respond!: (value: { data: typeof account; status: number }) => void;
    vi.spyOn(springBootApi, 'fetchCurrentUser').mockImplementation(() => new Promise(resolve => { respond = resolve; }));
    const refresh = AuthService.fetchProfileFromDbAsync(); await tick();
    AuthService.addScore(30); respond({ data: account, status: 200 }); await refresh;
    expect(AuthService.getCurrentUser()?.xp).toBe(110);
  });
  it('awards a given exam once even with consecutive calls', async () => {
    AuthService.setCurrentUser(account);
    AuthService.addExamXp('exam-a', 50); AuthService.addExamXp('exam-a', 50);
    await retryPendingProgress();
    expect(AuthService.getCurrentUser()).toMatchObject({ xp: 130, completedExamIds: ['exam-a'] });
    expect(springBootApi.updateUserProgress).toHaveBeenCalledTimes(1);
  });
  it('keeps the pending indicator when the server only accepts a capped portion', async () => {
    AuthService.setCurrentUser(account);
    vi.mocked(springBootApi.updateUserProgress).mockResolvedValue({ data: { xp: 100 }, status: 200 });
    AuthService.addScore(300); await retryPendingProgress();
    expect(AuthService.getCurrentUser()?.xp).toBe(380);
    expect(progressSync.getSnapshot().status).toBe('pending');
  });
  it('preserves a quiz score through the connected profile update', async () => {
    AuthService.setCurrentUser(account);
    const { result } = renderHook(() => {
      const authUser = useSyncExternalStore(AuthService.subscribe, AuthService.getCurrentUser);
      return useUserProgress({ authUser });
    });
    act(() => { AuthService.addScore(30, 'lesson-a'); });
    expect(result.current.userProfile.quizScores).toMatchObject({ 'lesson-a': 30 });
    await retryPendingProgress();
  });
  it('sends the latest queued gain after an older request succeeds', async () => {
    AuthService.setCurrentUser(account);
    let acknowledge!: (value: { data: { xp: number }; status: number }) => void;
    vi.mocked(springBootApi.updateUserProgress).mockImplementationOnce(() => new Promise(resolve => { acknowledge = resolve; }));
    AuthService.addScore(10); AuthService.addScore(20);
    acknowledge({ data: { xp: 90 }, status: 200 });
    await retryPendingProgress();
    expect(springBootApi.updateUserProgress).toHaveBeenCalledTimes(2);
    expect(springBootApi.updateUserProgress).toHaveBeenLastCalledWith(expect.objectContaining({ xp: 110 }));
    expect(progressSync.getSnapshot().status).toBe('synced');
  });
  it('does not send a retired account queue after switching accounts', async () => {
    AuthService.setCurrentUser(account);
    let acknowledge!: (value: { data: {}; status: number }) => void;
    vi.mocked(springBootApi.updateUserProgress).mockImplementationOnce(() => new Promise(resolve => { acknowledge = resolve; }));
    AuthService.addScore(10); AuthService.addScore(20);
    AuthService.setCurrentUser({ ...account, id: 456 });
    acknowledge({ data: {}, status: 200 }); await tick();
    expect(springBootApi.updateUserProgress).toHaveBeenCalledTimes(1);
    expect(progressSync.getSnapshot().status).toBe('synced');
    expect(restorePendingProgress(account).xp).toBe(110);
  });
  it('keeps unacknowledged completed exam IDs pending', async () => {
    AuthService.setCurrentUser(account);
    vi.mocked(springBootApi.updateUserProgress).mockResolvedValue({ data: { xp: 130, completedExamIds: [] }, status: 200 });
    AuthService.addExamXp('exam-a', 50); await retryPendingProgress();
    expect(progressSync.getSnapshot().status).toBe('pending');
    expect(restorePendingProgress(account).completedExamIds).toEqual(['exam-a']);
  });
});
