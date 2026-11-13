/** Reject silent speech; narrowly allow quiet isolated phonemes with bounded local gain. */
export function recordingNormalizationDb(rms: number, peak: number, duration: number, isolatedPhoneme: boolean): number {
  if (![rms, peak, duration].every(Number.isFinite) || duration < 0.15 || duration > 60 || peak > 1 || rms < 0 || peak < 0) throw new Error('Unexpected recording measurements');
  if (rms >= 0.001) return 0;
  if (!isolatedPhoneme || rms < 0.0001 || peak < 0.001) throw new Error('Silent or unexpected recording level');
  return Math.min(30, 20 * Math.log10(0.02 / rms), 20 * Math.log10(0.9 / peak));
}
