import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions: {
      onwarn: () => {},
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic'
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-quill', 'quill'],
    force: true
  }
});