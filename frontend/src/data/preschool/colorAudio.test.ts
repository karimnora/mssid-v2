import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { COLORS_MODULE } from './colorsModule';
import { COLOR_AUDIO_CLIPS } from './colorAudio';

const metadata = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-couleurs.json'), 'utf8'));
const canonical = (text: string) => text.replace(/ـ/g, '').replace(/\.{2,}/g, '…').trim();

describe('recorded preschool colors', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s matches all ten activities and reward durations', language => {
    expect(Object.keys(COLOR_AUDIO_CLIPS[language]!)).toHaveLength(10);
    expect(metadata[language].clips).toHaveLength(20);
    for (const activity of COLORS_MODULE.activities) {
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

  it('ends the Arabic bubble reward before the incorrect verb in the recording', () => {
    const content = COLORS_MODULE.activities.find(activity => activity.id === 'colors-pottery-bubble')!.i18n.ar;
    const clip = metadata.ar.clips.find((row: { fichier: string }) => row.fichier === 'colors-pottery-bubble-success.mp3');
    expect(content.successAudio).toBe('أَلْوَانٌ مُبْهِجَة!');
    expect(clip.cutEnd).toBeLessThan(clip.originalCutEnd);
    expect(clip.recognized).not.toContain('فرقت');
  });
});
