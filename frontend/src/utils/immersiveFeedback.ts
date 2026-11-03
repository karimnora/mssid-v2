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

/** Item dropping into the basket. */
export function playPop() {
  tone([880, 1174.66], 90, 'triangle');
}

/** A coin or a note put on the counter. */
export function playCoin() {
  tone([1975.53, 2637.02], 120, 'triangle');
}

/** Cash register when the change is right. */
export function playRegister() {
  tone([1046.5, 1318.51, 1567.98, 2093], 260, 'square');
}
