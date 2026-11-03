import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openCorrectionSynced, readOpenedToday, syncOpenedToday, type MusaidiApi, type MusaidiServerStatus } from './musaidiQuota';

const NOW = new Date('2026-11-05T10:00:00Z');
const status = (over: Partial<MusaidiServerStatus>): MusaidiServerStatus => ({ allowed: true, premium: false, limit: 3, remaining: 3, opened: [], day: '2026-11-05', ...over });
const api = (open: MusaidiServerStatus | Error, today: MusaidiServerStatus | Error = status({})): MusaidiApi => ({
  openMusaidi: vi.fn(() => (open instanceof Error ? Promise.reject(open) : Promise.resolve({ data: open, status: 200 }))),
  getMusaidiToday: vi.fn(() => (today instanceof Error ? Promise.reject(today) : Promise.resolve({ data: today, status: 200 }))),
});

beforeEach(() => window.localStorage.clear());

describe('« مساعدي » quota with the server as authority', () => {
  it('a reinstall cannot reset the count: the server refusal wins over an empty device', async () => {
    const server = api(status({ allowed: false, remaining: 0, opened: ['a', 'b', 'c'] }));
    expect(await openCorrectionSynced('user:7', false, 'd', server, NOW)).toBeNull();
  });

  it('an allowed opening adopts the server list and caches it on the device', async () => {
    const server = api(status({ remaining: 1, opened: ['a', 'b'] }));
    expect(await openCorrectionSynced('user:7', false, 'b', server, NOW)).toEqual(['a', 'b']);
    expect(readOpenedToday('user:7', NOW)).toEqual(['a', 'b']);
  });

  it('offline falls back to the device counter (still 3 a day)', async () => {
    const server = api(new Error('offline'));
    for (const id of ['a', 'b', 'c']) expect(await openCorrectionSynced('user:7', false, id, server, NOW)).not.toBeNull();
    expect(await openCorrectionSynced('user:7', false, 'd', server, NOW)).toBeNull();
  });

  it('Premium never calls the server', async () => {
    const server = api(status({}));
    expect(await openCorrectionSynced('user:7', true, 'x', server, NOW)).toEqual(['x']);
    expect(server.openMusaidi).not.toHaveBeenCalled();
  });

  it('the server telling us the account became Premium unlocks the correction', async () => {
    const server = api(status({ premium: true, allowed: true, limit: null, remaining: null }));
    expect(await openCorrectionSynced('user:7', false, 'x', server, NOW)).toEqual(['x']);
  });

  it('syncing today takes the server count, or keeps the device copy when offline', async () => {
    expect(await syncOpenedToday('user:7', api(status({}), status({ opened: ['a', 'b'] })), NOW)).toEqual(['a', 'b']);
    expect(await syncOpenedToday('user:7', api(status({}), new Error('offline')), NOW)).toEqual(['a', 'b']);
  });
});
