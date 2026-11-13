import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { importV2Recording, loadRecordingLibrary } from './v2-recording-library';
const created: string[] = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'mssid-v2-audio-')); created.push(root);
  mkdirSync(join(root, 'docs/audio-v1'), { recursive: true });
  mkdirSync(join(root, 'frontend/public/sounds/preschool/ar'), { recursive: true });
  const bytes = Buffer.from('fixture for hash and no-overwrite checks');
  writeFileSync(join(root, 'frontend/public/sounds/preschool/ar/clip.mp3'), bytes);
  writeFileSync(join(root, 'docs/audio-v1/enregistrements-test.json'), JSON.stringify({ ar: { clips: [{ texte: 'كِتَاب', fichier: 'clip.mp3', duration: 1, sha256: createHash('sha256').update(bytes).digest('hex'), voice: 'cedar' }] } }));
  return root;
}
afterEach(() => {
  for (const root of created.splice(0)) {
    if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('mssid-v2-audio-')) throw new Error('Invalid fixture cleanup path');
    rmSync(root, { recursive: true, force: true });
  }
});
describe('V2 reuse before paid generation', () => {
  it('also reuses an explicitly recorded symbol name without guessing other vowels', () => {
    const root = fixture();
    const path = join(root, 'docs/audio-v1/enregistrements-test.json');
    const metadata = JSON.parse(readFileSync(path, 'utf8'));
    metadata.ar.clips[0].texte = 'ً';
    metadata.ar.clips[0].spokenText = 'تَنْوِينُ الفَتْحِ';
    writeFileSync(path, JSON.stringify(metadata));
    const library = loadRecordingLibrary(root);
    expect(library.find('ً', 'ar', 'cedar')?.path).toBe(library.find('تَنْوِينُ الفَتْحِ', 'ar', 'cedar')?.path);
    expect(library.find('تَنْوِينُ الفَتْحُ', 'ar', 'cedar')).toBeUndefined();
  });
  it('reuses whitespace and visual-stretch variants but never guesses a different vowel or language', () => {
    const library = loadRecordingLibrary(fixture());
    expect(library.find('  كِتَـاب  ', 'ar-SA', 'cedar')).toBeDefined();
    expect(library.find('كِتَاب', 'fr-FR', 'cedar')).toBeUndefined();
    expect(library.find('كُتَاب', 'ar-SA', 'cedar')).toBeUndefined();
    expect(library.find('كِتَاب', 'ar-SA', 'nova')).toBeUndefined();
  });
  it('blocks reuse of corrupted files instead of silently paying to replace them', () => {
    const root = fixture(); const library = loadRecordingLibrary(root);
    writeFileSync(join(root, 'frontend/public/sounds/preschool/ar/clip.mp3'), 'corrupted');
    expect(() => library.find('كِتَاب', 'ar')).toThrow(/integrity/);
  });
  it('imports a verified file once and preserves an existing different V1 recording', () => {
    const library = loadRecordingLibrary(fixture()); const destination = fixture();
    const clip = library.find('كِتَاب', 'ar', 'cedar')!;
    importV2Recording(destination, clip); importV2Recording(destination, clip);
    const metadata = JSON.parse(readFileSync(join(destination, 'docs/audio-v1/enregistrements-reutilises-v2.json'), 'utf8'));
    expect(metadata.ar.clips).toHaveLength(1);
    writeFileSync(join(destination, 'frontend/public/sounds/preschool/ar/clip.mp3'), 'existing different V1 recording');
    expect(() => importV2Recording(destination, clip)).toThrow(/overwrite/);
    expect(readFileSync(join(destination, 'frontend/public/sounds/preschool/ar/clip.mp3'), 'utf8')).toBe('existing different V1 recording');
  });
  it('rejects paths escaping the audio directory', () => {
    const root = fixture();
    writeFileSync(join(root, 'docs/audio-v1/enregistrements-bad.json'), JSON.stringify({ ar: { clips: [{ texte: 'x', fichier: '../../secret', duration: 1 }] } }));
    expect(() => loadRecordingLibrary(root)).toThrow(/path/);
  });
});
