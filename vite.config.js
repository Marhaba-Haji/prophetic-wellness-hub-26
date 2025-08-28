import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      include: /\.(jsx|js)$/,
      exclude: /\.(tsx|ts|d\.ts)$/,
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  esbuild: false,
  build: {
    target: 'esnext',
    sourcemap: false
  }
});