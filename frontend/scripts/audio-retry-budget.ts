import { existsSync, readFileSync } from 'node:fs';
import { writeAudioJson } from './audio-atomic-json';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';

type Reservation = { texte: string; language: string; reservedAt: string };
type Ledger = { maxCalls: 10; authorization: string; attempts: Reservation[] };

/** Durable reservation BEFORE requesting a new take. Failed/uncertain requests consume a slot too. */
export function reserveAudioRetry(path: string, texte: string, language: string): Reservation | undefined {
  const ledger: Ledger = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {
    maxCalls: 10, authorization: 'Karim explicitly authorized at most 10 extra calls, one new take per text, cedar, 2026-11-13', attempts: [],
  };
  if (ledger.maxCalls !== 10 || !Array.isArray(ledger.attempts)) throw new Error('Invalid retry budget ledger');
  if (ledger.attempts.length >= 10 || ledger.attempts.some(attempt => attempt.language === language && recordedSpeechKey(attempt.texte) === recordedSpeechKey(texte))) return undefined;
  const reservation = { texte, language, reservedAt: new Date().toISOString() };
  ledger.attempts.push(reservation);
  writeAudioJson(path, ledger);
  return reservation;
}
