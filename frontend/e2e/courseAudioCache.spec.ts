import { test, expect } from '@playwright/test';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';

test('course audio is downloaded on demand and serves byte ranges offline', async ({ page, context }) => {
  test.setTimeout(240_000);
  const clip = Object.values(RECORDED_SPEECH_CATALOG.ar).find(clip => clip.src.includes('/course-cedar-'))!;
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 90_000 }).toBe(true);
  expect(await page.evaluate(async src => !!await caches.match(src), clip.src)).toBe(false);
  const online = await page.evaluate(async src => {
    const response = await fetch(src, { headers: { Range: 'bytes=0-' } });
    return { status: response.status, bytes: Array.from(new Uint8Array(await response.arrayBuffer())) };
  }, clip.src);
  expect(online.status).toBe(200);
  expect(online.bytes.length).toBeGreaterThan(1000);
  await expect.poll(() => page.evaluate(async src => {
    const cache = await caches.open('mssid-course-recordings-v1');
    return (await cache.match(src))?.status;
  }, clip.src)).toBe(200);
  await context.setOffline(true);
  const offline = await page.evaluate(async src => {
    const response = await fetch(src, { headers: { Range: 'bytes=0-15' } });
    return { status: response.status, range: response.headers.get('content-range'), bytes: Array.from(new Uint8Array(await response.arrayBuffer())) };
  }, clip.src);
  expect(offline.status).toBe(206);
  expect(offline.range).toBe(`bytes 0-15/${online.bytes.length}`);
  expect(offline.bytes).toEqual(online.bytes.slice(0, 16));
});
