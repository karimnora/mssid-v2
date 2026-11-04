import { describe, it, expect } from 'vitest';
import { parseChildNumber, sameAnswer } from './childNumber';

describe('parseChildNumber (Algerian school convention)', () => {
  it('reads the decimal comma, the point and the Arabic decimal sign', () => {
    expect(parseChildNumber('232,5')).toBe(232.5);
    expect(parseChildNumber('232.5')).toBe(232.5);
    expect(parseChildNumber('٢٣٢٫٥')).toBe(232.5);
  });
  it('ignores thousands spaces, including the narrow no-break space used in the lessons', () => {
    expect(parseChildNumber('2 340 506')).toBe(2340506);
    expect(parseChildNumber('2\u202F340\u202F506')).toBe(2340506);
    expect(parseChildNumber('1\u202F000,00')).toBe(1000);
  });
  it('rejects text', () => {
    expect(parseChildNumber('أكبر')).toBeNull();
    expect(parseChildNumber('')).toBeNull();
  });
  it('compares numbers by value and words by text', () => {
    expect(sameAnswer('5,40', '5,4')).toBe(true);
    expect(sameAnswer('3.75', 3.75)).toBe(true);
    expect(sameAnswer('5,4', '5,5')).toBe(false);
    expect(sameAnswer(' أكبر ', 'أكبر')).toBe(true);
    expect(sameAnswer('', '')).toBe(false);
  });
});
