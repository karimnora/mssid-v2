import { useCallback, useEffect, useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { speakText, stopSpeech, useVoiceAvailable } from '../../utils/speech';
import { findRecordedSpeech } from '../../utils/recordedSpeech';
import { resolveRecordingUrl } from '../../utils/recordingUrl';

// ─── Global mute (TTS + SFX + loops) ─────────────────────────────────────────
const MUTE_STORAGE_KEY = 'mssid_preschool_muted';
const muteListeners = new Set<() => void>();

function readStoredMute(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

let preschoolMuted = readStoredMute();

export function isPreschoolMuted(): boolean {
  return preschoolMuted;
}

function silenceAllPreschoolAudio() {
  stopRecordedClip();
  stopSoundBoxClip();
  stopMotionAudio();
  stopSpeech();
  if (sharedAudioCtx && sharedAudioCtx.state === 'running') {
    void sharedAudioCtx.suspend();
  }
}

export function setPreschoolMuted(next: boolean) {
  if (preschoolMuted === next) return;
  preschoolMuted = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MUTE_STORAGE_KEY, next ? '1' : '0');
    } catch {
      /* ignore quota / private mode */
    }
  }
  if (next) {
    silenceAllPreschoolAudio();
  } else {
    resumeTownAudio();
  }
  muteListeners.forEach((listener) => listener());
}

export function togglePreschoolMute(): boolean {
  setPreschoolMuted(!preschoolMuted);
  return preschoolMuted;
}

/** React hook — mute state synced across all preschool screens. */
export function usePreschoolMute() {
  const [muted, setMuted] = useState(isPreschoolMuted);
  useEffect(() => {
    const sync = () => setMuted(isPreschoolMuted());
    muteListeners.add(sync);
    return () => {
      muteListeners.delete(sync);
    };
  }, []);
  return {
    muted,
    toggle: () => togglePreschoolMute(),
    setMuted: setPreschoolMuted,
  };
}

// TTS for "Amine le Fennec" and activity prompts — routed through the shared speakText()/
// useVoiceAvailable() from utils/speech.ts instead of talking to window.speechSynthesis directly.
// This used to have its own parallel implementation that always used window.speechSynthesis, even
// on native Android — but that WebView API is unreliable there (often reports zero installed
// voices), which is exactly the problem speakText() already solved for the rest of the app (native
// builds go through the @capacitor-community/text-to-speech plugin instead). Result before this fix:
// préscolaire prompts could be silent on the native app while working fine on web, or vice versa
// depending on which items had a recordedSrc fallback and which fell through to raw TTS.
const BCP47_BY_LANGUAGE: Record<PreschoolLanguage, 'ar-SA' | 'fr-FR' | 'en-US'> = {
  ar: 'ar-SA',
  fr: 'fr-FR',
  en: 'en-US',
};

let recordedClip: HTMLAudioElement | null = null;

function stopRecordedClip() {
  if (!recordedClip) return;
  recordedClip.onended = null;
  recordedClip.onerror = null;
  recordedClip.pause();
  recordedClip.removeAttribute('src');
  recordedClip = null;
}

function playRecordedClip(src: string, onFail: () => void) {
  if (isPreschoolMuted()) return;
  stopRecordedClip();
  if (typeof Audio === 'undefined') {
    onFail();
    return;
  }
  const audio = new Audio(resolveRecordingUrl(src));
  recordedClip = audio;
  audio.onended = () => {
    if (recordedClip === audio) recordedClip = null;
  };
  const fallback = () => {
    // A previous request may fail after another clip started or after the user stopped playback.
    if (recordedClip !== audio || isPreschoolMuted()) return;
    stopRecordedClip();
    onFail();
  };
  audio.onerror = fallback;
  audio.play().catch(fallback);
}

