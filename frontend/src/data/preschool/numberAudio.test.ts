import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { NUMBERS_MODULE_0_TO_5, NUMBERS_MODULE_6_TO_10 } from './numbersModule';
import { NUMBER_AUDIO_CLIPS } from './numberAudio';

const metadata = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-nombres.json'), 'utf8'));
const canonical = (text: string) => text.replace(/ـ/g, '').replace(/\.{2,}/g, '…').trim();
const activities = [...NUMBERS_MODULE_0_TO_5.activities, ...NUMBERS_MODULE_6_TO_10.activities];

describe('recorded preschool numbers 0–10', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s uses matching files, texts and reward durations', language => {
    expect(Object.keys(NUMBER_AUDIO_CLIPS[language]!)).toHaveLength(14);
    expect(metadata[language].clips).toHaveLength(28);
    for (const activity of activities) {
      const content = activity.i18n[language];
      for (const [type, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        expect(src).toBe(`/sounds/preschool/${language}/${activity.id}-${type}.mp3`);
        expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
        const clip = metadata[language].clips.find((row: { fichier: string }) => row.fichier === `${activity.id}-${type}.mp3`);
        expect(clip.texte).toBe(canonical(text!));
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(clip.duration).toBeLessThan(15);
        if (type === 'success') expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
      }
    }
  });

  it('uses the new Standard Arabic recording for all eight counting instructions', () => {
    const counting = activities.filter(activity => activity.interactionType === 'drag_drop');
    expect(counting).toHaveLength(8);
    for (const activity of counting) {
      expect(activity.i18n.ar.promptAudio).toContain('زِرِّ «أَنْهَيْتُ»');
      expect(activity.i18n.ar.promptAudio).not.toContain('خَلَّصْت');
      expect(activity.i18n.ar.promptText).toContain('أَنْهَيْتُ');
      const clip = metadata.ar.clips.find((row: { fichier: string }) => row.fichier === `${activity.id}-prompt.mp3`);
      expect(clip.source).toContain('12_32_43_Asmaa');
    }
  });
});
