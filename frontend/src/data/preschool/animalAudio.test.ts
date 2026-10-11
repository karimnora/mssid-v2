import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { ANIMALS_MODULE } from './animalsModule';
import { ANIMAL_AUDIO_CLIPS } from './animalAudio';

const metadata = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-animaux.json'), 'utf8'));
const canonical = (text: string) => text.replace(/ـ/g, '').replace(/\.{2,}/g, '…').trim();

describe('recorded preschool animals', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s matches all ten activities and reward durations', language => {
    expect(Object.keys(ANIMAL_AUDIO_CLIPS[language]!)).toHaveLength(10);
    expect(metadata[language].clips).toHaveLength(20);
    const paths = new Set<string>();
    for (const activity of ANIMALS_MODULE.activities) {
      const content = activity.i18n[language];
      for (const [type, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        expect(src).toBe(`/sounds/preschool/${language}/${activity.id}-${type}.mp3`);
        expect(paths.has(src!)).toBe(false);
        paths.add(src!);
        expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
        const clip = metadata[language].clips.find((row: { fichier: string }) => row.fichier === `${activity.id}-${type}.mp3`);
        expect(clip.texte).toBe(canonical(text!));
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(clip.duration).toBeLessThan(15);
        if (type === 'success') expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
      }
    }
    expect(paths.size).toBe(20);
  });
});