export function usePreschoolSpeech(language: PreschoolLanguage) {
  const lang = BCP47_BY_LANGUAGE[language];
  // null while still checking (native: TextToSpeech.isLanguageSupported; web: polling getVoices())
  // — treated as "has a voice" so the UI doesn't flash a "no voice" warning during that window.
  const voiceAvailable = useVoiceAvailable(lang);
  const hasVoice = voiceAvailable !== false;

  const speakTts = useCallback((text: string) => {
    if (isPreschoolMuted() || !text) return;
    // speakText() already swallows and logs its own errors on both the native and web paths.
    void speakText(text, lang, 0.9, 1.1, { skipRecordedLookup: true });
  }, [lang]);

  const stop = useCallback(() => {
    stopRecordedClip();
    stopSpeech();
  }, []);

  const speak = useCallback((text: string, recordedSrc?: string) => {
    if (isPreschoolMuted()) {
      stop();
      return;
    }
    stopRecordedClip();
    stopSpeech();
    const source = recordedSrc ?? findRecordedSpeech(text, lang)?.src;
    if (source) {
      playRecordedClip(source, () => speakTts(text));
      return;
    }
    speakTts(text);
  }, [speakTts, stop, lang]);

  return { speak, stop, hasVoice };
}

// Short, synthesized feedback tones via the Web Audio API — no audio asset files needed, works
// instantly offline. Kept deliberately soft (no harsh "buzzer" on error, per the UX audit: mistakes
// should never feel punitive at this age).
let sharedAudioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (isPreschoolMuted()) return null;
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

/** Unlock Web Audio after a tap (browser autoplay policy). */
export function resumeTownAudio() {
  if (isPreschoolMuted()) return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

/** Real field recordings for the Sound Box — never a synthesized imitation. */
let boxAudio: HTMLAudioElement | null = null;
let boxTimer: ReturnType<typeof setTimeout> | null = null;

export function stopSoundBoxClip() {
  if (boxTimer) {
    clearTimeout(boxTimer);
    boxTimer = null;
  }
  if (boxAudio) {
    boxAudio.onended = null;
    boxAudio.onplaying = null;
    boxAudio.onerror = null;
    boxAudio.pause();
    boxAudio.removeAttribute('src');
    boxAudio.load();
    boxAudio = null;
  }
}

export function playSoundBoxClip(soundKey: string, maxMs = 4000) {
  if (isPreschoolMuted()) return;
  stopSoundBoxClip();
  resumeTownAudio();
  const audio = new Audio();
  boxAudio = audio;
  audio.preload = 'auto';
  audio.volume = 0.95;
  const mp3 = `/sounds/box/${soundKey}.mp3`;
  const ogg = `/sounds/box/${soundKey}.ogg`;
  let fallbackStarted = false;
  const tryFallback = () => {
    if (boxAudio !== audio || isPreschoolMuted() || fallbackStarted) return;
    fallbackStarted = true;
    audio.src = ogg;
    void audio.play().catch(() => { if (boxAudio === audio) stopSoundBoxClip(); });
  };
  audio.addEventListener('error', () => {
    tryFallback();
  }, { once: true });
  audio.onended = () => { if (boxAudio === audio) stopSoundBoxClip(); };
  audio.onplaying = () => {
    if (boxAudio !== audio || boxTimer) return;
    boxTimer = setTimeout(() => { if (boxAudio === audio) stopSoundBoxClip(); }, maxMs);
  };
  audio.src = mp3;
  void audio.play().catch(tryFallback);
}

function playSoft(frequencies: number[], durationMs: number, type: OscillatorType, peak = 0.12) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = now + i * 0.04;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationMs / 1000 + 0.03);
  });
}

let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const n = Math.floor(ctx.sampleRate * 1.2);
  noiseBuffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

