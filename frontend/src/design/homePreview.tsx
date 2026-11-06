import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/700.css';
import '@fontsource/cairo/900.css';
import { DidouHomePreview } from './DidouHomePreview';

createRoot(document.getElementById('root')!).render(<React.StrictMode><DidouHomePreview /></React.StrictMode>);
