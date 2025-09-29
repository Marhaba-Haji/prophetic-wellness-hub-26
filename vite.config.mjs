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
  build: {
    target: 'es2015',
    sourcemap: false,
    // Optimize for better caching with content-based hashing
    rollupOptions: {
      output: {
        // Enable content-based hashing for long-term caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Critical vendors - stable chunks for better caching
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI libraries - split for better cache efficiency
          'radix-ui': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox'
          ],
          
          // Heavy libraries - separate chunks for better caching
          'heavy-libs': ['mapbox-gl'],
          'editor-libs': ['@tinymce/tinymce-react', 'react-quill'],
          'data-libs': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - stable chunk for better caching
          'utils': ['clsx', 'tailwind-merge', 'nanoid'],
        },
        // Optimize chunk loading
        experimentalMinChunkSize: 15000,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 400,
  },
  // Optimize dependencies
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