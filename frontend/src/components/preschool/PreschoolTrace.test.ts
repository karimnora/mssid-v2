import { describe, expect, it } from 'vitest';
import { glyphCoverage } from './PreschoolTrace';

function fakeMask(size: number, alpha = 255): ImageData {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 3; i < data.length; i += 4) data[i] = alpha;
  return { width: size, height: size, data } as ImageData;
}

describe('trace glyph coverage', () => {
  it('is zero without ink', () => {
    expect(glyphCoverage(fakeMask(16), [])).toBe(0);
  });

  it('rises when ink sits on the glyph, not merely when the stroke is long', () => {
    const mask = fakeMask(24);
    const far = [[{ x: -40, y: -40 }, { x: -20, y: -20 }]];
    const onGlyph = [[{ x: 12, y: 12 }, { x: 13, y: 13 }, { x: 14, y: 14 }]];
    expect(glyphCoverage(mask, far)).toBe(0);
    expect(glyphCoverage(mask, onGlyph)).toBeGreaterThan(0.4);
  });
});
