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
      babel: {
        plugins: []
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    // Skip all type checking
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        noEmit: true,
        jsx: 'react-jsx',
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true
      }
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      // Ensure proper module resolution
    }
  },
  define: {
    // Skip TypeScript checking in development
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
});