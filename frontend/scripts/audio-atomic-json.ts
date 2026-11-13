import { mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

/** Windows scanners can briefly lock the destination. Retry only the local rename, never the API. */
export function writeAudioJson(path: string, value: unknown, rename = renameSync, pause = () => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25)) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n');
  for (let attempt = 0; ; attempt++) {
    try { rename(temporary, path); return; } catch (error) {
      if (attempt >= 79 || !['EPERM', 'EACCES', 'EBUSY'].includes((error as NodeJS.ErrnoException).code ?? '')) throw error;
      pause();
    }
  }
}
