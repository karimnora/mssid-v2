import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { SHAPES_MODULE } from './shapesModule';
import { SHAPE_AUDIO_CLIPS } from './shapeAudio';

const metadata = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-formes.json'), 'utf8'));
const canonical = (text: string) => text.replace(/ـ/g, '').replace(/\.{2,}/g, '…').trim();

describe('recorded preschool shapes', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s maps all ten activities to matching recordings', language => {
    expect(Object.keys(SHAPE_AUDIO_CLIPS[language]!)).toHaveLength(10);
    expect(metadata[language].clips).toHaveLength(20);
    for (const activity of SHAPES_MODULE.activities) {
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

  it('uses the replacement Arabic recording rather than the earlier French Asmaa file', () => {
    expect(metadata.ar.source).toContain('13_17_33_Asmaa');
    expect(metadata.ar.source).not.toContain('12_54_16_Asmaa');
    for (const activity of SHAPES_MODULE.activities) expect(activity.i18n.ar.promptAudio).toMatch(/[\u0600-\u06ff]/);
  });
});
