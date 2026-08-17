/**
 * Speech Synthesis Utility for Web Speech API
 * Provides vocalization (Text-To-Speech) for French, English, and Arabic.
 */

import { isFeatureEnabled } from '../featureFlags';

let synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

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
