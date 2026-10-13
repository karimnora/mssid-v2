import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { ARABIC_1AP_THEMES } from './courses/1AP/arabic-themes';
import { findRecordedSpeech } from '../utils/recordedSpeech';

type Clip = { texte: string; fichier: string; duration: number };
const metadata: Record<string, { clips: Clip[] }> = JSON.parse(readFileSync(resolve(process.cwd(), '../docs/audio-v1/enregistrements-dialogues-projets-consignes.json'), 'utf8'));
describe('recorded dialogue, project and first-grade instructions', () => {
  it.each([['ar', 7], ['fr', 8], ['en', 8]] as const)('%s exposes every supplied clip through the shared reader', (language, count) => {
    expect(metadata[language].clips).toHaveLength(count);
    const files = new Set<string>();
    for (const row of metadata[language].clips) {
      const recording = findRecordedSpeech(row.texte, language)!;
      expect(recording.src).toBe(`/sounds/preschool/${language}/${row.fichier}`);
      expect(recording.durationMs).toBe(Math.round(row.duration * 1000));
      expect(statSync(resolve(process.cwd(), 'public', recording.src.slice(1))).size).toBeGreaterThan(1000);
      files.add(recording.src);
    }
    expect(files.size).toBe(count);
  });
  it('uses the corrected nomination instructions in all first-grade thematic courses', () => {
    for (const lesson of ARABIC_1AP_THEMES) {
      expect(lesson.instructionAudioAr).not.toMatch(/^اسْمِ/);
      expect(findRecordedSpeech(lesson.instructionAudioAr!, 'ar-SA')).toBeDefined();
    }
  });
});
