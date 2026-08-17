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
    let cancelled = false;
    let attempts = 0;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) voicesRef.current = voices;
      return voices.length > 0;
    };

    // Chrome commonly reports zero voices on the very first synchronous getVoices() call, and the
    // Android WebView this app ships in (via Capacitor) doesn't reliably fire onvoiceschanged at
    // all — so relying on that event alone silently leaves voicesRef empty forever on some devices.
    // Poll for up to ~2s as a fallback so a slow-to-init voice list still gets picked up.
    const poll = () => {
      if (cancelled || loadVoices() || attempts >= 20) return;
      attempts += 1;
      setTimeout(poll, 100);
    };
    poll();

    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      cancelled = true;
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel(); // never queue — a new prompt always interrupts the previous one

    // Defensive re-check right before speaking: some engines only populate getVoices() lazily on
    // access rather than proactively, so the polling above can still miss a voice that exists.
    if (voicesRef.current.length === 0) {
      voicesRef.current = window.speechSynthesis.getVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voicesRef.current, language);
    if (voice) {
      utterance.voice = voice;
    } else if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
      // No installed voice matches this locale. Chrome/WebView can silently produce NO sound at all
      // in this case (no error event fires) instead of degrading to a default voice — this is the
      // most common real-world cause of "the Arabic audio doesn't work": the device's OS-level TTS
      // engine (e.g. Android's Google Text-to-Speech) simply has no Arabic voice pack downloaded.
      console.warn(
        `[mssid preschool] No TTS voice found for locale "${language}". ` +
        `Available on this device: ${voicesRef.current.map((v) => v.lang).join(', ') || '(none loaded)'}. ` +
        `On Android, install the Arabic voice pack via Settings > System > Languages > Text-to-speech output.`
      );
    }
    utterance.lang = BCP47_BY_LANGUAGE[language][0];
    utterance.rate = 0.9; // slightly slower — easier for a 3-5 year old to follow
    utterance.pitch = 1.1; // slightly higher — friendlier "mascot" tone
    utterance.onerror = (event) => {
      console.warn('[mssid preschool] Speech synthesis failed:', event.error);
    };
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

/** Rich musical note synthesizer for Xylophone, Piano, Marimba, Flute, Mandole/Oud, and Percussion */
export function playMusicalNote(
  freq: number,
  instrument: 'xylophone' | 'piano' | 'marimba' | 'flute' | 'mandole' | 'darbuka' = 'xylophone'
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (instrument === 'xylophone') {
    // Pure sine with bright overtone bell clang
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3, now); // 3rd harmonic

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 1.25);
    osc2.stop(now + 0.35);
  } else if (instrument === 'piano') {
    // Acoustic Piano: Fundamental + 2nd harmonic + 3rd harmonic with realistic hammer envelope
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 1.85);
    osc2.stop(now + 1.85);
    osc3.stop(now + 1.85);
  } else if (instrument === 'marimba') {
    // Warm woody resonance with wooden mallet pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(freq * 4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain).connect(ctx.destination);
    clickOsc.connect(clickGain).connect(ctx.destination);

    osc.start(now);
    clickOsc.start(now);
    osc.stop(now + 0.75);
    clickOsc.stop(now + 0.05);
  } else if (instrument === 'flute') {
    // Gasba / Ney: Warm airy breathy tone with gentle vibrato
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle breath vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5, now); // 5Hz vibrato
    lfoGain.gain.setValueAtTime(3, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 1.1);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.05);
  } else if (instrument === 'mandole') {
    // Algerian Mandole / Oud: Plucked acoustic string with rich harmonics & decay
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.45);
    osc2.stop(now + 1.45);
  } else {
    // darbuka
    // Low tuned percussion pitch for melody
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.7, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

/** Procedural sound effects for the Sound Explorer (Animals, Algerian Heritage, Nature, Instruments) */
export function playExplorationSound(soundKey: string) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  switch (soundKey) {
    case 'fennec': {
      // High-pitched playful chirp of the Sahara fennec fox
      [0, 0.12, 0.24].forEach((offset, idx) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400 + idx * 200, t);
        osc.frequency.exponentialRampToValueAtTime(2200, t + 0.08);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
      break;
    }
    case 'camel': {
      // Sahara camel gentle bellow / vocalization
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.3);
      osc.frequency.linearRampToValueAtTime(95, now + 0.85);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
      break;
    }
    case 'darbuka_dum':
    case 'darbuka': {
      // Algerian Darbouka DOUM (deep bass center strike)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.3);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
      break;
    }
    case 'darbuka_tak': {
      // Algerian Darbouka TAK (crisp sharp rim strike)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    }
    case 'bendir': {
      // Bendir: Low frame drum resonant thump + snare vibration
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.5);
      osc2.stop(now + 0.2);
      break;
    }
    case 'karkabou': {
      // Metallic rhythmic clack of Gnawa Qarqabu
      [0, 0.06].forEach((offset) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      });
      break;
    }
    case 'gasba': {
      // Traditional Algerian Gasba flute phrase
      [0, 0.18, 0.36].forEach((offset, idx) => {
        const t = now + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime([440, 523.25, 587.33][idx], t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.17);

        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
      break;
    }
    case 'sea': {
      // Mediterranean Algerian Sea wave swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.5);
      osc.frequency.linearRampToValueAtTime(80, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.35);
      break;
    }
    default: {
      playSuccessChime();
      break;
    }
  }
}
