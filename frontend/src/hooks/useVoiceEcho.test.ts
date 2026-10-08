import { describe, expect, it, vi } from 'vitest';
import { pickRecorderMime } from './useVoiceEcho';

describe('pickRecorderMime', () => {
  it('picks the first type MediaRecorder accepts', () => {
    vi.stubGlobal('MediaRecorder', {
      isTypeSupported: (type: string) => type === 'audio/webm',
    });
    expect(pickRecorderMime()).toBe('audio/webm');
  });

  it('returns undefined when no candidate is supported', () => {
    vi.stubGlobal('MediaRecorder', {
      isTypeSupported: () => false,
    });
    expect(pickRecorderMime()).toBeUndefined();
  });
});
