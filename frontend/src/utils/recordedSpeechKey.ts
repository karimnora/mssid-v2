/** Preserve accents, Arabic vowel marks, case and punctuation: these affect pronunciation. */
export function recordedSpeechKey(text: string): string {
  return text.normalize('NFC').replace(/\s+/gu, ' ').trim();
}
