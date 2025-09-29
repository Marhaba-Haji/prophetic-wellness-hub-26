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
          // Critical vendors - keep these small for faster FID
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI libraries - split into smaller chunks
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
          'radix-ui-navigation': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-navigation-menu'
          ],
          
          // Heavy libraries - defer loading
          'heavy-libs': ['mapbox-gl'],
          'editor-libs': ['@tinymce/tinymce-react', 'react-quill'],
          'data-libs': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Utilities - small chunks
          'date-utils': ['date-fns'],
          'misc-utils': ['nanoid', 'clsx', 'tailwind-merge'],
        },
        // Optimize chunk loading for better FID
        experimentalMinChunkSize: 20000,
      },
    },
    // Optimize chunk size for faster parsing
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies for faster FID
  optimizeDeps: {
    include: [
      // Pre-bundle critical dependencies for faster startup
      'react',
      'react-dom',
      'react-router-dom',
    ],
    exclude: [
      // Exclude heavy libraries from pre-bundling to reduce initial parse time
      'mapbox-gl',
      '@tinymce/tinymce-react',
      'react-quill',
    ],
  },
});