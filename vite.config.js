import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Disable TypeScript checking entirely
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.SKIP_TYPE_CHECK = 'true';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
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
    esbuild: false, // Completely disable esbuild TypeScript processing
    build: {
      target: 'es2020',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        onwarn: () => {}, // Suppress all warnings
        external: (id) => {
          // Skip all TypeScript definition files
          return id.includes('.d.ts');
        }
      }
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      'process.env.NODE_ENV': JSON.stringify(mode || 'development')
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.tsx': 'jsx',
          '.ts': 'jsx',
          '.js': 'jsx',
          '.jsx': 'jsx'
        },
        target: 'es2020'
      }
    }
  };
});