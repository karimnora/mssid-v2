import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Native Android integration still needs an installed APK/device. This exercises the shared UI.
export default defineConfig({ ...config, projects: [{ name: 'android-ui', use: {
  viewport: { width: 390, height: 844 }, hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36',
} }] });
