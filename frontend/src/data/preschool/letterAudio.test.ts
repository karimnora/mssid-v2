import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { LETTERS_MODULE_START, LETTERS_MODULE_MORE } from './lettersModule';
import { LETTER_AUDIO_CLIPS } from './letterAudio';

const activities = [...LETTERS_MODULE_START.activities, ...LETTERS_MODULE_MORE.activities];
const publicRoot = resolve(process.cwd(), 'public');
const metadata = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-integres.json'), 'utf8'));
const canonical = (text: string) => text.replaceAll('ـ', '').replaceAll('..', '…').trim();

describe('recorded preschool letter audio', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s maps all prompts and rewards to existing clips in the correct language', language => {
    expect(Object.keys(LETTER_AUDIO_CLIPS[language]!)).toHaveLength(activities.length);
    const paths = new Set<string>();
    for (const activity of activities) {
      const content = activity.i18n[language];
      for (const [kind, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        expect(src).toBe(`/sounds/preschool/${language}/${activity.id}-${kind}.mp3`);
        expect(paths.has(src!)).toBe(false);
        paths.add(src!);
        const path = resolve(publicRoot, src!.slice(1));
        expect(existsSync(path)).toBe(true);
        expect(statSync(path).size).toBeGreaterThan(1000);
        const clip = metadata[language].clips.find((row: { fichier: string }) => row.fichier === `${activity.id}-${kind}.mp3`);
        expect(clip.texte).toBe(canonical(text!));
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(clip.duration).toBeLessThan(15);
      }
    }
    expect(paths.size).toBe(84);
  });
});
