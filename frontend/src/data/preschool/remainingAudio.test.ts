import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRESCHOOL_MODULES } from './index';
import { findRecordedSpeech } from '../../utils/recordedSpeech';
import { withRecordedAudio } from './withRecordedAudio';
import { EMOTIONS_MODULE } from './emotionsModule';

type Clip = { fichier: string; texte: string; duration: number; activiteId: string; moduleId: string; type: 'prompt' | 'success' };
const metadata: Record<'ar' | 'fr', { clips: Clip[] }> = JSON.parse(
  readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-fin-prescolaire.json'), 'utf8'),
);

describe('last preschool recordings and incomplete-language fallback', () => {
  it.each(['ar', 'fr'] as const)('%s attaches only supplied clips to their actual activities', language => {
    expect(metadata[language].clips).toHaveLength(language === 'ar' ? 74 : 39);
    for (const clip of metadata[language].clips) {
      const activity = PRESCHOOL_MODULES.find(module => module.id === clip.moduleId)?.activities.find(item => item.id === clip.activiteId)!;
      const content = activity.i18n[language];
      const src = clip.type === 'prompt' ? content.promptAudioSrc : content.successAudioSrc;
      const text = clip.type === 'prompt' ? content.promptAudio : content.successAudio;
      expect(text).toBe(clip.texte);
      expect(src).toBe(`/sounds/preschool/${language}/${clip.fichier}`);
      expect(findRecordedSpeech(text!, language)?.src).toBe(src);
      expect(statSync(resolve(process.cwd(), 'public', src!.slice(1))).size).toBeGreaterThan(1000);
      if (clip.type === 'success') expect(content.successAudioDurationMs).toBe(Math.round(clip.duration * 1000));
    }
  });

  it('attaches newly supplied French and English recordings to the remaining activities', () => {
    for (const language of ['fr', 'en'] as const) {
      const plan: Clip[] = JSON.parse(readFileSync(resolve(process.cwd(), `../docs/audio-v1/prochains/reste-a-generer/${language}-decoupage.json`), 'utf8'));
      const missing = language === 'fr' ? plan.slice(39) : plan;
      expect(missing).toHaveLength(language === 'fr' ? 35 : 74);
      for (const cue of missing) {
        const content = PRESCHOOL_MODULES.find(module => module.id === cue.moduleId)!.activities.find(item => item.id === cue.activiteId)!.i18n[language];
        expect(cue.type === 'prompt' ? content.promptAudio : content.successAudio).toBe(cue.texte);
        const recording = findRecordedSpeech(cue.texte, language);
        expect(recording).toBeDefined();
        expect(cue.type === 'prompt' ? content.promptAudioSrc : content.successAudioSrc).toBe(recording!.src);
        expect(recording!.src).toMatch(new RegExp(`^/sounds/preschool/${language}/`));
        expect(statSync(resolve(process.cwd(), 'public', recording!.src.slice(1))).size).toBeGreaterThan(1000);
        if (cue.type === 'success') expect(content.successAudioDurationMs).toBe(recording!.durationMs);
      }
    }
  });

  it('retains synthesis fallback for unavailable phrases without borrowing another language', () => {
    const module = structuredClone(EMOTIONS_MODULE);
    const arabicClip = metadata.ar.clips.find(clip => !findRecordedSpeech(clip.texte, 'fr'))!;
    expect(findRecordedSpeech(arabicClip.texte, 'ar')).toBeDefined();
    const content = module.activities[0].i18n.fr;
    content.promptAudio = arabicClip.texte;
    content.successAudio = 'Texte témoin non enregistré pour vérifier le secours vocal.';
    delete content.promptAudioSrc;
    delete content.successAudioSrc;
    delete content.successAudioDurationMs;
    const snapshot = structuredClone(module);
    const attached = withRecordedAudio(module).activities[0].i18n.fr;
    expect(attached.promptAudio).toBe(arabicClip.texte);
    expect(attached.promptAudioSrc).toBeUndefined();
    expect(attached.successAudioSrc).toBeUndefined();
    expect(attached.successAudioDurationMs).toBeUndefined();
    expect(module).toEqual(snapshot);
  });
  it('preserves explicitly selected voices and durations without mutating the source module', () => {
    const existing = structuredClone(EMOTIONS_MODULE);
    existing.activities[0].i18n.fr.promptAudioSrc = '/custom-prompt.mp3';
    existing.activities[0].i18n.fr.successAudioSrc = '/custom-success.mp3';
    existing.activities[0].i18n.fr.successAudioDurationMs = 4321;
    const snapshot = structuredClone(existing);
    const attached = withRecordedAudio(existing);
    expect(attached.activities[0].i18n.fr).toEqual(existing.activities[0].i18n.fr);
    expect(existing).toEqual(snapshot);
  });
});
