import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  define: {
    global: 'globalThis',
  },
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      exclude: /node_modules/,
      jsxRuntime: 'automatic'
    }), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src'
    },
    dedupe: ['react', 'react-dom'],
    conditions: ['import', 'module', 'browser', 'default']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Keep React as a single chunk to prevent loading issues
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router-dom')) {
              return 'react-router';
            }
            // Large libraries
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-utils';
            }
            if (id.includes('react-syntax-highlighter')) {
              return 'syntax-highlighting';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'markdown';
            }
            if (id.includes('react-hot-toast') || id.includes('react-icons') || id.includes('@heroicons/react')) {
              return 'ui-libs';
            }
            if (id.includes('@vercel/')) {
              return 'vercel-utils';
            }
            // Default vendor chunk
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800, // Lower warning limit to catch issues earlier
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020', 'chrome80', 'safari13'],
    cssCodeSplit: true,
    assetsInlineLimit: 2048 // Reduce inline limit to decrease bundle size
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'https://mockmate-backend-r0jk.onrender.com', // Local backend on port 8000
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
})
