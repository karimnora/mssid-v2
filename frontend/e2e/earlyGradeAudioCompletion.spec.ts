import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { findRecordedSpeechSequence } from '../src/utils/recordedSpeech';

const directory = resolve('..', 'docs/audio-v1/cours-1ap-2ap/completion');
const manifest: { sections: { section: string; file: string }[] } = JSON.parse(readFileSync(resolve(directory, 'manifest.json'), 'utf8'));
type Request = { texte: string; targets: { lessonId: string; key: string; grade: string }[] };
const plans = manifest.sections.map(section => ({ ...section, jobs: JSON.parse(readFileSync(resolve(directory, section.file), 'utf8')) as Request[] }));

test('all planned early-grade passages are indexed and samples from every section decode', async ({ page }) => {
  test.setTimeout(120_000);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/');
  for (const plan of plans) {
    for (const job of plan.jobs) expect(findRecordedSpeechSequence(job.texte, 'ar'), `${plan.section}: ${job.texte}`).toBeDefined();
    for (const clip of [plan.jobs[0], plan.jobs.at(-1)!].flatMap(job => findRecordedSpeechSequence(job.texte, 'ar')!)) {
      const duration = await page.evaluate(async src => {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        const context = new AudioContext();
        try {
          const audio = await context.decodeAudioData(await response.arrayBuffer());
          const samples = audio.getChannelData(0);
          const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
          if (rms < 0.001) throw new Error('Silent browser audio sample');
          return audio.duration;
        } finally { await context.close(); }
      }, clip.src);
      expect(duration).toBeGreaterThan(0.15);
    }
  }
});

for (const section of ['1AP-arabic', '2AP-science']) {
  test(`${section}: new course recording plays without an installed Arabic voice`, async ({ page }) => {
    const job = plans.find(plan => plan.section === section)!.jobs.find(job => job.targets.some(target => target.key === 'title'))!;
    const target = job.targets.find(target => target.key === 'title')!;
    const clip = findRecordedSpeechSequence(job.texte, 'ar')![0];
    await page.addInitScript(grade => {
      localStorage.setItem('mssid_locale_preference', 'ar');
      localStorage.setItem('mssid_user_profile', JSON.stringify({ grade, tashkeelEnabled: false }));
      Object.defineProperty(speechSynthesis, 'getVoices', { configurable: true, value: () => [] });
      const state = { clips: [] as string[], tts: 0 };
      Object.assign(window, { earlyAudioCompletion: state });
      speechSynthesis.speak = () => { state.tts++; };
      const OriginalAudio = window.Audio;
      window.Audio = new Proxy(OriginalAudio, { construct(Target, args) {
        const audio = new Target(...args);
        audio.addEventListener('playing', () => state.clips.push(audio.src));
        return audio;
      } });
    }, target.grade);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(`/lesson/${target.lessonId}?g=${target.grade}`);
    const title = page.locator('.lesson-learning-space [data-tap-speak="title"]');
    await expect(title).toBeVisible({ timeout: 60_000 });
    await title.click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { earlyAudioCompletion: { clips: string[] } }).earlyAudioCompletion.clips)).toEqual([expect.stringContaining(clip.src)]);
    expect(await page.evaluate(() => (window as unknown as { earlyAudioCompletion: { tts: number } }).earlyAudioCompletion.tts)).toBe(0);
  });
}
