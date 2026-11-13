import { mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { writeAudioJson } from './audio-atomic-json';

const fixtures: string[] = [];
const fixture = () => { const directory = mkdtempSync(join(tmpdir(), 'mssid-audio-save-')); fixtures.push(directory); return join(directory, 'metadata.json'); };
afterEach(() => { for (const directory of fixtures.splice(0)) {
  if (!resolve(directory).startsWith(`${resolve(tmpdir())}${sep}mssid-audio-save-`)) throw new Error('Unexpected fixture');
  rmSync(directory, { recursive: true, force: true });
} });
describe('local audio metadata persistence', () => {
  it('recovers a transient Windows file lock without losing the new data', () => {
    const path = fixture(); writeFileSync(path, '{"old":true}'); let attempts = 0;
    writeAudioJson(path, { saved: true }, (from, to) => {
      if (++attempts < 3) throw Object.assign(new Error('locked'), { code: 'EPERM' });
      renameSync(from, to);
    }, () => undefined);
    expect(attempts).toBe(3);
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ saved: true });
  });
  it('preserves the previous file when saving is persistently denied', () => {
    const path = fixture(); writeFileSync(path, '{"old":true}');
    expect(() => writeAudioJson(path, { saved: true }, () => { throw Object.assign(new Error('locked'), { code: 'EACCES' }); }, () => undefined)).toThrow('locked');
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ old: true });
  });
});
