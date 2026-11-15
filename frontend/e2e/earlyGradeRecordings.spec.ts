import { test, expect } from '@playwright/test';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';

for (const scenario of [
  { grade: '1AP', id: 'math-1ap-t1-spatial-relations', clip: '/sounds/preschool/ar/course-cedar-57332addd6c96e64.mp3' },
  { grade: '2AP', id: 'science-2ap-t2-animal-movement', clip: '/sounds/preschool/ar/course-cedar-3f501a59488dedef.mp3' },
]) {
  test(`${scenario.grade}: Didou V2 cedar reads the new title without a phone voice`, async ({ page }) => {
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
    const title = page.locator('.lesson-learning-space [data-tap-speak="title"]');
    await expect(title).toBeVisible({ timeout: 60_000 });
    await title.click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { courseAudioTest: { clips: string[] } }).courseAudioTest.clips)).toEqual([expect.stringContaining(scenario.clip)]);
    expect(await page.evaluate(() => (window as unknown as { courseAudioTest: { ttsCalls: number } }).courseAudioTest.ttsCalls)).toBe(0);
    await expect(page.locator('[data-synthetic-voice-notice]')).toBeVisible();
  });
}

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
    // The lesson titles are now recorded too: their speak button is offered without any phone voice.
    await expect(page.locator('.lesson-learning-space [data-tap-speak="title"]')).toBeVisible();
  });
}

test('all reused Arabic course files decode and contain a non-silent signal', async ({ page }) => {
  test.setTimeout(180_000);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/');
  const arabic = Object.values(RECORDED_SPEECH_CATALOG.ar);
  // Every reused reading clip, plus an evenly spread sample of the thousands of course recordings:
  // decoding them all in one browser page takes longer than the suite allows. The full set is
  // checked file by file by scripts/index-recorded-speech.ts when the index is rebuilt.
  const course = arabic.filter(clip => clip.src.includes('/course-cedar-'));
  const sample = course.filter((_, index) => index % Math.max(1, Math.floor(course.length / 60)) === 0);
  const clips = [...arabic.filter(clip => /\/(reading-|language-next-ar-)/.test(clip.src)), ...sample];
  expect(clips.length).toBeGreaterThanOrEqual(46);
  const decoded = await page.evaluate(async clips => {
    const context = new AudioContext();
    try {
      // Thousands of clips now: fetching them all at once makes the browser drop requests.
      const results = [];
      for (let start = 0; start < clips.length; start += 24) {
        results.push(...await Promise.all(clips.slice(start, start + 24).map(async clip => {
          const response = await fetch(clip.src);
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${clip.src}`);
          const buffer = await context.decodeAudioData(await response.arrayBuffer());
          const samples = buffer.getChannelData(0);
          let squareSum = 0;
          for (const sample of samples) squareSum += sample * sample;
          return { src: clip.src, rms: Math.sqrt(squareSum / samples.length), duration: buffer.duration, expected: clip.durationMs / 1000 };
        })));
      }
      return results;
    } finally { await context.close(); }
  }, clips);
  for (const clip of decoded) {
    expect(clip.rms, clip.src).toBeGreaterThan(0.0001);
    expect(Math.abs(clip.duration - clip.expected), clip.src).toBeLessThan(0.12);
  }
});
