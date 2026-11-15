import { describe, expect, it } from 'vitest';
import { recordingNormalizationDb } from './audio-recording-levels';

describe('quiet phoneme recovery without new billing', () => {
  it('preserves ordinary speech levels', () => expect(recordingNormalizationDb(0.07, 0.4, 4, false)).toBe(0));
  it('bounds the gain for the saved ta phoneme and makes it audible', () => {
    const gain = recordingNormalizationDb(0.000622, 0.002502, 1.45, true);
    expect(gain).toBe(30);
    expect(0.000622 * 10 ** (gain / 20)).toBeGreaterThan(0.01);
  });
  it('also recovers the very short saved la phoneme', () => {
    expect(recordingNormalizationDb(0.0007155, 0.0014954, 0.35, true)).toBeLessThanOrEqual(30);
  });
  it('rejects silence, noise without a usable peak and quiet full sentences', () => {
    expect(() => recordingNormalizationDb(0, 0, 1, true)).toThrow();
    expect(() => recordingNormalizationDb(0.0002, 0.0008, 1, true)).toThrow();
    expect(() => recordingNormalizationDb(0.000622, 0.002502, 1.45, false)).toThrow();
  });
  it('prevents clipping and rejects invalid duration or non-finite measurements', () => {
    const gain = recordingNormalizationDb(0.0005, 0.2, 1, true);
    expect(0.2 * 10 ** (gain / 20)).toBeCloseTo(0.9);
    expect(() => recordingNormalizationDb(0.04, 0.5, 70, false)).toThrow();
    expect(() => recordingNormalizationDb(NaN, 0.5, 1, false)).toThrow();
  });
});
