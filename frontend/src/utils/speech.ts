/**
 * Speech Synthesis Utility for Web Speech API
 * Provides vocalization (Text-To-Speech) for French, English, and Arabic.
 */

import { useEffect, useState } from 'react';
import { isFeatureEnabled } from '../featureFlags';

let synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

/**
 * Whether a voice matching `lang`'s prefix (e.g. "ar" for "ar-SA") is installed on this device.
 * `null` while still checking (voices load async and unreliably — see poll below), so callers can
 * avoid flashing a "no voice" warning during that window. Without this, TapSpeakButton looks live
 * but silently does nothing on a device with no Arabic voice pack — no feedback, just a dead tap.
 */
export function useVoiceAvailable(lang: string): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAvailable(false);
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const prefix = lang.split('-')[0].toLowerCase();

    const check = (): boolean => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return false;
      if (!cancelled) setAvailable(voices.some((v) => v.lang.toLowerCase().startsWith(prefix)));
      return true;
    };

    // Chrome commonly reports zero voices on the very first synchronous getVoices() call; poll for
    // up to ~2s as a fallback in case onvoiceschanged never fires (unreliable on some WebViews).
    const poll = () => {
      if (cancelled || check() || attempts >= 20) return;
      attempts += 1;
      setTimeout(poll, 100);
    };
    poll();

    window.speechSynthesis.onvoiceschanged = check;
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return available;
}

export function speechLangForSubject(subject: string): 'fr-FR' | 'en-US' | 'ar-SA' {
  if (subject === 'french') return 'fr-FR';
  if (subject === 'english') return 'en-US';
  return 'ar-SA';
}

export const speakText = (text: string, lang: 'fr-FR' | 'en-US' | 'ar-SA' = 'fr-FR', rate: number = 0.9): Promise<void> => {
  return new Promise((resolve) => {
    if (!isFeatureEnabled('voiceReading')) {
      resolve();
      return;
    }
    if (!synth || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser.');
      resolve();
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; // slightly slower for educational clarity

    // Select suitable voice if available
    const voices = synth.getVoices();
    if (voices.length > 0) {
      const matchedVoice = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    synth.speak(utterance);
  });
};

export const stopSpeech = () => {
  if (synth) {
    synth.cancel();
  }
};
