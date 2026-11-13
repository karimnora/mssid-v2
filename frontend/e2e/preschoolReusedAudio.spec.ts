import { test, expect } from '@playwright/test';
import { PRESCHOOL_MODULES } from '../src/data/preschool';
for (const language of ['fr', 'en'] as const) {
  test(`${language}: a V2 preschool recording works without a matching phone voice`, async ({ page }) => {
    test.setTimeout(90_000);
    const module = PRESCHOOL_MODULES.find(module => module.activities.some(activity => activity.i18n[language].promptAudioSrc?.includes('/openai-v2-')))!;
    const activity = module.activities.find(activity => activity.i18n[language].promptAudioSrc?.includes('/openai-v2-'))!;
    const clip = activity.i18n[language].promptAudioSrc!;
    expect(clip).toMatch(new RegExp(`/sounds/preschool/${language}/openai-v2-`));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(language => {
      localStorage.setItem('mssid_locale_preference', language === 'fr' ? 'fr' : 'ar');
      localStorage.setItem('mssid_preschool_language', language);
      Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true, value: () => [{ lang: 'de-DE' }] });
      const state = { played: [] as string[], ttsCalls: 0 };
      Object.assign(window, { reuseAudioTest: state });
      speechSynthesis.speak = () => { state.ttsCalls++; };
      const NativeAudio = window.Audio;
      window.Audio = new Proxy(NativeAudio, { construct(Target, args) {
        const audio = new Target(...args);
        audio.addEventListener('playing', () => state.played.push(audio.src));
        return audio;
      } });
    }, language);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto('/eveil');
    await page.getByText(language === 'fr' ? 'Apprendre' : 'Learn', { exact: true }).click();
    await page.getByText(language === 'fr' ? 'Tracé et créatif' : 'Writing and art', { exact: true }).click();
    await page.getByText(module.titleI18n[language], { exact: true }).click();
    await page.getByRole('button', { name: activity.i18n[language].title, exact: true }).click();
    await page.getByRole('button', { name: language === 'fr' ? 'Réécouter' : 'Replay', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { reuseAudioTest: { played: string[] } }).reuseAudioTest.played), { timeout: 10_000 }).toEqual(expect.arrayContaining([expect.stringContaining(clip)]));
    expect(await page.evaluate(() => (window as unknown as { reuseAudioTest: { ttsCalls: number } }).reuseAudioTest.ttsCalls)).toBe(0);
  });
}
