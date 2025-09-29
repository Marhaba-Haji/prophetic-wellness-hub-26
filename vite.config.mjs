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
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: 'es2015',
    sourcemap: false,
    // Code splitting and tree shaking to reduce unused JavaScript
    rollupOptions: {
      output: {
        // Content-based hashing for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Critical app code - minimal chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          
          // UI components - split for better tree shaking
          'ui-core': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs'
          ],
          
          // Heavy libraries - lazy load these
          'maps': ['mapbox-gl'],
          'rich-text': ['@tinymce/tinymce-react', 'react-quill'],
          'data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - keep small and cacheable
          'utils': ['clsx', 'tailwind-merge', 'nanoid', 'date-fns'],
        },
        // Aggressive chunk size limits to reduce unused code
        experimentalMinChunkSize: 10000,
      },
    },
    // Reduce chunk size warning limit for better optimization
    chunkSizeWarningLimit: 300,
  },
  // Optimize dependencies to reduce unused JavaScript
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'clsx',
      'tailwind-merge',
    ],
    exclude: [
      // Exclude heavy libraries to prevent bundling unused code
      'mapbox-gl',
      '@tinymce/tinymce-react',
      'react-quill',
      '@supabase/supabase-js',
    ],
  },
});