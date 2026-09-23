import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readAndroidVersion } from './scripts/android-release-config.mjs';
import { isPublicApiCacheUrl } from './src/utils/publicApiCache';

export default defineConfig(() => {
  return {
    define: readAndroidVersion(),
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'pwa-icon-source.svg'],
        // R2.3 — PWA manifest (content carried over from the previous static public/manifest.json,
        // now generated so it stays in sync with the real icon files produced by
        // `npx pwa-assets-generator`, see pwa-assets.config.ts).
        manifest: {
          short_name: 'مَسيد DZ',
          name: 'مَسيد DZ - منصة التعليم الابتدائي الجزائري',
          description: 'دروس وتمارين وأنشطة تفاعلية للأطفال من التحضيري إلى السنة الخامسة ابتدائي في الجزائر',
          start_url: '/',
          background_color: '#064e3b',
          theme_color: '#047857',
          display: 'standalone',
          orientation: 'portrait',
          dir: 'rtl',
          lang: 'ar',
          icons: [
            { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // Precaches every built JS/CSS/HTML/image asset (the app-shell + all lazy chunks —
          // course content is bundled into JS, not fetched as separate JSON at runtime, so this
          // alone is what makes "review a lesson offline" work).
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
          // Without this, every previous deploy's precache stays in storage forever once a new SW
          // activates — pure waste, and one more place a stale asset could theoretically still be
          // served from if a runtime-caching rule ever matched it by accident.
          cleanupOutdatedCaches: true,
          // Workbox's 2 MiB default is smaller than the main chunk (course data for all 5 grades
          // is still bundled eagerly — see the code-splitting notes in App.tsx). Phaser is split
          // into its own chunk (build.rollupOptions below); 8 MiB covers the remaining course
          // payload after Phaser 4 landed in the arcade games.
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              // Only the endpoints explicitly marked permitAll in SecurityConfig belong in a
              // URL-keyed cache. All account, admin, payment, AI and premium requests bypass the
              // service worker so responses cannot cross accounts on a shared device.
              urlPattern: ({ url }: { url: URL }) => isPublicApiCacheUrl(url),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'mssid-api-public-v2',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
            {
              // CacheFirst for external CDN illustration images (e.g. Unsplash URLs used in CMS
              // seed data) — these never change once published, no reason to ever re-fetch them.
              urlPattern: ({ url }: { url: URL }) => url.hostname === 'images.unsplash.com',
              handler: 'CacheFirst',
              options: {
                cacheName: 'mssid-external-images',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Phaser 4 is ~2 MiB minified. Without this it rides into index-*.js via
          // ChallengesArena → ArcadeGamesSection, and Workbox refuses to precache a 7+ MiB file.
          manualChunks: {
            phaser: ['phaser'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
