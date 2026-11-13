/** Offline tools only: shared cost-saving check before any new voice generation. */
import { createHash } from 'node:crypto';
import { constants, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
export type LibraryClip = { texte: string; spokenText?: string; fichier: string; duration: number; sha256: string; voice?: string; model?: string; [field: string]: unknown };
export type ExistingRecording = { language: string; clip: LibraryClip; path: string };
const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
export function discoverV2Root(root: string): string {
  const configured = process.env.MSSID_V2_ROOT;
  if (configured && existsSync(resolve(configured, 'docs/audio-v1'))) return resolve(configured);
  const worktrees = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: root, encoding: 'utf8' });
  for (const block of worktrees.split(/\r?\n\r?\n/)) {
    if (!/^branch refs\/heads\/v2\r?$/m.test(block)) continue;
    const path = block.match(/^worktree (.+)\r?$/m)?.[1].trim();
    if (path && existsSync(resolve(path, 'docs/audio-v1'))) return resolve(path);
  }
  throw new Error('V2 audio library unavailable: generation must wait until its existing recordings can be checked.');
}
export function loadRecordingLibrary(root: string) {
  const entries = new Map<string, ExistingRecording[]>();
  for (const file of readdirSync(resolve(root, 'docs/audio-v1')).filter(file => /^enregistrements-.*\.json$/.test(file)).sort()) {
    const metadata = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1', file), 'utf8'));
    for (const language of ['ar', 'fr', 'en']) for (const clip of metadata[language]?.clips ?? [] as LibraryClip[]) {
      const directory = resolve(root, 'frontend/public/sounds/preschool', language);
      const path = resolve(directory, clip.fichier);
      if (!path.startsWith(`${directory}${sep}`)) throw new Error('Invalid recording path in source metadata');
      for (const text of [clip.texte, ...(clip.spokenText ? [clip.spokenText] : [])]) {
        const key = `${language}:${recordedSpeechKey(text)}`;
        const candidates = entries.get(key) ?? [];
        candidates.push({ language, clip, path }); entries.set(key, candidates);
      }
    }
  }
  const verified = new Set<string>();
  return {
    textCount: entries.size,
    find(text: string, language: string, voice?: string): ExistingRecording | undefined {
      const code = language.split('-')[0];
      const recording = entries.get(`${code}:${recordedSpeechKey(text)}`)?.find(candidate => !voice || candidate.clip.voice === voice);
      if (!recording) return undefined;
      const { clip, path } = recording;
      if (!verified.has(path)) {
        if (!(clip.duration > 0) || !existsSync(path) || hash(path) !== clip.sha256) throw new Error(`V2 source failed integrity check: ${clip.fichier}`);
        verified.add(path);
      }
      return recording;
    },
  };
}
export function importV2Recording(destinationRoot: string, recording: ExistingRecording) {
  if (!['ar', 'fr', 'en'].includes(recording.language) || hash(recording.path) !== recording.clip.sha256) throw new Error('Invalid source for reuse');
  const directory = resolve(destinationRoot, 'frontend/public/sounds/preschool', recording.language);
  const destination = resolve(directory, recording.clip.fichier);
  if (!destination.startsWith(`${directory}${sep}`)) throw new Error('Invalid destination recording path');
  mkdirSync(directory, { recursive: true });
  if (existsSync(destination)) {
    if (hash(destination) !== recording.clip.sha256) throw new Error('Existing V1 recording differs; refusing overwrite');
  } else copyFileSync(recording.path, destination, constants.COPYFILE_EXCL);
  const path = resolve(destinationRoot, 'docs/audio-v1/enregistrements-reutilises-v2.json');
  const metadata = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
  metadata[recording.language] ??= { clips: [] };
  const clips: LibraryClip[] = metadata[recording.language].clips;
  if (!clips.some(clip => clip.fichier === recording.clip.fichier && recordedSpeechKey(clip.texte) === recordedSpeechKey(recording.clip.texte))) {
    clips.push({ ...recording.clip, reusedFrom: 'v2', reusedAt: new Date().toISOString() });
    mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, JSON.stringify(metadata, null, 2) + '\n');
  }
}
