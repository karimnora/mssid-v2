import { readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Same rule as src/utils/recordingUrl.ts: these clips are played from the public site in the
// Android app, so they must not weigh on the package sent to Google Play (200 MB limit).
const ON_DEMAND_RECORDING = /^course-cedar-[a-f0-9]+\.mp3$/;

/** Removes the on-demand course recordings from a built `dist` folder. Returns what was removed. */
export function removeOnDemandRecordings(distDir) {
  let files = 0;
  let bytes = 0;
  for (const language of ['ar', 'fr', 'en']) {
    const folder = join(distDir, 'sounds', 'preschool', language);
    let names = [];
    try { names = readdirSync(folder); } catch { continue; }
    for (const name of names) {
      if (!ON_DEMAND_RECORDING.test(name)) continue;
      const file = join(folder, name);
      bytes += statSync(file).size;
      rmSync(file);
      files += 1;
    }
  }
  return { files, bytes };
}
