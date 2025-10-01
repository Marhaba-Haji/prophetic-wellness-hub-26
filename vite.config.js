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
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  define: {
    global: "globalThis",
  },
  esbuild: false,
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react',
    ],
  },
});