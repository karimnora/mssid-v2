import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { SHORT_SURAHS_MODULE } from './shortSurahsModule';

type Clip = { fichier: string; texte: string; duration: number };
const metadata: Record<'ar' | 'fr' | 'en', { clips: Clip[] }> = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-consignes-sourates.json'), 'utf8'));

describe('recorded surah instructions', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s uses seven recorded instructions and one shared reward', language => {
    expect(metadata[language].clips).toHaveLength(8);
    expect(SHORT_SURAHS_MODULE.activities).toHaveLength(7);
    const rewards = new Set<string>();
    for (const activity of SHORT_SURAHS_MODULE.activities) {
      const content = activity.i18n[language];
      expect(activity.interactionType).toBe('quran_listen');
      expect(activity.visualAssets.quranSurahAr).toBeTruthy();
      for (const [type, src, text] of [
        ['prompt', content.promptAudioSrc, content.promptAudio],
        ['success', content.successAudioSrc, content.successAudio],
      ] as const) {
        const filename = type === 'prompt' ? `${activity.id}-prompt.mp3` : 'surah-fatiha-success.mp3';
        expect(src).toBe(`/sounds/preschool/${language}/${filename}`);
        expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
        const clip = metadata[language].clips.find(row => row.fichier === filename)!;
        expect(clip.texte).toBe(text);
        expect(clip.duration).toBeGreaterThan(0.5);
        expect(clip.duration).toBeLessThan(15);
        if (type === 'success') {
          expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
          rewards.add(src!);
        }
      }
    }
    expect(rewards.size).toBe(1);
  });
});
