
import { build } from 'vite';
import fs from 'fs/promises';

// Build client
await build({
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: './src/entry-client.tsx'
    }
  }
});

// Build server
await build({
  build: {
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: {
      input: './src/entry-server.tsx',
      output: {
        format: 'es'
      }
    }
  }
});

console.log('SSR build completed successfully!');
