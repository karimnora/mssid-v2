/**
 * Reads a number the way a child types it in Algeria: Arabic-Indic or Western digits, decimal
 * comma (or point, or ٫), thousands separated by spaces, U+202F or ٬. Returns null for non-numbers.
 */
export function parseChildNumber(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  let s = input
    .normalize('NFKC')
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s\u202F\u00A0٬']/g, '')
    .replace(/[٫,]/g, '.')
    .replace(/^[−–]/, '-');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const value = Number(s);
  return Number.isFinite(value) ? value : null;
}

/** True when both read as the same number, or as the same text once trimmed. */
export function sameAnswer(given: string | number | null | undefined, expected: string | number | null | undefined): boolean {
  const a = parseChildNumber(given);
  const b = parseChildNumber(expected);
  if (a !== null && b !== null) return Math.abs(a - b) < 1e-9;
  return String(given ?? '').trim() === String(expected ?? '').trim() && String(expected ?? '').trim() !== '';
}
