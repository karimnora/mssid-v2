import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playSoundBoxClip, stopSoundBoxClip, setPreschoolMuted } from './usePreschoolAudio';

class FakeAudio {
  static instances: FakeAudio[] = [];
  src = ''; preload = ''; volume = 1;
  onended: (() => void) | null = null;
  onplaying: (() => void) | null = null;
  error: (() => void) | null = null;
  pause = vi.fn(); load = vi.fn(); removeAttribute = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  constructor() { FakeAudio.instances.push(this); }
  addEventListener(_event: string, callback: () => void) { this.error = callback; }
}

beforeEach(() => {
  vi.useFakeTimers();
  setPreschoolMuted(false);
  FakeAudio.instances = [];
  vi.stubGlobal('Audio', FakeAudio);
});
afterEach(() => { stopSoundBoxClip(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('real sound playback', () => {
  it('starts the duration limit only once audio is actually playing', () => {
    playSoundBoxClip('dog', 4000);
    const audio = FakeAudio.instances[0];
    vi.advanceTimersByTime(8000);
    expect(audio.pause).not.toHaveBeenCalled();
    audio.onplaying?.();
    vi.advanceTimersByTime(4000);
    expect(audio.pause).toHaveBeenCalledTimes(1);
  });

  it('ignores late callbacks from a replaced sound', () => {
    playSoundBoxClip('dog');
    const old = FakeAudio.instances[0];
    const ended = old.onended;
    playSoundBoxClip('cat');
    const current = FakeAudio.instances[1];
    ended?.();
    old.error?.();
    expect(current.pause).not.toHaveBeenCalled();
    expect(old.play).toHaveBeenCalledTimes(1);
  });

  it('does not retry a cancelled sound after a late load error', () => {
    playSoundBoxClip('dog');
    const audio = FakeAudio.instances[0];
    stopSoundBoxClip();
    audio.error?.();
    expect(audio.play).toHaveBeenCalledTimes(1);
  });
});
