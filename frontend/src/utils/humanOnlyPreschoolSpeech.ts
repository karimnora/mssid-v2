import { APPROVED_VALUES_RECORDINGS } from '../data/preschool/approvedValuesAudio';
import { recordedSpeechKey } from './recordedSpeechKey';

/** A reviewed exception authorizes an exact text/file pair, never device synthesis. */
export function isApprovedValuesRecording(text: string, source?: string): boolean {
  return !!source && APPROVED_VALUES_RECORDINGS.some(clip => clip.src === source && recordedSpeechKey(clip.text) === recordedSpeechKey(text));
}

/** Historical name: human-only by default, except the user's explicit approved-file exceptions. */
export function requiresHumanPreschoolRecording(text: string, source?: string): boolean {
  if (source && APPROVED_VALUES_RECORDINGS.some(clip => clip.src === source)) return !isApprovedValuesRecording(text, source);
  if (source && /values-(bismillah|alhamdulillah)-(prompt|success)\.mp3/.test(source)) return true;
  const plain = text.normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '').toLowerCase();
  return /بسم الله|الحمد لله|bismi?ll?ah|al[ -]?hamd[ou]+[ -]?li?ll?ah/.test(plain);
}
