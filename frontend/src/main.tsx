import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Capacitor } from '@capacitor/core';
import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { DesignSystemShowcase } from './components/ui/DesignSystemShowcase.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Sentry (Phase 190): optional, same "no env var = fully off" shape as VITE_SPRING_BOOT_URL —
// stays a no-op SDK if VITE_SENTRY_DSN isn't set (see frontend/.env.example). tracesSampleRate
// stays 0: this is for error capture, not performance tracing, to keep the free event quota for
// what actually matters. sendDefaultPii stays false (default) — no user email/name is attached,
// see privacy.html §4 for what Sentry is told about a visitor.
const sentryDsn =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SENTRY_DSN) || '';
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: Capacitor.isNativePlatform() ? 'android' : 'web',
    tracesSampleRate: 0,
    // Noise from scripts other apps inject into our page, not from our code: Facebook/Instagram's
    // in-app browser (iabjs://, window._META), Googlebot's renderer (wrsParams), and the browser
    // refusing service-worker registration (private mode/full storage — the app works without it).
    ignoreErrors: [
      'Java object is gone',
      /_META\.IAB/,
      /wrsParams/,
      /Failed to register a ServiceWorker/,
    ],
    denyUrls: [/^iabjs:\/\//],
    beforeSend(event) {
      const frames = (event.exception?.values ?? []).flatMap((v) => v.stacktrace?.frames ?? []);
      const isInjected = frames.some(
        (f) => (f.filename ?? '').startsWith('iabjs://') || (f.function ?? '').includes('wrsParams'),
      );
      return isInjected ? null : event;
    },
  });
}

// After a deploy, a tab still open on the previous version asks for lazy chunks whose hashed
// filenames no longer exist ("Failed to fetch dynamically imported module"). Vite fires
// vite:preloadError for that — reload once to pick up the new build. The timestamp guard stops a
// reload loop if the chunk is genuinely unreachable (offline, real outage). Web only: the native
// app bundles its chunks locally, so this situation can't arise there.
const CHUNK_RELOAD_KEY = 'mssid-chunk-reload-at';
if (!Capacitor.isNativePlatform()) {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const last = Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
      if (Date.now() - last < 30_000) return; // already reloaded recently: let the error surface
      window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
    } catch {
      return; // no sessionStorage → can't guard against a loop, so don't auto-reload
    }
    event.preventDefault();
    window.location.reload();
  });
}

const isShowcase = new URLSearchParams(window.location.search).has('ds-preview');

const renderApp = () => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <LocaleProvider>
          <AuthProvider>
            {isShowcase ? <DesignSystemShowcase /> : <App />}
          </AuthProvider>
        </LocaleProvider>
      </HelmetProvider>
      {/* Aggregate visit counts only (Vercel Analytics). Auth cookies are separate HttpOnly
          session cookies set by the Spring API — see privacy.html §2–3. Web only: gated off
          in the native app so the Android Data Safety form's "no analytics SDK" answer stays true. */}
      {!Capacitor.isNativePlatform() && <Analytics />}
    </ErrorBoundary>
  </StrictMode>,
);

// Older service workers cached private API responses by URL, without partitioning by account.
// Remove both legacy caches before AuthProvider asks who is signed in on shared devices.
async function startApp() {
  if ('caches' in window) {
    try {
      await Promise.all([
        window.caches.delete('mssid-api-auth-progress'),
        window.caches.delete('mssid-api-general'),
      ]);
    } catch {
      // Cache storage can be unavailable in private mode; the app still starts normally.
    }
  }
  renderApp();
}

void startApp();
