import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
      jsxRuntime: 'automatic'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  esbuild: {
    target: 'es2022',
    jsx: 'automatic'
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Critical path - minimal for TTI
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          
          // UI components - lazy loaded
          'ui-components': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          
          // Heavy libraries - deferred loading
          'vendor-heavy': ['mapbox-gl', '@tinymce/tinymce-react', 'react-quill'],
          'vendor-data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - small bundle for fast TTI
          'utils': ['clsx', 'tailwind-merge', 'lucide-react'],
        },
        experimentalMinChunkSize: 5000,
      },
    },
    chunkSizeWarningLimit: 200,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'clsx',
      'tailwind-merge',
    ],
    exclude: [
      'mapbox-gl',
      '@tinymce/tinymce-react',
      'react-quill',
    ],
  },
});