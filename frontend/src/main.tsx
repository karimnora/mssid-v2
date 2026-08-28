import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Capacitor } from '@capacitor/core';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { DesignSystemShowcase } from './components/ui/DesignSystemShowcase.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const isShowcase = new URLSearchParams(window.location.search).has('ds-preview');

createRoot(document.getElementById('root')!).render(
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
