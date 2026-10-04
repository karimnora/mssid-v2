import { speakText } from './speech';

export function speakArSafe(text: string) {
  try {
    void speakText(text, 'ar-SA').catch(() => undefined);
  } catch {
    // jsdom and some WebViews have no SpeechSynthesisUtterance.
  }
}

function audioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

function tone(frequencies: number[], durationMs: number, type: OscillatorType = 'sine') {
  const ctx = audioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  frequencies.forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now + index * 0.05);
    oscillator.stop(now + durationMs / 1000 + index * 0.05);
  });
}

export function playSoftSuccess() {
  tone([523.25, 659.25, 783.99], 160);
}

export function playSoftMiss() {
  tone([349.23, 329.63], 140);
}
