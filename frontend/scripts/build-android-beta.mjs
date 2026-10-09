import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { resolveV2ApiUrl } from './v2-environment.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  const env = { ...loadEnv('v2', root, 'VITE_'), ...process.env };
  if (!env.VITE_V2_SPRING_BOOT_URL) throw new Error('Set VITE_V2_SPRING_BOOT_URL to the separate HTTPS test backend');
  const api = new URL(resolveV2ApiUrl(env));
  if (api.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(api.hostname))
    throw new Error('The beta APK needs a public HTTPS test API; localhost points to the phone');
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), 'build', '--mode', 'v2'], {
    cwd: root, stdio: 'inherit', env: process.env,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(`Android beta blocked: ${error.message}`);
  process.exitCode = 1;
}
