import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readAndroidVersion, validateAndroidRelease } from './android-release-config.mjs';

const valid = { VITE_SPRING_BOOT_URL: 'https://mssid-backend.onrender.com/api', VITE_GOOGLE_CLIENT_ID: 'test-web.apps.googleusercontent.com' };
describe('Android release configuration', () => {
  it('accepts the public HTTPS backend with a Google client', () => expect(() => validateAndroidRelease(valid)).not.toThrow());
  it.each(['', 'http://api.example.com/api', 'https://localhost/api', 'https://10.0.2.2/api', 'https://127.0.0.1/api', 'https://192.168.1.5/api', 'https://172.16.0.2/api', 'https://[::1]/api', 'https://server.local/api', 'https://user:password@api.example.com/api'])('rejects unsafe release API URL %s', (url) => {
    expect(() => validateAndroidRelease({ ...valid, VITE_SPRING_BOOT_URL: url })).toThrow();
  });
  it.each(['', 'not-a-google-client'])('rejects missing or malformed Google configuration %s', (id) => {
    expect(() => validateAndroidRelease({ ...valid, VITE_GOOGLE_CLIENT_ID: id })).toThrow();
  });
  it('reads the displayed version from the Android build', () => {
    const version = readAndroidVersion(pathToFileURL(path.resolve('android/app/build.gradle')));
    expect(JSON.parse(version.__APP_VERSION__)).toMatch(/^\d+\.\d+\.\d+$/);
    expect(Number(version.__APP_BUILD__)).toBeGreaterThan(0);
  });
});
