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
      include: /\.(jsx|js|tsx|ts)$/,
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
  esbuild: {
    target: "esnext",
    jsx: "automatic",
    jsxImportSource: "react"
  },
  build: {
    target: 'esnext',
    sourcemap: false
  }
});