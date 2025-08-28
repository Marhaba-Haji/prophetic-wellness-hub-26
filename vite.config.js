import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Force completely bypass TypeScript
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.SKIP_TYPE_CHECK = 'true';

export default defineConfig(({ command, mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react({
        include: /\.(jsx|js|tsx|ts)$/,
        babel: {
          presets: [
            ["@babel/preset-react", { 
              runtime: "automatic",
              development: mode === 'development'
            }]
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
      },
    },
    esbuild: false,
    build: {
      target: 'es2020',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        onwarn: () => {},
      }
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      'process.env.NODE_ENV': JSON.stringify(mode || 'development'),
      'import.meta.env.DEV': JSON.stringify(mode === 'development'),
      'import.meta.env.PROD': JSON.stringify(mode === 'production'),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.SSR': 'false'
    },
    optimizeDeps: {
      exclude: ['@types/*', '**/*.d.ts']
    }
  };
});