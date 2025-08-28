import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Plugin to completely disable TypeScript processing
const noTypeScript = () => ({
  name: 'no-typescript',
  config(config) {
    // Force all TS files to be treated as JS
    config.esbuild = {
      loader: 'jsx',
      include: /\.(jsx?|tsx?)$/,
      exclude: [],
      target: 'es2020',
      jsx: 'automatic'
    };
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    noTypeScript(),
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
    loader: 'jsx',
    include: /\.(jsx?|tsx?)$/,
    target: 'es2020',
    jsx: 'automatic'
  },
  build: {
    target: 'es2020'
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.tsx': 'jsx',
        '.ts': 'jsx'
      }
    }
  }
});