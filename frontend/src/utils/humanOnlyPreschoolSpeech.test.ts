import { describe, it, expect } from 'vitest';
import { requiresHumanPreschoolRecording } from './humanOnlyPreschoolSpeech';
describe('human religious recordings', () => {
  it('blocks vocalized Arabic formulas and the known synthetic files', () => {
    expect(requiresHumanPreschoolRecording('بِسْمِ اللَّهِ! أَحْسَنْت!')).toBe(true);
    expect(requiresHumanPreschoolRecording('الْحَمْدُ لِلَّهِ!')).toBe(true);
    expect(requiresHumanPreschoolRecording('Bravo', '/sounds/preschool/ar/values-bismillah-success.mp3')).toBe(true);
    expect(requiresHumanPreschoolRecording('Bismillah')).toBe(true);
    expect(requiresHumanPreschoolRecording('Alhamdoulillah')).toBe(true);
  });
  it('does not block ordinary nonreligious guidance', () => {
    expect(requiresHumanPreschoolRecording('كَمْ زَهْرَةً تَرَى؟')).toBe(false);
  });
});
