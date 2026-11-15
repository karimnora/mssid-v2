import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { findRecordedSpeech } from '../src/utils/recordedSpeech';

const requests: { texte: string; language: string }[] = JSON.parse(readFileSync(resolve('..', 'docs/audio-v1/app-manquants-lot-02.json'), 'utf8'));

test('all 49 missing messages have real decodable recordings in the correct language', async ({ page }) => {
  await page.goto('/');
  expect(requests).toHaveLength(49);
  for (const request of requests) {
    const clip = findRecordedSpeech(request.texte, request.language);
    expect(clip, request.texte).toBeDefined();
    expect(clip!.src).toContain(`/preschool/${request.language}/`);
    const decoded = await page.evaluate(async src => {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
      const context = new AudioContext();
      try {
        const audio = await context.decodeAudioData(await response.arrayBuffer());
        const samples = audio.getChannelData(0);
        return { duration: audio.duration, rms: Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length) };
      } finally { await context.close(); }
    }, clip!.src);
    expect(decoded.duration).toBeGreaterThan(0.15);
    expect(decoded.rms).toBeGreaterThan(0.001);
  }
});

for (const locale of ['ar', 'fr']) {
  test(`Didou ${locale} plays an MP3 without any installed phone voice`, async ({ page }) => {
    await page.addInitScript(locale => {
      localStorage.setItem('mssid_locale_preference', locale);
      Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true, value: () => [] });
      const state = { clips: [] as string[], tts: 0 };
      Object.assign(window, { didouAudioCheck: state });
      speechSynthesis.speak = () => { state.tts++; };
      const OriginalAudio = window.Audio;
      window.Audio = new Proxy(OriginalAudio, { construct(Target, args) {
        const audio = new Target(...args);
        audio.addEventListener('playing', () => state.clips.push(audio.src));
        return audio;
      } });
    }, locale);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/?g=4AP');
    await page.locator('[data-companion-card]').getByRole('button', { name: locale === 'fr' ? 'Sa garde-robe' : 'خزانة ديدو' }).click();
    const studio = page.getByRole('dialog');
    await studio.getByRole('tab', { name: locale === 'fr' ? 'Parler' : 'نتحدث' }).click();
    const buttons = studio.getByRole('button', { name: locale === 'fr' ? 'Écouter' : 'أستمع', exact: true });
    await expect(buttons).toHaveCount(6);
    await buttons.first().click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { didouAudioCheck: { clips: string[]; tts: number } }).didouAudioCheck.clips)).toEqual([expect.stringContaining(`/sounds/preschool/${locale}/course-cedar-`)]);
    expect(await page.evaluate(() => (window as unknown as { didouAudioCheck: { clips: string[]; tts: number } }).didouAudioCheck.tts)).toBe(0);
  });
}
