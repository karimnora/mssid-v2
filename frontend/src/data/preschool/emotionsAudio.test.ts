import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { EMOTIONS_MODULE } from './emotionsModule';
import { findRecordedSpeech } from '../../utils/recordedSpeech';

type Clip = { fichier: string; texte: string; duration: number };
const metadata: Record<'ar' | 'fr' | 'en', { clips: Clip[] }> = JSON.parse(
  readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-emotions.json'), 'utf8'),
);

describe('recorded emotions instructions and rewards', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s supplies both clips for all eight activities', language => {
    expect(EMOTIONS_MODULE.activities).toHaveLength(8);
    expect(metadata[language].clips).toHaveLength(16);
    for (const activity of EMOTIONS_MODULE.activities) {
      const content = activity.i18n[language];
      for (const [type, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        const filename = `${activity.id}-${type}.mp3`;
        expect(src).toBe(`/sounds/preschool/${language}/${filename}`);
        const clip = metadata[language].clips.find(row => row.fichier === filename)!;
        expect(clip.texte).toBe(text);
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
        expect(findRecordedSpeech(text!, language)?.src).toBe(src);
        if (type === 'success') expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
      }
    }
  });
});
