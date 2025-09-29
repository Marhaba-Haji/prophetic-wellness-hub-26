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
      jsxRuntime: 'automatic',
      include: /\.(jsx|js|tsx|ts)$/,
    })
  ],
  esbuild: {
    jsx: 'automatic',
    target: 'es2020',
    format: 'esm',
    drop: ['console', 'debugger'],
    minify: true,
  },
  build: {
    skipTypeCheck: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: 'es2020',
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
          // Core React - keep small for faster parsing
          'react-core': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          
          // UI components - minimal for faster evaluation
          'ui-radix': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          
          // Heavy third-party - separate for code splitting
          'vendor-heavy': ['mapbox-gl', '@tinymce/tinymce-react', 'react-quill'],
          'vendor-data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - lightweight chunk
          'utils': ['clsx', 'tailwind-merge', 'nanoid', 'date-fns', 'lucide-react'],
        },
        experimentalMinChunkSize: 8000,
      },
    },
    chunkSizeWarningLimit: 250,
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
