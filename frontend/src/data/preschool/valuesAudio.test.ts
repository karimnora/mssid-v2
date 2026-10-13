import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { ISLAMIC_VALUES_MODULE } from './islamicValuesModule';
import { ALGERIA_AUDIO_CLIPS } from './algeriaAudio';

type Clip = { fichier: string; texte: string; duration: number };
type Metadata = Record<'ar' | 'fr' | 'en', { clips: Clip[] }>;
const loadMetadata = (name: string): Metadata => JSON.parse(readFileSync(resolve(process.cwd(), `../docs/audio-v1/${name}`), 'utf8'));
const values = loadMetadata('enregistrements-valeurs.json');
const algeria = loadMetadata('enregistrements-algerie.json');

describe('recorded preschool values', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s covers seven activities and reuses the mosque recording', language => {
    expect(values[language].clips).toHaveLength(13);
    expect(ISLAMIC_VALUES_MODULE.activities).toHaveLength(7);
    for (const activity of ISLAMIC_VALUES_MODULE.activities) {
      const content = activity.i18n[language];
      for (const [type, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        const reused = activity.id === 'values-mosque-tap' && type === 'success';
        const filename = reused ? 'algeria-mosque-success.mp3' : `${activity.id}-${type}.mp3`;
        expect(src).toBe(`/sounds/preschool/${language}/${filename}`);
        expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
        const clip = (reused ? algeria : values)[language].clips.find(row => row.fichier === filename)!;
        expect(clip.texte).toBe(text);
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(clip.duration).toBeLessThan(15);
        if (type === 'success') expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
        if (reused) expect(src).toBe(ALGERIA_AUDIO_CLIPS[language]!['algeria-mosque'].success);
      }
    }
  });
});
