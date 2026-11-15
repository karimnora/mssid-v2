/** Import verified, exact matches from the V2 audit. No generation or API credentials. */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverV2Root, importV2Recording, loadRecordingLibrary } from './v2-recording-library';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const audit = JSON.parse(readFileSync(resolve(root, 'docs/audits/audio-2026-11-13/connections.json'), 'utf8'));
const library = loadRecordingLibrary(discoverV2Root(root));
const requested = new Map<string, { text: string; language: string; voice?: string }>();
for (const row of audit.missing) if (row.v2Src) requested.set(`${row.language}:${row.text}`, { text: row.text, language: row.language, voice: row.v2Voice });
let reused = 0;
for (const row of requested.values()) {
  const recording = library.find(row.text, row.language, row.voice);
  if (!recording) throw new Error('Source no longer matches the audited text; refusing reuse');
  if (process.argv.includes('--apply')) importV2Recording(root, recording);
  reused++;
}
console.log(JSON.stringify({ exactVerifiedMatches: reused, applied: process.argv.includes('--apply'), paidCalls: 0 }));
