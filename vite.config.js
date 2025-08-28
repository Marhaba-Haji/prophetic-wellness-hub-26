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
      include: ["**/*.{jsx,js}"],
      exclude: ["node_modules/**", "**/*.{tsx,ts}", "**/*.d.ts", "**/*.test.*"],
      babel: {
        presets: [
          ["@babel/preset-env", { targets: "defaults" }],
          ["@babel/preset-react", { runtime: "automatic" }]
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    esbuildOptions: {
      target: "es2020",
      jsx: "automatic",
    },
  },
  esbuild: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
    global: "globalThis",
  },
  build: {
    target: 'es2020',
    sourcemap: false
  }
});