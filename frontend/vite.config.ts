import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
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
          description: 'تطبيق تعليمي تفاعلي وفق المنهاج الوزاري الجزائري مع معلم ذكي بالذكاء الاصطناعي وبدون إنترنت',
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
          // is still bundled eagerly — see the code-splitting notes in App.tsx). Raised with
          // headroom; the real fix is splitting course data out of the main chunk, tracked
          // separately since it touches badgeEngine.ts's synchronous dependency on it.
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              // R2.3 — NetworkFirst for auth + progress-sync: always prefer a live/fresh answer
              // (session validity, latest XP/badges), but degrade to the last-known cached
              // response instead of a hard failure when offline.
              urlPattern: ({ url }: { url: URL }) =>
                url.pathname.includes('/api/v1/auth/') || url.pathname.includes('/api/v1/users/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'mssid-api-auth-progress',
                networkTimeoutSeconds: 6,
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // SEC: role-gated paywalled content must never enter the Cache Storage — Workbox
              // caches are keyed purely by URL with no notion of cookies/session, so a StaleWhile-
              // Revalidate/CacheFirst entry here would let ANY subsequent visitor to the exact same
              // URL receive the cached PREMIUM/ADMIN response instantly, before the SW's background
              // revalidation even reaches the backend's @PreAuthorize check — silently defeating the
              // server-side gate for every visitor after the first. Must be listed before the general
              // '/api/v1/' rule below (Workbox matches runtimeCaching rules in array order, first
              // match wins).
              urlPattern: ({ url }: { url: URL }) =>
                url.pathname.startsWith('/api/v1/courses/premium-lessons/') ||
                /\/api\/v1\/exams\/\d+\/solutions$/.test(url.pathname),
              handler: 'NetworkOnly',
            },
            {
              // R2.3 — StaleWhileRevalidate for the rest of the Spring Boot REST API (public exam
              // lists, CMS content, etc.): serve instantly from cache while revalidating in the
              // background, so browsing stays fast and works offline once visited once.
              urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/api/v1/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'mssid-api-general',
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
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
