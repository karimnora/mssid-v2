import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { APPROVED_VALUES_RECORDINGS } from './approvedValuesAudio';
import { ISLAMIC_VALUES_MODULE } from './islamicValuesModule';
import { findRecordedSpeech } from '../../utils/recordedSpeech';
import { isApprovedValuesRecording, requiresHumanPreschoolRecording } from '../../utils/humanOnlyPreschoolSpeech';

describe('user-approved Basmala/Hamdala files', () => {
  it('has a complete set of prompts and rewards for every supplied language', () => {
    expect(APPROVED_VALUES_RECORDINGS).toHaveLength(12);
    expect(new Set(APPROVED_VALUES_RECORDINGS.map(clip => clip.language))).toEqual(new Set(['ar', 'fr', 'en']));
    for (const language of new Set(APPROVED_VALUES_RECORDINGS.map(clip => clip.language))) {
      const clips = APPROVED_VALUES_RECORDINGS.filter(clip => clip.language === language);
      expect(new Set(clips.map(clip => clip.activityId + ':' + clip.kind))).toEqual(new Set(['values-bismillah:prompt', 'values-bismillah:success', 'values-alhamdulillah:prompt', 'values-alhamdulillah:success']));
      expect(clips).toHaveLength(4);
    }
  });
  it.each(APPROVED_VALUES_RECORDINGS)('$language $activityId $kind uses the intact approved recording', clip => {
    const bytes = readFileSync(resolve(process.cwd(), 'public', clip.src.slice(1)));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(clip.sha256);
    expect(clip.durationMs).toBeGreaterThan(150);
    const content = ISLAMIC_VALUES_MODULE.activities.find(activity => activity.id === clip.activityId)!.i18n[clip.language];
    expect(clip.kind === 'prompt' ? content.promptAudioSrc : content.successAudioSrc).toBe(clip.src);
    expect(clip.kind === 'prompt' ? content.promptAudio : content.successAudio).toBe(clip.text);
    if (clip.kind === 'success') expect(content.successAudioDurationMs).toBe(clip.durationMs);
    expect(findRecordedSpeech(clip.text, clip.language)?.src).toBe(clip.src);
    expect(isApprovedValuesRecording(clip.text, clip.src)).toBe(true);
    expect(requiresHumanPreschoolRecording(clip.text, clip.src)).toBe(false);
    expect(requiresHumanPreschoolRecording(clip.text)).toBe(true);
    expect(requiresHumanPreschoolRecording('different text', clip.src)).toBe(true);
    expect(isApprovedValuesRecording(clip.text, 'https://unapproved.example' + clip.src)).toBe(false);
  });
});
