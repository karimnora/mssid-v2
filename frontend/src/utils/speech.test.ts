import { describe, it, expect, afterEach, vi } from 'vitest';
import { speakText, speechLangForSubject } from './speech';
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

  it('passes the requested language through to the utterance', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('Bonjour', 'fr-FR');
    expect(speakSpy.mock.calls[0][0].lang).toBe('fr-FR');
    await speakText('Hello', 'en-US');
    expect(speakSpy.mock.calls[1][0].lang).toBe('en-US');
    await speakText('مرحبا', 'ar-SA');
    expect(speakSpy.mock.calls[2][0].lang).toBe('ar-SA');
  });
});

// Regression test: Android's native TTS (and some Web Speech voices) vocalize emoji literally
// instead of skipping them — a lesson snippet like "🟢 Niveau 1 — Facile" would be read as
// "green circle Niveau 1 dash Facile" instead of just the words.
describe('speakText — strips emoji before handing text to the TTS engine', () => {
  afterEach(() => {
    resetFeatureFlagOverride('voiceReading');
    vi.clearAllMocks();
  });

  it('removes emoji from the spoken text, keeping the words intact', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('🟢 Niveau 1 — Facile', 'fr-FR');
    expect(speakSpy.mock.calls[0][0].text).toBe('Niveau 1 — Facile');
  });

  it('keeps a space between words that were only separated by an emoji', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('Bravo !🎉Continue comme ça', 'fr-FR');
    expect(speakSpy.mock.calls[0][0].text).toBe('Bravo ! Continue comme ça');
  });

  it('removes flag emoji and ZWJ-joined emoji sequences entirely', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('🇩🇿 الجزائر بلدي', 'ar-SA');
    expect(speakSpy.mock.calls[0][0].text).toBe('الجزائر بلدي');
  });

  it('never calls the TTS engine when the text is only emoji', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak);
    await speakText('🎉✨', 'fr-FR');
    expect(speakSpy).not.toHaveBeenCalled();
  });

  it('leaves ordinary text with no emoji unchanged', async () => {
    setFeatureFlagOverride('voiceReading', true);
    const speakSpy = vi.mocked(window.speechSynthesis.speak).mockImplementation((utterance: any) => {
      utterance.onend?.();
    });
    await speakText('ami / une amie', 'fr-FR');
    expect(speakSpy.mock.calls[0][0].text).toBe('ami / une amie');
  });
});

describe('speechLangForSubject', () => {
  it('uses the lesson language instead of a hardcoded ar-SA', () => {
    expect(speechLangForSubject('french')).toBe('fr-FR');
    expect(speechLangForSubject('english')).toBe('en-US');
    expect(speechLangForSubject('arabic')).toBe('ar-SA');
    expect(speechLangForSubject('math')).toBe('ar-SA');
  });
});

