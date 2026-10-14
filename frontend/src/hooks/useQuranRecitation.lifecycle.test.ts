import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuranRecitation } from './useQuranRecitation';
import { primaryAyahUrl } from '../data/quranRecitation';

let audio: DeferredAudio;
class DeferredAudio extends EventTarget {
  src = ''; preload = ''; paused = true;
  rejects: ((error: Error) => void)[] = [];
  play = vi.fn(() => { this.paused = false; return new Promise<void>((_, reject) => this.rejects.push(reject)); });
  pause = vi.fn(() => { this.paused = true; });
  removeAttribute = vi.fn(() => { this.src = ''; });
  constructor() { super(); audio = this; }
}
beforeEach(() => vi.stubGlobal('Audio', DeferredAudio));
afterEach(() => vi.unstubAllGlobals());
const options = { surahNumber: 110, ayahCount: 3, onAyahIndex: vi.fn() };
const abort = () => new DOMException('Playback interrupted', 'AbortError');

describe('recitation playback lifetime', () => {
  it('does not start a fallback after Stop rejects the pending play', async () => {
    const { result } = renderHook(() => useQuranRecitation(options));
    act(() => result.current.playAyah(0)); act(() => result.current.stop());
    await act(async () => { audio.rejects[0](abort()); });
    expect(audio.play).toHaveBeenCalledTimes(1); expect(audio.src).toBe('');
    expect(result.current).toMatchObject({ mode: 'idle', failed: false });
  });
  it('does not start another playback after unmount', async () => {
    const { result, unmount } = renderHook(() => useQuranRecitation(options));
    act(() => result.current.playSurah()); unmount();
    await act(async () => { audio.rejects[0](abort()); });
    expect(audio.play).toHaveBeenCalledTimes(1); expect(audio.paused).toBe(true);
  });
  it('does not replace a newer verse when the earlier play rejects', async () => {
    const { result } = renderHook(() => useQuranRecitation(options));
    act(() => result.current.playAyah(0)); act(() => result.current.playAyah(1));
    await act(async () => { audio.rejects[0](abort()); });
    expect(audio.play).toHaveBeenCalledTimes(2); expect(audio.src).toBe(primaryAyahUrl(110, 2));
    expect(result.current).toMatchObject({ mode: 'ayah', playingAyah: 2, failed: false });
  });
  it('uses fallback for a current failure but ignores its late rejection after Stop', async () => {
    const { result } = renderHook(() => useQuranRecitation(options));
    act(() => result.current.playAyah(0));
    await act(async () => { audio.rejects[0](new Error('primary unavailable')); });
    expect(audio.play).toHaveBeenCalledTimes(2);
    act(() => result.current.stop());
    await act(async () => { audio.rejects[1](abort()); });
    expect(result.current).toMatchObject({ mode: 'idle', failed: false });
  });
});