function playSweep(
  startHz: number,
  endHz: number,
  dur: number,
  type: OscillatorType,
  peak: number,
  delay = 0,
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startHz, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(endHz, 20), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function playNoiseBurst(dur: number, peak: number, freq = 800, q = 2, delay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export type TownVehicleKind = 'bike' | 'car' | 'moto' | 'train' | 'taxi';
export type FarmWalker = 'rabbit' | 'chick' | 'sheep' | 'tractor' | 'goat' | 'horse' | 'hen' | 'cow' | 'duck' | 'cat' | 'dog' | 'donkey' | 'rooster' | 'bee';

function playHorn(delay = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  [370, 311].forEach((hz) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = hz;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

function playBikeBell() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const ring = (delay: number) => {
    const t = ctx.currentTime + delay;
    [{ hz: 2489, peak: 0.16 }, { hz: 3729, peak: 0.06 }].forEach(({ hz, peak }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.58);
    });
  };
  ring(0);
  ring(0.16);
}

function playTrainWhistle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [0, 0.38].forEach((off, i) => {
    const t = now + off;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = i === 0 ? 660 : 523;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  });
  playSweep(90, 55, 0.5, 'sawtooth', 0.05);
}

function playMotoRev() {
  playSweep(80, 240, 0.22, 'sawtooth', 0.1);
  playSweep(240, 130, 0.28, 'sawtooth', 0.08, 0.2);
  playNoiseBurst(0.18, 0.05, 900, 1.2);
}

/** Klaxon, sonnette, vrombissement ou sifflet — au démarrage du véhicule. */
export function playVehicleStart(kind: TownVehicleKind) {
  resumeTownAudio();
  if (kind === 'bike') playBikeBell();
  else if (kind === 'moto') playMotoRev();
  else if (kind === 'train') playTrainWhistle();
  else if (kind === 'taxi') {
    playHorn(0);
    playHorn(0.22);
  } else {
    playHorn(0);
    playSweep(70, 110, 0.25, 'sawtooth', 0.07, 0.05);
  }
}

export function playEngineTick(kind: TownVehicleKind) {
  if (kind === 'bike') playSoft([620], 50, 'triangle', 0.04);
  else if (kind === 'moto') playSoft([85], 40, 'sawtooth', 0.035);
  else if (kind === 'train') playSoft([140, 90], 70, 'square', 0.04);
  else playSoft([95], 45, 'triangle', 0.04);
}

export function playPotholeThud() {
  playSweep(90, 40, 0.16, 'triangle', 0.16);
  playNoiseBurst(0.12, 0.08, 180, 1);
}

/** Vibrating animal cry (baaa, mêêê) — formant + LFO, never a flat beep. */
function playVibratoCry(opts: {
  startHz: number;
  endHz: number;
  dur: number;
  lfoHz: number;
  lfoDepth: number;
  peak: number;
  delay?: number;
  type?: OscillatorType;
}) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const t = ctx.currentTime + (opts.delay ?? 0);
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = opts.type ?? 'sawtooth';
  osc.frequency.setValueAtTime(opts.startHz, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(opts.endHz, 30), t + opts.dur);
  lfo.type = 'sine';
  lfo.frequency.value = opts.lfoHz;
  lfoGain.gain.value = opts.lfoDepth;
  filter.type = 'bandpass';
  filter.frequency.value = (opts.startHz + opts.endHz) / 2;
  filter.Q.value = 2.2;
  lfo.connect(lfoGain).connect(osc.frequency);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(opts.peak, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + opts.dur + 0.03);
  lfo.stop(t + opts.dur + 0.03);
}

/** Long vibrating « baaa » — two bleats, like a real sheep. */
export function playSheepBaa() {
  resumeTownAudio();
  playVibratoCry({ startHz: 340, endHz: 175, dur: 0.85, lfoHz: 7.5, lfoDepth: 42, peak: 0.16 });
  playVibratoCry({ startHz: 300, endHz: 160, dur: 0.55, lfoHz: 8, lfoDepth: 36, peak: 0.12, delay: 0.95 });
}

export function playCatMeow() {
  resumeTownAudio();
  playSweep(820, 380, 0.18, 'sine', 0.14);
  playSweep(380, 560, 0.16, 'sine', 0.1, 0.16);
}

/** Two sharp « waf waf » bursts — noisy bark, not a musical note. */
export function playDogBark() {
  resumeTownAudio();
  const bark = (delay: number) => {
    playNoiseBurst(0.09, 0.16, 850, 1.1, delay);
    playSweep(560, 220, 0.1, 'sawtooth', 0.18, delay);
    playSweep(300, 140, 0.11, 'square', 0.08, delay);
  };
  bark(0);
  bark(0.24);
}

function playCowMoo() {
  playVibratoCry({ startHz: 155, endHz: 78, dur: 0.95, lfoHz: 5, lfoDepth: 14, peak: 0.18 });
}

function playHorseNeigh() {
  playSweep(720, 420, 0.12, 'sawtooth', 0.08);
  playSweep(480, 700, 0.1, 'sawtooth', 0.07, 0.1);
  playSweep(650, 280, 0.28, 'sawtooth', 0.09, 0.2);
}

function playHenCluck() {
  [0, 0.11, 0.22].forEach((d) => {
    playSweep(420, 280, 0.07, 'square', 0.07, d);
    playNoiseBurst(0.05, 0.04, 1200, 3, d);
  });
}

