
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export function render(url: string, _manifest?: any) {
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

  // Extract helmet data after rendering
  const { helmet } = helmetContext as any;
  const head = helmet 
    ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
    : '';

  return { html, head };
}
