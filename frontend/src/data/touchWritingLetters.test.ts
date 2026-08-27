import { describe, expect, it } from 'vitest';
import {
  ARABIC_NUMBERS_EXTRA,
  ENGLISH_ITEMS,
  FRENCH_ITEMS,
  TAMAZIGHT_ITEMS,
  TOUCH_WRITING_COVERAGE,
} from './touchWritingLetters';

const LATIN_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
const LATIN_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function assertDrawable(items: typeof FRENCH_ITEMS) {
  for (const item of items) {
    expect(item.char.length).toBeGreaterThan(0);
    expect(item.strokesSvg.length).toBeGreaterThan(0);
    expect(item.dots.length).toBeGreaterThan(0);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  }
}

describe('touch writing letter coverage', () => {
  it('includes the full French cursive alphabet plus 3AP accents', () => {
    const chars = FRENCH_ITEMS.map((i) => i.char);
    expect(LATIN_LOWER.every((c) => chars.includes(c))).toBe(true);
    expect(['é', 'è', 'ê', 'à', 'ç'].every((c) => chars.includes(c))).toBe(true);
    expect(FRENCH_ITEMS.length).toBe(31);
    assertDrawable(FRENCH_ITEMS);
  });

  it('includes English print capitals and lower-case letters', () => {
    const caps = ENGLISH_ITEMS.filter((i) => i.id.startsWith('en_') && !i.id.startsWith('en_lo_'));
    const lows = ENGLISH_ITEMS.filter((i) => i.id.startsWith('en_lo_'));
    expect(caps.map((i) => i.char).sort().join('')).toBe(LATIN_UPPER.join(''));
    expect(lows.map((i) => i.char).sort().join('')).toBe(LATIN_LOWER.join(''));
    expect(ENGLISH_ITEMS.length).toBe(52);
    assertDrawable(ENGLISH_ITEMS);
  });

  it('includes the 31 IRCAM Tifinagh letters used in 4AP–5AP', () => {
    const expected = 'ⴰⴱⴳⴷⴹⴻⴼⴽⵀⵃⵄⵅⵇⵉⵊⵍⵎⵏⵓⵔⵕⵖⵙⵚⵛⵜⵟⵡⵢⵣⵥ';
    expect(TAMAZIGHT_ITEMS.map((i) => i.char).join('')).toBe(expected);
    expect(TAMAZIGHT_ITEMS.length).toBe(31);
    assertDrawable(TAMAZIGHT_ITEMS);
  });

  it('fills the missing Arabic digits 3, 4, 6, 7, 8, 9', () => {
    expect(TOUCH_WRITING_COVERAGE.extraArabicNumbers.join('')).toBe('346789');
    assertDrawable(ARABIC_NUMBERS_EXTRA);
  });
});