function playChickPeep() {
  playSweep(2100, 1800, 0.08, 'sine', 0.1, 0);
  playSweep(2100, 1800, 0.08, 'sine', 0.1, 0.12);
}

function playGoatBleat() {
  playVibratoCry({ startHz: 480, endHz: 290, dur: 0.38, lfoHz: 16, lfoDepth: 52, peak: 0.14 });
  playVibratoCry({ startHz: 450, endHz: 270, dur: 0.32, lfoHz: 15, lfoDepth: 48, peak: 0.11, delay: 0.42 });
}

function playRabbitSqueak() {
  playSweep(1400, 1100, 0.07, 'sine', 0.08);
  playNoiseBurst(0.05, 0.04, 600, 2, 0.04);
}

function playDuckQuack() {
  [0, 0.16, 0.32].forEach((d) => {
    playNoiseBurst(0.08, 0.1, 900, 3, d);
    playSweep(520, 280, 0.1, 'sawtooth', 0.12, d);
  });
}

function playDonkeyBray() {
  playVibratoCry({ startHz: 420, endHz: 520, dur: 0.28, lfoHz: 9, lfoDepth: 18, peak: 0.14 });
  playVibratoCry({ startHz: 280, endHz: 140, dur: 0.55, lfoHz: 6, lfoDepth: 22, peak: 0.16, delay: 0.26 });
}

function playRoosterCrow() {
  playSweep(380, 820, 0.2, 'sawtooth', 0.12);
  playSweep(820, 540, 0.18, 'sawtooth', 0.11, 0.18);
  playSweep(560, 980, 0.32, 'sawtooth', 0.13, 0.34);
}

function playLionRoar() {
  playNoiseBurst(0.9, 0.12, 220, 0.8);
  playVibratoCry({ startHz: 180, endHz: 70, dur: 1.05, lfoHz: 4, lfoDepth: 18, peak: 0.2 });
}

function playMouseSqueak() {
  [0, 0.12, 0.24].forEach((d) => {
    playSweep(2400, 1900, 0.07, 'sine', 0.1, d);
  });
}

function playFrogCroak() {
  [0, 0.22, 0.44].forEach((d) => {
    playVibratoCry({ startHz: 220, endHz: 140, dur: 0.16, lfoHz: 22, lfoDepth: 30, peak: 0.14, delay: d });
  });
}

function playBeeBuzz() {
  playVibratoCry({ startHz: 260, endHz: 240, dur: 1.1, lfoHz: 18, lfoDepth: 12, peak: 0.1, type: 'sawtooth' });
  playNoiseBurst(1.0, 0.04, 400, 1);
}

function playCricketChirp() {
  [0, 0.12, 0.24, 0.48, 0.6, 0.72].forEach((d) => {
    playSweep(5200, 4800, 0.05, 'square', 0.05, d);
  });
}

function playOwlHoot() {
  playSweep(420, 380, 0.28, 'sine', 0.12);
  playSweep(420, 360, 0.35, 'sine', 0.11, 0.42);
}

function playBirdTweet() {
  [0, 0.1, 0.2, 0.38].forEach((off, i) => {
    playSweep(1800 + i * 90, 2500, 0.07, 'sine', 0.1, off);
  });
}

function playThunder() {
  playSweep(90, 35, 0.18, 'triangle', 0.22);
  playNoiseBurst(0.9, 0.16, 120, 0.6, 0.04);
  playSweep(70, 28, 0.7, 'sawtooth', 0.08, 0.2);
}

function playFireCrackling() {
  [0, 0.12, 0.28, 0.4, 0.55, 0.72, 0.9].forEach((d) => {
    playNoiseBurst(0.08, 0.07, 1800 + (d * 400) % 800, 2, d);
  });
  playSweep(180, 90, 1.0, 'sawtooth', 0.03);
}

function playRiver() {
  playNoiseBurst(1.2, 0.1, 900, 0.7);
  playSweep(180, 140, 1.1, 'sine', 0.05);
}

function playAmbulanceSiren() {
  [0, 0.32, 0.64, 0.96].forEach((d, i) => {
    const hi = i % 2 === 0;
    playSweep(hi ? 880 : 620, hi ? 860 : 600, 0.28, 'sine', 0.14, d);
  });
}

function playHelicopter() {
  [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72].forEach((d) => {
    playNoiseBurst(0.05, 0.09, 280, 1.4, d);
  });
}

