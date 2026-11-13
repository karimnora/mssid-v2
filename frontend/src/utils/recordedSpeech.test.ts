import { afterEach, describe, expect, it, vi } from 'vitest';
import { findRecordedSpeech, findRecordedSpeechSequence, playRecordedSpeech, stopRecordedSpeech } from './recordedSpeech';
import { recordedSpeechKey } from './recordedSpeechKey';

function fakeAudio() {
  return { onended: null as (() => void) | null, onerror: null as (() => void) | null,
    pause: vi.fn(), removeAttribute: vi.fn(), play: vi.fn().mockResolvedValue(undefined), playbackRate: 1 };
}

afterEach(() => { stopRecordedSpeech(); vi.unstubAllGlobals(); });

describe('reusing existing recordings safely', () => {
  it('ignores decorative Arabic stretching without erasing vowels', () => {
    expect(recordedSpeechKey('كِتَـاب')).toBe(recordedSpeechKey('كِتَاب'));
    expect(recordedSpeechKey('عَـلَم')).not.toBe(recordedSpeechKey('عِلْم'));
  });
  it('reuses complete Arabic sentences without matching a different vowel ending or a partial passage', () => {
    const clips = findRecordedSpeechSequence('هَذَا كِتَابٌ. هَذَا قَلَمٌ.', 'ar-SA');
    expect(clips?.map(clip => clip.src)).toEqual([
      '/sounds/preschool/ar/reading-first-school-book.mp3', '/sounds/preschool/ar/reading-first-school-pen.mp3',
    ]);
    expect(findRecordedSpeechSequence('هَذَا كِتَابًا.', 'ar-SA')).toBeUndefined();
    expect(findRecordedSpeechSequence('هَذَا كِتَابٌ. جُمْلَةٌ غَيْرُ مُسَجَّلَةٍ.', 'ar-SA')).toBeUndefined();
    expect(findRecordedSpeechSequence('هَذَا كِتَابٌ.', 'fr-FR')).toBeUndefined();
  });
  it('reuses the same French recording for whitespace variants but never another language', () => {
    const clip = findRecordedSpeech('Bravo ! Voici une pomme !', 'fr-FR');
    expect(clip?.src).toMatch(/^\/sounds\/preschool\/fr\//);
    expect(findRecordedSpeech('Bravo !  Voici une pomme !', 'fr-FR')).toEqual(clip);
    expect(findRecordedSpeech('Bravo ! Voici une pomme !', 'ar-SA')).toBeUndefined();
  });

  it('does not merge different vowel marks, accents, or untrusted object property names', () => {
    expect(recordedSpeechKey('عَلَم')).not.toBe(recordedSpeechKey('عِلْم'));
    expect(recordedSpeechKey('é')).not.toBe(recordedSpeechKey('e'));
    expect(findRecordedSpeech('constructor', 'fr-FR')).toBeUndefined();
    expect(findRecordedSpeech('hello', 'constructor')).toBeUndefined();
  });

  it('finishes at the actual end of the recording and supports playback speed', async () => {
    const audio = fakeAudio();
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    const completion = playRecordedSpeech('/clip.mp3', 1.25);
    expect(audio.playbackRate).toBe(1.25);
    audio.onended?.();
    await expect(completion).resolves.toBe('played');
    expect(audio.pause).toHaveBeenCalled();
  });

  it('settles a stopped request; a late rejection cannot disturb a newer recording', async () => {
    const old = fakeAudio();
    const next = fakeAudio();
    let reject!: (error: Error) => void;
    old.play.mockReturnValue(new Promise<void>((_, failure) => { reject = failure; }));
    vi.stubGlobal('Audio', vi.fn().mockImplementationOnce(function () { return old; })
      .mockImplementationOnce(function () { return next; }));
    const previous = playRecordedSpeech('/old.mp3');
    const current = playRecordedSpeech('/next.mp3');
    await expect(previous).resolves.toBe('cancelled');
    reject(new Error('late error'));
    await Promise.resolve();
    expect(next.pause).not.toHaveBeenCalled();
    next.onended?.();
    await expect(current).resolves.toBe('played');
  });

  it('reports a missing file for a single fallback instead of leaving playback pending', async () => {
    const audio = fakeAudio();
    audio.play.mockRejectedValue(new Error('missing'));
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    await expect(playRecordedSpeech('/missing.mp3')).resolves.toBe('failed');
  });
});
