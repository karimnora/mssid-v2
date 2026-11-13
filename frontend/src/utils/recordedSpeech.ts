import { RECORDED_SPEECH_CATALOG } from '../data/recordedSpeechCatalog';
import { recordedSpeechKey } from './recordedSpeechKey';

export function findRecordedSpeech(text: string, language: string) {
  const code = language.split('-')[0];
  const catalog = Object.hasOwn(RECORDED_SPEECH_CATALOG, code) ? RECORDED_SPEECH_CATALOG[code] : undefined;
  const key = recordedSpeechKey(text);
  return catalog && Object.hasOwn(catalog, key) ? catalog[key] : undefined;
}

/** Reuse whole recorded sentences only when every part is covered. Never splice phonemes. */
export function findRecordedSpeechSequence(text: string, language: string) {
  const exact = findRecordedSpeech(text, language);
  if (exact) return [{ text, ...exact }];
  const sentences = text.trim().split(/(?<=[.!?؟])\s+/u);
  if (sentences.length < 2) return undefined;
  const sequence = sentences.map(sentence => {
    const clip = findRecordedSpeech(sentence, language);
    return clip ? { text: sentence, ...clip } : undefined;
  });
  return sequence.every(clip => clip !== undefined) ? sequence : undefined;
}

type PlaybackResult = 'played' | 'failed' | 'cancelled';
let active: { audio: HTMLAudioElement; finish: (result: PlaybackResult) => void } | null = null;

export function stopRecordedSpeech() {
  active?.finish('cancelled');
}

export function pauseRecordedSpeech(): boolean {
  if (!active) return false;
  active.audio.pause();
  return true;
}

export function resumeRecordedSpeech(): boolean {
  if (!active) return false;
  const playback = active;
  void playback.audio.play().catch(() => playback.finish('failed'));
  return true;
}

export function playRecordedSpeech(src: string, rate = 1): Promise<PlaybackResult> {
  stopRecordedSpeech();
  if (typeof Audio === 'undefined') return Promise.resolve('failed');
  return new Promise(resolve => {
    const audio = new Audio(src);
    audio.playbackRate = Math.min(2, Math.max(0.5, rate));
    let settled = false;
    const finish = (result: PlaybackResult) => {
      if (settled) return;
      settled = true;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
      if (active?.audio === audio) active = null;
      resolve(result);
    };
    active = { audio, finish };
    audio.onended = () => finish('played');
    audio.onerror = () => finish('failed');
    void audio.play().catch(() => finish('failed'));
  });
}
