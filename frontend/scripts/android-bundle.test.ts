import { mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { removeOnDemandRecordings } from './android-bundle.mjs';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { isOnDemandRecording } from '../src/utils/recordingUrl';

let dist = '';
afterEach(() => { if (dist) rmSync(dist, { recursive: true, force: true }); });

describe('Android bundle', () => {
  it('removes only the on-demand course recordings from the built app', () => {
    dist = mkdtempSync(join(tmpdir(), 'mssid-dist-'));
    const folder = join(dist, 'sounds', 'preschool', 'ar');
    mkdirSync(folder, { recursive: true });
    for (const name of ['course-cedar-0a1b2c.mp3', 'course-cedar-ffee.mp3', 'reading-school-1.mp3', 'letter-alif.mp3']) {
      writeFileSync(join(folder, name), Buffer.alloc(2048));
    }
    const removed = removeOnDemandRecordings(dist);
    expect(removed).toEqual({ files: 2, bytes: 4096 });
    expect(readdirSync(folder).sort()).toEqual(['letter-alif.mp3', 'reading-school-1.mp3']);
  });

  it('plays from the site exactly the recordings the build removes', () => {
    // The two rules (build script and player) must agree, or a clip would be neither bundled nor fetched.
    const sources = Object.values(RECORDED_SPEECH_CATALOG).flatMap(language => Object.values(language).map(clip => clip.src));
    const removedByBuild = sources.filter(src => /\/sounds\/preschool\/(ar|fr|en)\/course-cedar-[a-f0-9]+\.mp3$/.test(src));
    expect(removedByBuild.length).toBeGreaterThan(3000);
    expect(removedByBuild.every(isOnDemandRecording)).toBe(true);
    expect(sources.filter(isOnDemandRecording)).toEqual(removedByBuild);
  });
});
