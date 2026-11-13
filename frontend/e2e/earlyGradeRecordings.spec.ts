import { test, expect } from '@playwright/test';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';

for (const scenario of [
  { grade: '1AP', id: 'arabic-1ap-t1-school-axis', clip: '/sounds/preschool/ar/reading-first-school-book.mp3' },
  { grade: '2AP', id: 'arabic-2ap-t1-reading-school', clip: '/sounds/preschool/ar/reading-school-1.mp3' },
]) {
  test(`${scenario.grade}: real Arabic recording plays without a phone voice or displayed vowels`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(grade => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      localStorage.setItem('mssid_user_profile', JSON.stringify({ grade, xp: 0, tashkeelEnabled: false }));
      Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true, value: () => [{ lang: 'fr-FR' }] });
      const state = { clips: [] as string[], ttsCalls: 0 };
      Object.assign(window, { courseAudioTest: state });
      speechSynthesis.speak = () => { state.ttsCalls++; };
      const OriginalAudio = window.Audio;
      window.Audio = new Proxy(OriginalAudio, { construct(Target, args) {
        const audio = new Target(...args);
        audio.addEventListener('playing', () => state.clips.push(audio.src));
        return audio;
      } });
    }, scenario.grade);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(`/lesson/${scenario.id}?g=${scenario.grade}`);
    const scene = page.locator('[data-reading-scene]').first();
    await expect(scene).toBeVisible({ timeout: 60_000 });
    await scene.locator('[data-tap-speak]').click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { courseAudioTest: { clips: string[] } }).courseAudioTest.clips), { timeout: 10_000 }).toEqual([expect.stringContaining(scenario.clip)]);
    expect(await page.evaluate(() => (window as unknown as { courseAudioTest: { ttsCalls: number } }).courseAudioTest.ttsCalls)).toBe(0);
    await expect(page.locator('.lesson-learning-space [data-tap-speak="title"]')).toHaveCount(0);
  });
}

test('all reused Arabic course files decode and contain a non-silent signal', async ({ page }) => {
  test.setTimeout(90_000);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/');
  const clips = Object.values(RECORDED_SPEECH_CATALOG.ar).filter(clip => /\/(reading-|language-next-ar-)/.test(clip.src));
  expect(clips.length).toBeGreaterThanOrEqual(22);
  const decoded = await page.evaluate(async clips => {
    const context = new AudioContext();
    try {
      return await Promise.all(clips.map(async clip => {
        const response = await fetch(clip.src);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${clip.src}`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        const samples = buffer.getChannelData(0);
        let squareSum = 0;
        for (const sample of samples) squareSum += sample * sample;
        return { src: clip.src, rms: Math.sqrt(squareSum / samples.length), duration: buffer.duration, expected: clip.durationMs / 1000 };
      }));
    } finally { await context.close(); }
  }, clips);
  for (const clip of decoded) {
    expect(clip.rms, clip.src).toBeGreaterThan(0.0001);
    expect(Math.abs(clip.duration - clip.expected), clip.src).toBeLessThan(0.12);
  }
});