function playBoatHorn() {
  playSweep(180, 175, 0.55, 'square', 0.12);
  playSweep(175, 170, 0.4, 'square', 0.1, 0.7);
}

function playPhoneRing() {
  const ring = (delay: number) => {
    playSweep(440, 440, 0.18, 'sine', 0.1, delay);
    playSweep(480, 480, 0.18, 'sine', 0.1, delay);
  };
  ring(0);
  ring(0.22);
  ring(0.55);
  ring(0.77);
}

function playKettleWhistle() {
  playSweep(1800, 2400, 1.1, 'sine', 0.1);
  playSweep(1800, 2400, 1.1, 'triangle', 0.04);
}

function playDoorbell() {
  playSweep(784, 784, 0.35, 'sine', 0.14);
  playSweep(659, 659, 0.5, 'sine', 0.14, 0.32);
}

function playPanClang() {
  playSweep(620, 180, 0.12, 'square', 0.12);
  playNoiseBurst(0.1, 0.1, 2500, 2);
  playSweep(900, 400, 0.35, 'triangle', 0.06, 0.04);
}

function playFootsteps() {
  [0, 0.28, 0.56, 0.84].forEach((d) => {
    playNoiseBurst(0.07, 0.1, 180, 1.2, d);
    playSweep(120, 60, 0.08, 'triangle', 0.08, d);
  });
}

function playScissorsSnip() {
  [0, 0.22, 0.44].forEach((d) => {
    playNoiseBurst(0.04, 0.1, 3200, 4, d);
    playSweep(1400, 600, 0.05, 'triangle', 0.06, d);
  });
}

function playLaugh() {
  [0, 0.14, 0.28, 0.44].forEach((d, i) => {
    playSweep(380 - i * 20, 280 - i * 15, 0.1, 'sawtooth', 0.1, d);
  });
}

function playSneeze() {
  playSweep(280, 400, 0.12, 'sine', 0.08);
  playNoiseBurst(0.16, 0.16, 1400, 1, 0.12);
  playSweep(500, 180, 0.1, 'sawtooth', 0.08, 0.14);
}

function playClap() {
  [0, 0.16].forEach((d) => {
    playNoiseBurst(0.06, 0.18, 1800, 1.5, d);
  });
}

function playBabyCry() {
  playVibratoCry({ startHz: 620, endHz: 420, dur: 0.45, lfoHz: 6, lfoDepth: 30, peak: 0.14 });
  playVibratoCry({ startHz: 580, endHz: 380, dur: 0.5, lfoHz: 6.5, lfoDepth: 28, peak: 0.12, delay: 0.5 });
}

function playBusHorn() {
  playHorn(0);
  playSweep(90, 70, 0.2, 'sawtooth', 0.08, 0.02);
  playHorn(0.28);
}

function playTractorStart() {
  playSweep(70, 110, 0.3, 'sawtooth', 0.1);
  playNoiseBurst(0.25, 0.06, 200, 1);
}

/** Cri de l’animal (ou démarrage du tracteur) — au premier mouvement. */
export function playFarmStart(kind: FarmWalker) {
  resumeTownAudio();
  const recorded: FarmWalker[] = ['sheep', 'cow', 'hen', 'horse', 'cat', 'dog', 'rooster', 'bee'];
  if (recorded.includes(kind)) {
    playSoundBoxClip(kind, 2500);
    return;
  }
  if (kind === 'tractor') playTractorStart();
  else if (kind === 'chick') playChickPeep();
  else if (kind === 'goat') playGoatBleat();
  else if (kind === 'duck') playDuckQuack();
  else if (kind === 'donkey') playDonkeyBray();
  else playRabbitSqueak();
}

export function playFarmStep(kind: FarmWalker) {
  if (kind === 'tractor') playNoiseBurst(0.06, 0.05, 140, 1);
  else playNoiseBurst(0.05, 0.035, 500, 2);
}

export function playFenceBump() {
  playSweep(200, 90, 0.12, 'triangle', 0.1);
  playNoiseBurst(0.08, 0.05, 400, 2);
}

export function playPondSplash() {
  playNoiseBurst(0.22, 0.1, 900, 1);
  playSweep(420, 160, 0.2, 'sine', 0.06);
}

