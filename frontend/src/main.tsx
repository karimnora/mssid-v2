import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { DesignSystemShowcase } from './components/ui/DesignSystemShowcase.tsx';
import './index.css';

const isShowcase = new URLSearchParams(window.location.search).has('ds-preview');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LocaleProvider>
        <AuthProvider>
          {isShowcase ? <DesignSystemShowcase /> : <App />}
        </AuthProvider>
      </LocaleProvider>
    </HelmetProvider>
  </StrictMode>,
);
