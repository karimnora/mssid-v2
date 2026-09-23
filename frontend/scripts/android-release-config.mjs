import { readFileSync } from 'node:fs';

export function readAndroidVersion(gradlePath = new URL('../android/app/build.gradle', import.meta.url)) {
  const gradle = readFileSync(gradlePath, 'utf8');
  const version = gradle.match(/^\s*versionName\s+"([^"]+)"/m)?.[1];
  const build = Number(gradle.match(/^\s*versionCode\s+(\d+)/m)?.[1]);
  if (!version || !Number.isInteger(build) || build < 1) throw new Error('Android versionName/versionCode missing in app/build.gradle.');
  return { __APP_VERSION__: JSON.stringify(version), __APP_BUILD__: String(build) };
}

export function validateAndroidRelease(env) {
  let url;
  try { url = new URL(env.VITE_SPRING_BOOT_URL || ''); }
  catch { throw new Error('VITE_SPRING_BOOT_URL must be the public HTTPS production API URL.'); }
  const host = url.hostname.toLowerCase();
  const local = !host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') ||
    host.endsWith('.internal') || host.endsWith('.lan') || host.startsWith('[') ||
    /^(127|0|10)\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (url.protocol !== 'https:' || local || url.username || url.password || url.search || url.hash) {
    throw new Error('Android release requires a public HTTPS API URL without credentials, query or fragment.');
  }
  if (!/^[\w-]+\.apps\.googleusercontent\.com$/.test(env.VITE_GOOGLE_CLIENT_ID || '')) {
    throw new Error('VITE_GOOGLE_CLIENT_ID must contain the Web OAuth client ID used by the backend.');
  }
}
