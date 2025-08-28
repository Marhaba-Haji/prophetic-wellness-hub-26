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
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic'
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      external: [],
      onwarn: () => {}
    }
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  clearScreen: false
});