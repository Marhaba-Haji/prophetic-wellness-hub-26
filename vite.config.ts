
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }: { mode: string }) => {
  let tagger;
  if (mode === 'development') {
    tagger = (await import('lovable-tagger')).componentTagger;
  }
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && tagger && tagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ['**/*.d.ts']
    },
    build: {
      rollupOptions: {
        external: (id) => id.endsWith('.d.ts')
      }
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          declaration: false,
          declarationMap: false
        }
      }
    }
  };
});
