
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Ensure consistent hydration by suppressing hydration warnings during development
const helmetContext = {};

hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
