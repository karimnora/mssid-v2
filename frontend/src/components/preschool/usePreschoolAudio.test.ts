import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePreschoolSpeech, setPreschoolMuted } from './usePreschoolAudio';

// Regression test: usePreschoolSpeech used to talk to window.speechSynthesis directly, even on
// native Android — but that WebView API is unreliable there (often zero installed voices), which
// speakText() in utils/speech.ts already works around by routing native builds through the
// @capacitor-community/text-to-speech plugin instead. Result before this fix: préscolaire prompts
// could be silent on the app while working on the web (or vice versa, depending on recordedSrc
// fallbacks). These tests confirm usePreschoolSpeech now delegates to that shared, native-aware path.
const speakTextMock = vi.fn().mockResolvedValue(undefined);
const stopSpeechMock = vi.fn();
let voiceAvailableMock: boolean | null = true;

vi.mock('../../utils/speech', () => ({
  speakText: (...args: unknown[]) => speakTextMock(...args),
  stopSpeech: () => stopSpeechMock(),
  useVoiceAvailable: () => voiceAvailableMock,
}));

describe('usePreschoolSpeech', () => {
  beforeEach(() => {
    setPreschoolMuted(false);
    window.localStorage.removeItem('mssid_preschool_muted');
    speakTextMock.mockClear();
    stopSpeechMock.mockClear();
    voiceAvailableMock = true;
    vi.unstubAllGlobals();
  });

  it('routes speak() through the shared speakText() instead of window.speechSynthesis directly', () => {
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => {
      result.current.speak('Bonjour !');
    });
    expect(speakTextMock).toHaveBeenCalledWith('Bonjour !', 'fr-FR', 0.9, 1.1, { skipRecordedLookup: true });
  });

  it('maps each préscolaire language to the matching speakText locale', () => {
    const { result: ar } = renderHook(() => usePreschoolSpeech('ar'));
    act(() => ar.current.speak('مرحباً'));
    expect(speakTextMock).toHaveBeenLastCalledWith('مرحباً', 'ar-SA', 0.9, 1.1, { skipRecordedLookup: true });

    const { result: en } = renderHook(() => usePreschoolSpeech('en'));
    act(() => en.current.speak('Hello'));
    expect(speakTextMock).toHaveBeenLastCalledWith('Hello', 'en-US', 0.9, 1.1, { skipRecordedLookup: true });
  });

  it('never calls speakText while muted', () => {
    setPreschoolMuted(true);
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => {
      result.current.speak('Bonjour !');
    });
    expect(speakTextMock).not.toHaveBeenCalled();
  });

  it('stop() calls the shared stopSpeech(), so it also interrupts native TTS', () => {
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => {
      result.current.stop();
    });
    expect(stopSpeechMock).toHaveBeenCalled();
  });


  it('plays a recorded clip without using the device voice', async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { play, pause: vi.fn(), removeAttribute: vi.fn(), onended: null, onerror: null };
    const AudioMock = vi.fn(function () { return audio; });
    vi.stubGlobal('Audio', AudioMock);
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => result.current.speak('Touche la lettre A !', '/sounds/preschool/fr/letters-alif-rabbit-prompt.mp3'));
    expect(AudioMock).toHaveBeenCalledWith('/sounds/preschool/fr/letters-alif-rabbit-prompt.mp3');
    expect(play).toHaveBeenCalledOnce();
    expect(speakTextMock).not.toHaveBeenCalled();
    act(() => result.current.stop());
  });

  it('falls back to the correct language when a recorded clip fails', async () => {
    const audio = { play: vi.fn().mockRejectedValue(new Error('missing clip')), pause: vi.fn(), removeAttribute: vi.fn(), onended: null, onerror: null };
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    const { result } = renderHook(() => usePreschoolSpeech('ar'));
    await act(async () => result.current.speak('أَرْنَب', '/sounds/preschool/ar/letters-alif-rabbit-prompt.mp3'));
    expect(speakTextMock).toHaveBeenCalledWith('أَرْنَب', 'ar-SA', 0.9, 1.1, { skipRecordedLookup: true });
  });

  it('does not resume a stopped clip through TTS after a late playback failure', async () => {
    let reject!: (reason: Error) => void;
    const pending = new Promise<void>((_, failure) => { reject = failure; });
    const audio = { play: vi.fn().mockReturnValue(pending), pause: vi.fn(), removeAttribute: vi.fn(), onended: null, onerror: null };
    vi.stubGlobal('Audio', vi.fn(function () { return audio; }));
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => result.current.speak('Touche la lettre A !', '/sounds/preschool/fr/clip.mp3'));
    act(() => result.current.stop());
    await act(async () => reject(new Error('cancelled playback')));
    expect(speakTextMock).not.toHaveBeenCalled();
    expect(audio.pause).toHaveBeenCalled();
  });

  it('reports hasVoice=true while useVoiceAvailable is still checking (null), not just when confirmed', () => {
    voiceAvailableMock = null;
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    expect(result.current.hasVoice).toBe(true);
  });

  it('reports hasVoice=false only once useVoiceAvailable confirms no voice is installed', () => {
    voiceAvailableMock = false;
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    expect(result.current.hasVoice).toBe(false);
  });
});
