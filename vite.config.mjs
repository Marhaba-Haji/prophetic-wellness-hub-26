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
    rollupOptions: {
      output: {
        manualChunks: {
          // Critical vendors - keep these small for faster FID
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI libraries - split into smaller chunks to reduce FID
          'radix-ui-core': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover'
          ],
          'radix-ui-forms': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group'
          ],
          
          // Heavy libraries - defer loading to reduce main thread blocking
          'heavy-libs': ['mapbox-gl'],
          'editor-libs': ['@tinymce/tinymce-react', 'react-quill'],
          'data-libs': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - small chunks for faster parsing
          'utils': ['clsx', 'tailwind-merge', 'nanoid'],
        },
        // Optimize chunk loading for better FID
        experimentalMinChunkSize: 15000,
      },
    },
    // Optimize chunk size for faster parsing and reduced FID
    chunkSizeWarningLimit: 400,
  },
  // Optimize dependencies for faster FID and prevent main thread blocking
  optimizeDeps: {
    include: [
      // Pre-bundle critical dependencies for faster startup
      'react',
      'react-dom',
      'react-router-dom',
      // Pre-bundle utilities to reduce runtime parsing
      'clsx',
      'tailwind-merge',
    ],
    exclude: [
      // Exclude heavy libraries to prevent main thread blocking during initial load
      'mapbox-gl',
      '@tinymce/tinymce-react',
      'react-quill',
    ],
  },
});