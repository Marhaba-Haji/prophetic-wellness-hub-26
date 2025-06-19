
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export function render(url: string, _manifest?: any) {
  // Use a consistent empty object for helmet context
  const helmetContext = {};
  
  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  // Don't extract helmet data to avoid hydration mismatches
  // The client will handle the helmet updates
  return { html, head: '' };
}