type StopFn = () => void;
let motionStop: StopFn | null = null;
let motionKey: string | null = null;
let cryTimer: ReturnType<typeof setInterval> | null = null;

function stopCryTimer() {
  if (cryTimer !== null) {
    clearInterval(cryTimer);
    cryTimer = null;
  }
}

/** Coupe moteur / pas / cris — appeler en quittant le niveau. */
export function stopMotionAudio() {
  motionStop?.();
  motionStop = null;
  motionKey = null;
  stopCryTimer();
}

function startEngineLoop(opts: { hz: number; type: OscillatorType; peak: number; noise: number; lfoHz: number }): StopFn {
  const ctx = getAudioContext();
  if (!ctx) return () => {};
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.exponentialRampToValueAtTime(opts.peak, ctx.currentTime + 0.1);

  const osc = ctx.createOscillator();
  osc.type = opts.type;
  osc.frequency.value = opts.hz;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = opts.hz * 6;
  osc.connect(filter).connect(master);
  osc.start();

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = opts.lfoHz;
  lfoGain.gain.value = opts.hz * 0.08;
  lfo.connect(lfoGain).connect(osc.frequency);
  lfo.start();

  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  noise.loop = true;
  const nFilter = ctx.createBiquadFilter();
  nFilter.type = 'bandpass';
  nFilter.frequency.value = 400;
  nFilter.Q.value = 0.8;
  const nGain = ctx.createGain();
  nGain.gain.value = opts.noise;
  noise.connect(nFilter).connect(nGain).connect(master);
  noise.start();

  return () => {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    window.setTimeout(() => {
      try { osc.stop(); lfo.stop(); noise.stop(); } catch { /* already stopped */ }
      try { master.disconnect(); } catch { /* already disconnected */ }
    }, 130);
  };
}

function startClickLoop(everyMs: number, click: () => void): StopFn {
  click();
  const id = window.setInterval(click, everyMs);
  return () => window.clearInterval(id);
}

/** Moteur / sonnette / rails tant que l’enfant avance en ville. */
export function setTownMoving(kind: TownVehicleKind, moving: boolean) {
  if (isPreschoolMuted()) {
    stopMotionAudio();
    return;
  }
  resumeTownAudio();
  const key = `town:${kind}`;
  if (!moving) {
    if (motionKey === key) stopMotionAudio();
    return;
  }
  if (motionKey === key) return;
  stopMotionAudio();
  motionKey = key;
  if (kind === 'bike') {
    motionStop = startClickLoop(170, () => playNoiseBurst(0.04, 0.045, 1800, 4));
  } else if (kind === 'moto') {
    motionStop = startEngineLoop({ hz: 95, type: 'sawtooth', peak: 0.07, noise: 0.04, lfoHz: 12 });
  } else if (kind === 'train') {
    const engine = startEngineLoop({ hz: 48, type: 'sawtooth', peak: 0.07, noise: 0.03, lfoHz: 3 });
    const wheels = startClickLoop(260, () => playSoft([140, 90], 70, 'square', 0.05));
    motionStop = () => { engine(); wheels(); };
  } else {
    motionStop = startEngineLoop({
      hz: kind === 'taxi' ? 68 : 58,
      type: 'sawtooth',
      peak: 0.065,
      noise: 0.035,
      lfoHz: 8,
    });
  }
}

