import { describe, it, expect } from 'vitest';
import { collectJobs, missingJobs } from './elevenlabs-generate';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';

describe('ElevenLabs generation plan', () => {
  const jobs = collectJobs();

  it('collects each phrase once per language and voice', () => {
    const keys = jobs.map((j) => JSON.stringify([j.language, j.voice, recordedSpeechKey(j.text)]));
    expect(new Set(keys).size).toBe(keys.length);
    expect(jobs.some((j) => j.uses.some((u) => u.startsWith('journey:1AP:sahara')))).toBe(true);
    expect(jobs.every((j) => j.voice === 'didou')).toBe(true); // darija postponed
  });

  it('never regenerates a phrase that is already recorded', () => {
    const [text] = Object.keys(RECORDED_SPEECH_CATALOG.ar);
    const fake = [{ language: 'ar' as const, voice: 'didou' as const, text, uses: ['test'] }, { language: 'ar' as const, voice: 'didou' as const, text: 'جملة جديدة لم تسجل بعد', uses: ['test'] }];
    expect(missingJobs(fake, { ar: [], fr: [], en: [] }).map((j) => j.text)).toEqual(['جملة جديدة لم تسجل بعد']);
  });
});
