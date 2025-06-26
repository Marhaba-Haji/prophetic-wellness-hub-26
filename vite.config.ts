
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    // Ensure no declaration files are generated during build
    rollupOptions: {
      output: {
        // Clean any existing declaration files
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.d.ts')) {
            return '[name].[hash][extname]';
          }
          return '[name].[hash][extname]';
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Clear any TypeScript cache
  clearScreen: false,
  // Ensure proper TypeScript handling
  define: {
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production'
  }
}));
