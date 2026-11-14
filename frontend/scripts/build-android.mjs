import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { validateAndroidRelease } from './android-release-config.mjs';
import { removeOnDemandRecordings } from './android-bundle.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
try {
  validateAndroidRelease({ ...loadEnv('production', root, 'VITE_'), ...process.env });
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), 'build'], {
    cwd: root, stdio: 'inherit', env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else {
    const removed = removeOnDemandRecordings(fileURLToPath(new URL('../dist/', import.meta.url)));
    console.log(`Android bundle: ${removed.files} course recordings (${(removed.bytes / 1048576).toFixed(1)} MB) left on the site, played on demand.`);
    process.exitCode = 0;
  }
} catch (error) {
  console.error(`Android release blocked: ${error.message}`);
  process.exitCode = 1;
}
