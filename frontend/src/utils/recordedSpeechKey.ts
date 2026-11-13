/** Preserve pronunciation marks; tatweel is purely visual and must not trigger a new paid clip. */
export function recordedSpeechKey(text: string): string {
  return text.normalize('NFC').replace(/\u0640/gu, '').replace(/\s+/gu, ' ').trim();
}
