/** Freeze missing authored speech and reuse V2 before any billable production. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as firstSurahs from '../src/data/courses/1AP/shortSurahs';
import * as secondSurahs from '../src/data/courses/2AP/shortSurahs';
import { discoverV2Root, loadRecordingLibrary, importV2Recording } from './v2-recording-library';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directory = resolve(root, 'docs/audio-v1/cours-1ap-2ap/completion');
type Request = { texte: string; targets: { lessonId: string; grade: string; subject: string; category: string; key: string }[] };
const pending: Request[] = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1/cours-1ap-2ap/ar-manquants.json'), 'utf8'));
// This is only a conservative exclusion screen, never a recording lookup key.
const screen = (text: string) => text.normalize('NFD').replace(/[\p{M}\u0640]/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const verses = Object.values({ ...firstSurahs, ...secondSurahs }).filter(Array.isArray).flat().map(verse => screen(verse.verseAr)).filter(verse => verse.length >= 10);
const v2 = loadRecordingLibrary(discoverV2Root(root));
const held: Request[] = [];
const reused: string[] = [];
const sections = new Map<string, Request[]>();
for (const job of pending) {
  const existing = v2.find(job.texte, 'ar', 'cedar');
  if (existing) { importV2Recording(root, existing); reused.push(job.texte); continue; }
  const normalized = ` ${screen(job.texte)} `;
  if (verses.some(verse => normalized.includes(` ${verse} `))) { held.push(job); continue; }
  const target = job.targets[0];
  const section = `${target.grade}-${target.subject}`;
  const entries = sections.get(section) ?? [];
  entries.push(job); sections.set(section, entries);
}
mkdirSync(directory, { recursive: true });
const manifest = [...sections].sort(([a], [b]) => a.localeCompare(b)).map(([section, jobs]) => {
  jobs.sort((a, b) => Number(b.targets.some(t => t.category === 'entry')) - Number(a.targets.some(t => t.category === 'entry')));
  const file = `${section}.json`;
  writeFileSync(resolve(directory, file), JSON.stringify(jobs.map(job => ({ texte: job.texte, language: 'ar', targets: job.targets })), null, 2) + '\n');
  return { section, file, texts: jobs.length, characters: jobs.reduce((sum, job) => sum + job.texte.length, 0) };
});
writeFileSync(resolve(directory, 'recitations-a-conserver.json'), JSON.stringify(held, null, 2) + '\n');
writeFileSync(resolve(directory, 'manifest.json'), JSON.stringify({ scope: 'Fixed authored 1AP/2AP speech; Quran quotations excluded from generic synthesis', v2Checked: true, reused: reused.length, held: held.length, sections: manifest }, null, 2) + '\n');
console.log(JSON.stringify({ reused: reused.length, held: held.length, sections: manifest }, null, 2));