/** Tracteur, pas et cris d’animaux tant que l’enfant avance à la ferme. */
export function setFarmMoving(kind: FarmWalker, moving: boolean) {
  if (isPreschoolMuted()) {
    stopMotionAudio();
    return;
  }
  resumeTownAudio();
  const key = `farm:${kind}`;
  if (!moving) {
    if (motionKey === key) stopMotionAudio();
    return;
  }
  if (motionKey === key) return;
  stopMotionAudio();
  motionKey = key;
  if (kind === 'tractor') {
    motionStop = startEngineLoop({ hz: 42, type: 'sawtooth', peak: 0.08, noise: 0.05, lfoHz: 2.2 });
    return;
  }
  const stepEvery = kind === 'cow' || kind === 'horse' || kind === 'donkey' ? 280
    : kind === 'bee' ? 140
    : 200;
  motionStop = startClickLoop(stepEvery, () => playFarmStep(kind));
  const cry = () => playFarmStart(kind);
  cryTimer = setInterval(cry, 2200);
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
      playNoiseBurst(1.3, 0.12, 400, 0.6);
      playSweep(140, 90, 1.25, 'sine', 0.08);
      playSweep(90, 160, 0.6, 'sine', 0.05, 0.5);
      break;
    }
    case 'sheep':
      playSheepBaa();
      break;
    case 'cat':
      playCatMeow();
      break;
    case 'cow':
      playCowMoo();
      break;
    case 'hen':
    case 'chicken':
      playHenCluck();
      break;
    case 'horse':
      playHorseNeigh();
      break;
    case 'goat':
      playGoatBleat();
      break;
    case 'chick':
      playChickPeep();
      break;
    case 'rabbit':
      playRabbitSqueak();
      break;
    case 'duck':
      playDuckQuack();
      break;
    case 'lion':
      playLionRoar();
      break;
    case 'mouse':
      playMouseSqueak();
      break;
    case 'frog':
      playFrogCroak();
      break;
    case 'bee':
      playBeeBuzz();
      break;
    case 'cricket':
      playCricketChirp();
      break;
    case 'owl':
      playOwlHoot();
      break;
    case 'car':
      playHorn(0);
      playHorn(0.22);
      break;
    case 'taxi':
      playHorn(0);
      playHorn(0.2);
      playHorn(0.4);
      break;
    case 'bus':
      playBusHorn();
      break;
    case 'truck':
      playSweep(140, 130, 0.35, 'square', 0.12);
      playSweep(130, 125, 0.28, 'square', 0.1, 0.4);
      break;
    case 'moto':
      playMotoRev();
      break;
    case 'tractor':
      playTractorStart();
      break;
    case 'train':
      playTrainWhistle();
      break;
    case 'bike':
      playBikeBell();
      break;
    case 'ambulance':
      playAmbulanceSiren();
      break;
    case 'helicopter':
      playHelicopter();
      break;
    case 'boat':
      playBoatHorn();
      break;
    case 'dog':
      playDogBark();
      break;
    case 'bird':
      playBirdTweet();
      break;
    case 'plane':
      playSweep(180, 420, 0.8, 'sawtooth', 0.07);
      playNoiseBurst(0.7, 0.05, 600, 0.8);
      break;
    case 'rain':
      playNoiseBurst(1.1, 0.1, 2400, 0.5);
      [0.05, 0.14, 0.22, 0.31, 0.4, 0.52, 0.63, 0.75, 0.88].forEach((off) => {
        playSweep(1900, 1600, 0.04, 'sine', 0.05, off);
      });
      break;
    case 'wind':
      playSweep(400, 180, 1.1, 'sawtooth', 0.05);
      playNoiseBurst(1.0, 0.08, 500, 0.5);
      break;
    case 'thunder':
      playThunder();
      break;
    case 'fire':
      playFireCrackling();
      break;
    case 'river':
      playRiver();
      break;
    case 'water':
      [0, 0.12, 0.24, 0.38, 0.52].forEach((off) => {
        playNoiseBurst(0.1, 0.09, 1400, 1.4, off);
        playSweep(700, 280, 0.12, 'sine', 0.05, off);
      });
      break;
    case 'door':
      playSweep(140, 70, 0.08, 'triangle', 0.14);
      playNoiseBurst(0.06, 0.08, 200, 1, 0.05);
      playSweep(90, 50, 0.12, 'triangle', 0.1, 0.14);
      break;
    case 'clock':
      [0, 0.28, 0.56, 0.84].forEach((off) => {
        playSweep(1100, 900, 0.05, 'square', 0.07, off);
        playSweep(780, 640, 0.05, 'triangle', 0.05, off + 0.14);
      });
      break;
    case 'phone':
      playPhoneRing();
      break;
    case 'kettle':
      playKettleWhistle();
      break;
    case 'doorbell':
      playDoorbell();
      break;
    case 'pan':
      playPanClang();
      break;
    case 'footsteps':
      playFootsteps();
      break;
    case 'scissors':
      playScissorsSnip();
      break;
    case 'rooster':
      playRoosterCrow();
      break;
    case 'donkey':
      playDonkeyBray();
      break;
    case 'laugh':
      playLaugh();
      break;
    case 'sneeze':
      playSneeze();
      break;
    case 'clap':
      playClap();
      break;
    case 'baby':
      playBabyCry();
      break;
    default: {
      playSuccessChime();
      break;
    }
  }
}
