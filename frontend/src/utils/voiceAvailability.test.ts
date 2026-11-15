import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useVoiceAvailable } from './speech';

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => false } }));
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('voice discovery completes without blocking lessons', () => {
  it('reports unavailable after the empty-voice polling window', async () => {
    vi.useFakeTimers();
    vi.spyOn(window.speechSynthesis, 'getVoices').mockReturnValue([]);
    const { result, unmount } = renderHook(() => useVoiceAvailable('ar-SA'));
    expect(result.current).toBeNull();
    await act(async () => { await vi.advanceTimersByTimeAsync(2100); });
    expect(result.current).toBe(false);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('accepts the requested language and does not mistake a French voice for Arabic', () => {
    vi.spyOn(window.speechSynthesis, 'getVoices').mockReturnValue([{ lang: 'fr-FR' } as SpeechSynthesisVoice]);
    const { result } = renderHook(() => useVoiceAvailable('ar-SA'));
    expect(result.current).toBe(false);
  });
});
