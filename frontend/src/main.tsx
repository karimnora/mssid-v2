import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </HelmetProvider>
  </StrictMode>,
);
