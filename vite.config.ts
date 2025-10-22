import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Fixed port
    strictPort: false, // Allow fallback if port is busy
  },
  plugins: [
    react(),
    // Generate gzip compressed files
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),
    // Generate brotli compressed files
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Bundle analyzer
    visualizer({
      open: false, // Don't auto-open
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }) as any,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Chart library (largest dependency)
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            // Icon library
            if (id.includes('lucide-react')) {
              return 'icon-vendor';
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            // Utilities
            if (id.includes('clsx')) {
              return 'utils-vendor';
            }
          }
          
          // Split large page components
          if (id.includes('/pages/Dashboard')) {
            return 'page-dashboard';
          }
          if (id.includes('/pages/Warehouses')) {
            return 'page-warehouses';
          }
          if (id.includes('/pages/Inventory')) {
            return 'page-inventory';
          }
          if (id.includes('/pages/Orders')) {
            return 'page-orders';
          }
          if (id.includes('/pages/Customers')) {
            return 'page-customers';
          }
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
    },
    // Source map for production debugging (optional)
    sourcemap: false,
  },
})
