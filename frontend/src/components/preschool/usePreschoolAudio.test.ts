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
  });

  it('routes speak() through the shared speakText() instead of window.speechSynthesis directly', () => {
    const { result } = renderHook(() => usePreschoolSpeech('fr'));
    act(() => {
      result.current.speak('Bonjour !');
    });
    expect(speakTextMock).toHaveBeenCalledWith('Bonjour !', 'fr-FR', 0.9, 1.1);
  });

  it('maps each préscolaire language to the matching speakText locale', () => {
    const { result: ar } = renderHook(() => usePreschoolSpeech('ar'));
    act(() => ar.current.speak('مرحباً'));
    expect(speakTextMock).toHaveBeenLastCalledWith('مرحباً', 'ar-SA', 0.9, 1.1);

    const { result: en } = renderHook(() => usePreschoolSpeech('en'));
    act(() => en.current.speak('Hello'));
    expect(speakTextMock).toHaveBeenLastCalledWith('Hello', 'en-US', 0.9, 1.1);
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
