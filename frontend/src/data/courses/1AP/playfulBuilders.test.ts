import { describe, expect, it } from 'vitest';
import { oppositeChoice } from './playfulBuilders';

describe('1AP tap builders', () => {
  it('turns a number solution into a nearby wrong tap', () => {
    expect(oppositeChoice('3')).toBe('4');
    expect(oppositeChoice('0')).toBe('1');
  });

  it('turns a spatial word into its opposite picture-word', () => {
    expect(oppositeChoice('فَوْقَ الغُصْنِ')).toBe('تَحْتَ 👇');
    expect(oppositeChoice('دَاخِلَ السَّلَّةِ')).toBe('خَارِجٌ 🚪');
  });
});
