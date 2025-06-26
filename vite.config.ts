
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
    rollupOptions: {
      output: {
        // Prevent any declaration file generation
        preserveModules: false,
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Disable TypeScript declaration generation
    tsconfigRaw: {
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        emitDeclarationOnly: false,
      }
    }
  },
  // Clear TypeScript cache and ensure clean builds
  clearScreen: false,
  // Ensure proper environment variable handling
  define: {
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production'
  },
  // Force clean builds and ignore cached files
  optimizeDeps: {
    force: true,
    // Exclude problematic files from pre-bundling
    exclude: ['**/*.d.ts']
  }
}));
