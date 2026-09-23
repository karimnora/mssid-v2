import { Capacitor } from '@capacitor/core';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=dz.mssid.app';

export function getAppPlatform(): 'android' | 'ios' | 'desktop' {
  if (Capacitor.isNativePlatform()) {
    return Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
  }
  const { userAgent, maxTouchPoints } = navigator;
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)) return 'ios';
  return /Android/i.test(userAgent) ? 'android' : 'desktop';
}

export function isInstalledWebApp(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function openGooglePlay(): void {
  // Capacitor delegates external HTTPS navigation to Android's ACTION_VIEW.
  // This URL also works in a browser when the Play Store cannot handle it.
  window.open(PLAY_STORE_URL, Capacitor.isNativePlatform() ? '_self' : '_blank', 'noopener,noreferrer');
}
