import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { reserveAudioRetry } from './audio-retry-budget';

const temporaryDirectories: string[] = [];
const fixture = () => {
  const directory = mkdtempSync(join(tmpdir(), 'mssid-audio-budget-'));
  temporaryDirectories.push(directory); return join(directory, 'ledger.json');
};
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    if (!resolve(directory).startsWith(`${resolve(tmpdir())}${sep}mssid-audio-budget-`)) throw new Error('Unexpected fixture directory');
    rmSync(directory, { recursive: true, force: true });
  }
});
describe('the explicitly authorized ten extra audio calls', () => {
  it('refuses an eleventh reservation, including after process restart', () => {
    const path = fixture();
    for (let i = 0; i < 10; i++) expect(reserveAudioRetry(path, `texte ${i}`, 'ar')).toBeDefined();
    expect(reserveAudioRetry(path, 'un autre texte', 'ar')).toBeUndefined();
    expect(JSON.parse(readFileSync(path, 'utf8')).attempts).toHaveLength(10);
  });
  it('never reserves a second paid retry of the same text and language', () => {
    const path = fixture();
    expect(reserveAudioRetry(path, 'تَ', 'ar')).toBeDefined();
    expect(reserveAudioRetry(path, ' تَـ ', 'ar')).toBeUndefined();
    expect(JSON.parse(readFileSync(path, 'utf8')).attempts).toHaveLength(1);
  });
});
