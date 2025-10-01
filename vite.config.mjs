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
        manualChunks: (id) => {
          // Critical path - minimal initial bundle for fastest TTI
          if (id.includes('node_modules')) {
            // React essentials - keep together for optimal caching
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-core';
            }
            
            // Router - needed for navigation but can be split
            if (id.includes('react-router')) {
              return 'router';
            }
            
            // Query library - defer until needed
            if (id.includes('@tanstack/react-query') || id.includes('@tanstack/query-core')) {
              return 'vendor-query';
            }
            
            // Supabase - defer until data fetching
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            
            // Heavy editor libraries - defer completely
            if (id.includes('tinymce') || id.includes('react-quill') || id.includes('quill')) {
              return 'vendor-editor';
            }
            
            // Map library - defer until needed
            if (id.includes('mapbox')) {
              return 'vendor-map';
            }
            
            // Radix UI - split by category for granular loading
            if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-alert-dialog')) {
              return 'ui-dialog';
            }
            if (id.includes('@radix-ui/react-dropdown') || id.includes('@radix-ui/react-popover')) {
              return 'ui-dropdown';
            }
            if (id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-checkbox')) {
              return 'ui-forms';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-misc';
            }
            
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'vendor-forms';
            }
            
            // Icons and utilities - keep small
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            
            // All other vendor code
            return 'vendor-misc';
          }
          
          // Split app code by route/feature
          if (id.includes('/pages/admin/')) {
            return 'route-admin';
          }
          if (id.includes('/pages/Blog') || id.includes('/pages/blog/')) {
            return 'route-blog';
          }
          if (id.includes('/pages/Booking')) {
            return 'route-booking';
          }
          if (id.includes('/pages/')) {
            return 'route-pages';
          }
          
          // UI components
          if (id.includes('/components/ui/')) {
            return 'ui-app';
          }
        },
        // Smaller chunks load and parse faster
        experimentalMinChunkSize: 3000,
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