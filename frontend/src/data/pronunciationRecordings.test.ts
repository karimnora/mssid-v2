import { describe, expect, it } from 'vitest';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRONUNCIATION_MODELS } from './pronunciationModels';
import { FIRST_READINGS } from './primaryShortReadings';
import { ARABIC_2AP_GAPS } from './courses/2AP/arabic-gaps';
import { findRecordedSpeech } from '../utils/recordedSpeech';

describe('recorded pronunciation and primary readings', () => {
  it.each(['fr', 'en'] as const)('%s has a separate recording for every pronunciation model', language => {
    const paths = new Set<string>();
    for (const model of PRONUNCIATION_MODELS[language]) {
      const clip = findRecordedSpeech(model.text, language)!;
      expect(clip.src).toBe(`/sounds/preschool/${language}/pronunciation-${language}-${model.id}.mp3`);
      expect(clip.durationMs).toBeGreaterThan(250);
      expect(statSync(resolve(process.cwd(), 'public', clip.src.slice(1))).size).toBeGreaterThan(1000);
      paths.add(clip.src);
    }
    expect(paths.size).toBe(16);
  });
  it('has recorded Arabic for every selected 1AP and 2AP scene', () => {
    const scenes = [...Object.values(FIRST_READINGS).flatMap(story => story.scenes), ...ARABIC_2AP_GAPS.flatMap(lesson => lesson.readingStory?.scenes ?? [])];
    expect(scenes).toHaveLength(15);
    for (const scene of scenes) {
      const clip = findRecordedSpeech(scene.textAr, 'ar-SA')!;
      expect(clip.src).toBe(`/sounds/preschool/ar/reading-${scene.id}.mp3`);
      expect(clip.durationMs).toBeGreaterThan(500);
      expect(statSync(resolve(process.cwd(), 'public', clip.src.slice(1))).size).toBeGreaterThan(1000);
    }
  });
});
