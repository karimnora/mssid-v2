import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useVoiceEcho } from './useVoiceEcho';

class FakeRecorder {
  static created = 0;
  static isTypeSupported() { return true; }
  constructor() { FakeRecorder.created++; }
}

afterEach(() => vi.unstubAllGlobals());

describe('microphone permission lifecycle', () => {
  it.each(['NotAllowedError', 'PermissionDeniedError'])('reports a real %s permission denial', async (name) => {
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    vi.stubGlobal('navigator', { mediaDevices: {
      getUserMedia: vi.fn().mockRejectedValue(new DOMException('Permission denied', name)),
    } });
    const { result } = renderHook(() => useVoiceEcho());
    await act(async () => result.current.start());
    expect(result.current.phase).toBe('denied');
    expect(result.current.failed).toBe(false);
  });

  it('allows retrying when an authorized microphone is temporarily busy', async () => {
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    const capture = vi.fn().mockRejectedValue(new DOMException('Device busy', 'NotReadableError'));
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: capture } });
    const { result } = renderHook(() => useVoiceEcho());
    await act(async () => result.current.start());
    expect(result.current.phase).toBe('idle');
    expect(result.current.failed).toBe(true);
    await act(async () => result.current.start());
    expect(capture).toHaveBeenCalledTimes(2);
  });

  it('closes microphone tracks if the recorder cannot be constructed', async () => {
    class UnsupportedRecorder {
      static isTypeSupported() { return true; }
      constructor() { throw new Error('unsupported recorder'); }
    }
    vi.stubGlobal('MediaRecorder', UnsupportedRecorder);
    const closeTrack = vi.fn();
    vi.stubGlobal('navigator', { mediaDevices: {
      getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: closeTrack }] }),
    } });
    const { result } = renderHook(() => useVoiceEcho());
    await act(async () => result.current.start());
    expect(result.current.phase).toBe('idle');
    expect(result.current.failed).toBe(true);
    expect(closeTrack).toHaveBeenCalledTimes(1);
  });

  it('closes a microphone granted after leaving the activity without starting a recording', async () => {
    FakeRecorder.created = 0;
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    const closeTrack = vi.fn();
    let grant!: (stream: MediaStream) => void;
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: () => new Promise<MediaStream>(resolve => { grant = resolve; }) } });
    const view = renderHook(() => useVoiceEcho());
    let pending!: Promise<void>;
    act(() => { pending = view.result.current.start(); });
    view.unmount();
    await act(async () => {
      grant({ getTracks: () => [{ stop: closeTrack }] } as unknown as MediaStream);
      await pending;
    });
    expect(closeTrack).toHaveBeenCalledTimes(1);
    expect(FakeRecorder.created).toBe(0);
  });

  it('does not start recording if the activity resets while permission is pending', async () => {
    FakeRecorder.created = 0;
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    const closeTrack = vi.fn();
    let grant!: (stream: MediaStream) => void;
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia: () => new Promise<MediaStream>(resolve => { grant = resolve; }) } });
    const { result } = renderHook(() => useVoiceEcho());
    let pending!: Promise<void>;
    act(() => { pending = result.current.start(); });
    act(() => result.current.reset());
    await act(async () => {
      grant({ getTracks: () => [{ stop: closeTrack }] } as unknown as MediaStream);
      await pending;
    });
    expect(result.current.phase).toBe('idle');
    expect(closeTrack).toHaveBeenCalledTimes(1);
    expect(FakeRecorder.created).toBe(0);
  });
});
