import { describe, it, expect, afterEach, vi } from 'vitest';
import { speakText } from './speech';
import { setFeatureFlagOverride, resetFeatureFlagOverride } from '../featureFlags';

// jsdom doesn't implement SpeechSynthesisUtterance — only the speechSynthesis object itself is
// mocked globally in src/test/setup.ts.
class MockSpeechSynthesisUtterance {
  lang = '';
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}
(globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

// Regression test for the flag-functionality audit: voiceReading was declared in featureFlags.ts but
// never actually gated the real Web Speech API call — toggling it off did nothing. window.speechSynthesis
// is mocked globally in src/test/setup.ts.
describe('speakText — gated by the voiceReading feature flag', () => {
  afterEach(() => {
    resetFeatureFlagOverride('voiceReading');
    vi.clearAllMocks();
  });

  it('never calls speechSynthesis.speak when voiceReading is off', async () => {
    setFeatureFlagOverride('voiceReading', false);
    await speakText('مرحبا');
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('resolves even when voiceReading is off, so callers never hang waiting for narration', async () => {
    setFeatureFlagOverride('voiceReading', false);
    await expect(speakText('مرحبا')).resolves.toBeUndefined();
  });

  it('calls speechSynthesis.speak when voiceReading is on', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('مرحبا');
    expect(speakSpy).toHaveBeenCalled();
  });
});
