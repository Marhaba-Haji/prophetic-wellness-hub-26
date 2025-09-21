import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import simpleJsonServer from 'vite-plugin-simple-json-server';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    simpleJsonServer({
      handler: './api/capture-payment.js',
      url: '/api/capture-payment',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(new URL('.', import.meta.url).pathname, 'src'),
    },
  },
});