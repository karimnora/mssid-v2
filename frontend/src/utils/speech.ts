/**
 * Speech Synthesis Utility.
 * Uses the native Android/iOS TTS engine (via @capacitor-community/text-to-speech) when running
 * inside the Capacitor app — the Android WebView's own `window.speechSynthesis` support is
 * unreliable (often zero voices, unlike a real Chrome install) — and falls back to the browser's
 * Web Speech API on the web.
 */

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { isFeatureEnabled } from '../featureFlags';
import { findRecordedSpeechSequence, playRecordedSpeech, stopRecordedSpeech,
  pauseRecordedSpeech, resumeRecordedSpeech } from './recordedSpeech';

const isNative = () => Capacitor.isNativePlatform();

let synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
let speechRequest = 0;
let finishSpeech: (() => void) | null = null;
let nativeStop: Promise<unknown> = Promise.resolve();

/**
 * Whether a voice matching `lang`'s prefix (e.g. "ar" for "ar-SA") is installed on this device.
 * `null` while still checking (voices load async and unreliably — see poll below), so callers can
 * avoid flashing a "no voice" warning during that window. Without this, TapSpeakButton looks live
 * but silently does nothing on a device with no Arabic voice pack — no feedback, just a dead tap.
 */
export function useVoiceAvailable(lang: string): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAvailable(null);
    const prefix = lang.split('-')[0].toLowerCase();

    if (isNative()) {
      TextToSpeech.isLanguageSupported({ lang })
        .then(({ supported }) => {
          if (!cancelled) setAvailable(supported);
        })
        .catch(() => {
          if (!cancelled) setAvailable(false);
        });
      return () => {
        cancelled = true;
      };
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAvailable(false);
      return;
    }
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = (): boolean => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return false;
      if (!cancelled) setAvailable(voices.some((v) => v.lang.toLowerCase().startsWith(prefix)));
      return true;
    };

    // Chrome commonly reports zero voices on the very first synchronous getVoices() call; poll for
    // up to ~2s as a fallback in case onvoiceschanged never fires (unreliable on some WebViews).
    const poll = () => {
      if (cancelled || check()) return;
      if (attempts >= 20) {
        setAvailable(false);
        return;
      }
      attempts += 1;
      timer = setTimeout(poll, 100);
    };
    poll();

    window.speechSynthesis.addEventListener?.('voiceschanged', check);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.speechSynthesis.removeEventListener?.('voiceschanged', check);
    };
  }, [lang]);

  return available;
}

export function speechLangForSubject(subject: string): 'fr-FR' | 'en-US' | 'ar-SA' {
  if (subject === 'french') return 'fr-FR';
  if (subject === 'english') return 'en-US';
  return 'ar-SA';
}

// UI copy (quiz feedback, playful snippets, badges) commonly mixes emoji into the text — but TTS
// engines, especially Android's native voices, often vocalize them literally (announcing "emoji" or
// the symbol's name) instead of skipping them. Replacing with a space (not '') avoids accidentally
// merging two words that were only separated by an emoji, e.g. "Bravo !🎉Continue" -> "Bravo ! Continue".
const NON_SPOKEN_SYMBOLS_REGEX = new RegExp(
  '[\\p{Extended_Pictographic}\\u{1F1E6}-\\u{1F1FF}\\u200D\\uFE0F\\u20E3]',
  'gu'
);

export function stripNonSpokenSymbols(text: string): string {
  return text.replace(NON_SPOKEN_SYMBOLS_REGEX, ' ').replace(/\s+/g, ' ').trim();
}

export const speakText = async (text: string, lang: 'fr-FR' | 'en-US' | 'ar-SA' = 'fr-FR', rate: number = 0.9, pitch: number = 1,
  options: { skipRecordedLookup?: boolean; recordedRate?: number; recordedOnly?: boolean; preferredRecording?: string } = {}): Promise<void> => {
  if (!isFeatureEnabled('voiceReading')) {
    return Promise.resolve();
  }

  let spokenText = stripNonSpokenSymbols(text);
  if (!spokenText) {
    return Promise.resolve();
  }

  stopSpeech();
  const request = speechRequest;
  // A preferred recording (V2 village pilot voice) is played whole, before any catalogue lookup.
  const recordings = options.skipRecordedLookup
    ? undefined
    : options.preferredRecording
      ? [{ src: options.preferredRecording, text: spokenText }]
      : findRecordedSpeechSequence(spokenText, lang);
  if (recordings) {
    for (const [index, recording] of recordings.entries()) {
      if (request !== speechRequest) return;
      const result = await playRecordedSpeech(recording.src, options.recordedRate ?? 1);
      if (result === 'cancelled' || request !== speechRequest) return;
      if (result === 'failed') {
        // Don't repeat sentences already heard if a later file fails.
        spokenText = recordings.slice(index).map(clip => clip.text).join(' ');
        break;
      }
      if (index === recordings.length - 1) return;
    }
  }

  if (options.recordedOnly) return;

  if (isNative()) {
    await nativeStop;
    if (request !== speechRequest) return;
    return new Promise<void>(resolve => {
      const finish = () => {
        if (finishSpeech === finish) finishSpeech = null;
        resolve();
      };
      finishSpeech = finish;
      void TextToSpeech.speak({
        text: spokenText,
        lang,
        rate,
        pitch,
        category: 'playback',
        queueStrategy: 0, // A new tap replaces the previous reading.
      }).catch((err) => {
        console.warn('Native text-to-speech failed.', err);
      }).then(finish);
    });
  }

  return new Promise((resolve) => {
    if (!synth || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this browser.');
      resolve();
      return;
    }

    const finish = () => {
      if (finishSpeech === finish) finishSpeech = null;
      resolve();
    };
    finishSpeech = finish;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = lang;
    utterance.rate = rate; // slightly slower for educational clarity
    utterance.pitch = pitch;

    // Select suitable voice if available
    const voices = synth.getVoices();
    if (voices.length > 0) {
      const matchedVoice = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = finish;
    utterance.onerror = finish;

    try {
      synth.speak(utterance);
    } catch {
      finish();
    }
  });
};

export const stopSpeech = () => {
  speechRequest++;
  stopRecordedSpeech();
  finishSpeech?.();
  finishSpeech = null;
  if (isNative()) {
    nativeStop = TextToSpeech.stop().catch(() => {
      // Nothing playing / already stopped — not worth surfacing.
    });
    return;
  }
  if (synth) {
    synth.cancel();
  }
};

export function pauseSpeech(): boolean {
  if (pauseRecordedSpeech()) return true;
  if (!isNative() && synth?.speaking) { synth.pause(); return true; }
  return false;
}

export function resumeSpeech(): boolean {
  if (resumeRecordedSpeech()) return true;
  if (!isNative() && synth?.paused) { synth.resume(); return true; }
  return false;
}
