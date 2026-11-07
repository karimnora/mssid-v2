import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mapAuthProfile } from './authProfile';
import { springBootApi } from './springBootApi';
import { queueProgressUpdate, setProgressSyncOwner, progressSync, clearPendingProgress } from './progressSync';
const summaries = [{ at: '2026-11-07T10:00:00Z', lessonId: 'math-5ap-fractions', villageSummary: { id: 'summary-1' } }];
beforeEach(() => { localStorage.clear(); setProgressSyncOwner(null); setProgressSyncOwner(7); });
afterEach(() => { clearPendingProgress(7); setProgressSyncOwner(null); vi.restoreAllMocks(); });
it('round-trips the independent summaries through hydration and the offline-safe sync payload', async () => {
  expect(mapAuthProfile({ id: 7, villageSummaries: summaries }).villageSummaries).toEqual(summaries);
  const api = vi.spyOn(springBootApi, 'updateUserProgress').mockResolvedValue({ status: 200, data: { villageSummaries: summaries } });
  await queueProgressUpdate(7, { villageSummaries: summaries });
  expect(api).toHaveBeenCalledWith({ villageSummaries: summaries });
  expect(progressSync.getSnapshot().status).toBe('synced');
});
it('does not claim a summary was synchronized when an older backend drops the new field', async () => {
  vi.spyOn(springBootApi, 'updateUserProgress').mockResolvedValue({ status: 200, data: {} });
  await queueProgressUpdate(7, { villageSummaries: summaries });
  expect(progressSync.getSnapshot().status).toBe('pending');
  expect(JSON.parse(localStorage.getItem('mssid_progress_pending_v1_7')!).villageSummaries).toEqual(summaries);
});
