import { useCallback, useEffect, useRef } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';

// Web Speech API TTS wrapper — MVP voice for "Amine le Fennec" and activity prompts. Browser Arabic
// TTS quality is mediocre (see mssid UX audit notes), so this is explicitly a placeholder: swap for
// pre-recorded professional voice-overs per language once produced, behind the same `speak()` call
// signature so no calling component needs to change.
const BCP47_BY_LANGUAGE: Record<PreschoolLanguage, string[]> = {
  // Try Algerian/Arabic locales in order of preference; browsers rarely ship 'ar-DZ' voices, so we
  // fall back through generic Arabic locales rather than failing silently.
  ar: ['ar-DZ', 'ar-SA', 'ar'],
  fr: ['fr-FR', 'fr'],
  en: ['en-US', 'en-GB', 'en'],
};

function pickVoice(voices: SpeechSynthesisVoice[], language: PreschoolLanguage): SpeechSynthesisVoice | undefined {
  for (const locale of BCP47_BY_LANGUAGE[language]) {
    const exact = voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase());
    if (exact) return exact;
  }
  const prefix = language;
  return voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
}

export function usePreschoolSpeech(language: PreschoolLanguage) {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel(); // never queue — a new prompt always interrupts the previous one
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voicesRef.current, language);
    if (voice) utterance.voice = voice;
    utterance.lang = BCP47_BY_LANGUAGE[language][0];
    utterance.rate = 0.9; // slightly slower — easier for a 3-5 year old to follow
    utterance.pitch = 1.1; // slightly higher — friendlier "mascot" tone
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}

// Short, synthesized feedback tones via the Web Audio API — no audio asset files needed, works
// instantly offline. Kept deliberately soft (no harsh "buzzer" on error, per the UX audit: mistakes
// should never feel punitive at this age).
let sharedAudioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) sharedAudioCtx = new AudioCtx();
  return sharedAudioCtx;
}

function playTone(frequencies: number[], durationMs: number, type: OscillatorType = 'sine') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = now + i * (durationMs / 1000);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationMs / 1000 + 0.02);
  });
}

/** Cheerful ascending "Ding!" — played on every correct answer. */
export function playSuccessChime() {
  playTone([523.25, 659.25, 783.99], 140); // C5 - E5 - G5
}

/** Very soft two-note dip — played on a wrong tap. Deliberately not harsh: encourages retry, never scolds. */
export function playGentleNudge() {
  playTone([392, 349.23], 160, 'sine'); // G4 -> F4, soft
}

/** Bigger celebratory flourish — played once when a whole module (all steps) is completed. */
export function playModuleCompleteFanfare() {
  playTone([523.25, 659.25, 783.99, 1046.5], 150);
}

/** Light, high-pitched "pop" — played per bubble in the bubble_pop mini-game. Distinct from the
 * fuller success chime so repeated pops don't feel like repeated "you finished!" signals. */
export function playBubblePop() {
  playTone([880, 1108.73], 90, 'triangle');
}
