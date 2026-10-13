import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { speakText, stopSpeech } from './speech';
import { setFeatureFlagOverride, resetFeatureFlagOverride } from '../featureFlags';

const native = vi.hoisted(() => ({ stop: vi.fn(), speak: vi.fn() }));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@capacitor-community/text-to-speech', () => ({ TextToSpeech: native }));

const makeAudio = () => ({ onended: null as (() => void) | null, onerror: null as (() => void) | null,
  pause: vi.fn(), removeAttribute: vi.fn(), play: vi.fn().mockResolvedValue(undefined), playbackRate: 1 });

beforeEach(() => {
  native.stop.mockReset().mockResolvedValue(undefined);
  native.speak.mockReset().mockResolvedValue(undefined);
  setFeatureFlagOverride('voiceReading', true);
});
afterEach(() => { stopSpeech(); resetFeatureFlagOverride('voiceReading'); vi.unstubAllGlobals(); });

describe('recorded and native speech coordination', () => {
  it('uses the existing recording before native TTS', async () => {
    const audio = makeAudio();
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    const speaking = speakText('Bravo ! Voici une pomme !', 'fr-FR');
    expect(native.speak).not.toHaveBeenCalled();
    audio.onended?.();
    await speaking;
    expect(native.speak).not.toHaveBeenCalled();
  });

  it('falls back once in the requested language when a recording fails', async () => {
    const audio = makeAudio();
    audio.play.mockRejectedValue(new Error('missing recording'));
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    await speakText('Bravo ! Voici une pomme !', 'fr-FR');
    expect(native.speak).toHaveBeenCalledTimes(1);
    expect(native.speak).toHaveBeenCalledWith(expect.objectContaining({ lang: 'fr-FR' }));
  });

  it('never restarts a cancelled recording as native speech after a late error', async () => {
    const audio = makeAudio();
    let reject!: (error: Error) => void;
    audio.play.mockReturnValue(new Promise<void>((_, failure) => { reject = failure; }));
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    const speaking = speakText('Bravo ! Voici une pomme !', 'fr-FR');
    stopSpeech();
    await speaking;
    reject(new Error('late failure'));
    await Promise.resolve();
    expect(native.speak).not.toHaveBeenCalled();
  });

  it('waits for native stop and does not start a request cancelled during that wait', async () => {
    let finishStop!: () => void;
    native.stop.mockImplementationOnce(() => new Promise<void>(resolve => { finishStop = resolve; }));
    const speaking = speakText('A new sentence with no recording.', 'en-US');
    expect(native.speak).not.toHaveBeenCalled();
    stopSpeech();
    finishStop();
    await speaking;
    expect(native.speak).not.toHaveBeenCalled();
  });

  it('settles native playback when stopped even if the plugin never finishes its old promise', async () => {
    native.speak.mockReturnValue(new Promise<void>(() => {}));
    const speaking = speakText('A new sentence with no recording.', 'en-US');
    await Promise.resolve();
    await Promise.resolve();
    expect(native.speak).toHaveBeenCalledTimes(1);
    stopSpeech();
    await speaking;
  });
});
