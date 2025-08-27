import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { configDefaults } from 'vitest/config';

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
    target: 'es2020',
    minify: false,
    rollupOptions: {
      // Skip TypeScript checking during build
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    // Skip type checking
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        allowJs: true,
        checkJs: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [...configDefaults.exclude, 'e2e/*']
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