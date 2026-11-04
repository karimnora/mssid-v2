/**
 * Missions are written with « _ » between the periods of a big number (« 45_300_018 ») so the
 * source stays readable; the child sees the Algerian thin space U+202F (« 45 300 018 »).
 * Only a « _ » between a digit and three digits is replaced.
 */
const PERIOD = /(?<=\d)_(?=\d{3}(?!\d))/g;

export function withThinSpaces<T>(value: T): T {
  if (typeof value === 'string') return value.replace(PERIOD, ' ') as T;
  if (Array.isArray(value)) return value.map((v) => withThinSpaces(v)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withThinSpaces(v)])) as T;
  }
  return value;
}
