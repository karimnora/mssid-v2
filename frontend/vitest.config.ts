import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { readAndroidVersion } from './scripts/android-release-config.mjs';

export default defineConfig({
  // Public OAuth fixture: auth tests must not depend on an ignored local .env file.
  define: {
    ...readAndroidVersion(),
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('test-web-client.apps.googleusercontent.com'),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mon Application',
        short_name: 'App',
        description: 'Description de mon application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Conseil : Pointe vers './src' si tes alias posent problème
    },
  },
  test: {
    globals: true,
    // Keep local and deployment checks within the shared 8 GB memory budget.
    maxWorkers: 2,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright's E2E specs (e2e/*.spec.ts) match vitest's default *.spec.ts glob but use
    // @playwright/test's own test()/expect() runtime — must stay excluded, run separately via
    // `npm run test:e2e`.
    // Generated audit reproductions in build assert historical bugs, not release behavior.
    exclude: [...configDefaults.exclude, 'e2e/**', 'build/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
