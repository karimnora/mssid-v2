import { Capacitor } from '@capacitor/core';

/**
 * The thousands of course and story recordings ("course-cedar-<hash>.mp3", ~166 MB) are not bundled in
 * the Android app: with them it would exceed Google Play's 200 MB download limit. The web app already
 * fetches them on demand; the Android app does the same from the public site. The file names are
 * content hashes, so a clip on the site is always the one the app expects.
 */
const PUBLIC_SITE = (
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PUBLIC_SITE_URL) || 'https://mssid-dz.com'
).replace(/\/+$/, '');
const ON_DEMAND_RECORDING = /^\/sounds\/preschool\/(ar|fr|en)\/course-cedar-[a-f0-9]+\.mp3$/;

export const isOnDemandRecording = (src: string) => ON_DEMAND_RECORDING.test(src);

export function resolveRecordingUrl(src: string, native = Capacitor.isNativePlatform()): string {
  return native && isOnDemandRecording(src) ? `${PUBLIC_SITE}${src}` : src;
}
