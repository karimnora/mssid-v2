vi.unmock('./premiumFunnel');
import { afterEach, expect, it, vi } from 'vitest';
import { recordPremiumEvent } from './premiumFunnel';
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it('sends only event, active grade and Algerian day without credentials or referrer', async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-06T23:30:00Z'));
  const fetcher = vi.fn().mockResolvedValue({ status: 204 }); vi.stubGlobal('fetch', fetcher);
  recordPremiumEvent('offer_open', '5AP');
  const [url, options] = fetcher.mock.calls[0];
  expect(url).toMatch(/\/v1\/analytics\/premium-funnel$/);
  expect(JSON.parse(options.body)).toEqual({ event: 'offer_open', grade: '5AP', day: '2026-11-07' });
  expect(options.credentials).toBe('omit'); expect(options.referrerPolicy).toBe('no-referrer');
  expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
});
it('does not block the child or retry an ambiguous failed request', async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error('offline')); vi.stubGlobal('fetch', fetcher);
  expect(() => recordPremiumEvent('lock_open', '4AP')).not.toThrow();
  await Promise.resolve(); expect(fetcher).toHaveBeenCalledTimes(1);
});
